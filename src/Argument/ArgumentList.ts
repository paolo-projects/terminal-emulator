import Argument from '.';
import PositionalArgument from './PositionalArgument';
import ValueArgument from './ValueArgument';

type Constructor<T> = { new (...args: any[]): T };

export default class ArgumentList {
    constructor(private args: Argument[]) {}

    getArgument<T extends Argument = Argument>(
        name: string,
        argType?: Constructor<T>
    ): T | null {
        const argument = this.args.find((a) => {
            if (argType === undefined || a instanceof argType) {
                if (a instanceof PositionalArgument) {
                    return a.value === name;
                } else {
                    return a.name === name;
                }
            }
        });
        return argument ? (argument as T) : null;
    }

    hasArgument(name: string): boolean {
        return this.args.find((a) => {
            if (a instanceof PositionalArgument) {
                return a.value === name;
            } else {
                return a.name === name;
            }
        })
            ? true
            : false;
    }

    *[Symbol.iterator]() {
        let i = 0;
        while (i < this.args.length) {
            yield this.args[i++];
        }
    }

    public get length(): number {
        return this.args.length;
    }

    /**
     * Iterates every argument of type T
     * @param callback A callback to run with the filtered arguments as parameter
     * @param argumentClass The specific Argument types to include
     */
    forEach<T extends Argument = Argument>(
        callback: (a: T) => void,
        argumentClassFilter?: Constructor<T>
    ) {
        for (const arg of this.args) {
            if (!argumentClassFilter || arg instanceof argumentClassFilter) {
                callback(arg as T);
            }
        }
    }
}
