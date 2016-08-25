'use strict';

!(function (Preload) {
    'use strict';
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(Preload);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = new Preload();
    } else {
        window.preload = new Preload();
    }
})(function () {
    'use strict';

    function Preload() {

        this.defaults = {
            tpl: '',
            delay: 1000000000
        };

        this.notes = {};
    }

    Preload.prototype.triple = function (tpl) {

    };

    return Preload;
});
