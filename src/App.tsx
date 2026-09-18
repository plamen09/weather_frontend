import { Routes, Route } from "react-router-dom";
import WeatherPage from "./Pages/Weather";
import ForecastDayPage from "./Pages/ForecastDayPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WeatherPage />} />

      <Route path="/weather/:city/:date" element={<ForecastDayPage />} />
    </Routes>
  );
}

export default App;
