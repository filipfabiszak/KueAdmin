"use strict";
var PhoneValidator = (function () {
    function PhoneValidator() {
    }
    PhoneValidator.isValid = function (control) {
        var re = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(control.value);
        if (re || (control.value.length < 1)) {
            return null;
        }
        return { "invalidPhone": true };
    };
    return PhoneValidator;
}());
exports.PhoneValidator = PhoneValidator;
//# sourceMappingURL=phone.js.map