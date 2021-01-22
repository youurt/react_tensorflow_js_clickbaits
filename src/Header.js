import React from 'react';
import { AiFillGithub, AiFillFilePdf } from 'react-icons/ai';

const Header = () => {
  return (
    <div className="header-main">
      <a
        href="https://github.com/youurt/german_clickbaits_tensorflow_js/tree/main"
        className="links"
      >
        <AiFillGithub />
        Project
      </a>{' '}
      <a
        href="https://clickbaits.s3.amazonaws.com/Masterarbeit.pdf"
        className="links"
      >
        <AiFillFilePdf />
        Thesis
      </a>
      {/* <div className="text">
        Das Modell wurde auf einem selbst erstellten Datensatz trainiert. Dieser
        Datensatz beinhaltet 20.000 Schlagzeilen, bestehend aus zwei Klassen.
        Das Modell wird vollständig im Browser, in TensorFlow.js ausgeführt und
        ist ca. 3 MB groß.
      </div> */}
    </div>
  );
};

export default Header;
