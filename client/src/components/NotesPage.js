import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DeleteNoteBtn from './DeleteNoteBtn';
import { checkTokenExpiry } from '../../utils/authUtils';

async function fetchNotes(url, props, setNotes, setErrorMessage) {
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

        const items = await res.json();
        // check if an error was returned
        if (items.err) {
            return setErrorMessage(items.err);
        }

        setNotes(items);
    } catch (err) {
        setErrorMessage('Error occured while loading notes');
    }
}

const NotesPage = (props) => {
    const [notes, setNotes] = useState([]);
    const [order, setOrder] = useState('date-asc');
    const [search, setSearch] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchNotes('/api/notes', props, setNotes, setErrorMessage);
    }, []);

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

    // fetch notes every time order value changes
    // don't fetch on first render
    const firstOrderRender = useRef(true);
    useEffect(() => {
        if (firstOrderRender.current) {
            firstOrderRender.current = false;
            return;
        }
        let url = '/api/notes';
        if (order) {
            url += '?order=' + order;
        }
        fetchNotes(url, props, setNotes, setErrorMessage);
    }, [order]);

    // fetch notes every time search value changes
    // don't fetch on first render
    const firstSearchRender = useRef(true);
    useEffect(() => {
        if (firstSearchRender.current) {
            firstSearchRender.current = false;
            return;
        }
        let url = '/api/notes';
        if (search) {
            url += '?search=' + search;
        }
        fetchNotes(url, props, setNotes, setErrorMessage);
    }, [search]);

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
                <DeleteNoteBtn deleteId={note._id} className="notes-list-item-delete-btn" />
            </div>
        </li>
    );

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
                    onChange={handleChange}
                />
            </div>
            {errorMessage && <div className="error">{errorMessage}</div>}
            <ul className="notes-list">{noteListItems}</ul>
        </div>
    );
};

export default NotesPage;