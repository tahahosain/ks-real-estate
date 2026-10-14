"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/p-admin/AdminSidebar.module.css";

const menuItems = [
  {
    title: "داشبورد",
    href: "/p-admin",
    icon: "dashboard",
  },
  {
    title: "املاک",
    href: "/p-admin/properties",
    icon: "home",
  },
  {
    title: "کاربران",
    href: "/p-admin/users",
    icon: "users",
  },
  {
    title: "پیام ها",
    href: "/p-admin/contactMessage",
    icon: "requests",
  },
  // {
  //   title: "علاقه‌مندی‌ها",
  //   href: "/p-admin/wishlist",
  //   icon: "heart",
  // },
  {
    title: "املاک ارسال شده",
    href: "/p-admin/properties/pending",
    icon: "categories",
  },
  // {
  //   title: "مدیران",
  //   href: "/p-admin/admins",
  //   icon: "admins",
  // },
  // {
  //   title: "اعلان‌ها",
  //   href: "/p-admin/notifications",
  //   icon: "notifications",
  // },
  {
    title: "املاک رد شده",
    href: "/p-admin/properties/rejected",
    icon: "",
  },
];

function Icon({ name }) {
  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),

    home: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),

    users: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 5.5a3 3 0 0 1 0 5.8" />
        <path d="M18 14.5c1.8.8 3 2.7 3 5" />
      </svg>
    ),

    requests: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h14v16H5z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),

    heart: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
      </svg>
    ),

    categories: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z" />
      </svg>
    ),

    admins: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3" />
        <path d="M5 21c.6-4 3-6 7-6s6.4 2 7 6" />
        <path d="M18 4v4M16 6h4" />
      </svg>
    ),

    notifications: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    ),

    settings: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.5v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8.1 15a1.7 1.7 0 0 0-1.5-1H6.4v-2.5h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2H15v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z" />
      </svg>
    ),
  };

  return icons[name];
}

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <aside className= {`${styles.sidebar} ${
    isOpen ? styles.sidebarOpen : ""
  }`}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.brandMark}>ا</div>

        <div className={styles.brandText}>
          <strong>املاک</strong>
          <span>اتاق کنترل</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation} aria-label="منوی مدیریت">
        <p className={styles.menuLabel}>مدیریت</p>

        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}>
              <span className={styles.icon}>
                <Icon name={item.icon} />
              </span>

              <span className={styles.menuTitle}>{item.title}</span>

              {isActive && <span className={styles.activeIndicator} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={styles.sidebarBottom}>
        <div className={styles.adminProfile}>
          <div className={styles.avatar}>م</div>

          <div className={styles.profileInfo}>
            <strong>مدیر سیستم</strong>
            <span>مدیریت پنل</span>
          </div>
        </div>

        <button type="button" className={styles.logoutButton}>
          <span className={styles.logoutIcon}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 5H5v14h5" />
              <path d="M14 8l4 4-4 4" />
              <path d="M18 12H9" />
            </svg>
          </span>

          <span>خروج از حساب</span>
        </button>
      </div>
    </aside>
  );
}
