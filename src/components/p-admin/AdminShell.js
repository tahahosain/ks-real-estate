
"use client";

import { useState } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

import styles from "@/styles/p-admin/AdminShell.module.css";


export default  function AdminShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {isSidebarOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={closeSidebar}
          aria-label="بستن منو"
        />
      )}

      <main className={styles.mainContent}>
        <AdminHeader
          onMenuClick={openSidebar}
        />

        {children}
      </main>
    </div>
  );
}
;
