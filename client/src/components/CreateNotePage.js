import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkTokenExpiry } from '../../utils/authUtils';
import styles from './NoteForm.module.scss';

const CreateNotePage = (props) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // adjust textarea height to be the maximum and not have scroll bars
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

        const oldScroll = document.documentElement.scrollTop;
        // adjust textarea height to be the maximum and not have scroll bars
        // set to 0px before the change to address an issue with some browsers
        event.target.style.height = '0';
        event.target.style.height = event.target.scrollHeight + 'px';

        // if cursor is on the end of note body, scroll to bottom of page, so footer is visible
        if (event.target.name === 'body' &&
            (event.target.selectionStart === event.target.value.length)
        ) {
            window.scrollTo(0, document.body.scrollHeight);
        } else {
            // otherwise scroll to previous scroll height after changing textarea height
            window.scrollTo(0, oldScroll);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
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
        } catch (err) {
            setErrorMessage('Error occured while creating note');
        }
    };

    return (
        <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit}>
                <div className={styles.formHeader}>
                    <h2>Create note</h2>
                    <p className={styles.error}>{errorMessage}</p>
                    <textarea
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={handleChange}
                        className={styles.formTitle}
                        autoFocus
                        required
                    />
                </div>
                <textarea
                    name="body"
                    id="body"
                    value={body}
                    onChange={handleChange}
                    className={styles.formBody}
                    required
                />
                <div className={styles.formFooter}>
                    <input type="submit" value="Create" className={styles.saveBtn} />
                    <Link
                        to="notes"
                        className={styles.cancelBtn}
                    >Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default CreateNotePage