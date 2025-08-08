import { useState } from "react";
import { DollarSign, Download, Calendar, User, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";

export function EarningsSummary() {
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  // Mock data for completed appointments matching your specifications
  const completedAppointments = [
    {
      id: '1',
      date: 'Aug 12, 2025',
      patientName: 'Sarah Johnson',
      fee: 300.00,
      payoutStatus: 'paid'
    },
    {
      id: '2',
      date: 'Aug 11, 2025',
      patientName: 'Michael Chen',
      fee: 275.00,
      payoutStatus: 'processing'
    },
    {
      id: '3',
      date: 'Aug 10, 2025',
      patientName: 'Emily Davis',
      fee: 180.00,
      payoutStatus: 'paid'
    },
    {
      id: '4',
      date: 'Aug 9, 2025',
      patientName: 'John Rodriguez',
      fee: 220.00,
      payoutStatus: 'paid'
    },
    {
      id: '5',
      date: 'Aug 8, 2025',
      patientName: 'Lisa Wang',
      fee: 125.00,
      payoutStatus: 'processing'
    },
    {
      id: '6',
      date: 'Aug 7, 2025',
      patientName: 'David Thompson',
      fee: 195.00,
      payoutStatus: 'paid'
    },
    {
      id: '7',
      date: 'Aug 6, 2025',
      patientName: 'Amanda Brown',
      fee: 165.00,
      payoutStatus: 'processing'
    },
    {
      id: '8',
      date: 'Aug 5, 2025',
      patientName: 'Robert Wilson',
      fee: 155.00,
      payoutStatus: 'paid'
    }
  ];

  // Calculate metrics as specified
  const totalEarnings = 1100.00;
  const processingAmount = 510.00;
  const totalAppointments = 8;

  const handleExportCSV = () => {
    const csvData = completedAppointments.map(apt => ({
      'Date': apt.date,
      'Patient Name': apt.patientName,
      'Fee': `$${apt.fee.toFixed(2)}`,
      'Payout Status': apt.payoutStatus.charAt(0).toUpperCase() + apt.payoutStatus.slice(1)
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'earnings_summary.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-[#10B981] text-white hover:bg-[#10B981] px-3 py-1 rounded-full text-xs font-medium">
            Paid
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-[#F59E0B] text-white hover:bg-[#F59E0B] px-3 py-1 rounded-full text-xs font-medium">
            Processing
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-400 text-white hover:bg-gray-400 px-3 py-1 rounded-full text-xs font-medium">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="flex-1 p-8 bg-[#F9FAFB] overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Earnings Summary</h1>
          <p className="text-gray-600 text-lg">Track your completed appointments and payouts</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Earnings Card - Blue Theme */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Card - Orange Theme */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Processing</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${processingAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B] rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments Card - Green Theme */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">{totalAppointments}</p>
                </div>
                <div className="w-12 h-12 bg-[#10B981] rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">From</span>
                      <div className="relative">
                        <Input
                          type="date"
                          value={dateRange.from}
                          onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                          className="w-40 text-sm border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">To</span>
                      <div className="relative">
                        <Input
                          type="date"
                          value={dateRange.to}
                          onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                          className="w-40 text-sm border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleExportCSV}
                  className="bg-[#6246EA] hover:bg-[#5a40d9] text-white font-medium px-6 py-2 flex items-center shadow-sm transition-all duration-200 hover:shadow-md rounded-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completed Appointments Table */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Completed Appointments</h3>
            <p className="text-gray-600 mt-1 text-sm">Recent appointments with payout details</p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-medium text-gray-700 py-4 px-6 text-sm">Date</TableHead>
                <TableHead className="font-medium text-gray-700 py-4 px-6 text-sm">Patient Name</TableHead>
                <TableHead className="font-medium text-gray-700 py-4 px-6 text-sm">Fee</TableHead>
                <TableHead className="font-medium text-gray-700 py-4 px-6 text-sm">Payout Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedAppointments.map((appointment, index) => (
                <TableRow 
                  key={appointment.id} 
                  className="transition-colors duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm">{appointment.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm">{appointment.patientName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="font-semibold text-gray-900 text-sm">
                      ${appointment.fee.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    {getStatusBadge(appointment.payoutStatus)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Empty State */}
        {completedAppointments.length === 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm rounded-xl mt-8">
            <CardContent className="p-16 text-center">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">No completed appointments</h3>
              <p className="text-gray-600">Your earnings will appear here once you complete appointments.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}