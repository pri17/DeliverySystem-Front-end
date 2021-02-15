import axios from "axios";
import React, { Component } from "react";

import styles from "./DepotPage.module.css";
import DepotDetails from "../components/DepotDetail";

class DepotPage extends Component {
  state = {
    depot: null,
    isLoading: false,
  };

  componentDidMount() {
    let id = this.props.match.params.id;
    //console.log("This depot id is " + id);

    this.setState({
      isLoading: true,
    });
    axios
      .get("http://localhost:8080/depot/" + id, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        this.setState({
          depot: res.data,
          isLoading: false,
        });
        //console.log(this.state.depot.whs_code);
      });
  }

  render() {
    console.log(this.state.depot);

    if (this.state.isLoading) {
      return <div>Loading....</div>;
    }
    return (
      <div className={styles.container}>
        <div className={styles.title}>Depot Information Page</div>
        <div className={styles.content}>
          <DepotDetails depot={this.state.depot} />
        </div>
      </div>
    );
  }
}

export default DepotPage;
