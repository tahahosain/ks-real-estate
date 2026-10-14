"use client"
import Link from "next/link";

import styles from "@/styles/p-admin/AdminHeader.module.css";
import useContactMessages from "@/hooks/useContactMessages";
export default   function AdminHeader({ onMenuClick }) {

const { data: contactCount = 0, isLoading, isError } = useContactMessages();


  return (
    <header className={styles.header}>
      <div className={styles.rightSection}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="باز کردن منو">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        <div className={styles.titleWrapper}>
          <span className={styles.breadcrumb}>اتاق کنترل املاک</span>

          <h1 className={styles.title}>داشبورد</h1>
        </div>
      </div>

      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.notificationButton}
          aria-label="اعلان‌ها">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          <span className={styles.notificationBadge}>{contactCount}</span>
        </button>

        <Link href="/p-admin" className={styles.profile}>
          <div className={styles.avatar}>م</div>

          <div className={styles.profileInfo}>
            <span className={styles.profileName}>مدیر سیستم</span>

            <span className={styles.profileRole}>مدیریت پنل</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
;
