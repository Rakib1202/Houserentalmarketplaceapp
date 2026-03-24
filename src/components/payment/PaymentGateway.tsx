import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Card, CardContent } from '../ui/card';
import { CreditCard, Smartphone, Wallet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { subscriptionsAPI } from '../../utils/api';

interface PaymentGatewayProps {
  open: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  amount: number;
  duration: number;
  onSuccess: () => void;
}

type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card';
type PaymentStatus = 'idle' | 'processing' | 'verifying' | 'success' | 'error';

export function PaymentGateway({ open, onClose, planId, planName, amount, duration, onSuccess }: PaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const paymentMethods = [
    {
      id: 'bkash' as const,
      name: 'bKash',
      icon: Smartphone,
      color: 'from-pink-500 to-pink-600',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      instructions: 'Dial *247# or use bKash app',
      number: '01812-345678',
    },
    {
      id: 'nagad' as const,
      name: 'Nagad',
      icon: Wallet,
      color: 'from-orange-500 to-red-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      instructions: 'Dial *167# or use Nagad app',
      number: '01912-345678',
    },
    {
      id: 'rocket' as const,
      name: 'Rocket',
      icon: Smartphone,
      color: 'from-purple-500 to-purple-700',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      instructions: 'Dial *322# or use Rocket app',
      number: '01712-345678',
    },
    {
      id: 'card' as const,
      name: 'Credit/Debit Card',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-700',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      instructions: 'Powered by SSLCommerz',
      number: '',
    },
  ];

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  const handlePayment = async () => {
    // Validation
    if (!phoneNumber || phoneNumber.length < 11) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!transactionId || transactionId.length < 5) {
      toast.error('Please enter a valid transaction ID');
      return;
    }

    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentStatus('verifying');

      // Create subscription record
      const subscriptionData = {
        planName: planName,
        amount: amount,
        duration: duration,
        status: 'pending', // Will be activated after admin approval
        startDate: new Date(),
        endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
        paymentMethod: paymentMethod.toUpperCase(),
        transactionId: transactionId,
        phoneNumber: phoneNumber,
        autoRenew: false,
      };

      const response = await subscriptionsAPI.create(subscriptionData);

      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPaymentStatus('success');

      toast.success('Payment submitted! Admin will verify and activate your subscription within 2-4 hours.');

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        onSuccess();
        // Reset form
        setPhoneNumber('');
        setTransactionId('');
        setPaymentStatus('idle');
      }, 2000);

    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      toast.error('Payment failed. Please try again.');
    }
  };

  const resetForm = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
    setPhoneNumber('');
    setTransactionId('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && paymentStatus !== 'processing' && paymentStatus !== 'verifying') {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete Your Payment</DialogTitle>
          <DialogDescription>
            You are subscribing to <span className="font-semibold text-blue-600">{planName}</span> for <span className="font-semibold">৳{amount.toLocaleString()}</span>
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === 'success' ? (
          <div className="py-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-100 p-6 rounded-full">
                <CheckCircle className="size-16 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-green-600">Payment Submitted!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Your payment has been received and is being verified. 
              Your subscription will be activated within 2-4 hours after admin verification.
            </p>
            <p className="text-sm text-gray-500">
              Transaction ID: <span className="font-mono font-semibold">{transactionId}</span>
            </p>
          </div>
        ) : paymentStatus === 'error' ? (
          <div className="py-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-red-100 p-6 rounded-full">
                <AlertCircle className="size-16 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-red-600">Payment Failed</h3>
            <p className="text-gray-600 max-w-md mx-auto">{errorMessage}</p>
            <Button onClick={resetForm}>Try Again</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="relative">
                      <RadioGroupItem
                        value={method.id}
                        id={method.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                          paymentMethod === method.id
                            ? `${method.borderColor} ${method.bgColor} shadow-md`
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${method.color}`}>
                          <method.icon className="size-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          <p className="text-xs text-gray-500">{method.instructions}</p>
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle className={`size-5 ${method.textColor}`} />
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Payment Instructions */}
            {selectedMethod && selectedMethod.number && (
              <Card className={`border-2 ${selectedMethod.borderColor} ${selectedMethod.bgColor}`}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <selectedMethod.icon className={`size-5 ${selectedMethod.textColor}`} />
                    {selectedMethod.name} Payment Instructions
                  </h3>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-gray-700">1</span>
                      <span>Open your {selectedMethod.name} app or dial {selectedMethod.instructions.split(' ')[1]}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-gray-700">2</span>
                      <span>Select "Send Money" or "Payment"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-gray-700">3</span>
                      <div>
                        <span>Send <span className="font-bold text-gray-900">৳{amount.toLocaleString()}</span> to:</span>
                        <div className="mt-1 bg-white p-3 rounded-lg font-mono font-bold text-lg border-2 border-dashed border-gray-300">
                          {selectedMethod.number}
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-gray-700">4</span>
                      <span>Use reference: <span className="font-semibold">HouseRentBD-{planName.split(' ')[0]}</span></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-gray-700">5</span>
                      <span>Complete the transaction and copy the Transaction ID</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-gray-700">6</span>
                      <span>Enter your payment details below</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            )}

            {paymentMethod === 'card' && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <p className="text-sm text-blue-800">
                    <CreditCard className="size-4 inline mr-1" />
                    Card payment is powered by SSLCommerz. You'll be redirected to a secure payment page.
                    (Currently in demo mode - Coming soon!)
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Payment Details Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Your {selectedMethod?.name} Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={11}
                  disabled={paymentStatus === 'processing' || paymentStatus === 'verifying'}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The phone number you used to send the payment
                </p>
              </div>

              <div>
                <Label htmlFor="trxId">Transaction ID / TrxID *</Label>
                <Input
                  id="trxId"
                  type="text"
                  placeholder="e.g., 9BH5G7KL3M"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  disabled={paymentStatus === 'processing' || paymentStatus === 'verifying'}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  You'll receive this after completing the payment
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handlePayment}
                disabled={paymentStatus === 'processing' || paymentStatus === 'verifying' || !phoneNumber || !transactionId}
                className="flex-1"
              >
                {paymentStatus === 'processing' ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : paymentStatus === 'verifying' ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-4 mr-2" />
                    Confirm Payment
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                disabled={paymentStatus === 'processing' || paymentStatus === 'verifying'}
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Your subscription will be activated within 2-4 hours after admin verification
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
