import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import NotesList from './NotesList';
import Pagination from './Pagination';
import { checkTokenExpired } from '../../utils/authUtils';
import { generateQueryString } from '../../utils/queryUtils';
import styles from './NotesPage.module.scss';

async function fetchNotes(
  url,
  historyPush,
  setNotes,
  setErrorMessage,
  setCurrentPage,
  setTotalPages
) {
  try {
    const expired = await checkTokenExpired();
    if (expired) {
      return historyPush('/login');
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
    });

    const resJSON = await res.json();
    if (resJSON.err) {
      return setErrorMessage(resJSON.err);
    }

    setCurrentPage(resJSON.page);

    if (resJSON.limit === 0) {
      return setErrorMessage('Error occured while loading notes');
    }
    setTotalPages(Math.ceil(resJSON.count / resJSON.limit) || 1);

    setNotes(resJSON.notes);
  } catch (err) {
    setErrorMessage('Error occured while loading notes');
  }
}

// default notes order
const _defaultOrder = 'date-desc';

const NotesPage = (props) => {
  const [notes, setNotes] = useState([]);
  const [order, setOrder] = useState(_defaultOrder);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const history = useHistory();

  useLayoutEffect(() => {
    const queryObj = queryString.parse(location.search);
    setSearch(queryObj.search || '');
    setOrder(queryObj.order || _defaultOrder);
  }, [location.search]);

  useEffect(() => {
    fetchNotes(
      '/api/notes' + location.search,
      props.history.push,
      setNotes,
      setErrorMessage,
      setCurrentPage,
      setTotalPages
    );

    // reset scroll to top of page
    window.scrollTo(0, 0);
  }, [location.search, props.history.push]);

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
    const newQuery = generateQueryString(location.search, {
      order: e.target.value,
      page: 1,
    });
    history.push('/notes' + newQuery);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    const newQuery = generateQueryString(location.search, {
      search: e.target.value,
      page: 1,
    });
    history.push('/notes' + newQuery);
  };

  const handleDelete = () => {
    // if deleting the only note on the last page, making it empty
    // redirect to the previous page when fetching
    if (notes.length === 1 && currentPage > 1) {
      const newQuery = generateQueryString(location.search, {
        page: currentPage - 1,
      });
      history.push('/notes' + newQuery);
      return;
    }

    // otherwise refetch the page to get up-to-date page results
    fetchNotes(
      '/api/notes' + location.search,
      props.history.push,
      setNotes,
      setErrorMessage,
      setCurrentPage,
      setTotalPages
    );
  };

  return (
    <div className={styles.notesContainer}>
      <div className={styles.notesContainerBtns}>
        <Link to="create-note" className={styles.createNoteBtn}>
          Create a new note
        </Link>
        <select
          name="order-menu"
          value={order}
          onChange={handleOrderChange}
          className={styles.orderMenu}
        >
          <option value="name-asc">Name Ascending</option>
          <option value="name-desc">Name Descending</option>
          <option value="date-asc">Date Ascending</option>
          <option value="date-desc">Date Descending</option>
        </select>
        <input
          type="text"
          name="search-field"
          id="search-field"
          className={styles.searchField}
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      <NotesList notes={notes} deleteHandler={handleDelete} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default NotesPage;
