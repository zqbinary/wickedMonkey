// ==UserScript==
// @name         希赛选题
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        https://wangxiao.xisaiwang.com/tiku2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xisaiwang.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant       GM_registerMenuCommand

// ==/UserScript==
// 用于希赛做题的优化
// 支持双击题目，打开视频讲解
// 支持按 .，自动跳到下一题
// 格式化，标题格式化
// 视频默认1.5倍 
(function () {
	'use strict';
	GM_addStyle('.lh2{position: fixed!important;left: 0;top: 20px;}')
	//GM_addStyle('.daan_sty{display: none!important}')

	let question = ''
	function getAnswer() {
		let answerDom = document.querySelector("#paperWrap2 > div")

		if (!answerDom) {
			return
		}
		let found = document.querySelector('.tw_tab>.on')
		if (found && found.style.display == 'block') {
			return
		}
		let found1 = document.querySelector("#paperWrap2 > div > div:nth-child(2) > div.tknew.doPane.question")
		if (found1) {
			found1.click()
		}

	}
	function initVideo() {

		let videoElement = document.querySelector('video')
		if (!videoElement) {
			return;
		}

		GM_addStyle('#player{width:100%!important;}')

		videoElement.playbackRate = 1.5
		videoElement.webkitRequestFullscreen();
		videoElement.play()
	}

	function doubleClickHandler(event) {
		setTimeout(() => {
			initVideo()
		}, 1000)
	}

	function findCatText(inputString) {

		let inputArr = inputString.split('>')
		let inputSplit = inputArr[inputArr.length - 1]
		if (inputSplit.includes('；')) {
			inputSplit = inputSplit.slice(0, -1)
		}
		return inputSplit
	}
	function changeAnswerState() {
		[...document.querySelectorAll(".daan_sty")].forEach(item => {
			if (item.style.display.includes('none')) {
				item.style.cssText = "display: block !important";
			} else {
				item.style.cssText = "display: none !important";
			}
		})

	}
	function setTitle() {
		let question_new = document.querySelector("#paperWrap > div.single-content.row > div.lh2").innerText
		let catDom = document.querySelector("#paperWrap2 > div > div:nth-child(2) > div.shitiDesp.pdt15 > div:nth-child(2) > span:nth-child(2)")
		//debugger
		let cat_txt
		if (catDom) {
			cat_txt = catDom.innerText
			let cat_html = '<span>' + catDom.innerText + '</span>'
			let question_new_arr = question_new.split('|')
			if (question_new_arr[1] && question_new_arr[1] === cat_txt) {
				return
			}
			question_new = [question_new_arr[0], cat_html].join('|')
			document.querySelector("#paperWrap > div.single-content.row > div.lh2").innerHTML = question_new
		}
		if (question_new !== question) {
			question = question_new
			GM_setClipboard(findCatText(cat_txt))
			setTimeout(getAnswer, 1000)
			let answerEndDom = document.querySelector(".answerEnd")
			if (answerEndDom) {
				answerEndDom.addEventListener('click', changeAnswerState)
			}
			//changeAnswerState()
		}
	}


	function main() {
		let paper = document.querySelector("#paperWrap")
		if (!paper) {
			return
		}
		paper.addEventListener('dblclick', doubleClickHandler);
		setInterval(setTitle, 1000);
		document.addEventListener('keydown', function (event) {
			//下一题
			if ('.' === event.key) {
				document.querySelector("#exeModeMsg > div.col-md-4.center.bp20.bRightWrap").click()
			}
		});
	}

	main();
	GM_registerMenuCommand(`显示答案`, changeAnswerState)

})();