import Image from "next/image";
import styles from "./story.module.css";
import Link from "next/link";
export default function Story() {
  return (
    <section className={styles.wrapper}>
    
        <div className={styles.pictures}>
          <div className={styles.imageMain}>
            <Image
              src="/img/story-1.jpeg"
              alt="Happy family"
              fill
              priority
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>

          <div className={styles.imageSecondary}>
            <Image src="/img/story-2.jpeg" alt="New house" fill sizes="250px" />
          </div>
        </div>

        <div className={styles.content}>
          <h3 className="u-heading--light u-heading-3">مشتریان خوشحال</h3>

          <h2 className="u-heading--dark u-heading-2 u-my-small">
            "بهترین تصمیم زندگی ما"
          </h2>

          <p className={styles.text}>
            متنی ساختگی و بدون معنی است که برای پر کردن فضای طراحی استفاده
            می‌شود.
          </p>

          <Link href="/homeDetails" className="btn btn-brown">
            خانه خود را پیدا کنید
          </Link>
        </div>
     
    </section>
  );
}


