import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotesPage = (props) => {
    const [notes, setNotes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
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
                    return setErrorMessage(item.err);
                }

                setNotes(items);
            } catch (err) {
                setErrorMessage('Error occured while loading notes');
            }
        };

        fetchItems();
    }, []);

    const noteListItems = notes.map((note) =>
        <li key={note._id}>
            <Link to={'/notes/' + note._id}><h3>{note.title}</h3></Link>
            <p>{note.createdAt}</p>
            <p>{note.body}</p>
        </li>
    );

    return (
        <div className="notes-container">
            <Link to="create-note">Create a new note</Link>
            <div className="error">{errorMessage}</div>
            <ul>{noteListItems}</ul>
        </div>
    );
};

export default NotesPage;