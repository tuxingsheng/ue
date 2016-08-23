/*
 * 原生js轮播图插件
 * @author          涂兴声
 * @createDate      2016/08/23
 * @param {String|Object} el    轮播区域
 * @param {Boolean} loop    是否无缝循环
 * @param {Boolean} autoPlay    是否自动轮播
 * @param {Number} autoTime    自动轮播时间间隔
 * @param {Number} speed    动画过度速度
 * @param {Boolean} pagination    是否动态生成状态点
 * */
!(function (Slider) {
    'use strict';
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(Slider);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Slider();
    } else {
        window.Slider = Slider();
    }
})(function () {
    'use strict';

    function Slider(options) {

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
            }
        };

        /*
         * Slider默认配置
         * */
        this.defaults = {
            el: '.ue-slider',
            loop: true,
            autoPlay: true,
            autoTime: 5000,
            speed: 300,
            pagination: true
        };

        // 自定义配置是否存在
        if (!this.util.isEmpty(options)) {
            // 配置是否是对象
            if (!this.util.isObject(options)) {
                throw Error('Slider配置必须是对象');
            }
            this.defaults = this.util.extend(this.defaults, options);
        }

        this.slider = this.util.isString(this.defaults.el) ? document.querySelector(this.defaults.el) : this.defaults.el;
        this.sliderWidth = this.slider.offsetWidth;
        this.sliderContent = this.slider.querySelector('.ue-slider-content');
        this.sliderBodyList = this.sliderContent.querySelectorAll('.ue-slider-body');
        this.sliderBodyLength = this.sliderBodyList.length;

        this.init();
        this.bindEvent();
    }

    Slider.prototype.init = function () {
        this.ratio = this.slider.offsetHeight / this.slider.offsetWidth;
        this.sliderWidth = this.slider.offsetWidth;
        this.sliderHeight = this.slider.offsetHeight;
        this.sliderContent.style.width = this.sliderWidth + 'px';
        this.index = 0;
        //初始化lists值
        for (var i = 0; i < this.sliderBodyLength; i++) {
            this.sliderBodyList[i].style.width = this.sliderWidth + 'px';
            this.sliderBodyList[i].style.webkitTransform = 'translate3d(' + i * this.sliderWidth + 'px,0,0)';
            var sliderImg = this.sliderBodyList[i].querySelector('img');
            if (sliderImg.height / sliderImg.width > this.ratio) {
                sliderImg.style.height = this.sliderHeight + 'px';
            } else {
                sliderImg.style.width = this.sliderWidth + 'px';
            }
        }
        if (this.defaults.pagination) {
            this.createBullet();
        }
        if (this.defaults.loop) {
            this.copyLists();
            this.index = 1;
            this.sliderBodyList = this.sliderContent.querySelectorAll('.ue-slider-body');
            this.sliderBodyLength = this.sliderBodyList.length;
        }
        //自动轮播
        if (this.defaults.autoPlay) {
            this.autoPlay();
        }
        //窗口大小初始化方法
        var resizeTimer = null;
        window.addEventListener('resize', function(){
            if (!this.util.isEmpty(resizeTimer)) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                this.resizeInit();
            }.bind(this), 500);
        }.bind(this), false);
    };

    Slider.prototype.resizeInit = function () {
        this.ratio = this.slider.offsetHeight / this.slider.offsetWidth;
        this.sliderWidth = this.slider.offsetWidth;
        this.sliderHeight = this.slider.offsetHeight;
        this.sliderContent.style.width = this.sliderWidth + 'px';
        for (var i = 0; i < this.sliderBodyLength; i++) {
            this.sliderBodyList[i].style.width = this.sliderWidth + 'px';
            if (this.index > i) {
                this.transform3d(this.sliderBodyList[i], -this.sliderWidth, false);
            } else if (this.index < i) {
                this.transform3d(this.sliderBodyList[i], this.sliderWidth, false);
            }
            var sliderImg = this.sliderBodyList[i].querySelector('img');
            sliderImg.style.height = this.sliderHeight + 'px';
            sliderImg.style.width = this.sliderWidth + 'px';
        }
    };

    Slider.prototype.copyLists = function () {
        var lastLi = document.createElement('li'),
            fastLi = document.createElement('li');
        lastLi.classList.add('ue-slider-body');
        lastLi.style.cssText = this.sliderWidth + 'px';
        lastLi.style.webkitTransform = 'translate3d(-' + this.sliderWidth + 'px,0,0)';
        lastLi.innerHTML = this.sliderBodyList[this.sliderBodyLength - 1].innerHTML;
        fastLi.classList.add('ue-slider-body');
        fastLi.style.cssText = this.sliderWidth + 'px';
        fastLi.style.webkitTransform = 'translate3d(' + this.sliderBodyLength * this.sliderWidth + 'px,0,0)';
        fastLi.innerHTML = this.sliderBodyList[0].innerHTML;
        this.sliderContent.insertBefore(lastLi, this.sliderContent.firstChild);
        this.sliderContent.appendChild(fastLi);
    };

    Slider.prototype.createBullet = function () {
        var pagination = document.createElement('div');
        pagination.className = 'ue-slider-indicator';
        for (var i = 0; i < this.sliderBodyLength; i++) {
            var span = document.createElement('span');
            if (this.index == i) {
                span.className = 'ue-active';
            }
            pagination.appendChild(span);
        }
        this.slider.appendChild(pagination);
        this.bulletLists = pagination.getElementsByTagName('span');
        this.bllength = this.bulletLists.length;
    };

    Slider.prototype.autoPlay = function () {
        var self = this;
        clearInterval(self.timer);
        self.timer = setInterval(function () {
            self.move('+1');
        }, self.defaults.autoTime);
    };

    Slider.prototype.stopPlay = function () {
        clearInterval(this.timer);
    };

    Slider.prototype.transform3d = function (e, x, m) {
        if (!e) {
            throw new Error('未指定动画元素！');
        } else {
            e.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
        }
        if (m) {
            e.style.webkitTransition = this.defaults.speed + 'ms ease-out';
        } else {
            e.style.webkitTransition = 'none';
        }
    };

    Slider.prototype.loopSetting = function (n) {
        var self = this;
        switch (n) {
            case 0:
                setTimeout(function () {
                    var mindex = self.sliderBodyLength - 2;
                    self.index = mindex;
                    self.transform3d(self.sliderBodyList[0], -self.sliderWidth, false);
                    self.transform3d(self.sliderBodyList[mindex], 0, false);
                    self.transform3d(self.sliderBodyList[mindex + 1], self.sliderWidth, false);
                    self.transform3d(self.sliderBodyList[mindex - 1], -self.sliderWidth, false);
                    for (var i = mindex - 1; i > 0; i--) {
                        self.transform3d(self.sliderBodyList[i], -self.sliderWidth, false);
                    }
                }, self.defaults.speed);
                break;
            case self.sliderBodyLength - 1:
                setTimeout(function () {
                    var mindex = 1;
                    self.index = mindex;
                    self.transform3d(self.sliderBodyList[mindex], 0, false);
                    self.transform3d(self.sliderBodyList[mindex + 1], self.sliderWidth, false);
                    self.transform3d(self.sliderBodyList[mindex - 1], -self.sliderWidth, false);
                    self.transform3d(self.sliderBodyList[self.sliderBodyLength - 1], self.sliderWidth, false);
                    for (var i = mindex + 1; i < self.sliderBodyLength - 1; i++) {
                        self.transform3d(self.sliderBodyList[i], self.sliderWidth, false);
                    }
                }, self.defaults.speed);
                break;
        }
    };

    Slider.prototype.move = function (m) {
        var mindex;
        if (typeof m == 'number') {
            mindex = this.index;
        } else if (typeof m == 'string') {
            mindex = this.index + m * 1;
        }
        if (mindex > this.sliderBodyLength - 1) {
            mindex = this.sliderBodyLength - 1;
        } else if (mindex < 0) {
            mindex = 0;
        }
        //状态点列表切换方法
        if (this.defaults.pagination) {
            for (var i = 0; i < this.bllength; i++) {
                if (i == mindex - 1) {
                    this.bulletLists[i].setAttribute('class', 'ue-active');
                } else {
                    this.bulletLists[i].setAttribute('class', '');
                    if (mindex > this.bllength) {
                        this.bulletLists[0].setAttribute('class', 'ue-active');
                    } else if (mindex == 0) {
                        this.bulletLists[this.bllength - 1].setAttribute('class', 'ue-active');
                    }
                }
            }
        }
        this.index = mindex;
        this.sliderBodyList[mindex] && (this.transform3d(this.sliderBodyList[mindex], 0, true));
        this.sliderBodyList[mindex + 1] && (this.transform3d(this.sliderBodyList[mindex + 1], this.sliderWidth, true));
        this.sliderBodyList[mindex - 1] && (this.transform3d(this.sliderBodyList[mindex - 1], -this.sliderWidth, true));
        //无缝循环设置
        if (this.defaults.loop) {
            this.loopSetting(this.index);
        }
    };

    Slider.prototype.bindEvent = function () {
        var self = this;
        var moveWidth = this.sliderWidth / 3;
        var touchstart = function (e) {
            self.startX = e.touches[0].pageX;
            //初始化移动的距离
            self.offsetX = 0;
            self.startTime = new Date() * 1;
            self.stopPlay();
        };
        var touchmove = function (e) {
            e.preventDefault();
            self.offsetX = e.touches[0].pageX - self.startX;
            var i = self.index - 1;
            var m = i + 3;
            for (i; i < m; i++) {
                self.sliderBodyList[i] && (self.transform3d(self.sliderBodyList[i], (i - self.index) * self.sliderWidth + self.offsetX, false));
            }
        };
        var touchend = function (e) {
            var endTime = new Date() * 1;
            if (endTime - self.startTime > 700) {
                if (self.offsetX >= moveWidth) {
                    self.move('-1');
                } else if (self.offsetX < -moveWidth) {
                    self.move('+1');
                } else {
                    self.move('0');
                }
            } else {
                if (self.offsetX >= 60) {
                    self.move('-1');
                } else if (self.offsetX < -60) {
                    self.move('+1');
                } else {
                    self.move('0');
                }
            }
            self.autoPlay();
        };
        self.slider.addEventListener('touchstart', touchstart, false);
        self.slider.addEventListener('touchmove', touchmove, false);
        self.slider.addEventListener('touchend', touchend, false);
    };

    return Slider;
});