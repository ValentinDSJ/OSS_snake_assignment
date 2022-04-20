import Application, {getNameApplication} from "../components/Application";
import * as PIXI from "pixi.js";

export default class SharedPrefabs {
    static createApplication(app: Application): Array<Component> {
        let components = Array<Component>();

        app.app = new PIXI.Application({view: document.querySelector("#game")});
        components.push(app);
        return components;
    }
}