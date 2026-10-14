import styles from "../features/PropertyCard/PropertyCard.module.css"


export default function PropertyFeature({ icon, children }) {
  return (
    <li className={styles.feature}>
      <div className={styles.icon}>{icon}</div>

      <span className={styles.value}>{children}</span>
    </li>
  );
}
