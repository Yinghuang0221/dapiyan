import { React, useEffect, useState } from "react";
import Key from "../key"; // API key
import GoogleMapReact from "google-map-react";
import axios from "../api";
import { Button, Space, Input, Form, message, Card } from "antd";
import GoogleCalender from "../calendar/Calendar";

// Map
const CafeMap = (props) => {
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapApi, setMapApi] = useState(null);
  const [places, setPlaces] = useState([]);
  const [infoCardDetail, setinfoCardDetail] = useState({
    name: "piyan",
    rating: "piyan",
    tele: "piyan",
    address: "piyan",
    isOpen: false,
    url: "piyan",
    comment_1: "目前無評論",
    comment_2: "",
  });
  const [comment, setComment] = useState("");
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
      <Card
        size="small"
        style={{
          width: "150px",
          backgroundColor: "gray",
          borderRadius: "5px",
          fontSize: "10",
        }}
      >
        {text}
      </Card>
    </div>
  );
  //define selfmarker
  const MyPositionMarker = () => (
    <div style={{ width: "20px" }}>
      <img
        src="https://pic.baike.soso.com/ugc/baikepic2/4950/cut-20210830191832-1142169327_jpg_703_469_43543.jpg/800"
        alt={"piyan"}
        style={{ width: "50px" }}
      />
    </div>
  );
  //test of info card
  const InfoCard = ({
    url,
    name,
    rating,
    tele,
    isOpen,
    comment_1,
    comment_2,
  }) => (
    <div
      style={{
        width: "400px",
        height: "600px",
        padding: "20px",
        backgroundColor: "gray",
        // border-radius :"5%"
      }}
    >
      <img
        style={{ height: "auto", width: "100%" }}
        src={url}
        alt="piyan"
      ></img>
      <p>店名 : {name}</p>
      <p>電話 : {tele}</p>
      <p>Google評價 : {rating} 顆星</p>
      <p>{isOpen}</p>
      <p>最新評論 : </p>
      <ul>
        <li>{comment_1}</li>
        <li>{comment_2}</li>
      </ul>
      <div>
        <Form onFinish={commentSubmit} id="commentForm">
          <label htmlFor="comment"> Write your comment here! </label>
          <br />
          <input
            type="text"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            autoFocus
          ></input>
          <br />
          <Button form="commentForm" key="submit" htmlType="submit"> 送出留言 </Button>
        </Form>
      </div>
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


  //set comment

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
    if (isNaN(inputRadius) === false) {
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
    } else {
      message.info("請輸入數字");
    }
  };
  //get detail when clicking button
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

      service.getDetails(request, async (results, status) => {
        if (status === mapApi.places.PlacesServiceStatus.OK) {
          let tmpinfo = {
            name: "No name",
            rating: "No rating",
            formatted_phone_number: "No phone number",
            formatted_address: "No address",
            isOpen: "No open info",
            photos: "No photos",
          };

          if (results.name !== undefined) {
            tmpinfo.name = results.name;
          }
          if (results.rating !== undefined) {
            tmpinfo.rating = results.rating;
          }
          if (results.formatted_phone_number !== undefined) {
            tmpinfo.formatted_phone_number = results.formatted_phone_number;
          }
          if (results.formatted_address !== undefined) {
            tmpinfo.formatted_address = results.formatted_address;
          }
          if (results.opening_hours !== undefined) {
            // console.log(results.opening_hours.isOpen());
            if (results.opening_hours.open_now === true)
              tmpinfo.isOpen = "營業中";
            else tmpinfo.isOpen = "休息中";
          }
          if (results.photos !== undefined) {
            tmpinfo.url = results.photos[0].getUrl();
          }


          const cafeName = tmpinfo.name;
          await axios.post("/api/get-cafe-name", { cafeName })
            .then((response) => {
              console.log(response)
            })
            .catch((error) => {
              console.log(error)
            })
          
          console.log(results);
          // // having bug here
          const { data: comments } = await axios.get("/api/get-comments", {
            params: {
              name: cafeName,
            },
          });

          const comment1 = comments.comments[0];
          const comment2 = comments.comments[1];

          // console.log(comment1)

          if (comment1 === null) {
            setinfoCardDetail({
              name: tmpinfo.name,
              rating: tmpinfo.rating,
              tele: tmpinfo.formatted_phone_number,
              address: tmpinfo.formatted_address,
              isOpen: tmpinfo.isOpen,
              url: tmpinfo.url,
              comment_1: "現在無留言",
              comment_2: "",
            });
          }
          else {
            setinfoCardDetail({
              name: tmpinfo.name,
              rating: tmpinfo.rating,
              tele: tmpinfo.formatted_phone_number,
              address: tmpinfo.formatted_address,
              isOpen: tmpinfo.isOpen,
              url: tmpinfo.url,
              comment_1: comment1,
              comment_2: comment2,
            });
          }
          // console.log(tmpinfo);

        }
      });
    }
  };





  const commentSubmit = async (e) => {
    console.log("送出留言屁眼")
    // e.preventDefault();
    // setComment(e.target.value);
    // console.log(e.target.value) ;

    const cafeNameForComment = infoCardDetail.name;
    // console.log(cafeNameForComment);
    await axios.post("/api/create-comment", { cafeNameForComment, comment })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    });

    const cafeName = infoCardDetail.name
    const { data: comments } = await axios.get("/api/get-comments", {
      params: {
        name: cafeName,
      },
    });
    console.log(cafeName)
    console.log(comments)

    setinfoCardDetail({...infoCardDetail,comment_1:comments.comments[0]})
    
  };

  return (
    // Important! Always set the container height explicitly
    <>
      <header className="piyan">
        <Space></Space>
        <Button
          type="primary"
          onClick={findCafeLocation}
          style={{
            margin: "auto",
            display: "flex",
            height: "auto",
            width: "100px",
          }}
        >
          Find Cafe!
        </Button>
        <div>
          <Input
            style={{
              margin: "auto",
              display: "flex",
              height: "auto",
              width: "100px",
            }}
            value={inputRadius}
            placeholder="請輸入距離"
            onChange={(e) => setInputRadius(e.target.value)}
          ></Input>
        </div>
      </header>
      <div
        style={{
          height: "600px",
          width: "70%",
          display: "flex",
          justifyContent: "center",
          margin: "auto",
        }}
      >
        <GoogleCalender cafeName={infoCardDetail.name} />
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

        <InfoCard
          url={infoCardDetail.url}
          name={infoCardDetail.name}
          rating={infoCardDetail.rating}
          tele={infoCardDetail.tele}
          address={infoCardDetail.address}
          isOpen={infoCardDetail.isOpen}
          comment_1={infoCardDetail.comment_1}
          comment_2={infoCardDetail.comment_2}
        />

      </div>
    </>
  );
};

//set props
CafeMap.defaultProps = {
  center: { lat: 0, lng: 0 },
  zoom: 18,
};

export default CafeMap;
