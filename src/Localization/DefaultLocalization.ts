import Localization from '.';

export default class DefaultLocalization implements Localization {
    NO_CMD_PROVIDED = 'Bad command (no command provided...)';
    BAD_COMMAND = "Bad command (space can't be part of a command)";
    CMD_UNIMPLEMENTED = 'Command unimplemented';
    BAD_COMMAND_ARGS = '%s: Bad arguments';
}
