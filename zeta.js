#!/usr/bin/env node

const readline = require('readline');

const tools = require('./tools');
const runLoop = require('./agent-loop');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let context = {
    messages: [],
    tools,
};

function prompt() {
    rl.question('> ', async (input) => {
        const response = await runLoop(input, context);
        console.log(response);

        prompt();
    });
}

prompt();
