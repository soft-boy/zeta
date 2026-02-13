const fs = require('fs').promises;

const name = 'read';
const description = 'Read a file and output its contents as a string.';

const parameters = {
    type: 'object',
    properties: {
        filePath: {
            type: 'string',
            description: 'The path of the file to read',
        },
    },
    required: ['filePath'],
};

const readFile = async ({ filePath }) => {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
    } catch (error) {
        return `Error reading file: ${error.message}`;
    }
};

module.exports = {
    name,
    description,
    parameters,
    execute: readFile,
};
