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
    expect(command.args).toContainEqual(new PositionalArgument(0, 'positarg'));
    expect(command.args).toContainEqual(new FlagArgument('flagarg'));
    expect(command.args).toContainEqual(new ValueArgument('valarg', 123));
});

test('tokenize string with 2 flag args', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname positarg --flagarg --valarg 123 --flagarg2'
    );
    expect(command.name).toEqual('cmname');
    expect(command.args).toHaveLength(4);
    expect(command.args).toContainEqual(new PositionalArgument(0, 'positarg'));
    expect(command.args).toContainEqual(new FlagArgument('flagarg'));
    expect(command.args).toContainEqual(new ValueArgument('valarg', 123));
    expect(command.args).toContainEqual(new FlagArgument('flagarg2'));
});

test('tokenize string with bad flag argument', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname positarg -- --valarg 123 --flagarg2'
    );
    expect(command.name).toEqual('cmname');
    expect(command.args).toHaveLength(3);
    expect(command.args).toContainEqual(new PositionalArgument(0, 'positarg'));
    expect(command.args).toContainEqual(new ValueArgument('valarg', 123));
    expect(command.args).toContainEqual(new FlagArgument('flagarg2'));
});

test('tokenize string with displaced positional args', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname positarg --flagarg --valarg 123 positarg2'
    );
    expect(command.name).toEqual('cmname');
    expect(command.args).toHaveLength(4);
    expect(command.args).toContainEqual(new PositionalArgument(0, 'positarg'));
    expect(command.args).toContainEqual(new FlagArgument('flagarg'));
    expect(command.args).toContainEqual(new ValueArgument('valarg', 123));
    expect(command.args).toContainEqual(new PositionalArgument(1, 'positarg2'));
});

test('tokenize string with a lot of spaces', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname positarg                    positarg2'
    );
    expect(command.name).toEqual('cmname');
    expect(command.args).toHaveLength(2);
    expect(command.args).toContainEqual(new PositionalArgument(0, 'positarg'));
    expect(command.args).toContainEqual(new PositionalArgument(1, 'positarg2'));
});

test('tokenize string with quoted argument, and escaped quotes', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'cmname2abc --valarg "A quote from Dante: \\"Lasciate ogni speranza o voi che entrate\\""'
    );
    expect(command.name).toEqual('cmname2abc');
    expect(command.args).toHaveLength(1);
    expect(command.args).toContainEqual(
        new ValueArgument(
            'valarg',
            'A quote from Dante: "Lasciate ogni speranza o voi che entrate"'
        )
    );
});

test('tokenize command with a lot of spaces between args', () => {
    const tokenizer = new Tokenizer(new DefaultLocalization());
    const command = tokenizer.parseCommandLine(
        'hello               posarg            --flagarg  --valarg    value'
    );
    expect(command.name).toEqual('hello');
    expect(command.args).toHaveLength(3);
    expect(command.args).toContainEqual(new PositionalArgument(0, 'posarg'));
    expect(command.args).toContainEqual(new FlagArgument('flagarg'));
    expect(command.args).toContainEqual(new ValueArgument('valarg', 'value'));
});
