import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

export const GetCountriesName = gql`
  {
    allCountries {
      Country
    }
  }
`;
const ChooseCountryForm = (props) => {
  // console.log(props);
  const countries = [];
  const [current, setCurrent] = useState("All");
  const { data, loading, error } = useQuery(GetCountriesName);
  if (data) {
    data.allCountries.forEach((element) => {
      countries.push(element.Country);
    });
    countries.sort();
    // console.log(countries);
  }
  const handleChange = (event) => {
    setCurrent(event.target.value);
    console.log(current);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (countries.includes(current)) props.onchange(current);
    else alert("Select a valid country name");
  };
  return (
    <Container>
      <h3>Select Country from here</h3>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <input
              className="form-control"
              list="countryList"
              value={current}
              onChange={handleChange}
            ></input>
            <datalist id="countryList">
              <option value="All">All world</option>
              {countries.length &&
                countries.map((val, idx) => {
                  return <option value={val} key={idx} />;
                })}
            </datalist>
          </Col>
          <Col>
            <Button type="submit">Search</Button>
          </Col>
        </Row>
      </form>
      {/* <Form>
        <Form.Select aria-label="" onChange={handleChange}>
          <option>All</option>
          
        </Form.Select>
      </Form> */}
    </Container>
  );
};
export default ChooseCountryForm;
