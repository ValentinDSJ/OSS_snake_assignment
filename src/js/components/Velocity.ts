export default interface Velocity extends Component {
    x: number,
    y: number,
    speed: number,
    skip: number
}

export function getNameVelocity(): string {
    return "Velocity";
}