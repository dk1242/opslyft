const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const gql = require("graphql-tag");
const { buildASTSchema } = require("graphql");
const axios = require("axios");
const app = express();

const getWorldCasesData = async () => {
  try {
    const today = new Date().toISOString();
    // console.log(today);
    return await axios.get(
      `https://api.covid19api.com/world?from=2020-03-01T00:00:00Z&to=${today}`
    );
  } catch (err) {
    console.log(err);
  }
};
const getTotalWorldCasesData = async () => {
  try {
    return await axios.get("https://api.covid19api.com/world/total");
  } catch (err) {
    console.log(err);
  }
};
const getCountryData = async (country) => {
  try {
    return await axios.get(
      `https://api.covid19api.com/total/country/${country}`
    );
  } catch (err) {
    console.log(err);
  }
};
const getAllCountriesName = async () => {
  try {
    return await axios.get("https://api.covid19api.com/countries");
  } catch (err) {
    console.log(err);
  }
};
const getCountryWiseData = async () => {
  try {
    return await axios.get("https://api.covid19api.com/summary");
  } catch (err) {
    console.log(err);
  }
};
var worldCasesData,
  countryCasesData,
  totalWorldCasesData,
  allCountriesName,
  countryWiseData;

getAllCountriesName()
  .then((resp) => {
    allCountriesName = resp.data;
    // console.log(allCountriesName);
  })
  .catch((err) => {
    console.log(err);
  });
getCountryWiseData()
  .then((resp) => {
    // console.log(resp);
    countryWiseData = resp.data.Countries;
    console.log(countryWiseData);
  })
  .catch((err) => {
    console.log(err);
  });
getWorldCasesData()
  .then((resp) => {
    worldCasesData = resp.data;
    //   console.log(worldCasesData);
  })
  .catch((err) => {
    console.log(err);
  });
getTotalWorldCasesData()
  .then((resp) => {
    totalWorldCasesData = resp.data;
    //   console.log(worldCasesData);
  })
  .catch((err) => {
    console.log(err);
  });
const getSpecificCountryData = (country) =>
  getCountryData(country)
    .then((resp) => {
      if (resp) countryCasesData = resp.data;
      // console.log(resp);
      return countryCasesData;
    })
    .catch((err) => {
      console.log(err);
    });

const schema = buildASTSchema(gql`
  type Query {
    allCountries: [allCountriesNameType]
    totalWorldCases: totalWorld
    worldCases: [worldCasesDataType]
    countryCases(country: String): [countryCasesType]
    countriesData: [countryDataType]
  }
  type allCountriesNameType {
    Country: String
  }
  type countryDataType {
    Country: String
    TotalConfirmed: Int
    TotalDeaths: Int
    TotalRecovered: Int
  }
  type countryCasesType {
    Confirmed: Int
    Deaths: Int
    Active: Int
    Date: String
  }
  type worldCasesDataType {
    TotalConfirmed: Int
    TotalDeaths: Int
    Date: String
  }
  type totalWorld {
    TotalConfirmed: Int
    TotalDeaths: Int
  }
`);

const root = {
  allCountries: () => allCountriesName,
  worldCases: () => worldCasesData,
  totalWorldCases: () => totalWorldCasesData,
  countryCases: (args) => getSpecificCountryData(args.country),
  countriesData: () => countryWiseData,
};

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("server started");
});
