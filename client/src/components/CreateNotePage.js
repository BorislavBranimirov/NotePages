import React, { useState } from 'react';

const CreateNotePage = (props) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

        props.history.push('/notes/'+resJSON.id);
    };

    return (
        <div className="create-note">
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
                <input type="submit" value="Create"/>
            </form>
        </div>
    );
};

export default CreateNotePage