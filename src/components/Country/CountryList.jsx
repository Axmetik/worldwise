import Spinner from "../Spinner/Spinner";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Message from "../Message/Message";
import { useCities } from "../../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();

  console.log(cities);
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on map" />
    );

  const countries = cities.reduce((arr, city) => {
    if (
      !arr
        .map((elem) => elem.country)
        .includes(city.country)
    )
      return [
        ...arr,
        { country: city.country, emoji: city.emoji },
      ];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem
          country={country}
          key={country.country}
        />
      ))}
    </ul>
  );
}

export default CountryList;
