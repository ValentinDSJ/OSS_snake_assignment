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
import DualPlayPrefabs from "../prefabs/DualPlayPrefabs";

export default class DualPlayScene extends Scene {
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
    const actualScoreHTML = document.querySelector(
      ".game-scene .game-details"
    )!;
    // @ts-ignore
    actualScoreHTML.style.visibility = "hidden";
    this.systemManager.addSystem(
      new VelocitySystem(this.entityManager, this.componentManager)
    );
    this.systemManager.addSystem(
      new AppleSystem(this.entityManager, this.componentManager)
    );
    this.systemManager.addSystem(
      new RestartSystem(this.entityManager, this.componentManager)
    );
  }

  initSnake(application: Application, playerNb: number) {
    const head = GamePrefabs.createHead(
      application,
      playerNb === 0 ? "top-left" : "bottom-right"
    );

    let headId = this.initEntity(head);
    let body = Array<number>();
    let snakesBodyComponents = Array<Array<Component>>();

    let fsBody = GamePrefabs.createBody(
      application,
      playerNb === 0 ? "top-left" : "bottom-right",
      head[0] as Graphics,
      head[1] as Velocity
    );
    body.push(this.initEntity(fsBody));
    snakesBodyComponents.push(fsBody);

    for (let i = 1; i < 3; i++) {
      snakesBodyComponents.push(
        GamePrefabs.createBody(
          application,
          playerNb === 0 ? "top-left" : "bottom-right",
          snakesBodyComponents[snakesBodyComponents.length - 1][0] as Graphics,
          snakesBodyComponents[snakesBodyComponents.length - 1][1] as Velocity
        )
      );
      body.push(
        this.initEntity(snakesBodyComponents[snakesBodyComponents.length - 1])
      );
    }
    this.initEntity(
      GamePrefabs.createPlayer(headId, body, undefined, playerNb)
    );
  }

  initEntities() {
    // @ts-ignore
    document.querySelector(".game-scene .game-over .player-name").classList.add("visibility-hidden");

    const application = this.componentManager.getComponentByType(
      "Application"
    ) as Application;

    if (!application) {
      return;
    }

    const view = document.querySelector("#game") as HTMLCanvasElement;

    application.nbBlocksWithWallX = 82;
    application.nbBlocksGrassX = 80;
    document.querySelector("#game")?.classList.add("big");
    application.app?.renderer.resize(view.offsetWidth, view.offsetHeight);

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

    this.initSnake(application, 0);
    this.initSnake(application, 1);

    this.initEntity(GamePrefabs.createGameOver(false));
    this.initEntity(DualPlayPrefabs.createPause());
  }

  tearDown() {
    super.tearDown();

    const view = document.querySelector("#game") as HTMLCanvasElement;

    const application = this.componentManager.getComponentByType(
      "Application"
    ) as Application;

    application.nbBlocksWithWallX = 42;
    application.nbBlocksGrassX = 40;
    view.classList.remove("big");
    application.app?.renderer.resize(view.offsetWidth, view.offsetHeight);

    const actualScoreHTML = document.querySelector(
        ".game-scene .game-details"
    )!;
    // @ts-ignore
    actualScoreHTML.style.visibility = "visible";

    // @ts-ignore
    document.querySelector(".game-scene .game-over .player-name").classList.remove("visibility-hidden");
  }
}
