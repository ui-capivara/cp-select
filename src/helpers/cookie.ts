import capivara from 'capivarajs';

export namespace Cookie {

    export function set(key, value, days = 999999) {
        let expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = key + "=" + (JSON.stringify(value) || "") + expires + "; path=/";
    }

    export function get(key) {
        let nameEQ = key + "=", ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    export function erase(key) {
        document.cookie = key +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    export function isFavorite(key, value) {
        return capivara.equals(get(key), value);
    }

}