import React from 'react'
import styles from "./footer.module.css";
import Link from 'next/link';
function Footer() {
  const footerLinks = [
    {
      id: 1,
      title: "خانه رویایی خود را پیدا کنید",
      href: "/",
    },
    {
      id: 2,
      title: " ملک خود را ارسال کنید",
      href: "/proposal",
    },
    {
      id: 3,
      title: "برنامه اجاره خانه ها",
      href: "/homeDetails",
    },
    {
      id: 4,
      title: "با ما تماس بگیرید",
      href: "/contact-us",
    },
    {
      id: 5,
      title: "در خواست همکاری",
      href: "/contact-us",
    },
  ];
  return (
    <footer className={styles.footer}>
      <ul className={styles.nav}>
        {footerLinks.map((link) => (
          <li key={link.id} className={styles.nav__item}>
            <Link href={link.href} className={styles.nav__link}>
              {link.title}
            </Link>
          </li>
        ))}
      </ul>

      <p className={styles.copyright}>
        &copy; حقوق مادی معنوی این سایت برای{" "}
        <strong className={styles.copyright__name}>امین قاسمی </strong>
        محفوظ میباشد
      </p>
    </footer>
  );
}

export default Footer;
