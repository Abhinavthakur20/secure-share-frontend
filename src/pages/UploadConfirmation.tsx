import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Copy, Clock, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';

interface FileInfo {
  id: string;
  filename: string;
  size: number;
  uploadDate: string;
  expiryDate: string;
  downloadLink: string;
  recipientEmail: string;
  status: string;
}

const UploadConfirmation = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    // In a real app, you would fetch file info from the API
    // For demo purposes, we'll simulate the data
    const mockFileInfo: FileInfo = {
      id: fileId || '1',
      filename: 'document.pdf',
      size: 2048576,
      uploadDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      downloadLink: `${window.location.origin}/download/abc123-def456-ghi789`,
      recipientEmail: 'recipient@example.com',
      status: 'pending'
    };

    setFileInfo(mockFileInfo);
    setLoading(false);
  }, [fileId]);

  useEffect(() => {
    const updateTimeRemaining = () => {
      if (fileInfo) {
        const now = new Date().getTime();
        const expiry = new Date(fileInfo.expiryDate).getTime();
        const difference = expiry - now;

        if (difference > 0) {
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining('Expired');
        }
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [fileInfo]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Download link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!fileInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-destructive mb-2">File Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested file could not be found.</p>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Upload Confirmation</h1>
        </div>

        {/* Success Message */}
        <Card className="gradient-card shadow-glow border-success/20">
          <CardContent className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-success/10">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-success mb-2">File Encrypted Successfully!</h2>
            <p className="text-muted-foreground">
              Your file has been encrypted and a secure download link has been generated.
              An OTP has been sent to the recipient's email.
            </p>
          </CardContent>
        </Card>

        {/* File Information */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle>File Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">File Name</label>
                  <p className="text-lg font-medium">{fileInfo.filename}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">File Size</label>
                  <p className="text-lg">{formatFileSize(fileInfo.size)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Recipient</label>
                  <p className="text-lg">{fileInfo.recipientEmail}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Upload Date</label>
                  <p className="text-lg">{formatDate(fileInfo.uploadDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expires At</label>
                  <p className="text-lg">{formatDate(fileInfo.expiryDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time Remaining</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <p className="text-lg font-medium text-warning">{timeRemaining}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant="secondary" className="text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Download
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Link */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Secure Download Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Download URL (Share this with the recipient)
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-background p-3 rounded border text-sm break-all">
                  {fileInfo.downloadLink}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(fileInfo.downloadLink)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-accent/20 p-4 rounded-lg border border-accent/30">
              <h4 className="font-medium text-accent-foreground mb-2">🔐 Security Notice</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• The recipient will need to enter the OTP sent to their email</li>
                <li>• This link can only be used once</li>
                <li>• The file will be automatically deleted after download or expiry</li>
                <li>• Download link expires in 24 hours</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={() => copyToClipboard(fileInfo.downloadLink)}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Download Link
              </Button>
              <Link to="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  Upload Another File
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadConfirmation;