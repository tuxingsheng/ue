'use strict';

/*
 * toast.js，适用于手机端
 * @author          涂兴声
 * @createDate      2016/08/22
 * 名称	            内容
 * msg              显示的信息
 * time             显示的时间
 * */
!(function (toast) {
    'use strict';
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(toast);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = toast();
    } else {
        window.toast = toast();
    }
})(function () {
    'use strict';

    function toast(msg, time, type) {
        var toast = document.createElement('div');
        toast.classList.add('ue-toast');
        toast.innerText = msg;
        toast.classList.add(type == 'center' ? 'ue-toast-center' : 'ue-toast-bottom');
        document.body.appendChild(toast);

        setTimeout(function () {
            toast.parentNode.removeChild(toast);
        }, time || 2000);
    }

    return toast;
});
