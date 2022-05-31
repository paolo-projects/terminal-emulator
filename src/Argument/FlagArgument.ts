import Argument, { ArgumentType } from '.';

export default class FlagArgument extends Argument {
    public argType: ArgumentType = 'flag';

    constructor(name: string) {
        super(name);
    }
}
