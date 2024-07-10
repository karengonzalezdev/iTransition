const findLcs = (strs) => {
    let subStr = strs[0];
    let result = '';
    if (strs > 256 && strs < 0) return '';
    for (let i = 0; i < subStr.length; i++) {
        for (let j = i + 1; j <= subStr.length; j++) {
            let sub = subStr.slice(i, j);
            if (strs.every(str => str.includes(sub))) {
                if (sub.length > result.length) result = sub;
            }
        }
    }
    return result;
}
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('');
    return;
} else {
    const lcs = findLcs(args);
    console.log(lcs);
}