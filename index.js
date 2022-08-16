import "regenerator-runtime/runtime";

import fileDownload from "js-file-download";
import Papa from "papaparse";

import React from "react";
import ReactDom from "react-dom";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import queryString from "query-string";
import uPlot from "uplot";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";

import Loess from "loess";
import axios from "axios";

function getFarenheitFromCelcius(c) {
  return c * (9 / 5) + 32;
}

function getFitbitAuthorizationUrl() {
  return (
    "https://www.fitbit.com/oauth2/authorize?" +
    queryString.stringify({
      client_id: "23B7NM",
      response_type: "token",
      scope: "sleep weight",
      redirect_uri: "http://localhost:1234/",
      expires_in: 31536000, // 1 year
    })
  );
}

async function getSleepData(accessToken) {
  //GET https://api.fitbit.com/1/user/-/profile.json

  console.log("askin for sleep data");

  // maximum of 3 months at once
  const response = await axios.get(
    "https://api.fitbit.com/1.2/user/-/sleep/date/2021-07-26/2021-10-26.json",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log(response);
}

async function getTemperatureData() {
  // pulled from cloud.corebodytemp.com
  const config = {
    apiKey: "AIzaSyAzCP94GktjA5-wbkElFoL99jBxGcWMprI",
    authDomain: "core-b09b6.firebaseapp.com",
    projectId: "core-b09b6",
    storageBucket: "core-b09b6.appspot.com",
    messagingSenderId: "408492996655",
    appId: "1:408492996655:web:083629fbf2cde16616aeda",
  };

  firebase.initializeApp(config);
  const db = firebase.firestore();
  const signInResult = await firebase
    .auth()
    .signInWithEmailAndPassword(
      "ted.corebodytemp@suzman.net",
      "G,.#DQqr;+JL_xQ9"
    );
  const snapshot = await db.collection("sensors/C3:EA:9B:47:D6:B4/data").get();
  const values = Array.prototype.concat(
    ...snapshot.docs.map((doc) => doc.data().values)
  );
  return values;
}

async function main() {
  // store fitbit secret, if we got one
  const params = queryString.parse(location.hash);
  if ("access_token" in params) {
    window.localStorage.setItem("fitbitAccessToken", params["access_token"]);
  }

  const fitbitAccessToken = window.localStorage.getItem("fitbitAccessToken");
  const sleepData = fitbitAccessToken ? getSleepData(fitbitAccessToken) : null;

  const temperatureData = await getTemperatureData();
  ReactDom.render(
    <Chart temperatureData={temperatureData} />,
    document.getElementById("root")
  );
}

const Chart = ({ temperatureData, sleepData }) => {
  const points = temperatureData
    .filter(({ cbt, ts }) => cbt && ts)
    .sort((a, b) => {
      return a.ts - b.ts;
    });

  let options = {
    title: "Core Body Temperature",
    width: 1000,
    height: 600,
    series: [
      {},
      {
        spanGaps: false,
        stroke: "red",
        width: 0.5,
      },
      {
        spanGaps: false,
        stroke: "green",
        width: 1,
      },
    ],
  };

  const timestamps = points.map(({ ts }) => ts);
  const temperatures = points.map(({ cbt }) =>
    getFarenheitFromCelcius(cbt / 1000)
  );

  var model = new Loess(
    { x: timestamps, y: temperatures },
    { span: 100 / timestamps.length, band: 0, degree: 1 }
  );

  const temperatureCsv = Papa.unparse(
    points
      .filter(({ cbt }) => cbt)
      .map(({ ts, cbt }) => [ts, getFarenheitFromCelcius(cbt / 1000)])
  );

  return (
    <>
      <a href={getFitbitAuthorizationUrl()}>reauthorize fitbit</a> |{" "}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          fileDownload(temperatureCsv, "cbt.csv");
        }}
      >
        download CORE data
      </a>{" "}
      |{" "}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          fileDownload(csv, "cbt.csv");
        }}
      >
        download fitbit data
      </a>
      {/*
      <UplotReact
        options={options}
        data={[
          timestamps.map((x) => x / 1000),
          temperatures,
          model.predict().fitted,
        ]}
        onCreate={(chart) => {}}
        onDelete={(chart) => {}}
      />
    */}
    </>
  );
};

main();
