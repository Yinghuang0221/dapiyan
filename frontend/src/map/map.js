import { React, useState } from "react";
import Key from "../Key"; // 引入 API key
import GoogleMapReact from "google-map-react";

// Map
const SimpleMap = (props) => {
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapApi, setMapApi] = useState(null);
  const [places, setPlaces] = useState([]);
  const [inputRadius, setInputRadius] = useState(1000);

  const [myPosition, setMyPosition] = useState({
    lat: 25.04,
    lng: 121.5,
  });

  const apiHasLoaded = (map, maps) => {
    setMapInstance(map);
    setMapApi(maps);
    setMapApiLoaded(true);
    getLocation();
    console.log("Complete loading!");
    findCafeLocation();
  };
  //定義咖啡廳marker
  const CafeMarker = ({ icon, text }) => (
    <div>
      <button type="button" onClick={() => console.log("piyan")}>
        <img
          style={{ height: "20px", width: "20px" }}
          src={icon}
          alt={"piyan"}
        />
      </button>
      <div
        style={{
          height: "auto",
          width: "50px",
          backgroundColor: "gray",
          borderRadius: "5px",
        }}
      >
        {text}
      </div>
    </div>
  );
  //定義個人位置marker
  const MyPositionMarker = ({ text }) => (
    <div style={{ width: "20px" }}>
      <img
        src="https://pic.baike.soso.com/ugc/baikepic2/4950/cut-20210830191832-1142169327_jpg_703_469_43543.jpg/800"
        alt={"piyan"}
        style={{ width: "50px" }}
      />
    </div>
  );
  //移動地圖
  const handleCenterChange = () => {
    if (mapApiLoaded) {
      setMyPosition({
        // center.lat() 與 center.lng() 會回傳正中心的經緯度
        lat: mapInstance.center.lat(),
        lng: mapInstance.center.lng(),
      });
    }
  };

  //輸入距離半徑
  const handleChange = (e) => {
    setInputRadius(e.target.value);
  };
  //get current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMyPosition({ lat: pos.lat, lng: pos.lng });
      });
    }
  };
  // 找咖啡廳
  const findCafeLocation = () => {
    if (mapApiLoaded) {
      setMyPosition({
        // center.lat() 與 center.lng() 會回傳正中心的經緯度
        lat: mapInstance.center.lat(),
        lng: mapInstance.center.lng(),
      });
    }

    console.log(inputRadius);
    if (mapApiLoaded) {
      const service = new mapApi.places.PlacesService(mapInstance);

      const request = {
        location: myPosition,
        radius: inputRadius,
        type: ["cafe"],
      };

      service.nearbySearch(request, (results, status) => {
        if (status === mapApi.places.PlacesServiceStatus.OK) {
          console.log(results);
          setPlaces(results);
        }
      });
    }
  };

  return (
    // Important! Always set the container height explicitly
    <>
      <div>
        <input
          type="button"
          style={{
            width: "40px",
            display: "flex",
            margin: "auto",
          }}
          value="Find Cafe!"
          onClick={findCafeLocation}
        />
        <div>
          <p
            style={{
              width: "100px",
              display: "flex",
              margin: "auto",
            }}
          >
            input distance
          </p>
          <input
            type="text"
            style={{
              width: "40px",
              display: "flex",
              margin: "auto",
            }}
            value={inputRadius}
            onChange={handleChange}
          ></input>
        </div>
      </div>
      <div
        style={{
          height: "80vh",
          width: "70%",
          display: "flex",
          justifyContent: "center",
          margin: "auto",
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: Key,
            libraries: ["places"], // 要在這邊放入我們要使用的 API
          }}
          onChange={handleCenterChange}
          defaultCenter={props.center}
          defaultZoom={props.zoom}
          center={myPosition}
          yesIWantToUseGoogleMapApiInternals // 設定為 true
          // layerTypes={["TrafficLayer", "TransitLayer"]} // 交通狀況
          onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)} // 載入完成後執行
        >
          <MyPositionMarker
            lat={myPosition.lat}
            lng={myPosition.lng}
            text="My Position"
          />
          {places.map((item) => (
            <CafeMarker
              icon={
                "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png"
              }
              key={item.place_id}
              lat={item.geometry.location.lat()}
              lng={item.geometry.location.lng()}
              text={item.name}
              placeId={item.place_id}
            />
          ))}
        </GoogleMapReact>
      </div>
    </>
  );
};

// 由於改寫成 functional component，故另外設定 defaultProps
SimpleMap.defaultProps = {
  center: { lat: 0, lng: 0 },
  zoom: 18,
};

// App
function App() {
  return (
    <div className="App">
      <SimpleMap />
    </div>
  );
}

export default App;
