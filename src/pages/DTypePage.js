import React, { Component } from "react";
import axios from "axios";
import Popup from "../components/Popup";
import styles from "./DTypePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";

class DTypePage extends Component {
  state = {
    name: null,
    enabled: null,
    isLoading: false,
    id: null,
    showPopup: false,
    message: null,
    postcode_list: null,
    modalShow: false,
    backURL: "",
    newPostcode: {
      postcode_prefix: null,
      min_price: null,
      delivery_type_id: null,
    },
  };

  componentDidMount() {
    let id = this.props.match.params.id;

    this.setState({
      isLoading: true,
    });

    axios
      .get(process.env.REACT_APP_DELIVERYTYPE_LIST_URL + "/" + id, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {
        this.setState({
          name: res.data.name,
          enabled: res.data.enabled,
          id: res.data.id,
          isLoading: false,
          postcode_list: res.data.deliveryPostsCodes,
        });
      });
  }

  handleChange = (event) => {
    if (event.target.name === "name")
      this.setState({ name: event.target.value });
    if (event.target.name === "enabled")
      this.setState({ enabled: event.target.checked });
    //console.log(event.target.checked);
  };

  hidePopup = () => {
    this.setState({ showPopup: false });
    if (this.state.backURL == "deliveryTypes")
      this.props.history.push("/" + this.state.backURL);
    else {
      window.location.reload();
    }
  };

  handleSubmit = () => {
    const params = {
      name: this.state.name,
      enabled: this.state.enabled ? "1" : "0",
    };

    axios
      .post(
        process.env.REACT_APP_DELIVERYTYPE_LIST_URL + "/" + this.state.id,
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
          message: "Update Sucess!",
          backURL: "deliveryTypes",
        });
      })
      .catch((error) => {
        this.setState({
          showPopup: true,
          message: "Update Failed!",
          backURL: "deliveryTypes",
        });
      });
  };

  addNewPopup = () => {
    this.setState({
      modalShow: true,
    });
  };

  modalHide = () => {
    this.setState({
      modalShow: false,
    });
  };

  inputChange = (event) => {
    let value = event.target.value;
    let name = event.target.id;

    if (name === "postcode_prefix")
      this.setState({
        newPostcode: {
          postcode_prefix: value,
          min_price: this.state.newPostcode.min_price,
          delivery_type_id: this.state.id,
        },
      });
    if (name === "min_price")
      this.setState({
        newPostcode: {
          postcode_prefix: this.state.newPostcode.postcode_prefix,
          min_price: value,
          delivery_type_id: this.state.id,
        },
      });
  };

  addNewPostcode = () => {
    const params = {
      postcode_prefix: this.state.newPostcode.postcode_prefix,
      min_price: this.state.newPostcode.min_price,
      delivery_type_id: this.state.newPostcode.delivery_type_id,
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
          modalShow: false,
        });
      })
      .catch((error) => {
        this.setState({
          showPopup: true,
          message: "Add Failed!",
          modalShow: false,
        });
      });
  };

  render() {
    if (this.state.isLoading) {
      return <div>Loading....</div>;
    }

    const postcode_headers = [
      "ID",
      "Postcode Prefix",
      "Min Price",
      "Created At",
      "Updated At",
    ];

    return (
      <div className={styles.container}>
        <div className={styles.title}>Delivery Type Page</div>
        <div className={styles.content}>
          {!this.state.name ? null : (
            <table className={styles.depotTable}>
              <thead>
                <tr>
                  <th>Delivery Type</th>
                  <th>Is Enabled</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      value={this.state.name}
                      type="text"
                      name="name"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </td>
                  <td>
                    <input
                      defaultChecked={this.state.enabled}
                      type="checkbox"
                      name="enabled"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          <div>
            <button onClick={this.handleSubmit} className={styles.saveBtn}>
              Save Change
            </button>
          </div>
        </div>
        <Popup
          show={this.state.showPopup}
          handleClose={this.hidePopup}
          message={this.state.message}
        ></Popup>

        <div className={styles.PostCodeList}>
          <div className={styles.title2}>
            PostCodes List
            <FontAwesomeIcon
              icon={faPlus}
              size="lg"
              onClick={this.addNewPopup}
              className={styles.plusBtn}
            />
          </div>

          {!this.state.postcode_list ? null : (
            <PostCodeTable
              data={this.state.postcode_list}
              headers={postcode_headers}
            />
          )}
        </div>

        <Modal
          show={this.state.modalShow}
          className={styles.modal}
          onHide={this.modalHide}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New PostCode</Modal.Title>
          </Modal.Header>

          <Modal.Body className={styles.modalBody}>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="postcode_prefix">
                  <Form.Label>
                    Postcode Prefix:
                    <span className={styles.formRed}>(required)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Postcode Prefix"
                    onChange={this.inputChange}
                    value={this.state.postcode_prefix}
                    className={
                      this.state.postcode_prefix ? styles.formError : null
                    }
                  />
                  <div className={styles.error}>
                    {this.state.postcode_prefix}
                  </div>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="min_price">
                  <Form.Label>Minimum Price:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter minimum price"
                    onChange={this.inputChange}
                    value={this.state.min_price}
                    className={this.state.min_price ? styles.formError : null}
                  />
                  <div className={styles.error}>{this.state.min_price}</div>
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.modalHide}>
              Close
            </Button>
            <Button variant="primary" onClick={this.addNewPostcode}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const PostCodeTable = ({ data, headers }) => {
  const tableHeaders = headers.map((head) => {
    return <th key={head}>{head}</th>;
  });

  const bodyData = data.map((record) => {
    return (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>{record.postcode_prefix}</td>
        <td>{record.min_price}</td>
        <td>{record.created_at}</td>
        <td>{record.updated_at}</td>
      </tr>
    );
  });

  return (
    <div className={styles.content}>
      <table className={styles.table}>
        <thead>
          <tr>{tableHeaders}</tr>
        </thead>
        <tbody>{bodyData}</tbody>
      </table>
    </div>
  );
};

export default DTypePage;
