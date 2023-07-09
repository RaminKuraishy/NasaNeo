import React, { useEffect, useState } from "react";
import "./list.scss";

const apiKey = process.env.REACT_APP_NASA_KEY;
const List = props => {
  const [aggregatedData, setAggregatedData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  useEffect(() => {
    const startDate = new Date();
    startDate.setDate(1);

    const endDate = new Date();
    if (endDate.getDate() > 7) {
      endDate.setDate(7);
    }

    fetchNeo(formatDate(startDate), formatDate(endDate), apiKey);
    // const interval = setInterval(() => {
    //   fetchNeo(formatDate(startDate), formatDate(endDate), apiKey);
    // }, 2000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, []);
  function formatDate(date) {
    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = "0" + mm;
    var dd = date.getDate();
    if (dd < 10) dd = "0" + dd;
    return `${yyyy}-${mm}-${dd}`;
  }
  function getAggregatedData(neos) {
    let diameterMax = 0;
    let hazardousAsteroidCount = 0;
    let closestNeo = null;
    let fastestNeo = 0;
    for (let neo of neos) {
      if (
        diameterMax < neo.estimated_diameter.kilometers.estimated_diameter_max
      ) {
        diameterMax = neo.estimated_diameter.kilometers.estimated_diameter_max;
      }
      if (neo.is_potentially_hazardous_asteroid) {
        hazardousAsteroidCount++;
      }
      if (
        closestNeo === null ||
        closestNeo > neo.close_approach_data[0].miss_distance.kilometers
      ) {
        closestNeo = neo.close_approach_data[0].miss_distance.kilometers;
      }
      if (
        fastestNeo <
        neo.close_approach_data[0].relative_velocity.kilometers_per_hour
      ) {
        fastestNeo =
          neo.close_approach_data[0].relative_velocity.kilometers_per_hour;
      }
    }

    return {
      diameterMax,
      hazardousAsteroidCount,
      closestNeo,
      fastestNeo,
    };
  }

  async function fetchNeo(startDate, endDate, apiKey) {
    const res = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`
    );
    const data = await res.json();
    setIsLoaded(false);
    const availableDates = Object.keys(data.near_earth_objects).sort();
    let currentDateIndex = 0;
    const dataPerDay = [];
    function getNextDay() {
      const aggregated = getAggregatedData(
        data.near_earth_objects[availableDates[currentDateIndex]]
      );
      if (currentDateIndex + 1 === availableDates.length) {
        currentDateIndex = 0;
      } else {
        currentDateIndex++;
      }
      return {
        ...{ date: availableDates[currentDateIndex] },
        ...aggregated,
      };
    }
    for (let i = 0; i < 6; i++) {
      dataPerDay.push(getNextDay());
    }
    setAggregatedData(dataPerDay);
  }

  if (!aggregatedData) return <h3 className="page-list-empty">There is no NEO</h3>;

  return (
    <div className="card_wrapper">
      <ul className="page-list">
        {isLoaded ? <div className="loader"></div> : aggregatedData.map((item, key) => {
          return (
            <li key={key} className="page-list-item">
              <h3 className="page-list-title">{item.date}</h3>
              <p className="page-list-text">Diameter: {item.diameterMax}</p>
              <p className="page-list-text">Potentially hazardous NEO: {item.hazardousAsteroidCount}</p>
              <p className="page-list-text">Closest NEO: {item.closestNeo}</p>
              <p className="page-list-text">Fastest NEO: {item.fastestNeo}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default List;
