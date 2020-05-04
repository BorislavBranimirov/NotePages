import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import DeleteNoteBtn from './DeleteNoteBtn';
import { checkTokenExpiry } from '../../utils/authUtils';
import queryString from 'query-string';

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

function updateQuery(paramObj, oldQuery = null) {
    let queryToUpdate = oldQuery || location.search;
    // add or update query parameter
    const queryObj = queryString.parse(queryToUpdate);
    for (let key in paramObj) {
        queryObj[key] = paramObj[key];
    }
    let newQuery = queryString.stringify(queryObj, {
        skipNull: true,
        skipEmptyString: true,
    });
    if (newQuery.length > 0) {
        newQuery = '?' + newQuery;
    }
    return newQuery;
}

// default order;
let _defaultOrder = 'date-asc';

const NotesPage = (props) => {
    const [notes, setNotes] = useState([]);
    const [order, setOrder] = useState(_defaultOrder);
    const [search, setSearch] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    const history = useHistory();
    let page = useRef(null);
    let totalPages = useRef(null);
    // if changing the search value should cause its useEffect hook to rerender
    const shouldRenderSearch = useRef(false);
    // if changing the order value should cause its useEffect hook to rerender
    const shouldRenderOrder = useRef(false);

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

    // fetch new notes everytime query changes or on initialisation
    useEffect(() => {
        const queryObj = queryString.parse(location.search);
        // if on change of query, search parameter is set but search input field doesn't have the same value
        // or has no value, update it, and don't cause its useEffect hook to fire again
        if (queryObj.search && queryObj.search !== search) {
            shouldRenderSearch.current = false;
            setSearch(queryObj.search);
        }
        // if no search param, but search input field has text, remove it
        // used for when going backward from to a page with a search param to a page without, for example
        if (!queryObj.search && search!=='') {
            shouldRenderSearch.current = false;
            setSearch('');
        }
        
        // if on change of query, order parameter is set but order menu doesn't have the same value
        // or has no value, update it, and don't cause its useEffect hook to fire again
        if (queryObj.order && queryObj.order !== order) {
            shouldRenderOrder.current = false;
            setOrder(queryObj.order);
        }
        // if no order param, but order menu doesn't have the default selected, change it
        // used for when going backward from to a page with an order param to a page without, for example
        if (!queryObj.order && order !== _defaultOrder) {
            shouldRenderOrder.current = false;
            setOrder(_defaultOrder);
        }

        fetchNotes('/api/notes' + location.search, props, setNotes, setErrorMessage, page, totalPages);
    }, [location.search]);

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

    const changePage = (event) => {
        const newQuery = updateQuery({ 'page': event.target.value });
        history.push('/notes' + newQuery);
    };

    const noteListItems = notes.map((note) =>
        <li key={note._id} className="notes-list-item">
            <div className="notes-list-item-header">
                <div className="note-header-title-wrapper">
                    <h3>{note.title}</h3>
                </div>
            </div>
            <div className="notes-list-item-info">
                <p className="note-list-item-date">Created at:</p>
                <p className="note-list-item-date">{note.createdAt}</p>
            </div>
            <div className="notes-list-item-btns">
                <Link to={'/notes/' + note._id} className="notes-list-item-open-btn">Open</Link>
                <DeleteNoteBtn onClick={handleDelete} deleteId={note._id} className="notes-list-item-delete-btn" />
            </div>
        </li>
    );

    let pageBtns = [];
    for (let i = 1; i <= totalPages.current; i++) {
        let btnClass = (i === page.current) ? "pagination-btn pagination-btn-active" : "pagination-btn";
        pageBtns.push(
            <li key={i}>
                <button className={btnClass} onClick={changePage} value={i}>
                    {i}
                </button>
            </li>
        );
    }

    // add one page if there are none in total
    if (totalPages.current === 0) {
        pageBtns.push(
            <li key="1">
                <button className="pagination-btn pagination-btn-active" onClick={changePage} value={1}>
                    {1}
                </button>
            </li>
        );
    }

    return (
        <div className="notes-container">
            <div className="notes-container-btns">
                <Link to="create-note" className="create-note-btn">Create a new note</Link>
                <select
                    name="order-menu"
                    value={order}
                    onChange={handleChange}
                    className="order-menu"
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
                    className="search-field"
                    placeholder="Search..."
                    value={search}
                    onChange={handleChange}
                />
            </div>
            {errorMessage && <div className="error">{errorMessage}</div>}
            <ul className="notes-list">{noteListItems}</ul>
            <div className="pagination">
                {pageBtns}
            </div>
        </div>
    );
};

export default NotesPage;