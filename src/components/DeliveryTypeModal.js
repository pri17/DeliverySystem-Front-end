import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import axios from "axios";
import React, { Component } from "react";
import Popup from "../components/Popup";

import styles from "./DeliveryTypeModal.module.css";

//take up 4 parameters:
//showup:is showup
//hideup: is hide
//data
//isEdit: if the operation is editing or add new postcode
class DeliveryTypeModal extends Component {
  state = {
    postcode_prefix: null,
    min_price: null,
    delivery_type_id: null,
    showPopup: false,
    message: null,
    backURL: "",
    id: null,
    errors: {
      postcode_prefix: null,
      min_price: null,
    },
  };

  //get the delivery type id
  // componentDidMount() {
  //   this.setState({
  //     id: this.props.data.delivery_type_id,
  //   });
  // }

  hidePopup = () => {
    this.setState({ showPopup: false });

    window.location.reload();
  };

  inputChange = (event) => {
    let value = event.target.value;
    let name = event.target.id;

    if (name === "postcode_prefix")
      this.setState({
        postcode_prefix: value,
        min_price: this.state.min_price,
        delivery_type_id: this.props.data.delivery_type_id,
      });
    if (name === "min_price")
      this.setState({
        postcode_prefix: this.state.postcode_prefix,
        min_price: value,
        delivery_type_id: this.props.data.delivery_type_id,
      });
  };

  AddNewPopup = () => {
    let errors = this.state.errors;
    let isError = false;

    var regex = /(0|([1-9]\d*))\.\d{2}$/;

    if (!this.state.postcode_prefix || this.state.postcode_prefix === "") {
      errors.postcode_prefix = "Postcode prefix is required!";
      isError = true;
    }

    if (!this.state.min_price || this.state.min_price === "") {
      errors.min_price = "Minimun price is required!";
      isError = true;
    } else if (!this.state.min_price.match(regex)) {
      errors.min_price = "Please input numbers with two decimal";
      isError = true;
    }

    this.setState({ errors: errors });

    if (!isError) {
      const params = {
        postcode_prefix: this.state.postcode_prefix,
        min_price: this.state.min_price,
        delivery_type_id: this.state.delivery_type_id,
      };

      axios
        .post(process.env.REACT_APP_POSTCODE_ADD_URL, params, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
          },
        })
        .then((res) => {
          this.setState({
            showPopup: true,
            message: "Add Sucess!",
            backURL: "deliveryTypes",
          });
        })
        .catch((error) => {
          this.setState({
            showPopup: true,
            message: "Add Failed!",
            backURL: "deliveryTypes",
          });
        });
      this.setState({ postcode_prefix: null, min_price: null }, () => {
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
            <Modal.Title>
              {this.props.isEdit ? "Edit PostCode" : "Add New PostCode"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className={styles.modalBody}>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="postcode_prefix">
                  <Form.Label>
                    Postcode Prefix:
                    {this.props.isEdit ? null : (
                      <span className={styles.formRed}>(required)</span>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Postcode Prefix"
                    value={
                      !this.props.data ? null : this.props.data.postcode_prefix
                    }
                    onChange={this.inputChange}
                    className={
                      this.state.errors.postcode_prefix
                        ? styles.formError
                        : null
                    }
                  />
                  <div className={styles.error}>
                    {this.state.errors.postcode_prefix}
                  </div>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="min_price">
                  <Form.Label>
                    Minimum Price:{" "}
                    {this.props.isEdit ? null : (
                      <span className={styles.formRed}>(required)</span>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter minimum price"
                    value={this.props.data ? this.props.data.min_price : null}
                    onChange={this.inputChange}
                    className={
                      this.state.errors.min_price ? styles.formError : null
                    }
                  />
                  <div className={styles.error}>
                    {this.state.errors.min_price}
                  </div>
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.hideup}>
              Close
            </Button>
            {this.props.isEdit ? (
              <Button variant="primary">Edit</Button>
            ) : (
              <Button variant="primary" onClick={this.AddNewPopup}>
                Add
              </Button>
            )}
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

export default DeliveryTypeModal;
