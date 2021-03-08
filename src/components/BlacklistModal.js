import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import axios from "axios";
import React, { Component } from "react";
import Popup from "./Popup";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "./PostCodeModal.module.css";

//take up 4 parameters:
//showup:is showup
//hideup: is hide
//data
class BlacklistModal extends Component {
  state = {
    delivery_type_id: null,
    showPopup: false,
    message: null,
    backURL: "",
    dTypeList: [], // the dropdown list
    id: null, //postcode id
    errors: {
      postcode_prefix: null,
      min_price: null,
    },
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
        delivery_type_id: this.props.data.delivery_type_id,
        id: this.props.data.id,
      });
    if (name === "min_price")
      this.setState({
        postcode_prefix: this.state.postcode_prefix,
        min_price: value,
        delivery_type_id: this.props.data.delivery_type_id,
        id: this.props.data.id,
      });
  };

  AddNewPopup = () => {
    let errors = this.state.errors;
    let isError = false;

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
          this.props.isEdit
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
            <Modal.Title>Add New BlackList</Modal.Title>
          </Modal.Header>

          <Modal.Body className={styles.modalBody}>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="min_price">
                  <Form.Label>
                    Delivery Type:
                    <span className={styles.formRed}>(required)</span>
                  </Form.Label>
                  <Dropdown>
                    <Dropdown.Item eventKey="option-1">option-1</Dropdown.Item>
                    <Dropdown.Item eventKey="option-2">option-2</Dropdown.Item>
                    <Dropdown.Item eventKey="option-3">option 3</Dropdown.Item>
                  </Dropdown>
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
      </div>
    );
  }
}

export default BlacklistModal;
