import { editor, languages } from "monaco-editor";
import { JavaQuickfix } from "./JavaQuickfix.ts";
import * as monaco from 'monaco-editor';
import { IJavaClass, JavaClass } from "../../types/JavaClass.ts";
import { JavaMethod } from "../../types/JavaMethod.ts";
import { IJavaInterface } from "../../types/JavaInterface.ts";


export class ImplementInterfaceOrAbstractClassQuickfix extends JavaQuickfix {

    constructor(private klass: JavaClass, private notImplementedMethods: JavaMethod[], private javaInterfaceOrAbstractClass: IJavaInterface | IJavaClass) {
        super(klass.identifierRange);
        if(javaInterfaceOrAbstractClass instanceof IJavaInterface){
            this.message = "Nicht-implementierte Methoden des Interfaces " + this.javaInterfaceOrAbstractClass.identifier + " ergänzen";
        } else {
            this.message = "Nicht-implementierte Methoden der abstrakten Klasse " + this.javaInterfaceOrAbstractClass.identifier + " ergänzen";
        }
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