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
    const [search, setSearch] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchNotes('/api/notes', props, setNotes, setErrorMessage);
    }, []);

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    // fetch notes every time search value changes
    // don't fetch on first render
    const firstRender = useRef(true);
    useEffect(() => {
        if(firstRender.current) {
            firstRender.current = false;
            return;
        }
        let url = '/api/notes';
        if(search) {
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