import { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Team } from "./components/Team";
import { Info } from "./components/info";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import DemoMain from "./components/Demo/DemoMain";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Router>
        {/* Header Should be in all pages*/}
        <Navigation />

        {/* Routes here */}
        <Routes>
          {/* Home Route */}
          {["/", "/home", "/NLTM_Website/", "/static/index.html"].map(
            (route) => (
              <Route
                key={route}
                path={route}
                element={
                  <>
                    <Header />
                    <Features />
                  </>
                }
              />
            )
          )}

          {/* About Route */}
          <Route
            path="/about"
            element={
              <>
                {/* <About data={landingPageData.About} /> */}
                <Team data={landingPageData.Team} />
              </>
            }
          />
          {/* Demo Route */}
          <Route
            path="/demo"
            element={<DemoMain data={landingPageData.Demo} />}
          />
          {/* Demo Info */}
          <Route path="/info" element={<Info data={landingPageData.Info} />} />
        </Routes>
      </Router>

      {/* Footer */}
      <Contact data={landingPageData.Contact} />
    </div>
  );
};

export default App;
