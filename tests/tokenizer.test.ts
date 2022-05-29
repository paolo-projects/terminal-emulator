import FlagArgument from "../src/Argument/FlagArgument";
import PositionalArgument from "../src/Argument/PositionalArgument";
import ValueArgument from "../src/Argument/ValueArgument";
import Tokenizer from "../src/Tokenizer";

test("tokenize string into cmdline args", () => {
    const tokenizer = new Tokenizer();
    const command = tokenizer.parseCommandLine("cmname positarg --flagarg --valarg 123");
    expect(command.name).toEqual("cmname");
    expect(command.args).toHaveLength(3);
    expect(command.args.filter(arg => arg instanceof PositionalArgument && arg.name === "positarg")).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof FlagArgument && arg.name === "flagarg")).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof ValueArgument && arg.name === "valarg" && arg.value === 123)).toHaveLength(1);
    expect(command.args.filter(arg => arg.name === "hello")).toHaveLength(0);
});

test("tokenize string into cmdline args 2", () => {
    const tokenizer = new Tokenizer();
    const command = tokenizer.parseCommandLine("cmname positarg --flagarg --valarg 123 --flagarg2");
    expect(command.name).toEqual("cmname");
    expect(command.args).toHaveLength(4);
    expect(command.args.filter(arg => arg instanceof PositionalArgument && arg.name === "positarg")).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof FlagArgument && arg.name === "flagarg")).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof ValueArgument && arg.name === "valarg" && arg.value === 123)).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof FlagArgument && arg.name === "flagarg2")).toHaveLength(1);
    expect(command.args.filter(arg => arg.name === "hello")).toHaveLength(0);
});

test("tokenize string into cmdline args 3", () => {
    const tokenizer = new Tokenizer();
    const command = tokenizer.parseCommandLine("cmname positarg -- --valarg 123 --flagarg2");
    expect(command.name).toEqual("cmname");
    expect(command.args).toHaveLength(3);
    expect(command.args.filter(arg => arg instanceof PositionalArgument && arg.name === "positarg")).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof ValueArgument && arg.name === "valarg" && arg.value === 123)).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof FlagArgument && arg.name === "flagarg2")).toHaveLength(1);
    expect(command.args.filter(arg => arg.name === "hello")).toHaveLength(0);
});

test("tokenize string into cmdline args 2", () => {
    const tokenizer = new Tokenizer();
    const command = tokenizer.parseCommandLine("cmname positarg --flagarg --valarg 123 positarg2");
    expect(command.name).toEqual("cmname");
    expect(command.args).toHaveLength(4);
    expect(command.args.filter(arg => arg instanceof PositionalArgument && arg.name === "positarg")).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof FlagArgument && arg.name === "flagarg")).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof ValueArgument && arg.name === "valarg" && arg.value === 123)).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof PositionalArgument && arg.name === "positarg2")).toHaveLength(1);
    expect(command.args.filter(arg => arg.name === "hello")).toHaveLength(0);
});

test("tokenize string into cmdline args 3", () => {
    const tokenizer = new Tokenizer();
    const command = tokenizer.parseCommandLine("cmname positarg                    positarg2");
    expect(command.name).toEqual("cmname");
    expect(command.args).toHaveLength(2);
    expect(command.args.filter(arg => arg instanceof PositionalArgument && arg.name === "positarg")).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof PositionalArgument && arg.name === "positarg2")).toHaveLength(1);
    expect(command.args.filter(arg => arg.name === "hello")).toHaveLength(0);
});

test("tokenize string into cmdline args 4", () => {
    const tokenizer = new Tokenizer();
    const command = tokenizer.parseCommandLine('cmname2abc --valarg "A quote from Dante: \\"Lasciate ogni speranza o voi che entrate\\""');
    expect(command.name).toEqual("cmname2abc");
    expect(command.args).toHaveLength(1);
    expect(command.args.filter(arg => arg instanceof ValueArgument && arg.name === "valarg" && arg.value === "A quote from Dante: \"Lasciate ogni speranza o voi che entrate\"")).toHaveLength(1);
    expect(command.args.filter(arg => arg.name === "hello")).toHaveLength(0);
});