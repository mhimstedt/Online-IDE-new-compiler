import { IMain } from "../IMain";
import * as monaco from 'monaco-editor'
import { Module } from "../module/Module.ts";


export class ColorProvider implements monaco.languages.DocumentColorProvider {
    
    private static mainList: IMain[] = [];
    private static instance: ColorProvider = null;

    private isRegistered: boolean = false;
    
    
    private constructor() {
    }
    
    public static getInstance(main?: IMain){
        if(main != null && ColorProvider.mainList.indexOf(main) < 0) ColorProvider.mainList.push(main);
        if(ColorProvider.instance == null){
            ColorProvider.instance = new ColorProvider();
        }
        return ColorProvider.instance;
    }
    
    register(language: string) {
        if(!this.isRegistered){
            monaco.languages.registerColorProvider(language, this);
            this.isRegistered = true;
        }
    }

    provideDocumentColors(model: monaco.editor.ITextModel, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.IColorInformation[]> {
        let module: Module;
        for(let main of ColorProvider.mainList){
            module = main.getCurrentWorkspace()?.getModuleForMonacoModel(model);
            if(module) break;
        } 

        if (module == null) {
            return null;
        }

        return module.colorInformation;

    }

    provideColorPresentations(model: monaco.editor.ITextModel, colorInfo: monaco.languages.IColorInformation, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.IColorPresentation[]> {
        var color = colorInfo.color;
        var oldColor: string = model.getValueInRange(colorInfo.range);

        var red256 = Math.round(color.red * 255);
        var green256 = Math.round(color.green * 255);
        var blue256 = Math.round(color.blue * 255);
        var label;

        let hex6Digits = this.toHex2Digits(red256) + this.toHex2Digits(green256) + this.toHex2Digits(blue256);
        let rgbCommaSeparated = red256 + ', ' + green256 + ', ' + blue256;

        if (oldColor.startsWith('#')) {
            label = '#' + hex6Digits;
        } else if (oldColor.startsWith('0x')) {
            label = '0x' + hex6Digits;
        } else if (oldColor.startsWith('rgb')) {
            if (color.alpha < 0.999) {
                label = 'rgba(' + rgbCommaSeparated + ', ' + color.alpha + ')';
            } else {
                label = 'rgb(' + rgbCommaSeparated + ')';
            }
        } else if (oldColor.startsWith("new") || oldColor.startsWith('Color')) {
            label = 'new Color(' + rgbCommaSeparated + ')';
        }

        return [
            {
                label: label!
            }
        ];
    }

    toHex2Digits(n: number) {
        let hex = n.toString(16);
        while (hex.length < 2) {
            hex = '0' + hex;
        }
        return hex;
    }
}