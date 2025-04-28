"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useState } from "react"
import { PaymentDetails } from "./paymentDetails"
import { Check } from "lucide-react"

export function UpgradeDialog() {
    const [paymentStep, setPaymentStep] = useState<'plans' | 'payment'>('plans')
    const [selectedPlan, setSelectedPlan] = useState<{
        name: string
        price: string
        localPrice: string
        exchangeRate: string
    } | null>(null)

    const plans = [
        {
            name: "Quarterly",
            description: "Best for trying out features",
            price: "$9 / quarter",
            localPrice: "LKR 2,760.97",
            exchangeRate: "307.77"
        },
        {
            name: "Yearly",
            description: "Commit to a full year of progress",
            price: "$29 / year",
            localPrice: "LKR 8,920.97",
            exchangeRate: "307.77"
        },
        {
            name: "5 year access",
            description: "Best value: Only $10/year",
            price: "$49 / 5 years",
            originalPrice: "$99",
            localPrice: "LKR 15,080.97",
            exchangeRate: "307.77",
            highlight: true
        },
        {
            name: "One-time purchase",
            description: "Limited time offer 💤",
            price: "$99",
            localPrice: "LKR 30,469.23",
            exchangeRate: "307.77",
            highlight: true
        }
    ]

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-purple-600 border-purple-600">
                    Upgrade
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>DailyHabits Premium Subscription</DialogTitle>
                </VisuallyHidden>

                {paymentStep === 'plans' ? (
                    <div className="flex">
                       
                        <div className="w-1/2 bg-gray-50 p-8">
                            <DialogHeader className="text-left">
                                <h1 className="text-2xl font-bold mb-2">
                                    Build habits for life with <br />
                                    <span className="text-purple-600">DailyHabits Premium</span>
                                </h1>
                            </DialogHeader>

                            <div className="mt-6">
                                <p className="text-sm mb-6">
                                    DailyHabits is an indie project built by Sankalp & Preetam.<br />
                                    Thank you for using our app 😊
                                </p>

                                <p className="text-sm mb-6">
                                    Please support our app by subscribing to premium. We sincerely appreciate your patronage.
                                </p>

                                <h3 className="font-semibold mb-3">Premium features:</h3>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Unlimited habits (track up to 3 habits in free plan)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Dark mode</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Cross-platform sync (Web, iOS, Android apps)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Priority support</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Our immense gratitude</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        
                        <div className="w-1/2 p-8">
                            <h3 className="font-semibold text-lg mb-6">Select a Plan:</h3>

                            <div className="space-y-4 mb-8">
                                {plans.map((plan, index) => (
                                    <div
                                        key={index}
                                        className={`border rounded-lg p-4 transition-colors cursor-pointer relative
                      ${selectedPlan?.name === plan.name
                                                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                                                : 'hover:border-purple-300 border-gray-200'}
                      ${plan.highlight ? 'bg-yellow-50' : ''}
                    `}
                                        onClick={() => setSelectedPlan({
                                            name: plan.name,
                                            price: plan.price,
                                            localPrice: plan.localPrice,
                                            exchangeRate: plan.exchangeRate
                                        })}
                                    >
                                        {selectedPlan?.name === plan.name && (
                                            <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-1">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium">{plan.name}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                                            </div>
                                            <div className="text-right">
                                                {plan.originalPrice && (
                                                    <span className="line-through text-xs text-gray-500 mr-2">
                                                        {plan.originalPrice}
                                                    </span>
                                                )}
                                                <span className="font-bold">{plan.price}</span>
                                            </div>
                                        </div>
                                        {selectedPlan?.name === plan.name && (
                                            <div className="mt-2 text-xs text-purple-600 flex items-center">
                                                <Check className="h-3 w-3 mr-1" /> Selected
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button
                                className="w-full bg-purple-600 hover:bg-purple-700 py-3 transition-colors"
                                disabled={!selectedPlan}
                                onClick={() => setPaymentStep('payment')}
                            >
                                {selectedPlan ? `Subscribe to ${selectedPlan.name}` : 'Select a Plan'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    selectedPlan && (
                        <PaymentDetails
                            selectedPlan={selectedPlan}
                            onBack={() => setPaymentStep('plans')}
                            onPaymentSuccess={() => {
                                setPaymentStep('plans')
                              
                            }}
                        />
                    )
                )}
            </DialogContent>
        </Dialog>
    )
}