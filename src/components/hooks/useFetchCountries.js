import { useEffect, useState } from 'react';

export const useFetchCountries = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const res = await fetch('/api/admin/country');
        if (!res.ok) {
          throw new Error('Failed to fetch countries data!');
        }
        const data = await res.json();
        setCountries(data.map((country) => country.name + ':' + country._id));
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountriesData();
  }, []);

  return countries;
};
