import LocomotiveScroll from 'locomotive-scroll';
import { Swiper, Navigation, Pagination, Keyboard, Mousewheel, FreeMode, Autoplay } from 'swiper';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import barba from '@barba/core';
import imagesLoaded from 'imagesloaded';
import intlTelInput from 'intl-tel-input';
import * as JQuery from "jquery";
import createjs from 'preload-js';
const $ = JQuery.default;
Swiper.use([Navigation, Pagination, Keyboard, Mousewheel, FreeMode, Autoplay]);

console.log("%cMade with <3 by DashDigital®", "font-size: 12px; line-height: 24px; font-family: 'Founders Grotesk';");

/*!
 * * * * * * * * * * * Split text
 */

function splitText(selector, mode, once) {
	function getLines(el) {
		var lines = [];
		var line = [];
		var inners = el.querySelectorAll(".inner");
		var lastTop;
		for (var i = 0; i < inners.length; i++) {
			var inner = inners[i];
			if (inner.offsetTop != lastTop) {
				if (!inner.classList.contains('whitespace')) {
					lastTop = inner.offsetTop;
					line = [];
					lines.push(line);
				} else {
					inner.remove()
				}
			}
			line.push(inner);
		}
		return lines
	};

	function splitInner(selector) {
		var elements = document.querySelectorAll(selector);
		elements.forEach(function (element) {
			element.dataset.splitText = element.textContent;
			const wordArray = element.innerHTML.split("<br>").map(function (lineBreak) {
				return lineBreak.split(/\s/).map(function (word) {
					return word.split("-").map(function (word) {
						return "<div class='word inner'>" + word + "</div>";
					}).join("<div class='word inner'>-</div>");
				}).join("<div class='whitespace inner'>&nbsp;</div>");
			}).join("<br>");
			
			element.innerHTML = wordArray;
		});
	}

	function splitLines(selector) {
		var elements = document.querySelectorAll(selector);
		splitInner(selector);
		elements.forEach(function (element) {
			var lines = getLines(element);
			var wrappedLines = "";
			lines.forEach(function (wordArray) {
				wrappedLines += "<div class='linemask'><div class='line'>";
				wordArray.forEach(function (inner) {
					wrappedLines += inner.innerText;
				});
				wrappedLines += "</div></div>";
			});
			element.innerHTML = wrappedLines;
		});
	}

	function splitWords(selector) {
		splitLines(selector);
		var lines = document.querySelectorAll('.line');
		lines.forEach(function (line) {
			const wrappedWords = line.innerHTML.split("&nbsp;").map(function (wordDash) {
				return wordDash.split("-").map(function (word) {
					if (word != "") {
						return "<div class='wordmask mask'><div class='word inner'>" + word + "</div></div>";
					}
				}).join("<div class='wordmask mask'><div class='word inner'>-</div></div>");
			}).join("<div class='whitespace inner'>&nbsp;</div>");
			line.innerHTML = wrappedWords;
		});
	}

	function splitChars(selector) {
		splitLines(selector);
		var lines = document.querySelectorAll('.line');
		lines.forEach(function (line) {
			const wrappedWords = line.innerHTML.split("&nbsp;").map(function (word) {
				return word.split("-").map(function (word) {
					var chars = word.split('').map(function (char) {
						return "<div class='charmask mask'><div class='char inner'>" + char + "</div></div>";
					});
					return "<div class='wordmask mask'><div class='word inner'>" + chars.join('') + "</div></div>";
				}).join("<div class='wordmask mask'><div class='word inner'>-</div></div>");
			}).join("<div class='whitespace inner'>&nbsp;</div>");
			line.innerHTML = wrappedWords;
		});
	}

	function removeLastSpace() {
		var allLines = document.querySelectorAll(".line");
		for (var i = 0; i < allLines.length; i++) {
			if (allLines[i].outerHTML == '<div class="line"></div>') {
				allLines[i].parentElement.remove()
			} else if (allLines[i].lastElementChild.classList.contains("whitespace")) {
			allLines[i].lastElementChild.remove()
			}
		}
	}

	var originalArray = [];
	const originalElements = document.querySelectorAll(selector);
	originalElements.forEach(function (element) {
		originalArray.push(element.innerHTML);
	});
	if (mode == "chars") {
		splitChars(selector);
		if (once == false) {
			window.addEventListener("resize", function (event) {
				currentElements = document.querySelectorAll(selector);
				for (var i = 0; i < currentElements.length; i++) {
					currentElements[i].innerHTML = originalArray[i];
				}
				splitChars(selector);
			}, true);
		}
	} else if (mode == "words") {
		splitWords(selector);
		if (once == false) {
			window.addEventListener("resize", function (event) {
				currentElements = document.querySelectorAll(selector);
				for (var i = 0; i < currentElements.length; i++) {
					currentElements[i].innerHTML = originalArray[i];
				}
				splitWords(selector);
			}, true);
		}
	} else if (mode == "lines") {
		splitLines(selector);
		if (once == false) {
			window.addEventListener("resize", function (event) {
				currentElements = document.querySelectorAll(selector);
				for (var i = 0; i < currentElements.length; i++) {
					currentElements[i].innerHTML = originalArray[i];
				}
				splitLines(selector);
			}, true);
		}
	}
  removeLastSpace()
	if (once == false) {
		window.addEventListener("resize", function (event) {
			removeLastSpace()
		}, true);
	}
}

/*!
 * * * * * * * * * * * isTouch
 */

function isTouch() {
	let check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
	document.querySelector('meta[name=viewport]').setAttribute(
		'content',
		'initial-scale=1.0001, minimum-scale=1.0001, maximum-scale=1.0001, user-scalable=no'
	);
}

/*!
 * * * * * * * * * * * Global Variables
 */

// MEDIA QUERY LIST
var isMobile = window.matchMedia("screen and (max-width: 479px)"),
	isTablet = window.matchMedia("screen and (min-width: 480px) and (max-width: 1023px)"),
	isDesktop = window.matchMedia("screen and (min-width: 1024px)"),
	isS = window.matchMedia("screen and (min-width: 1024px) and (max-width: 1279px)"),
	isM = window.matchMedia("screen and (min-width: 1280px) and (max-width: 1439px)"),
	isL = window.matchMedia("screen and (min-width: 1440px) and (max-width: 1919px)"),
	isXL = window.matchMedia("screen and (min-width: 1920px)");
	
// REGISTER GSAP PLUGINS
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

ScrollTrigger.config({
	autoRefreshEvents: "visibilitychange, DOMContentLoaded, load, resize"
});

// FORCE 3D ANIMATIONS TO REDUCE LAG
gsap.config({
	force3D: true
});

// APPLY LAG SMOOTHING TO GSAP TICKER
gsap.ticker.lagSmoothing()
gsap.ticker.fps(60)

// CREATE CUSTOM EASING
CustomEase.create("out", "0.33, 1, 0.68, 1");
CustomEase.create("inOut", "0.65, 0, 0.35, 1");
CustomEase.create("in", "0.32, 0, 0.67, 0");

// GLOBAL VARIABLES
var scroll,
	menuOpen = true,
	menuAni = false,
	filterOpen = false,
	filterAni = false,
	navfilterOpen = false,
	navfilterAni = false,
	contactOpen = false,
	lbOpen = false,
	lbAni = false,
	lbOnce = false,
	trAni = false,
	londonTime,
	ctTime,
	viewAni = false,
	gridOpen = true,
	listOpen = false,
	swiperArray = [],
	playListVideos,
	firstLoad = true,
	growAccordion,
	shrinkAccordion;

	// GLOBAL TIMELINES
let pageNameAni = gsap.timeline({
		paused: true
	}),
	openMenuTL = gsap.timeline({
		paused: true,
		defaults: {
			overwrite: "auto"
		}
	}),
	closeMenuTL = gsap.timeline({
		paused: true,
		defaults: {
			overwrite: "auto"
		}
	}),
	openMenuMobile = gsap.timeline({
		paused: true,
		defaults: {
			overwrite: "auto"
		}
	}),
	closeMenuMobile = gsap.timeline({
		paused: true,
		defaults: {
			overwrite: "auto"
		}
	}),
	footerNav = gsap.timeline({
		paused: true
	}),
	colorChange2 = gsap.timeline({
		paused: true
	}),
	colorChange = gsap.timeline({
		paused: true
	}),
	studioLandAni = gsap.timeline({
		delay: .7
	});

var tagline = document.querySelector(".menu-tagline"),
	menuLinks = document.querySelectorAll(".menu-links-inner"),
	menuCoutner = document.querySelectorAll(".menu-counter"),
	menuClose = document.querySelector(".mobile-menu-close"),
	menuLogo = document.querySelector(".nav__logo.menu-link-mobile"),
	menuBg = document.querySelector(".nav-menu-mobile-bg"),
	menuMobile = document.querySelector(".nav-menu-mobile");

/*!
 * * * * * * * * * * * Smooth Scroll
 */

// SMOOTH SCROLL FUNCTION
function initSmoothScroll(container) {
	scroll = new LocomotiveScroll({
		el: document.querySelector('[data-scroll-container]', container),
		smooth: true,
		multiplier: 1,
		getDirection: true,
		getSpeed: true,
		lerp: 0.12,
		class: "animate"
	});
	scroll.on("scroll", () => {
		try {
			ScrollTrigger.update()
		} catch {
			console.log("error on resize caught");
		}
	}), ScrollTrigger.scrollerProxy('[data-scroll-container]', {
		scrollTop(o) {
			return arguments.length ? scroll.scrollTo(o, 0, 0) : scroll.scroll.instance.scroll.y;
		},
		getBoundingClientRect: () => ({
			top: 0,
			left: 0,
			width: window.innerWidth,
			height: window.innerHeight
		}),
		pinType: document.querySelector('[data-scroll-container]', container).style.transform ? "transform" : "fixed"
	});
	ScrollTrigger.addEventListener("refresh", () => scroll.update());
	ScrollTrigger.refresh();
	// Debounced update on resize
	function debounce(func) {
		var timer;
		return function (event) {
			if (timer) clearTimeout(timer);
			timer = setTimeout(func, 200, event);
		};
	}
	window.addEventListener("resize", debounce(function (e) {
		ScrollTrigger.refresh();
	}));
}

/*!
 * * * * * * * * * * * Contact Form
 */

// CUSTOM CONTACT FORM SELECTOR
var x, i, j, l, ll, selElmnt, a, b, c, clicked;
clicked = false;
x = document.querySelectorAll(".custom-select");
l = x.length;
for (i = 0; i < l; i++) {
	selElmnt = x[i].getElementsByTagName("select")[0];
	ll = selElmnt.length;
	a = document.createElement("DIV");
	a.setAttribute("class", "select-selected");
	a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
	x[i].appendChild(a);
	b = document.createElement("DIV");
	b.setAttribute("class", "select-items select-hide");
	for (j = 1; j < ll; j++) {
		c = document.createElement("DIV");
		c.innerHTML = selElmnt.options[j].innerHTML;
		c.addEventListener("click", function (e) {
			var y, i, k, s, h, sl, yl;
			s = this.parentNode.parentNode.getElementsByTagName("select")[0];
			sl = s.length;
			h = this.parentNode.previousSibling;
			for (i = 0; i < sl; i++) {
				if (s.options[i].innerHTML == this.innerHTML) {
					s.selectedIndex = i;
					h.innerHTML = this.innerHTML;
					y = this.parentNode.getElementsByClassName("same-as-selected");
					yl = y.length;
					for (k = 0; k < yl; k++) {
						y[k].removeAttribute("class");
					}
					this.setAttribute("class", "same-as-selected");
					break;
				}
			}
			h.click();
			document.querySelector(".select-selected").style.color = "#000"
			document.querySelector("select").parentElement.nextElementSibling.style.cssText = "color: #9D9D9D; transform: scale(.75); top: 0";
		});
		b.appendChild(c);
	}
	x[i].appendChild(b);
	a.addEventListener("click", function (e) {
		e.stopPropagation();
		clicked = true;
		closeAllSelect(this);
		this.nextSibling.classList.toggle("select-hide");
		this.classList.toggle("select-arrow-active");
	});
}

function closeAllSelect(elmnt, event) {
	var x, y, z, i, xl, yl, arrNo = [];
	x = document.querySelectorAll(".select-items");
	y = document.querySelectorAll(".select-selected");
	z = document.querySelector("selector");
	xl = x.length;
	yl = y.length;
	for (i = 0; i < yl; i++) {
		if (elmnt == y[i]) {
			arrNo.push(i)
		} else {
			y[i].classList.remove("select-arrow-active");
		}
	}
	for (i = 0; i < xl; i++) {
		if (arrNo.indexOf(i)) {
			x[i].classList.add("select-hide");
		}
	}
	var items = $(".select-items")
	var selected = $(".select-selected")
	var selector = $(".selector")
	var validate = $(".custom-selector-validate .validate")
	setTimeout(() => {
		if (clicked === true) {
			if (items.hasClass("select-hide") && selected.text() == "CHOOSE A TOPIC*") {
				selector.addClass("invalid");
				selector.parent().addClass("invalid");
				selector.attr("aria-invalid", true);
				validate.addClass("message-visible");
				validate.attr('aria-hidden', false);
			}
			if (items.hasClass("select-hide") && selected.text() != "CHOOSE A TOPIC*") {
				selector.removeClass("invalid");
				selector.parent().removeClass("invalid");
				selector.attr("aria-invalid", false);
				validate.removeClass("message-visible");
				validate.attr('aria-hidden', true);
			}
		}
	}, 1);
}
$(document).on('click', function (event) {
	var target = $(event.target);
	if (!target.closest('.select-items').length) {
		closeAllSelect()
	}
});

var selected = document.querySelector(".select-selected")
if (selected.textContent == "CHOOSE A TOPIC*") {
	selected.style.color = "#fff"
}

// INTERNATIONAL PHONE NUMBER INPUT
function getIp(callback) {
	fetch('https://ipinfo.io/json?token=703c9eaa22664d', {
			headers: {
				'Accept': 'application/json'
			}
		})
		.then((resp) => resp.json())
		.catch(() => {
			return {
				country: 'ZA',
			};
		})
		.then((resp) => callback(resp.country));
}

