import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import RoutePlanner from "./RoutePlanner"; 
import SavedRoutes from "./SavedRoutes"; 
import AllRoutes from "./AllRoutes"; 

export default function BikeSafetyApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/route-planner" element={<RoutePlanner />} />
        <Route path="/saved-routes" element={<SavedRoutes />} />
        <Route path="/all-routes" element={<AllRoutes />} />
      </Routes>
    </Router>
  );
}
