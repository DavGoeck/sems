import {Entity} from "@/Entity";
import {AppA_UiA} from "@/ui/AppA_UiA";
import {AppA} from "@/core/AppA";
import {AppA_TestA} from "@/test/AppA_TestA";
import {UiA} from "@/ui/UiA";
import {Static} from "@/Static";
import {Placeholder} from "@/Placeholder";

export class Starter {

    placeholder : Placeholder;
    createdApp : Entity;
    environment_queryParams : URLSearchParams;

    constructor() {
        this.placeholder = new Placeholder(this);
    }

    async start() : Promise<HTMLElement> {
        this.environment_adjustRemSizes();
        this.environment_queryParams = new URLSearchParams(window.location.search);
        if (this.environment_queryParams.has('local')) {
            this.createAppWithUIWithCommands_editable();
            this.testMode();
            this.createdApp.uiA.editable = true;
        } else if (this.environment_queryParams.has('client-app')) {
            this.createAppWithUIWithCommands_editable();
            this.testMode();
            this.createdApp.appA.uiA.topImpressum = await this.placeholder.getPlaceholderImpressum();
        } else if (this.environment_queryParams.has('test')) {
            await this.createTest();
            this.testMode();
            this.createdApp.appA.uiA.topImpressum = await this.placeholder.getPlaceholderImpressum();
            if (this.environment_queryParams.has('withFailingDemoTest')) {
                this.createdApp.appA.testA.withFailingDemoTest = true;
            }
            await this.createdApp.appA.testA.createRunAndDisplay();
        } else if (this.environment_queryParams.has('path')) {
            await this.createObjectViewer(this.environment_queryParams.get('path'));
            this.testMode();
            this.createdApp.appA.uiA.topImpressum = await this.placeholder.getPlaceholderImpressum();
        } else {
            await this.createWebsite();
            this.testMode();
        }
        Static.activeApp = this.createdApp;
        this.createdApp.appA.uiA.withPlaceholderArea = true;
        await this.createdApp.uiA.update();
        if (this.environment_queryParams.has('path')) {
            await this.createdApp.appA.uiA.content.uiA.listG.uisOfListItems.at(0).expand();
        }
        return this.createdApp.uiA.htmlElement;
    }

    environment_adjustRemSizes() {
        let root: HTMLElement = document.querySelector(':root');
        root.style.fontSize = '21px';
    }
    testMode() {
        if (this.environment_queryParams.has('testMode')) {
            this.createdApp.appA.logG.toConsole = true;
        }
    }

    createApp() {
        this.createdApp = new Entity();
        this.createdApp.text = 'simple application';
        this.createdApp.appA = new AppA(this.createdApp);
    }

    environment_getBaseUrl() : string {
        return window.location.protocol + '/index.html';
    }

    createAppWithUI() {
        this.createApp();
        this.createdApp.uiA = new UiA(this.createdApp);
        this.createdApp.appA.uiA = new AppA_UiA(this.createdApp);
    }

    async createAppWithUIWithCommands_editable_updateUi() : Promise<void> {
        this.createAppWithUIWithCommands_editable();
        await this.createdApp.uiA.update();
    }


    createAppWithUIWithCommands_editable() {
        this.createAppWithUI();
        this.createdApp.uiA.editable = true;
        this.createdApp.appA.uiA.showMeta = true;
        this.createdApp.appA.uiA.commands = this.createdApp.appA.uiA.createCommands();
        this.createdApp.appA.uiA.commands.uiA = new UiA(this.createdApp.appA.uiA.commands);
    }

    async loadLocalhostApp(port: number) {
        this.createdApp = new Entity();
        this.createdApp.text = 'todo: load from server';
        this.createdApp.appA = new AppA(this.createdApp);
        this.createdApp.appA.server = 'http://localhost:' + port + '/';
    }

    async createTest() : Promise<void> {
        this.createAppWithUI();
        this.createdApp.text = 'Tester';
        this.createdApp.appA.testA = new AppA_TestA(this.createdApp);
    }

    async createWebsite() : Promise<void> {
        this.createAppWithUI();
        this.createdApp.appA.uiA.isWebsite = true;
        let created = this.placeholder.getWebsiteData();
        for (let i = 0; i < created.list.jsList.length; i++) {
            await this.createdApp.appA.uiA.content.list.add(
                await created.list.getObject(i)
            );
        }
    }

    async createObjectViewer(pathString: string) : Promise<void> {
        this.createAppWithUI();
        let created = this.placeholder.getWebsiteData();
        let listOfNames = ['..', created.name, ...pathString.split('-')];
        await this.createdApp.appA.uiA.content.list.add(this.createdApp.appA.createPath(listOfNames));
        await this.createdApp.updateUi();
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    // static methods

    static async start() : Promise<HTMLElement> {
        return await new Starter().start();
    }

    static async createAppWithUIWithCommands_editable_updateUi() {
        let starter = new Starter();
        await starter.createAppWithUIWithCommands_editable_updateUi();
        return starter.createdApp;
    }

    static createApp() {
        let starter = new Starter();
        starter.createApp();
        return starter.createdApp;
    }

    static async createTest() {
        let starter = new Starter();
        await starter.createTest();
        return starter.createdApp;
    }

    static createAppWithUI() {
        let starter = new Starter();
        starter.createAppWithUI();
        return starter.createdApp;
    }

    static async loadLocalhostApp(port: number) {
        let starter = new Starter();
        await starter.loadLocalhostApp(port);
        return starter.createdApp;
    }

    static async createObjectViewer(pathString: string) {
        let starter = new Starter();
        await starter.createObjectViewer(pathString);
        return starter.createdApp;
    }

    static async createWebsite() {
        let starter = new Starter();
        await starter.createWebsite();
        return starter.createdApp;
    }

    static replacedWebsitePlaceholder() {
        return new Starter().placeholder.website.startsWith('marker');
    }
}