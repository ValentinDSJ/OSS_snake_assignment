import Application from "../components/Application";
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
    const application = this.componentManager.getComponentByType("Application");

    if (!application) {
      return;
    }
    this.initEntity(
      GamePrefabs.createBoard(
        (application as Application).app?.screen.width ?? 0,
        (application as Application).app?.screen.height ?? 0
      )
    );
    this.initEntity(GamePrefabs.createButton());
    this.initEntity(
      GamePrefabs.createApple(Math.random() * 500, Math.random() * 500)
    );
    this.initEntity(GamePrefabs.createHead());
  }
}
