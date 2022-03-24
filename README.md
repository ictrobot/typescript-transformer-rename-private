typescript-transformer-rename-private
===

A simple TypeScript transformer to rename private properties and methods to allow mangling by a minifier.
See `example/` for example usage with [ttypescript](https://www.npmjs.com/package/ttypescript) and
[Rollup](https://www.npmjs.com/package/rollup) with [terser](https://www.npmjs.com/package/terser).

Supports:
- Dot property accessors
- Bracket notation, where the property name is a string literal, or a constant with string literal type.
- Destructing assignment, including nesting, renaming properties, and providing defaults
- A custom private property prefix (default `__private_`) provided using transformer options, or a custom rename function

Does NOT support arbitrary indexing into the object. If you find any other unsupported syntax, please open an issue.

[MIT License](/LICENSE)
