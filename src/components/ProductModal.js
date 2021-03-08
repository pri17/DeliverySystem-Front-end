import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import axios from "axios";
import React, { Component } from "react";
import Popup from "./Popup";

import styles from "./DeliveryTypeModal.module.css";

class ProductModal extends Component {
  state = {
    name: null,
    delivery_multiplier: null,
    id: null,
    showPopup: false,
    message: null,
    errors: {
      name: null,
      delivery_multiplier: null,
    },
  };

  hidePopup = () => {
    this.setState({
      showPopup: false,
    });

    window.location.reload();
  };

  inputChange = (event) => {
    if (event.target.id === "name") this.setState({ name: event.target.value });
    if (event.target.id === "delivery_multiplier")
      this.setState({ delivery_multiplier: event.target.value });
  };

  AddNewPopup = () => {
    let errors = this.state.errors;
    let isError = false;

    var regex = /(0|([1-9]\d*))\.\d{2}$/;

    if (!this.state.name || this.state.name === "") {
      errors.name = "Name is required!";
      isError = true;
    }

    if (
      !this.state.delivery_multiplier ||
      this.state.delivery_multiplier === ""
    ) {
      errors.delivery_multiplier = "Delivery Multiplier is required!";
      isError = true;
    } else if (!this.state.delivery_multiplier.toString().match(regex)) {
      errors.delivery_multiplier = "Please input numbers with two decimal";
      isError = true;
    }

    this.setState({ errors: errors });

    if (!isError) {
      const params = {
        name: this.state.name,
        delivery_multiplier: this.state.delivery_multiplier,
      };

      axios
        .post(process.env.REACT_APP_PRODUCTS_LIST_URL, params, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
          },
        })
        .then((res) => {
          this.setState({
            showPopup: true,
            message: "Add Sucess!",
          });
        })
        .catch((error) => {
          this.setState({
            showPopup: true,
            message: "Add Failed!",
          });
        });
      this.setState({ name: null, delivery_multiplier: null }, () => {
        this.props.hideup();
      });
    }
  };

  render() {
    return (
      <div>
        <Modal
          show={this.props.showup}
          className={styles.modal}
          onHide={this.props.hideup}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Product</Modal.Title>
          </Modal.Header>

          <Modal.Body className={styles.modalBody}>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="name">
                  <Form.Label>
                    Name:
                    <span className={styles.formRed}>(required)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    onChange={this.inputChange}
                    className={this.state.errors.name ? styles.formError : null}
                  />
                  <div className={styles.error}>{this.state.errors.name}</div>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="delivery_multiplier">
                  <Form.Label>
                    delivery_multiplier:
                    <span className={styles.formRed}>(required)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    onChange={this.inputChange}
                    className={
                      this.state.errors.delivery_multiplier
                        ? styles.formError
                        : null
                    }
                  />
                  <div className={styles.error}>
                    {this.state.errors.delivery_multiplier}
                  </div>
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.hideup}>
              Close
            </Button>

            <Button variant="primary" onClick={this.AddNewPopup}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        <Popup
          show={this.state.showPopup}
          handleClose={this.hidePopup}
          message={this.state.message}
        ></Popup>
      </div>
    );
  }
}

export default ProductModal;
