// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_accordion
// Usage: codyhouse.co/license
(function() {
	var Accordion = function(element) {
		this.element = element;
		this.items = Util.getChildrenByClassName(this.element, 'js-accordion__item');
		this.version = this.element.getAttribute('data-version') ? '-'+this.element.getAttribute('data-version') : '';
		this.showClass = 'accordion'+this.version+'__item--is-open';
		this.animateHeight = (this.element.getAttribute('data-animation') == 'on');
		this.multiItems = !(this.element.getAttribute('data-multi-items') == 'off'); 
		// deep linking options
		this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
		// init accordion
		this.initAccordion();
	};

	Accordion.prototype.initAccordion = function() {
		//set initial aria attributes
		for( var i = 0; i < this.items.length; i++) {
			var button = this.items[i].getElementsByTagName('button')[0],
				content = this.items[i].getElementsByClassName('js-accordion__panel')[0],
				isOpen = Util.hasClass(this.items[i], this.showClass) ? 'true' : 'false';
			Util.setAttributes(button, {'aria-expanded': isOpen, 'aria-controls': 'accordion-content-'+i, 'id': 'accordion-header-'+i});
			Util.addClass(button, 'js-accordion__trigger');
			Util.setAttributes(content, {'aria-labelledby': 'accordion-header-'+i, 'id': 'accordion-content-'+i});
		}

		//listen for Accordion events
		this.initAccordionEvents();

		// check deep linking option
		this.initDeepLink();
	};

	Accordion.prototype.initAccordionEvents = function() {
		var self = this;

		this.element.addEventListener('click', function(event) {
			var trigger = event.target.closest('.js-accordion__trigger');
			//check index to make sure the click didn't happen inside a children accordion
			if( trigger && Util.getIndexInArray(self.items, trigger.parentElement) >= 0) self.triggerAccordion(trigger);
		});
	};

	Accordion.prototype.triggerAccordion = function(trigger) {
		var bool = (trigger.getAttribute('aria-expanded') === 'true');

		this.animateAccordion(trigger, bool, false);

		if(!bool && this.deepLinkOn) {
			history.replaceState(null, '', '#'+trigger.getAttribute('aria-controls'));
		}
	};

	Accordion.prototype.animateAccordion = function(trigger, bool, deepLink) {
		var self = this;
		var item = trigger.closest('.js-accordion__item'),
			content = item.getElementsByClassName('js-accordion__panel')[0],
			ariaValue = bool ? 'false' : 'true';

		if(!bool) Util.addClass(item, this.showClass);
		trigger.setAttribute('aria-expanded', ariaValue);
		self.resetContentVisibility(item, content, bool);

		if( !this.multiItems && !bool || deepLink) this.closeSiblings(item);
	};

	Accordion.prototype.resetContentVisibility = function(item, content, bool) {
		Util.toggleClass(item, this.showClass, !bool);
		content.removeAttribute("style");
		if(bool && !this.multiItems) { // accordion item has been closed -> check if there's one open to move inside viewport 
			this.moveContent();
		}
	};

	Accordion.prototype.closeSiblings = function(item) {
		//if only one accordion can be open -> search if there's another one open
		var index = Util.getIndexInArray(this.items, item);
		for( var i = 0; i < this.items.length; i++) {
			if(Util.hasClass(this.items[i], this.showClass) && i != index) {
				this.animateAccordion(this.items[i].getElementsByClassName('js-accordion__trigger')[0], true, false);
				return false;
			}
		}
	};

	Accordion.prototype.moveContent = function() { // make sure title of the accordion just opened is inside the viewport
		var openAccordion = this.element.getElementsByClassName(this.showClass);
		if(openAccordion.length == 0) return;
		var boundingRect = openAccordion[0].getBoundingClientRect();
		if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
			var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
			window.scrollTo(0, boundingRect.top + windowScrollTop);
		}
	};

	Accordion.prototype.initDeepLink = function() {
		if(!this.deepLinkOn) return;
		var hash = window.location.hash.substr(1);
		if(!hash || hash == '') return;
		var trigger = this.element.querySelector('.js-accordion__trigger[aria-controls="'+hash+'"]');
		if(trigger && trigger.getAttribute('aria-expanded') !== 'true') {
			this.animateAccordion(trigger, false, true);
			setTimeout(function(){trigger.scrollIntoView(true);});
		}
	};

	window.Accordion = Accordion;
	
	//initialize the Accordion objects
	var accordions = document.getElementsByClassName('js-accordion');
	if( accordions.length > 0 ) {
		for( var i = 0; i < accordions.length; i++) {
			(function(i){new Accordion(accordions[i]);})(i);
		}
	}
}());
// File#: _1_alert
// Usage: codyhouse.co/license
(function() {
	var alertClose = document.getElementsByClassName('js-alert__close-btn');
	if( alertClose.length > 0 ) {
		for( var i = 0; i < alertClose.length; i++) {
			(function(i){initAlertEvent(alertClose[i]);})(i);
		}
	};
}());

