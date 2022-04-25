import { System } from "../libs/ecs/System";
import GamePrefabs from "../prefabs/GamePrefabs";

export default class SnakeSystem extends System {

  spawnApple() {
    console.log(this.entityManager);
    console.log(this.componentManager);
    // console.log(this.componentManager.getComponentByType("Application")?.app.screen)
    // this.componentManager.addComponents(GamePrefabs.createApple(100, 100));
    // this.entityManager.addEntity(GamePrefabs.createApple(100, 100));
  }

  update(delta: number) {
    this.spawnApple();
  }

}