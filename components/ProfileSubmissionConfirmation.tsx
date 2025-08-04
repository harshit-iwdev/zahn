import { CheckCircle, Mail, FileCheck, Home, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

interface ProfileSubmissionConfirmationProps {
  onBackToHome: () => void;
  onLogOut: () => void;
  userEmail?: string;
}

export function ProfileSubmissionConfirmation({ 
  onBackToHome, 
  onLogOut, 
  userEmail = "your.email@example.com" 
}: ProfileSubmissionConfirmationProps) {

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="text-center py-16 px-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-[#E5E3FB] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-[#433CE7]" />
                </div>
                {/* Subtle pulse animation */}
                <div className="absolute inset-0 w-20 h-20 bg-[#433CE7] rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>

            {/* Main Message */}
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Thank you for submitting your profile!
            </h1>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Our team is currently reviewing your information. Once verified, you'll receive a confirmation email and can begin using ZaaN.
            </p>

            {/* Visual Elements - Review Process */}
            <div className="bg-[#E5E3FB] rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#433CE7] rounded-full flex items-center justify-center">
                    <FileCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Profile Under Review</span>
                </div>
                
                <div className="flex-1 h-px bg-[#433CE7]/30"></div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">Email Confirmation</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  We'll send updates to <span className="font-medium text-foreground">{userEmail}</span>
                </p>
              </div>
            </div>

            {/* What to Expect */}
            <div className="text-left space-y-3 mb-8">
              <h3 className="font-medium text-foreground text-center mb-4">What happens next?</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E5E3FB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#433CE7] font-medium text-xs">1</span>
                  </div>
                  <p className="text-muted-foreground">
                    Our verification team reviews your credentials (typically 24-48 hours)
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E5E3FB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#433CE7] font-medium text-xs">2</span>
                  </div>
                  <p className="text-muted-foreground">
                    You'll receive an email confirmation once approved
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E5E3FB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#433CE7] font-medium text-xs">3</span>
                  </div>
                  <p className="text-muted-foreground">
                    Your profile goes live and you can start using ZaaN
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-12">
            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={onBackToHome}
                className="w-full h-12 bg-[#433CE7] hover:bg-[#3730a3] text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
              
              <Button
                onClick={onLogOut}
                variant="outline"
                className="w-full h-12 border-border hover:bg-muted rounded-xl transition-all duration-200"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Questions about verification?{" "}
                <a 
                  href="mailto:support@zaan.com" 
                  className="text-[#433CE7] hover:underline font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}