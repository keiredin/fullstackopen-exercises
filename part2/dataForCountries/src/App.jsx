import CountryDetail from "./components/CountryDetail";
import CountryList from "./components/CountryList";
import SearchFilter from "./components/SearchFilter";
import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState([]);
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase()),
  );

  const url = "https://studies.cs.helsinki.fi/restcountries/";
  
  useEffect(() => {
    axios
      .get(`${url}api/all`)
      .then((response) => {
        console.log("All countries:");
        console.log(response.data);
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  return (
    <div>
      <SearchFilter
        filter={filter}
        handleFilterChange={(e) => setFilter(e.target.value)}
      />
      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        <CountryDetail country={filteredCountries[0]} />
      ) : (
        <CountryList countries={filteredCountries} />
      )}
    </div>
  );
};

export default App;
