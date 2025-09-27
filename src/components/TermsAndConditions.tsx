import { useRef, useState } from "react";
import { Shield, FileText, Lock, Heart, CreditCard, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { executor } from "@/http/executer/index";
import { DENTIST_ENDPOINT } from "@/utils/ApiConstants";
import { useNavigate } from "react-router-dom";

interface TermsAndConditionsProps {
  onComplete: (agreementData: any) => void;
  profileData: any;
}

type AgreementSection = {
  id: string;
  title: string;
  icon: any;
  summary: string;
  fullContent: string;
};

export function TermsAndConditions({ onComplete, profileData }: TermsAndConditionsProps) {
  const termsAndConditionsRef = useRef(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const AGREEMENT_SECTIONS: AgreementSection[] = [
    {
      id: 'independence',
      title: 'Independent Practice & Clinical Autonomy',
      icon: Heart,
      summary: 'You maintain complete control over all clinical decisions, diagnosis, treatment plans, and patient billing. ZaaN serves only as a technology platform connecting you with patients.',
      fullContent: `INDEPENDENT PRACTICE AGREEMENT

You acknowledge and agree that:

• You retain full and complete control over all clinical decisions, including but not limited to diagnosis, treatment planning, procedure selection, and patient care protocols.

• You are solely responsible for all clinical outcomes and maintain all professional liability for services rendered through the ZaaN platform.

• ZaaN acts exclusively as a technology intermediary and scheduling platform. ZaaN does not provide healthcare services, make clinical recommendations, or influence medical decisions.

• You maintain complete autonomy over your pricing, availability, and business operations within your practice.

• All patient relationships remain between you and your patients. ZaaN facilitates initial connections but does not interfere with ongoing patient-provider relationships.

• You are responsible for maintaining all required professional licenses, certifications, and insurance coverage.

This agreement preserves your independence as a healthcare provider while leveraging ZaaN's technology to grow your practice.`
    },
    {
      id: 'noncompete',
      title: 'Non-Compete Agreement',
      icon: Shield,
      summary: 'You agree not to use patient data or platform insights gained through ZaaN to build competing services or redirect patients to competitors during your active participation.',
      fullContent: `NON-COMPETE AGREEMENT

During your participation in the ZaaN platform and for 12 months thereafter, you agree that:

• You will not use any patient data, contact information, or behavioral insights gained through ZaaN to develop, support, or promote competing dental booking platforms or services.

• You will not actively redirect ZaaN-acquired patients to competing platforms while maintaining an active ZaaN profile.

• You may not list your practice on direct competitors to ZaaN if you are actively participating in ZaaN's ecosystem, except for your own independent website and established third-party directories predating your ZaaN enrollment.

• This restriction does not limit your ability to practice dentistry, treat patients, or grow your business through other legitimate means.

• Upon termination of your ZaaN participation, you may resume normal competitive activities after the 12-month period.

Permitted Activities:
• Maintaining your own practice website and established marketing
• Participating in professional associations and referral networks
• Treating patients acquired through any means outside of ZaaN
• Normal practice growth and business development

This agreement protects the platform's integrity while preserving your right to practice and grow your business.`
    },
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement (NDA)',
      icon: Lock,
      summary: 'You agree to keep confidential all proprietary ZaaN platform features, patient data, analytics insights, and internal business information that you access through the system.',
      fullContent: `NON-DISCLOSURE AGREEMENT

You agree to maintain strict confidentiality regarding:

PROPRIETARY PLATFORM INFORMATION:
• Internal dashboard features, analytics tools, and platform functionality
• Marketing data, patient flow insights, and platform performance metrics
• Pricing algorithms, matching systems, and technical implementations
• Future product roadmaps, beta features, and development plans

PATIENT DATA PROTECTION:
• All patient information accessed through ZaaN must be kept confidential per HIPAA standards
• Patient contact information, preferences, and booking patterns are confidential
• Aggregated platform data and insights cannot be shared with third parties

BUSINESS INFORMATION:
• ZaaN's business strategies, partnerships, and competitive positioning
• Financial arrangements, fee structures, and platform economics (beyond your own participation)
• Other provider information, performance data, and platform statistics

PERMITTED DISCLOSURES:
• Information required by law or court order
• Patient information directly to the patient or their authorized representatives
• Professional consultations necessary for patient care (with appropriate safeguards)

DURATION:
This agreement remains in effect during your participation and for 3 years following termination.

VIOLATION CONSEQUENCES:
Breach of this NDA may result in immediate platform termination and legal action for damages.`
    },
    {
      id: 'hipaa',
      title: 'HIPAA-Ready Acknowledgment',
      icon: FileText,
      summary: 'You acknowledge responsibility for handling all patient data according to HIPAA best practices and agree to ZaaN\'s comprehensive data privacy and security requirements for protecting patient health information.',
      fullContent: `HIPAA COMPLIANCE & DATA PRIVACY

ZaaN is committed to maintaining the privacy and security of patient health information in accordance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA).

By using the ZaaN platform, all participating providers agree to the following:

CONFIDENTIALITY:
• All patient data accessed via ZaaN (including appointment details, symptoms, communications, and identifiers) must be kept strictly confidential.

PERMITTED USE:
• You may only access and use patient information for providing dental care and coordinating appointments as intended within the ZaaN platform.

NO EXTERNAL SHARING:
• You may not share or export patient data acquired through ZaaN with third parties, external tools, or non-HIPAA-compliant platforms.

ACCESS CONTROL:
• You are responsible for securing your login credentials and device to prevent unauthorized access to patient data.

BREACH NOTIFICATION:
• You must notify ZaaN immediately in the event of a suspected or actual data breach involving patient information.

ZAAN'S SECURITY COMMITMENT:
• ZaaN uses industry-standard encryption and security protocols to ensure the secure transmission and storage of patient data.
• Our platform is designed with HIPAA readiness and we continuously review and improve our safeguards.

YOUR RESPONSIBILITIES:
• You are solely responsible for ensuring all patient interactions and data handling comply with HIPAA regulations
• You must maintain all required HIPAA policies, procedures, and training within your practice
• You will implement appropriate physical, technical, and administrative safeguards

INCIDENT REPORTING & COOPERATION:
• You agree to promptly report any suspected privacy breaches involving ZaaN platform data
• You will cooperate with any privacy investigations or remediation efforts

FUTURE COMPLIANCE:
• As ZaaN expands its services, additional HIPAA Business Associate Agreements may be required
• You agree to participate in updated compliance procedures as healthcare regulations evolve

DISCLAIMER:
This acknowledgment does not constitute legal advice. You should consult with healthcare compliance professionals to ensure your practice meets all applicable HIPAA requirements.`
    },
    {
      id: 'billing',
      title: 'Subscription & Payment Terms',
      icon: CreditCard,
      summary: `You agree to the ${profileData?.subscription?.planName || 'selected'} subscription terms, recurring billing, and ZaaN's 4.25% technology fee on completed appointments.`,
      fullContent: `SUBSCRIPTION & PAYMENT TERMS

SUBSCRIPTION DETAILS:
• Plan: ${profileData?.subscription?.planName || 'Selected Plan'}
• Monthly Fee: $${profileData?.subscription?.monthlyPrice || 'XX'}/month
• Billing Cycle: Monthly recurring on the anniversary of your enrollment date
• Auto-renewal: Your subscription will automatically renew unless cancelled

TECHNOLOGY FEE:
• ZaaN charges a 4.25% technology fee on all completed appointments booked through the platform
• This fee covers payment processing, platform maintenance, customer support, and technology improvements
• Technology fees are automatically deducted from your appointment payments before transfer to your account

PAYMENT PROCESSING:
• Patient payments are processed securely through ZaaN's payment system
• Funds are typically transferred to your bank account within 2-3 business days after appointment completion
• You acknowledge the bank account details provided during onboarding for payment transfers

BILLING CHANGES:
• You may upgrade or downgrade your subscription plan at any time through your dashboard
• Plan changes are prorated and take effect immediately
• Cancellation requires 30 days notice and takes effect at the end of your current billing cycle

FAILED PAYMENTS:
• If subscription payments fail, your account may be suspended until payment is resolved
• Multiple failed payments may result in account termination
• You are responsible for maintaining current payment information

REFUND POLICY:
• Subscription fees are non-refundable except as required by law
• Technology fees are non-refundable for completed services
• Disputed transactions will be handled according to standard payment processor policies

TAX RESPONSIBILITY:
• You are responsible for all applicable taxes on income earned through ZaaN
• ZaaN will provide necessary tax documentation (1099 forms) as required by law`
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getIpAddress = () => {
    return 'xxx.xxx.xxx.xxx'; // Would be captured from client
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) return;

    setIsLoading(true);

    try {
      const agreementData = {
        agreedToAllTerms: true,
        agreedAt: new Date().toISOString(),
        ipAddress: getIpAddress(),
        userAgent: navigator.userAgent
      };

      // calling terms and conditions API
      const url = DENTIST_ENDPOINT.TERMS_AND_CONDITIONS;
      const exe = executor("post", url);
      termsAndConditionsRef.current = exe;
      const response = await termsAndConditionsRef.current.execute({ termsAgreement: true });
      console.log('response---238', response);
      const responseData = response.data
      onComplete(responseData);
    } catch (error) {
      console.error('Failed to save agreements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-6">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="text-center py-12 px-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#E5E3FB] rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-[#433CE7]" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-3">
              Agree to Terms & Conditions
            </CardTitle>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              Please review and accept the legal agreements to complete your onboarding. These protect your rights, your patients, and ensure trust across the ZaaN platform.
            </p>
          </CardHeader>
          
          <CardContent className="px-8 pb-12">
            {/* Agreement Sections */}
            <div className="space-y-6 mb-8">
              {AGREEMENT_SECTIONS.map((section, index) => {
                const Icon = section.icon;
                const isExpanded = expandedSections[section.id];

                return (
                  <Card 
                    key={section.id} 
                    className="transition-all duration-200 border-border hover:shadow-md"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#E5E3FB] text-[#433CE7] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-foreground mb-2">
                            {section.title}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {section.summary}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Expandable Content */}
                      <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.id)}>
                        <CollapsibleTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full flex items-center justify-between p-3 h-auto text-[#433CE7] hover:bg-[#E5E3FB]/30"
                          >
                            <span className="text-sm font-medium">
                              {isExpanded ? 'Hide full agreement' : 'Read full agreement'}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-4">
                          <div className="bg-muted/50 rounded-lg p-6 text-sm">
                            <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                              {section.fullContent}
                            </pre>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Separator className="mb-8" />

            {/* Single Agreement Checkbox */}
            <div className="mb-8">
              <div className="flex items-start gap-4 p-6 bg-[#E5E3FB]/20 rounded-xl border border-[#433CE7]/20">
                <Checkbox
                  id="terms-agreement"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1 data-[state=checked]:bg-[#433CE7] data-[state=checked]:border-[#433CE7]"
                />
                <label 
                  htmlFor="terms-agreement"
                  className="text-foreground cursor-pointer leading-relaxed flex-1"
                >
                  <span className="font-medium">
                    I have read and agree to all the terms and conditions above, including:
                  </span>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Independent Practice & Clinical Autonomy Agreement</li>
                    <li>• Non-Compete Agreement</li>
                    <li>• Non-Disclosure Agreement (NDA)</li>
                    <li>• HIPAA-Ready Acknowledgment</li>
                    <li>• Subscription & Payment Terms</li>
                  </ul>
                  <span className="text-destructive font-medium">*</span>
                </label>
              </div>
            </div>

            {/* Validation Alert */}
            {!agreedToTerms && (
              <Alert className="border-orange-200 bg-orange-50 mb-8">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription className="text-orange-800">
                  Please review and accept the terms and conditions to continue with your onboarding.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="px-8 py-3"
              >
                Go Back
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={!agreedToTerms || isLoading}
                className="bg-[#433CE7] hover:bg-[#3730a3] text-white px-12 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing agreement...
                  </>
                ) : (
                  'Accept & Continue'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}