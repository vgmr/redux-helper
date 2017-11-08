import * as expect from "expect";
import { Expectation } from "expect";

export const expectExist = <T>(value: any): Expectation<T> => {
    const exp = (<any>expect)(value);
    exp.not.toBeUndefined();
    exp.not.toBeNull();
    return exp;
};