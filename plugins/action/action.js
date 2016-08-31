/*
 * 原生js编写的picker，依赖iscroll
 * @author：涂兴声
 * @createDate：2016-08-30
 * @param {String} el 作用区域
 * @param {String} type picker类型（默认 'normal'，还支持 'date'）
 * @param {Boolean} showCover 是否显示遮罩
 * @param {Number} itemHeight item高度
 * @param {Object} items 数据列表
 * @param {Number} spaceNum 空白列表
 * @param {Number} probeType iscroll.probeType配置
 * @param {String} apart 分割线
 * @param {String} show 显示的字段
 * @param {String} export 输出的字段
 * @param {Function} onScrollEnd 滚动结束的回调函数
 * @param {Function} onConfirm 点击确认的回调函数
 * */
(function (window, document) {

    'use strict';

    var util = {
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
        },
        tf: function (i) {
            return (i < 10 ? '0' : '') + i
        }
    };

    function Action(options) {

        if (typeof options == 'undefined') {
            throw Error('Picker配置不能为空');
        }

        /*
         * 默认配置
         * */
        this.defaults = {
            el: '.ue-action',
            showCover: true
        };

        this.defaults = util.extend(this.defaults, options);

        this.action = typeof this.defaults.el == 'string' ? document.querySelector(this.defaults.el) : this.defaults.el;
        this.actionrWrapper = this.action.querySelector('.ue-action-wrapper');
        this.actionCover = this.action.querySelector('.ue-action-cover');

        this._init();
    }

    /*
     * 隐藏滚动选择
     * */
    Action.prototype.hide = function () {
        this.actionCover.style.display = 'none';
        this.actionrWrapper.style.opacity = 0;
        this.actionrWrapper.style.webkitTransform = 'translate3d(0, ' + this.actionrWrapper.clientHeight + 'px, 0)';
        this.actionrWrapper.style.transform = 'translate3d(0, ' + this.actionrWrapper.clientHeight + 'px, 0)';
    };

    /*
     * 显示滚动选择
     * */
    Action.prototype.show = function () {
        if (this.defaults.showCover) {
            this.actionCover.style.display = 'block';
        }
        this.actionrWrapper.style.opacity = 1;
        this.actionrWrapper.style.webkitTransition = 'all ease-in-out 0.5s';
        this.actionrWrapper.style.transition = 'all ease-in-out 0.5s';
        this.actionrWrapper.style.webkitTransform = 'translate3d(0, 0, 0)';
        this.actionrWrapper.style.transform = 'translate3d(0, 0, 0)';
    };

    /*
     * 初始化
     * */
    Action.prototype._init = function () {
        // 初始化绑定事件处理
        this._bindEvent();
        // 初始化的时候隐藏
        this.hide();
    };

    Action.prototype._bindEvent = function () {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        // 添加遮罩的事件监听
        this.actionCover.addEventListener('touchstart', function () {
            this.hide();
        }.bind(this), false);
    };


    if (typeof exports === 'object') module.exports = Action;
    else if (typeof define === 'function' && define.amd) define([], function () {
        return Action;
    });
    else window.Action = Action;
}(window, document));