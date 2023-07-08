import React, { useEffect, useState } from "react";
import "./list.scss";

const apiKey = process.env.REACT_APP_NASA_KEY;
const List = props => {
  const [neo, setNeo] = useState(null);
  useEffect(() => {
    fetchNeo();
    console.log(neo);

    async function fetchNeo() {
      const res = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-07-01&end_date=2023-07-07&api_key=${apiKey}`
      );
      const data = await res.json();
      setNeo(data);
    }
    return () => {
    };
    // const neoArr = neo.near_earth_objects
  }, []);

  if (!neo) return <div>there is no data</div>;
  if (
    neo.near_earth_objects["2023-07-07"][0].is_potentially_hazardous_asteroid
  ) {
    neo.near_earth_objects["2023-07-07"][0].is_potentially_hazardous_asteroid =
      "Potentially harazardous asteroid!!!";
  }
  return (
    <div className="card_wrapper">
      <ul className="page-list">
        {/* {neoArr.map(item => {
        return (
          <li className="page-list-item"> 
        <h3>{item.name}</h3>
        </li>
        )
      })} */}
        <li className="page-list-item">
          <h3>{neo.near_earth_objects["2023-07-07"][0].name}</h3>
          <p>
            diameter:{" "}
            {
              neo.near_earth_objects["2023-07-07"][0].estimated_diameter
                .kilometers.estimated_diameter_max
            }
          </p>
          <p>
            {
              neo.near_earth_objects["2023-07-07"][0]
                .is_potentially_hazardous_asteroid
            }
          </p>
          <p>
            km:{" "}
            {
              neo.near_earth_objects["2023-07-07"][0].close_approach_data[0]
                .miss_distance.kilometers
            }
          </p>
          <p>
            km per hour:{" "}
            {
              neo.near_earth_objects["2023-07-07"][0].close_approach_data[0]
                .relative_velocity.kilometers_per_hour
            }
          </p>
        </li>
      </ul>
    </div>
  );
};

export default List;
