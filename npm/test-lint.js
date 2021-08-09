const fs = require('fs');
const join = require('path').join;
const cp = require('child_process');
const os = require('os');
const async = require('async');

const packageDirs = ['reporter', 'dashboard', 'frontend'];

function testLint(modPath, done) {
    // ensure path has package.json
    if (!fs.existsSync(join(modPath, 'package.json'))) {
        return;
    }

    console.log(`\nRunning lint tests in ${modPath}\n`);

    // npm binary based on OS
    var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';

    cp.spawn(npmCmd, ['run', 'test:lint'], {
        env: process.env,
        cwd: modPath,
        stdio: 'inherit',
    }).on('exit', (code) => {
        if (code) {
            // eslint-disable-next-line prettier/prettier,max-len
            done(new Error(`Error while running lint tests. Process exited with code ${code}`));
        }

        done();
    });
}

async.mapLimit(packageDirs, 1, testLint, (err) => {
    if (err) {
        throw err;
    }
});
