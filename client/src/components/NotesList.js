import React from 'react';
import { Link } from 'react-router-dom';
import DeleteNoteBtn from './DeleteNoteBtn';

const NotesList = (props) => {
    const noteListItems = props.notes.map((note) =>
        <li key={note._id} className="notes-list-item">
            <div className="notes-list-item-header">
                <div className="note-header-title-wrapper">
                    <h3>{note.title}</h3>
                </div>
            </div>
            <div className="notes-list-item-info">
                <p className="note-list-item-date">Created at:</p>
                <p className="note-list-item-date">{note.createdAt}</p>
            </div>
            <div className="notes-list-item-btns">
                <Link to={'/notes/' + note._id} className="notes-list-item-open-btn">Open</Link>
                <DeleteNoteBtn
                    onClick={props.deleteHandler}
                    deleteId={note._id}
                    className="notes-list-item-delete-btn"
                />
            </div>
        </li>
    );

    return (
        <ul className="notes-list">
            {noteListItems}
        </ul>
    );
};

export default NotesList;