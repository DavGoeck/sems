import {ListA} from "@/ListA";
import {PathA} from "@/PathA";
import {AppA} from "@/AppA";
import {ContainerA} from "@/ContainerA";
import {UiA} from "@/ui/UiA";
import {notNullUndefined, nullUndefined} from "@/utils";
import type {StarterA} from "@/StarterA";
import {TestG_NestedTestsA} from "@/test/TestG_NestedTestsA";
import {TestRunA} from "@/test/TestRunA";
import {DeepCopyA} from "@/DeepCopyA";

export class Entity {

    name: string;
    container: Entity;
    text: string;
    link: string;
    app: Entity;
    action: Function;
    editable: boolean;
    collapsible: boolean;
    dangerous_html: HTMLElement;
    uis: Array<UiA>;
    codeG_jsFunction: Function;

    listA: ListA;
    installListA() {
        this.listA = new ListA(this);
    }
    pathA: PathA;
    appA: AppA;
    containerA: ContainerA;
    uiA: UiA;
    starterA: StarterA;
    testRunA: TestRunA;
    installTestRunA() {
        this.testRunA = new TestRunA(this);
    }

    // deprecated
    test_result_error: any;
    test_result: boolean;
    test_app: Entity;
    isTest: boolean;

    testG_nestedTestsA : TestG_NestedTestsA;
    testG_installNestedTestsA() {
        this.testG_nestedTestsA = new TestG_NestedTestsA(this);
        this.testG_nestedTestsA.install();
    }

    json_withoutContainedObjects() : any {
        let obj: any = {
            text: this.text,
            list: this.listA?.json_withoutContainedObjects(),
            collapsible: this.collapsible,
            collapsed: this.uiA?.collapsed,
            link: this.link,
            editable: this.editable,
            content: this.appA?.uiA?.content.json_withoutContainedObjects(),
        };
        if (this.appA?.currentContainer) {
            obj.currentContainerText = this.appA.currentContainer.text;
        }
        return obj;
    }

    getPath(object: Entity) : Entity {
        this.logInfo('getPath of ' + object.getShortDescription());
        if (this.contains(object)) {
            if (this === object) {
                return this.getApp().appA.createPath([]);
            } else {
                return this.getApp().appA.createPath([...this.getPath(object.container).pathA.listOfNames, object.name]);
            }
        } else {
            return this.getApp().appA.createPath(['..', ...this.container.getPath(object).pathA.listOfNames]);
        }
    }

    contains(object : Entity) : boolean {
        if (this === object) {
            return true;
        } else {
            if (object.container) {
                return this.contains(object.container);
            } else {
                return false;
            }
        }
    }

    async resolve(path: Entity) : Promise<Entity> {
        if (path.pathA.listOfNames.length === 0) {
            return this;
        } else if (path.pathA.listOfNames.at(0) === '..') {
            return this.container.resolve(path.pathA.withoutFirst());
        } else {
            return this.containerA.mapNameEntity.get(path.pathA.listOfNames[0]).resolve(path.pathA.withoutFirst());
        }
    }

    pathOrObject(object : Entity) : Entity {
        if (object.isUnbound()) {
            return object;
        } else {
            return this.getPath(object);
        }
    }

    isUnbound() : boolean {
        return nullUndefined(this.name) || !this.container;
    }

    async export(): Promise<any> {
        let exported = this.json_withoutContainedObjects();
        if(this.containerA) {
            exported.objects = {};
            for (let entry of this.containerA.mapNameEntity.entries()) {
                let name : string = entry[0];
                let entity : Entity = entry[1];
                exported.objects[name] = await entity.export();
            }
        }
        return exported;
    }

    async export_allDependenciesInOneContainer() {
        let exported = this.json_withoutContainedObjects();
        let dependencies = await this.getDependencies();
        if (dependencies.size > 0) {
            exported.dependencies = [];
            for (let dependency of dependencies) {
                exported.dependencies.push({
                    name: dependency.name,
                    ... dependency.json_withoutContainedObjects()
                });
            }
        }
        return exported;
    }

    async getObjectAndDependencies() : Promise<Set<Entity>> {
        let set = new Set<Entity>();
        set.add(this);
        await this.addDependencies(set);
        return set;
    }

    async getDependencies() : Promise<Set<Entity>> {
        let set = await this.getObjectAndDependencies();
        set.delete(this);
        return set;
    }

