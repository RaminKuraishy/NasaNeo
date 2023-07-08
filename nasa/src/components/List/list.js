import React, { useEffect, useState } from "react";
import "./list.scss";

const List = props => {
  const [neo, setNeo] = useState(null);
  useEffect(() => {
    fetchNeo();
    async function fetchNeo() {
      const res = await fetch(
        "https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-07-01&end_date=2023-07-07&api_key=PXjG2k4gTiQT1uLnemaLCDAX3RDa7jRbL69WIROx"
      );
      const data = await res.json();
      setNeo(data);
      console.log(data);
    }
  }, []);
  if (!neo) return <div>there is no data</div>;
  if(neo.near_earth_objects['2023-07-07'][0].is_potentially_hazardous_asteroid){
    neo.near_earth_objects['2023-07-07'][0].is_potentially_hazardous_asteroid = 'Potentially harazardous asteroid!!!'
  }
  return (
    <ul className="page-list">
      <li className="page-list-item">max estimated diameter for the day: {neo.near_earth_objects['2023-07-07'][0].estimated_diameter.kilometers.estimated_diameter_max}</li>
      <li className="page-list-item">{neo.near_earth_objects['2023-07-07'][0].is_potentially_hazardous_asteroid}</li>
      <li className="page-list-item">km: {neo.near_earth_objects['2023-07-07'][0].close_approach_data[0].miss_distance.kilometers}</li>
      <li className="page-list-item">km per hour: {neo.near_earth_objects['2023-07-07'][0].close_approach_data[0].relative_velocity.kilometers_per_hour}</li>
    </ul>
  );
};

export default List;
