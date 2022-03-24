import test from "ava";
import {compile} from "./utils";

test("constructor", t => {
    t.is(compile(`
export class TestClass {

    constructor (private x: number, private readonly y: number) {
    }
    
    sum(): number {
        return this.x + this.y;
    }
}\n`.trimStart()), `
export class TestClass {
    __private_x;
    __private_y;
    constructor(__private_x, __private_y) {
        this.__private_x = __private_x;
        this.__private_y = __private_y;
    }
    sum() {
        return this.__private_x + this.__private_y;
    }
}\n`.trimStart());
});
