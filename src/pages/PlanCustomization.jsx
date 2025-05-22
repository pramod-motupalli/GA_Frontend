import React, { useState } from 'react';
import './PlanCard.css';
import Customization from '../pages/Customization';

const PlanCustomization = ({billingType}) => {
  const [showModal, setShowModal] = useState(false);
  console.log("Billing Type:", billingType);

  const plan = {
    title: 'Plan Customization',
    price: null,
    features: [
      'Limited',
      'Own analytics',
      'Chat support',
      'Optimize hashtags',
      'Unlimited users',
    ],
  };

  return (
    <>
      <div className="plan-card hoverable">
        <h3 className="plan-price">₹{plan.price} / {billingType}</h3>
        <h4 className="plan-title">{plan.title}</h4>
        <div className="blurred-features">
          <ul>
            {plan.features.map((feature, i) => (
              <li key={i}>
                <span className="tick-icon">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button className="choose-btn" onClick={() => setShowModal(true)}>
          Choose Plan
        </button>
      </div>

      {showModal && <Customization onClose={() => setShowModal(false)} 
        plan={{ title: plan.title, price: plan.price, type: billingType }}/>}
    </>
  );
};

export default PlanCustomization;
