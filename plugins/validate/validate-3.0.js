/*
 * 原生js表单验证插件，适用于手机端
 * @author          涂兴声
 * @createDate      2016/08/16
 * 名称	            内容
 * required	        必填，不能为空
 * match	        和另一个输入框的值保持一致
 * number	        数字
 * digits	        整数
 * mobile	        手机号码
 * tel	            座机号码，包括区号
 * email	        email地址
 * zip	            邮编
 * date	            日期，例如 2012-02-02
 * url	            网址，协议是可选的
 * minlength	    最小长度
 * maxlength	    最大长度
 * */
!(function (Validate) {
    'use strict';
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(Validate);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Validate();
    } else {
        window.Validate = Validate();
    }
})(function () {
    'use strict';

    function Validate(options) {

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
             * @name log
             * @type function
             * @explain 打印log信息
             * */
            log: function (msg) {
                if (window.console && this.defaults.debug) {
                    window.console.log(msg);
                }
            }.bind(this),
            /*
             * @name warn
             * @type function
             * @explain 打印报错信息
             * */
            warn: function (msg) {
                if (window.console && this.defaults.debug) {
                    window.console.warn(msg);
                }
            }.bind(this),
            /*
             * @name noop
             * @type function
             * @explain 空函数
             * */
            noop: function () {
            },
            /*
             * @name trim
             * @type function
             * @explain 去掉左右空格
             * */
            trim: function (v) {
                if (!v) return v;
                return v.replace(/^\s+/g, '').replace(/\s+$/g, '')
            },
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
            }
        };

        /*
         * rules object
         * @explain 内置规则，可以无限扩展
         * */
        this.rules = {
            'required': {
                method: function (value, param) {
                    return !this.util.isEmpty(value);
                }.bind(this),
                msg: '请输入内容'
            },
            'match': {
                method: function (value, param) {
                    return value == this.defaults.container.querySelector("[name='" + param + "']").value
                }.bind(this),
                msg: '必须与原始密码一致'
            },
            'number': {
                method: function (value, param) {
                    return (/^\d+(.\d*)?$/).test(value)
                }.bind(this),
                msg: '请输入数字'
            },
            'digits': {
                method: function (value, param) {
                    return (/^\d+$/).test(value)
                }.bind(this),
                msg: '请输入整数'
            },
            'mobile': {
                method: function (value, param) {
                    return (/^0?1[3|4|5|7|8][0-9]\d{8,9}$/).test(value);
                }.bind(this),
                msg: '请填写正确的手机号码'
            },
            'tel': {
                method: function (value, param) {
                    return (/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,11})+$/).test(value);
                }.bind(this),
                msg: '请填写正确的电话号码'
            },
            'email': {
                method: function (value, param) {
                    return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
                }.bind(this),
                msg: '请填写正确的email地址'
            },
            'zip': {
                method: function (value, param) {
                    return (/^[1-9][0-9]{5}$/).test(value);
                }.bind(this),
                msg: '请填写正确的邮编'
            },
            'date': {
                method: function (value, param) {
                    param = param || '-';
                    var reg = new RegExp("^[1|2]\\d{3}" + (param) + "[0-2][0-9]" + (param) + "[0-3][0-9]$");
                    return reg.test(value);
                }.bind(this),
                msg: '请填写正确的日期'
            },
            'url': {
                method: function (value, param) {
                    var urlPattern = /(http|ftp|https):\/\/([\w-]+\.)+[\w-]+\.(com|net|cn|org|me|io|info|xxx)/;
                    if (!/^http|ftp|https/.test(value)) {
                        value = (param || 'http://') + value;
                    }
                    return urlPattern.test(value);
                }.bind(this),
                msg: '请填写正确的网址'
            },
            'minlength': {
                method: function (value, param) {
                    return value.length >= param;
                }.bind(this),
                msg: '长度不能少于$0'
            },
            'maxlength': {
                method: function (value, param) {
                    return value.length <= param;
                }.bind(this),
                msg: '长度不能超过$0'
            }
        };

        /*
         * Validate默认配置
         * */
        this.defaults = {
            el: '#app',                 // 表单验证区域
            container: null,            // 验证区域
            debug: true,                // 是否开启debug模式
            success: this.util.noop,    // 成功方法
            fail: this.util.noop        // 失败方法
        };

        /*
         * Validate init
         * */
        this.init = function () {
            // 自定义配置是否存在
            if (!this.util.isEmpty(options)) {
                // 配置是否是对象
                if (!this.util.isObject(options)) {
                    this.util.warn('form config must be an object');
                }
                this.defaults = this.util.extend(this.defaults, options);
            }

            this.defaults.container = document.querySelector(this.defaults.el);

            this.defaults.container.addEventListener('submit', function () {
                this.onsubmit();
            }.bind(this), false);
        };

        /*
         * @name setRule
         * @type function
         * @explain 设置验证规则
         * @param {String} name 规则名称
         * @param {Function} method 规则验证方法
         * @param {String} msg 错误提示
         * */
        this.setRule = function (name, method, msg) {
            var oldRule = this.rules[name];
            if (oldRule && !method) {
                method = oldRule.method
            }
            this.rules[name] = {
                method: method,
                msg: msg
            };
        };

        /*
         * @name onsubmit
         * @type function
         * @explain 提交验证
         * */
        this.onsubmit = function () {
            var err = {}, errorList = [], hasError, self = this;
            var inputs = this.defaults.container.querySelectorAll('input, select, textarea');
            this.util.each(inputs, function (i, e) {
                err = self.update(e);
                if (err.hasError) {
                    errorList.push(err.errorMsg);
                    return hasError = true;
                }
            });
            if (hasError) {
                this.defaults.fail.call(this, errorList[0]);
            } else {
                this.defaults.success.call(this);
            }
        };

        /*
         * @name update
         * @type function
         * @explain 更新表单状态
         * */
        this.update = function (input) {
            var dataRules = input.getAttribute('data-rules'),
                dataErrors = input.getAttribute('data-error'),
                result = true, err = {}, i = 0;
            dataRules = /\|/.test(dataRules) ? dataRules.split('|') : [dataRules];
            dataErrors = /\|/.test(dataErrors) ? dataErrors.split('|') : [dataErrors];

            for (; i < dataRules.length; i++) {
                var currentRule = dataRules[i], param = '';
                if (/(=)/.test(currentRule)) {
                    var ac = currentRule.split('=');
                    currentRule = ac[0];
                    param = ac[1];
                }
                if (this.rules[currentRule]) {
                    var hasError = this.rules[currentRule].method(this.util.trim(input.value), param);
                    if (result) {
                        result = hasError ? true : false;
                        err = {
                            hasError: !hasError,
                            errorMsg: hasError ? '验证通过' : (dataErrors[i] ? dataErrors[i] : this.rules[currentRule].msg.replace('$0', param))
                        };
                    }
                }
            }
            return err;
        };

        this.init();
    }

    return Validate;
});