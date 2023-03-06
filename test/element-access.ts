import test from "ava";
import {compile} from "./utils";

test("simple", t => {
    t.is(compile(`
export class TestClass {
    private privateField = 10;
    publicField = 20;
    
    test(): number {
        return this['publicField'] + this['privateField'];
    }
}\n`.trimStart()), `
export class TestClass {
    __private_privateField = 10;
    publicField = 20;
    test() {
        return this['publicField'] + this["__private_privateField"];
    }
}\n`.trimStart());
});

test("constant index", t => {
    t.is(compile(`
export class TestClass {
    private static readonly FIELD_NAME = 'privateField';
    private privateField = 10;
    
    test(): number {
        return this[TestClass.FIELD_NAME];
    }
}\n`.trimStart()), `
export class TestClass {
    static __private_FIELD_NAME = 'privateField';
    __private_privateField = 10;
    test() {
        return this["__private_privateField"];
    }
}\n`.trimStart());
});

test("nested", t => {
    t.is(compile(`
export class Test {
    constructor (private privateField: Test, public publicField: Test, private x: number) {}

    test() {
        const a = this["privateField"]["privateField"].x;
        const b = this["privateField"]["publicField"].x;
        const c = this["publicField"]["privateField"].x;
        const d = this["publicField"]["publicField"].x;
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
        const a = this["__private_privateField"]["__private_privateField"].__private_x;
        const b = this["__private_privateField"]["publicField"].__private_x;
        const c = this["publicField"]["__private_privateField"].__private_x;
        const d = this["publicField"]["publicField"].__private_x;
        return a + b + c + d;
    }
}\n`.trimStart());
});

test("optional chaining", t => {
    t.is(compile(`
export class Test {
    private privateField: {[k: string]: {[k2: string]: string}} = {};

    test() {
        return this.privateField["hello"]?.["world"];
    }
}\n`.trimStart()), `
export class Test {
    __private_privateField = {};
    test() {
        return this.__private_privateField["hello"]?.["world"];
    }
}\n`.trimStart());
});
