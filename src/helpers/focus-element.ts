import capivara from 'capivarajs';

export namespace FocusElement {

    const ITEMS_QUERY = 'ul li.binding-repeat';
    const ITEMS_FOCUSED_KEY = 'focused';

    export function getOptions(element) {
        return Array.from(element.querySelectorAll(ITEMS_QUERY) || []);
    }

    export function getFirstOption(element) {
        return element.querySelector(ITEMS_QUERY + ':first-child');
    }

    export function getLastOption(element) {
        return element.querySelector(ITEMS_QUERY + ':last-child');
    }

    export function setFocusedFirstElement(element) {
        setFocused(getFirstOption(element));
    }

    export function setFocusedLastElement(element) {
        setFocused(getLastOption(element));
    }

    export function getOptionFocused(element) {
        return element.querySelector(ITEMS_QUERY + '.' + ITEMS_FOCUSED_KEY);
    }

    export function removeAllFocus(element) {
        getOptions(element).forEach((option: any) => option.classList.remove(ITEMS_FOCUSED_KEY));
    }

    export function setFocused(option) {
        if (option) {
            option.classList.add(ITEMS_FOCUSED_KEY);
        }
    }

    export function setScrollInOptionFocused(element) {
        const liFocused = getOptionFocused(element);
        if (liFocused) {
            let container = liFocused.parentNode;
            Array.from(container.children).forEach((childNode, i) => {
                if (capivara.equals(childNode, liFocused)) {
                    container.scrollTop = (i * ( container.clientHeight / container.children.length ));
                }
            });
        }
    }

    export function down(element, evt) {
        const lastFocused = getOptionFocused(element);
        this.removeAllFocus(element);
        if (lastFocused && lastFocused.nextElementSibling) {
            setFocused(lastFocused.nextElementSibling);
        } else {
            setFocusedFirstElement(element);
        }
        setScrollInOptionFocused(element);
    }

    export function up(element, evt) {
        const lastFocused = getOptionFocused(element);
        this.removeAllFocus(element);
        if (lastFocused && lastFocused.previousElementSibling) {
            setFocused(lastFocused.previousElementSibling);
        } else {
            setFocusedLastElement(element);
        }
        setScrollInOptionFocused(element);
    }

    export function handling(element, evt) {
        switch (evt.keyCode) {
            case 40:
                this.down(element, evt);
                break;
            case 38:
                this.up(element, evt);
                break;
        }
    }
}