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

    function Picker(options) {

        if (typeof options == 'undefined') {
            throw Error('Picker配置不能为空');
        }

        /*
         * 默认配置
         * */
        this.defaults = {
            el: '.ue-picker',
            type: 'normal',
            showCover: true,
            itemHeight: 40,
            items: [],
            spaceNum: 2,
            probeType: 2,
            apart: '',
            show: 'text',
            export: 'value',
            onScrollEnd: function () {

            },
            onConfirm: function () {

            }
        };

        this.defaults = util.extend(this.defaults, options);

        this.picker = typeof this.defaults.el == 'string' ? document.querySelector(this.defaults.el) : this.defaults.el;
        this.pickerWrapper = this.picker.querySelector('.ue-picker-wrapper');
        this.pickerCover = this.picker.querySelector('.ue-picker-cover');
        this.pickerList = this.picker.querySelector('.ue-picker-list');

        // 初始化HTML结构
        this._init();
    }

    /*
     * 隐藏滚动选择
     * */
    Picker.prototype.hide = function () {
        this.pickerCover.style.display = 'none';
        this.pickerWrapper.style.opacity = 0;
        this.pickerWrapper.style.webkitTransform = 'translate3d(0, ' + this.pickerWrapper.clientHeight + 'px, 0)';
        this.pickerWrapper.style.transform = 'translate3d(0, ' + this.pickerWrapper.clientHeight + 'px, 0)';
        var self = this;
        setTimeout(function () {
            util.each(self.pickerScroll, function (i, e) {
                e.scrollTo(0, 0);
                self.scrollIndex[i] = 0;
                self._switchActiveClass(i, 0);
            });
        }, 500);
    };

    /*
     * 显示滚动选择
     * */
    Picker.prototype.show = function () {
        if (this.defaults.showCover) {
            this.pickerCover.style.display = 'block';
        }
        this.pickerWrapper.style.opacity = 1;
        this.pickerWrapper.style.webkitTransition = 'all ease-in-out 0.5s';
        this.pickerWrapper.style.transition = 'all ease-in-out 0.5s';
        this.pickerWrapper.style.webkitTransform = 'translate3d(0, 0, 0)';
        this.pickerWrapper.style.transform = 'translate3d(0, 0, 0)';
    };

    /*
     * 数据刷新
     * */
    Picker.prototype.update = function (options) {
        if (options) {
            this.defaults = util.extend(this.defaults, options);
        }
        // 创建DOM结构
        this._createFlex();
        // 初始化当前定位索引
        this._scrollIndexInit();
        // 初始化iscroll
        this._createPickerScroll();
    };

    /*
     * 初始化
     * */
    Picker.prototype._init = function () {
        // 更新数据
        this.update();
        // 初始化绑定事件处理
        this._bindEvent();
        // 初始化的时候隐藏
        this.hide();
    };

    Picker.prototype._createPickerScroll = function () {
        this.pickerScroll = {};
        var pickerFlexs = this.picker.querySelectorAll('.ue-picker-list-flex'), self = this;

        var getActiveIndex = function (i, posY) {
            var index = -Math.round(posY / self.defaults.itemHeight),
                values = self.defaults.items[i].values.length - 1;

            if (index > values) {
                index = values;
            }
            if (index <= 0) {
                index = 0;
            }
            return index;
        };

        var scrollEnd = function (i) {
            var index = getActiveIndex(i, self.pickerScroll[i].y);
            self._switchActiveClass(i, index);
            self.scrollIndex[i] = index;
            self.defaults.onScrollEnd(self._scrollEndData());
        };

        var scrollLoad = function (i) {
            var index = getActiveIndex(i, self.pickerScroll[i].y);
            self._switchActiveClass(i, index);
        };

        // 初始化iscroll
        util.each(pickerFlexs, function (i, e) {
            self.pickerScroll[i] = new IScroll(e, {
                probeType: self.defaults.probeType,
                snap: 'li'
            });

            self.pickerScroll[i].on('scrollEnd', function () {
                scrollEnd(i)
            });

            self.pickerScroll[i].on('scroll', function () {
                scrollLoad(i)
            });
        });

    };

    Picker.prototype._scrollIndexInit = function () {
        this.scrollIndex = [];
        for (var i = 0; i < this.defaults.items.length; i++) {
            this.scrollIndex.push(0);
        }
    };

    Picker.prototype._scrollData = function (x, y) {
        var field = this.defaults.items[x].values[y][this.defaults.export];
        // 特殊处理date类型
        if (this.defaults.type == 'date' && typeof field == 'number') {
            field = util.tf(field);
        }
        return field;
    };

    Picker.prototype._scrollEndData = function () {
        var result = '', length = this.defaults.items.length, i = 0;
        for (; i < length; i++) {
            var field = this.defaults.items[i].values[this.scrollIndex[i]][this.defaults.export];
            result += this._scrollData(i, this.scrollIndex[i]) + (i == length - 1 || field == '' ? '' : this.defaults.apart);
        }
        return result;
    };

    Picker.prototype._bindEvent = function () {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        // 添加取消和确定的监听
        this.picker.querySelector('.ue-picker-cancel').addEventListener('click', function () {
            this.hide();
        }.bind(this), false);
        this.picker.querySelector('.ue-picker-confirm').addEventListener('click', function () {
            this.hide();
            this.defaults.onConfirm(this._scrollEndData());
        }.bind(this), false);
        // 添加遮罩的事件监听
        this.pickerCover.addEventListener('click', function () {
            this.hide();
        }.bind(this), false);
    };

    Picker.prototype._createSpace = function () {
        var dom = '', i = 0;
        for (; i < this.defaults.spaceNum; i++) {
            dom += '<li class="ue-picker-item"></li>';
        }
        return dom;
    };

    Picker.prototype._createItem = function (index) {
        var dom = '', i = 0;
        for (; i < this.defaults.items[index]['values'].length; i++) {
            var item = this.defaults.items[index]['values'][i][this.defaults.show];
            // 特殊处理date类型
            if (this.defaults.type == 'date' && typeof item == 'number') {
                item = util.tf(item);
            }
            dom += '<li class="ue-picker-item">' + item + '</li>';
        }
        return dom;
    };

    Picker.prototype._createFlex = function () {
        var i = 0;
        this.pickerItems = {};
        this.pickerList.innerHTML = '';
        for (; i < this.defaults.items.length; i++) {
            var flex = document.createElement('div');
            flex.className = 'ue-picker-list-flex';
            flex.innerHTML = '<ul>' + this._createSpace() + this._createItem(i) + this._createSpace() + '</ul>';
            this.pickerList.appendChild(flex);
            this.pickerItems[i] = flex.querySelectorAll('.ue-picker-item');
            // 初始化pickerItems高亮
            this.pickerItems[i][this.defaults.spaceNum].classList.add('ue-picker-active');
            // 初始化pickerItems的高度
            for (var k = 0; k < this.pickerItems[i].length; k++) {
                this.pickerItems[i][k].style.height = this.pickerItems[i][k].style.lineHeight = this.defaults.itemHeight + 'px';
            }
            // 初始化indicator高度
            this._indicatorInit();
        }
    };

    Picker.prototype._indicatorInit = function () {
        this.pickerIndicator = this.pickerWrapper.querySelector('.ue-picker-indicator');
        this.pickerIndicator.style.height = this.defaults.itemHeight + 'px';
        // 初始化滚动区域高度
        this.pickerList.style.height = (this.defaults.spaceNum * 2 + 1) * this.defaults.itemHeight + 'px';
    };

    Picker.prototype._switchActiveClass = function (index, sIndex) {
        var pickerItems = this.pickerItems[index], i = 0;
        for (; i < pickerItems.length; i++) {
            pickerItems[i].classList.remove('ue-picker-active');
        }
        pickerItems[sIndex + this.defaults.spaceNum].classList.add('ue-picker-active');
    };

    if (typeof exports === 'object') module.exports = Picker;
    else if (typeof define === 'function' && define.amd) define([], function () {
        return Picker;
    });
    else window.Picker = Picker;
}(window, document));