import {Starter} from "@/Starter";
import type {Entity} from "@/Entity";

export class AppA_TestA_ModelG {

    constructor(private entity: Entity) {
    }

    createTests() {
        return [
            this.createTest('modelTest_objectCreation', async test => {
                test.test_app = await Starter.createAppWithUIWithCommands_updateUi();

                return test.test_app.uiG.getRawText().includes('default action');
            }),
            this.createTest('modelTest_newSubitem', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.updateUi();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.uiG.click('new subitem');

                let firstObject = await app.appA.uiA.content.list.getObject(0);
                return firstObject.list.jsList.length == 1;
            }),
            this.createTest('modelTest_makeCollapsible', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();

                await app.uiG.click('toggle collapsible');

                return (await app.appA.uiA.content.list.getObject(0)).collapsible;
            }),
            this.createTest('modelTest_collapsed', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();
                await app.appA.uiA.globalEventG.newSubitem();
                let firstObject = await app.appA.uiA.content.list.getObject(0);
                (await firstObject.list.getObject(0)).text = 'do-not-show-me';
                firstObject.collapsible = true;
                firstObject.collapsed = true;
                await app.uiG.update();

                let rawText = app.uiG.getRawText();

                return !rawText.includes('do-not-show-me');
            }),
            this.createTest('modelTest_clickOnStaticText', async test => {
                let app = await Starter.createAppWithUIWithCommands_updateUi();
                await app.appA.uiA.globalEventG.defaultAction();
                await app.appA.uiA.globalEventG.newSubitem();
                let firstObject = await app.appA.uiA.content.list.getObject(0);
                firstObject.text = 'clickMe';
                firstObject.editable = false;
                firstObject.collapsible = true;
                firstObject.collapsed = true;
                await firstObject.updateUi();

                await app.uiG.click('clickMe');

                return !firstObject.collapsed;
            }),
            this.createTest('modelTest_tester', async test => {
                let tester = await Starter.createTest();
                test.test_app = tester;
                tester.appA.logG.toListOfStrings = true;

                await tester.appA.testA.runAndDisplay([
                    tester.appA.testA.createFailingDemoTest(),
                    tester.appA.testA.createTest('aSuccessfulTest', async () => {
                        return true;
                    })
                ]);

                await tester.uiG.click('failed with');
                await tester.uiG.click('ui');
                await tester.uiG.click('log');
                await tester.uiG.click('successful tests')
                let rawText = tester.uiG.getRawText();
                return rawText.includes('failed tests') &&
                    rawText.includes('failing demo test') &&
                    rawText.includes('stacktrace') &&
                    rawText.includes('demo error in test') &&
                    rawText.includes('a dummy log') &&
                    rawText.includes('default action') &&
                    rawText.includes('successful tests') &&
                    rawText.includes('1') &&
                    rawText.includes('aSuccessfulTest');
            }),
            this.createTest('modelTest_website', async test => {
                let website = await Starter.createWebsite();
                test.test_app = website;
                website.appA.logG.toListOfStrings = true;

                await website.uiG.update();

                let rawText = website.uiG.getRawText();
                if (Starter.placeholderWebsite.startsWith('marker')) {
                    return !rawText.includes('demo website (container)') &&
                        rawText.includes('collapsible parent') &&
                        rawText.includes('subitem') &&
                        rawText.includes('Home');
                } else {
                    return true;
                }
            }),
        ];
    }

    private createTest(name: string, testAction: (test: Entity) => Promise<any>) {
        return this.entity.appA.testA.createTest(name, testAction);
    }
}