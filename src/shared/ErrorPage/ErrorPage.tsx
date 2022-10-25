import React from 'react';
import styles from './errorpage.css';

interface PropsError {
  title: string,
  onClose: () => void,
}

export function ErrorPage({title, onClose}: PropsError) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {title}
        </h2>
        <button className={styles.btn} onClick={() => onClose()}>
          Close
        </button>
      </div>
    </div>
  );
}
