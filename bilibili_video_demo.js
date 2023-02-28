// ==UserScript==
// @name    优酷、爱奇艺、腾讯、芒果等全网VIP视频破解播放，知乎视频、微信公众号视频下载，QQ音乐网易云音乐及MV下载、酷狗音乐、喜马拉雅、蜻蜓FM听书有声小说下载。长期更新，放心使用。
// @namespace http://gongju.dadiyouhui03.cn/app/tool/youhou/index.html
// @author war3
// @version          20
// @description      B站视频大会员视频解析播放，QQ音乐MV下载、网易云音乐MV下载、抖音视频下载、快手视频下载无水印、知乎视频、微信公众号视频下载，酷狗音乐下载、喜马拉雅、蜻蜓FM听书有声小说下载。优酷、爱奇艺、腾讯等全网VIP视频免费破解去广告在线播放，长期更新，放心使用。
// @include      *.zhihu.com/*
// @include      *.bilibili.com/*
// @include      *v.youku.com/v_*
// @include      *m.youku.com/v*
// @include      *m.youku.com/a*
// @include      *v.qq.com/x/cover/*
// @include      *v.qq.com/x/page/*
// @include      *v.qq.com/play*
// @include      *v.qq.com/cover*
// @include      *tv.sohu.com/*
// @include      *.iqiyi.com/v_*
// @include      *.iqiyi.com/w_*
// @include      *.iqiyi.com/a_*
// @include      *.le.com/ptv/vplay/*
// @include      *.tudou.com/listplay/*
// @include      *.tudou.com/albumplay/*
// @include      *.tudou.com/programs/view/*
// @include      *.tudou.com/v*
// @include      *.mgtv.com/b/*
// @include      *.qq.com/*
// @include      *music.163.com/*
// @include      *.kugou.com/*
// @include      *.ximalaya.com/*
// @include      *.qingting.fm/*
// @include      *.douyin.com/*
// @include      *.kuaishou.com/*
// @include      *dan-teng.top*
// @match        *://*/*
// @require https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @require https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @require https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.js
// @require https://www.dadiyouhui02.cn/tampermonkey/coment/music.js?version=795296
// @updateURL https://www.dadiyouhui02.cn/tampermonkey/music.user.js
// @downloadURL  https://www.dadiyouhui02.cn/tampermonkey/music.user.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @run-at           document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_info
// @grant             GM_notification
// @grant             GM_getResourceText
// @grant             GM_download
// @noframes
// @connect *
// @connect     zhihu.com
// @connect     weixin.qq.com
// @connect  wwwapi.kugou.com
// @connect  u.y.qq.com
// @connect  v1.ak47.ink
// @connect     dadiyouhui02.cn
// ==/UserScript==

/*
2021.11.15 新增：B站视频大会员视频解析播放，使用方法：在B站上打开视频的播放界面，然后点击屏幕上的菜单，选择播放

2021.11.14 新增：抖音快手无水印视频下载！使用方法：使用浏览器打开你需要下载的短视频链接，然后点击屏幕上的菜单下载
解析视频和音乐的功能如果遇到官方网站更新不能正常使用的话，欢迎反馈，我会及时修复*/

