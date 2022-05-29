import Argument from ".";

export default class ValueArgument<T> extends Argument {
    constructor(name: string, public value: T) {
        super(name);
    }
}