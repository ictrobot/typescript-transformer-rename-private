typescript-transformer-rename-private example
===

This directory contains a simple example, which can be compiled two ways:

## ttypescript

[ttypescript](https://www.npmjs.com/package/ttypescript) provides a modified version of the `tsc` command, `ttsc`,
which supports custom transformers. The transformers are configured in `compilerOptions.plugins` in `tsconfig.json`.
Running `npx ttsc` in this directory will produce the following `example.js`:

```js
export class Example {
    __private_privateField = 10;
    publicField = 20;
    __private_privateMethod() {
        return this.__private_privateField + this.publicField;
    }
    publicMethod() {
        return this["__private_privateField"];
    }
}
```

## rollup

[Rollup](https://www.npmjs.com/package/rollup) allows running a minifier after this transformer which can then mangle
names based on a regex. This is the original purpose of the project - allowing 
[terser](https://www.npmjs.com/package/terser) to minify private TypeScript properties and methods. This example uses 
[@rollup/plugin-typescript](https://www.npmjs.com/package/@rollup/plugin-typescript) which supports custom transformers
(and also allows providing an arbitrary renaming function when constructing the transformer, see `rollup.config.js`).
Running `npx rollup -c` in this directory will produce the following `example.min.js`:

```js
class t{t=10;publicField=20;i(){return this.t+this.publicField}publicMethod(){return this.t}}export{t as Example};
```
