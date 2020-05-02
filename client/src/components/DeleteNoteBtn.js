import React from 'react';
import { useHistory } from "react-router-dom";
import { checkTokenExpiry } from '../../utils/authUtils';

const DeleteNoteBtn = (props) => {
    let history = useHistory();

    const handleClick = async (event) => {
        const expired = await checkTokenExpiry();
        if(expired) {
            return history.push('/login');
        }

        const res = await fetch('/api/notes/' + props.deleteId, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        const resJSON = await res.json();
        if(resJSON.err) {
            return alert('Failed to delete note');
        }

        const dest = '/notes';
        if(history.location.pathname !== dest) {
            history.push(dest);
        } else {
            // run passed-down function from notes page
            props.onClick();
        }
    };

    return (
        <button onClick={handleClick} className={props.className}>
            Delete
        </button>
    );
};

export default DeleteNoteBtn;