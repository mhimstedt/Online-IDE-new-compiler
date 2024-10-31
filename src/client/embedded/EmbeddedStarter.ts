import jQuery from 'jquery';
import * as PIXI from 'pixi.js';
import { ThemeManager } from "../main/gui/ThemeManager.js";
import { MainEmbedded } from "./MainEmbedded.js";

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'


// All css files for embedded online-ide:
import "/include/css/bottomdiv.css";
import "/include/css/debugger.css";
import "/include/css/editor.css";
import "/include/css/embedded.css";
import "/include/css/helper.css";
import "/include/css/icons.css";
import "/include/css/run.css";

import spritesheetjson from '/include/graphics/spritesheet.json.txt';
import spritesheetpng from '/include/graphics/spritesheet.png';
import { PixiSpritesheetData } from "../spritemanager/PixiSpritesheetData.js";


declare var APP_VERSION: string;

export type JOScript = {
    title: string,
    text: string,
    url?: string
}

function loadSpritesheet() {
    let pathPraefix: string = "";
    //@ts-ignore
    if (window.javaOnlineDir != null) {
        //@ts-ignore
        pathPraefix = window.javaOnlineDir;
    }

    if (pathPraefix.endsWith("/")) {
        pathPraefix = pathPraefix.substring(0, pathPraefix.length - 1);
    }

    fetch(pathPraefix + `${spritesheetjson}`)
        .then((response) => response.json())
        .then((spritesheetData: PixiSpritesheetData) => {
            PIXI.Assets.load(pathPraefix + `${spritesheetpng}`).then((texture: PIXI.Texture) => {
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



export class EmbeddedStarter {


    startupComplete = 2;


    initGUI() {

        this.checkStartupComplete();

        new ThemeManager().switchTheme("dark");
    }

    initEditor() {
        this.checkStartupComplete();
    }

    checkStartupComplete() {
        this.startupComplete--;
        if (this.startupComplete == 0) {
            this.start();
        }
    }


    start() {

        this.initJavaOnlineDivs();

    }

    async initJavaOnlineDivs() {

        let divsWithScriptLists: [JQuery<HTMLElement>, JOScript[]][] = [];

        jQuery('.java-online').addClass('notranslate').each((index: number, element: HTMLElement) => {
            let $div = jQuery(element);
            let scriptList: JOScript[] = [];

            $div.find('script').each((index: number, element: HTMLElement) => {
                let $script = jQuery(element);

                let srcAttr = $script.attr('src');
                let text = $script.text().trim();
                let script: JOScript = {
                    title: $script.attr('title'),
                    text: text
                };


                if ($script.data('type') == "hint" && !script.title.endsWith(".md")) {
                    script.title += ".md";
                }

                if (srcAttr != null) script.url = srcAttr;
                script.text = this.eraseDokuwikiSearchMarkup(script.text);
                scriptList.push(script);
            });

            divsWithScriptLists.push([$div, scriptList])

        });

        for (let dws of divsWithScriptLists) {
            await this.initDiv(dws[0], dws[1]);
        }

    }

    eraseDokuwikiSearchMarkup(text: string): string {
        return text.replace(/<span class="search\whit">(.*?)<\/span>/g, "$1");
    }

    async initDiv($div: JQuery<HTMLElement>, scriptList: JOScript[]) {

        for (let script of scriptList) {
            if (script.url != null) {
                const response = await fetch(script.url)
                script.text = await response.text()
            }
        }

        // Here execution is continued...
        new MainEmbedded($div, scriptList);

    }

}

jQuery(function () {

    let embeddedStarter = new EmbeddedStarter();

    initMonacoEditor()

    embeddedStarter.initEditor();
    embeddedStarter.initGUI();

    loadSpritesheet();

    //@ts-ignore
    console.log(APP_VERSION);

});
