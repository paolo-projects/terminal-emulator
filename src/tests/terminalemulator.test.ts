import Argument from '../Argument';
import FlagArgument from '../Argument/FlagArgument';
import ValueArgument from '../Argument/ValueArgument';
import CommandScheme from '../CommandScheme';
import DefaultLocalization from '../Localization/DefaultLocalization';
import OutputStream from '../OutputStream';
import TerminalEmulator from '../TerminalEmulator';

class DummyOutputStream extends OutputStream {
    write(message: string): void {}
    clear(): void {}
}

test('scheme parser', async () => {
    const terminal = new TerminalEmulator(
        new DummyOutputStream(),
        new DefaultLocalization()
    );

    const commandCallback = async (
        name: string,
        args: Argument[]
    ): Promise<boolean> => {
        expect(name).toBe('test');
        expect(args).toHaveLength(2);
        expect(args).toContainEqual(new FlagArgument('arg1'));
        expect(args).toContainEqual(
            new ValueArgument<string>('arg2', 'testval')
        );
        return true;
    };

    terminal.command(
        new CommandScheme.Builder('test')
            .withFlagArgument('arg1')
            .withValueArgument('arg2')
            .callback(commandCallback)
            .build()
    );

    expect(await terminal.parse('test --arg1 --arg2 testval')).toBe(true);
});

test('command not found', async () => {
    const terminal = new TerminalEmulator(
        new DummyOutputStream(),
        new DefaultLocalization()
    );

    const commandCallback = async (
        name: string,
        args: Argument[]
    ): Promise<boolean> => {
        throw new Error('Should not reach here');
    };

    terminal.command(
        new CommandScheme.Builder('test')
            .withFlagArgument('arg1')
            .withValueArgument('arg2')
            .callback(commandCallback)
            .build()
    );

    expect(await terminal.parse('test --arg2 testval')).toBe(false);
});

test('command not found 2', async () => {
    const terminal = new TerminalEmulator(
        new DummyOutputStream(),
        new DefaultLocalization()
    );

    const commandCallback = async (
        name: string,
        args: Argument[]
    ): Promise<boolean> => {
        throw new Error('Should not reach here');
    };

    terminal.command(
        new CommandScheme.Builder('test')
            .withFlagArgument('arg1')
            .withValueArgument('arg2')
            .callback(commandCallback)
            .build()
    );

    expect(await terminal.parse('test2 --arg1 --arg2 testval')).toBe(false);
});
