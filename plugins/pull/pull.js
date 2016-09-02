'use strict';

(function (window, document, ue) {


    function Pull(options) {

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
            }
        };

        options = options || {};

        this.defaults = {
            scroll: 'appScroll',
            limit: 44,
            maxTime: 10,
            pullDown: false,
            autoInit: false,
            pullDownSuccess: function () {

            },
            pullInitName: '下拉可以刷新',
            pullStartName: '释放立即刷新',
            pullLoadName: '正在刷新...'
        };

        this.defaults = util.extend(this.defaults, options);

        // 状态管理
        // 0 --- 可以刷新
        // 1 --- 释放可刷新
        // 2 --- 正在刷新
        // 3 --- 刷新结束
        this.state = 0;

        if (!ue.iscrollList[this.defaults.scroll]) {
            throw Error('Iscroll实例对象不存在');
        }
        this.pull = ue.iscrollList[this.defaults.scroll];

        this._init();
    }

    Pull.prototype._init = function () {
        this._queryElement();
        this._bindEvent();
    };

    /*
     * 如果不存在DOM结构，就动态创建
     * */
    Pull.prototype._queryElement = function () {
        if (this.defaults.pullDown) {
            this.pullDown = this.pull.wrapper.querySelector('.ue-pull-down');
            if (this.pullDown) {
                this.pullDownIcon = this.pullDown.querySelector('.ue-pull-down-icon');
                this.pullDownLabel = this.pullDown.querySelector('.ue-pull-down-label');
            } else {
                this._createPullDown();
            }
        }
    };

    /*
     * 动态创建pullDown
     * */
    Pull.prototype._createPullDown = function () {
        this.pullDown = document.createElement('div');
        this.pullDownIcon = document.createElement('span');
        this.pullDownLabel = document.createElement('span');
        this.pullDown.className = 'ue-pull-down';
        this.pullDownIcon.className = 'ue-pull-down-icon';
        this.pullDownLabel.className = 'ue-pull-down-label';
        this.pullDown.appendChild(this.pullDownIcon);
        this.pullDown.appendChild(this.pullDownLabel);
        this.pull.scroller.insertBefore(this.pullDown, this.pull.scroller.childNodes[0]);
    };

    /*
     * 绑定处理事件
     * */
    Pull.prototype._bindEvent = function () {
        var self = this, count = 0, timer = null;

        this.pull.on('scroll', function () {
            if (self.state == 2) {
                return false;
            }
            if (self.defaults.pullDown) {
                if (this.y > self.defaults.limit) {
                    self._pullDownStart();
                } else {
                    self._pullDownInit();
                }
            }
        });

        this.pull.on('refresh', function () {
            count = 0;
            clearInterval(timer);
            /*if (self.defaults.autoInit) {
                self._pullDownLoad();
                self.defaults.pullDownSuccess();
                self.defaults.autoInit = false;
            }else{
                //self.defaults.autoInit = false;
                self._pullDownInit();
            }*/
            self._pullDownInit();
        });

        this.pull.scroller.addEventListener('touchend', function () {
            if (self.defaults.pullDown) {
                if (self.state == 1) {
                    self._pullDownLoad();
                    self.defaults.pullDownSuccess();
                    timer = setInterval(function () {
                        count++;
                        if (count >= self.defaults.maxTime) {
                            count = 0;
                            clearInterval(timer);
                            self._pullDownInit();
                        }
                    }, 1000);
                }
            }
        }, false);
    };

    /*
     * pullDown初始化状态
     * */
    Pull.prototype._pullDownInit = function () {
        this.state = 0;
        this.pullDown.style.marginTop = '-44px';
        this.pullDownIcon.className = 'ue-pull-down-icon ue-icon ue-icon-pulldown';
        this.pullDownIcon.style.webkitTransform = 'rotate(0deg)';
        this.pullDownIcon.style.top = '0px';
        this.pullDownLabel.innerText = this.defaults.pullInitName;
    };

    /*
     * pullDown允许加载的状态
     * */
    Pull.prototype._pullDownStart = function () {
        this.state = 1;
        this.pullDown.style.marginTop = '-44px';
        this.pullDownIcon.className = 'ue-pull-down-icon ue-icon ue-icon-pulldown';
        this.pullDownIcon.style.webkitTransform = 'rotate(180deg)';
        this.pullDownIcon.style.top = '3px';
        this.pullDownLabel.innerText = this.defaults.pullStartName;
    };

    /*
     * pullDown加载中状态
     * */
    Pull.prototype._pullDownLoad = function () {
        this.state = 2;
        this.pullDown.style.marginTop = '0px';
        this.pullDownIcon.className = 'ue-pull-down-icon ue-spinner';
        this.pullDownIcon.style.webkitTransform = 'rotate(0deg)';
        this.pullDownIcon.style.top = '3px';
        this.pullDownLabel.innerText = this.defaults.pullLoadName;
    };


    if (typeof exports === 'object') module.exports = Pull;
    else if (typeof define === 'function' && define.amd) define([], function () {
        return Pull;
    });
    else window.Pull = Pull;
})(window, document, ue);
