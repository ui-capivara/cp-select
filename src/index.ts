import capivara from 'capivarajs';
import template from './select/select.template.html';
import style from './select/select.style.scss';
import { SelectController } from './select/select.component';

const Component = {
    template: template,
    style: style,
    constants: ['debounce', 'field', 'placeholder', 'favorite'],
    functions: [],
    bindings: ['cpModel', 'items'],
    controller: SelectController
};

export default capivara.component('cp-select', Component);