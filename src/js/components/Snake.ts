import Position from "./Position";

export interface Angle {
    direction: number,
    x: number,
    y: number
}

export enum Direction {
    RIGHT,
    LEFT,
    DOWN,
    UP
}

export default interface Snake extends Component {
    angles: Array<Angle>,
    direction: Direction,
    dependsOn?: Snake,
    lastDirection: Direction,
    lastPos?: Array<Position>
}

export function getNameSnake(): string {
    return "Snake";
}