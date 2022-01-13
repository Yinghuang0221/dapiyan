import { React, useState } from "react";
import Key from "../Key"; // API key
import GoogleMapReact from "google-map-react";

// Map
const CafeMap = (props) => {
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapApi, setMapApi] = useState(null);
  const [places, setPlaces] = useState([]);
  const [inputRadius, setInputRadius] = useState(1000);

  const [myPosition, setMyPosition] = useState({
    lat: 25.2,
    lng: 121.31,
  }); // default is taipei station

  const apiHasLoaded = (map, maps) => {
    setMapInstance(map);
    setMapApi(maps);
    setMapApiLoaded(true);
    getLocation();
    console.log("Complete loading!");
  };

  //define Cafemarker
  const CafeMarker = ({ icon, text, name, id }) => (
    <div>
      <button type="button" onClick={() => getLocationDetail(id)}>
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
  //define selfmarker
  const MyPositionMarker = ({ text }) => (
    <div style={{ width: "20px" }}>
      <img
        src="https://pic.baike.soso.com/ugc/baikepic2/4950/cut-20210830191832-1142169327_jpg_703_469_43543.jpg/800"
        alt={"piyan"}
        style={{ width: "50px" }}
      />
    </div>
  );

  //handling map
  const handleCenterChange = () => {
    if (mapApiLoaded) {
      setMyPosition({
        //set position to center
        lat: mapInstance.center.lat(),
        lng: mapInstance.center.lng(),
      });
    }
  };

  //set radius
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
  // find cafe
  const findCafeLocation = () => {
    if (mapApiLoaded) {
      setMyPosition({
        //default position at center
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

  const getLocationDetail = (place_id) => {
    if (mapApiLoaded) {
      const service = new mapApi.places.PlacesService(mapInstance);
      const request = {
        placeId: place_id,
        fields: [
          "name",
          "rating",
          "formatted_phone_number",
          "formatted_address",
          "opening_hours",
          "photos",
        ],
      };

      service.getDetails(request, (results, status) => {
        if (status === mapApi.places.PlacesServiceStatus.OK) {
          const isOpenNow = results.opening_hours.isOpen();
          console.log(isOpenNow);

          if (isOpenNow) {
            console.log("有開啦幹");
          }

          console.log(results);
          if (request.photos !== undefined)
            console.log(results.photos[0].getUrl());
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
            libraries: ["places"], // which API
          }}
          onChange={handleCenterChange}
          defaultCenter={props.center}
          defaultZoom={props.zoom}
          center={myPosition}
          yesIWantToUseGoogleMapApiInternals //true
          // layerTypes={["TrafficLayer", "TransitLayer"]} // add layer
          onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)} // map is current map, maps is Google Maps API
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
              name={item.name}
              id={item.place_id}
            />
          ))}
        </GoogleMapReact>
      </div>
    </>
  );
};

//set props
CafeMap.defaultProps = {
  center: { lat: 0, lng: 0 },
  zoom: 18,
};

// App
function App() {
  return (
    <div className="App">
      <CafeMap />
    </div>
  );
}

export default App;
