import Argument, { ArgumentType } from '.';

export default class ValueArgument<T> extends Argument {
    public argType: ArgumentType = 'value';
    public valueType;

    constructor(name: string, public value: T) {
        super(name);
        this.valueType = typeof value;
    }
}
