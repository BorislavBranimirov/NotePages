import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { checkTokenExpired } from '../../utils/authUtils';
import styles from './NoteForm.module.scss';

const EditNotePage = (props) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const titleRef = useRef();

  useLayoutEffect(() => {
    if (loaded) {
      // adjust textarea height to be its maximum and not have scroll bars
      const titleEl = document.getElementById('title');
      titleEl.style.height = titleEl.scrollHeight + 'px';

      const bodyEl = document.getElementById('body');
      bodyEl.style.height = bodyEl.scrollHeight + 'px';

      if (titleRef.current) {
        // move focus to the end of input
        titleRef.current.focus();
        titleRef.current.setSelectionRange(
          titleRef.current.value.length,
          titleRef.current.value.length
        );
      }
    }
  }, [loaded]);

  useEffect(() => {
    const fetchNote = async () => {
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
          return setErrorMessage("Note doesn't exist");
        }
        if (item.err) {
          return setErrorMessage(item.err);
        }

        setTitle(item.title);
        setBody(item.body);
        setLoaded(true);
      } catch (err) {
        setErrorMessage('Error occured while loading note');
      }
    };

    fetchNote();
  }, [props.match.params.id, props.history]);

  const handleChange = (event) => {
    switch (event.target.name) {
      case 'title':
        setTitle(event.target.value);
        break;
      case 'body':
        setBody(event.target.value);
        break;
      default:
        break;
    }
    const oldScroll = document.documentElement.scrollTop;
    // adjust textarea height to be its maximum and not have scroll bars
    // set to 0px before the change to address an issue with some browsers
    event.target.style.height = '0';
    event.target.style.height = event.target.scrollHeight + 'px';

    // if cursor is on the end of note body, scroll to bottom of page, so footer is visible
    if (
      event.target.name === 'body' &&
      event.target.selectionStart === event.target.value.length
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
      const res = await fetch('/api/notes/' + props.match.params.id, {
        method: 'PATCH',
        body: JSON.stringify({
          title,
          body,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
      });

      const resJSON = await res.json();
      if (resJSON.err) {
        return setErrorMessage(resJSON.err);
      }

      props.history.push('/notes/' + resJSON.id);
    } catch (err) {
      setErrorMessage('Error occured while saving note');
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <h2>
            Edit note <FontAwesomeIcon icon={faPencilAlt} />
          </h2>
          <p className={styles.error}>{errorMessage}</p>
          <textarea
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={handleChange}
            ref={titleRef}
            className={styles.formTitle}
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
          <React.Fragment>
            <input type="submit" value="Save" className={styles.saveBtn} />
            <Link
              to={'/notes/' + props.match.params.id}
              className={styles.cancelBtn}
            >
              Cancel
            </Link>
          </React.Fragment>
        </div>
      </form>
    </div>
  );
};

export default EditNotePage;