const phoneInputField = document.querySelector("#phone");
const phoneValidation = document.querySelector(".validate-phone");
const phoneWrap = document.querySelector(".phone-wrap");
const phoneInput = intlTelInput(phoneInputField, {
	initialCountry: "auto",
	geoIpLookup: getIp,
	preferredCountries: ["ZA", "UK"],
	utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

const phoneLabel = document.querySelector(".phone-wrap .floating-label");
const itiDrop = document.querySelector(".iti.iti--allow-dropdown");
itiDrop.appendChild(phoneLabel)

function validatePhone() {
	if (phoneInputField.value != "") {
		if (phoneInput.isValidNumber()) {
			phoneInputField.classList.remove("invalid");
			phoneInputField.setAttribute("aria-invalid", false);
			phoneValidation.classList.remove("message-visible");
			phoneValidation.setAttribute('aria-hidden', true);
			phoneWrap.classList.remove("invalid");
		} else {
			phoneInputField.classList.add("invalid");
			phoneInputField.setAttribute("aria-invalid", true);
			phoneValidation.classList.add("message-visible");
			phoneValidation.setAttribute('aria-hidden', false);
			phoneWrap.classList.add("invalid");
		}
	} else {
		phoneInputField.classList.remove("invalid");
		phoneInputField.setAttribute("aria-invalid", false);
		phoneValidation.classList.remove("message-visible");
		phoneValidation.setAttribute('aria-hidden', true);
		phoneWrap.classList.remove("invalid");
	}
}

var validateTimerPhone;
phoneInputField.addEventListener("blur", () => {
	phoneInputField.value = phoneInput.getNumber();
	validatePhone()
});
phoneInputField.addEventListener("input", () => {
	clearTimeout(validateTimerPhone);
	validateTimer = setTimeout(() => {
		phoneInputField.value = phoneInput.getNumber();
		validatePhone()
	}, 1500);
});

// VALIDATION CHECKS
const validators = {
	required: element => element.value.length > 0,
	noNumbers: element => !element.value.match(/[0-9]/g),
	includeUsername: element => {
		if (element.value.split('@')[0] != "@") {
			return element.value.split('@')[0].length > 0;
		} else {
			return true;
		}
	},
	noInvalidCharsUsername: element => {
		let local = element.value.split('@')[0]
		return local.match(/[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]/g);
	},
	noStartDot: element => {
		if (element.value.split("")[0] == ".") {
			return false;
		} else {
			return true;
		}
	},
	usernameTooShort: element => element.value.split('@')[0].length > 1,
	noConsecutiveDot: element => !element.value.match(/(.*\.\.)/g),
	noEndDot: element => {
		let local = element.value.split('@')[0]
		if (local) {
			if (local.split("")[local.length - 1] == ".") {
				return false;
			} else {
				return true;
			}
		}
	},
	usernameTooLong: element => element.value.split('@')[0].length < 65,
	includeAt: element => element.value.match(/@/),
	oneAt: element => {
		var ch = '@';
		var count = element.value.split(ch).length - 1;
		if (count > 1) {
			return false;
		} else {
			return true;
		}
	},
	includeDomain: element => element.value.split('@')[1].length > 0,
	noInvalidCharsDomain: element => {
		let domain = element.value.split('@')[1]
		return domain.match(/[A-Za-z0-9-]/g);
	},
	noDomainStartDash: element => {
		let domain = element.value.split("@")[1]
		if (domain.split("")[0] == "-") {
			return false;
		} else {
			return true;
		}
	},
	noDomainEndDash: element => {
		let domainFull = element.value.split("@")[1]
		let domainName = domainFull.split(".")[0]
		if (domainName.split("")[domainName.length - 1] == "-") {
			return false;
		} else {
			return true;
		}
	},
	includeTLD: element => {
		let domainFull = element.value.split("@")[1]
		let domainSplit = domainFull.split(".")
		return domainSplit.length > 1
	},
	noEndStop: element => {
		let domain = element.value.split('@')[1]
		if (domain) {
			if (domain.split("")[domain.length - 1] == ".") {
				return false;
			} else {
				return true;
			}
		}
	},
	twoCharTLD: element => {
		let domainFull = element.value.split("@")[1]
		let TLD1 = domainFull.split(".")[1]
		let TLD2 = domainFull.split(".")[2]
		if (TLD1 && TLD2) {
			if (TLD1.length > 1 && TLD2.length > 1) {
				return true;
			} else {
				return false;
			}
		} else if (TLD1) {
			return TLD1.length > 1;
		} else {
			return true;
		}
	},
	noInvalidCharsTLD: element => {
		let domainFull = element.value.split("@")[1]
		let TLD = domainFull.split(/\.(.+)/)[1]
		return TLD.match(/[A-Za-z0-9-]/g);
	},
	lekka: element => element.value.length === 0,
};

// VALIDATE ELEMENT
function validateElement(element) {
	resetValidation(element);
	const rules = element.dataset.validate.split(" ");
	for (let i = 0; i < rules.length; i++) {
		let rule = rules[i];
		if (!validators[rule](element)) {
			markElementInvalid(element, rule);
			break;
		}
	}
}

function markElementInvalid(element, validatorName) {
	element.classList.add("invalid");
	element.setAttribute("aria-invalid", true);
	const feedbackMessage = element.parentNode.querySelector(`[data-validation-message=${validatorName}]`);
	feedbackMessage.classList.add("message-visible");
	feedbackMessage.setAttribute('aria-hidden', false);
}

const form = document.getElementById("email-form");
const formElements = Array.from(form.elements);

formElements.forEach(formElement => {
	if (!formElement.classList.contains("submit-button")) {
		if (!formElement.classList.contains("phone-input")) {
			formElement.addEventListener("blur", () => {
				validateElement(formElement);
			});
			var validateTimer;
			formElement.addEventListener("input", () => {
				clearTimeout(validateTimer);
				validateTimer = setTimeout(() => {
					validateElement(formElement);
				}, 1500);
			});
		}
	}
});

function resetValidation(element) {
	element.classList.remove("invalid");
	element.setAttribute("aria-invalid", false);
	element.parentNode.querySelectorAll("[data-validation-message]").forEach(e => {
		e.classList.remove("message-visible");
		e.setAttribute("aria-hidden", true);
	});
}

window.submitForm = function() {
	document.querySelector("form").addEventListener('submit', function () {

		let formIsValid = true;
		form.classList.remove("invalid");

		var items = $(".select-items")
		var selected = $(".select-selected")
		var selector = $(".selector")
		var validate = $(".custom-selector-validate .validate")

		if (items.hasClass("select-hide") && selected.text() == "CHOOSE A TOPIC*") {
			selector.addClass("invalid");
			selector.parent().addClass("invalid");
			selector.attr("aria-invalid", true);
			validate.addClass("message-visible");
			validate.attr('aria-hidden', false);
		}
		if (items.hasClass("select-hide") && selected.text() != "CHOOSE A TOPIC*") {
			selector.removeClass("invalid");
			selector.parent().removeClass("invalid");
			selector.attr("aria-invalid", false);
			validate.removeClass("message-visible");
			validate.attr('aria-hidden', true);
		}

		phoneInputField.value = phoneInput.getNumber();
		validatePhone()

		formElements.forEach(formElement => {
			if (!formElement.dataset) return;
			if (!formElement.dataset.validate) return;
			if (!formElement.classList.contains("phone-input") || !formElement.classList.contains("submit-button")) {
				validateElement(formElement);
			}
		});

		formIsValid = form.querySelectorAll(".invalid").length === 0;

		if (formIsValid) {
			setTimeout(function() { location.reload(true); }, 5000);
			return true
		} else {
			return false
		}
	});
}

// OPEN/CLOSE CONTACT FORM
window.openContact = function() {
	$("body").css("overflow", "hidden")
	var tlOverlay = gsap.timeline({});
	tlOverlay.to(".contact", {
			visibility: "visible",
			transform: "translateY(0%)",
			duration: .75,
			ease: "inOut",
		})
		.to(".contact-overlay", {
			visibility: "visible",
			opacity: 1,
			duration: .75,
			ease: "inOut",
		}, "<")
}

function closeContact() {
	$("body").css("overflowY", "scroll")
	var tlOverlay2 = gsap.timeline({});
	tlOverlay2.to(".contact", {
			transform: "translateY(100%)",
			duration: .75,
			ease: "inOut",
		})
		.to(".contact-overlay", {
			opacity: 0,
			duration: .75,
			ease: "inOut",
		}, "<")
		.to(".contact-overlay", {
			visibility: "hidden"
		})
		.to(".contact", {
			visibility: "hidden"
		}, "<")
}

$(".menu-links.contact-link").on("click", function () {
	openContact()
});

$(".close-contact-button").on("click", function () {
	closeContact()
});
$(".success-message").height($(".form-content").height())

/*!
 * * * * * * * * * * * 
 */

if (document.querySelector(".preloader").style.visibility != "hidden") {
	document.querySelector("body").style.overflow = "hidden"
}

// PREVENT RELOAD ON SAME PAGE
$(document).on('click', 'a[href]', function (e) {
	if (e.currentTarget.href === window.location.href) {
		e.preventDefault();
		e.stopPropagation();
	}
});

// REMOVE HTML EXTENSION
function removeHTMLExt() {	
	document.querySelectorAll("a:not([fs-link])").forEach(function (link) {	
		var href = link.getAttribute("href").toString()	
		if (href.includes(".html")) {	
			var replaced = link.getAttribute("href").replace(".html", "")	
			link.setAttribute("href", replaced)	
		}	
	});	
}

// CUSTOM DRAG CURSOR
const cursor = document.querySelector('.cursor');
gsap.set(cursor, {
	xPercent: 30,
	yPercent: 70
});
document.addEventListener('pointermove', movecursor);

function movecursor(e) {
	gsap.to(cursor, {
		duration: 0,
		x: e.clientX,
		y: e.clientY
	})
}

function hoverFunc(e) {
	gsap.fromTo(cursor, {
		autoAlpha: 0
	}, {
		autoAlpha: 1,
		duration: 0.3,
		ease: "in"
	})
}

function unhoverFunc(e) {
	gsap.fromTo(cursor, {
		autoAlpha: 1
	}, {
		autoAlpha: 0,
		duration: 0.3,
		ease: "out"
	})
}

// CASE STUDY MOBILE MENU COUNT
const csCounter = $('.cs-count').length;
$('.cs-counter').text(('0' + csCounter).slice(-2));

// WORK MOBILE MENU COUNT
const workCounter = $('.work-count').length;
$('.work-counter').text(('0' + workCounter).slice(-2));

// ACTIVE PAGE INDICATOR MOBILE MENU
function updateMenu(url) {
	const active = document.querySelector('.menu-links-mobile-wrap a.active');
	if (active !== null) {
		active.classList.remove('active');
		active.parentElement.classList.remove('active');
	}
	const links = Array.from(document.querySelectorAll('.menu-links-mobile-wrap a'));
	const linksHref = links.map(link => link.href)
	const index = linksHref.findIndex((href) => {
		return href.indexOf(url) !== -1;
	});
	if (index !== -1) {
		links[index].classList.add('active');
		links[index].parentElement.classList.add('active');
	}
}

// MOBILE NAV COLOR CHANGE OVER FOOTER
function mobileNav(colorFrom, colorTo) {
	ScrollTrigger.create({
		trigger: ".footer-spacer",
		start: "0% 0%+=56px",
		end: "0% 0%",
		scrub: true,
		animation: gsap.fromTo(".nav", {
			backgroundColor: colorFrom
		}, {
			backgroundColor: colorTo
		})
	});
}

function handleMobileOnce(isMobile) {
	if (isMobile.matches) {
		// MOBILE

		// UPDATE ACTIVE PAGE INDICATOR MOBILE MENU
		updateMenu(window.location.href)
		menuOpen = false;

		// UPDATE HEIGHT ON RESIZE FOR MOBILE
		function reportWindowSize() {
			const height = window.innerHeight;
			document.querySelector(".preloader").style.height = height + "px";
			document.querySelector(".nav-menu-mobile").style.height = height + "px";
			document.querySelector(".transition").style.height = height + "px";
			document.querySelector(".contact").style.height = (height - 56) + "px";
		}
		reportWindowSize();
		window.addEventListener('resize', reportWindowSize);

		closeMenuMobile.fromTo(tagline, {
				autoAlpha: 1
			}, {
				autoAlpha: .01,
				duration: .3,
				ease: "out",
				onStart: function () {
					menuAni = true
				}
			})
			.fromTo(menuLinks, {
				y: 0
			}, {
				y: "-140%",
				duration: .3,
				stagger: -.05,
				ease: "out"
			}, "<10%")
			.fromTo(menuCoutner, {
				x: 0
			}, {
				x: "-100%",
				duration: .3,
				stagger: -.05,
				ease: "out"
			}, "<10%")
			.fromTo(menuClose, {
				y: 0
			}, {
				y: "-140%",
				duration: .3,
				ease: "out"
			}, "<20%")
			.fromTo(menuLogo, {
				y: 0
			}, {
				y: "-140%",
				duration: .3,
				ease: "out"
			}, "<20%")
			.to(menuBg, {
				y: "-100%",
				duration: .6,
				ease: "out"
			}, "<30%")
			.to(menuMobile, {
				visibility: "hidden",
				duration: .001,
				onComplete: function () {
					menuAni = false;
					menuOpen = false
				}
			})

		openMenuMobile.to(menuMobile, {
				visibility: "visible",
				duration: .001,
				onStart: function () {
					menuAni = true
				}
			})
			.to(menuBg, {
				y: "0vh",
				duration: .6,
				ease: "out"
			})
			.fromTo(menuLogo, {
				y: "-140%"
			}, {
				y: 0,
				duration: .3,
				ease: "out"
			}, "<20%")
			.fromTo(menuClose, {
				y: "-140%"
			}, {
				y: 0,
				duration: .3,
				ease: "out"
			}, "<20%")
			.fromTo(menuLinks, {
				y: "-140%"
			}, {
				y: 0,
				duration: .3,
				stagger: .05,
				ease: "out"
			}, "<30%")
			.fromTo(menuCoutner, {
				x: "-100%"
			}, {
				x: 0,
				duration: .3,
				stagger: .05,
				ease: "out"
			}, "<30%")
			.fromTo(tagline, {
				autoAlpha: .01
			}, {
				autoAlpha: 1,
				duration: .3,
				ease: "out",
				onComplete: function () {
					menuAni = false;
					menuOpen = true
				}
			}, "<40%")

		// OPEN MENU ON CLICK
		$(".menu-btn").on("click", function () {
			$("body").css("overflow", "hidden");
			openMenuMobile.play(0);
		});

		$(".close-btn").on("click", function () {
			if (menuOpen === true && menuAni === false) {
				$("body").css("overflow", "visible");
				closeMenuMobile.play(0);
			}
		});

		$(".menu-link-mobile").on("click", function () {
			var thisLink = window.location.origin + $(this).attr("href")
			if (thisLink == window.location.href || $(this).hasClass("contact-link")) {} else {
				$("body").css("overflow", "visible");
				setTimeout(function () {
					gsap.set(".nav-menu-mobile", {
						visibility: "hidden"
					});
				}, 1000);
			}
		});

	} else {
		return
	}
}

function handleTabletOnce(isTablet) {
	if (isTablet.matches) {
		// TABLET
	} else {
		return
	}
}

function handleDesktopOnce(isDesktop) {
	if (isDesktop.matches) {
		// DESKTOP

		// SHOW CURSOR FOR DESKTOP
		$('.cursor').css("display", "block")

		var dash = document.querySelector(".dash"),
			currentPage = document.querySelector(".nav__current-page"),
			menuLinksD = document.querySelectorAll(".menu-links"),
			navMenuLink = document.querySelector(".nav__menulink");

		pageNameAni.to(dash, {
				width: "100%",
				duration: 0.3,
				ease: "inOut"
			})
			.to(currentPage, {
				y: "0%",
				duration: 0.3,
				stagger: 0.05,
				ease: "inOut"
			}, '<10%');

		openMenuTL = gsap.timeline({
				paused: true,
				defaults: {
					overwrite: "auto"
				}
			}),
			closeMenuTL = gsap.timeline({
				paused: true,
				defaults: {
					overwrite: "auto"
				}
			});

		openMenuTL.fromTo(navMenuLink, {
				y: "0%"
			}, {
				y: "120%",
				duration: 0.3,
				ease: "out",
				onStart: function () {
					menuAni = true;
					$(".menu").css({
						"visibility": "visible"
					})
				}
			})
			.fromTo(menuLinksD, {
				y: "-120%"
			}, {
				y: "0%",
				stagger: 0.05,
				duration: 0.3,
				delay: 0.1,
				ease: "out",
				onComplete: function () {
					$(".menu-btn").css({
						"visibility": "hidden"
					});
					menuOpen = true;
					menuAni = false;
					openMenuTL.pause();
				}
			}, "<");

		closeMenuTL.fromTo(menuLinksD, {
				y: "0%"
			}, {
				y: "-120%",
				stagger: 0.05,
				duration: 0.3,
				ease: "out",
				onStart: function () {
					menuAni = true;
					$(".menu-btn").css({
						"visibility": "visible"
					})
				}
			})
			.fromTo(navMenuLink, {
				y: "120%"
			}, {
				y: "0%",
				duration: 0.3,
				delay: 0.4,
				ease: "out",
				onComplete: function () {
					$(".menu").css({
						"visibility": "hidden"
					});
					menuOpen = false;
					menuAni = false;
					closeMenuTL.pause()
				}
			}, "<");

		// OPEN MENU ON CLICK
		$(".menu-btn").on("click", function () {
			if (menuOpen === false && menuAni === false) {
				openMenuTL.play(0);
			}
		});

		var nav = document.querySelector(".nav");
		footerNav.fromTo(nav, {
				y: 0
			}, {
				y: "-56px",
				duration: .4,
				ease: "inOut"
			})
			.fromTo(nav, {
				visibility: "visible"
			}, {
				visibility: "hidden",
				duration: .001
			})

	} else {
		return
	}
}

handleMobileOnce(isMobile);
handleTabletOnce(isTablet);
handleDesktopOnce(isDesktop);
isMobile.addEventListener("change", handleMobileOnce);
isTablet.addEventListener("change", handleTabletOnce);
isDesktop.addEventListener("change", handleDesktopOnce);

/*!
 * * * * * * * * * * * Global
 */

function globalScript() {

	// INIT CURRENT PAGE NAME
	$(".nav__current-page").css("transform", "translateY(120%)");
	$(".dash").css("width", "0%");

	// FOOTER COPYRIGHT YEAR
	var dateYear = new Date();
	var getYear = dateYear.getUTCFullYear();
	$(".copyright").each(function () {
		$(this).text("©" + getYear);
	});

	// OPEN CONTACT FORM FROM FOOTER
	$(".footer-links.contact-link, .cta-footer-contact, .cta.contact-link, .menu-link-mobile.contact-link, .contact-link").on("click", function () {
		openContact()
	});

	// DEVICE SPECIFIC FUNCTIONS
	function handleMobileGlobal(isMobile) {
		if (isMobile.matches) {
			// MOBILE

			menuOpen = false;

			$(".btt").on("click", function () {
				$('html, body').animate({
					scrollTop: 0
				}, 800);
				ScrollTrigger.refresh();
			});

			// HIDE CURSOR FOR MOBILE
			document.querySelector('.cursor').style.display = "none";
			if (document.querySelector("body").classList.contains("work")) {
				document.querySelector('.work-cursor').style.display = "none";
			}

			// PLAY ALL VIDEOS ONCE PAGE HAS LOADED
			/*var vid = document.querySelectorAll("video");
			for (let i = 0; i < vid.length; i++) {
			  var playPromise = vid[i].play();
			  if (playPromise !== undefined) {
			    playPromise.then(_ => {})
			      .catch(error => {});
			  };
			};*/

		} else {
			return
		};
	};

	function handleTabletGlobal(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	};

	function handleDesktopGlobal(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			// RUN SPLIT TEXT
			if (document.querySelector("h1")) {
				if (!document.querySelector("h1.split").hasAttribute("data-split-text")) {
					splitText(".page-container .split", "words", true);
				}
			}

			// SET MENU TO OPEN IF CLOSED
			if (menuOpen === false) {
				gsap.set(".menu", {
					visibility: "visible"
				})
				gsap.set(".menu-btn", {
					visibility: "hidden"
				})
				gsap.set(".nav__menulink", {
					y: "120%"
				})
				gsap.set(".menu-links", {
					y: "0%"
				})
				menuOpen = true;
			};

			// SHOW/HIDE CURERNT PAGE NAME
			ScrollTrigger.create({
				scroller: "[data-scroll-container]",
				trigger: ".h100",
				start: "bottom top+=56px",
				end: "bottom top+=56px",
				onEnter: () => {
					pageNameAni.play()
				},
				onLeaveBack: () => {
					pageNameAni.reverse()
				},
			});

			// CUSTOM DRAG CURSOR ON HOVER
			//$(".client_home").hover(hoverFunc, unhoverFunc);
			//$(".client_cta").hover(unhoverFunc, function(){});
			$(".swiper_home").hover(hoverFunc, unhoverFunc);
			$(".swiper_work").hover(hoverFunc, unhoverFunc);
			//$(".team-swiper").hover(hoverFunc, unhoverFunc);
			$(".cs-swiper-con").hover(hoverFunc, unhoverFunc);
			$(".lightbox-single").hover(hoverFunc, unhoverFunc);
			$(".swiper-work-list").hover(hoverFunc, unhoverFunc);

			// CASE STUDY HOVER
			$(".feat-cs").each(function () {
				const featimage = $(this).find(".featured-work__image-wrap");
				$(this).hover(function () {
						featimage.css("border-radius", "50%");
					},
					function () {
						featimage.css("border-radius", "0%");
					});
			});

			// ACCORDION LINE ANIMATION ON HOVER
			$(".acc-list-item").hover(function () {
				gsap.fromTo($(this).find(".dark-list-line"), {
					x: "-100%"
				}, {
					x: "0%",
					duration: 1,
					ease: "expo.out"
				});
			}, function () {
				gsap.fromTo($(this).find(".dark-list-line"), {
					x: "0%"
				}, {
					x: "100%",
					duration: 1,
					ease: "expo.out"
				});
			});

			// FORM FIELD LINE ANIMATION ON HOVER
			$(".text-input").hover(function () {
					gsap.fromTo($(this).find(".input-line"), {
						x: "-100%"
					}, {
						x: "0%",
						duration: 0.5,
						ease: "expo.out"
					});
				},
				function () {
					gsap.fromTo($(this).find(".input-line"), {
						x: "0%"
					}, {
						x: "100%",
						duration: 0.5,
						ease: "expo.out"
					});
				});

			// FOOTER MOVEMENT
			if (document.querySelector(".page-container").getAttributeNode("data-barba-namespace").value != "case studies") {
				if (document.querySelectorAll(".footer").length) {
					gsap.set(".footer", {
						y: "-50%"
					})
					ScrollTrigger.create({
						scroller: '[data-scroll-container]',
						trigger: ".footer-spacer",
						start: "top bottom",
						end: "bottom bottom",
						scrub: true,
						animation: gsap.to(".footer", {
							y: "0%",
							ease: "none"
						}),
					});
					ScrollTrigger.create({
						scroller: '[data-scroll-container]',
						trigger: ".footer-spacer",
						start: "top bottom",
						onEnter: () => {
							footerNav.play(0)
						},
						onLeaveBack: () => {
							footerNav.reverse(0)
						},
					});
				};
			};

			$(".btt").on("click", function () {
				scroll.scrollTo('top');
			});

		} else {
			return;
		};
	};

	handleMobileGlobal(isMobile);
	handleTabletGlobal(isTablet);
	handleDesktopGlobal(isDesktop);
	isMobile.addEventListener("change", handleMobileGlobal);
	isTablet.addEventListener("change", handleTabletGlobal);
	isDesktop.addEventListener("change", handleDesktopGlobal);
};

/*!
 * * * * * * * * * * * CTAs
 */

function smallerContactBtn() {
	$(".contact-btn").each(function () {
		var bottom = $(this).find(".btn-bottom"),
			top = $(this).find(".btn-top"),
			topText = top.find(".btn-text"),
			bottomWidth = bottom.width(),
			topWidth = $(this).find(".btn-top").width(),
			height = top.height(),
			paddingRight = (bottom.outerWidth() - bottom.width()) / 2,
			paddingBottom = (bottom.outerHeight() - bottom.height()) / 2,
			difference = bottomWidth - topWidth + paddingRight,
			dotRight = (Math.round($(this).find(".btn-top").outerWidth()) - 17), //higher number bigger dot
			padInner = 6; // dot padding


		$(".submission").hover(() => {
			let tl = gsap.timeline({});
			tl.fromTo(bottom, {
					clipPath: "inset(0px " + difference + "px 0px 0px round 999px)"
				}, {
					clipPath: "inset(0px 0px 0px 0px round 999px)",
					duration: .3,
					ease: "inOut"
				})
				.fromTo(top, {
					clipPath: "inset(0px 0px 0px 0px round 999px)"
				}, {
					clipPath: "inset(" + padInner + "px " + dotRight + "px " + padInner + "px " + padInner + "px round 999px)",
					duration: .3,
					ease: "inOut"
				}, "<")
				.fromTo(topText, {
					transform: "translate3d(0px, 0px, 0px)"
				}, {
					transform: "translate3d(16px, 0px, 0px)",
					duration: .3,
					ease: "inOut"
				}, "<")
		}, () => {
			let tl = gsap.timeline({});
			tl.fromTo(bottom, {
					clipPath: "inset(0px 0px 0px 0px round 999px)"
				}, {
					clipPath: "inset(0px " + difference + "px 0px 0px round 999px)",
					duration: .3,
					ease: "inOut"
				})
				.fromTo(top, {
					clipPath: "inset(" + padInner + "px " + dotRight + "px " + padInner + "px " + padInner + "px round 999px)"
				}, {
					clipPath: "inset(0px 0px 0px 0px round 999px)",
					duration: .3,
					ease: "inOut"
				}, "<")
				.fromTo(topText, {
					transform: "translate3d(16px, 0px, 0px)"
				}, {
					transform: "translate3d(0px, 0px, 0px)",
					duration: .3,
					ease: "inOut"
				}, "<")
		});

		bottom.css("clip-path", "inset(0px " + difference + "px 0px 0px round 999px)")
	});
}

function handleSContactCTA(isS) {
	if (isS.matches) {
		// S

		// BUTTON ANIMATION
		$(function () {
			smallerContactBtn()
		});

	} else {
		return
	}
}

function handleMContactCTA(isM) {
	if (isM.matches) {
		// M

		// BUTTON ANIMATION
		$(function () {
			smallerContactBtn()
		});

	} else {
		return
	}
}

function handleLContactCTA(isL) {
	if (isL.matches) {
		// L

		// BUTTON ANIMATION
		$(function () {
			smallerContactBtn()
		});

	} else {
		return
	}
}

function handleXLContactCTA(isXL) {
	if (isXL.matches) {
		// XL

		// BUTTON ANIMATION
		$(function () {
			$(".contact-btn").each(function () {
				var bottom = $(this).find(".btn-bottom"),
					top = $(this).find(".btn-top"),
					topText = top.find(".btn-text"),
					bottomWidth = $(this).find(".btn-bottom").width(),
					topWidth = $(this).find(".btn-top").width(),
					height = top.height(),
					paddingRight = (bottom.outerWidth() - bottom.width()) / 2,
					paddingBottom = (bottom.outerHeight() - bottom.height()) / 2,
					difference = bottomWidth - topWidth + paddingRight,
					dotRight = (Math.round($(this).find(".btn-top").outerWidth()) - 21), //higher number bigger dot
					padInner = 10; // dot padding

				$(".submission").hover(() => {
					let tl = gsap.timeline();
					tl.fromTo(bottom, {
							clipPath: "inset(0px " + difference + "px 0px 0px round 999px)"
						}, {
							clipPath: "inset(0px 0px 0px 0px round 999px)",
							duration: .3,
							ease: "inOut"
						})
						.fromTo(top, {
							clipPath: "inset(0px 0px 0px 0px round 999px)"
						}, {
							clipPath: "inset(" + padInner + "px " + dotRight + "px " + padInner + "px " + padInner + "px round 999px)",
							duration: .3,
							ease: "inOut"
						}, "<")
						.fromTo(topText, {
							transform: "translate3d(0px, 0px, 0px)"
						}, {
							transform: "translate3d(16px, 0px, 0px)",
							duration: .3,
							ease: "inOut"
						}, "<")
				}, () => {
					let tl = gsap.timeline();
					tl.fromTo(bottom, {
							clipPath: "inset(0px 0px 0px 0px round 999px)"
						}, {
							clipPath: "inset(0px " + difference + "px 0px 0px round 999px)",
							duration: .3,
							ease: "inOut"
						})
						.fromTo(top, {
							clipPath: "inset(" + padInner + "px " + dotRight + "px " + padInner + "px " + padInner + "px round 999px)"
						}, {
							clipPath: "inset(0px 0px 0px 0px round 999px)",
							duration: .3,
							ease: "inOut"
						}, "<")
						.fromTo(topText, {
							transform: "translate3d(16px, 0px, 0px)"
						}, {
							transform: "translate3d(0px, 0px, 0px)",
							duration: .3,
							ease: "inOut"
						}, "<")
				});

				bottom.css("clip-path", "inset(0px " + difference + "px 0px 0px round 999px)")
			});
		});

	} else {
		return
	}
}

handleSContactCTA(isS);
handleMContactCTA(isM);
handleLContactCTA(isL);
handleXLContactCTA(isXL);
isS.addEventListener("change", handleSContactCTA);
isM.addEventListener("change", handleMContactCTA);
isL.addEventListener("change", handleLContactCTA);
isXL.addEventListener("change", handleXLContactCTA);

function cta() {
	function smallerCTA() {
		$(".btn").each(function () {
			var bottom = $(this).find(".btn-bottom"),
				top = $(this).find(".btn-top"),
				topText = top.find(".btn-text"),
				bottomWidth = bottom.width(),
				topWidth = $(this).find(".btn-top").width(),
				height = top.height(),
				paddingRight = (bottom.outerWidth() - bottom.width()) / 2,
				paddingBottom = (bottom.outerHeight() - bottom.height()) / 2,
				difference = bottomWidth - topWidth + paddingRight,
				dotRight = (Math.round($(this).find(".btn-top").outerWidth()) - 16.5), //higher number bigger dot
				padInner = 6; // dot padding


			$(this).hover(() => {
				let tl = gsap.timeline({});
				tl.fromTo(bottom, {
						clipPath: "inset(0px " + difference + "px 0px 0px round 999px)"
					}, {
						clipPath: "inset(0px 0px 0px 0px round 999px)",
						duration: .3,
						ease: "inOut"
					})
					.fromTo(top, {
						clipPath: "inset(0px 0px 0px 0px round 999px)"
					}, {
						clipPath: "inset(" + padInner + "px " + dotRight + "px " + padInner + "px " + padInner + "px round 999px)",
						duration: .3,
						ease: "inOut"
					}, "<")
					.fromTo(topText, {
						transform: "translate3d(0px, 0px, 0px)"
					}, {
						transform: "translate3d(16px, 0px, 0px)",
						duration: .3,
						ease: "inOut"
					}, "<")
			}, () => {
				let tl = gsap.timeline({});
				tl.fromTo(bottom, {
						clipPath: "inset(0px 0px 0px 0px round 999px)"
					}, {
						clipPath: "inset(0px " + difference + "px 0px 0px round 999px)",
						duration: .3,
						ease: "inOut"
					})
					.fromTo(top, {
						clipPath: "inset(" + padInner + "px " + dotRight + "px " + padInner + "px " + padInner + "px round 999px)"
					}, {
						clipPath: "inset(0px 0px 0px 0px round 999px)",
						duration: .3,
						ease: "inOut"
					}, "<")
					.fromTo(topText, {
						transform: "translate3d(16px, 0px, 0px)"
					}, {
						transform: "translate3d(0px, 0px, 0px)",
						duration: .3,
						ease: "inOut"
					}, "<")
			});

			bottom.css("clip-path", "inset(0px " + difference + "px 0px 0px round 999px)")
		});
	}

	function handleSCTA(isS) {
		if (isS.matches) {
			// S

			// BUTTON ANIMATION
			$(function () {
				smallerCTA()
			});

		} else {
			return
		}
	}

	function handleMCTA(isM) {
		if (isM.matches) {
			// M

			// BUTTON ANIMATION
			$(function () {
				smallerCTA()
			});

		} else {
			return
		}
	}

	function handleLCTA(isL) {
		if (isL.matches) {
			// L

			// BUTTON ANIMATION
			$(function () {
				smallerCTA()
			});

		} else {
			return
		}
	}

	function handleXLCTA(isXL) {
		if (isXL.matches) {
			// XL

			// BUTTON ANIMATION
			$(function () {
				$(".btn").each(function () {
					var bottom = $(this).find(".btn-bottom"),
						top = $(this).find(".btn-top"),
						topText = top.find(".btn-text"),
						bottomWidth = $(this).find(".btn-bottom").width(),
						topWidth = $(this).find(".btn-top").width(),
						height = top.height(),
						paddingRight = (bottom.outerWidth() - bottom.width()) / 2,
						paddingBottom = (bottom.outerHeight() - bottom.height()) / 2,
						difference = bottomWidth - topWidth + paddingRight,
						dotRight = (Math.round($(this).find(".btn-top").outerWidth()) - 21), //higher number bigger dot
						padInner = 10; // dot padding

					$(this).hover(() => {
						let tl = gsap.timeline({});
						tl.fromTo(bottom, {
								clipPath: "inset(0px " + difference + "px 0px 0px round 999px)"
							}, {
								clipPath: "inset(0px 0px 0px 0px round 999px)",
								duration: .3,
								ease: "inOut"
							})
							.fromTo(top, {
								clipPath: "inset(0px 0px 0px 0px round 999px)"
							}, {
								clipPath: "inset(" + padInner + "px " + dotRight + "px " + padInner + "px " + padInner + "px round 999px)",
								duration: .3,
								ease: "inOut"
							}, "<")
							.fromTo(topText, {
								transform: "translate3d(0px, 0px, 0px)"
							}, {
								transform: "translate3d(16px, 0px, 0px)",
								duration: .3,
								ease: "inOut"
							}, "<")
					}, () => {
						let tl = gsap.timeline({});
						tl.fromTo(bottom, {
								clipPath: "inset(0px 0px 0px 0px round 999px)"
							}, {
								clipPath: "inset(0px " + difference + "px 0px 0px round 999px)",
								duration: .3,
								ease: "inOut"
							})
							.fromTo(top, {
								clipPath: "inset(" + padInner + "px " + dotRight + "px " + padInner + "px " + padInner + "px round 999px)"
							}, {
								clipPath: "inset(0px 0px 0px 0px round 999px)",
								duration: .3,
								ease: "inOut"
							}, "<")
							.fromTo(topText, {
								transform: "translate3d(16px, 0px, 0px)"
							}, {
								transform: "translate3d(0px, 0px, 0px)",
								duration: .3,
								ease: "inOut"
							}, "<")
					});

					bottom.css("clip-path", "inset(0px " + difference + "px 0px 0px round 999px)")
				});
			});

		} else {
			return
		}
	}

	handleSCTA(isS);
	handleMCTA(isM);
	handleLCTA(isL);
	handleXLCTA(isXL);
	isS.addEventListener("change", handleSCTA);
	isM.addEventListener("change", handleMCTA);
	isL.addEventListener("change", handleLCTA);
	isXL.addEventListener("change", handleXLCTA);
}

/*!
 * * * * * * * * * * * Home
 */

function homeScript() {

	// SET CASE STUDY WORK NUMBERS
	var featworknum = document.querySelectorAll(".featured-work__num");
	for (let i = 0; i < featworknum.length; i++) {
		featworknum[i].textContent = "00-" + (i + 1);
	}

	// SWIPER CLIENT CARDS
	const swiperClients = new Swiper(".client_home", {
		passiveListeners: true,
		grabCursor: true,
		slidesPerView: "auto",
		loop: true,
		loopedSlides: 8,
		freeMode: {
			enabled: true,
			MomentumRatio: 2,
			MomentumVelocityRatio: 2,
		},
		breakpoints: {
			320: {
				enabled: true,
			},
			480: {
				enabled: false,
			}
		}
	});

	// SWIPER HOME IMAGES
	const swiperHomeImages = new Swiper(".swiper_home", {
		passiveListeners: true,
		slidesPerView: "auto",
		grabCursor: true,
		loop: true,
		loopedSlides: 8,
		freeMode: {
			enabled: true,
			MomentumRatio: 2,
			MomentumVelocityRatio: 2,
		},
	});

	function initAcc(elem, option) {
		document.querySelectorAll(".dark-list-line").forEach(function (el) {
			el.style.transform = "translateX(-100%)"
		})
		document.querySelectorAll(".acc-head").forEach((item) => {
			gsap.set(item.parentElement.querySelector(".acc-body"), {
				height: 0
			});
			item.addEventListener("click", function (e) {
				var target = e.target,
					targetParent = target.parentElement,
					targetBody = targetParent.querySelector(".acc-body"),
					targetHeight = targetParent.querySelector(".acc-body__grid").clientHeight,
					currentListLine = targetParent.querySelector(".acc-list-line"),
					currentMoreLess = targetParent.querySelector(".more-less-client");
				if (!targetParent.classList.contains("active")) {
					if (option == true) {
						var elementList = document.querySelectorAll(elem + " .acc-list-item");
						elementList.forEach(function (el) {
							if (el.classList.contains("active") && el != targetParent) {
								var elTargetBody = el.querySelector(".acc-body"),
									elListLine = el.querySelector(".acc-list-line"),
									elMoreLess = el.querySelector(".more-less-client");
								el.classList.remove("active");
								gsap.to(elTargetBody, {
									height: 0,
									duration: .4,
									ease: "inOut"
								});
								//elTargetBody.style.height = 0;
								elListLine.style.backgroundColor = "#cdcdcd";
								elMoreLess.innerHTML = "MORE +";
							}
						});
					}
					targetParent.classList.add("active");
					gsap.to(targetBody, {
						height: targetHeight,
						duration: .4,
						ease: "inOut"
					});
					//targetBody.style.height = targetHeight + "px";
					currentListLine.style.backgroundColor = "#000";
					currentMoreLess.innerHTML = "LESS —";
				} else {
					targetParent.classList.remove("active");
					gsap.to(targetBody, {
						height: 0,
						duration: .4,
						ease: "inOut"
					});
					//targetBody.style.height = 0;
					currentListLine.style.backgroundColor = "#cdcdcd";
					currentMoreLess.innerHTML = "MORE +";
				}
				setTimeout(() => {
					ScrollTrigger.refresh()
				}, 401);
			});
		});
	}
	initAcc(".client-list", true); // autoclose boolean

	// DEVICE SPECIFIC FUNCTIONS
	function handleMobileHome(isMobile) {
		if (isMobile.matches) {
			// MOBILE

			var vid = document.querySelectorAll("video");
			for (let i = 0; i < vid.length; i++) {
				var playPromise = vid[i].play();
				if (playPromise !== undefined) {
					playPromise.then(_ => {})
						.catch(error => {});
				};
			};

			// MOBILE FOOTER COLOR CHANGE
			mobileNav("#f0f0f0", "#fff")

		} else {
			return
		}
	}

	function handleTabletHome(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	}

	function handleDesktopHome(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			const vid = document.querySelectorAll("video");
			scroll.on('scroll', () => {
				vid.forEach(function (el) {
					if (el.classList.contains("videoPlay")) {
						var playPromise = el.play();
						if (playPromise !== undefined) {
							playPromise.then(_ => {})
								.catch(error => {});
						};
					} else {
						el.pause();
					}
				});
			});

			// CASE STUDIES INFO ANIMATION
			let caseStudyInfoAni = gsap.timeline({
				scrollTrigger: {
					scroller: "[data-scroll-container]",
					trigger: ".case-study__info",
					start: "top bottom",
					end: "bottom top+=56px",
				}
			});
			caseStudyInfoAni.fromTo(".case-study_line", {
					width: "0%"
				}, {
					width: "100%",
					duration: .75,
					stagger: .1,
					ease: "inOut"
				})
				.fromTo(".tag-item", {
					y: "140%"
				}, {
					y: "0%",
					duration: .5,
					stagger: .1,
					ease: "out"
				}, "<10%")
				.fromTo(".case-study_year", {
					y: "140%"
				}, {
					y: "0%",
					duration: .5,
					stagger: .1,
					ease: "out"
				}, "<")
				.fromTo(".case-study_title", {
					y: "140%"
				}, {
					y: "0%",
					duration: .5,
					stagger: .1,
					ease: "out"
				}, "<10%")

			// ABOUT h70 ANIMATION
			ScrollTrigger.create({
				scroller: "[data-scroll-container]",
				trigger: ".h70_about",
				start: "top bottom",
				end: "bottom top+=56px",
				animation: gsap.fromTo(".h70_about", {
					y: "140%"
				}, {
					y: "0%",
					duration: .75,
					ease: "out"
				})
			});

			// VIDEO EXPAND ANIMATION
			ScrollTrigger.create({
				scroller: "[data-scroll-container]",
				trigger: ".home_video",
				start: "top bottom",
				end: "top top+=56px",
				scrub: true,
				animation: gsap.fromTo(".home_video", {
					width: "47vw"
				}, {
					width: "100vw"
				})
			});

			// SELECTED CLIENTS HEADING ANIMATION
			ScrollTrigger.create({
				scroller: "[data-scroll-container]",
				trigger: ".h70_clients",
				start: "top bottom",
				end: "top top+=56px",
				animation: gsap.fromTo(".h70_clients .word", {
					y: "140%"
				}, {
					y: "0%",
					duration: 0.75,
					stagger: 0.1,
					ease: "out"
				})
			});

			// ACCORDION LIST ANIMATION
			$(".acc-list-item").each(function () {
				let acctl = gsap.timeline({
					scrollTrigger: {
						scroller: "[data-scroll-container]",
						trigger: $(this),
						start: "bottom bottom",
						end: "top top+=56px",
						toggleActions: "play reverse play reverse"
					}
				});
				acctl.from($(this).find(".acc-title"), {
						y: "140%",
						duration: 0.5,
						ease: "out"
					}, "<")
					.from($(this).find(".acc-info"), {
						y: "140%",
						duration: 0.5,
						ease: "out"
					}, "<")
					.from($(this).find(".more-less-client"), {
						y: "140%",
						duration: 0.5,
						ease: "out"
					}, "<");
			});

			// CLIENT LIST LINE ANIMATION
			$(".acc-list-line").each(function () {
				ScrollTrigger.create({
					scroller: "[data-scroll-container]",
					trigger: $(this),
					start: "bottom bottom",
					end: "top top+=56px",
					toggleActions: "play reverse play reverse",
					animation: gsap.fromTo($(this), {
						x: "-100%"
					}, {
						x: "0%",
						duration: 1,
						delay: 0.4,
						ease: "out"
					}),
				});
			});

		} else {
			return
		}
	}

	handleMobileHome(isMobile);
	handleTabletHome(isTablet);
	handleDesktopHome(isDesktop);
	isMobile.addEventListener("change", handleMobileHome);
	isTablet.addEventListener("change", handleTabletHome);
	isDesktop.addEventListener("change", handleDesktopHome);
};

