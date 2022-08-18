import React from 'react';
import { Link } from 'react-router-dom';
import DeleteNoteBtn from './DeleteNoteBtn';
import dayjs from 'dayjs';
import styles from './NotesList.module.scss';

import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

const NotesList = (props) => {
  const noteListItems = props.notes.map((note) => (
    <li key={note._id} className={styles.item}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h3>{note.title}</h3>
        </div>
      </div>
      <div className={styles.info}>
        <p>Date:</p>
        <p>{dayjs(note.createdAt).format('Do MMM YYYY, HH:mm:ss')}</p>
      </div>
      <div className={styles.itemBtns}>
        <Link to={'/notes/' + note._id} className={styles.openBtn}>
          Open
        </Link>
        <DeleteNoteBtn
          onClick={props.deleteHandler}
          deleteId={note._id}
          className={styles.deleteBtn}
        />
      </div>
    </li>
  ));

  return <ul className={styles.notesList}>{noteListItems}</ul>;
};

export default NotesList;
