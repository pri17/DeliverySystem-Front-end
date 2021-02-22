import logo from "./logo.svg";
import "./App.css";
import Depots from "./pages/Depots";
import { BrowserRouter, Route } from "react-router-dom";
import DepotPage from "./pages/DepotPage";
import DeliveryTypes from "./pages/DeliveryTypes";
import Home from "./pages/Home";
import DTypePage from "./pages/DTypePage";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/depots" component={Depots}></Route>
        <Route path="/depots/:id" component={DepotPage}></Route>
        <Route exact path="/deliveryTypes" component={DeliveryTypes}></Route>
        <Route path="/deliveryTypes/:id" component={DTypePage}></Route>
        <Route exact path="/products" component={Products}></Route>
        <Route path="/products/:id" component={ProductPage}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
