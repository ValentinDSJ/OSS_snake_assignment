import Application from "../components/Application";
import Sprite from "../components/Sprite";
import Velocity from "../components/Velocity";
import Scene from "../libs/ecs/Scene";
import GamePrefabs from "../prefabs/GamePrefabs";
import EventsSystem from "../systems/EventsSystem";
import GraphicsSystem from "../systems/GraphicsSystem";
import SnakeSystem from "../systems/SnakeSystem";
import HTMLSystem from "../systems/HTMLSystem";
import GameOverSystem from "../systems/GameOverSystem";

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
    this.systemManager.addSystem(
        new HTMLSystem(this.entityManager, this.componentManager)
    );
    this.systemManager.addSystem(
        new GameOverSystem(this.entityManager, this.componentManager)
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
    this.initEntity(GamePrefabs.createHTMLElement());
    this.initEntity(
      GamePrefabs.createApple(
        Math.floor(Math.random() * (1580 - 60)) + 60,
        Math.floor(Math.random() * (1580 - 60)) + 60
      )
    );
    const head = GamePrefabs.createHead();

    this.initEntity(head);

    let body = GamePrefabs.createBody(
      0,
      head[0] as Sprite,
      head[1] as Velocity
    );
    this.initEntity(body);

    for (let i = 1; i < 3; i++) {
      body = GamePrefabs.createBody(i, body[0] as Sprite, body[1] as Velocity);
      this.initEntity(body);
    }

    this.initEntity(GamePrefabs.createGameOver());
  }
}
