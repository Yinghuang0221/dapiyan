import React from "react";
import axios from "../api";
import { useState } from "react";
import { Button, message } from "antd";

const GoogleCalender = (cafeName) => {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const handleSubmit = (e) => {
    const location = cafeName.cafeName;
    if (
      summary === "" ||
      description === "" ||
      startDateTime === "" ||
      endDateTime === "" ||
      location === "開始尋找吧!"
    ) {
      e.preventDefault();
      message.warning("請輸入完整資訊以及選定咖啡廳");
    } else {
      e.preventDefault();
      // console.log(summary, description, location, startDateTime, endDateTime)
      axios
        .post("/api/create-event", {
          summary,
          description,
          location,
          startDateTime,
          endDateTime,
        })
        .then((response) => {
          console.log(response.data);
          setSummary("");
          setDescription("");
          setStartDateTime("");
          setEndDateTime("");
          message.isuccessnfo("成功加入行事曆");
        })
        .catch((error) => {
          console.log(error.message);
          message.warning("請輸入正確時間");
        });
    }
  };

  return (
    <div>
      <div>
        <h1>Ka-pi-thiann</h1>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="summary"> Summary </label>
          <br />
          <input
            type="text"
            id="summary"
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
            }}
          />
          <br />

          <label htmlFor="description"> Description </label>
          <br />
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <br />

          <label htmlFor="startDateTime"> Start Date Time </label>
          <br />
          <input
            type="datetime-local"
            id="startDateTime"
            value={startDateTime}
            onChange={(e) => {
              setStartDateTime(e.target.value);
            }}
          />
          <br />

          <label htmlFor="endDateTime"> End Date Time </label>
          <br />
          <input
            type="datetime-local"
            id="endDateTime"
            value={endDateTime}
            onChange={(e) => {
              setEndDateTime(e.target.value);
            }}
          />
          <br />

          <button type="submit"> 加入到行事曆 </button>
        </form>
      </div>
    </div>
  );
};
export default GoogleCalender;
