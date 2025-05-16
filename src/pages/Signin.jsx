import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement actual login functionality here
    alert("Form submitted. Remember Me: " + rememberMe);
  };

  const handleForgotPassword = () => {
    alert("Redirect to forgot password page");
  };

  const goToSignup = () => {
  navigate("/signup");
};
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/4 bg-blue-100 p-10 flex flex-col justify-center items-center border-r border-blue-500 rounded-tr-2xl rounded-br-2xl" style={{
        width: '475px',
        height:'1024px',
        borderRadius:'16px 16px 0 0',
        border:'1px solid #7690A3',
        bckgroundColor:' #EBF4FF',
        boxShadow:'2px 2px 4px 0 #D2E6F2'
      }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Puzzle Hands"
          className="w-60 mb-6"
        />
        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-4">
          Committed to Your Safety with Expertise and Care
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          Our team is built on years of proven experience and a deep commitment
          to user safety. We combine technical excellence with empathy to
          deliver secure, reliable solutions. Through strong collaboration and
          clear communication, we solve challenges with precision and care.
        </p>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-[686px] inline-flex flex-col justify-start items-center gap-12">
        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          <div className="w-96 flex flex-col justify-start items-start gap-2">
            <div className="self-stretch text-center justify-start text-slate-600 text-3xl font-bold font-['Lato']">we glad to see you here again !</div>
            <div className="self-stretch justify-start text-slate-600 text-base font-normal font-['Lato']">Enter yor mail id and password to get into the site.</div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div data-error-icon="true" data-show-label="true" data-show-left-icon="true" data-show-right-icon="false" data-state="Default" className="self-stretch flex flex-col justify-start items-start gap-2.5">
              <div className="self-stretch inline-flex justify-start items-start gap-2.5">
                <div className="flex-1 justify-start text-gray-700 text-lg font-normal font-['Lato']">Enteryour mail id</div>
              </div>
              <div className="self-stretch p-5 bg-white rounded-lg outline outline-1 outline-neutral-400/40 inline-flex justify-center items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 relative overflow-hidden">
                  <div className="w-4 h-3.5 left-[3px] top-[5px] absolute outline outline-2 outline-offset-[-1px] outline-slate-500/75" />
                </div>
                <div className="flex-1 justify-start text-gray-400 text-base font-normal font-['Lato']">eg:sample@mailid.com</div>
              </div>
            </div>
            <div data-error-icon="true" data-show-label="true" data-show-left-icon="true" data-show-right-icon="true" data-state="active" className="self-stretch flex flex-col justify-start items-start gap-2.5">
              <div className="self-stretch inline-flex justify-start items-start gap-2.5">
                <div className="flex-1 justify-start text-gray-700 text-lg font-normal font-['Lato']">Enter your password</div>
              </div>
              <div className="self-stretch p-5 bg-white rounded-lg outline outline-1 outline-blue-400/80 inline-flex justify-center items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 relative overflow-hidden">
                  <div className="w-3.5 h-4 left-[5px] top-[3px] absolute outline outline-2 outline-offset-[-1px] outline-slate-500/75" />
                </div>
                <div className="flex-1 justify-start text-gray-400 text-base font-normal font-['Lato']">password</div>
                <div className="w-6 h-6 relative overflow-hidden">
                  <div className="w-4 h-3 left-[3px] top-[6px] absolute outline outline-2 outline-offset-[-1px] outline-slate-500/75" />
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-between items-start">
              <div className="flex justify-start items-start gap-2">
                <div className="w-6 px-[5px] py-2 bg-blue-400 rounded inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                  <div className="w-3.5 h-2 outline outline-2 outline-offset-[-1px] outline-white" />
                </div>
                <div className="justify-start text-gray-700 text-lg font-normal font-['Lato']">Remember me</div>
              </div>
              <div className="flex justify-start items-start gap-2">
                <div className="justify-start text-gray-700 text-lg font-normal font-['Lato'] underline">Forgot password?</div>
              </div>
            </div>
          </div>
          <div className="self-stretch px-3 py-4 bg-blue-400 rounded inline-flex justify-center items-center gap-2.5">
            <div className="justify-start text-white text-xl font-bold font-['Lato']">Login</div>
          </div>
        </div>
        <div className="inline-flex justify-center items-center gap-2">
          <div className="justify-start text-slate-600 text-base font-normal font-['Lato']">Don’t have an account ? </div>
          <div className="text-center justify-start text-blue-500 text-xl font-bold font-['Lato']">Signup</div>
        </div>
      </div>
    </div>
   );
}