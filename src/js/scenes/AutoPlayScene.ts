import Application from "../components/Application";
import Velocity from "../components/Velocity";
import Scene from "../libs/ecs/Scene";
import GamePrefabs from "../prefabs/GamePrefabs";
import EventsSystem from "../systems/EventsSystem";
import GraphicsSystem from "../systems/GraphicsSystem";
import SnakeSystem from "../systems/SnakeSystem";
import HTMLSystem from "../systems/HTMLSystem";
import GameOverSystem from "../systems/GameOverSystem";
import GameDetailsSystem from "../systems/GameDetailsSystem";
import Graphics from "../components/Graphics";
import AppleSystem from "../systems/AppleSystem";
import VelocitySystem from "../systems/VelocitySystem";
import RestartSystem from "../systems/RestartSystem";
import AutoPlayPrefabs from "../prefabs/AutoPlayPrefabs";
import AIControllerSystem from "../systems/AIControllerSystem";

export default class AutoPlayScene extends Scene {
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
    this.systemManager.addSystem(
        new GameDetailsSystem(this.entityManager, this.componentManager)
    );
    this.systemManager.addSystem(
        new VelocitySystem(this.entityManager, this.componentManager)
    );
    this.systemManager.addSystem(
        new AppleSystem(this.entityManager, this.componentManager)
    );
    this.systemManager.addSystem(
        new RestartSystem(this.entityManager, this.componentManager)
    );
    this.systemManager.addSystem(
        new AIControllerSystem(this.entityManager, this.componentManager)
    );
  }

  initEntities() {
    const application = this.componentManager.getComponentByType("Application") as Application;

    if (!application) {
      return;
    }
    this.initEntity(
        GamePrefabs.createBoard(
            application,
            (application as Application).app?.screen.width ?? 0,
            (application as Application).app?.screen.height ?? 0
        )
    );
    this.initEntity(GamePrefabs.createHTMLElement());

    this.initEntity(
        GamePrefabs.createApple(
            application,
            application.blockSizeX,
            application.blockSizeY,
            application.app?.screen.width ?? 0,
            application.app?.screen.height ?? 0,
            application.nbBlocksWithWall
        )
    );

    const head = GamePrefabs.createHead(
        application,
        application.app?.screen.width ?? 0,
        application.app?.screen.height ?? 0,
    );

    let headId = this.initEntity(head);
    let body = Array<number>();

    let fsBody = GamePrefabs.createBody(
        application,
        application.app?.screen.width ?? 0,
        application.app?.screen.height ?? 0,
        0,
        head[0] as Graphics,
        head[1] as Velocity
    );
    body.push(this.initEntity(fsBody));

    for (let i = 1; i < 3; i++) {
      body.push(this.initEntity(GamePrefabs.createBody(
          application,
          application.app?.screen.width ?? 0,
          application.app?.screen.height ?? 0,
          i, fsBody[0] as Graphics, fsBody[1] as Velocity)));
    }
    this.initEntity(AutoPlayPrefabs.createBot(headId, body));

    this.initEntity(GamePrefabs.createGameOver());
    this.initEntity(AutoPlayPrefabs.createPause());
  }
}