"use client";

import { useState } from "react";

import { logout } from "@/actions/auth/authActions";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const result = await logout();

      if (!result.success) {
        alert(result.message);
        return;
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout Error =>", error);

      alert("خطایی هنگام خروج از حساب رخ داد");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button type="button" onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? "در حال خروج..." : "خروج"}
    </button>
  );
}
