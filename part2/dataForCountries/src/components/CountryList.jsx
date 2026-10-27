import CountryDetail from "./CountryDetail";
import { useState } from "react";

const CountryList = ({ countries }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleViewDetails = (country) => {
    setSelectedCountry(country);
    setShowDetails(true);
  };

  return (
    <div>
      {showDetails ? (
        <CountryDetail country={selectedCountry} />
      ) : (
        countries.map((country) => (
          <div key={country.name.common}>
            {country.name.common}{" "}
            <button onClick={() => handleViewDetails(country)}>show</button>
          </div>
        ))
      )}
    </div>
  );
};

export default CountryList;
