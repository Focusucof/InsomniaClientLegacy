const {compile} = require('nexe');

compile({
    input: '../src/app.js',
    output: 'InsomniaClient.exe',
    build: true,
    ico: './build/INS.ico',
    target: 'win32-x64-12.22.1',
    loglevel: 'verbose',
}).then(() => {
    console.log('Success')
}).catch(e => {
    console.log(e);
});

//_______________BUILD DEPENDECIES_______________
// * PYTHON 2.7
// * NASM