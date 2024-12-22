import axios from "axios";
import fs from "fs";

const image = fs.readFileSync("1.png", {
  encoding: "base64",
});

axios({
  method: "POST",
  url: "https://detect.roboflow.com/futsal-player-and-ball-detection/5",
  params: {
    api_key: "Xa3BJMVVWAUz5KeJsO5M",
  },
  data: image,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
})
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error.message);
  });
