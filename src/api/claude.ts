const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.warn(
    'WARNING: VITE_ANTHROPIC_API_KEY is not set. Claude API calls will fail. Make sure to add your API key to .env file'
  );
}

export async function askClaude(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      'API key not found. Please set VITE_ANTHROPIC_API_KEY in your .env file'
    );
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `API Error: ${response.status} - ${error.error?.message || 'Unknown error'}`
      );
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to communicate with Claude API');
  }
}
