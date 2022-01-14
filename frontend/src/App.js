// import logo from "./logo.svg";
import "./App.css";
import Calender from "./calendar/Calendar";
import CafeMap from "./map/map";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Calender></Calender>
      <CafeMap />
    </div>
  );
}

export default App;
