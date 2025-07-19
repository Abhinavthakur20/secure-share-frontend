import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Download as DownloadIcon, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { downloadAPI } from '@/lib/api';
import { toast } from 'react-toastify';

interface FileInfo {
  filename: string;
  size: number;
  uploadDate: string;
  expiryDate: string;
  uploaderEmail: string;
  isExpired: boolean;
}

const Download = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [otp, setOtp] = useState('');
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFileInfo();
  }, [uuid]);

  useEffect(() => {
    const updateTimeRemaining = () => {
      if (fileInfo && !fileInfo.isExpired) {
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
          setFileInfo(prev => prev ? { ...prev, isExpired: true } : null);
        }
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [fileInfo]);

  const fetchFileInfo = async () => {
    if (!uuid) return;

    try {
      const response = await downloadAPI.getFileInfo(uuid);
      setFileInfo(response.data);
      setError('');
    } catch (error: any) {
      console.error('Error fetching file info:', error);
      if (error.response?.status === 404) {
        setError('File not found or link has expired');
      } else if (error.response?.status === 410) {
        setError('This download link has already been used');
      } else {
        setError('Unable to load file information');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    if (!uuid) return;

    setVerifying(true);

    try {
      // First verify the OTP
      await downloadAPI.verifyOTP(uuid, otp);
      
      setDownloading(true);
      
      // If verification successful, download the file
      const response = await downloadAPI.downloadFile(uuid, otp);
      
      // Create download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileInfo?.filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('File downloaded successfully!');
      
      // Update file info to show it's been downloaded
      setFileInfo(prev => prev ? { ...prev, isExpired: true } : null);
      setError('File has been downloaded successfully. This link is no longer valid.');
      
    } catch (error: any) {
      console.error('Download error:', error);
      if (error.response?.status === 400) {
        toast.error('Invalid OTP. Please check your email and try again.');
      } else if (error.response?.status === 410) {
        toast.error('This download link has expired or already been used.');
        setError('This download link has expired or already been used.');
      } else {
        toast.error('Download failed. Please try again.');
      }
    } finally {
      setVerifying(false);
      setDownloading(false);
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
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <Card className="max-w-md gradient-card shadow-glow">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-destructive mb-2">Download Unavailable</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!fileInfo) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <Card className="max-w-md gradient-card shadow-glow">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-destructive mb-2">File Not Found</h2>
            <p className="text-muted-foreground">
              The requested file could not be found or the link has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <Card className="gradient-card shadow-glow border-border/50">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Secure File Download</CardTitle>
            <CardDescription>
              Enter the OTP sent to your email to download the file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Information */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">File Name</Label>
                <p className="font-medium">{fileInfo.filename}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Size</Label>
                  <p className="text-sm">{formatFileSize(fileInfo.size)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Uploaded</Label>
                  <p className="text-sm">{formatDate(fileInfo.uploadDate)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">From</Label>
                <p className="text-sm">{fileInfo.uploaderEmail}</p>
              </div>
            </div>

            {/* Expiry Information */}
            {!fileInfo.isExpired ? (
              <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="font-medium text-warning">Time Remaining</span>
                </div>
                <p className="text-lg font-bold text-warning">{timeRemaining}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Expires: {formatDate(fileInfo.expiryDate)}
                </p>
              </div>
            ) : (
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">Link Expired</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This download link has expired or already been used.
                </p>
              </div>
            )}

            {/* OTP Form */}
            {!fileInfo.isExpired && (
              <form onSubmit={handleVerifyAndDownload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Check your email for the one-time password
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={verifying || downloading || !otp.trim()}
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Downloading...
                    </>
                  ) : verifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Verifying OTP...
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Verify & Download
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Security Notice */}
            <div className="bg-accent/20 p-3 rounded-lg border border-accent/30">
              <h4 className="font-medium text-accent-foreground mb-2 text-sm">🔐 Security Notice</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• This file is encrypted and can only be downloaded once</li>
                <li>• The download link will expire after use</li>
                <li>• Your download is secure and private</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Download;