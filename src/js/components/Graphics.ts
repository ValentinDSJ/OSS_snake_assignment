import {Graphics as G} from "pixi.js";
import {Sprite as S} from "pixi.js";

export enum GraphicsType {
    WALL,
    SNAKE,
    SNAKE_HEAD,
    APPLE,
    GRASS
}

export default interface Graphics extends Component {
    graphics?: G,
    sprite?: S,
    type: GraphicsType
}

export function getNameGraphics(): string {
    return "Graphics";
}