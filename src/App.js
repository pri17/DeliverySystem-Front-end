import logo from "./logo.svg";
import "./App.css";
import Depots from "./pages/Depots";
import { BrowserRouter, Route } from "react-router-dom";
import DepotPage from "./pages/DepotPage";
import DeliveryTypes from "./pages/DeliveryTypes";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/depots" component={Depots}></Route>
        <Route path="/depots/:id" component={DepotPage}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