function homeScriptAni() {
	function handleMobileHomeAni(isMobile) {
		if (isMobile.matches) {
			// MOBILE
		} else {
			return
		}
	}

	function handleTabletHomeAni(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	}

	function handleDesktopHomeAni(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			// HOME LANDING TEXT ANIMATION
			let homeLandAni = gsap.timeline({
				delay: .7
			});
			homeLandAni.fromTo(".h100_home .word", {
					y: "140%"
				}, {
					y: "0%",
					duration: 0.75,
					stagger: 0.1,
					ease: "out"
				})
				.fromTo(".hsmall_insight .line", {
					y: "140%"
				}, {
					y: "0%",
					duration: 1,
					stagger: 0.075,
					ease: "out"
				}, "<50%")
				.fromTo(".featured-work__image", {
					autoAlpha: .01,
					scale: 1.3,
					rotation: 5
				}, {
					autoAlpha: 1,
					scale: 1.1,
					rotation: 0,
					duration: 1.2,
					stagger: 0.1,
					ease: "out"
				}, "<10%")
				.fromTo(".featured-work__num", {
					y: "-140%"
				}, {
					y: "0%",
					duration: 0.75,
					stagger: 0.1,
					ease: "out"
				}, "<30%")

		} else {
			return
		}
	}

	handleMobileHomeAni(isMobile);
	handleTabletHomeAni(isTablet);
	handleDesktopHomeAni(isDesktop);
	isMobile.addEventListener("change", handleMobileHomeAni);
	isTablet.addEventListener("change", handleTabletHomeAni);
	isDesktop.addEventListener("change", handleDesktopHomeAni);
};

