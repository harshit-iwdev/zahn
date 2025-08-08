import { useState } from "react";
import { Crown, Star, Check, ArrowLeft, CreditCard, Zap, MessageCircle, BarChart3, Users, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface PlanUpgradeProps {
  onUpgrade: () => void;
  onBack: () => void;
  currentPlan: {
    tier: string;
    planName: string;
    monthlyPrice: number;
  };
}

const PLAN_DATA = {
  tier1: {
    name: 'Tier 1 - Basic',
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
    name: 'Tier 2 - Premium',
    price: 599,
    description: 'For established practices seeking growth',
    features: [
      'Unlimited new-patient bookings',
      'Priority in search results',
      'Enhanced profile (photos, videos, reviews)',
      'Direct patient messaging',
      'Advanced analytics & marketing insights',
      'Recall & retention tools',
      'Premium search placement',
      'Patient review management',
      'Marketing campaign tools'
    ],
    limitations: []
  }
};

export function PlanUpgrade({ onUpgrade, onBack, currentPlan }: PlanUpgradeProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      // Simulate API call for upgrade
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Plan upgraded to Tier 2');
      onUpgrade();
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const currentPlanData = PLAN_DATA.tier1;
  const upgradePlanData = PLAN_DATA.tier2;
  const monthlySavings = 0; // Could show annual savings here
  const upgradeFeatures = upgradePlanData.features.filter(feature => 
    !currentPlanData.features.includes(feature)
  );

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#E5E3FB] rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-[#433CE7]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Upgrade Your Plan</h1>
              <p className="text-muted-foreground">
                Unlock premium features and grow your practice with unlimited bookings
              </p>
            </div>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Current Plan */}
          <Card className="relative border-border">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-xl text-foreground">
                  Your Current Plan
                </CardTitle>
                <Badge className="bg-muted text-muted-foreground hover:bg-muted">
                  Current
                </Badge>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-foreground">
                    ${currentPlanData.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">{currentPlanData.description}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Current Features */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">What you have:</h4>
                {currentPlanData.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Current Limitations */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Current limitations:</h4>
                {currentPlanData.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">{limitation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Plan */}
          <Card className="relative border-[#433CE7]/30 shadow-lg bg-gradient-to-br from-[#E5E3FB]/20 to-white">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-[#433CE7] text-white hover:bg-[#433CE7] px-4 py-1">
                <Star className="w-3 h-3 mr-1" />
                Recommended
              </Badge>
            </div>
            
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  Tier 2 - Premium
                  <Zap className="w-5 h-5 text-[#433CE7]" />
                </CardTitle>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-[#433CE7]">
                    ${upgradePlanData.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">{upgradePlanData.description}</p>
                <div className="mt-2 p-2 bg-[#433CE7]/10 rounded-lg">
                  <p className="text-sm text-[#433CE7] font-medium">
                    Upgrade for +${upgradePlanData.price - currentPlanData.price}/month
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Upgrade Features - What's New */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#433CE7]" />
                  What you'll unlock:
                </h4>
                {upgradeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-[#433CE7]/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#433CE7]" />
                    </div>
                    <span className="text-sm text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Key Benefits */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Key benefits:</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-[#E5E3FB]/30 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-[#433CE7]" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Direct Messaging</p>
                      <p className="text-xs text-muted-foreground">Communicate with patients instantly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#E5E3FB]/30 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-[#433CE7]" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Advanced Analytics</p>
                      <p className="text-xs text-muted-foreground">Track performance & growth metrics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#E5E3FB]/30 rounded-lg">
                    <Users className="w-5 h-5 text-[#433CE7]" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Unlimited Bookings</p>
                      <p className="text-xs text-muted-foreground">No monthly booking limits</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Section */}
        <Card className="border-[#433CE7]/20 bg-[#E5E3FB]/10">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Ready to unlock premium features?
              </h3>
              <p className="text-muted-foreground">
                Upgrade now and start accepting unlimited bookings immediately
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="bg-[#433CE7] hover:bg-[#3730a3] text-white px-8 py-3 text-lg"
                size="lg"
              >
                {isUpgrading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Tier 2
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={onBack}
                className="border-[#433CE7]/20 text-[#433CE7] hover:bg-[#E5E3FB]/30"
              >
                Maybe Later
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Secure billing via Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Instant activation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}