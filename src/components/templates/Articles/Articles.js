import styles from "./Articles.module.css";
import Button from "@/components/ui/button/Button";
import Link from "next/link";


import {
  FaGlobe,
  FaKey,
  FaLockOpen,
  FaMapMarker,
  FaTrophy,
} from "react-icons/fa";

import { FaPersonShelter } from "react-icons/fa6";

function Articles() {
  const features = [
    {
      id: 1,
      title: "دارای بهترین خانه های شهر",
      icon: <FaGlobe />,
      description:
        "نکته بعدی در مورد متن ساختگی لورم ایپسوم این است که بعضی از طراحان وبسایت و گرافیست کاران بعد از آنکه قالب و محتوای مورد نظرشون را ایجاد",
    },
    {
      id: 2,
      title: "کلید خانه شما در دست ماست",
      icon: <FaKey />,
      description:
        "نکته بعدی در مورد متن ساختگی لورم ایپسوم این است که بعضی از طراحان وبسایت و گرافیست کاران بعد از آنکه قالب و محتوای مورد نظرشون را ایجاد",
    },
    {
      id: 3,
      title: "امنیت خانه ها برایمان مهم است",
      icon: <FaLockOpen />,
      description:
        "نکته بعدی در مورد متن ساختگی لورم ایپسوم این است که بعضی از طراحان وبسایت و گرافیست کاران بعد از آنکه قالب و محتوای مورد نظرشون را ایجاد",
    },
    {
      id: 4,
      title: "از همه نقاط شهر خانه داریم",
      icon: <FaMapMarker />,
      description:
        "نکته بعدی در مورد متن ساختگی لورم ایپسوم این است که بعضی از طراحان وبسایت و گرافیست کاران بعد از آنکه قالب و محتوای مورد نظرشون را ایجاد",
    },
    {
      id: 5,
      title: "دارای بهترین خانه های شهر",
      icon: <FaPersonShelter />,
      description:
        "نکته بعدی در مورد متن ساختگی لورم ایپسوم این است که بعضی از طراحان وبسایت و گرافیست کاران بعد از آنکه قالب و محتوای مورد نظرشون را ایجاد",
    },
    {
      id: 6,
      title: "دارای بهترین خانه های شهر",
      icon: <FaTrophy />,
      description:
        "نکته بعدی در مورد متن ساختگی لورم ایپسوم این است که بعضی از طراحان وبسایت و گرافیست کاران بعد از آنکه قالب و محتوای مورد نظرشون را ایجاد",
    },
  ];

  return (
    <>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.sectionSubtitle}>املاک K&S</span>
          <h2>جدیدترین مقالات</h2>
          <p>آنچه باید هنگام خرید و فروش یا رهن و اجاره املاک بدانید</p>
        </div>

        <Button className={styles.btn}>
          <Link href="/homeDetails">مشاهده همه مقالات</Link>
        </Button>
      </div>
      <section className={styles.featurs}>
        {features.map((feature) => (
          <article key={feature.id} className={styles.featur}>
            <span className={styles.featur__icon}>{feature.icon}</span>

            <h4>{feature.title}</h4>

            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </>
  );
}

export default Articles;
