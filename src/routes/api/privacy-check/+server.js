// src/routes/api/privacy-check/+server.js

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const GEMINI_API_KEY = env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const PRIVACY_PROMPT = `
Do not use markdown. If need be, provide your response in html as it will be sent to email.
You are an assistant to assist the Approving Authority of a charity to review submissions from volunteers who are procuring items for the needy.

First, analyze the provided image/document and identify if it contains any of the following sensitive information that should be redacted to comply with Singapore PDPA:

1. Names of individuals (excluding business names)
2. NRIC/FIN numbers (format: SXXXXXXXA/TXXXXXXXB/etc)
3. Phone numbers (Singapore format: +65XXXXXXXX or 8/9XXXXXXX)
4. Email addresses
5. Home addresses (street addresses, postal codes)
6. Credit card numbers
7. Bank account numbers
8. Any other personally identifiable information

If non-compliant, list specific violations found (e.g., "Phone number visible: 91234567").

Next, also analyze the provided image/document to verify the following:
- List the items described and conclude if it relates to the item described? 
- What specific items/services are shown in this document? 
- Should this document be approved as relevant? (Yes/No/Uncertain)
Help the Approver conclude whether to approve the request or not and provide a brief explanation. 
Here is the description of the requested item:
`;

export const POST = async ({ request }) => {
  try {
    const { fileData, fileName, mimeType, description } = await request.json();

    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not configured, skipping privacy check');
      return json({
        warnings: 'Privacy check disabled - API key not configured'
      });
    }

    // Prepare the request for Gemini API
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: PRIVACY_PROMPT + description
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: fileData
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      // Fail-safe: if API is down, allow upload but warn
      return json({
        warnings: `Privacy check service unavailable: ${response.status}`
      });
    }

    const result = await response.json();
    
    if (!result.candidates || result.candidates.length === 0) {
      console.warn('No candidates returned from Gemini API');
      return json({
        warnings: 'Unable to analyze file for privacy compliance'
      });
    }

    const text = result.candidates[0].content.parts[0].text;
    
    try {
      // Log for monitoring
      // console.log(`Privacy violations detected in ${fileName}:`, text);
      return json({
        warnings: text
      });
      
    } catch (parseError) {
     
      return json({
        warnings: 'AI analysis failed - manual review recommended'
      });
    }

  } catch (error) {
    console.error('Privacy check error:', error);
    
    // Fail-safe: allow upload but warn about privacy check failure
    return json({
      warnings: 'Privacy check failed - please manually verify no sensitive data is visible'
    });
  }
};
