(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

/*!
 * @summary: Part of the Fannie Mae - Bluprint Design System
 * @description: Use symbols and def in svg files.
 * @link:https://bitbucket:8443/scm/flk/cxd-ds-framekit.git
 * @file: svg-pollyfill-4E.js.js
 * @author: Heath Shults
 * @version: v1.4.0
 * @since: 1.0.0
 * @copyright: Copyright (c) 2018 Fannie Mae, Inc.
 * @license: MIT
 */
function embed(parent, svg, target) {
  // if the target exists
  if (target) {
    // create a document fragment to hold the contents of the target
    var fragment = document.createDocumentFragment(); // cache the closest matching viewBox

    var viewBox = !svg.hasAttribute('viewBox') && target.getAttribute('viewBox'); // conditionally set the viewBox on the svg

    if (viewBox) {
      svg.setAttribute('viewBox', viewBox);
    } // clone the target


    var clone = target.cloneNode(true); // copy the contents of the clone into the fragment

    while (clone.childNodes.length) {
      fragment.appendChild(clone.firstChild);
    } // append the fragment into the svg


    parent.appendChild(fragment);
  }
}

function loadreadystatechange(xhr) {
  // listen to changes in the request
  xhr.onreadystatechange = function () {
    // if the request is ready
    if (xhr.readyState === 4) {
      // get the cached html document
      var cachedDocument = xhr._cachedDocument; // ensure the cached html document based on the xhr response

      if (!cachedDocument) {
        cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument('');
        cachedDocument.body.innerHTML = xhr.responseText; // ensure domains are the same, otherwise we'll have issues appending the
        // element in IE 11

        cachedDocument.domain = document.domain;
        xhr._cachedTarget = {};
      } // clear the xhr embeds list and embed each item


      xhr._embeds.splice(0).map(function (item) {
        // get the cached target
        var target = xhr._cachedTarget[item.id]; // ensure the cached target

        if (!target) {
          target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id);
        } // embed the target into the svg


        embed(item.parent, item.svg, target);
      });
    }
  }; // test the ready state change immediately


  xhr.onreadystatechange();
}

function svg4everybody(rawopts) {
  var opts = Object(rawopts); // create legacy support variables

  var nosvg;
  var fallback; // if running with legacy support

  if (LEGACY_SUPPORT) {
    // configure the fallback method
    fallback = opts.fallback || function (src) {
      return src.replace(/\?[^#]+/, '').replace('#', '.').replace(/^\./, '') + '.png' + (/\?[^#]+/.exec(src) || [''])[0];
    }; // set whether to shiv <svg> and <use> elements and use image fallbacks


    nosvg = 'nosvg' in opts ? opts.nosvg : /\bMSIE [1-8]\b/.test(navigator.userAgent); // conditionally shiv <svg> and <use>

    if (nosvg) {
      document.createElement('svg');
      document.createElement('use');
    }
  } // set whether the polyfill will be activated or not


  var polyfill;
  var olderIEUA = /\bMSIE [1-8]\.0\b/;
  var newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/;
  var webkitUA = /\bAppleWebKit\/(\d+)\b/;
  var olderEdgeUA = /\bEdge\/12\.(\d+)\b/;
  var edgeUA = /\bEdge\/.(\d+)\b/; // Checks whether iframed

  var inIframe = window.top !== window.self;

  if ('polyfill' in opts) {
    polyfill = opts.polyfill;
  } else if (LEGACY_SUPPORT) {
    polyfill = olderIEUA.test(navigator.userAgent) || newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
  } else {
    polyfill = newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
  } // create xhr requests object


  var requests = {}; // use request animation frame or a timeout to search the dom for svgs

  var requestAnimationFrame = window.requestAnimationFrame || setTimeout; // get a live collection of use elements on the page

  var uses = document.getElementsByTagName('use');
  var numberOfSvgUseElementsToBypass = 0;

  function oninterval() {
    // get the cached <use> index
    var index = 0; // while the index exists in the live <use> collection

    while (index < uses.length) {
      // get the current <use>
      var use = uses[index]; // get the current <svg>

      var parent = use.parentNode;
      var svg = getSVGAncestor(parent);
      var src = use.getAttribute('xlink:href') || use.getAttribute('href');

      if (!src && opts.attributeName) {
        src = use.getAttribute(opts.attributeName);
      }

      if (svg && src) {
        // if running with legacy support
        if (LEGACY_SUPPORT && nosvg) {
          // create a new fallback image
          var img = document.createElement('img'); // force display in older IE

          img.style.cssText = 'display:inline-block;height:100%;width:100%'; // set the fallback size using the svg size

          img.setAttribute('width', svg.getAttribute('width') || svg.clientWidth);
          img.setAttribute('height', svg.getAttribute('height') || svg.clientHeight); // set the fallback src

          img.src = fallback(src, svg, use); // replace the <use> with the fallback image

          parent.replaceChild(img, use);
        } else if (polyfill) {
          if (!opts.validate || opts.validate(src, svg, use)) {
            // remove the <use> element
            parent.removeChild(use); // parse the src and get the url and id

            var srcSplit = src.split('#');
            var url = srcSplit.shift();
            var id = srcSplit.join('#'); // if the link is external

            if (url.length) {
              // get the cached xhr request
              var xhr = requests[url]; // ensure the xhr request exists

              if (!xhr) {
                xhr = requests[url] = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.send();
                xhr._embeds = [];
              } // add the svg and id as an item to the xhr embeds list


              xhr._embeds.push({
                parent: parent,
                svg: svg,
                id: id
              }); // prepare the xhr ready state change event


              loadreadystatechange(xhr);
            } else {
              // embed the local id into the svg
              embed(parent, svg, document.getElementById(id));
            }
          } else {
            // increase the index when the previous value was not "valid"
            ++index;
            ++numberOfSvgUseElementsToBypass;
          }
        }
      } else {
        // increase the index when the previous value was not "valid"
        ++index;
      }
    } // continue the interval


    if (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) {
      requestAnimationFrame(oninterval, 67);
    }
  } // conditionally start the interval if the polyfill is active


  if (polyfill) {
    oninterval();
  }
}

function getSVGAncestor(node) {
  var svg = node;

  while (svg.nodeName.toLowerCase() !== 'svg') {
    svg = svg.parentNode;

    if (!svg) {
      break;
    }
  }

  return svg;
}

},{}],2:[function(require,module,exports){
"use strict";

/*!
 * @summary Part of the Fannie Mae - Bluprint Design System
 * @description Use symbols and def in svg files.
 *
 * @author Heath Shults
 * @version v1.4.0
 * @since 1.0.0
 *
 * @link https://bitbucket:8443/scm/flk/cxd-ds-ucons.git
 * @file svg-use-symdef.js
 *
 * @copyright Copyright (c) 2018 Fannie Mae, Inc.
 * @license MIT
 */
(function () {
  'use strict';

  if (typeof window !== 'undefined' && window.addEventListener) {
    var cache = Object.create(null); // holds xhr objects to prevent multiple requests

    var checkUseElems;
    var tid; // timeout id

    var debouncedCheck = function debouncedCheck() {
      clearTimeout(tid);
      tid = setTimeout(checkUseElems, 100);
    };

    var unobserveChanges = function unobserveChanges() {
      return;
    };

    var observeChanges = function observeChanges() {
      var observer;
      window.addEventListener('resize', debouncedCheck, false);
      window.addEventListener('orientationchange', debouncedCheck, false);

      if (window.MutationObserver) {
        observer = new MutationObserver(debouncedCheck);
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
          attributes: true
        });

        unobserveChanges = function unobserveChanges() {
          try {
            observer.disconnect();
            window.removeEventListener('resize', debouncedCheck, false);
            window.removeEventListener('orientationchange', debouncedCheck, false);
          } catch (ignore) {}
        };
      } else {
        document.documentElement.addEventListener('DOMSubtreeModified', debouncedCheck, false);

        unobserveChanges = function unobserveChanges() {
          document.documentElement.removeEventListener('DOMSubtreeModified', debouncedCheck, false);
          window.removeEventListener('resize', debouncedCheck, false);
          window.removeEventListener('orientationchange', debouncedCheck, false);
        };
      }
    };

    var createRequest = function createRequest(url) {
      // In IE 9, cross origin requests can only be sent using XDomainRequest.
      // XDomainRequest would fail if CORS headers are not set.
      // Therefore, XDomainRequest should only be used with cross origin requests.
      function getOrigin(loc) {
        var a;

        if (loc.protocol !== undefined) {
          a = loc;
        } else {
          a = document.createElement('a');
          a.href = loc;
        }

        return a.protocol.replace(/:/g, '') + a.host;
      }

      var Request;
      var origin;
      var origin2;

      if (window.XMLHttpRequest) {
        Request = new XMLHttpRequest();
        origin = getOrigin(location);
        origin2 = getOrigin(url);

        if (Request.withCredentials === undefined && origin2 !== '' && origin2 !== origin) {
          Request = XDomainRequest || undefined;
        } else {
          Request = XMLHttpRequest;
        }
      }

      return Request;
    };

    var xlinkNS = 'http://www.w3.org/1999/xlink';

    checkUseElems = function checkUseElems() {
      var base;
      var bcr;
      var fallback = ''; // optional fallback URL in case no base path to SVG file was given and no symbol definition was found.

      var hash;
      var href;
      var i;
      var inProgressCount = 0;
      var isHidden;
      var Request;
      var url;
      var uses;
      var xhr;

      function observeIfDone() {
        // If done with making changes, start watching for chagnes in DOM again
        inProgressCount -= 1;

        if (inProgressCount === 0) {
          // if all xhrs were resolved
          unobserveChanges(); // make sure to remove old handlers

          observeChanges(); // watch for changes to DOM
        }
      }

      function attrUpdateFunc(spec) {
        return function () {
          if (cache[spec.base] !== true) {
            spec.useEl.setAttributeNS(xlinkNS, 'xlink:href', '#' + spec.hash);

            if (spec.useEl.hasAttribute('href')) {
              spec.useEl.setAttribute('href', '#' + spec.hash);
            }
          }
        };
      }

      function onloadFunc(xhr) {
        return function () {
          var body = document.body;
          var x = document.createElement('x');
          var svg;
          xhr.onload = null;
          x.innerHTML = xhr.responseText;
          svg = x.getElementsByTagName('svg')[0];

          if (svg) {
            svg.setAttribute('aria-hidden', 'true');
            svg.style.position = 'absolute';
            svg.style.width = 0;
            svg.style.height = 0;
            svg.style.overflow = 'hidden';
            body.insertBefore(svg, body.firstChild);
          }

          observeIfDone();
        };
      }

      function onErrorTimeout(xhr) {
        return function () {
          xhr.onerror = null;
          xhr.ontimeout = null;
          observeIfDone();
        };
      }

      unobserveChanges(); // stop watching for changes to DOM
      // find all use elements

      uses = document.getElementsByTagName('use');

      for (i = 0; i < uses.length; i += 1) {
        try {
          bcr = uses[i].getBoundingClientRect();
        } catch (ignore) {
          // failed to get bounding rectangle of the use element
          bcr = false;
        }

        href = uses[i].getAttribute('href') || uses[i].getAttributeNS(xlinkNS, 'href') || uses[i].getAttribute('xlink:href');

        if (href && href.split) {
          url = href.split('#');
        } else {
          url = ['', ''];
        }

        base = url[0];
        hash = url[1];
        isHidden = bcr && bcr.left === 0 && bcr.right === 0 && bcr.top === 0 && bcr.bottom === 0;

        if (bcr && bcr.width === 0 && bcr.height === 0 && !isHidden) {
          // the use element is empty
          // if there is a reference to an external SVG, try to fetch it
          // use the optional fallback URL if there is no reference to an external SVG
          if (fallback && !base.length && hash && !document.getElementById(hash)) {
            base = fallback;
          }

          if (uses[i].hasAttribute('href')) {
            uses[i].setAttributeNS(xlinkNS, 'xlink:href', href);
          }

          if (base.length) {
            // schedule updating xlink:href
            xhr = cache[base];

            if (xhr !== true) {
              // true signifies that prepending the SVG was not required
              setTimeout(attrUpdateFunc({
                useEl: uses[i],
                base: base,
                hash: hash
              }), 0);
            }

            if (xhr === undefined) {
              Request = createRequest(base);

              if (Request !== undefined) {
                xhr = new Request();
                cache[base] = xhr;
                xhr.onload = onloadFunc(xhr);
                xhr.onerror = onErrorTimeout(xhr);
                xhr.ontimeout = onErrorTimeout(xhr);
                xhr.open('GET', base);
                xhr.send();
                inProgressCount += 1;
              }
            }
          }
        } else {
          if (!isHidden) {
            if (cache[base] === undefined) {
              // remember this URL if the use element was not empty and no request was sent
              cache[base] = true;
            } else if (cache[base].onload) {
              // if it turns out that prepending the SVG is not necessary,
              // abort the in-progress xhr.
              cache[base].abort();
              delete cache[base].onload;
              cache[base] = true;
            }
          } else if (base.length && cache[base]) {
            setTimeout(attrUpdateFunc({
              useEl: uses[i],
              base: base,
              hash: hash
            }), 0);
          }
        }
      }

      uses = '';
      inProgressCount += 1;
      observeIfDone();
    };

    var _winLoad;

    _winLoad = function winLoad() {
      window.removeEventListener('load', _winLoad, false); // to prevent memory leaks

      tid = setTimeout(checkUseElems, 0);
    };

    if (document.readyState !== 'complete') {
      // The load event fires when all resources have finished loading, which allows detecting whether SVG use elements are empty.
      window.addEventListener('load', _winLoad, false);
    } else {
      // No need to add a listener if the document is already loaded, initialize immediately.
      _winLoad();
    }
  }
})();

},{}],3:[function(require,module,exports){
"use strict";

/*!
 * c-accordion.js v1.0.0 - Adds functionality to your accordion in your web app.
 * https://bitbucket:8443/scm/flk/cxd-ds-framekit.git
 * Copyright (c) 2018 Fannie Mae, Inc.
 * @license MIT
 *
 * Accordion($: JQueryStatic): {
 *    el: any;
 *    multiple: any;
 *    dropdown: (e: any) => void;
 *  }
 *
 */
$(function () {
  var Accordion = function Accordion(el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false; // private vars

    var links = this.el.find('.js-acc-control'); // Events

    links.on('click', {
      el: this.el,
      multiple: this.multiple
    }, this.dropdown);
  };

  Accordion.prototype.dropdown = function (e) {
    var $el = e.data.el,
        $this = $(this),
        $next = $this.next();
    $next.slideToggle();
    $this.parent().toggleClass('is-open');

    if (!e.data.multiple) {
      $el.find('.js-ddpanel').not($next).slideUp().parent().removeClass('is-open');
    }
  };

  var accordion = new Accordion($('#accordion'), false);
});

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SidebarNavigate = function ($) {
  var NAME = 'sidebar-nav';
  var VERSION = '1.0.0';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var DATA_KEY = 'sidebar_nav';
  var EVENT_KEY = ".".concat(DATA_KEY);
  var Event = {
    HIDE: "hide".concat(EVENT_KEY),
    HIDDEN: "hidden".concat(EVENT_KEY),
    SHOW: "show".concat(EVENT_KEY),
    SHOWN: "shown".concat(EVENT_KEY),
    CLICK: "click".concat(EVENT_KEY)
  };
  var options = {
    MENU_TITLE: 'The Design System',
    MENU_TOGGLER: '.js-tgl',
    SUBMENU_OPEN: 'is-active',
    SUBMENU_ALL: '.js-tgl, .fk-sidebar-nav-submenu',
    TARGET_ATTR: 'data-target',
    LAUNCH_BUTTON: '#nauticalCompass',
    OFF_CANVAS: true,
    SIDEBAR_VISIBLE: '.is-active'
  };

  var SidebarNavigate =
  /*#__PURE__*/
  function () {
    function SidebarNavigate(element, config) {
      _classCallCheck(this, SidebarNavigate);

      this._element = element;
      this._config = this._getConfig(options);
      this._menu = this._getMenuElement();

      this._addEventListeners();
    }

    _createClass(SidebarNavigate, [{
      key: "_toggle",
      value: function _toggle() {
        if (this._element.disabled || $(this._element).hasClass(options.SUBMENU_OPEN)) {
          return;
        }
      }
    }, {
      key: "_addEventListeners",
      value: function _addEventListeners() {
        $(this._element).on(Event.CLICK, function (event) {
          event.preventDefault();
          event.stopPropagation();
        });
      }
    }], [{
      key: "_jQueryInterface",
      value: function _jQueryInterface(config) {
        return this.each(function () {
          var data = $(this).data(DATA_KEY);

          var _config = _typeof(config) === 'object' ? config : null;

          if (!data) {
            data = new SidebarNavigate(this, _config);
            $(this).data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError("No method named \"".concat(config, "\""));
            }

            data[config]();
          }
        });
      }
    }, {
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return SidebarNavigate;
  }();

  $(options.SUBMENU_ALL).removeClass(options.SUBMENU_OPEN);
  $(options.MENU_TOGGLER).click(function (cb) {
    var $this = $(this);
    var target_el = $this.attr(options.TARGET_ATTR);

    if ($this.hasClass(options.SUBMENU_OPEN)) {
      $this.removeClass(options.SUBMENU_OPEN);
      $(target_el).removeClass(options.SUBMENU_OPEN);
    } else {
      $this.addClass(options.SUBMENU_OPEN);
      $(target_el).addClass(options.SUBMENU_OPEN), cb;
    }
  });
  $.fn[NAME] = SidebarNavigate._jQueryInterface;
  $.fn[NAME].Constructor = SidebarNavigate;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return SidebarNavigate._jQueryInterface;
  };
}($);

var _default = SidebarNavigate;
exports.default = _default;

},{}],5:[function(require,module,exports){
"use strict";

/*!
 * fk-tabs.js v1.0.0 - Adds functionality to your tab components in your web app.
 * https://bitbucket:8443/scm/flk/cxd-ds-framekit.git
 * Copyright (c) 2018 Fannie Mae, Inc.
 * @license MIT
 */
$(document).ready(function () {
  $('[id^=tab]').click(function () {
    var target = $(this).attr('data-target');

    if ($(this).hasClass('is-active')) {
      return;
    } else {
      $('.fk-tabs__label,.fk-tabs__content').removeClass('is-active');
      $(this).addClass('is-active');
      $("#".concat(target)).addClass('is-active');
    }
  });
});

},{}],6:[function(require,module,exports){
"use strict";

/*!
 * @summary Part of the Fannie Mae - Bluprint Design System
 * @description Use this file to inject svg icons into the DOM.
 *
 * @author Heath Shults
 * @version v1.4.1
 * @since 1.0.0
 *
 * @link https://bitbucket:8443/scm/flk/cxd-ds-framekit.git
 * @file ucon-inject.js
 *
 * @copyright Copyright (c) 2018 Fannie Mae, Inc.
 * @license MIT
 */
var UconInjector = function (window, document) {
  var NAME = 'UconInjector.js';
  var VERSION = '1.4.1';
  /* global options */

  var options = {
    iconCSSClassName: 'ucon',
    iconCSSClassPrefix: 'c-',
    iconDOMElement: 'i',
    injAttr: 'name',
    altSVGPath: '/assets/img/ucons/svg',
    fallbackSVGPath: '/assets/img/ucons/png',
    UconGallery: false,
    UconGalleryElement: 'div',
    UconGalleryID: 'list',
    consoleMessages: true
  };
  var svgTag = null,
      iconDOMElement = options.iconDOMElement,
      iconCSSClassPrefix = options.iconCSSClassPrefix,
      iconCSSClassName = options.iconCSSClassName,
      injAttr = options.injAttr,
      arrObjSVGData = null,
      svgId = null,
      svgIndex = null,
      svgTagStatus = null,
      docEls = null,
      theUcons = null,
      uconsObjArray = null,
      el = null,
      newEl = null,
      attyVal = null,
      injectCounter = [],
      list = null,
      divi = null,
      item = null,
      gallerySVG = [],
      idRegex = null,
      svgName = null,
      totalInjectableEls = null,
      successfulInjects = null,
      injectCount = 0,
      showGallery = options.UconGallery,
      initGallery = options.UconGallery; // docEls = [].slice.call(document.querySelectorAll(iconDOMElement+'.'+iconCSSClassPrefix+iconCSSClassName))

  docEls = [].slice.call(document.querySelectorAll(iconDOMElement + '[' + injAttr + ']'));
  theUcons = {
    'icons': [{
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'zoom-out',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.414 18.586l-4.527-4.527A7.95 7.95 0 0 0 18 10a7.945 7.945 0 0 0-2.344-5.656C14.146 2.832 12.137 2 10 2s-4.146.832-5.656 2.344C2.833 5.854 2 7.863 2 10s.833 4.146 2.344 5.656A7.945 7.945 0 0 0 10 18a7.95 7.95 0 0 0 4.059-1.113l4.527 4.526c.377.379.88.587 1.414.587s1.037-.208 1.414-.586c.378-.378.586-.879.586-1.414 0-.534-.208-1.036-.586-1.414zM14 11H6V9h8v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'zoom-in',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.414 18.585l-4.527-4.527A7.946 7.946 0 0 0 18 10a7.949 7.949 0 0 0-2.344-5.657C14.146 2.831 12.137 2 10 2s-4.146.831-5.656 2.343C2.833 5.854 2 7.863 2 10s.833 4.145 2.344 5.655A7.937 7.937 0 0 0 10 18a7.95 7.95 0 0 0 4.059-1.114l4.527 4.526c.377.379.88.588 1.414.588s1.037-.209 1.414-.586c.378-.379.586-.879.586-1.414s-.208-1.037-.586-1.415zM14 11h-3v3H9v-3H6V9h3V6h2v3h3v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'zoom-area-out',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6.163 13.608A7.503 7.503 0 0 1 17.836 7.37V3.603a1.67 1.67 0 0 0-1.668-1.668H3.661a1.67 1.67 0 0 0-1.668 1.668V16.11a1.67 1.67 0 0 0 1.668 1.668h3.767a7.465 7.465 0 0 1-1.266-4.169z"></path><path d="M11.166 12.775h5.003v1.668h-5.003v-1.668z"></path><path d="M22.036 20.237l-3.468-3.468c.59-.911.936-1.995.936-3.16 0-3.219-2.618-5.837-5.837-5.837S7.83 10.39 7.83 13.609s2.618 5.837 5.837 5.837c1.149 0 2.22-.339 3.123-.916l3.475 3.476 1.769-1.769zM9.499 13.608c0-2.299 1.87-4.169 4.169-4.169s4.169 1.87 4.169 4.169c0 2.298-1.87 4.169-4.169 4.169s-4.169-1.87-4.169-4.169z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'zoom-area-in',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6.133 13.668A7.503 7.503 0 0 1 17.806 7.43V3.663a1.67 1.67 0 0 0-1.668-1.668H3.631a1.67 1.67 0 0 0-1.668 1.668V16.17a1.67 1.67 0 0 0 1.668 1.668h3.767a7.468 7.468 0 0 1-1.266-4.169z"></path><path d="M14.471 11.166h-1.668v1.668h-1.668v1.668h1.668v1.668h1.668v-1.668h1.668v-1.668h-1.668z"></path><path d="M22.006 20.296l-3.468-3.468c.59-.911.937-1.996.937-3.16 0-3.219-2.618-5.837-5.837-5.837s-5.837 2.618-5.837 5.837 2.618 5.837 5.837 5.837c1.149 0 2.22-.339 3.123-.916l3.475 3.475 1.769-1.768zM9.469 13.668c0-2.299 1.87-4.169 4.169-4.169s4.169 1.87 4.169 4.169c0 2.298-1.87 4.169-4.169 4.169s-4.169-1.871-4.169-4.169z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'views-cards',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2.547 5h5v6h-5V5z"></path><path d="M2.547 12.969h5v6h-5v-6z"></path><path d="M9.5 12.969h5v6h-5v-6z"></path><path d="M16.469 12.969h5v6h-5v-6z"></path><path d="M9.5 5h5v6h-5V5z"></path><path d="M16.469 5h5v6h-5V5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'view-thumbnails',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M10.031 4.016h4V8h-4V4.016z"></path><path d="M10.031 15.969h4v3.984h-4v-3.984z"></path><path d="M10.031 9.984h4v4.031h-4V9.984z"></path><path d="M16.031 4.047h4v3.984h-4V4.047z"></path><path d="M16.031 16h4v3.984h-4V16z"></path><path d="M16.031 10.016h4v4.031h-4v-4.031z"></path><path d="M4.016 4.016h4.031V8H4.016V4.016z"></path><path d="M4.016 15.969h4.031v3.984H4.016v-3.984z"></path><path d="M4.016 9.984h4.031v4.031H4.016V9.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'view-list',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9 4.016h12V8H9V4.016z"></path><path d="M9 15.969h12v3.984H9v-3.984z"></path><path d="M9 9.984h12v4.031H9V9.984z"></path><path d="M2.984 4.016h4.031V8H2.984V4.016z"></path><path d="M2.984 15.969h4.031v3.984H2.984v-3.984z"></path><path d="M2.984 9.984h4.031v4.031H2.984V9.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'view-list-alt',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2.969 4.016H21V8H2.969V4.016z"></path><path d="M2.937 15.969H21v3.984H2.937v-3.984z"></path><path d="M2.937 9.984H21v4.031H2.937V9.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'view-columns',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M1.969 4.969H7v14H1.969v-14z"></path><path d="M9.453 4.969h5.031v14H9.453v-14z"></path><path d="M16.938 4.969h5.031v14h-5.031v-14z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'vertical-align-top',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3.984 3h16.031v2.016H3.984V3zm4.032 8.016L12 6.985l3.984 4.031h-3V21h-1.969v-9.984h-3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'vertical-align-center',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M4.712 11.105h14.576v1.79H4.712v-1.79zM15.623 5.65L12 9.273 8.377 5.65h2.728V1.985h1.79V5.65h2.728zm-7.246 12.7L12 14.727l3.623 3.623h-2.728v3.665h-1.79V18.35H8.377z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'vertical-align-bottom',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3.984 18.984h16.031V21H3.984v-2.016zm12-6L12 17.015l-3.984-4.031h3V3h1.969v9.984h3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'users',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.922 13.094c1.681 0 3.047-1.366 3.047-3.047S17.603 7 15.922 7s-3.047 1.366-3.047 3.047 1.366 3.047 3.047 3.047z"></path><path d="M8.984 11.078c1.681 0 3.047-1.366 3.047-3.047s-1.366-3.047-3.047-3.047S5.937 6.35 5.937 8.031s1.366 3.047 3.047 3.047z"></path><path d="M15.922 13.606c-3.588 0-6.094 1.878-6.094 4.569v.762h12.188v-.762c0-2.691-2.506-4.569-6.094-4.569z"></path><path d="M7.891 18.175c0-.978.225-1.903.669-2.75a6.243 6.243 0 0 1 1.806-2.094c.166-.125.338-.241.519-.353a10.572 10.572 0 0 0-1.9-.166c-4.122 0-7 2.159-7 5.25v.875h5.906v-.762z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4z"></path><path d="M12 13c-4.71 0-8 2.467-8 6v1h16v-1c0-3.533-3.29-6-8-6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-timeout',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M8.666 15.334C10.505 15.334 12 13.839 12 12s-1.495-3.334-3.334-3.334S5.332 10.161 5.332 12s1.495 3.334 3.334 3.334z"></path><path d="M8.666 16.167c-3.925 0-6.668 2.056-6.668 5.001v.833h13.335v-.833c0-2.945-2.742-5.001-6.668-5.001z"></path><path d="M17.001 1.985C14.243 1.985 12 4.229 12 6.986s2.243 5.001 5.001 5.001 5.001-2.244 5.001-5.001-2.243-5.001-5.001-5.001zm2.5 5.834h-3.334V3.652h1.667v2.5h1.667v1.667z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-subtract',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.647 12.471c2.076 0 3.765-1.688 3.765-3.765s-1.688-3.765-3.765-3.765-3.765 1.688-3.765 3.765a3.769 3.769 0 0 0 3.765 3.765z"></path><path d="M9.647 13.412c-4.433 0-7.529 2.322-7.529 5.647V20h15.059v-.941c0-3.325-3.096-5.647-7.529-5.647z"></path><path d="M16.235 4h5.647v1.882h-5.647V4z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-square',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6 17.016V18h12v-.984c0-2.016-3.984-3.094-6-3.094S6 15 6 17.016zM15 9c0-1.641-1.359-3-3-3S9 7.359 9 9s1.359 3 3 3 3-1.359 3-3zM3 5.016C3 3.938 3.891 3 5.016 3h13.969c1.078 0 2.016.938 2.016 2.016v13.969c0 1.078-.938 2.016-2.016 2.016H5.016C3.891 21.001 3 20.063 3 18.985V5.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-search',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.512 11.167l-2.706-2.706a4.133 4.133 0 0 0 .694-2.294C19.5 3.869 17.631 2 15.333 2s-4.167 1.869-4.167 4.167 1.869 4.167 4.167 4.167c.848 0 1.636-.258 2.294-.694l2.706 2.706 1.178-1.178zm-8.679-5c0-1.378 1.122-2.5 2.5-2.5s2.5 1.122 2.5 2.5-1.122 2.5-2.5 2.5-2.5-1.122-2.5-2.5z"></path><path d="M8.667 15.333C10.505 15.333 12 13.838 12 12s-1.495-3.333-3.333-3.333S5.334 10.163 5.334 12a3.337 3.337 0 0 0 3.333 3.333z"></path><path d="M8.667 16.167c-3.925 0-6.667 2.057-6.667 5V22h13.333v-.833c0-2.943-2.742-5-6.667-5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-refresh',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M8.666 16.167c-3.925 0-6.667 2.056-6.667 5V22h13.333v-.833c0-2.944-2.742-5-6.667-5z"></path><path d="M8.837 8.684c-.058-.003-.113-.018-.171-.018-1.838 0-3.333 1.495-3.333 3.333s1.495 3.333 3.333 3.333a3.328 3.328 0 0 0 3.009-1.924 8.317 8.317 0 0 1-2.838-4.725z"></path><path d="M17 10.333c-.897 0-1.72-.367-2.343-.991l1.509-1.509h-4.167V12l1.47-1.47a5.024 5.024 0 0 0 3.53 1.47c2.757 0 5-2.242 5-5h-1.667a3.337 3.337 0 0 1-3.333 3.333z"></path><path d="M20.532 3.468A4.945 4.945 0 0 0 17 2.001c-2.757 0-5 2.242-5 5h1.667A3.337 3.337 0 0 1 17 3.668c.898 0 1.721.367 2.343.99l-1.51 1.51H22V2.001l-1.467 1.467z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-lock',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.167 5.333C21.167 3.495 19.672 2 17.834 2s-3.333 1.495-3.333 3.333a.832.832 0 0 0-.833.833v5.833c0 .461.372.833.833.833h6.667a.832.832 0 0 0 .833-.833V6.166a.832.832 0 0 0-.833-.833zm-3.334-1.666A1.67 1.67 0 0 1 19.5 5.334h-3.333a1.67 1.67 0 0 1 1.667-1.667zm2.5 7.5h-5V7h5v4.167z"></path><path d="M18.667 8.667a.833.833 0 1 1-1.666 0 .833.833 0 0 1 1.666 0z"></path><path d="M8.667 15.333C10.505 15.333 12 13.838 12 12s-1.495-3.333-3.333-3.333S5.334 10.163 5.334 12a3.337 3.337 0 0 0 3.333 3.333z"></path><path d="M8.667 16.167c-3.925 0-6.667 2.057-6.667 5V22h13.333v-.833c0-2.943-2.742-5-6.667-5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-close',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M10.06 14.013c1.886 0 3.42-1.534 3.42-3.42s-1.534-3.42-3.42-3.42-3.42 1.534-3.42 3.42a3.424 3.424 0 0 0 3.42 3.42z"></path><path d="M10.06 14.868c-4.028 0-6.841 2.11-6.841 5.131v.855h13.682v-.855c0-3.021-2.813-5.131-6.841-5.131z"></path><path d="M21.781 4.356l-1.209-1.209-1.961 1.961-1.961-1.961-1.209 1.209 1.961 1.961-1.961 1.961 1.209 1.209 1.961-1.961 1.961 1.961 1.209-1.209-1.961-1.961z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-circle',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 19.219c2.484 0 4.688-1.313 6-3.234-.047-1.969-4.031-3.094-6-3.094-2.016 0-5.953 1.125-6 3.094 1.313 1.922 3.516 3.234 6 3.234zm0-14.203c-1.641 0-3 1.359-3 3s1.359 3 3 3 3-1.359 3-3-1.359-3-3-3zm0-3c5.531 0 9.984 4.453 9.984 9.984S17.531 21.984 12 21.984 2.016 17.531 2.016 12 6.469 2.016 12 2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-check',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.005 13.209c1.97 0 3.572-1.602 3.572-3.572s-1.602-3.572-3.572-3.572-3.572 1.603-3.572 3.572a3.576 3.576 0 0 0 3.572 3.572z"></path><path d="M9.005 14.102c-4.206 0-7.145 2.204-7.145 5.359v.893h14.289v-.893c0-3.154-2.938-5.359-7.145-5.359z"></path><path d="M17.043 10.006l-3.311-3.311 1.263-1.263 2.048 2.048 3.834-3.834 1.263 1.263z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-block',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17 2c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.242 5-5c0-2.757-2.242-5-5-5zm0 1.667c.616 0 1.188.18 1.683.472l-4.545 4.545a3.309 3.309 0 0 1-.472-1.683 3.337 3.337 0 0 1 3.333-3.333zm0 6.666a3.296 3.296 0 0 1-1.683-.472l4.543-4.543A3.29 3.29 0 0 1 20.332 7a3.337 3.337 0 0 1-3.333 3.333z"></path><path d="M8.667 15.333C10.505 15.333 12 13.838 12 12s-1.495-3.333-3.333-3.333S5.334 10.162 5.334 12a3.337 3.337 0 0 0 3.333 3.333z"></path><path d="M8.667 16.167c-3.925 0-6.667 2.056-6.667 5V22h13.333v-.833c0-2.944-2.742-5-6.667-5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'user-add',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.3 13.8c1.985 0 3.6-1.615 3.6-3.6s-1.615-3.6-3.6-3.6-3.6 1.615-3.6 3.6 1.615 3.6 3.6 3.6z"></path><path d="M9.3 14.7c-4.239 0-7.2 2.22-7.2 5.4v.9h14.4v-.9c0-3.18-2.961-5.4-7.2-5.4z"></path><path d="M21.9 5.7h-2.7V3h-1.8v2.7h-2.7v1.8h2.7v2.7h1.8V7.5h2.7z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'update',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.531 7.96v4.291l3.527 2.145-.715 1.239-4.338-2.622V7.96h1.525zm8.628 2.145h-6.912l2.812-2.86C14.294 4.48 9.766 4.385 7 7.149S4.235 14.3 7 17.064s7.293 2.765 10.059 0c1.383-1.383 2.05-2.956 2.05-4.958h2.05c0 2.002-.858 4.624-2.67 6.388-3.575 3.527-9.391 3.527-12.966 0s-3.575-9.248 0-12.775 9.296-3.527 12.871 0l2.765-2.86v7.245z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'unlock',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17 11H9V7a3 3 0 1 1 6 0v1.95h2V7A5 5 0 0 0 7 7v4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'unfold-more',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 18.188L15.188 15l1.406 1.406L12 21l-4.594-4.594L8.812 15zm0-12.375L8.812 9.001 7.406 7.595 12 3.001l4.594 4.594-1.406 1.406z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'unfold-less',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.594 5.391L12 9.985 7.406 5.391l1.406-1.406L12 7.173l3.188-3.188zM7.406 18.609L12 14.015l4.594 4.594-1.406 1.406L12 16.827l-3.188 3.188z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'undo2',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M5.65 5.644A8.953 8.953 0 0 1 12.006 3c4.972 0 8.989 4.027 8.989 9s-4.016 9-8.989 9c-4.196 0-7.695-2.869-8.696-6.75h2.34a6.74 6.74 0 0 0 6.356 4.5c3.724 0 6.75-3.026 6.75-6.75s-3.026-6.75-6.75-6.75c-1.867 0-3.533.776-4.748 2.002l3.622 3.622H3.005V2.999l2.644 2.644z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'undo',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.202 22c2.221-4.024 2.595-10.162-6.13-9.957V17l-7.5-7.5 7.5-7.5v4.851C21.52 6.578 22.685 16.074 17.202 22z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'trash',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15 5V3H9v2H3v2h18V5z"></path><path d="M5 8v12c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V8H5zm6 10H9v-6h2v6zm4 0h-2v-6h2v6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 26,
      'height': 24,
      'tags': '',
      'name': 'trademark',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24"><g class="fk-icon-wrapper"><path d="M11.91 7.179v1.175a.321.321 0 0 1-.321.311H8.596v8.156a.315.315 0 0 1-.311.321H6.929a.317.317 0 0 1-.321-.321V8.665H3.625a.315.315 0 0 1-.321-.311V7.179c0-.181.141-.321.321-.321h7.965c.171 0 .321.141.321.321zm10.427-.031l.773 9.653a.31.31 0 0 1-.08.241c-.06.06-.141.1-.231.1h-1.346a.316.316 0 0 1-.311-.291l-.462-5.906-1.898 4.269a.306.306 0 0 1-.291.191h-1.205a.325.325 0 0 1-.291-.191l-1.888-4.289-.452 5.926a.316.316 0 0 1-.311.291h-1.356a.328.328 0 0 1-.231-.1.36.36 0 0 1-.09-.241l.784-9.653a.316.316 0 0 1 .311-.291h1.426a.32.32 0 0 1 .291.191l2.21 5.223c.07.161.141.342.201.512.07-.171.131-.352.201-.512l2.22-5.223a.323.323 0 0 1 .291-.191h1.416c.171 0 .311.131.321.291z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'toc',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.984 12.984v-1.969H21v1.969h-2.016zm0-6H21V9h-2.016V6.984zm0 10.032V15H21v2.016h-2.016zM3 17.016V15h14.016v2.016H3zm0-4.032v-1.969h14.016v1.969H3zM3 9V6.984h14.016V9H3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'title',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M5.016 3.984h13.969v3h-5.484v12h-3v-12H5.017v-3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'timer',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 20.016c3.891 0 6.984-3.141 6.984-7.031S15.89 6.001 12 6.001s-6.984 3.094-6.984 6.984S8.11 20.016 12 20.016zm7.031-12.61C20.25 8.953 21 10.875 21 12.984c0 4.969-4.031 9-9 9s-9-4.031-9-9 4.031-9 9-9c2.109 0 4.078.797 5.625 2.016l1.406-1.453c.516.422.984.891 1.406 1.406zm-8.015 6.61v-6h1.969v6h-1.969zM15 .984V3H9V.984h6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'timer-off',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 20.016c1.266 0 2.484-.375 3.516-.984L5.953 9.469a6.922 6.922 0 0 0-.938 3.516c0 3.891 3.094 7.031 6.984 7.031zM3 3.984L20.766 21.75 19.5 23.016l-2.531-2.531c-1.453.938-3.141 1.5-4.969 1.5-4.969 0-9-4.031-9-9 0-1.828.563-3.563 1.5-4.969L1.734 5.25zm8.016 5.438V8.016h1.969v3.422zM15 .984V3H9V.984h6zm4.031 3.563l1.406 1.406-1.406 1.453C20.25 8.953 21 10.875 21 12.984a9.001 9.001 0 0 1-1.5 4.969L18.047 16.5a6.922 6.922 0 0 0 .938-3.516A6.942 6.942 0 0 0 12.001 6a6.741 6.741 0 0 0-3.469.938l-1.5-1.453a8.993 8.993 0 0 1 4.969-1.5c2.109 0 4.078.75 5.625 1.969z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Thumb-up',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2.886 19.786H6.2V9.843H2.886v9.943zm18.228-9.115c0-.911-.746-1.657-1.657-1.657h-5.228l.787-3.787.025-.265c0-.34-.141-.655-.365-.878l-.878-.87-5.452 5.46a1.619 1.619 0 0 0-.489 1.168v8.286c0 .911.746 1.657 1.657 1.657h7.457c.688 0 1.276-.414 1.525-1.011l2.502-5.841c.075-.191.116-.389.116-.605v-1.657z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Thumb-down',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14.169 5.072H6.763c-.684 0-1.266.412-1.512 1.003l-2.484 5.803a1.614 1.614 0 0 0-.116.6v1.647c0 .906.741 1.647 1.647 1.647h5.191l-.781 3.759-.025.262c0 .337.141.65.363.872l.872.862 5.422-5.422a1.63 1.63 0 0 0 .478-1.159V6.718a1.656 1.656 0 0 0-1.647-1.647zm3.29 0v9.872h3.291V5.072h-3.291z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'texting',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.881 3.031h-13.8c-1.172 0-2.122.95-2.122 2.122v15.831L6.943 17H18.88c1.172 0 2.122-.95 2.122-2.122V5.153c0-1.172-.95-2.122-2.122-2.122zm-9.909 7.988H6.988V9.003h1.984v2.016zm4.015 0h-1.984V9.003h1.984v2.016zm4.016 0h-1.984V9.003h1.984v2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'text-wrap',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.016 11.016C19.219 11.016 21 12.797 21 15s-1.781 3.984-3.984 3.984H15V21l-3-3 3-3v2.016h2.25c1.078 0 2.016-.938 2.016-2.016s-.938-2.016-2.016-2.016H3.984v-1.969h13.031zm3-6v1.969H3.985V5.016h16.031zM3.984 18.984v-1.969h6v1.969h-6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 26,
      'height': 24,
      'tags': '',
      'name': 'tags',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24"><g class="fk-icon-wrapper"><path d="M7.132 7.007c0-.81-.651-1.461-1.461-1.461S4.21 6.197 4.21 7.007s.651 1.461 1.461 1.461 1.461-.651 1.461-1.461zm12.177 6.574c0 .388-.16.765-.422 1.027l-5.604 5.615c-.274.262-.651.422-1.039.422s-.765-.16-1.027-.422l-8.16-8.172c-.582-.57-1.039-1.678-1.039-2.488V4.815c0-.799.662-1.461 1.461-1.461h4.748c.81 0 1.917.456 2.499 1.039l8.16 8.148c.262.274.422.651.422 1.039zm4.383 0c0 .388-.16.765-.422 1.027l-5.604 5.615a1.521 1.521 0 0 1-1.039.422c-.593 0-.89-.274-1.278-.673l5.364-5.364c.262-.262.422-.639.422-1.027s-.16-.765-.422-1.039l-8.16-8.148c-.582-.582-1.689-1.039-2.499-1.039h2.556c.81 0 1.917.456 2.499 1.039l8.16 8.148c.262.274.422.651.422 1.039z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 21,
      'height': 24,
      'tags': '',
      'name': 'Tag',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 21 24"><g class="fk-icon-wrapper"><path d="M6.961 7.296c0-.763-.613-1.376-1.376-1.376s-1.376.613-1.376 1.376.613 1.376 1.376 1.376 1.376-.613 1.376-1.376zm11.473 6.193c0 .365-.151.721-.398.968l-5.28 5.291a1.385 1.385 0 0 1-1.947 0l-7.688-7.699c-.548-.537-.979-1.581-.979-2.344V5.232c0-.753.623-1.376 1.376-1.376h4.473c.763 0 1.806.43 2.355.979l7.688 7.677c.247.258.398.613.398.979z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'tag-large',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'tablet',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.833 2H6.166c-1.15 0-2.083.933-2.083 2.083v15.833c0 1.15.933 2.083 2.083 2.083h11.667c1.15 0 2.083-.933 2.083-2.083V4.083c0-1.15-.933-2.083-2.083-2.083zM12 21.167c-.692 0-1.25-.558-1.25-1.25s.558-1.25 1.25-1.25 1.25.558 1.25 1.25-.558 1.25-1.25 1.25zm6.25-3.334H5.75V4.5h12.5v13.333z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'swap-vertical',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9 3l3.984 3.984h-3v7.031H8.015V6.984h-3zm6.984 14.016h3L15 21l-3.984-3.984h3V9.985h1.969v7.031z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'swap-horizontal',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21 9l-3.984 3.984v-3H9.985V8.015h7.031v-3zM6.984 11.016v3h7.031v1.969H6.984v3L3 15.001z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'street-signs',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.912 5.753a.359.359 0 0 1 0 .513l-2.044 1.419c-.2.2-.481.312-.759.312H4.734a.722.722 0 0 1-.716-.716V4.737c0-.391.325-.716.716-.716h5.834V2.715c0-.391.325-.716.716-.716h1.428c.391 0 .716.325.716.716v1.309h5.591c.278 0 .559.113.759.312l2.134 1.416z"></path><path d="M10.572 15.978h2.856v5.309a.722.722 0 0 1-.716.716h-1.428a.722.722 0 0 1-.716-.716l.003-5.309z"></path><path d="M20.294 11.041c.391 0 .716.325.716.716v2.544a.722.722 0 0 1-.716.716H6.044c-.278 0-.559-.112-.759-.312l-2.2-1.419a.359.359 0 0 1 0-.513l2.2-1.419c.2-.2.481-.312.759-.312h4.528V9.023h2.856v2.019h6.866z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'store',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.706 10.761l-2.667-6.222A.89.89 0 0 0 18.222 4H5.778a.888.888 0 0 0-.817.539l-2.667 6.222A.89.89 0 0 0 3.111 12H4v7.111c0 .492.398.889.889.889h8.889v-6.222h3.556V20h1.778a.888.888 0 0 0 .889-.889V12h.889a.886.886 0 0 0 .817-1.239zm-10.595 6.572H6.667v-3.556h4.444v3.556zm8.429-7.111h-2.426l-1.269-4.444h1.791l1.904 4.444zm-10.806 0l1.269-4.444h1.108v4.444H8.734zm4.155-4.444h1.108l1.269 4.444h-2.377V5.778zm-6.525 0h1.791l-1.269 4.444H4.46l1.904-4.444z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'step-next',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3.5 18.99l11 .01c.67 0 1.27-.33 1.63-.84L20.5 12l-4.37-6.16c-.36-.51-.96-.84-1.63-.84l-11 .01L8.34 12 3.5 18.99z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'star',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.001 17.696l-6.137 3.719 1.627-6.974-5.393-4.695 7.113-.605L12 2.586l2.789 6.555 7.113.605-5.393 4.695 1.627 6.974z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'star-o',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 15.914l3.75 2.25-.984-4.266 3.328-2.906-4.406-.375L12 6.586l-1.688 4.031-4.406.375 3.328 2.906-.984 4.266zm9.984-6.187l-5.438 4.734 1.641 7.031-6.188-3.75-6.188 3.75 1.641-7.031-5.438-4.734 7.172-.609 2.813-6.609 2.813 6.609z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'star-half',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 15.914l3.75 2.25-.984-4.266 3.328-2.906-4.406-.375L12 6.586v9.328zm9.984-6.187l-5.438 4.734 1.641 7.031-6.188-3.75-6.188 3.75 1.641-7.031-5.438-4.734 7.172-.609 2.813-6.609 2.813 6.609z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'spellcheck',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.609 11.578l1.406 1.406-9.516 9.516-5.063-5.109 1.406-1.406 3.656 3.703zm-15.187-.562h4.125L8.484 5.485zm6.047 4.968l-1.172-3H5.672l-1.125 3H2.438L7.547 3h1.875l5.109 12.984h-2.063z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'sort',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.006 14.025a.683.683 0 0 1-.2.475l-4.728 4.728a.665.665 0 0 1-.95 0L6.403 14.5a.665.665 0 0 1-.2-.475.68.68 0 0 1 .675-.675h9.456a.68.68 0 0 1 .672.675zm0-4.05a.68.68 0 0 1-.675.675H6.878a.68.68 0 0 1-.675-.675c0-.178.075-.347.2-.475l4.728-4.728a.665.665 0 0 1 .95 0L16.806 9.5a.66.66 0 0 1 .2.475z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'sms-failed',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.881 3.031h-13.8c-1.172 0-2.122.95-2.122 2.122v15.831L6.943 17H18.88c1.172 0 2.122-.95 2.122-2.122V5.153c0-1.172-.95-2.122-2.122-2.122zm-7.868 1.913h1.938v5.978h-1.938V4.944zm1.984 10.025h-2.031v-2h2.031v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'skip-previous',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.516 12L18 6v12zM6 6h2.016v12H6V6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'skip-next',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.984 6H18v12h-2.016V6zM6 18V6l8.484 6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'sitemap',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.666 16.047v3.891c0 .572-.462 1.034-1.034 1.034h-3.453a1.033 1.033 0 0 1-1.034-1.034v-3.891c0-.572.462-1.034 1.034-1.034h1.034v-2.322h-5.522v2.322h1.034c.572 0 1.034.462 1.034 1.034v3.891c0 .572-.462 1.034-1.034 1.034h-3.45a1.033 1.033 0 0 1-1.034-1.034v-3.891c0-.572.462-1.034 1.034-1.034h1.034v-2.322H5.784v2.322h1.034c.572 0 1.034.462 1.034 1.034v3.891c0 .572-.462 1.034-1.034 1.034h-3.45a1.033 1.033 0 0 1-1.034-1.034v-3.891c0-.572.462-1.034 1.034-1.034h1.034v-2.322a1.39 1.39 0 0 1 1.381-1.381h5.525V8.988h-1.034A1.033 1.033 0 0 1 9.24 7.954V4.063c0-.572.462-1.034 1.034-1.034h3.453c.572 0 1.034.462 1.034 1.034v3.891c0 .572-.462 1.034-1.034 1.034h-1.034v2.322h5.525a1.39 1.39 0 0 1 1.381 1.381v2.322h1.034c.569 0 1.031.462 1.031 1.034z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'shrink1',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M10.688 13.312v8.531l-3.281-3.281L3.469 22.5 1.5 20.531l3.938-3.938-3.281-3.281zM22.5 3.469l-3.938 3.938 3.281 3.281h-8.531V2.157l3.281 3.281L20.531 1.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'shrink',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M13.312 10.688h8.531l-3.281-3.281L22.5 3.469 20.531 1.5l-3.938 3.938-3.281-3.281z"></path><path d="M13.312 13.312v8.531l3.281-3.281 3.938 3.938 1.969-1.969-3.938-3.938 3.281-3.281z"></path><path d="M10.688 13.312H2.157l3.281 3.281L1.5 20.531 3.469 22.5l3.938-3.938 3.281 3.281z"></path><path d="M10.688 10.688V2.157L7.407 5.438 3.469 1.5 1.5 3.469l3.938 3.938-3.281 3.281z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'shield',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19.383 2.051a1 1 0 0 0-1.09.217c-.985.985-1.956 1.484-2.885 1.484-1.532 0-2.602-1.368-2.608-1.377a1.003 1.003 0 0 0-.796-.398c-.275-.021-.609.145-.801.393-.01.014-1.079 1.382-2.61 1.382-.93 0-1.9-.499-2.886-1.484A.999.999 0 0 0 4 2.975v11c0 3.808 6.763 7.479 7.534 7.885a.998.998 0 0 0 .932 0c.771-.407 7.534-4.078 7.534-7.885v-11a1 1 0 0 0-.617-.924zM16 12.975h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Share',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M7 14.5s1.149-3.75 7.5-3.75v3.75l7.5-5-7.5-5v3.75c-5 0-7.5 3.119-7.5 6.25zm8.75 2.5H4.5V9.5h2.459c.197-.233.408-.456.635-.668A8.653 8.653 0 0 1 10.643 7H2.001v12.5h16.25v-5.247l-2.5 1.667V17z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'settings',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 15.521c1.925 0 3.521-1.596 3.521-3.521S13.925 8.479 12 8.479 8.479 10.075 8.479 12s1.596 3.521 3.521 3.521zm7.465-2.535l2.113 1.644c.188.141.235.423.094.657l-2.019 3.475c-.141.235-.375.282-.61.188l-2.488-.986c-.516.375-1.08.751-1.69.986l-.375 2.629c-.047.235-.235.423-.469.423H9.984c-.235 0-.423-.188-.469-.423L9.14 18.95a6.148 6.148 0 0 1-1.69-.986l-2.488.986c-.235.094-.469.047-.61-.188l-2.019-3.475c-.141-.235-.094-.516.094-.657l2.113-1.644c-.047-.328-.047-.657-.047-.986s0-.657.047-.986L2.427 9.37c-.188-.141-.235-.423-.094-.657l2.019-3.475c.141-.235.375-.282.61-.188l2.488.986c.516-.375 1.08-.751 1.69-.986l.375-2.629c.047-.235.235-.423.469-.423h4.037c.235 0 .423.188.469.423l.375 2.629c.61.235 1.174.564 1.69.986l2.488-.986c.235-.094.469-.047.61.188l2.019 3.475c.141.235.094.516-.094.657l-2.113 1.644c.047.328.047.657.047.986s0 .657-.047.986z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Settings-vertical',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.75 10.875h.281c.464 0 .843-.38.843-.843V7.22a.846.846 0 0 0-.843-.843h-.281V3.002H16.5v3.375h-.281a.846.846 0 0 0-.843.843v2.812c0 .464.38.843.843.843h.281V21h2.25V10.875zM16.5 7.5h2.25v2.25H16.5V7.5zm-3.093 10.125c.464 0 .843-.38.843-.843V13.97a.846.846 0 0 0-.843-.843h-.281V3.002h-2.25v10.125h-.281a.846.846 0 0 0-.843.843v2.812c0 .464.38.843.843.843h.281V21h2.25v-3.375h.281zm-2.532-3.375h2.25v2.25h-2.25v-2.25zm-3.094-3.375c.464 0 .843-.38.843-.843V7.22a.846.846 0 0 0-.843-.843H7.5V3.002H5.25v3.375h-.281a.846.846 0 0 0-.843.843v2.812c0 .464.38.843.843.843h.281V21H7.5V10.875h.281zM5.25 7.5H7.5v2.25H5.25V7.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'server',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3.984 11.016v1.969H6v-1.969H3.984zm-1.968 3V9.985h19.969v4.031H2.016zM6 6.984V5.015H3.984v1.969H6zm-3.984-3h19.969v4.031H2.016V3.984zm1.968 13.032v1.969H6v-1.969H3.984zm-1.968 3v-4.031h19.969v4.031H2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'send',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M22.657 1.135a.793.793 0 0 1 .331.786l-3.143 18.857a.787.787 0 0 1-.774.65.87.87 0 0 1-.295-.061l-5.561-2.271-2.971 3.622a.762.762 0 0 1-.602.282.784.784 0 0 1-.786-.786v-4.285L19.463 4.928 6.339 16.284 1.49 14.295a.78.78 0 0 1-.491-.675.792.792 0 0 1 .393-.724L21.821 1.11a.76.76 0 0 1 .393-.111c.16 0 .319.049.442.135z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'search',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.503 14.964h-.795l-1.186-1.186a7.117 7.117 0 1 0-.83.821l-.011.009 1.186 1.186v.795l5.457 5.386 1.673-1.684zm-7.331-.972a4.744 4.744 0 1 1 0-9.49 4.744 4.744 0 1 1 0 9.49z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'restore',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.487 8.237h1.417v3.984l3.32 1.992-.708 1.151-4.029-2.435V8.236zm.93-4.737c4.693 0 8.5 3.807 8.5 8.5s-3.807 8.5-8.5 8.5a8.364 8.364 0 0 1-5.977-2.479l1.328-1.372c1.195 1.195 2.833 1.948 4.648 1.948 3.674 0 6.641-2.922 6.641-6.596s-2.966-6.596-6.641-6.596S6.82 8.327 6.82 12.001h2.833l-3.807 3.807-.089-.133-3.674-3.674h2.833c0-4.693 3.807-8.5 8.5-8.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'reply',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M10.253 8.953c6.053.853 8.694 5.2 9.547 9.547-2.153-3.047-5.2-4.428-9.547-4.428v3.534L4.2 11.553 10.253 5.5v3.453z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'reply-all',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.853 8.953c6.053.853 8.694 5.2 9.547 9.547-2.153-3.047-5.2-4.428-9.547-4.428v3.534L6.8 11.553 12.853 5.5v3.453zm-5.2-.853L4.2 11.553l3.453 3.453v2.6L1.6 11.553 7.653 5.5v2.6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Replay-30',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 5.7V2.1L7.5 6.6l4.5 4.5V7.5c2.97 0 5.4 2.43 5.4 5.4s-2.43 5.4-5.4 5.4-5.4-2.43-5.4-5.4H4.8c0 3.96 3.24 7.2 7.2 7.2s7.2-3.24 7.2-7.2-3.24-7.2-7.2-7.2zm-2.16 7.65h.36c.18 0 .36-.09.45-.18s.18-.18.18-.36v-.18s-.09-.09-.09-.18-.09-.09-.18-.09h-.45s-.09.09-.18.09-.09.09-.09.18v.18h-.9c0-.18 0-.27.09-.45s.18-.27.27-.36.27-.18.36-.18.36-.09.45-.09c.18 0 .36 0 .54.09s.27.09.45.18.18.18.27.36.09.27.09.45v.27s-.09.18-.09.27-.09.18-.18.18-.18.09-.27.18c.18.09.36.18.45.36s.18.36.18.54c0 .18 0 .36-.09.45s-.18.27-.27.36-.27.18-.45.18-.36.09-.54.09c-.18 0-.36 0-.45-.09s-.27-.09-.45-.18-.18-.18-.27-.36-.09-.36-.09-.54h.72v.18s.09.09.09.18.09.09.18.09h.45s.09-.09.18-.09.09-.09.09-.18v-.45s-.09-.09-.09-.18-.09-.09-.18-.09h-.54v-.63zm5.13.63c0 .27 0 .54-.09.72l-.27.54s-.27.27-.45.27-.36.09-.54.09-.36 0-.54-.09-.27-.18-.45-.27-.18-.27-.27-.54-.09-.45-.09-.72v-.63c0-.27 0-.54.09-.72l.27-.54s.27-.27.45-.27.36-.09.54-.09.36 0 .54.09.27.18.45.27.18.27.27.54.09.45.09.72v.63zm-.72-.72v-.45c0-.09-.09-.18-.09-.27s-.09-.09-.18-.18-.18-.09-.27-.09-.18 0-.27.09l-.18.18s-.09.18-.09.27v1.8s.09.18.09.27.09.09.18.18.18.09.27.09.18 0 .27-.09l.18-.18s.09-.18.09-.27v-1.35z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Replay-10',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 5.7V2.1L7.5 6.6l4.5 4.5V7.5c2.97 0 5.4 2.43 5.4 5.4s-2.43 5.4-5.4 5.4-5.4-2.43-5.4-5.4H4.8c0 3.96 3.24 7.2 7.2 7.2s7.2-3.24 7.2-7.2-3.24-7.2-7.2-7.2zm-.99 9.9h-.81v-2.97l-.9.27v-.63l1.62-.54h.09v3.87zm3.87-1.62c0 .27 0 .54-.09.72l-.27.54s-.27.27-.45.27-.36.09-.54.09-.36 0-.54-.09-.27-.18-.45-.27-.18-.27-.27-.54-.09-.45-.09-.72v-.63c0-.27 0-.54.09-.72l.27-.54s.27-.27.45-.27.36-.09.54-.09.36 0 .54.09c.18.09.27.18.45.27s.18.27.27.54.09.45.09.72v.63zm-.81-.72v-.45s-.09-.18-.09-.27-.09-.09-.18-.18-.18-.09-.27-.09-.18 0-.27.09l-.18.18s-.09.18-.09.27v1.8s.09.18.09.27.09.09.18.18.18.09.27.09.18 0 .27-.09l.18-.18s.09-.18.09-.27v-1.35z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Replay-5',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 5.7V2.1L7.5 6.6l4.5 4.5V7.5c2.97 0 5.4 2.43 5.4 5.4s-2.43 5.4-5.4 5.4-5.4-2.43-5.4-5.4H4.8c0 3.96 3.24 7.2 7.2 7.2s7.2-3.24 7.2-7.2-3.24-7.2-7.2-7.2zm-1.17 8.01l.18-1.98h2.16v.63h-1.53l-.09.81s.09 0 .09-.09.09 0 .09-.09.09 0 .18 0h.18c.18 0 .36 0 .45.09s.27.18.36.27.18.27.27.45.09.36.09.54c0 .18 0 .36-.09.45s-.09.27-.27.45-.27.18-.36.27-.36.09-.54.09c-.18 0-.36 0-.45-.09s-.27-.09-.45-.18-.18-.18-.27-.36-.09-.27-.09-.45h.72c0 .18.09.27.18.36s.18.09.36.09c.09 0 .18 0 .27-.09l.18-.18s.09-.18.09-.27v-.54l-.09-.18-.18-.18s-.18-.09-.27-.09h-.18s-.09 0-.18.09-.09 0-.09.09-.09.09-.09.09h-.63z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'remove',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 14H4v-4h16v4z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'redo',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.928 6.851V2l7.5 7.5-7.5 7.5v-4.957c-8.725-.205-8.351 5.934-6.13 9.957-5.483-5.926-4.318-15.421 6.13-15.149z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'receipt',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'radio-button-unchecked',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 17.607c3.082 0 5.607-2.525 5.607-5.607S15.082 6.393 12 6.393 6.393 8.918 6.393 12 8.918 17.607 12 17.607zm0-12.591c3.869 0 6.984 3.115 6.984 6.984S15.869 18.984 12 18.984 5.016 15.869 5.016 12 8.131 5.016 12 5.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'radio-button-checked',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 17.607c3.082 0 5.607-2.525 5.607-5.607S15.082 6.393 12 6.393 6.393 8.918 6.393 12 8.918 17.607 12 17.607zm0-12.591c3.869 0 6.984 3.115 6.984 6.984S15.869 18.984 12 18.984 5.016 15.869 5.016 12 8.131 5.016 12 5.016zm0 3.475c1.935 0 3.509 1.574 3.509 3.509S13.935 15.509 12 15.509 8.491 13.935 8.491 12 10.065 8.491 12 8.491z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Queue-add',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6h2v14c0 1.1-.9 2-2 2H6v-2h14V6zM4 2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm1 9h4v4h2v-4h4V9h-4V5H9v4H5v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'priority_high',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.984 3h4.031v12H9.984V3zm0 15.984c0-1.125.891-1.969 2.016-1.969s2.016.844 2.016 1.969S13.125 21 12 21s-2.016-.891-2.016-2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'printer',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M7.028 2.531h9.981v2.497H7.028V2.531z"></path><path d="M20.753 7.025H3.284c-.687 0-1.247.563-1.247 1.247v6.456c0 .687.563 1.247 1.247 1.247h3.744v4.994h9.981v-4.991h3.744c.687 0 1.247-.563 1.247-1.247V8.272c0-.684-.563-1.247-1.247-1.247zM4.531 10.769a1.248 1.248 0 1 1 1.247-1.247c0 .687-.559 1.247-1.247 1.247zm11.231 8.953H8.274v-6.241h7.488v6.241z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'poll',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.016 17.016v-4.031H15v4.031h2.016zm-4.032 0V6.985h-1.969v10.031h1.969zm-3.984 0V9.985H6.984v7.031H9zM18.984 3C20.062 3 21 3.938 21 5.016v13.969c0 1.078-.938 2.016-2.016 2.016H5.015c-1.078 0-2.016-.938-2.016-2.016V5.016C2.999 3.938 3.937 3 5.015 3h13.969z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'pointer',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21 3l-7.547 18h-.984l-2.625-6.844L3 11.531v-.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Podcast',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M13 15h-2c-2.757 0-5 2.243-5 5v2h12v-2c0-2.757-2.243-5-5-5z"></path><path d="M8.344 13.528c-1.25-1.758-1.1-4.211.475-5.783a4.501 4.501 0 0 1 6.363 0c1.574 1.572 1.725 4.025.476 5.783a6.936 6.936 0 0 1 1.733 1.028c1.701-2.526 1.438-5.992-.794-8.227-2.534-2.535-6.658-2.533-9.193 0-2.231 2.234-2.495 5.7-.794 8.227a6.99 6.99 0 0 1 1.734-1.028z"></path><path d="M5.512 15.668A7.936 7.936 0 0 1 4 11c0-2.137.833-4.146 2.344-5.657 3.119-3.119 8.193-3.119 11.313 0 2.809 2.81 3.079 7.2.83 10.324a7.03 7.03 0 0 1 1.06 1.878c3.406-3.923 3.254-9.886-.476-13.617C15.173.03 8.828.03 4.93 3.928A9.939 9.939 0 0 0 2 11c0 2.434.872 4.729 2.453 6.546a6.957 6.957 0 0 1 1.059-1.878z"></path><path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'plus',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19.5 10H14V4.5a.5.5 0 0 0-.5-.5h-3.001a.5.5 0 0 0-.5.5V10h-5.5a.5.5 0 0 0-.5.5v3.001a.5.5 0 0 0 .5.5h5.5v5.5a.5.5 0 0 0 .5.5H13.5a.5.5 0 0 0 .5-.5v-5.5h5.5a.5.5 0 0 0 .5-.5V10.5a.5.5 0 0 0-.5-.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Playlist-play',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2.357 8.143h15.429v2.571H2.357zm0-5.143h15.429v2.571H2.357zm0 10.286h10.286v2.571H2.357zm12.857 0V21l6.429-3.857z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Playlist-check',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M13.5 9h-12v2h12V9zm0-4h-12v2h12V5zm-12 10h8v-2h-8v2zM21 10.5l1.5 1.5-6.99 7L11 14.5l1.5-1.5 3.01 3L21 10.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Playlist-add',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'play-arrow',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6.516 5.016L17.485 12 6.516 18.984V5.015z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'piggy-bank',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.048 6.286h-3.809c-.241 0-.484.015-.734.047L7.918 4.177a.763.763 0 0 0-1.25.585v3.592a6.127 6.127 0 0 0-1.077 1.742H3.62a.762.762 0 0 0-.762.762v3.809c0 .421.341.762.762.762h2.347a6.13 6.13 0 0 0 2.987 2.592V20h1.524v-1.574c.251.031.505.05.762.05h3.809c.259 0 .512-.022.762-.053v1.576h1.524v-1.973a6.1 6.1 0 0 0 3.809-5.646 6.102 6.102 0 0 0-6.095-6.095zM8.19 10.857a.762.762 0 1 1 0-1.524.762.762 0 0 1 0 1.524zm7.619-1.524h-4.571V7.809h4.571v1.524z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'pictures',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6.906 19.969H20c1.103 0 2-.897 2-2V8.981a1.95 1.95 0 0 0-1.95-1.95H20v10.938H4.906c0 1.103.897 2 2 2z"></path><path d="M16.709 6.15c.075 0 .134.059.134.134v8.484a.133.133 0 0 1-.134.134H4.218a.133.133 0 0 1-.134-.134V6.284c0-.075.059-.134.134-.134h12.491zm0-2.125H4.218a2.258 2.258 0 0 0-2.259 2.259v8.484a2.258 2.258 0 0 0 2.259 2.259h12.487a2.259 2.259 0 0 0 2.259-2.259V6.284a2.255 2.255 0 0 0-2.256-2.259z"></path><path d="M11.581 11.55L9.972 9.834l-1.609 2.753-1.209-1.266-1.309 2.766h10.269l-2.347-6.372-2.184 3.834z"></path><path d="M7.159 9.297c.594 0 1.078-.484 1.078-1.078s-.484-1.078-1.078-1.078-1.078.484-1.078 1.078.484 1.078 1.078 1.078z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'picture-in-picture',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 18.25V5.75H4v12.5h16zm1.792-.042c0 .958-.833 1.792-1.792 1.792H4c-.958 0-1.792-.833-1.792-1.792V5.75C2.208 4.792 3.041 4 4 4h16c.958 0 1.792.792 1.792 1.75v12.458zm-3.584-7.083v5.333h-7.083v-5.333h7.083z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'percent',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.333 7.556a2.667 2.667 0 1 1-5.334 0 2.667 2.667 0 0 1 5.334 0z"></path><path d="M20 18.222a2.667 2.667 0 1 1-5.334 0 2.667 2.667 0 0 1 5.334 0z"></path><path d="M4.26 19.372L18.482 5.15l1.257 1.257L5.517 20.629 4.26 19.372z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'pause',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14.016 5.016H18v13.969h-3.984V5.016zM6 18.984V5.015h3.984v13.969H6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Palette',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'package',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M13 8V2h4a1 1 0 0 1 .832.446L21.535 8H13z"></path><path d="M2.465 8l3.703-5.554A1 1 0 0 1 7 2h4v6H2.465z"></path><path d="M22 21a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10h20v11zm-11-5H5v3h6v-3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'package-upload',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.315 2.373a.833.833 0 0 0-.693-.372h-3.333v5h7.112l-3.086-4.628z"></path><path d="M17.955 11.999c.283 0 .561.029.833.068V8.668H2.122v9.166c0 .46.373.833.833.833h9.233a5.87 5.87 0 0 1-.067-.836 5.834 5.834 0 0 1 5.833-5.833z"></path><path d="M9.622 2.002H6.289a.83.83 0 0 0-.693.372L2.51 7.002h7.112v-5z"></path><path d="M17.955 14.154l-3.922 3.922 1.178 1.178 1.911-1.91v4.655h1.667v-4.655l1.911 1.91 1.178-1.178z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'package-download',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.315 2.373a.833.833 0 0 0-.693-.372h-3.333v5h7.112l-3.086-4.628z"></path><path d="M17.955 11.999c.283 0 .561.029.833.068V8.668H2.122v9.166c0 .46.373.833.833.833h9.233a5.87 5.87 0 0 1-.067-.836 5.834 5.834 0 0 1 5.833-5.833z"></path><path d="M9.622 2.002H6.289a.83.83 0 0 0-.693.372L2.51 7.002h7.112v-5z"></path><path d="M18.045 21.846l3.922-3.922-1.178-1.178-1.911 1.91v-4.655h-1.667v4.655l-1.911-1.91-1.178 1.178z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'open-in-new',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14.016 3H21v6.984h-2.016V6.421l-9.797 9.797-1.406-1.406 9.797-9.797h-3.563V2.999zm4.968 15.984V12H21v6.984C21 20.062 20.062 21 18.984 21H5.015c-1.125 0-2.016-.938-2.016-2.016V5.015c0-1.078.891-2.016 2.016-2.016h6.984v2.016H5.015v13.969h13.969z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'notifications-off',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.008 14.438L9.055 5.016c.234-.094.469-.234.703-.328h.047l.281-.141c.141-.047.281-.047.422-.094V3.75c0-.844.656-1.5 1.5-1.5s1.5.656 1.5 1.5v.703c2.859.703 4.5 3.234 4.5 6.328v3.656zm-6 7.312c-1.125 0-2.016-.844-2.016-1.969h4.031c0 1.125-.891 1.969-2.016 1.969zM7.836 5.906c4.388 4.534 8.797 9.047 13.172 13.594l-1.266 1.266-2.016-2.016H3.992v-.984l2.016-2.016v-5.016c0-1.266.281-2.438.797-3.422L3.992 4.546l1.266-1.313z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'notifications-idle',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14.484 9.563V7.782H9.515v1.781h2.766l-2.766 3.422v1.781h4.969v-1.781h-2.766zM18 15.75l2.016 2.016v.984H3.985v-.984l2.016-2.016v-4.969c0-3.047 1.641-5.625 4.5-6.328V3.75c0-.844.656-1.5 1.5-1.5s1.5.656 1.5 1.5v.703c2.859.703 4.5 3.281 4.5 6.328v4.969zm-6 6c-1.125 0-2.016-.891-2.016-1.969h4.031c0 1.078-.938 1.969-2.016 1.969z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'notifications-add',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.605 12.467v-1.824h-2.714V7.929H11.11v2.714H8.396v1.824h2.714v2.714h1.781v-2.714h2.714zm2.629 3.435l1.908 1.908v.975H3.856v-.975l1.908-1.908v-5.259c0-2.926 2.036-5.429 4.792-6.065v-.636c0-.806.636-1.442 1.442-1.442s1.442.636 1.442 1.442v.636c2.757.636 4.792 3.138 4.792 6.065v5.259zm-8.015 3.774h3.563c0 .975-.806 1.824-1.781 1.824s-1.781-.848-1.781-1.824z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'notification',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18 15.75l2.016 2.016v.984H3.985v-.984l2.016-2.016v-4.969c0-3.094 1.641-5.625 4.5-6.328V3.75c0-.844.656-1.5 1.5-1.5s1.5.656 1.5 1.5v.703c2.859.703 4.5 3.281 4.5 6.328v4.969zm-6 6c-1.125 0-2.016-.891-2.016-1.969h4.031c0 1.078-.938 1.969-2.016 1.969z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'notification-active',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 21.75c-1.125 0-2.016-.891-2.016-1.969h3.984c0 1.164-.872 1.969-1.969 1.969zm6-10.969v4.969l2.016 2.016v.984H3.985v-.984l2.016-2.016v-4.969c0-3.094 1.641-5.625 4.5-6.328V3.75c0-.844.656-1.5 1.5-1.5s1.5.656 1.5 1.5v.703c2.859.703 4.5 3.281 4.5 6.328zm1.969-.515c-.141-2.672-1.5-4.969-3.516-6.422l1.406-1.406c2.391 1.828 3.984 4.641 4.125 7.828h-2.016zM7.594 3.844c-2.063 1.453-3.422 3.75-3.563 6.422H2.015c.141-3.188 1.734-6 4.125-7.828z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'mouse',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M13.905 5.762h.952a2.86 2.86 0 0 0 2.857-2.857v-.952h-1.905v.952a.954.954 0 0 1-.952.952h-.952a2.86 2.86 0 0 0-2.857 2.857v.952H8.191a1.906 1.906 0 0 0-1.905 1.905v6.667c0 3.151 2.563 5.714 5.714 5.714s5.714-2.563 5.714-5.714V9.571c0-1.05-.854-1.905-1.905-1.905h-2.857v-.952c0-.525.428-.952.952-.952zm-2.857 3.809v2.857H8.191V9.571h2.857zM12 20.048c-2.1 0-3.81-1.71-3.81-3.81v-1.905h7.619v1.905c0 2.1-1.71 3.81-3.81 3.81zm3.81-10.477v2.857h-2.857V9.571h2.857z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'more-vertical',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 7.999c1.1 0 2.001-.9 2.001-2.001s-.9-2.001-2.001-2.001c-1.1 0-2.001.9-2.001 2.001s.9 2.001 2.001 2.001zm0 2c-1.1 0-2.001.9-2.001 2.001s.9 2.001 2.001 2.001c1.1 0 2.001-.9 2.001-2.001s-.9-2.001-2.001-2.001zm0 6.002c-1.1 0-2.001.9-2.001 2.001s.9 2.001 2.001 2.001c1.1 0 2.001-.9 2.001-2.001s-.9-2.001-2.001-2.001z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'more-horizontal',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'mood-sad',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 14.016c2.344 0 4.313 1.406 5.109 3.469h-1.641c-.703-1.172-1.969-1.969-3.469-1.969s-2.766.797-3.469 1.969H6.889c.797-2.063 2.766-3.469 5.109-3.469zm0 6c4.406 0 8.016-3.609 8.016-8.016S16.407 3.984 12 3.984 3.984 7.593 3.984 12 7.593 20.016 12 20.016zm0-18c5.531 0 9.984 4.453 9.984 9.984S17.531 21.984 12 21.984 2.016 17.531 2.016 12 6.469 2.016 12 2.016zm-5.016 7.5c0-.844.656-1.5 1.5-1.5s1.5.656 1.5 1.5-.656 1.5-1.5 1.5-1.5-.656-1.5-1.5zm7.032 0c0-.844.656-1.5 1.5-1.5s1.5.656 1.5 1.5-.656 1.5-1.5 1.5-1.5-.656-1.5-1.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'mood-neutral',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 20.016c4.406 0 8.016-3.609 8.016-8.016S16.407 3.984 12 3.984 3.984 7.593 3.984 12 7.593 20.016 12 20.016zm0-18c5.531 0 9.984 4.453 9.984 9.984S17.531 21.984 12 21.984 2.016 17.531 2.016 12 6.469 2.016 12 2.016zm-5.016 7.5c0-.844.656-1.5 1.5-1.5s1.5.656 1.5 1.5-.656 1.5-1.5 1.5-1.5-.656-1.5-1.5zm7.032 0c0-.844.656-1.5 1.5-1.5s1.5.656 1.5 1.5-.656 1.5-1.5 1.5-1.5-.656-1.5-1.5zM9 14.016h6v1.5H9v-1.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'mood-happy',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 15.984c1.5 0 2.766-.797 3.469-1.969h1.641c-.797 2.063-2.766 3.469-5.109 3.469s-4.313-1.406-5.109-3.469h1.641a4.018 4.018 0 0 0 3.469 1.969zm0 4.032c4.406 0 8.016-3.609 8.016-8.016S16.407 3.984 12 3.984 3.984 7.593 3.984 12 7.593 20.016 12 20.016zm0-18c5.531 0 9.984 4.453 9.984 9.984S17.531 21.984 12 21.984 2.016 17.531 2.016 12 6.469 2.016 12 2.016zm-5.016 7.5c0-.844.656-1.5 1.5-1.5s1.5.656 1.5 1.5-.656 1.5-1.5 1.5-1.5-.656-1.5-1.5zm7.032 0c0-.844.656-1.5 1.5-1.5s1.5.656 1.5 1.5-.656 1.5-1.5 1.5-1.5-.656-1.5-1.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'mood-excited',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 17.484c-2.344 0-4.313-1.406-5.109-3.469H17.11c-.797 2.063-2.766 3.469-5.109 3.469zm-3.516-6.468c-.844 0-1.5-.656-1.5-1.5s.656-1.5 1.5-1.5 1.5.656 1.5 1.5-.656 1.5-1.5 1.5zm7.032 0c-.844 0-1.5-.656-1.5-1.5s.656-1.5 1.5-1.5 1.5.656 1.5 1.5-.656 1.5-1.5 1.5zm-3.516 9c4.406 0 8.016-3.609 8.016-8.016S16.407 3.984 12 3.984 3.984 7.593 3.984 12 7.593 20.016 12 20.016zm0-18c5.531 0 9.984 4.453 9.984 9.984S17.531 21.984 12 21.984 2.016 17.531 2.016 12 6.469 2.016 12 2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'mood-bad',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 14.016c2.344 0 4.313 1.406 5.109 3.469H6.89c.797-2.063 2.766-3.469 5.109-3.469zm-3.516-3c-.844 0-1.5-.656-1.5-1.5s.656-1.5 1.5-1.5 1.5.656 1.5 1.5-.656 1.5-1.5 1.5zm7.032 0c-.844 0-1.5-.656-1.5-1.5s.656-1.5 1.5-1.5 1.5.656 1.5 1.5-.656 1.5-1.5 1.5zm-3.516 9c4.406 0 8.016-3.609 8.016-8.016S16.407 3.984 12 3.984 3.984 7.593 3.984 12 7.593 20.016 12 20.016zm0-18c5.531 0 9.984 4.453 9.984 9.984S17.531 21.984 12 21.984 2.016 17.531 2.016 12 6.469 2.016 12 2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'money-note',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19.987 7.025v10.972H3.031c0 1.103.894 1.994 1.994 1.994h14.934a2.023 2.023 0 0 0 2.022-2.022v-8.95a1.994 1.994 0 0 0-1.994-1.994z"></path><path d="M17.112 5.031H2.84a.819.819 0 0 0-.825.806v9.331c0 .444.372.806.825.806h14.275a.819.819 0 0 0 .825-.806V5.837a.819.819 0 0 0-.828-.806zm-2.365 8.019c-.303.444-.397.95-.297 1.369H5.537c.103-.419.006-.925-.297-1.369-.409-.603-1.081-.903-1.634-.781V8.513c.428.103.95.009 1.403-.288.631-.413.938-1.087.791-1.634h8.388c-.147.547.159 1.222.791 1.634.444.291.947.384 1.366.297v3.741c-.544-.1-1.194.197-1.597.787z"></path><path d="M12.472 10.641c0 1.716-1.147 3.109-2.559 3.109s-2.559-1.391-2.559-3.109 1.147-3.109 2.559-3.109 2.559 1.394 2.559 3.109z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'mobile',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.636 2H8.363A2.273 2.273 0 0 0 6.09 4.273v15.455a2.273 2.273 0 0 0 2.273 2.273h7.273a2.273 2.273 0 0 0 2.273-2.273V4.273A2.273 2.273 0 0 0 15.636 2zM12 21.091c-.755 0-1.364-.609-1.364-1.364s.609-1.364 1.364-1.364 1.364.609 1.364 1.364-.609 1.364-1.364 1.364zm4.091-3.636H7.909V4.728h8.182v12.727z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'mms',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.881 3.031h-13.8c-1.172 0-2.122.95-2.122 2.122v15.831L6.943 17H18.88c1.172 0 2.122-.95 2.122-2.122V5.153c0-1.172-.95-2.122-2.122-2.122zM5.55 12.969c0-.034 3.466-4.091 3.466-4.091l1.928 2.553 3.181-3.806 4.719 5.344H5.55z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'mic-on',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.576 11.482h1.776c0 3.602-2.862 6.563-6.316 7.056v3.454h-2.072v-3.454c-3.454-.493-6.316-3.454-6.316-7.056h1.776c0 3.158 2.665 5.329 5.576 5.329s5.576-2.171 5.576-5.329zM12 14.64c-1.727 0-3.158-1.431-3.158-3.158V5.166c0-1.727 1.431-3.158 3.158-3.158s3.158 1.431 3.158 3.158v6.316c0 1.727-1.431 3.158-3.158 3.158z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'mic-off',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3.858 3.044L21.474 20.66l-1.332 1.332L15.75 17.6c-.79.493-1.776.79-2.714.938v3.454h-2.072v-3.454c-3.454-.493-6.316-3.454-6.316-7.056h1.776c0 3.158 2.665 5.329 5.576 5.329.839 0 1.678-.197 2.418-.543l-1.727-1.727a2.926 2.926 0 0 1-.691.099c-1.727 0-3.158-1.431-3.158-3.158v-.79L2.526 4.376zm11.3 8.586L8.842 5.363v-.197c0-1.727 1.431-3.158 3.158-3.158s3.158 1.431 3.158 3.158v6.464zm4.194-.148a6.958 6.958 0 0 1-.938 3.454l-1.283-1.332c.296-.641.444-1.332.444-2.122h1.776z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'message',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.922 3.031h-13.8C3.95 3.031 3 3.981 3 5.153v15.831L6.984 17h11.937c1.172 0 2.122-.95 2.122-2.122V5.153c0-1.172-.95-2.122-2.122-2.122zm-4.766 11.438H5.993v-1.5h8.163v1.5zm3.888-3.594H5.994V9.5h12.05v1.375zm0-3.375H5.994V6.063h12.05V7.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'message-bubble-blank',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.922 3.031h-13.8C3.95 3.031 3 3.981 3 5.153v15.831L6.984 17h11.937c1.172 0 2.122-.95 2.122-2.122V5.153c0-1.172-.95-2.122-2.122-2.122z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'menu',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3 6h18v2.016H3V6z"></path><path d="M3 11.016h14.031v1.969H3v-1.969z"></path><path d="M3 15.984h16V18H3v-2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'map-pin',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 11.484c1.359 0 2.484-1.125 2.484-2.484S13.359 6.516 12 6.516 9.516 7.641 9.516 9s1.125 2.484 2.484 2.484zm0-9.468A6.942 6.942 0 0 1 18.984 9c0 5.25-6.984 12.984-6.984 12.984S5.016 14.25 5.016 9A6.942 6.942 0 0 1 12 2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'lock',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17 11V7A5 5 0 0 0 7 7v4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-5-7a3 3 0 0 1 3 3v4H9V7a3 3 0 0 1 3-3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'local-shipping',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.251 17.703c.738 0 1.313-.574 1.313-1.313s-.574-1.313-1.313-1.313-1.313.574-1.313 1.313.574 1.313 1.313 1.313zm1.313-7.877H16.39V12h3.898zM6.749 17.703c.738 0 1.313-.574 1.313-1.313s-.574-1.313-1.313-1.313-1.313.574-1.313 1.313.574 1.313 1.313 1.313zm12.267-9.19L21.642 12v4.39h-1.764c0 1.436-1.19 2.626-2.626 2.626s-2.626-1.19-2.626-2.626H9.375c0 1.436-1.19 2.626-2.626 2.626s-2.626-1.19-2.626-2.626H2.359V6.749c0-.944.821-1.764 1.764-1.764H16.39v3.528h2.626z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'loading',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.35 5.644A8.953 8.953 0 0 0 11.994 3c-4.972 0-8.989 4.027-8.989 9s4.016 9 8.989 9c4.196 0 7.695-2.869 8.696-6.75h-2.34a6.74 6.74 0 0 1-6.356 4.5c-3.724 0-6.75-3.026-6.75-6.75s3.026-6.75 6.75-6.75c1.867 0 3.533.776 4.748 2.002l-3.622 3.622h7.875V2.999l-2.644 2.644z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'live-help',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.881 3.031h-13.8c-1.172 0-2.122.95-2.122 2.122v15.831L6.943 17H18.88c1.172 0 2.122-.95 2.122-2.122V5.153c0-1.172-.95-2.122-2.122-2.122zm-6.04 11.613a1.215 1.215 0 0 1-.912.381c-.363 0-.666-.128-.903-.381a1.308 1.308 0 0 1-.359-.941c0-.381.119-.7.359-.953s.541-.381.903-.381c.363 0 .669.128.912.381s.366.572.366.953c0 .375-.122.687-.366.941zm1.843-6.331a3.178 3.178 0 0 1-.394.653c-.159.2-.325.394-.503.581s-.341.381-.487.581c-.15.2-.266.416-.353.637a1.651 1.651 0 0 0-.087.769h-1.853a2.282 2.282 0 0 1 .034-.891c.072-.269.175-.516.309-.747s.284-.441.453-.631c.169-.191.328-.375.481-.553s.281-.35.381-.516c.1-.169.15-.341.15-.525 0-.297-.087-.522-.266-.675s-.409-.231-.697-.231c-.269 0-.506.063-.709.188a3.165 3.165 0 0 0-.597.475L9.383 6.366a3.852 3.852 0 0 1 1.2-.947 3.301 3.301 0 0 1 1.544-.359c.381 0 .741.047 1.069.144.331.097.619.244.862.444s.434.456.575.769c.138.312.209.678.209 1.097-.003.3-.053.566-.159.8z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'list',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6.984 6.984H21V9H6.984V6.984zm0 10.032V15H21v2.016H6.984zm0-4.032v-1.969H21v1.969H6.984zM3 9V6.984h2.016V9H3zm0 8.016V15h2.016v2.016H3zm0-4.032v-1.969h2.016v1.969H3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'list-add',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2.016 15.984v-1.969h7.969v1.969H2.016zM18 14.016h3.984v1.969H18v4.031h-2.016v-4.031H12v-1.969h3.984V9.985H18v4.031zM14.016 6v2.016h-12V6h12zm0 3.984V12h-12V9.984h12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'line-weight',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3 3.984h18v4.031H3V3.984zm0 9v-3h18v3H3zm0 7.032v-1.031h18v1.031H3zm0-3V15h18v2.016H3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'line-style',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3 3.984h18v4.031H3V3.984zM12.984 12V9.984H21V12h-8.016zM3 12V9.984h8.016V12H3zm15.984 8.016V18H21v2.016h-2.016zm-3.984 0V18h2.016v2.016H15zm-3.984 0V18h1.969v2.016h-1.969zm-4.032 0V18H9v2.016H6.984zm-3.984 0V18h2.016v2.016H3zm12.984-4.032v-1.969H21v1.969h-5.016zm-6.468 0v-1.969h4.969v1.969H9.516zm-6.516 0v-1.969h5.016v1.969H3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'library-books',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M5.016 6.984V5.015H15v1.969H5.016zM9 15v-2.016h6V15H9zm-3.984-3.984V9H15v2.016H5.016zm-1.032-9a1.981 1.981 0 0 0-1.969 1.969v12c0 1.078.891 2.016 1.969 2.016h12c1.078 0 2.016-.938 2.016-2.016v-12c0-1.078-.938-1.969-2.016-1.969h-12zM20.016 6v14.016H6v1.969h14.016a1.981 1.981 0 0 0 1.969-1.969V6h-1.969z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'layers',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 15.984C8.999 13.656 6.009 11.319 3 9l9-6.984L21 9c-3.009 2.319-5.999 4.657-9 6.984zm0 2.579l7.359-5.766L21 14.063l-9 6.984-9-6.984 1.641-1.266z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'layers-off',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3.281.984l18.703 18.75L20.718 21l-3.75-3.797-4.969 3.844-9-6.984 1.641-1.266 7.359 5.766 3.516-2.766-1.406-1.406L12 15.985c-3.001-2.328-5.991-4.665-9-6.984L6.234 6.47 2.015 2.251zM21 9c-1.354 1.037-2.692 2.089-4.031 3.141L9.094 4.266 12 2.016zm-1.172 6l-1.453-1.453 1.172-.891L21 14.062z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'last-page',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21 2.994h-2.966V21H21V2.994z"></path><path d="M2.934 18.891L5.043 21l9-9-9-9-2.109 2.109L9.825 12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'laptop',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.588 17.353c.906 0 1.639-.741 1.639-1.647l.008-9.059c0-.906-.741-1.647-1.647-1.647H5.412c-.906 0-1.647.741-1.647 1.647v9.059c0 .906.741 1.647 1.647 1.647H2.118c0 .906.741 1.647 1.647 1.647h16.471c.906 0 1.647-.741 1.647-1.647h-3.294zM5.412 6.647h13.176v9.059H5.412V6.647zM12 18.176c-.453 0-.824-.371-.824-.824s.371-.824.824-.824.824.371.824.824-.371.824-.824.824z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'label',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'keyhole',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 4a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm1.1 8.52l.5 3.48h-3.2l.5-3.48a2.404 2.404 0 0 1-1.3-2.133 2.4 2.4 0 1 1 3.513 2.127l-.013.006z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'image',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20.016 2.016H3.985a1.981 1.981 0 0 0-1.969 1.969v16.031c0 1.078.891 1.969 1.969 1.969h16.031a1.981 1.981 0 0 0 1.969-1.969V3.985a1.981 1.981 0 0 0-1.969-1.969zm0 11.015v6.984H3.985V3.984h16.031v9.047z"></path><path d="M17.016 8.484a1.5 1.5 0 1 1-3.001-.001 1.5 1.5 0 0 1 3.001.001z"></path><path d="M12.984 16.688l-3-3.703L6 18.001h12l-3-3.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'id-card',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M5.937 19.969h14.062c1.103 0 2-.897 2-2V7.95A1.95 1.95 0 0 0 20.049 6h-.05v11.969H3.937c0 1.103.897 2 2 2z"></path><path d="M16.109 3.969H3.859A1.861 1.861 0 0 0 2 5.828V14.2c0 1.025.834 1.859 1.859 1.859h12.247a1.861 1.861 0 0 0 1.859-1.859V5.828a1.857 1.857 0 0 0-1.856-1.859zm-11.818 9.3c0-1.713 1.078-2.791 2.791-2.791a1.86 1.86 0 1 1 0-3.719 1.86 1.86 0 0 1 0 3.719c1.713 0 2.791 1.078 2.791 2.791H4.292zm11.668 0h-4.034V11.41h4.034v1.859zm0-3.719h-4.034V7.691h4.034V9.55z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'id-badge',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM9 8a2 2 0 1 1-.001 4.001A2 2 0 0 1 9 8zm-3 8c0-1.841 1.159-3 3-3s3 1.159 3 3H6zm12 0h-4v-2h4v2zm0-3h-4v-2h4v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'hourglass',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'hourglass-o',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 22,
      'height': 24,
      'tags': '',
      'name': 'home2',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24"><g class="fk-icon-wrapper"><path d="M17.513 13.079v5.306a.713.713 0 0 1-.708.708H12.56v-4.245H9.73v4.245H5.485a.713.713 0 0 1-.708-.708v-5.306c0-.022.011-.045.011-.067l6.356-5.24 6.356 5.24a.144.144 0 0 1 .011.067zm2.465-.763l-.686.818a.37.37 0 0 1-.232.122h-.033a.348.348 0 0 1-.232-.077L11.145 6.8l-7.65 6.379a.378.378 0 0 1-.265.077.365.365 0 0 1-.232-.122l-.686-.818a.36.36 0 0 1 .045-.497l7.948-6.622c.464-.387 1.216-.387 1.68 0l2.698 2.255V5.296a.35.35 0 0 1 .354-.354h2.123a.35.35 0 0 1 .354.354v4.51l2.421 2.012a.362.362 0 0 1 .045.497z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'hearing',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M11.484 9c0-1.359 1.172-2.484 2.531-2.484S16.499 7.641 16.499 9s-1.125 2.484-2.484 2.484S11.484 10.359 11.484 9zM7.641 2.625A8.96 8.96 0 0 0 5.016 9a8.96 8.96 0 0 0 2.625 6.375l-1.406 1.406C4.266 14.812 3.001 12.047 3.001 9s1.266-5.813 3.234-7.781zm9.375 17.391c1.078 0 1.969-.938 1.969-2.016h2.016a3.98 3.98 0 0 1-3.984 3.984c-.563 0-1.125-.094-1.641-.328-1.359-.703-2.156-1.734-2.766-3.563-.328-.984-.891-1.453-1.688-2.063-.891-.656-1.969-1.5-2.859-3.141-.703-1.266-1.078-2.625-1.078-3.891 0-3.938 3.094-6.984 7.031-6.984S21 5.061 21 8.998h-2.016c0-2.813-2.156-5.016-4.969-5.016S8.999 6.185 8.999 8.998c0 .938.281 2.016.797 2.953.703 1.313 1.547 1.922 2.344 2.531.938.703 1.875 1.453 2.391 3 .516 1.5.984 1.969 1.688 2.344.188.094.516.188.797.188z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'globe',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.359 14.016h3.375c.141-.656.281-1.313.281-2.016s-.141-1.359-.281-2.016h-3.375c.094.656.141 1.313.141 2.016s-.047 1.359-.141 2.016zm-1.781 5.531a8.007 8.007 0 0 0 4.359-3.563h-2.953a15.676 15.676 0 0 1-1.406 3.563zm-.234-5.531c.094-.656.141-1.313.141-2.016s-.047-1.359-.141-2.016H9.656c-.094.656-.141 1.313-.141 2.016s.047 1.359.141 2.016h4.688zM12 19.969c.844-1.219 1.5-2.531 1.922-3.984h-3.844c.422 1.453 1.078 2.766 1.922 3.984zM8.016 8.016a15.676 15.676 0 0 1 1.406-3.563 8.007 8.007 0 0 0-4.359 3.563h2.953zm-2.953 7.968a8.015 8.015 0 0 0 4.359 3.563 15.676 15.676 0 0 1-1.406-3.563H5.063zm-.797-1.968h3.375C7.547 13.36 7.5 12.703 7.5 12s.047-1.359.141-2.016H4.266c-.141.656-.281 1.313-.281 2.016s.141 1.359.281 2.016zM12 4.031c-.844 1.219-1.5 2.531-1.922 3.984h3.844C13.5 6.562 12.844 5.249 12 4.031zm6.938 3.985a8.015 8.015 0 0 0-4.359-3.563 15.676 15.676 0 0 1 1.406 3.563h2.953zm-6.938-6c5.531 0 9.984 4.453 9.984 9.984S17.531 21.984 12 21.984 2.016 17.531 2.016 12 6.469 2.016 12 2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'fullscreen',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14.016 5.016h4.969v4.969h-1.969v-3h-3V5.016zm3 12v-3h1.969v4.969h-4.969v-1.969h3zm-12-7.032V5.015h4.969v1.969h-3v3H5.016zm1.968 4.032v3h3v1.969H5.015v-4.969h1.969z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'fullscreen-exit',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.984 8.016h3v1.969h-4.969V5.016h1.969v3zm-1.968 10.968v-4.969h4.969v1.969h-3v3h-1.969zm-6-10.968v-3h1.969v4.969H5.016V8.016h3zm-3 7.968v-1.969h4.969v4.969H8.016v-3h-3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-strikethrough',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3 14.531v-2.016h18v2.016H3zM5.016 4.5h13.969v3h-4.969v3H9.985v-3H5.016v-3zm4.968 15v-3h4.031v3H9.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-size',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3 12V9h9v3H9v6.984H6V12H3zm6-8.016h12.984v3h-4.969v12h-3v-12H8.999v-3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-shapes',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M10.807 12.682h2.387l-1.193-3.495zm2.77 1.151h-3.196l-.639 1.79H8.25l3.111-8.183h1.279l3.068 8.183h-1.449zM18.35 5.65h1.833V3.817H18.35V5.65zm1.833 14.533V18.35H18.35v1.833h1.833zM16.56 18.35v-1.79h1.79V7.44h-1.79V5.65H7.44v1.79H5.65v9.12h1.79v1.79h9.12zM5.65 20.183V18.35H3.817v1.833H5.65zM3.817 3.817V5.65H5.65V3.817H3.817zM22.015 7.44h-1.833v9.12h1.833v5.455H16.56v-1.833H7.44v1.833H1.985V16.56h1.833V7.44H1.985V1.985H7.44v1.833h9.12V1.985h5.455V7.44z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-quote',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14.016 17.016l1.969-4.031h-3v-6h6v6l-1.969 4.031h-3zm-8.016 0l2.016-4.031h-3v-6h6v6L9 17.016H6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-paint',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18 3.984h3V12h-8.016v9a.96.96 0 0 1-.984.984H9.984A.96.96 0 0 1 9 21V9.984h9.984V6H18v.984c0 .563-.422 1.031-.984 1.031h-12a1.04 1.04 0 0 1-1.031-1.031V3c0-.563.469-.984 1.031-.984h12A.96.96 0 0 1 18 3v.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-list-numbered',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6.984 12.984v-1.969H21v1.969H6.984zm0 6v-1.969H21v1.969H6.984zm0-13.968H21v1.969H6.984V5.016zm-4.968 6V9.985h3v.938l-1.828 2.063h1.828v1.031h-3v-.938l1.781-2.063H2.016zm.984-3v-3h-.984V3.985h1.969v4.031h-.984zm-.984 9v-1.031h3v4.031h-3v-1.031h1.969v-.469h-.984v-1.031h.984v-.469H2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-list-bulleted',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6.984 5.016H21v1.969H6.984V5.016zm0 7.968v-1.969H21v1.969H6.984zm0 6v-1.969H21v1.969H6.984zm-3-2.484c.844 0 1.5.703 1.5 1.5s-.703 1.5-1.5 1.5-1.5-.703-1.5-1.5.656-1.5 1.5-1.5zm0-12c.844 0 1.5.656 1.5 1.5s-.656 1.5-1.5 1.5-1.5-.656-1.5-1.5.656-1.5 1.5-1.5zm0 6c.844 0 1.5.656 1.5 1.5s-.656 1.5-1.5 1.5-1.5-.656-1.5-1.5.656-1.5 1.5-1.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-line-spacing',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.984 12.984v-1.969h12v1.969h-12zm0 6v-1.969h12v1.969h-12zm0-13.968h12v1.969h-12V5.016zM6 6.984v10.031h2.484l-3.469 3.469-3.516-3.469h2.484V6.984H1.499l3.516-3.469 3.469 3.469H6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-italic',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.984 3.984H18v3h-2.813L11.812 15h2.203v3H5.999v-3h2.813l3.375-8.016H9.984v-3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-indent-increase',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M11.016 12.984v-1.969H21v1.969h-9.984zm0-3.984V6.984H21V9h-9.984zM3 3h18v2.016H3V3zm8.016 14.016V15H21v2.016h-9.984zM3 8.016L6.984 12 3 15.984V8.015zM3 21v-2.016h18V21H3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-indent-decrease',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M11.016 12.984v-1.969H21v1.969h-9.984zm0-3.984V6.984H21V9h-9.984zM3 3h18v2.016H3V3zm0 18v-2.016h18V21H3zm0-9l3.984-3.984v7.969zm8.016 5.016V15H21v2.016h-9.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-font',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.516 9v3h-3v6.984h-3V12h-3V9h9zM2.484 3.984h13.031v3h-5.016v12h-3v-12H2.483v-3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-color-text',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.609 12h4.781l-2.391-6.328zm1.407-9h1.969l5.484 14.016h-2.25l-1.078-3H8.86l-1.125 3h-2.25zM0 20.016h24V24H0v-3.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-color-reset',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M5.25 5.25l14.625 14.625-1.266 1.266-2.672-2.625c-1.078.938-2.438 1.5-3.938 1.5-3.328 0-6-2.672-6-6 0-1.219.563-2.672 1.313-4.125L3.984 6.563zM18 14.016c0 .469-.047.891-.141 1.313L9.281 6.704C10.687 4.688 12 3.188 12 3.188s6 6.844 6 10.828z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-color-fill',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M0 20.016h24V24H0v-3.984zm18.984-8.532S21 13.687 21 15c0 1.078-.938 2.016-2.016 2.016s-1.969-.938-1.969-2.016c0-1.313 1.969-3.516 1.969-3.516zm-13.781-1.5h9.609L9.984 5.203zm11.344-1.031c.609.609.609 1.547 0 2.109l-5.484 5.484c-.281.281-.703.469-1.078.469s-.75-.188-1.031-.469l-5.531-5.484c-.609-.563-.609-1.5 0-2.109l5.156-5.156-2.391-2.391L7.641 0z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-clear',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6 5.016h14.016v3h-5.813l-1.594 3.75L10.5 9.703l.703-1.688H8.812L5.999 5.202v-.188zm-2.719 0l.281.234L18 19.734 16.734 21l-5.672-5.672-1.547 3.656h-3l2.438-5.766L2.015 6.28z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-bold',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M13.5 15.516c.844 0 1.5-.656 1.5-1.5s-.656-1.5-1.5-1.5H9.984v3H13.5zm-3.516-9v3h3c.844 0 1.5-.656 1.5-1.5s-.656-1.5-1.5-1.5h-3zm5.625 4.265c1.313.609 2.156 1.922 2.156 3.422 0 2.109-1.594 3.797-3.703 3.797H6.984V3.984h6.281c2.25 0 3.984 1.781 3.984 4.031 0 1.031-.656 2.109-1.641 2.766z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-align-right',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3 3h18v2.016H3V3zm6 6V6.984h12V9H9zm-6 3.984v-1.969h18v1.969H3zm6 4.032V15h12v2.016H9zM3 21v-2.016h18V21H3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-align-left',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3 3h18v2.016H3V3zm0 18v-2.016h18V21H3zm0-8.016v-1.969h18v1.969H3zm12-6V9H3V6.984h12zM15 15v2.016H3V15h12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-align-justify',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3 3h18v2.016H3V3zm0 6V6.984h18V9H3zm0 3.984v-1.969h18v1.969H3zm0 4.032V15h18v2.016H3zM3 21v-2.016h18V21H3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'format-align-center',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3 3h18v2.016H3V3zm3.984 3.984h10.031V9H6.984V6.984zm-3.984 6v-1.969h18v1.969H3zM3 21v-2.016h18V21H3zm3.984-6h10.031v2.016H6.984V15z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folders',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M8.406 4.016l1.959 1.991h5.587c1.609-.006 2.081.963 2.081 2.275v5.759c-.034 1.147-.941 1.897-2.081 1.928H3.999c-1.25 0-1.984-.594-1.984-1.616v-8.75c0-.866.716-1.584 1.578-1.584h4.812z"></path><path d="M5.937 19.969h14.062c1.103 0 2-.897 2-2V9.981a1.95 1.95 0 0 0-1.95-1.95h-.05v9.938H3.937c0 1.103.897 2 2 2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.984 3.984L12 6h8.016c1.078 0 1.969.938 1.969 2.016V18c0 1.078-.891 2.016-1.969 2.016H3.985c-1.078 0-1.969-.938-1.969-2.016V6c0-1.078.891-2.016 1.969-2.016h6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-zip',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-1 6h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2v2h2v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-view',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14 13a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"></path><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-3.227 11.772c-.332.331-.771.513-1.238.513s-.906-.182-1.237-.512l-1.108-1.109a4.45 4.45 0 0 1-1.69.336A4.505 4.505 0 0 1 7 13c0-2.481 2.019-4.5 4.5-4.5S16 10.519 16 13c0 .598-.123 1.167-.335 1.689l1.108 1.109a1.752 1.752 0 0 1 0 2.474z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-video',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-10 11v-8l6 4-6 4z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-upload',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-7 6v5h-2v-5H8l4-4 4 4h-3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-special',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.953 17.016l-.797-3.328 2.578-2.25-3.375-.281L15 8.016l-1.359 3.141-3.375.281 2.578 2.25-.797 3.328L15 15.282zM20.016 6c1.078 0 1.969.938 1.969 2.016V18c0 1.078-.891 2.016-1.969 2.016H3.985c-1.078 0-1.969-.938-1.969-2.016V6c0-1.078.891-2.016 1.969-2.016h6L12.001 6h8.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-shared',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.984 17.016v-1.031c0-1.313-2.672-1.969-3.984-1.969s-3.984.656-3.984 1.969v1.031h7.969zM15 9c-1.078 0-2.016.938-2.016 2.016s.938 1.969 2.016 1.969 2.016-.891 2.016-1.969S16.078 9 15 9zm5.016-3c1.078 0 1.969.938 1.969 2.016V18c0 1.078-.891 2.016-1.969 2.016H3.985c-1.078 0-1.969-.938-1.969-2.016V6c0-1.078.891-2.016 1.969-2.016h6L12.001 6h8.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-settings',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14 13.5a2 2 0 1 1-3.999.001A2 2 0 0 1 14 13.5z"></path><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-3 7.909h-1.492a3.608 3.608 0 0 1-.358.877l.941.941-1.363 1.363-.942-.94a3.582 3.582 0 0 1-.876.357V18.5h-1.818v-1.492a3.582 3.582 0 0 1-.876-.357l-.942.94-1.363-1.363.941-.941a3.608 3.608 0 0 1-.358-.877H7v-1.818h1.492c.081-.312.203-.604.358-.876l-.941-.942 1.363-1.363.942.941c.272-.156.564-.277.876-.358V8.5h1.818v1.492c.312.081.604.202.876.358l.942-.941 1.363 1.363-.941.942c.155.272.277.564.358.876H17v1.819z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-refresh',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-8 12a4.966 4.966 0 0 1-3.355-1.316L7 18.5v-4h5l-1.767 1.414A2.954 2.954 0 0 0 12 16.5a2.996 2.996 0 0 0 2.816-2h2.083a5.009 5.009 0 0 1-4.899 4zm5-6h-5l1.767-1.414A2.954 2.954 0 0 0 12 10.5a2.996 2.996 0 0 0-2.816 2H7.101A5.009 5.009 0 0 1 12 8.5c1.295 0 2.466.506 3.355 1.316L17 8.5v4z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-network',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 2H3a1 1 0 0 0-1 1v12a2 2 0 0 0 2 2h7v3H8v2h8v-2h-3v-3h7a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"></path><path d="M20 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path><path d="M6 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-lock',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 10.869c-.551 0-1 .449-1 1V13.5h2v-1.631c0-.551-.449-1-1-1z"></path><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-4 12H8v-5h1v-1.631c0-1.654 1.346-3 3-3s3 1.346 3 3V13.5h1v5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-image',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-14 11l2.479-3.977 1.527 2.451 3.522-5.647L18 17.5H6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-home',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-5 6v5h-2v-3h-2v3H9v-5H7l5-4 5 4h-2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-favorite-star',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-4.5 12L12 16.002 8.5 18.5l1.5-4.003L7 12.5h3.5l1.507-4 1.493 4H17l-3 1.997 1.5 4.003z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-check',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-9 10.414l-3.707-3.707 1.414-1.414L11 14.086l4.293-4.293 1.414 1.414L11 16.914z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-bookmark',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-12 8l-2-2-2 2v-9h4v9z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-block',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M10.302 16.258A3.213 3.213 0 0 0 12 16.75a3.254 3.254 0 0 0 3.25-3.25c0-.624-.186-1.201-.492-1.697l-4.456 4.455z"></path><path d="M12 10.25a3.254 3.254 0 0 0-3.25 3.25c0 .624.186 1.202.492 1.697l4.456-4.455A3.222 3.222 0 0 0 12 10.25z"></path><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm-8 11.75c-2.619 0-4.75-2.131-4.75-4.75S9.381 8.75 12 8.75s4.75 2.131 4.75 4.75-2.131 4.75-4.75 4.75z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'folder-audio',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 6.5h-8l-1.447-1.895A2.002 2.002 0 0 0 8.764 3.5H3a1 1 0 0 0-1 1v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zM15 15a1.5 1.5 0 1 1-1.5-1.5v-2.771l-3.5 1.14V16a1.5 1.5 0 1 1-1.5-1.5v-3.175a.75.75 0 0 1 .518-.713l5-1.63c.227-.075.479-.035.673.105s.309.368.309.608V15z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'flag',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M13.985 5.126h5.956v10.571h-7.444l-.397-2.084H6.144v7.395H4.06V2.992h9.529z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'first-page',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3 2.994h2.966V21H3V2.994z"></path><path d="M21.066 18.891L18.957 21l-9-9 9-9 2.109 2.109L14.175 12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Fingerprint',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2a.506.506 0 0 1 .2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67a.49.49 0 0 1-.44.28zM3.5 9.72a.499.499 0 0 1-.41-.79c.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7s-.54.11-.7-.12a9.388 9.388 0 0 0-3.39-2.94c-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07a.47.47 0 0 1-.35-.15c-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39s-4.66 1.97-4.66 4.39c0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1a7.297 7.297 0 0 1-2.17-5.22c0-1.62 1.38-2.94 3.08-2.94s3.08 1.32 3.08 2.94c0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29a11.14 11.14 0 0 1-.73-3.96c0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 19,
      'height': 24,
      'tags': '',
      'name': 'filter',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="19" height="24" viewBox="0 0 19 24"><g class="fk-icon-wrapper"><path d="M16.88 4.984a.665.665 0 0 1-.148.739l-5.202 5.202v7.829a.681.681 0 0 1-.412.622.774.774 0 0 1-.264.052.626.626 0 0 1-.475-.201l-2.702-2.702a.673.673 0 0 1-.201-.475v-5.129L2.274 5.719a.664.664 0 0 1-.148-.739.685.685 0 0 1 .622-.412h13.507c.275 0 .517.169.622.412z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'files',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.8 2.031H6.062A1.821 1.821 0 0 0 4.243 3.85v12.322c0 1.003.816 1.819 1.819 1.819h9.091a1.821 1.821 0 0 0 1.819-1.819V6.203L12.8 2.031zm-1.284 5.453V2.94l4.547 4.544h-4.547z"></path><path d="M19.031 20.025H6.059c0 1.003.813 1.944 1.819 1.944h11.278a1.82 1.82 0 0 0 1.819-1.819V8.813c0-.959-.778-1.741-1.741-1.741h-.203v12.953z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'files-library',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M11.51 2H5.333c-.919 0-1.667.747-1.667 1.667v11.667c0 .919.747 1.667 1.667 1.667h8.333c.919 0 1.667-.747 1.667-1.667v-9.51L11.51 2.001zm-1.177 5V2.833L14.5 7h-4.167z"></path><path d="M16.167 17.833h-10V19.5h10c.919 0 1.667-.747 1.667-1.667V4.5h-1.667v13.333z"></path><path d="M18.667 20.333h-10V22h10c.919 0 1.667-.747 1.667-1.667V7h-1.667v13.333z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'files-landscape',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.033 4H4a1.78 1.78 0 0 0-1.778 1.778v8.889A1.78 1.78 0 0 0 4 16.445h12.444a1.78 1.78 0 0 0 1.778-1.778V7.189L15.033 4zm-1.255 4.444V4.888l3.556 3.556h-3.556z"></path><path d="M20 18.222H6.667V20H20a1.78 1.78 0 0 0 1.778-1.778V6.666H20v11.556z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'files-compare',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19.012 4.5h-6.178v15h7.5a1.67 1.67 0 0 0 1.667-1.667V7.488L19.013 4.5zM17 9.5V5.333L21.167 9.5H17z"></path><path d="M11.167 4.5H4.989L2.001 7.488v10.345A1.67 1.67 0 0 0 3.668 19.5h7.5v-15zM7 9.5H2.833L7 5.333V9.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'files-coding',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.013 2H5.637a1.819 1.819 0 0 0-1.818 1.818v16.364c0 1.004.815 1.818 1.818 1.818h12.727a1.819 1.819 0 0 0 1.818-1.818V6.169L16.013 2zm-5.188 14.815L9.54 18.1l-3.37-3.37 3.37-3.37 1.285 1.285L8.74 14.73l2.085 2.085zm3.636 1.285l-1.285-1.285 2.085-2.085-2.085-2.085 1.285-1.285 3.37 3.37-3.37 3.37zm.266-10.645V2.91l4.545 4.545h-4.545z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'files-2',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.5 2h-5a1.67 1.67 0 0 0-1.667 1.667V9.5c0 .919.747 1.667 1.667 1.667h5c.919 0 1.667-.747 1.667-1.667V3.667A1.67 1.67 0 0 0 9.5 2zm-5 3.333h3.333v.833H4.5v-.833zm5 3.334h-5v-.833h5v.833z"></path><path d="M19.5 2h-5a1.67 1.67 0 0 0-1.667 1.667V9.5c0 .919.747 1.667 1.667 1.667h5c.919 0 1.667-.747 1.667-1.667V3.667A1.67 1.67 0 0 0 19.5 2zm-5 3.333h3.333v.833H14.5v-.833zm5 3.334h-5v-.833h5v.833z"></path><path d="M9.5 12.833h-5A1.67 1.67 0 0 0 2.833 14.5v5.833C2.833 21.252 3.58 22 4.5 22h5c.919 0 1.667-.747 1.667-1.667V14.5A1.67 1.67 0 0 0 9.5 12.833zm-5 3.334h3.333V17H4.5v-.833zm5 3.333h-5v-.833h5v.833z"></path><path d="M19.5 12.833h-5a1.67 1.67 0 0 0-1.667 1.667v5.833c0 .919.747 1.667 1.667 1.667h5c.919 0 1.667-.747 1.667-1.667V14.5a1.67 1.67 0 0 0-1.667-1.667zm-5 3.334h3.333V17H14.5v-.833zm5 3.333h-5v-.833h5v.833z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14.853 3H6.975c-.994 0-2.019.966-2.019 1.956v14.056c0 .994.994 1.987 1.987 1.987h10.238a1.8 1.8 0 0 0 1.8-1.8V7.127l-4.128-4.128zm-1.272 5.4V3.9l4.5 4.5h-4.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-view',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M13.818 13.364a2.273 2.273 0 1 1-4.547 0 2.273 2.273 0 0 1 4.547 0z"></path><path d="M16.013 2H5.637a1.82 1.82 0 0 0-1.818 1.818v16.364A1.82 1.82 0 0 0 5.637 22h12.727a1.82 1.82 0 0 0 1.818-1.818V6.169L16.013 2zm.326 16.156c-.302.301-.701.466-1.125.466s-.824-.165-1.125-.465l-1.007-1.008a4.035 4.035 0 0 1-1.536.305c-2.255 0-4.091-1.835-4.091-4.091s1.835-4.091 4.091-4.091 4.091 1.835 4.091 4.091a4.06 4.06 0 0 1-.305 1.535l1.007 1.008c.62.619.62 1.629 0 2.249zM14.727 7.455V2.91l4.545 4.545h-4.545z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-video',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.013 2H5.637a1.82 1.82 0 0 0-1.818 1.818v16.364c0 1.004.815 1.818 1.818 1.818h12.727a1.82 1.82 0 0 0 1.818-1.818V6.169L16.013 2zM8.364 17.455v-7.273l7.273 3.639-7.273 3.634zm6.363-10V2.91l4.545 4.545h-4.545z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-upload2',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M4.605 18.874h14.79v2.134H4.605v-2.134zm4.219-2.134v-6.353H4.605L12 2.992l7.395 7.395h-4.219v6.353H8.823z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-upload',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.013 2H5.637a1.82 1.82 0 0 0-1.818 1.818v16.364A1.82 1.82 0 0 0 5.637 22h12.727a1.82 1.82 0 0 0 1.818-1.818V6.169L16.013 2zm-3.104 11.818v4.545h-1.818v-4.545H8.364L12 10.182l3.636 3.636h-2.727zm1.818-6.363V2.91l4.545 4.545h-4.545z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-tasks-checklist',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-7 17.414l-3.707-3.707 1.414-1.414L11 16.586l4.293-4.293 1.414 1.414L11 19.414zm0-8L7.293 7.707l1.414-1.414L11 8.586l4.293-4.293 1.414 1.414L11 11.414z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-note',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.414 2H6c-1.103 0-2 .898-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V6.586L15.414 2zM7 12h8v2H7v-2zm10 6H7v-2h10v2zM14 8V3l5 5h-5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-lock',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.909 12a.91.91 0 0 0-1.818 0v1.818h1.818V12z"></path><path d="M16.013 2H5.637a1.82 1.82 0 0 0-1.818 1.818v16.364A1.82 1.82 0 0 0 5.637 22h12.727a1.82 1.82 0 0 0 1.818-1.818V6.169L16.013 2zm-.377 16.364H8.363v-4.545h.909v-1.818c0-1.504 1.224-2.727 2.727-2.727s2.727 1.224 2.727 2.727v1.818h.909v4.545zm-.909-10.909V2.91l4.545 4.545h-4.545z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-landscape',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.414 4H4c-1.103 0-2 .898-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8.586L17.414 4zM16 10V5l5 5h-5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-landscape-new',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.414 4H4c-1.103 0-2 .898-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8.586L17.414 4zM5 10h9v2H5v-2zm13 6H5v-2h13v2zm-2-6V5l5 5h-5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-landscape-image',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.414 4H4c-1.103 0-2 .898-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8.586L17.414 4zM5 17l2.479-3.977 1.527 2.451 3.522-5.647L17 17H5zm11-7V5l5 5h-5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-graph',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.013 2H5.637a1.82 1.82 0 0 0-1.818 1.818v16.365c0 1.004.815 1.818 1.818 1.818h12.727a1.82 1.82 0 0 0 1.818-1.818V6.169L16.013 2zm1.442 17.273H6.546v-10h1.818v5.078l2.085-2.085a.908.908 0 0 1 1.285 0l2.085 2.085 2.085-2.085 1.285 1.285-2.727 2.727a.908.908 0 0 1-1.285 0l-2.085-2.085-2.727 2.727v.533h9.091v1.818zM14.727 7.455V2.91l4.545 4.545h-4.545z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-graph-2',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.013 2H5.637a1.819 1.819 0 0 0-1.818 1.818v16.365a1.82 1.82 0 0 0 1.818 1.818h12.727a1.819 1.819 0 0 0 1.818-1.818V6.169L16.013 2zm1.442 16.363l-10.909.003v-1.818l1.818-.001V8.363h1.818v8.184h.909v-3.638h1.818v3.637h.909v-5.455h1.818v5.455h1.818v1.818zM14.727 7.454V2.909l4.545 4.545h-4.545z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-favorite',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 16l1.629-7.329A4.97 4.97 0 0 1 12 5c0-1.131.39-2.162 1.022-3H6c-1.104 0-2 .898-2 2v16c0 1.103.896 2 2 2h12c1.103 0 2-.897 2-2v-4.8L17 14l-5 2z"></path><path d="M20 5a3 3 0 1 0-6 0c0 1.225.736 2.274 1.788 2.74L14 14l3-2 3 2-1.788-6.26A2.996 2.996 0 0 0 20 5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-favorite-star',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.013 2H5.637a1.82 1.82 0 0 0-1.818 1.818v16.364A1.82 1.82 0 0 0 5.637 22h12.727a1.82 1.82 0 0 0 1.818-1.818V6.169L16.013 2zm-.831 16.364L12 16.093l-3.182 2.271 1.364-3.638-2.727-1.816h3.182l1.37-3.636 1.357 3.636h3.182l-2.727 1.816 1.364 3.638zm-.455-10.909V2.91l4.545 4.545h-4.545z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-download2',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M4.605 18.874h14.79v2.134H4.605v-2.134zm14.79-9.529L12 16.74 4.605 9.345h4.219V2.992h6.353v6.353h4.219z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-download',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.013 2H5.637a1.82 1.82 0 0 0-1.818 1.818v16.364A1.82 1.82 0 0 0 5.637 22h12.727a1.82 1.82 0 0 0 1.818-1.818V6.169L16.013 2zM12 18.364l-3.636-3.636h2.727v-4.545h1.818v4.545h2.727L12 18.364zm2.727-10.909V2.91l4.545 4.545h-4.545z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-bookmark',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.414 2H6c-1.103 0-2 .898-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V6.586L15.414 2zM10 13l-2-2-2 2V4h4v9zm4-5V3l5 5h-5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'file-audio',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.013 2H5.637a1.82 1.82 0 0 0-1.818 1.818v16.364A1.82 1.82 0 0 0 5.637 22h12.727a1.82 1.82 0 0 0 1.818-1.818V6.169L16.013 2zm-.711 10.239l-2.393-.798v5.556a2.273 2.273 0 1 1-1.818-2.227V8.916l4.786 1.595-.575 1.726zm-.575-4.784V2.91l4.545 4.545h-4.545z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'feedback-warning',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M13.009 13.987V8.934h-1.956v5.053h1.956zm0 4.016v-1.962h-1.956v1.962h1.956zM2.988 20.962L12.016 3l9.025 17.962H2.988z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'feedback-stop',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3s.58-1.3 1.3-1.3c.72 0 1.3.58 1.3 1.3s-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'feedback-remove',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'feedback-error',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31A7.902 7.902 0 0 1 12 20zm6.31-3.1L7.1 5.69A7.902 7.902 0 0 1 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'feedback-attention',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.984 13.922V6.984h-1.969v6.938h1.969zm0 4.031v-2.016h-1.969v2.016h1.969zM12 2.016c5.531 0 9.984 4.453 9.984 9.984S17.531 21.984 12 21.984 2.016 17.531 2.016 12 6.469 2.016 12 2.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'favorite',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 20.164l-1.295-1.169c-4.594-4.176-7.6-6.89-7.6-10.273 0-2.756 2.13-4.886 4.886-4.886 1.545 0 3.048.752 4.009 1.879.96-1.128 2.464-1.879 4.009-1.879 2.756 0 4.886 2.13 4.886 4.886 0 3.383-3.007 6.139-7.6 10.315z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'favorite-o',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.084 17.7c4.26-3.842 7.057-6.389 7.057-8.978 0-1.796-1.336-3.09-3.132-3.09-1.378 0-2.714.877-3.174 2.088h-1.67c-.459-1.211-1.796-2.088-3.174-2.088-1.796 0-3.132 1.295-3.132 3.09 0 2.589 2.798 5.136 7.057 8.978l.084.084zm3.925-13.864c2.756 0 4.886 2.13 4.886 4.886 0 3.383-3.007 6.097-7.6 10.273L12 20.164l-1.295-1.128c-4.594-4.176-7.6-6.932-7.6-10.315 0-2.756 2.13-4.886 4.886-4.886 1.545 0 3.048.752 4.009 1.879.96-1.128 2.464-1.879 4.009-1.879z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'fast-rewind',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.234 12l8.531-6v12zm-.468 6l-8.531-6 8.531-6v12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'fast-forward',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.234 6l8.531 6-8.531 6V6zm-9 12V6l8.531 6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'eye',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3.428 12c1.059-1.641 2.512-3.047 4.253-3.941A4.952 4.952 0 0 0 7 10.571c0 2.756 2.244 5 5 5s5-2.244 5-5a4.96 4.96 0 0 0-.681-2.512c1.741.894 3.191 2.3 4.253 3.941-1.909 2.947-4.991 5-8.572 5s-6.663-2.053-8.572-5zm8.038-4.284c0-.291.247-.534.534-.534a3.407 3.407 0 0 1 3.394 3.394.542.542 0 0 1-.534.534.542.542 0 0 1-.534-.534 2.335 2.335 0 0 0-2.322-2.322.547.547 0 0 1-.537-.537zM2 12c0 .278.091.534.225.769C4.278 16.15 8.038 18.428 12 18.428s7.725-2.288 9.775-5.659c.134-.234.225-.491.225-.769s-.091-.534-.225-.769C19.722 7.859 15.962 5.572 12 5.572S4.275 7.86 2.225 11.231A1.544 1.544 0 0 0 2 12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'eye-slash',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.805 16.184l-.871-1.574a4.996 4.996 0 0 0 2.065-4.04c0-.881-.234-1.752-.681-2.511 1.741.893 3.192 2.299 4.252 3.94-1.161 1.797-2.801 3.304-4.766 4.185zm-4.341-8.47c0-.29.246-.536.536-.536a3.406 3.406 0 0 1 3.393 3.393c0 .29-.246.536-.536.536s-.536-.246-.536-.536A2.326 2.326 0 0 0 12 8.25a.544.544 0 0 1-.536-.536zM7.412 5.582c0 .022 0 .078.011.101 2.355 4.208 4.688 8.438 7.042 12.645l.547.994c.067.111.19.179.313.179.201 0 1.261-.647 1.496-.781a.359.359 0 0 0 .179-.313c0-.179-.379-.781-.491-.971 2.165-.982 3.984-2.656 5.268-4.665a1.432 1.432 0 0 0 0-1.54c-2.21-3.393-5.659-5.659-9.776-5.659-.67 0-1.351.067-2.009.19l-.603-1.083a.359.359 0 0 0-.313-.179c-.201 0-1.25.647-1.484.781a.354.354 0 0 0-.179.301zM7 10.571a4.993 4.993 0 0 0 3.214 4.665L7.089 9.633a5.318 5.318 0 0 0-.089.938zm-5 1.428c0 .29.078.524.224.77.346.569.781 1.116 1.216 1.619 2.188 2.511 5.201 4.04 8.56 4.04l-.826-1.474c-3.248-.279-6.004-2.254-7.746-4.955a11.585 11.585 0 0 1 3.147-3.281l-.703-1.25c-1.384.926-2.779 2.321-3.649 3.761-.145.246-.224.48-.224.77z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'eye-show',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 10a2 2 0 1 0 0 4 2 2 0 1 0 0-4z"></path><path d="M21.31 10.73C19.37 9.16 16.12 6.88 12 6.8c-4.09.08-7.34 2.36-9.27 3.93-.384.275-.652.69-.729 1.17L2 11.91c.01.403.198.761.488.998l.002.002c1.58 1.53 5 4.24 9.52 4.26 4.51 0 7.94-2.73 9.52-4.26.293-.238.482-.596.49-.999v-.001a1.789 1.789 0 0 0-.705-1.177l-.005-.003zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'eye-hide',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 16h-.007a4 4 0 0 1-3.867-5.028L8.12 11l-2.4-2.4a22.152 22.152 0 0 0-3.037 2.11l.037-.03a1.781 1.781 0 0 0-.719 1.221L2 11.91c.01.403.198.761.488.998l.002.002c1.58 1.53 5 4.24 9.52 4.26a11.423 11.423 0 0 0 2.072-.212l-.072.012L13 15.89c-.28.07-.602.111-.934.111l-.07-.001h.003z"></path><path d="M22 11.91a1.784 1.784 0 0 0-.734-1.176l-.006-.004C19.37 9.16 16.12 6.88 12 6.8a11.965 11.965 0 0 0-3.823.727L8.26 7.5l1.33 1.33a4 4 0 0 1 5.593 5.61l.007-.01 1.7 1.7a16.544 16.544 0 0 0 4.674-3.184l-.004.004c.271-.243.441-.594.441-.985L22 11.907v.003z"></path><path d="M10 12a2 2 0 0 0 2 2c.155-.005.302-.026.444-.063l-.014.003-2.4-2.4a1.915 1.915 0 0 0-.03.465V12z"></path><path d="M14 12a2 2 0 0 0-2-2 1.988 1.988 0 0 0-1.009.295L11 10.29 13.75 13a1.98 1.98 0 0 0 .25-.969v-.033V12z"></path><path d="M8.14 11.06L13 15.89a3.91 3.91 0 0 0 .666-.22l-.026.01-5.29-5.27a3.89 3.89 0 0 0-.205.623l-.005.027z"></path><path d="M4.56 6.63l.28-.28-.44-.44-.71.71 2 2 .55-.3z"></path><path d="M14.08 17l3.1 3.1.43-.43-2.83-2.83z"></path><path d="M13.62 15.68a3.67 3.67 0 0 1-.613.204l-.027.006 1.1 1.11.7-.15z"></path><path d="M8.35 10.41L6.29 8.35l-.55.3 2.4 2.4a3.91 3.91 0 0 1 .22-.666l-.01.026z"></path><path d="M6.29 8.35l.37-.19-1.82-1.82-.28.28z"></path><path d="M8.35 10.41l5.27 5.27c.145-.071.262-.138.376-.21l-.016.01L8.55 10c-.064.11-.131.245-.19.384l-.01.026z"></path><path d="M15.23 16.73l-.45.12 2.83 2.83.28-.28z"></path><path d="M6.66 8.16l-.37.19 2.06 2.06c.071-.149.137-.27.21-.387l-.01.017z"></path><path d="M14.78 16.85l.45-.12L14 15.48a3.938 3.938 0 0 1-.337.19l-.023.01z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'exit-to-app',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.984 3C20.062 3 21 3.938 21 5.016v13.969c0 1.078-.938 2.016-2.016 2.016H5.015c-1.125 0-2.016-.938-2.016-2.016v-3.984h2.016v3.984h13.969V5.016H5.015V9H2.999V5.016C2.999 3.938 3.89 3 5.015 3h13.969zm-8.906 12.609l2.578-2.625H3v-1.969h9.656L10.078 8.39l1.406-1.406L16.5 12l-5.016 5.016z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'equalizer',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.984 9h4.031v11.016h-4.031V9zm-12 11.016V12h4.031v8.016H3.984zm6 0V3.985h4.031v16.031H9.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'enlarge2',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M22 2v8.125L18.875 7l-3.75 3.75-1.875-1.875L17 5.125 13.875 2zM10.75 15.125L7 18.875 10.125 22H2v-8.125L5.125 17l3.75-3.75z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'enlarge',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2 2v8.125L5.125 7l3.75 3.75 1.875-1.875L7 5.125 10.125 2z"></path><path d="M22 2h-8.125L17 5.125l-3.75 3.75 1.875 1.875L18.875 7 22 10.125z"></path><path d="M22 22v-8.125L18.875 17l-3.75-3.75-1.875 1.875 3.75 3.75L13.875 22z"></path><path d="M2 22h8.125L7 18.875l3.75-3.75-1.875-1.875L5.125 17 2 13.875z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'email-open',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 12.984l8.25-5.156L12 3 3.75 7.828zm9.984-4.968V18c0 1.078-.891 2.016-1.969 2.016H3.984c-1.078 0-1.969-.938-1.969-2.016V8.016c0-.703.375-1.406.938-1.734L12 .985l9.047 5.297c.563.328.938 1.031.938 1.734z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'email-closed',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20.016 8.016V6L12 11.016 3.984 6v2.016L12 12.985zm0-4.032c1.078 0 1.969.938 1.969 2.016v12c0 1.078-.891 2.016-1.969 2.016H3.985c-1.078 0-1.969-.938-1.969-2.016V6c0-1.078.891-2.016 1.969-2.016h16.031z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'email-at',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path opacity=".9" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'eject',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 5.016L18.656 15H5.343zm-6.984 12h13.969v1.969H5.016v-1.969z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Education',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M5.778 13.049v3.556L12 20.001l6.222-3.396v-3.556L12 16.445l-6.222-3.396zM12 4L2.222 9.333 12 14.666l8-4.364v6.142h1.778V9.333L12 4z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'edit',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20.624 7.105l-1.818 1.818-3.73-3.73 1.818-1.818a1.014 1.014 0 0 1 1.399 0l2.331 2.331a1.014 1.014 0 0 1 0 1.399zM3.003 17.268L14.005 6.266l3.73 3.73L6.733 20.998h-3.73v-3.73z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'drag-handle-vertical',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9 3.984h2.016v16.031H9V3.984zm6 16.032h-2.016V3.985H15v16.031z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'drag-handle-horizontal',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3.984 15v-2.016h16.031V15H3.984zm16.032-6v2.016H3.985V9h16.031z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'dollar-circle',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 2C6.486 2 2 6.486 2 12c0 5.515 4.486 10 10 10 5.515 0 10-4.485 10-10 0-5.514-4.485-10-10-10zm3 8h-3.5a.5.5 0 0 0 0 1h1c1.379 0 2.5 1.122 2.5 2.5 0 1.208-.86 2.217-2 2.449V17h-2v-1H9v-2h3.5a.5.5 0 0 0 0-1h-1A2.503 2.503 0 0 1 9 10.5c0-1.207.86-2.217 2-2.449V7h2v1h2v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'desktop',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 4H4c-.978 0-1.778.8-1.778 1.778v10.667c0 .978.8 1.778 1.778 1.778h4.444v1.778h7.111v-1.778h4.444c.978 0 1.769-.8 1.769-1.778l.009-10.667c0-.978-.8-1.778-1.778-1.778zm0 12.444H4V5.777h16v10.667z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'dashboard',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.984 3H21v6h-8.016V3zm0 18v-9.984H21V21h-8.016zM3 21v-6h8.016v6H3zm0-8.016V3h8.016v9.984H3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'cut',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.984 3h3v.984L15 11.015l-2.016-2.016zM12 12.516c.281 0 .516-.234.516-.516s-.234-.516-.516-.516-.516.234-.516.516.234.516.516.516zm-6 7.5c1.078 0 2.016-.891 2.016-2.016S7.078 15.984 6 15.984 3.984 16.875 3.984 18 4.922 20.016 6 20.016zm0-12c1.078 0 2.016-.891 2.016-2.016S7.078 3.984 6 3.984 3.984 4.875 3.984 6 4.922 8.016 6 8.016zm3.656-.375l12.328 12.375V21h-3L12 14.016 9.656 16.36c.234.516.328 1.031.328 1.641 0 2.203-1.781 3.984-3.984 3.984s-3.984-1.781-3.984-3.984S3.797 14.017 6 14.017c.609 0 1.125.094 1.641.328l2.344-2.344-2.344-2.344c-.516.234-1.031.328-1.641.328-2.203 0-3.984-1.781-3.984-3.984S3.797 2.017 6 2.017s3.984 1.781 3.984 3.984c0 .609-.094 1.125-.328 1.641z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'cursor',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12.431 13.034l3.319 7.716-2.5 1.25-2.904-7.924L5.75 18.25V2l12.5 10-5.819 1.034z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'cursor-target',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M23 11h-3.069A8.01 8.01 0 0 0 13 4.069V1h-2v3.069A8.01 8.01 0 0 0 4.069 11H1v2h3.069A8.007 8.007 0 0 0 11 19.931V23h2v-3.069A8.01 8.01 0 0 0 19.931 13H23v-2zm-10 6.91V14h-2v3.91A6.008 6.008 0 0 1 6.09 13H10v-2H6.09A6.008 6.008 0 0 1 11 6.09V10h2V6.09A6.007 6.007 0 0 1 17.91 11H14v2h3.91A6.008 6.008 0 0 1 13 17.91z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'credit-card',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2 19c0 1.103.896 2 2 2h16c1.103 0 2-.897 2-2v-8H2v8zm13-6h4v2h-4v-2zM5 13h7v2H5v-2zm0 3h5v2H5v-2z"></path><path d="M20 5H4c-1.104 0-2 .898-2 2v2h20V7c0-1.102-.897-2-2-2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'credit-card-lock',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18.668 3.667c0-.92-.747-1.667-1.667-1.667H3.668c-.92 0-1.667.747-1.667 1.667v1.667h16.667V3.667z"></path><path d="M14.841 10.333h-2.007V8.666h3.333v1.078a5.844 5.844 0 0 1 1.667-.245c.283 0 .561.027.833.067V6.999H2v6.667c0 .919.747 1.667 1.667 1.667H12a5.825 5.825 0 0 1 2.84-5zm-6.174 2.5H4.5v-1.667h4.167v1.667zm1.667-2.5H4.501V8.666h5.833v1.667z"></path><path d="M21.167 14.5c0-1.837-1.495-3.333-3.333-3.333s-3.333 1.496-3.333 3.333a.832.832 0 0 0-.833.833v5.833c0 .461.372.833.833.833h6.667a.832.832 0 0 0 .833-.833v-5.833a.832.832 0 0 0-.833-.833zm-3.334-1.667A1.67 1.67 0 0 1 19.5 14.5h-3.333a1.67 1.67 0 0 1 1.667-1.667zm2.5 7.5h-5v-4.167h5v4.167z"></path><path d="M18.668 17.833a.833.833 0 1 1-1.666 0 .833.833 0 0 1 1.666 0z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'copyright',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 20.016c4.406 0 8.016-3.609 8.016-8.016S16.407 3.984 12 3.984 3.984 7.593 3.984 12 7.593 20.016 12 20.016zm0-18c5.531 0 9.984 4.453 9.984 9.984S17.531 21.984 12 21.984 2.016 17.531 2.016 12 6.469 2.016 12 2.016zm-.141 7.125c-1.442 0-1.875 1.276-1.875 2.719v.281c0 1.442.434 2.719 1.875 2.719.88 0 1.641-.537 1.641-1.406h1.781c0 .915-.495 1.603-1.031 2.063-.604.518-1.308.844-2.391.844-2.559 0-3.844-1.691-3.844-4.219v-.281c0-1.212.34-2.318.938-3 .619-.707 1.61-1.266 2.906-1.266 1.038 0 1.904.358 2.438.891.516.516.984 1.312.984 2.297H13.5c0-.234-.047-.422-.141-.609s-.188-.422-.328-.563a1.706 1.706 0 0 0-1.172-.469z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'context-section',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M10.5 15l-2.25-3-1.734 2.25-1.266-1.5L3.516 15H10.5zM12 9v6c0 1.078-.938 2.016-2.016 2.016h-6c-1.078 0-1.969-.938-1.969-2.016V9c0-1.078.891-2.016 1.969-2.016h6C11.062 6.984 12 7.922 12 9zm2.016 8.016V15h7.969v2.016h-7.969zm7.968-10.032V9h-7.969V6.984h7.969zm0 6h-7.969v-1.969h7.969v1.969z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'content-briefcase',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20.063 6.975h-4.062v-3a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v3H3.939c-1.094 0-1.938.712-1.938 2.031v10.031c0 1.181.844 1.938 2 1.938h16.031c1.188 0 1.969-.756 1.969-1.938v-10c0-1.194-.594-2.063-1.938-2.063zM10 5.037h4v1.938h-4V5.037zM21.006 12.5h-7.994v1.531h-2.044V12.5h-8v-1.313h18.038V12.5z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'content-box',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20 3.5H4c-1.104 0-2 .898-2 2v3h20v-3c0-1.103-.897-2-2-2z"></path><path d="M3 9.5v9c0 1.103.896 2 2 2h14c1.103 0 2-.897 2-2v-9H3zm12 4H9v-2h6v2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'content-box-filled',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M4 10h16v2H4v-2z"></path><path d="M4 7h16v2H4V7z"></path><path d="M4 4h16v2H4V4z"></path><path d="M10 13h4v2h-4v-2z"></path><path d="M20 13h-4a1 1 0 0 0-1 1v2H9v-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4c0 1.103.896 2 2 2h14c1.103 0 2-.897 2-2v-4a1 1 0 0 0-1-1z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'content-box-alt',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M10 4.975h6v2h-6v-2z"></path><path d="M8 7.975h8v2H8v-2z"></path><path d="M8 10.975h8v2H8v-2z"></path><path d="M20 13.975h-1v-11a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v11H4a1 1 0 0 0-1 1v5c0 1.103.896 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0-1-1zm-13-10h10v10h-1a1 1 0 0 0-1 1v1H9v-1a1 1 0 0 0-1-1H7v-10z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'compass',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM3.875 12a8.125 8.125 0 0 1 13.663-5.945L9.5 9.5l-3.445 8.038A8.092 8.092 0 0 1 3.875 12zm9.554 1.429l-5.002 2.144 2.144-5.002 2.858 2.858zM12 20.125a8.096 8.096 0 0 1-5.537-2.18l8.038-3.445 3.445-8.038a8.125 8.125 0 0 1-5.945 13.662z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'coins',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M8.25 14.5h.833c.115 0 .225.016.334.035a8.489 8.489 0 0 1-.739-.868H8.25a.418.418 0 0 0 0 .834z"></path><path d="M11.167 16.583A2.085 2.085 0 0 1 9.5 18.624v.876H7.833v-.833H6.166V17h2.917a.417.417 0 0 0 0-.834H8.25a2.085 2.085 0 0 1-2.083-2.083 2.08 2.08 0 0 1 1.567-2.01 8.291 8.291 0 0 1-.722-3.192C4.133 9.619 2 12.224 2 15.333A6.667 6.667 0 0 0 8.667 22c3.109 0 5.713-2.132 6.451-5.011a8.268 8.268 0 0 1-4.114-1.212c.106.249.163.52.163.806z"></path><path d="M15.333 2a6.667 6.667 0 1 0 0 13.334 6.667 6.667 0 0 0 0-13.334zm2.5 5h-2.917a.418.418 0 0 0 0 .834h.833c1.149 0 2.083.935 2.083 2.083a2.085 2.085 0 0 1-1.667 2.041v.876h-1.667v-.833h-1.667v-1.667h2.917a.417.417 0 0 0 0-.834h-.833a2.085 2.085 0 0 1-2.083-2.083c0-1.006.717-1.848 1.667-2.041V4.5h1.667v.833h1.667V7z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'coin-receive',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M20.364 15.047a.8.8 0 0 0-.915-.42l-6.147 1.536-1.954-.978.82-.82a.806.806 0 0 0 0-1.139l-.805-.805a.804.804 0 0 0-.867-.179l-3.724 1.491v5.702l6.336.792a.88.88 0 0 0 .355-.035l7.241-2.414c.221-.073.4-.241.488-.455s.08-.46-.023-.669l-.805-1.609z"></path><path d="M5.162 12.993H3.553a.806.806 0 0 0-.805.805v5.632c0 .445.36.805.805.805h1.609c.445 0 .805-.36.805-.805v-5.632a.806.806 0 0 0-.805-.805z"></path><path d="M16.275 6.179h2.816V4.57h-1.609v-.805h-1.609v.845a2.014 2.014 0 0 0-1.609 1.971c0 1.109.903 2.011 2.011 2.011h.805c.221 0 .402.181.402.402s-.181.402-.402.402h-2.816v1.609h1.609v.805h1.609v-.845a2.014 2.014 0 0 0 1.609-1.971 2.014 2.014 0 0 0-2.011-2.011h-.805c-.221 0-.402-.181-.402-.402s.181-.402.402-.402z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 30,
      'height': 24,
      'tags': '',
      'name': 'code',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="24" viewBox="0 0 30 24"><g class="fk-icon-wrapper"><path d="M18.703 16.32l1.851 1.851 6.172-6.172-6.172-6.172-1.851 1.851 4.32 4.32z"></path><path d="M11.297 7.68L9.446 5.829l-6.172 6.172 6.172 6.172 1.851-1.851-4.32-4.32z"></path><path d="M16.182 5.028l1.34.365-3.703 13.578-1.34-.365 3.703-13.578z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'cloud',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M17.982 10.4c2.096.152 3.772 1.905 3.772 4.039a4.082 4.082 0 0 1-4.077 4.077H7.122a4.862 4.862 0 0 1-4.877-4.877A4.872 4.872 0 0 1 6.589 8.8C7.618 6.857 9.637 5.485 12 5.485c2.972 0 5.411 2.096 5.982 4.915z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'cloud-upload',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M13.638 12.8h2.439L12 8.761 7.923 12.8h2.439v3.277h3.277V12.8zm4.344-2.4c2.096.152 3.772 1.905 3.772 4.039a4.082 4.082 0 0 1-4.077 4.077H7.122a4.862 4.862 0 0 1-4.877-4.877A4.872 4.872 0 0 1 6.589 8.8C7.618 6.857 9.637 5.485 12 5.485c2.972 0 5.411 2.096 5.982 4.915z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'cloud-download',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.077 12.8h-2.439V9.561h-3.277V12.8H7.922l4.077 4.077zm1.905-2.4c2.096.152 3.772 1.905 3.772 4.039a4.082 4.082 0 0 1-4.077 4.077H7.122a4.862 4.862 0 0 1-4.877-4.877A4.872 4.872 0 0 1 6.589 8.8C7.618 6.857 9.637 5.485 12 5.485c2.972 0 5.411 2.096 5.982 4.915z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'cloud-done',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M10.362 16.077l5.373-5.373-1.143-1.143-4.229 4.191-1.677-1.677-1.143 1.143zm7.62-5.677c2.096.152 3.772 1.905 3.772 4.039a4.082 4.082 0 0 1-4.077 4.077H7.122a4.862 4.862 0 0 1-4.877-4.877A4.872 4.872 0 0 1 6.589 8.8C7.618 6.857 9.637 5.485 12 5.485c2.972 0 5.411 2.096 5.982 4.915z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'Closed-caption',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'close',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M3.207 5.435L5.37 3.272 19.788 17.69l-2.163 2.163L3.207 5.435z"></path><path d="M3.219 17.697L17.634 3.292l2.141 2.142L5.36 19.839l-2.141-2.142z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'clock',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'circle-filled',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19.323 12c0 4.022-3.263 7.284-7.284 7.284S4.755 16.021 4.755 12s3.263-7.284 7.284-7.284S19.323 7.979 19.323 12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'chevron-up',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2 15.92l2 2 8-8 8 8 2-2-10-10-10 10z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'chevron-right',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M8.08 2l-2 2 8 8-8 8 2 2 10-10-10-10z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'chevron-left',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15.92 22l2-2-8-8 8-8-2-2-10 10 10 10z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'chevron-down',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M22 8.08l-2-2-8 8-8-8-2 2 10 10 10-10z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 21,
      'height': 24,
      'tags': '',
      'name': 'chevron-circle-up',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 21 24"><g class="fk-icon-wrapper"><path d="M14.784 14.621l1.1-1.1a.683.683 0 0 0 0-.971l-4.898-4.898a.683.683 0 0 0-.971 0L5.117 12.55a.683.683 0 0 0 0 .971l1.1 1.1c.27.27.702.27.971 0l3.312-3.312 3.312 3.312c.27.27.702.27.971 0zM18.786 12c0 4.575-3.711 8.286-8.286 8.286S2.214 16.575 2.214 12 5.925 3.714 10.5 3.714 18.786 7.425 18.786 12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 21,
      'height': 24,
      'tags': '',
      'name': 'chevron-circle-right',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 21 24"><g class="fk-icon-wrapper"><path d="M9.951 17.384l4.898-4.898a.683.683 0 0 0 0-.971L9.951 6.617a.683.683 0 0 0-.971 0l-1.1 1.1a.683.683 0 0 0 0 .971L11.192 12 7.88 15.312a.683.683 0 0 0 0 .971l1.1 1.1c.27.27.702.27.971 0zM18.786 12c0 4.575-3.711 8.286-8.286 8.286S2.214 16.575 2.214 12 5.925 3.714 10.5 3.714 18.786 7.425 18.786 12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 21,
      'height': 24,
      'tags': '',
      'name': 'chevron-circle-left',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 21 24"><g class="fk-icon-wrapper"><path d="M12.022 17.384l1.1-1.1a.683.683 0 0 0 0-.971L9.81 12.001l3.312-3.312a.683.683 0 0 0 0-.971l-1.1-1.1a.683.683 0 0 0-.971 0l-4.898 4.898a.683.683 0 0 0 0 .971l4.898 4.898c.27.27.702.27.971 0zM18.786 12c0 4.575-3.711 8.286-8.286 8.286S2.214 16.575 2.214 12 5.925 3.714 10.5 3.714 18.786 7.425 18.786 12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 21,
      'height': 24,
      'tags': '',
      'name': 'chevron-circle-down',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 21 24"><g class="fk-icon-wrapper"><path d="M10.986 16.348l4.898-4.898a.683.683 0 0 0 0-.971l-1.1-1.1a.683.683 0 0 0-.971 0l-3.312 3.312-3.312-3.312a.683.683 0 0 0-.971 0l-1.1 1.1a.683.683 0 0 0 0 .971l4.898 4.898c.27.27.702.27.971 0zm7.8-4.348c0 4.575-3.711 8.286-8.286 8.286S2.214 16.575 2.214 12 5.925 3.714 10.5 3.714 18.786 7.425 18.786 12z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'checkmark',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M21.748 6.398l-1.601-1.601a.754.754 0 0 0-1.067 0l-9.596 9.596-4.565-4.597a.754.754 0 0 0-1.067 0l-1.6 1.601a.754.754 0 0 0 0 1.067l6.693 6.738a.754.754 0 0 0 1.067 0L21.748 7.465a.754.754 0 0 0 0-1.067z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'checkmark-0',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9.738 20.008l-7.854-7.731 3.897-3.835 3.957 3.896 8.481-8.347 3.897 3.835L9.739 20.008zm-5.715-7.729l5.715 5.625L19.977 7.827l-1.758-1.73-8.481 8.347-3.957-3.896-1.757 1.73z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'chat',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19 3H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1.7v6l6-6H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'chat-conversation',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M10.74 13.18a4 4 0 0 1-4-4v-.45H5a2 2 0 0 0-2 2v4.17a2 2 0 0 0 2 2h.51V21l4.09-4.09h3.65a2 2 0 0 0 2-2l-1.71-1.71z"></path><path d="M15.27 10.74v1.31l3.21 3.21v-4.08H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-8.26a2 2 0 0 0-2 2v3.73H13.27a2 2 0 0 1 2 2v.011-.001z"></path><path d="M10.74 11.18h3.65l.88.88v-1.32a2 2 0 0 0-2-2H8.73v.44a2 2 0 0 0 2 2h.011-.001z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'cast',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2.208 10.208C7.583 10.208 12 14.583 12 20h-1.792c0-4.417-3.583-8-8-8v-1.792zm0 3.584c3.458 0 6.25 2.75 6.25 6.208H6.666c0-2.458-2-4.458-4.458-4.458v-1.75zm0 3.541A2.686 2.686 0 0 1 4.875 20H2.208v-2.667zM20 4c.958 0 1.792.833 1.792 1.792v12.417c0 .958-.833 1.792-1.792 1.792h-6.208v-1.792H20V5.792H4v2.667H2.208V5.792C2.208 4.834 3.041 4 4 4h16z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'caret-up',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M18 15H6l6-6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'caret-right',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M9 18V6l6 6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'caret-left',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15 6v12l-6-6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'caret-down',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M6 9h12l-6 6z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'calendar',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19 5h-1V3.05h-3V5H9V3.05H5.95V5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-2.94-1h1v2.86h-1zM7 4h1v2.86H7zm12 15H5V9h14z"></path><path d="M6.95 10.94h2.06V13H6.95v-2.06z"></path><path d="M11 10.94h2.06V13H11v-2.06z"></path><path d="M14.97 10.94h2.06V13h-2.06v-2.06z"></path><path d="M6.95 14.97h2.06v2.06H6.95v-2.06z"></path><path d="M11 14.97h2.06v2.06H11v-2.06z"></path><path d="M14.97 14.97h2.06v2.06h-2.06v-2.06z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'calendar-remove',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19 5h-1V3.05h-3V5H9V3.05H5.95V5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-2.94-1h1v2.86h-1zM7 4h1v2.86H7zm12 15H5V9h14z"></path><path d="M8.85 13H15v1.89H8.85V13z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'calendar-note',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19 5h-1V3.05h-3V5H9V3.05H5.95V5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-2.94-1h1v2.86h-1zM7 4h1v2.86H7zm12 15H5V9h14z"></path><path d="M7.03 11.03h9.98v2H7.03v-2z"></path><path d="M7.03 15.09H12v2H7.03v-2z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'calendar-delete',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19 5h-1V3.05h-3V5H9V3.05H5.95V5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-2.94-1h1v2.86h-1zM7 4h1v2.86H7zm12 15H5V9h14z"></path><path d="M10.26 16.94l1.66-1.66 1.67 1.67 1.45-1.45-1.67-1.67 1.58-1.58-1.33-1.33-1.58 1.57-1.59-1.59L9 12.35l1.59 1.6-1.66 1.66 1.33 1.33z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'calendar-check',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M16.559 11.716l-6 5.95-3.15-3.178 1.081-1.081 2.109 2.109 4.869-4.859z"></path><path d="M19 5h-1V3.05h-3V5H9V3.05H5.95V5H5c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zm-2.941-1h1v2.859h-1V4zM7 4h1v2.859H7V4zm12 15H5V9h14v10z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'calendar-blank',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19 5h-1V3.05h-3V5H9V3.05H5.95V5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-2.94-1h1v2.86h-1zM7 4h1v2.86H7zm12 15H5V9h14z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'calendar-add',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M19 5h-1V3.05h-3V5H9V3.05H5.95V5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-2.94-1h1v2.86h-1zM7 4h1v2.86H7zm12 15H5V9h14z"></path><path d="M10.87 16.93h2.06v-2.04H15V13h-2.07v-2.06h-2.06V13H8.85v1.89h2.02v2.04z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'calculator',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M14 5h2v2h-2V5z"></path><path d="M17 2H7c-1.103 0-2 .898-2 2v16c0 1.103.897 2 2 2h10c1.104 0 2-.897 2-2V4c0-1.102-.896-2-2-2zM8 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm.999-5H7V4h10l-.001 4z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'business-graph-pie',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M22.002 11c0-4.961-4.037-9-9-9h-1v10h10v-1z"></path><path d="M10 13.001V4.062l-.124.016A9.006 9.006 0 0 0 2 13c0 4.963 4.037 9 9 9a8.99 8.99 0 0 0 5.775-2.101l.066-.057L10 13.001z"></path><path d="M13.587 14.001l7.069 7.071.708-.708A8.942 8.942 0 0 0 24 14.001H13.587z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'business-graph-bar',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2 20h20v2H2v-2z"></path><path d="M10 13h4v6h-4v-6z"></path><path d="M16 7h4v12h-4V7z"></path><path d="M4 11h4v8H4v-8z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'business-graph-bar-status',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M5 7c.365 0 .704-.105.999-.277l4.002 2.288A2 2 0 0 0 14 9c0-.178-.031-.346-.074-.511l4.563-4.563c.163.044.333.074.511.074a2 2 0 1 0-2-2c0 .178.031.348.074.513l-4.563 4.562A1.996 1.996 0 0 0 12 7c-.365 0-.704.105-.999.278L6.999 4.992A2 2 0 1 0 5 7z"></path><path d="M2 22h20v2H2v-2z"></path><path d="M10 15h4v6h-4v-6z"></path><path d="M16 9h4v12h-4V9z"></path><path d="M4 13h4v8H4v-8z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'business-graph-bar-increase',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2 22h20v2H2v-2z"></path><path d="M10 13h4v8h-4v-8z"></path><path d="M16 9h4v12h-4V9z"></path><path d="M4 17h4v4H4v-4z"></path><path d="M3.707 14.708L15 3.415V6h2V0h-6v2h2.586L2.293 13.293z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'business-graph-bar-decrease',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M2 22h20v2H2v-2z"></path><path d="M10 13h4v8h-4v-8z"></path><path d="M4 9h4v12H4V9z"></path><path d="M16 17h4v4h-4v-4z"></path><path d="M20 9v2.587L8.707.294 7.293 1.708 18.586 13H16v2h6V9z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'border-vertical',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15 12.984v-1.969h2.016v1.969H15zM15 21v-2.016h2.016V21H15zm0-15.984V3h2.016v2.016H15zM18.984 9V6.984H21V9h-2.016zm0-6H21v2.016h-2.016V3zm0 9.984v-1.969H21v1.969h-2.016zm0 8.016v-2.016H21V21h-2.016zm-7.968 0V3h1.969v18h-1.969zm7.968-3.984V15H21v2.016h-2.016zm-12-12V3H9v2.016H6.984zM3 17.016V15h2.016v2.016H3zM3 21v-2.016h2.016V21H3zm0-8.016v-1.969h2.016v1.969H3zm3.984 0v-1.969H9v1.969H6.984zm0 8.016v-2.016H9V21H6.984zM3 5.016V3h2.016v2.016H3zM3 9V6.984h2.016V9H3z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'border-top',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M15 12.984v-1.969h2.016v1.969H15zM18.984 21v-2.016H21V21h-2.016zM11.016 9V6.984h1.969V9h-1.969zM15 21v-2.016h2.016V21H15zm3.984-3.984V15H21v2.016h-2.016zM3 3h18v2.016H3V3zm15.984 9.984v-1.969H21v1.969h-2.016zm0-3.984V6.984H21V9h-2.016zm-7.968 8.016V15h1.969v2.016h-1.969zM3 9V6.984h2.016V9H3zm0 3.984v-1.969h2.016v1.969H3zM3 21v-2.016h2.016V21H3zm0-3.984V15h2.016v2.016H3zM11.016 21v-2.016h1.969V21h-1.969zm0-8.016v-1.969h1.969v1.969h-1.969zm-4.032 0v-1.969H9v1.969H6.984zm0 8.016v-2.016H9V21H6.984z"></path></g></svg>',
      'set_id': 1
    }, {
      'style': 'colored',
      'width': 24,
      'height': 24,
      'tags': '',
      'name': 'border-right',
      'content': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="fk-icon-wrapper"><path d="M11.016 9V6.984h1.969V9h-1.969zm0-3.984V3h1.969v2.016h-1.969zm0 7.968v-1.969h1.969v1.969h-1.969zM15 5.016V3h2.016v2.016H15zM15 21v-2.016h2.016V21H15zm3.984-18H21v18h-2.016V3zM15 12.984v-1.969h2.016v1.969H15zm-3.984 4.032V15h1.969v2.016h-1.969zM3 9V6.984h2.016V9H3zm0 8.016V15h2.016v2.016H3zm0-4.032v-1.969h2.016v1.969H3zM11.016 21v-2.016h1.969V21h-1.969zM3 21v-2.016h2.016V21H3zm3.984-8.016v-1.969H9v1.969H6.984zm0-7.968V3H9v2.016H6.984zM3 5.016V3h2.016v2.016H3zM6.984 21v-2.016H9V21H6.984z"></path></g></svg>',
      'set_id': 1
    }],
    'sets': [],
    'groups': [] // console.log('Testing: '+theUcons.icons[1].name)

  };
  uconsObjArray = theUcons.icons;
  if (options.consoleMessages === true) console.info('Using: ' + iconDOMElement + '[' + injAttr + ']' + ' to find injectable elements...'); // look at the icon src attribute for the svg icon name and concat
  // with surrounding text in the arrObjSVGDatas

  docEls.forEach(function (node) {
    arrObjSVGData = node;
    attyVal = arrObjSVGData.getAttribute([injAttr]);
    svgId = attyVal; // search the array for the id

    function searchIDInSVGs(svgId, uconsObjArray) {
      for (var j = 0; j < uconsObjArray.length; j++) {
        if (uconsObjArray[j].name === svgId) {
          console.log("".concat(uconsObjArray[j].name, " = ").concat(svgId));
          return j;
        }
      }

      return -1;
    } // call the function above passing the array and id needed


    svgIndex = searchIDInSVGs(svgId, uconsObjArray);

    if (svgIndex === -1) {
      // handle empty/incorrect value
      svgTag = '<!-- Could not find ' + svgId + '} -->';
      svgTagStatus = 'failed';
    } else {
      svgTag = uconsObjArray[svgIndex].content;
      svgTagStatus = 'success';
    } // assign values to these variables in preparation to build the svg icon


    el = document.querySelector(iconDOMElement + '[' + injAttr + ']');
    newEl = document.createElement('svg');
    newEl.innerHTML = svgTag;
    el.parentNode.replaceChild(newEl, el);
    newEl.setAttribute('class', arrObjSVGData.getAttribute('class')); // create quick report on successful injections

    injectCounter.push(svgId, svgTagStatus);
    if (options.consoleMessages == true) console.info(svgId, svgTagStatus);
  }); // finish report globally

  for (var i = 0; i < injectCounter.length; ++i) {
    if (injectCounter[i] == 'success') injectCount++;
  }

  totalInjectableEls = docEls.length;
  successfulInjects = injectCount;
  if (options.consoleMessages == true) console.info('Successfully injected ' + successfulInjects + ' out of ' + totalInjectableEls + ' requested. See injectCounter array below.');
  if (options.consoleMessages == true) console.info(JSON.stringify(injectCounter)); // optional create a list of icons
  // check to see if gallery enabled

  window.onload = function () {
    if (initGallery == true) {
      UconGallery(theUcons);
    } else {
      return false;
    }
  };

  function UconGallery(uconsObjArray) {
    // Create the list element:
    list = document.getElementById(options.UconGalleryID);

    for (var i = 0; i < uconsObjArray.length; i++) {
      // Create the list item:
      divi = document.createElement('div');
      item = document.createElement('div');
      divi.className = 'fk-icon-box fk-bp';
      item.className = 'fk-icon-box__container fk-bp';
      gallerySVG = uconsObjArray[i].content; // original line below was: new RegExp(/(id="(.*?)(\"))/g.exec(gallerySVG)[2])
      //  change due to eslint unnecessary escape character \ */
      // idRegex = new RegExp(/(id="(.*?)("))/g.exec(gallerySVG)[2])
      // svgName = gallerySVG.match(idRegex)

      svgName = uconsObjArray[i].name; // console.log(svgName)
      // Set divi contents:

      divi.innerHTML = '<div class="fk-icon-sizer">' + gallerySVG + '</div><div class="fk-icon-box__title text-center"><span class="h4">' + svgName + '</span></div>'; // Add it to the list:

      list.appendChild(item);
      item.appendChild(divi); // return list
    }

    if (options.consoleMessages === true) console.info('the ucon gallery option says' + showGallery);
  }

  if (options.consoleMessages === true) console.info('Thank you for using the Ucon Icon Family. Powered by:', 'The Fannie Mae ' + NAME, 'Version: ' + VERSION);
  return UconInjector;
}(window, document);

module.exports = UconInjector;

},{}]},{},[2,1,6,3,4,5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdC9hc3NldHMvcG9seWZpbGxzL3N2Zy1wb2xseWZpbGwtNEUuanMiLCJzcmMvamF2YXNjcmlwdC9hc3NldHMvcG9seWZpbGxzL3N2Zy11c2Utc3ltZGVmLmpzIiwic3JjL2phdmFzY3JpcHQvY29tcG9uZW50cy9hY2NvcmRpb24uanMiLCJzcmMvamF2YXNjcmlwdC9jb21wb25lbnRzL3NpZGViYXItbmF2aWdhdG9yLmpzIiwic3JjL2phdmFzY3JpcHQvY29tcG9uZW50cy90YWJzLmpzIiwic3JjL2phdmFzY3JpcHQvY29tcG9uZW50cy91Y29uLWluamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7Ozs7O0FBWUEsU0FBUyxLQUFULENBQWUsTUFBZixFQUF1QixHQUF2QixFQUE0QixNQUE1QixFQUFvQztBQUNsQztBQUNBLE1BQUksTUFBSixFQUFZO0FBQ1Y7QUFDQSxRQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsc0JBQVQsRUFBZixDQUZVLENBSVY7O0FBQ0EsUUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBSixDQUFpQixTQUFqQixDQUFELElBQWdDLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFNBQXBCLENBQTlDLENBTFUsQ0FPVjs7QUFDQSxRQUFJLE9BQUosRUFBYTtBQUNYLE1BQUEsR0FBRyxDQUFDLFlBQUosQ0FBaUIsU0FBakIsRUFBNEIsT0FBNUI7QUFDRCxLQVZTLENBWVY7OztBQUNBLFFBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFQLENBQWlCLElBQWpCLENBQVosQ0FiVSxDQWVWOztBQUNBLFdBQU8sS0FBSyxDQUFDLFVBQU4sQ0FBaUIsTUFBeEIsRUFBZ0M7QUFDOUIsTUFBQSxRQUFRLENBQUMsV0FBVCxDQUFxQixLQUFLLENBQUMsVUFBM0I7QUFDRCxLQWxCUyxDQW9CVjs7O0FBQ0EsSUFBQSxN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QUNBLE1BQUEsSUFBSSxDQUFDLFNBQUwsR0FBaUIsOEJBQWpCO0FBQ0EsTUFBQSxVQUFVLEdBQUcsYUFBYSxDQUFDLENBQUQsQ0FBYixDQUFpQixPQUE5QixDQU42QyxDQU83QztBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFBLE9BQU8sR0FBRyxhQUFhLENBQUMsQ0FBRCxDQUFiLENBQWlCLElBQTNCLENBWDZDLENBWTdDO0FBQ0E7O0FBQ0EsTUFBQSxJQUFJLENBQUMsU0FBTCxHQUFpQixnQ0FBZ0MsVUFBaEMsR0FBNkMscUVBQTdDLEdBQXFILE9BQXJILEdBQStILGVBQWhKLENBZDZDLENBZ0I3Qzs7QUFDQSxNQUFBLElBQUksQ0FBQyxXQUFMLENBQWlCLElBQWpCO0FBQ0EsTUFBQSxJQUFJLENBQUMsV0FBTCxDQUFpQixJQUFqQixFQWxCNkMsQ0FtQjdDO0FBQ0Q7O0FBRUQsUUFBSSxPQUFPLENBQUMsZUFBUixLQUE0QixJQUFoQyxFQUFzQyxPQUFPLENBQUMsSUFBUixDQUFhLGlDQUFpQyxXQUE5QztBQUN2Qzs7QUFHRCxNQUFJLE9BQU8sQ0FBQyxlQUFSLEtBQTRCLElBQWhDLEVBQXNDLE9BQU8sQ0FBQyxJQUFSLENBQ3BDLHVEQURvQyxFQUVwQyxvQkFBb0IsSUFGZ0IsRUFHcEMsY0FBYyxPQUhzQjtBQUt0QyxTQUFPLFlBQVA7QUFFRCxDQTF5RmtCLENBMHlGakIsTUExeUZpQixFQTB5RlQsUUExeUZTLENBQW5COztBQTJ5RkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiFcbiAqIEBzdW1tYXJ5OiBQYXJ0IG9mIHRoZSBGYW5uaWUgTWFlIC0gQmx1cHJpbnQgRGVzaWduIFN5c3RlbVxuICogQGRlc2NyaXB0aW9uOiBVc2Ugc3ltYm9scyBhbmQgZGVmIGluIHN2ZyBmaWxlcy5cbiAqIEBsaW5rOmh0dHBzOi8vYml0YnVja2V0Ojg0NDMvc2NtL2Zsay9jeGQtZHMtZnJhbWVraXQuZ2l0XG4gKiBAZmlsZTogc3ZnLXBvbGx5ZmlsbC00RS5qcy5qc1xuICogQGF1dGhvcjogSGVhdGggU2h1bHRzXG4gKiBAdmVyc2lvbjogdjEuNC4wXG4gKiBAc2luY2U6IDEuMC4wXG4gKiBAY29weXJpZ2h0OiBDb3B5cmlnaHQgKGMpIDIwMTggRmFubmllIE1hZSwgSW5jLlxuICogQGxpY2Vuc2U6IE1JVFxuICovXG5cbmZ1bmN0aW9uIGVtYmVkKHBhcmVudCwgc3ZnLCB0YXJnZXQpIHtcbiAgLy8gaWYgdGhlIHRhcmdldCBleGlzdHNcbiAgaWYgKHRhcmdldCkge1xuICAgIC8vIGNyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IHRvIGhvbGQgdGhlIGNvbnRlbnRzIG9mIHRoZSB0YXJnZXRcbiAgICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAvLyBjYWNoZSB0aGUgY2xvc2VzdCBtYXRjaGluZyB2aWV3Qm94XG4gICAgdmFyIHZpZXdCb3ggPSAhc3ZnLmhhc0F0dHJpYnV0ZSgndmlld0JveCcpICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnKTtcblxuICAgIC8vIGNvbmRpdGlvbmFsbHkgc2V0IHRoZSB2aWV3Qm94IG9uIHRoZSBzdmdcbiAgICBpZiAodmlld0JveCkge1xuICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIHZpZXdCb3gpO1xuICAgIH1cblxuICAgIC8vIGNsb25lIHRoZSB0YXJnZXRcbiAgICB2YXIgY2xvbmUgPSB0YXJnZXQuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgLy8gY29weSB0aGUgY29udGVudHMgb2YgdGhlIGNsb25lIGludG8gdGhlIGZyYWdtZW50XG4gICAgd2hpbGUgKGNsb25lLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjbG9uZS5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICAvLyBhcHBlbmQgdGhlIGZyYWdtZW50IGludG8gdGhlIHN2Z1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9hZHJlYWR5c3RhdGVjaGFuZ2UoeGhyKSB7XG4gIC8vIGxpc3RlbiB0byBjaGFuZ2VzIGluIHRoZSByZXF1ZXN0XG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaWYgdGhlIHJlcXVlc3QgaXMgcmVhZHlcbiAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgIC8vIGdldCB0aGUgY2FjaGVkIGh0bWwgZG9jdW1lbnRcbiAgICAgIHZhciBjYWNoZWREb2N1bWVudCA9IHhoci5fY2FjaGVkRG9jdW1lbnQ7XG5cbiAgICAgIC8vIGVuc3VyZSB0aGUgY2FjaGVkIGh0bWwgZG9jdW1lbnQgYmFzZWQgb24gdGhlIHhociByZXNwb25zZVxuICAgICAgaWYgKCFjYWNoZWREb2N1bWVudCkge1xuICAgICAgICBjYWNoZWREb2N1bWVudCA9IHhoci5fY2FjaGVkRG9jdW1lbnQgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJycpO1xuXG4gICAgICAgIGNhY2hlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0geGhyLnJlc3BvbnNlVGV4dDtcblxuICAgICAgICAvLyBlbnN1cmUgZG9tYWlucyBhcmUgdGhlIHNhbWUsIG90aGVyd2lzZSB3ZSdsbCBoYXZlIGlzc3VlcyBhcHBlbmRpbmcgdGhlXG4gICAgICAgIC8vIGVsZW1lbnQgaW4gSUUgMTFcbiAgICAgICAgY2FjaGVkRG9jdW1lbnQuZG9tYWluID0gZG9jdW1lbnQuZG9tYWluO1xuXG4gICAgICAgIHhoci5fY2FjaGVkVGFyZ2V0ID0ge307XG4gICAgICB9XG5cbiAgICAgIC8vIGNsZWFyIHRoZSB4aHIgZW1iZWRzIGxpc3QgYW5kIGVtYmVkIGVhY2ggaXRlbVxuICAgICAgeGhyLl9lbWJlZHMuc3BsaWNlKDApLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAvLyBnZXQgdGhlIGNhY2hlZCB0YXJnZXRcbiAgICAgICAgdmFyIHRhcmdldCA9IHhoci5fY2FjaGVkVGFyZ2V0W2l0ZW0uaWRdO1xuXG4gICAgICAgIC8vIGVuc3VyZSB0aGUgY2FjaGVkIHRhcmdldFxuICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgIHRhcmdldCA9IHhoci5fY2FjaGVkVGFyZ2V0W2l0ZW0uaWRdID0gY2FjaGVkRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbS5pZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbWJlZCB0aGUgdGFyZ2V0IGludG8gdGhlIHN2Z1xuICAgICAgICBlbWJlZChpdGVtLnBhcmVudCwgaXRlbS5zdmcsIHRhcmdldCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gdGVzdCB0aGUgcmVhZHkgc3RhdGUgY2hhbmdlIGltbWVkaWF0ZWx5XG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UoKTtcbn1cblxuZnVuY3Rpb24gc3ZnNGV2ZXJ5Ym9keShyYXdvcHRzKSB7XG4gIHZhciBvcHRzID0gT2JqZWN0KHJhd29wdHMpO1xuXG4gIC8vIGNyZWF0ZSBsZWdhY3kgc3VwcG9ydCB2YXJpYWJsZXNcbiAgdmFyIG5vc3ZnO1xuICB2YXIgZmFsbGJhY2s7XG5cbiAgLy8gaWYgcnVubmluZyB3aXRoIGxlZ2FjeSBzdXBwb3J0XG4gIGlmIChMRUdBQ1lfU1VQUE9SVCkge1xuICAgIC8vIGNvbmZpZ3VyZSB0aGUgZmFsbGJhY2sgbWV0aG9kXG4gICAgZmFsbGJhY2sgPSBvcHRzLmZhbGxiYWNrIHx8IGZ1bmN0aW9uIChzcmMpIHtcbiAgICAgIHJldHVybiBzcmMucmVwbGFjZSgvXFw/W14jXSsvLCAnJykucmVwbGFjZSgnIycsICcuJykucmVwbGFjZSgvXlxcLi8sICcnKSArICcucG5nJyArICgvXFw/W14jXSsvLmV4ZWMoc3JjKSB8fCBbJyddKVswXTtcbiAgICB9O1xuXG4gICAgLy8gc2V0IHdoZXRoZXIgdG8gc2hpdiA8c3ZnPiBhbmQgPHVzZT4gZWxlbWVudHMgYW5kIHVzZSBpbWFnZSBmYWxsYmFja3NcbiAgICBub3N2ZyA9ICdub3N2ZycgaW4gb3B0cyA/IG9wdHMubm9zdmcgOiAvXFxiTVNJRSBbMS04XVxcYi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuICAgIC8vIGNvbmRpdGlvbmFsbHkgc2hpdiA8c3ZnPiBhbmQgPHVzZT5cbiAgICBpZiAobm9zdmcpIHtcbiAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N2ZycpO1xuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndXNlJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0IHdoZXRoZXIgdGhlIHBvbHlmaWxsIHdpbGwgYmUgYWN0aXZhdGVkIG9yIG5vdFxuICB2YXIgcG9seWZpbGw7XG4gIHZhciBvbGRlcklFVUEgPSAvXFxiTVNJRSBbMS04XVxcLjBcXGIvO1xuICB2YXIgbmV3ZXJJRVVBID0gL1xcYlRyaWRlbnRcXC9bNTY3XVxcYnxcXGJNU0lFICg/Ojl8MTApXFwuMFxcYi87XG4gIHZhciB3ZWJraXRVQSA9IC9cXGJBcHBsZVdlYktpdFxcLyhcXGQrKVxcYi87XG4gIHZhciBvbGRlckVkZ2VVQSA9IC9cXGJFZGdlXFwvMTJcXC4oXFxkKylcXGIvO1xuICB2YXIgZWRnZVVBID0gL1xcYkVkZ2VcXC8uKFxcZCspXFxiLztcbiAgLy8gQ2hlY2tzIHdoZXRoZXIgaWZyYW1lZFxuICB2YXIgaW5JZnJhbWUgPSB3aW5kb3cudG9wICE9PSB3aW5kb3cuc2VsZjtcblxuICBpZiAoJ3BvbHlmaWxsJyBpbiBvcHRzKSB7XG4gICAgcG9seWZpbGwgPSBvcHRzLnBvbHlmaWxsO1xuICB9IGVsc2UgaWYgKExFR0FDWV9TVVBQT1JUKSB7XG4gICAgcG9seWZpbGwgPSBvbGRlcklFVUEudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBuZXdlcklFVUEudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSB8fCAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaChvbGRlckVkZ2VVQSkgfHwgW10pWzFdIDwgMTA1NDcgfHwgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2god2Via2l0VUEpIHx8IFtdKVsxXSA8IDUzNyB8fCBlZGdlVUEudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiBpbklmcmFtZTtcbiAgfSBlbHNlIHtcbiAgICBwb2x5ZmlsbCA9IG5ld2VySUVVQS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKG9sZGVyRWRnZVVBKSB8fCBbXSlbMV0gPCAxMDU0NyB8fCAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCh3ZWJraXRVQSkgfHwgW10pWzFdIDwgNTM3IHx8IGVkZ2VVQS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmIGluSWZyYW1lO1xuICB9XG5cbiAgLy8gY3JlYXRlIHhociByZXF1ZXN0cyBvYmplY3RcbiAgdmFyIHJlcXVlc3RzID0ge307XG5cbiAgLy8gdXNlIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIG9yIGEgdGltZW91dCB0byBzZWFyY2ggdGhlIGRvbSBmb3Igc3Znc1xuICB2YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBzZXRUaW1lb3V0O1xuXG4gIC8vIGdldCBhIGxpdmUgY29sbGVjdGlvbiBvZiB1c2UgZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAgdmFyIHVzZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndXNlJyk7XG4gIHZhciBudW1iZXJPZlN2Z1VzZUVsZW1lbnRzVG9CeXBhc3MgPSAwO1xuXG4gIGZ1bmN0aW9uIG9uaW50ZXJ2YWwoKSB7XG4gICAgLy8gZ2V0IHRoZSBjYWNoZWQgPHVzZT4gaW5kZXhcbiAgICB2YXIgaW5kZXggPSAwO1xuXG4gICAgLy8gd2hpbGUgdGhlIGluZGV4IGV4aXN0cyBpbiB0aGUgbGl2ZSA8dXNlPiBjb2xsZWN0aW9uXG4gICAgd2hpbGUgKGluZGV4IDwgdXNlcy5sZW5ndGgpIHtcbiAgICAgIC8vIGdldCB0aGUgY3VycmVudCA8dXNlPlxuICAgICAgdmFyIHVzZSA9IHVzZXNbaW5kZXhdO1xuXG4gICAgICAvLyBnZXQgdGhlIGN1cnJlbnQgPHN2Zz5cbiAgICAgIHZhciBwYXJlbnQgPSB1c2UucGFyZW50Tm9kZTtcbiAgICAgIHZhciBzdmcgPSBnZXRTVkdBbmNlc3RvcihwYXJlbnQpO1xuICAgICAgdmFyIHNyYyA9IHVzZS5nZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnKSB8fCB1c2UuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cbiAgICAgIGlmICghc3JjICYmIG9wdHMuYXR0cmlidXRlTmFtZSkge1xuICAgICAgICBzcmMgPSB1c2UuZ2V0QXR0cmlidXRlKG9wdHMuYXR0cmlidXRlTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdmcgJiYgc3JjKSB7XG4gICAgICAgIC8vIGlmIHJ1bm5pbmcgd2l0aCBsZWdhY3kgc3VwcG9ydFxuICAgICAgICBpZiAoTEVHQUNZX1NVUFBPUlQgJiYgbm9zdmcpIHtcbiAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgZmFsbGJhY2sgaW1hZ2VcbiAgICAgICAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICAgICAgICAvLyBmb3JjZSBkaXNwbGF5IGluIG9sZGVyIElFXG4gICAgICAgICAgaW1nLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTppbmxpbmUtYmxvY2s7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJSc7XG5cbiAgICAgICAgICAvLyBzZXQgdGhlIGZhbGxiYWNrIHNpemUgdXNpbmcgdGhlIHN2ZyBzaXplXG4gICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzdmcuZ2V0QXR0cmlidXRlKCd3aWR0aCcpIHx8IHN2Zy5jbGllbnRXaWR0aCk7XG4gICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnaGVpZ2h0Jywgc3ZnLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykgfHwgc3ZnLmNsaWVudEhlaWdodCk7XG5cbiAgICAgICAgICAvLyBzZXQgdGhlIGZhbGxiYWNrIHNyY1xuICAgICAgICAgIGltZy5zcmMgPSBmYWxsYmFjayhzcmMsIHN2ZywgdXNlKTtcblxuICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIDx1c2U+IHdpdGggdGhlIGZhbGxiYWNrIGltYWdlXG4gICAgICAgICAgcGFyZW50LnJlcGxhY2VDaGlsZChpbWcsIHVzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocG9seWZpbGwpIHtcbiAgICAgICAgICBpZiAoIW9wdHMudmFsaWRhdGUgfHwgb3B0cy52YWxpZGF0ZShzcmMsIHN2ZywgdXNlKSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSA8dXNlPiBlbGVtZW50XG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodXNlKTtcblxuICAgICAgICAgICAgLy8gcGFyc2UgdGhlIHNyYyBhbmQgZ2V0IHRoZSB1cmwgYW5kIGlkXG4gICAgICAgICAgICB2YXIgc3JjU3BsaXQgPSBzcmMuc3BsaXQoJyMnKTtcbiAgICAgICAgICAgIHZhciB1cmwgPSBzcmNTcGxpdC5zaGlmdCgpO1xuICAgICAgICAgICAgdmFyIGlkID0gc3JjU3BsaXQuam9pbignIycpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgbGluayBpcyBleHRlcm5hbFxuICAgICAgICAgICAgaWYgKHVybC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBjYWNoZWQgeGhyIHJlcXVlc3RcbiAgICAgICAgICAgICAgdmFyIHhociA9IHJlcXVlc3RzW3VybF07XG5cbiAgICAgICAgICAgICAgLy8gZW5zdXJlIHRoZSB4aHIgcmVxdWVzdCBleGlzdHNcbiAgICAgICAgICAgICAgaWYgKCF4aHIpIHtcbiAgICAgICAgICAgICAgICB4aHIgPSByZXF1ZXN0c1t1cmxdID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcblxuICAgICAgICAgICAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgICAgICAgICAgICB4aHIuX2VtYmVkcyA9IFtdO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gYWRkIHRoZSBzdmcgYW5kIGlkIGFzIGFuIGl0ZW0gdG8gdGhlIHhociBlbWJlZHMgbGlzdFxuICAgICAgICAgICAgICB4aHIuX2VtYmVkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgICAgICAgICBzdmc6IHN2ZyxcbiAgICAgICAgICAgICAgICBpZDogaWRcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgLy8gcHJlcGFyZSB0aGUgeGhyIHJlYWR5IHN0YXRlIGNoYW5nZSBldmVudFxuICAgICAgICAgICAgICBsb2FkcmVhZHlzdGF0ZWNoYW5nZSh4aHIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gZW1iZWQgdGhlIGxvY2FsIGlkIGludG8gdGhlIHN2Z1xuICAgICAgICAgICAgICBlbWJlZChwYXJlbnQsIHN2ZywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaW5jcmVhc2UgdGhlIGluZGV4IHdoZW4gdGhlIHByZXZpb3VzIHZhbHVlIHdhcyBub3QgXCJ2YWxpZFwiXG4gICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgKytudW1iZXJPZlN2Z1VzZUVsZW1lbnRzVG9CeXBhc3M7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpbmNyZWFzZSB0aGUgaW5kZXggd2hlbiB0aGUgcHJldmlvdXMgdmFsdWUgd2FzIG5vdCBcInZhbGlkXCJcbiAgICAgICAgKytpbmRleDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb250aW51ZSB0aGUgaW50ZXJ2YWxcbiAgICBpZiAoIXVzZXMubGVuZ3RoIHx8IHVzZXMubGVuZ3RoIC0gbnVtYmVyT2ZTdmdVc2VFbGVtZW50c1RvQnlwYXNzID4gMCkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9uaW50ZXJ2YWwsIDY3KTtcbiAgICB9XG4gIH1cblxuICAvLyBjb25kaXRpb25hbGx5IHN0YXJ0IHRoZSBpbnRlcnZhbCBpZiB0aGUgcG9seWZpbGwgaXMgYWN0aXZlXG4gIGlmIChwb2x5ZmlsbCkge1xuICAgIG9uaW50ZXJ2YWwoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRTVkdBbmNlc3Rvcihub2RlKSB7XG4gIHZhciBzdmcgPSBub2RlO1xuICB3aGlsZSAoc3ZnLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdzdmcnKSB7XG4gICAgc3ZnID0gc3ZnLnBhcmVudE5vZGU7XG4gICAgaWYgKCFzdmcpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3ZnO1xufVxuIiwiLyohXG4gKiBAc3VtbWFyeSBQYXJ0IG9mIHRoZSBGYW5uaWUgTWFlIC0gQmx1cHJpbnQgRGVzaWduIFN5c3RlbVxuICogQGRlc2NyaXB0aW9uIFVzZSBzeW1ib2xzIGFuZCBkZWYgaW4gc3ZnIGZpbGVzLlxuICpcbiAqIEBhdXRob3IgSGVhdGggU2h1bHRzXG4gKiBAdmVyc2lvbiB2MS40LjBcbiAqIEBzaW5jZSAxLjAuMFxuICpcbiAqIEBsaW5rIGh0dHBzOi8vYml0YnVja2V0Ojg0NDMvc2NtL2Zsay9jeGQtZHMtdWNvbnMuZ2l0XG4gKiBAZmlsZSBzdmctdXNlLXN5bWRlZi5qc1xuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE4IEZhbm5pZSBNYWUsIEluYy5cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgdmFyIGNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKTsgLy8gaG9sZHMgeGhyIG9iamVjdHMgdG8gcHJldmVudCBtdWx0aXBsZSByZXF1ZXN0c1xuICAgIHZhciBjaGVja1VzZUVsZW1zO1xuICAgIHZhciB0aWQ7IC8vIHRpbWVvdXQgaWRcbiAgICB2YXIgZGVib3VuY2VkQ2hlY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGlkKTtcbiAgICAgIHRpZCA9IHNldFRpbWVvdXQoY2hlY2tVc2VFbGVtcywgMTAwKTtcbiAgICB9O1xuICAgIHZhciB1bm9ic2VydmVDaGFuZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuO1xuICAgIH07XG4gICAgdmFyIG9ic2VydmVDaGFuZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9ic2VydmVyO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGRlYm91bmNlZENoZWNrLCBmYWxzZSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBkZWJvdW5jZWRDaGVjaywgZmFsc2UpO1xuICAgICAgaWYgKHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICAgIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZGVib3VuY2VkQ2hlY2spO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwge1xuICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHVub2JzZXJ2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBkZWJvdW5jZWRDaGVjaywgZmFsc2UpO1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgZGVib3VuY2VkQ2hlY2ssIGZhbHNlKTtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NU3VidHJlZU1vZGlmaWVkJywgZGVib3VuY2VkQ2hlY2ssIGZhbHNlKTtcbiAgICAgICAgdW5vYnNlcnZlQ2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NU3VidHJlZU1vZGlmaWVkJywgZGVib3VuY2VkQ2hlY2ssIGZhbHNlKTtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZGVib3VuY2VkQ2hlY2ssIGZhbHNlKTtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBkZWJvdW5jZWRDaGVjaywgZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGNyZWF0ZVJlcXVlc3QgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAvLyBJbiBJRSA5LCBjcm9zcyBvcmlnaW4gcmVxdWVzdHMgY2FuIG9ubHkgYmUgc2VudCB1c2luZyBYRG9tYWluUmVxdWVzdC5cbiAgICAgIC8vIFhEb21haW5SZXF1ZXN0IHdvdWxkIGZhaWwgaWYgQ09SUyBoZWFkZXJzIGFyZSBub3Qgc2V0LlxuICAgICAgLy8gVGhlcmVmb3JlLCBYRG9tYWluUmVxdWVzdCBzaG91bGQgb25seSBiZSB1c2VkIHdpdGggY3Jvc3Mgb3JpZ2luIHJlcXVlc3RzLlxuICAgICAgZnVuY3Rpb24gZ2V0T3JpZ2luKGxvYykge1xuICAgICAgICB2YXIgYTtcbiAgICAgICAgaWYgKGxvYy5wcm90b2NvbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgYSA9IGxvYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgIGEuaHJlZiA9IGxvYztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYS5wcm90b2NvbC5yZXBsYWNlKC86L2csICcnKSArIGEuaG9zdDtcbiAgICAgIH1cbiAgICAgIHZhciBSZXF1ZXN0O1xuICAgICAgdmFyIG9yaWdpbjtcbiAgICAgIHZhciBvcmlnaW4yO1xuICAgICAgaWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCkge1xuICAgICAgICBSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIG9yaWdpbiA9IGdldE9yaWdpbihsb2NhdGlvbik7XG4gICAgICAgIG9yaWdpbjIgPSBnZXRPcmlnaW4odXJsKTtcbiAgICAgICAgaWYgKFJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID09PSB1bmRlZmluZWQgJiYgb3JpZ2luMiAhPT0gJycgJiYgb3JpZ2luMiAhPT0gb3JpZ2luKSB7XG4gICAgICAgICAgUmVxdWVzdCA9IFhEb21haW5SZXF1ZXN0IHx8IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBSZXF1ZXN0ID0gWE1MSHR0cFJlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBSZXF1ZXN0O1xuICAgIH07XG4gICAgdmFyIHhsaW5rTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc7XG4gICAgY2hlY2tVc2VFbGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBiYXNlO1xuICAgICAgdmFyIGJjcjtcbiAgICAgIHZhciBmYWxsYmFjayA9ICcnOyAvLyBvcHRpb25hbCBmYWxsYmFjayBVUkwgaW4gY2FzZSBubyBiYXNlIHBhdGggdG8gU1ZHIGZpbGUgd2FzIGdpdmVuIGFuZCBubyBzeW1ib2wgZGVmaW5pdGlvbiB3YXMgZm91bmQuXG4gICAgICB2YXIgaGFzaDtcbiAgICAgIHZhciBocmVmO1xuICAgICAgdmFyIGk7XG4gICAgICB2YXIgaW5Qcm9ncmVzc0NvdW50ID0gMDtcbiAgICAgIHZhciBpc0hpZGRlbjtcbiAgICAgIHZhciBSZXF1ZXN0O1xuICAgICAgdmFyIHVybDtcbiAgICAgIHZhciB1c2VzO1xuICAgICAgdmFyIHhocjtcblxuICAgICAgZnVuY3Rpb24gb2JzZXJ2ZUlmRG9uZSgpIHtcbiAgICAgICAgLy8gSWYgZG9uZSB3aXRoIG1ha2luZyBjaGFuZ2VzLCBzdGFydCB3YXRjaGluZyBmb3IgY2hhZ25lcyBpbiBET00gYWdhaW5cbiAgICAgICAgaW5Qcm9ncmVzc0NvdW50IC09IDE7XG4gICAgICAgIGlmIChpblByb2dyZXNzQ291bnQgPT09IDApIHsgLy8gaWYgYWxsIHhocnMgd2VyZSByZXNvbHZlZFxuICAgICAgICAgIHVub2JzZXJ2ZUNoYW5nZXMoKTsgLy8gbWFrZSBzdXJlIHRvIHJlbW92ZSBvbGQgaGFuZGxlcnNcbiAgICAgICAgICBvYnNlcnZlQ2hhbmdlcygpOyAvLyB3YXRjaCBmb3IgY2hhbmdlcyB0byBET01cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhdHRyVXBkYXRlRnVuYyhzcGVjKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGNhY2hlW3NwZWMuYmFzZV0gIT09IHRydWUpIHtcbiAgICAgICAgICAgIHNwZWMudXNlRWwuc2V0QXR0cmlidXRlTlMoeGxpbmtOUywgJ3hsaW5rOmhyZWYnLCAnIycgKyBzcGVjLmhhc2gpO1xuICAgICAgICAgICAgaWYgKHNwZWMudXNlRWwuaGFzQXR0cmlidXRlKCdocmVmJykpIHtcbiAgICAgICAgICAgICAgc3BlYy51c2VFbC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycgKyBzcGVjLmhhc2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25sb2FkRnVuYyh4aHIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgdmFyIHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd4Jyk7XG4gICAgICAgICAgdmFyIHN2ZztcbiAgICAgICAgICB4aHIub25sb2FkID0gbnVsbDtcbiAgICAgICAgICB4LmlubmVySFRNTCA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgc3ZnID0geC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3ZnJylbMF07XG4gICAgICAgICAgaWYgKHN2Zykge1xuICAgICAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgICAgc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIHN2Zy5zdHlsZS53aWR0aCA9IDA7XG4gICAgICAgICAgICBzdmcuc3R5bGUuaGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIHN2Zy5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgYm9keS5pbnNlcnRCZWZvcmUoc3ZnLCBib2R5LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvYnNlcnZlSWZEb25lKCk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uRXJyb3JUaW1lb3V0KHhocikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHhoci5vbmVycm9yID0gbnVsbDtcbiAgICAgICAgICB4aHIub250aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICBvYnNlcnZlSWZEb25lKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1bm9ic2VydmVDaGFuZ2VzKCk7IC8vIHN0b3Agd2F0Y2hpbmcgZm9yIGNoYW5nZXMgdG8gRE9NXG4gICAgICAvLyBmaW5kIGFsbCB1c2UgZWxlbWVudHNcbiAgICAgIHVzZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndXNlJyk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdXNlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGJjciA9IHVzZXNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge1xuICAgICAgICAgIC8vIGZhaWxlZCB0byBnZXQgYm91bmRpbmcgcmVjdGFuZ2xlIG9mIHRoZSB1c2UgZWxlbWVudFxuICAgICAgICAgIGJjciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGhyZWYgPSB1c2VzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8XG4gICAgICAgICAgdXNlc1tpXS5nZXRBdHRyaWJ1dGVOUyh4bGlua05TLCAnaHJlZicpIHx8XG4gICAgICAgICAgdXNlc1tpXS5nZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnKTtcbiAgICAgICAgaWYgKGhyZWYgJiYgaHJlZi5zcGxpdCkge1xuICAgICAgICAgIHVybCA9IGhyZWYuc3BsaXQoJyMnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmwgPSBbJycsICcnXTtcbiAgICAgICAgfVxuICAgICAgICBiYXNlID0gdXJsWzBdO1xuICAgICAgICBoYXNoID0gdXJsWzFdO1xuICAgICAgICBpc0hpZGRlbiA9IGJjciAmJiBiY3IubGVmdCA9PT0gMCAmJiBiY3IucmlnaHQgPT09IDAgJiYgYmNyLnRvcCA9PT0gMCAmJiBiY3IuYm90dG9tID09PSAwO1xuICAgICAgICBpZiAoYmNyICYmIGJjci53aWR0aCA9PT0gMCAmJiBiY3IuaGVpZ2h0ID09PSAwICYmICFpc0hpZGRlbikge1xuICAgICAgICAgIC8vIHRoZSB1c2UgZWxlbWVudCBpcyBlbXB0eVxuICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgcmVmZXJlbmNlIHRvIGFuIGV4dGVybmFsIFNWRywgdHJ5IHRvIGZldGNoIGl0XG4gICAgICAgICAgLy8gdXNlIHRoZSBvcHRpb25hbCBmYWxsYmFjayBVUkwgaWYgdGhlcmUgaXMgbm8gcmVmZXJlbmNlIHRvIGFuIGV4dGVybmFsIFNWR1xuICAgICAgICAgIGlmIChmYWxsYmFjayAmJiAhYmFzZS5sZW5ndGggJiYgaGFzaCAmJiAhZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaGFzaCkpIHtcbiAgICAgICAgICAgIGJhc2UgPSBmYWxsYmFjaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVzZXNbaV0uaGFzQXR0cmlidXRlKCdocmVmJykpIHtcbiAgICAgICAgICAgIHVzZXNbaV0uc2V0QXR0cmlidXRlTlMoeGxpbmtOUywgJ3hsaW5rOmhyZWYnLCBocmVmKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJhc2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBzY2hlZHVsZSB1cGRhdGluZyB4bGluazpocmVmXG4gICAgICAgICAgICB4aHIgPSBjYWNoZVtiYXNlXTtcbiAgICAgICAgICAgIGlmICh4aHIgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgLy8gdHJ1ZSBzaWduaWZpZXMgdGhhdCBwcmVwZW5kaW5nIHRoZSBTVkcgd2FzIG5vdCByZXF1aXJlZFxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGF0dHJVcGRhdGVGdW5jKHtcbiAgICAgICAgICAgICAgICB1c2VFbDogdXNlc1tpXSxcbiAgICAgICAgICAgICAgICBiYXNlOiBiYXNlLFxuICAgICAgICAgICAgICAgIGhhc2g6IGhhc2hcbiAgICAgICAgICAgICAgfSksIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHhociA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIFJlcXVlc3QgPSBjcmVhdGVSZXF1ZXN0KGJhc2UpO1xuICAgICAgICAgICAgICBpZiAoUmVxdWVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgeGhyID0gbmV3IFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICBjYWNoZVtiYXNlXSA9IHhocjtcbiAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gb25sb2FkRnVuYyh4aHIpO1xuICAgICAgICAgICAgICAgIHhoci5vbmVycm9yID0gb25FcnJvclRpbWVvdXQoeGhyKTtcbiAgICAgICAgICAgICAgICB4aHIub250aW1lb3V0ID0gb25FcnJvclRpbWVvdXQoeGhyKTtcbiAgICAgICAgICAgICAgICB4aHIub3BlbignR0VUJywgYmFzZSk7XG4gICAgICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgICAgICAgICBpblByb2dyZXNzQ291bnQgKz0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIWlzSGlkZGVuKSB7XG4gICAgICAgICAgICBpZiAoY2FjaGVbYmFzZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAvLyByZW1lbWJlciB0aGlzIFVSTCBpZiB0aGUgdXNlIGVsZW1lbnQgd2FzIG5vdCBlbXB0eSBhbmQgbm8gcmVxdWVzdCB3YXMgc2VudFxuICAgICAgICAgICAgICBjYWNoZVtiYXNlXSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNhY2hlW2Jhc2VdLm9ubG9hZCkge1xuICAgICAgICAgICAgICAvLyBpZiBpdCB0dXJucyBvdXQgdGhhdCBwcmVwZW5kaW5nIHRoZSBTVkcgaXMgbm90IG5lY2Vzc2FyeSxcbiAgICAgICAgICAgICAgLy8gYWJvcnQgdGhlIGluLXByb2dyZXNzIHhoci5cbiAgICAgICAgICAgICAgY2FjaGVbYmFzZV0uYWJvcnQoKTtcbiAgICAgICAgICAgICAgZGVsZXRlIGNhY2hlW2Jhc2VdLm9ubG9hZDtcbiAgICAgICAgICAgICAgY2FjaGVbYmFzZV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoYmFzZS5sZW5ndGggJiYgY2FjaGVbYmFzZV0pIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoYXR0clVwZGF0ZUZ1bmMoe1xuICAgICAgICAgICAgICB1c2VFbDogdXNlc1tpXSxcbiAgICAgICAgICAgICAgYmFzZTogYmFzZSxcbiAgICAgICAgICAgICAgaGFzaDogaGFzaFxuICAgICAgICAgICAgfSksIDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdXNlcyA9ICcnO1xuICAgICAgaW5Qcm9ncmVzc0NvdW50ICs9IDE7XG4gICAgICBvYnNlcnZlSWZEb25lKCk7XG4gICAgfTtcbiAgICB2YXIgd2luTG9hZDtcbiAgICB3aW5Mb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB3aW5Mb2FkLCBmYWxzZSk7IC8vIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzXG4gICAgICB0aWQgPSBzZXRUaW1lb3V0KGNoZWNrVXNlRWxlbXMsIDApO1xuICAgIH07XG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZScpIHtcbiAgICAgIC8vIFRoZSBsb2FkIGV2ZW50IGZpcmVzIHdoZW4gYWxsIHJlc291cmNlcyBoYXZlIGZpbmlzaGVkIGxvYWRpbmcsIHdoaWNoIGFsbG93cyBkZXRlY3Rpbmcgd2hldGhlciBTVkcgdXNlIGVsZW1lbnRzIGFyZSBlbXB0eS5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgd2luTG9hZCwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBuZWVkIHRvIGFkZCBhIGxpc3RlbmVyIGlmIHRoZSBkb2N1bWVudCBpcyBhbHJlYWR5IGxvYWRlZCwgaW5pdGlhbGl6ZSBpbW1lZGlhdGVseS5cbiAgICAgIHdpbkxvYWQoKTtcbiAgICB9XG4gIH1cbn0oKSk7XG4iLCIvKiFcbiAqIGMtYWNjb3JkaW9uLmpzIHYxLjAuMCAtIEFkZHMgZnVuY3Rpb25hbGl0eSB0byB5b3VyIGFjY29yZGlvbiBpbiB5b3VyIHdlYiBhcHAuXG4gKiBodHRwczovL2JpdGJ1Y2tldDo4NDQzL3NjbS9mbGsvY3hkLWRzLWZyYW1la2l0LmdpdFxuICogQ29weXJpZ2h0IChjKSAyMDE4IEZhbm5pZSBNYWUsIEluYy5cbiAqIEBsaWNlbnNlIE1JVFxuICpcbiAqIEFjY29yZGlvbigkOiBKUXVlcnlTdGF0aWMpOiB7XG4gKiAgICBlbDogYW55O1xuICogICAgbXVsdGlwbGU6IGFueTtcbiAqICAgIGRyb3Bkb3duOiAoZTogYW55KSA9PiB2b2lkO1xuICogIH1cbiAqXG4gKi9cblxuJChmdW5jdGlvbiAoKSB7XG5cbiAgbGV0IEFjY29yZGlvbiA9IGZ1bmN0aW9uIChlbCwgbXVsdGlwbGUpIHtcbiAgICB0aGlzLmVsID0gZWwgfHwge31cbiAgICB0aGlzLm11bHRpcGxlID0gbXVsdGlwbGUgfHwgZmFsc2VcblxuICAgIC8vIHByaXZhdGUgdmFyc1xuICAgIHZhciBsaW5rcyA9IHRoaXMuZWwuZmluZCgnLmpzLWFjYy1jb250cm9sJylcblxuICAgIC8vIEV2ZW50c1xuICAgIGxpbmtzLm9uKCdjbGljaycsIHtcbiAgICAgIGVsOiB0aGlzLmVsLFxuICAgICAgbXVsdGlwbGU6IHRoaXMubXVsdGlwbGVcbiAgICB9LCB0aGlzLmRyb3Bkb3duKVxuICB9XG5cbiAgQWNjb3JkaW9uLnByb3RvdHlwZS5kcm9wZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICRlbCA9IGUuZGF0YS5lbCxcbiAgICAgICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICRuZXh0ID0gJHRoaXMubmV4dCgpXG5cbiAgICAkbmV4dC5zbGlkZVRvZ2dsZSgpXG4gICAgJHRoaXMucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ2lzLW9wZW4nKVxuXG4gICAgaWYgKCFlLmRhdGEubXVsdGlwbGUpIHtcbiAgICAgICRlbC5maW5kKCcuanMtZGRwYW5lbCcpLm5vdCgkbmV4dCkuc2xpZGVVcCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJylcbiAgICB9XG4gIH1cblxuICB2YXIgYWNjb3JkaW9uID0gbmV3IEFjY29yZGlvbigkKCcjYWNjb3JkaW9uJyksIGZhbHNlKVxufSlcbiIsImNvbnN0IFNpZGViYXJOYXZpZ2F0ZSA9ICgoJCkgPT4ge1xuXG4gIGNvbnN0IE5BTUUgPSAnc2lkZWJhci1uYXYnXG4gIGNvbnN0IFZFUlNJT04gPSAnMS4wLjAnXG4gIGNvbnN0IEpRVUVSWV9OT19DT05GTElDVCA9ICQuZm5bTkFNRV1cbiAgY29uc3QgREFUQV9LRVkgPSAnc2lkZWJhcl9uYXYnXG4gIGNvbnN0IEVWRU5UX0tFWSA9IGAuJHtEQVRBX0tFWX1gXG5cbiAgY29uc3QgRXZlbnQgPSB7XG4gICAgSElERTogYGhpZGUke0VWRU5UX0tFWX1gLFxuICAgIEhJRERFTjogYGhpZGRlbiR7RVZFTlRfS0VZfWAsXG4gICAgU0hPVzogYHNob3cke0VWRU5UX0tFWX1gLFxuICAgIFNIT1dOOiBgc2hvd24ke0VWRU5UX0tFWX1gLFxuICAgIENMSUNLOiBgY2xpY2ske0VWRU5UX0tFWX1gXG4gIH1cblxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBNRU5VX1RJVExFOiAnVGhlIERlc2lnbiBTeXN0ZW0nLFxuICAgIE1FTlVfVE9HR0xFUjogJy5qcy10Z2wnLFxuICAgIFNVQk1FTlVfT1BFTjogJ2lzLWFjdGl2ZScsXG4gICAgU1VCTUVOVV9BTEw6ICcuanMtdGdsLCAuZmstc2lkZWJhci1uYXYtc3VibWVudScsXG4gICAgVEFSR0VUX0FUVFI6ICdkYXRhLXRhcmdldCcsXG4gICAgTEFVTkNIX0JVVFRPTjogJyNuYXV0aWNhbENvbXBhc3MnLFxuICAgIE9GRl9DQU5WQVM6IHRydWUsXG4gICAgU0lERUJBUl9WSVNJQkxFOiAnLmlzLWFjdGl2ZSdcbiAgfVxuICBjbGFzcyBTaWRlYmFyTmF2aWdhdGUge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNvbmZpZykge1xuICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnRcbiAgICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuX2dldENvbmZpZyhvcHRpb25zKVxuICAgICAgdGhpcy5fbWVudSA9IHRoaXMuX2dldE1lbnVFbGVtZW50KClcblxuICAgICAgdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgVkVSU0lPTigpIHtcbiAgICAgIHJldHVybiBWRVJTSU9OXG4gICAgfVxuXG4gICAgX3RvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLl9lbGVtZW50LmRpc2FibGVkIHx8ICQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3Mob3B0aW9ucy5TVUJNRU5VX09QRU4pKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cblxuICAgIF9hZGRFdmVudExpc3RlbmVycygpIHtcbiAgICAgICQodGhpcy5fZWxlbWVudCkub24oRXZlbnQuQ0xJQ0ssIChldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBkYXRhID0gJCh0aGlzKS5kYXRhKERBVEFfS0VZKVxuICAgICAgICBjb25zdCBfY29uZmlnID0gdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgPyBjb25maWcgOiBudWxsXG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgZGF0YSA9IG5ldyBTaWRlYmFyTmF2aWdhdGUodGhpcywgX2NvbmZpZylcbiAgICAgICAgICAkKHRoaXMpLmRhdGEoREFUQV9LRVksIGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGFbY29uZmlnXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYE5vIG1ldGhvZCBuYW1lZCBcIiR7Y29uZmlnfVwiYClcbiAgICAgICAgICB9XG4gICAgICAgICAgZGF0YVtjb25maWddKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuXG4gICQob3B0aW9ucy5TVUJNRU5VX0FMTCkucmVtb3ZlQ2xhc3Mob3B0aW9ucy5TVUJNRU5VX09QRU4pXG5cbiAgJChvcHRpb25zLk1FTlVfVE9HR0xFUikuY2xpY2soZnVuY3Rpb24gKGNiKSB7XG4gICAgbGV0ICR0aGlzID0gJCh0aGlzKVxuICAgIGxldCB0YXJnZXRfZWwgPSAkdGhpcy5hdHRyKG9wdGlvbnMuVEFSR0VUX0FUVFIpXG4gICAgaWYgKCR0aGlzLmhhc0NsYXNzKG9wdGlvbnMuU1VCTUVOVV9PUEVOKSkge1xuICAgICAgJHRoaXMucmVtb3ZlQ2xhc3Mob3B0aW9ucy5TVUJNRU5VX09QRU4pXG4gICAgICAkKHRhcmdldF9lbCkucmVtb3ZlQ2xhc3Mob3B0aW9ucy5TVUJNRU5VX09QRU4pXG4gICAgfSBlbHNlIHtcbiAgICAgICR0aGlzLmFkZENsYXNzKG9wdGlvbnMuU1VCTUVOVV9PUEVOKVxuICAgICAgJCh0YXJnZXRfZWwpLmFkZENsYXNzKG9wdGlvbnMuU1VCTUVOVV9PUEVOKSwgKGNiKVxuICAgIH1cbiAgfSlcbiAgJC5mbltOQU1FXSA9IFNpZGViYXJOYXZpZ2F0ZS5falF1ZXJ5SW50ZXJmYWNlXG4gICQuZm5bTkFNRV0uQ29uc3RydWN0b3IgPSBTaWRlYmFyTmF2aWdhdGVcbiAgJC5mbltOQU1FXS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm5bTkFNRV0gPSBKUVVFUllfTk9fQ09ORkxJQ1RcbiAgICByZXR1cm4gU2lkZWJhck5hdmlnYXRlLl9qUXVlcnlJbnRlcmZhY2VcbiAgfVxuXG59KSgkKVxuZXhwb3J0IGRlZmF1bHQgU2lkZWJhck5hdmlnYXRlXG4iLCIvKiFcbiAqIGZrLXRhYnMuanMgdjEuMC4wIC0gQWRkcyBmdW5jdGlvbmFsaXR5IHRvIHlvdXIgdGFiIGNvbXBvbmVudHMgaW4geW91ciB3ZWIgYXBwLlxuICogaHR0cHM6Ly9iaXRidWNrZXQ6ODQ0My9zY20vZmxrL2N4ZC1kcy1mcmFtZWtpdC5naXRcbiAqIENvcHlyaWdodCAoYykgMjAxOCBGYW5uaWUgTWFlLCBJbmMuXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICQoJ1tpZF49dGFiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzKS5hdHRyKCdkYXRhLXRhcmdldCcpXG4gICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSB7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLmZrLXRhYnNfX2xhYmVsLC5may10YWJzX19jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdpcy1hY3RpdmUnKVxuICAgICAgJChgIyR7dGFyZ2V0fWApLmFkZENsYXNzKCdpcy1hY3RpdmUnKVxuICAgIH1cbiAgfSlcbn0pXG4iLCIvKiFcbiAqIEBzdW1tYXJ5IFBhcnQgb2YgdGhlIEZhbm5pZSBNYWUgLSBCbHVwcmludCBEZXNpZ24gU3lzdGVtXG4gKiBAZGVzY3JpcHRpb24gVXNlIHRoaXMgZmlsZSB0byBpbmplY3Qgc3ZnIGljb25zIGludG8gdGhlIERPTS5cbiAqXG4gKiBAYXV0aG9yIEhlYXRoIFNodWx0c1xuICogQHZlcnNpb24gdjEuNC4xXG4gKiBAc2luY2UgMS4wLjBcbiAqXG4gKiBAbGluayBodHRwczovL2JpdGJ1Y2tldDo4NDQzL3NjbS9mbGsvY3hkLWRzLWZyYW1la2l0LmdpdFxuICogQGZpbGUgdWNvbi1pbmplY3QuanNcbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxOCBGYW5uaWUgTWFlLCBJbmMuXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG52YXIgVWNvbkluamVjdG9yID0gZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCkge1xuXG4gIHZhciBOQU1FID0gJ1Vjb25JbmplY3Rvci5qcyc7XG4gIHZhciBWRVJTSU9OID0gJzEuNC4xJztcblxuICAvKiBnbG9iYWwgb3B0aW9ucyAqL1xuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBpY29uQ1NTQ2xhc3NOYW1lICAgICAgOiAgICd1Y29uJyxcbiAgICBpY29uQ1NTQ2xhc3NQcmVmaXggICAgOiAgICdjLScsXG4gICAgaWNvbkRPTUVsZW1lbnQgICAgICAgIDogICAnaScsXG4gICAgaW5qQXR0ciAgICAgICAgICAgICAgIDogICAnbmFtZScsXG4gICAgYWx0U1ZHUGF0aCAgICAgICAgICAgIDogICAnL2Fzc2V0cy9pbWcvdWNvbnMvc3ZnJyxcbiAgICBmYWxsYmFja1NWR1BhdGggICAgICAgOiAgICcvYXNzZXRzL2ltZy91Y29ucy9wbmcnLFxuICAgIFVjb25HYWxsZXJ5ICAgICAgICAgICA6ICAgZmFsc2UsXG4gICAgVWNvbkdhbGxlcnlFbGVtZW50ICAgIDogICAnZGl2JyxcbiAgICBVY29uR2FsbGVyeUlEICAgICAgICAgOiAgICdsaXN0JyxcbiAgICBjb25zb2xlTWVzc2FnZXMgICAgICAgOiAgIHRydWVcbiAgfTtcblxuICB2YXIgc3ZnVGFnICAgICAgICAgICAgPSBudWxsLFxuICAgIGljb25ET01FbGVtZW50ICAgICAgPSBvcHRpb25zLmljb25ET01FbGVtZW50LFxuICAgIGljb25DU1NDbGFzc1ByZWZpeCAgPSBvcHRpb25zLmljb25DU1NDbGFzc1ByZWZpeCxcbiAgICBpY29uQ1NTQ2xhc3NOYW1lICAgID0gb3B0aW9ucy5pY29uQ1NTQ2xhc3NOYW1lLFxuICAgIGluakF0dHIgICAgICAgICAgICAgPSBvcHRpb25zLmluakF0dHIsXG4gICAgYXJyT2JqU1ZHRGF0YSAgICAgICA9IG51bGwsXG4gICAgc3ZnSWQgICAgICAgICAgICAgICA9IG51bGwsXG4gICAgc3ZnSW5kZXggICAgICAgICAgICA9IG51bGwsXG4gICAgc3ZnVGFnU3RhdHVzICAgICAgICA9IG51bGwsXG4gICAgZG9jRWxzICAgICAgICAgICAgICA9IG51bGwsXG4gICAgdGhlVWNvbnMgICAgICAgICAgICA9IG51bGwsXG4gICAgdWNvbnNPYmpBcnJheSAgICAgICA9IG51bGwsXG4gICAgZWwgICAgICAgICAgICAgICAgICA9IG51bGwsXG4gICAgbmV3RWwgICAgICAgICAgICAgICA9IG51bGwsXG4gICAgYXR0eVZhbCAgICAgICAgICAgICA9IG51bGwsXG4gICAgaW5qZWN0Q291bnRlciAgICAgICA9IFtdLFxuICAgIGxpc3QgICAgICAgICAgICAgICAgPSBudWxsLFxuICAgIGRpdmkgICAgICAgICAgICAgICAgPSBudWxsLFxuICAgIGl0ZW0gICAgICAgICAgICAgICAgPSBudWxsLFxuICAgIGdhbGxlcnlTVkcgICAgICAgICAgPSBbXSxcbiAgICBpZFJlZ2V4ICAgICAgICAgICAgID0gbnVsbCxcbiAgICBzdmdOYW1lICAgICAgICAgICAgID0gbnVsbCxcbiAgICB0b3RhbEluamVjdGFibGVFbHMgID0gbnVsbCxcbiAgICBzdWNjZXNzZnVsSW5qZWN0cyAgID0gbnVsbCxcbiAgICBpbmplY3RDb3VudCAgICAgICAgID0gMCxcbiAgICBzaG93R2FsbGVyeSAgICAgICAgID0gb3B0aW9ucy5VY29uR2FsbGVyeSxcbiAgICBpbml0R2FsbGVyeSAgICAgICAgID0gb3B0aW9ucy5VY29uR2FsbGVyeVxuXG4gIC8vIGRvY0VscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChpY29uRE9NRWxlbWVudCsnLicraWNvbkNTU0NsYXNzUHJlZml4K2ljb25DU1NDbGFzc05hbWUpKVxuICBkb2NFbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaWNvbkRPTUVsZW1lbnQrJ1snK2luakF0dHIrJ10nKSlcbiAgdGhlVWNvbnMgPSB7XG4gICAgJ2ljb25zJzogW1xuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3pvb20tb3V0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjEuNDE0IDE4LjU4NmwtNC41MjctNC41MjdBNy45NSA3Ljk1IDAgMCAwIDE4IDEwYTcuOTQ1IDcuOTQ1IDAgMCAwLTIuMzQ0LTUuNjU2QzE0LjE0NiAyLjgzMiAxMi4xMzcgMiAxMCAycy00LjE0Ni44MzItNS42NTYgMi4zNDRDMi44MzMgNS44NTQgMiA3Ljg2MyAyIDEwcy44MzMgNC4xNDYgMi4zNDQgNS42NTZBNy45NDUgNy45NDUgMCAwIDAgMTAgMThhNy45NSA3Ljk1IDAgMCAwIDQuMDU5LTEuMTEzbDQuNTI3IDQuNTI2Yy4zNzcuMzc5Ljg4LjU4NyAxLjQxNC41ODdzMS4wMzctLjIwOCAxLjQxNC0uNTg2Yy4zNzgtLjM3OC41ODYtLjg3OS41ODYtMS40MTQgMC0uNTM0LS4yMDgtMS4wMzYtLjU4Ni0xLjQxNHpNMTQgMTFINlY5aDh2MnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3pvb20taW4nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yMS40MTQgMTguNTg1bC00LjUyNy00LjUyN0E3Ljk0NiA3Ljk0NiAwIDAgMCAxOCAxMGE3Ljk0OSA3Ljk0OSAwIDAgMC0yLjM0NC01LjY1N0MxNC4xNDYgMi44MzEgMTIuMTM3IDIgMTAgMnMtNC4xNDYuODMxLTUuNjU2IDIuMzQzQzIuODMzIDUuODU0IDIgNy44NjMgMiAxMHMuODMzIDQuMTQ1IDIuMzQ0IDUuNjU1QTcuOTM3IDcuOTM3IDAgMCAwIDEwIDE4YTcuOTUgNy45NSAwIDAgMCA0LjA1OS0xLjExNGw0LjUyNyA0LjUyNmMuMzc3LjM3OS44OC41ODggMS40MTQuNTg4czEuMDM3LS4yMDkgMS40MTQtLjU4NmMuMzc4LS4zNzkuNTg2LS44NzkuNTg2LTEuNDE0cy0uMjA4LTEuMDM3LS41ODYtMS40MTV6TTE0IDExaC0zdjNIOXYtM0g2VjloM1Y2aDJ2M2gzdjJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd6b29tLWFyZWEtb3V0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNi4xNjMgMTMuNjA4QTcuNTAzIDcuNTAzIDAgMCAxIDE3LjgzNiA3LjM3VjMuNjAzYTEuNjcgMS42NyAwIDAgMC0xLjY2OC0xLjY2OEgzLjY2MWExLjY3IDEuNjcgMCAwIDAtMS42NjggMS42NjhWMTYuMTFhMS42NyAxLjY3IDAgMCAwIDEuNjY4IDEuNjY4aDMuNzY3YTcuNDY1IDcuNDY1IDAgMCAxLTEuMjY2LTQuMTY5elwiPjwvcGF0aD48cGF0aCBkPVwiTTExLjE2NiAxMi43NzVoNS4wMDN2MS42NjhoLTUuMDAzdi0xLjY2OHpcIj48L3BhdGg+PHBhdGggZD1cIk0yMi4wMzYgMjAuMjM3bC0zLjQ2OC0zLjQ2OGMuNTktLjkxMS45MzYtMS45OTUuOTM2LTMuMTYgMC0zLjIxOS0yLjYxOC01LjgzNy01LjgzNy01LjgzN1M3LjgzIDEwLjM5IDcuODMgMTMuNjA5czIuNjE4IDUuODM3IDUuODM3IDUuODM3YzEuMTQ5IDAgMi4yMi0uMzM5IDMuMTIzLS45MTZsMy40NzUgMy40NzYgMS43NjktMS43Njl6TTkuNDk5IDEzLjYwOGMwLTIuMjk5IDEuODctNC4xNjkgNC4xNjktNC4xNjlzNC4xNjkgMS44NyA0LjE2OSA0LjE2OWMwIDIuMjk4LTEuODcgNC4xNjktNC4xNjkgNC4xNjlzLTQuMTY5LTEuODctNC4xNjktNC4xNjl6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd6b29tLWFyZWEtaW4nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk02LjEzMyAxMy42NjhBNy41MDMgNy41MDMgMCAwIDEgMTcuODA2IDcuNDNWMy42NjNhMS42NyAxLjY3IDAgMCAwLTEuNjY4LTEuNjY4SDMuNjMxYTEuNjcgMS42NyAwIDAgMC0xLjY2OCAxLjY2OFYxNi4xN2ExLjY3IDEuNjcgMCAwIDAgMS42NjggMS42NjhoMy43NjdhNy40NjggNy40NjggMCAwIDEtMS4yNjYtNC4xNjl6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTQuNDcxIDExLjE2NmgtMS42Njh2MS42NjhoLTEuNjY4djEuNjY4aDEuNjY4djEuNjY4aDEuNjY4di0xLjY2OGgxLjY2OHYtMS42NjhoLTEuNjY4elwiPjwvcGF0aD48cGF0aCBkPVwiTTIyLjAwNiAyMC4yOTZsLTMuNDY4LTMuNDY4Yy41OS0uOTExLjkzNy0xLjk5Ni45MzctMy4xNiAwLTMuMjE5LTIuNjE4LTUuODM3LTUuODM3LTUuODM3cy01LjgzNyAyLjYxOC01LjgzNyA1LjgzNyAyLjYxOCA1LjgzNyA1LjgzNyA1LjgzN2MxLjE0OSAwIDIuMjItLjMzOSAzLjEyMy0uOTE2bDMuNDc1IDMuNDc1IDEuNzY5LTEuNzY4ek05LjQ2OSAxMy42NjhjMC0yLjI5OSAxLjg3LTQuMTY5IDQuMTY5LTQuMTY5czQuMTY5IDEuODcgNC4xNjkgNC4xNjljMCAyLjI5OC0xLjg3IDQuMTY5LTQuMTY5IDQuMTY5cy00LjE2OS0xLjg3MS00LjE2OS00LjE2OXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3ZpZXdzLWNhcmRzJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMi41NDcgNWg1djZoLTVWNXpcIj48L3BhdGg+PHBhdGggZD1cIk0yLjU0NyAxMi45NjloNXY2aC01di02elwiPjwvcGF0aD48cGF0aCBkPVwiTTkuNSAxMi45NjloNXY2aC01di02elwiPjwvcGF0aD48cGF0aCBkPVwiTTE2LjQ2OSAxMi45NjloNXY2aC01di02elwiPjwvcGF0aD48cGF0aCBkPVwiTTkuNSA1aDV2NmgtNVY1elwiPjwvcGF0aD48cGF0aCBkPVwiTTE2LjQ2OSA1aDV2NmgtNVY1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndmlldy10aHVtYm5haWxzJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTAuMDMxIDQuMDE2aDRWOGgtNFY0LjAxNnpcIj48L3BhdGg+PHBhdGggZD1cIk0xMC4wMzEgMTUuOTY5aDR2My45ODRoLTR2LTMuOTg0elwiPjwvcGF0aD48cGF0aCBkPVwiTTEwLjAzMSA5Ljk4NGg0djQuMDMxaC00VjkuOTg0elwiPjwvcGF0aD48cGF0aCBkPVwiTTE2LjAzMSA0LjA0N2g0djMuOTg0aC00VjQuMDQ3elwiPjwvcGF0aD48cGF0aCBkPVwiTTE2LjAzMSAxNmg0djMuOTg0aC00VjE2elwiPjwvcGF0aD48cGF0aCBkPVwiTTE2LjAzMSAxMC4wMTZoNHY0LjAzMWgtNHYtNC4wMzF6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNC4wMTYgNC4wMTZoNC4wMzFWOEg0LjAxNlY0LjAxNnpcIj48L3BhdGg+PHBhdGggZD1cIk00LjAxNiAxNS45NjloNC4wMzF2My45ODRINC4wMTZ2LTMuOTg0elwiPjwvcGF0aD48cGF0aCBkPVwiTTQuMDE2IDkuOTg0aDQuMDMxdjQuMDMxSDQuMDE2VjkuOTg0elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndmlldy1saXN0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNOSA0LjAxNmgxMlY4SDlWNC4wMTZ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNOSAxNS45NjloMTJ2My45ODRIOXYtMy45ODR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNOSA5Ljk4NGgxMnY0LjAzMUg5VjkuOTg0elwiPjwvcGF0aD48cGF0aCBkPVwiTTIuOTg0IDQuMDE2aDQuMDMxVjhIMi45ODRWNC4wMTZ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMi45ODQgMTUuOTY5aDQuMDMxdjMuOTg0SDIuOTg0di0zLjk4NHpcIj48L3BhdGg+PHBhdGggZD1cIk0yLjk4NCA5Ljk4NGg0LjAzMXY0LjAzMUgyLjk4NFY5Ljk4NHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3ZpZXctbGlzdC1hbHQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yLjk2OSA0LjAxNkgyMVY4SDIuOTY5VjQuMDE2elwiPjwvcGF0aD48cGF0aCBkPVwiTTIuOTM3IDE1Ljk2OUgyMXYzLjk4NEgyLjkzN3YtMy45ODR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMi45MzcgOS45ODRIMjF2NC4wMzFIMi45MzdWOS45ODR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd2aWV3LWNvbHVtbnMnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xLjk2OSA0Ljk2OUg3djE0SDEuOTY5di0xNHpcIj48L3BhdGg+PHBhdGggZD1cIk05LjQ1MyA0Ljk2OWg1LjAzMXYxNEg5LjQ1M3YtMTR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTYuOTM4IDQuOTY5aDUuMDMxdjE0aC01LjAzMXYtMTR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd2ZXJ0aWNhbC1hbGlnbi10b3AnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0zLjk4NCAzaDE2LjAzMXYyLjAxNkgzLjk4NFYzem00LjAzMiA4LjAxNkwxMiA2Ljk4NWwzLjk4NCA0LjAzMWgtM1YyMWgtMS45Njl2LTkuOTg0aC0zelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndmVydGljYWwtYWxpZ24tY2VudGVyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNC43MTIgMTEuMTA1aDE0LjU3NnYxLjc5SDQuNzEydi0xLjc5ek0xNS42MjMgNS42NUwxMiA5LjI3MyA4LjM3NyA1LjY1aDIuNzI4VjEuOTg1aDEuNzlWNS42NWgyLjcyOHptLTcuMjQ2IDEyLjdMMTIgMTQuNzI3bDMuNjIzIDMuNjIzaC0yLjcyOHYzLjY2NWgtMS43OVYxOC4zNUg4LjM3N3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3ZlcnRpY2FsLWFsaWduLWJvdHRvbScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTMuOTg0IDE4Ljk4NGgxNi4wMzFWMjFIMy45ODR2LTIuMDE2em0xMi02TDEyIDE3LjAxNWwtMy45ODQtNC4wMzFoM1YzaDEuOTY5djkuOTg0aDN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd1c2VycycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE1LjkyMiAxMy4wOTRjMS42ODEgMCAzLjA0Ny0xLjM2NiAzLjA0Ny0zLjA0N1MxNy42MDMgNyAxNS45MjIgN3MtMy4wNDcgMS4zNjYtMy4wNDcgMy4wNDcgMS4zNjYgMy4wNDcgMy4wNDcgMy4wNDd6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNOC45ODQgMTEuMDc4YzEuNjgxIDAgMy4wNDctMS4zNjYgMy4wNDctMy4wNDdzLTEuMzY2LTMuMDQ3LTMuMDQ3LTMuMDQ3UzUuOTM3IDYuMzUgNS45MzcgOC4wMzFzMS4zNjYgMy4wNDcgMy4wNDcgMy4wNDd6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTUuOTIyIDEzLjYwNmMtMy41ODggMC02LjA5NCAxLjg3OC02LjA5NCA0LjU2OXYuNzYyaDEyLjE4OHYtLjc2MmMwLTIuNjkxLTIuNTA2LTQuNTY5LTYuMDk0LTQuNTY5elwiPjwvcGF0aD48cGF0aCBkPVwiTTcuODkxIDE4LjE3NWMwLS45NzguMjI1LTEuOTAzLjY2OS0yLjc1YTYuMjQzIDYuMjQzIDAgMCAxIDEuODA2LTIuMDk0Yy4xNjYtLjEyNS4zMzgtLjI0MS41MTktLjM1M2ExMC41NzIgMTAuNTcyIDAgMCAwLTEuOS0uMTY2Yy00LjEyMiAwLTcgMi4xNTktNyA1LjI1di44NzVoNS45MDZ2LS43NjJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd1c2VyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMTJjMi4yMDYgMCA0LTEuNzk0IDQtNHMtMS43OTQtNC00LTQtNCAxLjc5NC00IDQgMS43OTQgNCA0IDR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTIgMTNjLTQuNzEgMC04IDIuNDY3LTggNnYxaDE2di0xYzAtMy41MzMtMy4yOS02LTgtNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3VzZXItdGltZW91dCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTguNjY2IDE1LjMzNEMxMC41MDUgMTUuMzM0IDEyIDEzLjgzOSAxMiAxMnMtMS40OTUtMy4zMzQtMy4zMzQtMy4zMzRTNS4zMzIgMTAuMTYxIDUuMzMyIDEyczEuNDk1IDMuMzM0IDMuMzM0IDMuMzM0elwiPjwvcGF0aD48cGF0aCBkPVwiTTguNjY2IDE2LjE2N2MtMy45MjUgMC02LjY2OCAyLjA1Ni02LjY2OCA1LjAwMXYuODMzaDEzLjMzNXYtLjgzM2MwLTIuOTQ1LTIuNzQyLTUuMDAxLTYuNjY4LTUuMDAxelwiPjwvcGF0aD48cGF0aCBkPVwiTTE3LjAwMSAxLjk4NUMxNC4yNDMgMS45ODUgMTIgNC4yMjkgMTIgNi45ODZzMi4yNDMgNS4wMDEgNS4wMDEgNS4wMDEgNS4wMDEtMi4yNDQgNS4wMDEtNS4wMDEtMi4yNDMtNS4wMDEtNS4wMDEtNS4wMDF6bTIuNSA1LjgzNGgtMy4zMzRWMy42NTJoMS42Njd2Mi41aDEuNjY3djEuNjY3elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndXNlci1zdWJ0cmFjdCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTkuNjQ3IDEyLjQ3MWMyLjA3NiAwIDMuNzY1LTEuNjg4IDMuNzY1LTMuNzY1cy0xLjY4OC0zLjc2NS0zLjc2NS0zLjc2NS0zLjc2NSAxLjY4OC0zLjc2NSAzLjc2NWEzLjc2OSAzLjc2OSAwIDAgMCAzLjc2NSAzLjc2NXpcIj48L3BhdGg+PHBhdGggZD1cIk05LjY0NyAxMy40MTJjLTQuNDMzIDAtNy41MjkgMi4zMjItNy41MjkgNS42NDdWMjBoMTUuMDU5di0uOTQxYzAtMy4zMjUtMy4wOTYtNS42NDctNy41MjktNS42NDd6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTYuMjM1IDRoNS42NDd2MS44ODJoLTUuNjQ3VjR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd1c2VyLXNxdWFyZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTYgMTcuMDE2VjE4aDEydi0uOTg0YzAtMi4wMTYtMy45ODQtMy4wOTQtNi0zLjA5NFM2IDE1IDYgMTcuMDE2ek0xNSA5YzAtMS42NDEtMS4zNTktMy0zLTNTOSA3LjM1OSA5IDlzMS4zNTkgMyAzIDMgMy0xLjM1OSAzLTN6TTMgNS4wMTZDMyAzLjkzOCAzLjg5MSAzIDUuMDE2IDNoMTMuOTY5YzEuMDc4IDAgMi4wMTYuOTM4IDIuMDE2IDIuMDE2djEzLjk2OWMwIDEuMDc4LS45MzggMi4wMTYtMi4wMTYgMi4wMTZINS4wMTZDMy44OTEgMjEuMDAxIDMgMjAuMDYzIDMgMTguOTg1VjUuMDE2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndXNlci1zZWFyY2gnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yMS41MTIgMTEuMTY3bC0yLjcwNi0yLjcwNmE0LjEzMyA0LjEzMyAwIDAgMCAuNjk0LTIuMjk0QzE5LjUgMy44NjkgMTcuNjMxIDIgMTUuMzMzIDJzLTQuMTY3IDEuODY5LTQuMTY3IDQuMTY3IDEuODY5IDQuMTY3IDQuMTY3IDQuMTY3Yy44NDggMCAxLjYzNi0uMjU4IDIuMjk0LS42OTRsMi43MDYgMi43MDYgMS4xNzgtMS4xNzh6bS04LjY3OS01YzAtMS4zNzggMS4xMjItMi41IDIuNS0yLjVzMi41IDEuMTIyIDIuNSAyLjUtMS4xMjIgMi41LTIuNSAyLjUtMi41LTEuMTIyLTIuNS0yLjV6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNOC42NjcgMTUuMzMzQzEwLjUwNSAxNS4zMzMgMTIgMTMuODM4IDEyIDEycy0xLjQ5NS0zLjMzMy0zLjMzMy0zLjMzM1M1LjMzNCAxMC4xNjMgNS4zMzQgMTJhMy4zMzcgMy4zMzcgMCAwIDAgMy4zMzMgMy4zMzN6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNOC42NjcgMTYuMTY3Yy0zLjkyNSAwLTYuNjY3IDIuMDU3LTYuNjY3IDVWMjJoMTMuMzMzdi0uODMzYzAtMi45NDMtMi43NDItNS02LjY2Ny01elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndXNlci1yZWZyZXNoJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNOC42NjYgMTYuMTY3Yy0zLjkyNSAwLTYuNjY3IDIuMDU2LTYuNjY3IDVWMjJoMTMuMzMzdi0uODMzYzAtMi45NDQtMi43NDItNS02LjY2Ny01elwiPjwvcGF0aD48cGF0aCBkPVwiTTguODM3IDguNjg0Yy0uMDU4LS4wMDMtLjExMy0uMDE4LS4xNzEtLjAxOC0xLjgzOCAwLTMuMzMzIDEuNDk1LTMuMzMzIDMuMzMzczEuNDk1IDMuMzMzIDMuMzMzIDMuMzMzYTMuMzI4IDMuMzI4IDAgMCAwIDMuMDA5LTEuOTI0IDguMzE3IDguMzE3IDAgMCAxLTIuODM4LTQuNzI1elwiPjwvcGF0aD48cGF0aCBkPVwiTTE3IDEwLjMzM2MtLjg5NyAwLTEuNzItLjM2Ny0yLjM0My0uOTkxbDEuNTA5LTEuNTA5aC00LjE2N1YxMmwxLjQ3LTEuNDdhNS4wMjQgNS4wMjQgMCAwIDAgMy41MyAxLjQ3YzIuNzU3IDAgNS0yLjI0MiA1LTVoLTEuNjY3YTMuMzM3IDMuMzM3IDAgMCAxLTMuMzMzIDMuMzMzelwiPjwvcGF0aD48cGF0aCBkPVwiTTIwLjUzMiAzLjQ2OEE0Ljk0NSA0Ljk0NSAwIDAgMCAxNyAyLjAwMWMtMi43NTcgMC01IDIuMjQyLTUgNWgxLjY2N0EzLjMzNyAzLjMzNyAwIDAgMSAxNyAzLjY2OGMuODk4IDAgMS43MjEuMzY3IDIuMzQzLjk5bC0xLjUxIDEuNTFIMjJWMi4wMDFsLTEuNDY3IDEuNDY3elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndXNlci1sb2NrJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjEuMTY3IDUuMzMzQzIxLjE2NyAzLjQ5NSAxOS42NzIgMiAxNy44MzQgMnMtMy4zMzMgMS40OTUtMy4zMzMgMy4zMzNhLjgzMi44MzIgMCAwIDAtLjgzMy44MzN2NS44MzNjMCAuNDYxLjM3Mi44MzMuODMzLjgzM2g2LjY2N2EuODMyLjgzMiAwIDAgMCAuODMzLS44MzNWNi4xNjZhLjgzMi44MzIgMCAwIDAtLjgzMy0uODMzem0tMy4zMzQtMS42NjZBMS42NyAxLjY3IDAgMCAxIDE5LjUgNS4zMzRoLTMuMzMzYTEuNjcgMS42NyAwIDAgMSAxLjY2Ny0xLjY2N3ptMi41IDcuNWgtNVY3aDV2NC4xNjd6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTguNjY3IDguNjY3YS44MzMuODMzIDAgMSAxLTEuNjY2IDAgLjgzMy44MzMgMCAwIDEgMS42NjYgMHpcIj48L3BhdGg+PHBhdGggZD1cIk04LjY2NyAxNS4zMzNDMTAuNTA1IDE1LjMzMyAxMiAxMy44MzggMTIgMTJzLTEuNDk1LTMuMzMzLTMuMzMzLTMuMzMzUzUuMzM0IDEwLjE2MyA1LjMzNCAxMmEzLjMzNyAzLjMzNyAwIDAgMCAzLjMzMyAzLjMzM3pcIj48L3BhdGg+PHBhdGggZD1cIk04LjY2NyAxNi4xNjdjLTMuOTI1IDAtNi42NjcgMi4wNTctNi42NjcgNVYyMmgxMy4zMzN2LS44MzNjMC0yLjk0My0yLjc0Mi01LTYuNjY3LTV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd1c2VyLWNsb3NlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTAuMDYgMTQuMDEzYzEuODg2IDAgMy40Mi0xLjUzNCAzLjQyLTMuNDJzLTEuNTM0LTMuNDItMy40Mi0zLjQyLTMuNDIgMS41MzQtMy40MiAzLjQyYTMuNDI0IDMuNDI0IDAgMCAwIDMuNDIgMy40MnpcIj48L3BhdGg+PHBhdGggZD1cIk0xMC4wNiAxNC44NjhjLTQuMDI4IDAtNi44NDEgMi4xMS02Ljg0MSA1LjEzMXYuODU1aDEzLjY4MnYtLjg1NWMwLTMuMDIxLTIuODEzLTUuMTMxLTYuODQxLTUuMTMxelwiPjwvcGF0aD48cGF0aCBkPVwiTTIxLjc4MSA0LjM1NmwtMS4yMDktMS4yMDktMS45NjEgMS45NjEtMS45NjEtMS45NjEtMS4yMDkgMS4yMDkgMS45NjEgMS45NjEtMS45NjEgMS45NjEgMS4yMDkgMS4yMDkgMS45NjEtMS45NjEgMS45NjEgMS45NjEgMS4yMDktMS4yMDktMS45NjEtMS45NjF6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd1c2VyLWNpcmNsZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDE5LjIxOWMyLjQ4NCAwIDQuNjg4LTEuMzEzIDYtMy4yMzQtLjA0Ny0xLjk2OS00LjAzMS0zLjA5NC02LTMuMDk0LTIuMDE2IDAtNS45NTMgMS4xMjUtNiAzLjA5NCAxLjMxMyAxLjkyMiAzLjUxNiAzLjIzNCA2IDMuMjM0em0wLTE0LjIwM2MtMS42NDEgMC0zIDEuMzU5LTMgM3MxLjM1OSAzIDMgMyAzLTEuMzU5IDMtMy0xLjM1OS0zLTMtM3ptMC0zYzUuNTMxIDAgOS45ODQgNC40NTMgOS45ODQgOS45ODRTMTcuNTMxIDIxLjk4NCAxMiAyMS45ODQgMi4wMTYgMTcuNTMxIDIuMDE2IDEyIDYuNDY5IDIuMDE2IDEyIDIuMDE2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndXNlci1jaGVjaycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTkuMDA1IDEzLjIwOWMxLjk3IDAgMy41NzItMS42MDIgMy41NzItMy41NzJzLTEuNjAyLTMuNTcyLTMuNTcyLTMuNTcyLTMuNTcyIDEuNjAzLTMuNTcyIDMuNTcyYTMuNTc2IDMuNTc2IDAgMCAwIDMuNTcyIDMuNTcyelwiPjwvcGF0aD48cGF0aCBkPVwiTTkuMDA1IDE0LjEwMmMtNC4yMDYgMC03LjE0NSAyLjIwNC03LjE0NSA1LjM1OXYuODkzaDE0LjI4OXYtLjg5M2MwLTMuMTU0LTIuOTM4LTUuMzU5LTcuMTQ1LTUuMzU5elwiPjwvcGF0aD48cGF0aCBkPVwiTTE3LjA0MyAxMC4wMDZsLTMuMzExLTMuMzExIDEuMjYzLTEuMjYzIDIuMDQ4IDIuMDQ4IDMuODM0LTMuODM0IDEuMjYzIDEuMjYzelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndXNlci1ibG9jaycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE3IDJjLTIuNzU3IDAtNSAyLjI0My01IDVzMi4yNDMgNSA1IDUgNS0yLjI0MiA1LTVjMC0yLjc1Ny0yLjI0Mi01LTUtNXptMCAxLjY2N2MuNjE2IDAgMS4xODguMTggMS42ODMuNDcybC00LjU0NSA0LjU0NWEzLjMwOSAzLjMwOSAwIDAgMS0uNDcyLTEuNjgzIDMuMzM3IDMuMzM3IDAgMCAxIDMuMzMzLTMuMzMzem0wIDYuNjY2YTMuMjk2IDMuMjk2IDAgMCAxLTEuNjgzLS40NzJsNC41NDMtNC41NDNBMy4yOSAzLjI5IDAgMCAxIDIwLjMzMiA3YTMuMzM3IDMuMzM3IDAgMCAxLTMuMzMzIDMuMzMzelwiPjwvcGF0aD48cGF0aCBkPVwiTTguNjY3IDE1LjMzM0MxMC41MDUgMTUuMzMzIDEyIDEzLjgzOCAxMiAxMnMtMS40OTUtMy4zMzMtMy4zMzMtMy4zMzNTNS4zMzQgMTAuMTYyIDUuMzM0IDEyYTMuMzM3IDMuMzM3IDAgMCAwIDMuMzMzIDMuMzMzelwiPjwvcGF0aD48cGF0aCBkPVwiTTguNjY3IDE2LjE2N2MtMy45MjUgMC02LjY2NyAyLjA1Ni02LjY2NyA1VjIyaDEzLjMzM3YtLjgzM2MwLTIuOTQ0LTIuNzQyLTUtNi42NjctNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3VzZXItYWRkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNOS4zIDEzLjhjMS45ODUgMCAzLjYtMS42MTUgMy42LTMuNnMtMS42MTUtMy42LTMuNi0zLjYtMy42IDEuNjE1LTMuNiAzLjYgMS42MTUgMy42IDMuNiAzLjZ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNOS4zIDE0LjdjLTQuMjM5IDAtNy4yIDIuMjItNy4yIDUuNHYuOWgxNC40di0uOWMwLTMuMTgtMi45NjEtNS40LTcuMi01LjR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMjEuOSA1LjdoLTIuN1YzaC0xLjh2Mi43aC0yLjd2MS44aDIuN3YyLjdoMS44VjcuNWgyLjd6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd1cGRhdGUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMi41MzEgNy45NnY0LjI5MWwzLjUyNyAyLjE0NS0uNzE1IDEuMjM5LTQuMzM4LTIuNjIyVjcuOTZoMS41MjV6bTguNjI4IDIuMTQ1aC02LjkxMmwyLjgxMi0yLjg2QzE0LjI5NCA0LjQ4IDkuNzY2IDQuMzg1IDcgNy4xNDlTNC4yMzUgMTQuMyA3IDE3LjA2NHM3LjI5MyAyLjc2NSAxMC4wNTkgMGMxLjM4My0xLjM4MyAyLjA1LTIuOTU2IDIuMDUtNC45NThoMi4wNWMwIDIuMDAyLS44NTggNC42MjQtMi42NyA2LjM4OC0zLjU3NSAzLjUyNy05LjM5MSAzLjUyNy0xMi45NjYgMHMtMy41NzUtOS4yNDggMC0xMi43NzUgOS4yOTYtMy41MjcgMTIuODcxIDBsMi43NjUtMi44NnY3LjI0NXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3VubG9jaycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE3IDExSDlWN2EzIDMgMCAxIDEgNiAwdjEuOTVoMlY3QTUgNSAwIDAgMCA3IDd2NGEyIDIgMCAwIDAtMiAydjdhMiAyIDAgMCAwIDIgMmgxMGEyIDIgMCAwIDAgMi0ydi03YTIgMiAwIDAgMC0yLTJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd1bmZvbGQtbW9yZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDE4LjE4OEwxNS4xODggMTVsMS40MDYgMS40MDZMMTIgMjFsLTQuNTk0LTQuNTk0TDguODEyIDE1em0wLTEyLjM3NUw4LjgxMiA5LjAwMSA3LjQwNiA3LjU5NSAxMiAzLjAwMWw0LjU5NCA0LjU5NC0xLjQwNiAxLjQwNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3VuZm9sZC1sZXNzJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTYuNTk0IDUuMzkxTDEyIDkuOTg1IDcuNDA2IDUuMzkxbDEuNDA2LTEuNDA2TDEyIDcuMTczbDMuMTg4LTMuMTg4ek03LjQwNiAxOC42MDlMMTIgMTQuMDE1bDQuNTk0IDQuNTk0LTEuNDA2IDEuNDA2TDEyIDE2LjgyN2wtMy4xODggMy4xODh6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICd1bmRvMicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTUuNjUgNS42NDRBOC45NTMgOC45NTMgMCAwIDEgMTIuMDA2IDNjNC45NzIgMCA4Ljk4OSA0LjAyNyA4Ljk4OSA5cy00LjAxNiA5LTguOTg5IDljLTQuMTk2IDAtNy42OTUtMi44NjktOC42OTYtNi43NWgyLjM0YTYuNzQgNi43NCAwIDAgMCA2LjM1NiA0LjVjMy43MjQgMCA2Ljc1LTMuMDI2IDYuNzUtNi43NXMtMy4wMjYtNi43NS02Ljc1LTYuNzVjLTEuODY3IDAtMy41MzMuNzc2LTQuNzQ4IDIuMDAybDMuNjIyIDMuNjIySDMuMDA1VjIuOTk5bDIuNjQ0IDIuNjQ0elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndW5kbycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE3LjIwMiAyMmMyLjIyMS00LjAyNCAyLjU5NS0xMC4xNjItNi4xMy05Ljk1N1YxN2wtNy41LTcuNSA3LjUtNy41djQuODUxQzIxLjUyIDYuNTc4IDIyLjY4NSAxNi4wNzQgMTcuMjAyIDIyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndHJhc2gnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNSA1VjNIOXYySDN2MmgxOFY1elwiPjwvcGF0aD48cGF0aCBkPVwiTTUgOHYxMmMwIDEuMTAzLjg5NyAyIDIgMmgxMGMxLjEwMyAwIDItLjg5NyAyLTJWOEg1em02IDEwSDl2LTZoMnY2em00IDBoLTJ2LTZoMnY2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjYsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndHJhZGVtYXJrJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjZcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjYgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTEuOTEgNy4xNzl2MS4xNzVhLjMyMS4zMjEgMCAwIDEtLjMyMS4zMTFIOC41OTZ2OC4xNTZhLjMxNS4zMTUgMCAwIDEtLjMxMS4zMjFINi45MjlhLjMxNy4zMTcgMCAwIDEtLjMyMS0uMzIxVjguNjY1SDMuNjI1YS4zMTUuMzE1IDAgMCAxLS4zMjEtLjMxMVY3LjE3OWMwLS4xODEuMTQxLS4zMjEuMzIxLS4zMjFoNy45NjVjLjE3MSAwIC4zMjEuMTQxLjMyMS4zMjF6bTEwLjQyNy0uMDMxbC43NzMgOS42NTNhLjMxLjMxIDAgMCAxLS4wOC4yNDFjLS4wNi4wNi0uMTQxLjEtLjIzMS4xaC0xLjM0NmEuMzE2LjMxNiAwIDAgMS0uMzExLS4yOTFsLS40NjItNS45MDYtMS44OTggNC4yNjlhLjMwNi4zMDYgMCAwIDEtLjI5MS4xOTFoLTEuMjA1YS4zMjUuMzI1IDAgMCAxLS4yOTEtLjE5MWwtMS44ODgtNC4yODktLjQ1MiA1LjkyNmEuMzE2LjMxNiAwIDAgMS0uMzExLjI5MWgtMS4zNTZhLjMyOC4zMjggMCAwIDEtLjIzMS0uMS4zNi4zNiAwIDAgMS0uMDktLjI0MWwuNzg0LTkuNjUzYS4zMTYuMzE2IDAgMCAxIC4zMTEtLjI5MWgxLjQyNmEuMzIuMzIgMCAwIDEgLjI5MS4xOTFsMi4yMSA1LjIyM2MuMDcuMTYxLjE0MS4zNDIuMjAxLjUxMi4wNy0uMTcxLjEzMS0uMzUyLjIwMS0uNTEybDIuMjItNS4yMjNhLjMyMy4zMjMgMCAwIDEgLjI5MS0uMTkxaDEuNDE2Yy4xNzEgMCAuMzExLjEzMS4zMjEuMjkxelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndG9jJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTguOTg0IDEyLjk4NHYtMS45NjlIMjF2MS45NjloLTIuMDE2em0wLTZIMjFWOWgtMi4wMTZWNi45ODR6bTAgMTAuMDMyVjE1SDIxdjIuMDE2aC0yLjAxNnpNMyAxNy4wMTZWMTVoMTQuMDE2djIuMDE2SDN6bTAtNC4wMzJ2LTEuOTY5aDE0LjAxNnYxLjk2OUgzek0zIDlWNi45ODRoMTQuMDE2VjlIM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3RpdGxlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNS4wMTYgMy45ODRoMTMuOTY5djNoLTUuNDg0djEyaC0zdi0xMkg1LjAxN3YtM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3RpbWVyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMjAuMDE2YzMuODkxIDAgNi45ODQtMy4xNDEgNi45ODQtNy4wMzFTMTUuODkgNi4wMDEgMTIgNi4wMDFzLTYuOTg0IDMuMDk0LTYuOTg0IDYuOTg0UzguMTEgMjAuMDE2IDEyIDIwLjAxNnptNy4wMzEtMTIuNjFDMjAuMjUgOC45NTMgMjEgMTAuODc1IDIxIDEyLjk4NGMwIDQuOTY5LTQuMDMxIDktOSA5cy05LTQuMDMxLTktOSA0LjAzMS05IDktOWMyLjEwOSAwIDQuMDc4Ljc5NyA1LjYyNSAyLjAxNmwxLjQwNi0xLjQ1M2MuNTE2LjQyMi45ODQuODkxIDEuNDA2IDEuNDA2em0tOC4wMTUgNi42MXYtNmgxLjk2OXY2aC0xLjk2OXpNMTUgLjk4NFYzSDlWLjk4NGg2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndGltZXItb2ZmJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMjAuMDE2YzEuMjY2IDAgMi40ODQtLjM3NSAzLjUxNi0uOTg0TDUuOTUzIDkuNDY5YTYuOTIyIDYuOTIyIDAgMCAwLS45MzggMy41MTZjMCAzLjg5MSAzLjA5NCA3LjAzMSA2Ljk4NCA3LjAzMXpNMyAzLjk4NEwyMC43NjYgMjEuNzUgMTkuNSAyMy4wMTZsLTIuNTMxLTIuNTMxYy0xLjQ1My45MzgtMy4xNDEgMS41LTQuOTY5IDEuNS00Ljk2OSAwLTktNC4wMzEtOS05IDAtMS44MjguNTYzLTMuNTYzIDEuNS00Ljk2OUwxLjczNCA1LjI1em04LjAxNiA1LjQzOFY4LjAxNmgxLjk2OXYzLjQyMnpNMTUgLjk4NFYzSDlWLjk4NGg2em00LjAzMSAzLjU2M2wxLjQwNiAxLjQwNi0xLjQwNiAxLjQ1M0MyMC4yNSA4Ljk1MyAyMSAxMC44NzUgMjEgMTIuOTg0YTkuMDAxIDkuMDAxIDAgMCAxLTEuNSA0Ljk2OUwxOC4wNDcgMTYuNWE2LjkyMiA2LjkyMiAwIDAgMCAuOTM4LTMuNTE2QTYuOTQyIDYuOTQyIDAgMCAwIDEyLjAwMSA2YTYuNzQxIDYuNzQxIDAgMCAwLTMuNDY5LjkzOGwtMS41LTEuNDUzYTguOTkzIDguOTkzIDAgMCAxIDQuOTY5LTEuNWMyLjEwOSAwIDQuMDc4Ljc1IDUuNjI1IDEuOTY5elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnVGh1bWItdXAnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yLjg4NiAxOS43ODZINi4yVjkuODQzSDIuODg2djkuOTQzem0xOC4yMjgtOS4xMTVjMC0uOTExLS43NDYtMS42NTctMS42NTctMS42NTdoLTUuMjI4bC43ODctMy43ODcuMDI1LS4yNjVjMC0uMzQtLjE0MS0uNjU1LS4zNjUtLjg3OGwtLjg3OC0uODctNS40NTIgNS40NmExLjYxOSAxLjYxOSAwIDAgMC0uNDg5IDEuMTY4djguMjg2YzAgLjkxMS43NDYgMS42NTcgMS42NTcgMS42NTdoNy40NTdjLjY4OCAwIDEuMjc2LS40MTQgMS41MjUtMS4wMTFsMi41MDItNS44NDFjLjA3NS0uMTkxLjExNi0uMzg5LjExNi0uNjA1di0xLjY1N3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ1RodW1iLWRvd24nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNC4xNjkgNS4wNzJINi43NjNjLS42ODQgMC0xLjI2Ni40MTItMS41MTIgMS4wMDNsLTIuNDg0IDUuODAzYTEuNjE0IDEuNjE0IDAgMCAwLS4xMTYuNnYxLjY0N2MwIC45MDYuNzQxIDEuNjQ3IDEuNjQ3IDEuNjQ3aDUuMTkxbC0uNzgxIDMuNzU5LS4wMjUuMjYyYzAgLjMzNy4xNDEuNjUuMzYzLjg3MmwuODcyLjg2MiA1LjQyMi01LjQyMmExLjYzIDEuNjMgMCAwIDAgLjQ3OC0xLjE1OVY2LjcxOGExLjY1NiAxLjY1NiAwIDAgMC0xLjY0Ny0xLjY0N3ptMy4yOSAwdjkuODcyaDMuMjkxVjUuMDcyaC0zLjI5MXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3RleHRpbmcnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOC44ODEgMy4wMzFoLTEzLjhjLTEuMTcyIDAtMi4xMjIuOTUtMi4xMjIgMi4xMjJ2MTUuODMxTDYuOTQzIDE3SDE4Ljg4YzEuMTcyIDAgMi4xMjItLjk1IDIuMTIyLTIuMTIyVjUuMTUzYzAtMS4xNzItLjk1LTIuMTIyLTIuMTIyLTIuMTIyem0tOS45MDkgNy45ODhINi45ODhWOS4wMDNoMS45ODR2Mi4wMTZ6bTQuMDE1IDBoLTEuOTg0VjkuMDAzaDEuOTg0djIuMDE2em00LjAxNiAwaC0xLjk4NFY5LjAwM2gxLjk4NHYyLjAxNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3RleHQtd3JhcCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE3LjAxNiAxMS4wMTZDMTkuMjE5IDExLjAxNiAyMSAxMi43OTcgMjEgMTVzLTEuNzgxIDMuOTg0LTMuOTg0IDMuOTg0SDE1VjIxbC0zLTMgMy0zdjIuMDE2aDIuMjVjMS4wNzggMCAyLjAxNi0uOTM4IDIuMDE2LTIuMDE2cy0uOTM4LTIuMDE2LTIuMDE2LTIuMDE2SDMuOTg0di0xLjk2OWgxMy4wMzF6bTMtNnYxLjk2OUgzLjk4NVY1LjAxNmgxNi4wMzF6TTMuOTg0IDE4Ljk4NHYtMS45NjloNnYxLjk2OWgtNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI2LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3RhZ3MnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNlwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNiAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk03LjEzMiA3LjAwN2MwLS44MS0uNjUxLTEuNDYxLTEuNDYxLTEuNDYxUzQuMjEgNi4xOTcgNC4yMSA3LjAwN3MuNjUxIDEuNDYxIDEuNDYxIDEuNDYxIDEuNDYxLS42NTEgMS40NjEtMS40NjF6bTEyLjE3NyA2LjU3NGMwIC4zODgtLjE2Ljc2NS0uNDIyIDEuMDI3bC01LjYwNCA1LjYxNWMtLjI3NC4yNjItLjY1MS40MjItMS4wMzkuNDIycy0uNzY1LS4xNi0xLjAyNy0uNDIybC04LjE2LTguMTcyYy0uNTgyLS41Ny0xLjAzOS0xLjY3OC0xLjAzOS0yLjQ4OFY0LjgxNWMwLS43OTkuNjYyLTEuNDYxIDEuNDYxLTEuNDYxaDQuNzQ4Yy44MSAwIDEuOTE3LjQ1NiAyLjQ5OSAxLjAzOWw4LjE2IDguMTQ4Yy4yNjIuMjc0LjQyMi42NTEuNDIyIDEuMDM5em00LjM4MyAwYzAgLjM4OC0uMTYuNzY1LS40MjIgMS4wMjdsLTUuNjA0IDUuNjE1YTEuNTIxIDEuNTIxIDAgMCAxLTEuMDM5LjQyMmMtLjU5MyAwLS44OS0uMjc0LTEuMjc4LS42NzNsNS4zNjQtNS4zNjRjLjI2Mi0uMjYyLjQyMi0uNjM5LjQyMi0xLjAyN3MtLjE2LS43NjUtLjQyMi0xLjAzOWwtOC4xNi04LjE0OGMtLjU4Mi0uNTgyLTEuNjg5LTEuMDM5LTIuNDk5LTEuMDM5aDIuNTU2Yy44MSAwIDEuOTE3LjQ1NiAyLjQ5OSAxLjAzOWw4LjE2IDguMTQ4Yy4yNjIuMjc0LjQyMi42NTEuNDIyIDEuMDM5elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjEsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnVGFnJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjFcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjEgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNi45NjEgNy4yOTZjMC0uNzYzLS42MTMtMS4zNzYtMS4zNzYtMS4zNzZzLTEuMzc2LjYxMy0xLjM3NiAxLjM3Ni42MTMgMS4zNzYgMS4zNzYgMS4zNzYgMS4zNzYtLjYxMyAxLjM3Ni0xLjM3NnptMTEuNDczIDYuMTkzYzAgLjM2NS0uMTUxLjcyMS0uMzk4Ljk2OGwtNS4yOCA1LjI5MWExLjM4NSAxLjM4NSAwIDAgMS0xLjk0NyAwbC03LjY4OC03LjY5OWMtLjU0OC0uNTM3LS45NzktMS41ODEtLjk3OS0yLjM0NFY1LjIzMmMwLS43NTMuNjIzLTEuMzc2IDEuMzc2LTEuMzc2aDQuNDczYy43NjMgMCAxLjgwNi40MyAyLjM1NS45NzlsNy42ODggNy42NzdjLjI0Ny4yNTguMzk4LjYxMy4zOTguOTc5elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndGFnLWxhcmdlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjEuNDEgMTEuNThsLTktOUMxMi4wNSAyLjIyIDExLjU1IDIgMTEgMkg0Yy0xLjEgMC0yIC45LTIgMnY3YzAgLjU1LjIyIDEuMDUuNTkgMS40Mmw5IDljLjM2LjM2Ljg2LjU4IDEuNDEuNThzMS4wNS0uMjIgMS40MS0uNTlsNy03Yy4zNy0uMzYuNTktLjg2LjU5LTEuNDFzLS4yMy0xLjA2LS41OS0xLjQyek01LjUgN0M0LjY3IDcgNCA2LjMzIDQgNS41UzQuNjcgNCA1LjUgNCA3IDQuNjcgNyA1LjUgNi4zMyA3IDUuNSA3elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAndGFibGV0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTcuODMzIDJINi4xNjZjLTEuMTUgMC0yLjA4My45MzMtMi4wODMgMi4wODN2MTUuODMzYzAgMS4xNS45MzMgMi4wODMgMi4wODMgMi4wODNoMTEuNjY3YzEuMTUgMCAyLjA4My0uOTMzIDIuMDgzLTIuMDgzVjQuMDgzYzAtMS4xNS0uOTMzLTIuMDgzLTIuMDgzLTIuMDgzek0xMiAyMS4xNjdjLS42OTIgMC0xLjI1LS41NTgtMS4yNS0xLjI1cy41NTgtMS4yNSAxLjI1LTEuMjUgMS4yNS41NTggMS4yNSAxLjI1LS41NTggMS4yNS0xLjI1IDEuMjV6bTYuMjUtMy4zMzRINS43NVY0LjVoMTIuNXYxMy4zMzN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdzd2FwLXZlcnRpY2FsJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNOSAzbDMuOTg0IDMuOTg0aC0zdjcuMDMxSDguMDE1VjYuOTg0aC0zem02Ljk4NCAxNC4wMTZoM0wxNSAyMWwtMy45ODQtMy45ODRoM1Y5Ljk4NWgxLjk2OXY3LjAzMXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3N3YXAtaG9yaXpvbnRhbCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIxIDlsLTMuOTg0IDMuOTg0di0zSDkuOTg1VjguMDE1aDcuMDMxdi0zek02Ljk4NCAxMS4wMTZ2M2g3LjAzMXYxLjk2OUg2Ljk4NHYzTDMgMTUuMDAxelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnc3RyZWV0LXNpZ25zJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjEuOTEyIDUuNzUzYS4zNTkuMzU5IDAgMCAxIDAgLjUxM2wtMi4wNDQgMS40MTljLS4yLjItLjQ4MS4zMTItLjc1OS4zMTJINC43MzRhLjcyMi43MjIgMCAwIDEtLjcxNi0uNzE2VjQuNzM3YzAtLjM5MS4zMjUtLjcxNi43MTYtLjcxNmg1LjgzNFYyLjcxNWMwLS4zOTEuMzI1LS43MTYuNzE2LS43MTZoMS40MjhjLjM5MSAwIC43MTYuMzI1LjcxNi43MTZ2MS4zMDloNS41OTFjLjI3OCAwIC41NTkuMTEzLjc1OS4zMTJsMi4xMzQgMS40MTZ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTAuNTcyIDE1Ljk3OGgyLjg1NnY1LjMwOWEuNzIyLjcyMiAwIDAgMS0uNzE2LjcxNmgtMS40MjhhLjcyMi43MjIgMCAwIDEtLjcxNi0uNzE2bC4wMDMtNS4zMDl6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMjAuMjk0IDExLjA0MWMuMzkxIDAgLjcxNi4zMjUuNzE2LjcxNnYyLjU0NGEuNzIyLjcyMiAwIDAgMS0uNzE2LjcxNkg2LjA0NGMtLjI3OCAwLS41NTktLjExMi0uNzU5LS4zMTJsLTIuMi0xLjQxOWEuMzU5LjM1OSAwIDAgMSAwLS41MTNsMi4yLTEuNDE5Yy4yLS4yLjQ4MS0uMzEyLjc1OS0uMzEyaDQuNTI4VjkuMDIzaDIuODU2djIuMDE5aDYuODY2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnc3RvcmUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yMS43MDYgMTAuNzYxbC0yLjY2Ny02LjIyMkEuODkuODkgMCAwIDAgMTguMjIyIDRINS43NzhhLjg4OC44ODggMCAwIDAtLjgxNy41MzlsLTIuNjY3IDYuMjIyQS44OS44OSAwIDAgMCAzLjExMSAxMkg0djcuMTExYzAgLjQ5Mi4zOTguODg5Ljg4OS44ODloOC44ODl2LTYuMjIyaDMuNTU2VjIwaDEuNzc4YS44ODguODg4IDAgMCAwIC44ODktLjg4OVYxMmguODg5YS44ODYuODg2IDAgMCAwIC44MTctMS4yMzl6bS0xMC41OTUgNi41NzJINi42Njd2LTMuNTU2aDQuNDQ0djMuNTU2em04LjQyOS03LjExMWgtMi40MjZsLTEuMjY5LTQuNDQ0aDEuNzkxbDEuOTA0IDQuNDQ0em0tMTAuODA2IDBsMS4yNjktNC40NDRoMS4xMDh2NC40NDRIOC43MzR6bTQuMTU1LTQuNDQ0aDEuMTA4bDEuMjY5IDQuNDQ0aC0yLjM3N1Y1Ljc3OHptLTYuNTI1IDBoMS43OTFsLTEuMjY5IDQuNDQ0SDQuNDZsMS45MDQtNC40NDR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdzdGVwLW5leHQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0zLjUgMTguOTlsMTEgLjAxYy42NyAwIDEuMjctLjMzIDEuNjMtLjg0TDIwLjUgMTJsLTQuMzctNi4xNmMtLjM2LS41MS0uOTYtLjg0LTEuNjMtLjg0bC0xMSAuMDFMOC4zNCAxMiAzLjUgMTguOTl6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdzdGFyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIuMDAxIDE3LjY5NmwtNi4xMzcgMy43MTkgMS42MjctNi45NzQtNS4zOTMtNC42OTUgNy4xMTMtLjYwNUwxMiAyLjU4NmwyLjc4OSA2LjU1NSA3LjExMy42MDUtNS4zOTMgNC42OTUgMS42MjcgNi45NzR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdzdGFyLW8nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMiAxNS45MTRsMy43NSAyLjI1LS45ODQtNC4yNjYgMy4zMjgtMi45MDYtNC40MDYtLjM3NUwxMiA2LjU4NmwtMS42ODggNC4wMzEtNC40MDYuMzc1IDMuMzI4IDIuOTA2LS45ODQgNC4yNjZ6bTkuOTg0LTYuMTg3bC01LjQzOCA0LjczNCAxLjY0MSA3LjAzMS02LjE4OC0zLjc1LTYuMTg4IDMuNzUgMS42NDEtNy4wMzEtNS40MzgtNC43MzQgNy4xNzItLjYwOSAyLjgxMy02LjYwOSAyLjgxMyA2LjYwOXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3N0YXItaGFsZicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDE1LjkxNGwzLjc1IDIuMjUtLjk4NC00LjI2NiAzLjMyOC0yLjkwNi00LjQwNi0uMzc1TDEyIDYuNTg2djkuMzI4em05Ljk4NC02LjE4N2wtNS40MzggNC43MzQgMS42NDEgNy4wMzEtNi4xODgtMy43NS02LjE4OCAzLjc1IDEuNjQxLTcuMDMxLTUuNDM4LTQuNzM0IDcuMTcyLS42MDkgMi44MTMtNi42MDkgMi44MTMgNi42MDl6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdzcGVsbGNoZWNrJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjEuNjA5IDExLjU3OGwxLjQwNiAxLjQwNi05LjUxNiA5LjUxNi01LjA2My01LjEwOSAxLjQwNi0xLjQwNiAzLjY1NiAzLjcwM3ptLTE1LjE4Ny0uNTYyaDQuMTI1TDguNDg0IDUuNDg1em02LjA0NyA0Ljk2OGwtMS4xNzItM0g1LjY3MmwtMS4xMjUgM0gyLjQzOEw3LjU0NyAzaDEuODc1bDUuMTA5IDEyLjk4NGgtMi4wNjN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdzb3J0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTcuMDA2IDE0LjAyNWEuNjgzLjY4MyAwIDAgMS0uMi40NzVsLTQuNzI4IDQuNzI4YS42NjUuNjY1IDAgMCAxLS45NSAwTDYuNDAzIDE0LjVhLjY2NS42NjUgMCAwIDEtLjItLjQ3NS42OC42OCAwIDAgMSAuNjc1LS42NzVoOS40NTZhLjY4LjY4IDAgMCAxIC42NzIuNjc1em0wLTQuMDVhLjY4LjY4IDAgMCAxLS42NzUuNjc1SDYuODc4YS42OC42OCAwIDAgMS0uNjc1LS42NzVjMC0uMTc4LjA3NS0uMzQ3LjItLjQ3NWw0LjcyOC00LjcyOGEuNjY1LjY2NSAwIDAgMSAuOTUgMEwxNi44MDYgOS41YS42Ni42NiAwIDAgMSAuMi40NzV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdzbXMtZmFpbGVkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTguODgxIDMuMDMxaC0xMy44Yy0xLjE3MiAwLTIuMTIyLjk1LTIuMTIyIDIuMTIydjE1LjgzMUw2Ljk0MyAxN0gxOC44OGMxLjE3MiAwIDIuMTIyLS45NSAyLjEyMi0yLjEyMlY1LjE1M2MwLTEuMTcyLS45NS0yLjEyMi0yLjEyMi0yLjEyMnptLTcuODY4IDEuOTEzaDEuOTM4djUuOTc4aC0xLjkzOFY0Ljk0NHptMS45ODQgMTAuMDI1aC0yLjAzMXYtMmgyLjAzMXYyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnc2tpcC1wcmV2aW91cycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTkuNTE2IDEyTDE4IDZ2MTJ6TTYgNmgyLjAxNnYxMkg2VjZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdza2lwLW5leHQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNS45ODQgNkgxOHYxMmgtMi4wMTZWNnpNNiAxOFY2bDguNDg0IDZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdzaXRlbWFwJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjEuNjY2IDE2LjA0N3YzLjg5MWMwIC41NzItLjQ2MiAxLjAzNC0xLjAzNCAxLjAzNGgtMy40NTNhMS4wMzMgMS4wMzMgMCAwIDEtMS4wMzQtMS4wMzR2LTMuODkxYzAtLjU3Mi40NjItMS4wMzQgMS4wMzQtMS4wMzRoMS4wMzR2LTIuMzIyaC01LjUyMnYyLjMyMmgxLjAzNGMuNTcyIDAgMS4wMzQuNDYyIDEuMDM0IDEuMDM0djMuODkxYzAgLjU3Mi0uNDYyIDEuMDM0LTEuMDM0IDEuMDM0aC0zLjQ1YTEuMDMzIDEuMDMzIDAgMCAxLTEuMDM0LTEuMDM0di0zLjg5MWMwLS41NzIuNDYyLTEuMDM0IDEuMDM0LTEuMDM0aDEuMDM0di0yLjMyMkg1Ljc4NHYyLjMyMmgxLjAzNGMuNTcyIDAgMS4wMzQuNDYyIDEuMDM0IDEuMDM0djMuODkxYzAgLjU3Mi0uNDYyIDEuMDM0LTEuMDM0IDEuMDM0aC0zLjQ1YTEuMDMzIDEuMDMzIDAgMCAxLTEuMDM0LTEuMDM0di0zLjg5MWMwLS41NzIuNDYyLTEuMDM0IDEuMDM0LTEuMDM0aDEuMDM0di0yLjMyMmExLjM5IDEuMzkgMCAwIDEgMS4zODEtMS4zODFoNS41MjVWOC45ODhoLTEuMDM0QTEuMDMzIDEuMDMzIDAgMCAxIDkuMjQgNy45NTRWNC4wNjNjMC0uNTcyLjQ2Mi0xLjAzNCAxLjAzNC0xLjAzNGgzLjQ1M2MuNTcyIDAgMS4wMzQuNDYyIDEuMDM0IDEuMDM0djMuODkxYzAgLjU3Mi0uNDYyIDEuMDM0LTEuMDM0IDEuMDM0aC0xLjAzNHYyLjMyMmg1LjUyNWExLjM5IDEuMzkgMCAwIDEgMS4zODEgMS4zODF2Mi4zMjJoMS4wMzRjLjU2OSAwIDEuMDMxLjQ2MiAxLjAzMSAxLjAzNHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3NocmluazEnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMC42ODggMTMuMzEydjguNTMxbC0zLjI4MS0zLjI4MUwzLjQ2OSAyMi41IDEuNSAyMC41MzFsMy45MzgtMy45MzgtMy4yODEtMy4yODF6TTIyLjUgMy40NjlsLTMuOTM4IDMuOTM4IDMuMjgxIDMuMjgxaC04LjUzMVYyLjE1N2wzLjI4MSAzLjI4MUwyMC41MzEgMS41elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnc2hyaW5rJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTMuMzEyIDEwLjY4OGg4LjUzMWwtMy4yODEtMy4yODFMMjIuNSAzLjQ2OSAyMC41MzEgMS41bC0zLjkzOCAzLjkzOC0zLjI4MS0zLjI4MXpcIj48L3BhdGg+PHBhdGggZD1cIk0xMy4zMTIgMTMuMzEydjguNTMxbDMuMjgxLTMuMjgxIDMuOTM4IDMuOTM4IDEuOTY5LTEuOTY5LTMuOTM4LTMuOTM4IDMuMjgxLTMuMjgxelwiPjwvcGF0aD48cGF0aCBkPVwiTTEwLjY4OCAxMy4zMTJIMi4xNTdsMy4yODEgMy4yODFMMS41IDIwLjUzMSAzLjQ2OSAyMi41bDMuOTM4LTMuOTM4IDMuMjgxIDMuMjgxelwiPjwvcGF0aD48cGF0aCBkPVwiTTEwLjY4OCAxMC42ODhWMi4xNTdMNy40MDcgNS40MzggMy40NjkgMS41IDEuNSAzLjQ2OWwzLjkzOCAzLjkzOC0zLjI4MSAzLjI4MXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3NoaWVsZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE5LjM4MyAyLjA1MWExIDEgMCAwIDAtMS4wOS4yMTdjLS45ODUuOTg1LTEuOTU2IDEuNDg0LTIuODg1IDEuNDg0LTEuNTMyIDAtMi42MDItMS4zNjgtMi42MDgtMS4zNzdhMS4wMDMgMS4wMDMgMCAwIDAtLjc5Ni0uMzk4Yy0uMjc1LS4wMjEtLjYwOS4xNDUtLjgwMS4zOTMtLjAxLjAxNC0xLjA3OSAxLjM4Mi0yLjYxIDEuMzgyLS45MyAwLTEuOS0uNDk5LTIuODg2LTEuNDg0QS45OTkuOTk5IDAgMCAwIDQgMi45NzV2MTFjMCAzLjgwOCA2Ljc2MyA3LjQ3OSA3LjUzNCA3Ljg4NWEuOTk4Ljk5OCAwIDAgMCAuOTMyIDBjLjc3MS0uNDA3IDcuNTM0LTQuMDc4IDcuNTM0LTcuODg1di0xMWExIDEgMCAwIDAtLjYxNy0uOTI0ek0xNiAxMi45NzVoLTN2M2gtMnYtM0g4di0yaDN2LTNoMnYzaDN2MnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ1NoYXJlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNyAxNC41czEuMTQ5LTMuNzUgNy41LTMuNzV2My43NWw3LjUtNS03LjUtNXYzLjc1Yy01IDAtNy41IDMuMTE5LTcuNSA2LjI1em04Ljc1IDIuNUg0LjVWOS41aDIuNDU5Yy4xOTctLjIzMy40MDgtLjQ1Ni42MzUtLjY2OEE4LjY1MyA4LjY1MyAwIDAgMSAxMC42NDMgN0gyLjAwMXYxMi41aDE2LjI1di01LjI0N2wtMi41IDEuNjY3VjE3elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnc2V0dGluZ3MnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMiAxNS41MjFjMS45MjUgMCAzLjUyMS0xLjU5NiAzLjUyMS0zLjUyMVMxMy45MjUgOC40NzkgMTIgOC40NzkgOC40NzkgMTAuMDc1IDguNDc5IDEyczEuNTk2IDMuNTIxIDMuNTIxIDMuNTIxem03LjQ2NS0yLjUzNWwyLjExMyAxLjY0NGMuMTg4LjE0MS4yMzUuNDIzLjA5NC42NTdsLTIuMDE5IDMuNDc1Yy0uMTQxLjIzNS0uMzc1LjI4Mi0uNjEuMTg4bC0yLjQ4OC0uOTg2Yy0uNTE2LjM3NS0xLjA4Ljc1MS0xLjY5Ljk4NmwtLjM3NSAyLjYyOWMtLjA0Ny4yMzUtLjIzNS40MjMtLjQ2OS40MjNIOS45ODRjLS4yMzUgMC0uNDIzLS4xODgtLjQ2OS0uNDIzTDkuMTQgMTguOTVhNi4xNDggNi4xNDggMCAwIDEtMS42OS0uOTg2bC0yLjQ4OC45ODZjLS4yMzUuMDk0LS40NjkuMDQ3LS42MS0uMTg4bC0yLjAxOS0zLjQ3NWMtLjE0MS0uMjM1LS4wOTQtLjUxNi4wOTQtLjY1N2wyLjExMy0xLjY0NGMtLjA0Ny0uMzI4LS4wNDctLjY1Ny0uMDQ3LS45ODZzMC0uNjU3LjA0Ny0uOTg2TDIuNDI3IDkuMzdjLS4xODgtLjE0MS0uMjM1LS40MjMtLjA5NC0uNjU3bDIuMDE5LTMuNDc1Yy4xNDEtLjIzNS4zNzUtLjI4Mi42MS0uMTg4bDIuNDg4Ljk4NmMuNTE2LS4zNzUgMS4wOC0uNzUxIDEuNjktLjk4NmwuMzc1LTIuNjI5Yy4wNDctLjIzNS4yMzUtLjQyMy40NjktLjQyM2g0LjAzN2MuMjM1IDAgLjQyMy4xODguNDY5LjQyM2wuMzc1IDIuNjI5Yy42MS4yMzUgMS4xNzQuNTY0IDEuNjkuOTg2bDIuNDg4LS45ODZjLjIzNS0uMDk0LjQ2OS0uMDQ3LjYxLjE4OGwyLjAxOSAzLjQ3NWMuMTQxLjIzNS4wOTQuNTE2LS4wOTQuNjU3bC0yLjExMyAxLjY0NGMuMDQ3LjMyOC4wNDcuNjU3LjA0Ny45ODZzMCAuNjU3LS4wNDcuOTg2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnU2V0dGluZ3MtdmVydGljYWwnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOC43NSAxMC44NzVoLjI4MWMuNDY0IDAgLjg0My0uMzguODQzLS44NDNWNy4yMmEuODQ2Ljg0NiAwIDAgMC0uODQzLS44NDNoLS4yODFWMy4wMDJIMTYuNXYzLjM3NWgtLjI4MWEuODQ2Ljg0NiAwIDAgMC0uODQzLjg0M3YyLjgxMmMwIC40NjQuMzguODQzLjg0My44NDNoLjI4MVYyMWgyLjI1VjEwLjg3NXpNMTYuNSA3LjVoMi4yNXYyLjI1SDE2LjVWNy41em0tMy4wOTMgMTAuMTI1Yy40NjQgMCAuODQzLS4zOC44NDMtLjg0M1YxMy45N2EuODQ2Ljg0NiAwIDAgMC0uODQzLS44NDNoLS4yODFWMy4wMDJoLTIuMjV2MTAuMTI1aC0uMjgxYS44NDYuODQ2IDAgMCAwLS44NDMuODQzdjIuODEyYzAgLjQ2NC4zOC44NDMuODQzLjg0M2guMjgxVjIxaDIuMjV2LTMuMzc1aC4yODF6bS0yLjUzMi0zLjM3NWgyLjI1djIuMjVoLTIuMjV2LTIuMjV6bS0zLjA5NC0zLjM3NWMuNDY0IDAgLjg0My0uMzguODQzLS44NDNWNy4yMmEuODQ2Ljg0NiAwIDAgMC0uODQzLS44NDNINy41VjMuMDAySDUuMjV2My4zNzVoLS4yODFhLjg0Ni44NDYgMCAwIDAtLjg0My44NDN2Mi44MTJjMCAuNDY0LjM4Ljg0My44NDMuODQzaC4yODFWMjFINy41VjEwLjg3NWguMjgxek01LjI1IDcuNUg3LjV2Mi4yNUg1LjI1VjcuNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3NlcnZlcicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTMuOTg0IDExLjAxNnYxLjk2OUg2di0xLjk2OUgzLjk4NHptLTEuOTY4IDNWOS45ODVoMTkuOTY5djQuMDMxSDIuMDE2ek02IDYuOTg0VjUuMDE1SDMuOTg0djEuOTY5SDZ6bS0zLjk4NC0zaDE5Ljk2OXY0LjAzMUgyLjAxNlYzLjk4NHptMS45NjggMTMuMDMydjEuOTY5SDZ2LTEuOTY5SDMuOTg0em0tMS45NjggM3YtNC4wMzFoMTkuOTY5djQuMDMxSDIuMDE2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnc2VuZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIyLjY1NyAxLjEzNWEuNzkzLjc5MyAwIDAgMSAuMzMxLjc4NmwtMy4xNDMgMTguODU3YS43ODcuNzg3IDAgMCAxLS43NzQuNjUuODcuODcgMCAwIDEtLjI5NS0uMDYxbC01LjU2MS0yLjI3MS0yLjk3MSAzLjYyMmEuNzYyLjc2MiAwIDAgMS0uNjAyLjI4Mi43ODQuNzg0IDAgMCAxLS43ODYtLjc4NnYtNC4yODVMMTkuNDYzIDQuOTI4IDYuMzM5IDE2LjI4NCAxLjQ5IDE0LjI5NWEuNzguNzggMCAwIDEtLjQ5MS0uNjc1Ljc5Mi43OTIgMCAwIDEgLjM5My0uNzI0TDIxLjgyMSAxLjExYS43Ni43NiAwIDAgMSAuMzkzLS4xMTFjLjE2IDAgLjMxOS4wNDkuNDQyLjEzNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3NlYXJjaCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE2LjUwMyAxNC45NjRoLS43OTVsLTEuMTg2LTEuMTg2YTcuMTE3IDcuMTE3IDAgMSAwLS44My44MjFsLS4wMTEuMDA5IDEuMTg2IDEuMTg2di43OTVsNS40NTcgNS4zODYgMS42NzMtMS42ODR6bS03LjMzMS0uOTcyYTQuNzQ0IDQuNzQ0IDAgMSAxIDAtOS40OSA0Ljc0NCA0Ljc0NCAwIDEgMSAwIDkuNDl6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdyZXN0b3JlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIuNDg3IDguMjM3aDEuNDE3djMuOTg0bDMuMzIgMS45OTItLjcwOCAxLjE1MS00LjAyOS0yLjQzNVY4LjIzNnptLjkzLTQuNzM3YzQuNjkzIDAgOC41IDMuODA3IDguNSA4LjVzLTMuODA3IDguNS04LjUgOC41YTguMzY0IDguMzY0IDAgMCAxLTUuOTc3LTIuNDc5bDEuMzI4LTEuMzcyYzEuMTk1IDEuMTk1IDIuODMzIDEuOTQ4IDQuNjQ4IDEuOTQ4IDMuNjc0IDAgNi42NDEtMi45MjIgNi42NDEtNi41OTZzLTIuOTY2LTYuNTk2LTYuNjQxLTYuNTk2UzYuODIgOC4zMjcgNi44MiAxMi4wMDFoMi44MzNsLTMuODA3IDMuODA3LS4wODktLjEzMy0zLjY3NC0zLjY3NGgyLjgzM2MwLTQuNjkzIDMuODA3LTguNSA4LjUtOC41elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAncmVwbHknLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMC4yNTMgOC45NTNjNi4wNTMuODUzIDguNjk0IDUuMiA5LjU0NyA5LjU0Ny0yLjE1My0zLjA0Ny01LjItNC40MjgtOS41NDctNC40Mjh2My41MzRMNC4yIDExLjU1MyAxMC4yNTMgNS41djMuNDUzelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAncmVwbHktYWxsJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIuODUzIDguOTUzYzYuMDUzLjg1MyA4LjY5NCA1LjIgOS41NDcgOS41NDctMi4xNTMtMy4wNDctNS4yLTQuNDI4LTkuNTQ3LTQuNDI4djMuNTM0TDYuOCAxMS41NTMgMTIuODUzIDUuNXYzLjQ1M3ptLTUuMi0uODUzTDQuMiAxMS41NTNsMy40NTMgMy40NTN2Mi42TDEuNiAxMS41NTMgNy42NTMgNS41djIuNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ1JlcGxheS0zMCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDUuN1YyLjFMNy41IDYuNmw0LjUgNC41VjcuNWMyLjk3IDAgNS40IDIuNDMgNS40IDUuNHMtMi40MyA1LjQtNS40IDUuNC01LjQtMi40My01LjQtNS40SDQuOGMwIDMuOTYgMy4yNCA3LjIgNy4yIDcuMnM3LjItMy4yNCA3LjItNy4yLTMuMjQtNy4yLTcuMi03LjJ6bS0yLjE2IDcuNjVoLjM2Yy4xOCAwIC4zNi0uMDkuNDUtLjE4cy4xOC0uMTguMTgtLjM2di0uMThzLS4wOS0uMDktLjA5LS4xOC0uMDktLjA5LS4xOC0uMDloLS40NXMtLjA5LjA5LS4xOC4wOS0uMDkuMDktLjA5LjE4di4xOGgtLjljMC0uMTggMC0uMjcuMDktLjQ1cy4xOC0uMjcuMjctLjM2LjI3LS4xOC4zNi0uMTguMzYtLjA5LjQ1LS4wOWMuMTggMCAuMzYgMCAuNTQuMDlzLjI3LjA5LjQ1LjE4LjE4LjE4LjI3LjM2LjA5LjI3LjA5LjQ1di4yN3MtLjA5LjE4LS4wOS4yNy0uMDkuMTgtLjE4LjE4LS4xOC4wOS0uMjcuMThjLjE4LjA5LjM2LjE4LjQ1LjM2cy4xOC4zNi4xOC41NGMwIC4xOCAwIC4zNi0uMDkuNDVzLS4xOC4yNy0uMjcuMzYtLjI3LjE4LS40NS4xOC0uMzYuMDktLjU0LjA5Yy0uMTggMC0uMzYgMC0uNDUtLjA5cy0uMjctLjA5LS40NS0uMTgtLjE4LS4xOC0uMjctLjM2LS4wOS0uMzYtLjA5LS41NGguNzJ2LjE4cy4wOS4wOS4wOS4xOC4wOS4wOS4xOC4wOWguNDVzLjA5LS4wOS4xOC0uMDkuMDktLjA5LjA5LS4xOHYtLjQ1cy0uMDktLjA5LS4wOS0uMTgtLjA5LS4wOS0uMTgtLjA5aC0uNTR2LS42M3ptNS4xMy42M2MwIC4yNyAwIC41NC0uMDkuNzJsLS4yNy41NHMtLjI3LjI3LS40NS4yNy0uMzYuMDktLjU0LjA5LS4zNiAwLS41NC0uMDktLjI3LS4xOC0uNDUtLjI3LS4xOC0uMjctLjI3LS41NC0uMDktLjQ1LS4wOS0uNzJ2LS42M2MwLS4yNyAwLS41NC4wOS0uNzJsLjI3LS41NHMuMjctLjI3LjQ1LS4yNy4zNi0uMDkuNTQtLjA5LjM2IDAgLjU0LjA5LjI3LjE4LjQ1LjI3LjE4LjI3LjI3LjU0LjA5LjQ1LjA5Ljcydi42M3ptLS43Mi0uNzJ2LS40NWMwLS4wOS0uMDktLjE4LS4wOS0uMjdzLS4wOS0uMDktLjE4LS4xOC0uMTgtLjA5LS4yNy0uMDktLjE4IDAtLjI3LjA5bC0uMTguMThzLS4wOS4xOC0uMDkuMjd2MS44cy4wOS4xOC4wOS4yNy4wOS4wOS4xOC4xOC4xOC4wOS4yNy4wOS4xOCAwIC4yNy0uMDlsLjE4LS4xOHMuMDktLjE4LjA5LS4yN3YtMS4zNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ1JlcGxheS0xMCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDUuN1YyLjFMNy41IDYuNmw0LjUgNC41VjcuNWMyLjk3IDAgNS40IDIuNDMgNS40IDUuNHMtMi40MyA1LjQtNS40IDUuNC01LjQtMi40My01LjQtNS40SDQuOGMwIDMuOTYgMy4yNCA3LjIgNy4yIDcuMnM3LjItMy4yNCA3LjItNy4yLTMuMjQtNy4yLTcuMi03LjJ6bS0uOTkgOS45aC0uODF2LTIuOTdsLS45LjI3di0uNjNsMS42Mi0uNTRoLjA5djMuODd6bTMuODctMS42MmMwIC4yNyAwIC41NC0uMDkuNzJsLS4yNy41NHMtLjI3LjI3LS40NS4yNy0uMzYuMDktLjU0LjA5LS4zNiAwLS41NC0uMDktLjI3LS4xOC0uNDUtLjI3LS4xOC0uMjctLjI3LS41NC0uMDktLjQ1LS4wOS0uNzJ2LS42M2MwLS4yNyAwLS41NC4wOS0uNzJsLjI3LS41NHMuMjctLjI3LjQ1LS4yNy4zNi0uMDkuNTQtLjA5LjM2IDAgLjU0LjA5Yy4xOC4wOS4yNy4xOC40NS4yN3MuMTguMjcuMjcuNTQuMDkuNDUuMDkuNzJ2LjYzem0tLjgxLS43MnYtLjQ1cy0uMDktLjE4LS4wOS0uMjctLjA5LS4wOS0uMTgtLjE4LS4xOC0uMDktLjI3LS4wOS0uMTggMC0uMjcuMDlsLS4xOC4xOHMtLjA5LjE4LS4wOS4yN3YxLjhzLjA5LjE4LjA5LjI3LjA5LjA5LjE4LjE4LjE4LjA5LjI3LjA5LjE4IDAgLjI3LS4wOWwuMTgtLjE4cy4wOS0uMTguMDktLjI3di0xLjM1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnUmVwbGF5LTUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMiA1LjdWMi4xTDcuNSA2LjZsNC41IDQuNVY3LjVjMi45NyAwIDUuNCAyLjQzIDUuNCA1LjRzLTIuNDMgNS40LTUuNCA1LjQtNS40LTIuNDMtNS40LTUuNEg0LjhjMCAzLjk2IDMuMjQgNy4yIDcuMiA3LjJzNy4yLTMuMjQgNy4yLTcuMi0zLjI0LTcuMi03LjItNy4yem0tMS4xNyA4LjAxbC4xOC0xLjk4aDIuMTZ2LjYzaC0xLjUzbC0uMDkuODFzLjA5IDAgLjA5LS4wOS4wOSAwIC4wOS0uMDkuMDkgMCAuMTggMGguMThjLjE4IDAgLjM2IDAgLjQ1LjA5cy4yNy4xOC4zNi4yNy4xOC4yNy4yNy40NS4wOS4zNi4wOS41NGMwIC4xOCAwIC4zNi0uMDkuNDVzLS4wOS4yNy0uMjcuNDUtLjI3LjE4LS4zNi4yNy0uMzYuMDktLjU0LjA5Yy0uMTggMC0uMzYgMC0uNDUtLjA5cy0uMjctLjA5LS40NS0uMTgtLjE4LS4xOC0uMjctLjM2LS4wOS0uMjctLjA5LS40NWguNzJjMCAuMTguMDkuMjcuMTguMzZzLjE4LjA5LjM2LjA5Yy4wOSAwIC4xOCAwIC4yNy0uMDlsLjE4LS4xOHMuMDktLjE4LjA5LS4yN3YtLjU0bC0uMDktLjE4LS4xOC0uMThzLS4xOC0uMDktLjI3LS4wOWgtLjE4cy0uMDkgMC0uMTguMDktLjA5IDAtLjA5LjA5LS4wOS4wOS0uMDkuMDloLS42M3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3JlbW92ZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIwIDE0SDR2LTRoMTZ2NHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3JlZG8nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMi45MjggNi44NTFWMmw3LjUgNy41LTcuNSA3LjV2LTQuOTU3Yy04LjcyNS0uMjA1LTguMzUxIDUuOTM0LTYuMTMgOS45NTctNS40ODMtNS45MjYtNC4zMTgtMTUuNDIxIDYuMTMtMTUuMTQ5elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAncmVjZWlwdCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE4IDE3SDZ2LTJoMTJ2MnptMC00SDZ2LTJoMTJ2MnptMC00SDZWN2gxMnYyek0zIDIybDEuNS0xLjVMNiAyMmwxLjUtMS41TDkgMjJsMS41LTEuNUwxMiAyMmwxLjUtMS41TDE1IDIybDEuNS0xLjVMMTggMjJsMS41LTEuNUwyMSAyMlYybC0xLjUgMS41TDE4IDJsLTEuNSAxLjVMMTUgMmwtMS41IDEuNUwxMiAybC0xLjUgMS41TDkgMiA3LjUgMy41IDYgMiA0LjUgMy41IDMgMnYyMHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3JhZGlvLWJ1dHRvbi11bmNoZWNrZWQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMiAxNy42MDdjMy4wODIgMCA1LjYwNy0yLjUyNSA1LjYwNy01LjYwN1MxNS4wODIgNi4zOTMgMTIgNi4zOTMgNi4zOTMgOC45MTggNi4zOTMgMTIgOC45MTggMTcuNjA3IDEyIDE3LjYwN3ptMC0xMi41OTFjMy44NjkgMCA2Ljk4NCAzLjExNSA2Ljk4NCA2Ljk4NFMxNS44NjkgMTguOTg0IDEyIDE4Ljk4NCA1LjAxNiAxNS44NjkgNS4wMTYgMTIgOC4xMzEgNS4wMTYgMTIgNS4wMTZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdyYWRpby1idXR0b24tY2hlY2tlZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDE3LjYwN2MzLjA4MiAwIDUuNjA3LTIuNTI1IDUuNjA3LTUuNjA3UzE1LjA4MiA2LjM5MyAxMiA2LjM5MyA2LjM5MyA4LjkxOCA2LjM5MyAxMiA4LjkxOCAxNy42MDcgMTIgMTcuNjA3em0wLTEyLjU5MWMzLjg2OSAwIDYuOTg0IDMuMTE1IDYuOTg0IDYuOTg0UzE1Ljg2OSAxOC45ODQgMTIgMTguOTg0IDUuMDE2IDE1Ljg2OSA1LjAxNiAxMiA4LjEzMSA1LjAxNiAxMiA1LjAxNnptMCAzLjQ3NWMxLjkzNSAwIDMuNTA5IDEuNTc0IDMuNTA5IDMuNTA5UzEzLjkzNSAxNS41MDkgMTIgMTUuNTA5IDguNDkxIDEzLjkzNSA4LjQ5MSAxMiAxMC4wNjUgOC40OTEgMTIgOC40OTF6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdRdWV1ZS1hZGQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yMCA2aDJ2MTRjMCAxLjEtLjkgMi0yIDJINnYtMmgxNFY2ek00IDJoMTJjMS4xIDAgMiAuOSAyIDJ2MTJjMCAxLjEtLjkgMi0yIDJINGMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yem0xIDloNHY0aDJ2LTRoNFY5aC00VjVIOXY0SDV2MnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3ByaW9yaXR5X2hpZ2gnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk05Ljk4NCAzaDQuMDMxdjEySDkuOTg0VjN6bTAgMTUuOTg0YzAtMS4xMjUuODkxLTEuOTY5IDIuMDE2LTEuOTY5czIuMDE2Ljg0NCAyLjAxNiAxLjk2OVMxMy4xMjUgMjEgMTIgMjFzLTIuMDE2LS44OTEtMi4wMTYtMi4wMTZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdwcmludGVyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNy4wMjggMi41MzFoOS45ODF2Mi40OTdINy4wMjhWMi41MzF6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMjAuNzUzIDcuMDI1SDMuMjg0Yy0uNjg3IDAtMS4yNDcuNTYzLTEuMjQ3IDEuMjQ3djYuNDU2YzAgLjY4Ny41NjMgMS4yNDcgMS4yNDcgMS4yNDdoMy43NDR2NC45OTRoOS45ODF2LTQuOTkxaDMuNzQ0Yy42ODcgMCAxLjI0Ny0uNTYzIDEuMjQ3LTEuMjQ3VjguMjcyYzAtLjY4NC0uNTYzLTEuMjQ3LTEuMjQ3LTEuMjQ3ek00LjUzMSAxMC43NjlhMS4yNDggMS4yNDggMCAxIDEgMS4yNDctMS4yNDdjMCAuNjg3LS41NTkgMS4yNDctMS4yNDcgMS4yNDd6bTExLjIzMSA4Ljk1M0g4LjI3NHYtNi4yNDFoNy40ODh2Ni4yNDF6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdwb2xsJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTcuMDE2IDE3LjAxNnYtNC4wMzFIMTV2NC4wMzFoMi4wMTZ6bS00LjAzMiAwVjYuOTg1aC0xLjk2OXYxMC4wMzFoMS45Njl6bS0zLjk4NCAwVjkuOTg1SDYuOTg0djcuMDMxSDl6TTE4Ljk4NCAzQzIwLjA2MiAzIDIxIDMuOTM4IDIxIDUuMDE2djEzLjk2OWMwIDEuMDc4LS45MzggMi4wMTYtMi4wMTYgMi4wMTZINS4wMTVjLTEuMDc4IDAtMi4wMTYtLjkzOC0yLjAxNi0yLjAxNlY1LjAxNkMyLjk5OSAzLjkzOCAzLjkzNyAzIDUuMDE1IDNoMTMuOTY5elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAncG9pbnRlcicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIxIDNsLTcuNTQ3IDE4aC0uOTg0bC0yLjYyNS02Ljg0NEwzIDExLjUzMXYtLjk4NHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ1BvZGNhc3QnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMyAxNWgtMmMtMi43NTcgMC01IDIuMjQzLTUgNXYyaDEydi0yYzAtMi43NTctMi4yNDMtNS01LTV6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNOC4zNDQgMTMuNTI4Yy0xLjI1LTEuNzU4LTEuMS00LjIxMS40NzUtNS43ODNhNC41MDEgNC41MDEgMCAwIDEgNi4zNjMgMGMxLjU3NCAxLjU3MiAxLjcyNSA0LjAyNS40NzYgNS43ODNhNi45MzYgNi45MzYgMCAwIDEgMS43MzMgMS4wMjhjMS43MDEtMi41MjYgMS40MzgtNS45OTItLjc5NC04LjIyNy0yLjUzNC0yLjUzNS02LjY1OC0yLjUzMy05LjE5MyAwLTIuMjMxIDIuMjM0LTIuNDk1IDUuNy0uNzk0IDguMjI3YTYuOTkgNi45OSAwIDAgMSAxLjczNC0xLjAyOHpcIj48L3BhdGg+PHBhdGggZD1cIk01LjUxMiAxNS42NjhBNy45MzYgNy45MzYgMCAwIDEgNCAxMWMwLTIuMTM3LjgzMy00LjE0NiAyLjM0NC01LjY1NyAzLjExOS0zLjExOSA4LjE5My0zLjExOSAxMS4zMTMgMCAyLjgwOSAyLjgxIDMuMDc5IDcuMi44MyAxMC4zMjRhNy4wMyA3LjAzIDAgMCAxIDEuMDYgMS44NzhjMy40MDYtMy45MjMgMy4yNTQtOS44ODYtLjQ3Ni0xMy42MTdDMTUuMTczLjAzIDguODI4LjAzIDQuOTMgMy45MjhBOS45MzkgOS45MzkgMCAwIDAgMiAxMWMwIDIuNDM0Ljg3MiA0LjcyOSAyLjQ1MyA2LjU0NmE2Ljk1NyA2Ljk1NyAwIDAgMSAxLjA1OS0xLjg3OHpcIj48L3BhdGg+PHBhdGggZD1cIk0xNSAxMWEzIDMgMCAxIDEtNiAwIDMgMyAwIDAgMSA2IDB6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdwbHVzJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTkuNSAxMEgxNFY0LjVhLjUuNSAwIDAgMC0uNS0uNWgtMy4wMDFhLjUuNSAwIDAgMC0uNS41VjEwaC01LjVhLjUuNSAwIDAgMC0uNS41djMuMDAxYS41LjUgMCAwIDAgLjUuNWg1LjV2NS41YS41LjUgMCAwIDAgLjUuNUgxMy41YS41LjUgMCAwIDAgLjUtLjV2LTUuNWg1LjVhLjUuNSAwIDAgMCAuNS0uNVYxMC41YS41LjUgMCAwIDAtLjUtLjV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdQbGF5bGlzdC1wbGF5JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMi4zNTcgOC4xNDNoMTUuNDI5djIuNTcxSDIuMzU3em0wLTUuMTQzaDE1LjQyOXYyLjU3MUgyLjM1N3ptMCAxMC4yODZoMTAuMjg2djIuNTcxSDIuMzU3em0xMi44NTcgMFYyMWw2LjQyOS0zLjg1N3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ1BsYXlsaXN0LWNoZWNrJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTMuNSA5aC0xMnYyaDEyVjl6bTAtNGgtMTJ2MmgxMlY1em0tMTIgMTBoOHYtMmgtOHYyek0yMSAxMC41bDEuNSAxLjUtNi45OSA3TDExIDE0LjVsMS41LTEuNSAzLjAxIDNMMjEgMTAuNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ1BsYXlsaXN0LWFkZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE0IDEwSDJ2MmgxMnYtMnptMC00SDJ2MmgxMlY2em00IDh2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6TTIgMTZoOHYtMkgydjJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdwbGF5LWFycm93JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNi41MTYgNS4wMTZMMTcuNDg1IDEyIDYuNTE2IDE4Ljk4NFY1LjAxNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3BpZ2d5LWJhbmsnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNS4wNDggNi4yODZoLTMuODA5Yy0uMjQxIDAtLjQ4NC4wMTUtLjczNC4wNDdMNy45MTggNC4xNzdhLjc2My43NjMgMCAwIDAtMS4yNS41ODV2My41OTJhNi4xMjcgNi4xMjcgMCAwIDAtMS4wNzcgMS43NDJIMy42MmEuNzYyLjc2MiAwIDAgMC0uNzYyLjc2MnYzLjgwOWMwIC40MjEuMzQxLjc2Mi43NjIuNzYyaDIuMzQ3YTYuMTMgNi4xMyAwIDAgMCAyLjk4NyAyLjU5MlYyMGgxLjUyNHYtMS41NzRjLjI1MS4wMzEuNTA1LjA1Ljc2Mi4wNWgzLjgwOWMuMjU5IDAgLjUxMi0uMDIyLjc2Mi0uMDUzdjEuNTc2aDEuNTI0di0xLjk3M2E2LjEgNi4xIDAgMCAwIDMuODA5LTUuNjQ2IDYuMTAyIDYuMTAyIDAgMCAwLTYuMDk1LTYuMDk1ek04LjE5IDEwLjg1N2EuNzYyLjc2MiAwIDEgMSAwLTEuNTI0Ljc2Mi43NjIgMCAwIDEgMCAxLjUyNHptNy42MTktMS41MjRoLTQuNTcxVjcuODA5aDQuNTcxdjEuNTI0elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAncGljdHVyZXMnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk02LjkwNiAxOS45NjlIMjBjMS4xMDMgMCAyLS44OTcgMi0yVjguOTgxYTEuOTUgMS45NSAwIDAgMC0xLjk1LTEuOTVIMjB2MTAuOTM4SDQuOTA2YzAgMS4xMDMuODk3IDIgMiAyelwiPjwvcGF0aD48cGF0aCBkPVwiTTE2LjcwOSA2LjE1Yy4wNzUgMCAuMTM0LjA1OS4xMzQuMTM0djguNDg0YS4xMzMuMTMzIDAgMCAxLS4xMzQuMTM0SDQuMjE4YS4xMzMuMTMzIDAgMCAxLS4xMzQtLjEzNFY2LjI4NGMwLS4wNzUuMDU5LS4xMzQuMTM0LS4xMzRoMTIuNDkxem0wLTIuMTI1SDQuMjE4YTIuMjU4IDIuMjU4IDAgMCAwLTIuMjU5IDIuMjU5djguNDg0YTIuMjU4IDIuMjU4IDAgMCAwIDIuMjU5IDIuMjU5aDEyLjQ4N2EyLjI1OSAyLjI1OSAwIDAgMCAyLjI1OS0yLjI1OVY2LjI4NGEyLjI1NSAyLjI1NSAwIDAgMC0yLjI1Ni0yLjI1OXpcIj48L3BhdGg+PHBhdGggZD1cIk0xMS41ODEgMTEuNTVMOS45NzIgOS44MzRsLTEuNjA5IDIuNzUzLTEuMjA5LTEuMjY2LTEuMzA5IDIuNzY2aDEwLjI2OWwtMi4zNDctNi4zNzItMi4xODQgMy44MzR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNy4xNTkgOS4yOTdjLjU5NCAwIDEuMDc4LS40ODQgMS4wNzgtMS4wNzhzLS40ODQtMS4wNzgtMS4wNzgtMS4wNzgtMS4wNzguNDg0LTEuMDc4IDEuMDc4LjQ4NCAxLjA3OCAxLjA3OCAxLjA3OHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3BpY3R1cmUtaW4tcGljdHVyZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIwIDE4LjI1VjUuNzVINHYxMi41aDE2em0xLjc5Mi0uMDQyYzAgLjk1OC0uODMzIDEuNzkyLTEuNzkyIDEuNzkySDRjLS45NTggMC0xLjc5Mi0uODMzLTEuNzkyLTEuNzkyVjUuNzVDMi4yMDggNC43OTIgMy4wNDEgNCA0IDRoMTZjLjk1OCAwIDEuNzkyLjc5MiAxLjc5MiAxLjc1djEyLjQ1OHptLTMuNTg0LTcuMDgzdjUuMzMzaC03LjA4M3YtNS4zMzNoNy4wODN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdwZXJjZW50JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNOS4zMzMgNy41NTZhMi42NjcgMi42NjcgMCAxIDEtNS4zMzQgMCAyLjY2NyAyLjY2NyAwIDAgMSA1LjMzNCAwelwiPjwvcGF0aD48cGF0aCBkPVwiTTIwIDE4LjIyMmEyLjY2NyAyLjY2NyAwIDEgMS01LjMzNCAwIDIuNjY3IDIuNjY3IDAgMCAxIDUuMzM0IDB6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNC4yNiAxOS4zNzJMMTguNDgyIDUuMTVsMS4yNTcgMS4yNTdMNS41MTcgMjAuNjI5IDQuMjYgMTkuMzcyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAncGF1c2UnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNC4wMTYgNS4wMTZIMTh2MTMuOTY5aC0zLjk4NFY1LjAxNnpNNiAxOC45ODRWNS4wMTVoMy45ODR2MTMuOTY5SDZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdQYWxldHRlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgM2E5IDkgMCAwIDAgMCAxOGMuODMgMCAxLjUtLjY3IDEuNS0xLjUgMC0uMzktLjE1LS43NC0uMzktMS4wMS0uMjMtLjI2LS4zOC0uNjEtLjM4LS45OSAwLS44My42Ny0xLjUgMS41LTEuNUgxNmMyLjc2IDAgNS0yLjI0IDUtNSAwLTQuNDItNC4wMy04LTktOHptLTUuNSA5Yy0uODMgMC0xLjUtLjY3LTEuNS0xLjVTNS42NyA5IDYuNSA5IDggOS42NyA4IDEwLjUgNy4zMyAxMiA2LjUgMTJ6bTMtNEM4LjY3IDggOCA3LjMzIDggNi41UzguNjcgNSA5LjUgNXMxLjUuNjcgMS41IDEuNVMxMC4zMyA4IDkuNSA4em01IDBjLS44MyAwLTEuNS0uNjctMS41LTEuNVMxMy42NyA1IDE0LjUgNXMxLjUuNjcgMS41IDEuNVMxNS4zMyA4IDE0LjUgOHptMyA0Yy0uODMgMC0xLjUtLjY3LTEuNS0xLjVTMTYuNjcgOSAxNy41IDlzMS41LjY3IDEuNSAxLjUtLjY3IDEuNS0xLjUgMS41elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAncGFja2FnZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEzIDhWMmg0YTEgMSAwIDAgMSAuODMyLjQ0NkwyMS41MzUgOEgxM3pcIj48L3BhdGg+PHBhdGggZD1cIk0yLjQ2NSA4bDMuNzAzLTUuNTU0QTEgMSAwIDAgMSA3IDJoNHY2SDIuNDY1elwiPjwvcGF0aD48cGF0aCBkPVwiTTIyIDIxYTEgMSAwIDAgMS0xIDFIM2ExIDEgMCAwIDEtMS0xVjEwaDIwdjExem0tMTEtNUg1djNoNnYtM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ3BhY2thZ2UtdXBsb2FkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTUuMzE1IDIuMzczYS44MzMuODMzIDAgMCAwLS42OTMtLjM3MmgtMy4zMzN2NWg3LjExMmwtMy4wODYtNC42Mjh6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTcuOTU1IDExLjk5OWMuMjgzIDAgLjU2MS4wMjkuODMzLjA2OFY4LjY2OEgyLjEyMnY5LjE2NmMwIC40Ni4zNzMuODMzLjgzMy44MzNoOS4yMzNhNS44NyA1Ljg3IDAgMCAxLS4wNjctLjgzNiA1LjgzNCA1LjgzNCAwIDAgMSA1LjgzMy01LjgzM3pcIj48L3BhdGg+PHBhdGggZD1cIk05LjYyMiAyLjAwMkg2LjI4OWEuODMuODMgMCAwIDAtLjY5My4zNzJMMi41MSA3LjAwMmg3LjExMnYtNXpcIj48L3BhdGg+PHBhdGggZD1cIk0xNy45NTUgMTQuMTU0bC0zLjkyMiAzLjkyMiAxLjE3OCAxLjE3OCAxLjkxMS0xLjkxdjQuNjU1aDEuNjY3di00LjY1NWwxLjkxMSAxLjkxIDEuMTc4LTEuMTc4elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAncGFja2FnZS1kb3dubG9hZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE1LjMxNSAyLjM3M2EuODMzLjgzMyAwIDAgMC0uNjkzLS4zNzJoLTMuMzMzdjVoNy4xMTJsLTMuMDg2LTQuNjI4elwiPjwvcGF0aD48cGF0aCBkPVwiTTE3Ljk1NSAxMS45OTljLjI4MyAwIC41NjEuMDI5LjgzMy4wNjhWOC42NjhIMi4xMjJ2OS4xNjZjMCAuNDYuMzczLjgzMy44MzMuODMzaDkuMjMzYTUuODcgNS44NyAwIDAgMS0uMDY3LS44MzYgNS44MzQgNS44MzQgMCAwIDEgNS44MzMtNS44MzN6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNOS42MjIgMi4wMDJINi4yODlhLjgzLjgzIDAgMCAwLS42OTMuMzcyTDIuNTEgNy4wMDJoNy4xMTJ2LTV6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTguMDQ1IDIxLjg0NmwzLjkyMi0zLjkyMi0xLjE3OC0xLjE3OC0xLjkxMSAxLjkxdi00LjY1NWgtMS42Njd2NC42NTVsLTEuOTExLTEuOTEtMS4xNzggMS4xNzh6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdvcGVuLWluLW5ldycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE0LjAxNiAzSDIxdjYuOTg0aC0yLjAxNlY2LjQyMWwtOS43OTcgOS43OTctMS40MDYtMS40MDYgOS43OTctOS43OTdoLTMuNTYzVjIuOTk5em00Ljk2OCAxNS45ODRWMTJIMjF2Ni45ODRDMjEgMjAuMDYyIDIwLjA2MiAyMSAxOC45ODQgMjFINS4wMTVjLTEuMTI1IDAtMi4wMTYtLjkzOC0yLjAxNi0yLjAxNlY1LjAxNWMwLTEuMDc4Ljg5MS0yLjAxNiAyLjAxNi0yLjAxNmg2Ljk4NHYyLjAxNkg1LjAxNXYxMy45NjloMTMuOTY5elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbm90aWZpY2F0aW9ucy1vZmYnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOC4wMDggMTQuNDM4TDkuMDU1IDUuMDE2Yy4yMzQtLjA5NC40NjktLjIzNC43MDMtLjMyOGguMDQ3bC4yODEtLjE0MWMuMTQxLS4wNDcuMjgxLS4wNDcuNDIyLS4wOTRWMy43NWMwLS44NDQuNjU2LTEuNSAxLjUtMS41czEuNS42NTYgMS41IDEuNXYuNzAzYzIuODU5LjcwMyA0LjUgMy4yMzQgNC41IDYuMzI4djMuNjU2em0tNiA3LjMxMmMtMS4xMjUgMC0yLjAxNi0uODQ0LTIuMDE2LTEuOTY5aDQuMDMxYzAgMS4xMjUtLjg5MSAxLjk2OS0yLjAxNiAxLjk2OXpNNy44MzYgNS45MDZjNC4zODggNC41MzQgOC43OTcgOS4wNDcgMTMuMTcyIDEzLjU5NGwtMS4yNjYgMS4yNjYtMi4wMTYtMi4wMTZIMy45OTJ2LS45ODRsMi4wMTYtMi4wMTZ2LTUuMDE2YzAtMS4yNjYuMjgxLTIuNDM4Ljc5Ny0zLjQyMkwzLjk5MiA0LjU0NmwxLjI2Ni0xLjMxM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ25vdGlmaWNhdGlvbnMtaWRsZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE0LjQ4NCA5LjU2M1Y3Ljc4Mkg5LjUxNXYxLjc4MWgyLjc2NmwtMi43NjYgMy40MjJ2MS43ODFoNC45Njl2LTEuNzgxaC0yLjc2NnpNMTggMTUuNzVsMi4wMTYgMi4wMTZ2Ljk4NEgzLjk4NXYtLjk4NGwyLjAxNi0yLjAxNnYtNC45NjljMC0zLjA0NyAxLjY0MS01LjYyNSA0LjUtNi4zMjhWMy43NWMwLS44NDQuNjU2LTEuNSAxLjUtMS41czEuNS42NTYgMS41IDEuNXYuNzAzYzIuODU5LjcwMyA0LjUgMy4yODEgNC41IDYuMzI4djQuOTY5em0tNiA2Yy0xLjEyNSAwLTIuMDE2LS44OTEtMi4wMTYtMS45NjloNC4wMzFjMCAxLjA3OC0uOTM4IDEuOTY5LTIuMDE2IDEuOTY5elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbm90aWZpY2F0aW9ucy1hZGQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNS42MDUgMTIuNDY3di0xLjgyNGgtMi43MTRWNy45MjlIMTEuMTF2Mi43MTRIOC4zOTZ2MS44MjRoMi43MTR2Mi43MTRoMS43ODF2LTIuNzE0aDIuNzE0em0yLjYyOSAzLjQzNWwxLjkwOCAxLjkwOHYuOTc1SDMuODU2di0uOTc1bDEuOTA4LTEuOTA4di01LjI1OWMwLTIuOTI2IDIuMDM2LTUuNDI5IDQuNzkyLTYuMDY1di0uNjM2YzAtLjgwNi42MzYtMS40NDIgMS40NDItMS40NDJzMS40NDIuNjM2IDEuNDQyIDEuNDQydi42MzZjMi43NTcuNjM2IDQuNzkyIDMuMTM4IDQuNzkyIDYuMDY1djUuMjU5em0tOC4wMTUgMy43NzRoMy41NjNjMCAuOTc1LS44MDYgMS44MjQtMS43ODEgMS44MjRzLTEuNzgxLS44NDgtMS43ODEtMS44MjR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdub3RpZmljYXRpb24nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOCAxNS43NWwyLjAxNiAyLjAxNnYuOTg0SDMuOTg1di0uOTg0bDIuMDE2LTIuMDE2di00Ljk2OWMwLTMuMDk0IDEuNjQxLTUuNjI1IDQuNS02LjMyOFYzLjc1YzAtLjg0NC42NTYtMS41IDEuNS0xLjVzMS41LjY1NiAxLjUgMS41di43MDNjMi44NTkuNzAzIDQuNSAzLjI4MSA0LjUgNi4zMjh2NC45Njl6bS02IDZjLTEuMTI1IDAtMi4wMTYtLjg5MS0yLjAxNi0xLjk2OWg0LjAzMWMwIDEuMDc4LS45MzggMS45NjktMi4wMTYgMS45Njl6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdub3RpZmljYXRpb24tYWN0aXZlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMjEuNzVjLTEuMTI1IDAtMi4wMTYtLjg5MS0yLjAxNi0xLjk2OWgzLjk4NGMwIDEuMTY0LS44NzIgMS45NjktMS45NjkgMS45Njl6bTYtMTAuOTY5djQuOTY5bDIuMDE2IDIuMDE2di45ODRIMy45ODV2LS45ODRsMi4wMTYtMi4wMTZ2LTQuOTY5YzAtMy4wOTQgMS42NDEtNS42MjUgNC41LTYuMzI4VjMuNzVjMC0uODQ0LjY1Ni0xLjUgMS41LTEuNXMxLjUuNjU2IDEuNSAxLjV2LjcwM2MyLjg1OS43MDMgNC41IDMuMjgxIDQuNSA2LjMyOHptMS45NjktLjUxNWMtLjE0MS0yLjY3Mi0xLjUtNC45NjktMy41MTYtNi40MjJsMS40MDYtMS40MDZjMi4zOTEgMS44MjggMy45ODQgNC42NDEgNC4xMjUgNy44MjhoLTIuMDE2ek03LjU5NCAzLjg0NGMtMi4wNjMgMS40NTMtMy40MjIgMy43NS0zLjU2MyA2LjQyMkgyLjAxNWMuMTQxLTMuMTg4IDEuNzM0LTYgNC4xMjUtNy44Mjh6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdtb3VzZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEzLjkwNSA1Ljc2MmguOTUyYTIuODYgMi44NiAwIDAgMCAyLjg1Ny0yLjg1N3YtLjk1MmgtMS45MDV2Ljk1MmEuOTU0Ljk1NCAwIDAgMS0uOTUyLjk1MmgtLjk1MmEyLjg2IDIuODYgMCAwIDAtMi44NTcgMi44NTd2Ljk1Mkg4LjE5MWExLjkwNiAxLjkwNiAwIDAgMC0xLjkwNSAxLjkwNXY2LjY2N2MwIDMuMTUxIDIuNTYzIDUuNzE0IDUuNzE0IDUuNzE0czUuNzE0LTIuNTYzIDUuNzE0LTUuNzE0VjkuNTcxYzAtMS4wNS0uODU0LTEuOTA1LTEuOTA1LTEuOTA1aC0yLjg1N3YtLjk1MmMwLS41MjUuNDI4LS45NTIuOTUyLS45NTJ6bS0yLjg1NyAzLjgwOXYyLjg1N0g4LjE5MVY5LjU3MWgyLjg1N3pNMTIgMjAuMDQ4Yy0yLjEgMC0zLjgxLTEuNzEtMy44MS0zLjgxdi0xLjkwNWg3LjYxOXYxLjkwNWMwIDIuMS0xLjcxIDMuODEtMy44MSAzLjgxem0zLjgxLTEwLjQ3N3YyLjg1N2gtMi44NTdWOS41NzFoMi44NTd6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdtb3JlLXZlcnRpY2FsJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgNy45OTljMS4xIDAgMi4wMDEtLjkgMi4wMDEtMi4wMDFzLS45LTIuMDAxLTIuMDAxLTIuMDAxYy0xLjEgMC0yLjAwMS45LTIuMDAxIDIuMDAxcy45IDIuMDAxIDIuMDAxIDIuMDAxem0wIDJjLTEuMSAwLTIuMDAxLjktMi4wMDEgMi4wMDFzLjkgMi4wMDEgMi4wMDEgMi4wMDFjMS4xIDAgMi4wMDEtLjkgMi4wMDEtMi4wMDFzLS45LTIuMDAxLTIuMDAxLTIuMDAxem0wIDYuMDAyYy0xLjEgMC0yLjAwMS45LTIuMDAxIDIuMDAxcy45IDIuMDAxIDIuMDAxIDIuMDAxYzEuMSAwIDIuMDAxLS45IDIuMDAxLTIuMDAxcy0uOS0yLjAwMS0yLjAwMS0yLjAwMXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ21vcmUtaG9yaXpvbnRhbCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTYgMTBjLTEuMSAwLTIgLjktMiAycy45IDIgMiAyIDItLjkgMi0yLS45LTItMi0yem0xMiAwYy0xLjEgMC0yIC45LTIgMnMuOSAyIDIgMiAyLS45IDItMi0uOS0yLTItMnptLTYgMGMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTItLjktMi0yLTJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdtb29kLXNhZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDE0LjAxNmMyLjM0NCAwIDQuMzEzIDEuNDA2IDUuMTA5IDMuNDY5aC0xLjY0MWMtLjcwMy0xLjE3Mi0xLjk2OS0xLjk2OS0zLjQ2OS0xLjk2OXMtMi43NjYuNzk3LTMuNDY5IDEuOTY5SDYuODg5Yy43OTctMi4wNjMgMi43NjYtMy40NjkgNS4xMDktMy40Njl6bTAgNmM0LjQwNiAwIDguMDE2LTMuNjA5IDguMDE2LTguMDE2UzE2LjQwNyAzLjk4NCAxMiAzLjk4NCAzLjk4NCA3LjU5MyAzLjk4NCAxMiA3LjU5MyAyMC4wMTYgMTIgMjAuMDE2em0wLTE4YzUuNTMxIDAgOS45ODQgNC40NTMgOS45ODQgOS45ODRTMTcuNTMxIDIxLjk4NCAxMiAyMS45ODQgMi4wMTYgMTcuNTMxIDIuMDE2IDEyIDYuNDY5IDIuMDE2IDEyIDIuMDE2em0tNS4wMTYgNy41YzAtLjg0NC42NTYtMS41IDEuNS0xLjVzMS41LjY1NiAxLjUgMS41LS42NTYgMS41LTEuNSAxLjUtMS41LS42NTYtMS41LTEuNXptNy4wMzIgMGMwLS44NDQuNjU2LTEuNSAxLjUtMS41czEuNS42NTYgMS41IDEuNS0uNjU2IDEuNS0xLjUgMS41LTEuNS0uNjU2LTEuNS0xLjV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdtb29kLW5ldXRyYWwnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMiAyMC4wMTZjNC40MDYgMCA4LjAxNi0zLjYwOSA4LjAxNi04LjAxNlMxNi40MDcgMy45ODQgMTIgMy45ODQgMy45ODQgNy41OTMgMy45ODQgMTIgNy41OTMgMjAuMDE2IDEyIDIwLjAxNnptMC0xOGM1LjUzMSAwIDkuOTg0IDQuNDUzIDkuOTg0IDkuOTg0UzE3LjUzMSAyMS45ODQgMTIgMjEuOTg0IDIuMDE2IDE3LjUzMSAyLjAxNiAxMiA2LjQ2OSAyLjAxNiAxMiAyLjAxNnptLTUuMDE2IDcuNWMwLS44NDQuNjU2LTEuNSAxLjUtMS41czEuNS42NTYgMS41IDEuNS0uNjU2IDEuNS0xLjUgMS41LTEuNS0uNjU2LTEuNS0xLjV6bTcuMDMyIDBjMC0uODQ0LjY1Ni0xLjUgMS41LTEuNXMxLjUuNjU2IDEuNSAxLjUtLjY1NiAxLjUtMS41IDEuNS0xLjUtLjY1Ni0xLjUtMS41ek05IDE0LjAxNmg2djEuNUg5di0xLjV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdtb29kLWhhcHB5JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMTUuOTg0YzEuNSAwIDIuNzY2LS43OTcgMy40NjktMS45NjloMS42NDFjLS43OTcgMi4wNjMtMi43NjYgMy40NjktNS4xMDkgMy40NjlzLTQuMzEzLTEuNDA2LTUuMTA5LTMuNDY5aDEuNjQxYTQuMDE4IDQuMDE4IDAgMCAwIDMuNDY5IDEuOTY5em0wIDQuMDMyYzQuNDA2IDAgOC4wMTYtMy42MDkgOC4wMTYtOC4wMTZTMTYuNDA3IDMuOTg0IDEyIDMuOTg0IDMuOTg0IDcuNTkzIDMuOTg0IDEyIDcuNTkzIDIwLjAxNiAxMiAyMC4wMTZ6bTAtMThjNS41MzEgMCA5Ljk4NCA0LjQ1MyA5Ljk4NCA5Ljk4NFMxNy41MzEgMjEuOTg0IDEyIDIxLjk4NCAyLjAxNiAxNy41MzEgMi4wMTYgMTIgNi40NjkgMi4wMTYgMTIgMi4wMTZ6bS01LjAxNiA3LjVjMC0uODQ0LjY1Ni0xLjUgMS41LTEuNXMxLjUuNjU2IDEuNSAxLjUtLjY1NiAxLjUtMS41IDEuNS0xLjUtLjY1Ni0xLjUtMS41em03LjAzMiAwYzAtLjg0NC42NTYtMS41IDEuNS0xLjVzMS41LjY1NiAxLjUgMS41LS42NTYgMS41LTEuNSAxLjUtMS41LS42NTYtMS41LTEuNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ21vb2QtZXhjaXRlZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDE3LjQ4NGMtMi4zNDQgMC00LjMxMy0xLjQwNi01LjEwOS0zLjQ2OUgxNy4xMWMtLjc5NyAyLjA2My0yLjc2NiAzLjQ2OS01LjEwOSAzLjQ2OXptLTMuNTE2LTYuNDY4Yy0uODQ0IDAtMS41LS42NTYtMS41LTEuNXMuNjU2LTEuNSAxLjUtMS41IDEuNS42NTYgMS41IDEuNS0uNjU2IDEuNS0xLjUgMS41em03LjAzMiAwYy0uODQ0IDAtMS41LS42NTYtMS41LTEuNXMuNjU2LTEuNSAxLjUtMS41IDEuNS42NTYgMS41IDEuNS0uNjU2IDEuNS0xLjUgMS41em0tMy41MTYgOWM0LjQwNiAwIDguMDE2LTMuNjA5IDguMDE2LTguMDE2UzE2LjQwNyAzLjk4NCAxMiAzLjk4NCAzLjk4NCA3LjU5MyAzLjk4NCAxMiA3LjU5MyAyMC4wMTYgMTIgMjAuMDE2em0wLTE4YzUuNTMxIDAgOS45ODQgNC40NTMgOS45ODQgOS45ODRTMTcuNTMxIDIxLjk4NCAxMiAyMS45ODQgMi4wMTYgMTcuNTMxIDIuMDE2IDEyIDYuNDY5IDIuMDE2IDEyIDIuMDE2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbW9vZC1iYWQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMiAxNC4wMTZjMi4zNDQgMCA0LjMxMyAxLjQwNiA1LjEwOSAzLjQ2OUg2Ljg5Yy43OTctMi4wNjMgMi43NjYtMy40NjkgNS4xMDktMy40Njl6bS0zLjUxNi0zYy0uODQ0IDAtMS41LS42NTYtMS41LTEuNXMuNjU2LTEuNSAxLjUtMS41IDEuNS42NTYgMS41IDEuNS0uNjU2IDEuNS0xLjUgMS41em03LjAzMiAwYy0uODQ0IDAtMS41LS42NTYtMS41LTEuNXMuNjU2LTEuNSAxLjUtMS41IDEuNS42NTYgMS41IDEuNS0uNjU2IDEuNS0xLjUgMS41em0tMy41MTYgOWM0LjQwNiAwIDguMDE2LTMuNjA5IDguMDE2LTguMDE2UzE2LjQwNyAzLjk4NCAxMiAzLjk4NCAzLjk4NCA3LjU5MyAzLjk4NCAxMiA3LjU5MyAyMC4wMTYgMTIgMjAuMDE2em0wLTE4YzUuNTMxIDAgOS45ODQgNC40NTMgOS45ODQgOS45ODRTMTcuNTMxIDIxLjk4NCAxMiAyMS45ODQgMi4wMTYgMTcuNTMxIDIuMDE2IDEyIDYuNDY5IDIuMDE2IDEyIDIuMDE2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbW9uZXktbm90ZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE5Ljk4NyA3LjAyNXYxMC45NzJIMy4wMzFjMCAxLjEwMy44OTQgMS45OTQgMS45OTQgMS45OTRoMTQuOTM0YTIuMDIzIDIuMDIzIDAgMCAwIDIuMDIyLTIuMDIydi04Ljk1YTEuOTk0IDEuOTk0IDAgMCAwLTEuOTk0LTEuOTk0elwiPjwvcGF0aD48cGF0aCBkPVwiTTE3LjExMiA1LjAzMUgyLjg0YS44MTkuODE5IDAgMCAwLS44MjUuODA2djkuMzMxYzAgLjQ0NC4zNzIuODA2LjgyNS44MDZoMTQuMjc1YS44MTkuODE5IDAgMCAwIC44MjUtLjgwNlY1LjgzN2EuODE5LjgxOSAwIDAgMC0uODI4LS44MDZ6bS0yLjM2NSA4LjAxOWMtLjMwMy40NDQtLjM5Ny45NS0uMjk3IDEuMzY5SDUuNTM3Yy4xMDMtLjQxOS4wMDYtLjkyNS0uMjk3LTEuMzY5LS40MDktLjYwMy0xLjA4MS0uOTAzLTEuNjM0LS43ODFWOC41MTNjLjQyOC4xMDMuOTUuMDA5IDEuNDAzLS4yODguNjMxLS40MTMuOTM4LTEuMDg3Ljc5MS0xLjYzNGg4LjM4OGMtLjE0Ny41NDcuMTU5IDEuMjIyLjc5MSAxLjYzNC40NDQuMjkxLjk0Ny4zODQgMS4zNjYuMjk3djMuNzQxYy0uNTQ0LS4xLTEuMTk0LjE5Ny0xLjU5Ny43ODd6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTIuNDcyIDEwLjY0MWMwIDEuNzE2LTEuMTQ3IDMuMTA5LTIuNTU5IDMuMTA5cy0yLjU1OS0xLjM5MS0yLjU1OS0zLjEwOSAxLjE0Ny0zLjEwOSAyLjU1OS0zLjEwOSAyLjU1OSAxLjM5NCAyLjU1OSAzLjEwOXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ21vYmlsZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE1LjYzNiAySDguMzYzQTIuMjczIDIuMjczIDAgMCAwIDYuMDkgNC4yNzN2MTUuNDU1YTIuMjczIDIuMjczIDAgMCAwIDIuMjczIDIuMjczaDcuMjczYTIuMjczIDIuMjczIDAgMCAwIDIuMjczLTIuMjczVjQuMjczQTIuMjczIDIuMjczIDAgMCAwIDE1LjYzNiAyek0xMiAyMS4wOTFjLS43NTUgMC0xLjM2NC0uNjA5LTEuMzY0LTEuMzY0cy42MDktMS4zNjQgMS4zNjQtMS4zNjQgMS4zNjQuNjA5IDEuMzY0IDEuMzY0LS42MDkgMS4zNjQtMS4zNjQgMS4zNjR6bTQuMDkxLTMuNjM2SDcuOTA5VjQuNzI4aDguMTgydjEyLjcyN3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ21tcycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE4Ljg4MSAzLjAzMWgtMTMuOGMtMS4xNzIgMC0yLjEyMi45NS0yLjEyMiAyLjEyMnYxNS44MzFMNi45NDMgMTdIMTguODhjMS4xNzIgMCAyLjEyMi0uOTUgMi4xMjItMi4xMjJWNS4xNTNjMC0xLjE3Mi0uOTUtMi4xMjItMi4xMjItMi4xMjJ6TTUuNTUgMTIuOTY5YzAtLjAzNCAzLjQ2Ni00LjA5MSAzLjQ2Ni00LjA5MWwxLjkyOCAyLjU1MyAzLjE4MS0zLjgwNiA0LjcxOSA1LjM0NEg1LjU1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbWljLW9uJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTcuNTc2IDExLjQ4MmgxLjc3NmMwIDMuNjAyLTIuODYyIDYuNTYzLTYuMzE2IDcuMDU2djMuNDU0aC0yLjA3MnYtMy40NTRjLTMuNDU0LS40OTMtNi4zMTYtMy40NTQtNi4zMTYtNy4wNTZoMS43NzZjMCAzLjE1OCAyLjY2NSA1LjMyOSA1LjU3NiA1LjMyOXM1LjU3Ni0yLjE3MSA1LjU3Ni01LjMyOXpNMTIgMTQuNjRjLTEuNzI3IDAtMy4xNTgtMS40MzEtMy4xNTgtMy4xNThWNS4xNjZjMC0xLjcyNyAxLjQzMS0zLjE1OCAzLjE1OC0zLjE1OHMzLjE1OCAxLjQzMSAzLjE1OCAzLjE1OHY2LjMxNmMwIDEuNzI3LTEuNDMxIDMuMTU4LTMuMTU4IDMuMTU4elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbWljLW9mZicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTMuODU4IDMuMDQ0TDIxLjQ3NCAyMC42NmwtMS4zMzIgMS4zMzJMMTUuNzUgMTcuNmMtLjc5LjQ5My0xLjc3Ni43OS0yLjcxNC45Mzh2My40NTRoLTIuMDcydi0zLjQ1NGMtMy40NTQtLjQ5My02LjMxNi0zLjQ1NC02LjMxNi03LjA1NmgxLjc3NmMwIDMuMTU4IDIuNjY1IDUuMzI5IDUuNTc2IDUuMzI5LjgzOSAwIDEuNjc4LS4xOTcgMi40MTgtLjU0M2wtMS43MjctMS43MjdhMi45MjYgMi45MjYgMCAwIDEtLjY5MS4wOTljLTEuNzI3IDAtMy4xNTgtMS40MzEtMy4xNTgtMy4xNTh2LS43OUwyLjUyNiA0LjM3NnptMTEuMyA4LjU4Nkw4Ljg0MiA1LjM2M3YtLjE5N2MwLTEuNzI3IDEuNDMxLTMuMTU4IDMuMTU4LTMuMTU4czMuMTU4IDEuNDMxIDMuMTU4IDMuMTU4djYuNDY0em00LjE5NC0uMTQ4YTYuOTU4IDYuOTU4IDAgMCAxLS45MzggMy40NTRsLTEuMjgzLTEuMzMyYy4yOTYtLjY0MS40NDQtMS4zMzIuNDQ0LTIuMTIyaDEuNzc2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbWVzc2FnZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE4LjkyMiAzLjAzMWgtMTMuOEMzLjk1IDMuMDMxIDMgMy45ODEgMyA1LjE1M3YxNS44MzFMNi45ODQgMTdoMTEuOTM3YzEuMTcyIDAgMi4xMjItLjk1IDIuMTIyLTIuMTIyVjUuMTUzYzAtMS4xNzItLjk1LTIuMTIyLTIuMTIyLTIuMTIyem0tNC43NjYgMTEuNDM4SDUuOTkzdi0xLjVoOC4xNjN2MS41em0zLjg4OC0zLjU5NEg1Ljk5NFY5LjVoMTIuMDV2MS4zNzV6bTAtMy4zNzVINS45OTRWNi4wNjNoMTIuMDVWNy41elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbWVzc2FnZS1idWJibGUtYmxhbmsnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOC45MjIgMy4wMzFoLTEzLjhDMy45NSAzLjAzMSAzIDMuOTgxIDMgNS4xNTN2MTUuODMxTDYuOTg0IDE3aDExLjkzN2MxLjE3MiAwIDIuMTIyLS45NSAyLjEyMi0yLjEyMlY1LjE1M2MwLTEuMTcyLS45NS0yLjEyMi0yLjEyMi0yLjEyMnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ21lbnUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0zIDZoMTh2Mi4wMTZIM1Y2elwiPjwvcGF0aD48cGF0aCBkPVwiTTMgMTEuMDE2aDE0LjAzMXYxLjk2OUgzdi0xLjk2OXpcIj48L3BhdGg+PHBhdGggZD1cIk0zIDE1Ljk4NGgxNlYxOEgzdi0yLjAxNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ21hcC1waW4nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMiAxMS40ODRjMS4zNTkgMCAyLjQ4NC0xLjEyNSAyLjQ4NC0yLjQ4NFMxMy4zNTkgNi41MTYgMTIgNi41MTYgOS41MTYgNy42NDEgOS41MTYgOXMxLjEyNSAyLjQ4NCAyLjQ4NCAyLjQ4NHptMC05LjQ2OEE2Ljk0MiA2Ljk0MiAwIDAgMSAxOC45ODQgOWMwIDUuMjUtNi45ODQgMTIuOTg0LTYuOTg0IDEyLjk4NFM1LjAxNiAxNC4yNSA1LjAxNiA5QTYuOTQyIDYuOTQyIDAgMCAxIDEyIDIuMDE2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbG9jaycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE3IDExVjdBNSA1IDAgMCAwIDcgN3Y0YTIgMiAwIDAgMC0yIDJ2N2EyIDIgMCAwIDAgMiAyaDEwYTIgMiAwIDAgMCAyLTJ2LTdhMiAyIDAgMCAwLTItMnptLTUtN2EzIDMgMCAwIDEgMyAzdjRIOVY3YTMgMyAwIDAgMSAzLTN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdsb2NhbC1zaGlwcGluZycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE3LjI1MSAxNy43MDNjLjczOCAwIDEuMzEzLS41NzQgMS4zMTMtMS4zMTNzLS41NzQtMS4zMTMtMS4zMTMtMS4zMTMtMS4zMTMuNTc0LTEuMzEzIDEuMzEzLjU3NCAxLjMxMyAxLjMxMyAxLjMxM3ptMS4zMTMtNy44NzdIMTYuMzlWMTJoMy44OTh6TTYuNzQ5IDE3LjcwM2MuNzM4IDAgMS4zMTMtLjU3NCAxLjMxMy0xLjMxM3MtLjU3NC0xLjMxMy0xLjMxMy0xLjMxMy0xLjMxMy41NzQtMS4zMTMgMS4zMTMuNTc0IDEuMzEzIDEuMzEzIDEuMzEzem0xMi4yNjctOS4xOUwyMS42NDIgMTJ2NC4zOWgtMS43NjRjMCAxLjQzNi0xLjE5IDIuNjI2LTIuNjI2IDIuNjI2cy0yLjYyNi0xLjE5LTIuNjI2LTIuNjI2SDkuMzc1YzAgMS40MzYtMS4xOSAyLjYyNi0yLjYyNiAyLjYyNnMtMi42MjYtMS4xOS0yLjYyNi0yLjYyNkgyLjM1OVY2Ljc0OWMwLS45NDQuODIxLTEuNzY0IDEuNzY0LTEuNzY0SDE2LjM5djMuNTI4aDIuNjI2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbG9hZGluZycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE4LjM1IDUuNjQ0QTguOTUzIDguOTUzIDAgMCAwIDExLjk5NCAzYy00Ljk3MiAwLTguOTg5IDQuMDI3LTguOTg5IDlzNC4wMTYgOSA4Ljk4OSA5YzQuMTk2IDAgNy42OTUtMi44NjkgOC42OTYtNi43NWgtMi4zNGE2Ljc0IDYuNzQgMCAwIDEtNi4zNTYgNC41Yy0zLjcyNCAwLTYuNzUtMy4wMjYtNi43NS02Ljc1czMuMDI2LTYuNzUgNi43NS02Ljc1YzEuODY3IDAgMy41MzMuNzc2IDQuNzQ4IDIuMDAybC0zLjYyMiAzLjYyMmg3Ljg3NVYyLjk5OWwtMi42NDQgMi42NDR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdsaXZlLWhlbHAnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOC44ODEgMy4wMzFoLTEzLjhjLTEuMTcyIDAtMi4xMjIuOTUtMi4xMjIgMi4xMjJ2MTUuODMxTDYuOTQzIDE3SDE4Ljg4YzEuMTcyIDAgMi4xMjItLjk1IDIuMTIyLTIuMTIyVjUuMTUzYzAtMS4xNzItLjk1LTIuMTIyLTIuMTIyLTIuMTIyem0tNi4wNCAxMS42MTNhMS4yMTUgMS4yMTUgMCAwIDEtLjkxMi4zODFjLS4zNjMgMC0uNjY2LS4xMjgtLjkwMy0uMzgxYTEuMzA4IDEuMzA4IDAgMCAxLS4zNTktLjk0MWMwLS4zODEuMTE5LS43LjM1OS0uOTUzcy41NDEtLjM4MS45MDMtLjM4MWMuMzYzIDAgLjY2OS4xMjguOTEyLjM4MXMuMzY2LjU3Mi4zNjYuOTUzYzAgLjM3NS0uMTIyLjY4Ny0uMzY2Ljk0MXptMS44NDMtNi4zMzFhMy4xNzggMy4xNzggMCAwIDEtLjM5NC42NTNjLS4xNTkuMi0uMzI1LjM5NC0uNTAzLjU4MXMtLjM0MS4zODEtLjQ4Ny41ODFjLS4xNS4yLS4yNjYuNDE2LS4zNTMuNjM3YTEuNjUxIDEuNjUxIDAgMCAwLS4wODcuNzY5aC0xLjg1M2EyLjI4MiAyLjI4MiAwIDAgMSAuMDM0LS44OTFjLjA3Mi0uMjY5LjE3NS0uNTE2LjMwOS0uNzQ3cy4yODQtLjQ0MS40NTMtLjYzMWMuMTY5LS4xOTEuMzI4LS4zNzUuNDgxLS41NTNzLjI4MS0uMzUuMzgxLS41MTZjLjEtLjE2OS4xNS0uMzQxLjE1LS41MjUgMC0uMjk3LS4wODctLjUyMi0uMjY2LS42NzVzLS40MDktLjIzMS0uNjk3LS4yMzFjLS4yNjkgMC0uNTA2LjA2My0uNzA5LjE4OGEzLjE2NSAzLjE2NSAwIDAgMC0uNTk3LjQ3NUw5LjM4MyA2LjM2NmEzLjg1MiAzLjg1MiAwIDAgMSAxLjItLjk0NyAzLjMwMSAzLjMwMSAwIDAgMSAxLjU0NC0uMzU5Yy4zODEgMCAuNzQxLjA0NyAxLjA2OS4xNDQuMzMxLjA5Ny42MTkuMjQ0Ljg2Mi40NDRzLjQzNC40NTYuNTc1Ljc2OWMuMTM4LjMxMi4yMDkuNjc4LjIwOSAxLjA5Ny0uMDAzLjMtLjA1My41NjYtLjE1OS44elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbGlzdCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTYuOTg0IDYuOTg0SDIxVjlINi45ODRWNi45ODR6bTAgMTAuMDMyVjE1SDIxdjIuMDE2SDYuOTg0em0wLTQuMDMydi0xLjk2OUgyMXYxLjk2OUg2Ljk4NHpNMyA5VjYuOTg0aDIuMDE2VjlIM3ptMCA4LjAxNlYxNWgyLjAxNnYyLjAxNkgzem0wLTQuMDMydi0xLjk2OWgyLjAxNnYxLjk2OUgzelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbGlzdC1hZGQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yLjAxNiAxNS45ODR2LTEuOTY5aDcuOTY5djEuOTY5SDIuMDE2ek0xOCAxNC4wMTZoMy45ODR2MS45NjlIMTh2NC4wMzFoLTIuMDE2di00LjAzMUgxMnYtMS45NjloMy45ODRWOS45ODVIMTh2NC4wMzF6TTE0LjAxNiA2djIuMDE2aC0xMlY2aDEyem0wIDMuOTg0VjEyaC0xMlY5Ljk4NGgxMnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2xpbmUtd2VpZ2h0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMyAzLjk4NGgxOHY0LjAzMUgzVjMuOTg0em0wIDl2LTNoMTh2M0gzem0wIDcuMDMydi0xLjAzMWgxOHYxLjAzMUgzem0wLTNWMTVoMTh2Mi4wMTZIM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2xpbmUtc3R5bGUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0zIDMuOTg0aDE4djQuMDMxSDNWMy45ODR6TTEyLjk4NCAxMlY5Ljk4NEgyMVYxMmgtOC4wMTZ6TTMgMTJWOS45ODRoOC4wMTZWMTJIM3ptMTUuOTg0IDguMDE2VjE4SDIxdjIuMDE2aC0yLjAxNnptLTMuOTg0IDBWMThoMi4wMTZ2Mi4wMTZIMTV6bS0zLjk4NCAwVjE4aDEuOTY5djIuMDE2aC0xLjk2OXptLTQuMDMyIDBWMThIOXYyLjAxNkg2Ljk4NHptLTMuOTg0IDBWMThoMi4wMTZ2Mi4wMTZIM3ptMTIuOTg0LTQuMDMydi0xLjk2OUgyMXYxLjk2OWgtNS4wMTZ6bS02LjQ2OCAwdi0xLjk2OWg0Ljk2OXYxLjk2OUg5LjUxNnptLTYuNTE2IDB2LTEuOTY5aDUuMDE2djEuOTY5SDN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdsaWJyYXJ5LWJvb2tzJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNS4wMTYgNi45ODRWNS4wMTVIMTV2MS45NjlINS4wMTZ6TTkgMTV2LTIuMDE2aDZWMTVIOXptLTMuOTg0LTMuOTg0VjlIMTV2Mi4wMTZINS4wMTZ6bS0xLjAzMi05YTEuOTgxIDEuOTgxIDAgMCAwLTEuOTY5IDEuOTY5djEyYzAgMS4wNzguODkxIDIuMDE2IDEuOTY5IDIuMDE2aDEyYzEuMDc4IDAgMi4wMTYtLjkzOCAyLjAxNi0yLjAxNnYtMTJjMC0xLjA3OC0uOTM4LTEuOTY5LTIuMDE2LTEuOTY5aC0xMnpNMjAuMDE2IDZ2MTQuMDE2SDZ2MS45NjloMTQuMDE2YTEuOTgxIDEuOTgxIDAgMCAwIDEuOTY5LTEuOTY5VjZoLTEuOTY5elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbGF5ZXJzJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMTUuOTg0QzguOTk5IDEzLjY1NiA2LjAwOSAxMS4zMTkgMyA5bDktNi45ODRMMjEgOWMtMy4wMDkgMi4zMTktNS45OTkgNC42NTctOSA2Ljk4NHptMCAyLjU3OWw3LjM1OS01Ljc2NkwyMSAxNC4wNjNsLTkgNi45ODQtOS02Ljk4NCAxLjY0MS0xLjI2NnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2xheWVycy1vZmYnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0zLjI4MS45ODRsMTguNzAzIDE4Ljc1TDIwLjcxOCAyMWwtMy43NS0zLjc5Ny00Ljk2OSAzLjg0NC05LTYuOTg0IDEuNjQxLTEuMjY2IDcuMzU5IDUuNzY2IDMuNTE2LTIuNzY2LTEuNDA2LTEuNDA2TDEyIDE1Ljk4NWMtMy4wMDEtMi4zMjgtNS45OTEtNC42NjUtOS02Ljk4NEw2LjIzNCA2LjQ3IDIuMDE1IDIuMjUxek0yMSA5Yy0xLjM1NCAxLjAzNy0yLjY5MiAyLjA4OS00LjAzMSAzLjE0MUw5LjA5NCA0LjI2NiAxMiAyLjAxNnptLTEuMTcyIDZsLTEuNDUzLTEuNDUzIDEuMTcyLS44OTFMMjEgMTQuMDYyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbGFzdC1wYWdlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjEgMi45OTRoLTIuOTY2VjIxSDIxVjIuOTk0elwiPjwvcGF0aD48cGF0aCBkPVwiTTIuOTM0IDE4Ljg5MUw1LjA0MyAyMWw5LTktOS05LTIuMTA5IDIuMTA5TDkuODI1IDEyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnbGFwdG9wJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTguNTg4IDE3LjM1M2MuOTA2IDAgMS42MzktLjc0MSAxLjYzOS0xLjY0N2wuMDA4LTkuMDU5YzAtLjkwNi0uNzQxLTEuNjQ3LTEuNjQ3LTEuNjQ3SDUuNDEyYy0uOTA2IDAtMS42NDcuNzQxLTEuNjQ3IDEuNjQ3djkuMDU5YzAgLjkwNi43NDEgMS42NDcgMS42NDcgMS42NDdIMi4xMThjMCAuOTA2Ljc0MSAxLjY0NyAxLjY0NyAxLjY0N2gxNi40NzFjLjkwNiAwIDEuNjQ3LS43NDEgMS42NDctMS42NDdoLTMuMjk0ek01LjQxMiA2LjY0N2gxMy4xNzZ2OS4wNTlINS40MTJWNi42NDd6TTEyIDE4LjE3NmMtLjQ1MyAwLS44MjQtLjM3MS0uODI0LS44MjRzLjM3MS0uODI0LjgyNC0uODI0LjgyNC4zNzEuODI0LjgyNC0uMzcxLjgyNC0uODI0LjgyNHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2xhYmVsJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTcuNjMgNS44NEMxNy4yNyA1LjMzIDE2LjY3IDUgMTYgNUw1IDUuMDFDMy45IDUuMDEgMyA1LjkgMyA3djEwYzAgMS4xLjkgMS45OSAyIDEuOTlMMTYgMTljLjY3IDAgMS4yNy0uMzMgMS42My0uODRMMjIgMTJsLTQuMzctNi4xNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2tleWhvbGUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMiA0YTggOCAwIDEgMCA4IDggOCA4IDAgMCAwLTgtOHptMS4xIDguNTJsLjUgMy40OGgtMy4ybC41LTMuNDhhMi40MDQgMi40MDQgMCAwIDEtMS4zLTIuMTMzIDIuNCAyLjQgMCAxIDEgMy41MTMgMi4xMjdsLS4wMTMuMDA2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnaW1hZ2UnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yMC4wMTYgMi4wMTZIMy45ODVhMS45ODEgMS45ODEgMCAwIDAtMS45NjkgMS45Njl2MTYuMDMxYzAgMS4wNzguODkxIDEuOTY5IDEuOTY5IDEuOTY5aDE2LjAzMWExLjk4MSAxLjk4MSAwIDAgMCAxLjk2OS0xLjk2OVYzLjk4NWExLjk4MSAxLjk4MSAwIDAgMC0xLjk2OS0xLjk2OXptMCAxMS4wMTV2Ni45ODRIMy45ODVWMy45ODRoMTYuMDMxdjkuMDQ3elwiPjwvcGF0aD48cGF0aCBkPVwiTTE3LjAxNiA4LjQ4NGExLjUgMS41IDAgMSAxLTMuMDAxLS4wMDEgMS41IDEuNSAwIDAgMSAzLjAwMS4wMDF6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTIuOTg0IDE2LjY4OGwtMy0zLjcwM0w2IDE4LjAwMWgxMmwtMy0zLjk4NHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2lkLWNhcmQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk01LjkzNyAxOS45NjloMTQuMDYyYzEuMTAzIDAgMi0uODk3IDItMlY3Ljk1QTEuOTUgMS45NSAwIDAgMCAyMC4wNDkgNmgtLjA1djExLjk2OUgzLjkzN2MwIDEuMTAzLjg5NyAyIDIgMnpcIj48L3BhdGg+PHBhdGggZD1cIk0xNi4xMDkgMy45NjlIMy44NTlBMS44NjEgMS44NjEgMCAwIDAgMiA1LjgyOFYxNC4yYzAgMS4wMjUuODM0IDEuODU5IDEuODU5IDEuODU5aDEyLjI0N2ExLjg2MSAxLjg2MSAwIDAgMCAxLjg1OS0xLjg1OVY1LjgyOGExLjg1NyAxLjg1NyAwIDAgMC0xLjg1Ni0xLjg1OXptLTExLjgxOCA5LjNjMC0xLjcxMyAxLjA3OC0yLjc5MSAyLjc5MS0yLjc5MWExLjg2IDEuODYgMCAxIDEgMC0zLjcxOSAxLjg2IDEuODYgMCAwIDEgMCAzLjcxOWMxLjcxMyAwIDIuNzkxIDEuMDc4IDIuNzkxIDIuNzkxSDQuMjkyem0xMS42NjggMGgtNC4wMzRWMTEuNDFoNC4wMzR2MS44NTl6bTAtMy43MTloLTQuMDM0VjcuNjkxaDQuMDM0VjkuNTV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdpZC1iYWRnZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIwIDRINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNmMxLjEgMCAyLS45IDItMlY2YzAtMS4xLS45LTItMi0yek05IDhhMiAyIDAgMSAxLS4wMDEgNC4wMDFBMiAyIDAgMCAxIDkgOHptLTMgOGMwLTEuODQxIDEuMTU5LTMgMy0zczMgMS4xNTkgMyAzSDZ6bTEyIDBoLTR2LTJoNHYyem0wLTNoLTR2LTJoNHYyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnaG91cmdsYXNzJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNiAydjZoLjAxTDYgOC4wMSAxMCAxMmwtNCA0IC4wMS4wMUg2VjIyaDEydi01Ljk5aC0uMDFMMTggMTZsLTQtNCA0LTMuOTktLjAxLS4wMUgxOFYySDZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdob3VyZ2xhc3MtbycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTYgMnY2aC4wMUw2IDguMDEgMTAgMTJsLTQgNCAuMDEuMDFINlYyMmgxMnYtNS45OWgtLjAxTDE4IDE2bC00LTQgNC0zLjk5LS4wMS0uMDFIMThWMkg2em0xMCAxNC41VjIwSDh2LTMuNWw0LTQgNCA0em0tNC01bC00LTRWNGg4djMuNWwtNCA0elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjIsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnaG9tZTInLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyMiAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNy41MTMgMTMuMDc5djUuMzA2YS43MTMuNzEzIDAgMCAxLS43MDguNzA4SDEyLjU2di00LjI0NUg5LjczdjQuMjQ1SDUuNDg1YS43MTMuNzEzIDAgMCAxLS43MDgtLjcwOHYtNS4zMDZjMC0uMDIyLjAxMS0uMDQ1LjAxMS0uMDY3bDYuMzU2LTUuMjQgNi4zNTYgNS4yNGEuMTQ0LjE0NCAwIDAgMSAuMDExLjA2N3ptMi40NjUtLjc2M2wtLjY4Ni44MThhLjM3LjM3IDAgMCAxLS4yMzIuMTIyaC0uMDMzYS4zNDguMzQ4IDAgMCAxLS4yMzItLjA3N0wxMS4xNDUgNi44bC03LjY1IDYuMzc5YS4zNzguMzc4IDAgMCAxLS4yNjUuMDc3LjM2NS4zNjUgMCAwIDEtLjIzMi0uMTIybC0uNjg2LS44MThhLjM2LjM2IDAgMCAxIC4wNDUtLjQ5N2w3Ljk0OC02LjYyMmMuNDY0LS4zODcgMS4yMTYtLjM4NyAxLjY4IDBsMi42OTggMi4yNTVWNS4yOTZhLjM1LjM1IDAgMCAxIC4zNTQtLjM1NGgyLjEyM2EuMzUuMzUgMCAwIDEgLjM1NC4zNTR2NC41MWwyLjQyMSAyLjAxMmEuMzYyLjM2MiAwIDAgMSAuMDQ1LjQ5N3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2hlYXJpbmcnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMS40ODQgOWMwLTEuMzU5IDEuMTcyLTIuNDg0IDIuNTMxLTIuNDg0UzE2LjQ5OSA3LjY0MSAxNi40OTkgOXMtMS4xMjUgMi40ODQtMi40ODQgMi40ODRTMTEuNDg0IDEwLjM1OSAxMS40ODQgOXpNNy42NDEgMi42MjVBOC45NiA4Ljk2IDAgMCAwIDUuMDE2IDlhOC45NiA4Ljk2IDAgMCAwIDIuNjI1IDYuMzc1bC0xLjQwNiAxLjQwNkM0LjI2NiAxNC44MTIgMy4wMDEgMTIuMDQ3IDMuMDAxIDlzMS4yNjYtNS44MTMgMy4yMzQtNy43ODF6bTkuMzc1IDE3LjM5MWMxLjA3OCAwIDEuOTY5LS45MzggMS45NjktMi4wMTZoMi4wMTZhMy45OCAzLjk4IDAgMCAxLTMuOTg0IDMuOTg0Yy0uNTYzIDAtMS4xMjUtLjA5NC0xLjY0MS0uMzI4LTEuMzU5LS43MDMtMi4xNTYtMS43MzQtMi43NjYtMy41NjMtLjMyOC0uOTg0LS44OTEtMS40NTMtMS42ODgtMi4wNjMtLjg5MS0uNjU2LTEuOTY5LTEuNS0yLjg1OS0zLjE0MS0uNzAzLTEuMjY2LTEuMDc4LTIuNjI1LTEuMDc4LTMuODkxIDAtMy45MzggMy4wOTQtNi45ODQgNy4wMzEtNi45ODRTMjEgNS4wNjEgMjEgOC45OThoLTIuMDE2YzAtMi44MTMtMi4xNTYtNS4wMTYtNC45NjktNS4wMTZTOC45OTkgNi4xODUgOC45OTkgOC45OThjMCAuOTM4LjI4MSAyLjAxNi43OTcgMi45NTMuNzAzIDEuMzEzIDEuNTQ3IDEuOTIyIDIuMzQ0IDIuNTMxLjkzOC43MDMgMS44NzUgMS40NTMgMi4zOTEgMyAuNTE2IDEuNS45ODQgMS45NjkgMS42ODggMi4zNDQuMTg4LjA5NC41MTYuMTg4Ljc5Ny4xODh6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdnbG9iZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE2LjM1OSAxNC4wMTZoMy4zNzVjLjE0MS0uNjU2LjI4MS0xLjMxMy4yODEtMi4wMTZzLS4xNDEtMS4zNTktLjI4MS0yLjAxNmgtMy4zNzVjLjA5NC42NTYuMTQxIDEuMzEzLjE0MSAyLjAxNnMtLjA0NyAxLjM1OS0uMTQxIDIuMDE2em0tMS43ODEgNS41MzFhOC4wMDcgOC4wMDcgMCAwIDAgNC4zNTktMy41NjNoLTIuOTUzYTE1LjY3NiAxNS42NzYgMCAwIDEtMS40MDYgMy41NjN6bS0uMjM0LTUuNTMxYy4wOTQtLjY1Ni4xNDEtMS4zMTMuMTQxLTIuMDE2cy0uMDQ3LTEuMzU5LS4xNDEtMi4wMTZIOS42NTZjLS4wOTQuNjU2LS4xNDEgMS4zMTMtLjE0MSAyLjAxNnMuMDQ3IDEuMzU5LjE0MSAyLjAxNmg0LjY4OHpNMTIgMTkuOTY5Yy44NDQtMS4yMTkgMS41LTIuNTMxIDEuOTIyLTMuOTg0aC0zLjg0NGMuNDIyIDEuNDUzIDEuMDc4IDIuNzY2IDEuOTIyIDMuOTg0ek04LjAxNiA4LjAxNmExNS42NzYgMTUuNjc2IDAgMCAxIDEuNDA2LTMuNTYzIDguMDA3IDguMDA3IDAgMCAwLTQuMzU5IDMuNTYzaDIuOTUzem0tMi45NTMgNy45NjhhOC4wMTUgOC4wMTUgMCAwIDAgNC4zNTkgMy41NjMgMTUuNjc2IDE1LjY3NiAwIDAgMS0xLjQwNi0zLjU2M0g1LjA2M3ptLS43OTctMS45NjhoMy4zNzVDNy41NDcgMTMuMzYgNy41IDEyLjcwMyA3LjUgMTJzLjA0Ny0xLjM1OS4xNDEtMi4wMTZINC4yNjZjLS4xNDEuNjU2LS4yODEgMS4zMTMtLjI4MSAyLjAxNnMuMTQxIDEuMzU5LjI4MSAyLjAxNnpNMTIgNC4wMzFjLS44NDQgMS4yMTktMS41IDIuNTMxLTEuOTIyIDMuOTg0aDMuODQ0QzEzLjUgNi41NjIgMTIuODQ0IDUuMjQ5IDEyIDQuMDMxem02LjkzOCAzLjk4NWE4LjAxNSA4LjAxNSAwIDAgMC00LjM1OS0zLjU2MyAxNS42NzYgMTUuNjc2IDAgMCAxIDEuNDA2IDMuNTYzaDIuOTUzem0tNi45MzgtNmM1LjUzMSAwIDkuOTg0IDQuNDUzIDkuOTg0IDkuOTg0UzE3LjUzMSAyMS45ODQgMTIgMjEuOTg0IDIuMDE2IDE3LjUzMSAyLjAxNiAxMiA2LjQ2OSAyLjAxNiAxMiAyLjAxNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2Z1bGxzY3JlZW4nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNC4wMTYgNS4wMTZoNC45Njl2NC45NjloLTEuOTY5di0zaC0zVjUuMDE2em0zIDEydi0zaDEuOTY5djQuOTY5aC00Ljk2OXYtMS45NjloM3ptLTEyLTcuMDMyVjUuMDE1aDQuOTY5djEuOTY5aC0zdjNINS4wMTZ6bTEuOTY4IDQuMDMydjNoM3YxLjk2OUg1LjAxNXYtNC45NjloMS45Njl6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmdWxsc2NyZWVuLWV4aXQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNS45ODQgOC4wMTZoM3YxLjk2OWgtNC45NjlWNS4wMTZoMS45Njl2M3ptLTEuOTY4IDEwLjk2OHYtNC45NjloNC45Njl2MS45NjloLTN2M2gtMS45Njl6bS02LTEwLjk2OHYtM2gxLjk2OXY0Ljk2OUg1LjAxNlY4LjAxNmgzem0tMyA3Ljk2OHYtMS45NjloNC45Njl2NC45NjlIOC4wMTZ2LTNoLTN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb3JtYXQtc3RyaWtldGhyb3VnaCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTMgMTQuNTMxdi0yLjAxNmgxOHYyLjAxNkgzek01LjAxNiA0LjVoMTMuOTY5djNoLTQuOTY5djNIOS45ODV2LTNINS4wMTZ2LTN6bTQuOTY4IDE1di0zaDQuMDMxdjNIOS45ODR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb3JtYXQtc2l6ZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTMgMTJWOWg5djNIOXY2Ljk4NEg2VjEySDN6bTYtOC4wMTZoMTIuOTg0djNoLTQuOTY5djEyaC0zdi0xMkg4Ljk5OXYtM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2Zvcm1hdC1zaGFwZXMnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMC44MDcgMTIuNjgyaDIuMzg3bC0xLjE5My0zLjQ5NXptMi43NyAxLjE1MWgtMy4xOTZsLS42MzkgMS43OUg4LjI1bDMuMTExLTguMTgzaDEuMjc5bDMuMDY4IDguMTgzaC0xLjQ0OXpNMTguMzUgNS42NWgxLjgzM1YzLjgxN0gxOC4zNVY1LjY1em0xLjgzMyAxNC41MzNWMTguMzVIMTguMzV2MS44MzNoMS44MzN6TTE2LjU2IDE4LjM1di0xLjc5aDEuNzlWNy40NGgtMS43OVY1LjY1SDcuNDR2MS43OUg1LjY1djkuMTJoMS43OXYxLjc5aDkuMTJ6TTUuNjUgMjAuMTgzVjE4LjM1SDMuODE3djEuODMzSDUuNjV6TTMuODE3IDMuODE3VjUuNjVINS42NVYzLjgxN0gzLjgxN3pNMjIuMDE1IDcuNDRoLTEuODMzdjkuMTJoMS44MzN2NS40NTVIMTYuNTZ2LTEuODMzSDcuNDR2MS44MzNIMS45ODVWMTYuNTZoMS44MzNWNy40NEgxLjk4NVYxLjk4NUg3LjQ0djEuODMzaDkuMTJWMS45ODVoNS40NTVWNy40NHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2Zvcm1hdC1xdW90ZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE0LjAxNiAxNy4wMTZsMS45NjktNC4wMzFoLTN2LTZoNnY2bC0xLjk2OSA0LjAzMWgtM3ptLTguMDE2IDBsMi4wMTYtNC4wMzFoLTN2LTZoNnY2TDkgMTcuMDE2SDZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb3JtYXQtcGFpbnQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOCAzLjk4NGgzVjEyaC04LjAxNnY5YS45Ni45NiAwIDAgMS0uOTg0Ljk4NEg5Ljk4NEEuOTYuOTYgMCAwIDEgOSAyMVY5Ljk4NGg5Ljk4NFY2SDE4di45ODRjMCAuNTYzLS40MjIgMS4wMzEtLjk4NCAxLjAzMWgtMTJhMS4wNCAxLjA0IDAgMCAxLTEuMDMxLTEuMDMxVjNjMC0uNTYzLjQ2OS0uOTg0IDEuMDMxLS45ODRoMTJBLjk2Ljk2IDAgMCAxIDE4IDN2Ljk4NHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2Zvcm1hdC1saXN0LW51bWJlcmVkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNi45ODQgMTIuOTg0di0xLjk2OUgyMXYxLjk2OUg2Ljk4NHptMCA2di0xLjk2OUgyMXYxLjk2OUg2Ljk4NHptMC0xMy45NjhIMjF2MS45NjlINi45ODRWNS4wMTZ6bS00Ljk2OCA2VjkuOTg1aDN2LjkzOGwtMS44MjggMi4wNjNoMS44Mjh2MS4wMzFoLTN2LS45MzhsMS43ODEtMi4wNjNIMi4wMTZ6bS45ODQtM3YtM2gtLjk4NFYzLjk4NWgxLjk2OXY0LjAzMWgtLjk4NHptLS45ODQgOXYtMS4wMzFoM3Y0LjAzMWgtM3YtMS4wMzFoMS45Njl2LS40NjloLS45ODR2LTEuMDMxaC45ODR2LS40NjlIMi4wMTZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb3JtYXQtbGlzdC1idWxsZXRlZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTYuOTg0IDUuMDE2SDIxdjEuOTY5SDYuOTg0VjUuMDE2em0wIDcuOTY4di0xLjk2OUgyMXYxLjk2OUg2Ljk4NHptMCA2di0xLjk2OUgyMXYxLjk2OUg2Ljk4NHptLTMtMi40ODRjLjg0NCAwIDEuNS43MDMgMS41IDEuNXMtLjcwMyAxLjUtMS41IDEuNS0xLjUtLjcwMy0xLjUtMS41LjY1Ni0xLjUgMS41LTEuNXptMC0xMmMuODQ0IDAgMS41LjY1NiAxLjUgMS41cy0uNjU2IDEuNS0xLjUgMS41LTEuNS0uNjU2LTEuNS0xLjUuNjU2LTEuNSAxLjUtMS41em0wIDZjLjg0NCAwIDEuNS42NTYgMS41IDEuNXMtLjY1NiAxLjUtMS41IDEuNS0xLjUtLjY1Ni0xLjUtMS41LjY1Ni0xLjUgMS41LTEuNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2Zvcm1hdC1saW5lLXNwYWNpbmcnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk05Ljk4NCAxMi45ODR2LTEuOTY5aDEydjEuOTY5aC0xMnptMCA2di0xLjk2OWgxMnYxLjk2OWgtMTJ6bTAtMTMuOTY4aDEydjEuOTY5aC0xMlY1LjAxNnpNNiA2Ljk4NHYxMC4wMzFoMi40ODRsLTMuNDY5IDMuNDY5LTMuNTE2LTMuNDY5aDIuNDg0VjYuOTg0SDEuNDk5bDMuNTE2LTMuNDY5IDMuNDY5IDMuNDY5SDZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb3JtYXQtaXRhbGljJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNOS45ODQgMy45ODRIMTh2M2gtMi44MTNMMTEuODEyIDE1aDIuMjAzdjNINS45OTl2LTNoMi44MTNsMy4zNzUtOC4wMTZIOS45ODR2LTN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb3JtYXQtaW5kZW50LWluY3JlYXNlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTEuMDE2IDEyLjk4NHYtMS45NjlIMjF2MS45NjloLTkuOTg0em0wLTMuOTg0VjYuOTg0SDIxVjloLTkuOTg0ek0zIDNoMTh2Mi4wMTZIM1Yzem04LjAxNiAxNC4wMTZWMTVIMjF2Mi4wMTZoLTkuOTg0ek0zIDguMDE2TDYuOTg0IDEyIDMgMTUuOTg0VjguMDE1ek0zIDIxdi0yLjAxNmgxOFYyMUgzelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZm9ybWF0LWluZGVudC1kZWNyZWFzZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTExLjAxNiAxMi45ODR2LTEuOTY5SDIxdjEuOTY5aC05Ljk4NHptMC0zLjk4NFY2Ljk4NEgyMVY5aC05Ljk4NHpNMyAzaDE4djIuMDE2SDNWM3ptMCAxOHYtMi4wMTZoMThWMjFIM3ptMC05bDMuOTg0LTMuOTg0djcuOTY5em04LjAxNiA1LjAxNlYxNUgyMXYyLjAxNmgtOS45ODR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb3JtYXQtZm9udCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIxLjUxNiA5djNoLTN2Ni45ODRoLTNWMTJoLTNWOWg5ek0yLjQ4NCAzLjk4NGgxMy4wMzF2M2gtNS4wMTZ2MTJoLTN2LTEySDIuNDgzdi0zelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZm9ybWF0LWNvbG9yLXRleHQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk05LjYwOSAxMmg0Ljc4MWwtMi4zOTEtNi4zMjh6bTEuNDA3LTloMS45NjlsNS40ODQgMTQuMDE2aC0yLjI1bC0xLjA3OC0zSDguODZsLTEuMTI1IDNoLTIuMjV6TTAgMjAuMDE2aDI0VjI0SDB2LTMuOTg0elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZm9ybWF0LWNvbG9yLXJlc2V0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNS4yNSA1LjI1bDE0LjYyNSAxNC42MjUtMS4yNjYgMS4yNjYtMi42NzItMi42MjVjLTEuMDc4LjkzOC0yLjQzOCAxLjUtMy45MzggMS41LTMuMzI4IDAtNi0yLjY3Mi02LTYgMC0xLjIxOS41NjMtMi42NzIgMS4zMTMtNC4xMjVMMy45ODQgNi41NjN6TTE4IDE0LjAxNmMwIC40NjktLjA0Ny44OTEtLjE0MSAxLjMxM0w5LjI4MSA2LjcwNEMxMC42ODcgNC42ODggMTIgMy4xODggMTIgMy4xODhzNiA2Ljg0NCA2IDEwLjgyOHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2Zvcm1hdC1jb2xvci1maWxsJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMCAyMC4wMTZoMjRWMjRIMHYtMy45ODR6bTE4Ljk4NC04LjUzMlMyMSAxMy42ODcgMjEgMTVjMCAxLjA3OC0uOTM4IDIuMDE2LTIuMDE2IDIuMDE2cy0xLjk2OS0uOTM4LTEuOTY5LTIuMDE2YzAtMS4zMTMgMS45NjktMy41MTYgMS45NjktMy41MTZ6bS0xMy43ODEtMS41aDkuNjA5TDkuOTg0IDUuMjAzem0xMS4zNDQtMS4wMzFjLjYwOS42MDkuNjA5IDEuNTQ3IDAgMi4xMDlsLTUuNDg0IDUuNDg0Yy0uMjgxLjI4MS0uNzAzLjQ2OS0xLjA3OC40NjlzLS43NS0uMTg4LTEuMDMxLS40NjlsLTUuNTMxLTUuNDg0Yy0uNjA5LS41NjMtLjYwOS0xLjUgMC0yLjEwOWw1LjE1Ni01LjE1Ni0yLjM5MS0yLjM5MUw3LjY0MSAwelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZm9ybWF0LWNsZWFyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNiA1LjAxNmgxNC4wMTZ2M2gtNS44MTNsLTEuNTk0IDMuNzVMMTAuNSA5LjcwM2wuNzAzLTEuNjg4SDguODEyTDUuOTk5IDUuMjAydi0uMTg4em0tMi43MTkgMGwuMjgxLjIzNEwxOCAxOS43MzQgMTYuNzM0IDIxbC01LjY3Mi01LjY3Mi0xLjU0NyAzLjY1NmgtM2wyLjQzOC01Ljc2NkwyLjAxNSA2LjI4elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZm9ybWF0LWJvbGQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMy41IDE1LjUxNmMuODQ0IDAgMS41LS42NTYgMS41LTEuNXMtLjY1Ni0xLjUtMS41LTEuNUg5Ljk4NHYzSDEzLjV6bS0zLjUxNi05djNoM2MuODQ0IDAgMS41LS42NTYgMS41LTEuNXMtLjY1Ni0xLjUtMS41LTEuNWgtM3ptNS42MjUgNC4yNjVjMS4zMTMuNjA5IDIuMTU2IDEuOTIyIDIuMTU2IDMuNDIyIDAgMi4xMDktMS41OTQgMy43OTctMy43MDMgMy43OTdINi45ODRWMy45ODRoNi4yODFjMi4yNSAwIDMuOTg0IDEuNzgxIDMuOTg0IDQuMDMxIDAgMS4wMzEtLjY1NiAyLjEwOS0xLjY0MSAyLjc2NnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2Zvcm1hdC1hbGlnbi1yaWdodCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTMgM2gxOHYyLjAxNkgzVjN6bTYgNlY2Ljk4NGgxMlY5SDl6bS02IDMuOTg0di0xLjk2OWgxOHYxLjk2OUgzem02IDQuMDMyVjE1aDEydjIuMDE2SDl6TTMgMjF2LTIuMDE2aDE4VjIxSDN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb3JtYXQtYWxpZ24tbGVmdCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTMgM2gxOHYyLjAxNkgzVjN6bTAgMTh2LTIuMDE2aDE4VjIxSDN6bTAtOC4wMTZ2LTEuOTY5aDE4djEuOTY5SDN6bTEyLTZWOUgzVjYuOTg0aDEyek0xNSAxNXYyLjAxNkgzVjE1aDEyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZm9ybWF0LWFsaWduLWp1c3RpZnknLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0zIDNoMTh2Mi4wMTZIM1Yzem0wIDZWNi45ODRoMThWOUgzem0wIDMuOTg0di0xLjk2OWgxOHYxLjk2OUgzem0wIDQuMDMyVjE1aDE4djIuMDE2SDN6TTMgMjF2LTIuMDE2aDE4VjIxSDN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb3JtYXQtYWxpZ24tY2VudGVyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMyAzaDE4djIuMDE2SDNWM3ptMy45ODQgMy45ODRoMTAuMDMxVjlINi45ODRWNi45ODR6bS0zLjk4NCA2di0xLjk2OWgxOHYxLjk2OUgzek0zIDIxdi0yLjAxNmgxOFYyMUgzem0zLjk4NC02aDEwLjAzMXYyLjAxNkg2Ljk4NFYxNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZvbGRlcnMnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk04LjQwNiA0LjAxNmwxLjk1OSAxLjk5MWg1LjU4N2MxLjYwOS0uMDA2IDIuMDgxLjk2MyAyLjA4MSAyLjI3NXY1Ljc1OWMtLjAzNCAxLjE0Ny0uOTQxIDEuODk3LTIuMDgxIDEuOTI4SDMuOTk5Yy0xLjI1IDAtMS45ODQtLjU5NC0xLjk4NC0xLjYxNnYtOC43NWMwLS44NjYuNzE2LTEuNTg0IDEuNTc4LTEuNTg0aDQuODEyelwiPjwvcGF0aD48cGF0aCBkPVwiTTUuOTM3IDE5Ljk2OWgxNC4wNjJjMS4xMDMgMCAyLS44OTcgMi0yVjkuOTgxYTEuOTUgMS45NSAwIDAgMC0xLjk1LTEuOTVoLS4wNXY5LjkzOEgzLjkzN2MwIDEuMTAzLjg5NyAyIDIgMnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZvbGRlcicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTkuOTg0IDMuOTg0TDEyIDZoOC4wMTZjMS4wNzggMCAxLjk2OS45MzggMS45NjkgMi4wMTZWMThjMCAxLjA3OC0uODkxIDIuMDE2LTEuOTY5IDIuMDE2SDMuOTg1Yy0xLjA3OCAwLTEuOTY5LS45MzgtMS45NjktMi4wMTZWNmMwLTEuMDc4Ljg5MS0yLjAxNiAxLjk2OS0yLjAxNmg2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZm9sZGVyLXppcCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIwIDYuNWgtOGwtMS40NDctMS44OTVBMi4wMDIgMi4wMDIgMCAwIDAgOC43NjQgMy41SDNhMSAxIDAgMCAwLTEgMXYxNGEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJ2LTEwYTIgMiAwIDAgMC0yLTJ6bS0xIDZoLTJ2MmgydjJoLTJ2MmgtMnYtMmgydi0yaC0ydi0yaDJ2LTJoLTJ2LTJoMnYyaDJ2MnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZvbGRlci12aWV3JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTQgMTNhMi41IDIuNSAwIDEgMS01IDAgMi41IDIuNSAwIDAgMSA1IDB6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMjAgNi41aC04bC0xLjQ0Ny0xLjg5NUEyLjAwMiAyLjAwMiAwIDAgMCA4Ljc2NCAzLjVIM2ExIDEgMCAwIDAtMSAxdjE0YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMnYtMTBhMiAyIDAgMCAwLTItMnptLTMuMjI3IDExLjc3MmMtLjMzMi4zMzEtLjc3MS41MTMtMS4yMzguNTEzcy0uOTA2LS4xODItMS4yMzctLjUxMmwtMS4xMDgtMS4xMDlhNC40NSA0LjQ1IDAgMCAxLTEuNjkuMzM2QTQuNTA1IDQuNTA1IDAgMCAxIDcgMTNjMC0yLjQ4MSAyLjAxOS00LjUgNC41LTQuNVMxNiAxMC41MTkgMTYgMTNjMCAuNTk4LS4xMjMgMS4xNjctLjMzNSAxLjY4OWwxLjEwOCAxLjEwOWExLjc1MiAxLjc1MiAwIDAgMSAwIDIuNDc0elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZm9sZGVyLXZpZGVvJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjAgNi41aC04bC0xLjQ0Ny0xLjg5NUEyLjAwMiAyLjAwMiAwIDAgMCA4Ljc2NCAzLjVIM2ExIDEgMCAwIDAtMSAxdjE0YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMnYtMTBhMiAyIDAgMCAwLTItMnptLTEwIDExdi04bDYgNC02IDR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb2xkZXItdXBsb2FkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjAgNi41aC04bC0xLjQ0Ny0xLjg5NUEyLjAwMiAyLjAwMiAwIDAgMCA4Ljc2NCAzLjVIM2ExIDEgMCAwIDAtMSAxdjE0YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMnYtMTBhMiAyIDAgMCAwLTItMnptLTcgNnY1aC0ydi01SDhsNC00IDQgNGgtM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZvbGRlci1zcGVjaWFsJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTcuOTUzIDE3LjAxNmwtLjc5Ny0zLjMyOCAyLjU3OC0yLjI1LTMuMzc1LS4yODFMMTUgOC4wMTZsLTEuMzU5IDMuMTQxLTMuMzc1LjI4MSAyLjU3OCAyLjI1LS43OTcgMy4zMjhMMTUgMTUuMjgyek0yMC4wMTYgNmMxLjA3OCAwIDEuOTY5LjkzOCAxLjk2OSAyLjAxNlYxOGMwIDEuMDc4LS44OTEgMi4wMTYtMS45NjkgMi4wMTZIMy45ODVjLTEuMDc4IDAtMS45NjktLjkzOC0xLjk2OS0yLjAxNlY2YzAtMS4wNzguODkxLTIuMDE2IDEuOTY5LTIuMDE2aDZMMTIuMDAxIDZoOC4wMTZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb2xkZXItc2hhcmVkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTguOTg0IDE3LjAxNnYtMS4wMzFjMC0xLjMxMy0yLjY3Mi0xLjk2OS0zLjk4NC0xLjk2OXMtMy45ODQuNjU2LTMuOTg0IDEuOTY5djEuMDMxaDcuOTY5ek0xNSA5Yy0xLjA3OCAwLTIuMDE2LjkzOC0yLjAxNiAyLjAxNnMuOTM4IDEuOTY5IDIuMDE2IDEuOTY5IDIuMDE2LS44OTEgMi4wMTYtMS45NjlTMTYuMDc4IDkgMTUgOXptNS4wMTYtM2MxLjA3OCAwIDEuOTY5LjkzOCAxLjk2OSAyLjAxNlYxOGMwIDEuMDc4LS44OTEgMi4wMTYtMS45NjkgMi4wMTZIMy45ODVjLTEuMDc4IDAtMS45NjktLjkzOC0xLjk2OS0yLjAxNlY2YzAtMS4wNzguODkxLTIuMDE2IDEuOTY5LTIuMDE2aDZMMTIuMDAxIDZoOC4wMTZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb2xkZXItc2V0dGluZ3MnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNCAxMy41YTIgMiAwIDEgMS0zLjk5OS4wMDFBMiAyIDAgMCAxIDE0IDEzLjV6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMjAgNi41aC04bC0xLjQ0Ny0xLjg5NUEyLjAwMiAyLjAwMiAwIDAgMCA4Ljc2NCAzLjVIM2ExIDEgMCAwIDAtMSAxdjE0YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMnYtMTBhMiAyIDAgMCAwLTItMnptLTMgNy45MDloLTEuNDkyYTMuNjA4IDMuNjA4IDAgMCAxLS4zNTguODc3bC45NDEuOTQxLTEuMzYzIDEuMzYzLS45NDItLjk0YTMuNTgyIDMuNTgyIDAgMCAxLS44NzYuMzU3VjE4LjVoLTEuODE4di0xLjQ5MmEzLjU4MiAzLjU4MiAwIDAgMS0uODc2LS4zNTdsLS45NDIuOTQtMS4zNjMtMS4zNjMuOTQxLS45NDFhMy42MDggMy42MDggMCAwIDEtLjM1OC0uODc3SDd2LTEuODE4aDEuNDkyYy4wODEtLjMxMi4yMDMtLjYwNC4zNTgtLjg3NmwtLjk0MS0uOTQyIDEuMzYzLTEuMzYzLjk0Mi45NDFjLjI3Mi0uMTU2LjU2NC0uMjc3Ljg3Ni0uMzU4VjguNWgxLjgxOHYxLjQ5MmMuMzEyLjA4MS42MDQuMjAyLjg3Ni4zNThsLjk0Mi0uOTQxIDEuMzYzIDEuMzYzLS45NDEuOTQyYy4xNTUuMjcyLjI3Ny41NjQuMzU4Ljg3NkgxN3YxLjgxOXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZvbGRlci1yZWZyZXNoJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjAgNi41aC04bC0xLjQ0Ny0xLjg5NUEyLjAwMiAyLjAwMiAwIDAgMCA4Ljc2NCAzLjVIM2ExIDEgMCAwIDAtMSAxdjE0YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMnYtMTBhMiAyIDAgMCAwLTItMnptLTggMTJhNC45NjYgNC45NjYgMCAwIDEtMy4zNTUtMS4zMTZMNyAxOC41di00aDVsLTEuNzY3IDEuNDE0QTIuOTU0IDIuOTU0IDAgMCAwIDEyIDE2LjVhMi45OTYgMi45OTYgMCAwIDAgMi44MTYtMmgyLjA4M2E1LjAwOSA1LjAwOSAwIDAgMS00Ljg5OSA0em01LTZoLTVsMS43NjctMS40MTRBMi45NTQgMi45NTQgMCAwIDAgMTIgMTAuNWEyLjk5NiAyLjk5NiAwIDAgMC0yLjgxNiAySDcuMTAxQTUuMDA5IDUuMDA5IDAgMCAxIDEyIDguNWMxLjI5NSAwIDIuNDY2LjUwNiAzLjM1NSAxLjMxNkwxNyA4LjV2NHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZvbGRlci1uZXR3b3JrJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjAgNWgtOGwtMS40NDctMS44OTVBMi4wMDIgMi4wMDIgMCAwIDAgOC43NjQgMkgzYTEgMSAwIDAgMC0xIDF2MTJhMiAyIDAgMCAwIDIgMmg3djNIOHYyaDh2LTJoLTN2LTNoN2EyIDIgMCAwIDAgMi0yVjdhMiAyIDAgMCAwLTItMnpcIj48L3BhdGg+PHBhdGggZD1cIk0yMCAyMWExIDEgMCAxIDEtMiAwIDEgMSAwIDAgMSAyIDB6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNiAyMWExIDEgMCAxIDEtMiAwIDEgMSAwIDAgMSAyIDB6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb2xkZXItbG9jaycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDEwLjg2OWMtLjU1MSAwLTEgLjQ0OS0xIDFWMTMuNWgydi0xLjYzMWMwLS41NTEtLjQ0OS0xLTEtMXpcIj48L3BhdGg+PHBhdGggZD1cIk0yMCA2LjVoLThsLTEuNDQ3LTEuODk1QTIuMDAyIDIuMDAyIDAgMCAwIDguNzY0IDMuNUgzYTEgMSAwIDAgMC0xIDF2MTRhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0ydi0xMGEyIDIgMCAwIDAtMi0yem0tNCAxMkg4di01aDF2LTEuNjMxYzAtMS42NTQgMS4zNDYtMyAzLTNzMyAxLjM0NiAzIDNWMTMuNWgxdjV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb2xkZXItaW1hZ2UnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yMCA2LjVoLThsLTEuNDQ3LTEuODk1QTIuMDAyIDIuMDAyIDAgMCAwIDguNzY0IDMuNUgzYTEgMSAwIDAgMC0xIDF2MTRhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0ydi0xMGEyIDIgMCAwIDAtMi0yem0tMTQgMTFsMi40NzktMy45NzcgMS41MjcgMi40NTEgMy41MjItNS42NDdMMTggMTcuNUg2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZm9sZGVyLWhvbWUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yMCA2LjVoLThsLTEuNDQ3LTEuODk1QTIuMDAyIDIuMDAyIDAgMCAwIDguNzY0IDMuNUgzYTEgMSAwIDAgMC0xIDF2MTRhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0ydi0xMGEyIDIgMCAwIDAtMi0yem0tNSA2djVoLTJ2LTNoLTJ2M0g5di01SDdsNS00IDUgNGgtMnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZvbGRlci1mYXZvcml0ZS1zdGFyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjAgNi41aC04bC0xLjQ0Ny0xLjg5NUEyLjAwMiAyLjAwMiAwIDAgMCA4Ljc2NCAzLjVIM2ExIDEgMCAwIDAtMSAxdjE0YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMnYtMTBhMiAyIDAgMCAwLTItMnptLTQuNSAxMkwxMiAxNi4wMDIgOC41IDE4LjVsMS41LTQuMDAzTDcgMTIuNWgzLjVsMS41MDctNCAxLjQ5MyA0SDE3bC0zIDEuOTk3IDEuNSA0LjAwM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZvbGRlci1jaGVjaycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIwIDYuNWgtOGwtMS40NDctMS44OTVBMi4wMDIgMi4wMDIgMCAwIDAgOC43NjQgMy41SDNhMSAxIDAgMCAwLTEgMXYxNGEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJ2LTEwYTIgMiAwIDAgMC0yLTJ6bS05IDEwLjQxNGwtMy43MDctMy43MDcgMS40MTQtMS40MTRMMTEgMTQuMDg2bDQuMjkzLTQuMjkzIDEuNDE0IDEuNDE0TDExIDE2LjkxNHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZvbGRlci1ib29rbWFyaycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIwIDYuNWgtOGwtMS40NDctMS44OTVBMi4wMDIgMi4wMDIgMCAwIDAgOC43NjQgMy41SDNhMSAxIDAgMCAwLTEgMXYxNGEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJ2LTEwYTIgMiAwIDAgMC0yLTJ6bS0xMiA4bC0yLTItMiAydi05aDR2OXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZvbGRlci1ibG9jaycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEwLjMwMiAxNi4yNThBMy4yMTMgMy4yMTMgMCAwIDAgMTIgMTYuNzVhMy4yNTQgMy4yNTQgMCAwIDAgMy4yNS0zLjI1YzAtLjYyNC0uMTg2LTEuMjAxLS40OTItMS42OTdsLTQuNDU2IDQuNDU1elwiPjwvcGF0aD48cGF0aCBkPVwiTTEyIDEwLjI1YTMuMjU0IDMuMjU0IDAgMCAwLTMuMjUgMy4yNWMwIC42MjQuMTg2IDEuMjAyLjQ5MiAxLjY5N2w0LjQ1Ni00LjQ1NUEzLjIyMiAzLjIyMiAwIDAgMCAxMiAxMC4yNXpcIj48L3BhdGg+PHBhdGggZD1cIk0yMCA2LjVoLThsLTEuNDQ3LTEuODk1QTIuMDAyIDIuMDAyIDAgMCAwIDguNzY0IDMuNUgzYTEgMSAwIDAgMC0xIDF2MTRhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0ydi0xMGEyIDIgMCAwIDAtMi0yem0tOCAxMS43NWMtMi42MTkgMC00Ljc1LTIuMTMxLTQuNzUtNC43NVM5LjM4MSA4Ljc1IDEyIDguNzVzNC43NSAyLjEzMSA0Ljc1IDQuNzUtMi4xMzEgNC43NS00Ljc1IDQuNzV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmb2xkZXItYXVkaW8nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yMCA2LjVoLThsLTEuNDQ3LTEuODk1QTIuMDAyIDIuMDAyIDAgMCAwIDguNzY0IDMuNUgzYTEgMSAwIDAgMC0xIDF2MTRhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0ydi0xMGEyIDIgMCAwIDAtMi0yek0xNSAxNWExLjUgMS41IDAgMSAxLTEuNS0xLjV2LTIuNzcxbC0zLjUgMS4xNFYxNmExLjUgMS41IDAgMSAxLTEuNS0xLjV2LTMuMTc1YS43NS43NSAwIDAgMSAuNTE4LS43MTNsNS0xLjYzYy4yMjctLjA3NS40NzktLjAzNS42NzMuMTA1cy4zMDkuMzY4LjMwOS42MDhWMTV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmbGFnJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTMuOTg1IDUuMTI2aDUuOTU2djEwLjU3MWgtNy40NDRsLS4zOTctMi4wODRINi4xNDR2Ny4zOTVINC4wNlYyLjk5Mmg5LjUyOXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZpcnN0LXBhZ2UnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0zIDIuOTk0aDIuOTY2VjIxSDNWMi45OTR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMjEuMDY2IDE4Ljg5MUwxOC45NTcgMjFsLTktOSA5LTkgMi4xMDkgMi4xMDlMMTQuMTc1IDEyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnRmluZ2VycHJpbnQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNy44MSA0LjQ3Yy0uMDggMC0uMTYtLjAyLS4yMy0uMDZDMTUuNjYgMy40MiAxNCAzIDEyLjAxIDNjLTEuOTggMC0zLjg2LjQ3LTUuNTcgMS40MS0uMjQuMTMtLjU0LjA0LS42OC0uMmEuNTA2LjUwNiAwIDAgMSAuMi0uNjhDNy44MiAyLjUyIDkuODYgMiAxMi4wMSAyYzIuMTMgMCAzLjk5LjQ3IDYuMDMgMS41Mi4yNS4xMy4zNC40My4yMS42N2EuNDkuNDkgMCAwIDEtLjQ0LjI4ek0zLjUgOS43MmEuNDk5LjQ5OSAwIDAgMS0uNDEtLjc5Yy45OS0xLjQgMi4yNS0yLjUgMy43NS0zLjI3QzkuOTggNC4wNCAxNCA0LjAzIDE3LjE1IDUuNjVjMS41Ljc3IDIuNzYgMS44NiAzLjc1IDMuMjUuMTYuMjIuMTEuNTQtLjEyLjdzLS41NC4xMS0uNy0uMTJhOS4zODggOS4zODggMCAwIDAtMy4zOS0yLjk0Yy0yLjg3LTEuNDctNi41NC0xLjQ3LTkuNC4wMS0xLjM2LjctMi41IDEuNy0zLjQgMi45Ni0uMDguMTQtLjIzLjIxLS4zOS4yMXptNi4yNSAxMi4wN2EuNDcuNDcgMCAwIDEtLjM1LS4xNWMtLjg3LS44Ny0xLjM0LTEuNDMtMi4wMS0yLjY0LS42OS0xLjIzLTEuMDUtMi43My0xLjA1LTQuMzQgMC0yLjk3IDIuNTQtNS4zOSA1LjY2LTUuMzlzNS42NiAyLjQyIDUuNjYgNS4zOWMwIC4yOC0uMjIuNS0uNS41cy0uNS0uMjItLjUtLjVjMC0yLjQyLTIuMDktNC4zOS00LjY2LTQuMzlzLTQuNjYgMS45Ny00LjY2IDQuMzljMCAxLjQ0LjMyIDIuNzcuOTMgMy44NS42NCAxLjE1IDEuMDggMS42NCAxLjg1IDIuNDIuMTkuMi4xOS41MSAwIC43MS0uMTEuMS0uMjQuMTUtLjM3LjE1em03LjE3LTEuODVjLTEuMTkgMC0yLjI0LS4zLTMuMS0uODktMS40OS0xLjAxLTIuMzgtMi42NS0yLjM4LTQuMzkgMC0uMjguMjItLjUuNS0uNXMuNS4yMi41LjVjMCAxLjQxLjcyIDIuNzQgMS45NCAzLjU2LjcxLjQ4IDEuNTQuNzEgMi41NC43MS4yNCAwIC42NC0uMDMgMS4wNC0uMS4yNy0uMDUuNTMuMTMuNTguNDEuMDUuMjctLjEzLjUzLS40MS41OC0uNTcuMTEtMS4wNy4xMi0xLjIxLjEyek0xNC45MSAyMmMtLjA0IDAtLjA5LS4wMS0uMTMtLjAyLTEuNTktLjQ0LTIuNjMtMS4wMy0zLjcyLTIuMWE3LjI5NyA3LjI5NyAwIDAgMS0yLjE3LTUuMjJjMC0xLjYyIDEuMzgtMi45NCAzLjA4LTIuOTRzMy4wOCAxLjMyIDMuMDggMi45NGMwIDEuMDcuOTMgMS45NCAyLjA4IDEuOTRzMi4wOC0uODcgMi4wOC0xLjk0YzAtMy43Ny0zLjI1LTYuODMtNy4yNS02LjgzLTIuODQgMC01LjQ0IDEuNTgtNi42MSA0LjAzLS4zOS44MS0uNTkgMS43Ni0uNTkgMi44IDAgLjc4LjA3IDIuMDEuNjcgMy42MS4xLjI2LS4wMy41NS0uMjkuNjQtLjI2LjEtLjU1LS4wNC0uNjQtLjI5YTExLjE0IDExLjE0IDAgMCAxLS43My0zLjk2YzAtMS4yLjIzLTIuMjkuNjgtMy4yNCAxLjMzLTIuNzkgNC4yOC00LjYgNy41MS00LjYgNC41NSAwIDguMjUgMy41MSA4LjI1IDcuODMgMCAxLjYyLTEuMzggMi45NC0zLjA4IDIuOTRzLTMuMDgtMS4zMi0zLjA4LTIuOTRjMC0xLjA3LS45My0xLjk0LTIuMDgtMS45NHMtMi4wOC44Ny0yLjA4IDEuOTRjMCAxLjcxLjY2IDMuMzEgMS44NyA0LjUxLjk1Ljk0IDEuODYgMS40NiAzLjI3IDEuODUuMjcuMDcuNDIuMzUuMzUuNjEtLjA1LjIzLS4yNi4zOC0uNDcuMzh6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAxOSxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmaWx0ZXInLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxOVwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAxOSAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNi44OCA0Ljk4NGEuNjY1LjY2NSAwIDAgMS0uMTQ4LjczOWwtNS4yMDIgNS4yMDJ2Ny44MjlhLjY4MS42ODEgMCAwIDEtLjQxMi42MjIuNzc0Ljc3NCAwIDAgMS0uMjY0LjA1Mi42MjYuNjI2IDAgMCAxLS40NzUtLjIwMWwtMi43MDItMi43MDJhLjY3My42NzMgMCAwIDEtLjIwMS0uNDc1di01LjEyOUwyLjI3NCA1LjcxOWEuNjY0LjY2NCAwIDAgMS0uMTQ4LS43MzkuNjg1LjY4NSAwIDAgMSAuNjIyLS40MTJoMTMuNTA3Yy4yNzUgMCAuNTE3LjE2OS42MjIuNDEyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZXMnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMi44IDIuMDMxSDYuMDYyQTEuODIxIDEuODIxIDAgMCAwIDQuMjQzIDMuODV2MTIuMzIyYzAgMS4wMDMuODE2IDEuODE5IDEuODE5IDEuODE5aDkuMDkxYTEuODIxIDEuODIxIDAgMCAwIDEuODE5LTEuODE5VjYuMjAzTDEyLjggMi4wMzF6bS0xLjI4NCA1LjQ1M1YyLjk0bDQuNTQ3IDQuNTQ0aC00LjU0N3pcIj48L3BhdGg+PHBhdGggZD1cIk0xOS4wMzEgMjAuMDI1SDYuMDU5YzAgMS4wMDMuODEzIDEuOTQ0IDEuODE5IDEuOTQ0aDExLjI3OGExLjgyIDEuODIgMCAwIDAgMS44MTktMS44MTlWOC44MTNjMC0uOTU5LS43NzgtMS43NDEtMS43NDEtMS43NDFoLS4yMDN2MTIuOTUzelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZXMtbGlicmFyeScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTExLjUxIDJINS4zMzNjLS45MTkgMC0xLjY2Ny43NDctMS42NjcgMS42Njd2MTEuNjY3YzAgLjkxOS43NDcgMS42NjcgMS42NjcgMS42NjdoOC4zMzNjLjkxOSAwIDEuNjY3LS43NDcgMS42NjctMS42Njd2LTkuNTFMMTEuNTEgMi4wMDF6bS0xLjE3NyA1VjIuODMzTDE0LjUgN2gtNC4xNjd6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTYuMTY3IDE3LjgzM2gtMTBWMTkuNWgxMGMuOTE5IDAgMS42NjctLjc0NyAxLjY2Ny0xLjY2N1Y0LjVoLTEuNjY3djEzLjMzM3pcIj48L3BhdGg+PHBhdGggZD1cIk0xOC42NjcgMjAuMzMzaC0xMFYyMmgxMGMuOTE5IDAgMS42NjctLjc0NyAxLjY2Ny0xLjY2N1Y3aC0xLjY2N3YxMy4zMzN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmaWxlcy1sYW5kc2NhcGUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNS4wMzMgNEg0YTEuNzggMS43OCAwIDAgMC0xLjc3OCAxLjc3OHY4Ljg4OUExLjc4IDEuNzggMCAwIDAgNCAxNi40NDVoMTIuNDQ0YTEuNzggMS43OCAwIDAgMCAxLjc3OC0xLjc3OFY3LjE4OUwxNS4wMzMgNHptLTEuMjU1IDQuNDQ0VjQuODg4bDMuNTU2IDMuNTU2aC0zLjU1NnpcIj48L3BhdGg+PHBhdGggZD1cIk0yMCAxOC4yMjJINi42NjdWMjBIMjBhMS43OCAxLjc4IDAgMCAwIDEuNzc4LTEuNzc4VjYuNjY2SDIwdjExLjU1NnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZpbGVzLWNvbXBhcmUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOS4wMTIgNC41aC02LjE3OHYxNWg3LjVhMS42NyAxLjY3IDAgMCAwIDEuNjY3LTEuNjY3VjcuNDg4TDE5LjAxMyA0LjV6TTE3IDkuNVY1LjMzM0wyMS4xNjcgOS41SDE3elwiPjwvcGF0aD48cGF0aCBkPVwiTTExLjE2NyA0LjVINC45ODlMMi4wMDEgNy40ODh2MTAuMzQ1QTEuNjcgMS42NyAwIDAgMCAzLjY2OCAxOS41aDcuNXYtMTV6TTcgOS41SDIuODMzTDcgNS4zMzNWOS41elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZXMtY29kaW5nJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTYuMDEzIDJINS42MzdhMS44MTkgMS44MTkgMCAwIDAtMS44MTggMS44MTh2MTYuMzY0YzAgMS4wMDQuODE1IDEuODE4IDEuODE4IDEuODE4aDEyLjcyN2ExLjgxOSAxLjgxOSAwIDAgMCAxLjgxOC0xLjgxOFY2LjE2OUwxNi4wMTMgMnptLTUuMTg4IDE0LjgxNUw5LjU0IDE4LjFsLTMuMzctMy4zNyAzLjM3LTMuMzcgMS4yODUgMS4yODVMOC43NCAxNC43M2wyLjA4NSAyLjA4NXptMy42MzYgMS4yODVsLTEuMjg1LTEuMjg1IDIuMDg1LTIuMDg1LTIuMDg1LTIuMDg1IDEuMjg1LTEuMjg1IDMuMzcgMy4zNy0zLjM3IDMuMzd6bS4yNjYtMTAuNjQ1VjIuOTFsNC41NDUgNC41NDVoLTQuNTQ1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZXMtMicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTkuNSAyaC01YTEuNjcgMS42NyAwIDAgMC0xLjY2NyAxLjY2N1Y5LjVjMCAuOTE5Ljc0NyAxLjY2NyAxLjY2NyAxLjY2N2g1Yy45MTkgMCAxLjY2Ny0uNzQ3IDEuNjY3LTEuNjY3VjMuNjY3QTEuNjcgMS42NyAwIDAgMCA5LjUgMnptLTUgMy4zMzNoMy4zMzN2LjgzM0g0LjV2LS44MzN6bTUgMy4zMzRoLTV2LS44MzNoNXYuODMzelwiPjwvcGF0aD48cGF0aCBkPVwiTTE5LjUgMmgtNWExLjY3IDEuNjcgMCAwIDAtMS42NjcgMS42NjdWOS41YzAgLjkxOS43NDcgMS42NjcgMS42NjcgMS42NjdoNWMuOTE5IDAgMS42NjctLjc0NyAxLjY2Ny0xLjY2N1YzLjY2N0ExLjY3IDEuNjcgMCAwIDAgMTkuNSAyem0tNSAzLjMzM2gzLjMzM3YuODMzSDE0LjV2LS44MzN6bTUgMy4zMzRoLTV2LS44MzNoNXYuODMzelwiPjwvcGF0aD48cGF0aCBkPVwiTTkuNSAxMi44MzNoLTVBMS42NyAxLjY3IDAgMCAwIDIuODMzIDE0LjV2NS44MzNDMi44MzMgMjEuMjUyIDMuNTggMjIgNC41IDIyaDVjLjkxOSAwIDEuNjY3LS43NDcgMS42NjctMS42NjdWMTQuNUExLjY3IDEuNjcgMCAwIDAgOS41IDEyLjgzM3ptLTUgMy4zMzRoMy4zMzNWMTdINC41di0uODMzem01IDMuMzMzaC01di0uODMzaDV2LjgzM3pcIj48L3BhdGg+PHBhdGggZD1cIk0xOS41IDEyLjgzM2gtNWExLjY3IDEuNjcgMCAwIDAtMS42NjcgMS42Njd2NS44MzNjMCAuOTE5Ljc0NyAxLjY2NyAxLjY2NyAxLjY2N2g1Yy45MTkgMCAxLjY2Ny0uNzQ3IDEuNjY3LTEuNjY3VjE0LjVhMS42NyAxLjY3IDAgMCAwLTEuNjY3LTEuNjY3em0tNSAzLjMzNGgzLjMzM1YxN0gxNC41di0uODMzem01IDMuMzMzaC01di0uODMzaDV2LjgzM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZpbGUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNC44NTMgM0g2Ljk3NWMtLjk5NCAwLTIuMDE5Ljk2Ni0yLjAxOSAxLjk1NnYxNC4wNTZjMCAuOTk0Ljk5NCAxLjk4NyAxLjk4NyAxLjk4N2gxMC4yMzhhMS44IDEuOCAwIDAgMCAxLjgtMS44VjcuMTI3bC00LjEyOC00LjEyOHptLTEuMjcyIDUuNFYzLjlsNC41IDQuNWgtNC41elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZS12aWV3JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTMuODE4IDEzLjM2NGEyLjI3MyAyLjI3MyAwIDEgMS00LjU0NyAwIDIuMjczIDIuMjczIDAgMCAxIDQuNTQ3IDB6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTYuMDEzIDJINS42MzdhMS44MiAxLjgyIDAgMCAwLTEuODE4IDEuODE4djE2LjM2NEExLjgyIDEuODIgMCAwIDAgNS42MzcgMjJoMTIuNzI3YTEuODIgMS44MiAwIDAgMCAxLjgxOC0xLjgxOFY2LjE2OUwxNi4wMTMgMnptLjMyNiAxNi4xNTZjLS4zMDIuMzAxLS43MDEuNDY2LTEuMTI1LjQ2NnMtLjgyNC0uMTY1LTEuMTI1LS40NjVsLTEuMDA3LTEuMDA4YTQuMDM1IDQuMDM1IDAgMCAxLTEuNTM2LjMwNWMtMi4yNTUgMC00LjA5MS0xLjgzNS00LjA5MS00LjA5MXMxLjgzNS00LjA5MSA0LjA5MS00LjA5MSA0LjA5MSAxLjgzNSA0LjA5MSA0LjA5MWE0LjA2IDQuMDYgMCAwIDEtLjMwNSAxLjUzNWwxLjAwNyAxLjAwOGMuNjIuNjE5LjYyIDEuNjI5IDAgMi4yNDl6TTE0LjcyNyA3LjQ1NVYyLjkxbDQuNTQ1IDQuNTQ1aC00LjU0NXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZpbGUtdmlkZW8nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNi4wMTMgMkg1LjYzN2ExLjgyIDEuODIgMCAwIDAtMS44MTggMS44MTh2MTYuMzY0YzAgMS4wMDQuODE1IDEuODE4IDEuODE4IDEuODE4aDEyLjcyN2ExLjgyIDEuODIgMCAwIDAgMS44MTgtMS44MThWNi4xNjlMMTYuMDEzIDJ6TTguMzY0IDE3LjQ1NXYtNy4yNzNsNy4yNzMgMy42MzktNy4yNzMgMy42MzR6bTYuMzYzLTEwVjIuOTFsNC41NDUgNC41NDVoLTQuNTQ1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZS11cGxvYWQyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNC42MDUgMTguODc0aDE0Ljc5djIuMTM0SDQuNjA1di0yLjEzNHptNC4yMTktMi4xMzR2LTYuMzUzSDQuNjA1TDEyIDIuOTkybDcuMzk1IDcuMzk1aC00LjIxOXY2LjM1M0g4LjgyM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZpbGUtdXBsb2FkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTYuMDEzIDJINS42MzdhMS44MiAxLjgyIDAgMCAwLTEuODE4IDEuODE4djE2LjM2NEExLjgyIDEuODIgMCAwIDAgNS42MzcgMjJoMTIuNzI3YTEuODIgMS44MiAwIDAgMCAxLjgxOC0xLjgxOFY2LjE2OUwxNi4wMTMgMnptLTMuMTA0IDExLjgxOHY0LjU0NWgtMS44MTh2LTQuNTQ1SDguMzY0TDEyIDEwLjE4MmwzLjYzNiAzLjYzNmgtMi43Mjd6bTEuODE4LTYuMzYzVjIuOTFsNC41NDUgNC41NDVoLTQuNTQ1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZS10YXNrcy1jaGVja2xpc3QnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNGEyIDIgMCAwIDAtMi0yem0tNyAxNy40MTRsLTMuNzA3LTMuNzA3IDEuNDE0LTEuNDE0TDExIDE2LjU4Nmw0LjI5My00LjI5MyAxLjQxNCAxLjQxNEwxMSAxOS40MTR6bTAtOEw3LjI5MyA3LjcwN2wxLjQxNC0xLjQxNEwxMSA4LjU4Nmw0LjI5My00LjI5MyAxLjQxNCAxLjQxNEwxMSAxMS40MTR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmaWxlLW5vdGUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNS40MTQgMkg2Yy0xLjEwMyAwLTIgLjg5OC0yIDJ2MTZjMCAxLjEwMy44OTcgMiAyIDJoMTJjMS4xMDMgMCAyLS44OTcgMi0yVjYuNTg2TDE1LjQxNCAyek03IDEyaDh2Mkg3di0yem0xMCA2SDd2LTJoMTB2MnpNMTQgOFYzbDUgNWgtNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZpbGUtbG9jaycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyLjkwOSAxMmEuOTEuOTEgMCAwIDAtMS44MTggMHYxLjgxOGgxLjgxOFYxMnpcIj48L3BhdGg+PHBhdGggZD1cIk0xNi4wMTMgMkg1LjYzN2ExLjgyIDEuODIgMCAwIDAtMS44MTggMS44MTh2MTYuMzY0QTEuODIgMS44MiAwIDAgMCA1LjYzNyAyMmgxMi43MjdhMS44MiAxLjgyIDAgMCAwIDEuODE4LTEuODE4VjYuMTY5TDE2LjAxMyAyem0tLjM3NyAxNi4zNjRIOC4zNjN2LTQuNTQ1aC45MDl2LTEuODE4YzAtMS41MDQgMS4yMjQtMi43MjcgMi43MjctMi43MjdzMi43MjcgMS4yMjQgMi43MjcgMi43Mjd2MS44MThoLjkwOXY0LjU0NXptLS45MDktMTAuOTA5VjIuOTFsNC41NDUgNC41NDVoLTQuNTQ1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZS1sYW5kc2NhcGUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNy40MTQgNEg0Yy0xLjEwMyAwLTIgLjg5OC0yIDJ2MTJjMCAxLjEwMy44OTcgMiAyIDJoMTZjMS4xMDMgMCAyLS44OTcgMi0yVjguNTg2TDE3LjQxNCA0ek0xNiAxMFY1bDUgNWgtNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZpbGUtbGFuZHNjYXBlLW5ldycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE3LjQxNCA0SDRjLTEuMTAzIDAtMiAuODk4LTIgMnYxMmMwIDEuMTAzLjg5NyAyIDIgMmgxNmMxLjEwMyAwIDItLjg5NyAyLTJWOC41ODZMMTcuNDE0IDR6TTUgMTBoOXYySDV2LTJ6bTEzIDZINXYtMmgxM3Yyem0tMi02VjVsNSA1aC01elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZS1sYW5kc2NhcGUtaW1hZ2UnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNy40MTQgNEg0Yy0xLjEwMyAwLTIgLjg5OC0yIDJ2MTJjMCAxLjEwMy44OTcgMiAyIDJoMTZjMS4xMDMgMCAyLS44OTcgMi0yVjguNTg2TDE3LjQxNCA0ek01IDE3bDIuNDc5LTMuOTc3IDEuNTI3IDIuNDUxIDMuNTIyLTUuNjQ3TDE3IDE3SDV6bTExLTdWNWw1IDVoLTV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmaWxlLWdyYXBoJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTYuMDEzIDJINS42MzdhMS44MiAxLjgyIDAgMCAwLTEuODE4IDEuODE4djE2LjM2NWMwIDEuMDA0LjgxNSAxLjgxOCAxLjgxOCAxLjgxOGgxMi43MjdhMS44MiAxLjgyIDAgMCAwIDEuODE4LTEuODE4VjYuMTY5TDE2LjAxMyAyem0xLjQ0MiAxNy4yNzNINi41NDZ2LTEwaDEuODE4djUuMDc4bDIuMDg1LTIuMDg1YS45MDguOTA4IDAgMCAxIDEuMjg1IDBsMi4wODUgMi4wODUgMi4wODUtMi4wODUgMS4yODUgMS4yODUtMi43MjcgMi43MjdhLjkwOC45MDggMCAwIDEtMS4yODUgMGwtMi4wODUtMi4wODUtMi43MjcgMi43Mjd2LjUzM2g5LjA5MXYxLjgxOHpNMTQuNzI3IDcuNDU1VjIuOTFsNC41NDUgNC41NDVoLTQuNTQ1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZS1ncmFwaC0yJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTYuMDEzIDJINS42MzdhMS44MTkgMS44MTkgMCAwIDAtMS44MTggMS44MTh2MTYuMzY1YTEuODIgMS44MiAwIDAgMCAxLjgxOCAxLjgxOGgxMi43MjdhMS44MTkgMS44MTkgMCAwIDAgMS44MTgtMS44MThWNi4xNjlMMTYuMDEzIDJ6bTEuNDQyIDE2LjM2M2wtMTAuOTA5LjAwM3YtMS44MThsMS44MTgtLjAwMVY4LjM2M2gxLjgxOHY4LjE4NGguOTA5di0zLjYzOGgxLjgxOHYzLjYzN2guOTA5di01LjQ1NWgxLjgxOHY1LjQ1NWgxLjgxOHYxLjgxOHpNMTQuNzI3IDcuNDU0VjIuOTA5bDQuNTQ1IDQuNTQ1aC00LjU0NXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZpbGUtZmF2b3JpdGUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMiAxNmwxLjYyOS03LjMyOUE0Ljk3IDQuOTcgMCAwIDEgMTIgNWMwLTEuMTMxLjM5LTIuMTYyIDEuMDIyLTNINmMtMS4xMDQgMC0yIC44OTgtMiAydjE2YzAgMS4xMDMuODk2IDIgMiAyaDEyYzEuMTAzIDAgMi0uODk3IDItMnYtNC44TDE3IDE0bC01IDJ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMjAgNWEzIDMgMCAxIDAtNiAwYzAgMS4yMjUuNzM2IDIuMjc0IDEuNzg4IDIuNzRMMTQgMTRsMy0yIDMgMi0xLjc4OC02LjI2QTIuOTk2IDIuOTk2IDAgMCAwIDIwIDV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmaWxlLWZhdm9yaXRlLXN0YXInLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNi4wMTMgMkg1LjYzN2ExLjgyIDEuODIgMCAwIDAtMS44MTggMS44MTh2MTYuMzY0QTEuODIgMS44MiAwIDAgMCA1LjYzNyAyMmgxMi43MjdhMS44MiAxLjgyIDAgMCAwIDEuODE4LTEuODE4VjYuMTY5TDE2LjAxMyAyem0tLjgzMSAxNi4zNjRMMTIgMTYuMDkzbC0zLjE4MiAyLjI3MSAxLjM2NC0zLjYzOC0yLjcyNy0xLjgxNmgzLjE4MmwxLjM3LTMuNjM2IDEuMzU3IDMuNjM2aDMuMTgybC0yLjcyNyAxLjgxNiAxLjM2NCAzLjYzOHptLS40NTUtMTAuOTA5VjIuOTFsNC41NDUgNC41NDVoLTQuNTQ1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZS1kb3dubG9hZDInLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk00LjYwNSAxOC44NzRoMTQuNzl2Mi4xMzRINC42MDV2LTIuMTM0em0xNC43OS05LjUyOUwxMiAxNi43NCA0LjYwNSA5LjM0NWg0LjIxOVYyLjk5Mmg2LjM1M3Y2LjM1M2g0LjIxOXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZpbGUtZG93bmxvYWQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNi4wMTMgMkg1LjYzN2ExLjgyIDEuODIgMCAwIDAtMS44MTggMS44MTh2MTYuMzY0QTEuODIgMS44MiAwIDAgMCA1LjYzNyAyMmgxMi43MjdhMS44MiAxLjgyIDAgMCAwIDEuODE4LTEuODE4VjYuMTY5TDE2LjAxMyAyek0xMiAxOC4zNjRsLTMuNjM2LTMuNjM2aDIuNzI3di00LjU0NWgxLjgxOHY0LjU0NWgyLjcyN0wxMiAxOC4zNjR6bTIuNzI3LTEwLjkwOVYyLjkxbDQuNTQ1IDQuNTQ1aC00LjU0NXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZpbGUtYm9va21hcmsnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNS40MTQgMkg2Yy0xLjEwMyAwLTIgLjg5OC0yIDJ2MTZjMCAxLjEwMy44OTcgMiAyIDJoMTJjMS4xMDMgMCAyLS44OTcgMi0yVjYuNTg2TDE1LjQxNCAyek0xMCAxM2wtMi0yLTIgMlY0aDR2OXptNC01VjNsNSA1aC01elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmlsZS1hdWRpbycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE2LjAxMyAySDUuNjM3YTEuODIgMS44MiAwIDAgMC0xLjgxOCAxLjgxOHYxNi4zNjRBMS44MiAxLjgyIDAgMCAwIDUuNjM3IDIyaDEyLjcyN2ExLjgyIDEuODIgMCAwIDAgMS44MTgtMS44MThWNi4xNjlMMTYuMDEzIDJ6bS0uNzExIDEwLjIzOWwtMi4zOTMtLjc5OHY1LjU1NmEyLjI3MyAyLjI3MyAwIDEgMS0xLjgxOC0yLjIyN1Y4LjkxNmw0Ljc4NiAxLjU5NS0uNTc1IDEuNzI2em0tLjU3NS00Ljc4NFYyLjkxbDQuNTQ1IDQuNTQ1aC00LjU0NXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2ZlZWRiYWNrLXdhcm5pbmcnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMy4wMDkgMTMuOTg3VjguOTM0aC0xLjk1NnY1LjA1M2gxLjk1NnptMCA0LjAxNnYtMS45NjJoLTEuOTU2djEuOTYyaDEuOTU2ek0yLjk4OCAyMC45NjJMMTIuMDE2IDNsOS4wMjUgMTcuOTYySDIuOTg4elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmVlZGJhY2stc3RvcCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE1LjczIDNIOC4yN0wzIDguMjd2Ny40Nkw4LjI3IDIxaDcuNDZMMjEgMTUuNzNWOC4yN0wxNS43MyAzek0xMiAxNy4zYy0uNzIgMC0xLjMtLjU4LTEuMy0xLjNzLjU4LTEuMyAxLjMtMS4zYy43MiAwIDEuMy41OCAxLjMgMS4zcy0uNTggMS4zLTEuMyAxLjN6bTEtNC4zaC0yVjdoMnY2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmVlZGJhY2stcmVtb3ZlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptNSAxMUg3di0yaDEwdjJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmZWVkYmFjay1lcnJvcicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04IDAtMS44NS42My0zLjU1IDEuNjktNC45TDE2LjkgMTguMzFBNy45MDIgNy45MDIgMCAwIDEgMTIgMjB6bTYuMzEtMy4xTDcuMSA1LjY5QTcuOTAyIDcuOTAyIDAgMCAxIDEyIDRjNC40MiAwIDggMy41OCA4IDggMCAxLjg1LS42MyAzLjU1LTEuNjkgNC45elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmVlZGJhY2stYXR0ZW50aW9uJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIuOTg0IDEzLjkyMlY2Ljk4NGgtMS45Njl2Ni45MzhoMS45Njl6bTAgNC4wMzF2LTIuMDE2aC0xLjk2OXYyLjAxNmgxLjk2OXpNMTIgMi4wMTZjNS41MzEgMCA5Ljk4NCA0LjQ1MyA5Ljk4NCA5Ljk4NFMxNy41MzEgMjEuOTg0IDEyIDIxLjk4NCAyLjAxNiAxNy41MzEgMi4wMTYgMTIgNi40NjkgMi4wMTYgMTIgMi4wMTZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmYXZvcml0ZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDIwLjE2NGwtMS4yOTUtMS4xNjljLTQuNTk0LTQuMTc2LTcuNi02Ljg5LTcuNi0xMC4yNzMgMC0yLjc1NiAyLjEzLTQuODg2IDQuODg2LTQuODg2IDEuNTQ1IDAgMy4wNDguNzUyIDQuMDA5IDEuODc5Ljk2LTEuMTI4IDIuNDY0LTEuODc5IDQuMDA5LTEuODc5IDIuNzU2IDAgNC44ODYgMi4xMyA0Ljg4NiA0Ljg4NiAwIDMuMzgzLTMuMDA3IDYuMTM5LTcuNiAxMC4zMTV6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdmYXZvcml0ZS1vJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIuMDg0IDE3LjdjNC4yNi0zLjg0MiA3LjA1Ny02LjM4OSA3LjA1Ny04Ljk3OCAwLTEuNzk2LTEuMzM2LTMuMDktMy4xMzItMy4wOS0xLjM3OCAwLTIuNzE0Ljg3Ny0zLjE3NCAyLjA4OGgtMS42N2MtLjQ1OS0xLjIxMS0xLjc5Ni0yLjA4OC0zLjE3NC0yLjA4OC0xLjc5NiAwLTMuMTMyIDEuMjk1LTMuMTMyIDMuMDkgMCAyLjU4OSAyLjc5OCA1LjEzNiA3LjA1NyA4Ljk3OGwuMDg0LjA4NHptMy45MjUtMTMuODY0YzIuNzU2IDAgNC44ODYgMi4xMyA0Ljg4NiA0Ljg4NiAwIDMuMzgzLTMuMDA3IDYuMDk3LTcuNiAxMC4yNzNMMTIgMjAuMTY0bC0xLjI5NS0xLjEyOGMtNC41OTQtNC4xNzYtNy42LTYuOTMyLTcuNi0xMC4zMTUgMC0yLjc1NiAyLjEzLTQuODg2IDQuODg2LTQuODg2IDEuNTQ1IDAgMy4wNDguNzUyIDQuMDA5IDEuODc5Ljk2LTEuMTI4IDIuNDY0LTEuODc5IDQuMDA5LTEuODc5elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmFzdC1yZXdpbmQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMi4yMzQgMTJsOC41MzEtNnYxMnptLS40NjggNmwtOC41MzEtNiA4LjUzMS02djEyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZmFzdC1mb3J3YXJkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIuMjM0IDZsOC41MzEgNi04LjUzMSA2VjZ6bS05IDEyVjZsOC41MzEgNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2V5ZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTMuNDI4IDEyYzEuMDU5LTEuNjQxIDIuNTEyLTMuMDQ3IDQuMjUzLTMuOTQxQTQuOTUyIDQuOTUyIDAgMCAwIDcgMTAuNTcxYzAgMi43NTYgMi4yNDQgNSA1IDVzNS0yLjI0NCA1LTVhNC45NiA0Ljk2IDAgMCAwLS42ODEtMi41MTJjMS43NDEuODk0IDMuMTkxIDIuMyA0LjI1MyAzLjk0MS0xLjkwOSAyLjk0Ny00Ljk5MSA1LTguNTcyIDVzLTYuNjYzLTIuMDUzLTguNTcyLTV6bTguMDM4LTQuMjg0YzAtLjI5MS4yNDctLjUzNC41MzQtLjUzNGEzLjQwNyAzLjQwNyAwIDAgMSAzLjM5NCAzLjM5NC41NDIuNTQyIDAgMCAxLS41MzQuNTM0LjU0Mi41NDIgMCAwIDEtLjUzNC0uNTM0IDIuMzM1IDIuMzM1IDAgMCAwLTIuMzIyLTIuMzIyLjU0Ny41NDcgMCAwIDEtLjUzNy0uNTM3ek0yIDEyYzAgLjI3OC4wOTEuNTM0LjIyNS43NjlDNC4yNzggMTYuMTUgOC4wMzggMTguNDI4IDEyIDE4LjQyOHM3LjcyNS0yLjI4OCA5Ljc3NS01LjY1OWMuMTM0LS4yMzQuMjI1LS40OTEuMjI1LS43NjlzLS4wOTEtLjUzNC0uMjI1LS43NjlDMTkuNzIyIDcuODU5IDE1Ljk2MiA1LjU3MiAxMiA1LjU3MlM0LjI3NSA3Ljg2IDIuMjI1IDExLjIzMUExLjU0NCAxLjU0NCAwIDAgMCAyIDEyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZXllLXNsYXNoJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTUuODA1IDE2LjE4NGwtLjg3MS0xLjU3NGE0Ljk5NiA0Ljk5NiAwIDAgMCAyLjA2NS00LjA0YzAtLjg4MS0uMjM0LTEuNzUyLS42ODEtMi41MTEgMS43NDEuODkzIDMuMTkyIDIuMjk5IDQuMjUyIDMuOTQtMS4xNjEgMS43OTctMi44MDEgMy4zMDQtNC43NjYgNC4xODV6bS00LjM0MS04LjQ3YzAtLjI5LjI0Ni0uNTM2LjUzNi0uNTM2YTMuNDA2IDMuNDA2IDAgMCAxIDMuMzkzIDMuMzkzYzAgLjI5LS4yNDYuNTM2LS41MzYuNTM2cy0uNTM2LS4yNDYtLjUzNi0uNTM2QTIuMzI2IDIuMzI2IDAgMCAwIDEyIDguMjVhLjU0NC41NDQgMCAwIDEtLjUzNi0uNTM2ek03LjQxMiA1LjU4MmMwIC4wMjIgMCAuMDc4LjAxMS4xMDEgMi4zNTUgNC4yMDggNC42ODggOC40MzggNy4wNDIgMTIuNjQ1bC41NDcuOTk0Yy4wNjcuMTExLjE5LjE3OS4zMTMuMTc5LjIwMSAwIDEuMjYxLS42NDcgMS40OTYtLjc4MWEuMzU5LjM1OSAwIDAgMCAuMTc5LS4zMTNjMC0uMTc5LS4zNzktLjc4MS0uNDkxLS45NzEgMi4xNjUtLjk4MiAzLjk4NC0yLjY1NiA1LjI2OC00LjY2NWExLjQzMiAxLjQzMiAwIDAgMCAwLTEuNTRjLTIuMjEtMy4zOTMtNS42NTktNS42NTktOS43NzYtNS42NTktLjY3IDAtMS4zNTEuMDY3LTIuMDA5LjE5bC0uNjAzLTEuMDgzYS4zNTkuMzU5IDAgMCAwLS4zMTMtLjE3OWMtLjIwMSAwLTEuMjUuNjQ3LTEuNDg0Ljc4MWEuMzU0LjM1NCAwIDAgMC0uMTc5LjMwMXpNNyAxMC41NzFhNC45OTMgNC45OTMgMCAwIDAgMy4yMTQgNC42NjVMNy4wODkgOS42MzNhNS4zMTggNS4zMTggMCAwIDAtLjA4OS45Mzh6bS01IDEuNDI4YzAgLjI5LjA3OC41MjQuMjI0Ljc3LjM0Ni41NjkuNzgxIDEuMTE2IDEuMjE2IDEuNjE5IDIuMTg4IDIuNTExIDUuMjAxIDQuMDQgOC41NiA0LjA0bC0uODI2LTEuNDc0Yy0zLjI0OC0uMjc5LTYuMDA0LTIuMjU0LTcuNzQ2LTQuOTU1YTExLjU4NSAxMS41ODUgMCAwIDEgMy4xNDctMy4yODFsLS43MDMtMS4yNWMtMS4zODQuOTI2LTIuNzc5IDIuMzIxLTMuNjQ5IDMuNzYxLS4xNDUuMjQ2LS4yMjQuNDgtLjIyNC43N3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2V5ZS1zaG93JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMTBhMiAyIDAgMSAwIDAgNCAyIDIgMCAxIDAgMC00elwiPjwvcGF0aD48cGF0aCBkPVwiTTIxLjMxIDEwLjczQzE5LjM3IDkuMTYgMTYuMTIgNi44OCAxMiA2LjhjLTQuMDkuMDgtNy4zNCAyLjM2LTkuMjcgMy45My0uMzg0LjI3NS0uNjUyLjY5LS43MjkgMS4xN0wyIDExLjkxYy4wMS40MDMuMTk4Ljc2MS40ODguOTk4bC4wMDIuMDAyYzEuNTggMS41MyA1IDQuMjQgOS41MiA0LjI2IDQuNTEgMCA3Ljk0LTIuNzMgOS41Mi00LjI2LjI5My0uMjM4LjQ4Mi0uNTk2LjQ5LS45OTl2LS4wMDFhMS43ODkgMS43ODkgMCAwIDAtLjcwNS0xLjE3N2wtLjAwNS0uMDAzek0xMiAxNmE0IDQgMCAxIDEgNC00IDQgNCAwIDAgMS00IDR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdleWUtaGlkZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDE2aC0uMDA3YTQgNCAwIDAgMS0zLjg2Ny01LjAyOEw4LjEyIDExbC0yLjQtMi40YTIyLjE1MiAyMi4xNTIgMCAwIDAtMy4wMzcgMi4xMWwuMDM3LS4wM2ExLjc4MSAxLjc4MSAwIDAgMC0uNzE5IDEuMjIxTDIgMTEuOTFjLjAxLjQwMy4xOTguNzYxLjQ4OC45OThsLjAwMi4wMDJjMS41OCAxLjUzIDUgNC4yNCA5LjUyIDQuMjZhMTEuNDIzIDExLjQyMyAwIDAgMCAyLjA3Mi0uMjEybC0uMDcyLjAxMkwxMyAxNS44OWMtLjI4LjA3LS42MDIuMTExLS45MzQuMTExbC0uMDctLjAwMWguMDAzelwiPjwvcGF0aD48cGF0aCBkPVwiTTIyIDExLjkxYTEuNzg0IDEuNzg0IDAgMCAwLS43MzQtMS4xNzZsLS4wMDYtLjAwNEMxOS4zNyA5LjE2IDE2LjEyIDYuODggMTIgNi44YTExLjk2NSAxMS45NjUgMCAwIDAtMy44MjMuNzI3TDguMjYgNy41bDEuMzMgMS4zM2E0IDQgMCAwIDEgNS41OTMgNS42MWwuMDA3LS4wMSAxLjcgMS43YTE2LjU0NCAxNi41NDQgMCAwIDAgNC42NzQtMy4xODRsLS4wMDQuMDA0Yy4yNzEtLjI0My40NDEtLjU5NC40NDEtLjk4NUwyMiAxMS45MDd2LjAwM3pcIj48L3BhdGg+PHBhdGggZD1cIk0xMCAxMmEyIDIgMCAwIDAgMiAyYy4xNTUtLjAwNS4zMDItLjAyNi40NDQtLjA2M2wtLjAxNC4wMDMtMi40LTIuNGExLjkxNSAxLjkxNSAwIDAgMC0uMDMuNDY1VjEyelwiPjwvcGF0aD48cGF0aCBkPVwiTTE0IDEyYTIgMiAwIDAgMC0yLTIgMS45ODggMS45ODggMCAwIDAtMS4wMDkuMjk1TDExIDEwLjI5IDEzLjc1IDEzYTEuOTggMS45OCAwIDAgMCAuMjUtLjk2OXYtLjAzM1YxMnpcIj48L3BhdGg+PHBhdGggZD1cIk04LjE0IDExLjA2TDEzIDE1Ljg5YTMuOTEgMy45MSAwIDAgMCAuNjY2LS4yMmwtLjAyNi4wMS01LjI5LTUuMjdhMy44OSAzLjg5IDAgMCAwLS4yMDUuNjIzbC0uMDA1LjAyN3pcIj48L3BhdGg+PHBhdGggZD1cIk00LjU2IDYuNjNsLjI4LS4yOC0uNDQtLjQ0LS43MS43MSAyIDIgLjU1LS4zelwiPjwvcGF0aD48cGF0aCBkPVwiTTE0LjA4IDE3bDMuMSAzLjEuNDMtLjQzLTIuODMtMi44M3pcIj48L3BhdGg+PHBhdGggZD1cIk0xMy42MiAxNS42OGEzLjY3IDMuNjcgMCAwIDEtLjYxMy4yMDRsLS4wMjcuMDA2IDEuMSAxLjExLjctLjE1elwiPjwvcGF0aD48cGF0aCBkPVwiTTguMzUgMTAuNDFMNi4yOSA4LjM1bC0uNTUuMyAyLjQgMi40YTMuOTEgMy45MSAwIDAgMSAuMjItLjY2NmwtLjAxLjAyNnpcIj48L3BhdGg+PHBhdGggZD1cIk02LjI5IDguMzVsLjM3LS4xOS0xLjgyLTEuODItLjI4LjI4elwiPjwvcGF0aD48cGF0aCBkPVwiTTguMzUgMTAuNDFsNS4yNyA1LjI3Yy4xNDUtLjA3MS4yNjItLjEzOC4zNzYtLjIxbC0uMDE2LjAxTDguNTUgMTBjLS4wNjQuMTEtLjEzMS4yNDUtLjE5LjM4NGwtLjAxLjAyNnpcIj48L3BhdGg+PHBhdGggZD1cIk0xNS4yMyAxNi43M2wtLjQ1LjEyIDIuODMgMi44My4yOC0uMjh6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNi42NiA4LjE2bC0uMzcuMTkgMi4wNiAyLjA2Yy4wNzEtLjE0OS4xMzctLjI3LjIxLS4zODdsLS4wMS4wMTd6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTQuNzggMTYuODVsLjQ1LS4xMkwxNCAxNS40OGEzLjkzOCAzLjkzOCAwIDAgMS0uMzM3LjE5bC0uMDIzLjAxelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZXhpdC10by1hcHAnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOC45ODQgM0MyMC4wNjIgMyAyMSAzLjkzOCAyMSA1LjAxNnYxMy45NjljMCAxLjA3OC0uOTM4IDIuMDE2LTIuMDE2IDIuMDE2SDUuMDE1Yy0xLjEyNSAwLTIuMDE2LS45MzgtMi4wMTYtMi4wMTZ2LTMuOTg0aDIuMDE2djMuOTg0aDEzLjk2OVY1LjAxNkg1LjAxNVY5SDIuOTk5VjUuMDE2QzIuOTk5IDMuOTM4IDMuODkgMyA1LjAxNSAzaDEzLjk2OXptLTguOTA2IDEyLjYwOWwyLjU3OC0yLjYyNUgzdi0xLjk2OWg5LjY1NkwxMC4wNzggOC4zOWwxLjQwNi0xLjQwNkwxNi41IDEybC01LjAxNiA1LjAxNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2VxdWFsaXplcicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE1Ljk4NCA5aDQuMDMxdjExLjAxNmgtNC4wMzFWOXptLTEyIDExLjAxNlYxMmg0LjAzMXY4LjAxNkgzLjk4NHptNiAwVjMuOTg1aDQuMDMxdjE2LjAzMUg5Ljk4NHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2VubGFyZ2UyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjIgMnY4LjEyNUwxOC44NzUgN2wtMy43NSAzLjc1LTEuODc1LTEuODc1TDE3IDUuMTI1IDEzLjg3NSAyek0xMC43NSAxNS4xMjVMNyAxOC44NzUgMTAuMTI1IDIySDJ2LTguMTI1TDUuMTI1IDE3bDMuNzUtMy43NXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2VubGFyZ2UnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yIDJ2OC4xMjVMNS4xMjUgN2wzLjc1IDMuNzUgMS44NzUtMS44NzVMNyA1LjEyNSAxMC4xMjUgMnpcIj48L3BhdGg+PHBhdGggZD1cIk0yMiAyaC04LjEyNUwxNyA1LjEyNWwtMy43NSAzLjc1IDEuODc1IDEuODc1TDE4Ljg3NSA3IDIyIDEwLjEyNXpcIj48L3BhdGg+PHBhdGggZD1cIk0yMiAyMnYtOC4xMjVMMTguODc1IDE3bC0zLjc1LTMuNzUtMS44NzUgMS44NzUgMy43NSAzLjc1TDEzLjg3NSAyMnpcIj48L3BhdGg+PHBhdGggZD1cIk0yIDIyaDguMTI1TDcgMTguODc1bDMuNzUtMy43NS0xLjg3NS0xLjg3NUw1LjEyNSAxNyAyIDEzLjg3NXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2VtYWlsLW9wZW4nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xMiAxMi45ODRsOC4yNS01LjE1NkwxMiAzIDMuNzUgNy44Mjh6bTkuOTg0LTQuOTY4VjE4YzAgMS4wNzgtLjg5MSAyLjAxNi0xLjk2OSAyLjAxNkgzLjk4NGMtMS4wNzggMC0xLjk2OS0uOTM4LTEuOTY5LTIuMDE2VjguMDE2YzAtLjcwMy4zNzUtMS40MDYuOTM4LTEuNzM0TDEyIC45ODVsOS4wNDcgNS4yOTdjLjU2My4zMjguOTM4IDEuMDMxLjkzOCAxLjczNHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2VtYWlsLWNsb3NlZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIwLjAxNiA4LjAxNlY2TDEyIDExLjAxNiAzLjk4NCA2djIuMDE2TDEyIDEyLjk4NXptMC00LjAzMmMxLjA3OCAwIDEuOTY5LjkzOCAxLjk2OSAyLjAxNnYxMmMwIDEuMDc4LS44OTEgMi4wMTYtMS45NjkgMi4wMTZIMy45ODVjLTEuMDc4IDAtMS45NjktLjkzOC0xLjk2OS0yLjAxNlY2YzAtMS4wNzguODkxLTIuMDE2IDEuOTY5LTIuMDE2aDE2LjAzMXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2VtYWlsLWF0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIG9wYWNpdHk9XCIuOVwiIGQ9XCJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMGg1di0yaC01Yy00LjM0IDAtOC0zLjY2LTgtOHMzLjY2LTggOC04IDggMy42NiA4IDh2MS40M2MwIC43OS0uNzEgMS41Ny0xLjUgMS41N3MtMS41LS43OC0xLjUtMS41N1YxMmMwLTIuNzYtMi4yNC01LTUtNXMtNSAyLjI0LTUgNSAyLjI0IDUgNSA1YzEuMzggMCAyLjY0LS41NiAzLjU0LTEuNDcuNjUuODkgMS43NyAxLjQ3IDIuOTYgMS40NyAxLjk3IDAgMy41LTEuNiAzLjUtMy41N1YxMmMwLTUuNTItNC40OC0xMC0xMC0xMHptMCAxM2MtMS42NiAwLTMtMS4zNC0zLTNzMS4zNC0zIDMtMyAzIDEuMzQgMyAzLTEuMzQgMy0zIDN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdlamVjdCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyIDUuMDE2TDE4LjY1NiAxNUg1LjM0M3ptLTYuOTg0IDEyaDEzLjk2OXYxLjk2OUg1LjAxNnYtMS45Njl6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdFZHVjYXRpb24nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk01Ljc3OCAxMy4wNDl2My41NTZMMTIgMjAuMDAxbDYuMjIyLTMuMzk2di0zLjU1NkwxMiAxNi40NDVsLTYuMjIyLTMuMzk2ek0xMiA0TDIuMjIyIDkuMzMzIDEyIDE0LjY2Nmw4LTQuMzY0djYuMTQyaDEuNzc4VjkuMzMzTDEyIDR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdlZGl0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjAuNjI0IDcuMTA1bC0xLjgxOCAxLjgxOC0zLjczLTMuNzMgMS44MTgtMS44MThhMS4wMTQgMS4wMTQgMCAwIDEgMS4zOTkgMGwyLjMzMSAyLjMzMWExLjAxNCAxLjAxNCAwIDAgMSAwIDEuMzk5ek0zLjAwMyAxNy4yNjhMMTQuMDA1IDYuMjY2bDMuNzMgMy43M0w2LjczMyAyMC45OThoLTMuNzN2LTMuNzN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdkcmFnLWhhbmRsZS12ZXJ0aWNhbCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTkgMy45ODRoMi4wMTZ2MTYuMDMxSDlWMy45ODR6bTYgMTYuMDMyaC0yLjAxNlYzLjk4NUgxNXYxNi4wMzF6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdkcmFnLWhhbmRsZS1ob3Jpem9udGFsJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMy45ODQgMTV2LTIuMDE2aDE2LjAzMVYxNUgzLjk4NHptMTYuMDMyLTZ2Mi4wMTZIMy45ODVWOWgxNi4wMzF6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdkb2xsYXItY2lyY2xlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMkM2LjQ4NiAyIDIgNi40ODYgMiAxMmMwIDUuNTE1IDQuNDg2IDEwIDEwIDEwIDUuNTE1IDAgMTAtNC40ODUgMTAtMTAgMC01LjUxNC00LjQ4NS0xMC0xMC0xMHptMyA4aC0zLjVhLjUuNSAwIDAgMCAwIDFoMWMxLjM3OSAwIDIuNSAxLjEyMiAyLjUgMi41IDAgMS4yMDgtLjg2IDIuMjE3LTIgMi40NDlWMTdoLTJ2LTFIOXYtMmgzLjVhLjUuNSAwIDAgMCAwLTFoLTFBMi41MDMgMi41MDMgMCAwIDEgOSAxMC41YzAtMS4yMDcuODYtMi4yMTcgMi0yLjQ0OVY3aDJ2MWgydjJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdkZXNrdG9wJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjAgNEg0Yy0uOTc4IDAtMS43NzguOC0xLjc3OCAxLjc3OHYxMC42NjdjMCAuOTc4LjggMS43NzggMS43NzggMS43NzhoNC40NDR2MS43NzhoNy4xMTF2LTEuNzc4aDQuNDQ0Yy45NzggMCAxLjc2OS0uOCAxLjc2OS0xLjc3OGwuMDA5LTEwLjY2N2MwLS45NzgtLjgtMS43NzgtMS43NzgtMS43Nzh6bTAgMTIuNDQ0SDRWNS43NzdoMTZ2MTAuNjY3elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnZGFzaGJvYXJkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIuOTg0IDNIMjF2NmgtOC4wMTZWM3ptMCAxOHYtOS45ODRIMjFWMjFoLTguMDE2ek0zIDIxdi02aDguMDE2djZIM3ptMC04LjAxNlYzaDguMDE2djkuOTg0SDN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjdXQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOC45ODQgM2gzdi45ODRMMTUgMTEuMDE1bC0yLjAxNi0yLjAxNnpNMTIgMTIuNTE2Yy4yODEgMCAuNTE2LS4yMzQuNTE2LS41MTZzLS4yMzQtLjUxNi0uNTE2LS41MTYtLjUxNi4yMzQtLjUxNi41MTYuMjM0LjUxNi41MTYuNTE2em0tNiA3LjVjMS4wNzggMCAyLjAxNi0uODkxIDIuMDE2LTIuMDE2UzcuMDc4IDE1Ljk4NCA2IDE1Ljk4NCAzLjk4NCAxNi44NzUgMy45ODQgMTggNC45MjIgMjAuMDE2IDYgMjAuMDE2em0wLTEyYzEuMDc4IDAgMi4wMTYtLjg5MSAyLjAxNi0yLjAxNlM3LjA3OCAzLjk4NCA2IDMuOTg0IDMuOTg0IDQuODc1IDMuOTg0IDYgNC45MjIgOC4wMTYgNiA4LjAxNnptMy42NTYtLjM3NWwxMi4zMjggMTIuMzc1VjIxaC0zTDEyIDE0LjAxNiA5LjY1NiAxNi4zNmMuMjM0LjUxNi4zMjggMS4wMzEuMzI4IDEuNjQxIDAgMi4yMDMtMS43ODEgMy45ODQtMy45ODQgMy45ODRzLTMuOTg0LTEuNzgxLTMuOTg0LTMuOTg0UzMuNzk3IDE0LjAxNyA2IDE0LjAxN2MuNjA5IDAgMS4xMjUuMDk0IDEuNjQxLjMyOGwyLjM0NC0yLjM0NC0yLjM0NC0yLjM0NGMtLjUxNi4yMzQtMS4wMzEuMzI4LTEuNjQxLjMyOC0yLjIwMyAwLTMuOTg0LTEuNzgxLTMuOTg0LTMuOTg0UzMuNzk3IDIuMDE3IDYgMi4wMTdzMy45ODQgMS43ODEgMy45ODQgMy45ODRjMCAuNjA5LS4wOTQgMS4xMjUtLjMyOCAxLjY0MXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2N1cnNvcicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyLjQzMSAxMy4wMzRsMy4zMTkgNy43MTYtMi41IDEuMjUtMi45MDQtNy45MjRMNS43NSAxOC4yNVYybDEyLjUgMTAtNS44MTkgMS4wMzR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjdXJzb3ItdGFyZ2V0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjMgMTFoLTMuMDY5QTguMDEgOC4wMSAwIDAgMCAxMyA0LjA2OVYxaC0ydjMuMDY5QTguMDEgOC4wMSAwIDAgMCA0LjA2OSAxMUgxdjJoMy4wNjlBOC4wMDcgOC4wMDcgMCAwIDAgMTEgMTkuOTMxVjIzaDJ2LTMuMDY5QTguMDEgOC4wMSAwIDAgMCAxOS45MzEgMTNIMjN2LTJ6bS0xMCA2LjkxVjE0aC0ydjMuOTFBNi4wMDggNi4wMDggMCAwIDEgNi4wOSAxM0gxMHYtMkg2LjA5QTYuMDA4IDYuMDA4IDAgMCAxIDExIDYuMDlWMTBoMlY2LjA5QTYuMDA3IDYuMDA3IDAgMCAxIDE3LjkxIDExSDE0djJoMy45MUE2LjAwOCA2LjAwOCAwIDAgMSAxMyAxNy45MXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NyZWRpdC1jYXJkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMiAxOWMwIDEuMTAzLjg5NiAyIDIgMmgxNmMxLjEwMyAwIDItLjg5NyAyLTJ2LThIMnY4em0xMy02aDR2MmgtNHYtMnpNNSAxM2g3djJINXYtMnptMCAzaDV2Mkg1di0yelwiPjwvcGF0aD48cGF0aCBkPVwiTTIwIDVINGMtMS4xMDQgMC0yIC44OTgtMiAydjJoMjBWN2MwLTEuMTAyLS44OTctMi0yLTJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjcmVkaXQtY2FyZC1sb2NrJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTguNjY4IDMuNjY3YzAtLjkyLS43NDctMS42NjctMS42NjctMS42NjdIMy42NjhjLS45MiAwLTEuNjY3Ljc0Ny0xLjY2NyAxLjY2N3YxLjY2N2gxNi42NjdWMy42Njd6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTQuODQxIDEwLjMzM2gtMi4wMDdWOC42NjZoMy4zMzN2MS4wNzhhNS44NDQgNS44NDQgMCAwIDEgMS42NjctLjI0NWMuMjgzIDAgLjU2MS4wMjcuODMzLjA2N1Y2Ljk5OUgydjYuNjY3YzAgLjkxOS43NDcgMS42NjcgMS42NjcgMS42NjdIMTJhNS44MjUgNS44MjUgMCAwIDEgMi44NC01em0tNi4xNzQgMi41SDQuNXYtMS42NjdoNC4xNjd2MS42Njd6bTEuNjY3LTIuNUg0LjUwMVY4LjY2Nmg1LjgzM3YxLjY2N3pcIj48L3BhdGg+PHBhdGggZD1cIk0yMS4xNjcgMTQuNWMwLTEuODM3LTEuNDk1LTMuMzMzLTMuMzMzLTMuMzMzcy0zLjMzMyAxLjQ5Ni0zLjMzMyAzLjMzM2EuODMyLjgzMiAwIDAgMC0uODMzLjgzM3Y1LjgzM2MwIC40NjEuMzcyLjgzMy44MzMuODMzaDYuNjY3YS44MzIuODMyIDAgMCAwIC44MzMtLjgzM3YtNS44MzNhLjgzMi44MzIgMCAwIDAtLjgzMy0uODMzem0tMy4zMzQtMS42NjdBMS42NyAxLjY3IDAgMCAxIDE5LjUgMTQuNWgtMy4zMzNhMS42NyAxLjY3IDAgMCAxIDEuNjY3LTEuNjY3em0yLjUgNy41aC01di00LjE2N2g1djQuMTY3elwiPjwvcGF0aD48cGF0aCBkPVwiTTE4LjY2OCAxNy44MzNhLjgzMy44MzMgMCAxIDEtMS42NjYgMCAuODMzLjgzMyAwIDAgMSAxLjY2NiAwelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY29weXJpZ2h0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMjAuMDE2YzQuNDA2IDAgOC4wMTYtMy42MDkgOC4wMTYtOC4wMTZTMTYuNDA3IDMuOTg0IDEyIDMuOTg0IDMuOTg0IDcuNTkzIDMuOTg0IDEyIDcuNTkzIDIwLjAxNiAxMiAyMC4wMTZ6bTAtMThjNS41MzEgMCA5Ljk4NCA0LjQ1MyA5Ljk4NCA5Ljk4NFMxNy41MzEgMjEuOTg0IDEyIDIxLjk4NCAyLjAxNiAxNy41MzEgMi4wMTYgMTIgNi40NjkgMi4wMTYgMTIgMi4wMTZ6bS0uMTQxIDcuMTI1Yy0xLjQ0MiAwLTEuODc1IDEuMjc2LTEuODc1IDIuNzE5di4yODFjMCAxLjQ0Mi40MzQgMi43MTkgMS44NzUgMi43MTkuODggMCAxLjY0MS0uNTM3IDEuNjQxLTEuNDA2aDEuNzgxYzAgLjkxNS0uNDk1IDEuNjAzLTEuMDMxIDIuMDYzLS42MDQuNTE4LTEuMzA4Ljg0NC0yLjM5MS44NDQtMi41NTkgMC0zLjg0NC0xLjY5MS0zLjg0NC00LjIxOXYtLjI4MWMwLTEuMjEyLjM0LTIuMzE4LjkzOC0zIC42MTktLjcwNyAxLjYxLTEuMjY2IDIuOTA2LTEuMjY2IDEuMDM4IDAgMS45MDQuMzU4IDIuNDM4Ljg5MS41MTYuNTE2Ljk4NCAxLjMxMi45ODQgMi4yOTdIMTMuNWMwLS4yMzQtLjA0Ny0uNDIyLS4xNDEtLjYwOXMtLjE4OC0uNDIyLS4zMjgtLjU2M2ExLjcwNiAxLjcwNiAwIDAgMC0xLjE3Mi0uNDY5elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY29udGV4dC1zZWN0aW9uJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTAuNSAxNWwtMi4yNS0zLTEuNzM0IDIuMjUtMS4yNjYtMS41TDMuNTE2IDE1SDEwLjV6TTEyIDl2NmMwIDEuMDc4LS45MzggMi4wMTYtMi4wMTYgMi4wMTZoLTZjLTEuMDc4IDAtMS45NjktLjkzOC0xLjk2OS0yLjAxNlY5YzAtMS4wNzguODkxLTIuMDE2IDEuOTY5LTIuMDE2aDZDMTEuMDYyIDYuOTg0IDEyIDcuOTIyIDEyIDl6bTIuMDE2IDguMDE2VjE1aDcuOTY5djIuMDE2aC03Ljk2OXptNy45NjgtMTAuMDMyVjloLTcuOTY5VjYuOTg0aDcuOTY5em0wIDZoLTcuOTY5di0xLjk2OWg3Ljk2OXYxLjk2OXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NvbnRlbnQtYnJpZWZjYXNlJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjAuMDYzIDYuOTc1aC00LjA2MnYtM2ExIDEgMCAwIDAtMS0xaC02YTEgMSAwIDAgMC0xIDF2M0gzLjkzOWMtMS4wOTQgMC0xLjkzOC43MTItMS45MzggMi4wMzF2MTAuMDMxYzAgMS4xODEuODQ0IDEuOTM4IDIgMS45MzhoMTYuMDMxYzEuMTg4IDAgMS45NjktLjc1NiAxLjk2OS0xLjkzOHYtMTBjMC0xLjE5NC0uNTk0LTIuMDYzLTEuOTM4LTIuMDYzek0xMCA1LjAzN2g0djEuOTM4aC00VjUuMDM3ek0yMS4wMDYgMTIuNWgtNy45OTR2MS41MzFoLTIuMDQ0VjEyLjVoLTh2LTEuMzEzaDE4LjAzOFYxMi41elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY29udGVudC1ib3gnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yMCAzLjVINGMtMS4xMDQgMC0yIC44OTgtMiAydjNoMjB2LTNjMC0xLjEwMy0uODk3LTItMi0yelwiPjwvcGF0aD48cGF0aCBkPVwiTTMgOS41djljMCAxLjEwMy44OTYgMiAyIDJoMTRjMS4xMDMgMCAyLS44OTcgMi0ydi05SDN6bTEyIDRIOXYtMmg2djJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjb250ZW50LWJveC1maWxsZWQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk00IDEwaDE2djJINHYtMnpcIj48L3BhdGg+PHBhdGggZD1cIk00IDdoMTZ2Mkg0Vjd6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNCA0aDE2djJINFY0elwiPjwvcGF0aD48cGF0aCBkPVwiTTEwIDEzaDR2MmgtNHYtMnpcIj48L3BhdGg+PHBhdGggZD1cIk0yMCAxM2gtNGExIDEgMCAwIDAtMSAxdjJIOXYtMmExIDEgMCAwIDAtMS0xSDRhMSAxIDAgMCAwLTEgMXY0YzAgMS4xMDMuODk2IDIgMiAyaDE0YzEuMTAzIDAgMi0uODk3IDItMnYtNGExIDEgMCAwIDAtMS0xelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY29udGVudC1ib3gtYWx0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTAgNC45NzVoNnYyaC02di0yelwiPjwvcGF0aD48cGF0aCBkPVwiTTggNy45NzVoOHYySDh2LTJ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNOCAxMC45NzVoOHYySDh2LTJ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMjAgMTMuOTc1aC0xdi0xMWExIDEgMCAwIDAtMS0xSDZhMSAxIDAgMCAwLTEgMXYxMUg0YTEgMSAwIDAgMC0xIDF2NWMwIDEuMTAzLjg5NiAyIDIgMmgxNGMxLjEwMyAwIDItLjg5NyAyLTJ2LTVhMSAxIDAgMCAwLTEtMXptLTEzLTEwaDEwdjEwaC0xYTEgMSAwIDAgMC0xIDF2MUg5di0xYTEgMSAwIDAgMC0xLTFIN3YtMTB6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjb21wYXNzJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTIgMkM2LjQ3NyAyIDIgNi40NzcgMiAxMnM0LjQ3NyAxMCAxMCAxMCAxMC00LjQ3NyAxMC0xMFMxNy41MjMgMiAxMiAyek0zLjg3NSAxMmE4LjEyNSA4LjEyNSAwIDAgMSAxMy42NjMtNS45NDVMOS41IDkuNWwtMy40NDUgOC4wMzhBOC4wOTIgOC4wOTIgMCAwIDEgMy44NzUgMTJ6bTkuNTU0IDEuNDI5bC01LjAwMiAyLjE0NCAyLjE0NC01LjAwMiAyLjg1OCAyLjg1OHpNMTIgMjAuMTI1YTguMDk2IDguMDk2IDAgMCAxLTUuNTM3LTIuMThsOC4wMzgtMy40NDUgMy40NDUtOC4wMzhhOC4xMjUgOC4xMjUgMCAwIDEtNS45NDUgMTMuNjYyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY29pbnMnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk04LjI1IDE0LjVoLjgzM2MuMTE1IDAgLjIyNS4wMTYuMzM0LjAzNWE4LjQ4OSA4LjQ4OSAwIDAgMS0uNzM5LS44NjhIOC4yNWEuNDE4LjQxOCAwIDAgMCAwIC44MzR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTEuMTY3IDE2LjU4M0EyLjA4NSAyLjA4NSAwIDAgMSA5LjUgMTguNjI0di44NzZINy44MzN2LS44MzNINi4xNjZWMTdoMi45MTdhLjQxNy40MTcgMCAwIDAgMC0uODM0SDguMjVhMi4wODUgMi4wODUgMCAwIDEtMi4wODMtMi4wODMgMi4wOCAyLjA4IDAgMCAxIDEuNTY3LTIuMDEgOC4yOTEgOC4yOTEgMCAwIDEtLjcyMi0zLjE5MkM0LjEzMyA5LjYxOSAyIDEyLjIyNCAyIDE1LjMzM0E2LjY2NyA2LjY2NyAwIDAgMCA4LjY2NyAyMmMzLjEwOSAwIDUuNzEzLTIuMTMyIDYuNDUxLTUuMDExYTguMjY4IDguMjY4IDAgMCAxLTQuMTE0LTEuMjEyYy4xMDYuMjQ5LjE2My41Mi4xNjMuODA2elwiPjwvcGF0aD48cGF0aCBkPVwiTTE1LjMzMyAyYTYuNjY3IDYuNjY3IDAgMSAwIDAgMTMuMzM0IDYuNjY3IDYuNjY3IDAgMCAwIDAtMTMuMzM0em0yLjUgNWgtMi45MTdhLjQxOC40MTggMCAwIDAgMCAuODM0aC44MzNjMS4xNDkgMCAyLjA4My45MzUgMi4wODMgMi4wODNhMi4wODUgMi4wODUgMCAwIDEtMS42NjcgMi4wNDF2Ljg3NmgtMS42Njd2LS44MzNoLTEuNjY3di0xLjY2N2gyLjkxN2EuNDE3LjQxNyAwIDAgMCAwLS44MzRoLS44MzNhMi4wODUgMi4wODUgMCAwIDEtMi4wODMtMi4wODNjMC0xLjAwNi43MTctMS44NDggMS42NjctMi4wNDFWNC41aDEuNjY3di44MzNoMS42NjdWN3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NvaW4tcmVjZWl2ZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIwLjM2NCAxNS4wNDdhLjguOCAwIDAgMC0uOTE1LS40MmwtNi4xNDcgMS41MzYtMS45NTQtLjk3OC44Mi0uODJhLjgwNi44MDYgMCAwIDAgMC0xLjEzOWwtLjgwNS0uODA1YS44MDQuODA0IDAgMCAwLS44NjctLjE3OWwtMy43MjQgMS40OTF2NS43MDJsNi4zMzYuNzkyYS44OC44OCAwIDAgMCAuMzU1LS4wMzVsNy4yNDEtMi40MTRjLjIyMS0uMDczLjQtLjI0MS40ODgtLjQ1NXMuMDgtLjQ2LS4wMjMtLjY2OWwtLjgwNS0xLjYwOXpcIj48L3BhdGg+PHBhdGggZD1cIk01LjE2MiAxMi45OTNIMy41NTNhLjgwNi44MDYgMCAwIDAtLjgwNS44MDV2NS42MzJjMCAuNDQ1LjM2LjgwNS44MDUuODA1aDEuNjA5Yy40NDUgMCAuODA1LS4zNi44MDUtLjgwNXYtNS42MzJhLjgwNi44MDYgMCAwIDAtLjgwNS0uODA1elwiPjwvcGF0aD48cGF0aCBkPVwiTTE2LjI3NSA2LjE3OWgyLjgxNlY0LjU3aC0xLjYwOXYtLjgwNWgtMS42MDl2Ljg0NWEyLjAxNCAyLjAxNCAwIDAgMC0xLjYwOSAxLjk3MWMwIDEuMTA5LjkwMyAyLjAxMSAyLjAxMSAyLjAxMWguODA1Yy4yMjEgMCAuNDAyLjE4MS40MDIuNDAycy0uMTgxLjQwMi0uNDAyLjQwMmgtMi44MTZ2MS42MDloMS42MDl2LjgwNWgxLjYwOXYtLjg0NWEyLjAxNCAyLjAxNCAwIDAgMCAxLjYwOS0xLjk3MSAyLjAxNCAyLjAxNCAwIDAgMC0yLjAxMS0yLjAxMWgtLjgwNWMtLjIyMSAwLS40MDItLjE4MS0uNDAyLS40MDJzLjE4MS0uNDAyLjQwMi0uNDAyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMzAsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY29kZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjMwXCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDMwIDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE4LjcwMyAxNi4zMmwxLjg1MSAxLjg1MSA2LjE3Mi02LjE3Mi02LjE3Mi02LjE3Mi0xLjg1MSAxLjg1MSA0LjMyIDQuMzJ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTEuMjk3IDcuNjhMOS40NDYgNS44MjlsLTYuMTcyIDYuMTcyIDYuMTcyIDYuMTcyIDEuODUxLTEuODUxLTQuMzItNC4zMnpcIj48L3BhdGg+PHBhdGggZD1cIk0xNi4xODIgNS4wMjhsMS4zNC4zNjUtMy43MDMgMTMuNTc4LTEuMzQtLjM2NSAzLjcwMy0xMy41Nzh6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjbG91ZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE3Ljk4MiAxMC40YzIuMDk2LjE1MiAzLjc3MiAxLjkwNSAzLjc3MiA0LjAzOWE0LjA4MiA0LjA4MiAwIDAgMS00LjA3NyA0LjA3N0g3LjEyMmE0Ljg2MiA0Ljg2MiAwIDAgMS00Ljg3Ny00Ljg3N0E0Ljg3MiA0Ljg3MiAwIDAgMSA2LjU4OSA4LjhDNy42MTggNi44NTcgOS42MzcgNS40ODUgMTIgNS40ODVjMi45NzIgMCA1LjQxMSAyLjA5NiA1Ljk4MiA0LjkxNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2Nsb3VkLXVwbG9hZCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEzLjYzOCAxMi44aDIuNDM5TDEyIDguNzYxIDcuOTIzIDEyLjhoMi40Mzl2My4yNzdoMy4yNzdWMTIuOHptNC4zNDQtMi40YzIuMDk2LjE1MiAzLjc3MiAxLjkwNSAzLjc3MiA0LjAzOWE0LjA4MiA0LjA4MiAwIDAgMS00LjA3NyA0LjA3N0g3LjEyMmE0Ljg2MiA0Ljg2MiAwIDAgMS00Ljg3Ny00Ljg3N0E0Ljg3MiA0Ljg3MiAwIDAgMSA2LjU4OSA4LjhDNy42MTggNi44NTcgOS42MzcgNS40ODUgMTIgNS40ODVjMi45NzIgMCA1LjQxMSAyLjA5NiA1Ljk4MiA0LjkxNXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2Nsb3VkLWRvd25sb2FkJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTYuMDc3IDEyLjhoLTIuNDM5VjkuNTYxaC0zLjI3N1YxMi44SDcuOTIybDQuMDc3IDQuMDc3em0xLjkwNS0yLjRjMi4wOTYuMTUyIDMuNzcyIDEuOTA1IDMuNzcyIDQuMDM5YTQuMDgyIDQuMDgyIDAgMCAxLTQuMDc3IDQuMDc3SDcuMTIyYTQuODYyIDQuODYyIDAgMCAxLTQuODc3LTQuODc3QTQuODcyIDQuODcyIDAgMCAxIDYuNTg5IDguOEM3LjYxOCA2Ljg1NyA5LjYzNyA1LjQ4NSAxMiA1LjQ4NWMyLjk3MiAwIDUuNDExIDIuMDk2IDUuOTgyIDQuOTE1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY2xvdWQtZG9uZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEwLjM2MiAxNi4wNzdsNS4zNzMtNS4zNzMtMS4xNDMtMS4xNDMtNC4yMjkgNC4xOTEtMS42NzctMS42NzctMS4xNDMgMS4xNDN6bTcuNjItNS42NzdjMi4wOTYuMTUyIDMuNzcyIDEuOTA1IDMuNzcyIDQuMDM5YTQuMDgyIDQuMDgyIDAgMCAxLTQuMDc3IDQuMDc3SDcuMTIyYTQuODYyIDQuODYyIDAgMCAxLTQuODc3LTQuODc3QTQuODcyIDQuODcyIDAgMCAxIDYuNTg5IDguOEM3LjYxOCA2Ljg1NyA5LjYzNyA1LjQ4NSAxMiA1LjQ4NWMyLjk3MiAwIDUuNDExIDIuMDk2IDUuOTgyIDQuOTE1elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnQ2xvc2VkLWNhcHRpb24nLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOSA0SDVhMiAyIDAgMCAwLTIgMnYxMmEyIDIgMCAwIDAgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjZjMC0xLjEtLjktMi0yLTJ6bS04IDdIOS41di0uNWgtMnYzaDJWMTNIMTF2MWMwIC41NS0uNDUgMS0xIDFIN2MtLjU1IDAtMS0uNDUtMS0xdi00YzAtLjU1LjQ1LTEgMS0xaDNjLjU1IDAgMSAuNDUgMSAxdjF6bTcgMGgtMS41di0uNWgtMnYzaDJWMTNIMTh2MWMwIC41NS0uNDUgMS0xIDFoLTNjLS41NSAwLTEtLjQ1LTEtMXYtNGMwLS41NS40NS0xIDEtMWgzYy41NSAwIDEgLjQ1IDEgMXYxelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY2xvc2UnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0zLjIwNyA1LjQzNUw1LjM3IDMuMjcyIDE5Ljc4OCAxNy42OWwtMi4xNjMgMi4xNjNMMy4yMDcgNS40MzV6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMy4yMTkgMTcuNjk3TDE3LjYzNCAzLjI5MmwyLjE0MSAyLjE0Mkw1LjM2IDE5LjgzOWwtMi4xNDEtMi4xNDJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjbG9jaycsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTExLjk5IDJDNi40NyAyIDIgNi40OCAyIDEyczQuNDcgMTAgOS45OSAxMEMxNy41MiAyMiAyMiAxNy41MiAyMiAxMlMxNy41MiAyIDExLjk5IDJ6TTEyIDIwYy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHpcIj48L3BhdGg+PHBhdGggZD1cIk0xMi41IDdIMTF2Nmw1LjI1IDMuMTUuNzUtMS4yMy00LjUtMi42N3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NpcmNsZS1maWxsZWQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOS4zMjMgMTJjMCA0LjAyMi0zLjI2MyA3LjI4NC03LjI4NCA3LjI4NFM0Ljc1NSAxNi4wMjEgNC43NTUgMTJzMy4yNjMtNy4yODQgNy4yODQtNy4yODRTMTkuMzIzIDcuOTc5IDE5LjMyMyAxMnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NoZXZyb24tdXAnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yIDE1LjkybDIgMiA4LTggOCA4IDItMi0xMC0xMC0xMCAxMHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NoZXZyb24tcmlnaHQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk04LjA4IDJsLTIgMiA4IDgtOCA4IDIgMiAxMC0xMC0xMC0xMHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NoZXZyb24tbGVmdCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE1LjkyIDIybDItMi04LTggOC04LTItMi0xMCAxMCAxMCAxMHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NoZXZyb24tZG93bicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTIyIDguMDhsLTItMi04IDgtOC04LTIgMiAxMCAxMCAxMC0xMHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDIxLFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NoZXZyb24tY2lyY2xlLXVwJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjFcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjEgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTQuNzg0IDE0LjYyMWwxLjEtMS4xYS42ODMuNjgzIDAgMCAwIDAtLjk3MWwtNC44OTgtNC44OThhLjY4My42ODMgMCAwIDAtLjk3MSAwTDUuMTE3IDEyLjU1YS42ODMuNjgzIDAgMCAwIDAgLjk3MWwxLjEgMS4xYy4yNy4yNy43MDIuMjcuOTcxIDBsMy4zMTItMy4zMTIgMy4zMTIgMy4zMTJjLjI3LjI3LjcwMi4yNy45NzEgMHpNMTguNzg2IDEyYzAgNC41NzUtMy43MTEgOC4yODYtOC4yODYgOC4yODZTMi4yMTQgMTYuNTc1IDIuMjE0IDEyIDUuOTI1IDMuNzE0IDEwLjUgMy43MTQgMTguNzg2IDcuNDI1IDE4Ljc4NiAxMnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDIxLFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NoZXZyb24tY2lyY2xlLXJpZ2h0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjFcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjEgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNOS45NTEgMTcuMzg0bDQuODk4LTQuODk4YS42ODMuNjgzIDAgMCAwIDAtLjk3MUw5Ljk1MSA2LjYxN2EuNjgzLjY4MyAwIDAgMC0uOTcxIDBsLTEuMSAxLjFhLjY4My42ODMgMCAwIDAgMCAuOTcxTDExLjE5MiAxMiA3Ljg4IDE1LjMxMmEuNjgzLjY4MyAwIDAgMCAwIC45NzFsMS4xIDEuMWMuMjcuMjcuNzAyLjI3Ljk3MSAwek0xOC43ODYgMTJjMCA0LjU3NS0zLjcxMSA4LjI4Ni04LjI4NiA4LjI4NlMyLjIxNCAxNi41NzUgMi4yMTQgMTIgNS45MjUgMy43MTQgMTAuNSAzLjcxNCAxOC43ODYgNy40MjUgMTguNzg2IDEyelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjEsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY2hldnJvbi1jaXJjbGUtbGVmdCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIxXCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDIxIDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTEyLjAyMiAxNy4zODRsMS4xLTEuMWEuNjgzLjY4MyAwIDAgMCAwLS45NzFMOS44MSAxMi4wMDFsMy4zMTItMy4zMTJhLjY4My42ODMgMCAwIDAgMC0uOTcxbC0xLjEtMS4xYS42ODMuNjgzIDAgMCAwLS45NzEgMGwtNC44OTggNC44OThhLjY4My42ODMgMCAwIDAgMCAuOTcxbDQuODk4IDQuODk4Yy4yNy4yNy43MDIuMjcuOTcxIDB6TTE4Ljc4NiAxMmMwIDQuNTc1LTMuNzExIDguMjg2LTguMjg2IDguMjg2UzIuMjE0IDE2LjU3NSAyLjIxNCAxMiA1LjkyNSAzLjcxNCAxMC41IDMuNzE0IDE4Ljc4NiA3LjQyNSAxOC43ODYgMTJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyMSxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjaGV2cm9uLWNpcmNsZS1kb3duJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjFcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjEgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTAuOTg2IDE2LjM0OGw0Ljg5OC00Ljg5OGEuNjgzLjY4MyAwIDAgMCAwLS45NzFsLTEuMS0xLjFhLjY4My42ODMgMCAwIDAtLjk3MSAwbC0zLjMxMiAzLjMxMi0zLjMxMi0zLjMxMmEuNjgzLjY4MyAwIDAgMC0uOTcxIDBsLTEuMSAxLjFhLjY4My42ODMgMCAwIDAgMCAuOTcxbDQuODk4IDQuODk4Yy4yNy4yNy43MDIuMjcuOTcxIDB6bTcuOC00LjM0OGMwIDQuNTc1LTMuNzExIDguMjg2LTguMjg2IDguMjg2UzIuMjE0IDE2LjU3NSAyLjIxNCAxMiA1LjkyNSAzLjcxNCAxMC41IDMuNzE0IDE4Ljc4NiA3LjQyNSAxOC43ODYgMTJ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjaGVja21hcmsnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yMS43NDggNi4zOThsLTEuNjAxLTEuNjAxYS43NTQuNzU0IDAgMCAwLTEuMDY3IDBsLTkuNTk2IDkuNTk2LTQuNTY1LTQuNTk3YS43NTQuNzU0IDAgMCAwLTEuMDY3IDBsLTEuNiAxLjYwMWEuNzU0Ljc1NCAwIDAgMCAwIDEuMDY3bDYuNjkzIDYuNzM4YS43NTQuNzU0IDAgMCAwIDEuMDY3IDBMMjEuNzQ4IDcuNDY1YS43NTQuNzU0IDAgMCAwIDAtMS4wNjd6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjaGVja21hcmstMCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTkuNzM4IDIwLjAwOGwtNy44NTQtNy43MzEgMy44OTctMy44MzUgMy45NTcgMy44OTYgOC40ODEtOC4zNDcgMy44OTcgMy44MzVMOS43MzkgMjAuMDA4em0tNS43MTUtNy43MjlsNS43MTUgNS42MjVMMTkuOTc3IDcuODI3bC0xLjc1OC0xLjczLTguNDgxIDguMzQ3LTMuOTU3LTMuODk2LTEuNzU3IDEuNzN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjaGF0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTkgM0g1YTIgMiAwIDAgMC0yIDJ2OGEyIDIgMCAwIDAgMiAyaDEuN3Y2bDYtNkgxOWEyIDIgMCAwIDAgMi0yVjVhMiAyIDAgMCAwLTItMnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NoYXQtY29udmVyc2F0aW9uJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTAuNzQgMTMuMThhNCA0IDAgMCAxLTQtNHYtLjQ1SDVhMiAyIDAgMCAwLTIgMnY0LjE3YTIgMiAwIDAgMCAyIDJoLjUxVjIxbDQuMDktNC4wOWgzLjY1YTIgMiAwIDAgMCAyLTJsLTEuNzEtMS43MXpcIj48L3BhdGg+PHBhdGggZD1cIk0xNS4yNyAxMC43NHYxLjMxbDMuMjEgMy4yMXYtNC4wOEgxOWEyIDIgMCAwIDAgMi0yVjVhMiAyIDAgMCAwLTItMmgtOC4yNmEyIDIgMCAwIDAtMiAydjMuNzNIMTMuMjdhMiAyIDAgMCAxIDIgMnYuMDExLS4wMDF6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTAuNzQgMTEuMThoMy42NWwuODguODh2LTEuMzJhMiAyIDAgMCAwLTItMkg4Ljczdi40NGEyIDIgMCAwIDAgMiAyaC4wMTEtLjAwMXpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2Nhc3QnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yLjIwOCAxMC4yMDhDNy41ODMgMTAuMjA4IDEyIDE0LjU4MyAxMiAyMGgtMS43OTJjMC00LjQxNy0zLjU4My04LTgtOHYtMS43OTJ6bTAgMy41ODRjMy40NTggMCA2LjI1IDIuNzUgNi4yNSA2LjIwOEg2LjY2NmMwLTIuNDU4LTItNC40NTgtNC40NTgtNC40NTh2LTEuNzV6bTAgMy41NDFBMi42ODYgMi42ODYgMCAwIDEgNC44NzUgMjBIMi4yMDh2LTIuNjY3ek0yMCA0Yy45NTggMCAxLjc5Mi44MzMgMS43OTIgMS43OTJ2MTIuNDE3YzAgLjk1OC0uODMzIDEuNzkyLTEuNzkyIDEuNzkyaC02LjIwOHYtMS43OTJIMjBWNS43OTJINHYyLjY2N0gyLjIwOFY1Ljc5MkMyLjIwOCA0LjgzNCAzLjA0MSA0IDQgNGgxNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NhcmV0LXVwJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTggMTVINmw2LTZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjYXJldC1yaWdodCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTkgMThWNmw2IDZ6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjYXJldC1sZWZ0JyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTUgNnYxMmwtNi02elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY2FyZXQtZG93bicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTYgOWgxMmwtNiA2elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY2FsZW5kYXInLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOSA1aC0xVjMuMDVoLTNWNUg5VjMuMDVINS45NVY1SDVhMiAyIDAgMCAwLTIgMnYxMmEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWN2EyIDIgMCAwIDAtMi0yem0tMi45NC0xaDF2Mi44NmgtMXpNNyA0aDF2Mi44Nkg3em0xMiAxNUg1VjloMTR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNi45NSAxMC45NGgyLjA2VjEzSDYuOTV2LTIuMDZ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTEgMTAuOTRoMi4wNlYxM0gxMXYtMi4wNnpcIj48L3BhdGg+PHBhdGggZD1cIk0xNC45NyAxMC45NGgyLjA2VjEzaC0yLjA2di0yLjA2elwiPjwvcGF0aD48cGF0aCBkPVwiTTYuOTUgMTQuOTdoMi4wNnYyLjA2SDYuOTV2LTIuMDZ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTEgMTQuOTdoMi4wNnYyLjA2SDExdi0yLjA2elwiPjwvcGF0aD48cGF0aCBkPVwiTTE0Ljk3IDE0Ljk3aDIuMDZ2Mi4wNmgtMi4wNnYtMi4wNnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NhbGVuZGFyLXJlbW92ZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE5IDVoLTFWMy4wNWgtM1Y1SDlWMy4wNUg1Ljk1VjVINWEyIDIgMCAwIDAtMiAydjEyYTIgMiAwIDAgMCAyIDJoMTRhMiAyIDAgMCAwIDItMlY3YTIgMiAwIDAgMC0yLTJ6bS0yLjk0LTFoMXYyLjg2aC0xek03IDRoMXYyLjg2SDd6bTEyIDE1SDVWOWgxNHpcIj48L3BhdGg+PHBhdGggZD1cIk04Ljg1IDEzSDE1djEuODlIOC44NVYxM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NhbGVuZGFyLW5vdGUnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOSA1aC0xVjMuMDVoLTNWNUg5VjMuMDVINS45NVY1SDVhMiAyIDAgMCAwLTIgMnYxMmEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWN2EyIDIgMCAwIDAtMi0yem0tMi45NC0xaDF2Mi44NmgtMXpNNyA0aDF2Mi44Nkg3em0xMiAxNUg1VjloMTR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNy4wMyAxMS4wM2g5Ljk4djJINy4wM3YtMnpcIj48L3BhdGg+PHBhdGggZD1cIk03LjAzIDE1LjA5SDEydjJINy4wM3YtMnpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NhbGVuZGFyLWRlbGV0ZScsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE5IDVoLTFWMy4wNWgtM1Y1SDlWMy4wNUg1Ljk1VjVINWEyIDIgMCAwIDAtMiAydjEyYTIgMiAwIDAgMCAyIDJoMTRhMiAyIDAgMCAwIDItMlY3YTIgMiAwIDAgMC0yLTJ6bS0yLjk0LTFoMXYyLjg2aC0xek03IDRoMXYyLjg2SDd6bTEyIDE1SDVWOWgxNHpcIj48L3BhdGg+PHBhdGggZD1cIk0xMC4yNiAxNi45NGwxLjY2LTEuNjYgMS42NyAxLjY3IDEuNDUtMS40NS0xLjY3LTEuNjcgMS41OC0xLjU4LTEuMzMtMS4zMy0xLjU4IDEuNTctMS41OS0xLjU5TDkgMTIuMzVsMS41OSAxLjYtMS42NiAxLjY2IDEuMzMgMS4zM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2NhbGVuZGFyLWNoZWNrJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMTYuNTU5IDExLjcxNmwtNiA1Ljk1LTMuMTUtMy4xNzggMS4wODEtMS4wODEgMi4xMDkgMi4xMDkgNC44NjktNC44NTl6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTkgNWgtMVYzLjA1aC0zVjVIOVYzLjA1SDUuOTVWNUg1Yy0xLjEwMyAwLTIgLjg5Ny0yIDJ2MTJjMCAxLjEwMy44OTcgMiAyIDJoMTRjMS4xMDMgMCAyLS44OTcgMi0yVjdjMC0xLjEwMy0uODk3LTItMi0yem0tMi45NDEtMWgxdjIuODU5aC0xVjR6TTcgNGgxdjIuODU5SDdWNHptMTIgMTVINVY5aDE0djEwelwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY2FsZW5kYXItYmxhbmsnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOSA1aC0xVjMuMDVoLTNWNUg5VjMuMDVINS45NVY1SDVhMiAyIDAgMCAwLTIgMnYxMmEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWN2EyIDIgMCAwIDAtMi0yem0tMi45NC0xaDF2Mi44NmgtMXpNNyA0aDF2Mi44Nkg3em0xMiAxNUg1VjloMTR6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdjYWxlbmRhci1hZGQnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xOSA1aC0xVjMuMDVoLTNWNUg5VjMuMDVINS45NVY1SDVhMiAyIDAgMCAwLTIgMnYxMmEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWN2EyIDIgMCAwIDAtMi0yem0tMi45NC0xaDF2Mi44NmgtMXpNNyA0aDF2Mi44Nkg3em0xMiAxNUg1VjloMTR6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTAuODcgMTYuOTNoMi4wNnYtMi4wNEgxNVYxM2gtMi4wN3YtMi4wNmgtMi4wNlYxM0g4Ljg1djEuODloMi4wMnYyLjA0elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnY2FsY3VsYXRvcicsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTE0IDVoMnYyaC0yVjV6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTcgMkg3Yy0xLjEwMyAwLTIgLjg5OC0yIDJ2MTZjMCAxLjEwMy44OTcgMiAyIDJoMTBjMS4xMDQgMCAyLS44OTcgMi0yVjRjMC0xLjEwMi0uODk2LTItMi0yek04IDE5YTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMnptMC0zYTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMnptMC0zYTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMnptNCA2YTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMnptMC0zYTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMnptMC0zYTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMnptNCA2YTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMnptMC0zYTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMnptMC0zYTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMnptLjk5OS01SDdWNGgxMGwtLjAwMSA0elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnYnVzaW5lc3MtZ3JhcGgtcGllJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMjIuMDAyIDExYzAtNC45NjEtNC4wMzctOS05LTloLTF2MTBoMTB2LTF6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTAgMTMuMDAxVjQuMDYybC0uMTI0LjAxNkE5LjAwNiA5LjAwNiAwIDAgMCAyIDEzYzAgNC45NjMgNC4wMzcgOSA5IDlhOC45OSA4Ljk5IDAgMCAwIDUuNzc1LTIuMTAxbC4wNjYtLjA1N0wxMCAxMy4wMDF6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTMuNTg3IDE0LjAwMWw3LjA2OSA3LjA3MS43MDgtLjcwOEE4Ljk0MiA4Ljk0MiAwIDAgMCAyNCAxNC4wMDFIMTMuNTg3elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdHlsZSc6ICdjb2xvcmVkJyxcbiAgICAgICAgJ3dpZHRoJzogMjQsXG4gICAgICAgICdoZWlnaHQnOiAyNCxcbiAgICAgICAgJ3RhZ3MnOiAnJyxcbiAgICAgICAgJ25hbWUnOiAnYnVzaW5lc3MtZ3JhcGgtYmFyJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNMiAyMGgyMHYySDJ2LTJ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTAgMTNoNHY2aC00di02elwiPjwvcGF0aD48cGF0aCBkPVwiTTE2IDdoNHYxMmgtNFY3elwiPjwvcGF0aD48cGF0aCBkPVwiTTQgMTFoNHY4SDR2LTh6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdidXNpbmVzcy1ncmFwaC1iYXItc3RhdHVzJyxcbiAgICAgICAgJ2NvbnRlbnQnOiAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48ZyBjbGFzcz1cImZrLWljb24td3JhcHBlclwiPjxwYXRoIGQ9XCJNNSA3Yy4zNjUgMCAuNzA0LS4xMDUuOTk5LS4yNzdsNC4wMDIgMi4yODhBMiAyIDAgMCAwIDE0IDljMC0uMTc4LS4wMzEtLjM0Ni0uMDc0LS41MTFsNC41NjMtNC41NjNjLjE2My4wNDQuMzMzLjA3NC41MTEuMDc0YTIgMiAwIDEgMC0yLTJjMCAuMTc4LjAzMS4zNDguMDc0LjUxM2wtNC41NjMgNC41NjJBMS45OTYgMS45OTYgMCAwIDAgMTIgN2MtLjM2NSAwLS43MDQuMTA1LS45OTkuMjc4TDYuOTk5IDQuOTkyQTIgMiAwIDEgMCA1IDd6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMiAyMmgyMHYySDJ2LTJ6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTAgMTVoNHY2aC00di02elwiPjwvcGF0aD48cGF0aCBkPVwiTTE2IDloNHYxMmgtNFY5elwiPjwvcGF0aD48cGF0aCBkPVwiTTQgMTNoNHY4SDR2LTh6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdidXNpbmVzcy1ncmFwaC1iYXItaW5jcmVhc2UnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yIDIyaDIwdjJIMnYtMnpcIj48L3BhdGg+PHBhdGggZD1cIk0xMCAxM2g0djhoLTR2LTh6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTYgOWg0djEyaC00Vjl6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNCAxN2g0djRINHYtNHpcIj48L3BhdGg+PHBhdGggZD1cIk0zLjcwNyAxNC43MDhMMTUgMy40MTVWNmgyVjBoLTZ2MmgyLjU4NkwyLjI5MyAxMy4yOTN6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdidXNpbmVzcy1ncmFwaC1iYXItZGVjcmVhc2UnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0yIDIyaDIwdjJIMnYtMnpcIj48L3BhdGg+PHBhdGggZD1cIk0xMCAxM2g0djhoLTR2LTh6XCI+PC9wYXRoPjxwYXRoIGQ9XCJNNCA5aDR2MTJINFY5elwiPjwvcGF0aD48cGF0aCBkPVwiTTE2IDE3aDR2NGgtNHYtNHpcIj48L3BhdGg+PHBhdGggZD1cIk0yMCA5djIuNTg3TDguNzA3LjI5NCA3LjI5MyAxLjcwOCAxOC41ODYgMTNIMTZ2Mmg2Vjl6XCI+PC9wYXRoPjwvZz48L3N2Zz4nLFxuICAgICAgICAnc2V0X2lkJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0eWxlJzogJ2NvbG9yZWQnLFxuICAgICAgICAnd2lkdGgnOiAyNCxcbiAgICAgICAgJ2hlaWdodCc6IDI0LFxuICAgICAgICAndGFncyc6ICcnLFxuICAgICAgICAnbmFtZSc6ICdib3JkZXItdmVydGljYWwnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNSAxMi45ODR2LTEuOTY5aDIuMDE2djEuOTY5SDE1ek0xNSAyMXYtMi4wMTZoMi4wMTZWMjFIMTV6bTAtMTUuOTg0VjNoMi4wMTZ2Mi4wMTZIMTV6TTE4Ljk4NCA5VjYuOTg0SDIxVjloLTIuMDE2em0wLTZIMjF2Mi4wMTZoLTIuMDE2VjN6bTAgOS45ODR2LTEuOTY5SDIxdjEuOTY5aC0yLjAxNnptMCA4LjAxNnYtMi4wMTZIMjFWMjFoLTIuMDE2em0tNy45NjggMFYzaDEuOTY5djE4aC0xLjk2OXptNy45NjgtMy45ODRWMTVIMjF2Mi4wMTZoLTIuMDE2em0tMTItMTJWM0g5djIuMDE2SDYuOTg0ek0zIDE3LjAxNlYxNWgyLjAxNnYyLjAxNkgzek0zIDIxdi0yLjAxNmgyLjAxNlYyMUgzem0wLTguMDE2di0xLjk2OWgyLjAxNnYxLjk2OUgzem0zLjk4NCAwdi0xLjk2OUg5djEuOTY5SDYuOTg0em0wIDguMDE2di0yLjAxNkg5VjIxSDYuOTg0ek0zIDUuMDE2VjNoMi4wMTZ2Mi4wMTZIM3pNMyA5VjYuOTg0aDIuMDE2VjlIM3pcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2JvcmRlci10b3AnLFxuICAgICAgICAnY29udGVudCc6ICc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxnIGNsYXNzPVwiZmstaWNvbi13cmFwcGVyXCI+PHBhdGggZD1cIk0xNSAxMi45ODR2LTEuOTY5aDIuMDE2djEuOTY5SDE1ek0xOC45ODQgMjF2LTIuMDE2SDIxVjIxaC0yLjAxNnpNMTEuMDE2IDlWNi45ODRoMS45NjlWOWgtMS45Njl6TTE1IDIxdi0yLjAxNmgyLjAxNlYyMUgxNXptMy45ODQtMy45ODRWMTVIMjF2Mi4wMTZoLTIuMDE2ek0zIDNoMTh2Mi4wMTZIM1Yzem0xNS45ODQgOS45ODR2LTEuOTY5SDIxdjEuOTY5aC0yLjAxNnptMC0zLjk4NFY2Ljk4NEgyMVY5aC0yLjAxNnptLTcuOTY4IDguMDE2VjE1aDEuOTY5djIuMDE2aC0xLjk2OXpNMyA5VjYuOTg0aDIuMDE2VjlIM3ptMCAzLjk4NHYtMS45NjloMi4wMTZ2MS45NjlIM3pNMyAyMXYtMi4wMTZoMi4wMTZWMjFIM3ptMC0zLjk4NFYxNWgyLjAxNnYyLjAxNkgzek0xMS4wMTYgMjF2LTIuMDE2aDEuOTY5VjIxaC0xLjk2OXptMC04LjAxNnYtMS45NjloMS45Njl2MS45NjloLTEuOTY5em0tNC4wMzIgMHYtMS45NjlIOXYxLjk2OUg2Ljk4NHptMCA4LjAxNnYtMi4wMTZIOVYyMUg2Ljk4NHpcIj48L3BhdGg+PC9nPjwvc3ZnPicsXG4gICAgICAgICdzZXRfaWQnOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3R5bGUnOiAnY29sb3JlZCcsXG4gICAgICAgICd3aWR0aCc6IDI0LFxuICAgICAgICAnaGVpZ2h0JzogMjQsXG4gICAgICAgICd0YWdzJzogJycsXG4gICAgICAgICduYW1lJzogJ2JvcmRlci1yaWdodCcsXG4gICAgICAgICdjb250ZW50JzogJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGcgY2xhc3M9XCJmay1pY29uLXdyYXBwZXJcIj48cGF0aCBkPVwiTTExLjAxNiA5VjYuOTg0aDEuOTY5VjloLTEuOTY5em0wLTMuOTg0VjNoMS45Njl2Mi4wMTZoLTEuOTY5em0wIDcuOTY4di0xLjk2OWgxLjk2OXYxLjk2OWgtMS45Njl6TTE1IDUuMDE2VjNoMi4wMTZ2Mi4wMTZIMTV6TTE1IDIxdi0yLjAxNmgyLjAxNlYyMUgxNXptMy45ODQtMThIMjF2MThoLTIuMDE2VjN6TTE1IDEyLjk4NHYtMS45NjloMi4wMTZ2MS45NjlIMTV6bS0zLjk4NCA0LjAzMlYxNWgxLjk2OXYyLjAxNmgtMS45Njl6TTMgOVY2Ljk4NGgyLjAxNlY5SDN6bTAgOC4wMTZWMTVoMi4wMTZ2Mi4wMTZIM3ptMC00LjAzMnYtMS45NjloMi4wMTZ2MS45NjlIM3pNMTEuMDE2IDIxdi0yLjAxNmgxLjk2OVYyMWgtMS45Njl6TTMgMjF2LTIuMDE2aDIuMDE2VjIxSDN6bTMuOTg0LTguMDE2di0xLjk2OUg5djEuOTY5SDYuOTg0em0wLTcuOTY4VjNIOXYyLjAxNkg2Ljk4NHpNMyA1LjAxNlYzaDIuMDE2djIuMDE2SDN6TTYuOTg0IDIxdi0yLjAxNkg5VjIxSDYuOTg0elwiPjwvcGF0aD48L2c+PC9zdmc+JyxcbiAgICAgICAgJ3NldF9pZCc6IDFcbiAgICAgIH1cbiAgICBdLFxuICAgICdzZXRzJzogW10sXG4gICAgJ2dyb3Vwcyc6IFtdXG4gIH1cblxuICAvLyBjb25zb2xlLmxvZygnVGVzdGluZzogJyt0aGVVY29ucy5pY29uc1sxXS5uYW1lKVxuICB1Y29uc09iakFycmF5ID0gdGhlVWNvbnMuaWNvbnNcbiAgaWYgKG9wdGlvbnMuY29uc29sZU1lc3NhZ2VzID09PSB0cnVlKSBjb25zb2xlLmluZm8oJ1VzaW5nOiAnK2ljb25ET01FbGVtZW50KydbJytpbmpBdHRyKyddJysgJyB0byBmaW5kIGluamVjdGFibGUgZWxlbWVudHMuLi4nKVxuXG4gIC8vIGxvb2sgYXQgdGhlIGljb24gc3JjIGF0dHJpYnV0ZSBmb3IgdGhlIHN2ZyBpY29uIG5hbWUgYW5kIGNvbmNhdFxuICAvLyB3aXRoIHN1cnJvdW5kaW5nIHRleHQgaW4gdGhlIGFyck9ialNWR0RhdGFzXG4gIGRvY0Vscy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgYXJyT2JqU1ZHRGF0YSA9IG5vZGU7XG4gICAgYXR0eVZhbCA9IGFyck9ialNWR0RhdGEuZ2V0QXR0cmlidXRlKFtpbmpBdHRyXSlcbiAgICBzdmdJZCA9IGF0dHlWYWxcblxuICAgIC8vIHNlYXJjaCB0aGUgYXJyYXkgZm9yIHRoZSBpZFxuICAgIGZ1bmN0aW9uIHNlYXJjaElESW5TVkdzIChzdmdJZCwgdWNvbnNPYmpBcnJheSkge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB1Y29uc09iakFycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICh1Y29uc09iakFycmF5W2pdLm5hbWUgPT09IHN2Z0lkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7dWNvbnNPYmpBcnJheVtqXS5uYW1lfSA9ICR7c3ZnSWR9YClcbiAgICAgICAgICByZXR1cm4galxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG5cbiAgICAvLyBjYWxsIHRoZSBmdW5jdGlvbiBhYm92ZSBwYXNzaW5nIHRoZSBhcnJheSBhbmQgaWQgbmVlZGVkXG4gICAgc3ZnSW5kZXggPSBzZWFyY2hJREluU1ZHcyhzdmdJZCwgdWNvbnNPYmpBcnJheSlcbiAgICBpZiAoc3ZnSW5kZXggPT09IC0xKSB7IC8vIGhhbmRsZSBlbXB0eS9pbmNvcnJlY3QgdmFsdWVcbiAgICAgIHN2Z1RhZyA9ICc8IS0tIENvdWxkIG5vdCBmaW5kICcrc3ZnSWQrJ30gLS0+J1xuICAgICAgc3ZnVGFnU3RhdHVzID0gJ2ZhaWxlZCdcbiAgICB9IGVsc2Uge1xuICAgICAgc3ZnVGFnID0gdWNvbnNPYmpBcnJheVtzdmdJbmRleF0uY29udGVudFxuICAgICAgc3ZnVGFnU3RhdHVzID0gJ3N1Y2Nlc3MnXG4gICAgfVxuXG4gICAgLy8gYXNzaWduIHZhbHVlcyB0byB0aGVzZSB2YXJpYWJsZXMgaW4gcHJlcGFyYXRpb24gdG8gYnVpbGQgdGhlIHN2ZyBpY29uXG4gICAgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGljb25ET01FbGVtZW50KydbJytpbmpBdHRyKyddJyk7XG4gICAgbmV3RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdmcnKTtcbiAgICBuZXdFbC5pbm5lckhUTUwgPSBzdmdUYWc7XG4gICAgZWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3RWwsIGVsKTtcbiAgICBuZXdFbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYXJyT2JqU1ZHRGF0YS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykpO1xuXG4gICAgLy8gY3JlYXRlIHF1aWNrIHJlcG9ydCBvbiBzdWNjZXNzZnVsIGluamVjdGlvbnNcbiAgICBpbmplY3RDb3VudGVyLnB1c2goc3ZnSWQsIHN2Z1RhZ1N0YXR1cyk7XG4gICAgaWYgKG9wdGlvbnMuY29uc29sZU1lc3NhZ2VzID09IHRydWUpIGNvbnNvbGUuaW5mbyhzdmdJZCwgc3ZnVGFnU3RhdHVzKTtcbiAgfSk7XG4gIC8vIGZpbmlzaCByZXBvcnQgZ2xvYmFsbHlcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgaW5qZWN0Q291bnRlci5sZW5ndGg7ICsraSkge1xuICAgIGlmKGluamVjdENvdW50ZXJbaV0gPT0gJ3N1Y2Nlc3MnKVxuICAgICAgaW5qZWN0Q291bnQrKztcbiAgfVxuXG4gIHRvdGFsSW5qZWN0YWJsZUVscyA9IGRvY0Vscy5sZW5ndGhcbiAgc3VjY2Vzc2Z1bEluamVjdHMgPSBpbmplY3RDb3VudFxuICBpZiAob3B0aW9ucy5jb25zb2xlTWVzc2FnZXMgPT0gdHJ1ZSkgY29uc29sZS5pbmZvKCdTdWNjZXNzZnVsbHkgaW5qZWN0ZWQgJyArc3VjY2Vzc2Z1bEluamVjdHMrICcgb3V0IG9mICcrdG90YWxJbmplY3RhYmxlRWxzKycgcmVxdWVzdGVkLiBTZWUgaW5qZWN0Q291bnRlciBhcnJheSBiZWxvdy4nKTtcbiAgaWYgKG9wdGlvbnMuY29uc29sZU1lc3NhZ2VzID09IHRydWUpIGNvbnNvbGUuaW5mbyhKU09OLnN0cmluZ2lmeShpbmplY3RDb3VudGVyKSk7XG5cbiAgLy8gb3B0aW9uYWwgY3JlYXRlIGEgbGlzdCBvZiBpY29uc1xuICAvLyBjaGVjayB0byBzZWUgaWYgZ2FsbGVyeSBlbmFibGVkXG4gIHdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoaW5pdEdhbGxlcnkgPT0gdHJ1ZSkge1xuICAgICAgVWNvbkdhbGxlcnkodGhlVWNvbnMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBVY29uR2FsbGVyeSh1Y29uc09iakFycmF5KSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBsaXN0IGVsZW1lbnQ6XG4gICAgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuVWNvbkdhbGxlcnlJRClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVjb25zT2JqQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIENyZWF0ZSB0aGUgbGlzdCBpdGVtOlxuICAgICAgZGl2aSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGRpdmkuY2xhc3NOYW1lID0gJ2ZrLWljb24tYm94IGZrLWJwJ1xuICAgICAgaXRlbS5jbGFzc05hbWUgPSAnZmstaWNvbi1ib3hfX2NvbnRhaW5lciBmay1icCdcbiAgICAgIGdhbGxlcnlTVkcgPSB1Y29uc09iakFycmF5W2ldLmNvbnRlbnRcbiAgICAgIC8vIG9yaWdpbmFsIGxpbmUgYmVsb3cgd2FzOiBuZXcgUmVnRXhwKC8oaWQ9XCIoLio/KShcXFwiKSkvZy5leGVjKGdhbGxlcnlTVkcpWzJdKVxuICAgICAgLy8gIGNoYW5nZSBkdWUgdG8gZXNsaW50IHVubmVjZXNzYXJ5IGVzY2FwZSBjaGFyYWN0ZXIgXFwgKi9cbiAgICAgIC8vIGlkUmVnZXggPSBuZXcgUmVnRXhwKC8oaWQ9XCIoLio/KShcIikpL2cuZXhlYyhnYWxsZXJ5U1ZHKVsyXSlcbiAgICAgIC8vIHN2Z05hbWUgPSBnYWxsZXJ5U1ZHLm1hdGNoKGlkUmVnZXgpXG4gICAgICBzdmdOYW1lID0gdWNvbnNPYmpBcnJheVtpXS5uYW1lXG4gICAgICAvLyBjb25zb2xlLmxvZyhzdmdOYW1lKVxuICAgICAgLy8gU2V0IGRpdmkgY29udGVudHM6XG4gICAgICBkaXZpLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiZmstaWNvbi1zaXplclwiPicgKyBnYWxsZXJ5U1ZHICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJmay1pY29uLWJveF9fdGl0bGUgdGV4dC1jZW50ZXJcIj48c3BhbiBjbGFzcz1cImg0XCI+JyArIHN2Z05hbWUgKyAnPC9zcGFuPjwvZGl2PidcblxuICAgICAgLy8gQWRkIGl0IHRvIHRoZSBsaXN0OlxuICAgICAgbGlzdC5hcHBlbmRDaGlsZChpdGVtKVxuICAgICAgaXRlbS5hcHBlbmRDaGlsZChkaXZpKVxuICAgICAgLy8gcmV0dXJuIGxpc3RcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5jb25zb2xlTWVzc2FnZXMgPT09IHRydWUpIGNvbnNvbGUuaW5mbygndGhlIHVjb24gZ2FsbGVyeSBvcHRpb24gc2F5cycgKyBzaG93R2FsbGVyeSlcbiAgfVxuXG5cbiAgaWYgKG9wdGlvbnMuY29uc29sZU1lc3NhZ2VzID09PSB0cnVlKSBjb25zb2xlLmluZm8oXG4gICAgJ1RoYW5rIHlvdSBmb3IgdXNpbmcgdGhlIFVjb24gSWNvbiBGYW1pbHkuIFBvd2VyZWQgYnk6JyxcbiAgICAnVGhlIEZhbm5pZSBNYWUgJyArIE5BTUUsXG4gICAgJ1ZlcnNpb246ICcgKyBWRVJTSU9OKVxuXG4gIHJldHVybiBVY29uSW5qZWN0b3JcblxufSh3aW5kb3csIGRvY3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBVY29uSW5qZWN0b3IiXX0=
