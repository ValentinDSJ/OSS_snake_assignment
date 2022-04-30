interface Angle {
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
    isInit: boolean
}

export function getNameSnake(): string {
    return "Snake";
}