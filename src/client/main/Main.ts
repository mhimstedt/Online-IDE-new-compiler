import jQuery from 'jquery';
import { Debugger } from '../../compiler/common/debugger/Debugger.js';
import { Position } from '../../compiler/common/range/Position.js';
import { IRange } from '../../compiler/common/range/Range.js';
import { DatabaseNewLongPollingListener } from '../../tools/database/DatabaseNewLongPollingListener.js';
import { checkIfMousePresent } from "../../tools/HtmlTools.js";
import { ClassData, UserData, WorkspaceData, Workspaces } from "../communication/Data.js";
import { NetworkManager } from "../communication/NetworkManager.js";
import { PushClientManager } from '../communication/pushclient/PushClientManager.js';
import { SynchronizationManager } from "../repository/synchronize/RepositorySynchronizationManager.js";
import { RepositoryCheckoutManager } from "../repository/update/RepositoryCheckoutManager.js";
import { RepositoryCreateManager } from "../repository/update/RepositoryCreateManager.js";
import { RepositorySettingsManager } from "../repository/update/RepositorySettingsManager.js";
import { SpriteManager } from "../spritemanager/SpriteManager.js";
import { InconsistencyFixer } from "../workspace/InconsistencyFixer.js";
import { Workspace } from "../workspace/Workspace.js";
import { ActionManager } from "./gui/ActionManager.js";
import { BottomDiv } from "./gui/BottomDiv.js";
import { Editor } from "./gui/Editor.js";
import { Helper } from "./gui/Helper.js";
import { MainMenu } from "./gui/MainMenu.js";
import { ProjectExplorer } from "./gui/ProjectExplorer.js";
import { RightDiv } from "./gui/RightDiv.js";
import { Sliders } from "./gui/Sliders.js";
import { TeacherExplorer } from "./gui/TeacherExplorer.js";
import { ThemeManager } from "./gui/ThemeManager.js";
import { ViewModeController } from "./gui/ViewModeController.js";
import { WindowStateManager } from "./gui/WindowStateManager.js";
import { Login } from "./Login.js";
import { MainBase } from "./MainBase.js";
import { PruefungManagerForStudents } from './pruefung/PruefungManagerForStudents.js';
import { File } from '../workspace/File.js';
import { Compiler } from '../../compiler/common/Compiler.js';
import { Executable } from '../../compiler/common/Executable.js';
import { Interpreter } from '../../compiler/common/interpreter/Interpreter.js';
import { Language } from '../../compiler/common/Language.js';
import { CompilerWorkspace } from '../../compiler/common/module/CompilerWorkspace.js';
import { JavaRepl } from '../../compiler/java/parser/repl/JavaRepl.js';

export class Main implements MainBase {

    repositoryOn: boolean = true;
    workspaceList: Workspace[] = [];
    workspacesOwnerId: number;

    // monaco_editor: monaco.editor.IStandaloneCodeEditor;
    editor: Editor;
    currentWorkspace: Workspace;
    projectExplorer: ProjectExplorer;
    teacherExplorer: TeacherExplorer;
    networkManager: NetworkManager;
    actionManager: ActionManager;
    mainMenu: MainMenu;

    synchronizationManager: SynchronizationManager;
    repositoryCreateManager: RepositoryCreateManager;
    repositoryUpdateManager: RepositorySettingsManager;
    repositoryCheckoutManager: RepositoryCheckoutManager;

    pruefungManagerForStudents: PruefungManagerForStudents;

    spriteManager: SpriteManager;

    windowStateManager: WindowStateManager = new WindowStateManager(this);

    login: Login;

    debugger: Debugger;

    bottomDiv: BottomDiv;

    startupComplete = 2;
    waitForGUICallback: () => void;

    user: UserData;
    userDataDirty: boolean = false;

    themeManager: ThemeManager;

    rightDiv: RightDiv;

    debounceDiagramDrawing: any;

    viewModeController: ViewModeController;

    language: Language;
    interpreter: Interpreter;

    addWorkspace(ws: Workspace): void {
        this.workspaceList.push(ws);   
    }

    getInterpreter(): Interpreter {
        return this.interpreter;    
    }

    getLanguage(): Language {
        return this.language;
    }

    getCompiler(): Compiler {
        return this.language.getCompiler();    
    }

    getRepl(): JavaRepl {
        return this.language.getRepl();
    }

    getMainEditor(): monaco.editor.IStandaloneCodeEditor {
        return this.editor.editor;   
    }

    getReplEditor(): monaco.editor.IStandaloneCodeEditor {
        return this.bottomDiv.console.editor;
    }

    isEmbedded(): boolean { return false; }

    getDebugger(): Debugger {
        return this.debugger;
    }

    getRightDiv(): RightDiv {
        return this.rightDiv;
    }

    getBottomDiv(): BottomDiv {
        return this.bottomDiv;
    }

    getActionManager(): ActionManager {
        return this.actionManager;
    }

    showProgramPointerPosition(file: File, position: Position) {
        this.projectExplorer.showProgramPointerPosition(file, position);
    }

    hideProgramPointerPosition() {
        this.projectExplorer.hideProgramPointerPosition();
    }

    setFileActive(file: File) {
        this.projectExplorer.setFileActive(module);
    }

    jumpToDeclaration(file: File, declaration: IRange) {
        this.projectExplorer.setFileActive(file);
        this.editor.editor.revealLineInCenter(declaration.startLineNumber);
        this.editor.editor.setPosition({column: declaration.startColumn, lineNumber: declaration.startLineNumber});
    }


