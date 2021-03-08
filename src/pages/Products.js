import React, { Component } from "react";
import axios from "axios";
import styles from "./Products.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductModal from "../components/ProductModal";

class Products extends Component {
  state = {
    products: [],
    addModal: false,
    ModalData: {
      id: null,
      name: null,
      delivery_multiplier: null,
    },
  };

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_PRODUCTS_LIST_URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        this.setState({
          products: res.data,
        });
      });
  }

  modalHide = () => {
    this.setState({
      addModal: false,
    });
  };

  addNewPopup = () => {
    this.setState({
      addModal: true,
      ModalData: {
        id: null,
        name: null,
        delivery_multiplier: null,
      },
    });
  };

  render() {
    const { products } = this.state;

    const headers = [
      "ID",
      "Name",
      "Delivery Multiplier",
      "Created At",
      "Updated At",
    ];

    return (
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1> Products List</h1>
          <FontAwesomeIcon
            icon={faPlus}
            size="lg"
            onClick={this.addNewPopup}
            className={styles.plusBtn}
          />
        </div>
        <ProductsTable data={products} headers={headers} props={this.props} />

        <ProductModal
          showup={this.state.addModal}
          hideup={this.modalHide}
          data={this.state.ModalData}
        />
      </div>
    );
  }
}

const ProductsTable = ({ data, headers, props }) => {
  const header = headers.map((head) => {
    return <th key={head}>{head}</th>;
  });

  const handleClick = (id) => {
    props.history.push("/products/" + id);
  };

  const bodyData = data.map((record) => {
    return (
      <tr onClick={() => handleClick(record.id)} key={record.id}>
        <td>{record.id}</td>
        <td>{record.name}</td>
        <td>{record.delivery_multiplier}</td>
        <td>{record.created_at}</td>
        <td>{record.updated_at}</td>
      </tr>
    );
  });

  return (
    <div className={styles.content}>
      <table className={styles.table}>
        <thead>
          <tr>{header}</tr>
        </thead>
        <tbody>{bodyData}</tbody>
      </table>
    </div>
  );
};

export default Products;
