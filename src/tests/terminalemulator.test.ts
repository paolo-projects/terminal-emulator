import Argument from '../Argument';
import ArgumentList from '../Argument/ArgumentList';
import FlagArgument from '../Argument/FlagArgument';
import ValueArgument from '../Argument/ValueArgument';
import DefaultLocalization from '../Localization/DefaultLocalization';
import OutputStream from '../OutputStream';
import TerminalEmulator from '../TerminalEmulator';

class DummyOutputStream extends OutputStream {
    write(message: string): void {}
    clear(): void {}
}

class StringOutputStream extends OutputStream {
    public buffer: string = '';

    write(message: string): void {
        this.buffer += message;
    }

    clear(): void {
        this.buffer = '';
    }
}

test('scheme parser', async () => {
    const terminal = new TerminalEmulator(
        new DummyOutputStream(),
        new DefaultLocalization()
    );

    const commandCallback = async (
        name: string,
        args: ArgumentList
    ): Promise<boolean> => {
        expect(name).toBe('test');
        expect(args).toHaveLength(2);
        expect(args).toContainEqual(new FlagArgument('arg1'));
        expect(args).toContainEqual(
            new ValueArgument<string>('arg2', 'testval')
        );
        return true;
    };

    terminal
        .command('test')
        .withFlagArgument('arg1')
        .withValueArgument('arg2')
        .callback(commandCallback);

    expect(await terminal.parse('test --arg1 --arg2 testval')).toBe(true);
});

test('command not found', async () => {
    const terminal = new TerminalEmulator(
        new DummyOutputStream(),
        new DefaultLocalization()
    );

    const commandCallback = async (
        name: string,
        args: ArgumentList
    ): Promise<boolean> => {
        throw new Error('Should not reach here');
    };

    terminal
        .command('test')
        .withFlagArgument('arg1')
        .withValueArgument('arg2')
        .callback(commandCallback);

    expect(await terminal.parse('test --arg2 testval')).toBe(false);
});

test('command not found 2', async () => {
    const terminal = new TerminalEmulator(
        new DummyOutputStream(),
        new DefaultLocalization()
    );

    const commandCallback = async (
        name: string,
        args: ArgumentList
    ): Promise<boolean> => {
        throw new Error('Should not reach here');
    };

    terminal
        .command('test')
        .withFlagArgument('arg1')
        .withValueArgument('arg2')
        .callback(commandCallback);

    expect(await terminal.parse('test2 --arg1 --arg2 testval')).toBe(false);
});

test('command with bad arguments, should print the error message signaling bad arguments', async () => {
    const outStream = new StringOutputStream('\n');

    const terminal = new TerminalEmulator(outStream, new DefaultLocalization());

    const callback = async (_: string, __: ArgumentList) => true;

    terminal
        .command('test')
        .withFlagArgument('hello')
        .withPositionalArgument()
        .callback(callback);

    await terminal.parse('test --hello');

    expect(outStream.buffer.includes('Bad arguments'));
});
