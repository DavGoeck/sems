import {Starter} from "@/Starter";
import {setCaret} from "@/utils";
import type {Entity} from "@/Entity";

export class AppA_TestA_SemiG {

    constructor(private entity: Entity) {
    }

    createTests() {
        return [
            this.createTest('semiAutomatedTest_html', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                let html = test.test_app.appA.createEntityWithApp();
                html.dangerous_html = document.createElement('div');
                html.dangerous_html.innerText = 'show me';
                await test.test_app.appA.uiA.content.list.addAndUpdateUi(html);
                test.test_app.appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: the text "show me" appears');
                return true;
            }),
            this.createTest('semiAutomatedTest_setCaret', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                let html = test.test_app.appA.createEntityWithApp();
                html.dangerous_html = document.createElement('div');
                html.dangerous_html.innerText = 'test';
                html.dangerous_html.contentEditable = 'true';
                html.dangerous_html.style.margin = '1rem';
                await test.test_app.appA.uiA.content.list.addAndUpdateUi(html, test.test_app.appA.unboundG.createButton('setCaret', () => {

                    setCaret(html.dangerous_html, 2);

                }));
                test.test_app.appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: when clicking the button, the caret is set to the middle of the word "test"');
                return true;
            }),
            this.createTest('semiAutomatedTest_cursorStyle', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                let appA = test.test_app.appA;
                await appA.uiA.globalEventG.defaultAction();
                await appA.uiA.globalEventG.toggleCollapsible();
                await appA.uiA.globalEventG.newSubitem();
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: cursor style on collapsible object (outside text): pointer');
                test.test_app.log('human-test: cursor style on non-collapsible object (outside text): default');
                test.test_app.log('human-test: cursor style on editable text: text');
                test.test_app.log('human-test: cursor style on non-editable, non-collapsible text: default');
                test.test_app.log('human-test: cursor style on non-editable, collapsible text: pointer');
                return true;
            }),
            this.createTest('semiAutomatedTest_expand/collapse', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                let appA = test.test_app.appA;
                await appA.uiA.globalEventG.defaultAction();
                await appA.uiA.globalEventG.toggleCollapsible();
                await appA.uiA.globalEventG.newSubitem();
                appA.logG.toListOfStrings = true;
                test.test_app.log('human-test: expanded collapsible has the icon: _');
                test.test_app.log('human-test: collapsed collapsible has the icon: [...]');
                test.test_app.log('human-test: non-collapsible has no icon');
                return true;
            }),
            this.createTest('semiAutomatedTest_placeholderArea', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();
                let appA = test.test_app.appA;
                let html = appA.createEntityWithApp();
                html.dangerous_html = document.createElement('div');
                html.dangerous_html.style.height = '15rem';
                html.dangerous_html.style.backgroundColor = 'gold';
                html.dangerous_html.style.width = '15rem';
                let collapsible = appA.unboundG.createCollapsible('scroll down and then collapse me', html);
                collapsible.collapsed = false;
                collapsible.editable = false;
                appA.uiA.content.list.jsList.push(collapsible);
                appA.logG.toListOfStrings = true;
                test.test_app.log('info: The placeholder-area is an area which is inserted at the bottom of the site. ' +
                    'It is necessary to avoid unwanted movements when collapsing a big item.');

                test.test_app.log('human-test: The content above the item never moves, when collapsing it.');
                test.test_app.log('human-test: When scrolling to the bottom, you still see a rest of the application-content');
                test.test_app.log('human-test: The placeholder-area adapts its size when resizing the window.');
                return true;
            }),
        ];
    }

    private createTest(name: string, testAction: (test: Entity) => Promise<any>) {
        return this.entity.appA.testA.createTest(name, testAction);
    }
}