import logo from "./logo.svg";
import "./App.css";
import Depots from "./pages/Depots";
import { BrowserRouter, Route } from "react-router-dom";
import DepotPage from "./pages/DepotPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Depots}></Route>
        <Route path="/depotPage/:id" component={DepotPage}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
