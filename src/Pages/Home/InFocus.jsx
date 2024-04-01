import "./Home.css";
import "./InFocus.css";

import stills from "../../assets/stills.json";
import movies from "../../assets/movies.json";
import ghibliLogo1 from "/ghibliLogo1.png";

import { useState } from "react";
import { useEffect } from "react";

function InFocus({ backdrop, inFocusPoster }) {
  return (
    <div className="homePageInFocusRoot">
      {backdrop.length != 0 && (
        <div
          className="homePageInFocusBackdropContainer"
          style={{ backgroundImage: `url(${backdrop})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="inFocusFadeOverlay"></div>
        </div>
      )}

      <div className="homePageInFocusMain">
        <div className="inFocusBox1">
          <div className="inFocusPosterWrapper">
            {inFocusPoster.length != 0 && <img className="inFocusPoster" src={inFocusPoster} alt="In Focus Poster" />}
          </div>
        </div>

        <div className="inFocusBox2">
          <div className="inFocusBeforeTitle">
            <h2 className="inFocusBeforeTitleText">In Focus:</h2>
          </div>
          <div className="inFocusTitleWrapper">
            <h1 className="inFocusTitle">HE'S YOUR FRIENDLY NEIGHBOURHOOD FOREST SPIRIT!</h1>
          </div>
          <div className="inFocusTextWrapper">
            <p className="inFocusText">
              Here is a children's film made for the world we should live in, rather than the one we occupy. A film with
              no villains. No fight scenes. No evil adults. No fighting between the two kids. No scary monsters. No
              darkness before the dawn. A world that is benign. A world where if you meet a strange towering creature in
              the forest, you curl up on its tummy and have a nap.
              <span className="inFocusReadMore">read more...</span>
            </p>
          </div>
        </div>

        <div className="inFocusBox3">
          <div className="inFocusBox3ImageWrapper">
            <img className="inFocusBox3Image" src={ghibliLogo1} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InFocus;
