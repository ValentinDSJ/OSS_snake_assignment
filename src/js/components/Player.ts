export default interface Player extends Component {
    score: number,
    highestScore: number,
    isBot?: boolean
}

export function getNamePlayer(): string {
    return "Player";
}