import { BaseType } from "../../../common/BaseType";
import { Error } from "../../../common/Error";

export type ReplReturnValue = {
    value: any,
    text: string,
    type: BaseType | undefined,
    errors?: Error[]
} | undefined;
