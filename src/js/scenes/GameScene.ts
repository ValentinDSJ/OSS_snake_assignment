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
import SaveSystem from "../systems/SaveSystem";
import VelocitySystem from "../systems/VelocitySystem";
import GameSaved from "../utils/GameSaved";
import Game from "../Game";
import {SceneType} from "../utils/SceneType";
import RestartSystem from "../systems/RestartSystem";

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
        new SaveSystem(this.entityManager, this.componentManager)
    );
    this.systemManager.addSystem(
        new RestartSystem(this.entityManager, this.componentManager)
    );
  }

  initEntities() {
    const application = this.componentManager.getComponentByType("Application") as Application;
    const loadGame = localStorage.getItem("loadGame") == "true";
    const savedGameString = localStorage.getItem("saveGame");

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

    if (loadGame && savedGameString) {
      const savedGame = JSON.parse(savedGameString) as GameSaved;

      try {
        for (const apple of savedGame.apples) {
          this.initEntity(GamePrefabs.createSavedApple(
              application.blockSizeX,
              application.blockSizeY,
              apple.x,
              apple.y,
              apple.isAte
          ));
        }
        for (const snake of savedGame.snakes) {
          this.initEntity(GamePrefabs.createSavedSnake(
              snake,
              application.blockSizeX,
              application.blockSizeY,
          ))
        }
      } catch (e) {
        Game.nextScene = SceneType.MENU;
        localStorage.removeItem("saveGame");
        return;
      }
    } else {
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

      this.initEntity(head);

      let body = GamePrefabs.createBody(
          application,
          application.app?.screen.width ?? 0,
          application.app?.screen.height ?? 0,
        0,
        head[0] as Graphics,
        head[1] as Velocity
      );
      this.initEntity(body);

      for (let i = 1; i < 3; i++) {
        body = GamePrefabs.createBody(
            application,
            application.app?.screen.width ?? 0,
            application.app?.screen.height ?? 0,
            i, body[0] as Graphics, body[1] as Velocity);
        this.initEntity(body);
      }
    }

    this.initEntity(GamePrefabs.createGameOver());
    this.initEntity(GamePrefabs.createPlayer());
    this.initEntity(GamePrefabs.createPause());

    localStorage.removeItem("loadGame");
  }
}
