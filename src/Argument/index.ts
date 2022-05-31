export type ArgumentType = 'positional' | 'flag' | 'value';

export default abstract class Argument {
    public abstract argType: ArgumentType;

    constructor(public name: string) {}
}
