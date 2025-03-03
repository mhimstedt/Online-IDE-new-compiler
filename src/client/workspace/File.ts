import { IMain } from "../../compiler/common/IMain";
import { CompilerFile } from "../../compiler/common/module/CompilerFile";
import { FileData } from "../communication/Data";
import { AccordionElement } from "../main/gui/Accordion";
import { Main } from "../main/Main";
import { Patcher } from "./Patcher";
import { Workspace } from "./Workspace";
import type * as monaco from 'monaco-editor'


export class File extends CompilerFile {

    id?: number;        // database-id in Online-IDE

    text_before_revision: string | null = null;
    submitted_date: string | null = null;
    student_edited_after_revision: boolean = false;

    is_copy_of_id?: number | null = null;
    repository_file_version?: number | null = null;
    identical_to_repository_version: boolean = true;

    version: number = 1;
    panelElement?: AccordionElement;


    constructor(private main: IMain, filename?: string, text?: string) {
        super(filename);
        if(text) this.setText(text);
    }

    getFileData(workspace: Workspace): FileData {
        let fd: FileData = {
            id: this.id,
            name: this.name,
            text: this.getText(),
            text_before_revision: this.text_before_revision,
            submitted_date: this.submitted_date,
            student_edited_after_revision: this.student_edited_after_revision,
            version: this.version,
            is_copy_of_id: this.is_copy_of_id,
            repository_file_version: this.repository_file_version,
            identical_to_repository_version: this.identical_to_repository_version,
            workspace_id: workspace.id,
            forceUpdate: false
        }

        return fd;
    }

    static restoreFromData(main: IMain, f: FileData): File {
        let patched = Patcher.patch(f.text);

        let file = new File(main, f.name);
        file.setText(patched.patchedText);
        file.text_before_revision = f.text_before_revision;
        file.submitted_date = f.submitted_date;
        file.student_edited_after_revision = false;
        file.version = f.version;
        file.id = f.id;
        file.is_copy_of_id = f.is_copy_of_id;
        file.repository_file_version = f.repository_file_version;
        file.identical_to_repository_version = f.identical_to_repository_version;

        return file;
    }


    getMonacoModel(): monaco.editor.ITextModel | undefined {
        let hadMonacoModel: boolean = this.hasMonacoModel();
        let model = super.getMonacoModel();

        if(!hadMonacoModel && !this.main.isEmbedded()){
            model.onDidChangeContent(() => {
                let main1: Main = <Main>this.main;
                if(main1.workspacesOwnerId != main1.user.id){
                    if(this.text_before_revision == null || this.student_edited_after_revision){
                        this.student_edited_after_revision = false;
                        this.text_before_revision = this.getText();

                        this.setSaved(false);
                        main1.networkManager.sendUpdatesAsync(false).then(() => {
                            main1.bottomDiv.homeworkManager.showHomeWorkRevisionButton();
                            main1.projectExplorer.renderHomeworkButton(this);
                        })
                    }
                } else {
                    this.student_edited_after_revision = true;
                }

            })
        }

        return model;
    }

}
