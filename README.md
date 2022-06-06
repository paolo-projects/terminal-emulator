# Terminal Emulator

A nodeJs browser library for emulating a terminal, with command and argument parsing, and definition of schemes with callbacks.

## Guide

To build your terminal-like interface for web or nodejs based applications, you start from the `TerminalEmulator` class.

You create an instance of it and set it up with the necessary parameters.

Another important player is the `OutputStream` class. You have to create your own subclass implementing two methods:

-   `abstract write(message: string): void;`
-   `abstract clear(): void;`

The implementation of these methods depends upon whether you're using an HTML div element, a plain string, a console for output, etc.

After you istantiated the class you provide command schemes to it.

A command scheme can be created through the `CommandSchemeBuilder` helper class, and by providing a combination of command, parameter types and a callback, you define a scheme.

You then add it through the `.command(...)` method to the terminal emulator instance.

After you defined your schemes with your callbacks, you then call the `.parse(string)` method on the emulator, and it will tokenize the command line, parse the tokens and assign them to the appropriate category (command name, positional argument, flag argument, value argument). It will then check the schemes and when a match is found it will call the callback defined into the scheme, which is defined like so:

`(command: string, args: Argument[], outputStream: OutputStream) => Promise<boolean>`

The callback returns a promise to support async operations. This is needed when a command executes an HTTP request, or file I/O, to correctly signal the end of the operation to the caller. For instance, it is needed when you want to disable the terminal input while the command is executing.

## An example

This is an example `OutputStream` subclass that prints to the debug console.

```typescript
class ConsoleOutputStream extends OutputStream {
    constructor() {
        super(''); // No end of line character as console.log prints a newline by default
    }
    write(message: string): void {
        console.log(message);
    }
    clear(): void {
        console.clear();
    }
}
```

You then istantiate the `TerminalEmulator` class and set it up with the `OutputStream` istance.

```typescript
const stream = new ConsoleOutputStream();
const emulator = new TerminalEmulator(stream, new DefaultLocalization());
```

The `localization` parameter object consists of the strings to support localization of the error messages shown to the user.

Now you can start adding schemes to the emulator instance.

```typescript
const callback = async (
    command: string,
    args: Argument[],
    outputStream: OutputStream
) => {
    const name = args.find(
        (arg) => arg instanceof ValueArgument && arg.name === 'name'
    )?.value;
    outputStream.writeLine(`Hello, ${name}`);

    return true;
};

emulator.command(
    new CommandSchemeBuilder('hello')
        .withValueArgument('name')
        .callback(callback)
        .build()
);
```

You then parse your terminal input.

```typescript
const cmdLine = 'hello --name John';
emulator.parse(cmdLine);
```

Output:

```bash
> hello --name John
  Hello, John
```

The supported argument types are:

-   Positional arguments

    Positional arguments don't require a flag indicating the parameter name, you just place them next to the command like this:

    `command arg1 arg2 arg3 ...`

-   Flag arguments

    Flag arguments are like a switch. When added to the command, the application knows that something has to be done. Example:

    `command --arg`

-   Value arguments

    Value arguments are key/value type arguments. They're essentially a flag argument followed by a positional argument. Equivalent to options passed to the application, they specify how something has to be done, like in this example:

    `bake --food bread --temperature high`
