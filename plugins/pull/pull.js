'use strict';

/*
 * 原生js插件，pull.js，适用于手机端
 * @author          涂兴声
 * @createDate      2016/09/05
 * 名称	            内容
 * scroll           某个scroll
 * limit            触发上限
 * auto             是否初始化自动加载一次
 * pullDown         是否触发pullDown
 * pullInitName     pullDown显示内容
 * pullStartName    pull释放内容
 * pullLoadingName  pull加载内容
 * pullClearName    pull结束加载
 * callback         pull加载成功的回调
 * */
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
                    if (typeof from[keys[i]] == 'object') {
                        util.extend(to[keys[i]], from[keys[i]]);
                    } else {
                        to[keys[i]] = from[keys[i]];
                    }
                }
                return to;
            }
        };

        options = options || {};

        this.defaults = {
            scroll: 'appScroll',
            limit: 50,
            up: {
                auto: false,
                isOpen: false,
                pullInitName: '上拉可以刷新',
                pullStartName: '释放立即刷新',
                pullLoadingName: '正在刷新...',
                pullClearName: '没有更多数据了',
                callback: function () {

                }
            },
            down: {
                auto: false,
                isOpen: false,
                pullInitName: '下拉可以刷新',
                pullStartName: '释放立即刷新',
                pullLoadingName: '正在刷新...',
                pullClearName: '没有更多数据了',
                callback: function () {

                }
            }
        };

        this.defaults = util.extend(this.defaults, options);


        // 状态管理
        // 0 --- 可以刷新
        // 1 --- 释放可刷新
        // 2 --- 正在刷新
        // 3 --- 没有更多数据了
        this.pullUpState = 0;
        this.pullDownState = 0;

        if (!ue.iscrollList[this.defaults.scroll]) {
            throw Error('Iscroll实例对象不存在');
        }
        this.pull = ue.iscrollList[this.defaults.scroll];

        this._init();
    }

    /*
     * 初始化pull
     * */
    Pull.prototype._init = function () {
        this._pullElement();
        this._bindEvent();
    };

    Pull.prototype.endPullToRefresh = function (state) {
        if (state) {
            this[this.defaults.pullState == 'down' ? '_pullDownState' : '_pullUpState'](3);
        }
        this.pull.refresh();
    };

    /*
     * 重置刷新状态
     * */
    Pull.prototype.resetPullToRefresh = function (name) {
        name = name || this.defaults.pullState;
        this[name == 'down' ? '_pullDownState' : '_pullUpState'](0);
    };

    /*
     * 如果不存在DOM结构，就动态创建
     * */
    Pull.prototype._pullElement = function () {
        if (this.defaults.up.isOpen) {
            this.pullUp = this.pull.wrapper.querySelector('.ue-pull-up');
            if (this.pullUp) {
                this.pullUpIcon = this.pullUp.querySelector('.ue-pull-up-icon');
                this.pullUpLabel = this.pullUp.querySelector('.ue-pull-up-label');
            } else {
                this._createPullUp();
            }
        }
        if (this.defaults.down.isOpen) {
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
     * 动态创建pullUp
     * */
    Pull.prototype._createPullUp = function () {
        this.pullUp = document.createElement('div');
        this.pullUpIcon = document.createElement('span');
        this.pullUpLabel = document.createElement('span');
        this.pullUp.className = 'ue-pull-up';
        this.pullUpIcon.className = 'ue-pull-up-icon';
        this.pullUpLabel.className = 'ue-pull-up-label';
        this.pullUp.appendChild(this.pullUpIcon);
        this.pullUp.appendChild(this.pullUpLabel);
        this.pull.wrapper.appendChild(this.pullUp);
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
        var self = this, timer = null;

        if (self.defaults.up.auto) {
            self._pullUpState(2);
            self.defaults.up.callback();
            self.defaults.up.auto = false;
        }

        if (self.defaults.down.auto) {
            self._pullDownState(2);
            self.defaults.down.callback();
            self.defaults.down.auto = false;
        }

        this.pull.on('scrollEnd', function () {
            // scrollEnd...
        });

        this.pull.on('refresh', function () {
            clearInterval(timer);
            if (self.pullDownState != 3 && self.defaults.down.isOpen) {
                self._pullDownState(0);
            }
            if (self.pullUpState != 3 && self.defaults.up.isOpen) {
                self._pullUpState(0);
            }
        });

        this.pull.on('scroll', function () {
            if (this.y > 0 && self.defaults.down.isOpen) {
                if (self.pullDownState == 2 || self.pullDownState == 3) {
                    return false;
                }
                self._pullDownState(this.y > self.defaults.limit ? 1 : 0);
            }
            if (this.maxScrollY > this.y && self.defaults.up.isOpen) {
                if (self.pullUpState == 2 || self.pullUpState == 3) {
                    return false;
                }
                self._pullUpState(this.maxScrollY - self.defaults.limit > this.y ? 1 : 0);
            }
        });

        this.pull.scroller.addEventListener('touchend', function () {
            if (self.pull.y > self.defaults.limit && self.defaults.down.isOpen) {
                self.defaults.pullState = 'down';
                if (self.pullDownState == 1) {
                    self._pullDownState(2);
                    self.defaults.down.callback();
                }
            }
            if (self.pull.maxScrollY > self.pull.y && self.defaults.up.isOpen) {
                self.defaults.pullState = 'up';
                if (self.pullUpState == 1) {
                    self._pullUpState(2);
                    self.defaults.up.callback();
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
                this.pullDownLabel.innerText = this.defaults.down.pullInitName;
                this.pullDownIcon.className = 'ue-pull-down-icon ue-icon ue-icon-pulldown';
                break;
            // 允许加载的状态
            case 1:
                this.pullDownState = 1;
                this.pull.scroller.style.top = '0px';
                this.pullDownIcon.style.display = 'inline-block';
                this.pullDownLabel.innerText = this.defaults.down.pullStartName;
                this.pullDownIcon.className = 'ue-pull-down-icon ue-icon ue-icon-pulldown ue-rotate-180';
                break;
            // 加载中状态
            case 2:
                this.pullDownState = 2;
                this.pull.scroller.style.top = this.defaults.limit + 'px';
                this.pullDownIcon.style.display = 'inline-block';
                this.pullDownLabel.innerText = this.defaults.down.pullLoadingName;
                this.pullDownIcon.className = 'ue-pull-down-icon ue-spinner';
                break;
            // 没有更多数据了
            case 3:
                this.pullDownState = 3;
                this.pull.scroller.style.top = '0px';
                this.pullDownIcon.style.display = 'none';
                this.pullDownLabel.innerText = this.defaults.down.pullClearName;
                break;
        }
    };

    /*
     * pullUp状态设置
     * */
    Pull.prototype._pullUpState = function (index) {
        switch (index) {
            // 初始化状态
            case 0:
                this.pullUpState = 0;
                this.pull.scroller.style.top = '0px';
                this.pullUpIcon.style.display = 'inline-block';
                this.pullUpLabel.innerText = this.defaults.up.pullInitName;
                this.pullUpIcon.className = 'ue-pull-up-icon ue-icon ue-icon-pulldown ue-rotate-180';
                break;
            // 允许加载的状态
            case 1:
                this.pullUpState = 1;
                this.pull.scroller.style.top = '0px';
                this.pullUpIcon.style.display = 'inline-block';
                this.pullUpLabel.innerText = this.defaults.up.pullStartName;
                this.pullUpIcon.className = 'ue-pull-up-icon ue-icon ue-icon-pulldown';
                break;
            // 加载中状态
            case 2:
                this.pullUpState = 2;
                this.pull.scroller.style.top = -this.defaults.limit + 'px';
                this.pullUpIcon.style.display = 'inline-block';
                this.pullUpLabel.innerText = this.defaults.up.pullLoadingName;
                this.pullUpIcon.className = 'ue-pull-up-icon ue-spinner';
                break;
            // 没有更多数据了
            case 3:
                this.pullUpState = 3;
                this.pull.scroller.style.top = '0px';
                this.pullUpIcon.style.display = 'none';
                this.pullUpLabel.innerText = this.defaults.up.pullClearName;
                break;
        }
    };


    if (typeof exports === 'object') module.exports = Pull;
    else if (typeof define === 'function' && define.amd) define([], function () {
        return Pull;
    });
    else window.Pull = Pull;
})(window, document, ue);
