import { useRef, useState } from "react";
import { CreditCard, DollarSign, Info, Building, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { executor } from "@/http/executer/index";
import { DENTIST_ENDPOINT } from "@/utils/ApiConstants";
import { ROUTES } from "@/routes";
import { useNavigate } from "react-router-dom";

interface BankAccountOnboardingProps {
  onComplete: (bankData: any) => void;
}

export function BankAccountOnboarding({ onComplete }: BankAccountOnboardingProps) {
  const bankAccountOnboardingRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bankAccountHolderName: '',
    bankRoutingNumber: '',
    bankAccountNumber: '',
    bankAccountType: '',
    bankName: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = () => {
    return formData.bankAccountHolderName.trim() &&
           formData.bankRoutingNumber.trim() &&
           formData.bankAccountNumber.trim() &&
           formData.bankAccountType &&
           formData.bankName.trim() &&
           formData.bankRoutingNumber.length === 9 &&
           formData.bankAccountNumber.length >= 4;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleRoutingNumberChange = (value: string) => {
    // Only allow numeric input and limit to 9 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 9);
    handleInputChange('bankRoutingNumber', numericValue);
  };

  const handleAccountNumberChange = (value: string) => {
    // Only allow numeric input and limit to reasonable length
    const numericValue = value.replace(/\D/g, '').slice(0, 17);
    handleInputChange('bankAccountNumber', numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bankAccountHolderName.trim()) {
      setError('Please enter the account holder name');
      return;
    }
    
    if (!formData.bankRoutingNumber.trim() || formData.bankRoutingNumber.length !== 9) {
      setError('Please enter a valid 9-digit routing number');
      return;
    }
    
    if (!formData.bankAccountNumber.trim() || formData.bankAccountNumber.length < 4) {
      setError('Please enter a valid account number');
      return;
    }
    
    if (!formData.bankAccountType) {
      setError('Please select an account type');
      return;
    }
    
    if (!formData.bankName.trim()) {
      setError('Please enter your bank name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // calling bank account onboarding API
      const url = DENTIST_ENDPOINT.BANK_ACCOUNT;
      const exe = executor("post", url);
      bankAccountOnboardingRef.current = exe;
      const response = await bankAccountOnboardingRef.current.execute(formData);
      console.log(response);
      console.log('Bank account data:', formData);
      const responseData = response.data;
      onComplete(responseData);
    } catch (err) {
      setError('Failed to save banking information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="text-center py-12 px-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#E5E3FB] rounded-2xl flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-[#433CE7]" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-3">
              Where should we send your payouts?
            </CardTitle>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Enter your bank details to receive payments for patient appointments.
            </p>
          </CardHeader>
          
          <CardContent className="px-8 pb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert className="border-destructive/20 bg-destructive/10">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

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

              {/* Account Holder Name */}
              <div className="space-y-3">
                <Label htmlFor="accountHolderName" className="text-foreground">
                  Account Holder Name *
                </Label>
                <div className="relative">
                  <Input
                    id="accountHolderName"
                    type="text"
                    value={formData.bankAccountHolderName}
                    onChange={(e) => handleInputChange('bankAccountHolderName', e.target.value)}
                    placeholder="Enter full name as it appears on your account"
                    className="h-14 bg-input-background border-border rounded-xl focus:border-[#433CE7] focus:ring-[#433CE7] focus:ring-1 transition-all"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Routing Number */}
              <div className="space-y-3">
                <Label htmlFor="routingNumber" className="text-foreground">
                  Routing Number *
                </Label>
                <div className="relative">
                  <Input
                    id="routingNumber"
                    type="text"
                    inputMode="numeric"
                    value={formData.bankRoutingNumber}
                    onChange={(e) => handleRoutingNumberChange(e.target.value)}
                    placeholder="9-digit routing number"
                    className="h-14 bg-input-background border-border rounded-xl focus:border-[#433CE7] focus:ring-[#433CE7] focus:ring-1 transition-all"
                    maxLength={9}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span>Usually found at the bottom left of your check</span>
                </div>
              </div>

              {/* Account Number */}
              <div className="space-y-3">
                <Label htmlFor="accountNumber" className="text-foreground">
                  Account Number *
                </Label>
                <div className="relative">
                  <Input
                    id="accountNumber"
                    type="text"
                    inputMode="numeric"
                    value={formData.bankAccountNumber}
                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                    placeholder="Enter your account number"
                    className="h-14 bg-input-background border-border rounded-xl focus:border-[#433CE7] focus:ring-[#433CE7] focus:ring-1 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span>Usually found at the bottom center of your check</span>
                </div>
              </div>

              {/* Account Type */}
              <div className="space-y-3">
                <Label className="text-foreground">
                  Account Type *
                </Label>
                <Select value={formData.bankAccountType} onValueChange={(value) => handleInputChange('bankAccountType', value)}>
                  <SelectTrigger className="h-14 bg-input-background border-border rounded-xl focus:border-[#433CE7] focus:ring-[#433CE7] focus:ring-1">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="checking" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#433CE7]" />
                        <span>Checking</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="savings" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#433CE7]" />
                        <span>Savings</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bank Name */}
              <div className="space-y-3">
                <Label htmlFor="bankName" className="text-foreground">
                  Bank Name *
                </Label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="bankName"
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="Enter your bank name"
                    className="pl-12 h-14 bg-input-background border-border rounded-xl focus:border-[#433CE7] focus:ring-[#433CE7] focus:ring-1 transition-all"
                    autoComplete="organization"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="w-full h-14 bg-[#433CE7] hover:bg-[#3730a3] text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving banking details...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>

              {/* Back Link */}
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-muted-foreground hover:text-[#433CE7] transition-colors underline"
                >
                  Go back
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}