import React, { Component } from "react";
import axios from "axios";
import styles from "./Products.module.css";

class Products extends Component {
  state = {
    products: [],
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
        <h1> Products List</h1>
        <ProductsTable data={products} headers={headers} props={this.props} />
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
