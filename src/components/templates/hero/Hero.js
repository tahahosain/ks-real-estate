import styles from "./hero.module.css";

import HeroSlider from "./HeroSlider";
import HeroContent from "./HeroContent";
import HeroSearch from "./HeroSearch";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <HeroSlider />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <HeroContent />
        <HeroSearch />
      </div>
    </section>
  );
}
