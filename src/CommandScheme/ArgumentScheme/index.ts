import { ArgumentType } from '../../Argument';

export default abstract class ArgumentScheme {
    public abstract argType: ArgumentType;
}

export class PositionalArgumentScheme extends ArgumentScheme {
    public argType: ArgumentType = 'positional';

    constructor(public index: number) {
        super();
    }
}

export class FlagArgumentScheme extends ArgumentScheme {
    public argType: ArgumentType = 'flag';

    constructor(public argName: string) {
        super();
    }
}

export class ValueArgumentScheme extends ArgumentScheme {
    public argType: ArgumentType = 'value';

    constructor(public argName: string) {
        super();
    }
}
