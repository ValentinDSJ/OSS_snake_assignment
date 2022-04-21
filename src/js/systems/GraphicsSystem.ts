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

    sprites?.map((s) => {
      app.app?.stage.addChild((s as Sprite).sprite);
    });

    graphics?.map((c) => {
      app.app?.stage.addChild((c as Graphics).graphics);
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
    const sprites = this.componentManager.getComponentsByType(getNameSprite());

    sprites?.map((c) => {
      app.app?.stage.removeChild((c as Sprite).sprite);
    });

    graphics?.map((c) => {
      app.app?.stage.removeChild((c as Graphics).graphics);
    });
  }
}
