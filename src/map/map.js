import { React, useEffect, useRef, useState } from "react";
import Key from "../key.js"; // API key
import GoogleMapReact from "google-map-react";
import axios from "../api.js";
import { Button, Input, message, Menu, Dropdown, List } from "antd";

import GoogleCalender from "../calendar/Calendar.js";

// Map
const CafeMap = (props) => {
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapApi, setMapApi] = useState(null);
  const [places, setPlaces] = useState([]);
  const [placeChangedTimes, setplaceChangedTimes] = useState(0);
  const [infoCardDetail, setinfoCardDetail] = useState({
    name: "piyan",
    rating: "piyan",
    tele: "piyan",
    address: "piyan",
    isOpen: false,
    url: "piyan",
    comment_1: "目前無評論",
    comment_2: "目前無評論",
    comment_3: "目前無評論",
  });
  const [placeChanged, setPlaceChanged] = useState(true);
  const [comment, setComment] = useState("");
  const [start, setStart] = useState(false);
  const [inputRadius, setInputRadius] = useState(1000);
  const radiusRef = useRef();
  const [searched, setSearched] = useState(false);
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
  const CafeMarker = ({ icon, id }) => (
    <div>
      <button type="button" onClick={() => getLocationDetail(id)}>
        <img
          style={{ height: "20px", width: "20px" }}
          src={icon}
          alt={"piyan"}
        />
      </button>
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
  //info card

  const InfoCard = ({
    url,
    name,
    rating,
    tele,
    isOpen,
    comment_1,
    comment_2,
    comment_3,
  }) => (
    <div>
      <div className="cafePictureContainer">
        <img className="cafePicture" src={url} alt="piyan"></img>
      </div>
      <List
        dataSource={[
          "店名 : " + name,
          "電話 : " + tele,
          "Google評價 : " + rating,
          isOpen,
        ]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      ></List>
      <List
        header={<div>最新評論</div>}
        dataSource={[comment_1, comment_2, comment_3]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      ></List>
    </div>
  );

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  //handling map
  const handleCenterChange = () => {
    if (mapApiLoaded) {
      setMyPosition({
        //set position to center
        lat: mapInstance.center.lat(),
        lng: mapInstance.center.lng(),
      });
      setPlaceChanged(true);
      setplaceChangedTimes(placeChangedTimes + 1);
      console.log("Change position");
    }
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
    if (isNaN(inputRadius) === false) {
      // if (mapApiLoaded) {
      //   setMyPosition({
      //     //default position at center
      //     lat: mapInstance.center.lat(),
      //     lng: mapInstance.center.lng(),
      //   });
      // }
      console.log(inputRadius);
      if (mapApiLoaded) {
        const service = new mapApi.places.PlacesService(mapInstance);

        const request = {
          location: myPosition,
          radius: radiusRef.current,
          type: ["cafe"],
        };

        service.nearbySearch(request, (results, status) => {
          if (status === mapApi.places.PlacesServiceStatus.OK) {
            console.log(results);
            setPlaces(results);
            message.info("成功搜尋");
          } else {
            message.info("附近沒有咖啡廳");
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
            url: "https://i.stack.imgur.com/6M513.png",
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
          await axios
            .post("/api/get-cafe-name", { cafeName })
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });

          console.log(results);
          // // having bug here
          const { data: comments } = await axios.get("/api/get-comments", {
            params: {
              name: cafeName,
            },
          });

          console.log(comments.comments);

          if (comments.comments[0] === undefined) {
            setinfoCardDetail({
              name: tmpinfo.name,
              rating: tmpinfo.rating,
              tele: tmpinfo.formatted_phone_number,
              address: tmpinfo.formatted_address,
              isOpen: tmpinfo.isOpen,
              url: tmpinfo.url,
              comment_1: "目前暫無評論",
              comment_2: "目前暫無評論",
              comment_3: "目前暫無評論",
            });
            console.log("就沒有東西");
          } else if (
            comments.comments[0] !== undefined &&
            comments.comments[1] === undefined &&
            comments.comments[2] === undefined
          ) {
            const comment1 = comments.comments[0];
            setinfoCardDetail({
              name: tmpinfo.name,
              rating: tmpinfo.rating,
              tele: tmpinfo.formatted_phone_number,
              address: tmpinfo.formatted_address,
              isOpen: tmpinfo.isOpen,
              url: tmpinfo.url,
              comment_1: comment1,
              comment_2: "目前暫無評論",
              comment_3: "目前暫無評論",
            });
          } else if (
            comments.comments[0] !== undefined &&
            comments.comments[1] !== undefined &&
            comments.comments[2] === undefined
          ) {
            const comment1 = comments.comments[0];
            const comment2 = comments.comments[1];

            setinfoCardDetail({
              name: tmpinfo.name,
              rating: tmpinfo.rating,
              tele: tmpinfo.formatted_phone_number,
              address: tmpinfo.formatted_address,
              isOpen: tmpinfo.isOpen,
              url: tmpinfo.url,
              comment_1: comment1,
              comment_2: comment2,
              comment_3: "目前暫無評論",
            });
          } else {
            const comment1 = comments.comments[0];
            const comment2 = comments.comments[1];
            const comment3 = comments.comments[2];

            setinfoCardDetail({
              name: tmpinfo.name,
              rating: tmpinfo.rating,
              tele: tmpinfo.formatted_phone_number,
              address: tmpinfo.formatted_address,
              isOpen: tmpinfo.isOpen,
              url: tmpinfo.url,
              comment_1: comment1,
              comment_2: comment2,
              comment_3: comment3,
            });
          }
          // console.log(tmpinfo);
          setStart(true);
        }
      });
    }
  };

  const commentSubmit = async (e) => {
    console.log("送出留言屁眼");
    // e.preventDefault();
    // setComment(e.target.value);
    // console.log(e.target.value) ;
    if (comment.trim() === "") {
      message.warn("請輸入評論");
    } else {
      const cafeNameForComment = infoCardDetail.name;
      // console.log(cafeNameForComment);
      await axios
        .post("/api/create-comment", { cafeNameForComment, comment })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      const cafeName = infoCardDetail.name;
      const { data: comments } = await axios.get("/api/get-comments", {
        params: {
          name: cafeName,
        },
      });
      console.log(cafeName);
      console.log(comments);
      if (
        comments.comments[1] === undefined &&
        comments.comments[2] === undefined
      ) {
        setinfoCardDetail({
          ...infoCardDetail,
          comment_1: comments.comments[0],
          comment_2: "目前暫無評論",
          comment_3: "目前暫無評論",
        });
        console.log("只有一個評論");
      } else if (
        comments.comments[1] !== undefined &&
        comments.comments[2] === undefined
      ) {
        setinfoCardDetail({
          ...infoCardDetail,
          comment_1: comments.comments[0],
          comment_2: comments.comments[1],
          comment_3: "目前暫無評論",
        });
        console.log("只有兩個評論");
      } else {
        setinfoCardDetail({
          ...infoCardDetail,
          comment_1: comments.comments[0],
          comment_2: comments.comments[1],
          comment_3: comments.comments[2],
        });
        console.log("有大於等於三個評論");
      }
    }
    setComment("");
  };

  const onClick = ({ key }) => {	
    let tmp = searched;	
    console.log(key);	
    if (key !== inputRadius) {	
      tmp = false;	
    }	
    setInputRadius(key);	
    if (placeChanged === true && tmp === true && placeChangedTimes !== 1) {	
      console.log("onclick");	
      findCafeLocation();	
    }	
    setPlaceChanged(false);	
    setSearched(true);	
  };	
  useEffect(() => {	
    radiusRef.current = inputRadius;	
    console.log("Effect");	
    if (searched && !placeChanged) {	
      findCafeLocation();	
      setSearched(true);	
      console.log({ searched: searched, placeChanged: placeChanged });	
    }	
  }, [inputRadius]);

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1000">Find Cafe in 1km</Menu.Item>
      <Menu.Item key="2000">Find Cafe in 2km</Menu.Item>
      <Menu.Item key="5000">Find Cafe in 5km</Menu.Item>
    </Menu>
  );

  const { Search } = Input;

  return (
    // Important! Always set the container height explicitly
    <>
      <header className="mapHeader">
        <Dropdown overlay={menu} type="primary">
          <Button>Select distance!</Button>
        </Dropdown>
      </header>
      <div
        style={{
          height: "650px",
          width: "100%",
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
        {start ? (
          <div
            style={{
              width: "400px",
              height: "650px",
              padding: "20px",
              backgroundColor: "gray",
              // border-radius :"5%"
            }}
          >
            <InfoCard
              url={infoCardDetail.url}
              name={infoCardDetail.name}
              rating={infoCardDetail.rating}
              tele={infoCardDetail.tele}
              address={infoCardDetail.address}
              isOpen={infoCardDetail.isOpen}
              comment_1={infoCardDetail.comment_1}
              comment_2={infoCardDetail.comment_2}
              comment_3={infoCardDetail.comment_3}
            />

            <Search
              placeholder="輸入評論"
              allowClear
              enterButton="Send"
              size="large"
              value={comment}
              onChange={(e) => handleCommentChange(e)}
              onSearch={commentSubmit}
            />
          </div>
        ) : (
          <div
            style={{
              width: "503px",
              height: "700px",
              padding: "20px",
              backgroundColor: "gray",
              // border-radius :"5%"
            }}
          ></div>
        )}
      </div>
    </>
  );
};

//set props
CafeMap.defaultProps = {
  center: { lat: 0, lng: 0 },
  zoom: 15,
};

export default CafeMap;
