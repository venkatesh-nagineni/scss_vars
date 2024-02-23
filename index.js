const fs = require('fs/promises');
const path = require('path');
const sassVars = require('get-sass-vars');

const inputDirPath = path.join(__dirname, './src');

async function extractVariablesFromFile(filename) {
    const fileContent = await fs.readFile(path.join(inputDirPath, filename), 'utf8');
    const variables = await sassVars(fileContent, {sassOptions: {includePaths: [path.resolve(inputDirPath)]}});
    console.log(variables);
}

extractVariablesFromFile('_radius.scss').then()