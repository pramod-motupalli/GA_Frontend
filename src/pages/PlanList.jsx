import React, { useState } from 'react';
import './PlanCard.css';
import PlanCustomization from './PlanCustomization';
import DomainHosting from './DomainHosting';

const PlanList = ({ plans, type }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChoosePlan = (plan) => {
    setSelectedPlan({ ...plan, billing: type });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };
  

  return (
    <>
      <div className="plan-grid-wrapper">
        <div className="plan-grid">
          {plans.map((plan, index) => (
            <div className={`plan-card hoverable ${plan.title === 'Basic' ? 'most-popular' : ''}`} key={index}>
  {plan.title === 'Basic' && <div className="popular-badge">MOST POPULAR</div>}
              <h3 className="plan-price">₹{plan.price} / {type}</h3>
              <h4 className="plan-title">{plan.title}</h4>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="plan-feature">
                    <span className="tick-icon">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="choose-btn" onClick={() => handleChoosePlan(plan)}>
                Choose Plan
              </button>
            </div>
          ))}
          <PlanCustomization billingType={type} />
        </div>
      </div>

      <DomainHosting
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedPlan={selectedPlan}
      />
    </>
  );
};

export default PlanList;
