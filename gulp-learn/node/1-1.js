const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

exec('node -v').then(res => {
    console.log(res);
    const { stdout, stderr } = res;
    console.log(stdout);
    console.log(stderr);
});
console.log('------------------');
(async () => {
    const { stdout, stderr } = await exec('node -v');
    console.log('stdout:', stdout, 'stderr:', stderr);
})();