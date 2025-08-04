import { useState } from "react";
import { Crown, Star, Check, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface SubscriptionPlanSelectionProps {
  onComplete: (subscriptionData: any) => void;
  onBack: () => void;
}

type PlanTier = 'tier1' | 'tier2' | null;

const PLANS = {
  tier1: {
    name: 'Tier 1',
    price: 199,
    description: 'Perfect for growing practices',
    features: [
      'Basic platform access',
      'Listed in patient-facing search',
      'Up to 5 new-patient bookings/month',
      'Real-time calendar sync (coming soon)',
      'Basic profile with contact info',
      'Standard search ranking'
    ],
    limitations: [
      '5 booking limit per month',
      'Standard search visibility',
      'Basic profile features only'
    ]
  },
  tier2: {
    name: 'Tier 2',
    price: 599,
    description: 'For established practices seeking growth',
    features: [
      'Unlimited new-patient bookings',
      'Priority in search results',
      'Enhanced profile (photos, videos, reviews)',
      'Direct patient messaging (coming soon)',
      'Advanced analytics & marketing insights',
      'Recall & retention tools',
      'Premium search placement',
      'Patient review management',
      'Marketing campaign tools'
    ],
    limitations: []
  }
};

export function SubscriptionPlanSelection({ onComplete, onBack }: SubscriptionPlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanSelect = (plan: PlanTier) => {
    setSelectedPlan(plan);
  };

  const handleSubmit = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);

    try {
      const subscriptionData = {
        tier: selectedPlan,
        planName: PLANS[selectedPlan].name,
        monthlyPrice: PLANS[selectedPlan].price,
        features: PLANS[selectedPlan].features,
        selectedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Subscription data:', subscriptionData);
      onComplete(subscriptionData);
    } catch (error) {
      console.error('Failed to save subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-6">
      <div className="w-full max-w-6xl">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="text-center py-12 px-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#E5E3FB] rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-[#433CE7]" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-3">
              Choose Your Subscription Plan
            </CardTitle>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              ZaaN offers flexible access based on your needs. Choose the plan that fits your patient flow and practice goals. You can upgrade anytime.
            </p>
          </CardHeader>
          
          <CardContent className="px-8 pb-12">
            {/* Plan Comparison Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Tier 1 Plan */}
              <Card className={`relative transition-all duration-300 hover:shadow-lg ${
                selectedPlan === 'tier1' 
                  ? 'ring-2 ring-[#E5E3FB] shadow-lg bg-[#E5E3FB]/10' 
                  : 'border-border hover:shadow-md'
              }`}>
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl text-foreground">
                      {PLANS.tier1.name}
                    </CardTitle>
                    {selectedPlan === 'tier1' && (
                      <Badge className="bg-[#E5E3FB] text-[#433CE7] hover:bg-[#E5E3FB]">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">
                        ${PLANS.tier1.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-muted-foreground mt-2">{PLANS.tier1.description}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {PLANS.tier1.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          feature.includes('coming soon') ? 'text-muted-foreground' : 'text-[#433CE7]'
                        }`} />
                        <span className={`text-sm ${
                          feature.includes('coming soon') ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Select Button */}
                  <Button
                    onClick={() => handlePlanSelect('tier1')}
                    variant={selectedPlan === 'tier1' ? 'default' : 'outline'}
                    className={`w-full h-12 transition-all duration-200 ${
                      selectedPlan === 'tier1'
                        ? 'bg-[#E5E3FB] hover:bg-[#E5E3FB]/80 text-[#433CE7] border-[#E5E3FB]'
                        : 'border-[#E5E3FB] text-[#433CE7] hover:bg-[#E5E3FB]/20'
                    }`}
                  >
                    {selectedPlan === 'tier1' ? 'Selected' : 'Select Tier 1'}
                  </Button>
                </CardContent>
              </Card>

              {/* Tier 2 Plan */}
              <Card className={`relative transition-all duration-300 hover:shadow-lg ${
                selectedPlan === 'tier2' 
                  ? 'ring-2 ring-[#433CE7] shadow-xl bg-[#433CE7]/5' 
                  : 'border-border hover:shadow-md'
              }`}>
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                      {PLANS.tier2.name}
                      <Star className="w-5 h-5 text-[#433CE7]" />
                    </CardTitle>
                    {selectedPlan === 'tier2' && (
                      <Badge className="bg-[#433CE7] text-white hover:bg-[#433CE7]">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">
                        ${PLANS.tier2.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-muted-foreground mt-2">{PLANS.tier2.description}</p>
                  </div>
                  <Badge className="bg-[#433CE7]/10 text-[#433CE7] hover:bg-[#433CE7]/10 px-3 py-1">
                    Most Popular
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {PLANS.tier2.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          feature.includes('coming soon') ? 'text-muted-foreground' : 'text-[#433CE7]'
                        }`} />
                        <span className={`text-sm ${
                          feature.includes('coming soon') ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Select Button */}
                  <Button
                    onClick={() => handlePlanSelect('tier2')}
                    className={`w-full h-12 transition-all duration-200 ${
                      selectedPlan === 'tier2'
                        ? 'bg-[#433CE7] hover:bg-[#3730a3] text-white'
                        : 'bg-[#433CE7] hover:bg-[#3730a3] text-white'
                    }`}
                  >
                    {selectedPlan === 'tier2' ? 'Selected' : 'Select Tier 2'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Billing Information */}
            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-[#433CE7] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground mb-2">Billing Information</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• Subscription will renew monthly. You can manage your plan anytime from your dashboard.</p>
                    <p>• All plans include secure payment processing and customer support.</p>
                    <p>• Upgrade or downgrade your plan at any time with prorated pricing.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="px-8 py-3"
              >
                Go Back
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={!selectedPlan || isLoading}
                className="bg-[#433CE7] hover:bg-[#3730a3] text-white px-12 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing selection...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}