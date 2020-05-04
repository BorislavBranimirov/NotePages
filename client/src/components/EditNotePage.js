import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { checkTokenExpiry } from '../../utils/authUtils';

const EditNotePage = (props) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const titleRef = useRef();

    useEffect(() => {
        const fetchNote = async () => {
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
                    return setErrorMessage('Note doesn\'t exist');
                }
                // check if an error was returned
                if (item.err) {
                    return setErrorMessage(item.err);
                }

                setTitle(item.title);
                setBody(item.body);
                const titleEl = document.getElementById('title');
                titleEl.style.height = titleEl.scrollHeight + 'px';

                const bodyEl = document.getElementById('body');
                bodyEl.style.height = bodyEl.scrollHeight + 'px';

                // move focus to the end of input
                titleRef.current.focus();
                titleRef.current.setSelectionRange(item.title.length, item.title.length);
            } catch (err) {
                setErrorMessage('Error occured while loading note');
            }
        };

        fetchNote();
    }, []);

    const handleChange = (event) => {
        switch (event.target.name) {
            case 'title':
                setTitle(event.target.value);
                break;
            case 'body':
                setBody(event.target.value);
                break;
        }
        event.target.style.height = '0';
        event.target.style.height = event.target.scrollHeight + 'px';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const res = await fetch('/api/notes/' + props.match.params.id, {
            method: 'PATCH',
            body: JSON.stringify({
                title,
                body
            }),
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

        props.history.push('/notes/' + resJSON.id);
    };

    return (
        <div className="note-form-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="note-form-header">
                    <h2>Edit note <i className="fas fa-pencil-alt"></i></h2>
                    <p className="error">{errorMessage}</p>
                    <textarea
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={handleChange}
                        ref={titleRef}
                        required
                    />
                </div>
                {body && (
                    <textarea
                        name="body"
                        id="body"
                        value={body}
                        onChange={handleChange}
                        className="note-form-body"
                        required
                    />
                )}
                <div className="note-form-footer">
                    {body && (
                        <React.Fragment>
                            <Link
                                to={'/notes/' + props.match.params.id}
                                className="note-form-cancel-btn"
                            >Cancel</Link>
                            <input type="submit" value="Save" className="note-form-save-btn" />
                        </React.Fragment>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditNotePage