import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import axios from "axios";
import React, { Component } from "react";
import Popup from "./Popup";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "./PostCodeModal.module.css";

class DeliveryPriceModal extends Component {
  state = {
    price_per_mile: null,
    min_price: null,
    delivery_type_id: null,

    showPopup: false,
    message: null,
    price_id: null, //price id
    errors: {
      price_per_mile: null,
      min_price: null,
      delivery_type_id: null,
    },
    depot_id: null,
    isEdit: null,
    dTypeList: [],
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

    this.setState({
      [name]: value,
    });
  };

  componentDidMount() {
    //get type list
    axios
      .get(process.env.REACT_APP_DELIVERYTYPE_LIST_URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {
        this.setState({
          dTypeList: res.data,
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      depot_id: nextProps.editData.depot_id,
      price_per_mile: nextProps.editData.price_per_mile,
      min_price: nextProps.editData.min_price,
      delivery_type_id: nextProps.editData.delivery_type_id,

      isEdit: nextProps.isEdit,
      price_id: nextProps.editData.price_id,
    });

    //console.log(nextProps);
  }

  AddNewPopup = () => {
    let errors = this.state.errors;
    let isError = false;

    var regex = /(0|([1-9]\d*))\.\d{2}$/;

    if (!this.state.price_per_mile || this.state.price_per_mile === "") {
      errors.price_per_mile = "Price per mile is required!";
      isError = true;
    }

    if (!this.state.min_price || this.state.min_price === "") {
      errors.min_price = "Minimun price is required!";
      isError = true;
    } else if (!this.state.min_price.toString().match(regex)) {
      errors.min_price = "Please input numbers with two decimal";
      isError = true;
    }

    if (!this.state.delivery_type_id) {
      errors.delivery_type_id = "One type is required to be selected!";
      isError = true;
    }

    this.setState({ errors: errors });

    if (!isError) {
      const params = {
        price_per_mile: this.state.price_per_mile,
        min_price: this.state.min_price,
        delivery_type_id: this.state.delivery_type_id,
        depot_id: this.state.depot_id,
      };

      axios
        .post(
          //Change URL if in editing mode
          this.state.isEdit
            ? process.env.REACT_APP_PRICES_URL + "/" + this.state.price_id
            : process.env.REACT_APP_PRICES_URL,
          params,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=utf-8",
            },
          }
        )
        .then((res) => {
          console.log(this.state);
          this.setState({
            showPopup: true,
            message: this.state.isEdit ? "Edit Success" : "Add Sucess!",
          });
        })
        .catch((error) => {
          this.setState({
            showPopup: true,
            message: this.state.isEdit ? "Edit Failed" : "Add Failed!",
          });
        });
      this.setState(
        { price_per_mile: null, min_price: null, delivery_type_id: null },
        () => {
          this.props.hideup();
        }
      );
    }
  };

  setDropdownType = (eventKey, event) => {
    this.setState({
      delivery_type_id: eventKey,
    });
  };

  render() {
    const typeDropdown = !this.state.dTypeList
      ? null
      : this.state.dTypeList.map((item) => {
          return (
            <Dropdown.Item
              eventKey={item.id}
              onSelect={this.setDropdownType}
              active={item.id === this.state.delivery_type_id ? true : false}
            >
              {item.name}
            </Dropdown.Item>
          );
        });

    return (
      <div>
        <Modal
          show={this.props.showup}
          className={styles.modal}
          onHide={this.props.hideup}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {this.state.isEdit
                ? "Edit Delivery Price"
                : "Add New Delivery Price"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className={styles.modalBody}>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="price_per_mile">
                  <Form.Label>
                    Price Per Mile:
                    {this.state.isEdit ? null : (
                      <span className={styles.formRed}>(required)</span>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.price_per_mile}
                    onChange={this.inputChange}
                    className={
                      this.state.errors.price_per_mile ? styles.formError : null
                    }
                  />
                  <div className={styles.error}>
                    {this.state.errors.price_per_mile}
                  </div>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="min_price">
                  <Form.Label>
                    Minimum Price:
                    {this.state.isEdit ? null : (
                      <span className={styles.formRed}>(required)</span>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.min_price}
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
              <Form.Row>
                <Form.Group as={Col} controlId="delivery_type_id">
                  <Form.Label>
                    Delivery Type:
                    {!this.state.isEdit ? (
                      <span className={styles.formRed}>(required)</span>
                    ) : null}
                  </Form.Label>

                  <Dropdown>{typeDropdown}</Dropdown>
                  <div className={styles.error}>
                    {this.state.errors.delivery_type_id}
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

export default DeliveryPriceModal;
