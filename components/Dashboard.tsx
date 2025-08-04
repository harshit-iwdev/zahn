import { useState } from "react";
import { Calendar, Clock, User, AlertCircle, Crown, Upload, Calculator, CheckCircle, AlertTriangle, CreditCard, Bell, Settings, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { AppointmentDetails } from "./AppointmentDetails";

interface DashboardProps {
  onShowPlanUpgrade?: () => void;
  onNavigateToCalendar?: () => void;
  currentSubscription?: {
    tier: string;
    planName: string;
    monthlyPrice: number;
  };
}

// Mock data - would come from API in real app
const MOCK_DATA = {
  user: {
    name: "Dr. Smith"
  },
  todayAppointments: [
    {
      id: 1,
      patientName: "Sarah Johnson",
      time: "9:00 AM",
      status: "confirmed",
      type: "Cleaning & Checkup",
      date: "Tuesday, August 12, 2025",
      email: "sarah.johnson@email.com",
      phone: "+1 234 567 8900",
      issueReported: "Annual checkup and blood pressure monitoring",
      painLevel: "7/10",
      uploadedPhoto: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop",
      notes: "Pain started 3 days ago, worsens while eating."
    },
    {
      id: 2,
      patientName: "Michael Chen",
      time: "11:30 AM", 
      status: "pending",
      type: "Root Canal",
      date: "Tuesday, August 12, 2025",
      email: "michael.chen@email.com",
      phone: "+1 234 567 8901",
      issueReported: "Severe tooth pain requiring root canal treatment",
      painLevel: "9/10",
      notes: "Tooth pain has been persistent for over a week."
    },
    {
      id: 3,
      patientName: "Emma Davis",
      time: "2:00 PM",
      status: "confirmed",
      type: "Filling",
      date: "Tuesday, August 12, 2025",
      email: "emma.davis@email.com",
      phone: "+1 234 567 8902",
      issueReported: "Cavity needs filling on upper left molar",
      painLevel: "4/10",
      notes: "Minor sensitivity when eating sweets."
    }
  ],
  completedAppointments: [
    {
      id: 4,
      patientName: "John Miller",
      time: "8:00 AM",
      status: "completed",
      type: "Emergency Visit",
      date: "Tuesday, August 12, 2025",
      email: "john.miller@email.com",
      phone: "+1 234 567 8903",
      issueReported: "Emergency dental pain",
      painLevel: "8/10",
      notes: "Sudden onset of severe pain during the night."
    }
  ],
  availability: {
    isEnabled: true,
    weeklyHours: 14,
    minimumRequired: 12
  },
  billing: {
    technologyFeeRate: 0.0425
  }
};

export function Dashboard({ onShowPlanUpgrade, onNavigateToCalendar, currentSubscription }: DashboardProps) {
  const [availabilityEnabled, setAvailabilityEnabled] = useState(MOCK_DATA.availability.isEnabled);
  const [billingAmount, setBillingAmount] = useState('');
  const [billingFile, setBillingFile] = useState<File | null>(null);
  const [isSubmittingBilling, setIsSubmittingBilling] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof MOCK_DATA.todayAppointments[0] | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  const data = MOCK_DATA;
  
  // Use current subscription data or fallback to mock data
  const subscription = currentSubscription || {
    tier: "tier1",
    planName: "Tier 1",
    monthlyPrice: 199
  };
  
  const isTier1 = subscription.tier === "tier1";
  const technologyFee = billingAmount ? parseFloat(billingAmount) * data.billing.technologyFeeRate : 0;
  const netAmount = billingAmount ? parseFloat(billingAmount) - technologyFee : 0;

  const handleBillingSubmit = async () => {
    if (!billingAmount) return;
    setIsSubmittingBilling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBillingAmount('');
      setBillingFile(null);
    } finally {
      setIsSubmittingBilling(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setBillingFile(file);
  };

  const handleUpgradeClick = () => {
    if (onShowPlanUpgrade) {
      onShowPlanUpgrade();
    }
  };

  const handleManageScheduleClick = () => {
    if (onNavigateToCalendar) {
      onNavigateToCalendar();
    }
  };

  const handleViewAppointmentDetails = (appointment: typeof MOCK_DATA.todayAppointments[0]) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleCloseAppointmentDetails = () => {
    setShowAppointmentDetails(false);
    setSelectedAppointment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "completed": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-foreground mb-2">
            Hello {data.user.name}
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your practice today.
          </p>
        </div>

        {/* Status Alert */}
        <Alert className="mb-6 border-[#433CE7]/20 bg-[#E5E3FB]/30">
          <Bell className="w-5 h-5 text-[#433CE7]" />
          <AlertDescription className="text-[#433CE7] font-medium">
            You have {data.todayAppointments.length} appointments today
          </AlertDescription>
        </Alert>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Calendar Availability Toggle */}
          <Card className="xl:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#433CE7]" />
                Calendar Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#E5E3FB]/20 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Accept New Bookings</p>
                  <p className="text-sm text-muted-foreground">
                    {availabilityEnabled ? "Patients can book appointments" : "Booking is paused"}
                  </p>
                </div>
                <Switch
                  checked={availabilityEnabled}
                  onCheckedChange={setAvailabilityEnabled}
                  className="data-[state=checked]:bg-[#433CE7]"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekly Hours:</span>
                  <span className="font-medium text-foreground">{data.availability.weeklyHours}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={data.availability.weeklyHours >= data.availability.minimumRequired 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                  }>
                    {data.availability.weeklyHours >= data.availability.minimumRequired ? "Compliant" : "Below Minimum"}
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={handleManageScheduleClick}
                variant="outline" 
                className="w-full border-[#433CE7]/20 text-[#433CE7] hover:bg-[#E5E3FB]/30"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="xl:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#433CE7]" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#E5E3FB] rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-[#433CE7]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">{appointment.time}</span>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAppointmentDetails(appointment)}
                        className="border-[#433CE7]/20 text-[#433CE7] hover:bg-[#E5E3FB]/30"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                
                {data.todayAppointments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completed Appointments Preview */}
          {data.completedAppointments.length > 0 && (
            <Card className="xl:col-span-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.completedAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-700">{appointment.time}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAppointmentDetails(appointment)}
                          className="p-1 h-auto text-green-700 hover:bg-green-100"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subscription Section */}
          <Card className="xl:col-span-1">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#433CE7]" />
                  Subscription
                </CardTitle>
                <Badge className={isTier1 
                  ? "bg-[#E5E3FB] text-[#433CE7] hover:bg-[#E5E3FB]" 
                  : "bg-[#433CE7] text-white hover:bg-[#433CE7]"
                }>
                  {subscription.planName}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-[#E5E3FB]/20 rounded-lg">
                <p className="text-2xl font-bold text-[#433CE7]">
                  ${subscription.monthlyPrice}
                </p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleUpgradeClick}
                  className="w-full bg-[#433CE7] hover:bg-[#3730a3] text-white"
                  size="sm"
                >
                  {isTier1 ? "Upgrade Plan" : "Manage Plan"}
                </Button>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground underline">
                    Billing History
                  </Button>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Stripe</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Submission Card */}
          <Card className="xl:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#433CE7]" />
                Billing Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="billing-amount" className="text-sm font-medium text-foreground">
                    Gross Monthly Billing
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="billing-amount"
                      type="number"
                      placeholder="0.00"
                      value={billingAmount}
                      onChange={(e) => setBillingAmount(e.target.value)}
                      className="pl-8 bg-input-background border-border"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Supporting Documents (Optional)
                  </Label>
                  <div className="mt-1">
                    <input
                      type="file"
                      accept=".pdf,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="billing-file"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('billing-file')?.click()}
                      className="w-full justify-center gap-2 border-dashed"
                      size="sm"
                    >
                      <Upload className="w-4 h-4" />
                      {billingFile ? billingFile.name : "Upload PDF/Excel"}
                    </Button>
                  </div>
                </div>

                {billingAmount && parseFloat(billingAmount) > 0 && (
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross:</span>
                      <span className="font-medium">${parseFloat(billingAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fee (4.25%):</span>
                      <span className="text-red-600">-${technologyFee.toFixed(2)}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between">
                      <span className="font-medium">Net:</span>
                      <span className="font-bold text-[#433CE7]">${netAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleBillingSubmit}
                  disabled={!billingAmount || parseFloat(billingAmount) <= 0 || isSubmittingBilling}
                  className="w-full bg-[#433CE7] hover:bg-[#3730a3] text-white"
                  size="sm"
                >
                  {isSubmittingBilling ? "Submitting..." : "Submit Billing"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Availability Monitor */}
          <Card className="xl:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#433CE7]" />
                Availability Monitor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-[#E5E3FB]/20 rounded-lg">
                <p className="text-2xl font-bold text-[#433CE7]">
                  {data.availability.weeklyHours}
                </p>
                <p className="text-sm text-muted-foreground">hours this week</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Minimum Required:</span>
                  <span className="font-medium text-foreground">{data.availability.minimumRequired}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={data.availability.weeklyHours >= data.availability.minimumRequired 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                  }>
                    {data.availability.weeklyHours >= data.availability.minimumRequired ? "Compliant" : "Action Needed"}
                  </Badge>
                </div>
              </div>

              {data.availability.weeklyHours < data.availability.minimumRequired && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-sm">
                    Add {data.availability.minimumRequired - data.availability.weeklyHours} more hours to maintain visibility.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleManageScheduleClick}
                variant="outline" 
                className="w-full border-[#433CE7]/20 text-[#433CE7] hover:bg-[#E5E3FB]/30"
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Manage Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Appointment Details Modal */}
        {selectedAppointment && (
          <AppointmentDetails
            isOpen={showAppointmentDetails}
            onClose={handleCloseAppointmentDetails}
            appointment={selectedAppointment}
          />
        )}
      </div>
    </div>
  );
}