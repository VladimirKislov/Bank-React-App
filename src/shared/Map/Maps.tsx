import axios from "axios";
import React, { useEffect, useState } from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import styles from "./maps.css";

export function Maps() {
  const [coordinate, setCoordinate] = useState<any>([]);
  useEffect(() => {
    axios
      .get("https://back-api-bank.herokuapp.com/banks")
      .then((response) => setCoordinate(response.data.payload));
  }, []);

  const mapState = {
    center: [53.751574, 50.573856],
    zoom: 5,
    behaviors: ["default", "scrollZoom"],
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ATM map</h2>
      <div className={styles.containerMaps}>
        <YMaps>
          <div>
            <Map width="1340px" height="728px" state={mapState} modules={["package.full"]}>
              {coordinate.map((item: any, idx: number) => (
                <Placemark
                  geometry={[item.lat, item.lon]}
                  options={{
                    iconLayout: "default#image",
                    iconImageSize: [50, 50],
                    iconImageHref: "https://i.ibb.co/t4PpYYM/1.png",
                  }}
                  key={idx}
                />
              ))}
            </Map>
          </div>
        </YMaps>
      </div>
    </div>
  );
}
