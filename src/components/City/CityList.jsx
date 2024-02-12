import Spinner from "../Spinner/Spinner";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "../Message/Message";
import { useCities } from "../../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCities();

  console.log(cities);
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on map" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
