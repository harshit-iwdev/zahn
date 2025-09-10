import { useEffect, useState } from "react";
import { DollarSign, Download, Calendar, User, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { DENTIST_ENDPOINT } from "@/utils/ApiConstants";
import { executor } from "@/http/executer";
import { formatDate } from "@/utils/formatDateTime";

export function EarningsSummary() {
  const [start_date, setStartDate] = useState<string>('');
  const [end_date, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [summaryRecords, setSummaryRecords] = useState<any[]>([]);
  const [totalSummaryRecords, setTotalSummaryRecords] = useState<number>(0);
  const [appointmentCount, setAppointmentCount] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [processingAmount, setProcessingAmount] = useState<number>(0);
  const pageSize = 10;

  useEffect(() => {
    fetchEarningSummary();
  }, []);

  useEffect(() => {
    fetchEarningSummary();
  }, [start_date, end_date, currentPage]);

  const fetchEarningSummary = async () => {
    try {
      const url = DENTIST_ENDPOINT.GET_EARNING_SUMMARY;
      const exe = executor("post", url);
      const body = {
        "page_number": currentPage,
        "page_size": pageSize
      }
      if (start_date && end_date) {
        body["start_date"] = start_date;
        body["end_date"] = end_date;
      }
      const axiosResponse = await exe.execute(body);
      const apiBody = axiosResponse?.data;
      const summaryResponse = apiBody?.data ?? apiBody;
      console.log('Summary response:', summaryResponse);
      setSummaryRecords(summaryResponse.records);
      setTotalSummaryRecords(summaryResponse.total_records);
      setAppointmentCount(summaryResponse.appointments_count);
      setTotalEarnings(summaryResponse.total_earnings);
      setProcessingAmount(summaryResponse.earn_processing);
    } catch (error) {
      console.error('Error fetching earnings summary:', error);
    }
  }

  const handleExportCSV = () => {
    const csvData = summaryRecords.map(apt => ({
      'Date': apt.created_at,
      'Patient Name': apt.patient.full_name,
      'Fee': `$${apt.treatment_charges.toFixed(2)}`,
      'Payout Status': apt.payment_status.charAt(0).toUpperCase() + apt.payment_status.slice(1)
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
                  <p className="text-3xl font-bold text-gray-900">{appointmentCount}</p>
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
                          value={start_date}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-40 text-sm border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">To</span>
                      <div className="relative">
                        <Input
                          type="date"
                          value={end_date}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-40 text-sm border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                    <span onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setCurrentPage(1);
                      }} className="text-sm font-medium text-gray-700 cursor-pointer">Clear Date</span>
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
              {summaryRecords.map((summary, index) => (
                <TableRow 
                  key={summary.id} 
                  className="transition-colors duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm">{formatDate(summary.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm">{summary.patient.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="font-semibold text-gray-900 text-sm">
                      ${summary.treatment_charges.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    {getStatusBadge(summary.payment_status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Empty State */}
        {summaryRecords.length === 0 && (
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