/*!
 * * * * * * * * * * * Case Studies
 */

function caseStudiesScript() {

	// SET WORK NUMBER COUNT
	var caseStudy = document.querySelectorAll(".case-study");
	$('.case-num').text(('0' + caseStudy.length).slice(-2));

	// SET CASE STUDY WORK NUMBERS
	var featworknum = document.querySelectorAll(".featured-work__num");
	for (let i = 0; i < featworknum.length; i++) {
		featworknum[i].textContent = "00-" + (i + 1);
	}

	// SET FIRST 4 CASE STUDY IDs
	var casestudy = document.querySelectorAll(".case-study");
	for (let i = 0; i < 4; i++) {
		casestudy[i].setAttribute("id", "cs" + (i + 1));
	}

	var fasctwin = document.querySelectorAll(".fasctwin"),
		index = 1;
	fasctwin.forEach(fa => {
		fa.style.setProperty("--index", index);
		index = index + 1;
	});

	// INITIALISE SWIPER
	const csSwiperPage = new Swiper(".case-studies", {
		slidesPerView: "auto",
		grabCursor: true,
		enabled: false,
		breakpoints: {
			480: {
				freeMode: true,
				mousewheel: true,
				eventsTarget: ".case",
				keyboard: {
					enabled: true
				},
			},
		}
	});

};

function caseStudiesScriptAni() {
	function handleMobileCaseStudiesAni(isMobile) {
		if (isMobile.matches) {
			// MOBILE

			// MOBILE NAV COLOR CHANGE
			mobileNav("#f0f0f0", "#fff")

		} else {
			return
		}
	}

	function handleTabletCaseStudiesAni(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	}

	function handleDesktopCaseStudiesAni(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			// CASE STUDIES LANDING ANIMATION
			let caseStudiesAni = gsap.timeline({
				delay: .7
			});
			caseStudiesAni.fromTo(".h100__case .word", {
					y: "140%"
				}, {
					y: "0%",
					duration: 0.75,
					stagger: 0.1,
					ease: "out"
				})
				.fromTo(".case-num", {
					y: "100%"
				}, {
					y: "0%",
					duration: 0.4,
					ease: "out"
				}, "<50%")
				.fromTo(".featured-work__image", {
					autoAlpha: .01,
					scale: 1.3,
					rotation: 5
				}, {
					autoAlpha: 1,
					scale: 1.1,
					rotation: 0,
					duration: 1.2,
					stagger: 0.1,
					ease: "out"
				}, "<30%")
				.fromTo(".featured-work__num", {
					y: "-140%"
				}, {
					y: "0%",
					duration: 0.75,
					stagger: 0.1,
					ease: "out"
				}, "<30%")
				.fromTo(".case-study_line", {
					width: "0%"
				}, {
					width: "100%",
					duration: .75,
					stagger: .1,
					ease: "inOut"
				}, "<10%")
				.fromTo(".tag-item", {
					y: "140%"
				}, {
					y: "0%",
					duration: .5,
					stagger: .1,
					ease: "out"
				}, "<10%")
				.fromTo(".case-study_year", {
					y: "140%"
				}, {
					y: "0%",
					duration: .5,
					stagger: .1,
					ease: "out"
				}, "<")
				.fromTo(".case-study_title", {
					y: "140%"
				}, {
					y: "0%",
					duration: .5,
					stagger: .1,
					ease: "out"
				}, "<10%")
		} else {
			return
		}
	}

	handleMobileCaseStudiesAni(isMobile);
	handleTabletCaseStudiesAni(isTablet);
	handleDesktopCaseStudiesAni(isDesktop);
	isMobile.addEventListener("change", handleMobileCaseStudiesAni);
	isTablet.addEventListener("change", handleTabletCaseStudiesAni);
	isDesktop.addEventListener("change", handleDesktopCaseStudiesAni);
};

/*!
 * * * * * * * * * * * Case Study
 */

function caseStudyScript() {

	// SET CURRENT PAGE TO CASE STUDY NAME
	var caseStudy = $(".cs-title").text();
	$(".nav__current-page").text(caseStudy);
	$(".body").addClass(caseStudy);

	var recCount = $(".h20__recognition-links-wrap .link").length
	$(".rec-count").text(recCount)

	const csCounter = $('.cs-count').length;
	$('.case-num').text(('0' + csCounter).slice(-2));
	$('.cs-num-total').text(('00' + csCounter).slice(-3));
	$('.cs-num').text(('00' + $('.hidden-counter').text()).slice(-3));

	// SET CASE STUDY WORK NUMBERS
	var featworknum = document.querySelectorAll(".featured-work__num");
	for (let i = 0; i < featworknum.length; i++) {
		featworknum[i].textContent = "00-" + (i + 1);
	}

	let csSliders = document.querySelectorAll('.cs-swiper-con')
	csSliders.forEach((slider, index) => {
		// checks if there's more than 1 slide, if there's only 1 it won't loop
		let sliderLength = slider.children[0].children.length
		let result = (sliderLength > 1) ? true : false
		const csSwiperSlider = new Swiper(slider, {
			centeredSlides: true,
			slidesPerView: 'auto',
			spaceBetween: "8%",
			grabCursor: true,
			freeMode: true,
		});
	});

	function handleMobileCaseStudy(isMobile) {
		if (isMobile.matches) {
			// MOBILE

			var vid = document.querySelectorAll("video");
			for (let i = 0; i < vid.length; i++) {
				var playPromise = vid[i].play();
				if (playPromise !== undefined) {
					playPromise.then(_ => {})
						.catch(error => {});
				};
			};

			// MOBILE NAV COLOR CHANGE
			mobileNav("#000", "#161616")

		} else {
			return
		}
	}

	function handleTabletCaseStudy(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	}

	function handleDesktopCaseStudy(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			$(".cs-parallax-img-wrap").each(function () {
				var imgHeight = $(this).find(".cs-parallax-img").height() * .7;
				$(this).height(imgHeight)
			});

			const vid = document.querySelectorAll("video");
			scroll.on('scroll', () => {
				vid.forEach(function (el) {
					if (el.classList.contains("videoPlay")) {
						var playPromise = el.play();
						if (playPromise !== undefined) {
							playPromise.then(_ => {})
								.catch(error => {});
						};
					} else {
						el.pause();
					}
				});
			});

		} else {
			return
		}
	}

	handleMobileCaseStudy(isMobile);
	handleTabletCaseStudy(isTablet);
	handleDesktopCaseStudy(isDesktop);
	isMobile.addEventListener("change", handleMobileCaseStudy);
	isTablet.addEventListener("change", handleTabletCaseStudy);
	isDesktop.addEventListener("change", handleDesktopCaseStudy);
};

function caseStudyScriptAni() {
	// DEVICE SPECIFIC FUNCTIONS

	function handleMobileCaseStudyAni(isMobile) {
		if (isMobile.matches) {
			// MOBILE
		} else {
			return
		}
	}

	function handleTabletCaseStudyAni(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	}

	function handleDesktopCaseStudyAni(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			// CASE STUDIES LANDING ANIMATION
			let caseStudyAni = gsap.timeline({
				delay: .6
			});
			caseStudyAni.fromTo(".cs-title .word", {
					y: "140%"
				}, {
					y: "0%",
					duration: 0.75,
					stagger: 0.1,
					ease: "out"
				})
				//.fromTo(".cs-num", {y: "140%" }, {y: "0%", duration: 0.4, ease: "out"}, "<30%")
				//.fromTo(".cs-num-total", {y: "140%" }, {y: "0%", duration: 0.4, ease: "out"}, "<30%")
				//.fromTo(".cs-intro-grid .cs-del", {y: "-140%"}, {y: "0%", duration: 1, stagger: 0.075, ease: "out"}, "<30%")
				//.fromTo(".cs-year", {y: "140%" }, {y: "0%", duration: 0.4, ease: "out"}, "<30%")
				.fromTo(".cs-large-img", {
					scale: 1.1,
					autoAlpha: 0.001,
					rotation: 5
				}, {
					scale: 1,
					autoAlpha: 1,
					rotation: 0,
					duration: 1,
					ease: "out"
				}, "<20%")

		} else {
			return
		}
	}

	handleMobileCaseStudyAni(isMobile);
	handleTabletCaseStudyAni(isTablet);
	handleDesktopCaseStudyAni(isDesktop);
	isMobile.addEventListener("change", handleMobileCaseStudyAni);
	isTablet.addEventListener("change", handleTabletCaseStudyAni);
	isDesktop.addEventListener("change", handleDesktopCaseStudyAni);
};

/*!
 * * * * * * * * * * * Work
 */

