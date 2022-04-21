import Application, { getNameApplication } from "../components/Application";
import Graphics, { getNameGraphics } from "../components/Graphics";
import Sprite, { getNameSprite } from "../components/Sprite";
import { System } from "../libs/ecs/System";

export default class GraphicsSystem extends System {
  awake() {}

  start() {
    const app = this.componentManager.getComponentByType(
      getNameApplication()
    ) as Application;
    const graphics = this.componentManager.getComponentsByType(
      getNameGraphics()
    );
    const sprites = this.componentManager.getComponentsByType(getNameSprite());

    console.log("size", sprites?.length);
    sprites?.map((s) => {
      app.app?.stage.addChild((s as Sprite).sprite);
    });

    graphics?.map((c: Graphics) => {
      app.app.stage.addChild(c.graphics);
    });
  }

  update(delta: number) {}

  stop() {}

  tearDown() {
    const app = this.componentManager.getComponentByType(
      getNameApplication()
    ) as Application;
    const graphics = this.componentManager.getComponentsByType(
      getNameGraphics()
    );

    graphics.map((c: Graphics) => {
      app.app.stage.removeChild(c.graphics);
    });
  }
}
