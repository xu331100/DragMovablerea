(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.drag = factory());
})(this, (function () { 'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var defineProperty = createCommonjsModule(function (module) {
	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }
	  return obj;
	}
	module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _defineProperty = unwrapExports(defineProperty);

	var classCallCheck = createCommonjsModule(function (module) {
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _classCallCheck = unwrapExports(classCallCheck);

	var createClass = createCommonjsModule(function (module) {
	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}
	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  Object.defineProperty(Constructor, "prototype", {
	    writable: false
	  });
	  return Constructor;
	}
	module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _createClass = unwrapExports(createClass);

	function styleInject(css, ref) {
	  if ( ref === void 0 ) ref = {};
	  var insertAt = ref.insertAt;

	  if (!css || typeof document === 'undefined') { return; }

	  var head = document.head || document.getElementsByTagName('head')[0];
	  var style = document.createElement('style');
	  style.type = 'text/css';

	  if (insertAt === 'top') {
	    if (head.firstChild) {
	      head.insertBefore(style, head.firstChild);
	    } else {
	      head.appendChild(style);
	    }
	  } else {
	    head.appendChild(style);
	  }

	  if (style.styleSheet) {
	    style.styleSheet.cssText = css;
	  } else {
	    style.appendChild(document.createTextNode(css));
	  }
	}

	var css_248z = ".drag-container{\r\n    display: flex;\r\n    font-size: 14px;   \r\n}\r\n.left-menu{\r\n    width: 200px;\r\n}\r\n.right-con{\r\n    flex: 1;\r\n    border: solid 1px #dedede;\r\n    margin-left: 10px;\r\n    overflow-y: auto;\r\n    overflow-x: auto;\r\n}\r\n.move-div{\r\n    width: 100px;\r\n    height: 100px;\r\n    border: solid 1px #008000;\r\n    position: absolute;\r\n    cursor: move;\r\n}\r\n.zoom-wrapper{\r\n    position: relative;\r\n    overflow: hidden;\r\n    min-height: 100%;\r\n}\r\n.close-div{\r\n    width: 20px;\r\n    height: 20px;\r\n    position: absolute;\r\n    cursor: pointer;\r\n    top: -23px;\r\n    right: -23px;\r\n    background: #c00000;\r\n    border-radius: 50%;\r\n    text-align: center;\r\n    line-height: 20px;\r\n}\r\n.close-div:after{\r\n    content: '\\00D7';\r\n    font-size: 16px;\r\n    color: #fff;\r\n}";
	styleInject(css_248z);

	function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
	function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
	var Drag = /*#__PURE__*/function () {
	  function Drag(name) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    _classCallCheck(this, Drag);
	    if (!name) {
	      throw new Error('The provided selector is empty');
	    }
	    this.pel = document.querySelector(name);
	    this.el = this.pel.querySelector(name + '> div');
	    this.scale = typeof options.scale !== 'undefined' ? options.scale : 1;
	    this.isClick = typeof options.isClick !== 'undefined' ? options.isClick : true; // 是否支持点击事件添加
	    this.moveDivClass = options.moveDivClass || '.move-div';
	    this.delIconClass = options.delIconClass || '.close-div';
	    this.getMoveData = options.getMoveData; // 获取moveData回调函数
	    this.moveData = []; // 存储放置的各个div位置信息
	    this.init(this.pel);
	  }
	  _createClass(Drag, [{
	    key: "isMobile",
	    value: function isMobile() {
	      var mobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
	      return mobile != null;
	    }
	  }, {
	    key: "init",
	    value: function init(el) {
	      var _this = this;
	      if (this.isMobile()) {
	        document.ontouchend = function () {
	          // console.log('ontouchmove')
	          _this.el.ontouchmove = null;
	        };
	      } else {
	        document.addEventListener('dragover', function (e) {
	          e.preventDefault();
	        });
	        el.addEventListener('drop', function (ev) {
	          var text = ev.dataTransfer.getData('Text');
	          if (!ev || !text) {
	            return;
	          }
	          var data = text.indexOf('{') !== -1 ? JSON.parse(text) : text;
	          _this.moveData.push({
	            x: ev.offsetX,
	            y: ev.offsetY,
	            data: data
	          });
	          _this.getMoveData(JSON.parse(JSON.stringify(_this.moveData)));
	          _this.nextTick(function () {
	            _this.updatePosLimit(_this.moveData.length - 1);
	            _this.bindMoveDivEvent(_this.moveData.length - 1);
	          });
	        });
	        document.onmouseup = function () {
	          // console.log('  .onmouseup')
	          _this.el.onmousemove = null;
	        };
	      }
	      this.setScale(this.scale);
	      this.initMoveData();
	    }
	  }, {
	    key: "initMoveData",
	    value: function initMoveData() {
	      var _this2 = this;
	      this.nextTick(function () {
	        var eles = document.querySelectorAll(_this2.moveDivClass);
	        Array.from(eles).map(function (ele, i) {
	          _this2.moveData.push({
	            x: ele.offsetLeft,
	            y: ele.offsetTop,
	            data: ele.getAttribute('data-o')
	          });
	          _this2.moveDivEvent(ele, i);
	          _this2.bindDelEvent(ele.querySelector(_this2.delIconClass), i); // 绑定删除
	        });
	      });
	    }
	  }, {
	    key: "setScale",
	    value: function setScale(val) {
	      if (typeof val !== 'number') {
	        throw new Error('sacle非法');
	      }
	      this.scale = val;
	      this.el.style.transform = "scale(".concat(val, ")");
	      this.el.style.transformOrigin = "0 0";
	    }
	  }, {
	    key: "makeDraggable",
	    value: function makeDraggable(el, data) {
	      var _this3 = this;
	      if (!this.isMobile()) {
	        el.style.cursor = 'move';
	        el.setAttribute('draggable', true);
	        el.addEventListener('dragstart', function (ev) {
	          ev.dataTransfer.setData('Text', data);
	        });
	      }
	      if (this.isClick) {
	        el.addEventListener('click', function (ev) {
	          var x = Math.random() > 0.5 ? _this3.pel.offsetWidth / 2 + Math.random() * 30 : _this3.el.offsetWidth / 2 - Math.random() * 30;
	          var y = Math.random() > 0.5 ? _this3.pel.scrollTop + _this3.pel.offsetHeight / 2 + Math.random() * 30 : _this3.pel.scrollTop + _this3.pel.offsetHeight / 2 - Math.random() * 30;
	          var top = data && data.pos ? data.pos.x : x;
	          var left = data && data.pos ? data.pos.y : y;
	          _this3.moveData.push({
	            x: top,
	            y: left,
	            data: data
	          });
	          _this3.getMoveData(JSON.parse(JSON.stringify(_this3.moveData)));
	          _this3.nextTick(function () {
	            _this3.updatePosLimit(_this3.moveData.length - 1);
	            _this3.bindMoveDivEvent(_this3.moveData.length - 1);
	          });
	        });
	      }
	    }
	  }, {
	    key: "nextTick",
	    value: function nextTick(cb) {
	      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	      // 创建MutationObserver实例，返回一个观察者对象
	      var observer = new MutationObserver(function (mutationRecoards, observer) {
	        cb && cb();
	        observer.disconnect();
	      });
	      observer.observe(this.pel, {
	        childList: true,
	        attributes: true,
	        characterData: true,
	        subtree: true,
	        attributeOldValue: true,
	        characterDataOldValue: true
	      });
	    }
	  }, {
	    key: "bindDelEvent",
	    value: function bindDelEvent(delIcon, index) {
	      var _this4 = this;
	      if (delIcon) {
	        delIcon.addEventListener('click', function () {
	          _this4.moveData.splice(index, 1);
	          _this4.getMoveData(JSON.parse(JSON.stringify(_this4.moveData)));
	        });
	      }
	    }
	    // 绑定事件
	  }, {
	    key: "bindMoveDivEvent",
	    value: function bindMoveDivEvent(index) {
	      var _this5 = this;
	      var eles = document.querySelectorAll(this.moveDivClass);
	      Array.from(eles).map(function (ele, i) {
	        if (index === i) {
	          _this5.moveDivEvent(ele, index); // 绑定移动
	          _this5.bindDelEvent(ele.querySelector(_this5.delIconClass), index); // 绑定删除
	        }
	      });
	    }
	  }, {
	    key: "moveDivEvent",
	    value: function moveDivEvent(div, index) {
	      var _this6 = this;
	      if (this.isMobile()) {
	        // 阻止浏览器默认滚动事件，
	        this.pel.addEventListener('touchmove', function () {}, {
	          passive: false
	        });
	        div.ontouchstart = function (e) {
	          var touchs = e.targetTouches[0];
	          // 阻止默认浏览器drag事件导致mouseup事件丢失
	          var x = touchs.clientX / _this6.scale;
	          var y = touchs.clientY / _this6.scale;
	          _this6.el.ontouchmove = function (ev) {
	            ev.preventDefault();
	            ev.stopPropagation();
	            var touch = ev.targetTouches[0];
	            var left = div.offsetLeft + touch.clientX / _this6.scale - x;
	            var top = div.offsetTop + touch.clientY / _this6.scale - y;
	            x = touch.clientX / _this6.scale;
	            y = touch.clientY / _this6.scale;
	            _this6.limitDragPos(div, left, top, index);
	          };
	        };
	      } else {
	        div.onmousedown = function (e) {
	          // 阻止默认浏览器drag事件导致mouseup事件丢失
	          _this6.pauseEvent(e);
	          var x = e.clientX / _this6.scale;
	          var y = e.clientY / _this6.scale;
	          _this6.el.onmousemove = function (ev) {
	            var left = _this6.moveData[index].x + ev.clientX / _this6.scale - x;
	            var top = _this6.moveData[index].y + ev.clientY / _this6.scale - y;
	            x = ev.clientX / _this6.scale;
	            y = ev.clientY / _this6.scale;
	            _this6.limitDragPos(div, left, top, index);
	          };
	        };
	      }
	    }
	    // 拖动放置不溢出边界值
	  }, {
	    key: "updatePosLimit",
	    value: function updatePosLimit(index) {
	      var _this7 = this;
	      var eles = document.querySelectorAll(this.moveDivClass);
	      Array.from(eles).map(function (ele, i) {
	        if (index === i) {
	          _this7.limitDragPos(ele, ele.offsetLeft, ele.offsetTop, i);
	        }
	      });
	    }
	    // 拖动放置不溢出边界值
	  }, {
	    key: "limitDragPos",
	    value: function limitDragPos(div, left, top, index) {
	      var maxLeft = this.el.offsetWidth - div.offsetWidth;
	      var maxTop = this.el.offsetHeight - div.offsetHeight;
	      var x = Math.round(Math.max(0, Math.min(left, maxLeft)));
	      var y = Math.round(Math.max(0, Math.min(top, maxTop)));
	      this.moveData[index] = _objectSpread(_objectSpread({}, this.moveData[index]), {}, {
	        x: x,
	        y: y
	      });
	      this.getMoveData(JSON.parse(JSON.stringify(this.moveData)));
	    }
	    // 阻止事件冒泡
	    // 不仅仅要stopPropagation，还要preventDefault
	  }, {
	    key: "pauseEvent",
	    value: function pauseEvent(e) {
	      if (e.stopPropagation) e.stopPropagation();
	      if (e.preventDefault) e.preventDefault();
	      e.cancelBubble = true;
	      e.returnValue = false;
	      return false;
	    }
	  }]);
	  return Drag;
	}();

	return Drag;

}));
