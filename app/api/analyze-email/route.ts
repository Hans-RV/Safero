import { NextRequest, NextResponse } from 'next/server';

interface AnalysisRequest {
  senderEmail: string;
  senderName: string;
  subject: string;
  body: string;
  links: string[];
}

interface AnalysisResult {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  score: number;
  threats: string[];
  recommendations: string[];
  senderVerified: boolean;
  linksSafe: boolean;
  contentAnalysis: string;
}

// Heuristic analysis fallback when API is not available
function performHeuristicAnalysis(request: AnalysisRequest): AnalysisResult {
  const threats: string[] = [];
  let riskScore = 0;

  // Check sender reputation
  const suspiciousSenders = ['noreply', 'donotreply', 'notification', 'alert'];
  const senderNameLower = request.senderName.toLowerCase();
  const suspiciousSender = suspiciousSenders.some(s => senderNameLower.includes(s));
  const senderVerified = request.senderEmail.includes('@') && request.senderEmail.split('@')[1].length > 2;

  if (!senderVerified || suspiciousSender) {
    threats.push('Sender identity unverified or suspicious');
    riskScore += 25;
  }

  // Check subject line for phishing indicators
  const phishingKeywords = ['verify', 'confirm', 'urgent', 'action required', 'click here', 'update account', 'verify identity', 'suspicious activity'];
  const subjectLower = request.subject.toLowerCase();
  const hasPhishingKeywords = phishingKeywords.some(keyword => subjectLower.includes(keyword));

  if (hasPhishingKeywords) {
    threats.push('Subject line contains phishing indicators');
    riskScore += 20;
  }

  // Check email body for phishing indicators
  const bodyLower = request.body.toLowerCase();
  const urgencyWords = ['urgent', 'immediately', 'right now', 'asap', 'within 24 hours'];
  const hasUrgency = urgencyWords.some(word => bodyLower.includes(word));

  if (hasUrgency) {
    threats.push('Email uses urgency tactics');
    riskScore += 15;
  }

  // Check for suspicious links
  let linksSafe = true;
  const suspiciousDomains = ['bit.ly', 'tinyurl', 'short.link'];
  request.links.forEach(link => {
    if (suspiciousDomains.some(domain => link.includes(domain))) {
      threats.push(`Suspicious URL shortener detected: ${link}`);
      linksSafe = false;
      riskScore += 15;
    }
  });

  // Check for credential harvesting language
  const harvestingPhrases = ['enter your password', 'confirm your password', 'verify your account', 'update payment'];
  const hasHarvestingLanguage = harvestingPhrases.some(phrase => bodyLower.includes(phrase));

  if (hasHarvestingLanguage) {
    threats.push('Potential credential harvesting detected');
    riskScore += 30;
  }

  // Determine risk level
  let riskLevel: 'safe' | 'suspicious' | 'dangerous' = 'safe';
  if (riskScore >= 60) {
    riskLevel = 'dangerous';
  } else if (riskScore >= 30) {
    riskLevel = 'suspicious';
  }

  const recommendations: string[] = [];
  if (riskLevel === 'dangerous') {
    recommendations.push('Do not click any links or download attachments');
    recommendations.push('Verify sender identity through official channels');
    recommendations.push('Report as phishing');
  } else if (riskLevel === 'suspicious') {
    recommendations.push('Be cautious with links and attachments');
    recommendations.push('Verify sender before responding');
    recommendations.push('Contact sender through known channels if needed');
  } else {
    recommendations.push('Email appears legitimate');
    recommendations.push('Check attachment sources if any');
  }

  return {
    riskLevel,
    score: Math.min(100, riskScore),
    threats,
    recommendations,
    senderVerified,
    linksSafe,
    contentAnalysis: `Analyzed ${request.links.length} links and ${request.body.split(' ').length} words in email content.`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();

    // Validate input
    if (!body.senderEmail || !body.subject || !body.body) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Groq API key is available
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      console.log('[v0] Groq API key not found, using heuristic analysis');
      // Use heuristic analysis as fallback
      const result = performHeuristicAnalysis(body);
      return NextResponse.json(result);
    }

    // Use Groq API if available
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are an email security expert. Analyze emails for phishing threats and security risks. Respond with a JSON object containing: riskLevel (safe/suspicious/dangerous), score (0-100), threats (array of strings), recommendations (array of strings), senderVerified (boolean), linksSafe (boolean), contentAnalysis (string).',
            },
            {
              role: 'user',
              content: `Analyze this email for phishing and security threats:
                Sender: ${body.senderName} <${body.senderEmail}>
                Subject: ${body.subject}
                Body: ${body.body}
                Links: ${body.links.join(', ') || 'None'}
                
                Provide response as valid JSON only.`,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!groqResponse.ok) {
        console.log('[v0] Groq API error, falling back to heuristic analysis');
        const result = performHeuristicAnalysis(body);
        return NextResponse.json(result);
      }

      const groqData = await groqResponse.json();
      const responseText = groqData.choices[0].message.content;

      // Parse the JSON response from Groq
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        const result = performHeuristicAnalysis(body);
        return NextResponse.json(result);
      }

      const analysis = JSON.parse(jsonMatch[0]);

      return NextResponse.json({
        riskLevel: analysis.riskLevel || 'suspicious',
        score: analysis.score || 50,
        threats: analysis.threats || [],
        recommendations: analysis.recommendations || [],
        senderVerified: analysis.senderVerified ?? false,
        linksSafe: analysis.linksSafe ?? false,
        contentAnalysis: analysis.contentAnalysis || '',
      } as AnalysisResult);
    } catch (groqError) {
      console.log('[v0] Groq API call failed, using heuristic analysis');
      const result = performHeuristicAnalysis(body);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Error analyzing email:', error);
    return NextResponse.json(
      { error: 'Failed to analyze email' },
      { status: 500 }
    );
  }
}
