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

    command(scheme: CommandScheme): TerminalEmulator {
        scheme.setOutputStream(this.outputStream);
        this.commandSchemes.push(scheme);
        return this;
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
        for (const scheme of this.commandSchemes.sort(
            (a, b) => b.argSchemes.length - a.argSchemes.length
        )) {
            if (await scheme.execute(parsedCommand)) {
                return true;
            }
        }
        if (this.commandNotFoundHandler) {
            await this.commandNotFoundHandler(
                parsedCommand.name,
                parsedCommand.args,
                this.outputStream
            );
        }
        return false;
    }
}
