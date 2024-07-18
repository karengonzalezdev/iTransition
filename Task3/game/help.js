//@ts-ignore
const AsciiTable = require('ascii-table');

class Help {
    static genTable(moves) {
        const table = new AsciiTable();
        const n = moves.length;
        console.log("The result are from player point of view, for example:");
        console.log("If you select Paper, and Computer gets Rock, you will win.")
        table.setHeading('⌄ PC/User >', ...moves);
        for (let i = 0; i < n; i++) {
            const row = [moves[i]];
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    row.push('Draw');
                } else if ((j > i && j <= i + n / 2) ||
                    (j < i && j < (i + n / 2) % n)) {
                    row.push('Win');
                } else {
                    row.push('Lose');
                }
            }
            table.addRow(...row);
            if (i < n - 1) {
                table.addRow('-----------', ...Array(n).fill('-------'));
            }
        }
        table.setBorder('|', '-', '+', '+');
        console.log(table.toString());
    }
}

module.exports = Help;