function workScript() {

	var lbOpen = false;

	// SET WORK NUMBER COUNT
	var workItem = document.querySelectorAll(".work-block");
	document.querySelector(".work-num").textContent = workItem.length;

	// CUSTOM WORK CURSOR
	const workCursor = document.querySelector('.work-cursor');
	gsap.set(workCursor,{xPercent:30,yPercent:70});
	document.addEventListener('pointermove', moveWorkCursor);

	function moveWorkCursor(e) {
		gsap.to(workCursor, {
			duration: 0,
			x: e.clientX,
			y: e.clientY
		})
	}
	function hoverWorkFunc(e) {
		gsap.fromTo(workCursor, {
			autoAlpha: 0
		}, {
			autoAlpha: 1,
			duration: 0.3,
			ease: "in"
		})
	}
	function unhoverWorkFunc(e) {
		gsap.fromTo(workCursor, {
			autoAlpha: 1
		}, {
			autoAlpha: 0,
			duration: 0.3,
			ease: "out"
		})
	}
	$(".work-block").hover(hoverWorkFunc, unhoverWorkFunc);

	// IF NO IMAGE/VIDEO IS SET FOR LIST SWPIER SLIDE, THEN REMOVE SLIDE
	$(".swiper-work-slide").each(function () {
		if ($(this).find(".work-list-image").hasClass("w-dyn-bind-empty") && $(this).children(".work-list-embed").hasClass("w-condition-invisible") || $(this).children(".work-list-image").hasClass("w-dyn-bind-empty") && $(this).find(".video-source-lg").attr("data-large-src") === "" && $(this).find(".video-source-sm").attr("data-small-src") === "") {
			$(this).remove();
		}
		if ($(this).find(".work-list-image").attr("src") === "https://uploads-ssl.webflow.com") {
			$(this).find(".work-list-image").remove()
		}
	});

	// IF NO IMAGE/VIDEO IS SET FOR LIGHTBOX SWPIER, THEN REMOVE SLIDE
	$(".lightbox-single-slide").each(function () {
		if ($(this).find(".lightbox-single-img").hasClass("w-dyn-bind-empty") && $(this).children(".lightbox-embed").hasClass("w-condition-invisible") || $(this).children(".lightbox-single-img").hasClass("w-dyn-bind-empty") && $(this).find(".lightbox-source-lg").attr("data-large-src") === "" && $(this).find(".lightbox-source-sm").attr("data-small-src") === "") {
			$(this).remove();
		}
		if ($(this).find(".lightbox-single-img").attr("src") === "https://uploads-ssl.webflow.com") {
			$(this).find(".lightbox-single-img").remove()
		}
	});

	// SWIPER LIGHTBOX INNER
	const lightboxSwipers = new Swiper(".lightbox-single", {
		passiveListeners: true,
		grabCursor: true,
		slidesPerView: "auto",
		freeMode: true,
		observer: true,
		keyboard: {
			enabled: true,
			onlyInViewport: false,
		},
		mousewheel: true,
		pagination: {
			el: '.swiper-pagination',
			type: 'custom',
			renderCustom: function (swiper, current, total) {
				return '<div class="currentslide">' + ('00' + current).slice(-3) + '</div>' + '<div class="lightbox-dash"></div>' + '<div class="totalslide">' + ('00' + total).slice(-3) + '</div>';
			}
		},
		breakpoints: {
			320: {
				direction: 'vertical',
				centeredSlides: false,
				cssMode: true
			},
			480: {
				direction: 'horizontal',
				centeredSlides: true,
				nested: true,
			},
		},
		enabled: false,
	});

	// LIST SWIPER
	const listSwipers = new Swiper('.swiper-work-list', {
		passiveListeners: true,
		grabCursor: true,
		slidesPerView: 'auto',
		loop: true,
		loopedSlides: 4,
		resistanceRatio: 1.5,
		freeMode: {
			enabled: true,
			momentumBounce: false,
		},
		speed: 60000,
		autoplay: {
			delay: 0,
			disableOnInteraction: false,
		},
		breakpoints: {
			320: {
				autoplay: {
					delay: 0,
					disableOnInteraction: false,
				},
			},
			480: {
				autoplay: {
					delay: 0,
					disableOnInteraction: false,
				},
			},
		},
		enabled: false,
	});

	// NUMBER EACH LIGHTBOX SWIPER
	document.querySelectorAll(".lightbox-single").forEach(
		(el, i) => el.setAttribute("aria-label", (i + 1))
	)

	// NUMBER EACH LIST ACC
	document.querySelectorAll(".acc-list-item").forEach((el, i) => {
		el.setAttribute("aria-label", (i + 1))
		el.querySelector(".work-acc-head").setAttribute("aria-label", (i + 1))
		el.querySelector(".work-acc-head").setAttribute("aria-expanded", "false")
	});

// WORK 2

	function playLightboxVideos(index) {
		var slide = document.querySelectorAll(".lightbox-slide")[index],
			vids = slide.querySelectorAll("video");
		vids.forEach(function (el) {
			var playPromise = el.play();
			if (playPromise !== undefined) {
				playPromise.then(_ => {})
					.catch(error => {});
			};
		});
	}

	// DEVICE SPECIFIC FUNCTIONS
	function handleMobile(isMobile) {
		if (isMobile.matches) {
			// MOBILE

			let height = window.innerHeight;
			let height2 = window.pageYOffset || document.documentElement.scrollTop
			document.querySelectorAll(".lightbox-single").forEach(function (slider) {
				slider.style.setProperty("--height", height2 + "px");
			});
			document.addEventListener('scroll', function (e) {
				height2 = window.pageYOffset || document.documentElement.scrollTop
				document.querySelectorAll(".lightbox-single").forEach(function (slider) {
					slider.style.setProperty("--height", height2 + "px");
				});
			});

			// UPDATE HEIGHT ON RESIZE FOR MOBILE
			function reportWindowSize() {
				height = window.innerHeight;
				height2 = window.pageYOffset || document.documentElement.scrollTop
				document.querySelector(".lightbox").style.height = (height - 56) + "px";
				document.querySelectorAll(".lightbox-single").forEach(function (slider) {
					slider.style.height = (height - 56) + "px";
					if (lbOpen = false) {
						slider.style.setProperty("--height", height2 + "px");
					}
				});
			}
			reportWindowSize();
			window.addEventListener('resize', reportWindowSize);

			function openLightboxSingle(e) {
				document.body.style.overflow = "hidden hidden";
				if (e.target.closest(".work-block")) {
					var container = e.target.closest(".work-block"),
						name = container.querySelector(".h20-work").textContent;
				}
				if (e.target.closest(".acc-list-item")) {
					var container = e.target.closest(".acc-list-item"),
						name = container.querySelector(".hsmall-mobile-list").textContent,
						slideNum = e.target.closest(".swiper-work-slide").getAttribute("data-swiper-slide-index");
				}
				var lbNames = document.querySelectorAll(".work-name"),
					overlay = document.querySelector(".work-overlay"),
					navOverlay = document.querySelector(".nav-overlay");
				lbNames.forEach(function (lbName, index) {
					if (lbName.textContent.toUpperCase() == name.toUpperCase()) {
						lightboxSwipers[index].enable();
						if (e.target.closest(".work-block")) {
							lightboxSwipers[index].slideTo(0, 0);
						}
						if (e.target.closest(".acc-list-item")) {
							lightboxSwipers[index].slideTo(slideNum, 0);
						}
						lbName.nextElementSibling.style.visibility = "visible";
						lbName.nextElementSibling.classList.add("up");
						overlay.classList.add("overlay-visible");
						overlay.style.visibility = "visible";
						if (lbOnce === true) {
							navOverlay.classList.add("overlay-visible");
							navOverlay.style.visibility = "visible";
						}
						playLightboxVideos(index);
					}
				});
			}

			function closeLightboxSingle(e) {
				var el = e.target.closest(".lightbox-single"),
					index = e.target.closest(".lightbox-single").getAttribute("aria-label") - 1,
					vids = e.target.closest(".lightbox-single").querySelectorAll("video"),
					overlay = document.querySelector(".work-overlay"),
					navOverlay = document.querySelector(".nav-overlay");
				lightboxSwipers[index].disable;
				el.classList.remove("up");
				overlay.classList.remove("overlay-visible");
				navOverlay.classList.remove("overlay-visible");
				setTimeout(() => {
					vids.forEach(function (vid) {
						vid.pause();
					});
					el.style.visibility = "hidden";
					overlay.style.visibility = "hidden";
					navOverlay.style.visibility = "hidden";
					document.body.style.overflow = "visible";
					lbOpen = false;
				}, 1000);
			}

			var workBlocks = document.querySelectorAll(".work-block")
			workBlocks.forEach(function (el, index) {
				el.addEventListener("click", function (e) {
					openLightboxSingle(e)
				});
			});

			var workLists = document.querySelectorAll(".swiper-work-slide")
			workLists.forEach(function (el, index) {
				el.addEventListener("click", function (e) {
					openLightboxSingle(e)
				});
			});

			var closeBtns = document.querySelectorAll(".close-lightbox-button")
			closeBtns.forEach(function (el, index) {
				el.addEventListener("click", function (e) {
					closeLightboxSingle(e)
				});
			});

			// MOBILE NAV COLOUR CHANGE
			mobileNav("#f0f0f0", "#fff")

		} else {
			return
		}
	}

	function handleTablet(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	}

	function handleDesktop(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			function openLightboxSingle(e) {

				document.body.style.overflow = "hidden hidden";
				if (e.target.closest(".work-block")) {
					var container = e.target.closest(".work-block"),
						name = container.querySelector(".h20-work").textContent;
				}
				if (e.target.closest(".acc-list-item")) {
					var container = e.target.closest(".acc-list-item"),
						name = container.querySelector(".hsmall-mobile-list").textContent,
						slideNum = e.target.closest(".swiper-work-slide").getAttribute("data-swiper-slide-index");
				}
				var lbNames = document.querySelectorAll(".work-name"),
					overlay = document.querySelector(".work-overlay"),
					navOverlay = document.querySelector(".nav-overlay");
				lbNames.forEach(function (lbName, index) {
					if (lbName.textContent.toUpperCase().replace(/\s/g, '') == name.toUpperCase().replace(/\s/g, '')) {
						lightboxSwipers[index].enable();
						if (e.target.closest(".work-block")) {
							lightboxSwipers[index].slideTo(0, 0);
						}
						if (e.target.closest(".acc-list-item")) {
							lightboxSwipers[index].slideTo(slideNum, 0);
						}
						lbName.nextElementSibling.style.visibility = "visible";
						lbName.nextElementSibling.classList.add("up");
						overlay.classList.add("overlay-visible");
						overlay.style.visibility = "visible";
						if (lbOnce === true) {
							navOverlay.classList.add("overlay-visible");
							navOverlay.style.visibility = "visible";
						}
						playLightboxVideos(index);
					}
				});
			}

			function closeLightboxSingle(e) {
				var el = e.target.closest(".lightbox-single"),
					index = e.target.closest(".lightbox-single").getAttribute("aria-label") - 1,
					vids = e.target.closest(".lightbox-single").querySelectorAll("video"),
					overlay = document.querySelector(".work-overlay"),
					navOverlay = document.querySelector(".nav-overlay");
				lightboxSwipers[index].disable;
				el.classList.remove("up");
				overlay.classList.remove("overlay-visible");
				navOverlay.classList.remove("overlay-visible");
				setTimeout(() => {
					vids.forEach(function (vid) {
						vid.pause();
					});
					el.style.visibility = "hidden";
					overlay.style.visibility = "hidden";
					navOverlay.style.visibility = "hidden";
					document.body.style.overflow = "visible";
				}, 1000);
			}

			var workBlocks = document.querySelectorAll(".work-block")
			workBlocks.forEach(function (el, index) {
				el.addEventListener("click", function (e) {
					openLightboxSingle(e)
				});
			});

			var workLists = document.querySelectorAll(".swiper-work-slide")
			workLists.forEach(function (el, index) {
				el.addEventListener("click", function (e) {
					openLightboxSingle(e)
				});
			});

			var closeBtns = document.querySelectorAll(".close-lightbox-button")
			closeBtns.forEach(function (el, index) {
				el.addEventListener("click", function (e) {
					closeLightboxSingle(e)
				});
			});

		} else {
			return
		}
	}

	handleMobile(isMobile);
	handleTablet(isTablet);
	handleDesktop(isDesktop);
	isMobile.addEventListener("change", handleMobile);
	isTablet.addEventListener("change", handleTablet);
	isDesktop.addEventListener("change", handleDesktop);

// WORK 3

	var navOptionDropdown = document.querySelector(".filter-wrap-nav .filter-option-dropdown"),
		navFilterWrap = document.querySelector(".nav-filter-wrap"),
		headerOptionDropdown = document.querySelector(".work-header .filter-option-dropdown");

	function toggleNavFilter() {
		navOptionDropdown.classList.toggle("open");
		if (navFilterWrap.classList.contains("visible")) {
			setTimeout(function () {
				navFilterWrap.classList.remove("visible");
			}, 601);
		} else {
			navFilterWrap.classList.add("visible");
		}
	}

	function toggleHeaderFilter() {
		headerOptionDropdown.classList.toggle("open");
	}

	// OPEN/CLOSE NAV FILTER
	$(".hsmall_filter-active.nav-filter-active").on('click', function () {
		toggleNavFilter()
	});

	headerOptionDropdown = document.querySelector(".work-header .filter-option-dropdown");

	// OPEN/CLOSE FILTER
	$(".hsmall_filter-active.header-filter-active").on('click', function () {
		toggleHeaderFilter()
	});

	// SYNC RESET FILTERS ON CLICK
	$('a.filter-option-wrap').on('click', function (event) {
		var selectedOption = $(this).find(".hsmall_filter-option").text()
		// NAV RESET
		if ($(this).hasClass("filter-reset-nav")) {
			$(".hsmall_filter-active").each(function () {
				$(this).text("All Work +");
			})
			if ($(this).closest(".list-view").length) {
				$(".grid-view .filter-reset-nav")[0].click()
			}
			if ($(this).closest(".grid-view").length) {
				$(".list-view .filter-reset-nav")[0].click()
			}
			navOptionDropdown.classList.remove("open");
			setTimeout(function () {
				navFilterWrap.classList.remove("visible");
			}, 601);
			scroll.scrollTo("top");
			setTimeout(function () {
				ScrollTrigger.refresh();
			}, 301);
		}
		// HEADER RESET
		if ($(this).hasClass("filter-reset-header")) {
			$(".hsmall_filter-active").each(function () {
				$(this).text("All Work +");
			})
			$(".filter-reset-nav")[0].click()
			$(".filter-reset-nav")[1].click()
			headerOptionDropdown.classList.remove("open");
			scroll.scrollTo("top");
			setTimeout(function () {
				ScrollTrigger.refresh();
			}, 301);
		}
	});
	// SYNC INPUT FILTERS ON CLICK
	$('.filter-option-wrap input').on('click', function (event) {
		if ($(this).is(":checked")) {
			var selectedOption = $(this).next().text()
			// NAV FILTER SYNC
			if ($(this).closest(".nav-filter-wrap").length) {
				// LIST VIEW
				if ($(this).closest(".list-view").length) {
					$('.filter-wrap-nav .grid-view input[type="radio"]').each(function () {
						if ($(this).val() == selectedOption) {
							$(this)[0].click()
						}
					});
					$('.work-header .list-view input[type="radio"]').each(function () {
						if ($(this).val() == selectedOption) {
							$(this)[0].click()
						}
					});
					$('.work-header .grid-view input[type="radio"]').each(function () {
						if ($(this).val() == selectedOption) {
							$(this)[0].click()
						}
					});
				}
				// GRID VIEW
				if ($(this).closest(".grid-view").length) {
					$('.filter-wrap-nav .list-view input').each(function () {
						if ($(this).val() == selectedOption) {
							$(this)[0].click()
						}
					});
					$(`.work-header input`).each(function () {
						if ($(this).val() == selectedOption) {
							$(this)[0].click()
						}
					});
				}
				// OTHER
				$(".hsmall_filter-active").each(function () {
					$(this).text(selectedOption + " +");
				})
				navOptionDropdown.classList.remove("open");
				setTimeout(function () {
					navFilterWrap.classList.remove("visible");
				}, 601);
				scroll.scrollTo("top");
				setTimeout(function () {
					ScrollTrigger.refresh();
				}, 301);
			}
			// HEADER FILTER SYNC
			if ($(this).closest(".work-header").length) {
				// GRID VIEW
				if ($(this).closest(".grid-view").length) {
					$('.work-header .list-view input').each(function () {
						if ($(this).val() == selectedOption) {
							$(this)[0].click()
						}
					});
					$('.filter-wrap-nav input').each(function () {
						if ($(this).val() == selectedOption) {
							$(this)[0].click()
						}
					});
				}
				//LIST VIEW
				if ($(this).closest(".list-view").length) {
					$('.work-header .grid-view input').each(function () {
						if ($(this).val() == selectedOption) {
							$(this)[0].click()
						}
					});
					$('.filter-wrap-nav input').each(function () {
						if ($(this).val() == selectedOption) {
							$(this)[0].click()
						}
					});
				}
				// OTHER
				$(".hsmall_filter-active").each(function () {
					$(this).text(selectedOption + " +");
				})
				headerOptionDropdown.classList.remove("open");
				scroll.scrollTo("top");
				setTimeout(function () {
					ScrollTrigger.refresh();
				}, 601);
			}
		}
	});

	// CLOSE FILTERS ON DOCUMENT CLICK
	$(document).on('click', function (event) {
		var target = $(event.target);
		if (!target.closest('.filter-wrap').length) {
			navOptionDropdown.classList.remove("open");
			headerOptionDropdown.classList.remove("open");
		}
	});

	// SHOW/HIDE FILTER IN NAV ON SCROLL
	ScrollTrigger.create({
		scroller: "[data-scroll-container]",
		trigger: ".h100",
		start: "bottom top+=56px",
		end: "bottom top+=56px",
		onEnter: () => {
			gsap.to(".filter-wrap-nav", {
				y: "0%",
				duration: 0.3,
				ease: "inOut"
			})
		},
		onLeaveBack: () => {
			gsap.to(".filter-wrap-nav", {
				y: "120%",
				duration: 0.3,
				ease: "inOut"
			})
		},
	});