    initGUI() {

        checkIfMousePresent();
        
        this.login = new Login(this);
        let hashIndex: number = window.location.href.indexOf('#');
        if(hashIndex > 0){
    
            var ticket = window.location.href.substr(hashIndex + 1);
            window.history.replaceState({}, "Online-IDE", window.location.href.substr(0, hashIndex));
            this.login.initGUI(true);
            this.login.loginWithTicket(ticket);
    
        } else {
            this.login.initGUI(false);
        }

        this.actionManager = new ActionManager(null, this);
        this.actionManager.init();

        this.networkManager = new NetworkManager(this, jQuery('#bottomdiv-outer .jo_updateTimerDiv'));

        let sliders = new Sliders(this);
        sliders.initSliders();

        this.mainMenu = new MainMenu(this);
        this.projectExplorer = new ProjectExplorer(this, jQuery('#leftpanel>.jo_projectexplorer'));
        this.projectExplorer.initGUI();

        this.bottomDiv = new BottomDiv(this, jQuery('#bottomdiv-outer>.jo_bottomdiv-inner'), jQuery('body'));

        this.rightDiv = new RightDiv(this, jQuery('#rightdiv-inner'));
        this.rightDiv.initGUI();

        this.debugger = new Debugger(<HTMLDivElement>jQuery('#leftpanel>.jo_debugger')[0], this);

        this.checkStartupComplete();

        //@ts-ignore
        window.UZIP = null; // needed by UPNG

        this.themeManager = new ThemeManager();

        this.viewModeController = new ViewModeController(jQuery("#view-mode"), this);

    }

    initEditor() {
        this.editor = new Editor(this, true, false);
        this.editor.initGUI(jQuery('#editor'));

        let that = this;
        jQuery(window).on('resize', (event) => {
            jQuery('#bottomdiv-outer').css('height', '150px');
            jQuery('#editor').css('height', (window.innerHeight - 150 - 30 - 2) + "px");
            that.editor.editor.layout();
            jQuery('#editor').css('height', "");

        });

        jQuery(window).trigger('resize');

    }

    initTeacherExplorer(classdata: ClassData[]) {
        if(this.teacherExplorer != null){
            this.teacherExplorer.removePanels();
        }
        this.teacherExplorer = new TeacherExplorer(this, classdata);
        this.teacherExplorer.initGUI();
    }


    checkStartupComplete() {
        this.startupComplete--;
        if (this.startupComplete == 0) {
            this.start();
        }
    }

    start() {

        if (this.waitForGUICallback != null) {
            this.waitForGUICallback();
        }

        let that = this;
        setTimeout(() => {
            that.getMainEditor().layout();
        }, 200);

        jQuery(window).on('unload', function() {
            
            if(navigator.sendBeacon && that.user != null){
                that.networkManager.sendUpdates(null, false, true);
                that.networkManager.sendUpdateUserSettings(() => {});
                that.interpreter.eventManager.fire("resetRuntime");
                
                DatabaseNewLongPollingListener.close();
                PushClientManager.getInstance().close();
            }
            
        });

    }

    onCompilationFinished(executable: Executable | undefined): void {
        this.printProgram();
        this.drawClassDiagrams(!this.rightDiv.isClassDiagramEnabled());
        
    }


    printProgram() {

        this.bottomDiv.printModuleToBottomDiv(this.currentWorkspace, this.projectExplorer.getCurrentlyEditedFile());

    }

    drawClassDiagrams(onlyUpdateIdentifiers: boolean) {
        clearTimeout(this.debounceDiagramDrawing);
        this.debounceDiagramDrawing = setTimeout(() => {
            this.rightDiv?.classDiagram?.drawDiagram(this.currentWorkspace, onlyUpdateIdentifiers);
        }, 500);
    }

    removeWorkspace(w: Workspace) {
        this.workspaceList.splice(this.workspaceList.indexOf(w), 1);
    }

    restoreWorkspaces(workspaces: Workspaces, fixInconsistencies: boolean) {

        this.workspaceList = [];
        this.currentWorkspace = null;
        // this.monaco.setModel(monaco.editor.createModel("Keine Datei vorhanden." , "text"));
        this.getMainEditor().updateOptions({ readOnly: true });

        for (let ws of workspaces.workspaces) {

            let workspace: Workspace = Workspace.restoreFromData(ws, this);
            this.workspaceList.push(workspace);
            if (ws.id == this.user.currentWorkspace_id) {
                this.currentWorkspace = workspace;
            }
        }

        /**
         * Find inconsistencies and fix them
         */
        if(fixInconsistencies){
            new InconsistencyFixer().start(this.workspaceList, this.networkManager, this);
        }

        this.projectExplorer.renderWorkspaces(this.workspaceList);

        if (this.currentWorkspace == null && this.workspaceList.length > 0) {
            this.currentWorkspace = this.workspaceList[0];
        }

        if (this.currentWorkspace != null) {
            this.projectExplorer.setWorkspaceActive(this.currentWorkspace, true);
        } else {
            this.projectExplorer.setFileActive(null);
        }

        if (this.workspaceList.length == 0) {

            Helper.showHelper("newWorkspaceHelper", this, this.projectExplorer.workspaceListPanel.$captionElement);

        }

        if(Math.random() < 0.9){
            Helper.showHelper("spritesheetHelper", this);
        }

    }

    restoreWorkspaceFromData(workspaceData: WorkspaceData): Workspace {
        return Workspace.restoreFromData(workspaceData, this);
    }

    getCurrentWorkspace(): Workspace {
        return this.currentWorkspace;
    }

    

}

