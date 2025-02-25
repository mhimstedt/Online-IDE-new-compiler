
import * as monaco from 'monaco-editor'
import { BaseMonacoProvider } from '../../../common/monacoproviders/BaseMonacoProvider.ts';
import { Language } from '../../../common/Language.ts';
import { JavaQuickfix } from './JavaQuickfix.ts';
import { JavaCompiler } from '../../JavaCompiler.ts';



export class JavaCodeActionProvider extends BaseMonacoProvider implements monaco.languages.CodeActionProvider {
    
    constructor(language: Language){
        super(language);
    }

    provideCodeActions(model: monaco.editor.ITextModel, range: monaco.Range, context: monaco.languages.CodeActionContext, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CodeActionList> {
        let codeActions: monaco.languages.CodeAction[] = [];

        let module = (<JavaCompiler>this.findMainForModel(model).getCompiler()).moduleManager.findModuleByModel(model);

        for(let marker of context.markers){
            let javaMarkerData: JavaQuickfix = module.quickfixes.find(
                qf => qf.startLineNumber == marker.startLineNumber && qf.endLineNumber == marker.endLineNumber && qf.startColumn == marker.startColumn && qf.endColumn == marker.endColumn && qf.message == marker.message);
            if(!javaMarkerData) continue;
            let ca = javaMarkerData.provideCodeAction(model);
            if(ca) codeActions.push(ca);
        }

        return {
            actions: codeActions,
            dispose: () => {}
        }
    }
    
    // resolveCodeAction?(codeAction: monaco.languages.CodeAction, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CodeAction> {
    //     throw new Error('Method not implemented.');
    // }

}