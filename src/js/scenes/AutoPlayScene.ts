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
import AIController2System from "../systems/AIController2System";
import ComponentManager from "../libs/ecs/ComponentManager";

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
      new AIController2System(this.entityManager, this.componentManager)
    );
  }

  initEntities() {
    console.log(  document.querySelector(".game-scene .player-name"))
    // @ts-ignore
    document.querySelector(".game-scene .game-details .player-name").classList.add("visibility-hidden");
    // @ts-ignore
    document.querySelector(".game-scene .highest-score").classList.add("visibility-hidden");
    // @ts-ignore
    document.querySelector(".game-scene .game-over .player-name").classList.add("visibility-hidden");

    const application = this.componentManager.getComponentByType(
      "Application"
    ) as Application;

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
        application.nbBlocksWithWallX
      )
    );

    const head = GamePrefabs.createHead(application, "middle");

    let headId = this.initEntity(head);
    let body = Array<number>();
    let snakesBodyComponents = Array<Array<Component>>();

    let fsBody = GamePrefabs.createBody(
      application,
      "middle",
      head[0] as Graphics,
      head[1] as Velocity
    );
    body.push(this.initEntity(fsBody));
    snakesBodyComponents.push(fsBody);

    for (let i = 1; i < 3; i++) {
      // body.push(
      //   this.initEntity(
      //     GamePrefabs.createBody(
      //       application,
      //       "middle",
      //       fsBody[0] as Graphics,
      //       fsBody[1] as Velocity
      //     )
      //   )
      // );
      snakesBodyComponents.push(GamePrefabs.createBody(
          application,
          "middle",
          snakesBodyComponents[snakesBodyComponents.length - 1][0] as Graphics,
          snakesBodyComponents[snakesBodyComponents.length - 1][1] as Velocity));
      body.push(this.initEntity(snakesBodyComponents[snakesBodyComponents.length - 1]));
    }
    this.initEntity(AutoPlayPrefabs.createBot(headId, body));

    this.initEntity(GamePrefabs.createGameOver(false));
    this.initEntity(AutoPlayPrefabs.createPause());
  }

  tearDown() {
    super.tearDown();

    // @ts-ignore
    document.querySelector(".game-scene .game-details .player-name").classList.remove("visibility-hidden");
    // @ts-ignore
    document.querySelector(".game-scene .game-details .highest-score").classList.remove("visibility-hidden");
    // @ts-ignore
    document.querySelector(".game-scene .game-over .player-name").classList.remove("visibility-hidden");
  }
}
