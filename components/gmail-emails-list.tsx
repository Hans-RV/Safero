'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Mail, 
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Email {
  id: string;
  from: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  links: string[];
}

interface Analysis {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  threats: string[];
  recommendation: string;
  indicators?: {
    suspiciousSender?: boolean;
    suspiciousLinks?: boolean;
    urgencyLanguage?: boolean;
    requestsCredentials?: boolean;
    spoofedDomain?: boolean;
  };
}

interface AnalyzedEmail extends Email {
  analysis?: Analysis;
  analyzing?: boolean;
  error?: string;
}

export function GmailEmailsList() {
  const [emails, setEmails] = useState<AnalyzedEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [maxResults, setMaxResults] = useState(20);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/gmail/fetch-emails?maxResults=${maxResults}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch emails');
      }

      setEmails(data.emails.map((email: Email) => ({ ...email, analyzing: false })));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeEmail = async (email: AnalyzedEmail) => {
    try {
      // Update email status to analyzing
      setEmails(prev => prev.map(e => 
        e.id === email.id ? { ...e, analyzing: true, error: undefined } : e
      ));

      const response = await fetch('/api/gmail/analyze-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze email');
      }

      // Update email with analysis results
      setEmails(prev => prev.map(e => 
        e.id === email.id 
          ? { ...e, analysis: data.analysis, analyzing: false } 
          : e
      ));
    } catch (err: any) {
      setEmails(prev => prev.map(e => 
        e.id === email.id 
          ? { ...e, error: err.message, analyzing: false } 
          : e
      ));
    }
  };

  const analyzeAllEmails = async () => {
    for (const email of emails) {
      if (!email.analysis && !email.analyzing) {
        await analyzeEmail(email);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className="h-5 w-5" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5" />;
      case 'high':
        return <Shield className="h-5 w-5" />;
      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <span className="truncate">Gmail Security Scanner</span>
              </CardTitle>
              <CardDescription className="mt-2 text-xs sm:text-sm">
                Automatically fetch and analyze your Gmail emails for security threats
              </CardDescription>
            </div>
            <div className="flex gap-2 self-start sm:self-auto">
              <Button
                onClick={fetchEmails}
                disabled={loading}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">Refresh</span>
              </Button>
              <Button
                onClick={analyzeAllEmails}
                disabled={loading || emails.length === 0}
                size="sm"
                className="text-xs sm:text-sm"
              >
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span>Analyze All</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && emails.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="ml-3 text-sm sm:text-base text-muted-foreground mt-2">Fetching your emails...</span>
        </div>
      )}

      {/* Email List */}
      {emails.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          {emails.map((email) => (
            <Card key={email.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  {/* Email Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2">
                      {email.analysis && (
                        <div className={`p-1.5 sm:p-2 rounded-lg border ${getRiskColor(email.analysis.riskLevel)} flex-shrink-0`}>
                          {getRiskIcon(email.analysis.riskLevel)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <span className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {email.senderName || email.senderEmail}
                          </span>
                          {email.analysis && (
                            <Badge variant="outline" className={`${getRiskColor(email.analysis.riskLevel)} text-xs w-fit`}>
                              {email.analysis.riskLevel.toUpperCase()} - {email.analysis.overallScore}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {email.senderEmail}
                        </p>
                        <h3 className="font-medium text-sm sm:text-base text-foreground mt-1 sm:mt-2 line-clamp-1">
                          {email.subject}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                          {email.snippet}
                        </p>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === email.id && email.analysis && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                        {email.analysis.threats.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              Detected Threats:
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                              {email.analysis.threats.map((threat, i) => (
                                <li key={i} className="text-sm text-muted-foreground">{threat}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Recommendation:</h4>
                          <p className="text-sm text-muted-foreground">{email.analysis.recommendation}</p>
                        </div>

                        {email.links.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Links Found: {email.links.length}
                            </h4>
                            <div className="space-y-1">
                              {email.links.slice(0, 3).map((link, i) => (
                                <p key={i} className="text-xs text-muted-foreground truncate font-mono">
                                  {link}
                                </p>
                              ))}
                              {email.links.length > 3 && (
                                <p className="text-xs text-muted-foreground">
                                  and {email.links.length - 3} more...
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {!email.analysis && !email.analyzing && (
                      <Button
                        size="sm"
                        onClick={() => analyzeEmail(email)}
                        variant="outline"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Analyze
                      </Button>
                    )}
                    
                    {email.analyzing && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Spinner className="h-4 w-4" />
                        Analyzing...
                      </div>
                    )}

                    {email.analysis && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
                      >
                        {expandedId === email.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {email.error && (
                      <p className="text-xs text-destructive">{email.error}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && emails.length === 0 && !error && (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No emails found</h3>
            <p className="text-muted-foreground">
              Click refresh to fetch your latest Gmail emails
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
