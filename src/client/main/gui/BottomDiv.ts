import jQuery from 'jquery';
import { makeTabs } from "../../../tools/HtmlTools.js";
import { Main } from "../Main.js";
import { Workspace } from "../../workspace/Workspace.js";
import { MyConsole } from "./console/MyConsole.js";
import { ErrorManager } from "./ErrorManager.js";
import { MainBase } from "../MainBase.js";
import { HomeworkManager } from "./HomeworkManager.js";
import { GradingManager } from './GradingManager.js';
import { Disassembler } from '../../../compiler/common/disassembler/Disassembler.js';

export class BottomDiv {

    // programPrinter: ProgramPrinter;
    console: MyConsole;
    errorManager: ErrorManager;
    homeworkManager: HomeworkManager;
    gradingManager: GradingManager;



    constructor(private main: MainBase, public $bottomDiv: JQuery<HTMLElement>, public $mainDiv: JQuery<HTMLElement>) {

        if (this.$bottomDiv.find('.jo_tabheadings>.jo_console-tab').length > 0) {
            this.console = new MyConsole(main, $bottomDiv);
        } else {
            this.console = new MyConsole(main, null);
        }

        if (this.$bottomDiv.find('.jo_tabheadings>.jo_homeworkTabheading').length > 0) {
            this.homeworkManager = new HomeworkManager(<Main>main, $bottomDiv);
        }

        let $gradingTabHeading = this.$bottomDiv.find('.jo_tabheadings>.jo_gradingTabheading');
        if ($gradingTabHeading.length > 0) {
            this.gradingManager = new GradingManager(<Main>main, $bottomDiv, $gradingTabHeading);
        }

        this.errorManager = new ErrorManager(main, $bottomDiv, $mainDiv);
    }

    initGUI() {
        makeTabs(this.$bottomDiv);
        if (this.console != null) this.console.initGUI();
        if(this.homeworkManager != null) this.homeworkManager.initGUI();

        this.$bottomDiv.find('.jo_tabs').children().first().trigger("click");
    }

    getDisassemblerDiv(): HTMLElement {
        return this.$bottomDiv.find('.jo_tabs>.jo_pcodeTab')[0];
    }

    showHomeworkTab() {

        this.$bottomDiv.find('.jo_homeworkTabheading').css('display', 'block');
        let mousePointer = window.PointerEvent ? "pointer" : "mouse";
        this.$bottomDiv.find('.jo_homeworkTabheading').trigger(mousePointer + "down");

    }

    showJunitTab() {

        this.$bottomDiv.find('.jo_testrunnerTabheading').css('display', 'block');
        let mousePointer = window.PointerEvent ? "pointer" : "mouse";
        this.$bottomDiv.find('.jo_testrunnerTabheading').trigger(mousePointer + "down");

    }

    hideHomeworkTab() {

        this.$bottomDiv.find('.jo_homeworkTabheading').css('display', 'none');
        let mousePointer = window.PointerEvent ? "pointer" : "mouse";
        this.$bottomDiv.find('.jo_tabheadings').children().first().trigger(mousePointer + "down");

    }

    showHideBusyIcon(visible: boolean){
        let displayValue: string = visible ? "block" : "none";
        this.$bottomDiv.find(".jo_db-busy").css("display", displayValue);
    }

}