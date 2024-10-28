import type {Entity} from "@/Entity";

export class TestG_NestedTestsA {

    nestedTests : Entity;

    constructor(private entity : Entity) {
    }

    install() {
        this.nestedTests = this.entity.getApp().appA.unboundG.createList();
    }

    add(name: string, jsFunction: (testRun: Entity) => void) : Entity {
        let nestedTest : Entity = this.entity.getApp().createFormalText(name, jsFunction);
        this.nestedTests.listA.jsList.push(nestedTest);
        return nestedTest;
    }
}