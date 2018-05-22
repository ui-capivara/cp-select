# Introdução

O cp-select é um componente para de seleção, ele permite o usuário buscar dados especificos e seleciona-los.

------
# Instalação

## # CDN
Recomendamos vincular a um número de versão específico que você possa atualizar manualmente, porém no exemplo iremos utilizar a ultima versão disponível.
```html
<!-- Stylesheet -->
<link rel="stylesheet" href="https://unpkg.com/cp-select@latest/dist/cp-select.min.css">

<!-- Component -->
<script src="https://unpkg.com/cp-select@latest/dist/cp-select.min.js"></script>
```
Certifique-se de ler sobre as diferentes construções e use a produção, substituindo os arquivos .js por .min.js. Esta é uma compilação otimizada para velocidade em vez de experiência de desenvolvimento.

## # NPM
O NPM é o método de instalação recomendado ao criar aplicativos de grande escala. Ele combina muito bem com bundlers de módulo, como Webpack ou Browserify.

```shell
$ npm install cp-select --save
```
Após a instalação, precisamos importar o componente no projeto.

Se seu projeto utiliza **typescript** você pode importar o componente normalmente.
```javascript
import 'cp-select';
```
Caso contrário é necessário importa-los especificando o arquivo **js**. Exemplo:
```javascript
import 'cp-select/index.js';
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