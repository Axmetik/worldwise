// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "../Button";
import BackButton from "../BackButton";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUrlPosition } from "../../hooks/useUrlPosition";
import { useCities } from "../../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const flagemojiToPNG = (flag) => {
  var countryCode = Array.from(flag, (codeUnit) =>
    codeUnit.codePointAt()
  )
    .map((char) =>
      String.fromCharCode(char - 127397).toLowerCase()
    )
    .join("");
  return (
    <img
      src={`https://flagcdn.com/24x18/${countryCode}.png`}
      alt="flag"
    />
  );
};

const BASE_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");

  const [isLoadingGeocoding, setIsLoadingGeocoding] =
    useState(false);

  useEffect(() => {
    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        const res = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.json();
        console.log(data);

        if (!data.countryCode)
          throw new Error(
            "That is not a country part or a city. Please try to click somewhere else"
          );
        setGeoCodingError("");
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }

    fetchCityData();
  }, [lat, lng]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };

    createCity(newCity);
    navigate("/app");
  }

  if (!lat && !lng)
    return (
      <Message message="Start by clicking somewhere on map" />
    );

  if (isLoadingGeocoding) return <Spinner />;

  if (geoCodingError)
    return <Message message={geoCodingError} />;

  return (
    <form
      className={`${styles.form} ${
        isLoading ? styles.loading : ""
      }`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          {flagemojiToPNG(emoji)}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">
          When did you go to {cityName}?
        </label>

        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">
          Notes about your trip to {cityName}
        </label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
