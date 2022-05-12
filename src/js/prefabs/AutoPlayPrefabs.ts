import * as PIXI from "pixi.js";
import appleSprite from "../../../assets/sprites/food.png";
import snakeBody from "../../../assets/sprites/nibbler_snake_core.png";
import snakeHead from "../../../assets/sprites/nibbler_snake_head.png";
import Graphics, {getNameGraphics, GraphicsType} from "../components/Graphics";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Game from "../Game";
import {SceneType} from "../utils/SceneType";
import EntityManager from "../libs/ecs/EntityManager";
import ComponentManager from "../libs/ecs/ComponentManager";
import HTML, {getNameHTML} from "../components/HTML";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Player, {getNamePlayer} from "../components/Player";
import Pause, {getNamePause} from "../components/Pause";
import Snake, {Direction, getNameSnake} from "../components/Snake";
import Application from "../components/Application";
import Save, {getNameSave} from "../components/Save";
import {SnakeSaved} from "../utils/GameSaved";
import Apple, {getNameApple} from "../components/Apple";
import Restart, {getNameRestart} from "../components/Restart";
import GameOverSystem from "../systems/GameOverSystem";

export default class AutoPlayPrefabs {

    static createBot(head: number, body: Array<number>, score?: number): Array<Component> {
        let components = Array<Component>();

        components.push(<Player>{
            name: getNamePlayer(),
            score: score ?? 0,
            keyEventRight: 'ArrowRight',
            keyEventLeft: 'ArrowLeft',
            keyEventDown: 'ArrowDown',
            keyEventUp: 'ArrowUp',
            head: head,
            body: body,
            isBot: true
        });
        return components;
    }

    static createPause(): Array<Component> {
        let components = Array<Component>();
        let events = new Map;

        events.set(".pause .resume-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
            const element = document.querySelector('body main .game-scene .pause');
            const pause = cm.getComponentByType(getNamePause()) as Pause;

            if (pause) {
                pause.isPaused = false;
            }

            element?.classList.add("hidden");
        });

        events.set(".pause .exit-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
            const element = document.querySelector('body main');
            const pauseElement = document.querySelector('body main .game-scene .pause');

            pauseElement?.classList.add("hidden");
            element?.classList.remove("game");
            setTimeout(function () {
                Game.nextScene = SceneType.MENU;
            }, 500);
        });

        events.set(".pause .restart-button", (idEntity: number, em: EntityManager, cm: ComponentManager) => {
            const element = document.querySelector('body main .game-scene .pause');const pause = cm.getComponentByType(getNamePause()) as Pause;

            if (pause) {
                pause.isPaused = false;
            }

            element?.classList.add("hidden");

            const restart = cm.getComponentByType(getNameRestart()) as Restart;

            restart.click = true;
        });

        components.push(<HTML>{
            name: getNameHTML(),
            onReady: (idEntity, em: EntityManager, cm: ComponentManager) => {
                document.querySelector('body main .game-scene .pause .save-button')?.classList.add('display-none');
                document.querySelector('main')?.classList.add('game');
            },
            onFinish: (idEntity, em: EntityManager, cm: ComponentManager) => {
                document.querySelector('body main .game-scene .pause .save-button')?.classList.remove('display-none');
            },
            element: 'body main .game-scene',
            eventsOnClick: events
        });
        components.push(<Pause>{
            name: getNamePause(),
            isPaused: false
        });
        components.push(<Save>{
            name: getNameSave(),
            click: false
        });
        components.push(<Restart>{
            name: getNameRestart(),
            click: false
        });
        return components;
    }
}
