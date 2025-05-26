import visaLogo from '../assets/Visa.svg';
import mastercardLogo from '../assets/mastercard.svg';
import cardIcon from '../assets/credit-card.svg';
import upiIcon from '../assets/upi.svg';
import bankIcon from '../assets/Banking.svg';
import walletIcon from '../assets/building-bank.svg';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Payment = () => {
  const navigate = useNavigate();

  const [activeMethod, setActiveMethod] = useState('Card payments');
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });

  const handlePayment = () => {
    navigate('/payment-success');
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === 'number' || name === 'expiry' || name === 'cvc') {
      if (/^[0-9]*$/.test(value) || value === '') {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const methods = [
    { name: 'Card payments', icon: cardIcon },
    { name: 'UPI', icon: upiIcon },
    { name: 'Banking payments', icon: bankIcon },
    { name: 'Banking', icon: walletIcon },
  ];

  return (
    <div className="font-inter text-gray-800 bg-gray-50 m-0 p-10 flex flex-col gap-6">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Lorem ipsum dolor sit amet consectetur.</h1>
        <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur. Feugiat tincidunt elit risus condimentum vel non vel.</p>
      </div>

      <div className="flex gap-6 justify-between">
        {/* Sidebar */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl py-5 flex flex-col gap-2 h-fit">
          {methods.map((method) => (
            <div
              key={method.name}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer font-medium transition-all ${
                activeMethod === method.name ? 'bg-blue-600 text-white rounded-md' : 'text-gray-700 hover:bg-blue-50'
              }`}
              onClick={() => setActiveMethod(method.name)}
            >
              <img src={method.icon} alt={method.name} />
              {method.name}
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="flex-2 bg-white border border-gray-200 rounded-xl p-6 w-full max-w-xl">
          <h2 className="text-lg mb-6 text-gray-900 font-semibold">{activeMethod}</h2>

          <div className="flex flex-col mb-4">
            <label className="mb-1 text-gray-700 font-medium">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Name on card"
              value={formData.name}
              onChange={handleInput}
              className="p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-1 text-gray-700 font-medium">Card Number</label>
            <input
              name="number"
              type="text"
              placeholder="Card Number"
              value={formData.number}
              onChange={handleInput}
              className="p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex flex-col w-1/2">
              <label className="mb-1 text-gray-700 font-medium">MM / YY</label>
              <input
                name="expiry"
                type="text"
                placeholder="MM / YY"
                value={formData.expiry}
                onChange={handleInput}
                className="p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="mb-1 text-gray-700 font-medium">CVC</label>
              <input
                name="cvc"
                type="text"
                placeholder="Security Code"
                value={formData.cvc}
                onChange={handleInput}
                className="p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember this card, save it on my card list</label>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-3 gap-4">
              <img src={visaLogo} alt="Visa" className="w-10 h-auto" />
              <div className="flex flex-col text-sm text-gray-700">
                <div>4855 **** **** ****</div>
                <div>04/24</div>
                <div>Vako Shvili</div>
              </div>
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-3 gap-4">
              <img src={mastercardLogo} alt="MasterCard" className="w-10 h-auto" />
              <div className="flex flex-col text-sm text-gray-700">
                <div>5795 **** **** ****</div>
                <div>04/24</div>
                <div>Vako Shvili</div>
              </div>
            </div>

            <div className="flex items-center justify-between border border-gray-300 p-3 rounded-lg bg-gray-50 text-sm font-medium text-gray-900">
              <span>New Payment Cards</span>
              <CheckCircle className="text-green-500 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5 h-fit">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Details</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Order</span>
                <span>$66.00</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-$2.00</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2 text-base">
                <span>Total</span>
                <span>$66.00</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Coupon</label>
              <input
                placeholder="Apply Coupon"
                className="p-2.5 border border-gray-300 rounded-lg text-sm"
              />
              <button className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium text-sm hover:bg-blue-900">
                Card payments
              </button>
              <button
                onClick={handlePayment}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium text-sm hover:bg-blue-900"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
