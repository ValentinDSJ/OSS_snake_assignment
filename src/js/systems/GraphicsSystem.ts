import Application, { getNameApplication } from "../components/Application";
import Graphics, { getNameGraphics } from "../components/Graphics";
import { System } from "../libs/ecs/System";
import Snake, {getNameSnake} from "../components/Snake";

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
      c.isInit = true;
    });
  }

  update(delta: number) {
    const graphics = this.componentManager.getComponentsByType(getNameGraphics()) as Array<Graphics>;
    const app = this.componentManager.getComponentByType(getNameApplication()) as Application;

    for (const graphic of graphics) {
      if (graphic.isInit)
        continue;
      if (graphic.graphics) {
        app.app?.stage.addChild(graphic.graphics);
      } else if (graphic.sprite) {
        app.app?.stage.addChild(graphic.sprite);
      }
    }
  }

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