// WORK 4

	// ARRAY OF ALL SWIPER WORK LISTS
	var workSwiperAccessAll = document.querySelectorAll(".swiper-work-list");
	// CREATE ARRAY OF LIST SWPIER FUNCTIONS
	for (let i = 0; i < workSwiperAccessAll.length; i++) {
		swiperArray.push(workSwiperAccessAll[i].swiper)
	}

	const playListVideosAcc = function (swiperIndex, state) {
		var slide = workSwiperAccessAll[swiperIndex],
			vids = slide.querySelectorAll("video");
		vids.forEach(function (el) {
			if (state == "play") {
				var playPromise = el.play();
				if (playPromise !== undefined) {
					playPromise.then(_ => {}).catch(error => {
						console.log(error)
					});
				}
			}
			if (state == "pause") {
				el.pause();
			}
		});
	}
	document.querySelectorAll("video").forEach(function (el) {
		el.pause();
	});

	function initAcc(elem, option) {
		document.querySelectorAll(".dark-list-line").forEach(function (el) {
			el.style.transform = "translateX(-100%)"
		})
		document.querySelectorAll(".work-acc-head").forEach((item) => {

			gsap.set(item.parentElement.querySelector(".work-acc-body"), {
				height: 0
			});

			item.addEventListener("click", function (e) {
				var target = e.target,
					targetParent = target.closest(".acc-list-item"),
					targetBody = targetParent.querySelector(".work-acc-body"),
					targetHeight = targetParent.querySelector(".swiper-work-list").clientHeight,
					currentListLine = targetParent.querySelector(".acc-list-line"),
					currentMoreLess = targetParent.querySelector(".hsmallest-more-less"),
					index = targetParent.getAttribute("aria-label") - 1;
				if (!targetParent.classList.contains("active")) {
					if (option == true) {
						var elementList = document.querySelectorAll(elem + " .acc-list-item");
						elementList.forEach(function (el) {
							if (el.classList.contains("active") && el != targetParent) {
								var elTargetBody = el.querySelector(".work-acc-body"),
									elListLine = el.querySelector(".acc-list-line"),
									elMoreLess = el.querySelector(".hsmallest-more-less"),
									elIndex = el.getAttribute("aria-label") - 1;
								el.classList.remove("active");
								gsap.to(elTargetBody, {
									height: 0,
									duration: .4,
									ease: "none"
								});
								//elTargetBody.style.height = 0;
								elListLine.style.backgroundColor = "#cdcdcd";
								elMoreLess.innerHTML = "MORE +";
								listSwipers[elIndex].autoplay.pause();
								listSwipers[elIndex].disable();
								setTimeout(function () {
									playListVideosAcc(elIndex, "pause");
								}, 401);
							}
						});
					}
					targetParent.classList.add("active");
					gsap.to(targetBody, {
						height: targetHeight,
						duration: .4,
						ease: "none"
					});
					currentListLine.style.backgroundColor = "#000";
					currentMoreLess.innerHTML = "LESS —";
					listSwipers[index].enable();
					listSwipers[index].slideToLoop(0, 0);
					playListVideosAcc(index, "play");
					setTimeout(function () {
						listSwipers[index].autoplay.run();
					}, 401);
				} else {
					targetParent.classList.remove("active");
					gsap.to(targetBody, {
						height: 0,
						duration: .4,
						ease: "none"
					});
					currentListLine.style.backgroundColor = "#cdcdcd";
					currentMoreLess.innerHTML = "MORE +";
					listSwipers[index].autoplay.pause();
					listSwipers[index].disable();
					setTimeout(function () {
						playListVideosAcc(index, "pause");
					}, 401);
				}
				setTimeout(function () {
					ScrollTrigger.refresh()
				}, 401);
			});
		});
	}
	initAcc(".work-list", true); // autoclose boolean

// WORK 5

	let workGridToggleAni,
		workListToggleAni

	function gridViewChange() {
		workGridToggleAni = gsap.timeline({});
		workGridToggleAni.to(".switch-hover", {
				x: 0,
				duration: .25,
				ease: "inOut"
			}, "<")
			.to(".grid-switch", {
				color: "#f0f0f0",
				duration: .25,
				ease: "inOut"
			}, "<")
			.to(".list-switch", {
				color: "#000",
				duration: .25,
				ease: "inOut"
			}, "<");
		document.querySelectorAll(".acc-list-item").forEach(function (el) {
			if (el.classList.contains("active")) {
				var elTargetBody = el.querySelector(".work-acc-body"),
					elListLine = el.querySelector(".acc-list-line"),
					elMoreLess = el.querySelector(".hsmallest-more-less"),
					elIndex = el.getAttribute("aria-label") - 1;
				el.classList.remove("active");
				elTargetBody.style.height = 0;
				elListLine.style.backgroundColor = "#cdcdcd";
				elMoreLess.innerHTML = "MORE +";
				listSwipers[elIndex].autoplay.pause();
				listSwipers[elIndex].disable();
				setTimeout(() => {
					playListVideosAcc(elIndex, "pause");
					//listSwipers[elIndex].destroy();
				}, 401)
			}
		});
	}

	function listViewChange() {
		workListToggleAni = gsap.timeline({});
		workListToggleAni.to(".switch-hover", {
				x: 74,
				duration: .25,
				ease: "inOut"
			}, "<")
			.to(".grid-switch", {
				color: "#000",
				duration: .25,
				ease: "inOut"
			}, "<")
			.to(".list-switch", {
				color: "#f0f0f0",
				duration: .25,
				ease: "inOut"
			}, "<");
		listSwipers.forEach(function (item) {
			item.slideToLoop(-2, 0);
			item.autoplay.pause();
			item.disable();
		});
	}

	// DEVICE SPECIFIC FUNCTIONS
	function handleMobileWorkView(isMobile) {
		if (isMobile.matches) {
			// MOBILE

			// SWITCH GRID/LIST VIEW
			$(".grid-switch").on("click", function () {
				if (listOpen === true) {
					gridViewChange()
					$(".work-list-view").css("display", "none")
					$(".work-grid-view").css("display", "block")
					gridOpen = true;
					listOpen = false;
					setTimeout(function () {
						ScrollTrigger.refresh();
					}, 301);
				}
			});
			$(".list-switch").on("click", function () {
				if (gridOpen === true) {
					listViewChange()
					$(".work-grid-view").css("display", "none")
					$(".work-list-view").css("display", "block")
					gridOpen = false;
					listOpen = true;
					setTimeout(function () {
						ScrollTrigger.refresh();
					}, 301);
				}
			});

		} else {
			return
		}
	}

	function handleTabletWorkView(isTablet) {
		if (isTablet.matches) {
			// TABLET

			// SWITCH GRID/LIST VIEW
			$(".grid-switch").on("click", function () {
				if (listOpen === true) {
					gridViewChange()
					$(".work-list-view").css("display", "none")
					$(".work-grid-view").css("display", "block")
					gridOpen = true;
					listOpen = false;
					setTimeout(function () {
						ScrollTrigger.refresh();
					}, 301);
				}
			});
			$(".list-switch").on("click", function () {
				if (gridOpen === true) {
					listViewChange()
					$(".work-grid-view").css("display", "none")
					$(".work-list-view").css("display", "block")
					gridOpen = false;
					listOpen = true;
					setTimeout(function () {
						ScrollTrigger.refresh();
					}, 301);
				}
			});

		} else {
			return
		}
	}

	function handleDesktopWorkView(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			// HOVER GRID/LIST VIEW
			$(".grid-switch").hover(function () {
				gsap.to(".switch-hover", {
					x: 0,
					duration: .25,
					ease: "inOut"
				})
				gsap.to(".grid-switch", {
					color: "#f0f0f0",
					duration: .25,
					ease: "inOut"
				})
				gsap.to(".list-switch", {
					color: "#000",
					duration: .25,
					ease: "inOut"
				})
			}, function () {
				if ($(".work-grid-view").css("display") == "none") {
					gsap.to(".switch-hover", {
						x: 74,
						duration: .25,
						ease: "inOut"
					})
					gsap.to(".grid-switch", {
						color: "#000",
						duration: .25,
						ease: "inOut"
					})
					gsap.to(".list-switch", {
						color: "#f0f0f0",
						duration: .25,
						ease: "inOut"
					})
				}
			});
			$(".list-switch").hover(function () {
				gsap.to(".switch-hover", {
					x: 74,
					duration: .25,
					ease: "inOut"
				})
				gsap.to(".grid-switch", {
					color: "#000",
					duration: .25,
					ease: "inOut"
				})
				gsap.to(".list-switch", {
					color: "#f0f0f0",
					duration: .25,
					ease: "inOut"
				})
			}, function () {
				if ($(".work-list-view").css("display") == "none") {
					gsap.to(".switch-hover", {
						x: 0,
						duration: .25,
						ease: "inOut"
					})
					gsap.to(".grid-switch", {
						color: "#f0f0f0",
						duration: .25,
						ease: "inOut"
					})
					gsap.to(".list-switch", {
						color: "#000",
						duration: .25,
						ease: "inOut"
					})
				}
			});

			const el = document.querySelector('.work-section'),
				listView = el.querySelector('.work-list-view'),
				gridView = el.querySelector('.work-grid-view'),
				gridImage = el.querySelectorAll('.work-grid-view .work-block:nth-of-type(-n+2) .work-grid-image'),
				gridTags = el.querySelectorAll('.work-grid-view .work-block:nth-child(-n+2) .tag-list .tag'),
				gridYear = el.querySelectorAll('.work-grid-view .work-block:nth-child(-n+2) .hsmallest-grid-year'),
				gridHead = el.querySelectorAll('.work-block:nth-child(-n+2) .h20-work .word'),
				accHead = el.querySelectorAll('.work-acc-head'),
				accLine = el.querySelectorAll('.acc-line-mask');

			function workGridAniFunc() {
				let workGridAni = gsap.timeline({
					/*paused:true*/
				});
				workGridAni.fromTo(listView, {
						autoAlpha: 1
					}, {
						autoAlpha: .001,
						duration: .8,
						ease: "in"
					})
					.fromTo(listView, {
						display: "block"
					}, {
						display: "none",
						duration: .001
					})
					.fromTo(gridView, {
						display: "none"
					}, {
						display: "block",
						duration: .001
					}, "<")
					.fromTo(gridView, {
						autoAlpha: .001
					}, {
						autoAlpha: 1,
						duration: .8,
						ease: "out"
					}, "<")
					.fromTo(gridImage, {
						autoAlpha: .001,
						scale: 1.3,
						rotation: 5
					}, {
						autoAlpha: 1,
						scale: 1.1,
						rotation: 0,
						duration: 1.2,
						ease: "out"
					}, "<20%")
					.fromTo(gridTags, {
						y: "140%"
					}, {
						y: "0%",
						duration: .5,
						ease: "out"
					}, "<30%")
					.fromTo(gridYear, {
						y: "140%"
					}, {
						y: "0%",
						duration: .5,
						ease: "out"
					}, "<")
					.fromTo(gridHead, {
						y: "140%"
					}, {
						y: "0%",
						duration: .5,
						ease: "out",
						onComplete: () => {
							ScrollTrigger.refresh();
							listOpen = false;
							gridOpen = true;
							viewAni = false;
						}
					}, "<10%")
			}

			function workListAniFunc() {
				let workListAni = gsap.timeline({
					/*paused:true*/
				});
				workListAni.fromTo(gridView, {
						autoAlpha: 1
					}, {
						autoAlpha: .001,
						duration: .8,
						ease: "in"
					})
					.fromTo(gridView, {
						display: "block"
					}, {
						display: "none",
						duration: .01
					})
					.fromTo(listView, {
						display: "none",
						autoAlpha: .001
					}, {
						display: "block",
						autoAlpha: 1,
						duration: .01
					}, "<")
					.fromTo(accHead, {
						y: "1vw",
						autoAlpha: .001
					}, {
						y: "0vw",
						autoAlpha: 1,
						duration: .5,
						stagger: .08,
						ease: "out"
					}, ">")
					.fromTo(accLine, {
						y: "1vw",
						autoAlpha: .001
					}, {
						y: "0vw",
						autoAlpha: 1,
						duration: .5,
						stagger: .08,
						ease: "out",
						onComplete: () => {
							ScrollTrigger.refresh();
							listOpen = true;
							gridOpen = false;
							viewAni = false;
						}
					}, "<2%")
			}

			// SWITCH GRID/LIST VIEW
			$(".grid-switch").on("click", function () {
				if (viewAni === false && listOpen === true) {
					viewAni = true;
					$(".filter-option-container.grid-view").css("display", "block")
					$(".filter-option-container.list-view").css("display", "none")
					gridViewChange()
					workGridAniFunc()
					//workGridAni.play(0);
				}
			});

			$(".list-switch").on("click", function () {
				if (viewAni === false && gridOpen === true) {
					viewAni = true;
					$(".filter-option-container.grid-view").css("display", "none");
					$(".filter-option-container.list-view").css("display", "block");
					listViewChange();
					workListAniFunc()
					//workListAni.play(0);
				}
			});

		} else {
			return
		}
	}

	handleMobileWorkView(isMobile);
	handleTabletWorkView(isTablet);
	handleDesktopWorkView(isDesktop);
	isMobile.addEventListener("change", handleMobileWorkView);
	isTablet.addEventListener("change", handleTabletWorkView);
	isDesktop.addEventListener("change", handleDesktopWorkView);
}

function workScriptAni() {
	const el = document.querySelector('.work-section'),
		gridView = el.querySelector('.work-grid-view'),
		gridImage = el.querySelectorAll('.work-grid-view .work-block:nth-of-type(-n+2) .work-grid-image'),
		gridTags = el.querySelectorAll('.work-grid-view .work-block:nth-child(-n+2) .tag-list .tag'),
		gridYear = el.querySelectorAll('.work-grid-view .work-block:nth-child(-n+2) .hsmallest-grid-year'),
		gridHead = el.querySelectorAll('.work-block:nth-child(-n+2) .h20-work .word');

	// DEVICE SPECIFIC FUNCTIONS
	function handleMobileWorkAni(isMobile) {
		if (isMobile.matches) {
			// MOBILE

			// MOBILE NAV COLOR CHANGE
			mobileNav("#f0f0f0", "#fff")

		} else {
			return
		}
	}

	function handleTabletWorkAni(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	}

	function handleDesktopWorkAni(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			// WORK LANDING ANIMATION
			let workPageAni = gsap.timeline({delay: .7});
			workPageAni.fromTo(".h100__work .word", {y: "140%"}, {y: 0, duration: .7, ease: "out"})
			  .fromTo(".work-num", {y: "140%"}, {y: 0, duration: .4, ease: "out"}, "<30%")
			  .fromTo(gridImage, {autoAlpha: .001, scale: 1.3, rotation: 5}, {autoAlpha: 1, scale: 1.1, rotation: 0, stagger: .1, duration: 1.2, ease: "out"}, "<")
			  .fromTo(gridTags, {y: "140%"}, {y: "0%", duration: .5, ease: "out"}, "<30%")
			  .fromTo(gridYear, {y: "140%"}, {y: "0%", duration: .5, ease: "out"}, "<")
			  .fromTo(gridHead, {y: "140%"}, {y: "0%", duration: .5, ease: "out", onComplete: () => {ScrollTrigger.refresh(); listOpen = false; gridOpen = true; viewAni = false;}}, "<10%")
			
		} else {
			return
		}
	}

	handleMobileWorkAni(isMobile);
	handleTabletWorkAni(isTablet);
	handleDesktopWorkAni(isDesktop);
	isMobile.addEventListener("change", handleMobileWorkAni);
	isTablet.addEventListener("change", handleTabletWorkAni);
	isDesktop.addEventListener("change", handleDesktopWorkAni);
};

/*!
 * * * * * * * * * * * About
 */

