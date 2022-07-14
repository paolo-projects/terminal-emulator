import ArgumentList from '../Argument/ArgumentList';
import FlagArgument from '../Argument/FlagArgument';
import PositionalArgument from '../Argument/PositionalArgument';
import ValueArgument from '../Argument/ValueArgument';

const sampleArgs = [
    new PositionalArgument(0, 'hello'),
    new FlagArgument('hi'),
    new ValueArgument('name', 'value'),
    new PositionalArgument(1, 'john'),
];
const sampleArgList = new ArgumentList(sampleArgs);

test('argument list get method', () => {
    const arg = sampleArgList.getArgument('name', ValueArgument<string>);
    expect(arg).toBeTruthy();
    expect(arg?.value).toBe('value');

    const pos = sampleArgList.getArgument('john', PositionalArgument<string>);
    expect(pos).toBeTruthy();

    const unknown = sampleArgList.getArgument('mark');
    expect(unknown).toBeNull();

    const unknown2 = sampleArgList.getArgument('john', FlagArgument);
    expect(unknown2).toBeNull();
});

test('argument foreach', () => {
    const args = sampleArgList.forEach((arg) => {
        expect(['hello', 'john'].includes(arg.value)).toBe(true);
    }, PositionalArgument<string>);
});

test('generic argument', () => {
    const arg = sampleArgList.getArgument('john');
    expect(arg).toBeTruthy();

    const arg2 = sampleArgList.getArgument('name');
    expect(arg2).toBeTruthy();
    expect(arg2!.argType).toBe('value')

    const arg2val = arg2 as ValueArgument<string>;
    expect(arg2val).toBeTruthy();
    expect(arg2val.value).toBe('value');

    const arg2wrongVal = arg2 as ValueArgument<number>;
    expect(arg2wrongVal).toBeTruthy();
    expect(arg2wrongVal.valueType).toBe('string');
    expect(arg2wrongVal.value as any as string).toBe('value');
})