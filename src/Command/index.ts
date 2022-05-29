import Argument from "../Argument";

export default class Command {
    constructor(public name: string, public args: Argument[]) {
    }
}