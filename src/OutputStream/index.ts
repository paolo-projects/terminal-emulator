export default abstract class OutputStream {

    constructor(private endLine: string = "\n") {}

    abstract write(message: string): void;
    writeLine(line: string): void {
        this.write(line);
        this.write(this.endLine);
    }
    abstract clear(): void;
}