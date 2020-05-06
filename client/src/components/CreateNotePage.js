import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkTokenExpiry } from '../../utils/authUtils';

const CreateNotePage = (props) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const titleEl = document.getElementById('title');
        titleEl.style.height = titleEl.scrollHeight + 'px';

        const bodyEl = document.getElementById('body');
        bodyEl.style.height = bodyEl.scrollHeight + 'px';
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

        const expired = await checkTokenExpiry();
        if (expired) {
            return props.history.push('/login');
        }

        const res = await fetch('/api/notes', {
            method: 'POST',
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
                    <h2>Create note</h2>
                    <p className="error">{errorMessage}</p>
                    <textarea
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={handleChange}
                        autoFocus
                        required
                    />
                </div>
                <textarea
                    name="body"
                    id="body"
                    value={body}
                    onChange={handleChange}
                    className="note-form-body"
                    required
                />
                <div className="note-form-footer">
                    <input type="submit" value="Create" className="note-form-save-btn" />
                    <Link
                        to="notes"
                        className="note-form-cancel-btn"
                    >Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default CreateNotePage