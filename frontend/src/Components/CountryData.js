import React, { useState } from "react";
import gql from "graphql-tag";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useQuery } from "@apollo/client";
import { Col, Container, Form, Row } from "react-bootstrap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const maxDate = new Date().toISOString().split("T")[0];
const CountryData = (props) => {
  const [from, setFrom] = useState("2020-01-01");
  const [to, setTo] = useState(maxDate);
  const GetCountryCoronaCasesData = gql`
    query countryCases($country: String!) {
      countryCases(country: $country) {
        Confirmed
        Deaths
        Active
        Date
      }
    }
  `;
  let labels = [],
    confirmed = [],
    recovered = [],
    deceased = [];
  const setData = () => {
    if (data) {
      let start = new Date(from).toISOString();
      let end = new Date(to).toISOString();
      labels = [];
      data.countryCases.forEach((ele) => {
        if (ele.Date >= start && ele.Date <= end)
          labels.push(ele.Date.slice(0, 10));
      });
      confirmed = [];
      data.countryCases.forEach((ele) => {
        if (ele.Date >= start && ele.Date <= end) confirmed.push(ele.Confirmed);
      });
      recovered = [];
      data.countryCases.forEach((ele) => {
        if (ele.Date >= start && ele.Date <= end)
          recovered.push(ele.Confirmed - ele.Deaths);
      });
      deceased = [];
      data.countryCases.forEach((ele) => {
        if (ele.Date >= start && ele.Date <= end) deceased.push(ele.Deaths);
      });
    }
  };
  const handleChange = (event) => {
    if (event.target.name === "from") {
      setFrom(event.target.value);
    } else if (event.target.name === "to") {
      setTo(event.target.value);
    }
    setData();
  };
  const { data, loading, error } = useQuery(GetCountryCoronaCasesData, {
    variables: { country: props.country },
  });
  if (data && data.countryCases != null) {
    console.log(data);
    data.countryCases.sort(function (a, b) {
      return new Date(a.Date) - new Date(b.Date);
    });
    setData();
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "",
      },
    },
  };
  var i = 0,
    j = 0,
    k = 0,
    l = 0;
  const Maindata = {
    labels,
    datasets: [
      {
        label: "Total Recovered",
        data: labels.map(() => recovered[i++]),
        borderColor: "darkGreen",
        backgroundColor: "lightgreen",
      },
      {
        label: "Total Confirmed",
        data: labels.map(() => confirmed[k++]),
        borderColor: "darkOrange",
        backgroundColor: "orange",
      },
      {
        label: "Total Deceased",
        data: labels.map(() => deceased[j++]),
        borderColor: "red",
        backgroundColor: "pink",
      },
    ],
  };
  return (
    <div>
      <Container>
        <Row style={{ textAlign: "center" }}>
          <h2>Data of corona cases for {props.country}</h2>
        </Row>
        <br />
        <Form>
          <h2>Filters</h2>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Select start date</Form.Label>
                <Form.Control
                  type="date"
                  name="from"
                  value={from}
                  min="2020-01-01"
                  max={maxDate}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Select end date</Form.Label>
                <Form.Control
                  type="date"
                  name="to"
                  value={to}
                  min="2020-01-01"
                  max={maxDate}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        {!loading ? (
          data.countryCases && data.countryCases.length > 0 ? (
            <Line options={options} data={Maindata} />
          ) : (
            <h1>Sorry! No data found for this country.</h1>
          )
        ) : (
          <div>Loading!!!</div>
        )}
        <br />
      </Container>
    </div>
  );
};

export default CountryData;
