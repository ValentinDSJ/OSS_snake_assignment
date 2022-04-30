import {GraphicsType} from "../components/Graphics";
import {Angle, Direction} from "../components/Snake";
import Velocity from "../components/Velocity";

export interface SnakeSaved {
    type: GraphicsType,
    isInit: boolean,
    angles: Array<Angle>,
    direction: Direction,
    dependsOn?: SnakeSaved,
    x: number,
    y: number,
    velocity: Velocity
}

export interface AppleSaved {
    isAte: boolean,
    x: number,
    y: number
}

export default interface GameSaved {
    score: number,
    name: string,
    snakes: Array<SnakeSaved>,
    apples: Array<AppleSaved>
}