import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { checkTokenExpiry } from '../../utils/authUtils';

const DeleteNoteBtn = (props) => {
    const [showModal, setShowModal] = useState(false);
    const wrapperRef = useRef(null);
    let history = useHistory();

    const handleClick = async (event) => {
        try {
            const expired = await checkTokenExpiry();
            if (expired) {
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
            if (resJSON.err) {
                return alert('Failed to delete note');
            }

            const dest = '/notes';
            if (history.location.pathname !== dest) {
                history.push(dest);
            } else {
                // run passed-down function from notes page
                props.onClick();
            }
        } catch (err) {
            return alert('Failed to delete note');
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowModal(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <React.Fragment>
            {showModal && (
                <div className="delete-modal-wrapper">
                    <div className="delete-modal" ref={wrapperRef}>
                        <h2>Are you sure you want to delete the note?</h2>
                        <div className="delete-modal-btns">
                            <button className="delete-modal-confirm" onClick={handleClick}>
                                Delete
                            </button>
                            <button className="delete-modal-cancel" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => setShowModal(true)} className={props.className}>
                Delete
            </button>
        </React.Fragment>
    );
};

export default DeleteNoteBtn;