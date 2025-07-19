import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, MapPin, Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { auditAPI } from '@/lib/api';
import { toast } from 'react-toastify';

interface AuditLog {
  id: string;
  filename: string;
  action: 'upload' | 'download' | 'expired' | 'deleted';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  recipientEmail: string;
  fileSize: number;
  downloadCount: number;
  location?: string;
}

const Audit = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    // Filter logs based on search term
    const filtered = logs.filter(log => 
      log.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [logs, searchTerm]);

  const fetchAuditLogs = async () => {
    try {
      const response = await auditAPI.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      // For demo purposes, we'll use mock data
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          filename: 'confidential-report.pdf',
          action: 'download',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          recipientEmail: 'john.doe@example.com',
          fileSize: 2048576,
          downloadCount: 1,
          location: 'New York, NY'
        },
        {
          id: '2',
          filename: 'budget-2024.xlsx',
          action: 'upload',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.50',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          recipientEmail: 'finance@company.com',
          fileSize: 1536000,
          downloadCount: 0,
          location: 'San Francisco, CA'
        },
        {
          id: '3',
          filename: 'presentation.pptx',
          action: 'expired',
          timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.75',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          recipientEmail: 'team@company.com',
          fileSize: 4096000,
          downloadCount: 0,
          location: 'London, UK'
        },
        {
          id: '4',
          filename: 'contract.docx',
          action: 'download',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '203.0.113.42',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
          recipientEmail: 'legal@partner.com',
          fileSize: 512000,
          downloadCount: 1,
          location: 'Toronto, ON'
        },
        {
          id: '5',
          filename: 'images.zip',
          action: 'upload',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.25',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          recipientEmail: 'design@agency.com',
          fileSize: 8192000,
          downloadCount: 0,
          location: 'Berlin, Germany'
        }
      ];
      setLogs(mockLogs);
      toast.info('Showing demo audit logs');
    } finally {
      setLoading(false);
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

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'upload':
        return <Badge variant="default" className="bg-primary text-primary-foreground">Upload</Badge>;
      case 'download':
        return <Badge variant="default" className="bg-success text-success-foreground">Download</Badge>;
      case 'expired':
        return <Badge variant="default" className="bg-warning text-warning-foreground">Expired</Badge>;
      case 'deleted':
        return <Badge variant="destructive">Deleted</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'upload':
        return <FileText className="h-4 w-4" />;
      case 'download':
        return <Download className="h-4 w-4" />;
      case 'expired':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              Audit Logs
            </h1>
            <p className="text-muted-foreground">
              Track all file activities and download history
            </p>
          </div>
          
          {/* Search */}
          <div className="w-full md:w-80">
            <Input
              placeholder="Search by filename, email, IP, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">{logs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Download className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                  <p className="text-2xl font-bold">
                    {logs.filter(log => log.action === 'download').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <p className="text-2xl font-bold">
                    {logs.filter(log => log.action === 'expired').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Mail className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">
                    {logs.filter(log => log.action === 'upload' && log.downloadCount === 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs Table */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Activity Log ({filteredLogs.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {searchTerm ? 'No matching logs found' : 'No audit logs yet'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm 
                    ? 'Try adjusting your search criteria' 
                    : 'File activities will appear here once you start uploading files'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Action</th>
                      <th className="text-left py-3 px-4 font-medium">File</th>
                      <th className="text-left py-3 px-4 font-medium">Recipient</th>
                      <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium">IP Address</th>
                      <th className="text-left py-3 px-4 font-medium">Location</th>
                      <th className="text-left py-3 px-4 font-medium">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            {getActionBadge(log.action)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{log.filename}</p>
                            {log.downloadCount > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Downloaded {log.downloadCount} time{log.downloadCount > 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {log.recipientEmail}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-muted-foreground">
                          {log.ipAddress}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {log.location || 'Unknown'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatFileSize(log.fileSize)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Audit;