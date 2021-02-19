import logo from "./logo.svg";
import "./App.css";
import Depots from "./pages/Depots";
import { BrowserRouter, Route } from "react-router-dom";
import DepotPage from "./pages/DepotPage";
import DeliveryTypes from "./pages/DeliveryTypes";
import Home from "./pages/Home";
import DTypePage from "./pages/DTypePage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/depots" component={Depots}></Route>
        <Route path="/depots/:id" component={DepotPage}></Route>
        <Route exact path="/deliveryTypes" component={DeliveryTypes}></Route>
        <Route path="/deliveryTypes/:id" component={DTypePage}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
