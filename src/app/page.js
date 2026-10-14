import Hero from "@/components/templates/hero/Hero"
import PropertyList from "@/components/features/property/PropertyList";
import Story from "@/components/templates/story/Story";
import Articles from "@/components/templates/Articles/Articles";
import styles from './page.module.css'

export default function Home() {
  return (
    <section className={styles.home}>
      <Hero />
      <PropertyList />
      <Story />
      <Articles />
     
    </section>
  );
}
