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
      // resizeTo: window,
      resolution: devicePixelRatio,
    });
    app.app.renderer.resize(view.offsetWidth, view.offsetHeight);
    app.nbBlocksGrass = 40;
    app.nbBlocksWithWall = 42;
    app.blockSizeX = app.app.screen.width / app.nbBlocksWithWall;
    app.blockSizeY = app.app.screen.height / app.nbBlocksWithWall;
    components.push(app);

    return components;
  }
}
