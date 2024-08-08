import jQuery from 'jquery';
import { WorkspaceData, WorkspaceSettings } from "../communication/Data.js";
import { AccordionElement } from "../main/gui/Accordion.js";
import { Main } from "../main/Main.js";
import { MainBase } from "../main/MainBase.js";
import { File } from "./File.js";

import * as PIXI from 'pixi.js';
import { CompilerWorkspace } from '../../compiler/common/module/CompilerWorkspace.js';

export class Workspace extends CompilerWorkspace {
    
    name: string;
    path: string;
    isFolder: boolean;
    readonly: boolean;
    id: number;
    owner_id: number;

    version: number;
    // published_to 0: none; 1: class; 2: school; 3: all
    published_to: number;
    
    repository_id: number;    // id of repository-workspace
    has_write_permission_to_repository: boolean; // true if owner of this working copy has write permission to repository workspace

    spritesheetId: number;

    grade?: string;
    points?: string;
    comment?: string;
    attended_exam?: boolean;

    private files: File[] = [];

    panelElement: AccordionElement;
    currentlyOpenFile: File;
    saved: boolean = true;

    pruefung_id: number;

    userSpritesheet: PIXI.Spritesheet; // TODO!


    settings: WorkspaceSettings = {
        libraries: []
    };
    
    constructor(name: string, private main: MainBase, owner_id: number){
        super(main);
        this.name = name;
        this.owner_id = owner_id;
        this.path = "";
    }

    getFiles(): File[] {
        return this.files;
    }

    addFile(file: File){
        this.files.push(file);
    }

    removeFile(file: File){
        let index = this.files.indexOf(file);
        if(index >= 0) this.files.splice(index, 1);
    }


    getWorkspaceData(withFiles: boolean): WorkspaceData {
        let wd: WorkspaceData = {
            name: this.name,
            path: this.path,
            isFolder: this.isFolder,
            id: this.id,
            owner_id: this.owner_id,
            currentFileId: this.currentlyOpenFile == null ? null : this.currentlyOpenFile.id,
            files: [],
            version: this.version,
            repository_id: this.repository_id,
            has_write_permission_to_repository: this.has_write_permission_to_repository,
            settings: JSON.stringify(this.settings),
            spritesheet_id: this.spritesheetId,
            pruefung_id: this.pruefung_id,
            readonly: this.readonly,
            grade: this.grade,
            points: this.points,
            comment: this.comment,
            attended_exam: this.attended_exam
        }

        if(withFiles){
            for(let file of this.files){
                wd.files.push(file.getFileData(this));
            }
        }

        return wd;
    }


    renderSynchronizeButton(panelElement: AccordionElement) {
        let $buttonDiv = panelElement?.$htmlFirstLine?.find('.jo_additionalButtonRepository');
        if ($buttonDiv == null) return;
        
        let that = this;
        let myMain: Main = <Main><any>this.main;

        if (this.repository_id != null && this.owner_id == myMain.user.id) {
            let $button = jQuery('<div class="jo_startButton img_open-change jo_button jo_active" title="Workspace mit Repository synchronisieren"></div>');
            $buttonDiv.append($button);
            let that = this;
            $button.on('pointerdown', (e) => e.stopPropagation());
            $button.on('pointerup', (e) => {
                e.stopPropagation();

                that.synchronizeWithRepository();

            });

            $button[0].addEventListener("contextmenu", (event) => {
                event.preventDefault();
                event.stopPropagation();
            }, false);


        } else {
            $buttonDiv.find('.jo_startButton').remove();
        }
    }

    synchronizeWithRepository(){
        let myMain: Main = <Main><any>this.main;
        if(this.repository_id != null && this.owner_id == myMain.user.id){
            myMain.networkManager.sendUpdates(() => {
                myMain.synchronizationManager.synchronizeWithWorkspace(this);
            }, true);
        }
    }

    static restoreFromData(wd: WorkspaceData, main: MainBase): Workspace {

        let settings: WorkspaceSettings = (wd.settings != null && wd.settings.startsWith("{")) ? JSON.parse(wd.settings) : {libraries: []}; 

        //@ts-ignore
        if(settings.libaries){
            //@ts-ignore
            settings.libraries = settings.libaries;
        }

        let w = new Workspace(wd.name, main, wd.owner_id);
        w.id = wd.id;
        w.path = wd.path;
        w.isFolder = wd.isFolder;
        w.owner_id = wd.owner_id;
        w.version = wd.version;
        w.repository_id = wd.repository_id;
        w.has_write_permission_to_repository = wd.has_write_permission_to_repository;
        w.settings = settings;
        w.pruefung_id = wd.pruefung_id;

        w.spritesheetId = wd.spritesheet_id;
        w.readonly = wd.readonly;

        w.grade = wd.grade;
        w.points = wd.points;
        w.comment = wd.comment;
        w.attended_exam = wd.attended_exam;

        if(w.settings.libraries == null){
            w.settings.libraries = [];
        }

        for(let f of wd.files){

            let file = File.restoreFromData(f);
            w.files.push(file);

            if(f.id == wd.currentFileId){
                w.currentlyOpenFile = file;
            }

        }

        return w;

    }

    findFileById(id: number): File {
        return this.files.find(f => f.id == id);
    }

    getCurrentlyEditedFile(): File | undefined {
        return <File | undefined>(super.getCurrentlyEditedFile());    
    }
}

