import ArgumentList from '../../Argument/ArgumentList';
import OutputStream from '../../OutputStream';

type CommandCallback = (
    name: string,
    args: ArgumentList,
    outputStream: OutputStream
) => Promise<void>;

export default CommandCallback;
