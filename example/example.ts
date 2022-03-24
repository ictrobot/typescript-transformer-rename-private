export class Example {
    private privateField = 10;
    publicField = 20;

    private privateMethod(): number {
        return this.privateField + this.publicField;
    }

    publicMethod(): number {
        return this['privateField'];
    }
}
