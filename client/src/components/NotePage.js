import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeleteNoteBtn from './DeleteNoteBtn';
import { checkTokenExpired } from '../../utils/authUtils';
import dayjs from 'dayjs';
import styles from './NotePage.module.scss';

import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

const NotePage = (props) => {
  const [note, setNote] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const expired = await checkTokenExpired();
        if (expired) {
          return props.history.push('/login');
        }

        const res = await fetch('/api/notes/' + props.match.params.id, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
        });

        const item = await res.json();
        if (!item) {
          setErrorMessage('Note not found');
          return setLoaded(true);
        }
        if (item.err) {
          setErrorMessage(item.err);
          return setLoaded(true);
        }

        setNote(item);
        setLoaded(true);
      } catch (err) {
        setErrorMessage('Error occured while loading note');
      }
    };

    fetchItems();
  }, [props.match.params.id, props.history]);

  if (!loaded) {
    return null;
  }

  return (
    <div className={styles.notePage}>
      <div className={styles.noteWrapper}>
        <div className={styles.noteHeader}>
          <div className={styles.noteHeaderInfo}>
            {note ? (
              <React.Fragment>
                <h2>{note.title}</h2>
                <p>
                  Date: {dayjs(note.createdAt).format('Do MMM YYYY, HH:mm:ss')}
                </p>
              </React.Fragment>
            ) : (
              <h2 className={styles.error}>404</h2>
            )}
          </div>
          {note && (
            <div className={styles.noteHeaderBtns}>
              <Link
                to={'/notes/' + props.match.params.id + '/edit'}
                className={styles.editBtn}
              >
                Edit
              </Link>
              <DeleteNoteBtn
                deleteId={props.match.params.id}
                className={styles.deleteBtn}
              />
            </div>
          )}
        </div>
        <p className={styles.noteBody}>{note ? note.body : errorMessage}</p>
        <div className={styles.noteFooter}></div>
      </div>
    </div>
  );
};

export default NotePage;
