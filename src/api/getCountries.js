import { useEffect, useState } from 'react';

export const GetCountries = () => {
  const [countries, setCountries] = useState([
    {
      id: '',
      name: '',
    },
  ]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/country`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch countries data!');
        }
        const data = await res.json();
        setCountries(
          data?.map((country) => ({ id: country._id, name: country.name }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountriesData();
  }, []);

  return countries;
};
