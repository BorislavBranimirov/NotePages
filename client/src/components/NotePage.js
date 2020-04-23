import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeleteNoteBtn from './DeleteNoteBtn';
import { checkTokenExpiry } from '../../utils/authUtils';

const NotePage = (props) => {
    const [note, setNote] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const expired = await checkTokenExpiry();
                if (expired) {
                    return props.history.push('/login');
                }

                const res = await fetch('/api/notes/' + props.match.params.id, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });

                const item = await res.json();
                //check if an item was found
                if (!item) {
                    return;
                }
                // check if an error was returned
                if (item.err) {
                    return setErrorMessage(item.err);
                }

                setNote(item);
            } catch (err) {
                setErrorMessage('Error occured while loading note');
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="note-page">
            <Link to={'/notes/' + props.match.params.id + '/edit'}>Edit</Link>
            <DeleteNoteBtn deleteId={props.match.params.id} />
            <div className="error">{errorMessage}</div>
            {note &&
                <div className="note-wrapper">
                    <h2>{note.title}</h2>
                    <p>{note.createdAt}</p>
                    <p>{note.body}</p>
                </div>
            }
        </div>
    );
};

export default NotePage;