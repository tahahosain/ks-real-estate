import styles from "./Input.module.css";

export default function Input({
  label,
  error,
  hint,
  startIcon,
  endIcon,
  className = "",
  ...props
}) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={`${styles.wrapper} ${error ? styles.wrapperError : ""}`}>
        {startIcon && <span className={styles.icon}>{startIcon}</span>}

        <input className={`${styles.input} ${className}`} {...props} />

        {endIcon && <span className={styles.icon}>{endIcon}</span>}
      </div>

      {hint && !error && <small className={styles.hint}>{hint}</small>}

      {error && <small className={styles.error}>{error}</small>}
    </div>
  );
}
