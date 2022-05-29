import Localization from "../Localization";
import OutputStream from "../OutputStream";
import Tokenizer from "../Tokenizer";
import CommandEntry from "./CommandEntry";
import CommandCallback from "./CommandEntry/CommandCallback";

export default class TerminalEmulator {

    constructor(private outputStream: OutputStream, private localization: Localization) {
    
    }

    private commandsList: CommandEntry[] = [];
    private tokenizer = new Tokenizer(this.localization);
    private commandNotFoundHandler: CommandCallback | null = null;

    command(name: string): CommandEntry {
        const entry = new CommandEntry(name);
        this.commandsList.push(entry);
        return entry;
    }

    notFoundHandler(callback: CommandCallback) {
        this.commandNotFoundHandler = callback;
    }

    reset() {
        this.commandsList = [];
        this.commandNotFoundHandler = null;
    }

    async parse(commandLine: string): Promise<void> {
        const parserCommand = this.tokenizer.parseCommandLine(commandLine);
        for(const command of this.commandsList) {
            if(command.name === parserCommand.name) {
                await command.launchCallback(parserCommand.args, this.outputStream, this.localization);
                return;
            }
        }
        if(this.commandNotFoundHandler) {
            this.commandNotFoundHandler("", [], this.outputStream);
        }
    }
}