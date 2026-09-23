import { Routes, Route } from "react-router-dom";
import WeatherPage from "./pages/Weather";
import ForecastDayPage from "./pages/ForecastDayPage";
import { Guitar } from "lucide-react";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WeatherPage />} />
      <Route path="/weather/:city/:date" element={<ForecastDayPage />} />
    </Routes>
  );
}

export default App;
     

// <Guitarfrkor>
//   frofrfrfrifjrfjio
// </Guitarfrkor>