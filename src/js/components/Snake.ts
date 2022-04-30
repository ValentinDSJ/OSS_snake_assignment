interface Angle {
    direction: number,
    x: number,
    y: number,
    validate: boolean
}

export enum Direction {
    RIGHT,
    LEFT,
    DOWN,
    UP
}

export default interface Snake extends Component {
    angles: Array<Angle>,
    direction: Direction
}

export function getNameSnake(): string {
    return "Snake";
}