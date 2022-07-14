import ArgumentList from '../Argument/ArgumentList';

export default class Command {
    constructor(public name: string, public args: ArgumentList) {}
}
