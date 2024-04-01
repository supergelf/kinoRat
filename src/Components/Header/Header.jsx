import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "/logo/logo.png";
import profile from "/profile.svg";
import search from "/search.svg";
import { useRef, useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const inputRef = useRef();

  const goToHomePage = () => {
    navigate("/");
  };

  const handleSearch = () => {
    if (searchInput.length > 0) {
      navigate(`/search/${searchInput.toLowerCase()}`, { state: searchInput });
      setSearchInput("");
      inputRef.current.blur();
    }
  };

  return (
    <div className="headerWrapper">
      <div className="headerRoot">
        <div className="headerTitleWrapper" onClick={goToHomePage}>
          <img className="headerLogo" src={logo} />
          <h2 className="headerTitle">flims</h2>
        </div>
        <div className="headerLinkWrapper">
          <NavLink className="headerLink">
            <img className="headerProfileIcon" src={profile} />
            <p className="headerProfileText">Profile</p>
          </NavLink>
          <NavLink className="headerLink">Settings</NavLink>
          <NavLink className="headerLink">About</NavLink>
        </div>
        <div className="headerSearchWrapper">
          <input
            ref={inputRef}
            className="headerSearchBar"
            placeholder="Search flims..."
            spellCheck="false"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleSearch(e);
              }
            }}
            value={searchInput}
          />
          <img className="headerSearchIcon" src={search} />
        </div>
      </div>
    </div>
  );
}

export default Header;
