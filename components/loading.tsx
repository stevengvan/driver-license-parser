import styles from "./loading.module.css";

export default function Loading() {
  return (
    <>
      <div className={styles.background}>
        <h1 className={styles.loadingText}>Loading</h1>
      </div>
    </>
  );
}
