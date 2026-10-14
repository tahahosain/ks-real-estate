
import styles from "@/styles/p-admin/StatBlock.module.css";

export default function StatBlock({
  title,
  value,
  description,
  icon,
  variant = "default",
}) {
  return (
    <article
      className={`${styles.statBlock} ${styles[variant]}`}
    >
      <div className={styles.top}>
        <div className={styles.icon}>
          {icon}
        </div>
      </div>

      <div className={styles.content}>
        <span className={styles.title}>
          {title}
        </span>

        <strong className={styles.value}>
          {value.toLocaleString("fa-IR")}
        </strong>

        {description && (
          <span className={styles.description}>
            {description}
          </span>
        )}
      </div>
    </article>
  );
}

