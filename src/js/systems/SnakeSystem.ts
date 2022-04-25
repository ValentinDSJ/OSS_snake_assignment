import Sprite from "../components/Sprite";
import { System } from "../libs/ecs/System";

export default class SnakeSystem extends System {
  spawnApple() {
    // console.log(this.entityManager);
    // console.log(this.componentManager);
    // console.log(this.componentManager.getComponentByType("Application")?.app.screen)
  }

  update(delta: number) {
    // this.spawnApple();
    // this.moveBody();
  }
}
