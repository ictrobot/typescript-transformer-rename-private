import test from "ava";
import {compile} from "./utils";

test("simple", t => {
    t.is(compile(`
export class TestClass {
    private privateField: number = 10;
    publicField = 20;

    private privateMethod(): number {
        return this.privateField + this.publicField;
    }

    publicMethod(): number {
        return this.privateField;
    }
}\n`.trimStart()), `
export class TestClass {
    __private_privateField = 10;
    publicField = 20;
    __private_privateMethod() {
        return this.__private_privateField + this.publicField;
    }
    publicMethod() {
        return this.__private_privateField;
    }
}\n`.trimStart());
});

test("static", t => {
    t.is(compile(`
export class TestClass {
    private static test: number = 10;

    private static privateMethod(t: TestClass): number {
        return TestClass.test ** 2;
    }

    publicMethod(): number {
        return TestClass.privateMethod(this);
    }
}\n`.trimStart()), `
export class TestClass {
    static __private_test = 10;
    static __private_privateMethod(t) {
        return TestClass.__private_test ** 2;
    }
    publicMethod() {
        return TestClass.__private_privateMethod(this);
    }
}\n`.trimStart());
});

test("nested", t => {
    t.is(compile(`
export class Test {
    constructor (private privateField: Test, public publicField: Test, private x: number) {}

    test() {
        const a = this.privateField.privateField.x;
        const b = this.privateField.publicField.x;
        const c = this.publicField.privateField.x;
        const d = this.publicField.publicField.x;
        return a + b + c + d;
    }
}\n`.trimStart()), `
export class Test {
    __private_privateField;
    publicField;
    __private_x;
    constructor(__private_privateField, publicField, __private_x) {
        this.__private_privateField = __private_privateField;
        this.publicField = publicField;
        this.__private_x = __private_x;
    }
    test() {
        const a = this.__private_privateField.__private_privateField.__private_x;
        const b = this.__private_privateField.publicField.__private_x;
        const c = this.publicField.__private_privateField.__private_x;
        const d = this.publicField.publicField.__private_x;
        return a + b + c + d;
    }
}\n`.trimStart());
});
