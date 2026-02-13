const fs = require('fs').promises;

const name = 'edit';
const description =
    'Edit a file by replacing an exact text match with new text. ' +
    'The oldText must match exactly (including whitespace).';

const parameters = {
    type: 'object',
    properties: {
        filePath: {
            type: 'string',
            description: 'The path of the file to edit',
        },
        oldText: {
            type: 'string',
            description: 'The exact text to find and replace',
        },
        newText: {
            type: 'string',
            description: 'The new text to replace the old text with',
        },
    },
    required: ['filePath', 'oldText', 'newText'],
};

const editFile = async ({ filePath, oldText, newText }) => {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        if (!content.includes(oldText)) {
            return `Error: oldText not found in ${filePath}`;
        }
        const newContent = content.replace(oldText, newText);
        await fs.writeFile(filePath, newContent, 'utf-8');
        return `Successfully edited ${filePath}`;
    } catch (error) {
        return `Error editing file: ${error.message}`;
    }
};

module.exports = {
    name,
    description,
    parameters,
    execute: editFile,
};
