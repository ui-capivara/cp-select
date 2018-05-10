import capivara from 'capivarajs';
import { Coordinates } from '../helpers';

export class SelectController {
    public $constants;
    public $functions;
    public $bindings;

    private containerElement;
    private inputValue;
    private data: any;
    private timeLastSearch;

    constructor(private $scope, private $element) {
    }

    $onInit() {
        this.closeWhenClickAway();
    }

    $onViewInit() {
        this.containerElement = this.$element.querySelector('.cp-select-container');
        if (this.$constants.debounce === undefined) {
            this.$constants.debounce = 1000;
        }
    }

    closeWhenClickAway() {
        this.$scope.element(document.body).on('click', (evt) => {
            let elm = evt.target, clickedTheComponent = false;
            while (elm) {
                if (elm.nodeName == 'CP-SELECT') {
                    clickedTheComponent = true;
                    break;
                }
                elm = elm.parentNode;
            }
            if (!clickedTheComponent) this.close();
        });
    }

    select($value) {
        this.inputValue = $value['name'];
        this.$bindings.cpModel = $value;
        this.close();
    }

    hasItemSelected() {
        return capivara.isObject(this.$bindings.cpModel);
    }

    open() {
        this.containerElement.querySelector('ul').style.display = 'flex';
    }

    close() {
        this.containerElement.querySelector('ul').style.display = 'none';
    }

    clear() {
        this.inputValue = '';
        delete this.$bindings.cpModel;
        this.load(this.inputValue, this.$constants.debounce);
    }

    load(param, debounce = 0) {
        if (!param) param = '';
        if (this.timeLastSearch) {
            clearTimeout(this.timeLastSearch);
            delete this.timeLastSearch;
        }
        this.timeLastSearch = setTimeout(() => {
            this.getDataAsync(param).then((resp) => {
                this.data = resp;
                this.open();
            });
        }, debounce);
    }

    getDataAsync(param = '') {
        return new Promise((resolve, reject) => {
            if (this.$functions.searchItems) {
                const searchItemsResponse = this.$functions.searchItems(param);
                if (Array.isArray(searchItemsResponse)) {
                    resolve(searchItemsResponse);
                } else {
                    searchItemsResponse.then((resp) => {
                        resolve(resp.data);
                    });
                }
            } else if (this.$bindings.items) {
                const data = Array.isArray(this.$bindings.items) ? this.$bindings.items : this.$bindings.items();
                resolve((data || []).filter((obj) => {
                    return Object.keys(obj).filter((key) => {
                        if (typeof obj[key] == 'string') {
                            return obj[key].toLowerCase().indexOf(param.toLowerCase()) != -1
                        }
                        return false;
                    }).length > 0;
                }));
            }
        });
    }

    getStyleList() {
        const position = Coordinates.get(this.containerElement);
        const obj = {
            'position': 'fixed',
            'width': this.containerElement.clientWidth + 'px',
            'left': position.left + 'px',
            'top': position.top + this.containerElement.clientHeight + 'px',
        };
        return obj;
    }

    disableScrolling() {
        const x = window.scrollX, y = window.scrollY;
        window.onscroll = function () { window.scrollTo(x, y); };
        document.ontouchmove = function (e) { e.preventDefault(); }
    }

    enableScrolling() {
        window.onscroll = function () { };
        document.ontouchmove = function (e) { return true; }
    }

}