import { Workspace } from "../../workspace/Workspace.js";
import { Main } from "../Main.js";
import { MainBase } from "../MainBase.js";
import jQuery from 'jquery';
import { File } from "../../workspace/File.js";
import { Error } from "../../../compiler/common/Error.js";
import { MainEmbedded } from "../../embedded/MainEmbedded.js";

export class ErrorManager {

    oldDecorations: string[] = [];
    oldErrorDecorations: string[] = [];
    $errorDiv: JQuery<HTMLElement>;

    $bracket_warning: JQuery<HTMLElement>;

    minimapColor: {[key: string]:string } = {};

    constructor(private main: MainBase, private $bottomDiv: JQuery<HTMLElement>, $mainDiv: JQuery<HTMLElement>) {
        this.minimapColor["error"] = "#bc1616";
        this.minimapColor["warning"] = "#cca700";
        this.minimapColor["info"] = "#75beff";

        this.$bracket_warning = $mainDiv.find(".jo_parenthesis_warning");

        this.$bracket_warning.attr('title', 'Klammeralarm!');
        this.$bracket_warning.children().attr('title', 'Klammeralarm!');

        let that = this;
        $mainDiv.find(".jo_pw_undo").on("click", () => {
            let editor = that.main.getMainEditor();
            editor.trigger(".", "undo", {});
        }).attr('title', 'Undo');
    }

    showParenthesisWarning(error: string){
        if(error != null){
            this.$bracket_warning.css("visibility", "visible");
            this.$bracket_warning.find(".jo_pw_heading").text(error);
        } else {
            this.$bracket_warning.css("visibility", "hidden");
        }
    }

    showErrors(workspace: Workspace): Map<File, number> {

        let errorCountMap: Map<File, number> = new Map();

        this.$errorDiv = this.$bottomDiv.find('.jo_tabs>.jo_errorsTab');
        this.$errorDiv.empty();

        let hasErrors = false;

        for (let file of workspace.getFiles()) {

            
            let $errorList: JQuery<HTMLElement>[] = [];
            
            let errors = this.main.getCompiler().getSortedAndFilteredErrors(file);
            errorCountMap.set(file, errors.length);

            for (let error of errors) {

                this.processError(error, file, $errorList);

            }

            if ($errorList.length > 0 && this.$errorDiv.length > 0) {
                hasErrors = true;
                let $file = jQuery('<div class="jo_error-filename">' + file.name + '&nbsp;</div>');
                this.$errorDiv.append($file);
                for (let $error of $errorList) {
                    this.$errorDiv.append($error);
                }
            }

        }

        if (!hasErrors && this.$errorDiv.length > 0) {
            this.$errorDiv.append(jQuery('<div class="jo_noErrorMessage">Keine Fehler gefunden :-)</div>'));
        }

        return errorCountMap;

    }

    processError(error: Error, f: File, $errorDivs: JQuery<HTMLElement>[]) {

        let $div = jQuery('<div class="jo_error-line"></div>');
        let $lineColumn = jQuery('<span class="jo_error-position">[Z&nbsp;<span class="jo_linecolumn">' + error.range.startLineNumber + '</span>' +
            ' Sp&nbsp;<span class="jo_linecolumn">' + error.range.startColumn + '</span>]</span>:&nbsp;');
        let category = "";
        switch (error.level) {
            case "error": break;
            case "warning": category = '<span class="jo_warning_category">Warnung: </span>'; break;
            case "info": category = '<span class="jo_info_category">Info: </span>'; break;
        }
        let $message = jQuery('<div class="jo_error-text">' + category + error.message + "</div>");

        $div.append($lineColumn).append($message);

        let that = this;
        $div.on("mousedown", (ev) => {
            this.$errorDiv.find('.jo_error-line').removeClass('jo_active');
            $div.addClass('jo_active');
            that.showError(f, error);
        });

        $errorDivs.push($div);
    }

    showError(f: File, error: Error) {

        if (this.main instanceof Main) {
            if (f != this.main.getCurrentWorkspace()?.getCurrentlyEditedFile()) {
                this.main.editor.dontDetectLastChange();
                this.main.projectExplorer.setFileActive(f);
            }
        }

        if(this.main instanceof MainEmbedded){
            this.main.setFileActive(f);
        }

        this.main.getMainEditor().revealRangeInCenter(error.range);

        let className: string = "";
        switch (error.level) {
            case "error": className = "jo_revealError"; break;
            case "warning": className = "jo_revealWarning"; break;
            case "info": className = "jo_revealInfo"; break;
        }

        this.oldDecorations = f.getMonacoModel().deltaDecorations(this.oldDecorations, [
            {
                range: error.range,
                options: { className: className }

            }
        ]);


    }

}