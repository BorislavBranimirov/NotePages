import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import NotesList from './NotesList';
import Pagination from './Pagination';
import { checkTokenExpiry } from '../../utils/authUtils';
import { updateQuery, getQueryObj } from '../../utils/queryUtils';
import styles from './NotesPage.module.scss';

async function fetchNotes(url, props, setNotes, setErrorMessage, page, totalPages) {
    try {
        const expired = await checkTokenExpiry();
        if (expired) {
            return props.history.push('/login');
        }

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        const resJSON = await res.json();

        // check if an error was returned
        if (resJSON.err) {
            return setErrorMessage(resJSON.err);
        }
        page.current = resJSON.page;

        if (resJSON.limit === 0) {
            return setErrorMessage('Error occured while loading notes');
        }
        totalPages.current = Math.ceil(resJSON.count / resJSON.limit);

        setNotes(resJSON.notes);
    } catch (err) {
        setErrorMessage('Error occured while loading notes');
    }
}

// default order;
let _defaultOrder = 'date-desc';

const NotesPage = (props) => {
    const [notes, setNotes] = useState([]);
    const [order, setOrder] = useState(_defaultOrder);
    const [search, setSearch] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    const history = useHistory();
    let page = useRef(null);
    let totalPages = useRef(null);
    // whether changing the search value should cause its useEffect hook to execute
    const shouldRenderSearch = useRef(false);
    // whether changing the order value should cause its useEffect hook to execute
    const shouldRenderOrder = useRef(false);

    // fetch notes every time order value changes
    useEffect(() => {
        // ignore first change, as that is fired on initialisation, render on every other change
        if (!shouldRenderOrder.current) {
            shouldRenderOrder.current = true;
            return;
        }

        const newQuery = updateQuery({ 'order': order, 'page': 1 });
        history.push('/notes' + newQuery);
    }, [order]);

    // fetch notes every time search value changes
    useEffect(() => {
        // ignore first change, as that is fired on initialisation, render on every other change
        if (!shouldRenderSearch.current) {
            shouldRenderSearch.current = true;
            return;
        }

        const newQuery = updateQuery({ 'search': search, 'page': 1 });
        history.push('/notes' + newQuery);
    }, [search]);

    // fetch new notes everytime query changes or on initialisation
    useEffect(() => {
        const queryObj = getQueryObj();
        // if on change of query, search parameter is set but search input field doesn't have the same value
        // or has no value, update it, and don't cause its useEffect hook to fire again
        if (queryObj.search && queryObj.search !== search) {
            shouldRenderSearch.current = false;
            setSearch(queryObj.search);
        }
        // if there is no search parameter, but search input field has text, remove it
        // used for when going backwards from to a page with a search param to a page without, for example
        if (!queryObj.search && search !== '') {
            shouldRenderSearch.current = false;
            setSearch('');
        }

        // if on change of query, order parameter is set but order menu doesn't have the same value
        // or has no value, update it, and don't cause its useEffect hook to fire again
        if (queryObj.order && queryObj.order !== order) {
            shouldRenderOrder.current = false;
            setOrder(queryObj.order);
        }
        // if there is no order parameter, but order menu doesn't have the default selected, change it
        // used for when going backwards from to a page with an order param to a page without, for example
        if (!queryObj.order && order !== _defaultOrder) {
            shouldRenderOrder.current = false;
            setOrder(_defaultOrder);
        }

        fetchNotes('/api/notes' + location.search, props, setNotes, setErrorMessage, page, totalPages);

        // reset scroll to top of page
        window.scrollTo(0, 0);
    }, [location.search]);

    const handleChange = (event) => {
        switch (event.target.name) {
            case 'order-menu':
                setOrder(event.target.value);
                break;
            case 'search-field':
                setSearch(event.target.value);
                break;
        }
    }

    const handleDelete = () => {
        // if deleting the last note on the last page, make the previous page current when fetching
        if (notes.length === 1 && page.current > 1) {
            const query = updateQuery({ 'page': page.current - 1 });
            history.push('/notes' + query);
            return;
        }

        // otherwise just fetch normally
        fetchNotes('/api/notes' + location.search, props, setNotes, setErrorMessage, page, totalPages);
    };

    return (
        <div className={styles.notesContainer}>
            <div className={styles.notesContainerBtns}>
                <Link to="create-note" className={styles.createNoteBtn}>Create a new note</Link>
                <select
                    name="order-menu"
                    value={order}
                    onChange={handleChange}
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
                    onChange={handleChange}
                />
            </div>
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
            <NotesList notes={notes} deleteHandler={handleDelete} />
            <Pagination currentPage={page} totalPages={totalPages} />
        </div>
    );
};

export default NotesPage;