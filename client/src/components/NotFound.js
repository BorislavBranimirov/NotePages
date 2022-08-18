import React from 'react';
import styles from './NotFound.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFoundPage}>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
};

export default NotFound;
