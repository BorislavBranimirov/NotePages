import React from 'react';
import { useHistory } from "react-router-dom";

const DeleteNoteBtn = (props) => {
    let history = useHistory();

    const handleClick = async (event) => {
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

        // if redirecting to a different url, refresh the page to force rerender
        const dest = '/notes';
        if(history.location.pathname !== dest) {
            history.push(dest);
        } else {
            history.go();
        }
    };

    return (
        <button onClick={handleClick}>
            Delete
        </button>
    );
};

export default DeleteNoteBtn;