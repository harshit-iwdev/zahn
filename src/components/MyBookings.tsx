import { useEffect, useState } from "react";
import { Search, User as UserIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BookingCard } from "./BookingCard";
import { DateRangePicker } from "./DateRangePicker";
import { CalendarDays } from "lucide-react";
import { executor } from "@/http/executer";
import { DENTIST_ENDPOINT } from "@/utils/ApiConstants";

// Custom debounce hook with better error handling
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function MyBookings() {
  // Debounced search term
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 500)
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [start_date, setStartDate] = useState<string>();
  const [end_date, setEndDate] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [totalUpcomingBookings, setTotalUpcomingBookings] = useState<number>(0);
  const [totalCompletedBookings, setTotalCompletedBookings] = useState<number>(0);
  const pageSize = 10;

  useEffect(() => {
    fetchBookingsByParameters();
  }, []);

  useEffect(() => {
    fetchBookingsByParameters();
  }, [start_date, end_date, selectedPatient, activeTab, debouncedSearchTerm]);

  const fetchBookingsByParameters = async () => {
    try {
      const url = DENTIST_ENDPOINT.GET_BOOKINGS_BY_PARAMETERS;
      const exe = executor("post", url);
      const body = {
        "page_number": currentPage,
        "page_size": pageSize,
        "appointment_status": activeTab
      }
      if (start_date && end_date) {
        body["start_date"] = start_date;
        body["end_date"] = end_date;
      }
      if (selectedPatient && selectedPatient !== 'all') {
        body["patient_name"] = selectedPatient;
      } else if (debouncedSearchTerm && debouncedSearchTerm !== '') {
        body["patient_name"] = debouncedSearchTerm;
      }
      const axiosResponse = await exe.execute(body);
      const apiBody = axiosResponse?.data;
      const bookingsResponse = apiBody?.data ?? apiBody;
      console.log('Bookings response:', bookingsResponse);
      if (activeTab === 'upcoming') {
        setUpcomingBookings(bookingsResponse.records);
      } else {
        setCompletedBookings(bookingsResponse.records);
      }
      setTotalUpcomingBookings(bookingsResponse.totalUpcomingCount);
      setTotalCompletedBookings(bookingsResponse.totalCompletedCount);
    } catch (error) {
      console.error('Error fetching bookings by parameters:', error);
    }
  }

  const handleBookingStatus = async (id: string, status: string) => {
    console.log('Marking booking as done:', id, status);
    // Handle marking booking as done
    try {
      // call api to confirm appointment
      const url = DENTIST_ENDPOINT.CONFIRM_APPOINTMENT;
      const payload = {
        appointmentId: id,
        appointmentStatus: status
      }
      const exe = executor("put", url);
      const axiosResponse = await exe.execute(payload);
      const apiBody = axiosResponse?.data;
      const appointmentData = apiBody?.data ?? apiBody;
      if (axiosResponse.status >= 200 && axiosResponse.status < 300 && appointmentData) {
        fetchBookingsByParameters();
      } else {
        console.log('Failed to change appointment status. Please try again.');
      }
    } catch (error) {
      console.error('Error marking booking as done:', error);
    }
  };

  const handleDateRangeChange = (from: Date | undefined, to: Date | undefined) => {
    let newStartDate = new Date(from).toLocaleDateString().split('/').reverse().join('-');
    let newEndDate = new Date(to).toLocaleDateString().split('/').reverse().join('-');

    newStartDate = newStartDate.split('/').reverse().join('-');
    newEndDate = newEndDate.split('/').reverse().join('-');

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setCurrentPage(1);
  };

  const uniquePatients = upcomingBookings.length > 0 ? [...new Set(upcomingBookings.map(b => b.patient_data.patient_name))] : completedBookings.length > 0 ? [...new Set(completedBookings.map(b => b.patient_data.patient_name))] : [];

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
              Upcoming ({totalUpcomingBookings})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-[#433CE7] data-[state=active]:text-white"
            >
              Completed ({totalCompletedBookings})
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
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => (
                  <BookingCard
                    key={booking.appointment_id}
                    booking={booking}
                    handleBookingStatus={handleBookingStatus}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No upcoming bookings found</h3>
                  <p className="text-gray-600">
                    {searchQuery || selectedPatient !== 'all' || start_date || end_date
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
              {completedBookings.length > 0 ? (
                completedBookings.map(booking => (
                  <BookingCard
                    key={booking.appointment_id}
                    booking={booking}
                    handleBookingStatus={handleBookingStatus}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No completed bookings found</h3>
                  <p className="text-gray-600">
                    {searchQuery || selectedPatient !== 'all' || start_date || end_date
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
