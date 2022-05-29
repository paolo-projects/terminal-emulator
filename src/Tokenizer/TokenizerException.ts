export default class TokenizerException extends Error {
    constructor(public message: string) {
        super(message);
    }
}