'use strict';

/*
* 原生js对话框插件，适用于手机端
* @author          涂兴声
* @createDate      2016/08/24
* 名称	           内容
* title            dialog标题
* message          dialog文本内容
* groupBtn         dialog按钮组
* before           dialog点击执行之前的回调
* after            dialog点击执行之后的回调
* close            dialog被删除之后的回调
* */
(function (win, doc) {

    function Dialog(options) {

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
         * Dialog默认配置
         * */
        this.defaults = {
            title: '温馨提示',
            message: '欢迎来到ue世界',
            groupBtn: ['确定'],
            before: function (e) {

            },
            after: function (e) {

            },
            close: function (e) {

            }
        };

        /*
         * 初始化
         * */
        this.init = function () {
            // 自定义配置是否存在
            if (!this.util.isEmpty(options)) {
                // 配置是否是对象
                if (!this.util.isObject(options)) {
                    throw Error('Dialog配置必须是一个对象');
                }
                this.defaults = this.util.extend(this.defaults, options);
            }

            this.isRequire();
        };

        /*
         * 是否需要创建Dialog
         * */
        this.isRequire = function () {
            this.oDialog = document.querySelector('.ue-dialog');
            if (this.oDialog) {
                this.showDialog();
            } else {
                this.createDialog();
            }
        };

        /*
         * 创建Dialog
         * */
        this.createDialog = function () {
            this.oDialog = document.createElement('div');
            this.oDialog.className = 'ue-dialog';

            var ueDialogBtnGroup = '', i = 0;

            for (; i < this.defaults.groupBtn.length; i++) {
                ueDialogBtnGroup += '<div data-dialog-id="' + (i) + '">' + (this.defaults.groupBtn[i]) + '</div>';
            }

            var ueDialog = '<div class="ue-dialog-mask"></div>\
                            <div class="ue-dialog-content">\
                                <div class="ue-dialog-inner">\
                                    <div class="ue-dialog-title">' + (this.defaults.title) + '</div>\
                                    <div class="ue-dialog-text">' + (this.defaults.message) + '</div>\
                                </div>\
                            <div class="ue-dialog-buttons">' + (ueDialogBtnGroup) + '</div>';

            this.oDialog.innerHTML = ueDialog;
            document.body.appendChild(this.oDialog);

            setTimeout(function () {
                this.showDialog();
                this.bindEvent();

                alert(document.querySelector('.ue-dialog-content'));
                document.querySelector('.ue-dialog-content').addEventListener('click', function(){
                    alert('content');
                }, false);

                document.querySelector('.ue-dialog-content').onclick = function(){
                    alert('content');
                };

                document.querySelector('.ue-dialog-mask').addEventListener('click', function(){
                    alert('mask');
                }, false);

            }.bind(this), 0);
        };

        /*
         * 显示Dialog
         * */
        this.showDialog = function () {
            this.oDialog.classList.add('ue-active');
        };

        /*
         * 隐藏Dialog
         * */
        this.hiddenDialog = function () {
            this.oDialog.classList.remove('ue-active');
        };

        /*
         * 删除Dialog
         * */
        this.removeDialog = function () {
            document.body.removeChild(this.oDialog);
            this.defaults.close();
        };

        /*
         * 绑定事件
         * */
        this.bindEvent = function () {
            var self = this;
            document.querySelectorAll('.ue-dialog-buttons > div').forEach(function (e, i) {
                e.addEventListener('touchstart', function () { self.defaults.before(e.dataset.dialogId); }, false);
                e.addEventListener('touchend', function () { self.defaults.after(e.dataset.dialogId); }, false);
            });
        };

        this.init();
    }

    var dialog = {
        /*
         * dialog alert
         * @param {Object} opts
         * @param opts.title  dialog标题
         * @param opts.message  dialog文本内容
         * @param opts.callback  dialog点击之后的回调函数
         * */
        alert: function (opts) {
            var da = new Dialog({
                title: opts.title || '温馨提示',
                message: opts.message || '欢迎来到ue世界',
                after: function (e) {
                    if (e == 0) {
                        da.removeDialog();
                    }
                },
                close: function () {
                    opts.callback();
                }
            })
        },
        /*
         * dialog confirm
         * @param {Object} opts
         * @param opts.title  dialog标题
         * @param opts.message  dialog文本内容
         * @param opts.callback  dialog点击之后的回调函数
         * */
        confirm: function (opts) {
            var da = new Dialog({
                title: opts.title || '温馨提示',
                message: opts.message || '欢迎来到ue世界',
                groupBtn: opts.groupBtn || ['取消', '确定'],
                after: function (e) {
                    // 如果采用默认设置，当为0的时候，就自动执行removeDialog
                    if (!opts.groupBtn) {
                        e == 0 && da.removeDialog();
                    }
                    opts.callback(e);
                }
            })
        }
    };

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(dialog);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = dialog;
    } else {
        win.dialog = dialog;
    }
})(window, document);
