import Argument from "../../Argument";
import FlagArgument from "../../Argument/FlagArgument";
import OutputStream from "../../OutputStream";
import CommandCallback from "./CommandCallback";

export default class CommandEntry {
    private helpText: string = "";
    public commandCallback?: CommandCallback;

    constructor(public name: string) {}

    help(helpText: string): CommandEntry {
        this.helpText = helpText;
        return this;
    }

    callback(callback: CommandCallback): CommandEntry {
        this.commandCallback = callback;
        return this;
    }

    async launchCallback(args: Argument[], outputStream: OutputStream) {
        if(args.some(arg => arg instanceof FlagArgument && arg.name === "help")) {
            outputStream.writeLine(this.helpText);
        } else if (this.commandCallback) {
            try {
                await this.commandCallback(this.name, args, outputStream);
            } catch(err: any) {
                outputStream.writeLine(`An error occurred: ${err.message}`);
            }
        } else {
            outputStream.writeLine(`Command unimplemented`);
        }
    }
}