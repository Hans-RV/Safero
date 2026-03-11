import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email data required' },
        { status: 400 }
      );
    }

    // Prepare email data for analysis
    const emailText = `
Analyze this email for security threats and phishing indicators:

FROM: ${email.senderName} <${email.senderEmail}>
SUBJECT: ${email.subject}
DATE: ${email.date}

BODY:
${email.body}

LINKS FOUND:
${email.links.join('\n')}

Please analyze this email and provide:
1. Overall security score (0-100)
2. Risk level (low/medium/high)
3. List of detected threats or suspicious indicators
4. Recommendation for the user

Format your response as JSON with this structure:
{
  "overallScore": <number 0-100>,
  "riskLevel": "<low|medium|high>",
  "threats": ["threat1", "threat2"],
  "recommendation": "detailed recommendation",
  "indicators": {
    "suspiciousSender": <boolean>,
    "suspiciousLinks": <boolean>,
    "urgencyLanguage": <boolean>,
    "requestsCredentials": <boolean>,
    "spoofedDomain": <boolean>
  }
}
`;

    // Call Groq LLM for analysis
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert email security analyst. Analyze emails for phishing, scams, and security threats. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: emailText,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    });

    const analysisText = completion.choices[0]?.message?.content || '{}';
    const analysis = JSON.parse(analysisText);

    return NextResponse.json({
      success: true,
      emailId: email.id,
      analysis: {
        overallScore: analysis.overallScore || 50,
        riskLevel: analysis.riskLevel || 'medium',
        threats: analysis.threats || [],
        recommendation: analysis.recommendation || 'Unable to analyze at this time.',
        indicators: analysis.indicators || {},
      },
    });
  } catch (error: any) {
    console.error('Error analyzing email:', error);
    
    // Check for Groq API errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service not configured. Please add GROQ_API_KEY to environment variables.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to analyze email', details: error.message },
      { status: 500 }
    );
  }
}
