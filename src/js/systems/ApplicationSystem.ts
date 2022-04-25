import { System } from "../libs/ecs/System";
import Application, { getNameApplication } from "../components/Application";
import * as PIXI from "pixi.js";

export default class ApplicationSystem extends System {
    awake() {
        // const cs = this.componentManager.getComponentByType(getNameApplication());

        // cs.map((c: Application) => {
        //     c.app = new PIXI.Application({ view: document.querySelector("#game") });
        // });
    }

    start() {
        // const cs = this.componentManager.getComponentByType(getNameApplication());

        // cs.map((c: Application) => {
        //     document.body.appendChild(c.app.view);
        // });
    }

    update() { }

    stop() { }

    tearDown() { }
}