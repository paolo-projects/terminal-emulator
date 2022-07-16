import FlagArgument from '../Argument/FlagArgument';
import CommandScheme from '../CommandScheme';
import Localization from '../Localization';
import OutputStream from '../OutputStream';
import Tokenizer from '../Tokenizer';
import CommandEntry from './CommandEntry';
import CommandCallback from './CommandEntry/CommandCallback';

export default class TerminalEmulator {
    constructor(
        private outputStream: OutputStream,
        private localization: Localization
    ) {}

    //private commandsList: CommandEntry[] = [];
    private commandSchemes: CommandScheme[] = [];
    private tokenizer = new Tokenizer(this.localization);
    private commandNotFoundHandler: CommandCallback | null = null;

    command(name: string): CommandScheme {
        const scheme = new CommandScheme(name);
        this.commandSchemes.push(scheme);
        return scheme;
    }

    notFoundHandler(callback: CommandCallback) {
        this.commandNotFoundHandler = callback;
    }

    reset() {
        this.commandSchemes = [];
        this.commandNotFoundHandler = null;
    }

    async parse(commandLine: string): Promise<boolean> {
        const parsedCommand = this.tokenizer.parseCommandLine(commandLine);

        const schemeSubset = this.commandSchemes
            .filter((scheme) => scheme.name === parsedCommand.name)
            .sort((a, b) => b.argSchemes.length - a.argSchemes.length);

        if (schemeSubset.length) {
            if (parsedCommand.args.getArgument('help', FlagArgument)) {
                this.outputStream.writeLine(
                    schemeSubset.find((s) => s.helpMessage)?.helpMessage || ''
                );
                return true;
            }

            for (const scheme of schemeSubset) {
                if (await scheme.execute(parsedCommand)) {
                    return true;
                }
            }

            this.outputStream.writeLine(
                this.localization.BAD_COMMAND_ARGS.replace(
                    '%s',
                    parsedCommand.name
                )
            );
            this.outputStream.writeLine(
                schemeSubset.find((s) => s.helpMessage)?.helpMessage || ''
            );
        } else if (this.commandNotFoundHandler) {
            await this.commandNotFoundHandler(
                parsedCommand.name,
                parsedCommand.args,
                this.outputStream
            );
        }

        return false;
    }
}
