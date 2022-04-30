export default interface Player extends Component {
    score: number,
    highestScore: number
}

export function getNamePlayer(): string {
    return "Player";
}