import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeleteNoteBtn from './DeleteNoteBtn';
import { checkTokenExpiry } from '../../utils/authUtils';

const NotesPage = (props) => {
    const [notes, setNotes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const expired = await checkTokenExpiry();
                if (expired) {
                    return props.history.push('/login');
                }

                const res = await fetch('/api/notes', {
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
        };

        fetchItems();
    }, []);

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
            {errorMessage && <div className="error">{errorMessage}</div>}
            <Link to="create-note" className="create-note-btn">Create a new note</Link>
            <ul className="notes-list">{noteListItems}</ul>
        </div>
    );
};

export default NotesPage;