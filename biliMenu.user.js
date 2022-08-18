// ==UserScript==
// @name        bilibili 菜单 格式化
// @description  用来复制合集的菜单，做笔记用的
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/*
// @version     1.0
// @author      zqbinary
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_notification
// @icon         https://raw.githubusercontent.com/zqbinary/icons/53cb0c68ee5fbd05a1719e52b4e544ed5e9f5341/menu_format.png
// ==/UserScript==
(function () {

    let listArray=[]
    let listValue = ''
    let duration=0

    function getLessonList() {
        const listSelect = '.list-box a'
        const listsDom = document.querySelectorAll(listSelect);
        let res = [];
        for (let i = 0; i < listsDom.length; i++) {
            const item = listsDom[i]
            const lesson = {};
            lesson.title = item.title;
            lesson.p = item.querySelector('.page-num').innerText;
            lesson.duration = item.querySelector('.duration').innerText;
            duration += parseInt(lesson.duration)
            lesson.url = item.href
            if (!item.href.includes('http')) {
                lesson.url = 'https://www.bilibili.com/' + lesson.href
            }
            res.push(lesson);
        }
        return res;
    }

    function getLessonListV2() {
        const listSelect = '.video-episode-card__info'
        const listsDom = document.querySelectorAll(listSelect);
        let res = [];
        const headerDom = document.querySelector('div.video-sections-head_first-line > div.first-line-left > a')
        if(!headerDom) {
            return res
        }
        res.push({
            title:headerDom.title,
            p:'',
            duration:0,
            url:headerDom.href
        })
        for (let i = 0; i < listsDom.length; i++) {
            const item = listsDom[i]
            const lesson = {};
            lesson.title = item.querySelector('.video-episode-card__info-title').title;
            lesson.p = '';
            lesson.duration = item.querySelector('.video-episode-card__info-duration').innerText;
            duration += parseInt(lesson.duration)
            lesson.url = ''
            res.push(lesson);
        }
        return res;
    }

    function formatDuration() {
        let text=''
        let hour = duration/60;
        if(hour>1) {
            text=parseInt(hour)+'h'+ duration%60+'min'
        } else {
            text=duration
        }
        return text;
    }

    function makeLessonDoms() {
        let parent = document.createElement('div');
        for (let item of listArray) {
            let itemDom = document.createElement('a')
            itemDom.href = item.url
            let tmp = ''
            if(item.p) {
                tmp += `[${item.p}]`
            }
            itemDom.innerText =tmp +`${item.title}  (${item.duration})`
			parent.appendChild(itemDom);
            parent.appendChild(document.createElement('br'));
            parent.appendChild(document.createElement('br'));
        }
        listValue=parent.innerHTML;
    }

    function makeLessons() {
        duration=0
        listArray = getLessonList()
        //取合集
        if(!listArray.length){
            listArray = getLessonListV2()
        }
        makeLessonDoms()
    }

    function copyMenu() {
        makeLessons()
        GM_setClipboard(listValue)
        copySuccessMsg()
    }

    function copyMenuHtml() {
        makeLessons()
        GM_setClipboard(listValue, 'html')
        copySuccessMsg()
    }

    function copySuccessMsg(){
        const notificationDetails = {
            title: '复制成功',
            text: `共有 ${listArray.length}视频，时长为${formatDuration()}`,
            timeout: 3000,
        };

        GM_notification(notificationDetails);
    }
    GM_registerMenuCommand(`【复制菜单文本】`, copyMenu)
    GM_registerMenuCommand(`【复制菜单富文本】`, copyMenuHtml)

})()