function aboutScript() {

	// SWIPER WORK
	const workSwiper = new Swiper(".swiper_work", {
		passiveListeners: true,
		grabCursor: true,
		slidesPerView: "auto",
		loopedSlides: 4,
		loop: true,
		freeMode: {
			enabled: true,
			MomentumRatio: 2,
			MomentumVelocityRatio: 2,
		},
	});

	// SWIPER TEAM
	const teamSwiper = new Swiper('.team-swiper', {
		slidesPerView: 'auto',
		grabCursor: true,
		freeMode: {
			enabled: true,
			momentumBounce: false,
		},
		breakpoints: {
			320: {
				enabled: true
			},
			480: {
				enabled: false
			}
		}
	});

	// SET CAREER NUMBERS
	var careerNum = document.querySelectorAll(".career-number");
	for (let i = 0; i < careerNum.length; i++) {
		careerNum[i].textContent = "00-" + (i + 1);
	}

	function formatDate(timezoneSetting, el) {
		var mydate = new Date();
		var timezone = timezoneSetting;
		var offset = (mydate.getTimezoneOffset() + (timezone * 60)) * 60 * 1000;
		/*var timestamp = mydate.getTime() + offset,
			seconds = Math.floor(timestamp / 1000) % 60,
			minutes = Math.floor(timestamp / 1000 / 60) % 60,
			hours = Math.floor(timestamp / 1000 / 60 / 60);*/
		mydate.setTime(mydate.getTime() + offset);
		var hour = ('0' + mydate.getHours()).slice(-2),
			mins = ('0' + mydate.getMinutes()).slice(-2),
			secs = ('0' + mydate.getSeconds()).slice(-2),
			ampm;
		if (hour >= 12) {
			ampm = 'PM'
		} else {
			ampm = 'AM'
		}
			//ampm = hour >= 12 ? 'PM' : 'AM';
		document.querySelector(el).innerHTML = hour + ":" + mins + ":" + secs + " " + ampm;
	}
	(function updateLondon() {
		formatDate(0, ".london-time");
		londonTime = setTimeout(updateLondon, 1000);
	})();
	(function updateCapeTown() {
		formatDate(2, ".ct-time");
		ctTime = setTimeout(updateCapeTown, 1000);
	})();

	function initAcc(elem, option) {
		document.querySelectorAll(".dark-list-line").forEach(function (el) {
			el.style.transform = "translateX(-100%)"
		})
		document.querySelectorAll(".acc-head").forEach((item) => {
			gsap.set(item.parentElement.querySelector(".acc-body"), {
				height: 0
			});
			item.addEventListener("click", function (e) {
				var target = e.target,
					targetParent = target.parentElement,
					targetBody = targetParent.querySelector(".acc-body"),
					targetHeight = targetParent.querySelector(".career-acc-body-grid").clientHeight,
					currentListLine = targetParent.querySelector(".acc-list-line"),
					currentMoreLess = targetParent.querySelector(".careers-more-less");
				if (!targetParent.classList.contains("active")) {
					if (option == true) {
						var elementList = document.querySelectorAll(elem + " .acc-list-item");
						elementList.forEach(function (el) {
							if (el.classList.contains("active") && el != targetParent) {
								var elTargetBody = el.querySelector(".acc-body"),
									elListLine = el.querySelector(".acc-list-line"),
									elMoreLess = el.querySelector(".careers-more-less");
								el.classList.remove("active");
								gsap.to(elTargetBody, {
									height: 0,
									duration: .4,
									ease: "inOut"
								});
								elListLine.style.backgroundColor = "#cdcdcd";
								elMoreLess.innerHTML = "MORE +";
							}
						});
					}
					targetParent.classList.add("active");
					gsap.to(targetBody, {
						height: targetHeight,
						duration: .4,
						ease: "inOut"
					});
					currentListLine.style.backgroundColor = "#000";
					currentMoreLess.innerHTML = "LESS —";
				} else {
					targetParent.classList.remove("active");
					gsap.to(targetBody, {
						height: 0,
						duration: .4,
						ease: "inOut"
					});
					currentListLine.style.backgroundColor = "#cdcdcd";
					currentMoreLess.innerHTML = "MORE +";
				}
				setTimeout(() => {
					ScrollTrigger.refresh()
				}, 401);
			});
		});
	}
	initAcc(".careers-list", true); // autoclose boolean

	// DEVICE SPECIFIC FUNCTIONS
	function handleMobileAbout(isMobile) {
		if (isMobile.matches) {
			// MOBILE

			// HOZ TEXT
			//$(".capabilities__item").each(function () {
			document.querySelectorAll(".capabilities__item").forEach(function (item) {
				gsap.fromTo(item, {
					x: "25vw"
				}, {
					x: "0vw",
					ease: "none",
					scrollTrigger: {
						trigger: item,
						scrub: 0.4,
						start: "top bottom",
						end: "top +=40%",
					}
				});
			});

			// COLOUR CHANGE BY TEAM
			colorChange2.to(".studio-content-wrap", {
					backgroundColor: "#F0F0F0"
				})
				.to(".nav", {
					backgroundColor: "#F0F0F0"
				}, "<")
			ScrollTrigger.create({
				trigger: ".capabilities_mobile",
				start: "100% 50%",
				end: "100% 0%",
				scrub: 0.4,
				animation: colorChange2
			});

			// MOBILE NAV COLOR CHANGE
			mobileNav("#f0f0f0", "#fff")
			gsap.set(".nav", {
				backgroundColor: "#BCBCB4"
			})

		} else {
			return
		}
	}

	function handleTabletAbout(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	}

	function handleDesktopAbout(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			var headingHeight = $(".h70.capabilities").outerHeight();
			var numberHeight = $(".cap__number").outerHeight();
			var headings = document.querySelectorAll(".cap-heading-list"),
				numbers = document.querySelectorAll(".cap__numbers"),
				progress = document.querySelector(".cap__progress");

			//$(".capabilities_list_wrap").each(function (index) {
			document.querySelectorAll(".capabilities_list_wrap").forEach(function (item, index) {
				var capTL = gsap.timeline({
					paused: true
				})
				capTL.to(headings, {
						y: -(headingHeight * index),
						duration: 0.6,
						ease: "power3.inOut"
					})
					.to(numbers, {
						y: -(numberHeight * index),
						duration: 0.6,
						ease: "power3.inOut"
					}, "<");

				ScrollTrigger.create({
					scroller: "[data-scroll-container]",
					trigger: item,
					start: "top top+=40%",
					end: "bottom top+=40%",
					fastScrollEnd: true,
					preventOverlaps: "test",
					onEnter: () => capTL.play(),
					onLeaveBack: () => capTL.reverse()
				});

				ScrollTrigger.create({
					scroller: "[data-scroll-container]",
					trigger: item,
					start: "top top+=45%",
					end: "bottom top+=45%",
					fastScrollEnd: true,
					preventOverlaps: "test2",
					scrub: 0.2,
					animation: gsap.fromTo(progress, {
						transform: "scaleX(0)"
					}, {
						transform: "scaleX(1)"
					})
				});
			});

			// HOZ TEXT
			//$(".capabilities__item").each(function () {
			document.querySelectorAll(".capabilities__item").forEach(function (item) {
				gsap.fromTo(item, {
					x: "15vw"
				}, {
					x: "0vw",
					ease: "none",
					scrollTrigger: {
						scroller: "[data-scroll-container]",
						trigger: item,
						scrub: 0.4,
						start: "top bottom",
						end: "top +=25%",
					}
				});
			});

			// HOZ TEXT SEPARATOR
			//$(".cap-list__sep-inner").each(function () {
			document.querySelectorAll(".cap-list__sep-inner").forEach(function (item) {
				gsap.fromTo(item, {
					x: "15vw"
				}, {
					x: "0vw",
					ease: "none",
					scrollTrigger: {
						scroller: "[data-scroll-container]",
						trigger: item,
						scrub: 0.4,
						start: "top bottom",
						end: "top +=25%",
					}
				});
			});

			// COLOUR CHANGE BY TEAM
			colorChange.to(".studio-content-wrap", {
					backgroundColor: "#F0F0F0"
				})
				.to(".nav", {
					backgroundColor: "#F0F0F0"
				}, "<")
			ScrollTrigger.create({
				scroller: "[data-scroll-container]",
				trigger: ".capabilities",
				start: "100% 50%",
				end: "100% 0%",
				scrub: 0.5,
				animation: colorChange
			});

		} else {
			return
		}
	}

	handleMobileAbout(isMobile);
	handleTabletAbout(isTablet);
	handleDesktopAbout(isDesktop);
	isMobile.addEventListener("change", handleMobileAbout);
	isTablet.addEventListener("change", handleTabletAbout);
	isDesktop.addEventListener("change", handleDesktopAbout);
};

function aboutScriptAni() {
	// DEVICE SPECIFIC FUNCTIONS
	function handleMobileAboutAni(isMobile) {
		if (isMobile.matches) {
			// MOBILE
		} else {
			return
		}
	}

	function handleTabletAboutAni(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	}

	function handleDesktopAboutAni(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			// STUDIO LANDING TEXT ANIMATION
			studioLandAni.fromTo(".h100__studio-intro .word", {
					y: "140%"
				}, {
					y: "0%",
					duration: 0.75,
					stagger: 0.1,
					ease: "out"
				})
				.fromTo(".hsmall__studio-intro .line", {
					y: "140%"
				}, {
					y: "0%",
					duration: 1,
					stagger: 0.075,
					ease: "out"
				}, "<50%")
				.fromTo(".paragraph__studio-intro", {
					y: "20%",
					autoAlpha: 0.01
				}, {
					y: "0%",
					autoAlpha: 1,
					duration: 1,
					ease: "out"
				}, "<35%")
				.fromTo(".studio-landing-img", {
					scale: 1.1,
					autoAlpha: 0.01
				}, {
					scale: 1,
					autoAlpha: 1,
					duration: 1,
					ease: "out"
				}, "<10%")

		} else {
			return
		}
	}

	handleMobileAboutAni(isMobile);
	handleTabletAboutAni(isTablet);
	handleDesktopAboutAni(isDesktop);
	isMobile.addEventListener("change", handleMobileAboutAni);
	isTablet.addEventListener("change", handleTabletAboutAni);
	isDesktop.addEventListener("change", handleDesktopAboutAni);
};

/*!
 * * * * * * * * * * * Career
 */

function careerScript() {

	var career = $(".h100__career-intro").attr("data-split-text");
	$(".nav__current-page").text(career);
	$(".body").addClass(career);

	// REMOVE CAREER ACCORDION ITEM IF ON THAT CAREER PAGE
	$(".career-title").each(function () {
		if ($(this).text() == $(".h100__career-intro").attr("data-split-text")) {
			$(this).parents(".acc-list-item").remove();
		}
	});

	// CAREER NUMBERS
	$(".career-number").each(function (index) {
		$(this).text("00-" + (index + 1));
	});

	// ACCORDION OPEN/CLOSE ON CLICK
	$(".acc-head").on("click", function () {
		$(this).next().slideToggle("fast");
		if ($(this).find(".more-less").text() == "LESS —") {
			$(this).find(".more-less").text("MORE +");
			$(this).siblings(".acc-line-mask").find(".acc-list-line").css("background-color", "#cdcdcd");
		} else {
			$(this).find(".more-less").text("LESS —");
			$(this).siblings(".acc-line-mask").find(".acc-list-line").css("background-color", "#000");
		}
		$(".acc-body").not($(this).next()).slideUp("fast");
		$(".acc-head").not($(this)).find(".more-less").text("MORE +");
		$(".acc-head").not($(this)).siblings(".acc-line-mask").find(".acc-list-line").css("background-color", "#cdcdcd");
		setTimeout(function () {
			ScrollTrigger.refresh();
		}, 301);
	});

};

function careerScriptAni() {
	// DEVICE SPECIFIC FUNCTIONS
	function handleMobileCareerAni(isMobile) {
		if (isMobile.matches) {
			// MOBILE

			// MOBILE NAV COLOR CHANGE
			mobileNav("#BCBCB4", "#fff")

		} else {
			return
		}
	}

	function handleTabletCareerAni(isTablet) {
		if (isTablet.matches) {
			// TABLET
		} else {
			return
		}
	}

	function handleDesktopCareerAni(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			// CASE STUDIES LANDING ANIMATION
			let careerAni = gsap.timeline({
				delay: .7
			});
			careerAni.fromTo(".h100__career-intro .word", {
					y: "140%"
				}, {
					y: "0%",
					duration: 0.75,
					stagger: 0.1,
					ease: "out"
				})
				.fromTo(".career-position", {
					y: "140%"
				}, {
					y: "0%",
					duration: 0.4,
					ease: "out"
				}, "<40%")
				.fromTo(".extra-dash", {
					scaleX: 0
				}, {
					scaleX: 1,
					duration: 0.4,
					ease: "out"
				}, "<40%")
				.fromTo(".career-time", {
					y: "140%"
				}, {
					y: "0%",
					duration: 0.4,
					ease: "out"
				}, "<40%")
				.fromTo(".career-location", {
					y: "140%"
				}, {
					y: "0%",
					duration: 0.4,
					ease: "out"
				}, "<25%")
				.fromTo(".location-dash", {
					scaleX: 0
				}, {
					scaleX: 1,
					duration: 0.4,
					ease: "out"
				}, "<40%")
				.fromTo(".career-city", {
					y: "140%"
				}, {
					y: "0%",
					duration: 0.4,
					ease: "out"
				}, "<40%")
				.fromTo(".career-intro-heading", {
					y: "20%",
					autoAlpha: 0.01
				}, {
					y: "0%",
					autoAlpha: 1,
					duration: 1,
					ease: "out"
				}, "<20%")
				.fromTo(".career-intro-paragraph", {
					y: "20%",
					autoAlpha: 0.01
				}, {
					y: "0%",
					autoAlpha: 1,
					duration: 1,
					ease: "out"
				}, "<20%")
				.fromTo(".career-lg-img-img", {
					scale: 1.1,
					autoAlpha: 0.01
				}, {
					scale: 1,
					autoAlpha: 1,
					duration: 1,
					ease: "out"
				}, "<10%")

		} else {
			return
		}
	}

	handleMobileCareerAni(isMobile);
	handleTabletCareerAni(isTablet);
	handleDesktopCareerAni(isDesktop);
	isMobile.addEventListener("change", handleMobileCareerAni);
	isTablet.addEventListener("change", handleTabletCareerAni);
	isDesktop.addEventListener("change", handleDesktopCareerAni);
};

/*!
 * * * * * * * * * * * Privacy
 */

function privacyScript() {
	// ACCORDION OPEN/CLOSE ON CLICK
	$(".acc-head").each(function () {
		$(this).attr("data-open", "false");
	});
	$(".acc-head").on("click", function () {
		var currentBody = $(this).next();
		var currentListLine = $(this).siblings(".acc-line-mask").find(".acc-list-line");
		var currentMoreLess = $(this).find(".more-less-pp");
		if ($(this).attr("data-open") == "true") { // IS OPEN
			$(this).attr("data-open", "false")
			currentBody.slideUp("fast");
			currentListLine.css("background-color", "#cdcdcd");
			currentMoreLess.text("MORE +");
		} else { // IS CLOSED
			$(this).attr("data-open", "true")
			currentBody.slideDown("fast");
			currentListLine.css("background-color", "#000");
			currentMoreLess.text("LESS —");
			$(".acc-head").not($(this)).attr("data-open", "false")
			$(".acc-body").not(currentBody).slideUp("fast");
			$(".acc-list-line").not(currentListLine).css("background-color", "#cdcdcd");
			$(".more-less-pp").not(currentMoreLess).text("MORE +");
		}
		setTimeout(function () {
			ScrollTrigger.refresh()
		}, 350);
	});
}

/*!
 * * * * * * * * * * * Transition
 */

// RUN PAGE ANIMATION DURING TRANSITION
var transitionWatch = {
	value: false,
	get variable() {
		return this.value;
	},
	set variable(value) {
		this.value = value;
		if (this.value === true) {
			if ($(".page-container").attr("data-barba-namespace") == "home") {
				homeScriptAni()
				this.value = false;
			} else if ($(".page-container").attr("data-barba-namespace") == "case studies") {
				caseStudiesScriptAni()
				this.value = false;
			} else if ($(".page-container").attr("data-barba-namespace") == "case study") {
				caseStudyScriptAni()
				this.value = false;
			} else if ($(".page-container").attr("data-barba-namespace") == "work") {
				workScriptAni()
				this.value = false;
			} else if ($(".page-container").attr("data-barba-namespace") == "about") {
				aboutScriptAni()
				this.value = false;
			} else if ($(".page-container").attr("data-barba-namespace") == "career") {
				careerScriptAni()
				this.value = false;
			} else if ($(".page-container").attr("data-barba-namespace") == "contact") {
				contactScriptAni()
				this.value = false;
			}
		}
	}
}

function transitionStart() {
	transitionWatch.variable = true;
}

/*!
 * * * * * * * * * * * Responsive Video
 */

function handleVideo(isMobile) {
	if (isMobile.matches) {
		// MOBILE

		document.querySelectorAll(".source-sm").forEach(function (source) {
			if (source.hasAttribute("data-small-src") && source.getAttribute("data-small-src") != "") {
				var src = source.getAttribute("data-small-src");
				const node = document.createElement("source");
				source.parentElement.appendChild(node);
				node.setAttribute("src", src);
			}
		});

	} else {
		// LARGER DEVICES

		/*document.querySelectorAll(".source-lg").forEach(function (source) {
			if (source.hasAttribute("data-large-src") && source.getAttribute("data-large-src") != "") {
				var src = source.getAttribute("data-large-src");
				const node = document.createElement("source");
				source.parentElement.appendChild(node);
				node.setAttribute("src", src);
			} */

			console.log('new version 2');
			console.log('new version 5');

			var array = [];
			document.querySelectorAll(".source-lg").forEach(source => {
				var src = source.getAttribute("data-large-src")
				array.push(src)
			});
			let urls = [...new Set(array)];
			var loadArray = [];
			urls.forEach(url => {
				var item = {
					src: url,
					id: url,
			    	type: createjs.AbstractLoader.BINARY
				//	type: "video"
				};
				loadArray.push(item)
			});
			var preload;
			var videosTarget = null;
			function init() {
				preload = new createjs.LoadQueue(true);
				preload.on("fileload", function(event) {
					videosTarget = event.result;
				});
				preload.loadManifest(loadArray);
				preload.load();
				preload.on("complete", function(event) {
					var item = event.item;
					var id = item.id;
					var src = videosTarget;
					var blob = new Blob( [src], { "type": "video\/mp4" });
					var url = URL.createObjectURL(blob);
					document.querySelectorAll(".source-lg").forEach(source => {
					
					const node = document.createElement("source");
					node.setAttribute("type", "video/mp4");
					var src = source.getAttribute("data-large-src")
						if (id == src) {
							node.setAttribute("src", url);
							source.parentElement.appendChild(node);
						}
					});
				});
			}
		init();
	}
}

