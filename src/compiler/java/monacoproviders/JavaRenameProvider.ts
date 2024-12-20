import { IMain } from "../../common/IMain.ts";
import { BaseMonacoProvider } from "../../common/monacoproviders/BaseMonacoProvider.ts";
import { UsagePosition } from "../../common/UsagePosition.ts";
import { JavaLanguage } from "../JavaLanguage.ts";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";
import * as monaco from 'monaco-editor'


export class JavaRenameProvider extends BaseMonacoProvider implements monaco.languages.RenameProvider {

    constructor(language: JavaLanguage) {
        super(language);
        monaco.languages.registerRenameProvider(language.monacoLanguageSelector, this);
    }

    provideRenameEdits(model: monaco.editor.ITextModel, position: monaco.Position, newName: string, token: monaco.CancellationToken):
        monaco.languages.ProviderResult<monaco.languages.WorkspaceEdit & monaco.languages.Rejection> {

        let main = this.findMainForModel(model);
        if (!main) return;

        let editor = monaco.editor.getEditors().find(e => e.getModel() == model);
        if (!editor) return;

        let usagePosition = this.getUsagePosition(main, position, editor);

        if (!usagePosition) {
            return;
        }

        let edits: monaco.languages.IWorkspaceTextEdit[] = [];

        for (let module of main.getCompiler().getAllModules()) {

            let allUsagePositions = (<JavaCompiledModule>module).getUsagePositionsForSymbol(usagePosition?.symbol);

            if (!allUsagePositions) continue;


            for (let up of allUsagePositions) {
                if (!up.file.getMonacoModel()!?.uri) continue;
                edits.push({
                    resource: up.file.getMonacoModel()!.uri,
                    versionId: up.file.getMonacoModel()!.getVersionId(),
                    textEdit: { range: up.range, text: newName }
                })
            }
        }


        return {
            edits: edits
        }
    }

    resolveRenameLocation?(model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.RenameLocation & monaco.languages.Rejection> {
        let main = this.findMainForModel(model);
        if (!main) return;

        let editor = monaco.editor.getEditors().find(e => e.getModel() == model);
        if (!editor) return;

        let usagePosition = this.getUsagePosition(main, position, editor);
        if (!usagePosition) return;
        return {
            range: usagePosition?.range,
            text: usagePosition?.symbol.identifier
        }
    }

    getUsagePosition(main: IMain, position: monaco.Position, editor: monaco.editor.ICodeEditor): UsagePosition | undefined {
        if (editor.getModel()?.getLanguageId() != 'myJava') return undefined;

        let module = <JavaCompiledModule>main.getCurrentWorkspace()?.getModuleForMonacoModel(editor.getModel());
        if (!module) return;

        return module.compiledSymbolsUsageTracker.findSymbolAtPosition(position);
    }

}