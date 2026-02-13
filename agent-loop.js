const invokeLLM = require('./lib/invokeLLM');

async function invokeToolCall(toolCall, tools) {
    const tool = tools.find((t) => t.name === toolCall.name);

    let resultText;
    let isError = false;

    try {
        if (!tool) throw new Error(`Tool ${toolCall.name} not found`);
        resultText = await tool.execute(toolCall.arguments);
    } catch (e) {
        resultText = e.message ?? String(e);
        isError = true;
    }

    return { resultText, isError };
}

function getLastMessageContent(messages) {
    return messages[messages.length - 1].content[0].text;
}

async function runLoop(userPrompt, context) {
    context.messages.push({ role: 'user', content: userPrompt });

    while (true) {
        const response = await invokeLLM(context.messages, context.tools);
        // Push assistant message with raw content for API compatibility
        context.messages.push({ role: 'assistant', content: response.content });

        // If no tool calls, we're done
        if (!response.toolCalls?.length) break;

        const toolResults = [];
        for (const toolCall of response.toolCalls) {
            const { resultText, isError } = await invokeToolCall(
                toolCall,
                context.tools
            );

            toolResults.push({
                type: 'tool_result',
                tool_use_id: toolCall.id,
                content: resultText,
                ...(isError && { is_error: true }),
            });
        }

        context.messages.push({ role: 'user', content: toolResults });
    }

    return getLastMessageContent(context.messages);
}

module.exports = runLoop;
