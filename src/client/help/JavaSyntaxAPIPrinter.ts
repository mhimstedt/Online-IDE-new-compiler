import { TokenType } from "../../compiler/java/TokenType";
import { GenericTypeParameter } from "../../compiler/java/types/GenericTypeParameter";
import { JavaClass } from "../../compiler/java/types/JavaClass";
import { JavaEnum } from "../../compiler/java/types/JavaEnum";
import { JavaField } from "../../compiler/java/types/JavaField";
import { JavaInterface } from "../../compiler/java/types/JavaInterface";
import { JavaMethod } from "../../compiler/java/types/JavaMethod";
import { APIPrinter } from "./APIPrinter";

type classEnumInterface = "class" | "enum" | "interface";

export class JavaSyntaxAPIPrinter extends APIPrinter {

    printClassEnumInterface(cei: JavaClass | JavaEnum | JavaInterface): string {
        let type: classEnumInterface;

        if (cei instanceof JavaClass) type = "class";
        if (cei instanceof JavaEnum) type = "enum";
        if (cei instanceof JavaInterface) type = "interface";

        let s: string = "public " + type + cei.identifier;
        if (cei.genericTypeParameters.length > 0) {
            s += '<' + cei.genericTypeParameters.map(gtp => this.genericTypeParameterToString(gtp)).join(", ") + ">"
        }

        s += "{\n";
        if (cei instanceof JavaEnum) {
            s += cei.getFields().filter(field => field.visibility != TokenType.keywordPrivate && field.isStatic()).map(v => v.identifier).join(", ") + ";\n\n";
            for (let a of cei.getFields().filter(field => !field.isStatic())) {
                s += this.printField(a);
            }
        }

        if (cei instanceof JavaClass) {
            for (let a of cei.getFields()) {
                s += this.printField(a);
            }
        }

        for (let m of cei.methods.filter(m => m.isConstructor)) {
            s += this.printMethod(m);
        }

        for (let m of cei.methods.filter(m => !m.isConstructor)) {
            s += this.printMethod(m);
        }

        s += "}\n";

        return s;
    }

    genericTypeParameterToString(gtp: GenericTypeParameter) {
        let s: string = gtp.identifier;
        s += (gtp.lowerBound ? " super " + gtp.lowerBound?.pathAndIdentifier : "") +
            (gtp.upperBounds.length > 0 ? " extends " + gtp.upperBounds.map(ub => ub.pathAndIdentifier).join(" & ") : "");

    }

    printField(field: JavaField): string {
        let s = "  " + field.type.toString() + " " + field.identifier + ";\n"
        return s;
    }

    printMethod(method: JavaMethod): string {
        let s = "";
        return ""
    }

}