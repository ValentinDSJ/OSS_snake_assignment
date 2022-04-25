import Scene from "../libs/ecs/Scene";
import GamePrefabs from "../prefabs/GamePrefabs";
import EventsSystem from "../systems/EventsSystem";
import GraphicsSystem from "../systems/GraphicsSystem";
import SnakeSystem from "../systems/SnakeSystem";

export default class GameScene extends Scene {
  initSystems() {
    this.systemManager.addSystem(
      new GraphicsSystem(this.entityManager, this.componentManager)
    );
    this.systemManager.addSystem(
      new EventsSystem(this.entityManager, this.componentManager)
    );
    this.systemManager.addSystem(
      new SnakeSystem(this.entityManager, this.componentManager)
    );
  }

  initEntities() {
    this.initEntity(GamePrefabs.createBoard());
    this.initEntity(GamePrefabs.createButton());
    this.initEntity(GamePrefabs.createHead());
    this.initEntity(GamePrefabs.createApple(300, 200));
  }
}
