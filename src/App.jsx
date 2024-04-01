import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import FilmPage from "./Pages/Film/FilmPage";
import Search from "./Pages/Search/Search";
import PersonPage from "./Pages/Person/PersonPage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film/:param" element={<FilmPage />} />
        <Route path="/person/:param" element={<PersonPage />} />
        <Route path="/search/:param" element={<Search />} />
      </Routes>

      {/* <Footer /> */}
    </>
  );
}

export default App;
