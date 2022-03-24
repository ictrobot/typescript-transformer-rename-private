import test from "ava";
import {compile} from "./utils";
import defaultRenamePrivateTransformer, {RenamePrivateTransformer} from "../transformer";

test("defaults", t => {
    t.is(compile(`
export class TestClass {
    private testA: number = 10;
    private testB() {
        return this.testA;
    }
    public testC() {
        return this.testB();
    }
}\n`.trimStart()), `
export class TestClass {
    __private_testA = 10;
    __private_testB() {
        return this.__private_testA;
    }
    testC() {
        return this.__private_testB();
    }
}\n`.trimStart());
});

test("prefix supplied", t => {
    t.is(compile(`
export class TestClass {
    private testA: number = 10;
    private testB() {
        return this.testA;
    }
    public testC() {
        return this.testB();
    }
}\n`.trimStart(), defaultRenamePrivateTransformer, {privatePrefix: 'abc_'} ), `
export class TestClass {
    abc_testA = 10;
    abc_testB() {
        return this.abc_testA;
    }
    testC() {
        return this.abc_testB();
    }
}\n`.trimStart());
});

test("custom function", t => {
    const reverseString = (s: string) => s.split('').reverse().join('')

    t.is(compile(`
export class TestClass {
    private testA: number = 10;
    private testB() {
        return this.testA;
    }
    public testC() {
        return this.testB();
    }
}\n`.trimStart(), RenamePrivateTransformer(reverseString)), `
export class TestClass {
    Atset = 10;
    Btset() {
        return this.Atset;
    }
    testC() {
        return this.Btset();
    }
}\n`.trimStart());
});
