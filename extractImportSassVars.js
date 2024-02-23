const fs = require('fs');
const path = require('path');

// Function to process SASS files and replace variables
function processSassFile(filePath) {
    // Read the content of the file
    let replacedContent = fs.readFileSync(filePath, 'utf8');

    // Regular expression to match SASS imports
    const importRegex = /@import\s+['"][^'"]+['"];/g;

    // Extract import paths and replace variables
    let importMatch;
    while ((importMatch = importRegex.exec(replacedContent)) !== null) {
        const importPath = importMatch[0];
        const importedFilePath = path.resolve(path.dirname(filePath), `_${importPath.match(/['"]([^'"]+)['"]/)[1]}.scss`);
        const importedVariables = parseSassVariables(importedFilePath);
        replacedContent = replaceVariableValues(replacedContent, importedVariables);
    }

    // Remove import statements
    replacedContent = replacedContent.replace(importRegex, '');

    return replacedContent;
}

// Function to parse SASS variables within a specific file
function parseSassVariables(filePath, resolvedVariables = {}) {
    // Read the content of the SASS file
    const content = fs.readFileSync(filePath, 'utf8');

    // Regular expression to match SASS variables and their values
    const variableRegex = /\$([a-zA-Z0-9_-]+):\s*(.*?);/g;

    // Extract variables and their values
    let match;
    while ((match = variableRegex.exec(content)) !== null) {
        const variableName = match[1];
        const variableValue = match[2];
        resolvedVariables[variableName] = variableValue;
    }

    return resolvedVariables;
}

// Function to replace variable values in content
function replaceVariableValues(content, variables) {
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\$${key}\\b`, 'g');
        content = content.replace(regex, value);
    }
    return content;
}

module.exports = processSassFile;
