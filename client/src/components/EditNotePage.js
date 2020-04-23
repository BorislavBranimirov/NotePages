import React, { useState, useEffect } from 'react';

const EditNotePage = (props) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await fetch('/api/notes/' + props.match.params.id, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });

                const item = await res.json();
                //check if an item was found
                if(!item) {
                    return setErrorMessage('Note doesn\'t exist');
                }
                // check if an error was returned
                if (item.err) {
                    return setErrorMessage(item.err);
                }

                setTitle(item.title);
                setBody(item.body);
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
        <div className="edit-note">
            <div className="error">{errorMessage}</div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="body"
                    cols="30"
                    rows="10"
                    value={body}
                    onChange={handleChange}
                    required
                />
                <input type="submit" value="Save" />
            </form>
        </div>
    );
};

export default EditNotePage