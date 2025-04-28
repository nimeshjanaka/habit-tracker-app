"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

interface PaymentDetailsProps {
    selectedPlan: {
        name: string
        price: string
        localPrice: string
        exchangeRate: string
    }
    onBack: () => void
    onPaymentSuccess: () => void
}

export function PaymentDetails({ selectedPlan, onBack, onPaymentSuccess }: PaymentDetailsProps) {
    const [currency, setCurrency] = useState<'local' | 'usd'>('local')
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')

    return (
        <div className="max-w-lg mx-auto h-[calc(100vh-2rem)] overflow-y-auto">
            <Card className="rounded-lg p-6">
                <CardHeader className="text-lg font-semibold p-0 pb-1 text-center">
                    Complete Your Payment
                </CardHeader>

                <CardContent className="space-y-4 p-0 pt-1">
                    <div className="space-y-1">
                        <h3 className="font-medium text-sm">Choose a currency:</h3>
                        <RadioGroup
                            value={currency}
                            onValueChange={(value: 'local' | 'usd') => setCurrency(value)}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="local" id="local" />
                                <Label htmlFor="local" className="text-sm">{selectedPlan.localPrice} LKR</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="usd" id="usd" />
                                <Label htmlFor="usd" className="text-sm">{selectedPlan.price}</Label>
                            </div>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground mt-1">
                            1 USD = {selectedPlan.exchangeRate} LKR
                        </p>
                    </div>

                    <div className="space-y-1">
                        <Card className="p-4">
                            <div className="flex justify-between">
                                <h3 className="font-medium text-sm">{selectedPlan.name}</h3>
                                <p className="text-md font-medium">
                                    {currency === 'local' ? selectedPlan.localPrice : selectedPlan.price}
                                </p>
                            </div>
                        </Card>
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full h-9 bg-green-300">
                                CPay
                            </Button>
                            <Button variant="outline" className="w-full h-9 bg-green-300">
                                Pay with link
                            </Button>
                        </div>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-muted"></div>
                            <span className="flex-shrink mx-2 text-xs text-muted-foreground">
                                Or pay with card
                            </span>
                            <div className="flex-grow border-t border-muted"></div>
                        </div>

                        <div className="space-y-3">
                            <Card className="p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="card-method"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')}
                                            className="h-4 w-4 rounded border-black text-purple-600 focus:ring-purple-500 focus:border-black"
                                        />
                                        <Label htmlFor="card-method" className="text-sm">
                                            Card
                                        </Label>
                                    </div>
                                    {paymentMethod === 'card' && (
                                        <div className="pl-6 space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-sm">Card information</Label>
                                                <Input
                                                    placeholder="1234 1234 1234 1234"
                                                    className="rounded-md h-9"
                                                />
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="MM / YY"
                                                        className="rounded-md h-9"
                                                    />
                                                    <Input
                                                        placeholder="CVC"
                                                        className="rounded-md h-9"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="name" className="text-sm">Cardholder name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Full name on card"
                                                    className="rounded-md h-9"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="country" className="text-sm">Country or region</Label>
                                                <Input
                                                    id="country"
                                                    placeholder="Sri Lanka"
                                                    className="rounded-md h-9"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="bank-method"
                                            checked={paymentMethod === 'bank'}
                                            onChange={() => setPaymentMethod('bank')}
                                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <Label htmlFor="bank-method" className="text-sm">
                                            Bank
                                        </Label>
                                    </div>
                                    {paymentMethod === 'bank' && (
                                        <div className="pl-6 space-y-3">
                                            <div className="space-y-1">
                                                <Label htmlFor="bank" className="text-sm">Bank account</Label>
                                                <Input
                                                    id="bank"
                                                    placeholder="Search for your bank"
                                                    className="rounded-md h-9"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="p-2 border rounded-md">CHASE</div>
                                                <div className="p-2 border rounded-md">Bank of America</div>
                                                <div className="p-2 border rounded-md">WELLS FARGO</div>
                                                <div className="p-2 border rounded-md">CapitalOne</div>
                                                <div className="p-2 border rounded-md">NAVY FEDERAL Credit Union</div>
                                                <div className="p-2 border rounded-md">USbank</div>
                                            </div>
                                            <div className="flex items-center space-x-2 pt-1">
                                                <input
                                                    type="checkbox"
                                                    id="get-5"
                                                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                />
                                                <Label htmlFor="get-5" className="text-sm">
                                                    Get $5 back when you pay by bank. See terms
                                                </Label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <div className="flex items-center space-x-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="save-info"
                                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <Label htmlFor="save-info" className="text-sm">
                                    Securely save my information
                                </Label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Pay faster on DailyHabits and everywhere Link is accepted.
                            </p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 p-0 pt-4">
                    <Button className="w-full h-9 rounded-md" onClick={onPaymentSuccess}>
                        Pay {currency === 'local' ? selectedPlan.localPrice : selectedPlan.price}
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full h-9 rounded-md text-sm"
                        onClick={onBack}
                    >
                        Back to plans
                    </Button>
                    <p className="text-xs text-center text-muted-foreground pt-1">
                        Powered by stripe | Legal | Contact
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}