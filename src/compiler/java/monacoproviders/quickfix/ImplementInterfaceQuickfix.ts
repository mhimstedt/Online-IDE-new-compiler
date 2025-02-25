import { editor, languages } from "monaco-editor";
import { JavaQuickfix } from "./JavaQuickfix.ts";
import * as monaco from 'monaco-editor';
import { JavaClass } from "../../types/JavaClass.ts";
import { JavaMethod } from "../../types/JavaMethod.ts";
import { IJavaInterface } from "../../types/JavaInterface.ts";


export class ImplementInterfaceQuickfix extends JavaQuickfix {

    constructor(private klass: JavaClass, private notImplementedMethods: JavaMethod[], private javaInterface: IJavaInterface) {
        super(klass.identifierRange);
        this.message = "Nicht-implementierte Methoden des Interfaces " + this.javaInterface.identifier;
    }

    provideCodeAction(model: editor.ITextModel): monaco.languages.CodeAction | undefined {
        let klassRange = this.klass.range;
        if(!klassRange) return;

        return {
            title: this.message,
            diagnostics: [this],
            kind: 'quickfix',
            edit: {
                edits: [
                    {
                        resource: model.uri,
                        textEdit: {
                            range: {startLineNumber: klassRange.endLineNumber, startColumn: 0, endLineNumber: klassRange.endLineNumber, endColumn: 0},
                            text: this.notImplementedMethods.map(m => "\t" + m.getDeclaration() + "{\n\t\t//TODO!\n\t}\n").join("\n")
                        },
                        versionId: model.getVersionId()
                    }
                ]
            }
        }


    }

}