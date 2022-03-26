import React from "react";
import gql from "graphql-tag";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Col, Container } from "react-bootstrap";
import { useQuery } from "@apollo/client";

ChartJS.register(ArcElement, Tooltip, Legend);

export const GetTotalWorldCoronaCasesData = gql`
  {
    totalWorldCases {
      TotalConfirmed
      TotalDeaths
    }
  }
`;

export function CurrentWorldData() {
  const { data, loading, error } = useQuery(GetTotalWorldCoronaCasesData);
  const currData = [];
  if (data) {
    currData.push(
      data.totalWorldCases.TotalConfirmed - data.totalWorldCases.TotalDeaths
    );
    currData.push(data.totalWorldCases.TotalConfirmed);
    currData.push(data.totalWorldCases.TotalDeaths);
  }
  const mainData = {
    labels: ["Total Recovered", "Total Confirmed", "Total deceased"],
    datasets: [
      {
        label: "Current Number of cases worldwide",
        data: currData,
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Container>
      <h2>Current number of Cases worldwide</h2>
      <Col>
        <Pie data={mainData} style={{ maxHeight: "500px" }} />
      </Col>
    </Container>
  );
}
