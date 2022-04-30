export default interface GameOver extends Component {
    over: boolean,
    exit: boolean,
    scoreSaved: boolean
}

export function getNameGameOver(): string {
    return "GameOver";
}