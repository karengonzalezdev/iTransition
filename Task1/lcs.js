const findLcs=s=>{let r='',a=s[0];for(let i=0;i<a.length;i++)for(let j=i+1;j<=a.length;j++){let sub=a.slice(i,j);if(s.every(t=>t.includes(sub))&&sub.length>r.length)r=sub}return r}
const args=process.argv.slice(2)
if(args.length===0)console.log('')
else console.log(findLcs(args))