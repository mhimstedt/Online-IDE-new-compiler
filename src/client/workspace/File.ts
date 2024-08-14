import { CompilerFile } from "../../compiler/common/module/CompilerFile";
import { FileData } from "../communication/Data";
import { AccordionElement } from "../main/gui/Accordion";
import { Patcher } from "./Patcher";
import { Workspace } from "./Workspace";

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

    constructor(filename?: string, text?: string) {
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

    static restoreFromData(f: FileData): File {
        let patched = Patcher.patch(f.text);

        let file = new File(f.name);
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


}
