import styles from "./DepotTable.module.css";
import React from "react";

const DepotTable = ({ data, headers, props }) => {
  const header = headers.map((head) => {
    return <th key={head}>{head}</th>;
  });

  const handleClick = (id) => {
    // console.log(props);
    props.history.push("/depots/" + id);
  };

  const bodyData = data.map((record) => {
    return (
      <tr onClick={() => handleClick(record.id)} key={record.id}>
        <td>{record.id}</td>
        <td>{record.whs_code}</td>
        <td>{record.whs_name}</td>
        <td>{record.lng}</td>
        <td>{record.lat}</td>
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

export default DepotTable;
