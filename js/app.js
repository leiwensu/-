//公共js
var requestUrl = "http://10.1.5.112:8088/API";

$(function(){
	var mobiUrl = location.href;
  	// no css animation until the document is loaded
	$('body').removeClass('preload');
    if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
        FastClick.attach(document.body);
        $("#phoneWatch").hide();
    }

    $(".bg").click(function(){
         $('.global-nav').removeClass('active')
        $('.global-nav-initializer').removeClass('mouse-on-nav')

    })

	// redefine default value
	var animationEnd = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd'
	var	transitionEnd = 'transitionEnd webkitTransitionEnd MSTransitionEnd oTransitionEnd'

	var requestAnimationFrame = window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.msRequestAnimationFrame ||
	    window.oRequestAnimationFrame ||
	    function(callback) {
	      return setTimeout(callback, 1);
	    }

	// trim fallback
	if(typeof String.prototype.trim !== 'function') {
	  String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/g, '');
	  }
	}

	// features support detect
	var caniuse = {
		canvas: (function(){
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		})(),

		svg: (function(){
			return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")
		})(),

		backgroundSize: (function(){
			return 'backgroundSize' in document.documentElement.style
		})(),

		transform: (function(){
			return ('transform' in document.documentElement.style)
			|| ('webkitTransform' in document.documentElement.style)
			|| ('oTransform' in document.documentElement.style)
			|| ('msTransform' in document.documentElement.style)
			|| ('mozTransform' in document.documentElement.style)
		})(),

		transition: (function(){
			return ('Transition' in document.documentElement.style)
			|| ('webkitTransition' in document.documentElement.style)
			|| ('oTransition' in document.documentElement.style)
			|| ('msTransition' in document.documentElement.style)
			|| ('mozTransition' in document.documentElement.style)
		})(),

		boxSizing: (function(){
			return ('boxSizing' in document.documentElement.style)
			|| ('webkitBoxSizing' in document.documentElement.style)
			|| ('monBoxSizing' in document.documentElement.style)
		})(),

		flash: (function(){
			if (navigator.plugins != null && navigator.plugins.length > 0){
			    return navigator.plugins["Shockwave Flash"] && true;
			}
			if(~navigator.userAgent.toLowerCase().indexOf("webtv")){
			    return true;
			}
			if(~navigator.appVersion.indexOf("MSIE") && !~navigator.userAgent.indexOf("Opera")){
			    try{
			        return new ActiveXObject("ShockwaveFlash.ShockwaveFlash") && true;
			    } catch(e){}
			}
			return false;
		})
	}

	// functions to execute when scrolling
	var scrollFuncs = []

	// throttle function for scrolling
  var throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    }

    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    }
  }

  // smooth scroll to anchor link
  var smoothScrolling = function(clickedLink, buffer, speed){
		speed = speed | 600
    if (location.pathname.replace(/^\//,'') == clickedLink.pathname.replace(/^\//,'') && location.hostname == clickedLink.hostname) {
      var target = $(clickedLink.hash);
      target = target.length ? target : $('[name=' + clickedLink.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - buffer
        }, speed);
      }
    }
  }

  function isElementInViewport (el) {
    //special bonus for those using jQuery
    if (el instanceof jQuery) {
      el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
      rect.top >= (0 - rect.height) &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight + rect.height || document.documentElement.clientHeight + rect.height) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
	}

	function Circle(canvasElement){
		// a easing function
		easing = function (t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		}

		this.canvas = canvasElement
		this.options = canvasElement.dataset
		this.context = canvasElement.getContext("2d")
	}

	Circle.prototype.animate = function(){
		var o = this.options,
				endAngle = 2 * Math.PI * o.percentage / 100,
				canvas = this.canvas,
				ctx = this.context,
				r = o.radius,
				realR = r - o.strokeWidth/2, // radius minus half stroke width
				duration = o.duration,
				lineStartAngle = parseFloat(o.lineStartAngle) / 180 * Math.PI + 1.5 * Math.PI || 1.5 * Math.PI,
				halfGap = 2 * Math.PI * (100 - o.percentage) / 200,
				startAngle =  halfGap + lineStartAngle,
				currentAngle,
				i = 0

		ctx.strokeStyle = o.strokeColor
		ctx.lineWidth = o.strokeWidth

    function draw(){
    	currentAngle = easing(i, 0, endAngle, duration)

    	ctx.clearRect(0, 0, canvas.width, canvas.height)
	    ctx.beginPath()
			ctx.arc(canvas.width/2, canvas.height/2, realR, startAngle, halfGap + currentAngle + lineStartAngle)
			ctx.stroke()

			i += 1

			if (i < duration) {
				requestAnimationFrame(draw)
			} else {
				$(canvas).parent().addClass('animated')
			}
    }

    requestAnimationFrame(draw)
	}

	var homeOverlayChartInitiated = false;

	function initHomeOverlayChart() {
		// chart
		$('.overlay-risk-chart').highcharts({

	    chart: {
	      polar: true,
	      type: 'line',
	      fluid: true,
	      keys: false,
	      backgroundColor: null
	    },

	    legend: {
	    	enabled: false
	    },

	    title: {
	      text: ''
	    },

	    legend: {
	    	enabled: false
	    },

	    xAxis: {
	      categories: ['诉请1', '诉请2', '诉请3', '诉请4', '诉请5'],
	      tickmarkPlacement: 'on',
	      lineWidth: 0
	    },

	    yAxis: {
	      gridLineInterpolation: 'polygon',
	      lineWidth: 0,
	      min: 0
	    },

	    tooltip: {
	    	shared: true,
	      pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}%</b><br/>'
	    },

	    series: [{
	      name: '预计胜率',
	      data: [90, 60, 65, 80, 50],
	      pointPlacement: 'on'
	    }],

	    exporting: {
	      enabled: false
	    },

	    credits: {
	      enabled: false
	    }
		})

		homeOverlayChartInitiated = true;
	}

	function animateCircles() {
		var el = $('.shape-item'), animateFunc

		if (caniuse.canvas) {
			animateFunc = function(){
				el.each(function(i, el){
					if (isElementInViewport(el) && !$(el).hasClass('start-animation')) {
						$(el).addClass('start-animation').find('canvas').each(function(i, el){
						var circle = new Circle(el)
						circle.animate()
					})
					}
				})
			}

			animateFunc()

			scrollFuncs.push(animateFunc)
		} else {
			el.addClass('no-canvas')
		}
	}

	function initOverlaySteps(){
		$('.step-item').each(function(num, el){
			var $el = $(el),
					wordLength = $el.find('.step-title').text().trim().length

			if (wordLength > 15) {
				$el.addClass('smallest-font')
			} else if (wordLength > 6) {
				$el.addClass('smaller-font')
			}

			$el.find('.step-num').text(num + 1)
		})
	}

	// SVG fallback
	if (!caniuse.svg){
		$('.svg-fallback-img').addClass('active')
	}

	// background:cover fallback for home hero slides
	if (!caniuse.backgroundSize) {
		_el = $('.hero-slide-item')
		if (_el.length === 0) {
			_el = $('.hero')
		}
		_el.each(function(i, el){
			var el = $(el),
					bg = el.find('.bg'),
					imgUrl, imgTag, marginTopValue

			if (bg.length > 0) {
				bg.hide()

				imgTag = '<img src="' + bg.css('background-image').slice(5,-2) + '" />'

				$(imgTag).css({
					'width': '100%',
					'height': '100%',
					'position': 'absolute',
					'left': '0',
					'top': '0'
				}).insertBefore(bg)
			}
		})
	}

	// transform fallback
	if (!caniuse.transform) {
		$('.global-nav-initializer').addClass('without-transform')
	}

	// boxsizing issues of base-inputs in modal
	if (!caniuse.boxSizing || $("html").hasClass("oldie")) {
		$('.modal .base-input').each(function(i, el){
			var el = $(el)
			el.css('width', 2 * el.width() - el.outerWidth() + 'px' )
		})
	}

	// home overlay tabs switch
	$('.home-overlay-nav-link').click(function(){
		if(!$(this).hasClass('active')){
			$('.home-overlay-nav-link.active').add('.home-overlay-content.active').removeClass('active')
			$(this).addClass('active')
			$('.home-overlay-content.' + $(this).data('target')).addClass('active')

			if ($(this).hasClass('overlay-process')) {
				$('.step-item').each(function(num, el){
	  			var delay = 0.4 + num * 0.1
	  			$(el).css('transitionDelay', delay + 's').one(transitionEnd, function(){
	  				$(this).attr('style', '')
	  			})
	  		})
			}
		}

		return false
	})

  var modals = {
  	options: {
  		menu: $('.global-nav'),
  		menuActiveClass: 'overlay-active',
	  	modal: $('.overlay'),
	  	globalMenu: $('.global-nav-inner'),
	  	initModal: $('a[data-modal]'),
	  	lightboxNav: $('.lightbox-navigator'),
	  	lightboxImages: $('[data-modal=lightbox]'),
  		menuBtn: $('.global-nav-initializer'),
	  	modalBg: $('.overlay')
  	},

  	init: function(){
			this.bindUIActions()
  	},

  	hoverToCloseNav: function(){
  		var o = this.options

  		return function(){
  			if ($('.mouse-on-nav').length > 0) {
  				return false
  			} else {
  				o.menu.removeClass('active')
  			}
  		}
  	},

  	bindUIActions: function(){
  		var _ = this,
		  		o = _.options

		  // hover to activate and disable menu
  		o.menuBtn.click(function(){
  			if (!$('.global-nav').hasClass('active')) {
	  			o.menu.addClass('active')
	  			$(this).addClass('mouse-on-nav')

  			}else{
                o.menu.removeClass('active')
                $(this).removeClass('mouse-on-nav')
                window.setTimeout(_.hoverToCloseNav(), 300)

            }
  		})

  	},

  	enableCloseBtn: function(btnStyle){
  		btnStyle = '' || btnStyle
  		$('.global-nav').addClass('overlay-active ' + btnStyle)
  		$('body').addClass('static')
  	}
  }

  function changeHeaderBtnColor(){
  	/*var menuBtn = $('.global-nav-initializer'),
  			logo = $('.header-logo'),
  			heroHeight = $('.hero').height()*/

  	// don't change color when there's no bg in hero
  	/*if ($('.hero .bg').length > 0) {
  		if (menuBtn.offset().top > heroHeight) {
  			$(".header-logo").addClass('header-bg');
            $(".global-nav-initializer").addClass('no-white');
            $(".header-logo a").show();
  		} else {
  			$(".header-logo").removeClass('header-bg');
            $(".global-nav-initializer").removeClass('no-white');
            $(".header-logo a").hide();
  		}*/

		var sTop = document.body.scrollTop;
		if($('.hero').length){
			var heroHeight = $('.hero').height();
			if(sTop > heroHeight) {
				$(".header-logo").addClass('header-bg');
		        $(".global-nav-initializer").addClass('no-white');
		        $(".header-logo a").css('display','inline-block');
			}
			if(sTop < heroHeight) {
				$(".header-logo").removeClass('header-bg');
		        $(".global-nav-initializer").removeClass('no-white');
		        $(".header-logo a").hide();
			}
		}else {
			if(sTop > 100) {
				$(".header-logo").addClass('header-bg');
		        $(".global-nav-initializer").addClass('no-white');
		        $(".header-logo a").css('display','inline-block');
			}
			if(sTop < 150) {
				$(".header-logo").removeClass('header-bg');
		        $(".global-nav-initializer").removeClass('no-white');
		        $(".header-logo a").hide();
			}
		}

  	

  }

  // change the color of header logo and menu button
  scrollFuncs.push(changeHeaderBtnColor)

	// slides
	var slides = {
		options: {
			slideWrap: $('.hero-slides'),
            slide: $('.hero-slide-item'),
            dot: $('.slides-pagination-item'),
            next: $('.next-slide')
          },

        inTransition: 0, // 0 means no transition, number means number of transitions going on
	  animationQueue: [],
	  animationQueueMax: 2,
	  timeoutID: 0,
	  autoplaySpeed: 5500,
	  autoplaying: true,
	  touchStartX: 0,
	  touchStartY: 0,
	  swipeThreshold: 70,

	  init: function(){
	  	this.bindUIActions()

	  	if ($(document).width() < 600) {
	  		this.autoplaying = false
	  	}
	  },

	  bindUIActions: function(){
	  	var _ = this,
	  			o = _.options

	  	// click dot to navigate
	  	o.dot.click(function(){
	  		if(!$(this).hasClass('active')){
	  			_.switchSlide(o.dot.index($(this)))
	  		}
	  		return false
	  	})

	  	// using keys to control
	  	$('body').keydown(function(e){
	  		var t,
	  				el = o.slide.filter('.active'),
	  				key = e.keyCode

	  		if (key === 39 || key === 37) {
	  			if (key === 39) {
	  				_.switchSlide('next')
	  			} else {
	  				_.switchSlide('prev')
	  			}

	  			return false
	  		}
	  	})

	  	if ("ontouchstart" in document.documentElement && o.slideWrap.length > 0) {
		  	o.slideWrap[0].addEventListener('touchstart', function(e){
		  		_.touchStartX = e.changedTouches[0].pageX
		  		_.touchStartY = e.changedTouches[0].pageY
		  	}, false)

		  	o.slideWrap[0].addEventListener('touchend', function(e){
		  		var changeX = e.changedTouches[0].pageX - _.touchStartX,
		  				changeY = e.changedTouches[0].pageY - _.touchStartY

			  	if (Math.abs(changeY) < (_.swipeThreshold / 2)) {
			  		if (changeX > _.swipeThreshold) {
			  			_.switchSlide('prev')
			  		} else if (changeX < (-1 * _.swipeThreshold / 2)) {
			  			_.switchSlide('next')
			  		}
			  	}
		  	}, false)
	  	}

	  	// click to next slide
	  	o.next.click(function(){
	  		// won't execute if there's animation going on
	  		if (_.inTransition === 0) {
					_.switchSlide('next')
	  		}
  			return false
	  	})
	  },

	  updateDot: function(){
	  	var o = this.options

	  	o.dot.filter('.active').removeClass('active')
	  	o.dot.eq(o.slide.index(o.slide.filter('.active'))).addClass('active')
	  },


	  nextAutoplay: function(){
	  	var _ = this

	  	function autoplayFunc(){
	  		return function(){
	  			_.switchSlide('next', true)
	  		}
	  	}

	  	_.timeoutID = window.setTimeout(autoplayFunc(), _.autoplaySpeed)
	  },

	  switchSlide: function(num, isAutoplay){
	  	var _ = this,
	  			o = _.options,
	  			s = _.status,
			  	el = o.slide.filter('.active'),
			  	newSlide,
			  	isAutoplay = isAutoplay || false,

			  	// function to execute next animtion and remove animation class
			  	rmClass = function(t){
		  			return function(e){
		  				$(this).removeClass('animated ' + t)

							// we remove 1 animation
		  				_.inTransition -= 1

		  				// if there's no ongoing animation
		  				if (_.inTransition === 0) {
				  			// execute next animation in the queue if any
				  			if (_.animationQueue.length > 0) {
				  				_.switchSlide(_.animationQueue.shift())
				  			}

				  			if (!!_.autoplaying) {
				  				_.nextAutoplay()
				  			}
			  			}
	  				}
		  		}

		  // clear next autoplay
		 	window.clearTimeout(_.timeoutID)

			if (_.inTransition !== 0) {
				// if animation queue is not too long
				// and the new animation is not generated from autoplay
				if (_.animationQueue.length >= _.animationQueueMax && !isAutoplay) {
					_.animationQueue.shift()
				}
				_.animationQueue.push(num)
				return false
			}

	  	if (num === 'next') {
	  		// next
	  		if (el.is(':last-child')) {
	  			newSlide = o.slide.eq(0)
	  		} else {
	  			newSlide = el.next()
	  		}

	  		if(caniuse.transition) {
	  			_.inTransition += 2
		  		el.addClass('animated fadeOutLeft').removeClass('active').one(animationEnd, rmClass('fadeOutLeft'))
		  		newSlide.addClass('animated fadeInLeft').addClass('active').one(animationEnd, rmClass('fadeInLeft'))
	  		} else {
	  			el.removeClass('active')
	  			newSlide.addClass('active')
	  			if (!!_.autoplaying) {
	  				_.nextAutoplay()
	  			}
	  		}
	  	} else if (num === 'prev') {
	  		// prev
	  		if (el.is(':first-child')) {
	  			newSlide = o.slide.eq(-1)
	  		} else {
	  			newSlide = el.prev()
	  		}

	  		if(caniuse.transition) {
	  			_.inTransition += 2
	  			el.addClass('animated fadeOutRight').removeClass('active').one(animationEnd, rmClass('fadeOutRight'))
	  			newSlide.addClass('animated fadeInRight').addClass('active').one(animationEnd, rmClass('fadeInRight'))
	  		} else {
	  			el.removeClass('active')
	  			newSlide.addClass('active')
	  			if (!!_.autoplaying) {
	  				_.nextAutoplay()
	  			}
	  		}
	  	} else if (typeof(num) === 'number') {
	  		newSlide = o.slide.eq(num)

	  		if(caniuse.transition) {
	  			_.inTransition += 2
	  			if (num > o.slide.index(o.slide.filter('.active'))){
	  				el.addClass('animated fadeOutLeft').removeClass('active').one(animationEnd, rmClass('fadeOutLeft'))
	  				newSlide.addClass('animated fadeInLeft').addClass('active').one(animationEnd, rmClass('fadeInLeft'))
	  			} else {
	  				el.addClass('animated fadeOutRight').removeClass('active').one(animationEnd, rmClass('fadeOutRight'))
	  				newSlide.addClass('animated fadeInRight').addClass('active').one(animationEnd, rmClass('fadeInRight'))
	  			}
	  		} else {
	  			el.removeClass('active')
	  			newSlide.addClass('active')
	  			if (!!_.autoplaying) {
	  				_.nextAutoplay()
	  			}
	  		}
	  	}
			_.updateDot()
	  }
	}

	window.setTimeout((function(){
		return function(){
			$('header').removeClass('pre-stage')
		}
	})(), 800)
	// openday carousel
	$('.event-link').click(function(){

		var target = $('.' + $(this).data('target'))

		if (!$(this).hasClass('active')) {
			$('.event-link.active').removeClass('active')
			$(this).addClass('active')
			if (caniuse.transition) {
				$('.event-content.active').addClass('fadeOut').find('.post-content-wrap').one(transitionEnd, function(){
					$(this).parent().removeClass('active fadeOut')
					target.addClass('active')
				})
			} else {
				$('.event-content.active').removeClass('active')
				target.addClass('active')
			}
		}

		return false
	})

	$('.home-scroll-down').click(function(){
//        window.location.hash = '#features';
//        window.location = window.location;
		smoothScrolling(this, 55, 800);
//  	    return false;
	})

	// return to top
	$('.footer-logo').click(function(){
		$("html, body").animate({
			scrollTop: 0
		}, "400")

		return false
	})


	// init
	changeHeaderBtnColor()
	slides.init()
	modals.init()
	animateCircles()
	initOverlaySteps()

  if (scrollFuncs.length > 0) {
  	$(window).scroll(throttle(function(){
  		for (var i = 0; i < scrollFuncs.length; i++) {
	  		scrollFuncs[i]()
	  	}
  	}, 80))
  }


})

//律师遮罩
function showShade(that,count){
    var obj = $(that);
    var w = obj.width(),h = obj.height();

    if(count == 1){
    	obj.append('<div class="block_shade"><img class="block_shade_pic" src="image/float_detail.png" /></div>');
    }else {
    	obj.append('<div class="block_shade"></div>');
    }
    $(".block_shade").css({
        width: w,
        height: h
    });
}
function removeShade(that){
    $(that).find(".block_shade").remove();
}
/**
 * 获取url查询字符串
 * @param   {[[Type]]} name url查询参数
 * @returns {[[Type]]} 查询参数值
 */
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
