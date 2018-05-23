# Introdução

O cp-select é um componente para de seleção, ele permite o usuário buscar dados especificos e seleciona-los.

------
# Instalação

## # CDN
Recomendamos vincular a um número de versão específico que você possa atualizar manualmente, porém no exemplo iremos utilizar a ultima versão disponível.
```html
<!-- Stylesheet -->
<link rel="stylesheet" href="https://unpkg.com/@uicapivara/cp-select@latest/dist/cp-select.min.css">

<!-- Component -->
<script src="https://unpkg.com/@uicapivara/cp-select@latest/dist/cp-select.min.js"></script>
```
Certifique-se de ler sobre as diferentes construções e use a produção, substituindo os arquivos .js por .min.js. Esta é uma compilação otimizada para velocidade em vez de experiência de desenvolvimento.

## # NPM
O NPM é o método de instalação recomendado ao criar aplicativos de grande escala. Ele combina muito bem com bundlers de módulo, como Webpack ou Browserify.

```shell
$ npm install @uicapivara/cp-select --save
```
Após a instalação, precisamos importar o componente no projeto.

Se seu projeto utiliza **typescript** você pode importar o componente normalmente.
```javascript
import '@uicapivara/cp-select';
```
Caso contrário é necessário importa-los especificando o arquivo **js**. Exemplo:
```javascript
import '@uicapivara/cp-select/index.js';
```

# Como usar

Se chegamos até aqui, provavelmente a instalação foi finalizada êxito, isso significa que já podemos utilizar o cp-select.
Vamos agora criar uma nova instância do componente. Para isso basta colocarmos o HTML abaixo, informando o nome do atributo para o **cp-model** na qual será usado para atribuir o item selecionado.

Também é necessário informamos as opções que o usuário tem para selecionar, essa lista pode ser informada através do atributo **items**. Esse atributo pode receber um **Array** fixo, ou até mesmo uma função, essa função pode retornar um **Array** ou uma **Promisse**.

Para finalizar, precisamos informar o atributo **field**, ele é responsável por informar o valor visivel dentro da **input** no momento que um item estiver selecionado.

```html
<cp-select cp-model="$ctrl.pessoa" items="$ctrl.lista" field="'name'"></cp-select>
```
```javascript
class MyController {
    constructor() {
      this.lista = [ 
            { name: "Mateus" }, 
            { name: "Felipe" }, 
            { name: "Caio" }, 
            { name: "Luiz" } 
        ];
    }
}

capivara.controller(document.body, MyController);
```

Disponibilizamos alguns exemplos em diferentes ambientes, afim de demonstrar sua funcionalidade.

CapivaraJS - [Jsfiddle](https://jsfiddle.net/t0b8xxfj/27/).

Angular.js - [Jsfiddle](https://jsfiddle.net/t0b8xxfj/14).

Angular - [Jsfiddle](https://jsfiddle.net/1hk7knwq/3601/).

Vue.js - [Jsfiddle](http://jsfiddle.net/td4v7qqd/75/).

React - [Jsfiddle](http://jsfiddle.net/td4v7qqd/76/).

# Favoritos
Você pode ativar a funcionalidade de favoritos. Essa funcionalidade faz com que o componente salve um registro padrão, para que quando o usuário entrar na tela, não ter a necessidade de selecionar sempre o mesmo registro.

Para ativar essa função basta colocar o atributo **favorite** como verdadeiro. Exemplo: 
```html
<cp-select cp-model="$ctrl.pessoa" 
           items="$ctrl.lista" 
           field="'name'" 
           favorite="true">
</cp-select>
```
Veja esse exemplo no [Jsfiddle](https://jsfiddle.net/t0b8xxfj/26/).

# Transclude
Também é permitido customizar o template das opções, isso acontece quando precisamos colocar mais informações dentro do html. Para isso utilizamos a funcionalidade de **transclude** do capivarajs.

Você precisa passar seu template dentro da tag **cp-transclude** para podermos disponibilizar uma variável **$value** com o item da sua lista.
```html
<cp-select cp-model="$ctrl.pessoa" items="$ctrl.lista" field="'name'" >
    <cp-transclude>
        <span>[[ $value.name ]]</span>
        <img cp-attr.src="$value.picture" width="30"/>
    </cp-transclude>
</cp-select>
```
Veja esse exemplo no [Jsfiddle](https://jsfiddle.net/t0b8xxfj/25/).

# Async
Afim de demostrar que o componente aceita dados assíncronos, criamos um exemplo **Angular.js** demonstrando que você pode criar uma função que retorna uma **Promisse**. 

Quando é informado uma função no atributo **items**, o componente passa para a função o texto que o usuário informou, para que seja possível você filtrar os dados por uma API. 

Veja esse exemplo no [Jsfiddle](https://jsfiddle.net/t0b8xxfj/20/).

# Eventos
O componente permite que você escute alguns eventos, isso te permite realizar ações em determinados momentos.

## onSelect
Evento executado quando o usuário seleciona um registro, essa função recebe o item que foi selecionado. Exemplo: 
```html
<cp-select cp-model="$ctrl.pessoa" 
           items="$ctrl.lista" 
           field="'name'" 
           on-select="$ctrl.onItemSelect">
</cp-select>
```
```javascript
class MyController {
    constructor() { }

    onItemSelect(item) {
        console.log('Selecionou: ', item);
    }
}

capivara.controller(document.body, MyController);
```
Veja esse exemplo no [Jsfiddle](https://jsfiddle.net/t0b8xxfj/24/).

## onRemove
Evento executado quando o usuário desfaz a seleção de um item. Exemplo: 
```html
<cp-select cp-model="$ctrl.pessoa" 
           items="$ctrl.lista" 
           field="'name'" 
           on-remove="$ctrl.onItemRemove">
</cp-select>
```
```javascript
class MyController {
    constructor() { }

    onItemRemove() {
        console.log('Função executada.');
    }
}

capivara.controller(document.body, MyController);
```
Veja esse exemplo no [Jsfiddle](https://jsfiddle.net/t0b8xxfj/23/).