function addStyle(css) {
    var pi = document.createProcessingInstruction(
        'xml-stylesheet',
        'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
    );
    return document.insertBefore(pi, document.documentElement);
}
var ozlurlvideo='http://dan-teng.top/app/tool/play.html';
var ozlurldh='http://dan-teng.top/app/tool/go.html';
var ozlurlmusic='http://dan-teng.top/app/tool/down.html';
$(document).ready(function(){
    var vurl = location.href;
    var baidspjayumin=document.domain;
    function closeytAds(){
    }

    if (window.top == window.self){
        if($("#zhe_nav").length>0){
        }else{
            if (window.location.href.indexOf(window.atob('ZGFuLXRlbmcudG9w')) >=0 && (window.location.href.indexOf(window.atob('cGxheS5odG1s')) >=0 || window.location.href.indexOf(window.atob('ZG93bi5odG1s')) >=0 ) ){
                if ($('#configload').length == 0 ) {
                    $('body').attr('id','configload');
                    $('#dataversion').attr('version',GM_info.script.version);
                    $('#dataversion').html(GM_info.script.updateURL);
                }
            }

            var siddenav = '<div class="zhe_nav bounceInUp animated" id="zhe_nav"><label for="" class="aside-menu" data-cat="gongnue" title="">菜单</label><a href="javascript:void(0)" title="美团外卖团购、饿了么红包免费领！大额满减券随便领！" data-cat="gogoa" class="menu-item menu-line menu-first">\u5916\u5356<br>\u7ea2\u5305</a><a title="可下载QQ音乐以及MV下载、网易云音乐的歌曲以及MV下载、酷狗音乐、酷狗听书、等等，更多功能持续更新中.." data-cat="gogob" class="menu-item menu-line menu-second" >视频<br>播放</a><a href="javascript:void(0)" title="电影电视剧资源导航，有好用好玩的网站可以联系我添加" data-cat="gogoc" class="menu-item menu-line menu-third">更多<br>资源</a><a href="javascript:void(0)" title="淘宝天猫优惠券、京东优惠券搜索领取" data-cat="gogoe" class="menu-item menu-line menu-third">网购<br>优惠</a>';

            var siddecss = ".zhe_nav{position:fixed;right:-50px;z-index:9999999!important;top:350px;width:260px;height:260px;-webkit-filter:url(#goo);filter:url(#goo);-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none;opacity:.75}.zhe_nav.no-filter{-webkit-filter:none;filter:none}.zhe_nav .aside-menu{position:absolute;width:70px;height:70px;-webkit-border-radius:50%;border-radius:50%;background:#f34444;left:0;top:0;right:0;bottom:0;margin:auto;text-align:center;line-height:70px;color:#fff;font-size:20px;z-index:1;cursor:move}.zhe_nav .menu-item{position:absolute;width:60px;height:60px;background-color:#ff7676;left:0;top:0;right:0;bottom:0;margin:auto;line-height:60px;text-align:center;-webkit-border-radius:50%;border-radius:50%;text-decoration:none;color:#fff;-webkit-transition:background .5s,-webkit-transform .6s;transition:background .5s,-webkit-transform .6s;-moz-transition:transform .6s,background .5s,-moz-transform .6s;transition:transform .6s,background .5s;transition:transform .6s,background .5s,-webkit-transform .6s,-moz-transform .6s;font-size:14px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.zhe_nav .menu-item:hover{background:#a9c734}.zhe_nav .menu-line{line-height:20px;padding-top:10px}.zhe_nav:hover{opacity:1}.zhe_nav:hover .aside-menu{-webkit-animation:jello 1s;-moz-animation:jello 1s;animation:jello 1s}.zhe_nav:hover .menu-first{-webkit-transform:translate3d(0,-135%,0);-moz-transform:translate3d(0,-135%,0);transform:translate3d(0,-135%,0)}.zhe_nav:hover .menu-second{-webkit-transform:translate3d(-120%,-70%,0);-moz-transform:translate3d(-120%,-70%,0);transform:translate3d(-120%,-70%,0)}.zhe_nav:hover .menu-third{-webkit-transform:translate3d(-120%,70%,0);-moz-transform:translate3d(-120%,70%,0);transform:translate3d(-120%,70%,0)}.zhe_nav:hover .menu-fourth{-webkit-transform:translate3d(0,135%,0);-moz-transform:translate3d(0,135%,0);transform:translate3d(0,135%,0)}.zhe_nav:hover .menu-fifth{-webkit-transform:translate3d(120%,70%,0);-moz-transform:translate3d(120%,70%,0);transform:translate3d(120%,70%,0)}.zhe_nav:hover .menu-sixth{-webkit-transform:translate3d(120%,-70%,0);-moz-transform:translate3d(120%,-70%,0);transform:translate3d(120%,-70%,0)}@-webkit-keyframes jello{from,11.1%,to{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@-moz-keyframes jello{from,11.1%,to{-moz-transform:none;transform:none}22.2%{-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@keyframes jello{from,11.1%,to{-webkit-transform:none;-moz-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}.animated{-webkit-animation-duration:1s;-moz-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;-moz-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-moz-keyframes bounceInUp{from,60%,75%,90%,to{-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.bounceInUp{-webkit-animation-name:bounceInUp;-moz-animation-name:bounceInUp;animation-name:bounceInUp;-webkit-animation-delay:1s;-moz-animation-delay:1s;animation-delay:1s}@media screen and (max-width:640px){.zhe_nav{display:none!important}}@media screen and (min-width:641px) and (max-width:1367px){.zhe_nav{top:120px}}";

            if ((vurl.indexOf("y.qq.com") > 0 || vurl.indexOf("music.163.com") >= 0 || vurl.indexOf("kugou.com") >= 0  || vurl.indexOf("ximalaya.com") >= 0|| vurl.indexOf("qingting.fm") >= 0 || vurl.indexOf("kuaishou.com") >= 0 || vurl.indexOf("douyin.com") >= 0) ){


                siddenav = '<div class="zhe_nav bounceInUp animated" id="zhe_nav"><label for="" class="aside-menu" data-cat="gongnue" title="">菜单</label><a href="javascript:void(0)" title="美团外卖团购、饿了么红包免费领！大额满减券随便领！" data-cat="gogoa" class="menu-item menu-line menu-first">\u5916\u5356<br>\u7ea2\u5305</a><a title="可下载QQ音乐以及MV下载、网易云音乐的歌曲以及MV下载、酷狗音乐、酷狗听书、等等，更多功能持续更新中.." data-cat="gogob" class="menu-item menu-line menu-second" >点击<br>下载</a><a href="javascript:void(0)" title="电影电视剧资源导航，有好用好玩的网站可以联系我添加" data-cat="gogoc" class="menu-item menu-line menu-third">更多<br>资源</a><a href="javascript:void(0)" title="淘宝天猫优惠券、京东优惠券搜索领取" data-cat="gogoe" class="menu-item menu-line menu-third">网购<br>优惠</a>';
                $("body").append(siddenav);
                addStyle(siddecss);
                var ua = navigator.userAgent;
                /Safari|iPhone/i.test(ua) && 0 == /chrome/i.test(ua) && $("#zhe_nav").addClass("no-filter");
                var drags = {down: !1, x: 0, y: 0, winWid: 0, winHei: 0, clientX: 0, clientY: 0}, adsideNav = $("#zhe_nav")[0],
                    getCss = function (a, e) {
                        return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e]
                    };
                $("#zhe_nav").on("mousedown", function (a) {
                    drags.down = !0, drags.clientX = a.clientX, drags.clientY = a.clientY, drags.x = getCss(this, "right"), drags.y = getCss(this, "top"), drags.winHei = $(window).height(), drags.winWid = $(window).width(), $(document).on("mousemove", function (a) {
                        if (drags.winWid > 640 && (a.clientX < 120 || a.clientX > drags.winWid - 50))
                            return !1;
                        if (a.clientY < 180 || a.clientY > drags.winHei - 120)
                            return !1;
                        var e = a.clientX - drags.clientX,
                            t = a.clientY - drags.clientY;
                        adsideNav.style.top = parseInt(drags.y) + t + "px";
                        adsideNav.style.right = parseInt(drags.x) - e + "px";
                        GM_setValue('menu_top', parseInt(drags.y) + t + "px");
                        GM_setValue('menu_right', parseInt(drags.x) - e + "px");
                    })
                }).on("mouseup", function () {
                    drags.down = !1, $(document).off("mousemove")
                });


                $('body').on('click', '[data-cat=gogob]', function () {

                    if (location.href.indexOf("ximalaya.com") > 0 ){
                        var ximazcvs=0;


                        if(location.href.match(/www\.ximalaya\.com/)){

                            var ximaurldara= location.href.split("/");

                            for(var ximaurlIndex=0;ximaurlIndex<ximaurldara.length;ximaurlIndex++){

                                if(ximaurlIndex==ximaurldara.length-1){

                                    if(ximaurldara[ximaurlIndex] != ""){
//console.log('https://www.sinsyth.com/yyjx/?id='+ximaurldara[ximaurlIndex]+'&type=ximalaya&playUrl='+encodeURIComponent(location.href));
                                        ximazcvs=1;

                                        GM_openInTab('https://www.sinsyth.com/yyjx/?id='+ximaurldara[ximaurlIndex]+'&type=ximalaya', {active: !0});
                                    }

                                }
                            }
                        }


                        if ( ximazcvs == 0 ){
                            swal("注意只能在单集单曲的播放页面、例如此类页面https://www.ximalaya.com/youshengshu/12642314/68379493方可正常使用本菜单的下载功能。注意只能是单集播放页面");
                        }
                    }


                    if (location.href.indexOf("kuaishou.com") >= 0 ){
                        var  kuaishouzcvs=0;
                        if (location.href.indexOf("/short-video/") >=0 ){
                            kuaishouzcvs=1;
                            var  musicname="";
                            if ($(".video-info-title").length>0){
                                musicname=$(".video-info-title").text();
                            }

                            GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+$("video").attr("src")+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+$("video").attr("src")+'" download="'+$("video").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+$("video").attr("src")+'"  ></video>');
                            GM_openInTab(ozlurlmusic, {active: !0});
                        }

                        if (kuaishouzcvs==0 ){
                            swal("支持短视频下载，注意只能进入视频的播放页面后 方可正常使用本菜单的下载功能。例如https://www.kuaishou.com/short-video/3xh3pisqccie7r6?authorId=3xb6th63c84ney4&streamSource=find&area=homexxbrilliant");

                        }

                    }


                    if (location.href.indexOf("douyin.com") >= 0 ){
                        var  douyinzcvs=0;
                        if ($("video").length>0){
                            douyinzcvs=1;
                            var  musicname="";
                            if ($("h1").length>0){
                                musicname=$("h1").text();
                            }
                            if ($(".title").length>0){
                                musicname=$(".title").text();
                            }

                            GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+$("video").attr("src")+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+$("video").attr("src")+'" download="'+$("video").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+$("video").attr("src")+'"  ></video>');
                            GM_openInTab(ozlurlmusic, {active: !0});

                        }

                        if (douyinzcvs==0 ){
                            swal("支持短视频下载，注意只能进入视频的播放页面后 方可正常使用本菜单的下载功能。例如https://www.douyin.com/video/7011733133804489992");

                        }

                    }


                    if (location.href.indexOf("music.163.com") > 0 ){
                        var  wy163zcvs=0;
                        if (location.href.indexOf("song?id=") >0 ){
                            wy163zcvs=1;	 	 	  	 	   GM_openInTab("https://www.sinsyth.com/yyjx/?url="+encodeURIComponent(location.href), {active: !0});
                        }

                        if (location.href.indexOf("163.com/#/mv?id=") >0 ||  location.href.indexOf("163.com/#/video?id=") >0 ){
                            wy163zcvs=1;
                            var  musicname="";

                            if ($("#g_iframe").length>0){

                                if ($("#g_iframe").contents().find("#flag_title1").length>0){
                                    musicname=$("#g_iframe").contents().find("#flag_title1").text();
                                }

                                if ($("#g_iframe").contents().find(".name").length>0){
                                    musicname=musicname+"-"+$("#g_iframe").contents().find(".name").find("a").text();
                                }
                                var  musicurl= "";

                                if ($("#g_iframe").contents().find("meta[property='og:video']")){
                                    musicurl=$("#g_iframe").contents().find("meta[property='og:video']").attr("content");
                                    musicurl=decodeURIComponent(musicurl);
                                }else{
                                    musicurl= $("#g_iframe").contents().find("video").attr("src");
                                }
                                if (musicurl.indexOf("blob:") >= 0 ){    swal("该视频地址已经被加密，若解析成功稍后几秒即可下载,如果不能下载请换个MV地址再下载。目前还支持QQ音乐MV下载");	   return 	 }

                                GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+musicurl+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+musicurl+'" download="'+musicurl+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 400px;"><source src="'+musicurl+'"  ></video>');
                                GM_openInTab(ozlurlmusic, {active: !0});
                            }
                        }
                        if (wy163zcvs==0 ){
                            swal("注意只能在音乐单曲播放页面、例如此类页面https://music.163.com/#/song?id=64561方可正常使用本菜单的音乐下载功能。注意只能是音乐单曲播放页面");
                            swal("支持网易云音乐的歌曲以及MV下载，注意只能进入音乐单曲或者MV的播放页面点击播放后 方可正常使用本菜单的音乐下载功能。例如https://music.163.com/#/song?id=64561以及https://music.163.com/#/mv?id=5293430");
                        }
                    }
                    if (location.href.indexOf("y.qq.com") >= 0 ){
                        var  qqzcvs=0;
                        if (location.href.indexOf("y.qq.com/n/ryqq/player") >=0 ){
                            qqzcvs=1;
                            var  musicname="";
                            if ($(".song_info__name").find("a")){
                                musicname=$(".song_info__name").find("a").text();
                            }

                            GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+$("audio").attr("src")+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+$("audio").attr("src")+'" download="'+$("audio").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 100px;"><source src="'+$("audio").attr("src")+'"  ></video>');

                            GM_openInTab(ozlurlmusic, {active: !0});

                        }
                        if (location.href.indexOf("qq.com/n/ryqq/mv/") >=0 ){
                            qqzcvs=1;


                            var  musicname="";
                            if ($(".mv__name").length>0){
                                musicname=$(".mv__name").text();
                            }
                            if ($(".mv__singer").length>0){
                                musicname=musicname+"-"+$(".mv__singer").text();
                            }
                            if ($("video").attr("src")){
                                if ($("video").attr("src").indexOf("blob:") >=0){
                                    var qqmvid=	location.href.match(/ryqq\/mv\/([^/]+)$/)[1];
                                    var qqmurl ='https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data=%7B%22comm%22%3A%7B%22ct%22%3A6%2C%22cv%22%3A0%2C%22g_tk%22%3A1451918689%2C%22uin%22%3A10000%2C%22format%22%3A%22json%22%2C%22platform%22%3A%22yqq%22%7D%2C%22mvInfo%22%3A%7B%22module%22%3A%22video.VideoDataServer%22%2C%22method%22%3A%22get_video_info_batch%22%2C%22param%22%3A%7B%22vidlist%22%3A%5B%22'+qqmvid+'%22%5D%2C%22required%22%3A%5B%22vid%22%2C%22type%22%2C%22sid%22%2C%22cover_pic%22%2C%22duration%22%2C%22singers%22%2C%22new_switch_str%22%2C%22video_pay%22%2C%22hint%22%2C%22code%22%2C%22msg%22%2C%22name%22%2C%22desc%22%2C%22playcnt%22%2C%22pubdate%22%2C%22isfav%22%2C%22fileid%22%2C%22filesize%22%2C%22pay%22%2C%22pay_info%22%2C%22uploader_headurl%22%2C%22uploader_nick%22%2C%22uploader_uin%22%2C%22uploader_encuin%22%5D%7D%7D%2C%22mvUrl%22%3A%7B%22module%22%3A%22music.stream.MvUrlProxy%22%2C%22method%22%3A%22GetMvUrls%22%2C%22param%22%3A%7B%22vids%22%3A%5B%22'+qqmvid+'%22%5D%2C%22request_type%22%3A10003%2C%22addrtype%22%3A3%2C%22format%22%3A264%7D%7D%7D';
                                    GM_xmlhttpRequest({
                                        url: qqmurl,
                                        method: 'GET',
                                        timeout: 3000,
                                        headers: {
                                            'Content-Type': 'application/jsonp',
                                            'Accept': 'application/jsonp',
                                            'Cache-Control': 'public'
                                        },
                                        onload: function(res){
                                            try{
                                                const t = JSON.parse(res.responseText);

                                                if (t.mvUrl.data[qqmvid].mp4){
                                                    var mvarra=t.mvUrl.data[qqmvid].mp4;
                                                    var mvuarra = new Array();
                                                    for(var i=0;i<mvarra.length;i++){
                                                        if (mvuarra.fileSize){
                                                            if (mvuarra.fileSize<=mvarra[i].fileSize){
                                                                mvuarra=mvarra[i];
                                                            }
                                                        }else{
                                                            mvuarra=mvarra[i];
                                                        }
                                                    }

                                                    GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+mvuarra.freeflow_url[mvuarra.freeflow_url.length-1]+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+mvuarra.freeflow_url[mvuarra.freeflow_url.length-1]+'" download="'+$("video").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+mvuarra.freeflow_url[mvuarra.freeflow_url.length-1]+'"  ></video>');
                                                    GM_openInTab(ozlurlmusic, {active: !0});

                                                }else{
                                                    swal("因视频被加密无法找到下载地址");
                                                }

                                            }catch(e){
                                                swal("解析下载地址失败");
                                            }
                                        }
                                    });


                                }else{
                                    GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+$("video").attr("src")+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+$("video").attr("src")+'" download="'+$("video").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+$("video").attr("src")+'"  ></video>');
                                    GM_openInTab(ozlurlmusic, {active: !0});
                                }

                            }



                        }
                        if (qqzcvs==0 ){
                            swal("支持QQ音乐的歌曲以及MV下载，注意只能进入音乐单曲或者MV的播放页面点击播放后 方可正常使用本菜单的音乐下载功能。例如https://y.qq.com/n/ryqq/player以及https://y.qq.com/n/ryqq/mv/z0039dkb7hz");

                        }

                    }
                    if (location.href.indexOf("kugou.com") > 0 ){
                        var  kugouzcvs=0;
                        if (location.href.indexOf("/song/#hash=") >=0 ){

                            var  musicname="";
                            if($(".audioName").length>0){
                                musicname=$(".audioName").text();
                            }


                            GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+$("audio").attr("src")+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+$("audio").attr("src")+'" download="'+$("audio").attr("src")+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 100px;"><source src="'+$("audio").attr("src")+'"  ></video>');
                            GM_openInTab(ozlurlmusic, {active: !0});

                            kugouzcvs=1;

                        }


                        if (location.href.indexOf("kugou.com/ts/") >=0 ){

//return
                            if (location.href.indexOf("html") >0){
                                kugouzcvs=1;
                                if(hash && album_id && album_audio_id){
                                    var  musicname="";
                                    var  musicurl=false;
                                    var koog ='https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash='+hash+'&album_id='+album_id+'&album_audio_id='+album_audio_id+'';


                                    GM_xmlhttpRequest({
                                        url: koog,
                                        method: 'GET',
                                        timeout: 10000,
                                        headers: {
                                            'Content-Type': 'application/jsonp',
                                            'Accept': 'application/jsonp',
                                            'Cache-Control': 'public'
                                        },
                                        onload: function(res){
                                            try{
                                                const t = JSON.parse(res.responseText);

                                                musicname=t.data.audio_name;

                                                if (t.data.play_backup_url){
                                                    musicurl=t.data.play_backup_url;

                                                    GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+musicurl+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+musicurl+'" download="'+musicurl+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+musicurl+'"  ></video>');

                                                    GM_openInTab(ozlurlmusic, {active: !0});


                                                }else{
                                                    swal("此音频仅限酷狗客户端使用，因此无法被解析下载");
                                                }

                                            }catch(e){
                                                swal("解析下载地址失败");
                                            }
                                        }
                                    });
                                }

                                //	swal("请先点击播放需要下载的音频，再点击本菜单的下载按钮");

                            } else{
                                swal("必须先点击播放需要下载的音乐并进入此类播放页面 https://www.kugou.com/ts/xiangsheng/8873275/110800114.html 方可正常使用本菜单的音乐下载功能。注意只能是音乐单曲播放页面");
                            }

                        }
                        if (kugouzcvs==0){
                            swal("支持酷狗音乐的歌曲以及听书下载，注意只能进入音乐单曲播放页面 方可正常使用本菜单的音乐下载功能。例如https://www.kugou.com/song/#hash=8D288C3652EABA7CA6EF6CEF790CE9AC&album_id=2996291以及https://www.kugou.com/ts/xiaoshuo/40209350/281880449.html");
                        }
                    }

                    if (location.href.indexOf("qingting.fm") > 0 ){
                        var qingtingzcvs=0;
                        if (location.href.indexOf("/channels/") > 0 && location.href.indexOf("/programs/") > 0 ){
                            var  musicname='';
                            var  musicurl='';
                            qingtingzcvs=1;
                            var koog ='http://v1.ak47.ink:8102/?'+location.href;
                            GM_xmlhttpRequest({
                                url: koog,
                                method: 'GET',
                                timeout: 10000,
                                headers: {
                                    'Content-Type': 'application/jsonp',
                                    'Accept': 'application/jsonp',
                                    'Cache-Control': 'public'
                                },
                                onload: function(res){
                                    try{
                                        const t = res.responseText;



                                        if (t.indexOf("qingting.fm") > 0 ){
                                            musicname=$("h1").text();
                                            musicurl=t;

                                            GM_setValue('gomusic', '<h1>'+musicname+'</h1><div><table  style="width: 720px;">  <tr><td>项目</td><td><input  style="width: 500px;" type="text" value="'+musicname+'"></td></tr> <tr><td>下载地址</td><td><input style="width: 500px;" type="text" value="'+musicurl+'" ></td></tr> </table></div><div style="margin-top: 50px;"><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+musicurl+'" download="'+musicurl+'"   >下载：右键此处另存为即可保存</a></div><video controls="" autoplay="" name="media" style="width:500px;height: 350px;"><source src="'+musicurl+'"  ></video>');

                                            GM_openInTab(ozlurlmusic, {active: !0});


                                        }else{
                                            swal("此音频可能是VIP视频，暂时无法被解析下载");
                                        }

                                    }catch(e){
                                        swal("解析下载地址失败");
                                    }
                                }
                            });
                        }else{
                            swal("注意只能在单集单曲的播放页面、例如此类页面https://www.qingting.fm/channels/332552/programs/13603766方可正常使用本菜单的下载功能。注意只能是单集播放页面");
                        }
                    }
                });




                if (GM_getValue('menu_top')) {
                    adsideNav.style.top = GM_getValue('menu_top');

                }
                if (GM_getValue('menu_right')) {
                    adsideNav.style.right = GM_getValue('menu_right');

                }


            }

            if ((vurl.indexOf("v.qq.com") > 0 || vurl.indexOf(".youku.com") > 0|| vurl.indexOf(".bilibili.com/") > 0 || vurl.indexOf(".iqiyi.com") > 0|| vurl.indexOf(".mgtv.com") > 0|| vurl.indexOf(".le.com") > 0 || vurl.indexOf(".sohu.com") > 0) ){




                var now = $.now();




                $("body").append(siddenav);
                addStyle(siddecss);
                var ua = navigator.userAgent;
                /Safari|iPhone/i.test(ua) && 0 == /chrome/i.test(ua) && $("#zhe_nav").addClass("no-filter");
                var drags = {down: !1, x: 0, y: 0, winWid: 0, winHei: 0, clientX: 0, clientY: 0}, adsideNav = $("#zhe_nav")[0],
                    getCss = function (a, e) {
                        return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e]
                    };
                $("#zhe_nav").on("mousedown", function (a) {
                    drags.down = !0, drags.clientX = a.clientX, drags.clientY = a.clientY, drags.x = getCss(this, "right"), drags.y = getCss(this, "top"), drags.winHei = $(window).height(), drags.winWid = $(window).width(), $(document).on("mousemove", function (a) {
                        if (drags.winWid > 640 && (a.clientX < 120 || a.clientX > drags.winWid - 50))
                            return !1;
                        if (a.clientY < 180 || a.clientY > drags.winHei - 120)
                            return !1;
                        var e = a.clientX - drags.clientX,
                            t = a.clientY - drags.clientY;
                        adsideNav.style.top = parseInt(drags.y) + t + "px";
                        adsideNav.style.right = parseInt(drags.x) - e + "px";
                        GM_setValue('menu_top', parseInt(drags.y) + t + "px");
                        GM_setValue('menu_right', parseInt(drags.x) - e + "px");
                    })
                }).on("mouseup", function () {
                    drags.down = !1, $(document).off("mousemove")
                });
                $('html').on('click', '[data-cat=gogob]', function () {
                    GM_setValue('govideo', location.href);
                    if (vurl.indexOf(".bilibili.com/") > 0  && ozlurlvideo.indexOf("?") < 0 ){
                        ozlurlvideo=ozlurlvideo+"?p=10";
                    }

                    GM_openInTab(ozlurlvideo, {active: !0});
                });







                if (GM_getValue('menu_top')) {
                    adsideNav.style.top = GM_getValue('menu_top');

                }
                if (GM_getValue('menu_right')) {
                    adsideNav.style.right = GM_getValue('menu_right');

                }




            }
            if (vurl.indexOf(ozlurlmusic) >= 0  ){
                if (GM_getValue('gomusic')){
                    $('body').append(GM_getValue('gomusic'));
                    GM_deleteValue('gomusic');
                }
            }
            if (vurl.indexOf(ozlurlvideo) >= 0  ){
                if (GM_getValue('govideo')){
                    $("#inputUrl").attr('value',GM_getValue('govideo'));
                    $("#btnOk").click();
                    GM_deleteValue('govideo');

                }
            }
            if (vurl.indexOf("www.x.com/?from=100000") >= 0  ){
                window.location.href=ozlurlvideo;
            }
            if (vurl.indexOf("www.x.com/?from=100001") >= 0  ){
                window.location.href=ozlurldh;
            }
        }

