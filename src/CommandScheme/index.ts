import ArgumentList from '../Argument/ArgumentList';
import FlagArgument from '../Argument/FlagArgument';
import PositionalArgument from '../Argument/PositionalArgument';
import ValueArgument from '../Argument/ValueArgument';
import Command from '../Command';
import OutputStream from '../OutputStream';
import ArgumentScheme, {
    FlagArgumentScheme,
    PositionalArgumentScheme,
    ValueArgumentScheme,
} from './ArgumentScheme';

export type CommandSchemeMatchCallback = (
    command: string,
    args: ArgumentList,
    outputStream: OutputStream
) => Promise<boolean>;

export default class CommandScheme {
    private outputStream?: OutputStream;
    public argSchemes: ArgumentScheme[] = [];
    public matchCallback?: CommandSchemeMatchCallback;
    public helpMessage?: string;

    constructor(public name: string) {}

    setOutputStream(stream: OutputStream) {
        this.outputStream = stream;
    }

    async execute(command: Command): Promise<boolean> {
        if (!this.matchCallback) {
            throw new Error('No callback specified for this command scheme');
        }

        if (command.name !== this.name) {
            return false;
        }

        for (const argScheme of this.argSchemes) {
            switch (argScheme.argType) {
                case 'positional':
                    if (
                        !Array.from(command.args).filter(
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
                        !Array.from(command.args).filter(
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
                        !Array.from(command.args).filter(
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

        return await this.matchCallback(
            this.name,
            command.args,
            this.outputStream!!
        );
    }

    withPositionalArgument(): CommandScheme {
        const index =
            this.argSchemes
                .filter((a) => a instanceof PositionalArgumentScheme)
                .reduce(
                    (index, arg) =>
                        Math.max(
                            index,
                            (arg as PositionalArgumentScheme).index
                        ),
                    -1
                ) + 1;
        this.argSchemes.push(new PositionalArgumentScheme(index));
        return this;
    }

    withFlagArgument(name: string): CommandScheme {
        this.argSchemes.push(new FlagArgumentScheme(name));
        return this;
    }

    withValueArgument(name: string): CommandScheme {
        this.argSchemes.push(new ValueArgumentScheme(name));
        return this;
    }

    withHelpMessage(helpMessage: string): CommandScheme {
        this.helpMessage = helpMessage;
        return this;
    }

    callback(callback: CommandSchemeMatchCallback): CommandScheme {
        this.matchCallback = callback;
        return this;
    }
}
