import Argument, { ArgumentType } from '.';

export default class PositionalArgument<T> extends Argument {
    public argType: ArgumentType = 'positional';
    public valueType;

    constructor(public index: number, public value: T) {
        super('positional');
        this.valueType = typeof value;
    }
}
