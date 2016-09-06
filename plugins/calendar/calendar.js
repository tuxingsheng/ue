'use strict';

(function (window, document) {

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
        // 获取年
        getFullYear: function (date) {
            return date.getFullYear();
        },
        // 获取月
        getMonth: function (date) {
            return date.getMonth();
        },
        tf: function (i) {
            return (i < 10 ? '0' : '') + i
        },
        formatDate: function (time, format) {
            var getFullYear = util.tf(time.getFullYear()),
                getMonth = util.tf(time.getMonth() + 1),
                getDate = util.tf(time.getDate()),
                getHours = util.tf(time.getHours()),
                getMinutes = util.tf(time.getMinutes()),
                getSeconds = util.tf(time.getSeconds());
            return {
                getFullYear: getFullYear,
                getMonth: getMonth,
                getDate: getDate,
                getHours: getHours,
                getMinutes: getMinutes,
                getSeconds: getSeconds,
                date: format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                    switch (a) {
                        case 'yyyy':
                            return getFullYear;
                            break;
                        case 'MM':
                            return getMonth;
                            break;
                        case 'dd':
                            return getDate;
                            break;
                        case 'HH':
                            return getHours;
                            break;
                        case 'mm':
                            return getMinutes;
                            break;
                        case 'ss':
                            return getSeconds;
                            break;
                    }
                })
            }
        }
    };


    var template = '' +
        '<div class="ue-calendar-title ue-clearfix">' + '{{ date }}' + '</div>' +
        '<div class="ue-calendar-nav">' + '{{ nav }}' + '</div>' +
        '<div class="ue-calendar-wrap ue-clearfix">' + '{{ time }}' + '</div>';


    var Calendar = function (options) {

        options = options || {};

        /*
         * 默认配置
         * */
        this.defaults = {
            count: 1,
            minDate: null,
            maxDate: null,
            selectDate: new Date(),
            nav: ['一', '二', '三', '四', '五', '六', '日'],
            dateFormat: 'yyyy-MM-dd',
            onChange: function () {

            }
        };

        this.defaults = util.extend(this.defaults, options);

        this._init();
    };

    Calendar.prototype = {
        constroctor: Calendar,
        /*
         * 初始化
         * */
        _init: function () {
            this._selectorElement();
            this._bindEvent();
        },
        _updateDate: function (value) {
            this.date = util.formatDate(value ? new Date(value) : new Date(), this.defaults.dateFormat);
        },
        /*
         * 查询element元素
         * */
        _selectorElement: function () {
            this.calendar = typeof this.defaults.el ? document.querySelector(this.defaults.el) : this.defaults.el;
            this.calendar.className = 'ue-calendar';


            this._updateDate();
            this._render();
        },
        _initRender: function () {
            this.calendar.innerHTML = template
                .replace('{{ date }}', this._createCalendarTitle())
                .replace('{{ nav }}', this._createCalendarNav())
                .replace('{{ time }}', this._createCalendarWrap());
        },
        _render: function () {
            this.calendar.innerHTML = template
                .replace('{{ date }}', this._createCalendarTitle())
                .replace('{{ nav }}', this._createCalendarNav())
                .replace('{{ time }}', this._createCalendarWrap());
        },
        _bindEvent: function () {
            this.calendarLeft = this.calendar.querySelector('.ue-calendar-left');
            this.calendarRight = this.calendar.querySelector('.ue-calendar-right');
            this.calendarLeft.addEventListener('touchstart', function () {
                this._updateCalendar('-');
            }.bind(this));
            this.calendarRight.addEventListener('touchstart', function () {
                this._updateCalendar('+');
            }.bind(this));
        },
        _updateCalendar: function (n) {
            switch (n) {
                case '+':
                    this.date.getMonth = parseInt(this.date.getMonth) + 1;
                    break;
                case '-':
                    this.date.getMonth = parseInt(this.date.getMonth) - 1;
                    break;
            }
            if (this.date.getMonth > 12) {
                this.date.getFullYear = parseInt(this.date.getFullYear) + 1;
                this.date.getMonth = 1;
            }
            if (this.date.getMonth < 1) {
                this.date.getFullYear = parseInt(this.date.getFullYear) - 1;
                this.date.getMonth = 12;
            }
            this._render();
            this._bindEvent();
        },

        /*
         * 创建calendar-title
         * */
        _createCalendarTitle: function () {
            return '' +
                '<a href="javascript:;" class="ue-calendar-left ue-icon ue-icon-back"></a>' +
                '<a href="javascript:;" class="ue-calendar-right ue-icon ue-icon-forward"></a>' +
                '<h2 class="ue-calendar-headline">' + (this.date.getFullYear) + '年' + (this.date.getMonth) + '月</h2>';
        },
        /*
         * 创建calendar-nav
         * */
        _createCalendarNav: function () {
            var dom = '';
            this.defaults.nav.forEach(function (e, i) {
                dom += '<div class="ue-calendar-nav-name' + (i > 4 ? ' ue-calendar-cl-orange' : ' ') + '">' + e + '</div>';
            });
            return dom;
        },
        /*
         * 创建calendar-wrap
         * */
        _createCalendarWrap: function () {
            var dom = [], before = [];
            var beforeCount = Math.abs(new Date(this.date.getFullYear, this.date.getMonth - 1, 1).getDay());
            // 如果是星期天
            beforeCount = beforeCount == 0 ? 7 : beforeCount;
            var beforeDate = new Date(this.date.getFullYear, this.date.getMonth - 1, 0).getDate();
            var currentDate = new Date(this.date.getFullYear, this.date.getMonth, 0).getDate();
            var x = beforeDate;
            var i = beforeCount - 2;
            var k = 0;
            var y = 0;
            var limit = 42 - beforeCount - currentDate + 1;


            // 前一个月的日期显示
            for (; x > 0; x--) {
                before.push(x);
            }
            for (; i >= 0; i--) {
                dom.push('<div class="ue-calendar-grid ue-calendar-cl-cfcfcf"><span>' + (before[i]) + '</span><span>入住</span></div>')
            }

            // 本月日期显示
            for (; k < currentDate; k++) {
                var curDate = this.date.getFullYear + '-' + this.date.getMonth + '-' + (k + 1);
                dom.push('<div class="ue-calendar-grid" data-current="' + (curDate) + '"><span>' + (k + 1) + '</span><span>入住</span></div>');
            }

            // 下一个月的日期显示
            for (; y < limit; y++) {
                dom.push('<div class="ue-calendar-grid ue-calendar-cl-cfcfcf"><span>' + (y + 1) + '</span><span>入住</span></div>');
            }

            return dom.join('');
        }
    };


    if (typeof exports === 'object') module.exports = Calendar;
    else if (typeof define === 'function' && define.amd) define([], function () {
        return Calendar;
    });
    else window.Calendar = Calendar;
})(window, document);

