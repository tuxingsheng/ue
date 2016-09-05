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
            //autoInit: false,
            pullInitName: '下拉可以刷新',
            pullStartName: '释放立即刷新',
            pullLoadName: '正在刷新...',
            pullEndName: '没有更多数据了',
            pullDownSuccess: function () {

            }
        };

        this.defaults = util.extend(this.defaults, options);

        // 状态管理
        // 0 --- 可以刷新
        // 1 --- 释放可刷新
        // 2 --- 正在刷新
        // 3 --- 没有更多数据了
        this.pullDownState = 0;

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

    Pull.prototype.scrollerEnd = function () {
        this._pullDownState(3);
        this.pull.refresh();
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
        this.pull.wrapper.insertBefore(this.pullDown, this.pull.wrapper.children[0]);
    };

    /*
     * 绑定处理事件
     * */
    Pull.prototype._bindEvent = function () {
        var self = this, count = 0, timer = null;

        this.pull.on('refresh', function () {
            count = 0;
            clearInterval(timer);
            if (self.pullDownState != 3) {
                self._pullDownState(0);
            }
        });

        this.pull.on('scroll', function () {
            if (self.defaults.pullDown) {
                if (self.pullDownState == 2 || self.pullDownState == 3) {
                    return false;
                }
                self._pullDownState(this.y > self.defaults.limit ? 1 : 0);
            }
        });

        this.pull.on('scrollEnd', function () {
            // scrollEnd
        });

        this.pull.scroller.addEventListener('touchend', function () {
            if (self.defaults.pullDown) {
                if (self.pullDownState == 1) {
                    self._pullDownState(2);
                    self.defaults.pullDownSuccess();
                    timer = setInterval(function () {
                        count++;
                        if (count >= self.defaults.maxTime) {
                            count = 0;
                            clearInterval(timer);
                            self._pullDownState(0);
                        }
                    }, 1000);
                }
            }
        }, false);
    };

    /*
     * pullDown状态设置
     * */
    Pull.prototype._pullDownState = function (index) {
        switch (index) {
            // 初始化状态
            case 0:
                this.pullDownState = 0;
                this.pull.scroller.style.top = '0px';
                this.pullDownIcon.style.display = 'inline-block';
                this.pullDownLabel.innerText = this.defaults.pullInitName;
                this.pullDownIcon.className = 'ue-pull-down-icon ue-icon ue-icon-pulldown';
                break;
            // 允许加载的状态
            case 1:
                this.pullDownState = 1;
                this.pull.scroller.style.top = '0px';
                this.pullDownIcon.style.display = 'inline-block';
                this.pullDownLabel.innerText = this.defaults.pullStartName;
                this.pullDownIcon.className = 'ue-pull-down-icon ue-icon ue-icon-pulldown ue-rotate-180';
                break;
            // 加载中状态
            case 2:
                this.pullDownState = 2;
                this.pull.scroller.style.top = '44px';
                this.pullDownIcon.style.display = 'inline-block';
                this.pullDownLabel.innerText = this.defaults.pullLoadName;
                this.pullDownIcon.className = 'ue-pull-down-icon ue-spinner';
                break;
            // 没有更多数据了
            case 3:
                this.pullDownState = 3;
                this.pull.scroller.style.top = '0px';
                this.pullDownIcon.style.display = 'none';
                this.pullDownLabel.innerText = this.defaults.pullEndName;
                break;
        }
    };


    if (typeof exports === 'object') module.exports = Pull;
    else if (typeof define === 'function' && define.amd) define([], function () {
        return Pull;
    });
    else window.Pull = Pull;
})(window, document, ue);
