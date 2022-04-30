export default interface Velocity extends Component {
    x: number,
    y: number,
    speed: number
}

export function getNameVelocity(): string {
    return "Velocity";
}