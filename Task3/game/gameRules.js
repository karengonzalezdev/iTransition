class GameRules {
    constructor(moves) {
        this.moves = moves;
    }
    winner(playerMove, computerMove) {
        const half = Math.floor(this.moves.length / 2);
        const playerIdx = this.moves.indexOf(playerMove);
        const computerIdx = this.moves.indexOf(computerMove);
        if (playerIdx === computerIdx) {
            return 'Draw';
        } else if ((computerIdx > playerIdx && computerIdx <= playerIdx + half)
            || (computerIdx < playerIdx && computerIdx + this.moves.length <= playerIdx + half)) {
            return 'Computer wins';
        } else {
            return 'Player wins';
        }
    }
}

module.exports = GameRules;