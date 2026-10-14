import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      {...props}>
      {children}
    </button>
  );
}
