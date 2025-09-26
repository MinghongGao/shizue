import { debugLog } from '@/logs';

export const validateApiEndpointAndKey = async (apiKey: string, endpoint: string) => {
  if (!endpoint || !apiKey || !apiKey.startsWith('sk-')) {
    debugLog('Invalid API key or endpoint');
    return false;
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      const errorJson = await response.json();
      debugLog('OpenAI error', errorJson);
    }
  } catch (e) {
    debugLog('API validation error', e);
  }
  return false;
};
