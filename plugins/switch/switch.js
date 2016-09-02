'use strict';

(function (win, doc) {

    var switchIndex = 0, switchState = {}, i = 0, switchs = doc.querySelectorAll('.ue-switch');
    var translateX = function (e, x) {
        e.style.webkitTransform = 'translate(' + x + 'px, 0)';
    };

    for (; i < switchs.length; i++) {
        var switchHandle = switchs[i].querySelector('.ue-switch-handle'),
            isActive = switchs[i].classList.contains('ue-active'),
            switchWidth = switchs[i].offsetWidth,
            handleWidth = switchHandle.offsetWidth,
            handleX = switchWidth - handleWidth - 3,
            index = ++switchIndex;

        switchState[index] = {
            'switchHandle': switchHandle,
            'switchWidth': switchWidth,
            'handleWidth': handleWidth,
            'handleX': handleX,
            'uid': false
        };

        switchs[i].setAttribute('data-switch', index);
        // 初始化状态
        translateX(switchHandle, isActive ? handleX : 0);
        switchState[index]['uid'] = isActive;


        switchs[i].addEventListener('touchstart', function () {
            var index = this.dataset.switch;
            this.classList[switchState[index]['uid'] ? 'remove' : 'add']('ue-active');
            translateX(switchState[index]['switchHandle'], switchState[index]['uid'] ? 0 : switchState[index]['handleX']);
            switchState[index]['uid'] = !switchState[index]['uid'];
        }, false)
    }

})(window, document);
