import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "../src/pages/Home.jsx";
import About from "../src/pages/About.jsx";
import ClanInfo from "../src/pages/ClanInfo.jsx";
import Navbar from "../src/components/Nav/Navbar.jsx";
import MemberList from "./pages/MemberList.jsx";
import WarLogPage from "./pages/warLog.jsx";
import WarDetail from "./pages/WarDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <Navbar />
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/claninfo" element={<ClanInfo />} />
          <Route path="/memberlist" element={<MemberList />} />
          <Route path="/warlog" element={<WarLogPage />} />
          <Route path="/war-detail" element={<WarDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    </Router>
  );
}
export default App;
