import FlagArgument from "../Argument/FlagArgument";
import PositionalArgument from "../Argument/PositionalArgument";
import ValueArgument from "../Argument/ValueArgument";
import Command from "../Command";
import Localization from "../Localization";
import TokenizerException from "./TokenizerException";

export type ValueArgumentTypes = ValueArgument<string> | ValueArgument<number> | ValueArgument<boolean>;

export default class Tokenizer {
    private matcher = /(?:\"?(\.+?)\"?|(\S+))/;

    constructor(private localization: Localization) {}
    
    parseCommandLine(cmdLine: String): Command {
        let tokens = [];

        let isInQuotes = false;
        let currentToken = "";
        let escapeNextChar = false;

        for(let i = 0; i < cmdLine.length; i++) {
            const currentChar = cmdLine.charAt(i);
            const hasCharEscaped = escapeNextChar;
            switch(currentChar) {
                case " ":
                    if(!isInQuotes) {
                        if(currentToken.length > 0) {
                            tokens.push(currentToken);
                        }
                        currentToken = "";
                        escapeNextChar = false;
                        continue;
                    }
                    break;
                case "\\":
                    if(!escapeNextChar) {
                        escapeNextChar = true;
                        continue;
                    }
                    break;
                case "\"":
                    if(!escapeNextChar) {
                        isInQuotes = !isInQuotes;
                        continue;
                    }
                    break;
            }
            currentToken += currentChar;
            if(hasCharEscaped) {
                escapeNextChar = false;
            }
        }

        if(currentToken.length > 0) {
            tokens.push(currentToken);
        }

        if(tokens.length == 0) {
            throw new TokenizerException(this.localization.NO_CMD_PROVIDED);
        }
        if(tokens[0].split(" ").length > 1) {
            throw new TokenizerException(this.localization.BAD_COMMAND);
        }

        const command = tokens[0];
        const args = [];
        let previousArg = "";

        for(let i = 1; i < tokens.length; i++) {
            if(tokens[i].startsWith("--")) {
                if(previousArg.length > 0) {
                    args.push(new FlagArgument(previousArg));
                }
                previousArg = tokens[i].substring(2);
            } else {
                if(previousArg.length > 0) {
                    args.push(this.getValueArgFromString(previousArg, tokens[i]));
                    previousArg = "";
                } else {
                    args.push(new PositionalArgument(tokens[i]));
                }
            }
        }

        if(previousArg.length > 0) {
            args.push(new FlagArgument(previousArg));
        }

        return new Command(command, args);
    }

    private getValueArgFromString(name: string, value: string): ValueArgumentTypes { 
        if(!isNaN(Number(value))) {
            return new ValueArgument<number>(name, Number(value));
        } else if (value.toLowerCase() === "true") {
            return new ValueArgument<boolean>(name, true);
        } else if (value.toLowerCase() === "false") {
            return new ValueArgument<boolean>(name, false);
        }
        return new ValueArgument<string>(name, value);
    }
}