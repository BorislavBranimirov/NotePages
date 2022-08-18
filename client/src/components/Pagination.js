import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { generateQueryString } from '../../utils/queryUtils';
import styles from './Pagination.module.scss';

function createPaginationListItems(currentPage, totalPages, onClick) {
  // keep the number odd, so that there are an equal number of buttons around current button
  const maxItems = 7;
  const diff = Math.floor((maxItems - 2) / 2);
  let pageBtns = [];
  // number of the previous rendered button in the list (some may be skipped)
  let lastValue = 0;

  // render at most maxItems number of pagination buttons,
  // including first, current and last page button
  // and diff = (maxItems - 2) / 2 buttons around the current one
  // additional page number buttons are skipped and ellipsis is inserted
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - diff && i <= currentPage + diff)
    ) {
      // add ellipsis if buttons were skipped,
      // i.e. this button's number is not adjacent to the previous one
      if (pageBtns.length > 0 && i - lastValue > 1) {
        pageBtns.push(
          <li key={i + 'empty'}>
            <p className={styles.paginationEmpty}>…</p>
          </li>
        );
      }

      let btnClass =
        i === currentPage
          ? `${styles.paginationBtn} ${styles.paginationBtnActive}`
          : styles.paginationBtn;
      pageBtns.push(
        <li key={i}>
          <button className={btnClass} onClick={onClick} value={i}>
            {i}
          </button>
        </li>
      );
      lastValue = i;
    }
  }

  return pageBtns;
}

const Pagination = (props) => {
  const location = useLocation();
  const history = useHistory();

  const changePage = (event) => {
    const newQuery = generateQueryString(location.search, {
      page: event.target.value,
    });
    history.push('/notes' + newQuery);
  };

  let pageBtns = createPaginationListItems(
    props.currentPage,
    props.totalPages,
    changePage
  );

  return <ul className={styles.pagination}>{pageBtns}</ul>;
};

export default Pagination;
