import capivara from 'capivarajs';
import { Coordinates } from '../helpers';
import { FocusElement } from '../helpers/focus-element';
import { Cookie } from '../helpers/cookie';

export class SelectController {
  public $constants;
  public $functions;
  public $bindings;

  private containerElement;
  private inputValue = '';
  private loading = false;
  private hasFocus = false;
  private positionList = {};

  private data;
  private timeLastSearch;
  private timeCloseList;
  private FAVORITE_KEY;

  constructor(private $scope, private $element) {
  }

  onKeyDown(evt) {
    if (evt.keyCode == 13) {
      evt.preventDefault();
      evt.stopPropagation();
      const focusedOption = FocusElement.getOptionFocused(this.$element);
      if (focusedOption) {
        this.select(focusedOption['$scope'].scope.$value);
      }
    } else {
      FocusElement.handling(this.$element, evt);
    }
  }

  onKeyUp(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.keyCode !== 13 && evt.keyCode !== 40 && evt.keyCode !== 38) {
      this.$bindings.cpModel = null;
      this.load(this.inputValue, this.$constants.debounce, true)
    }
  }

  $onInit() {
    this.setFavoriteKey();
    this.closeWhenClickAway();
    this.$scope.element(document).on('scroll', () => {
      if (this.hasFocus) {
        this.setStyleList();
      }
    });
  }

  $onViewInit() {
    this.containerElement = this.$element.querySelector('.cp-select-container');
    if (this.$constants.debounce === undefined) {
      this.$constants.debounce = 500;
    }
    if (this.$constants.favorite) {
      const favoriteValue = Cookie.get(this.FAVORITE_KEY);
      if (favoriteValue) {
        setTimeout(() => {
          this.select(favoriteValue);
        });
      }
    }
    if (this.$bindings.cpModel) {
      if (Object.keys(this.$bindings.cpModel).length > 0) {
        this.inputValue = this.$constants.field ? this.$bindings.cpModel[this.$constants.field] : this.$bindings.cpModel;
      } else {
        this.$bindings.cpModel = null;
      }
    }
    this.$scope.$watch('$ctrl.$bindings.cpModel', (newValue) => this.select(newValue, true));
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
      if (!clickedTheComponent) {
        if (this.timeCloseList) { clearTimeout(this.timeCloseList) }
        this.close();
      }
    });
  }

  select($value, forceUpdate?) {
    if (($value && !capivara.equals($value, this.$bindings.cpModel)) || ($value && forceUpdate)) {
      this.inputValue = this.$constants.field ? $value[this.$constants.field] : $value;
      this.$bindings.cpModel = $value;
      this.close();
      this.$element.querySelector('.cp-select-container input').focus();
      if (this.$functions.onSelect) this.$functions.onSelect($value);
    }
  }

  hasItemSelected() {
    return capivara.isObject(this.$bindings.cpModel);
  }

  open() {
    this.setStyleList();
    this.containerElement.querySelector('ul').style.display = 'block';
  }

  close() {
    this.containerElement.querySelector('ul').style.display = 'none';
  }

  clear() {
    if (this.$bindings.cpModel) {
      if (this.$functions.onRemove) {
        this.$functions.onRemove(this.$bindings.cpModel);
      }
    }
    this.inputValue = '';
    this.$bindings.cpModel = null;
    if (this.timeCloseList) { clearTimeout(this.timeCloseList) }
    this.containerElement.querySelector('input').focus();
  }

  onFocusInput() {
    if (this.hasFocus) {
      return;
    }
    this.hasFocus = true;
    this.load(this.inputValue, this.$constants.debounce, false);
  }

  onBlurInput() {
    this.hasFocus = false;
    this.timeCloseList = setTimeout(() => {
      this.close();
    }, 500);
  }

  load(param, debounce = 0, clearModel?) {
    if (!param) param = '';
    if (this.timeLastSearch) {
      clearTimeout(this.timeLastSearch);
      delete this.timeLastSearch;
    }
    this.timeLastSearch = setTimeout(() => {
      if (this.$bindings.cpModel) { return; };
      this.loading = true;
      this.getDataAsync(param).then((resp) => {
        this.data = resp;
        if (this.hasFocus) {
          this.open();
          setTimeout(() => {
            FocusElement.removeAllFocus(this.$element);
            FocusElement.setFocusedFirstElement(this.$element);
          }, 100);
        }
        this.loading = false;
      });
    }, debounce);
  }

  getDataAsync(param = '') {
    return new Promise((resolve, reject) => {
      const data = Array.isArray(this.$bindings.items) ? this.$bindings.items : this.$bindings.items(param);
      const filterData = (arr) => {
        return arr.filter((obj) => {
          return Object.keys(obj).filter((key) => {
            if (typeof obj[key] == 'string') {
              return obj[key].toLowerCase().indexOf(param.toLowerCase()) != -1
            }
            return false;
          }).length > 0;
        });
      }
      if (typeof data.then === 'function') {
        data.then((itemsResponse) => {
          resolve(filterData(itemsResponse.data));
        });
      } else {
        resolve(filterData(data));
      }
    });
  }

  setStyleList() {
    const position = Coordinates.get(this.containerElement);
    const obj = {
      'position': 'fixed',
      'width': this.containerElement.clientWidth + 'px',
      'left': position.left + 'px',
      'top': position.top + this.containerElement.clientHeight + 'px',
    };
    this.positionList = obj;
    this.$scope.refresh();
  }

  getText($value) {
    return this.$constants.field ? $value[this.$constants.field] : $value;
  }

  hasTransclude() {
    return this.$element.querySelector('cp-transclude');
  }

  setFavoriteKey() {
    this.FAVORITE_KEY = btoa(this.$element.outerHTML)
      .replace(/\+|\&|\?|[0-9]|\=|\-/g, '')
      .split('')
      .filter((item, pos, self) => self.indexOf(item) == pos)
      .join('');
  }

  favorite(evt, $value) {
    if (this.timeCloseList) {
      clearTimeout(this.timeCloseList);
    }
    evt.preventDefault();
    evt.stopPropagation();
    if (this.isFavorite($value)) {
      Cookie.erase(this.FAVORITE_KEY);
    } else {
      Cookie.set(this.FAVORITE_KEY, $value);
    }
    this.hasFocus = true;
    this.containerElement.querySelector('input').focus();
  }

  isFavorite($value) {
    return Cookie.isFavorite(this.FAVORITE_KEY, $value);
  }

  $onChanges() {
    setTimeout(() => {
      if (this.$bindings.cpModel) {
        this.inputValue = this.$constants.field ? this.$bindings.cpModel[this.$constants.field] : this.$bindings.cpModel;
      }
    });
  }

}
