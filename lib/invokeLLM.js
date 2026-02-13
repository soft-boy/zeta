const model = 'claude-opus-4-6';
const systemPrompt = 'You are a helpful assistant';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
});

const getPayload = (messages, tools) => ({
    model: model,
    max_tokens: 8096,
    system: systemPrompt,
    messages: messages,
    tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.parameters,
    })),
});

const invokeAnthropicApi = async (messages, tools) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(getPayload(messages, tools)),
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(`Anthropic API error: ${data.error.message}`);
    }

    return data;
};

const invokeLLM = async (messages, tools) => {
    const response = await invokeAnthropicApi(messages, tools);

    const toolCalls = response.content
        .filter((block) => block.type === 'tool_use')
        .map((block) => ({
            id: block.id,
            name: block.name,
            arguments: block.input,
        }));

    return {
        role: 'assistant',
        content: response.content,
        toolCalls,
    };
};

module.exports = invokeLLM;
