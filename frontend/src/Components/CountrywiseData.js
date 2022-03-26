import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Container } from "react-bootstrap";

export const GetCountrywiseData = gql`
  {
    countriesData {
      Country
      TotalConfirmed
      TotalDeaths
      TotalRecovered
    }
  }
`;
const CountryWiseData = () => {
  const { data, loading, error } = useQuery(GetCountrywiseData);
  return (
    <Container>
      <br />
      <table style={{ width: "100%" }}>
        <thead style={{ background: "Green" }}>
          <tr>
            <th>Country</th>
            <th>Recovered</th>
            <th>Confirmed</th>
            <th>Deaths</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.countriesData.map((val, idx) => {
              return (
                <tr key={idx}>
                  <td>{val.Country}</td>
                  <td>{val.TotalConfirmed - val.TotalDeaths}</td>
                  <td>{val.TotalConfirmed}</td>
                  <td>{val.TotalDeaths}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <br />
      {/* {console.log(data)} */}
    </Container>
  );
};

export default CountryWiseData;
