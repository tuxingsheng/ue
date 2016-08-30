/*
 *
 * */
(function (window, document) {

    'use strict';

    function Picker(options) {

        if (typeof options == 'undefined') {
            throw Error('Picker配置不能为空');
        }

        this.pickerWrapper = document.querySelector('.ue-picker-wrapper');
        this.pickerCover = document.querySelector('.ue-picker-cover');
        this.pickerList = document.querySelector('.ue-picker-list');

        /*
         * 默认配置
         * */
        this.defaults = {
            showCover: true,
            itemWidth: 40,
            items: [],
            spaceNum: 2,
            probeType: 3,
            field: 'name',
            onScrollEnd: function () {

            },
            onConfirm: function () {

            }
        };

        for (var o in options) {
            if (typeof options[o] != 'undefined') {
                this.defaults[o] = options[o];
            }
        }

        this.scrollEndData = {
            index: 0,
            data: this.defaults.items[0]
        };

        // 初始化HTML结构
        _init.call(this);
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
            self.pickerScroll.scrollTo(0, 0);
            _switchActiveClass(0, self);
            self.scrollEndData = {
                index: 0,
                data: self.defaults.items[0]
            };
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

    //初始化组件结构
    function _init() {

        //所有选项信息
        //var items = this.defaults.items;
        //空位添加使首选项居中
        var spaces = '',
            options = '',
            self = this;

        for (var x = 0; x < this.defaults.spaceNum; x++) {
            spaces += '<li class="ue-picker-item"></li>';
        }

        for (var i = 0; i < this.defaults.items.length; i++) {
            options += '<li class="ue-picker-item">' + (this.defaults.items[i][this.defaults.field] ? this.defaults.items[i][this.defaults.field] : '') + '</li>';
        }

        options = spaces + options + spaces;

        this.pickerList.innerHTML = '<ul>' + options + '</ul>';
        this.pickerItems = this.pickerList.querySelectorAll('.ue-picker-item');
        this.pickerIndicator = this.pickerWrapper.querySelector('.ue-picker-indicator');

        // 初始化滚动区域高度
        this.pickerList.style.height = (this.defaults.spaceNum * 2 + 1) * this.defaults.itemWidth + 'px';
        // 初始化indicator高度
        this.pickerIndicator.style.height = this.defaults.itemWidth + 'px';
        // 初始化高亮
        this.pickerItems[this.defaults.spaceNum].classList.add('ue-picker-active');
        // 初始化item的高度
        for (var k = 0; k < this.pickerItems.length; k++) {
            this.pickerItems[k].style.height = this.pickerItems[k].style.lineHeight = this.defaults.itemWidth + 'px';
        }
        // 初始化iscroll
        this.pickerScroll = new IScroll('.ue-picker-list', {
            probeType: self.defaults.probeType
        });

        var getActiveIndex = function (posY) {
            var index = -Math.round(posY / self.defaults.itemWidth);
            if (index > self.defaults.items.length - 1) {
                index = self.defaults.items.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }
            return index;
        };

        this.pickerScroll.on('scrollEnd', function () {
            var index = getActiveIndex(this.y);
            _switchActiveClass(index, self);
            this.scrollTo(0, -index * self.defaults.itemWidth);
            self.scrollEndData = {
                index: index,
                data: self.defaults.items[index]
            };
            self.defaults.onScrollEnd(self.scrollEndData);
        });

        this.pickerScroll.on('scroll', function () {
            var index = getActiveIndex(this.y);
            _switchActiveClass(index, self);
        });

        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);

        // 添加取消和确定的监听
        document.querySelector('.ue-picker-cancel').addEventListener('click', function () {
            self.hide();
        }, false);
        document.querySelector('.ue-picker-confirm').addEventListener('click', function () {
            self.hide();
            self.defaults.onConfirm(self.scrollEndData);
        }, false);
        // 添加遮罩的监听
        this.pickerCover.addEventListener('click', function () {
            self.hide();
        }, false);
        //初始化的时候隐藏
        this.hide();
    }

    // 改变active的item
    function _switchActiveClass(index, self) {
        for (var i = 0; i < self.pickerItems.length; i++) {
            self.pickerItems[i].classList.remove('ue-picker-active');
        }
        self.pickerItems[index + self.defaults.spaceNum].classList.add('ue-picker-active');
    }

    if (typeof exports === 'object') module.exports = Picker;
    else if (typeof define === 'function' && define.amd) define([], function () {
        return Picker;
    });
    else window.Picker = Picker;
}(window, document));