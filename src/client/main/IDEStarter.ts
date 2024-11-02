import jQuery from 'jquery';
import { Main } from "./Main.js";
import { SynchronizationManager } from "../repository/synchronize/RepositorySynchronizationManager.js";
import { RepositoryCreateManager } from "../repository/update/RepositoryCreateManager.js";
import { RepositorySettingsManager } from "../repository/update/RepositorySettingsManager.js";
import { RepositoryCheckoutManager } from "../repository/update/RepositoryCheckoutManager.js";
import { SpriteManager } from "../spritemanager/SpriteManager.js";
import * as PIXI from 'pixi.js';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'


// All css files for fullscreen online-ide:
import "/include/css/bottomdiv.css";
import "/include/css/debugger.css";
import "/include/css/editor.css";
import "/include/css/editorStatic.css";
import "/include/css/helper.css";
import "/include/css/icons.css";
import "/include/css/run.css";
import "/include/css/dialog.css";
import "/include/css/synchronize-repo.css";
import "/include/css/updatecreate-repo.css";
import "/include/css/spritemanager.css";

import spritesheetjson from '/include/graphics/spritesheet.json.txt';
import spritesheetpng from '/include/graphics/spritesheet.png';
import { PixiSpritesheetData } from "../spritemanager/PixiSpritesheetData.js";
import * as p5 from 'p5';


declare var BUILD_DATE: string;
declare var APP_VERSION: string;


function loadSpritesheet() {
    fetch(`${spritesheetjson}`)
        .then((response) => response.json())
        .then((spritesheetData: PixiSpritesheetData) => {
            PIXI.Assets.load(`${spritesheetpng}`).then((texture: PIXI.Texture) => {
                let source: PIXI.ImageSource = texture.source;
                source.minFilter = "nearest";
                source.magFilter = "nearest";

                spritesheetData.meta.size.w = texture.width;
                spritesheetData.meta.size.h = texture.height;
                let spritesheet = new PIXI.Spritesheet(texture, spritesheetData);
                spritesheet.parse().then(() => {
                    PIXI.Assets.cache.set('spritesheet', spritesheet);
                });
            })
        });
}

function initMonacoEditor(): void {
    // see https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md#using-vite
    // https://dev.to/lawrencecchen/monaco-editor-svelte-kit-572
    // https://github.com/microsoft/monaco-editor/issues/4045

    self.MonacoEnvironment = {
        getWorker: (_workerId, label) => {
            switch (label) {
                case 'json':
                    return new jsonWorker()
                case 'css':
                case 'scss':
                case 'less':
                    return new cssWorker()
                case 'html':
                case 'handlebars':
                case 'razor':
                    return new htmlWorker()
                case 'typescript':
                case 'javascript':
                    return new tsWorker()
                default:
                    return new editorWorker()
            }
        }
    };

}

window.onload = () => {

    setTimeout(() => {
        let vidisDiv = jQuery('vidis-login')[0];
        if(!vidisDiv) return;
        jQuery(jQuery('vidis-login')[0].shadowRoot).find('.entry-button-label').text('Amelden mit VIDIS (Test)')
    }, 500);


    document.getElementById('versionDiv').textContent = "Version " + APP_VERSION + " vom " + BUILD_DATE;

    // p5.disableFriendlyErrors = true

    let main = new Main();
    loadSpritesheet();

    initMonacoEditor()

    main.startupBeforeMonacoEditorIsLoaded();
    main.startupAfterMonacoEditorIsLoaded();
    main.getMainEditor().updateOptions({ readOnly: true });

    main.bottomDiv.initGUI();
    main.checkStartupComplete();

    if (main.repositoryOn) {
        main.synchronizationManager = new SynchronizationManager(main);
        // main.synchronizationManager.initGUI();
        main.repositoryCreateManager = new RepositoryCreateManager(main);
        main.repositoryCreateManager.initGUI();
        main.repositoryUpdateManager = new RepositorySettingsManager(main);
        main.repositoryUpdateManager.initGUI();
        main.repositoryCheckoutManager = new RepositoryCheckoutManager(main);
        main.repositoryCheckoutManager.initGUI();

    }

    main.spriteManager = new SpriteManager(main);
    // main.spriteManager.initGUI();


    // document.body.innerText = 'Hello World!';
}