// src/routes/api/privacy-check/+server.js

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const GEMINI_API_KEY = env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const PRIVACY_PROMPT = `
You are a privacy compliance checker for Singapore's Personal Data Protection Act (PDPA).

Analyze the provided image/document and identify if it contains any of the following sensitive information that should be redacted:

1. Names of individuals (excluding business names)
2. NRIC/FIN numbers (format: SXXXXXXXA/TXXXXXXXB/etc)
3. Phone numbers (Singapore format: +65XXXXXXXX or 8/9XXXXXXX)
4. Email addresses
5. Home addresses (street addresses, postal codes)
6. Credit card numbers
7. Bank account numbers
8. Any other personally identifiable information

Respond in JSON format only:
{
  "isCompliant": boolean,
  "violations": [array of specific violations found],
  "warnings": [array of potential issues to review],
  "confidence": number between 0-1
}

If compliant, violations array should be empty.
If non-compliant, list specific violations found (e.g., "Phone number visible: 91234567").
`;

export const POST = async ({ request }) => {
  try {
    const { fileData, fileName, mimeType } = await request.json();

    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not configured, skipping privacy check');
      return json({
        isCompliant: true,
        violations: [],
        warnings: ['Privacy check disabled - API key not configured'],
        confidence: 0
      });
    }

    // Prepare the request for Gemini API
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: PRIVACY_PROMPT
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
        isCompliant: true,
        violations: [],
        warnings: [`Privacy check service unavailable: ${response.status}`],
        confidence: 0
      });
    }

    const result = await response.json();
    
    if (!result.candidates || result.candidates.length === 0) {
      console.warn('No candidates returned from Gemini API');
      return json({
        isCompliant: true,
        violations: [],
        warnings: ['Unable to analyze file for privacy compliance'],
        confidence: 0
      });
    }

    const text = result.candidates[0].content.parts[0].text;
    
    try {
      // Try to parse JSON response
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const analysisResult = JSON.parse(cleanText);
      
      // Validate the response structure
      if (typeof analysisResult.isCompliant !== 'boolean') {
        throw new Error('Invalid response format');
      }

      // Log for monitoring
      if (!analysisResult.isCompliant) {
        console.log(`Privacy violations detected in ${fileName}:`, analysisResult.violations);
      }

      return json(analysisResult);
      
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError, 'Raw text:', text);
      
      // Simple fallback analysis based on text content
      const violations = [];
      const warnings = [];
      
      // Basic pattern matching as fallback
      if (text.toLowerCase().includes('phone') || text.toLowerCase().includes('number')) {
        warnings.push('Possible phone number detected - please review');
      }
      if (text.toLowerCase().includes('name') || text.toLowerCase().includes('address')) {
        warnings.push('Possible personal information detected - please review');
      }
      
      return json({
        isCompliant: violations.length === 0,
        violations,
        warnings: [...warnings, 'AI analysis failed - manual review recommended'],
        confidence: 0.3
      });
    }

  } catch (error) {
    console.error('Privacy check error:', error);
    
    // Fail-safe: allow upload but warn about privacy check failure
    return json({
      isCompliant: true,
      violations: [],
      warnings: ['Privacy check failed - please manually verify no sensitive data is visible'],
      confidence: 0
    });
  }
};