// 1
        if(baidspjayumin.search("zhihu.com")> 0) {
            if ($('.VideoCard').length > 0 &&  $('#zdksp_0').length <= 0 &&  $('.zdkspzh').length <= 0  ) {
                $('.VideoCard').before('<a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;"  class="zdkspzh" id="zdk_down" >下拉网页或者滑动鼠标中间可显示视频下载按钮</a>' );
            }
            $(window).scroll(function(event){
                if ($('.zdkspzh').length > 0) {
                    $(".zdkspzh").hide();
                }
                $("iframe").each(function(key, val){

                    if ($('#zdksp_'+key).length <= 0) {
                        var      zkld_play_url=$(this).attr("src");
                        if ($('#zdksp_'+key).length <= 0 ) {
                            $('.VideoCard').eq(key).before('<a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+zkld_play_url+'"   id="zdksp_'+key+'" >视频地址：</a><input style="width:100%"    value="'+zkld_play_url+'" > ');

                        }
                    }



                })
            });
        }


        if (vurl.search("weixin.qq.com/s")>=0){


            setTimeout(function(){

                if ($("mpvoice[class='rich_pages']").length > 0 &&  $('.zdkwxyyzh').length <= 0  ) {

                    $("mpvoice[class='rich_pages']").before('<a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;"  class="zdk_yydown" id="zdk_yydown" >音乐地址正在加载中...</a>' );

                    $("mpvoice[class='rich_pages']").each(function(key, val){

                        if ($('#zdkyy_'+key).length <= 0) {


                            if ($('.zdk_yydown').length > 0) {
                                $(".zdk_yydown").hide();
                            }

                            if ($('#zdkyy_'+key).length <= 0 ) {
                                $("mpvoice[class='rich_pages']").eq(key).before('<br><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="https://res.wx.qq.com/voice/getvoice?mediaid='+$(this).attr("voice_encode_fileid")+'" download="'+document.title+'_'+key+'.MP4"  id="zdkyy_'+key+'" >音乐下载'+$(this).attr("name")+'：右键此处另存为可保存本音频</a> <br> ');
                            }


                        }
                    })
                }
            }, 2000);
            setTimeout(function(){
                var zkasrc=""


                if ($("img").length > 0 &&  $('.zdkwxyyzh').length <= 0  ) {

                    $("img").each(function(key, val){
                        zkasrc=$(this).attr("data-src");
                        if(typeof(zkasrc)=="undefined"){		}else{

                            if ($('#zdktp_'+key).length <= 0) {


                                if ($('#zdktp_'+key).length <= 0 ) {
                                    $(this).attr('src',$(this).data("src"));
                                    $(this).attr('id','zdktp_'+key );
                                }
                            }

                        }
                    })
                }   }, 3000);
            if ($('.video_iframe.rich_pages').length > 0 &&  $('.zdkwxspzh').length <= 0  ) {

                $('.video_iframe').before('<a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;"  class="zdkwxspzh" id="zdk_down" >视频地址正在加载中...</a>' );
                var zkdspdz="https://mp.weixin.qq.com/mp/videoplayer?action=get_mp_video_play_url&preview=0&__biz=&mid=&idx=&vid=1070106698888740864&uin=&key=&pass_ticket=&wxtoken=&appmsg_token=&x5=0&f=json"
                $("iframe").each(function(key, val){
                    if ($('#zdksp_'+key).length <= 0) {


                        if ($('.zdkwxspzh').length > 0) {
                            $(".zdkwxspzh").hide();
                        }
                        function renderSize(value){
                            if(null==value||value==''){
                                return "0 Bytes";
                            }
                            var unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
                            var index=0;
                            var srcsize = parseFloat(value);
                            index=Math.floor(Math.log(srcsize)/Math.log(1024));
                            var size =srcsize/Math.pow(1024,index);
                            size=size.toFixed(2);
                            return size+unitArr[index];
                        }

                        GM_xmlhttpRequest({
                            method : "GET",
                            dataType: "json",
                            url : zkdspdz.replace("1070106698888740864",$(this).data("mpvid")),

                            onload : function (response) {
                                var rsp = JSON.parse(response.responseText);



                                if ($('#zdksp_'+key).length <= 0 ) {
                                    $('.video_iframe.rich_pages').eq(key).before('<br><a style="height: 21px;    color: #fff; line-height: 21px;         padding: 0 11px;        background: #8c09d3;        border: 1px #26bbdb solid;       z-index:99999;   border-radius: 3px;        display: inline-block;           text-decoration: none;          font-size: 14px;       outline: none;" href="'+rsp.url_info[0].url+'" download="'+document.title+'_'+key+'.MP4"  id="zdksp_'+key+'" >视频下载'+renderSize(rsp.url_info[0].filesize)+'：右键此处另存为可保存本视频</a> <br>（提醒：只能下载公众号的素材视频，不提供第三方视频网站的下载。例如：腾讯视频之类的） ');
                                }
                            }
                        });

                    }
                })
            }	  	  }


    }
    function addtool() {
        GM_openInTab(ozlurldh, {active: !0});
    }
    $('body').on('click', '[data-cat=gogoc]', function () {
        addtool();
    });
    $('body').on('click', '[data-cat=gogoe]', function () {
        GM_openInTab('http://dian.dadiyouhui.cn/fl.htm', {active: !0});
    });
    $('body').on('click', '[data-cat=gogoa]', function () {
        GM_openInTab('http://op.dadiyouhui.cn/url/rnXfb5', {active: !0});
    });
})