import Application, { getNameApplication } from "../components/Application";
import Graphics, { getNameGraphics } from "../components/Graphics";
import { System } from "../libs/ecs/System";

export default class GraphicsSystem extends System {
  awake() {}

  start() {
    const app = this.componentManager.getComponentByType(
      getNameApplication()
    ) as Application;
    const graphics = this.componentManager.getComponentsByType(
      getNameGraphics()
    ) as Array<Graphics>;

    graphics?.map((c) => {
      if (c.graphics) {
        app.app?.stage.addChild(c.graphics);
      } else if (c.sprite) {
        app.app?.stage.addChild(c.sprite);
      }
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
    ) as Array<Graphics>;

    graphics?.map((c) => {
      if (c.graphics) {
        app.app?.stage.removeChild(c.graphics);
      } else if (c.sprite) {
        app.app?.stage.removeChild(c.sprite);
      }
    });
  }
}
