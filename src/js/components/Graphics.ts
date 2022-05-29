import {Graphics as G} from "pixi.js";
import {Sprite as S} from "pixi.js";
import Position from "./Position";
import {Direction} from "./Snake";
import Velocity from "./Velocity";

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
    isInit: boolean,
    posInBoard: Position,
    lastPosInBoard: Position,
    initialPosition: Position,
    initialRotation: number,
    initialVelocity: Velocity,
}

export function getNameGraphics(): string {
    return "Graphics";
}