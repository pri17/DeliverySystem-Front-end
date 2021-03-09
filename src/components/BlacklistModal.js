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
    id: null, //blackList id

    delivery_type_id: null,

    isEdit: false,

    product_id: this.props.product_id, // product id from parent component
    showPopup: false,
    message: null,
    backURL: "",
    dTypeList: [], // the dropdown list

    errors: {
      delivery_type_id: null,
    },
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

  hidePopup = () => {
    this.setState({
      showPopup: false,
    });

    window.location.reload();
  };

  AddNewPopup = () => {
    let errors = this.state.errors;
    let isError = false;

    if (!this.state.delivery_type_id) {
      errors.delivery_type_id = "One type is required to be selected!";
      isError = true;
    }

    this.setState({ errors: errors });

    if (!isError) {
      const params = {
        delivery_type_id: this.state.delivery_type_id,
        product_id: this.state.product_id,
      };

      axios
        .post(process.env.REACT_APP_BLACKLIST_URL, params, {
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
      this.setState({ delivery_type_id: null }, () => {
        this.props.hideup();
      });
    }
  };

  setDropdownType = (eventKey, event) => {
    this.setState({
      delivery_type_id: eventKey,
    });
  };

  componentWillReceiveProps(nextProps) {
    // update state from props.
    this.setState({
      id: nextProps.editData.blacklist_id, //blackList id

      delivery_type_id: nextProps.editData.delivery_type_id,

      isEdit: nextProps.isEdit,

      product_id: nextProps.product_id, // product id from parent component
    });
  }

  editBlacklist = () => {
    const params = {
      delivery_type_id: this.state.delivery_type_id,
      product_id: this.state.product_id,
    };

    axios
      .post(process.env.REACT_APP_BLACKLIST_URL + "/" + this.state.id, params, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {
        this.setState({
          showPopup: true,
          message: "Edit Sucess!",
        });
      })
      .catch((error) => {
        this.setState({
          showPopup: true,
          message: "Edit Failed!",
        });
      });
    this.setState({ delivery_type_id: null }, () => {
      this.props.hideup();
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
              {!this.state.isEdit ? "Add New BlackList" : "Edit BlackList"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className={styles.modalBody}>
            <Form>
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

            {!this.state.isEdit ? (
              <Button variant="primary" onClick={this.AddNewPopup}>
                Add
              </Button>
            ) : (
              <Button variant="primary" onClick={this.editBlacklist}>
                Edit
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

export default BlacklistModal;
