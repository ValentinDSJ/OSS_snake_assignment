import {Graphics as G} from "pixi.js";
import {Sprite as S} from "pixi.js";

export enum GraphicsType {
    WALL,
    SNAKE,
    SNAKE_HEAD,
    APPLE,
    GRASS,
    SNAKE_TAIL
}

export default interface Graphics extends Component {
    graphics?: G,
    sprite?: S,
    type: GraphicsType,
    isInit: boolean
}

export function getNameGraphics(): string {
    return "Graphics";
}