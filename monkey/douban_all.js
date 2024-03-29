// ==UserScript==
// @name         豆瓣电影资源
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  bd-file,btdad,imdb 分级
// @author       zqbinary
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @connect        *
// @match        https://movie.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_notification
// @run-at         document-end
// ==/UserScript==

(function () {
    'use strict';

    /*
     * 一些加密代码 给 bd-movie
     */
    class bdMovieSecret {

        static utf8ToUtf16(s) {
            if (!s) {
                return;
            }
            var i, codes, bytes, ret = [],
                len = s.length;
            for (i = 0; i < len; i++) {
                codes = [];
                codes.push(s.charCodeAt(i));
                if (((codes[0] >> 7) & 0xff) == 0x0) {
                    // 单字节 0xxxxxxx
                    ret.push(s.charAt(i));
                } else if (((codes[0] >> 5) & 0xff) == 0x6) {
                    // 双字节 110xxxxx 10xxxxxx
                    codes.push(s.charCodeAt(++i));
                    bytes = [];
                    bytes.push(codes[0] & 0x1f);
                    bytes.push(codes[1] & 0x3f);
                    ret.push(String.fromCharCode((bytes[0] << 6) | bytes[1]));
                } else if (((codes[0] >> 4) & 0xff) == 0xe) {
                    // 三字节 1110xxxx 10xxxxxx 10xxxxxx
                    codes.push(s.charCodeAt(++i));
                    codes.push(s.charCodeAt(++i));
                    bytes = [];
                    bytes.push((codes[0] << 4) | ((codes[1] >> 2) & 0xf));
                    bytes.push(((codes[1] & 0x3) << 6) | (codes[2] & 0x3f));
                    ret.push(String.fromCharCode((bytes[0] << 8) | bytes[1]));
                }
            }
            return ret.join('');
        }

        static decode64(input) {
            const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            if (input.length % 4 != 0) {
                return "";
            }
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                return "";
            }

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output += String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output += String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }

    }

// 缓存相关方法
    function CacheStorage(name, expire = null) {
        let now = Date.now();
        let cache_name = "drdm_cache_" + (name ? name : 'default');

        if (localStorage[cache_name + "_exp"]) {
            if (now > localStorage[cache_name + "_exp"]) {
                localStorage.removeItem(cache_name);
            }
        }

        let cache = localStorage[cache_name] ? JSON.parse(localStorage[cache_name]) : {};
        localStorage.setItem(cache_name + "_exp", now + expire);

        return {
            flush: function () {
                localStorage.setItem(cache_name, JSON.stringify(cache));
            },

            add: function (name, value) {
                cache[name] = value;
                this.flush();
            },

            del: function (name) {
                if (name) {
                    delete cache[name];
                    this.flush;
                } else {
                    localStorage.removeItem(cache_name);
                }
            },

            get: function (name, def = null) {
                if (name) {
                    return cache[name] ? cache[name] : def;
                } else {
                    return cache;
                }
            }
        }
    }

    function clearExpiredCacheValue(force) {
        let StorageKey = [];
        for (let i = 0, len = localStorage.length; i < len; ++i) { // 先从里面取出所有的key
            StorageKey.push(localStorage.key(i));
        }

        let CacheKey = StorageKey.filter(function (x) {
            return x && x.match(/(drdm_cache_.+)_exp/);
        }); // 再从中提取出本脚本缓存的键值

        for (let i = 0, len = CacheKey.length; i < len; ++i) {
            let key_name = CacheKey[i];
            let exp_at = localStorage.getItem(key_name);
            if (force || exp_at < Date.now()) {
                localStorage.removeItem(key_name);
                localStorage.removeItem(key_name.slice(0, -4)); // 移除 _exp 后缀
            }
        }
    }


    function dd(...arr) {
        console.log(...arr)
    }


    class Msg {
        static showMsg(msg, type = 'info') {
            let content = '<span id="show-color" style="'
            if ('info' === type) {
                content += '    color: #666;\n'
            } else if ('error' === type) {
                content += '    color: #c21020;\n'
            }
            content +=
                '    font-size: 14px;\n' +
                '    text-align: right;\n' +
                '    display: inline-block;\n' +
                '    float: right;\n' +
                '    font-weight: 200;\n' +
                '    border: 1px solid #256d38;\n' +
                '    padding: 3px;">' + msg + '</span>'
            $('#content > h1').append(content)
            setTimeout(() => {
                $('#show-color').remove();
            }, 4000)
        }

        static showNotification(content, callback = null) {
            GM_notification({
                text: content,
                // timeout: 3000,
            }, callback)
        }
    }

    class req {
        static getDom(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    onload: (response) => {
                        if (response.code >= 400) {
                            dd('请求 失败', url);
                            return;
                        }
                        let result = new DOMParser().parseFromString(response.responseText, 'text/html')
                        return resolve(result)
                    }
                })
            })
        }

        static getJson(url, method = 'GET', params = {}) {
            let msg;
            method = method.toUpperCase();
            return new Promise((resolve, reject) => {
                let headers = {Accept: 'application/json'}
                let data = '';
                if (method === 'POST') {
                    headers = Object.assign(headers, {
                        'Content-type': 'application/x-www-form-urlencoded'
                    })
                    for (let key in params) {
                        if (data !== "") {
                            data += '&'
                        }
                        data += key + '=' + encodeURIComponent(params[key]);
                    }
                }
                // dd('debug', url, data, method)
                GM_xmlhttpRequest({
                    method: method,
                    url,
                    data,
                    timeout: 10000,
                    headers,
                    onload: (response) => {
                        if (response.code >= 400) {
                            Msg.showNotification('请求失败:' + response.msg)
                            dd('请求 失败', url);
                            reject(response)
                            return;
                        }
                        try {
                            resolve(JSON.parse(response.responseText))
                        } catch (e) {
                            dd('解析失败：', response.responseText)
                            Msg.showNotification('解析失败')
                            reject('解析失败', response)
                        }
                    },
                    onError: (response) => {
                        dd(response);
                        reject('请求失败3', response)
                    },
                    ontimeout(e) {
                        msg = '连接超时,请检查:' + url
                        reject(msg)
                        Msg.showNotification(msg)
                    }
                })
            })
        }

    }

    async function getImdb() {
        dd('start imdb')
        // 中栏加强
        $("div#interest_sectl").append(`<div class='rating_wrap clearbox' id='loading_more_rate'>加载第三方评价信息中.......</div>
<div class="rating_wrap clearbox rating_imdb" rel="v:rating" style="display:none"></div>
<div class="rating_wrap clearbox rating_rott" style="display:none"></div>
<div class="rating_wrap clearbox rating_anidb" rel="v:rating" style="border-top: 1px solid #eaeaea; display:none"></div>
<div class="rating_more" style="display:none"></div>`); // 修复部分情况$("div.rating_betterthan")不存在情况
//IMDb:
        let imdbSpan = Array.from(document.querySelectorAll(".pl")).find(item => item.textContent == 'IMDb:');
        if (!imdbSpan) {
            dd("douban no link to imdb");
            return;
        }

        let imdbUrl = "https://www.imdb.com/title/" +
            imdbSpan.nextSibling.nodeValue.trim();
        let imdbA = document.createElement("a");
        imdbA.href = imdbUrl;
        imdbA.setAttribute("target", "_blank");
        imdbA.textContent = "imdb:"
        imdbSpan.append(imdbA)
        let imdb_key = 'imdb_' + imdbUrl;
        let imdb = {
            mpaa: '',
            mpaaText: '未评级'
        }
        let cached = cache.get(imdb_key)
        dd('get cached', cached)
        let rating_more = $('#interest_sectl .rating_more');
        if (!cached || !cached.mpaa) {
            let doc = await req.getDom(imdbUrl);
            if ($("div.txt-block:contains('Motion Picture Rating')", doc).text().length > 0) {
                imdb.mpaaText = $("div.txt-block:contains('Motion Picture Rating')", doc).text()
                    .trim().replace(/\n/g, '').replace(/^.*Rated /, '')
                    .replace(/ .*$/, '')
                imdb.mpaa = imdb.mpaaText.replace(/^G$/, '大众级 | 全年龄').replace(/^PG$/, '指导级 | ≥6岁')
                    .replace(/^PG-13$/, '特指级 | ≥13岁').replace(/^NC-17$/, '限定级 | ≥17岁')
                    .replace(/^R$/, '限制级 | ≥18岁');
            }
            cache.add(imdb_key, imdb);
        } else {
            imdb = cached;
        }
        rating_more.append(`<div>分级<a href='${imdbUrl + 'parentalguide?ref_=tt_stry_pg#certification'}' style="margin-left:-35px" target="_blank" data-zh="${imdb.mpaa}">${imdb.mpaaText}</a></div>`);
        rating_more.show();
        $("#loading_more_rate").hide();
    }

    class Resource {

        static init() {
            if (document.getElementById('resource-doulist')) {
                return;
            }
            //todo 先实现一个缓存层
            let style = `
        #resource-doulist {
            margin-bottom: 30px;
        }
    #resource-doulist > ul > li > div.title .from{
   border: 2px solid #ddd;
    padding: 1px 2px;
    border-radius: 13%;
    font-weight: 500;
    color: #666;

    }

        #resource-doulist > ul > li > div.title .size{
    background: #FED49A;
    font-size: 13px;
    line-height: 13px;
    padding: 2px;
    color: #666;
    border-radius: 12% 15%;
    }

    #resource-doulist > ul > li > div.sbar {
font: 12px Helvetica,Arial,sans-serif;
    line-height: 1.62;
    font-size: 13px;
    color: #111;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content:left;
    align-items: center;
    flex-flow: row;
    border-bottom: 1px solid #eee;
    margin: 4px 2px;
}
    #resource-doulist > ul > li > div.sbar span{
    margin: 0 2px;
}
    `;

            GM_addStyle(style);

            let str = `<div id="resource-doulist"><h2><i class="">资源</i>· · · · · ·
        <span class="pl">
        <a href="http://yc.ionewu.com/" target="_blank">去看看</a>
        </span></h2><ul id="resource-ul">
    `;
            str += `</ul></div>`;

            $("#content > div.grid-16-8.clearfix > div.aside").prepend(str)
        }

        /**
         * @from 来源
         * @url 下载所在详情页面
         * @title 标题
         * @size 大小
         * @heat 热度
         * @downloadLink 下载地址
         */
        static show() {
            let d, str = '';
            dd('aa', targets)
            if (!targets.length) {
                str = '<h6>没有相关资源</h6>';
                $("#resource-ul").html(str)
            }
            for (const index of targets.keys()) {
                d = targets[index];
                str += `
            <li>
            <div class="title">
                <span class="from">${d.from}</span>
                `
                if (d.size) {
                    str += `<span class="size">${d.size}</span>`
                }
                str += `
            <a href="${d.url}" target="_blank">${d.title}</a>
            </div>`;
                str += `<div class="sbar">`;
                str += `<span ><a class="put-to-server" data-index=${index}  href="javascript:void(0)">发送服务器</a></span>`
                str += `<!--<span><a href="${d.downloadLink}" target="_blank">下载地址</a></span>-->`
                str += `<span><a class="put-to-clipboard" href="javascript::void(0);" data-href="${d.downloadLink}">复制</a></span>`

                if (d.heat) {
                    str += `<span class="heat">热度：${d.heat}</span>`
                }
                str += '</div></li>'
            }
            //resource-ul
            $("#resource-ul").html(str)
            $('.put-to-server').click(function () {
                let a = $(this).attr('data-index')
                return Server.putToServer(a);
            })
            $('.put-to-clipboard').click(function () {
                let a = $(this).attr('data-href')
                GM_setClipboard(a);
            })
        }

        static sort() {
            //100-900
            const sizeHander = (item) => {
                let size = (item.size || '').toLocaleLowerCase();
                let sizeNumber = (size.includes('m')) ? parseFloat(size) / 1000 : parseFloat(size);
                let score = 500;
                if (size && !isNaN(sizeNumber)) {
                    //(1,500),(2,800),(3,900),(4,800),5(500)
                    score = -100 * sizeNumber * sizeNumber + 600 * sizeNumber;
                    if (score < 0) {
                        score = 100;
                    }
                }
                return score;
            };
            let item
            for (let i = 0; i < targets.length; i++) {
                item = targets[i];
                item.score = 0;
                //size 2g  左右
                item.score += sizeHander(item);
            }
            targets.sort((a, b) => {
                return b.score - a.score;
            })
        }

        static async run() {
            Resource.init();
            //todo 后面再改
            await BdFileResource.request();
            Resource.sort();
            dd(targets);
            Resource.show();
        }

        static async markGot() {
            let params = {
                douban_id: db.id,
                douban_name: db.title
            };
            let res = await req.getJson(controller.base_url + '/douban-movie-got', 'POST', params);
            dd('get res', res);
            if (res.code < 400) {
                return Msg.showMsg(res.msg);
            }
            dd('get res', res);
        }
    }

    class BdFileResource {
        static async makeTarget() {
            targets = cache.get('targets') || [];
            if (!targets || !targets.length) {
                await BdFileResource.request();
                cache.add('targets', targets)
            }
            Server.showResource()
        }

        static async request() {
            let m = {
                name: 'BD影视',
                link: 'https://www.bd2020.com/search.jspx?q=' + db.title,
                xpathList: '//*[@id="content_list"]//li/div/a',
            }
            let dom = await req.getDom(m.link)
            let listRes = document.evaluate(m.xpathList, dom, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE)
            if (!listRes) {
                dd('获取db列表空')
                return;
            }
            //解析列表，获取数据
            let node;
            let urlDetails = [];
            while (node = listRes.iterateNext()) {
                if (node.innerText.includes(db.title)) {
                    urlDetails.push({
                        href: node.href,
                        title: node.innerText,
                    });
                }
            }
            if (!urlDetails || !urlDetails.length) {
                dd('获取db列表空2')
                return;
            }
            for (const item of urlDetails) {
                let {href, title} = item;
                let dom = await req.getDom(href)
                let downloadLinks = BdFileResource.bdHandler(dom)
                let size;
                for (let link of downloadLinks) {
                    size = BdFileResource.getSize(link)
                    targets.push({
                            from: 'bd-file',
                            title,
                            url: href,
                            sizeNumber: size,
                            size: BdFileResource.formatSize(size),
                            downloadLink: link,
                        }
                    );
                }
            }
        }

        static formatSize(size) {
            if (size / Math.pow(1024, 3) > 1) {
                return (size / Math.pow(1024, 3)).toFixed(2) + 'GB';
            } else if (size / Math.pow(1024, 2) > 1) {
                return (size / Math.pow(1024, 2)).toFixed(0) + 'MB';
            }
            return ''
        }

        static getSize(url) {
            let size = 0;
            if (!!~url.indexOf('ed2k')) {
                let eArray = url.split('|');
                if (eArray.length > 4) {
                    size = eArray[3];
                }
            }
            return size;
        }

        static bdHandler(dom) {
            let re = /var\surls\s=\s"([\S]*)"/gi
            let urls;
            //不得不做 ps:bd把链接藏在变量里
            let a
            let urlsDom = dom.querySelectorAll('script');
            for (let i = 0; i < urlsDom.length; i++) {
                let text = urlsDom[i].innerText;
                if (text.includes('urls')) {
                    a = re.exec(text)
                    urls = a[1] || '';
                }
            }

            let ed2ks = unescape(bdMovieSecret.utf8ToUtf16(bdMovieSecret.decode64(urls.split("").reverse().join(""))))
                .replace("<p>", "").replace("</p>", "")
                .split("###");

            return ed2ks || [];
        }
    }

    async function showWant(wantRes) {
        const url = controller.base_url + '/douban-movie/' + db.id
        let res
        try {
            res = await req.getJson(url);
        } catch (e) {
            dd('show Want error', e)
            return;
        }
        let nodeHtml = '';
        let style = `cursor:pointer;letter-spacing:3px;overflow:hidden;color:#000;display:block;font:normal 12px sans-serif;margin-right:10px;border:1px solid #ddd;width:3rem;float:left;text-align:center;border-radius:10%;`;
        let newNode2 = $('<span>GOT</span>')
            .attr('style', style)
            .click(() => {
                Resource.markGot()
            })

        if (res.code < 400) {
            nodeHtml = '<span>有了</span>';
            style += 'color:green;'
        } else {
            nodeHtml = '<span>我想要</span>';
            style += 'color:blue;'
        }
        let newNode = $(nodeHtml)
            .attr('style', style);
        newNode = newNode.click(() => {
            Resource.run()
        });

        wantRes.singleNodeValue.insertBefore(newNode[0], wantRes.singleNodeValue.firstChild)
        wantRes.singleNodeValue.insertBefore(newNode2[0], wantRes.singleNodeValue.firstChild)
    }

    function cssInit() {
        // 注入脚本相关的CSS，包括：隐藏、调整豆瓣原先的元素，脚本页面样式
        /*todo test*/
        const style = `
#interest_sectl {
    height:300px;
}
.c-aside {
}
.c-aside-body {
}
`

        GM_addStyle(style);
        let myScriptStyle = "@charset utf-8;#dale_movie_subject_top_right,#dale_movie_subject_top_right,#dale_movie_subject_top_midle,#dale_movie_subject_middle_right,#dale_movie_subject_bottom_super_banner,#footer,#dale_movie_subject_download_middle,#dale_movie_subject_inner_middle,#movie_home_left_bottom,#dale_movie_home_top_right,#dale_movie_home_side_top,#dale_movie_home_bottom_right,#dale_movie_home_inner_bottom,#dale_movie_home_download_bottom,#dale_movie_home_bottom_right_down,#dale_movie_towhome_explore_right,#dale_movie_chart_top_right,#dale_movie_tags_top_right,#dale_review_best_top_right,.mobile-app-entrance.block5.app-movie,.qrcode-app,.top-nav-doubanapp,.extra,div.gray_ad,p.pl,div.ticket{display:block}.c-aside{margin-bottom:30px}.c-aside-body{*letter-spacing:normal}.c-aside-body a{border-radius:6px;color:#37A;display:inline-block;letter-spacing:normal;margin:0 8px 8px 0;padding:0 8px;text-align:center;width:65px}.c-aside-body a:link,.c-aside-body a:visited{background-color:#f5f5f5;color:#37A}.c-aside-body a:hover,.c-aside-body a:active{background-color:#e8e8e8;color:#37A}.c-aside-body a.available{background-color:#5ccccc;color:#006363}.c-aside-body a.available:hover,.c-aside-body a.available:active{background-color:#3cc}.c-aside-body a.sites_r0{text-decoration:line-through}#c_dialog li{margin:10px}#c_dialog{text-align:center}#interest_sectl .rating_imdb{border-top:1px solid #eaeaea;border-bottom:1px solid #eaeaea;padding-bottom:0}#interest_sectl .rating_wrap{padding-top:15px}#interest_sectl .rating_more{border-bottom:1px solid #eaeaea;color:#9b9b9b;margin:0;padding:15px 0;position:relative}#interest_sectl .rating_more a{left:80px;position:absolute}#interest_sectl .rating_more .titleOverviewSprite{background:url(https://coding.net/u/Changhw/p/MyDoubanMovieHelper/git/raw/master/title_overview_sprite.png) no-repeat;display:inline-block;vertical-align:middle}#interest_sectl .rating_more .popularityImageUp{background-position:-14px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityImageDown{background-position:-34px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityUpOrFlat{color:#83c40b}#interest_sectl .rating_more .popularityDown{color:#930e02}.more{display:block;height:34px;line-height:34px;text-align:center;font-size:14px;background:#f7f7f7}div#drdm_setting input[type=checkbox]{display:none}div#drdm_setting input[type=checkbox]+label{display:inline-block;width:40px;height:20px;position:relative;transition:.3s;margin:0 20px;box-sizing:border-box;background:#ddd;border-radius:20px;box-shadow:1px 1px 3px #aaa}div#drdm_setting input[type=checkbox]+label:after,div#drdm_setting input[type=checkbox]+label:before{content:'';display:block;position:absolute;left:0;top:0;width:20px;height:20px;transition:.3s;cursor:pointer}div#drdm_setting input[type=checkbox]+label:after{background:#fff;border-radius:50%;box-shadow:1px 1px 3px #aaa}div#drdm_setting input[type=checkbox]:checked+label{background:#aedcae}div#drdm_setting input[type=checkbox]:checked+label:after{background:#5cb85c;left:calc(100% - 20px)}.top250{background:url(https://s.doubanio.com/f/movie/f8a7b5e23d00edee6b42c6424989ce6683aa2fff/pics/movie/top250_bg.png) no-repeat;width:150px;margin-right:5px;font:12px Helvetica,Arial,sans-serif;margin:5px 0;color:#744900}.top250 span{display:inline-block;text-align:center;height:18px;line-height:18px}.top250 a,.top250 a:link,.top250 a:hover,.top250 a:active,.top250 a:visited{color:#744900;text-decoration:none;background:0}.top250-no{width:34%}.top250-link{width:66%}.drdm-dl-horizontal dt{float:left;width:160px;overflow:hidden;clear:left;text-align:right;text-overflow:ellipsis;white-space:nowrap}.drdm-dl-horizontal dd{margin-left:180px}";
        GM_addStyle(myScriptStyle)
        let siddenav=`
       <div class="zhe_nav bounceInUp animated" id="zhe_nav">
    <label for="" class="aside-menu" data-cat="gongnue" title="">菜单</label>
    <a href="javascript:void(0)" title="评论扩大" class="menu-item menu-line menu-first" onclick="changeCommentHeight">评论扩大</a>
</div> 
        `
        $("body").append(siddenav);
        var siddecss = ".zhe_nav{position:fixed;right:-50px;z-index:9999999!important;top:350px;width:260px;height:260px;-webkit-filter:url(#goo);filter:url(#goo);-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none;opacity:.75}.zhe_nav.no-filter{-webkit-filter:none;filter:none}.zhe_nav .aside-menu{position:absolute;width:70px;height:70px;-webkit-border-radius:50%;border-radius:50%;background:#f34444;left:0;top:0;right:0;bottom:0;margin:auto;text-align:center;line-height:70px;color:#fff;font-size:20px;z-index:1;cursor:move}.zhe_nav .menu-item{position:absolute;width:60px;height:60px;background-color:#ff7676;left:0;top:0;right:0;bottom:0;margin:auto;line-height:60px;text-align:center;-webkit-border-radius:50%;border-radius:50%;text-decoration:none;color:#fff;-webkit-transition:background .5s,-webkit-transform .6s;transition:background .5s,-webkit-transform .6s;-moz-transition:transform .6s,background .5s,-moz-transform .6s;transition:transform .6s,background .5s;transition:transform .6s,background .5s,-webkit-transform .6s,-moz-transform .6s;font-size:14px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.zhe_nav .menu-item:hover{background:#a9c734}.zhe_nav .menu-line{line-height:20px;padding-top:10px}.zhe_nav:hover{opacity:1}.zhe_nav:hover .aside-menu{-webkit-animation:jello 1s;-moz-animation:jello 1s;animation:jello 1s}.zhe_nav:hover .menu-first{-webkit-transform:translate3d(0,-135%,0);-moz-transform:translate3d(0,-135%,0);transform:translate3d(0,-135%,0)}.zhe_nav:hover .menu-second{-webkit-transform:translate3d(-120%,-70%,0);-moz-transform:translate3d(-120%,-70%,0);transform:translate3d(-120%,-70%,0)}.zhe_nav:hover .menu-third{-webkit-transform:translate3d(-120%,70%,0);-moz-transform:translate3d(-120%,70%,0);transform:translate3d(-120%,70%,0)}.zhe_nav:hover .menu-fourth{-webkit-transform:translate3d(0,135%,0);-moz-transform:translate3d(0,135%,0);transform:translate3d(0,135%,0)}.zhe_nav:hover .menu-fifth{-webkit-transform:translate3d(120%,70%,0);-moz-transform:translate3d(120%,70%,0);transform:translate3d(120%,70%,0)}.zhe_nav:hover .menu-sixth{-webkit-transform:translate3d(120%,-70%,0);-moz-transform:translate3d(120%,-70%,0);transform:translate3d(120%,-70%,0)}@-webkit-keyframes jello{from,11.1%,to{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@-moz-keyframes jello{from,11.1%,to{-moz-transform:none;transform:none}22.2%{-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@keyframes jello{from,11.1%,to{-webkit-transform:none;-moz-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}.animated{-webkit-animation-duration:1s;-moz-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;-moz-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-moz-keyframes bounceInUp{from,60%,75%,90%,to{-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.bounceInUp{-webkit-animation-name:bounceInUp;-moz-animation-name:bounceInUp;animation-name:bounceInUp;-webkit-animation-delay:1s;-moz-animation-delay:1s;animation-delay:1s}@media screen and (max-width:640px){.zhe_nav{display:none!important}}@media screen and (min-width:641px) and (max-width:1367px){.zhe_nav{top:120px}}";
        GM_addStyle(siddecss)

    }

    class Server {
        static async putToServer(index) {
            let baseInfo = {
                douban_id: db.id,
                douban_name: db.title
            };
            if (!targets || !targets.length) {
                return Msg.showNotification('没有资源');
            }
            let target = targets[index];
            let params = Object.assign({}, baseInfo, {
                url: target.downloadLink,
                size: target.size || 0,
            });
            try {
                let res = await req.getJson(controller.base_url + '/movie-resources', 'POST', params);
                if (res.code < 400) {
                    return Msg.showMsg(res.msg);
                } else {
                    return Msg.showMsg(res.msg, 'error');
                }
            } catch (e) {
                dd('put to server error', e)
            }
        }

    }

    /**
     * ====================
     * 函数定义区 end
     * ====================
     */
    let controller = {
        base_url: 'http://zqbinary.fun:8989',
        // base_url: 'http://farmer.tt',
        is_want: false,
        is_want_close: false,
    };
    const db = {
        id: location.href.match(/\d{7,8}/g)[0],
        link: 'https://' + location.href.match(/douban.com\/subject\/\d+\//),
        title: document.querySelector("head > title").innerText.replace('(豆瓣)', '').trim(),
        reviewXpath: '//*[@id="interest_sect_level"]',
    };

    let targets = [];
    let c = {
        'imdb_cache': true,
    };
    let cache = CacheStorage(db.id, 86400 * 7 * 1e3);



    async function main() {
        cssInit();

        /*
        let reviewRes = document.evaluate(db['reviewXpath'], document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
        if (!reviewRes.singleNodeValue) {
            dd('找不到评价栏')
            return;
        }
        controller['is_want'] = reviewRes.singleNodeValue.innerText.includes('我想看');
        if (!controller.is_want_close && controller.is_want) {
            await showWant(reviewRes);
        }
        */
    }

//setTimeout(getImdb,3000)
//getImdb();
    main();
    // Your code here...
})();