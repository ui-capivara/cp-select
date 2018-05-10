export namespace Coordinates {
    export function get(elem) {
        var top = 0,
            left = 0,
            bottom = 0,
            right = 0

        var width = elem.offsetWidth;
        var height = elem.offsetHeight;

        while (elem) {
            top += elem.offsetTop;
            left += elem.offsetLeft;
            elem = elem.offsetParent;
        }

        right = left + width;
        bottom = top + height;
        return {
            top: top,
            left: left,
            bottom: bottom,
            right: right,
        }
    }
}