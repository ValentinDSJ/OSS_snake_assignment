import SharedPrefabs from "./prefabs/SharedPrefabs";
import Scene from "./libs/ecs/Scene";
import MenuScene from "./scenes/MenuScene";
import GameScene from "./scenes/GameScene";
import Application, { getNameApplication } from "./components/Application";
import * as PIXI from "pixi.js";
import { SceneType } from "./utils/SceneType";
import RankingScene from "./scenes/RankingScene";
import AutoPlayScene from "./scenes/AutoPlayScene";
import DualPlayScene from "./scenes/DualPlayScene";

export default class Game {
    private readonly sharedEntities: Array<Array<Component>>;
    private scenes: Map<SceneType, () => Scene>;
    private scene: Scene;
    private app?: Application;
    private currentScene: SceneType;

    static nextScene: SceneType;

    constructor() {
        Game.nextScene = SceneType.MENU;
        this.currentScene = Game.nextScene;
        this.sharedEntities = Array<Array<Component>>();
        this.scenes = new Map<SceneType, () => Scene>();

        this.initScenes();
        this.scene = this.scenes.get(this.currentScene)!();
        this.generateName();
    }

    generateName() {
        let name = localStorage.getItem("name");

        if (!name) {
            name = `Player${Math.floor(Math.random() * 1000000)}`
            localStorage.setItem('name', name);
        }
    }

    initSharedEntities() {
        this.app = <Application>{
            name: getNameApplication(),
        };
        this.sharedEntities.push(SharedPrefabs.createApplication(this.app));
    }

    initScenes() {
        this.scenes = new Map<SceneType, () => Scene>();
        this.scenes.set(SceneType.MENU, () => new MenuScene());
        this.scenes.set(SceneType.GAME, () => new GameScene());
        this.scenes.set(SceneType.AUTO_PLAY, () => new AutoPlayScene());
        this.scenes.set(SceneType.DUAL_PLAY, () => new DualPlayScene());
        this.scenes.set(SceneType.RANKING, () => new RankingScene());
    }

    start() {
        this.initSharedEntities();

        this.scene.awake(this.sharedEntities);
        this.scene.start();
        this.app!.app!.ticker.add((delta) => {
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
        this.scene = this.scenes.get(this.currentScene)!();
        this.scene.awake(this.sharedEntities);
        this.scene.start();
    }
}