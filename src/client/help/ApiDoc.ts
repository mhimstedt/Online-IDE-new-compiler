import jQuery from 'jquery';
import { extractCsrfTokenFromGetRequest } from "../communication/AjaxHelper.js";
import { JavaLanguage } from '../../compiler/java/JavaLanguage.js';
import { SystemModule } from '../../compiler/java/runtime/system/SystemModule.js';
import { JavaLibraryModuleManager } from '../../compiler/java/module/libraries/JavaLibraryModuleManager.js';
import { BaseType } from '../../compiler/common/BaseType.js';
import { JavaClass } from '../../compiler/java/types/JavaClass.js';
import { JavaInterface } from '../../compiler/java/types/JavaInterface.js';
import { JavaEnum } from '../../compiler/java/types/JavaEnum.js';
import { NonPrimitiveType } from '../../compiler/java/types/NonPrimitiveType.js';
import { JavaMethod } from '../../compiler/java/types/JavaMethod.js';
import { TokenType } from '../../compiler/java/TokenType.js';

export class ApiDoc {
    async start() {

        await extractCsrfTokenFromGetRequest(true);

        this.initEditor();
        this.initClassDocumentation();
    }

    initEditor(){

        JavaLanguage.registerLanguage();

        monaco.editor.defineTheme('myCustomThemeDark', {
            base: 'vs-dark', // can also be vs-dark or hc-black
            inherit: true, // can also be false to completely replace the builtin rules
            rules: [
                { token: 'method', foreground: 'dcdcaa', fontStyle: 'italic' },
                { token: 'print', foreground: 'dcdcaa', fontStyle: 'italic bold' },
                { token: 'class', foreground: '3DC9B0' },
                { token: 'number', foreground: 'b5cea8' },
                { token: 'type', foreground: '499cd6' },
                { token: 'identifier', foreground: '9cdcfe' },
                { token: 'statement', foreground: 'bb96c0', fontStyle: 'bold' },
                { token: 'keyword', foreground: '68bed4', fontStyle: 'bold' },
                // { token: 'comment.js', foreground: '008800', fontStyle: 'bold italic underline' },
            ],
            colors: {
                "editor.background": "#1e1e1e"
            }
        });

        monaco.editor.setTheme('myCustomThemeDark');

        monaco.editor.create(jQuery('#editordiv')[0], {
            language: "myJava"
        });


    }

    initClassDocumentation() {

        let mm = new JavaLibraryModuleManager();

        let typeList = mm.javaTypes
        .sort(
            (a, b) => a.identifier.localeCompare(b.identifier));


        typeList.filter((type) => type instanceof JavaClass).forEach((type, index) => {
            let $menuItem = jQuery('<div class="jo_menu-class">' + type.identifier + '</div>');
            jQuery('#classes').append($menuItem)
            $menuItem.on('click', () => {
                this.showAPIHelp(type);
            })
        });

        typeList.filter((type) => type instanceof JavaInterface).forEach((type, index) => {
            let $menuItem = jQuery('<div class="jo_menu-class">' + type.identifier + '</div>');
            jQuery('#interfaces').append($menuItem)
            $menuItem.on('click', () => {
                this.showAPIHelp(type);
            })
        });

        typeList.filter((type) => type instanceof JavaEnum).forEach((type, index) => {
            let $menuItem = jQuery('<div class="jo_menu-class">' + type.identifier + '</div>');
            jQuery('#enums').append($menuItem)
            $menuItem.on('click', () => {
                this.showAPIHelp(type);
            })
        });


    }

    showAPIHelp(type: NonPrimitiveType) {
        let $main = jQuery('#main');
        $main.empty();

        let $caption = jQuery('<div class="jo_type"></div>');
        $main.append($caption);
        monaco.editor.colorize(type.getDeclaration(), "myJava", {}).then(
            (html) => {$caption.append(jQuery(html))}
        );

        if(type instanceof JavaClass) this.showConstructors(type);
        this.showMethods(type);
        if(type instanceof JavaClass || type instanceof JavaEnum) this.showAttributes(type);

    }

    showConstructors(t: JavaClass){
        let $main = jQuery('#main');
        $main.append(jQuery('<div class="jo_constructor-heading">Konstruktoren:</div>'));
        let methods = t.getOwnMethods().filter((m) => m.isConstructor);

        methods.sort((a, b) => a.identifier.localeCompare(b.identifier));

        if(methods.length == 0){
            $main.append(jQuery('<div class="jo_method">Keine</div>'));
        } else {
            for(let method of methods){
                let $caption = jQuery(jQuery('<div class="jo_method"></div>'));
                $main.append($caption);
                monaco.editor.colorize(method.getDeclaration(), "myJava", {}).then(
                    (html) => {$caption.append(jQuery(html))}
                );

                if(method.documentation != null && method.documentation != ""){
                    $main.append(jQuery('<div class="jo_documentation">' + method.documentation + '</div>'));
                }
            }
        }     
    }

    showMethods(t: NonPrimitiveType){
        let $main = jQuery('#main');
        $main.append(jQuery('<div class="jo_method-heading">Methoden:</div>'));
        let methods: JavaMethod[];
        if(t instanceof JavaInterface){
            methods = t.getAllMethods().slice(0);
        } else {
            methods = t.getAllMethods().filter((m) => !m.isConstructor && m.visibility != TokenType.keywordPrivate);
        }

        methods.sort((a, b) => a.identifier.localeCompare(b.identifier));

        if(methods.length == 0){
            $main.append(jQuery('<div class="jo_method">Keine</div>'));
        } else {
            for(let method of methods){
                let $caption = jQuery(jQuery('<div class="jo_method"></div>'));
                $main.append($caption);
                monaco.editor.colorize(method.getDeclaration(), "myJava", {}).then(
                    (html) => {$caption.append(jQuery(html))}
                );

                if(method.documentation != null && method.documentation != ""){
                    $main.append(jQuery('<div class="jo_documentation">' + method.documentation + '</div>'));
                }
            }
        }     
    }

    docToString(documentation: string | (() => string) | undefined): string {
        if(!documentation) return "";
        if(typeof documentation == "string") return documentation;
        return documentation();
    }

    showAttributes(t: JavaClass | JavaEnum){
        let $main = jQuery('#main');
        $main.append(jQuery('<div class="jo_attribute-heading">Attribute:</div>'));
        let attributes = t.getFields().filter(field => field.visibility != TokenType.keywordPrivate);

        attributes.sort((a, b) => a.identifier.localeCompare(b.identifier));

        if(attributes.length == 0){
            $main.append(jQuery('<div class="jo_method">Keine</div>'));
        } else {
            for(let attribute of attributes){
                let $caption = jQuery(jQuery('<div class="jo_method"></div>'));
                $main.append($caption);
                monaco.editor.colorize(attribute.getDeclaration(), "myJava", {}).then(
                    (html) => {$caption.append(jQuery(html))}
                );

                if(attribute.documentation != null && attribute.documentation != ""){
                    $main.append(jQuery('<div class="jo_documentation">' + attribute.documentation + '</div>'));
                }
            }
        }     
    }

}

jQuery(() => { 
    
        //@ts-ignore
        window.require.config({ paths: { 'vs': 'lib/monaco-editor/dev/vs' } });
        //@ts-ignore
        window.require.config({
            'vs/nls': {
                availableLanguages: {
                    '*': 'de'
                }
            },
            ignoreDuplicateModules: ["vs/editor/editor.main"]
        });
    
        //@ts-ignore
        window.require(['vs/editor/editor.main'], function () {

            new ApiDoc().start(); 
    
            // main.loadWorkspace();
    
    
        });
    
    
    
});