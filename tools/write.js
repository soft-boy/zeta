const fs = require('fs').promises;

const name = 'write';
const description =
    'Write content to a file. Creates the file if it does not exist, overwrites if it does.';

const parameters = {
    type: 'object',
    properties: {
        filePath: {
            type: 'string',
            description: 'The path of the file to write to',
        },
        content: {
            type: 'string',
            description: 'The content to write to the file',
        },
    },
    required: ['filePath', 'content'],
};

const writeFile = async ({ filePath, content }) => {
    try {
        await fs.writeFile(filePath, content, 'utf-8');
        return `Successfully wrote to ${filePath}`;
    } catch (error) {
        return `Error writing file: ${error.message}`;
    }
};

module.exports = {
    name,
    description,
    parameters,
    execute: writeFile,
};
