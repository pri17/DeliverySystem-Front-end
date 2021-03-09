import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import axios from "axios";
import React, { Component } from "react";
import Popup from "./Popup";

import styles from "./PostCodeModal.module.css";

//take up 4 parameters:
//showup:is showup
//hideup: is hide
//data
//isEdit: if the operation is editing or add new postcode
class PostCodeModal extends Component {
  state = {
    postcode_prefix: null,
    min_price: null,
    delivery_type_id: null,
    showPopup: false,
    message: null,
    backURL: "",
    id: null, //postcode id
    errors: {
      postcode_prefix: null,
      min_price: null,
    },
    isEdit: false,
  };

  hidePopup = () => {
    this.setState({
      showPopup: false,
    });

    window.location.reload();
  };

  inputChange = (event) => {
    let value = event.target.value;
    let name = event.target.id;

    if (name === "postcode_prefix")
      this.setState({
        postcode_prefix: value,
        min_price: this.state.min_price,
      });
    if (name === "min_price")
      this.setState({
        postcode_prefix: this.state.postcode_prefix,
        min_price: value,
      });
  };

  componentWillReceiveProps(nextProps) {
    // update state from props.
    this.setState({
      id: nextProps.data.id,
      postcode_prefix: nextProps.data.postcode_prefix,
      min_price: nextProps.data.min_price,
      delivery_type_id: nextProps.data.delivery_type_id,
      isEdit: nextProps.isEdit,
    });
  }

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
    } else if (!this.state.min_price.toString().match(regex)) {
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
        .post(
          //Change URL if in editing mode
          this.state.isEdit
            ? process.env.REACT_APP_POSTCODE_ADD_URL + "/" + this.state.id
            : process.env.REACT_APP_POSTCODE_ADD_URL,
          params,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=utf-8",
            },
          }
        )
        .then((res) => {
          this.setState({
            showPopup: true,
            message: this.state.isEdit ? "Edit Success" : "Add Sucess!",
            backURL: "deliveryTypes",
          });
        })
        .catch((error) => {
          this.setState({
            showPopup: true,
            message: this.state.isEdit ? "Edit Failed" : "Add Failed!",
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
              {this.state.isEdit ? "Edit PostCode" : "Add New PostCode"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className={styles.modalBody}>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="postcode_prefix">
                  <Form.Label>
                    Postcode Prefix:
                    {this.state.isEdit ? null : (
                      <span className={styles.formRed}>(required)</span>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      !this.state.postcode_prefix
                        ? !this.props.data.postcode_prefix
                          ? null
                          : this.props.data.postcode_prefix
                        : this.state.postcode_prefix
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
                    {this.state.isEdit ? null : (
                      <span className={styles.formRed}>(required)</span>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      this.state.min_price
                        ? this.state.min_price
                        : !this.props.data.min_price
                        ? null
                        : this.props.data.min_price
                    }
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
            {this.state.isEdit ? (
              <Button variant="primary" onClick={this.AddNewPopup}>
                Edit
              </Button>
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

export default PostCodeModal;
