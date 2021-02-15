const DepotDetail = (depot) => {
  if (!depot.depot) {
    return null;
  }
  const dd = depot.depot;
  return (
    <div>
      <div>
        <div>Depot Name: </div>
        <div>{dd.whs_name}</div>
      </div>
      <div>
        <div>Depot Code: </div>
        <div>{dd.whs_code}</div>
      </div>
      <div>
        <div>Depot Location Latitude: </div>
        <div>{dd.lat}</div>
      </div>
      <div>
        <div>Depot Location Longitude: </div>
        <div>{dd.lng}</div>
      </div>
    </div>
  );
};

export default DepotDetail;
