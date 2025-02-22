import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import TestPage from "./TestPage";

export default function BikeSafetyApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test-page" element={<TestPage />} />
      </Routes>
    </Router>
  );
}
