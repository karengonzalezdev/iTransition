const KeyGen = require('./keyGen');
const HmacGen = require('./hmacGen');
const Help = require('./help');
const GameRules = require('./gameRules');

const args = process.argv.slice(2);
if (args.length < 3 || args.length % 2 === 0 || new Set(args).size !== args.length) {
    console.error('Invalid characters, please provide an odd number major than or equal to 3 of non-repeating strings');
    console.log('Example: node index.js Rock Paper Scissors');
    process.exit(1);
}
const key = KeyGen.genKey();
const computerMove = args[Math.floor(Math.random() * args.length)];
const hmac = HmacGen.calculateHmac(key, computerMove);
console.log(`HMAC: ${hmac}`);
console.log('Available moves: ');
args.forEach((move, index) => {
    console.log(`${index + 1} - ${move}`);
});
console.log('0 - Exit');
console.log('? - Help')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
readline.question('Enter your move: ', (choice) => {
    if (choice === '0') {
        console.log('Exiting...');
        readline.close();
        process.exit(0);
    }
    if (choice === '?') {
        Help.genTable(args);
        readline.close();
        process.exit(0);
    }
    const playerMove = args[parseInt(choice) - 1];
    if (!playerMove) {
        console.error('Invalid choice, try again');
        readline.close();
        process.exit(1);
    }
    const gameRules = new GameRules(args);
    const result = gameRules.winner(playerMove, computerMove);
    console.log(`Your move: ${playerMove}`);
    console.log(`Computer move: ${computerMove}`);
    console.log(`Result: ${result}`);
    console.log(`Key: ${key}`);
    readline.close();
});
if (args.includes('--help')) {
    Help.genTable(args);
    process.exit(0);
}