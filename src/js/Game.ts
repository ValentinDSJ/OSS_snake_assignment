import SharedPrefabs from "./prefabs/SharedPrefabs";
import Scene from "./libs/ecs/Scene";
import MenuScene from "./scenes/MenuScene";
import GameScene from "./scenes/GameScene";
import Application, { getNameApplication } from "./components/Application";
import * as PIXI from "pixi.js";
import { SceneType } from "./utils/SceneType";

export default class Game {
    private sharedEntities: Array<Array<Component>>;
    private scenes: Map<SceneType, () => Scene>;
    private scene?: Scene;
    private app?: Application;
    private currentScene: SceneType;

    static nextScene: SceneType;

    constructor() {
        Game.nextScene = SceneType.MENU;
        this.currentScene = SceneType.MENU;

        this.initScenes();
        this.scene = this.scenes.get(this.currentScene)();
    }

    initSharedEntities() {
        this.sharedEntities = Array<Array<Component>>();
        this.app = <Application>{
            name: getNameApplication()
        };
        this.sharedEntities.push(SharedPrefabs.createApplication(this.app));
    }

    initScenes() {
        this.scenes = new Map<SceneType, () => Scene>();
        this.scenes.set(SceneType.MENU, () => new MenuScene());
        this.scenes.set(SceneType.GAME, () => new GameScene());
    }

    start() {
        this.initSharedEntities();

        this.scene.awake(this.sharedEntities);
        this.scene.start();
        this.app.app.ticker.add((delta) => {
            this.scene.update(delta);
            if (Game.nextScene != this.currentScene) {
                this.changeScene();
            }
        });
        // this.scene.stop();
        // this.scene.tearDown();
    }

    changeScene() {
        this.scene.stop();
        this.scene.tearDown();
        this.currentScene = Game.nextScene;
        this.scene = this.scenes.get(this.currentScene)();
        this.scene.awake(this.sharedEntities);
        this.scene.start();
    }
}