/*!
 * * * * * * * * * * * Preloader
 */

// PRELOADER AND ANIMATION
var preloaderWatch = {
	value: false,
	get variable() {
		return this.value;
	},
	set variable(value) {
		this.value = value;
		if (this.value === true) {
			if ($(".page-container").attr("data-barba-namespace") == "home") {
				homeScriptAni();
			} else if ($(".page-container").attr("data-barba-namespace") == "case studies") {
				caseStudiesScriptAni();
			} else if ($(".page-container").attr("data-barba-namespace") == "case study") {
				caseStudyScriptAni();
			} else if ($(".page-container").attr("data-barba-namespace") == "work") {
				workScriptAni();
			} else if ($(".page-container").attr("data-barba-namespace") == "about") {
				aboutScriptAni();
			} else if ($(".page-container").attr("data-barba-namespace") == "career") {
				careerScriptAni();
			} else if ($(".page-container").attr("data-barba-namespace") == "privacy") {
				//privacyScriptAni();
			}
		}
	}
}

function preloaderDone() {
	preloaderWatch.variable = true;
}

// MUTATION OBSERVER TO DETECT WHEN PACE IS DONE LOADING
if (document.querySelector(".preloader").style.visibility != "hidden") {	
	var preloaderPercentage = document.querySelector(".pace-progress");	
	var preloaderPercentageObserver = new MutationObserver(function (mutations) {	
		if (preloaderPercentage.getAttribute("data-progress-text") == "100%") {	
			preloader();	
			preloaderPercentageObserver.disconnect();	
		}	
	});	
	preloaderPercentageObserver.observe(preloaderPercentage, {	
		attributes: true,	
		attributeFilter: ['data-progress-text']	
	});	
} else {	
	preloaderDone();	
}

function preloader() {
	document.querySelector(".preloader").classList.add("hide-load");
	preloaderWatch.variable = true;
	handleVideo(isMobile);
	firstLoad = false;
	setTimeout(function () {
		document.querySelector(".preloader").style.visibility = "hidden";
		document.querySelector("body").style.overflowY = "scroll";
		ScrollTrigger.refresh();
	}, 750);
}

/*!
 * * * * * * * * * * * Barba
 */

// BARBA HOOKS
barba.hooks.afterLeave((data) => {
	// UPDATE MOBILE MENU COLOR
	updateMenu(data.trigger.href);
	ScrollTrigger.getAll().forEach(t => t.kill());

	// DEVICE SPECIFIC FUNCTIONS
	function handleDesktopAfterLeave(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP
			scroll.stop();
			scroll.destroy();
		} else {
			return
		}
	}
	handleDesktopAfterLeave(isDesktop);

	// REMOVE CURRENT PAGE CLASS TO BODY
	document.querySelector("body").classList.remove(data.current.namespace.replace(" ", "-"))
	if (document.querySelector(".page-container").classList.contains("dark")) {
		document.querySelector("body").classList.remove("dark")
	}
	data.current.container.remove();
});
barba.hooks.beforeEnter((data) => {
	// CLEAR GSAP PROPS FOR NAV
	gsap.set(".nav", {
		clearProps: "background-color"
	})
	// REMOVE HTML EXTENSION
	removeHTMLExt()
	// ADD CURRENT PAGE CLASS TO BODY
	document.querySelector("body").classList.add(data.next.namespace.replace(" ", "-"))
	if (document.querySelector(".page-container").classList.contains("dark")) {
		document.querySelector("body").classList.add("dark")
	}
	// ADD PAGE NAME TO CURENT PAGE NAV INDICATOR
	var nameSpace = data.next.namespace;
	$(".nav__current-page").text(nameSpace);
	// DEVICE SPECIFIC FUNCTIONS
	function handleMobileBeforeEnter(isMobile) {
		if (isMobile.matches) {
			// MOBILE
			$('html, body').animate({
				scrollTop: 0
			}, 0);
			setTimeout(function () {
				ScrollTrigger.refresh();
			}, 1000)
		} else {
			return
		}
	}
	function handleTabletBeforeEnter(isTablet) {
		if (isTablet.matches) {
			// TABLET
			$('html, body').animate({
				scrollTop: 0
			}, 0);
			setTimeout(function () {
				ScrollTrigger.refresh();
			}, 1000)
		} else {
			return
		}
	}
	function handleDesktopBeforeEnter(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP
			initSmoothScroll(data.next.container);
		} else {
			return
		}
	}
	handleMobileBeforeEnter(isMobile);
	handleTabletBeforeEnter(isTablet);
	handleDesktopBeforeEnter(isDesktop);
	isMobile.addEventListener("change", handleMobileBeforeEnter);
	isTablet.addEventListener("change", handleTabletBeforeEnter);
	isDesktop.addEventListener("change", handleDesktopBeforeEnter);
	// GLOBAL REPEAT SCRIPTS
	globalScript();
	cta();
	// RESET FOOTER NAV
	footerNav.pause(0);
	// RESET CUSTOM CURSOR
	gsap.to(".cursor", {
		autoAlpha: 0,
		duration: 0
	});
	// REFRESH SCROLLTRIGGER BEFORE ENTER
	ScrollTrigger.refresh();
});
barba.hooks.afterEnter((data) => {
	// LOAD RESPONSIVE VIDEOS AFTER PAGE LOAD
	if (firstLoad == false) {
		handleVideo(isMobile);
	}
	ScrollTrigger.refresh();
	// DEVICE SPECIFIC FUNCTIONS
	function handleDesktopAfterEnter(isDesktop) {
		if (isDesktop.matches) {
			// DESKTOP

			// OPEN MENU AT TOP OF PAGE
			ScrollTrigger.create({
				scroller: "[data-scroll-container]",
				trigger: "[data-scroll-container]",
				start: "top top-=1px",
				end: "top top-=1px",
				onEnter: () => {
					if (menuAni === false) {
						if (menuOpen === true) {
							closeMenuTL.play(0);
						}
					} else {
						setTimeout(function () {
							if (menuAni === false && menuOpen === true) {
								closeMenuTL.play(0);
							}
						}, 700)
					}
				},
				onLeaveBack: () => {
					if (menuAni === false) {
						if (menuOpen === false) {
							openMenuTL.play(0);
						}
					} else {
						setTimeout(function () {
							if (menuAni === false && menuOpen === false) {
								openMenuTL.play(0);
							}
						}, 700)
					}
				},
			});
			// ON SCROLL START
			ScrollTrigger.addEventListener("scrollStart", () => {
				// CLOSE MENU ON SCROLL START
				if ($(".smooth-scroll").offset().top < -1) {
					if (menuAni === false && menuOpen === true) {
						closeMenuTL.play(0);
					}
				}
				// CLOSE FILTERS ON SCROLL START
				if (document.querySelector(".filter-wrap-nav .filter-option-dropdown").classList.contains("open")) {
					toggleNavFilter();
				}
				if (document.querySelector(".page-container").getAttribute('data-barba-namespace') === 'work') {
					if (document.querySelector(".work-header .filter-option-dropdown").classList.contains("open")) {
						toggleHeaderFilter();
					}
				}
			});

		} else {
			return
		}
	}
	handleDesktopAfterEnter(isDesktop);
});


// BARBA INITIALISE
barba.init({
	debug: false, //turn off when done editing
	timeout: 7000,
	preventRunning: true,
	requestError: (trigger, action, url, response) => {
		if (action === 'click' && response.status && response.status === 404) {
			barba.go('/404');
		}
		return false;
	},
	views: [{
		namespace: '404',
		beforeLeave(data) {
			document.querySelector("a").addEventListener("click", function (e) {
				barba.force(e.target.href)
			});
		}
	}, {
		namespace: 'home',
		beforeEnter(data) {
			homeScript();

			$(".h70-next").text("CASE STUDIES")
			$(".h70-next-wrap").attr("href", "/case-studies")
			$(".h70-next-wrap").attr("onClick", "")
			$(".hsmall-next-count").css("visibility", "visible")
			$(".hsmall-next-count").text(('0' + $(".cs-count").length).slice(-2))
		}
	}, {
		namespace: 'work',
		beforeEnter(data) {
			gridOpen = true;
			listOpen = false;
			document.getElementById("wf-form-work-filter").reset();
			document.getElementById("wf-form-work-filter-2").reset();
			document.querySelector(".nav-filter-active").textContent = "All Work +";
			delete window.fsAttributes;

			window.fsAttributes = window.fsAttributes || [];
			window.fsAttributes.push([
				'cmsnest',
				(cmsLists) => {
					console.log('Attribute has successfully loaded!');
					console.log(cmsLists);
				},
			]);

			var script = document.createElement('script');
			var script2 = document.createElement('script');
			script.async = true;
			script2.async = true;
			data.next.container.appendChild(script);
			data.next.container.appendChild(script2);
			script.onload = function() {ScrollTrigger.refresh()}
			script2.onload = function() {ScrollTrigger.refresh()}
			script.src = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsnest@1.4/cmsnest.js';
			script2.src = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1.10/cmsfilter.js';

			workScript();

			$(".h70-next").text("STUDIO")
			$(".h70-next-wrap").attr("href", "/about")
			$(".h70-next-wrap").attr("onClick", "")
			$(".hsmall-next-count").css("visibility", "hidden")
		}
	}, {
		namespace: 'case studies',
		beforeEnter(data) {
			caseStudiesScript();
			$(".h70-next").text("WORK")
			$(".h70-next-wrap").attr("href", "/work")
			$(".h70-next-wrap").attr("onClick", "")
			$(".hsmall-next-count").css("visibility", "visible")
			$(".hsmall-next-count").text(('0' + $(".work-count").length).slice(-2))
		}
	}, {
		namespace: 'case study',
		beforeEnter(data) {
			const done = this.async();

			$(".h70-next").text("WORK")
			$(".h70-next-wrap").attr("href", "/work")
			$(".h70-next-wrap").attr("onClick", "")
			$(".hsmall-next-count").css("visibility", "visible")
			$(".hsmall-next-count").text(('0' + $(".work-count").length).slice(-2))

			delete window.fsAttributes;

			window.fsAttributes = window.fsAttributes || [];
			window.fsAttributes.push([
				'cmsnest',
				(cmsLists) => {
					console.log('Attribute has successfully loaded!');
					console.log(cmsLists);
				},
			]);

			var script = document.createElement('script');
			//script.async = true;
			script.id = 'cms-nest'
			data.next.container.appendChild(script);
			script.addEventListener('load', function () {
				caseStudyScript();
				ScrollTrigger.refresh();
				done();
			});
			script.src = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsnest@1.4/cmsnest.js';

		}
	}, {
		namespace: 'about',
		beforeEnter(data) {
			aboutScript();
			$(".h70-next").text("CONTACT")
			$(".h70-next-wrap").attr("href", "#")
			$(".h70-next-wrap").attr("onClick", "openContact()")
			$(".hsmall-next-count").css("visibility", "hidden")
		},
		beforeLeave(data) {
			clearTimeout(londonTime);
			clearTimeout(ctTime);
		}
	}, {
		namespace: 'career',
		beforeEnter(data) {
			careerScript();
			$(".h70-next").text("CONTACT")
			$(".h70-next-wrap").attr("href", "#")
			$(".h70-next-wrap").attr("onClick", "openContact()")
			$(".hsmall-next-count").css("visibility", "hidden")
		}
	}, {
		namespace: 'privacy',
		beforeEnter(data) {
			privacyScript();
			$(".h70-next").text("HOME")
			$(".h70-next-wrap").attr("href", "/")
			$(".h70-next-wrap").attr("onClick", "openContact()")
			$(".hsmall-next-count").css("visibility", "hidden")
		}
	}],
	transitions: [{
		name: 'Transition',
		leave(data) {
			trAni = true;
			const done = this.async();
			document.querySelector("body").style.overflow = "hidden";
			$(".transition").css("visibility", "visible")
			$(".page-container").addClass("will-move");
			$(".nav").addClass("will-move");
			$(".transition").addClass("will-move");
			// DEVICE SPECIFIC FUNCTIONS
			function handleMobileLeave(isMobile) {
				if (isMobile.matches) {
					// MOBILE

					var tl = gsap.timeline({});
					tl.fromTo(".transition", {
						y: "100%"
					}, {
						y: "0%",
						duration: .75,
						ease: "inOut",
						onComplete: () => {
							document.querySelector(".t-logo-front-mask").classList.add("running");
							done();
						}
					}, "<")
					//.fromTo(".t-logo-wrap", {opacity: 0}, {delay: 1, opacity: "100%", duration: 1, ease: "in"});

				} else {
					return
				}
			}

			function handleTabletLeave(isTablet) {
				if (isTablet.matches) {
					// TABLET
				} else {
					return
				}
			}

			function handleDesktopLeave(isDesktop) {
				if (isDesktop.matches) {
					// DESKTOP

					var tl = gsap.timeline({});
					tl.fromTo(".page-container", {
							y: "0vh"
						}, {
							y: "-30vh",
							duration: .75,
							ease: "inOut"
						})
						.fromTo(".nav", {
							y: "0vh"
						}, {
							y: "-30vh",
							duration: .75,
							ease: "inOut",
						}, "<")
						.fromTo(".transition", {
							y: "100%"
						}, {
							y: "0%",
							duration: .75,
							ease: "inOut"
						}, "<")
						.fromTo(".t-logo-front-mask", {
							height: 0
						}, {
							height: "100%",
							duration: 2,
							onComplete: () => {
								document.querySelector(".t-logo-front-mask").classList.add("running");
								done();
							}
						})

				} else {
					return
				}
			}

			handleMobileLeave(isMobile);
			handleTabletLeave(isTablet);
			handleDesktopLeave(isDesktop);
			isMobile.addEventListener("change", handleMobileLeave);
			isTablet.addEventListener("change", handleTabletLeave);
			isDesktop.addEventListener("change", handleDesktopLeave);
		},
		enter(data) {
			const done = this.async();
			imagesLoaded(data.next.container, {
				background: true
			}, function () {
				document.querySelector(".t-logo-front-mask").classList.remove("running")
				ScrollTrigger.refresh();
				lbOnce = true;
				// HANDLE DEVICES
				function handleMobileEnter(isMobile) {
					if (isMobile.matches) {
						// MOBILE

						var tl = gsap.timeline({});
						tl.fromTo(".page-container", {
								y: "30vh"
							}, {
								y: "0vh",
								duration: .75,
								ease: "inOut"
							}, "<40%")
							.fromTo(".nav", {
								y: "30vh"
							}, {
								y: "0vh",
								duration: .75,
								ease: "inOut"
							}, "<")
							.fromTo(".transition", {
								y: "0%"
							}, {
								y: "-100%",
								duration: .75,
								ease: "inOut",
								onStart: transitionStart(),
								onComplete: () => {
									$(".page-container").removeClass("will-move");
									$(".nav").removeClass("will-move");
									$(".transition").removeClass("will-move");
								}
							}, "<")
							.fromTo(".nav__logo", {
								y: "120%"
							}, {
								y: "0%",
								duration: 0.5,
								ease: "out"
							}, "<90%")
							.fromTo(".nav__menulink", {
								y: "120%"
							}, {
								y: "0%",
								duration: 0.5,
								ease: "out",
								onComplete: function () {
									menuOpen = true;
									menuAni = false;
									trAni = false;
									$(".transition").css("visibility", "hidden");
									document.querySelector("body").style.overflowY = "scroll";
									done();
								}
							}, "<");

					} else {
						return
					}
				}

				function handleTabletEnter(isTablet) {
					if (isTablet.matches) {
						// TABLET
					} else {
						return
					}
				}

				function handleDesktopEnter(isDesktop) {
					if (isDesktop.matches) {
						// DESKTOP

						var tl = gsap.timeline({});
						tl.fromTo(".page-container", {
								y: "30vh"
							}, {
								y: "0vh",
								duration: .75,
								ease: "inOut"
							}, "<40%")
							.fromTo(".nav", {
								y: "30vh"
							}, {
								y: "0vh",
								duration: .75,
								ease: "inOut"
							}, "<")
							.fromTo(".transition", {
								y: "0%"
							}, {
								y: "-100%",
								duration: .75,
								ease: "inOut",
								onStart: transitionStart(),
								onComplete: () => {
									$(".page-container").removeClass("will-move");
									$(".nav").removeClass("will-move");
									$(".transition").removeClass("will-move");
								}
							}, "<")
							.fromTo(".nav__logo", {
								y: "120%"
							}, {
								y: "0%",
								duration: 0.5,
								ease: "out"
							}, "<90%")
							.fromTo(".menu-links", {
								y: "120%"
							}, {
								y: "0%",
								duration: 0.5,
								stagger: 0.05,
								ease: "out",
								onComplete: function () {
									menuOpen = true;
									menuAni = false;
									trAni = false;
									$(".transition").css("visibility", "hidden");
									document.querySelector("body").style.overflowY = "scroll";
									done();
								}
							}, "<20%");

					} else {
						return
					}
				}

				handleMobileEnter(isMobile);
				handleTabletEnter(isTablet);
				handleDesktopEnter(isDesktop);
				isMobile.addEventListener("change", handleMobileEnter);
				isTablet.addEventListener("change", handleTabletEnter);
				isDesktop.addEventListener("change", handleDesktopEnter);
			});
		}
	}]
});