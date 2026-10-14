"use client";

import Link from "next/link";
import styles from "./navbar.module.css";
import { useAuth } from "@/components/auth/AuthProvider";
import { logout } from "@/actions/auth/authActions";

function Navbar() {
  const { user, loading, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result.success) {
        setUser(null);
      }
    } catch (error) {
      console.error("Logout Error =>", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link href="/">
          <span>املاک K&S</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <ul>
          <li>
            <Link href="/" className={styles.active}>
              صفحه اصلی
            </Link>
          </li>

          <li>
            <Link href="/homeDetails">املاک ما</Link>
          </li>

          <li>
            <Link href="/OurFeatures">درباره ما</Link>
          </li>

          <li>
            <Link href="/contact-us">ارتباط با ما</Link>
          </li>

          <li>
            {loading ? (
              <span>در حال بررسی...</span>
            ) : user ? (
              <div>
                <button type="button" onClick={handleLogout}>
                  خروج
                  </button>
                  
              {user.role === 'ADMIN' &&  <Link href="/p-admin">ورود به پنل مدیر</Link>}
                  {user.role === 'USER' && <Link href="/p-user">ورود به  پنل  {user.name }</Link>}
              </div>
            ) : (
              <Link href="/login-register">ورود / ثبت نام</Link>
            )}
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {/* search */}
        <button type="button" aria-label="جستجو">
          🔍
        </button>

        {/* notification */}
        <button type="button" aria-label="اعلان‌ها">
          🔔
        </button>

        {/* settings */}
        <button type="button" aria-label="تنظیمات">
          ⚙️
        </button>

        {/* user */}
        {user && (
          <Link href="/p-user" className={styles.user}>
            <span>{user.name}</span>
          </Link>
        )}
      </div>

      {/* Mobile */}
      <div className={styles.mobileMenu}>
        <input type="checkbox" id="toggleNav" className={styles.mobileInput} />

        <label htmlFor="toggleNav" className={styles.mobileButton}>
          <span />
          <span />
          <span />
        </label>

        <ul>
          <li>
            <Link href="/">صفحه اصلی</Link>
          </li>

          <li>
            <Link href="/houses">املاک ما</Link>
          </li>

          <li>
            <Link href="/OurFeatures">ویژگی‌ها</Link>
          </li>

          <li>
            <Link href="/about">درباره ما</Link>
          </li>

          <li>
            {user ? (
              <button onClick={handleLogout}>خروج</button>
            ) : (
              <Link href="/login-register">ورود / ثبت نام</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
