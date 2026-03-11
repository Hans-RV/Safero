import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    // Get authenticated user session
    const session = await auth();
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '20');

    // Initialize Gmail API client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch all emails (including Promotions, Social, Spam, etc.)
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxResults,
      includeSpamTrash: true, // Include spam and trash emails
      // No query filter - fetches from all categories and folders
    });

    const messages = response.data.messages || [];
    
    if (messages.length === 0) {
      return NextResponse.json({ emails: [] });
    }

    // Fetch detailed information for each email
    const emailPromises = messages.map(async (message) => {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'full',
      });

      // Extract email headers
      const headers = email.data.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

      const from = getHeader('From');
      const subject = getHeader('Subject');
      const date = getHeader('Date');

      // Extract email body
      let body = '';
      const parts = email.data.payload?.parts;
      
      if (parts) {
        const textPart = parts.find((part) => part.mimeType === 'text/plain');
        if (textPart && textPart.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      } else if (email.data.payload?.body?.data) {
        body = Buffer.from(email.data.payload.body.data, 'base64').toString('utf-8');
      }

      // Extract sender email and name
      const fromMatch = from.match(/(?:(.+?)\s*<)?([^<>]+@[^<>]+)>?$/);
      const senderName = fromMatch?.[1]?.trim().replace(/"/g, '') || '';
      const senderEmail = fromMatch?.[2]?.trim() || from;

      // Extract links from body
      const linkRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
      const links = body.match(linkRegex) || [];

      return {
        id: message.id,
        from,
        senderName,
        senderEmail,
        subject,
        date,
        snippet: email.data.snippet || '',
        body: body.substring(0, 5000), // Limit body size
        links: links.slice(0, 10), // Limit to first 10 links
      };
    });

    const emails = await Promise.all(emailPromises);

    return NextResponse.json({ emails });
  } catch (error: any) {
    console.error('Error fetching emails:', error);
    
    // Handle specific OAuth errors
    if (error.code === 401 || error.message?.includes('invalid_grant')) {
      return NextResponse.json(
        { error: 'Gmail access expired. Please sign in again.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch emails', details: error.message },
      { status: 500 }
    );
  }
}
