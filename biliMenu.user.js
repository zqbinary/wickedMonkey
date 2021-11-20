// ==UserScript==
// @name        bilibili 菜单 格式化
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/*
// @require  https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant GM_setClipboard
// @version     1.0
// @author      -
// @description 2021/11/5 下午2:21:51
// ==/UserScript==
(function () {


    let listValue = ''

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
            lesson.url = item.href
            if (!item.href.includes('http')) {
                lesson.url = 'https://www.bilibili.com/' + lesson.href
            }
            res.push(lesson);
        }
        return res;
    }

    function makeLessonDoms(lists) {
        let parent = document.createElement('div');
        for (let item of lists) {
            let itemDom = document.createElement('a')
            itemDom.href = item.url
            itemDom.innerText = `[${item.p}]${item.title}  (${item.duration})`
            parent.appendChild(itemDom);
            parent.appendChild(document.createElement('br'));
            parent.appendChild(document.createElement('br'));
        }
        // document.body.appendChild(parent);
        listValue = parent.innerHTML;
    }

    function cp() {
        GM_setClipboard(listValue)
    }

    function cp2() {
        GM_setClipboard(listValue, 'html')
    }

    function handleBui() {
        const check = document.querySelector('.bui-switch-input');
        check.click();
    }
    function register() {

        const btn = document.createElement('button')
        btn.innerHTML = 'c:t/dc:h'
        btn.addEventListener('click', () => {
            const lists = getLessonList()
            makeLessonDoms(lists)
            cp()
        })
        btn.addEventListener('dblclick', () => {
            const lists = getLessonList()
            makeLessonDoms(lists)
            cp2()
        })
        document.querySelector('.head-right').insertBefore(btn, document.querySelector('.next-button'))

        window.addEventListener('keydown', (e) => {
            if (e.code === 'F4') {
                handleBui();
            }
        }, true)
    }
    onload = function () {
        setTimeout(register, 1000)

    }
})()
