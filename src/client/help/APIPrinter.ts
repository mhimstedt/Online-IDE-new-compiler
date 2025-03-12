import { JavaClass } from "../../compiler/java/types/JavaClass";
import { JavaEnum } from "../../compiler/java/types/JavaEnum";
import { JavaField } from "../../compiler/java/types/JavaField";
import { JavaInterface } from "../../compiler/java/types/JavaInterface";
import { JavaMethod } from "../../compiler/java/types/JavaMethod";

export abstract class APIPrinter {

    abstract printClassEnumInterface(cei: JavaClass | JavaEnum | JavaInterface): string;
    abstract printField(field: JavaField): string;
    abstract printMethod(method: JavaMethod): string;

}