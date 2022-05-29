import Argument from "../../Argument";
import OutputStream from "../../OutputStream";

type CommandCallback = (name: string, args: Argument[], outputStream: OutputStream) => Promise<void>;

export default CommandCallback;