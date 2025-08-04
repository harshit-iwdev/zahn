import { useState } from "react";
import { Upload, Camera, FileText, User, Building2, Stethoscope, Check, X, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

interface ProfileFinalizationProps {
  onComplete: () => void;
  onBack: () => void;
  profileData?: {
    fullName: string;
    email: string;
    clinicName: string;
    clinicAddress: string;
    specialties: string[];
  };
}

export function ProfileFinalization({ onComplete, onBack, profileData }: ProfileFinalizationProps) {
  const [files, setFiles] = useState({
    medicalLicense: null as File | null,
    profilePhoto: null as File | null
  });
  
  const [dragStates, setDragStates] = useState({
    medicalLicense: false,
    profilePhoto: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock profile data if not provided
  const mockProfileData = {
    fullName: "Dr. Sarah Johnson",
    email: "sarah.johnson@email.com",
    clinicName: "Bright Smile Dental Care",
    clinicAddress: "123 Main Street, City, State 12345",
    specialties: ["General Dentistry", "Cosmetic Dentistry"]
  };

  const currentProfileData = profileData || mockProfileData;

  const isFormValid = () => {
    return files.medicalLicense !== null;
  };

  const handleDragOver = (e: React.DragEvent, fileType: 'medicalLicense' | 'profilePhoto') => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [fileType]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, fileType: 'medicalLicense' | 'profilePhoto') => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [fileType]: false }));
  };

  const handleDrop = (e: React.DragEvent, fileType: 'medicalLicense' | 'profilePhoto') => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [fileType]: false }));
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      
      // Validate file type
      if (fileType === 'medicalLicense') {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          setError('Medical license must be a PDF, JPG, or PNG file');
          return;
        }
      } else if (fileType === 'profilePhoto') {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          setError('Profile photo must be a JPG or PNG file');
          return;
        }
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFiles(prev => ({ ...prev, [fileType]: file }));
      setError('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'medicalLicense' | 'profilePhoto') => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      
      // Same validation as drop
      if (fileType === 'medicalLicense') {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          setError('Medical license must be a PDF, JPG, or PNG file');
          return;
        }
      } else if (fileType === 'profilePhoto') {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          setError('Profile photo must be a JPG or PNG file');
          return;
        }
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFiles(prev => ({ ...prev, [fileType]: file }));
      setError('');
    }
  };

  const removeFile = (fileType: 'medicalLicense' | 'profilePhoto') => {
    setFiles(prev => ({ ...prev, [fileType]: null }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files.medicalLicense) {
      setError('Please upload your medical license for verification');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call for file upload and profile submission
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful submission
      console.log('Profile verification data:', {
        ...currentProfileData,
        medicalLicense: files.medicalLicense,
        profilePhoto: files.profilePhoto
      });
      
      onComplete();
    } catch (err) {
      setError('Failed to submit credentials for verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="text-center py-12 px-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#E5E3FB] rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#433CE7]" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-3">
              Verify your credentials
            </CardTitle>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To ensure trust and safety, we'll verify your license before making your profile public.
            </p>
          </CardHeader>
          
          <CardContent className="px-8 pb-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Alert */}
              {error && (
                <Alert className="border-destructive/20 bg-destructive/10">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Upload Medical License */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#433CE7]" />
                  <h3 className="text-lg font-medium text-foreground">Upload Medical License *</h3>
                </div>
                
                {!files.medicalLicense ? (
                  <div
                    onDragOver={(e) => handleDragOver(e, 'medicalLicense')}
                    onDragLeave={(e) => handleDragLeave(e, 'medicalLicense')}
                    onDrop={(e) => handleDrop(e, 'medicalLicense')}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:border-[#433CE7] hover:bg-[#E5E3FB]/50 ${
                      dragStates.medicalLicense ? 'border-[#433CE7] bg-[#E5E3FB]/50' : 'border-border'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e, 'medicalLicense')}
                      className="hidden"
                      id="medicalLicense"
                    />
                    <label htmlFor="medicalLicense" className="cursor-pointer">
                      <div className="w-16 h-16 bg-[#E5E3FB] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-[#433CE7]" />
                      </div>
                      <p className="text-foreground font-medium mb-2">
                        Drag & drop your medical license here
                      </p>
                      <p className="text-muted-foreground text-sm mb-4">
                        or click to browse files
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports PDF, JPG, PNG (max 10MB)
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="bg-[#E5E3FB] border border-[#433CE7]/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#433CE7] rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{files.medicalLicense.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(files.medicalLicense.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('medicalLicense')}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Profile Photo */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#433CE7]" />
                  <h3 className="text-lg font-medium text-foreground">Upload Profile Photo</h3>
                  <span className="text-sm text-muted-foreground">(Optional)</span>
                </div>
                
                {!files.profilePhoto ? (
                  <div
                    onDragOver={(e) => handleDragOver(e, 'profilePhoto')}
                    onDragLeave={(e) => handleDragLeave(e, 'profilePhoto')}
                    onDrop={(e) => handleDrop(e, 'profilePhoto')}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer hover:border-[#433CE7] hover:bg-[#E5E3FB]/50 ${
                      dragStates.profilePhoto ? 'border-[#433CE7] bg-[#E5E3FB]/50' : 'border-border'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e, 'profilePhoto')}
                      className="hidden"
                      id="profilePhoto"
                    />
                    <label htmlFor="profilePhoto" className="cursor-pointer">
                      <div className="w-12 h-12 bg-[#E5E3FB] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Camera className="w-6 h-6 text-[#433CE7]" />
                      </div>
                      <p className="text-foreground font-medium mb-1">
                        Upload your profile photo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG (max 10MB)
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="bg-[#E5E3FB] border border-[#433CE7]/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#433CE7] rounded-lg flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{files.profilePhoto.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(files.profilePhoto.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('profilePhoto')}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-[#433CE7]" />
                  Profile Summary
                </h3>
                
                <div className="bg-[#E5E3FB] rounded-xl p-6 space-y-4">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                      <p className="font-medium text-foreground">{currentProfileData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium text-foreground">{currentProfileData.email}</p>
                    </div>
                  </div>

                  {/* Clinic Information */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Clinic Name</p>
                    <p className="font-medium text-foreground">{currentProfileData.clinicName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Clinic Address</p>
                    <p className="font-medium text-foreground">{currentProfileData.clinicAddress}</p>
                  </div>

                  {/* Specialties */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {currentProfileData.specialties.map(specialty => (
                        <div
                          key={specialty}
                          className="bg-white text-[#433CE7] px-3 py-1 rounded-lg border border-[#433CE7]/20 text-sm font-medium"
                        >
                          {specialty}
                        </div>
                      ))}
                    </div>
                  </div>
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
                    Submitting for verification...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Submit Profile
                  </>
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
    </div>
  );
}