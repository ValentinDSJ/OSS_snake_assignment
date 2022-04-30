import * as PIXI from "pixi.js";
import Application from "../components/Application";

export default class SharedPrefabs {
  static createApplication(app: Application): Array<Component> {
    let components = Array<Component>();

    const view = document.querySelector("#game") as HTMLCanvasElement;

    if (!view) {
      throw new Error("View not found");
    }

    app.app = new PIXI.Application({
      view,
      resizeTo: window,
      resolution: devicePixelRatio,
    });
    app.app.renderer.resize(view.offsetWidth, view.offsetHeight);
    app.blockSizeX = app.app.screen.width / 40;
    app.blockSizeY = app.app.screen.height / 40;
    components.push(app);

    return components;
  }
}
