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
    app.nbBlocksGrassX = 40;
    app.nbBlocksGrassY = 40;
    app.nbBlocksWithWallX = 42;
    app.nbBlocksWithWallY = 42;
    app.blockSizeX = app.app.screen.width / app.nbBlocksWithWallX;
    app.blockSizeY = app.app.screen.height / app.nbBlocksWithWallY;
    components.push(app);

    return components;
  }
}
