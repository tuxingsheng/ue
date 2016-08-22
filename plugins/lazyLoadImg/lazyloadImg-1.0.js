/*
 * 原生js图片懒加载插件，适用于手机端
 * @author          涂兴声
 * @createDate      2016/08/18
 * 名称	            内容
 * el	            元素选择器
 * top	            元素在顶部伸出的距离才加载
 * left	            元素在左边伸出的距离才加载
 * right	        元素在右边伸出的距离才加载
 * bottom	        元素在底部伸出的距离才加载
 * load	            加载成功后回调方法
 * before	        加载之前执行方法
 * error	        加载失败后回调方法
 * monitorEvent	    监听的事件列表
 * placeholder	    默认图片
 * duration	        滑动停止多久后开始加载
 * selector	        懒加载触发范围
 * */
!(function (LazyloadImg) {
    'use strict';
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(LazyloadImg);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = LazyloadImg();
    } else {
        window.LazyloadImg = LazyloadImg();
    }
})(function () {
    'use strict';

    function LazyloadImg(options) {

        /*
         * 工具方法
         * */
        this.util = {
            /*
             * @name isArray
             * @type function
             * @explain 验证是否是数组
             * */
            isArray: function (obj) {
                return obj && typeof obj === 'object' && obj.constructor == Array;
            },
            /*
             * @name isString
             * @type function
             * @explain 验证是否是一个字符串
             * */
            isString: function (obj) {
                return obj && typeof obj === 'string' && obj.constructor == String;
            },
            /*
             * @name hasOwn
             * @type function
             * @explain 验证该属性是否属于某个对象
             * */
            hasOwn: function (obj, key) {
                return Object.prototype.hasOwnProperty.call(obj, key);
            },
            /*
             * @name isObject
             * @type function
             * @explain 验证是否是一个对象
             * */
            isObject: function (obj) {
                return obj !== null && typeof obj === 'object';
            },
            /*
             * @name isEmpty
             * @type function
             * @explain 是否为空，支持检测数组、对象和字符串
             * */
            isEmpty: function (obj) {
                if (obj == null) return true;
                if (this.util.isArray(obj) || this.util.isString(obj)) return obj.length === 0;
                for (var key in obj) if (this.util.hasOwn(obj, key)) return false;
                return true;
            }.bind(this),
            /*
             * @name extend
             * @type function
             * @explain 复制对象
             * */
            extend: function (to, from) {
                var keys = Object.keys(from);
                var i = keys.length;
                while (i--) {
                    to[keys[i]] = from[keys[i]];
                }
                return to;
            },
            /*
             * @name warn
             * @type function
             * @explain 打印报错信息
             * */
            warn: function (msg) {
                if (window.console && this.defaults.debug) {
                    window.console.warn('lazyloadImg：', msg);
                }
            }.bind(this),
            /*
             * @name each
             * @type function
             * @explain each循环
             * */
            each: function (obj, fn) {
                if (obj) {
                    var i = 0;
                    if (obj.length) {
                        for (var n = obj.length; i < n; i++) {
                            if (fn(i, obj[i]) === false)
                                break
                        }
                    } else {
                        for (i in obj) {
                            if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
                                break
                            }
                        }
                    }
                }
            }
        };

        /*
         * LazyloadImg默认配置
         * */
        this.defaults = {
            el: '[data-lazy]',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            duration: 100,
            debug: true,
            placeholder: '',
            selector: document,
            before: function () {

            },
            load: function (el) {

            },
            error: function (el) {

            }
        };

        this.count = 0;
        this.elements = [];
        this.dataSrc = 'lazy';
        this.monitorEvent = ['DOMContentLoaded', 'load', 'click', 'touchstart', 'touchend', 'haschange', 'online', 'pageshow', 'popstate', 'resize', 'storage', 'mousewheel', 'scroll'];

        /*
         * 初始化
         * */
        this.init = function () {
            // 自定义配置是否存在
            if (!this.util.isEmpty(options)) {
                // 配置是否是对象
                if (!this.util.isObject(options)) {
                    console.warn('lazyloadImg config must be an object');
                }
                this.defaults = this.util.extend(this.defaults, options);
            }
            this.dataSrc = this.getSelector();
            this.initElementMap();
            this.refresh();
            this.bind();
        };

        /*
         * 获取懒加载自定义属性
         * */
        this.getSelector = function () {
            var sign = /\[data-([a-z]+)\]$/.exec(this.defaults.el);
            return this.util.isEmpty(sign) ? 'src' : sign[1];
        };

        /*
         * 获取未被加载过的图片元素
         * */
        this.initElementMap = function () {
            var el = document.querySelectorAll(this.defaults.el);
			if(el.length != 0){
				this.count = 0;
				this.elements = [];
				this.util.each(el, function (i, e) {
					if (e.getAttribute('data-' + this.dataSrc)) {
						// 如果不存在placeholder，弹出警告
						if (this.util.isEmpty(this.defaults.placeholder)) {
							this.util.warn('param placeholder can not be empty ');
							return false;
						}
						this.count++;
						if (!e.getAttribute('data-lazy-id')) {
							e.setAttribute('data-lazy-id', this.count);
						}
						e.src = this.defaults.placeholder;
						this.elements.push(e);
					}
				}.bind(this));
			}
        };

        /*
         * 刷新
         * */
        this.refresh = function () {
            this.initElementMap();
            if (this.count == 0) {
                return false;
            }
            this.util.each(this.elements, function (i, e) {
                if (this.checkElementInViewport(e)) {
                    setTimeout(function () {
                        this.loadImg(i, e);
                    }.bind(this), this.defaults.duration)
                }
            }.bind(this));
        };

        /*
         * 加载图片
         * */
        this.loadImg = function (i, el) {
            var src = el.dataset[this.dataSrc];
            if (!this.util.isEmpty(src)) {
                var img = new Image();
                img.src = src;
                this.defaults.before.call(this, el);
                img.onload = function () {
                    el.src = img.src;
                    delete el.dataset[this.dataSrc];
                    this.elements.splice(i, 1);
                    this.count--;
                    return this.defaults.load.call(this, el);
                }.bind(this);

                img.onerror = function () {
                    return this.defaults.error.call(this, el);
                }.bind(this);
            }
        };

        /*
         * 检测元素是否在可视区
         * */
        this.checkElementInViewport = function (el) {
            var bcr = el.getBoundingClientRect(); //取得元素在可视区的位置
            var mw = el.offsetWidth; //元素自身宽度
            var mh = el.offsetHeight; //元素自身的高度
            var w = window.innerWidth; //视窗的宽度
            var h = window.innerHeight; //视窗的高度
            var boolX = (!((bcr.right - this.defaults.left) <= 0 && ((bcr.left + mw) - this.defaults.left) <= 0) && !((bcr.left + this.defaults.right) >= w && (bcr.right + this.defaults.right) >= (mw + w))); //上下符合条件
            var boolY = (!((bcr.bottom - this.defaults.top) <= 0 && ((bcr.top + mh) - this.defaults.top) <= 0) && !((bcr.top + this.defaults.bottom) >= h && (bcr.bottom + this.defaults.bottom) >= (mh + h))); //上下符合条件
            return (el.width != 0 && el.height != 0 && boolX && boolY);
        };

        /*
         * 绑定触发事件
         * */
        this.bind = function () {
            var self = this;
            this.util.each(this.monitorEvent, function (i, e) {
                self.defaults.selector.addEventListener(e, function () {
                    self.refresh();
                }, false);
            });
        };

        /*
         * 解除绑定触发事件
         * */
        this.unbind = function () {
            var self = this;
            this.util.each(this.monitorEvent, function (i, e) {
                self.defaults.selector.removeEventListener(e, function () {
                    self.refresh();
                });
            });
        };

        this.init();
    }

    return LazyloadImg;

});
