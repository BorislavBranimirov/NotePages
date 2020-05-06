import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeleteNoteBtn from './DeleteNoteBtn';
import { checkTokenExpiry } from '../../utils/authUtils';

const NotePage = (props) => {
    const [note, setNote] = useState(null);
    const [loaded, setLoaded] = useState(false);
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
                    setErrorMessage('Note not found');
                    return setLoaded(true);
                }
                // check if an error was returned
                if (item.err) {
                    setErrorMessage(item.err);
                    return setLoaded(true);
                }

                setNote(item);
                setLoaded(true);
            } catch (err) {
                setErrorMessage('Error occured while loading note');
            }
        };

        fetchItems();
    }, []);

    let header = <h2>Loading...</h2>;
    if (loaded) {
        if (note) {
            console.log(note.createdAt)
            header = <React.Fragment>
                <h2>{note.title}</h2>
                <p>{Date(note.createdAt).toString()}</p>
            </React.Fragment>;
        } else {
            header = <h2 className="error">404</h2>;
        }
    }

    return (
        <div className="note-page">
            <div className="note-wrapper">
                <div className="note-header">
                    <div className="note-header-info">
                        {header}
                    </div>
                    {note && (
                        <div className="note-header-btns">
                            <Link
                                to={'/notes/' + props.match.params.id + '/edit'}
                                className="note-edit-btn"
                            >Edit</Link>
                            <DeleteNoteBtn
                                deleteId={props.match.params.id}
                                className="note-delete-btn"
                            />
                        </div>
                    )}
                </div>
                <p className="note-body">
                    {note ? (
                        note.body
                    ) : (
                            errorMessage
                        )}
                </p>
                <div className="note-footer"></div>
            </div>
        </div>
    );
};

export default NotePage;