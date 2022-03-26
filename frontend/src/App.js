import logo from "./logo.svg";
import "./App.css";
import WorldData from "./Components/WorldData";
import { useState } from "react";
import CountryData from "./Components/CountryData";
import ChooseCountryForm from "./Components/ChooseCountryForm";
import CountryWiseData from "./Components/CountrywiseData";
import { Button, Container } from "react-bootstrap";

function App() {
  const [country, setCountry] = useState("All");
  const [showTable, setShowTable] = useState(false);
  const countryChange = (curr) => {
    setCountry(curr);
  };
  return (
    <Container>
      <a href="/" style={{ textDecoration: "none" }}>
        <h1 style={{ textAlign: "center", color: "skyblue" }}>
          Opslyft Corona Tracker
        </h1>
      </a>
      {!showTable && (
        <ChooseCountryForm country={country} onchange={countryChange} />
      )}
      <br />
      <Button onClick={() => setShowTable(!showTable)}>
        {!showTable ? "Show Country Wise Data " : "Not show country wise data"}
      </Button>
      {showTable && <CountryWiseData />}
      {!showTable &&
        (country === "All" ? <WorldData /> : <CountryData country={country} />)}
    </Container>
  );
}

export default App;
