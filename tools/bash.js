const { exec } = require('child_process');

const maxOutput = 50 * 1024; // 50KB

const name = 'bash';
const description =
    'Execute a bash command and return its output (stdout and stderr). ' +
    'Commands run in the current working directory. ' +
    'Output is truncated to 50KB if it exceeds that limit. ';

const parameters = {
    type: 'object',
    properties: {
        command: {
            type: 'string',
            description: 'The bash command to execute',
        },
    },
    required: ['command'],
};

const execBash = async ({ command }) => {
    return new Promise((resolve) => {
        const config = {
            maxBuffer: 10 * 1024 * 1024, // 10MB max buffer
            shell: '/bin/bash',
        };

        const child = exec(command, config, (error, stdout, stderr) => {
            let output = '';

            if (stdout) output += stdout;
            if (stderr) output += (output ? '\n' : '') + `[stderr]\n${stderr}`;
            if (error) {
                output += `\n[error] ${error.message}`;
            }

            // Include exit code if non-zero
            if (error?.code != null) {
                output += `\n[exit code: ${error.code}]`;
            }

            if (!output.trim()) {
                output = '(no output)';
            }

            // Truncate if too large
            if (output.length > maxOutput) {
                output =
                    output.slice(0, maxOutput) +
                    '\n...[output truncated to 50KB]';
            }

            resolve(output);
        });
    });
};

module.exports = {
    name,
    description,
    parameters,
    execute: execBash,
};
