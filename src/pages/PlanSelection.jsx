import React, { useState } from 'react';
import './PlanSelection.css';
import logo1 from '../assets/logo1.png';
import PlanList from './PlanList';

const PlanSelection = () => {
  const [isMonthly, setIsMonthly] = useState(true);

const monthlyPlans = [
  {
    title: 'Pro',
    price: 100,
    features: ['All limited links', 'Own analytics platform', 'Chat support', 'Optimize hashtags', 'Unlimited users'],
  },
  {
    title: 'Intro',
    price: 300,
    features: ['Dedicated account', 'Tailored analytics', '24/7 support', 'AI-driven hashtag', 'Unlimited users'],
  },
  {
    title: 'Basic',
    price: 200,
    features: ['Priority support', 'Custom analytics reports', 'Phone support', 'Advanced hashtag', 'Up to 50 users'],
  },
];

const yearlyPlans = [
  {
    title: 'Pro',
    price: 1000,
    features: ['All limited links', 'Own analytics platform', 'Chat support', 'Optimize hashtags', 'Unlimited users'],
  },
  {
    title: 'Intro',
    price: 2800,
    features: ['Dedicated account', 'Tailored analytics', '24/7 support', 'AI-driven hashtag', 'Unlimited users'],
  },
  {
    title: 'Basic',
    price: 1800,
    features: ['Priority support', 'Custom analytics reports', 'Phone support', 'Advanced hashtag', 'Up to 50 users'],
  },
];

 const activePlans = isMonthly ? monthlyPlans : yearlyPlans;
 const [selectedCategory, setSelectedCategory] = useState('A');


  return (
    <div className="plan-selection-container">
      <div className="header-container">
        <img src={logo1} alt="Logo" className="logo" />
        <h2 className="page-heading">Plans you can choose</h2>
        <p className="header-subtitle">
          Choose the best plan that fits your needs and customize it easily.
        </p>
      </div>

  <div className="plan-toggle-container">
  <div className="toggle-switch">
    <button
      className={isMonthly ? 'toggle-btn active' : 'toggle-btn'}
      onClick={() => setIsMonthly(true)}
    >
      Monthly
    </button>
    <button
      className={!isMonthly ? 'toggle-btn active' : 'toggle-btn'}
      onClick={() => setIsMonthly(false)}
    >
      Yearly
    </button>
  </div>
</div>

<div className="category-tabs">
  {['A', 'B', 'C', 'D'].map((cat) => (
    <button
      key={cat}
      className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
      onClick={() => setSelectedCategory(cat)}
    >
      Category {cat}
    </button>
  ))}
</div>
  <div className="plan-grid">
    <PlanList plans={activePlans} type={isMonthly ? 'monthly' : 'yearly'} />
    <div className="info-line">
      <span className="info-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 3.34001C18.5083 4.21087 19.7629 5.46054 20.6398 6.96531C21.5167 8.47009 21.9854 10.1778 21.9994 11.9194C22.0135 13.6609 21.5725 15.376 20.72 16.8947C19.8676 18.4135 18.6332 19.6832 17.1392 20.5783C15.6452 21.4734 13.9434 21.9628 12.2021 21.9981C10.4608 22.0333 8.74055 21.6132 7.21155 20.7793C5.68256 19.9453 4.39787 18.7265 3.48467 17.2435C2.57146 15.7605 2.06141 14.0647 2.005 12.324L2 12L2.005 11.676C2.061 9.94901 2.56355 8.26598 3.46364 6.79101C4.36373 5.31604 5.63065 4.09947 7.14089 3.2599C8.65113 2.42033 10.3531 1.98641 12.081 2.00045C13.8089 2.01449 15.5036 2.47601 17 3.34001ZM12 11H11L10.883 11.007C10.6299 11.0371 10.3979 11.1627 10.2343 11.3582C10.0707 11.5536 9.98789 11.8042 10.0028 12.0586C10.0178 12.3131 10.1293 12.5522 10.3146 12.7272C10.5 12.9021 10.7451 12.9997 11 13V16L11.007 16.117C11.0357 16.3603 11.1526 16.5845 11.3356 16.7473C11.5187 16.9101 11.7551 17 12 17H13L13.117 16.993C13.3603 16.9644 13.5845 16.8474 13.7473 16.6644C13.91 16.4814 14 16.2449 14 16L13.993 15.883C13.9667 15.6598 13.8659 15.452 13.707 15.293C13.5481 15.1341 13.3402 15.0333 13.117 15.007L13 15V12L12.993 11.883C12.9643 11.6398 12.8474 11.4155 12.6644 11.2527C12.4813 11.09 12.2449 11 12 11ZM12.01 7.00001L11.883 7.00701C11.6299 7.03712 11.3979 7.16273 11.2343 7.35818C11.0707 7.55364 10.9879 7.80418 11.0028 8.05862C11.0178 8.31306 11.1293 8.5522 11.3146 8.72717C11.5 8.90214 11.7451 8.99973 12 9.00001L12.127 8.99301C12.3801 8.96291 12.6121 8.8373 12.7757 8.64185C12.9393 8.44639 13.0221 8.19585 13.0072 7.94141C12.9922 7.68697 12.8807 7.44783 12.6954 7.27286C12.51 7.09789 12.2649 7.0003 12.01 7.00001Z" fill="#50575C"/>
        </svg>
      </span>
      <span className="info-text">
        Your plan will be activated shortly after payment. For any queries{' '}
        <a href="/contact" target="_blank" rel="noopener noreferrer">Reach us.</a>
      </span>
    </div>
  </div>
</div>

  );
};

export default PlanSelection;