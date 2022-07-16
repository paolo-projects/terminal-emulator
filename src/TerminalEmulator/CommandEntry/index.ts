import Argument from '../../Argument';
import ArgumentList from '../../Argument/ArgumentList';
import FlagArgument from '../../Argument/FlagArgument';
import Localization from '../../Localization';
import OutputStream from '../../OutputStream';
import CommandCallback from './CommandCallback';

export default class CommandEntry {
    private helpText: string = '';
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

    async launchCallback(
        args: ArgumentList,
        outputStream: OutputStream,
        localization: Localization
    ) {
        if (args.getArgument('help', FlagArgument)) {
            outputStream.writeLine(this.helpText);
        } else if (this.commandCallback) {
            try {
                await this.commandCallback(this.name, args, outputStream);
            } catch (err: any) {
                outputStream.writeLine(err.message);
            }
        } else {
            outputStream.writeLine(localization.CMD_UNIMPLEMENTED);
        }
    }
}
