import { useRef, useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/index";
import { setIsAuthenticated, setLoginUserData } from "../reduxSlice/userSlice";
import { useDispatch } from "react-redux";
import { DENTIST_ENDPOINT } from "@/utils/ApiConstants";
import { executor } from "@/http/executer/index";

interface LoginProps {
  onLogin: () => void;
  onShowRegistration: () => void;
}

export function Login({ onLogin, onShowRegistration }: LoginProps) {
  const loginRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pure validation functions that don't set state
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password && password.length >= 6;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Fixed isFormValid function - only uses pure validation functions
  const isFormValid = () => {
    return formData.email &&
      formData.password &&
      isValidEmail(formData.email) &&
      isValidPassword(formData.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const url = DENTIST_ENDPOINT.LOGIN;
    const exe = executor("post", url);
    loginRef.current = exe;
    try {
      // calling login API
      const response = await loginRef.current.execute({ email: formData.email, password: formData.password });
      const responseData = response.data;
      if (responseData && responseData.data.id && responseData.token) {
        dispatch(setLoginUserData(responseData.data));
        dispatch(setIsAuthenticated(true));
        localStorage.setItem('access_token', responseData.token);
        if (responseData.data.onboardingCompleted && responseData.data.onboardingStep === 8) {
          navigate(ROUTES.DASHBOARD);
        } else if (!responseData.data.onboardingCompleted && responseData.data.onboardingStep < 8)  {
          navigateToOnboarding(responseData.data.onboardingStep);
        } else {
          navigate(ROUTES.LOGIN);
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToOnboarding = (onboardingStep: number) => {
    console.log(onboardingStep, "---onboardingStep---98");
    switch (onboardingStep) {
      case 1:
        navigate(ROUTES.ONBOARDING.CLINIC);
        break;   
      case 2:
        navigate(ROUTES.ONBOARDING.BANK);
        break;
      case 3:
        navigate(ROUTES.ONBOARDING.AVAILABILITY);
        break;
      case 4:
        navigate(ROUTES.ONBOARDING.SUBSCRIPTION);
        break;
      case 5:
        navigate(ROUTES.ONBOARDING.TERMS);
        break;
      case 6:
        navigate(ROUTES.ONBOARDING.PROFILE);
        break;
      case 7:
        navigate(ROUTES.ONBOARDING.CONFIRMATION);
        break;
      default:
        navigate(ROUTES.LOGIN);
        break;
    }
  }

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // In real app, this would open a forgot password flow
  };

  const handleSignup = () => {
    onShowRegistration();
    navigate(ROUTES.REGISTER);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#E5E3FB] relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-12">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#433CE7] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-[#433CE7] mb-3">ZaaN</h1>
            <p className="text-xl text-gray-700 font-medium">Streamline your dental practice</p>
          </div>

          {/* Dental Care Image */}
          <div className="w-full max-w-md mb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1662837625427-970713d74aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZW50YWwlMjBjbGluaWMlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzUzODYzNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern dental clinic"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-[#433CE7] mb-4">Welcome Back!</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Access your comprehensive dental practice management system.
              Manage appointments, patient records, and grow your practice with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-[#433CE7] rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#433CE7] mb-2">ZaaN</h1>
            <p className="text-muted-foreground">Streamline your dental practice</p>
          </div>

          <Card className="shadow-2xl border-0 rounded-2xl">
            <CardHeader className="space-y-2 pb-6 pt-8">
              <CardTitle className="text-2xl font-bold text-foreground text-center">
                Sign In to Your Account
              </CardTitle>
              <p className="text-muted-foreground text-center">
                Enter your credentials to access your dashboard
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <Alert className="border-destructive/20 bg-destructive/10">
                    <AlertDescription className="text-destructive">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Demo Credentials Info */}
                <div className="bg-[#E5E3FB] border border-[#433CE7]/20 rounded-xl p-4">
                  <p className="text-sm text-[#433CE7] font-medium mb-2">Demo Credentials:</p>
                  <p className="text-sm text-[#433CE7]/80">Email: demo@zaan.com</p>
                  <p className="text-sm text-[#433CE7]/80">Password: password123</p>
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className="pl-12 h-14 bg-input-background border-border rounded-xl focus:border-[#433CE7] focus:ring-[#433CE7] focus:ring-1 transition-all"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      className="pl-12 pr-12 h-14 bg-input-background border-border rounded-xl focus:border-[#433CE7] focus:ring-[#433CE7] focus:ring-1 transition-all"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[#433CE7] hover:text-[#3730a3] transition-colors underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={!isFormValid() || isLoading}
                  className="w-full h-14 bg-[#433CE7] hover:bg-[#3730a3] text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              {/* Signup Link */}
              <div className="mt-8 text-center">
                <span className="text-muted-foreground">Don't have an account?</span>
                <button
                  onClick={handleSignup}
                  className="text-muted-foreground hover:text-[#433CE7] transition-colors ml-2"
                >
                  <span className="underline">Register here</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Your data is protected with industry-standard encryption and security measures.
              This system is designed to comply with HIPAA requirements for healthcare data protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}