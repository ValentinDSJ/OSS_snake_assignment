import {System} from "../libs/ecs/System";
import Application, {getNameApplication} from "../components/Application";
import * as PIXI from "pixi.js";
import Graphics, {getNameGraphics} from "../components/Graphics";

export default class GraphicsSystem extends System {
    awake() {
    }

    start() {
        const app = this.componentManager.getComponentByType(getNameApplication()) as Application;
        const graphics = this.componentManager.getComponentsByType(getNameGraphics());

        graphics.map((c: Graphics) => {
            app.app.stage.addChild(c.graphics);
        });
    }

    update(delta: number) {}

    stop() {}

    tearDown() {}
}