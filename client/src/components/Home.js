import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles.homePageWrapper}>
      <div className={styles.homePage}>
        <h1>Home Page</h1>
        <p>
          NotePages is a note-taking app where all of the notes are styled like
          dynamic notebook pages.
        </p>
        <p>To get started, go to the sign-up page and create a new account.</p>
        <p>
          After you've logged in, navigate to the notes page where all of your
          notes will be listed. There, you can search for notes and sort them by
          date of creation or title.
        </p>
        <p>
          Press the create note button on the notes page to create a new note.
          Once done, you'll be sent to its page where you can read, edit or
          delete the note.
        </p>
        <p>Source code:</p>
        <a
          href="https://github.com/BorislavBranimirov/NotePages"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
      </div>
    </div>
  );
};

export default Home;
