import OutputStream from ".";

export default class DOMOutputStream extends OutputStream {
    constructor(private domElement: HTMLElement) {
        super("");
    }

    write(message: string): void {
        //TODO: input sanification
        this.domElement.innerHTML += message;
    }

    writeLine(line: string): void {
        this.write("<p>" + line + "</p>");
    }
}