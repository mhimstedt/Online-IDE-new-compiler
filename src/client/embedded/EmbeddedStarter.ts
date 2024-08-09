import jQuery from 'jquery';
import * as PIXI from 'pixi.js';
import { ThemeManager } from "../main/gui/ThemeManager.js";
import { MainEmbedded } from "./MainEmbedded.js";

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

import { JavaFormatter } from "../../compiler/java/monacoproviders/JavaFormatter.js";
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

        fetch(pathPraefix + `${spritesheetjson}`)
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
}

async function initMonacoEditor(): Promise<void> {

    return new Promise((resolve) => {

        let prefix = "";
        let editorPath = "lib/monaco-editor/dev/vs"
        //@ts-ignore
        if (window.javaOnlineDir != null) {
            //@ts-ignore
            prefix = window.javaOnlineDir;
        }

        //@ts-ignore
        if (window.monacoEditorPath != null) {
            //@ts-ignore
            editorPath = window.monacoEditorPath;
        }

        //@ts-ignore
        window.AMDLoader.Configuration.ignoreDuplicateModules = ["jquery"];

        //@ts-ignore
        window.require.config({ paths: { 'vs': prefix + editorPath } });
        //@ts-ignore
        window.require.config({
            'vs/nls': {
                availableLanguages: {
                    '*': 'de'
                }
            },
            ignoreDuplicateModules: ["vs/editor/editor.main", 'jquery']
        });

        //@ts-ignore
        window.require(['vs/editor/editor.main'], function () {

            resolve();

        });

    })


}



export class EmbeddedStarter {


    startupComplete = 2;


    initGUI() {

        this.checkStartupComplete();

        new ThemeManager();
    }

    initEditor() {
        let formatter = new JavaFormatter();

        monaco.languages.registerDocumentFormattingEditProvider('myJava', formatter);
        monaco.languages.registerOnTypeFormattingEditProvider('myJava', formatter);

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

    initMonacoEditor().then(() => {
        embeddedStarter.initEditor();
        embeddedStarter.initGUI();
    })

    //@ts-ignore
    p5.disableFriendlyErrors = true

    loadSpritesheet();

    //@ts-ignore
    console.log(APP_VERSION);

});
