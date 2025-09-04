import { useEffect, useState } from "react";
import { User, Settings, Camera, Shield, Bell, Globe, LogOut, Trash2, Eye, EyeOff, AlertTriangle, Upload, FileText, CreditCard, Lock, Info, Building, DollarSign, Crown, Scroll, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { executor } from "@/http/executer";
import { DENTIST_ENDPOINT } from "@/utils/ApiConstants";
import { decryptAesGcmBase64, generateHashValue } from "@/http/encryption";

interface ProfileSettingsProps {
  onShowPlanUpgrade?: () => void;
  onLogout?: () => void;
  currentSubscription?: {
    tier: string;
    planName: string;
    monthlyPrice: number;
    features: string[];
  };
}

export function ProfileSettings({ onShowPlanUpgrade, onLogout, currentSubscription }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>({});
  const [userClinicData, setUserClinicData] = useState<any>({});
  const [bankAccountData, setBankAccountData] = useState<any>({});

  // Legal & Policies state
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // // Profile form state
  const [profileData, setProfileData] = useState<any>({});

  const [bankAccountError, setBankAccountError] = useState('');
  const [profileError, setProfileError] = useState('');

  // Settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    appointmentReminders: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false
  });

  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    timezone: 'America/New_York'
  });

  const specialties = [
    'General Dentistry',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Periodontics',
    'Endodontics',
    'Oral Surgery',
    'Pediatric Dentistry',
    'Prosthodontics'
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const url = DENTIST_ENDPOINT.GET_DENTIST_PROFILE;
      const exe = executor("get", url);
      const axiosResponse = await exe.execute();
      const apiBody = axiosResponse?.data;
      const profileResponse = apiBody?.data ?? apiBody;
      if (axiosResponse.status >= 200 && axiosResponse.status < 300 && profileResponse) {
        setProfileData(profileResponse.user);
        setBankAccountDataFxn(profileResponse.bankAccountDetails);
        setSubscriptionData(profileResponse.userSubscriptions);
        setUserClinicData(profileResponse.clinic);
      } else {
        console.log('Failed to fetch user profile. Please try again.');
      }
    } catch (error) {
      console.error('Failed to fetch user profile. Please try again.');
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-[#4CAF50] text-white hover:bg-[#4CAF50] font-medium">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-[#FFC107] text-white hover:bg-[#FFC107] font-medium">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-[#f44336] text-white hover:bg-[#f44336] font-medium">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-400 text-white hover:bg-gray-400 font-medium">Unknown</Badge>;
    }
  };

  const handleProfileSave = async () => {
    console.log('Saving profile data:', profileData);
    // Implement save logic here

    // Validate bank account data
    if (!profileData.user_full_name.trim()) {
      setProfileError('Please enter the full name');
      return;
    }

    if (!userClinicData.clinic_name.trim()) {
      setProfileError('Please enter the clinic name');
      return;
    }

    if (!profileData.user_phone_number.trim()) {
      setProfileError('Please enter the phone number');
      return;
    }

    if (!profileData.user_profile_photo.trim()) {
      setProfileError('Please enter the profile photo');
      return;
    }

    if (!userClinicData.clinic_address.trim()) {
      setProfileError('Please enter the clinic address');
      return;
    }

    if (!userClinicData.doctor_specialities || userClinicData.doctor_specialities.length === 0) {
      setProfileError('Please select the doctor specialities');
      return;
    }

    setProfileError('');
    console.log('Saving profile data:', profileData);
    // Implement save logic here

    const url = DENTIST_ENDPOINT.UPDATE_USER_PROFILE;
    const exe = executor("put", url);
    const body = {
      user_full_name: profileData.user_full_name,
      user_email: profileData.user_email,
      user_phone_number: profileData.user_phone_number,
      user_profile_photo: profileData.user_profile_photo,
      clinic_name: userClinicData.clinic_name,
      clinic_address: userClinicData.clinic_address,
      doctor_specialities: userClinicData.doctor_specialities,
    }
    const axiosResponse = await exe.execute(body);
    if (axiosResponse.status >= 200 && axiosResponse.status < 300 && axiosResponse.data.success) {
      setProfileData(axiosResponse.data.data.user);
      setUserClinicData(axiosResponse.data.data.clinic);
    } else {
      console.error('Failed to save bank account data');
    }
  };

  const handleBankAccountSave = async () => {
    // Validate bank account data
    if (!bankAccountData.bank_account_holder_name.trim()) {
      setBankAccountError('Please enter the account holder name');
      return;
    }

    if (!bankAccountData.bank_account_routing_number.trim() || bankAccountData.bank_account_routing_number.length !== 9) {
      setBankAccountError('Please enter a valid 9-digit routing number');
      return;
    }

    if (!bankAccountData.bank_account_number.trim() || bankAccountData.bank_account_number.length < 4) {
      setBankAccountError('Please enter a valid account number');
      return;
    }

    if (!bankAccountData.bank_account_type) {
      setBankAccountError('Please select an account type');
      return;
    }

    if (!bankAccountData.bank_name.trim()) {
      setBankAccountError('Please enter your bank name');
      return;
    }

    setBankAccountError('');
    console.log('Saving bank account data:', bankAccountData);
    // Implement save logic here

    const url = DENTIST_ENDPOINT.UPDATE_BANK_DATA;
    const exe = executor("put", url);
    const body = {
      bank_account_holder_name: await generateHashValue(bankAccountData.bank_account_holder_name),
      bank_account_number: await generateHashValue(bankAccountData.bank_account_number),
      bank_account_routing_number: await generateHashValue(bankAccountData.bank_account_routing_number),
      bank_account_type: bankAccountData.bank_account_type,
      bank_name: await generateHashValue(bankAccountData.bank_name),
    }

    console.log('Saving bank account data:', body);
    const axiosResponse = await exe.execute(body);
    if (axiosResponse.status >= 200 && axiosResponse.status < 300 && axiosResponse.data.success) {
      setBankAccountDataFxn(axiosResponse.data.data);
    } else {
      console.error('Failed to save bank account data');
    }
  };

  const handlePasswordChange = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    const url = DENTIST_ENDPOINT.CHANGE_PASSWORD;
    const exe = executor("post", url);
    const body = {
      oldPassword: securitySettings.oldPassword,
      newPassword: securitySettings.newPassword,
      confirmPassword: securitySettings.confirmPassword
    }
    const axiosResponse = await exe.execute(body);
    if (axiosResponse.status >= 200 && axiosResponse.status < 300 && axiosResponse.success) {
      setSecuritySettings({
        ...securitySettings,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      console.log('Failed to change password');
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    if (onLogout) {
      onLogout(); // Log out after deleting account
    }
  };

  const handleSpecialitySelect = (specialty: string) => {
    if (userClinicData.doctor_specialities.includes(specialty)) {
      setUserClinicData({
        ...userClinicData,
        doctor_specialities: userClinicData.doctor_specialities.filter(s => s !== specialty)
      });
    } else {
      setUserClinicData({
        ...userClinicData,
        doctor_specialities: [...userClinicData.doctor_specialities, specialty]
      });
    }
  };

  const handleBankAccountDataChange = (field: string, value: string) => {
    setBankAccountData(prev => ({ ...prev, [field]: value }));
    setBankAccountError('');
  };

  const setBankAccountDataFxn = async (dt: any) => {
    const bank_account_holder_name = await decryptAesGcmBase64(dt.bank_account_holder_name);
    const bank_account_number = await decryptAesGcmBase64(dt.bank_account_number);
    const bank_account_routing_number = await decryptAesGcmBase64(dt.bank_account_routing_number);
    const bank_name = await decryptAesGcmBase64(dt.bank_name);

    setBankAccountData({
      ...dt,
      bank_account_holder_name,
      bank_account_number,
      bank_account_routing_number,
      bank_name,
    });
  }

  const maskedString = (str: string) => {
    if (!str || str.length === 0) return '';
    if (str.length <= 4) return str;
    const visible = str.slice(-4);
    const masked = '*'.repeat(str.length - 4);
    return masked + visible;
  }

  // const handleRoutingNumberChange = (value: string) => {
  //   // Only allow numeric input and limit to 9 digits
  //   const numericValue = value.replace(/\D/g, '').slice(0, 9);
  //   handleBankAccountDataChange('routingNumber', numericValue);
  // };

  // const handleAccountNumberChange = (value: string) => {
  //   // Only allow numeric input and limit to reasonable length
  //   const numericValue = value.replace(/\D/g, '').slice(0, 17);
  //   handleBankAccountDataChange('accountNumber', numericValue);
  // };

  const handleManagePlan = () => {
    if (onShowPlanUpgrade) {
      onShowPlanUpgrade();
    }
  };

  const handleViewBillingHistory = () => {
    console.log('Viewing billing history');
    // Implement billing history logic here
  };

  // Terms & Conditions content
  const termsAndConditionsText = `
TERMS & CONDITIONS

By using ZaaN's dental platform, you agree to the following terms:

SERVICE AGREEMENT
• ZaaN provides a technology platform connecting dental professionals with patients
• You maintain complete clinical autonomy and professional liability
• All medical decisions remain solely with you as the licensed provider

PROFESSIONAL CONDUCT
• Maintain current professional licenses and certifications
• Provide quality care in accordance with professional standards  
• Respect patient privacy and confidentiality at all times

PLATFORM USAGE
• Use the platform only for legitimate dental practice purposes
• Do not share login credentials or allow unauthorized access
• Report any technical issues or security concerns immediately

PAYMENT & BILLING
• Monthly subscription fees are charged automatically
• 4.25% transaction fee applies to all completed appointments
• Payments are processed securely through our payment partners

DATA PRIVACY
• Patient information is handled according to HIPAA requirements
• ZaaN uses industry-standard encryption and security measures
• You are responsible for securing your device and login credentials

TERMINATION
• Either party may terminate this agreement with 30 days notice
• Upon termination, access to the platform will be revoked
• You retain ownership of your patient relationships

These terms are effective as of your account creation and are subject to periodic updates.
`;

  // Privacy Policy content
  const privacyPolicyText = `
PRIVACY POLICY

ZaaN is committed to protecting your privacy and the confidentiality of patient information.

INFORMATION WE COLLECT
• Professional credentials and license information
• Contact details and clinic information  
• Appointment scheduling and patient interaction data
• Payment and billing information

HOW WE USE INFORMATION
• Facilitate appointment bookings and patient connections
• Process payments and manage subscriptions
• Provide customer support and platform improvements
• Ensure compliance with healthcare regulations

DATA PROTECTION
• All data is encrypted both in transit and at rest
• Access is restricted to authorized personnel only
• Regular security audits and vulnerability assessments
• HIPAA-compliant data handling procedures

INFORMATION SHARING
• Patient data is never shared without explicit consent
• Aggregated, anonymized data may be used for platform analytics
• Legal authorities may access data when required by law
• Third-party service providers operate under strict confidentiality agreements

YOUR RIGHTS
• Access and review your personal information
• Request corrections to inaccurate data
• Delete your account and associated data (subject to legal requirements)
• Receive notification of any data breaches

DATA RETENTION
• Professional information is retained while your account is active
• Patient interaction data is retained for 7 years for compliance
• Marketing communications can be unsubscribed from at any time
• Deleted accounts are purged within 90 days

CONTACT US
For privacy-related questions or concerns, contact our Privacy Officer at privacy@zaan.com

This Privacy Policy is effective as of January 1, 2025 and may be updated periodically.
`;

  return (
    <div className="flex-1 p-8 bg-[#FFFFFF] overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">Profile & Settings</h1>
          <p className="text-gray-600 text-lg">Manage your profile information and account settings</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger 
              value="profile" 
              className="flex items-center space-x-2 py-3 px-6 rounded-lg data-[state=active]:bg-[#433CE7] data-[state=active]:text-white transition-all"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">My Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center space-x-2 py-3 px-6 rounded-lg data-[state=active]:bg-[#433CE7] data-[state=active]:text-white transition-all"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </TabsTrigger>
          </TabsList> */}
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-2 py-3 px-6 rounded-lg data-[state=active]:bg-[#433CE7] data-[state=active]:text-white transition-all"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">My Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center space-x-2 py-3 px-6 rounded-lg data-[state=active]:bg-[#433CE7] data-[state=active]:text-white transition-all"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-[#E5E3FB] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#433CE7]" />
                  </div>
                  <span className="text-[#1E1E1E]">My Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Profile Photo Section */}
                <div className="flex items-center space-x-8">
                  <div className="relative">
                    <div className="w-32 h-32 bg-[#E5E3FB] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <User className="w-16 h-16 text-[#433CE7]" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#433CE7] rounded-full flex items-center justify-center text-white hover:bg-[#3730a3] transition-colors shadow-lg">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">Profile Photo</h3>
                    <p className="text-gray-600 mb-4">Upload a professional photo to personalize your profile</p>
                    <Button variant="outline" size="lg" className="flex items-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Change Photo</span>
                    </Button>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#1E1E1E] mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="fullName" className="text-[#1E1E1E] font-medium">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.user_full_name}
                        onChange={(e) => setProfileData({ ...profileData, user_full_name: e.target.value })}
                        placeholder="Enter your full name"
                        className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="clinicName" className="text-[#1E1E1E] font-medium">Clinic Name</Label>
                      <Input
                        id="clinicName"
                        value={userClinicData.clinic_name}
                        onChange={(e) => setUserClinicData({ ...userClinicData, clinic_name: e.target.value })}
                        placeholder="Enter clinic name"
                        className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-[#1E1E1E] font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.user_phone_number}
                        onChange={(e) => setProfileData({ ...profileData, user_phone_number: e.target.value })}
                        placeholder="Enter phone number"
                        className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-[#1E1E1E] font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.user_email}
                        onChange={(e) => setProfileData({ ...profileData, user_email: e.target.value })}
                        placeholder="Enter email address"
                        className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Specialty Section */}
                <div className="space-y-4">
                  <Label className="text-[#1E1E1E] font-medium">Specialty</Label>
                  <Select>
                    <SelectTrigger className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg">
                      <SelectValue placeholder="Select your specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem
                          key={specialty}
                          value={specialty}
                          onClick={() => handleSpecialitySelect(specialty)}
                        >
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {userClinicData?.doctor_specialities?.map((spec, index) => (
                      <Badge
                        key={index}
                        className="bg-[#E5E3FB] text-[#433CE7] hover:bg-[#E5E3FB] px-4 py-2 rounded-full font-medium"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <Label htmlFor="address" className="text-[#1E1E1E] font-medium">Clinic Address</Label>
                  <Textarea
                    id="address"
                    value={userClinicData.clinic_address}
                    onChange={(e) => setUserClinicData({ ...userClinicData, clinic_address: e.target.value })}
                    placeholder="Enter clinic address"
                    rows={4}
                    className="bg-[#f3f3f5] border-gray-200 rounded-lg"
                  />
                </div>

                {/* License Upload */}
                <div className="space-y-4">
                  <Label className="text-[#1E1E1E] font-medium">Medical License</Label>
                  {profileData.licenseUploaded ? (
                    <div className="border-2 border-[#4CAF50] border-dashed rounded-xl p-8 text-center bg-green-50">
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <p className="font-medium text-[#1E1E1E]">Medical License Uploaded</p>
                        <p className="text-sm text-gray-600">license_document.pdf</p>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2">
                          <Upload className="w-4 h-4" />
                          <span>Replace File</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#433CE7] transition-colors bg-gray-50">
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-[#E5E3FB] rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-[#433CE7]" />
                        </div>
                        <p className="font-medium text-[#1E1E1E]">Upload License Document</p>
                        <p className="text-sm text-gray-600">PDF or Image files up to 10MB</p>
                        <Button className="bg-[#433CE7] hover:bg-[#3730a3] text-white">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Approval Status */}
                <div className="space-y-3">
                  <Label className="text-[#1E1E1E] font-medium">Admin Approval Status</Label>
                  <div className="flex items-center space-x-4">
                    {getApprovalStatusBadge(profileData.user_onboarding_completed ? 'approved' : 'pending')}
                    {profileData.user_onboarding_completed === false && (
                      <p className="text-gray-600">Your profile is under review by our admin team</p>
                    )}
                    {profileData.user_onboarding_completed === true && (
                      <p className="text-green-600">Your profile has been approved and is active</p>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-8 border-t border-gray-200">
                  <Button
                    onClick={handleProfileSave}
                    className="bg-[#433CE7] hover:bg-[#3730a3] text-white px-12 py-3 text-lg rounded-lg"
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Your Plan - Subscription Card */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-[#E5E3FB] rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-[#433CE7]" />
                  </div>
                  <span className="text-[#1E1E1E]">Your Plan</span>
                  <Badge className={subscriptionData?.subscriptionPlan?.plan_name === 'Tier 1'
                    ? "bg-[#E5E3FB] text-[#433CE7] hover:bg-[#E5E3FB] ml-4"
                    : "bg-[#433CE7] text-white hover:bg-[#433CE7] ml-4"
                  }>
                    {subscriptionData?.subscriptionPlan?.plan_name}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Overview */}
                <div className="flex items-center justify-between p-6 bg-[#E5E3FB]/20 rounded-xl border border-[#433CE7]/10">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#1E1E1E]">
                      {subscriptionData?.subscriptionPlan?.plan_name} – {subscriptionData?.subscriptionPlan?.plan_name === 'Tier 1' ? 'Basic Plan' : 'Premium Plan'}
                    </h3>
                    <p className="text-3xl font-bold text-[#433CE7]">
                      ${subscriptionData?.subscriptionPlan?.plan_price}
                      <span className="text-base font-medium text-gray-600 ml-1">/month</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Powered by</span>
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        Stripe
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Next billing: {subscriptionData?.user_subscription_expiration_date} </p>
                  </div>
                </div>

                {/* Key Benefits Preview */}
                <div className="space-y-4">
                  <h4 className="font-medium text-[#1E1E1E] text-lg">Key Benefits</h4>
                  <div className="space-y-3">
                    {subscriptionData?.subscriptionPlan?.plan_features?.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-[#433CE7] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {subscriptionData?.subscriptionPlan?.plan_name === 'Tier 1' && (
                      <Button
                        onClick={onShowPlanUpgrade}
                        className="bg-[#433CE7] hover:bg-[#3730a3] text-white px-8 py-3 rounded-lg font-medium"
                      >Upgrade Plan</Button>
                    )}

                    <Button
                      variant="link"
                      onClick={handleViewBillingHistory}
                      className="text-[#433CE7] hover:text-[#3730a3] underline font-medium"
                    >
                      View Billing History
                    </Button>
                  </div>

                  {subscriptionData?.subscriptionPlan?.plan_name === 'Tier 1' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Want more features?</p>
                      <p className="text-sm font-medium text-[#433CE7]">
                        Upgrade to Tier 2 for unlimited bookings
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bank Account Details Section */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-[#E5E3FB] rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#433CE7]" />
                  </div>
                  <span className="text-[#1E1E1E]">Bank Account Details</span>
                  <div className="flex items-center space-x-2 ml-4">
                    <Lock className="w-4 h-4 text-[#433CE7]" />
                    <span className="text-sm text-[#433CE7] font-medium">Secure</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Security Notice */}
                <div className="bg-[#E5E3FB] border border-[#433CE7]/20 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#433CE7] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Secure & Encrypted</p>
                    <p className="text-xs text-muted-foreground">
                      Your banking information is encrypted and securely stored. We never store your full account details.
                    </p>
                  </div>
                </div>

                {/* Error Alert */}
                {bankAccountError && (
                  <Alert className="border-destructive/20 bg-destructive/10">
                    <AlertDescription className="text-destructive">
                      {bankAccountError}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account Holder Name */}
                  <div className="space-y-3">
                    <Label htmlFor="accountHolderName" className="text-[#1E1E1E] font-medium">Account Holder Name</Label>
                    <Input
                      id="accountHolderName"
                      value={bankAccountData?.bank_account_holder_name}
                      onChange={(e) => handleBankAccountDataChange('bank_account_holder_name', e.target.value)}
                      placeholder="Enter full name as it appears on account"
                      className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg"
                    />
                  </div>

                  {/* Bank Name */}
                  <div className="space-y-3">
                    <Label htmlFor="bankName" className="text-[#1E1E1E] font-medium">Bank Name</Label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="bankName"
                        value={bankAccountData.bank_name}
                        onChange={(e) => handleBankAccountDataChange('bank_name', e.target.value)}
                        placeholder="Enter your bank name"
                        className="pl-12 h-12 bg-[#f3f3f5] border-gray-200 rounded-lg"
                        maxLength={20}
                      />
                    </div>
                  </div>

                  {/* Routing Number */}
                  <div className="space-y-3">
                    <Label htmlFor="routingNumber" className="text-[#1E1E1E] font-medium">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      type="text"
                      inputMode="numeric"
                      value={maskedString(bankAccountData.bank_account_routing_number)}
                      onChange={(e) => handleBankAccountDataChange('bank_account_routing_number', e.target.value)}
                      placeholder="9-digit routing number"
                      className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg"
                      maxLength={9}
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Info className="w-4 h-4" />
                      <span>Usually found at the bottom left of your check</span>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="space-y-3">
                    <Label htmlFor="accountNumber" className="text-[#1E1E1E] font-medium">Account Number</Label>
                    <Input
                      id="accountNumber"
                      type="text"
                      inputMode="numeric"
                      value={maskedString(bankAccountData.bank_account_number)}
                      onChange={(e) => handleBankAccountDataChange('bank_account_number', e.target.value)}
                      placeholder="Account number"
                      className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg"
                    />
                  </div>

                  {/* Account Type */}
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[#1E1E1E] font-medium">Account Type</Label>
                    <Select
                      value={bankAccountData.bank_account_type}
                      onValueChange={(value) => handleBankAccountDataChange('bank_account_type', value)}
                    >
                      <SelectTrigger className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-8 border-t border-gray-200">
                  <Button
                    onClick={handleBankAccountSave}
                    className="bg-[#433CE7] hover:bg-[#3730a3] text-white px-12 py-3 text-lg rounded-lg"
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log Out</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out? You'll need to sign in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-[#433CE7] hover:bg-[#3730a3] text-white"
                    >
                      Log Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 px-8 py-3 border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span>Delete Account</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all associated data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            {/* Notification Settings */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-[#E5E3FB] rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#433CE7]" />
                  </div>
                  <span className="text-[#1E1E1E]">Notification Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <Label className="text-[#1E1E1E] font-medium">Email Alerts</Label>
                      <p className="text-sm text-gray-600">Receive notifications about new bookings and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <Label className="text-[#1E1E1E] font-medium">SMS Alerts</Label>
                      <p className="text-sm text-gray-600">Get text messages for urgent notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <Label className="text-[#1E1E1E] font-medium">Appointment Reminders</Label>
                      <p className="text-sm text-gray-600">Automated reminders for upcoming appointments</p>
                    </div>
                    <Switch
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, appointmentReminders: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-[#E5E3FB] rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#433CE7]" />
                  </div>
                  <span className="text-[#1E1E1E]">Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Change */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#1E1E1E]">Change Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="oldPassword" className="text-[#1E1E1E] font-medium">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="oldPassword"
                          type={showOldPassword ? "text" : "password"}
                          value={securitySettings.oldPassword}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, oldPassword: e.target.value })}
                          placeholder="Enter current password"
                          className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="newPassword" className="text-[#1E1E1E] font-medium">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={securitySettings.newPassword}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                          placeholder="Enter new password"
                          className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="confirmPassword" className="text-[#1E1E1E] font-medium">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={securitySettings.confirmPassword}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePasswordChange}
                    className="bg-[#433CE7] hover:bg-[#3730a3] text-white px-8 py-3 rounded-lg"
                  >
                    Update Password
                  </Button>
                </div>

                <Separator />

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <Label className="text-[#1E1E1E] font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* General Settings */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-[#E5E3FB] rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#433CE7]" />
                  </div>
                  <span className="text-[#1E1E1E]">General Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[#1E1E1E] font-medium">Language</Label>
                    <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}>
                      <SelectTrigger className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#1E1E1E] font-medium">Time Zone</Label>
                    <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}>
                      <SelectTrigger className="h-12 bg-[#f3f3f5] border-gray-200 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal & Policies Section */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-[#1E1E1E] mb-4">Legal & Policies</CardTitle>
                <p className="text-gray-600">Review important legal documents and privacy information</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Terms & Conditions Card */}
                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#E5E3FB] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Scroll className="w-6 h-6 text-[#433CE7]" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-[#1E1E1E] mb-2">Terms & Conditions</CardTitle>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Review the terms of service that govern your use of the ZaaN platform, including professional conduct, platform usage guidelines, and service agreements.
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Collapsible open={showTermsAndConditions} onOpenChange={setShowTermsAndConditions}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-between p-3 h-12 text-[#433CE7] border-[#433CE7]/20 hover:bg-[#E5E3FB]/30"
                        >
                          <span className="font-medium">
                            {showTermsAndConditions ? 'Hide Full Text' : 'Show Full Text'}
                          </span>
                          {showTermsAndConditions ?
                            <ChevronUp className="w-4 h-4" /> :
                            <ChevronDown className="w-4 h-4" />
                          }
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-4">
                        <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
                            {termsAndConditionsText}
                          </pre>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>

                {/* Privacy Policy Card */}
                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#E5E3FB] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Lock className="w-6 h-6 text-[#433CE7]" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-[#1E1E1E] mb-2">Privacy Policy</CardTitle>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Learn how ZaaN protects your personal information and patient data, including our commitment to HIPAA compliance and data security measures.
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Collapsible open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-between p-3 h-12 text-[#433CE7] border-[#433CE7]/20 hover:bg-[#E5E3FB]/30"
                        >
                          <span className="font-medium">
                            {showPrivacyPolicy ? 'Hide Full Text' : 'Show Full Text'}
                          </span>
                          {showPrivacyPolicy ?
                            <ChevronUp className="w-4 h-4" /> :
                            <ChevronDown className="w-4 h-4" />
                          }
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-4">
                        <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
                            {privacyPolicyText}
                          </pre>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>

                {/* Trust & Safety Notice */}
                <div className="bg-[#E5E3FB]/30 border border-[#433CE7]/20 rounded-xl p-6 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#433CE7] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1E1E1E] mb-2">ZaaN's Legal Commitment</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        ZaaN is committed to maintaining the highest standards of user safety, data privacy, and regulatory compliance.
                        Our platform is designed with healthcare professionals in mind, ensuring that all legal and ethical standards
                        are met while providing you with the tools needed to grow your practice effectively.
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed mt-3">
                        For any legal questions or concerns, please contact our legal team at legal@zaan.com
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}