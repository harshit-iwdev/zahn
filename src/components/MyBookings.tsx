import { useState } from "react";
import { Search, User as UserIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BookingCard } from "./BookingCard";
import { DateRangePicker } from "./DateRangePicker";
import { CalendarDays } from "lucide-react";

export function MyBookings() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  // Mock booking data
  const mockBookings = [
    {
      id: '1',
      patientName: 'John Doe',
      patientId: '#P00213',
      date: 'Tuesday, Aug 6, 2025',
      time: '3:00 PM',
      issueType: 'Toothache + sensitivity',
      notes: 'Pain started 3 days ago, worsens when eating cold foods',
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=face',
      status: 'upcoming' as const
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      patientId: '#P00214',
      date: 'Wednesday, Aug 7, 2025',
      time: '10:00 AM',
      issueType: 'Regular checkup',
      notes: 'Annual dental examination and cleaning',
      hasImage: false,
      status: 'upcoming' as const
    },
    {
      id: '3',
      patientName: 'Michael Chen',
      patientId: '#P00215',
      date: 'Thursday, Aug 8, 2025',
      time: '2:30 PM',
      issueType: 'Cavity filling',
      notes: 'Follow-up for cavity treatment on upper molar',
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face',
      status: 'upcoming' as const
    },
    {
      id: '4',
      patientName: 'Emily Davis',
      patientId: '#P00212',
      date: 'Monday, Aug 5, 2025',
      time: '4:00 PM',
      issueType: 'Root canal treatment',
      notes: 'Successfully completed root canal procedure',
      hasImage: false,
      status: 'completed' as const
    },
    {
      id: '5',
      patientName: 'Robert Wilson',
      patientId: '#P00211',
      date: 'Friday, Aug 2, 2025',
      time: '11:00 AM',
      issueType: 'Teeth cleaning',
      notes: 'Regular dental hygiene appointment',
      hasImage: false,
      status: 'completed' as const
    }
  ];

  const upcomingBookings = mockBookings.filter(booking => booking.status === 'upcoming');
  const completedBookings = mockBookings.filter(booking => booking.status === 'completed');

  const handleMarkDone = (id: string) => {
    console.log('Marking booking as done:', id);
    // Handle marking booking as done
  };

  const handleCancel = (id: string) => {
    console.log('Cancelling booking:', id);
    // Handle cancelling booking
  };

  const handleDateRangeChange = (from: Date | undefined, to: Date | undefined) => {
    setDateFrom(from);
    setDateTo(to);
    console.log('Date range changed:', from, to);
    // Handle date range filtering logic here
  };

  const filteredBookings = (bookings: typeof mockBookings) => {
    return bookings.filter(booking => {
      const matchesSearch = 
        booking.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.patientId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPatient = selectedPatient === 'all' || booking.patientName === selectedPatient;
      
      // Note: In a real app, you'd parse the booking.date and compare with dateFrom/dateTo
      // For now, we'll just return the search and patient filters
      return matchesSearch && matchesPatient;
    });
  };

  const uniquePatients = [...new Set(mockBookings.map(b => b.patientName))];

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your patient appointments and bookings</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger 
              value="upcoming"
              className="data-[state=active]:bg-[#433CE7] data-[state=active]:text-white"
            >
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-[#433CE7] data-[state=active]:text-white"
            >
              Completed ({completedBookings.length})
            </TabsTrigger>
          </TabsList>

          {/* Search & Filter Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search Bar */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search by Booking ID or Patient Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>

              {/* Filter by Patient */}
              <div className="lg:col-span-1">
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger className="h-10">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by Patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Patients</SelectItem>
                    {uniquePatients.map(patient => (
                      <SelectItem key={patient} value={patient}>
                        {patient}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Picker */}
              <div className="lg:col-span-1">
                <DateRangePicker 
                  onDateRangeChange={handleDateRangeChange}
                  placeholder={{
                    from: "Start date",
                    to: "End date"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Booking Lists */}
          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid gap-4">
              {filteredBookings(upcomingBookings).length > 0 ? (
                filteredBookings(upcomingBookings).map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onMarkDone={handleMarkDone}
                    onCancel={handleCancel}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No upcoming bookings found</h3>
                  <p className="text-gray-600">
                    {searchQuery || selectedPatient !== 'all' || dateFrom || dateTo
                      ? "Try adjusting your search or filter criteria" 
                      : "You don't have any upcoming appointments scheduled"
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {filteredBookings(completedBookings).length > 0 ? (
                filteredBookings(completedBookings).map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No completed bookings found</h3>
                  <p className="text-gray-600">
                    {searchQuery || selectedPatient !== 'all' || dateFrom || dateTo
                      ? "Try adjusting your search or filter criteria" 
                      : "You don't have any completed appointments yet"
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}