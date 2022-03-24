import test from "ava";
import {compile} from "./utils";

test("with property name", t => {
    t.is(compile(`
export class TestClass {
    private privateField = 10;
    publicField = 2;

    test(): number {
        const {privateField: a, publicField: b} = this;
        return a * b;
    }
}\n`.trimStart()), `
export class TestClass {
    __private_privateField = 10;
    publicField = 2;
    test() {
        const { __private_privateField: a, publicField: b } = this;
        return a * b;
    }
}\n`.trimStart());
});

test("without property name", t => {
    t.is(compile(`
export class TestClass {
    private privateField = 10;
    publicField = 2;

    test(): number {
        const {privateField, publicField: b} = this;
        return privateField * b;
    }
}\n`.trimStart()), `
export class TestClass {
    __private_privateField = 10;
    publicField = 2;
    test() {
        const { __private_privateField: privateField, publicField: b } = this;
        return privateField * b;
    }
}\n`.trimStart());
});

test("nested", t => {
    t.is(compile(`
export class Point {
    constructor (private x: number, private y: number, public base: Point) {}

    test(): number {
        const {x, y, base: {x: x2, y: y2}} = this;
        return x + y + x2 + y2;
    }
}\n`.trimStart()), `
export class Point {
    __private_x;
    __private_y;
    base;
    constructor(__private_x, __private_y, base) {
        this.__private_x = __private_x;
        this.__private_y = __private_y;
        this.base = base;
    }
    test() {
        const { __private_x: x, __private_y: y, base: { __private_x: x2, __private_y: y2 } } = this;
        return x + y + x2 + y2;
    }
}\n`.trimStart());
});

test("inside array binding", t => {
    t.is(compile(`
export class Point {
    constructor (private x: number, private y: number) {}

    static test(points: [Point, Point]) {
        const [{x: a, y: b}, {x: c, y: d}] = points;
        return a * b * c * d;
    }
}\n`.trimStart()), `
export class Point {
    __private_x;
    __private_y;
    constructor(__private_x, __private_y) {
        this.__private_x = __private_x;
        this.__private_y = __private_y;
    }
    static test(points) {
        const [{ __private_x: a, __private_y: b }, { __private_x: c, __private_y: d }] = points;
        return a * b * c * d;
    }
}\n`.trimStart());
});

test("with default", t => {
    t.is(compile(`
export class Test {
    public a = 1;
    private b = 2;

    constructor (private c?: number) {}

    test() {
        const {a, b, c=this.b} = this;
        return a * b * c;
    }
}\n`.trimStart()), `
export class Test {
    __private_c;
    a = 1;
    __private_b = 2;
    constructor(__private_c) {
        this.__private_c = __private_c;
    }
    test() {
        const { a, __private_b: b, __private_c: c = this.__private_b } = this;
        return a * b * c;
    }
}\n`.trimStart());
});
