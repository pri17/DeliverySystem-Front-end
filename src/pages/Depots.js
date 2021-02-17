import React, { Component } from "react";
import axios from "axios";
import styles from "./Depots.module.css";
import DepotTable from "../components/DepotTable";

// function Table({ data }) {
//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "ID",
//         accessor: "id",
//       },
//       {
//         Header: "whs_code",
//         accessor: "whs_code",
//       },
//       {
//         Header: "whs_name",
//         accessor: "whs_name",
//       },
//       {
//         Header: "lng",
//         accessor: "lng",
//       },
//       {
//         Header: "lat",
//         accessor: "lat",
//       },
//       {
//         Header: "Created At",
//         accessor: "created_at",
//       },
//       {
//         Header: "Updated At",
//         accessor: "updated_at",
//       },
//     ],
//     []
//   );
//   // Use the state and functions returned from useTable to build your UI
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//   } = useTable({
//     columns,
//     data,
//   });

//   return (
//     <table {...getTableProps()}>
//       <thead>
//         {headerGroups.map((headerGroup) => (
//           <tr {...headerGroup.getHeaderGroupProps()}>
//             {headerGroup.headers.map((column) => (
//               <th {...column.getHeaderProps()}>{column.render("Header")}</th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map((row, i) => {
//           prepareRow(row);
//           return (
//             <tr {...row.getRowProps()}>
//               {row.cells.map((cell) => {
//                 return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
//               })}
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// }

class Depots extends Component {
  state = {
    depots: [],
  };

  componentDidMount() {
    axios
      .get(process.env.DEPOT_LIST_URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        //original state, get the full list
        this.setState({
          depots: res.data,
        });
      });
  }

  render() {
    const { depots } = this.state;

    // return <Table data={depots} />;
    // return <div>{depotList}</div>;

    //Simple normal table1

    // return (
    //   <table className={styles.table}>
    //     <thead>
    //       <tr>
    //         <th>ID</th>
    //         <th>Warehouse Code</th>
    //         <th>Warehouse Name</th>
    //         <th>Lng</th>
    //         <th>Lat</th>
    //         <th>Created At</th>
    //         <th>Updated At</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {depots.map((depot, index) => {
    //         return (
    //           <tr key={index}>
    //             <td>{depot.id}</td>
    //             <td>{depot.whs_code}</td>
    //             <td>{depot.whs_name}</td>
    //             <td>{depot.lng}</td>
    //             <td>{depot.lat}</td>
    //             <td>{depot.created_at}</td>
    //             <td>{depot.updated_at}</td>
    //           </tr>
    //         );
    //       })}
    //     </tbody>
    //   </table>
    // );

    //Import a table module table2
    const headers = [
      "ID",
      "Warehouse Code",
      "Warehouse Name",
      "Lng",
      "Lat",
      "Created At",
      "Updated At",
    ];

    return (
      <div className={styles.content}>
        <h1> Depot List</h1>
        <DepotTable data={depots} headers={headers} props={this.props} />
      </div>
    );
  }
}

export default Depots;