function initAlertEvent(element) {
	element.addEventListener('click', function(event){
		event.preventDefault();
		Util.removeClass(element.closest('.js-alert'), 'alert--is-visible');
	});
};
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
	var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
	if( menuBtns.length > 0 ) {
		for(var i = 0; i < menuBtns.length; i++) {(function(i){
			initMenuBtn(menuBtns[i]);
		})(i);}

		function initMenuBtn(btn) {
			btn.addEventListener('click', function(event){	
				event.preventDefault();
				var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
				Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
				// emit custom event
				var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
				btn.dispatchEvent(event);
			});
		};
	}
}());
// File#: _1_animated-headline
// Usage: codyhouse.co/license
(function() {
  var TextAnim = function(element) {
    this.element = element;
    this.wordsWrapper = this.element.getElementsByClassName(' js-text-anim__wrapper');
    this.words = this.element.getElementsByClassName('js-text-anim__word');
    this.selectedWord = 0;
    // interval between two animations
    this.loopInterval = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-pause'))*1000 || 1000;
    // duration of single animation (e.g., time for a single word to rotate)
    this.transitionDuration = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-duration'))*1000 || 1000;
    // keep animating after first loop was completed
    this.loop = (this.element.getAttribute('data-loop') && this.element.getAttribute('data-loop') == 'off') ? false : true;
    this.wordInClass = 'text-anim__word--in';
    this.wordOutClass = 'text-anim__word--out';
    // check for specific animations
    this.isClipAnim = Util.hasClass(this.element, 'text-anim--clip');
    if(this.isClipAnim) {
      this.animBorderWidth = parseInt(getComputedStyle(this.element).getPropertyValue('--text-anim-border-width')) || 2;
      this.animPulseClass = 'text-anim__wrapper--pulse';
    }
    initTextAnim(this);
  };

  function initTextAnim(element) {
    // make sure there's a word with the wordInClass
    setSelectedWord(element);
    // if clip animation -> add pulse class
    if(element.isClipAnim) {
      Util.addClass(element.wordsWrapper[0], element.animPulseClass);
    }
    // init loop
    loopWords(element);
  };

  function setSelectedWord(element) {
    var selectedWord = element.element.getElementsByClassName(element.wordInClass);
    if(selectedWord.length == 0) {
      Util.addClass(element.words[0], element.wordInClass);
    } else {
      element.selectedWord = Util.getIndexInArray(element.words, selectedWord[0]);
    }
  };

  function loopWords(element) {
    // stop animation after first loop was completed
    if(!element.loop && element.selectedWord == element.words.length - 1) {
      return;
    }
    var newWordIndex = getNewWordIndex(element);
    setTimeout(function() {
      if(element.isClipAnim) { // clip animation only
        switchClipWords(element, newWordIndex);
      } else {
        switchWords(element, newWordIndex);
      }
    }, element.loopInterval);
  };

  function switchWords(element, newWordIndex) {
    // switch words
    Util.removeClass(element.words[element.selectedWord], element.wordInClass);
    Util.addClass(element.words[element.selectedWord], element.wordOutClass);
    Util.addClass(element.words[newWordIndex], element.wordInClass);
    // reset loop
    resetLoop(element, newWordIndex);
  };

  function resetLoop(element, newIndex) {
    setTimeout(function() { 
      // set new selected word
      Util.removeClass(element.words[element.selectedWord], element.wordOutClass);
      element.selectedWord = newIndex;
      loopWords(element); // restart loop
    }, element.transitionDuration);
  };

  function switchClipWords(element, newWordIndex) {
    // clip animation only
    var startWidth =  element.words[element.selectedWord].offsetWidth,
      endWidth = element.words[newWordIndex].offsetWidth;
    
    // remove pulsing animation
    Util.removeClass(element.wordsWrapper[0], element.animPulseClass);
    // close word
    animateWidth(startWidth, element.animBorderWidth, element.wordsWrapper[0], element.transitionDuration, function() {
      // switch words
      Util.removeClass(element.words[element.selectedWord], element.wordInClass);
      Util.addClass(element.words[newWordIndex], element.wordInClass);
      element.selectedWord = newWordIndex;

      // open word
      animateWidth(element.animBorderWidth, endWidth, element.wordsWrapper[0], element.transitionDuration, function() {
        // add pulsing class
        Util.addClass(element.wordsWrapper[0], element.animPulseClass);
        loopWords(element);
      });
    });
  };

  function getNewWordIndex(element) {
    // get index of new word to be shown
    var index = element.selectedWord + 1;
    if(index >= element.words.length) index = 0;
    return index;
  };

  function animateWidth(start, to, element, duration, cb) {
    // animate width of a word for the clip animation
    var currentTime = null;

    var animateProperty = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      
      var val = Math.easeInOutQuart(progress, start, to - start, duration);
      element.style.width = val+"px";
      if(progress < duration) {
          window.requestAnimationFrame(animateProperty);
      } else {
        cb();
      }
    };
  
    //set the width of the element before starting animation -> fix bug on Safari
    element.style.width = start+"px";
    window.requestAnimationFrame(animateProperty);
  };

  window.TextAnim = TextAnim;

  // init TextAnim objects
  var textAnim = document.getElementsByClassName('js-text-anim'),
    reducedMotion = Util.osHasReducedMotion();
  if( textAnim ) {
    if(reducedMotion) return;
    for( var i = 0; i < textAnim.length; i++) {
      (function(i){ new TextAnim(textAnim[i]);})(i);
    }
  }
}());
// File#: _1_btn-slide-fx
// Usage: codyhouse.co/license
(function() {
  var BtnSlideFx = function(element) {
		this.element = element;
    this.hover = false; 
		btnSlideFxEvents(this);
	};

  function btnSlideFxEvents(btn) {
    btn.element.addEventListener('mouseenter', function(event){ // detect mouse hover
      btn.hover = true;
      triggerBtnSlideFxAnimation(btn.element, 'from');
    });
    btn.element.addEventListener('mouseleave', function(event){ // detect mouse leave
      btn.hover = false;
      triggerBtnSlideFxAnimation(btn.element, 'to');
    });
    btn.element.addEventListener('transitionend', function(event){ // reset btn classes at the end of enter/leave animation
      resetBtnSlideFxAnimation(btn.element);
    });
  };

  function getEnterDirection(element, event) { // return mouse movement direction
    var deltaLeft = Math.abs(element.getBoundingClientRect().left - event.clientX),
      deltaRight = Math.abs(element.getBoundingClientRect().right - event.clientX),
      deltaTop = Math.abs(element.getBoundingClientRect().top - event.clientY),
      deltaBottom = Math.abs(element.getBoundingClientRect().bottom - event.clientY);
    var deltaXDir = (deltaLeft < deltaRight) ? 'left' : 'right',
      deltaX = (deltaLeft < deltaRight) ? deltaLeft : deltaRight,
      deltaYDir = (deltaTop < deltaBottom) ? 'top' : 'bottom',
      deltaY = (deltaTop < deltaBottom) ? deltaTop : deltaBottom;
    return (deltaX < deltaY) ? deltaXDir : deltaYDir;
  };
  
  function triggerBtnSlideFxAnimation(element, direction) { // trigger animation -> apply in/out and direction classes
    var inStep = (direction == 'from') ? '-out' : '',
      outStep = (direction == 'from') ? '' : '-out';
    Util.removeClass(element, 'btn-slide-fx-hover'+inStep);
    resetBtnSlideFxAnimation(element);
    Util.addClass(element, 'btn--slide-fx-'+direction+'-'+getEnterDirection(element, event)); // set direction 
    setTimeout(function(){Util.addClass(element, 'btn-slide-fx-animate');}, 5); // add transition
    setTimeout(function(){Util.addClass(element, 'btn-slide-fx-hover'+outStep);}, 10); // trigger transition
  };

  function resetBtnSlideFxAnimation(element) { // remove animation classes
    Util.removeClass(element, 'btn--slide-fx-from-left btn--slide-fx-from-right btn--slide-fx-from-bottom btn--slide-fx-from-top btn--slide-fx-to-left btn--slide-fx-to-right btn--slide-fx-to-bottom btn--slide-fx-to-top btn-slide-fx-animate');
  };

	//initialize the BtnSlideFx objects
	var btnSlideFx = document.getElementsByClassName('js-btn--slide-fx');
	if( btnSlideFx.length > 0 ) {
		for( var i = 0; i < btnSlideFx.length; i++) {
      (function(i){new BtnSlideFx(btnSlideFx[i]);})(i);
		}
  }
}());
// File#: _1_confetti-button
// Usage: codyhouse.co/license
(function() {
  var ConfettiBtn = function(element) {
    this.element = element;
    this.btn = this.element.getElementsByClassName('js-confetti-btn__btn');
    this.icon = this.element.getElementsByClassName('js-confetti-btn__icon');
    this.animating = false;
    this.animationClass = 'confetti-btn--animate';
    this.positionVariables = '--conf-btn-click-';
    initConfettiBtn(this);
	};

  function initConfettiBtn(element) {
    if(element.btn.length < 1 || element.icon.length < 1) return;
    element.btn[0].addEventListener('click', function(event){
      if(element.animating) return;
      element.animating = true;
      setAnimationPosition(element, event);
      Util.addClass(element.element, element.animationClass);
      resetAnimation(element);
    });
  };

  function setAnimationPosition(element, event) { // change icon position based on click position
    
    var btnBoundingRect = element.btn[0].getBoundingClientRect();
    document.documentElement.style.setProperty(element.positionVariables+'x', (event.clientX - btnBoundingRect.left)+'px');
    document.documentElement.style.setProperty(element.positionVariables+'y', (event.clientY - btnBoundingRect.top)+'px');
  };

  function resetAnimation(element) { // reset the button at the end of the icon animation
    
    element.icon[0].addEventListener('animationend', function cb(){
      element.icon[0].removeEventListener('animationend', cb);
      Util.removeClass(element.element, element.animationClass);
      element.animating = false;
    });
  };

  var confettiBtn = document.getElementsByClassName('js-confetti-btn');
  if(confettiBtn.length > 0) {
    for(var i = 0; i < confettiBtn.length; i++) {
      (function(i){new ConfettiBtn(confettiBtn[i]);})(i);
    }
  }
}());
// File#: _1_details
// Usage: codyhouse.co/license
(function() {
	var Details = function(element, index) {
		this.element = element;
		this.summary = this.element.getElementsByClassName('js-details__summary')[0];
		this.details = this.element.getElementsByClassName('js-details__content')[0];
		this.htmlElSupported = 'open' in this.element;
		this.initDetails(index);
		this.initDetailsEvents();
	};

	Details.prototype.initDetails = function(index) {
		// init aria attributes 
		Util.setAttributes(this.summary, {'aria-expanded': 'false', 'aria-controls': 'details--'+index, 'role': 'button'});
		Util.setAttributes(this.details, {'aria-hidden': 'true', 'id': 'details--'+index});
	};

	Details.prototype.initDetailsEvents = function() {
		var self = this;
		if( this.htmlElSupported ) { // browser supports the <details> element 
			this.element.addEventListener('toggle', function(event){
				var ariaValues = self.element.open ? ['true', 'false'] : ['false', 'true'];
				// update aria attributes when details element status change (open/close)
				self.updateAriaValues(ariaValues);
			});
		} else { //browser does not support <details>
			this.summary.addEventListener('click', function(event){
				event.preventDefault();
				var isOpen = self.element.getAttribute('open'),
					ariaValues = [];

				isOpen ? self.element.removeAttribute('open') : self.element.setAttribute('open', 'true');
				ariaValues = isOpen ? ['false', 'true'] : ['true', 'false'];
				self.updateAriaValues(ariaValues);
			});
		}
	};

	Details.prototype.updateAriaValues = function(values) {
		this.summary.setAttribute('aria-expanded', values[0]);
		this.details.setAttribute('aria-hidden', values[1]);
	};

	//initialize the Details objects
	var detailsEl = document.getElementsByClassName('js-details');
	if( detailsEl.length > 0 ) {
		for( var i = 0; i < detailsEl.length; i++) {
			(function(i){new Details(detailsEl[i], i);})(i);
		}
	}
}());
// File#: _1_form-validator
// Usage: codyhouse.co/license
(function() {
  var FormValidator = function(opts) {
    this.options = Util.extend(FormValidator.defaults , opts);
		this.element = this.options.element;
    this.input = [];
    this.textarea = [];
    this.select = [];
    this.errorFields = [];
    this.errorFieldListeners = [];
		initFormValidator(this);
	};

  //public functions
  FormValidator.prototype.validate = function(cb) {
    validateForm(this);
    if(cb) cb(this.errorFields);
  };

  // private methods
  function initFormValidator(formValidator) {
    formValidator.input = formValidator.element.querySelectorAll('input');
    formValidator.textarea = formValidator.element.querySelectorAll('textarea');
    formValidator.select = formValidator.element.querySelectorAll('select');
  };

  function validateForm(formValidator) {
    // reset input with errors
    formValidator.errorFields = []; 
    // remove change/input events from fields with error
    resetEventListeners(formValidator);
    
    // loop through fields and push to errorFields if there are errors
    for(var i = 0; i < formValidator.input.length; i++) {
      validateField(formValidator, formValidator.input[i]);
    }

    for(var i = 0; i < formValidator.textarea.length; i++) {
      validateField(formValidator, formValidator.textarea[i]);
    }

    for(var i = 0; i < formValidator.select.length; i++) {
      validateField(formValidator, formValidator.select[i]);
    }

    // show errors if any was found
    for(var i = 0; i < formValidator.errorFields.length; i++) {
      showError(formValidator, formValidator.errorFields[i]);
    }

    // move focus to first field with error
    if(formValidator.errorFields.length > 0) formValidator.errorFields[0].focus();
  };

  function validateField(formValidator, field) {
    if(!field.checkValidity()) {
      formValidator.errorFields.push(field);
      return;
    }
    // check for custom functions
    var customValidate = field.getAttribute('data-validate');
    if(customValidate && formValidator.options.customValidate[customValidate]) {
      formValidator.options.customValidate[customValidate](field, function(result) {
        if(!result) formValidator.errorFields.push(field);
      });
    }
  };

  function showError(formValidator, field) {
    // add error classes
    toggleErrorClasses(formValidator, field, true);

    // add event listener
    var index = formValidator.errorFieldListeners.length;
    formValidator.errorFieldListeners[index] = function() {
      toggleErrorClasses(formValidator, field, false);
      field.removeEventListener('change', formValidator.errorFieldListeners[index]);
      field.removeEventListener('input', formValidator.errorFieldListeners[index]);
    };
    field.addEventListener('change', formValidator.errorFieldListeners[index]);
    field.addEventListener('input', formValidator.errorFieldListeners[index]);
  };

  function toggleErrorClasses(formValidator, field, bool) {
    bool ? Util.addClass(field, formValidator.options.inputErrorClass) : Util.removeClass(field, formValidator.options.inputErrorClass);
    if(formValidator.options.inputWrapperErrorClass) {
      var wrapper = field.closest('.js-form-validate__input-wrapper');
      if(wrapper) {
        bool ? Util.addClass(wrapper, formValidator.options.inputWrapperErrorClass) : Util.removeClass(wrapper, formValidator.options.inputWrapperErrorClass);
      }
    }
  };

  function resetEventListeners(formValidator) {
    for(var i = 0; i < formValidator.errorFields.length; i++) {
      toggleErrorClasses(formValidator, formValidator.errorFields[i], false);
      formValidator.errorFields[i].removeEventListener('change', formValidator.errorFieldListeners[i]);
      formValidator.errorFields[i].removeEventListener('input', formValidator.errorFieldListeners[i]);
    }

    formValidator.errorFields = [];
    formValidator.errorFieldListeners = [];
  };
  
  FormValidator.defaults = {
    element : '',
    inputErrorClass : 'form-control--error',
    inputWrapperErrorClass: 'form-validate__input-wrapper--error',
    customValidate: {}
  };
  window.FormValidator = FormValidator;
}());
// File#: _1_infinite-scroll
// Usage: codyhouse.co/license
(function() {
  var InfiniteScroll = function(opts) {
    this.options = Util.extend(InfiniteScroll.defaults, opts);
    this.element = this.options.element;
    this.loader = document.getElementsByClassName('js-infinite-scroll__loader');
    this.loadBtn = document.getElementsByClassName('js-infinite-scroll__btn');
    this.loading = false;
    this.currentPageIndex = this.element.getAttribute('data-current-page') ? parseInt(this.element.getAttribute('data-current-page')) : 0;
    this.index = this.currentPageIndex;
    initLoad(this);
  };

  function initLoad(infiniteScroll) {
    setPathValues(infiniteScroll); // get dynamic content paths

    getTresholdPixel(infiniteScroll);
    
    if(infiniteScroll.options.container) { // get container of dynamic content
      infiniteScroll.container = infiniteScroll.element.querySelector(infiniteScroll.options.container);
    }
    
    if((!infiniteScroll.options.loadBtn || infiniteScroll.options.loadBtnDelay) && infiniteScroll.loadBtn.length > 0) { // hide load more btn
      Util.addClass(infiniteScroll.loadBtn[0], 'sr-only');
    }

    if(!infiniteScroll.options.loadBtn || infiniteScroll.options.loadBtnDelay) {
      if(intersectionObserverSupported) { // check element scrolling
        initObserver(infiniteScroll);
      } else {
        infiniteScroll.scrollEvent = handleEvent.bind(infiniteScroll);
        window.addEventListener('scroll', infiniteScroll.scrollEvent);
      }
    }
    
    initBtnEvents(infiniteScroll); // listen for click on load Btn
    
    if(!infiniteScroll.options.path) { // content has been loaded using a custom function
      infiniteScroll.element.addEventListener('loaded-new', function(event){
        contentWasLoaded(infiniteScroll, event.detail.path, event.detail.checkNext); // reset element
        // emit 'content-loaded' event -> this could be useful when new content needs to be initialized
      infiniteScroll.element.dispatchEvent(new CustomEvent('content-loaded', {detail: event.detail.path}));
      });
    }
  };

  function setPathValues(infiniteScroll) { // path can be strin or comma-separated list
    if(!infiniteScroll.options.path) return;
    var split = infiniteScroll.options.path.split(',');
    if(split.length > 1) {
      infiniteScroll.options.path = [];
      for(var i = 0; i < split.length; i++) infiniteScroll.options.path.push(split[i].trim());
    }
  };

  function getTresholdPixel(infiniteScroll) { // get the threshold value in pixels - will be used only if intersection observer is not supported
    infiniteScroll.thresholdPixel = infiniteScroll.options.threshold.indexOf('px') > -1 ? parseInt(infiniteScroll.options.threshold.replace('px', '')) : parseInt(window.innerHeight*parseInt(infiniteScroll.options.threshold.replace('%', ''))/100);
  };

  function initObserver(infiniteScroll) { // intersection observer supported
    // append an element to the bottom of the container that will be observed
    var observed = document.createElement("div");
    Util.setAttributes(observed, {'aria-hidden': 'true', 'class': 'js-infinite-scroll__observed', 'style': 'width: 100%; height: 1px; margin-top: -1px; visibility: hidden;'});
    infiniteScroll.element.appendChild(observed);

    infiniteScroll.observed = infiniteScroll.element.getElementsByClassName('js-infinite-scroll__observed')[0];

    var config = {rootMargin: '0px 0px '+infiniteScroll.options.threshold+' 0px'};
    infiniteScroll.observer = new IntersectionObserver(observerLoadContent.bind(infiniteScroll), config);
    infiniteScroll.observer.observe(infiniteScroll.observed);
  };

  function observerLoadContent(entry) { 
    if(this.loading) return;
    if(entry[0].intersectionRatio > 0) loadMore(this);
  };

  function handleEvent(event) { // handle click/scroll events
    switch(event.type) {
      case 'click': {
        initClick(this, event); // click on load more button
        break;
      }
      case 'scroll': { // triggered only if intersection onserver is not supported
        initScroll(this);
        break;
      }
    }
  };

  function initScroll(infiniteScroll) { // listen to scroll event (only if intersectionObserver is not supported)
    (!window.requestAnimationFrame) ? setTimeout(checkLoad.bind(infiniteScroll)) : window.requestAnimationFrame(checkLoad.bind(infiniteScroll));
  };

  function initBtnEvents(infiniteScroll) { // load more button events - click + focus (for keyboard accessibility)
    if(infiniteScroll.loadBtn.length == 0) return;
    infiniteScroll.clickEvent = handleEvent.bind(infiniteScroll);
    infiniteScroll.loadBtn[0].addEventListener('click', infiniteScroll.clickEvent);
    
    if(infiniteScroll.options.loadBtn && !infiniteScroll.options.loadBtnDelay) {
      Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
      if(infiniteScroll.loader.length > 0 ) Util.addClass(infiniteScroll.loader[0], 'is-hidden');
    }

    // toggle class sr-only if link is in focus/loses focus
    infiniteScroll.loadBtn[0].addEventListener('focusin', function(){
      if(Util.hasClass(infiniteScroll.loadBtn[0], 'sr-only')) {
        Util.addClass(infiniteScroll.loadBtn[0], 'js-infinite-scroll__btn-focus');
        Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
      }
    });
    infiniteScroll.loadBtn[0].addEventListener('focusout', function(){
      if(Util.hasClass(infiniteScroll.loadBtn[0], 'js-infinite-scroll__btn-focus')) {
        Util.removeClass(infiniteScroll.loadBtn[0], 'js-infinite-scroll__btn-focus');
        Util.addClass(infiniteScroll.loadBtn[0], 'sr-only');
      }
    });
  };

  function initClick(infiniteScroll, event) { // click on 'Load More' button
    event.preventDefault();
    Util.addClass(infiniteScroll.loadBtn[0], 'sr-only');
    loadMore(infiniteScroll);
  };

  function checkLoad() { // while scrolling -> check if we need to load new content (only if intersectionObserver is not supported)
    if(this.loading) return;
    if(!needLoad(this)) return;
    loadMore(this);
  };

  function loadMore(infiniteScroll) { // new conten needs to be loaded
    infiniteScroll.loading = true;
    if(infiniteScroll.loader.length > 0) Util.removeClass(infiniteScroll.loader[0], 'is-hidden');
    var moveFocus = false;
    if(infiniteScroll.loadBtn.length > 0 ) moveFocus = Util.hasClass(infiniteScroll.loadBtn[0], 'js-infinite-scroll__btn-focus');
    // check if need to add content or user has custom load function
    if(infiniteScroll.options.path) {
      contentBasicLoad(infiniteScroll, moveFocus); // load content
    } else {
      emitCustomEvents(infiniteScroll, 'load-new', moveFocus); // user takes care of loading content
    }
  };

  function contentBasicLoad(infiniteScroll, moveFocus) {
    var filePath = getFilePath(infiniteScroll);
    // load file content
    getNewContent(filePath, function(content){
      var checkNext = insertNewContent(infiniteScroll, content, moveFocus);
      contentWasLoaded(infiniteScroll, filePath, checkNextPageAvailable(infiniteScroll, checkNext));
      // emit 'content-loaded' event -> this could be useful when new content needs to be initialized
      infiniteScroll.element.dispatchEvent(new CustomEvent('content-loaded', {detail: filePath}));
    });
  };

  function getFilePath(infiniteScroll) { // get path of the file to load
    return (Array.isArray(infiniteScroll.options.path)) 
      ? infiniteScroll.options.path[infiniteScroll.index]
      : infiniteScroll.options.path.replace('{n}', infiniteScroll.index+1);
  };

  function getNewContent(path, cb) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) cb(this.responseText);
    };
    xhttp.open("GET", path, true);
    xhttp.send();
  };

  function insertNewContent(infiniteScroll, content, moveFocus) {
    var next = false;
    if(infiniteScroll.options.container) {
      var div = document.createElement("div");
      div.innerHTML = content;
      var wrapper = div.querySelector(infiniteScroll.options.container);
      if(wrapper) {
        content = wrapper.innerHTML;
        next = wrapper.getAttribute('data-path');
      }
    }
    var lastItem = false;
    if(moveFocus) lastItem = getLastChild(infiniteScroll);
    if(infiniteScroll.container) {
      infiniteScroll.container.insertAdjacentHTML('beforeend', content);
    } else {
      (infiniteScroll.loader.length > 0) 
        ? infiniteScroll.loader[0].insertAdjacentHTML('beforebegin', content)
        : infiniteScroll.element.insertAdjacentHTML('beforeend', content);
    }
    if(moveFocus && lastItem) Util.moveFocus(lastItem);

    return next;
  };

  function getLastChild(infiniteScroll) {
    if(infiniteScroll.container) return infiniteScroll.container.lastElementChild;
    if(infiniteScroll.loader.length > 0) return infiniteScroll.loader[0].previousElementSibling;
    return infiniteScroll.element.lastElementChild;
  };

  function checkNextPageAvailable(infiniteScroll, checkNext) { // check if there's still content to be loaded
    if(Array.isArray(infiniteScroll.options.path)) {
      return infiniteScroll.options.path.length > infiniteScroll.index + 1;
    }
    return checkNext;
  };

  function contentWasLoaded(infiniteScroll, url, checkNext) { // new content has been loaded - reset status 
    if(infiniteScroll.loader.length > 0) Util.addClass(infiniteScroll.loader[0], 'is-hidden'); // hide loader
    
    if(infiniteScroll.options.updateHistory && url) { // update browser history
      var pageArray = location.pathname.split('/'),
        actualPage = pageArray[pageArray.length - 1] ;
      if( actualPage != url && history.pushState ) window.history.replaceState({path: url},'',url);
    }
    
    if(!checkNext) { // no need to load additional pages - remove scroll listening and/or click listening
      removeScrollEvents(infiniteScroll);
      if(infiniteScroll.clickEvent) {
        infiniteScroll.loadBtn[0].removeEventListener('click', infiniteScroll.clickEvent);
        Util.addClass(infiniteScroll.loadBtn[0], 'is-hidden');
        Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
      }
    }
    
    if(checkNext && infiniteScroll.options.loadBtn) { // check if we need to switch from scrolling to click -> add/remove proper listener
      if(!infiniteScroll.options.loadBtnDelay) {
        Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
      } else if(infiniteScroll.index - infiniteScroll.currentPageIndex + 1 >= infiniteScroll.options.loadBtnDelay && infiniteScroll.loadBtn.length > 0) {
        removeScrollEvents(infiniteScroll);
        Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
      }
    }

    if(checkNext && infiniteScroll.loadBtn.length > 0 && Util.hasClass(infiniteScroll.loadBtn[0], 'js-infinite-scroll__btn-focus')) { // keyboard accessibility
      Util.removeClass(infiniteScroll.loadBtn[0], 'sr-only');
    }

    infiniteScroll.index = infiniteScroll.index + 1;
    infiniteScroll.loading = false;
  };

  function removeScrollEvents(infiniteScroll) {
    if(infiniteScroll.scrollEvent) window.removeEventListener('scroll', infiniteScroll.scrollEvent);
    if(infiniteScroll.observer) infiniteScroll.observer.unobserve(infiniteScroll.observed);
  };

  function needLoad(infiniteScroll) { // intersectionObserverSupported not supported -> check if threshold has been reached
    return infiniteScroll.element.getBoundingClientRect().bottom - window.innerHeight <= infiniteScroll.thresholdPixel;
  };

  function emitCustomEvents(infiniteScroll, eventName, moveFocus) { // applicable when user takes care of loading new content
		var event = new CustomEvent(eventName, {detail: {index: infiniteScroll.index+1, moveFocus: moveFocus}});
		infiniteScroll.element.dispatchEvent(event);
	};

  InfiniteScroll.defaults = {
    element : '',
    path : false, // path of files to be loaded: set to comma-separated list or string (should include {n} to be replaced by integer index). If not set, user will take care of loading new content
    container: false, // Append new content to this element. Additionally, when loaded a new page, only content of the element will be appended
    threshold: '200px', // distance between viewport and scroll area for loading new content
    updateHistory: false, // push new url to browser history
    loadBtn: false, // use a button to load more content
    loadBtnDelay: false // set to an integer if you want the load more button to be visible only after a number of loads on scroll - loadBtn needs to be 'on'
  };

  window.InfiniteScroll = InfiniteScroll;

  //initialize the InfiniteScroll objects
  var infiniteScroll = document.getElementsByClassName('js-infinite-scroll'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);

  if( infiniteScroll.length > 0) {
    for( var i = 0; i < infiniteScroll.length; i++) {
      (function(i){
        var path = infiniteScroll[i].getAttribute('data-path') ? infiniteScroll[i].getAttribute('data-path') : false,
        container = infiniteScroll[i].getAttribute('data-container') ? infiniteScroll[i].getAttribute('data-container') : false,
        updateHistory = ( infiniteScroll[i].getAttribute('data-history') && infiniteScroll[i].getAttribute('data-history') == 'on') ? true : false,
        loadBtn = ( infiniteScroll[i].getAttribute('data-load-btn') && infiniteScroll[i].getAttribute('data-load-btn') == 'on') ? true : false,
        loadBtnDelay = infiniteScroll[i].getAttribute('data-load-btn-delay') ? infiniteScroll[i].getAttribute('data-load-btn-delay') : false,
        threshold = infiniteScroll[i].getAttribute('data-threshold') ? infiniteScroll[i].getAttribute('data-threshold') : '200px';
        new InfiniteScroll({element: infiniteScroll[i], path : path, container : container, updateHistory: updateHistory, loadBtn: loadBtn, loadBtnDelay: loadBtnDelay, threshold: threshold});
      })(i);
    }
  };
}());
// File#: _1_lazy-load
// Usage: codyhouse.co/license
(function() {
  var LazyLoad = function(elements) {
    this.elements = elements;
    initLazyLoad(this);
  };

  function initLazyLoad(asset) {
    if(lazySupported) setAssetsSrc(asset);
    else if(intersectionObsSupported) observeAssets(asset);
    else scrollAsset(asset);
  };

  function setAssetsSrc(asset) {
    for(var i = 0; i < asset.elements.length; i++) {
      if(asset.elements[i].getAttribute('data-bg') || asset.elements[i].tagName.toLowerCase() == 'picture') { // this could be an element with a bg image or a <source> element inside a <picture>
        observeSingleAsset(asset.elements[i]);
      } else {
        setSingleAssetSrc(asset.elements[i]);
      } 
    }
  };

  function setSingleAssetSrc(img) {
    if(img.tagName.toLowerCase() == 'picture') {
      setPictureSrc(img);
    } else {
      setSrcSrcset(img);
      var bg = img.getAttribute('data-bg');
      if(bg) img.style.backgroundImage = bg;
      if(!lazySupported || bg) img.removeAttribute("loading");
    }
  };

  function setPictureSrc(picture) {
    var pictureChildren = picture.children;
    for(var i = 0; i < pictureChildren.length; i++) setSrcSrcset(pictureChildren[i]);
    picture.removeAttribute("loading");
  };

  function setSrcSrcset(img) {
    var src = img.getAttribute('data-src');
    if(src) img.src = src;
    var srcset = img.getAttribute('data-srcset');
    if(srcset) img.srcset = srcset;
  };

  function observeAssets(asset) {
    for(var i = 0; i < asset.elements.length; i++) {
      observeSingleAsset(asset.elements[i]);
    }
  };

  function observeSingleAsset(img) {
    if( !img.getAttribute('data-src') && !img.getAttribute('data-srcset') && !img.getAttribute('data-bg') && img.tagName.toLowerCase() != 'picture') return; // using the native lazyload with no need js lazy-loading

    var threshold = img.getAttribute('data-threshold') || '200px';
    var config = {rootMargin: threshold};
    var observer = new IntersectionObserver(observerLoadContent.bind(img), config);
    observer.observe(img);
  };

  function observerLoadContent(entries, observer) { 
    if(entries[0].isIntersecting) {
      setSingleAssetSrc(this);
      observer.unobserve(this);
    }
  };

  function scrollAsset(asset) {
    asset.elements = Array.prototype.slice.call(asset.elements);
    asset.listening = false;
    asset.scrollListener = eventLazyLoad.bind(asset);
    document.addEventListener("scroll", asset.scrollListener);
    asset.resizeListener = eventLazyLoad.bind(asset);
    document.addEventListener("resize", asset.resizeListener);
    eventLazyLoad.bind(asset)(); // trigger before starting scrolling/resizing
  };

  function eventLazyLoad() {
    var self = this;
    if(self.listening) return;
    self.listening = true;
    setTimeout(function() {
      for(var i = 0; i < self.elements.length; i++) {
        if ((self.elements[i].getBoundingClientRect().top <= window.innerHeight && self.elements[i].getBoundingClientRect().bottom >= 0) && getComputedStyle(self.elements[i]).display !== "none") {
          setSingleAssetSrc(self.elements[i]);

          self.elements = self.elements.filter(function(image) {
            return image.hasAttribute("loading");
          });

          if (self.elements.length === 0) {
            if(self.scrollListener) document.removeEventListener("scroll", self.scrollListener);
            if(self.resizeListener) window.removeEventListener("resize", self.resizeListener);
          }
        }
      }
      self.listening = false;
    }, 200);
  };

  window.LazyLoad = LazyLoad;

  var lazyLoads = document.querySelectorAll('[loading="lazy"]'),
    lazySupported = 'loading' in HTMLImageElement.prototype,
    intersectionObsSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
  
  if( lazyLoads.length > 0 ) {
    new LazyLoad(lazyLoads);
  };
  
}());
// File#: _1_list-filter
// Usage: codyhouse.co/license
(function() {
  var ListFilter = function(element) {
    this.element = element;
    this.search = this.element.getElementsByClassName('js-list-filter__search');
    this.searchCancel = this.element.getElementsByClassName('js-list-filter__search-cancel-btn');
    this.list = this.element.getElementsByClassName('js-list-filter__list')[0];
    this.items = this.list.getElementsByClassName('js-list-filter__item');
    this.noResults = this.element.getElementsByClassName('js-list-filter__no-results-msg');
    this.searchTags = [];
    this.resultsNr = this.element.getElementsByClassName('js-list-filter__results-nr');
    this.visibleItemsNr = 0;
    initListFilter(this);
	};

  function initListFilter(element) {
    // get the filterable list of tags
    for(var i = 0; i < element.items.length; i++) {
      var tags = '';
      var label = element.items[i].getElementsByClassName('js-list-filter__label');
      if(label.length > 0) {
        tags = label[0].textContent;
      }
      var additionalTags = element.items[i].getAttribute('data-filter-tags');
      if(additionalTags) tags = tags + ' ' + additionalTags;
      element.searchTags.push(tags);
    }

    // filter list based on search input value
    filterItems(element, element.search[0].value.trim());

    // filter list when search input is updated
    element.search[0].addEventListener('input', function(){
      filterItems(element, element.search[0].value.trim());
    });

    // reset search results
    if(element.searchCancel.length > 0) {
      element.searchCancel[0].addEventListener('click', function() {
        element.search[0].value= "";
        element.search[0].dispatchEvent(new Event('input'));
      });
    }
    

    // remove item from the list when clicking on the remove button
    element.list.addEventListener('click', function(event){
      var removeBtn = event.target.closest('.js-list-filter__action-btn--remove');
      if(!removeBtn) return;
      event.preventDefault();
      removeItem(element, removeBtn);
    });
  };

  function filterItems(element, value) {
    var array = [];
    var searchArray = value.toLowerCase().split(' ');
    for(var i = 0; i < element.items.length; i++) {
      value == '' ? array.push(false) : array.push(filterItem(element, i, searchArray));
    }
    updateVisibility(element, array);
  };

  function filterItem(element, index, searchArray) {
    // return false if item should be visible
    var found = true;
    for(var i = 0; i < searchArray.length; i++) {
      if(searchArray[i] != '' && searchArray[i] != ' ' && element.searchTags[index].toLowerCase().indexOf(searchArray[i]) < 0) {
        found = false;
        break;
      }
    }
    return !found;
  };

  function updateVisibility(element, list) {
    element.visibleItemsNr = 0;
    for(var i = 0; i < list.length; i++) {
      // hide/show items
      if(!list[i]) element.visibleItemsNr = element.visibleItemsNr + 1;
      Util.toggleClass(element.items[i], 'is-hidden', list[i]);
    }
    // hide/show no results message
    if(element.noResults.length > 0) Util.toggleClass(element.noResults[0], 'is-hidden', element.visibleItemsNr > 0);

    updateResultsNr(element);
  };

  function updateResultsNr(element) {
    // update number of results
    if(element.resultsNr.length > 0) element.resultsNr[0].innerHTML = element.visibleItemsNr;
  };

  function removeItem(element, btn) {
    var item = btn.closest('.js-list-filter__item');
    if(!item) return;
    var index = Util.getIndexInArray(element.items, item);
    // remove item from the DOM
    item.remove();
    // update list of search tags
    element.searchTags.splice(index, 1);
    // update number of results
    element.visibleItemsNr = element.visibleItemsNr - 1;
    updateResultsNr(element);
  }

  //initialize the ListFilter objects
	var listFilters = document.getElementsByClassName('js-list-filter');
	if( listFilters.length > 0 ) {
		for( var i = 0; i < listFilters.length; i++) {
			(function(i){new ListFilter(listFilters[i]);})(i);
		}
	}
}());
// File#: _1_looping_tabs
// Usage: codyhouse.co/license
(function() { 
  var LoopTab = function(opts) {
    this.options = Util.extend(LoopTab.defaults , opts);
		this.element = this.options.element;
		this.tabList = this.element.getElementsByClassName('js-loop-tabs__controls')[0];
		this.listItems = this.tabList.getElementsByTagName('li');
		this.triggers = this.tabList.getElementsByTagName('a');
		this.panelsList = this.element.getElementsByClassName('js-loop-tabs__panels')[0];
    this.panels = Util.getChildrenByClassName(this.panelsList, 'js-loop-tabs__panel');
    this.assetsList = this.element.getElementsByClassName('js-loop-tabs__assets')[0];
		this.assets = this.assetsList.getElementsByTagName('li');
		this.videos = getVideoElements(this);
    this.panelShowClass = 'loop-tabs__panel--selected';
		this.assetShowClass = 'loop-tabs__asset--selected';
		this.assetExitClass = 'loop-tabs__asset--exit';
    this.controlActiveClass = 'loop-tabs__control--selected';
    // autoplay
    this.autoplayPaused = false;
		this.loopTabAutoId = false;
		this.loopFillAutoId = false;
		this.loopFill = 0;
		initLoopTab(this);
	};
	
	function getVideoElements(tab) {
		var videos = [];
		for(var i = 0; i < tab.assets.length; i++) {
			var video = tab.assets[i].getElementsByTagName('video');
			videos[i] = video.length > 0 ? video[0] : false;
		}
		return videos;
	};
  
  function initLoopTab(tab) {
    //set initial aria attributes
		tab.tabList.setAttribute('role', 'tablist');
		for( var i = 0; i < tab.triggers.length; i++) {
			var bool = Util.hasClass(tab.triggers[i], tab.controlActiveClass),
        panelId = tab.panels[i].getAttribute('id');
			tab.listItems[i].setAttribute('role', 'presentation');
			Util.setAttributes(tab.triggers[i], {'role': 'tab', 'aria-selected': bool, 'aria-controls': panelId, 'id': 'tab-'+panelId});
			Util.addClass(tab.triggers[i], 'js-loop-tabs__trigger'); 
      Util.setAttributes(tab.panels[i], {'role': 'tabpanel', 'aria-labelledby': 'tab-'+panelId});
      Util.toggleClass(tab.panels[i], tab.panelShowClass, bool);
			Util.toggleClass(tab.assets[i], tab.assetShowClass, bool);
			
			resetVideo(tab, i, bool); // play/pause video if available

			if(!bool) tab.triggers[i].setAttribute('tabindex', '-1'); 
		}
		// add autoplay-off class if needed
		!tab.options.autoplay && Util.addClass(tab.element, 'loop-tabs--autoplay-off');
		//listen for Tab events
		initLoopTabEvents(tab);
  };

  function initLoopTabEvents(tab) {
		if(tab.options.autoplay) { 
			initLoopTabAutoplay(tab); // init autoplay
			// pause autoplay if user is interacting with the tabs
			tab.element.addEventListener('focusin', function(event){
				pauseLoopTabAutoplay(tab);
				tab.autoplayPaused = true;
			});
			tab.element.addEventListener('focusout', function(event){
				tab.autoplayPaused = false;
				initLoopTabAutoplay(tab);
			});
		}

    //click on a new tab -> select content
		tab.tabList.addEventListener('click', function(event) {
			if( event.target.closest('.js-loop-tabs__trigger') ) triggerLoopTab(tab, event.target.closest('.js-loop-tabs__trigger'), event);
		});
		
    //arrow keys to navigate through tabs 
		tab.tabList.addEventListener('keydown', function(event) {
			if( !event.target.closest('.js-loop-tabs__trigger') ) return;
			if( event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright' ) {
				pauseLoopTabAutoplay(tab);
				selectNewLoopTab(tab, 'next', true);
			} else if( event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft' ) {
				pauseLoopTabAutoplay(tab);
				selectNewLoopTab(tab, 'prev', true);
			}
		});
  };

  function initLoopTabAutoplay(tab) {
		if(!tab.options.autoplay || tab.autoplayPaused) return;
		tab.loopFill = 0;
		var selectedTab = tab.tabList.getElementsByClassName(tab.controlActiveClass)[0];
		// reset css variables
		for(var i = 0; i < tab.triggers.length; i++) {
			if(cssVariableSupport) tab.triggers[i].style.setProperty('--loop-tabs-filling', 0);
		}
		
		tab.loopTabAutoId = setTimeout(function(){
      selectNewLoopTab(tab, 'next', false);
		}, tab.options.autoplayInterval);
		
		if(cssVariableSupport) { // tab fill effect
			tab.loopFillAutoId = setInterval(function(){
				tab.loopFill = tab.loopFill + 0.005;
				selectedTab.style.setProperty('--loop-tabs-filling', tab.loopFill);
			}, tab.options.autoplayInterval/200);
		}
  };

  function pauseLoopTabAutoplay(tab) { // pause autoplay
    if(tab.loopTabAutoId) {
			clearTimeout(tab.loopTabAutoId);
			tab.loopTabAutoId = false;
			clearInterval(tab.loopFillAutoId);
			tab.loopFillAutoId = false;
			// make sure the filling line is scaled up
			var selectedTab = tab.tabList.getElementsByClassName(tab.controlActiveClass);
			if(selectedTab.length > 0) selectedTab[0].style.setProperty('--loop-tabs-filling', 1);
		}
  };

  function selectNewLoopTab(tab, direction, bool) {
    var selectedTab = tab.tabList.getElementsByClassName(tab.controlActiveClass)[0],
			index = Util.getIndexInArray(tab.triggers, selectedTab);
		index = (direction == 'next') ? index + 1 : index - 1;
		//make sure index is in the correct interval 
		//-> from last element go to first using the right arrow, from first element go to last using the left arrow
		if(index < 0) index = tab.listItems.length - 1;
		if(index >= tab.listItems.length) index = 0;	
		triggerLoopTab(tab, tab.triggers[index]);
		bool && tab.triggers[index].focus();
  };

  function triggerLoopTab(tab, tabTrigger, event) {
		pauseLoopTabAutoplay(tab);
		event && event.preventDefault();	
		var index = Util.getIndexInArray(tab.triggers, tabTrigger);
		//no need to do anything if tab was already selected
		if(Util.hasClass(tab.triggers[index], tab.controlActiveClass)) return;
		
		for( var i = 0; i < tab.triggers.length; i++) {
			var bool = (i == index),
				exit = Util.hasClass(tab.triggers[i], tab.controlActiveClass);
			Util.toggleClass(tab.triggers[i], tab.controlActiveClass, bool);
      Util.toggleClass(tab.panels[i], tab.panelShowClass, bool);
			Util.toggleClass(tab.assets[i], tab.assetShowClass, bool);
			Util.toggleClass(tab.assets[i], tab.assetExitClass, exit);
			tab.triggers[i].setAttribute('aria-selected', bool);
			bool ? tab.triggers[i].setAttribute('tabindex', '0') : tab.triggers[i].setAttribute('tabindex', '-1');

			resetVideo(tab, i, bool); // play/pause video if available

			// listen for the end of animation on asset element and remove exit class
			if(exit) {(function(i){
				tab.assets[i].addEventListener('transitionend', function cb(event){
					tab.assets[i].removeEventListener('transitionend', cb);
					Util.removeClass(tab.assets[i], tab.assetExitClass);
				});
			})(i);}
		}
    
    // restart tab autoplay
    initLoopTabAutoplay(tab);
	};

	function resetVideo(tab, i, bool) {
		if(tab.videos[i]) {
			if(bool) {
				tab.videos[i].play();
			} else {
				tab.videos[i].pause();
				tab.videos[i].currentTime = 0;
			} 
		}
	};

  LoopTab.defaults = {
    element : '',
    autoplay : true,
    autoplayInterval: 5000
  };

  //initialize the Tab objects
	var loopTabs = document.getElementsByClassName('js-loop-tabs');
	if( loopTabs.length > 0 ) {
		var reducedMotion = Util.osHasReducedMotion(),
			cssVariableSupport = ('CSS' in window) && Util.cssSupports('color', 'var(--var)');
		for( var i = 0; i < loopTabs.length; i++) {
			(function(i){
        var autoplay = (loopTabs[i].getAttribute('data-autoplay') && loopTabs[i].getAttribute('data-autoplay') == 'off' || reducedMotion) ? false : true,
        autoplayInterval = (loopTabs[i].getAttribute('data-autoplay-interval')) ? loopTabs[i].getAttribute('data-autoplay-interval') : 5000;
        new LoopTab({element: loopTabs[i], autoplay : autoplay, autoplayInterval : autoplayInterval});
      })(i);
		}
	}
}());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
	var Modal = function(element) {
		this.element = element;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null; // focus will be moved to this element when modal is open
		this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
		this.selectedTrigger = null;
		this.preventScrollEl = this.getPreventScrollEl();
		this.showClass = "modal--is-visible";
		this.initModal();
	};

	Modal.prototype.getPreventScrollEl = function() {
		var scrollEl = false;
		var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
		if(querySelector) scrollEl = document.querySelector(querySelector);
		return scrollEl;
	};

	Modal.prototype.initModal = function() {
		var self = this;
		//open modal when clicking on trigger buttons
		if ( this.triggers ) {
			for(var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(Util.hasClass(self.element, self.showClass)) {
						self.closeModal();
						return;
					}
					self.selectedTrigger = event.currentTarget;
					self.showModal();
					self.initModalEvents();
				});
			}
		}

		// listen to the openModal event -> open modal without a trigger button
		this.element.addEventListener('openModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.showModal();
			self.initModalEvents();
		});

		// listen to the closeModal event -> close modal without a trigger button
		this.element.addEventListener('closeModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.closeModal();
		});

		// if modal is open by default -> initialise modal events
		if(Util.hasClass(this.element, this.showClass)) this.initModalEvents();
	};

	Modal.prototype.showModal = function() {
		var self = this;
		Util.addClass(this.element, this.showClass);
		this.getFocusableElements();
		if(this.moveFocusEl) {
			this.moveFocusEl.focus();
			// wait for the end of transitions before moving focus
			this.element.addEventListener("transitionend", function cb(event) {
				self.moveFocusEl.focus();
				self.element.removeEventListener("transitionend", cb);
			});
		}
		this.emitModalEvents('modalIsOpen');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
	};

	Modal.prototype.closeModal = function() {
		if(!Util.hasClass(this.element, this.showClass)) return;
		Util.removeClass(this.element, this.showClass);
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null;
		if(this.selectedTrigger) this.selectedTrigger.focus();
		//remove listeners
		this.cancelModalEvents();
		this.emitModalEvents('modalIsClose');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
	};

	Modal.prototype.initModalEvents = function() {
		//add event listeners
		this.element.addEventListener('keydown', this);
		this.element.addEventListener('click', this);
	};

	Modal.prototype.cancelModalEvents = function() {
		//remove event listeners
		this.element.removeEventListener('keydown', this);
		this.element.removeEventListener('click', this);
	};

	Modal.prototype.handleEvent = function (event) {
		switch(event.type) {
			case 'click': {
				this.initClick(event);
			}
			case 'keydown': {
				this.initKeyDown(event);
			}
		}
	};

	Modal.prototype.initKeyDown = function(event) {
		if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
			//trap focus inside modal
			this.trapFocus(event);
		} else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
			event.preventDefault();
			this.closeModal(); // close modal when pressing Enter on close button
		}	
	};

	Modal.prototype.initClick = function(event) {
		//close modal when clicking on close button or modal bg layer 
		if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
		event.preventDefault();
		this.closeModal();
	};

	Modal.prototype.trapFocus = function(event) {
		if( this.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of modal
			event.preventDefault();
			this.lastFocusable.focus();
		}
		if( this.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of modal
			event.preventDefault();
			this.firstFocusable.focus();
		}
	}

	Modal.prototype.getFocusableElements = function() {
		//get all focusable elements inside the modal
		var allFocusable = this.element.querySelectorAll(focusableElString);
		this.getFirstVisible(allFocusable);
		this.getLastVisible(allFocusable);
		this.getFirstFocusable();
	};

	Modal.prototype.getFirstVisible = function(elements) {
		//get first visible focusable element inside the modal
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				this.firstFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getLastVisible = function(elements) {
		//get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				this.lastFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getFirstFocusable = function() {
		if(!this.modalFocus || !Element.prototype.matches) {
			this.moveFocusEl = this.firstFocusable;
			return;
		}
		var containerIsFocusable = this.modalFocus.matches(focusableElString);
		if(containerIsFocusable) {
			this.moveFocusEl = this.modalFocus;
		} else {
			this.moveFocusEl = false;
			var elements = this.modalFocus.querySelectorAll(focusableElString);
			for(var i = 0; i < elements.length; i++) {
				if( isVisible(elements[i]) ) {
					this.moveFocusEl = elements[i];
					break;
				}
			}
			if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
		}
	};

	Modal.prototype.emitModalEvents = function(eventName) {
		var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
		this.element.dispatchEvent(event);
	};

	function isVisible(element) {
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

	window.Modal = Modal;

	//initialize the Modal objects
	var modals = document.getElementsByClassName('js-modal');
	// generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	if( modals.length > 0 ) {
		var modalArrays = [];
		for( var i = 0; i < modals.length; i++) {
			(function(i){modalArrays.push(new Modal(modals[i]));})(i);
		}

		window.addEventListener('keydown', function(event){ //close modal window on esc
			if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
				for( var i = 0; i < modalArrays.length; i++) {
					(function(i){modalArrays[i].closeModal();})(i);
				};
			}
		});
	}
}());
// File#: _1_newsletter-input
// Usage: codyhouse.co/license
(function() {
  var NewsInput = function(opts) {
    this.options = Util.extend(NewsInput.defaults, opts);
    this.element = this.options.element;
    this.input = this.element.getElementsByClassName('js-news-form__input');
    this.button = this.element.getElementsByClassName('js-news-form__btn');
    this.submitting = false;
    initNewsInput(this);
  };

  function initNewsInput(element) {
    if(element.input.length < 1 || element.input.button < 1) return;
    // check email value
    element.input[0].addEventListener('input', function(event){
      // hide success/error messages
      Util.removeClass(element.element, 'news-form--success news-form--error');
      // enable/disable form
      checkEmailFormat(element);
    });

    // animate newsletter when submitting form 
    element.element.addEventListener('submit', function(event){
      event.preventDefault();
      if(element.submitting) return;
      element.submitting = true;
      element.response = false;
      
      // start button animation
      Util.addClass(element.element, 'news-form--loading news-form--circle-loop');
      // at the end of each animation cicle, restart animation if there was no response from the submit function yet
      element.element.addEventListener('animationend', function cb(event){
        if(element.response) { // complete button animation
          element.element.removeEventListener('animationend', cb);
          showResponseMessage(element, element.response);
        } else { // keep loading animation going
          Util.removeClass(element.element, 'news-form--circle-loop');
          element.element.offsetWidth;
          Util.addClass(element.element, 'news-form--circle-loop');
        }
      });
      
      // custom submit function
      element.options.submit(element.input[0].value, function(response){
        element.response = response;
        element.submitting = false;
        if(!animationSupported) showResponseMessage(element, response);
      });
    });
  };

  function showResponseMessage(element, response) {
    Util.removeClass(element.element, 'news-form--loading news-form--circle-loop');
    (response == 'success')
      ? Util.addClass(element.element, 'news-form--success')
      : Util.addClass(element.element, 'news-form--error');
  };

  function checkEmailFormat(element) {
    var email = element.input[0].value;
    var atPosition = email.indexOf("@"),
      dotPosition = email.lastIndexOf("."); 
    var enableForm = (atPosition >= 1 && dotPosition >= atPosition + 2 && dotPosition < email.length - 1);
    if(enableForm) {
      Util.addClass(element.element, 'news-form--enabled');
      element.button[0].removeAttribute('disabled');
    } else {
      Util.removeClass(element.element, 'news-form--enabled');
      element.button[0].setAttribute('disabled', true);
    }
  };

  window.NewsInput = NewsInput;

  NewsInput.defaults = {
    element : '',
    submit: false, // function used to return results
  };

  var animationSupported = Util.cssSupports('animation', 'name');
}());
// File#: _1_notice
// Usage: codyhouse.co/license
(function() {
  function initNoticeEvents(notice) {
    notice.addEventListener('click', function(event){
      if(event.target.closest('.js-notice__hide-control')) {
        event.preventDefault();
        Util.addClass(notice, 'notice--hide');
      }
    });
  };
  
  var noticeElements = document.getElementsByClassName('js-notice');
  if(noticeElements.length > 0) {
    for(var i=0; i < noticeElements.length; i++) {(function(i){
      initNoticeEvents(noticeElements[i]);
    })(i);}
  }
}());
// File#: _1_page-transition
// Usage: codyhouse.co/license
(function() {
  var PageTransition = function(opts) {
    if(!('CSS' in window) || !CSS.supports('color', 'var(--color)')) return;
    this.element = document.getElementsByClassName('js-page-trans')[0];
    this.options = Util.extend(PageTransition.defaults , opts);
    this.cachedPages = [];
    this.anchors = false;
    this.clickFunctions = [];
    this.animating = false;
    this.newContent = false;
    this.containerClass = 'js-page-trans__content';
    this.containers = [];
    initSrRegion(this);
    pageTrInit(this);
    initBrowserHistory(this);
  };

  function initSrRegion(element) {
    var liveRegion = document.createElement('p');
    Util.setAttributes(liveRegion, {'class': 'sr-only', 'role': 'alert', 'aria-live': 'polite', 'id': 'page-trans-sr-live'});
    element.element.appendChild(liveRegion);
    element.srLive = document.getElementById('page-trans-sr-live');
  };

  function pageTrInit(element) { // bind click events
    element.anchors = document.getElementsByClassName('js-page-trans-link');
    for(var i = 0; i < element.anchors.length; i++) {
      (function(i){
        element.clickFunctions[i] = function(event) {
          event.preventDefault();
          element.updateBrowserHistory = true;
          bindClick(element, element.anchors[i].getAttribute('href'));
        };

        element.anchors[i].addEventListener('click', element.clickFunctions[i]);
      })(i);
    }
  };

  function bindClick(element, link) {
    if(element.animating) return;
    element.animating = true;
    element.link = link; 
    // most of those links will be removed from the page
    unbindClickEvents(element);
    loadPageContent(element); 
    // code that should run before the leaving animation
    if(element.options.beforeLeave) element.options.beforeLeave(element.link);
    // announce to SR new content is being loaded
    element.srLive.textContent = element.options.srLoadingMessage;
    // leaving animation
    if(!element.options.leaveAnimation) return;
    element.containers.push(element.element.getElementsByClassName(element.containerClass)[0]);
    element.options.leaveAnimation(element.containers[0], element.link, function(){
      leavingAnimationComplete(element, true);
    });
  };

  function unbindClickEvents(element) {
    for(var i = 0; i < element.anchors.length; i++) {
      element.anchors[i].removeEventListener('click', element.clickFunctions[i]);
    }
  };

  function loadPageContent(element) {
    element.newContent = false;
    var pageCache = getCachedPage(element);
    if(pageCache) {
      element.newContent = pageCache;
    } else {
      if(element.options.loadFunction) { // use a custom function to load your data
        element.options.loadFunction(element.link, function(data){
          element.newContent = data;
          element.cachedPages.push({link: element.link, content: element.newContent});
        });
      } else {
        // load page content
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            element.newContent = getContainerHTML(element, xmlHttp.responseText);
            element.cachedPages.push({link: element.link, content: element.newContent});
          }
        };
        xmlHttp.open('GET', element.link);
        xmlHttp.send();
      }
    }
  };

  function leavingAnimationComplete(element, triggerProgress) {
    if(element.newContent) {
      // new content has already been created
      triggerEnteringProcess(element);
    } else {
      // new content is not available yet
      if(triggerProgress && element.options.progressAnimation) element.options.progressAnimation(element.link);
      setTimeout(function(){
        leavingAnimationComplete(element, false);
      }, 200);
    }
  };

  function getCachedPage(element) {
    var cachedContent = false;
    for(var i = 0; i < element.cachedPages.length; i++) {
      if(element.cachedPages[i].link == element.link) {
        cachedContent = element.cachedPages[i].content;
        break;
      }
    }
    return cachedContent;
  };

  function getContainerHTML(element, content) {
    var template = document.createElement('div');
    template.innerHTML = content;
    return template.getElementsByClassName(element.containerClass)[0].outerHTML;
  };

  function triggerEnteringProcess(element) {
    if(element.updateBrowserHistory) updateBrowserHistory(element);
    // inject new content
    element.containers[0].insertAdjacentHTML('afterend', element.newContent);
    element.containers = element.element.getElementsByClassName(element.containerClass);
    if(element.options.beforeEnter) element.options.beforeEnter(element.containers[0], element.containers[1], element.link);
    if(!element.options.enterAnimation) return; // entering animation
    element.options.enterAnimation(element.containers[0], element.containers[1], element.link, function(){
      // move focus to new cntent
      Util.moveFocus(element.containers[1]);
      // new content
      var newContent = element.containers[1];
      // remove old content
      element.containers[0].remove();
      if(element.options.afterEnter) element.options.afterEnter(newContent, element.link);
      pageTrInit(element); // bind click event to new anchor elements
      resetPageTransition(element);
      // announce to SR new content is available
      element.srLive.textContent = element.options.srLoadedMessage;
    });
  };

  function resetPageTransition(element) {
    // remove old content
    element.newContent = false;
    element.animating = false;
    element.containers = [];
    element.link = false;
  };

  function updateBrowserHistory(element) {
    if(window.history.state && window.history.state == element.link) return;
    window.history.pushState({path: element.link},'',element.link);
  };

  function initBrowserHistory(element) {
    setTimeout(function() {
      // on load -> replace window history with page url
      window.history.replaceState({path: document.location.href},'',document.location.href);
      window.addEventListener('popstate', function(event) {
        element.updateBrowserHistory = false;
        if(event.state && event.state.path) {
          bindClick(element, event.state.path);
        }
      });
    }, 10);
  };

  PageTransition.defaults = {
    beforeLeave: false, // run before the leaving animation is triggered
    leaveAnimation: false,
    progressAnimation: false,
    beforeEnter: false, // run before enterAnimation (after new content has been added to the page)
    enterAnimation: false,
    afterEnter: false,
    loadFunction: false,
    srLoadingMessage: 'New content is being loaded',
    srLoadedMessage: 'New content has been loaded' 
  };

  window.PageTransition = PageTransition;
}());
// File#: _1_popover
// Usage: codyhouse.co/license
(function() {
  var Popover = function(element) {
    this.element = element;
		this.elementId = this.element.getAttribute('id');
		this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
		this.selectedTrigger = false;
    this.popoverVisibleClass = 'popover--is-visible';
    this.selectedTriggerClass = 'popover-control--active';
    this.popoverIsOpen = false;
    // focusable elements
    this.firstFocusable = false;
		this.lastFocusable = false;
		// position target - position tooltip relative to a specified element
		this.positionTarget = getPositionTarget(this);
		// gap between element and viewport - if there's max-height 
		this.viewportGap = parseInt(getComputedStyle(this.element).getPropertyValue('--popover-viewport-gap')) || 20;
		initPopover(this);
		initPopoverEvents(this);
  };

  // public methods
  Popover.prototype.togglePopover = function(bool, moveFocus) {
    togglePopover(this, bool, moveFocus);
  };

  Popover.prototype.checkPopoverClick = function(target) {
    checkPopoverClick(this, target);
  };

  Popover.prototype.checkPopoverFocus = function() {
    checkPopoverFocus(this);
  };

	// private methods
	function getPositionTarget(popover) {
		// position tooltip relative to a specified element - if provided
		var positionTargetSelector = popover.element.getAttribute('data-position-target');
		if(!positionTargetSelector) return false;
		var positionTarget = document.querySelector(positionTargetSelector);
		return positionTarget;
	};

  function initPopover(popover) {
		// init aria-labels
		for(var i = 0; i < popover.trigger.length; i++) {
			Util.setAttributes(popover.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
		}
  };
  
  function initPopoverEvents(popover) {
		for(var i = 0; i < popover.trigger.length; i++) {(function(i){
			popover.trigger[i].addEventListener('click', function(event){
				event.preventDefault();
				// if the popover had been previously opened by another trigger element -> close it first and reopen in the right position
				if(Util.hasClass(popover.element, popover.popoverVisibleClass) && popover.selectedTrigger !=  popover.trigger[i]) {
					togglePopover(popover, false, false); // close menu
				}
				// toggle popover
				popover.selectedTrigger = popover.trigger[i];
				togglePopover(popover, !Util.hasClass(popover.element, popover.popoverVisibleClass), true);
			});
    })(i);}
    
    // trap focus
    popover.element.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside popover
        trapFocus(popover, event);
      }
    });

		// custom events -> open/close popover
		popover.element.addEventListener('openPopover', function(event){
			togglePopover(popover, true);
		});

		popover.element.addEventListener('closePopover', function(event){
			togglePopover(popover, false, event.detail);
		});
  };
  
  function togglePopover(popover, bool, moveFocus) {
		// toggle popover visibility
		Util.toggleClass(popover.element, popover.popoverVisibleClass, bool);
		popover.popoverIsOpen = bool;
		if(bool) {
      popover.selectedTrigger.setAttribute('aria-expanded', 'true');
      getFocusableElements(popover);
      // move focus
      focusPopover(popover);
			popover.element.addEventListener("transitionend", function(event) {focusPopover(popover);}, {once: true});
			// position the popover element
			positionPopover(popover);
			// add class to popover trigger
			Util.addClass(popover.selectedTrigger, popover.selectedTriggerClass);
		} else if(popover.selectedTrigger) {
			popover.selectedTrigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) Util.moveFocus(popover.selectedTrigger);
			// remove class from menu trigger
			Util.removeClass(popover.selectedTrigger, popover.selectedTriggerClass);
			popover.selectedTrigger = false;
		}
	};
	
	function focusPopover(popover) {
		if(popover.firstFocusable) {
			popover.firstFocusable.focus();
		} else {
			Util.moveFocus(popover.element);
		}
	};

  function positionPopover(popover) {
		// reset popover position
		resetPopoverStyle(popover);
		var selectedTriggerPosition = (popover.positionTarget) ? popover.positionTarget.getBoundingClientRect() : popover.selectedTrigger.getBoundingClientRect();
		
		var menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
			
		var left = selectedTriggerPosition.left,
			right = (window.innerWidth - selectedTriggerPosition.right),
			isRight = (window.innerWidth < selectedTriggerPosition.left + popover.element.offsetWidth);

		var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
			vertical = menuOnTop
				? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
				: 'top: '+selectedTriggerPosition.bottom+'px;';
		// check right position is correct -> otherwise set left to 0
		if( isRight && (right + popover.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - popover.element.offsetWidth)/2)+'px;';
		// check if popover needs a max-height (user will scroll inside the popover)
		var maxHeight = menuOnTop ? selectedTriggerPosition.top - popover.viewportGap : window.innerHeight - selectedTriggerPosition.bottom - popover.viewportGap;

		var initialStyle = popover.element.getAttribute('style');
		if(!initialStyle) initialStyle = '';
		popover.element.setAttribute('style', initialStyle + horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
	};
	
	function resetPopoverStyle(popover) {
		// remove popover inline style before appling new style
		popover.element.style.maxHeight = '';
		popover.element.style.top = '';
		popover.element.style.bottom = '';
		popover.element.style.left = '';
		popover.element.style.right = '';
	};

  function checkPopoverClick(popover, target) {
    // close popover when clicking outside it
    if(!popover.popoverIsOpen) return;
    if(!popover.element.contains(target) && !target.closest('[aria-controls="'+popover.elementId+'"]')) togglePopover(popover, false);
  };

  function checkPopoverFocus(popover) {
    // on Esc key -> close popover if open and move focus (if focus was inside popover)
    if(!popover.popoverIsOpen) return;
    var popoverParent = document.activeElement.closest('.js-popover');
    togglePopover(popover, false, popoverParent);
  };
  
  function getFocusableElements(popover) {
    //get all focusable elements inside the popover
		var allFocusable = popover.element.querySelectorAll(focusableElString);
		getFirstVisible(popover, allFocusable);
		getLastVisible(popover, allFocusable);
  };

  function getFirstVisible(popover, elements) {
		//get first visible focusable element inside the popover
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				popover.firstFocusable = elements[i];
				break;
			}
		}
	};

  function getLastVisible(popover, elements) {
		//get last visible focusable element inside the popover
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				popover.lastFocusable = elements[i];
				break;
			}
		}
  };

  function trapFocus(popover, event) {
    if( popover.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of popover
			event.preventDefault();
			popover.lastFocusable.focus();
		}
		if( popover.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of popover
			event.preventDefault();
			popover.firstFocusable.focus();
		}
  };
  
  function isVisible(element) {
		// check if element is visible
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

  window.Popover = Popover;

  //initialize the Popover objects
  var popovers = document.getElementsByClassName('js-popover');
  // generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	
	if( popovers.length > 0 ) {
		var popoversArray = [];
		var scrollingContainers = [];
		for( var i = 0; i < popovers.length; i++) {
			(function(i){
				popoversArray.push(new Popover(popovers[i]));
				var scrollableElement = popovers[i].getAttribute('data-scrollable-element');
				if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
			})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close popover on 'Esc'
				popoversArray.forEach(function(element){
					element.checkPopoverFocus();
				});
			} 
		});
		// close popover when clicking outside it
		window.addEventListener('click', function(event){
			popoversArray.forEach(function(element){
				element.checkPopoverClick(event.target);
			});
		});
		// on resize -> close all popover elements
		window.addEventListener('resize', function(event){
			popoversArray.forEach(function(element){
				element.togglePopover(false, false);
			});
		});
		// on scroll -> close all popover elements
		window.addEventListener('scroll', function(event){
			popoversArray.forEach(function(element){
				if(element.popoverIsOpen) element.togglePopover(false, false);
			});
		});
		// take into account additinal scrollable containers
		for(var j = 0; j < scrollingContainers.length; j++) {
			var scrollingContainer = document.querySelector(scrollingContainers[j]);
			if(scrollingContainer) {
				scrollingContainer.addEventListener('scroll', function(event){
					popoversArray.forEach(function(element){
						if(element.popoverIsOpen) element.togglePopover(false, false);
					});
				});
			}
		}
	}
}());
// File#: _1_read-more
// Usage: codyhouse.co/license
(function() {
  var ReadMore = function(element) {
    this.element = element;
    this.moreContent = this.element.getElementsByClassName('js-read-more__content');
    this.count = this.element.getAttribute('data-characters') || 200;
    this.counting = 0;
    this.btnClasses = this.element.getAttribute('data-btn-class');
    this.ellipsis = this.element.getAttribute('data-ellipsis') && this.element.getAttribute('data-ellipsis') == 'off' ? false : true;
    this.btnShowLabel = 'Read more';
    this.btnHideLabel = 'Read less';
    this.toggleOff = this.element.getAttribute('data-toggle') && this.element.getAttribute('data-toggle') == 'off' ? false : true;
    if( this.moreContent.length == 0 ) splitReadMore(this);
    setBtnLabels(this);
    initReadMore(this);
  };

  function splitReadMore(readMore) { 
    splitChildren(readMore.element, readMore); // iterate through children and hide content
  };

  function splitChildren(parent, readMore) {
    if(readMore.counting >= readMore.count) {
      Util.addClass(parent, 'js-read-more__content');
      return parent.outerHTML;
    }
    var children = parent.childNodes;
    var content = '';
    for(var i = 0; i < children.length; i++) {
      if (children[i].nodeType == Node.TEXT_NODE) {
        content = content + wrapText(children[i], readMore);
      } else {
        content = content + splitChildren(children[i], readMore);
      }
    }
    parent.innerHTML = content;
    return parent.outerHTML;
  };

  function wrapText(element, readMore) {
    var content = element.textContent;
    if(content.replace(/\s/g,'').length == 0) return '';// check if content is empty
    if(readMore.counting >= readMore.count) {
      return '<span class="js-read-more__content">' + content + '</span>';
    }
    if(readMore.counting + content.length < readMore.count) {
      readMore.counting = readMore.counting + content.length;
      return content;
    }
    var firstContent = content.substr(0, readMore.count - readMore.counting);
    firstContent = firstContent.substr(0, Math.min(firstContent.length, firstContent.lastIndexOf(" ")));
    var secondContent = content.substr(firstContent.length, content.length);
    readMore.counting = readMore.count;
    return firstContent + '<span class="js-read-more__content">' + secondContent + '</span>';
  };

  function setBtnLabels(readMore) { // set custom labels for read More/Less btns
    var btnLabels = readMore.element.getAttribute('data-btn-labels');
    if(btnLabels) {
      var labelsArray = btnLabels.split(',');
      readMore.btnShowLabel = labelsArray[0].trim();
      readMore.btnHideLabel = labelsArray[1].trim();
    }
  };

  function initReadMore(readMore) { // add read more/read less buttons to the markup
    readMore.moreContent = readMore.element.getElementsByClassName('js-read-more__content');
    if( readMore.moreContent.length == 0 ) {
      Util.addClass(readMore.element, 'read-more--loaded');
      return;
    }
    var btnShow = ' <button class="js-read-more__btn '+readMore.btnClasses+'">'+readMore.btnShowLabel+'</button>';
    var btnHide = ' <button class="js-read-more__btn is-hidden '+readMore.btnClasses+'">'+readMore.btnHideLabel+'</button>';
    if(readMore.ellipsis) {
      btnShow = '<span class="js-read-more__ellipsis" aria-hidden="true">...</span>'+ btnShow;
    }

    readMore.moreContent[readMore.moreContent.length - 1].insertAdjacentHTML('afterend', btnHide);
    readMore.moreContent[0].insertAdjacentHTML('afterend', btnShow);
    resetAppearance(readMore);
    initEvents(readMore);
  };

  function resetAppearance(readMore) { // hide part of the content
    for(var i = 0; i < readMore.moreContent.length; i++) Util.addClass(readMore.moreContent[i], 'is-hidden');
    Util.addClass(readMore.element, 'read-more--loaded'); // show entire component
  };

  function initEvents(readMore) { // listen to the click on the read more/less btn
    readMore.btnToggle = readMore.element.getElementsByClassName('js-read-more__btn');
    readMore.ellipsis = readMore.element.getElementsByClassName('js-read-more__ellipsis');

    readMore.btnToggle[0].addEventListener('click', function(event){
      event.preventDefault();
      updateVisibility(readMore, true);
    });
    readMore.btnToggle[1].addEventListener('click', function(event){
      event.preventDefault();
      updateVisibility(readMore, false);
    });
  };

  function updateVisibility(readMore, visibile) {
    for(var i = 0; i < readMore.moreContent.length; i++) Util.toggleClass(readMore.moreContent[i], 'is-hidden', !visibile);
    // reset btns appearance
    Util.toggleClass(readMore.btnToggle[0], 'is-hidden', visibile);
    Util.toggleClass(readMore.btnToggle[1], 'is-hidden', !visibile);
    if(readMore.ellipsis.length > 0 ) Util.toggleClass(readMore.ellipsis[0], 'is-hidden', visibile);
    if(!readMore.toggleOff) Util.addClass(readMore.btn, 'is-hidden');
    // move focus
    if(visibile) {
      var targetTabIndex = readMore.moreContent[0].getAttribute('tabindex');
      Util.moveFocus(readMore.moreContent[0]);
      resetFocusTarget(readMore.moreContent[0], targetTabIndex);
    } else {
      Util.moveFocus(readMore.btnToggle[0]);
    }
  };

  function resetFocusTarget(target, tabindex) {
    if( parseInt(target.getAttribute('tabindex')) < 0) {
			target.style.outline = 'none';
			!tabindex && target.removeAttribute('tabindex');
		}
  };

  //initialize the ReadMore objects
	var readMore = document.getElementsByClassName('js-read-more');
	if( readMore.length > 0 ) {
		for( var i = 0; i < readMore.length; i++) {
			(function(i){new ReadMore(readMore[i]);})(i);
		}
	};
}());
// File#: _1_reading-progressbar
// Usage: codyhouse.co/license
(function() {
  var readingIndicator = document.getElementsByClassName('js-reading-progressbar')[0],
		readingIndicatorContent = document.getElementsByClassName('js-reading-content')[0];
  
  if( readingIndicator && readingIndicatorContent) {
    var progressInfo = [],
      progressEvent = false,
      progressFallback = readingIndicator.getElementsByClassName('js-reading-progressbar__fallback')[0],
      progressIsSupported = 'value' in readingIndicator;

    var boundingClientRect = readingIndicatorContent.getBoundingClientRect();

    progressInfo['height'] = readingIndicatorContent.offsetHeight;
    progressInfo['top'] = boundingClientRect.top;
    progressInfo['bottom'] = boundingClientRect.bottom;
    progressInfo['window'] = window.innerHeight;
    progressInfo['class'] = 'reading-progressbar--is-active';
    progressInfo['hideClass'] = 'reading-progressbar--is-out';
    
    //init indicator
    setProgressIndicator();
    // wait for font to be loaded - reset progress bar
    if(document.fonts) {
      document.fonts.ready.then(function() {
        triggerReset();
      });
    }
    // listen to window resize - update progress
    window.addEventListener('resize', function(event){
      triggerReset();
    });

    //listen to the window scroll event - update progress
    window.addEventListener('scroll', function(event){
      if(progressEvent) return;
      progressEvent = true;
      (!window.requestAnimationFrame) ? setTimeout(function(){setProgressIndicator();}, 250) : window.requestAnimationFrame(setProgressIndicator);
    });
    
    function setProgressIndicator() {
      var boundingClientRect = readingIndicatorContent.getBoundingClientRect();
      progressInfo['top'] = boundingClientRect.top;
      progressInfo['bottom'] = boundingClientRect.bottom;

      if(progressInfo['height'] <= progressInfo['window']) {
        // short content - hide progress indicator
        Util.removeClass(readingIndicator, progressInfo['class']);
        progressEvent = false;
        return;
      }
      // get new progress and update element
      Util.addClass(readingIndicator, progressInfo['class']);
      var value = (progressInfo['top'] >= 0) ? 0 : 100*(0 - progressInfo['top'])/(progressInfo['height'] - progressInfo['window']);
      readingIndicator.setAttribute('value', value);
      if(!progressIsSupported && progressFallback) progressFallback.style.width = value+'%';
      // hide progress bar when target is outside the viewport
      Util.toggleClass(readingIndicator, progressInfo['hideClass'], progressInfo['bottom'] <= 0);
      progressEvent = false;
    };

    function triggerReset() {
      if(progressEvent) return;
      progressEvent = true;
      (!window.requestAnimationFrame) ? setTimeout(function(){resetProgressIndicator();}, 250) : window.requestAnimationFrame(resetProgressIndicator);
    };

    function resetProgressIndicator() {
      progressInfo['height'] = readingIndicatorContent.offsetHeight;
      progressInfo['window'] = window.innerHeight;
      setProgressIndicator();
    };
  }
}());
// File#: _1_reveal-effects
// Usage: codyhouse.co/license
(function() {
	var fxElements = document.getElementsByClassName('reveal-fx');
	var intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
	if(fxElements.length > 0) {
		// deactivate effect if Reduced Motion is enabled
		if (Util.osHasReducedMotion() || !intersectionObserverSupported) {
			fxRemoveClasses();
			return;
		}
		//on small devices, do not animate elements -> reveal all
		if( fxDisabled(fxElements[0]) ) {
			fxRevealAll();
			return;
		}

		var fxRevealDelta = 120; // amount (in pixel) the element needs to enter the viewport to be revealed - if not custom value (data-reveal-fx-delta)
		
		var viewportHeight = window.innerHeight,
			fxChecking = false,
			fxRevealedItems = [],
			fxElementDelays = fxGetDelays(), //elements animation delay
			fxElementDeltas = fxGetDeltas(); // amount (in px) the element needs enter the viewport to be revealed (default value is fxRevealDelta) 
		
		
		// add event listeners
		window.addEventListener('load', fxReveal);
		window.addEventListener('resize', fxResize);
		window.addEventListener('restartAll', fxRestart);

		// observe reveal elements
		var observer = [];
		initObserver();

		function initObserver() {
			for(var i = 0; i < fxElements.length; i++) {
				observer[i] = new IntersectionObserver(
					function(entries, observer) { 
						if(entries[0].isIntersecting) {
							fxRevealItemObserver(entries[0].target);
							observer.unobserve(entries[0].target);
						}
					}, 
					{rootMargin: "0px 0px -"+fxElementDeltas[i]+"px 0px"}
				);
	
				observer[i].observe(fxElements[i]);
			}
		};

		function fxRevealAll() { // reveal all elements - small devices
			for(var i = 0; i < fxElements.length; i++) {
				Util.addClass(fxElements[i], 'reveal-fx--is-visible');
			}
		};

		function fxResize() { // on resize - check new window height and reveal visible elements
			if(fxChecking) return;
			fxChecking = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){fxReset();}, 250) : window.requestAnimationFrame(fxReset);
		};

		function fxReset() {
			viewportHeight = window.innerHeight;
			fxReveal();
		};

		function fxReveal() { // reveal visible elements
			for(var i = 0; i < fxElements.length; i++) {(function(i){
				if(fxRevealedItems.indexOf(i) != -1 ) return; //element has already been revelead
				if(fxElementIsVisible(fxElements[i], i)) {
					fxRevealItem(i);
					fxRevealedItems.push(i);
				}})(i); 
			}
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxRevealItem(index) {
			if(fxElementDelays[index] && fxElementDelays[index] != 0) {
				// wait before revealing element if a delay was added
				setTimeout(function(){
					Util.addClass(fxElements[index], 'reveal-fx--is-visible');
				}, fxElementDelays[index]);
			} else {
				Util.addClass(fxElements[index], 'reveal-fx--is-visible');
			}
		};

		function fxRevealItemObserver(item) {
			var index = Util.getIndexInArray(fxElements, item);
			if(fxRevealedItems.indexOf(index) != -1 ) return; //element has already been revelead
			fxRevealItem(index);
			fxRevealedItems.push(index);
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxGetDelays() { // get anmation delays
			var delays = [];
			for(var i = 0; i < fxElements.length; i++) {
				delays.push( fxElements[i].getAttribute('data-reveal-fx-delay') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delay')) : 0);
			}
			return delays;
		};

		function fxGetDeltas() { // get reveal delta
			var deltas = [];
			for(var i = 0; i < fxElements.length; i++) {
				deltas.push( fxElements[i].getAttribute('data-reveal-fx-delta') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delta')) : fxRevealDelta);
			}
			return deltas;
		};

		function fxDisabled(element) { // check if elements need to be animated - no animation on small devices
			return !(window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/'|"/g, "") == 'reveal-fx');
		};

		function fxElementIsVisible(element, i) { // element is inside viewport
			return (fxGetElementPosition(element) <= viewportHeight - fxElementDeltas[i]);
		};

		function fxGetElementPosition(element) { // get top position of element
			return element.getBoundingClientRect().top;
		};

		function fxResetEvents() { 
			if(fxElements.length > fxRevealedItems.length) return;
			// remove event listeners if all elements have been revealed
			window.removeEventListener('load', fxReveal);
			window.removeEventListener('resize', fxResize);
		};

		function fxRemoveClasses() {
			// Reduced Motion on or Intersection Observer not supported
			while(fxElements[0]) {
				// remove all classes starting with 'reveal-fx--'
				var classes = fxElements[0].getAttribute('class').split(" ").filter(function(c) {
					return c.lastIndexOf('reveal-fx--', 0) !== 0;
				});
				fxElements[0].setAttribute('class', classes.join(" ").trim());
				Util.removeClass(fxElements[0], 'reveal-fx');
			}
		};

		function fxRestart() {
      // restart the reveal effect -> hide all elements and re-init the observer
      if (Util.osHasReducedMotion() || !intersectionObserverSupported || fxDisabled(fxElements[0])) {
        return;
      }
      // check if we need to add the event listensers back
      if(fxElements.length <= fxRevealedItems.length) {
        window.addEventListener('load', fxReveal);
        window.addEventListener('resize', fxResize);
      }
      // remove observer and reset the observer array
      for(var i = 0; i < observer.length; i++) {
        if(observer[i]) observer[i].disconnect();
      }
      observer = [];
      // remove visible class
      for(var i = 0; i < fxElements.length; i++) {
        Util.removeClass(fxElements[i], 'reveal-fx--is-visible');
      }
      // reset fxRevealedItems array
      fxRevealedItems = [];
      // restart observer
      initObserver();
    };
	}
}());
// File#: _1_scrolling-animations
// Usage: codyhouse.co/license
(function() {
  var ScrollFx = function(element, scrollableSelector) {
    this.element = element;
    this.options = [];
    this.boundingRect = this.element.getBoundingClientRect();
    this.windowHeight = window.innerHeight;
    this.scrollingFx = [];
    this.animating = [];
    this.deltaScrolling = [];
    this.observer = [];
    this.scrollableSelector = scrollableSelector; // if the scrollable element is not the window 
    this.scrollableElement = false;
    initScrollFx(this);
    // ToDo - option to pass two selectors to target the element start and stop animation scrolling values -> to be used for sticky/fixed elements
  };

  function initScrollFx(element) {
    // do not animate if reduced motion is on
    if(Util.osHasReducedMotion()) return;
    // get scrollable element
    setScrollableElement(element);
    // get animation params
    var animation = element.element.getAttribute('data-scroll-fx');
    if(animation) {
      element.options.push(extractAnimation(animation));
    } else {
      getAnimations(element, 1);
    }
    // set Intersection Observer
    initObserver(element);
    // update params on resize
    initResize(element);
  };

  function setScrollableElement(element) {
    if(element.scrollableSelector) element.scrollableElement = document.querySelector(element.scrollableSelector);
  };

  function initObserver(element) {
    for(var i = 0; i < element.options.length; i++) {
      (function(i){
        element.scrollingFx[i] = false;
        element.deltaScrolling[i] = getDeltaScrolling(element, i);
        element.animating[i] = false;

        element.observer[i] = new IntersectionObserver(
          function(entries, observer) { 
            scrollFxCallback(element, i, entries, observer);
          },
          {
            rootMargin: (element.options[i][5] -100)+"% 0px "+(0 - element.options[i][4])+"% 0px"
          }
        );
    
        element.observer[i].observe(element.element);

        // set initial value
        setTimeout(function(){
          animateScrollFx.bind(element, i)();
        })
      })(i);
    }
  };

  function scrollFxCallback(element, index, entries, observer) {
		if(entries[0].isIntersecting) {
      if(element.scrollingFx[index]) return; // listener for scroll event already added
      // reset delta
      resetDeltaBeforeAnim(element, index);
      triggerAnimateScrollFx(element, index);
    } else {
      if(!element.scrollingFx[index]) return; // listener for scroll event already removed
      window.removeEventListener('scroll', element.scrollingFx[index]);
      element.scrollingFx[index] = false;
    }
  };

  function triggerAnimateScrollFx(element, index) {
    element.scrollingFx[index] = animateScrollFx.bind(element, index);
    (element.scrollableElement)
      ? element.scrollableElement.addEventListener('scroll', element.scrollingFx[index])
      : window.addEventListener('scroll', element.scrollingFx[index]);
  };

  function animateScrollFx(index) {
    // if window scroll is outside the proper range -> return
    if(getScrollY(this) < this.deltaScrolling[index][0]) {
      setCSSProperty(this, index, this.options[index][1]);
      return;
    }
    if(getScrollY(this) > this.deltaScrolling[index][1]) {
      setCSSProperty(this, index, this.options[index][2]);
      return;
    }
    if(this.animating[index]) return;
    this.animating[index] = true;
    window.requestAnimationFrame(updatePropertyScroll.bind(this, index));
  };

  function updatePropertyScroll(index) { // get value
    // check if this is a theme value or a css property
    if(isNaN(this.options[index][1])) {
      // this is a theme value to update
      (getScrollY(this) >= this.deltaScrolling[index][1]) 
        ? setCSSProperty(this, index, this.options[index][2])
        : setCSSProperty(this, index, this.options[index][1]);
    } else {
      // this is a CSS property
      var value = this.options[index][1] + (this.options[index][2] - this.options[index][1])*(getScrollY(this) - this.deltaScrolling[index][0])/(this.deltaScrolling[index][1] - this.deltaScrolling[index][0]);
      // update css property
      setCSSProperty(this, index, value);
    }
    
    this.animating[index] = false;
  };

  function setCSSProperty(element, index, value) {
    if(isNaN(value)) {
      // this is a theme value that needs to be updated
      setThemeValue(element, value);
      return;
    }
    if(element.options[index][0] == '--scroll-fx-skew' || element.options[index][0] == '--scroll-fx-scale') {
      // set 2 different CSS properties for the transformation on both x and y axis
      element.element.style.setProperty(element.options[index][0]+'-x', value+element.options[index][3]);
      element.element.style.setProperty(element.options[index][0]+'-y', value+element.options[index][3]);
    } else {
      // set single CSS property
      element.element.style.setProperty(element.options[index][0], value+element.options[index][3]);
    }
  };

  function setThemeValue(element, value) {
    // if value is different from the theme in use -> update it
    if(element.element.getAttribute('data-theme') != value) {
      Util.addClass(element.element, 'scroll-fx--theme-transition');
      element.element.offsetWidth;
      element.element.setAttribute('data-theme', value);
      element.element.addEventListener('transitionend', function cb(){
        element.element.removeEventListener('transitionend', cb);
        Util.removeClass(element.element, 'scroll-fx--theme-transition');
      });
    }
  };

  function getAnimations(element, index) {
    var option = element.element.getAttribute('data-scroll-fx-'+index);
    if(option) {
      // multiple animations for the same element - iterate through them
      element.options.push(extractAnimation(option));
      getAnimations(element, index+1);
    } 
    return;
  };

  function extractAnimation(option) {
    var array = option.split(',').map(function(item) {
      return item.trim();
    });
    var propertyOptions = getPropertyValues(array[1], array[2]);
    var animation = [getPropertyLabel(array[0]), propertyOptions[0], propertyOptions[1], propertyOptions[2], parseInt(array[3]), parseInt(array[4])];
    return animation;
  };

  function getPropertyLabel(property) {
    var propertyCss = '--scroll-fx-';
    for(var i = 0; i < property.length; i++) {
      propertyCss = (property[i] == property[i].toUpperCase())
        ? propertyCss + '-'+property[i].toLowerCase()
        : propertyCss +property[i];
    }
    if(propertyCss == '--scroll-fx-rotate') {
      propertyCss = '--scroll-fx-rotate-z';
    } else if(propertyCss == '--scroll-fx-translate') {
      propertyCss = '--scroll-fx-translate-x';
    }
    return propertyCss;
  };

  function getPropertyValues(val1, val2) {
    var nbVal1 = parseFloat(val1), 
      nbVal2 = parseFloat(val2),
      unit = val1.replace(nbVal1, '');
    if(isNaN(nbVal1)) {
      // property is a theme value
      nbVal1 = val1;
      nbVal2 = val2;
      unit = '';
    }
    return [nbVal1, nbVal2, unit];
  };

  function getDeltaScrolling(element, index) {
    // this retrieve the max and min scroll value that should trigger the animation
    var topDelta = getScrollY(element) - (element.windowHeight - (element.windowHeight + element.boundingRect.height)*element.options[index][4]/100) + element.boundingRect.top,
      bottomDelta = getScrollY(element) - (element.windowHeight - (element.windowHeight + element.boundingRect.height)*element.options[index][5]/100) + element.boundingRect.top;
    return [topDelta, bottomDelta];
  };

  function initResize(element) {
    var resizingId = false;
    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(resetResize.bind(element), 500);
    });
    // emit custom event -> elements have been initialized
    var event = new CustomEvent('scrollFxReady');
		element.element.dispatchEvent(event);
  };

  function resetResize() {
    // on resize -> make sure to update all scrolling delta values
    this.boundingRect = this.element.getBoundingClientRect();
    this.windowHeight = window.innerHeight;
    for(var i = 0; i < this.deltaScrolling.length; i++) {
      this.deltaScrolling[i] = getDeltaScrolling(this, i);
      animateScrollFx.bind(this, i)();
    }
    // emit custom event -> elements have been resized
    var event = new CustomEvent('scrollFxResized');
		this.element.dispatchEvent(event);
  };

  function resetDeltaBeforeAnim(element, index) {
    element.boundingRect = element.element.getBoundingClientRect();
    element.windowHeight = window.innerHeight;
    element.deltaScrolling[index] = getDeltaScrolling(element, index);
  };

  function getScrollY(element) {
    if(!element.scrollableElement) return window.scrollY;
    return element.scrollableElement.scrollTop;
  }

  window.ScrollFx = ScrollFx;

  var scrollFx = document.getElementsByClassName('js-scroll-fx');
  for(var i = 0; i < scrollFx.length; i++) {
    (function(i){
      var scrollableElement = scrollFx[i].getAttribute('data-scrollable-element');
      new ScrollFx(scrollFx[i], scrollableElement);
    })(i);
  }
}());
// File#: _1_smooth-scrolling
// Usage: codyhouse.co/license
(function() {
	var SmoothScroll = function(element) {
		if(!('CSS' in window) || !CSS.supports('color', 'var(--color-var)')) return;
		this.element = element;
		this.scrollDuration = parseInt(this.element.getAttribute('data-duration')) || 300;
		this.dataElementY = this.element.getAttribute('data-scrollable-element-y') || this.element.getAttribute('data-scrollable-element') || this.element.getAttribute('data-element');
		this.scrollElementY = this.dataElementY ? document.querySelector(this.dataElementY) : window;
		this.dataElementX = this.element.getAttribute('data-scrollable-element-x');
		this.scrollElementX = this.dataElementY ? document.querySelector(this.dataElementX) : window;
		this.initScroll();
	};

	SmoothScroll.prototype.initScroll = function() {
		var self = this;

		//detect click on link
		this.element.addEventListener('click', function(event){
			event.preventDefault();
			var targetId = event.target.closest('.js-smooth-scroll').getAttribute('href').replace('#', ''),
				target = document.getElementById(targetId),
				targetTabIndex = target.getAttribute('tabindex'),
				windowScrollTop = self.scrollElementY.scrollTop || document.documentElement.scrollTop;

			// scroll vertically
			if(!self.dataElementY) windowScrollTop = window.scrollY || document.documentElement.scrollTop;

			var scrollElementY = self.dataElementY ? self.scrollElementY : false;

			var fixedHeight = self.getFixedElementHeight(); // check if there's a fixed element on the page
			Util.scrollTo(target.getBoundingClientRect().top + windowScrollTop - fixedHeight, self.scrollDuration, function() {
				// scroll horizontally
				self.scrollHorizontally(target, fixedHeight);
				//move the focus to the target element - don't break keyboard navigation
				Util.moveFocus(target);
				history.pushState(false, false, '#'+targetId);
				self.resetTarget(target, targetTabIndex);
			}, scrollElementY);
		});
	};

	SmoothScroll.prototype.scrollHorizontally = function(target, delta) {
    var scrollEl = this.dataElementX ? this.scrollElementX : false;
    var windowScrollLeft = this.scrollElementX ? this.scrollElementX.scrollLeft : document.documentElement.scrollLeft;
    var final = target.getBoundingClientRect().left + windowScrollLeft - delta,
      duration = this.scrollDuration;

    var element = scrollEl || window;
    var start = element.scrollLeft || document.documentElement.scrollLeft,
      currentTime = null;

    if(!scrollEl) start = window.scrollX || document.documentElement.scrollLeft;
		// return if there's no need to scroll
    if(Math.abs(start - final) < 5) return;
        
    var animateScroll = function(timestamp){
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      var val = Math.easeInOutQuad(progress, start, final-start, duration);
      element.scrollTo({
				left: val,
			});
      if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    window.requestAnimationFrame(animateScroll);
  };

	SmoothScroll.prototype.resetTarget = function(target, tabindex) {
		if( parseInt(target.getAttribute('tabindex')) < 0) {
			target.style.outline = 'none';
			!tabindex && target.removeAttribute('tabindex');
		}	
	};

	SmoothScroll.prototype.getFixedElementHeight = function() {
		var scrollElementY = this.dataElementY ? this.scrollElementY : document.documentElement;
    var fixedElementDelta = parseInt(getComputedStyle(scrollElementY).getPropertyValue('scroll-padding'));
		if(isNaN(fixedElementDelta) ) { // scroll-padding not supported
			fixedElementDelta = 0;
			var fixedElement = document.querySelector(this.element.getAttribute('data-fixed-element'));
			if(fixedElement) fixedElementDelta = parseInt(fixedElement.getBoundingClientRect().height);
		}
		return fixedElementDelta;
	};
	
	//initialize the Smooth Scroll objects
	var smoothScrollLinks = document.getElementsByClassName('js-smooth-scroll');
	if( smoothScrollLinks.length > 0 && !Util.cssSupports('scroll-behavior', 'smooth') && window.requestAnimationFrame) {
		// you need javascript only if css scroll-behavior is not supported
		for( var i = 0; i < smoothScrollLinks.length; i++) {
			(function(i){new SmoothScroll(smoothScrollLinks[i]);})(i);
		}
	}
}());
// File#: _1_social-sharing
// Usage: codyhouse.co/license
(function() {
  function initSocialShare(button) {
    button.addEventListener('click', function(event){
      event.preventDefault();
      var social = button.getAttribute('data-social');
      var url = getSocialUrl(button, social);
      (social == 'mail')
        ? window.location.href = url
        : window.open(url, social+'-share-dialog', 'width=626,height=436');
    });
  };

  function getSocialUrl(button, social) {
    var params = getSocialParams(social);
    var newUrl = '';
    for(var i = 0; i < params.length; i++) {
      var paramValue = button.getAttribute('data-'+params[i]);
      if(params[i] == 'hashtags') paramValue = encodeURI(paramValue.replace(/\#| /g, ''));
      if(paramValue) {
        (social == 'facebook') 
          ? newUrl = newUrl + 'u='+encodeURIComponent(paramValue)+'&'
          : newUrl = newUrl + params[i]+'='+encodeURIComponent(paramValue)+'&';
      }
    }
    if(social == 'linkedin') newUrl = 'mini=true&'+newUrl;
    return button.getAttribute('href')+'?'+newUrl;
  };

  function getSocialParams(social) {
    var params = [];
    switch (social) {
      case 'twitter':
        params = ['text', 'hashtags'];
        break;
      case 'facebook':
      case 'linkedin':
        params = ['url'];
        break;
      case 'pinterest':
        params = ['url', 'media', 'description'];
        break;
      case 'mail':
        params = ['subject', 'body'];
        break;
    }
    return params;
  };

  var socialShare = document.getElementsByClassName('js-social-share');
  if(socialShare.length > 0) {
    for( var i = 0; i < socialShare.length; i++) {
      (function(i){initSocialShare(socialShare[i])})(i);
    }
  }
}());
// File#: _1_tabs
// Usage: codyhouse.co/license
(function() {
	var Tab = function(element) {
		this.element = element;
		this.tabList = this.element.getElementsByClassName('js-tabs__controls')[0];
		this.listItems = this.tabList.getElementsByTagName('li');
		this.triggers = this.tabList.getElementsByTagName('a');
		this.panelsList = this.element.getElementsByClassName('js-tabs__panels')[0];
		this.panels = Util.getChildrenByClassName(this.panelsList, 'js-tabs__panel');
		this.hideClass = 'is-hidden';
		this.customShowClass = this.element.getAttribute('data-show-panel-class') ? this.element.getAttribute('data-show-panel-class') : false;
		this.layout = this.element.getAttribute('data-tabs-layout') ? this.element.getAttribute('data-tabs-layout') : 'horizontal';
		// deep linking options
		this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
		// init tabs
		this.initTab();
	};

	Tab.prototype.initTab = function() {
		//set initial aria attributes
		this.tabList.setAttribute('role', 'tablist');
		for( var i = 0; i < this.triggers.length; i++) {
			var bool = (i == 0),
				panelId = this.panels[i].getAttribute('id');
			this.listItems[i].setAttribute('role', 'presentation');
			Util.setAttributes(this.triggers[i], {'role': 'tab', 'aria-selected': bool, 'aria-controls': panelId, 'id': 'tab-'+panelId});
			Util.addClass(this.triggers[i], 'js-tabs__trigger'); 
			Util.setAttributes(this.panels[i], {'role': 'tabpanel', 'aria-labelledby': 'tab-'+panelId});
			Util.toggleClass(this.panels[i], this.hideClass, !bool);

			if(!bool) this.triggers[i].setAttribute('tabindex', '-1'); 
		}

		//listen for Tab events
		this.initTabEvents();

		// check deep linking option
		this.initDeepLink();
	};

	Tab.prototype.initTabEvents = function() {
		var self = this;
		//click on a new tab -> select content
		this.tabList.addEventListener('click', function(event) {
			if( event.target.closest('.js-tabs__trigger') ) self.triggerTab(event.target.closest('.js-tabs__trigger'), event);
		});
		//arrow keys to navigate through tabs 
		this.tabList.addEventListener('keydown', function(event) {
			;
			if( !event.target.closest('.js-tabs__trigger') ) return;
			if( tabNavigateNext(event, self.layout) ) {
				event.preventDefault();
				self.selectNewTab('next');
			} else if( tabNavigatePrev(event, self.layout) ) {
				event.preventDefault();
				self.selectNewTab('prev');
			}
		});
	};

	Tab.prototype.selectNewTab = function(direction) {
		var selectedTab = this.tabList.querySelector('[aria-selected="true"]'),
			index = Util.getIndexInArray(this.triggers, selectedTab);
		index = (direction == 'next') ? index + 1 : index - 1;
		//make sure index is in the correct interval 
		//-> from last element go to first using the right arrow, from first element go to last using the left arrow
		if(index < 0) index = this.listItems.length - 1;
		if(index >= this.listItems.length) index = 0;	
		this.triggerTab(this.triggers[index]);
		this.triggers[index].focus();
	};

	Tab.prototype.triggerTab = function(tabTrigger, event) {
		var self = this;
		event && event.preventDefault();	
		var index = Util.getIndexInArray(this.triggers, tabTrigger);
		//no need to do anything if tab was already selected
		if(this.triggers[index].getAttribute('aria-selected') == 'true') return;
		
		for( var i = 0; i < this.triggers.length; i++) {
			var bool = (i == index);
			Util.toggleClass(this.panels[i], this.hideClass, !bool);
			if(this.customShowClass) Util.toggleClass(this.panels[i], this.customShowClass, bool);
			this.triggers[i].setAttribute('aria-selected', bool);
			bool ? this.triggers[i].setAttribute('tabindex', '0') : this.triggers[i].setAttribute('tabindex', '-1');
		}

		// update url if deepLink is on
		if(this.deepLinkOn) {
			history.replaceState(null, '', '#'+tabTrigger.getAttribute('aria-controls'));
		}
	};

	Tab.prototype.initDeepLink = function() {
		if(!this.deepLinkOn) return;
		var hash = window.location.hash.substr(1);
		var self = this;
		if(!hash || hash == '') return;
		for(var i = 0; i < this.panels.length; i++) {
			if(this.panels[i].getAttribute('id') == hash) {
				this.triggerTab(this.triggers[i], false);
				setTimeout(function(){self.panels[i].scrollIntoView(true);});
				break;
			}
		};
	};

	function tabNavigateNext(event, layout) {
		if(layout == 'horizontal' && (event.keyCode && event.keyCode == 39 || event.key && event.key == 'ArrowRight')) {return true;}
		else if(layout == 'vertical' && (event.keyCode && event.keyCode == 40 || event.key && event.key == 'ArrowDown')) {return true;}
		else {return false;}
	};

	function tabNavigatePrev(event, layout) {
		if(layout == 'horizontal' && (event.keyCode && event.keyCode == 37 || event.key && event.key == 'ArrowLeft')) {return true;}
		else if(layout == 'vertical' && (event.keyCode && event.keyCode == 38 || event.key && event.key == 'ArrowUp')) {return true;}
		else {return false;}
	};

	window.Tab = Tab;
	
	//initialize the Tab objects
	var tabs = document.getElementsByClassName('js-tabs');
	if( tabs.length > 0 ) {
		for( var i = 0; i < tabs.length; i++) {
			(function(i){new Tab(tabs[i]);})(i);
		}
	}
}());
// File#: _1_tooltip
// Usage: codyhouse.co/license
(function() {
	var Tooltip = function(element) {
		this.element = element;
		this.tooltip = false;
		this.tooltipIntervalId = false;
		this.tooltipContent = this.element.getAttribute('title');
		this.tooltipPosition = (this.element.getAttribute('data-tooltip-position')) ? this.element.getAttribute('data-tooltip-position') : 'top';
		this.tooltipClasses = (this.element.getAttribute('data-tooltip-class')) ? this.element.getAttribute('data-tooltip-class') : false;
		this.tooltipId = 'js-tooltip-element'; // id of the tooltip element -> trigger will have the same aria-describedby attr
		// there are cases where you only need the aria-label -> SR do not need to read the tooltip content (e.g., footnotes)
		this.tooltipDescription = (this.element.getAttribute('data-tooltip-describedby') && this.element.getAttribute('data-tooltip-describedby') == 'false') ? false : true; 


		this.tooltipDelay = this.element.getAttribute('data-tooltip-delay'); // show tooltip after a delay (in ms)
		if(!this.tooltipDelay) this.tooltipDelay = 300; 
		this.tooltipDelta = parseInt(this.element.getAttribute('data-tooltip-gap')); // distance beetwen tooltip and trigger element (in px)
		if(isNaN(this.tooltipDelta)) this.tooltipDelta = 10; 
		console.log(this.tooltipDelta);
		this.tooltipTriggerHover = false;
		// tooltp sticky option
		this.tooltipSticky = (this.tooltipClasses && this.tooltipClasses.indexOf('tooltip--sticky') > -1);
		this.tooltipHover = false;
		if(this.tooltipSticky) {
			this.tooltipHoverInterval = false;
		}
		// tooltip triangle - css variable to control its position
		this.tooltipTriangleVar = '--tooltip-triangle-translate';
		resetTooltipContent(this);
		initTooltip(this);
	};

	function resetTooltipContent(tooltip) {
		var htmlContent = tooltip.element.getAttribute('data-tooltip-title');
		if(htmlContent) {
			tooltip.tooltipContent = htmlContent;
		}
	};

	function initTooltip(tooltipObj) {
		// reset trigger element
		tooltipObj.element.removeAttribute('title');
		tooltipObj.element.setAttribute('tabindex', '0');
		// add event listeners
		tooltipObj.element.addEventListener('mouseenter', handleEvent.bind(tooltipObj));
		tooltipObj.element.addEventListener('focus', handleEvent.bind(tooltipObj));
	};

	function removeTooltipEvents(tooltipObj) {
		// remove event listeners
		tooltipObj.element.removeEventListener('mouseleave',  handleEvent.bind(tooltipObj));
		tooltipObj.element.removeEventListener('blur',  handleEvent.bind(tooltipObj));
	};

	function handleEvent(event) {
		// handle events
		switch(event.type) {
			case 'mouseenter':
			case 'focus':
				showTooltip(this, event);
				break;
			case 'mouseleave':
			case 'blur':
				checkTooltip(this);
				break;
			case 'newContent':
				changeTooltipContent(this, event);
				break;
		}
	};

	function showTooltip(tooltipObj, event) {
		// tooltip has already been triggered
		if(tooltipObj.tooltipIntervalId) return;
		tooltipObj.tooltipTriggerHover = true;
		// listen to close events
		tooltipObj.element.addEventListener('mouseleave', handleEvent.bind(tooltipObj));
		tooltipObj.element.addEventListener('blur', handleEvent.bind(tooltipObj));
		// custom event to reset tooltip content
		tooltipObj.element.addEventListener('newContent', handleEvent.bind(tooltipObj));

		// show tooltip with a delay
		tooltipObj.tooltipIntervalId = setTimeout(function(){
			createTooltip(tooltipObj);
		}, tooltipObj.tooltipDelay);
	};

	function createTooltip(tooltipObj) {
		tooltipObj.tooltip = document.getElementById(tooltipObj.tooltipId);
		
		if( !tooltipObj.tooltip ) { // tooltip element does not yet exist
			tooltipObj.tooltip = document.createElement('div');
			document.body.appendChild(tooltipObj.tooltip);
		} 

		// remove data-reset attribute that is used when updating tooltip content (newContent custom event)
		tooltipObj.tooltip.removeAttribute('data-reset');
		
		// reset tooltip content/position
		Util.setAttributes(tooltipObj.tooltip, {'id': tooltipObj.tooltipId, 'class': 'tooltip tooltip--is-hidden js-tooltip', 'role': 'tooltip'});
		tooltipObj.tooltip.innerHTML = tooltipObj.tooltipContent;
		if(tooltipObj.tooltipDescription) tooltipObj.element.setAttribute('aria-describedby', tooltipObj.tooltipId);
		if(tooltipObj.tooltipClasses) Util.addClass(tooltipObj.tooltip, tooltipObj.tooltipClasses);
		if(tooltipObj.tooltipSticky) Util.addClass(tooltipObj.tooltip, 'tooltip--sticky');
		placeTooltip(tooltipObj);
		Util.removeClass(tooltipObj.tooltip, 'tooltip--is-hidden');

		// if tooltip is sticky, listen to mouse events
		if(!tooltipObj.tooltipSticky) return;
		tooltipObj.tooltip.addEventListener('mouseenter', function cb(){
			tooltipObj.tooltipHover = true;
			if(tooltipObj.tooltipHoverInterval) {
				clearInterval(tooltipObj.tooltipHoverInterval);
				tooltipObj.tooltipHoverInterval = false;
			}
			tooltipObj.tooltip.removeEventListener('mouseenter', cb);
			tooltipLeaveEvent(tooltipObj);
		});
	};

	function tooltipLeaveEvent(tooltipObj) {
		tooltipObj.tooltip.addEventListener('mouseleave', function cb(){
			tooltipObj.tooltipHover = false;
			tooltipObj.tooltip.removeEventListener('mouseleave', cb);
			hideTooltip(tooltipObj);
		});
	};

	function placeTooltip(tooltipObj) {
		// set top and left position of the tooltip according to the data-tooltip-position attr of the trigger
		var dimention = [tooltipObj.tooltip.offsetHeight, tooltipObj.tooltip.offsetWidth],
			positionTrigger = tooltipObj.element.getBoundingClientRect(),
			position = [],
			scrollY = window.scrollY || window.pageYOffset;

		position['top'] = [ (positionTrigger.top - dimention[0] - tooltipObj.tooltipDelta + scrollY), (positionTrigger.right/2 + positionTrigger.left/2 - dimention[1]/2)];
		position['bottom'] = [ (positionTrigger.bottom + tooltipObj.tooltipDelta + scrollY), (positionTrigger.right/2 + positionTrigger.left/2 - dimention[1]/2)];
		position['left'] = [(positionTrigger.top/2 + positionTrigger.bottom/2 - dimention[0]/2 + scrollY), positionTrigger.left - dimention[1] - tooltipObj.tooltipDelta];
		position['right'] = [(positionTrigger.top/2 + positionTrigger.bottom/2 - dimention[0]/2 + scrollY), positionTrigger.right + tooltipObj.tooltipDelta];
		
		var direction = tooltipObj.tooltipPosition;
		if( direction == 'top' && position['top'][0] < scrollY) direction = 'bottom';
		else if( direction == 'bottom' && position['bottom'][0] + tooltipObj.tooltipDelta + dimention[0] > scrollY + window.innerHeight) direction = 'top';
		else if( direction == 'left' && position['left'][1] < 0 )  direction = 'right';
		else if( direction == 'right' && position['right'][1] + dimention[1] > window.innerWidth ) direction = 'left';

		// reset tooltip triangle translate value
		tooltipObj.tooltip.style.setProperty(tooltipObj.tooltipTriangleVar, '0px');
		
		if(direction == 'top' || direction == 'bottom') {
			var deltaMarg = 5;
			if(position[direction][1] < 0 ) {
				position[direction][1] = deltaMarg;
				// make sure triangle is at the center of the tooltip trigger
				tooltipObj.tooltip.style.setProperty(tooltipObj.tooltipTriangleVar, (positionTrigger.left + 0.5*positionTrigger.width - 0.5*dimention[1] - deltaMarg)+'px');
			}
			if(position[direction][1] + dimention[1] > window.innerWidth ) {
				position[direction][1] = window.innerWidth - dimention[1] - deltaMarg;
				// make sure triangle is at the center of the tooltip trigger
				tooltipObj.tooltip.style.setProperty(tooltipObj.tooltipTriangleVar, (0.5*dimention[1] - (window.innerWidth - positionTrigger.right) - 0.5*positionTrigger.width + deltaMarg)+'px');
			}
		}
		tooltipObj.tooltip.style.top = position[direction][0]+'px';
		tooltipObj.tooltip.style.left = position[direction][1]+'px';
		Util.addClass(tooltipObj.tooltip, 'tooltip--'+direction);
	};

	function checkTooltip(tooltipObj) {
		tooltipObj.tooltipTriggerHover = false;
		if(!tooltipObj.tooltipSticky) hideTooltip(tooltipObj);
		else {
			if(tooltipObj.tooltipHover) return;
			if(tooltipObj.tooltipHoverInterval) return;
			tooltipObj.tooltipHoverInterval = setTimeout(function(){
				hideTooltip(tooltipObj); 
				tooltipObj.tooltipHoverInterval = false;
			}, 300);
		}
	};

	function hideTooltip(tooltipObj) {
		if(tooltipObj.tooltipHover || tooltipObj.tooltipTriggerHover) return;
		clearInterval(tooltipObj.tooltipIntervalId);
		if(tooltipObj.tooltipHoverInterval) {
			clearInterval(tooltipObj.tooltipHoverInterval);
			tooltipObj.tooltipHoverInterval = false;
		}
		tooltipObj.tooltipIntervalId = false;
		if(!tooltipObj.tooltip) return;
		// hide tooltip
		removeTooltip(tooltipObj);
		// remove events
		removeTooltipEvents(tooltipObj);
	};

	function removeTooltip(tooltipObj) {
		if(tooltipObj.tooltipContent == tooltipObj.tooltip.innerHTML || tooltipObj.tooltip.getAttribute('data-reset') == 'on') {
			Util.addClass(tooltipObj.tooltip, 'tooltip--is-hidden');
			tooltipObj.tooltip.removeAttribute('data-reset');
		}
		if(tooltipObj.tooltipDescription) tooltipObj.element.removeAttribute('aria-describedby');
	};

	function changeTooltipContent(tooltipObj, event) {
		if(tooltipObj.tooltip && tooltipObj.tooltipTriggerHover && event.detail) {
			tooltipObj.tooltip.innerHTML = event.detail;
			tooltipObj.tooltip.setAttribute('data-reset', 'on');
			placeTooltip(tooltipObj);
		}
	};

	window.Tooltip = Tooltip;

	//initialize the Tooltip objects
	var tooltips = document.getElementsByClassName('js-tooltip-trigger');
	if( tooltips.length > 0 ) {
		for( var i = 0; i < tooltips.length; i++) {
			(function(i){new Tooltip(tooltips[i]);})(i);
		}
	}
}());
// File#: _1_vertical-timeline
// Usage: codyhouse.co/license
(function() {
	var VTimeline = function(element) {
    this.element = element;
    this.sections = this.element.getElementsByClassName('js-v-timeline__section');
    this.animate = this.element.getAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on' ? true : false;
    this.animationClass = 'v-timeline__section--animate';
    this.animationDelta = '-150px';
    initVTimeline(this);
  };

  function initVTimeline(element) {
    if(!element.animate) return;
    for(var i = 0; i < element.sections.length; i++) {
      var observer = new IntersectionObserver(vTimelineCallback.bind(element, i),
      {rootMargin: "0px 0px "+element.animationDelta+" 0px"});
		  observer.observe(element.sections[i]);
    }
  };

  function vTimelineCallback(index, entries, observer) {
    if(entries[0].isIntersecting) {
      Util.addClass(this.sections[index], this.animationClass);
      observer.unobserve(this.sections[index]);
    } 
  };

  //initialize the VTimeline objects
  var timelines = document.querySelectorAll('.js-v-timeline'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();
	if( timelines.length > 0) {
		for( var i = 0; i < timelines.length; i++) {
      if(intersectionObserverSupported && !reducedMotion) (function(i){new VTimeline(timelines[i]);})(i);
      else timelines[i].removeAttribute('data-animation');
		}
	}
}());
// File#: _2_adv-custom-select
// Usage: codyhouse.co/license
(function() {
  var AdvSelect = function(element) {
    this.element = element;
    this.select = this.element.getElementsByTagName('select')[0];
    this.optGroups = this.select.getElementsByTagName('optgroup');
    this.options = this.select.getElementsByTagName('option');
    this.optionData = getOptionsData(this);
    this.selectId = this.select.getAttribute('id');
    this.selectLabel = document.querySelector('[for='+this.selectId+']')
    this.trigger = this.element.getElementsByClassName('js-adv-select__control')[0];
    this.triggerLabel = this.trigger.getElementsByClassName('js-adv-select__value')[0];
    this.dropdown = document.getElementById(this.trigger.getAttribute('aria-controls'));

    initAdvSelect(this); // init markup
    initAdvSelectEvents(this); // init event listeners
  };

  function getOptionsData(select) {
    var obj = [],
      dataset = select.options[0].dataset;

    function camelCaseToDash( myStr ) {
      return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
    }
    for (var prop in dataset) {
      if (Object.prototype.hasOwnProperty.call(dataset, prop)) {
        // obj[prop] = select.dataset[prop];
        obj.push(camelCaseToDash(prop));
      }
    }
    return obj;
  };

  function initAdvSelect(select) {
    // create custom structure
    createAdvStructure(select);
    // update trigger label
    updateTriggerLabel(select);
    // hide native select and show custom structure
    Util.addClass(select.select, 'is-hidden');
    Util.removeClass(select.trigger, 'is-hidden');
    Util.removeClass(select.dropdown, 'is-hidden');
  };

  function initAdvSelectEvents(select) {
    if(select.selectLabel) {
      // move focus to custom trigger when clicking on <select> label
      select.selectLabel.addEventListener('click', function(){
        select.trigger.focus();
      });
    }

    // option is selected in dropdown
    select.dropdown.addEventListener('click', function(event){
      triggerSelection(select, event.target);
    });

    // keyboard navigation
    select.dropdown.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        keyboardCustomSelect(select, 'prev', event);
      } else if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        keyboardCustomSelect(select, 'next', event);
      } else if(event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {
        triggerSelection(select, document.activeElement);
      }
    });
  };

  function createAdvStructure(select) {
    // store optgroup and option structure
    var optgroup = select.dropdown.querySelector('[role="group"]'),
      option = select.dropdown.querySelector('[role="option"]'),
      optgroupClone = false,
      optgroupLabel = false,
      optionClone = false;
    if(optgroup) {
      optgroupClone = optgroup.cloneNode();
      optgroupLabel = document.getElementById(optgroupClone.getAttribute('describedby'));
    }
    if(option) optionClone = option.cloneNode(true);

    var dropdownCode = '';

    if(select.optGroups.length > 0) {
      for(var i = 0; i < select.optGroups.length; i++) {
        dropdownCode = dropdownCode + getOptGroupCode(select, select.optGroups[i], optgroupClone, optionClone, optgroupLabel, i);
      }
    } else {
      for(var i = 0; i < select.options.length; i++) {
        dropdownCode = dropdownCode + getOptionCode(select, select.options[i], optionClone);
      }
    }

    select.dropdown.innerHTML = dropdownCode;
  };

  function getOptGroupCode(select, optGroup, optGroupClone, optionClone, optgroupLabel, index) {
    if(!optGroupClone || !optionClone) return '';
    var code = '';
    var options = optGroup.getElementsByTagName('option');
    for(var i = 0; i < options.length; i++) {
      code = code + getOptionCode(select, options[i], optionClone);
    }
    if(optgroupLabel) {
      var label = optgroupLabel.cloneNode(true);
      var id = label.getAttribute('id') + '-'+index;
      label.setAttribute('id', id);
      optGroupClone.setAttribute('describedby', id);
      code = label.outerHTML.replace('{optgroup-label}', optGroup.getAttribute('label')) + code;
    } 
    optGroupClone.innerHTML = code;
    return optGroupClone.outerHTML;
  };

  function getOptionCode(select, option, optionClone) {
    optionClone.setAttribute('data-value', option.value);
    if(option.selected) {
      optionClone.setAttribute('aria-selected', 'true');
      optionClone.setAttribute('tabindex', '0');
    } else {
      optionClone.removeAttribute('aria-selected');
      optionClone.removeAttribute('tabindex');
    }
    var optionHtml = optionClone.outerHTML;
    optionHtml = optionHtml.replace('{option-label}', option.text);
    for(var i = 0; i < select.optionData.length; i++) {
      optionHtml = optionHtml.replace('{'+select.optionData[i]+'}', option.getAttribute('data-'+select.optionData[i]));
    }
    return optionHtml;
  };

  function updateTriggerLabel(select) {
    // select.triggerLabel.textContent = select.options[select.select.selectedIndex].text;
    select.triggerLabel.innerHTML = select.dropdown.querySelector('[aria-selected="true"]').innerHTML;
  };

  function triggerSelection(select, target) {
    var option = target.closest('[role="option"]');
    if(!option) return;
    selectOption(select, option);
  };

  function selectOption(select, option) {
    if(option.hasAttribute('aria-selected') && option.getAttribute('aria-selected') == 'true') {
      // selecting the same option
    } else { 
      var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
      if(selectedOption) {
        selectedOption.removeAttribute('aria-selected');
        selectedOption.removeAttribute('tabindex');
      }
      option.setAttribute('aria-selected', 'true');
      option.setAttribute('tabindex', '0');
      // new option has been selected -> update native <select> element and trigger label
      updateNativeSelect(select, option.getAttribute('data-value'));
      updateTriggerLabel(select);
    }
    // move focus back to trigger
    setTimeout(function(){
      select.trigger.click();
    });
  };

  function updateNativeSelect(select, selectedValue) {
    var selectedOption = select.select.querySelector('[value="'+selectedValue+'"');
    select.select.selectedIndex = Util.getIndexInArray(select.options, selectedOption);
    select.select.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
  };

  function keyboardCustomSelect(select, direction) {
    var selectedOption = select.select.querySelector('[value="'+document.activeElement.getAttribute('data-value')+'"]');
    if(!selectedOption) return;
    var index = Util.getIndexInArray(select.options, selectedOption);
    
    index = direction == 'next' ? index + 1 : index - 1;
    if(index < 0) return;
    if(index >= select.options.length) return;
    
    var dropdownOption = select.dropdown.querySelector('[data-value="'+select.options[index].getAttribute('value')+'"]');
    if(dropdownOption) Util.moveFocus(dropdownOption);
  };

  //initialize the AdvSelect objects
  var advSelect = document.getElementsByClassName('js-adv-select');
  if( advSelect.length > 0 ) {
    for( var i = 0; i < advSelect.length; i++) {
      (function(i){new AdvSelect(advSelect[i]);})(i);
    }
  }
}());
// File#: _2_comments
// Usage: codyhouse.co/license
(function() {
  function initVote(element) {
    var voteCounter = element.getElementsByClassName('js-comments__vote-label');
    element.addEventListener('click', function(){
      var pressed = element.getAttribute('aria-pressed') == 'true';
      element.setAttribute('aria-pressed', !pressed);
      Util.toggleClass(element, 'comments__vote-btn--pressed', !pressed);
      resetCounter(voteCounter, pressed);
      emitKeypressEvents(element, voteCounter, pressed);
    });
  };

  function resetCounter(voteCounter, pressed) { // update counter value (if present)
    if(voteCounter.length == 0) return;
    var count = parseInt(voteCounter[0].textContent);
    voteCounter[0].textContent = pressed ? count - 1 : count + 1;
  };

  function emitKeypressEvents(element, label, pressed) { // emit custom event when vote is updated
    var count = (label.length == 0) ? false : parseInt(label[0].textContent);
    var event = new CustomEvent('newVote', {detail: {count: count, upVote: !pressed}});
		element.dispatchEvent(event);
  };

  var voteCounting = document.getElementsByClassName('js-comments__vote-btn');
  if( voteCounting.length > 0 ) {
		for( var i = 0; i < voteCounting.length; i++) {
			(function(i){initVote(voteCounting[i]);})(i);
		}
	}
}());
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
  var flexHeader = document.getElementsByClassName('js-f-header');
	if(flexHeader.length > 0) {
		var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
			firstFocusableElement = getMenuFirstFocusable();

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		resetFlexHeaderOffset();
		setAriaButtons();

		menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){
			toggleMenuNavigation(event.detail);
		});

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
					focusMenu = menuTrigger; // move focus to menu trigger when menu is close
					menuTrigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
			}
		});

		// detect click on a dropdown control button - expand-on-mobile only
		flexHeader[0].addEventListener('click', function(event){
			var btnLink = event.target.closest('.js-f-header__dropdown-control');
			if(!btnLink) return;
			!btnLink.getAttribute('aria-expanded') ? btnLink.setAttribute('aria-expanded', 'true') : btnLink.removeAttribute('aria-expanded');
		});

		// detect mouseout from a dropdown control button - expand-on-mobile only
		flexHeader[0].addEventListener('mouseout', function(event){
			var btnLink = event.target.closest('.js-f-header__dropdown-control');
			if(!btnLink) return;
			// check layout type
			if(getLayout() == 'mobile') return;
			btnLink.removeAttribute('aria-expanded');
		});

		// close dropdown on focusout - expand-on-mobile only
		flexHeader[0].addEventListener('focusin', function(event){
			var btnLink = event.target.closest('.js-f-header__dropdown-control'),
				dropdown = event.target.closest('.f-header__dropdown');
			if(dropdown) return;
			if(btnLink && btnLink.hasAttribute('aria-expanded')) return;
			// check layout type
			if(getLayout() == 'mobile') return;
			var openDropdown = flexHeader[0].querySelector('.js-f-header__dropdown-control[aria-expanded="true"]');
			if(openDropdown) openDropdown.removeAttribute('aria-expanded');
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function getMenuFirstFocusable() {
			var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
				firstFocusable = false;
			for(var i = 0; i < focusableEle.length; i++) {
				if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
					firstFocusable = focusableEle[i];
					break;
				}
			}

			return firstFocusable;
    };
    
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
		};

		function doneResizing() {
			if( !isVisible(menuTrigger) && Util.hasClass(flexHeader[0], 'f-header--expanded')) {
				menuTrigger.click();
			}
			resetFlexHeaderOffset();
		};
		
		function toggleMenuNavigation(bool) { // toggle menu visibility on small devices
			Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', bool);
			Util.toggleClass(flexHeader[0], 'f-header--expanded', bool);
			menuTrigger.setAttribute('aria-expanded', bool);
			if(bool) firstFocusableElement.focus(); // move focus to first focusable element
			else if(focusMenu) {
				focusMenu.focus();
				focusMenu = false;
			}
		};

		function resetFlexHeaderOffset() {
			// on mobile -> update max height of the flexi header based on its offset value (e.g., if there's a fixed pre-header element)
			document.documentElement.style.setProperty('--f-header-offset', flexHeader[0].getBoundingClientRect().top+'px');
		};

		function setAriaButtons() {
			var btnDropdown = flexHeader[0].getElementsByClassName('js-f-header__dropdown-control');
			for(var i = 0; i < btnDropdown.length; i++) {
				var id = 'f-header-dropdown-'+i,
					dropdown = btnDropdown[i].nextElementSibling;
				if(dropdown.hasAttribute('id')) {
					id = dropdown.getAttribute('id');
				} else {
					dropdown.setAttribute('id', id);
				}
				btnDropdown[i].setAttribute('aria-controls', id);	
			}
		};

		function getLayout() {
			return getComputedStyle(flexHeader[0], ':before').getPropertyValue('content').replace(/\'|"/g, '');
		};
	}
}());
// File#: _2_grid-switch
// Usage: codyhouse.co/license
(function() {
  var GridSwitch = function(element) {
    this.element = element;
    this.controller = this.element.getElementsByClassName('js-grid-switch__controller')[0];
    this.items = this.element.getElementsByClassName('js-grid-switch__item');
    this.contentElements = this.element.getElementsByClassName('js-grid-switch__content');
    // store custom classes
    this.classList = [[this.element.getAttribute('data-gs-item-class-1'), this.element.getAttribute('data-gs-content-class-1')], [this.element.getAttribute('data-gs-item-class-2'), this.element.getAttribute('data-gs-content-class-2')]];
    initGridSwitch(this);
  };

  function initGridSwitch(element) {
    // get selected state and apply style
    var selectedInput = element.controller.querySelector('input:checked');
    if(selectedInput) {
      setGridAppearance(element, selectedInput.value);
    }
    // reveal grid
    Util.addClass(element.element, 'grid-switch--is-visible');
    // a new layout has been selected 
    element.controller.addEventListener('change', function(event) {
      setGridAppearance(element, event.target.value);
    });
  };

  function setGridAppearance(element, value) {
    var newStatus = parseInt(value) - 1,
      oldStatus = newStatus == 1 ? 0 : 1;
      
    for(var i = 0; i < element.items.length; i++) {
      Util.removeClass(element.items[i], element.classList[oldStatus][0]);
      Util.removeClass(element.contentElements[i], element.classList[oldStatus][1]);
      Util.addClass(element.items[i], element.classList[newStatus][0]);
      Util.addClass(element.contentElements[i], element.classList[newStatus][1]);
    }
  };

  //initialize the GridSwitch objects
	var gridSwitch = document.getElementsByClassName('js-grid-switch');
	if( gridSwitch.length > 0 ) {
		for( var i = 0; i < gridSwitch.length; i++) {
			(function(i){new GridSwitch(gridSwitch[i]);})(i);
    }
  }
}());
// File#: _2_markdown-editor
// Usage: codyhouse.co/license
(function() {
  function MdEditor(element, actions) {
    this.element = element;
    this.textarea = this.element.getElementsByClassName('js-md-editor__content');
    this.actionsWrapper = this.element.getElementsByClassName('js-md-editor__actions');
    this.actions = actions ? actions : MdEditor.defaults;
    initMdEditor(this);
  };

  function initMdEditor(element) {
    if(element.textarea.length < 1 || element.actionsWrapper.length < 1) return;
    
    element.actionsWrapper[0].addEventListener('click', function(event){
      insertMdCode(element, event.target.closest('[data-md-action]'));
    });
  };

  function insertMdCode(element, btn) {
    if(!btn) return;
    updateTextareaSelection(element);
    var code = getCode(element, btn.getAttribute('data-md-action'));
    replaceSelectedText(element, code);
  };

  function updateTextareaSelection(element) {
    // store textarea info (e.g., selection range, start and end selection range)
    element.selectionStart = element.textarea[0].selectionStart,
    element.selectionEnd = element.textarea[0].selectionEnd;
    element.selectionContent = element.textarea[0].value.slice(element.selectionStart, element.selectionEnd);
  };

  function getCode(element, action) { // get content to insert in the textarea
    var actionInfo = getActionInfo(element, action)[0]; // returns {action.content, action.newLine}
    if(actionInfo.content == '') return element.selectionContent;
    if(actionInfo.content.indexOf('content') < 0) {
      // e.g. for the lists, we do not modify the selected code but we add an example of how the list is formatted
      element.selectionStart = element.selectionStart + element.selectionContent.length;
      element.selectionContent = '';
    }
    var newContent = actionInfo.content.replace('content', element.selectionContent);
    if(addNewLine(element, actionInfo.newLine)) newContent = '\n'+newContent;
    return newContent;
  };

  function replaceSelectedText(element, text) {
    var value = element.textarea[0].value;
    element.textarea[0].value = value.slice(0, element.selectionStart) + text + value.slice(element.selectionEnd);
    // move focus back to texarea and select text that was previously selected (if any)
    element.textarea[0].focus();
    element.textarea[0].selectionEnd = element.selectionEnd - element.selectionContent.length + text.length - element.actionEndLength;
    if(element.selectionStart != element.selectionEnd) {
      element.textarea[0].selectionStart = element.textarea[0].selectionEnd - element.selectionContent.length;
    } else {
      element.textarea[0].selectionStart = element.textarea[0].selectionEnd;
    }
  };

  function getActionInfo(element, action) {
    var actionInfo = [];
    for(var i = 0; i < Object.keys(element.actions).length; i++) {
      if(element.actions[i].action == action) {
        actionInfo.push(element.actions[i]);
        element.actionEndLength = getEndLength(element.actions[i].content);
        break;
      }
    }
    return actionInfo;
  };

  function addNewLine(element, newLine) {
    if(!newLine) return false;
    if(element.selectionStart < 1) return false;
    if(element.selectionStart > 0) {
      // take character before selectionStart and check if it is a new line
      var previousChar = element.textarea[0].value.slice(element.selectionStart - 1, element.selectionStart);
      return (previousChar.match(/\n/g)) ? false : true;
    }
    return true;
  };

  function getEndLength(string) {
    // e.g. if **content** returns 2, if //content/ returns 1, if ###content returns 0
    var array = string.split('content');
    if(array.length < 2) return 0;
    return array[1].length;
  };

  MdEditor.defaults = [
    {
      action: 'heading',
      content: '###content',
      newLine: false
    },
    {
      action: 'code',
      content: '`content`',
      newLine: false
    },
    {
      action: 'link',
      content: '[content](url)',
      newLine: false
    },
    {
      action: 'blockquote',
      content: '> content',
      newLine: true
    },
    {
      action: 'bold',
      content: '**content**',
      newLine: false
    },
    {
      action: 'italic',
      content: '_content_',
      newLine: false
    },
    {
      action: 'uList',
      content: '- Item 1\n- Item 2\n- Item 3',
      newLine: true
    },
    {
      action: 'oList',
      content: '1. Item 1\n2. Item 2\n3. Item 3',
      newLine: true
    },
    {
      action: 'tList',
      content: '- [ ] Item 1\n- [x] Item 2\n- [ ] Item 3',
      newLine: true
    }
  ];

  window.MdEditor = MdEditor;
}());
// File#: _2_multiple-custom-select-v2
// Usage: codyhouse.co/license
(function() {
  var MultiCustomSelectTwo = function(element) {
    this.element = element;
    this.checkboxes = this.element.getElementsByClassName('js-multi-select-v2__input');
    this.counter = this.element.getElementsByClassName('js-multi-select-v2__selected-items-counter');
    this.resetBtn = this.element.getElementsByClassName('js-multi-select-v2__reset');
    this.checkedClass = 'multi-select-v2__label--checked';
    initMultiCustomSelectTwo(this);
  };

  function initMultiCustomSelectTwo(element) {
    // init number of checked inputs
    resetCounter(element);
    // init checked classes
    initCheckedClass(element);

    // detect input checked/unchecked
    element.element.addEventListener('change', function(event){
      var label = event.target.closest('label');
      if(label) Util.toggleClass(label, element.checkedClass, event.target.checked);
      resetCounter(element);
    });

    // reset checked inputs
    if(element.resetBtn.length > 0) {
      element.resetBtn[0].addEventListener('click', function(event) {
        for(var i = 0; i < element.checkboxes.length; i++) element.checkboxes[i].checked = false;
        resetCounter(element, 0);
        resetCheckedClasses(element);
      });
    }
  };

  function resetCounter(element, value) {
    // update number of selected checkboxes
    if(element.counter.length < 1) return;
    if(value !== undefined) {
      element.counter[0].textContent = value;
      return;
    }

    var count = 0;
    for(var i = 0; i < element.checkboxes.length; i++) {
      if(element.checkboxes[i].checked) count = count + 1;
    }
    element.counter[0].textContent = count;
  };

  function resetCheckedClasses(element) {
    var checkedLabels = element.element.getElementsByClassName(element.checkedClass);
    while(checkedLabels[0]) {
      Util.removeClass(checkedLabels[0], element.checkedClass);
    }
  };

  function initCheckedClass(element) {
    for(var i = 0; i < element.checkboxes.length; i++) {
      if(element.checkboxes[i].checked) {
        var label = element.checkboxes[i].closest('label');
        if(label) Util.addClass(label, element.checkedClass);
      }
    }
  };

  //initialize the CustomSelect objects
	var customSelect = document.getElementsByClassName('js-multi-select-v2');
	if( customSelect.length > 0 ) {
		for( var i = 0; i < customSelect.length; i++) {
			(function(i){new MultiCustomSelectTwo(customSelect[i]);})(i);
		}
  }
}());
// File#: _2_sticky-sharebar
// Usage: codyhouse.co/license
(function() {
  var StickyShareBar = function(element) {
    this.element = element;
    this.contentTarget = document.getElementsByClassName('js-sticky-sharebar-target');
    this.contentTargetOut = document.getElementsByClassName('js-sticky-sharebar-target-out');
    this.showClass = 'sticky-sharebar--on-target';
    this.threshold = '50%'; // Share Bar will be revealed when .js-sticky-sharebar-target element reaches 50% of the viewport
    initShareBar(this);
    initTargetOut(this);
  };

  function initShareBar(shareBar) {
    if(shareBar.contentTarget.length < 1) {
      shareBar.showSharebar = true;
      Util.addClass(shareBar.element, shareBar.showClass);
      return;
    }
    if(intersectionObserverSupported) {
      shareBar.showSharebar = false;
      initObserver(shareBar); // update anchor appearance on scroll
    } else {
      Util.addClass(shareBar.element, shareBar.showClass);
    }
  };

  function initObserver(shareBar) { // target of Sharebar
    var observer = new IntersectionObserver(
      function(entries, observer) { 
        shareBar.showSharebar = entries[0].isIntersecting;
        toggleSharebar(shareBar);
      }, 
      {rootMargin: "0px 0px -"+shareBar.threshold+" 0px"}
    );
    observer.observe(shareBar.contentTarget[0]);
  };

  function initTargetOut(shareBar) { // target out of Sharebar
    shareBar.hideSharebar = false;
    if(shareBar.contentTargetOut.length < 1) {
      return;
    }
    var observer = new IntersectionObserver(
      function(entries, observer) { 
        shareBar.hideSharebar = entries[0].isIntersecting;
        toggleSharebar(shareBar);
      }
    );
    observer.observe(shareBar.contentTargetOut[0]);
  };

  function toggleSharebar(shareBar) {
    Util.toggleClass(shareBar.element, shareBar.showClass, shareBar.showSharebar && !shareBar.hideSharebar);
  };

  //initialize the StickyShareBar objects
  var stickyShareBar = document.getElementsByClassName('js-sticky-sharebar'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
  
	if( stickyShareBar.length > 0 ) {
		for( var i = 0; i < stickyShareBar.length; i++) {
			(function(i){ new StickyShareBar(stickyShareBar[i]); })(i);
    }
	}
}());
// File#: _2_table-of-contents
// Usage: codyhouse.co/license
(function() {
  var Toc = function(element) {
		this.element = element;
    this.list = this.element.getElementsByClassName('js-toc__list')[0];
    this.anchors = this.list.querySelectorAll('a[href^="#"]');
    this.sections = getSections(this);
    this.controller = this.element.getElementsByClassName('js-toc__control');
    this.controllerLabel = this.element.getElementsByClassName('js-toc__control-label');
    this.content = getTocContent(this);
    this.clickScrolling = false;
    this.intervalID = false;
    this.staticLayoutClass = 'toc--static';
    this.contentStaticLayoutClass = 'toc-content--toc-static';
    this.expandedClass = 'toc--expanded';
    this.isStatic = Util.hasClass(this.element, this.staticLayoutClass);
    this.layout = 'static';
    initToc(this);
  };

  function getSections(toc) {
    var sections = [];
    // get all content sections
    for(var i = 0; i < toc.anchors.length; i++) {
      var section = document.getElementById(toc.anchors[i].getAttribute('href').replace('#', ''));
      if(section) sections.push(section);
    }
    return sections;
  };

  function getTocContent(toc) {
    if(toc.sections.length < 1) return false;
    var content = toc.sections[0].closest('.js-toc-content');
    return content;
  };

  function initToc(toc) {
    checkTocLayour(toc); // switch between mobile and desktop layout
    if(toc.sections.length > 0) {
      // listen for click on anchors
      toc.list.addEventListener('click', function(event){
        var anchor = event.target.closest('a[href^="#"]');
        if(!anchor) return;
        // reset link apperance 
        toc.clickScrolling = true;
        resetAnchors(toc, anchor);
        // close toc if expanded on mobile
        toggleToc(toc, true);
      });

      // check when a new section enters the viewport
      var intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
      if(intersectionObserverSupported) {
        var observer = new IntersectionObserver(
          function(entries, observer) { 
            entries.forEach(function(entry){
              if(!toc.clickScrolling) { // do not update classes if user clicked on a link
                getVisibleSection(toc);
              }
            });
          }, 
          {
            threshold: [0, 0.1],
            rootMargin: "0px 0px -70% 0px"
          }
        );

        for(var i = 0; i < toc.sections.length; i++) {
          observer.observe(toc.sections[i]);
        }
      }

      // detect the end of scrolling -> reactivate IntersectionObserver on scroll
      toc.element.addEventListener('toc-scroll', function(event){
        toc.clickScrolling = false;
      });
    }

    // custom event emitted when window is resized
    toc.element.addEventListener('toc-resize', function(event){
      checkTocLayour(toc);
    });

    // collapsed version only (mobile)
    initCollapsedVersion(toc);
  };

  function resetAnchors(toc, anchor) {
    if(!anchor) return;
    for(var i = 0; i < toc.anchors.length; i++) Util.removeClass(toc.anchors[i], 'toc__link--selected');
    Util.addClass(anchor, 'toc__link--selected');
  };

  function getVisibleSection(toc) {
    if(toc.intervalID) {
      clearInterval(toc.intervalID);
    }
    toc.intervalID = setTimeout(function(){
      var halfWindowHeight = window.innerHeight/2,
      index = -1;
      for(var i = 0; i < toc.sections.length; i++) {
        var top = toc.sections[i].getBoundingClientRect().top;
        if(top < halfWindowHeight) index = i;
      }
      if(index > -1) {
        resetAnchors(toc, toc.anchors[index]);
      }
      toc.intervalID = false;
    }, 100);
  };

  function checkTocLayour(toc) {
    if(toc.isStatic) return;
    toc.layout = getComputedStyle(toc.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(toc.element, toc.staticLayoutClass, toc.layout == 'static');
    if(toc.content) Util.toggleClass(toc.content, toc.contentStaticLayoutClass, toc.layout == 'static');
  };

  function initCollapsedVersion(toc) { // collapsed version only (mobile)
    if(toc.controller.length < 1) return;
    
    // toggle nav visibility
    toc.controller[0].addEventListener('click', function(event){
      var isOpen = Util.hasClass(toc.element, toc.expandedClass);
      toggleToc(toc, isOpen);
    });

    // close expanded version on esc
    toc.element.addEventListener('keydown', function(event){
      if(toc.layout == 'static') return;
      if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape') ) {
        toggleToc(toc, true);
        toc.controller[0].focus();
      }
    });
  };

  function toggleToc(toc, bool) { // collapsed version only (mobile)
    // toggle mobile version
    Util.toggleClass(toc.element, toc.expandedClass, !bool);
    bool ? toc.controller[0].removeAttribute('aria-expanded') : toc.controller[0].setAttribute('aria-expanded', 'true');
    if(!bool && toc.anchors.length > 0) {
      toc.anchors[0].focus();
    }
  };
  
  var tocs = document.getElementsByClassName('js-toc');

  var tocsArray = [];
	if( tocs.length > 0) {
		for( var i = 0; i < tocs.length; i++) {
			(function(i){ tocsArray.push(new Toc(tocs[i])); })(i);
    }

    // listen to window scroll -> reset clickScrolling property
    var scrollId = false,
      resizeId = false,
      scrollEvent = new CustomEvent('toc-scroll'),
      resizeEvent = new CustomEvent('toc-resize');
      
    window.addEventListener('scroll', function() {
      clearTimeout(scrollId);
      scrollId = setTimeout(doneScrolling, 100);
    });

    window.addEventListener('resize', function() {
      clearTimeout(resizeId);
      scrollId = setTimeout(doneResizing, 100);
    });

    function doneScrolling() {
      for( var i = 0; i < tocsArray.length; i++) {
        (function(i){tocsArray[i].element.dispatchEvent(scrollEvent)})(i);
      };
    };

    function doneResizing() {
      for( var i = 0; i < tocsArray.length; i++) {
        (function(i){tocsArray[i].element.dispatchEvent(resizeEvent)})(i);
      };
    };
  }
}());
// File#: _3_light-dark-switch
// Usage: codyhouse.co/license
(function() {
  var LdSwitch = function(element) {
    this.element = element;
    this.icons = this.element.getElementsByClassName('js-ld-switch-icon');
    this.selectedIcon = 0;
    this.isSystem = false;
    // icon animation classes
    this.iconClassIn = 'ld-switch-btn__icon-wrapper--in';
    this.iconClassOut = 'ld-switch-btn__icon-wrapper--out';
    // mediaQueryList
    this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    this.eventBind = false;
    saveThemeLabels(this);
    initLdSwitch(this);
  };

  function saveThemeLabels(switchOb) {
    switchOb.themes = ['default', 'dark', 'system'];
    switchOb.options = switchOb.element.querySelectorAll('option');

    var lightTheme = switchOb.options[0].getAttribute('data-option-theme'),
      darkTheme = switchOb.options[1].getAttribute('data-option-theme');
    if(lightTheme) switchOb.themes[0] = lightTheme;
    if(darkTheme) switchOb.themes[1] = darkTheme;
  };

  function initLdSwitch(switchOb) {
    // set initail state
    setStartIcon(switchOb);

    // detect change in the selected theme
    switchOb.element.addEventListener('change', function(event){
      setTheme(switchOb, event.target.value);
    });
  };

  function setStartIcon(switchOb) {
    var selectedOptionIndex = switchOb.element.querySelector('select').selectedIndex;
    if(selectedOptionIndex === 0) return;
    setTheme(switchOb, selectedOptionIndex, true);
  };

  function setTheme(switchOb, value, init) {
    var theme = switchOb.themes[0],
      iconIndex = value;

    // update local storage
    localStorage.setItem('ldSwitch', switchOb.themes[value]);

    // get theme value and icon index
    if(value == 1) {
      theme = switchOb.themes[1];
    } else if(value == 2) {
      // user selected system -> check if we should show light or dark theme
      var isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if(isDarkTheme) {
        iconIndex = 3;
        theme = switchOb.themes[1];
      }
    }

    // update theme value
    updateThemeValue(theme);

    // update visible icon
    updateIcon(switchOb, iconIndex, switchOb.selectedIcon, init);

    // check if we need to add/remove matchMedia events
    setMatchMediaEvents(switchOb, value == 2, switchOb.isSystem);
    switchOb.isSystem = value == 2 ? true : false;
  };

  function updateIcon(switchOb, newIcon, oldIcon, init) {
    if(init) { // we are only setting the initial status of the switcher
      Util.removeClass(switchOb.icons[oldIcon], switchOb.iconClassIn);
      Util.addClass(switchOb.icons[newIcon], switchOb.iconClassIn);
      switchOb.selectedIcon = newIcon;
      return;
    }
    Util.removeClass(switchOb.icons[oldIcon], switchOb.iconClassIn);
    Util.addClass(switchOb.icons[oldIcon], switchOb.iconClassOut);

    Util.addClass(switchOb.icons[newIcon], switchOb.iconClassIn);

    switchOb.icons[newIcon].addEventListener('transitionend', function cb(){
      Util.removeClass(switchOb.icons[oldIcon], switchOb.iconClassOut);
      switchOb.icons[newIcon].removeEventListener('transitionend', cb);
      switchOb.selectedIcon = newIcon;
    });
  };

  function updateThemeValue(theme) {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', theme);
  };

  function setMatchMediaEvents(switchOb, addEvent, removeEvent) {
    if(addEvent) {
      switchOb.eventBind = systemUpdated.bind(switchOb);
      switchOb.mediaQueryList.addEventListener("change", switchOb.eventBind);
    } else if(removeEvent) switchOb.mediaQueryList.removeEventListener("change", switchOb.eventBind);
  };

  function systemUpdated() {
    var isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = isDarkTheme ? this.themes[1] : this.themes[0],
      newIndex = isDarkTheme ? 3 : 2,
      oldIcon = isDarkTheme ? 2 : 3;
    updateIcon(this, newIndex, oldIcon);
    updateThemeValue(theme);
  };

  window.LdSwitch = LdSwitch;
  var ldSwitches = document.getElementsByClassName('js-ld-switch');
  if( ldSwitches.length > 0 ) {
    for( var i = 0; i < ldSwitches.length; i++) {
      new LdSwitch(ldSwitches[i]);
    }
  }
}());