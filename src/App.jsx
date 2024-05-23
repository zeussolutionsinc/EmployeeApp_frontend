import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FillH1bPage from "./pages/FillH1bPage";
import H1bLanding from "./pages/H1bLandingPage";
// import UpdateH1bPage from "./pages/UpdateH1bPage";
// import GetH1bForm from "./componenets/forms/GetH1bForm";
// import WelcomePage from "./pages/WelcomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<H1bLanding />} />
        {/* <Route path="/fillH1B" element={<FillH1bPage />} /> */}
        {/* <Route path="/updateh1B" element={<UpdateH1bPage />} />
        <Route path="/geth1bForm" element={<GetH1bForm />} /> */}
        {/* <Route path="/h1bLanding" element={<H1bLanding />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
