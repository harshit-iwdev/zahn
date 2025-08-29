import { useEffect, useRef, useState } from "react";
import { Crown, Star, Check, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { executor } from "@/http/executer/index";
import { USER_ENDPOINT } from "@/utils/ApiConstants";
import { useNavigate } from "react-router-dom";

interface SubscriptionPlanSelectionProps {
  onComplete: (subscriptionData: any) => void;
}

export function SubscriptionPlanSelection({ onComplete }: SubscriptionPlanSelectionProps) {
  const subscriptionPlanSelectionRef = useRef(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const navigate = useNavigate();
  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  useEffect(() => {
    getAvailablePlans();
  }, []);

  const getAvailablePlans = async () => {
    const url = USER_ENDPOINT.GET_SUBSCRIPTION_PLANS;
    const exe = executor("get", url);
    const response = await exe.execute();
    const responseData = response.data;
    setAvailablePlans(responseData.data);
  }

  const handleSubmit = async () => {
    if (!selectedPlanId) return;

    setIsLoading(true);

    try {
      const subscriptionData = {
        planId: selectedPlanId,
        planName: availablePlans.find(plan => plan.plan_id === selectedPlanId)?.plan_name,
      };

      // calling subscription plan selection API
      const url = USER_ENDPOINT.SELECT_SUBSCRIPTION_PLAN;
      const exe = executor("post", url);
      subscriptionPlanSelectionRef.current = exe;
      const response = await subscriptionPlanSelectionRef.current.execute(subscriptionData);
      const responseData = response.data;
      console.log('responseData---93', responseData);
      onComplete(responseData.data);
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
              {availablePlans.length > 0 && availablePlans.map((plan, index) => (
                <Card key={index} className={`relative transition-all duration-300 hover:shadow-lg ${selectedPlanId === plan.plan_id
                    ? 'ring-2 ring-[#E5E3FB] shadow-lg bg-[#E5E3FB]/10'
                    : 'border-border hover:shadow-md'
                  }`}>
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="text-2xl text-foreground">
                        {plan.plan_name}
                      </CardTitle>
                      {selectedPlanId === plan.plan_id && (
                        <Badge className="bg-[#E5E3FB] text-[#433CE7] hover:bg-[#E5E3FB]">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground">
                          ${plan.plan_price}
                        </span>
                        <span className="text-muted-foreground">/${plan.plan_duration_type}</span>
                      </div>
                      <p className="text-muted-foreground mt-2">{plan.plan_description}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div className="space-y-3">
                      {plan.plan_features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${feature.includes('coming soon') ? 'text-muted-foreground' : 'text-[#433CE7]'
                            }`} />
                          <span className={`text-sm ${feature.includes('coming soon') ? 'text-muted-foreground' : 'text-foreground'
                            }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Select Button */}
                    <Button
                      onClick={() => handlePlanSelect(plan.plan_id)}
                      variant={selectedPlanId === plan.plan_id ? 'default' : 'outline'}
                      className={`w-full h-12 transition-all duration-200 ${selectedPlanId === plan.plan_id
                          ? 'bg-[#E5E3FB] hover:bg-[#E5E3FB]/80 text-[#433CE7] border-[#E5E3FB]'
                          : 'border-[#E5E3FB] text-[#433CE7] hover:bg-[#E5E3FB]/20'
                        }`}
                    >
                      {selectedPlanId === plan.plan_id ? 'Selected' : 'Select Tier 1'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
                onClick={() => navigate(-1)}
                className="px-8 py-3"
              >
                Go Back
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={!selectedPlanId || isLoading}
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