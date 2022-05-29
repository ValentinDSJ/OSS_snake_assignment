export default interface GameOver extends Component {
    over: boolean,
    exit: boolean,
    scoreSaved: boolean,
    saveScore: boolean
}

export function getNameGameOver(): string {
    return "GameOver";
}