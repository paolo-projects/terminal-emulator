import Argument from '../Argument';
import FlagArgument from '../Argument/FlagArgument';
import PositionalArgument from '../Argument/PositionalArgument';
import ValueArgument from '../Argument/ValueArgument';
import Command from '../Command';
import ArgumentScheme, {
    FlagArgumentScheme,
    PositionalArgumentScheme,
    ValueArgumentScheme,
} from './ArgumentScheme';

export type CommandSchemeMatchCallback = (
    command: string,
    args: Argument[]
) => Promise<boolean>;

export default class CommandScheme {
    private constructor(
        public name: string,
        public argSchemes: ArgumentScheme[],
        public matchCallback: CommandSchemeMatchCallback
    ) {}

    static Builder = class {
        name: string;
        args: ArgumentScheme[] = [];
        schemeCallback?: CommandSchemeMatchCallback;

        constructor(commandName: string) {
            this.name = commandName;
        }

        withPositionalArgument() {
            const index =
                this.args
                    .filter((a) => a instanceof PositionalArgumentScheme)
                    .reduce(
                        (index, arg) =>
                            Math.max(
                                index,
                                (arg as PositionalArgumentScheme).index
                            ),
                        -1
                    ) + 1;
            this.args.push(new PositionalArgumentScheme(index));
            return this;
        }

        withFlagArgument(name: string) {
            this.args.push(new FlagArgumentScheme(name));
            return this;
        }

        withValueArgument(name: string) {
            this.args.push(new ValueArgumentScheme(name));
            return this;
        }

        callback(callback: CommandSchemeMatchCallback) {
            this.schemeCallback = callback;
            return this;
        }

        build(): CommandScheme {
            return new CommandScheme(
                this.name,
                this.args,
                this.schemeCallback!!
            );
        }
    };

    async execute(command: Command): Promise<boolean> {
        if (command.name !== this.name) {
            return false;
        }

        for (const argScheme of this.argSchemes) {
            switch (argScheme.argType) {
                case 'positional':
                    if (
                        !command.args.filter(
                            (arg) =>
                                arg instanceof PositionalArgument &&
                                arg.index ===
                                    (argScheme as PositionalArgumentScheme)
                                        .index
                        ).length
                    ) {
                        return false;
                    }
                    break;
                case 'flag':
                    if (
                        !command.args.filter(
                            (arg) =>
                                arg instanceof FlagArgument &&
                                arg.name ===
                                    (argScheme as FlagArgumentScheme).argName
                        ).length
                    ) {
                        return false;
                    }
                    break;
                case 'value':
                    if (
                        !command.args.filter(
                            (arg) =>
                                arg instanceof ValueArgument &&
                                arg.name ===
                                    (argScheme as ValueArgumentScheme).argName
                        ).length
                    ) {
                        return false;
                    }
                    break;
            }
        }

        return await this.matchCallback(this.name, command.args);
    }
}
