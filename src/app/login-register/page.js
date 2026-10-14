
"use client";

import { useState } from "react";

import LoginForm from "@/components/login-register/LoginForm";
import RegisterForm from "@/components/login-register/RegisterForm";
import OtpForm from "@/components/login-register/OtpForm";

import styles from "@/styles/loginPage.module.css";
import { authTypes } from "@/utiles/Constants";


export default function LoginPage() {
  const [authType, setAuthType] = useState(authTypes.LOGIN);
   const [authData, setAuthData] = useState(null);

  const showRegisterForm = () => {
    setAuthType(authTypes.REGISTER);
  };

  const showLoginForm = () => {
    setAuthType(authTypes.LOGIN);
  };

   const showOtpForm = (data, mode) => {
     setAuthData({
       ...data,
       mode,
     });

     setAuthType(authTypes.OTP);
   };

   const showPreviousForm = () => {
     if (authData?.mode === "register") {
       setAuthType(authTypes.REGISTER);
     } else {
       setAuthType(authTypes.LOGIN);
     }
   };

  return (
    <main className={styles.loginPage}>
      {authType === authTypes.LOGIN && (
        <LoginForm
          showRegisterForm={showRegisterForm}
          showOtpForm={showOtpForm}
        />
      )}

      {authType === authTypes.REGISTER && (
        <RegisterForm showLoginForm={showLoginForm} showOtpForm={showOtpForm} />
      )}

      {authType === authTypes.OTP && authData && (
        <OtpForm
          phone={authData.phone}
          authData={authData}
          onBack={showPreviousForm}
        />
      )}
      
    </main>
  );
}
;