    async addDependencies(set: Set<Entity>) {
        if (this.listA) {
            for (let current of this.listA.jsList) {
                if (current.pathA) {
                    let currentObject = await this.resolve(current);
                    if (!set.has(currentObject)) {
                        set.add(currentObject);
                        await currentObject.addDependencies(set);
                    }
                }
            }
        }
    }

    getApp() {
        if (this.appA) {
            return this;
        } else {
            return this.app;
        }
    }

    getApp_typed() {
        return this.getApp().appA;
    }

    log(log: string) {
        this.getApp()?.appA?.logG.log(this, log);
    }

    logInfo(log: string) {
        this.log('                                      (info)           ' + log);
    }

    getDescription() : string {
        if(notNullUndefined(this.text)) {
            return this.text ? this.text : '[empty text]';
        } else if (this.listA) {
            return 'list (' + this.listA.jsList?.length + ')';
        } else if (this.pathA) {
            return 'path (' + this.pathA.listOfNames + ')';
        } else if (this.uiA) {
            return 'ui';
        } else if (notNullUndefined(this.name)) {
            return 'name: ' + this.name;
        } else if (this.testRunA) {
            return 'run: ' + this.testRunA.test?.name;
        }
        return 'tbd';
    }

    getShortDescription() {
        let description = this.getDescription();
        return description.substring(0, Math.min(description.length, 20));
    }

    async updateUi() {
        await this.uiA.update();
    }

    getObject() : Entity {
        if (this.uiA?.object) {
            return this.uiA.object;
        } else {
            return this;
        }
    }

    uis_add(ui: UiA) {
        if (nullUndefined(this.uis)) {
            this.uis = [];
        }
        this.uis.push(ui);
    }

    async uis_update() {
        for (let ui of this.getAllUis()) {
            await ui.update();
        }
    }

    uis_update_currentContainerStyle() {
        for (let ui of this.getAllUis()) {
            ui.headerG.updateCurrentContainerStyle();
        }
    }

    async uis_update_addedListItem(position: number) {
        for (let ui of this.getAllUis()) {
            await ui.update_addedListItem(position);
        }
    }

    async uis_update_removedListItem(position: number) {
        for (let ui of this.getAllUis()) {
            await ui.update_removedListItem(position);
        }
    }

    async uis_update_text() {
        for (let ui of this.getAllUis()) {
            await ui.update_text();
        }
    }

    getAllUis() : Array<UiA> {
        let allUis : Array<UiA> = [];
        if (this.uiA) {
            allUis.push(this.uiA);
        }
        if(notNullUndefined(this.uis)) {
            allUis.push(...this.uis);
        }
        return allUis;
    }

    createCode(name: string, jsFunction: Function) : Entity {
        let code : Entity = new Entity();
        code.app = this.getApp();
        code.codeG_jsFunction = jsFunction;
        let containerA = this.containerA ? this.containerA : this.getApp().containerA;
        containerA.bind(code, name);
        return code;
    }

    async testG_run() {
        let testRun : Entity = new Entity();
        testRun.app = this.getApp();
        testRun.installTestRunA();
        testRun.testRunA.test = this;
        if (this.testG_nestedTestsA) {
            testRun.testRunA.nestedRuns = this.getApp().appA.unboundG.createList();
            for (let nestedTest of await (this.testG_nestedTestsA.nestedTests.listA.getResolvedList())) {
                let nestedTestRun = await nestedTest.testG_run();
                testRun.testRunA.nestedRuns.listA.jsList.push(nestedTestRun);
                if (!nestedTestRun.testRunA.resultG_success) {
                    testRun.testRunA.resultG_success = false;
                }
            }
        }
        try {
            await this.codeG_jsFunction(testRun);
            if (testRun.testRunA.resultG_success != false) {
                testRun.testRunA.resultG_success = true;
            }
        } catch (e : any) {
            testRun.testRunA.resultG_error = e;
            testRun.testRunA.resultG_success = false;
            console.error(e);
        }
        return testRun;
    }

    async shallowCopy() : Promise<Entity> {
        let copy = await this.getApp_typed().createBoundEntity();
        copy.text = this.text;
        copy.collapsible = this.collapsible;
        copy.link = this.link;
        copy.editable = this.editable;
        if (this.listA) {
            copy.installListA();
            for (let listItem of this.listA.jsList) {
                if (listItem.pathA) {
                    copy.listA.jsList.push(copy.getPath(await this.resolve(listItem)));
                } else {
                    copy.listA.jsList.push(listItem);
                }
            }
        }
        return copy;
    }

    deepCopy() : DeepCopyA {
        return new DeepCopyA(this);
    }
}