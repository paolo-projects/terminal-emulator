import FlagArgument from '../Argument/FlagArgument';
import PositionalArgument from '../Argument/PositionalArgument';
import ValueArgument from '../Argument/ValueArgument';
import DefaultLocalization from '../Localization/DefaultLocalization';
import Tokenizer from '../Tokenizer';

test('tokenize simple string into command with args', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname positarg --flagarg --valarg 123'
    );
    expect(command.name).toEqual('cmname');
    expect(command.args).toHaveLength(3);
    expect(command.args.hasArgument('positarg')).toBe(true);
    expect(command.args.hasArgument('flagarg')).toBe(true);
    expect(command.args.getArgument('flagarg', FlagArgument)).toBeTruthy();
    expect(command.args.hasArgument('valarg')).toBe(true);
    expect(command.args.getArgument('valarg', ValueArgument<number>)?.value).toBe(123);
});

test('tokenize string with 2 flag args', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname positarg --flagarg --valarg 123 --flagarg2'
    );
    expect(command.name).toEqual('cmname');
    expect(command.args).toHaveLength(4);
    expect(command.args.hasArgument('positarg')).toBe(true);
    expect(command.args.getArgument('flagarg', FlagArgument)).toBeTruthy();
    expect(command.args.getArgument('valarg', ValueArgument<number>)?.value).toBe(123);
    expect(command.args.getArgument('flagarg2', FlagArgument)).toBeTruthy();
});

test('tokenize string with bad flag argument', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname positarg -- --valarg 123 --flagarg2'
    );
    expect(command.name).toEqual('cmname');
    expect(command.args).toHaveLength(3);
    expect(command.args.getArgument('positarg', PositionalArgument)).toBeTruthy();
    expect(command.args.getArgument('valarg', ValueArgument<number>)?.value).toBe(123);
    expect(command.args.getArgument('flagarg2', FlagArgument)).toBeTruthy();
});

test('tokenize string with displaced positional args', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname positarg --flagarg --valarg 123 positarg2'
    );
    expect(command.name).toEqual('cmname');
    expect(command.args).toHaveLength(4);
    expect(command.args.hasArgument('positarg')).toBe(true);
    expect(command.args.hasArgument('flagarg')).toBe(true);
    expect(command.args.hasArgument('valarg')).toBe(true);
    expect(command.args.hasArgument('positarg2')).toBe(true);
});

test('tokenize string with a lot of spaces', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname positarg                    positarg2'
    );
    expect(command.name).toEqual('cmname');
    expect(command.args).toHaveLength(2);
    expect(command.args.hasArgument('positarg')).toBe(true);
    expect(command.args.hasArgument('positarg2')).toBe(true);
});

test('tokenize string with quoted argument, and escaped quotes', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname2abc --valarg "A quote from Dante: \\"Lasciate ogni speranza o voi che entrate\\""'
    );
    expect(command.name).toEqual('cmname2abc');
    expect(command.args).toHaveLength(1);
    expect(command.args.hasArgument('valarg')).toBe(true);
    expect(command.args.getArgument('valarg', ValueArgument<string>)?.value).toBe(
            'A quote from Dante: "Lasciate ogni speranza o voi che entrate"'
        );
});

test('tokenize command with a lot of spaces between args', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'hello               posarg            --flagarg  --valarg    value'
    );
    expect(command.name).toEqual('hello');
    expect(command.args).toHaveLength(3);
    expect(command.args.getArgument('posarg', PositionalArgument)).toBeTruthy();
    expect(command.args.getArgument('posaaarg', PositionalArgument)).not.toBeTruthy();
    expect(command.args.getArgument('flagarg', FlagArgument)).toBeTruthy();
    expect(command.args.getArgument('valarg', ValueArgument<string>)?.value).toBe('value');
});
