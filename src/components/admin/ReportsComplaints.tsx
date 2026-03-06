import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, User, Building2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface Report {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export function ReportsComplaints() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/reports`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      const data = await response.json();
      if (response.ok) setReports(data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId: string, action: 'remove_property' | 'dismiss') => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-449053da/admin/reports/${reportId}/resolve`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ action, resolution }),
        }
      );

      if (response.ok) {
        toast.success(action === 'remove_property' ? 'Property removed' : 'Report dismissed');
        setSelectedReport(null);
        setResolution('');
        fetchReports();
      }
    } catch (error) {
      toast.error('Failed to resolve report');
    }
  };

  const pendingReports = reports.filter(r => r.status === 'pending');

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports & Complaints</h1>
        <p className="text-gray-600">Review reported listings</p>
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <AlertCircle className="size-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-red-900">{pendingReports.length} Reports Pending Review</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className={report.status === 'pending' ? 'border-red-200' : ''}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{report.propertyTitle}</h3>
                    <Badge variant={
                      report.status === 'pending' ? 'destructive' :
                      report.status === 'resolved' ? 'default' : 'secondary'
                    }>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="size-4" />
                      <span>Reported by: {report.reporterName}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Reason: {report.reason}</p>
                      <p className="mt-1">{report.description}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {report.status === 'pending' && (
                selectedReport === report.id ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Resolution notes..."
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleResolve(report.id, 'remove_property')}
                      >
                        Remove Property
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleResolve(report.id, 'dismiss')}
                      >
                        Dismiss Report
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedReport(null);
                          setResolution('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setSelectedReport(report.id)}>Take Action</Button>
                )
              )}
            </CardContent>
          </Card>
        ))}

        {reports.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="size-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No reports</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
