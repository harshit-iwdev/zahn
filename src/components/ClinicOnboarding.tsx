import { useRef, useState } from "react";
import { Building2, MapPin, Stethoscope, ChevronDown, X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { USER_ENDPOINT } from "@/utils/ApiConstants";
import { executor } from "@/http/executer/index";

interface ClinicOnboardingProps {
  onComplete: () => void;
  onBack: () => void;
}

const DENTAL_SPECIALTIES = [
  "General Dentistry",
  "Orthodontics",
  "Oral Surgery",
  "Periodontics",
  "Endodontics",
  "Prosthodontics",
  "Pediatric Dentistry",
  "Oral Pathology",
  "Oral Radiology",
  "Cosmetic Dentistry",
  "Implant Dentistry",
  "Emergency Dentistry"
];

export function ClinicOnboarding({ onComplete, onBack }: ClinicOnboardingProps) {
  const clinicOnboardingRef = useRef(null);
  const [formData, setFormData] = useState({
    clinicName: '',
    clinicAddress: '',
    specialties: [] as string[]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isFormValid = () => {
    return formData.clinicName.trim() &&
           formData.clinicAddress.trim() &&
           formData.specialties.length > 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
    setError('');
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clinicName.trim()) {
      setError('Please enter your clinic name');
      return;
    }
    
    if (!formData.clinicAddress.trim()) {
      setError('Please enter your clinic address');
      return;
    }
    
    if (formData.specialties.length === 0) {
      setError('Please select at least one specialty');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // calling clinic onboarding API
      const url = USER_ENDPOINT.CLINIC;
      const exe = executor("post", url);
      clinicOnboardingRef.current = exe;
      const response = await clinicOnboardingRef.current.execute(formData);
      console.log(response);
      console.log('Clinic onboarding data:', formData);
      onComplete();
    } catch (err) {
      setError('Failed to save clinic information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="text-center py-12 px-8">
            <CardTitle className="text-3xl font-bold text-foreground mb-3">
              Where do you practice and specialize?
            </CardTitle>
            <p className="text-muted-foreground text-lg leading-relaxed">
              This helps patients find you based on your expertise.
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

              {/* Clinic Name Field */}
              <div className="space-y-3">
                <Label htmlFor="clinicName" className="text-foreground">
                  Clinic Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="clinicName"
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => handleInputChange('clinicName', e.target.value)}
                    placeholder="Enter your clinic or practice name"
                    className="pl-12 h-14 bg-input-background border-border rounded-xl focus:border-[#433CE7] focus:ring-[#433CE7] focus:ring-1 transition-all"
                    autoComplete="organization"
                  />
                </div>
              </div>

              {/* Clinic Address Field */}
              <div className="space-y-3">
                <Label htmlFor="clinicAddress" className="text-foreground">
                  Clinic Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="clinicAddress"
                    type="text"
                    value={formData.clinicAddress}
                    onChange={(e) => handleInputChange('clinicAddress', e.target.value)}
                    placeholder="Enter your clinic address"
                    className="pl-12 h-14 bg-input-background border-border rounded-xl focus:border-[#433CE7] focus:ring-[#433CE7] focus:ring-1 transition-all"
                    autoComplete="street-address"
                  />
                </div>
              </div>

              {/* Specialty Multi-Select Field */}
              <div className="space-y-3">
                <Label className="text-foreground">
                  Specialty
                </Label>
                
                {/* Selected Specialties */}
                {formData.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.specialties.map(specialty => (
                      <div
                        key={specialty}
                        className="bg-[#E5E3FB] text-[#433CE7] px-3 py-1 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <span>{specialty}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecialty(specialty)}
                          className="hover:bg-[#433CE7] hover:text-white rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dropdown */}
                <div className="relative">
                  <div className="relative">
                    <Stethoscope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full pl-12 pr-12 h-14 bg-input-background border border-border rounded-xl text-left flex items-center justify-between hover:border-[#433CE7] focus:border-[#433CE7] focus:ring-[#433CE7] focus:ring-1 transition-all"
                    >
                      <span className={formData.specialties.length === 0 ? "text-muted-foreground" : "text-foreground"}>
                        {formData.specialties.length === 0 
                          ? "Select your specialties" 
                          : `${formData.specialties.length} specialt${formData.specialties.length === 1 ? 'y' : 'ies'} selected`
                        }
                      </span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                      {DENTAL_SPECIALTIES.map(specialty => (
                        <button
                          key={specialty}
                          type="button"
                          onClick={() => handleSpecialtyToggle(specialty)}
                          className="w-full px-4 py-3 text-left hover:bg-[#E5E3FB] transition-colors flex items-center justify-between group"
                        >
                          <span className="text-foreground">{specialty}</span>
                          {formData.specialties.includes(specialty) && (
                            <Check className="w-4 h-4 text-[#433CE7]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Next Button */}
              <Button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="w-full h-14 bg-[#433CE7] hover:bg-[#3730a3] text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting up your profile...
                  </>
                ) : (
                  'Next'
                )}
              </Button>

              {/* Back Link */}
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-muted-foreground hover:text-[#433CE7] transition-colors underline"
                >
                  Go back
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}