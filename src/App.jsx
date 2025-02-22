import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import RoutePlanner from "./RoutePlanner";

export default function BikeSafetyApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/route-planner" element={<RoutePlanner />} />
      </Routes>
    </Router>
  );
}
