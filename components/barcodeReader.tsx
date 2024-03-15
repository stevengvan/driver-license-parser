const BarcodeDetectorPolyfill = require("barcode-detection");
import { useEffect, useState } from "react";
import Menu from "./menu";
import CameraVideo from "./cameraVideo";
import CameraPhoto from "./cameraPhoto";
import PhotoScan from "./photoScan";
import Info from "./info";

// labels from parsing PDF417 barcode on driver licenses
const labels: { [k: string]: any } = {
  DAQ: "licenseNo",
  DAC: "firstName",
  DAD: "middleName",
  DCS: "lastName",
  DAG: "address",
  DAI: "city",
  DAJ: "state",
  DAK: "zipcode",
  DBD: "issuance",
  DBA: "expiration",
  ZOZOA: "first",
  DCA: "class",
  DCD: "endorsement",
  DCB: "restriction",
  DBB: "dob",
  DAU: "height",
  DAW: "weight",
  DAY: "eyes",
  DCF: "dd",
  DCK: "dd",
  DCG: "country",
};

var licenseInfo: { [k: string]: any } = {
  licenseNo: "",
  firstName: "",
  middleName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zipcode: "",
  issuance: "",
  expiration: "",
  first: "",
  class: "",
  restriction: "",
  endorsement: "",
  dob: "",
  height: "",
  weight: "",
  eyes: "",
  dd: "",
  country: "",
};

export default function Scanner() {
  const [option, setOption] = useState<string>("");
  const [barcodeDetector, setbarcodeDetector] = useState<any>();

  // initializes barcode detection api tool for all platform
  async function init() {
    let BarcodeDetector: any;
    if (typeof window !== "undefined") {
      if ("BarcodeDetector" in window === false) {
        BarcodeDetectorPolyfill.engine = "ZXing";
        BarcodeDetector = BarcodeDetectorPolyfill;
      }
      if ((await BarcodeDetector.getSupportedFormats()).includes("pdf417")) {
        setbarcodeDetector(new BarcodeDetector({ formats: ["pdf417"] }));
      }
    }
  }

  useEffect(() => {
    init();
  }, []);

  // checks if extracted license info has correctly been parsed
  function checkScan(licenseInfo: string) {
    const parsedCorrectly = Object.keys(labels).some((label) =>
      licenseInfo.includes(label)
    );

    return parsedCorrectly;
  }

  // displays info in easier format
  function parseInfo(text: string) {
    const values = text.split(/[\r\n]+/);
    const textForm = document.getElementById("textForm") as HTMLTextAreaElement;
    textForm.textContent = "";
    let fullName = "";
    let location = "";

    for (let label in labels) {
      var info: string = values.find((element) =>
        element.includes(label)
      ) as string;
      licenseInfo[labels[label]] = info.slice(
        info.indexOf(label) + label.length
      );
      var formInput: HTMLInputElement;
      var textInfo = "";

      // combine first, middle, and last name into one string
      if (label === "DAC" || label === "DAD" || label === "DCS") {
        formInput = document.getElementsByName(
          "fullName"
        )[0] as HTMLInputElement;

        fullName += licenseInfo[labels[label]];
        if (label !== "DCS") {
          fullName += " ";
        }
        formInput.value = fullName;
      }
      // combine city, state, and zipcode into one string
      else if (label === "DAI" || label === "DAJ" || label === "DAK") {
        formInput = document.getElementsByName(
          "location"
        )[0] as HTMLInputElement;
        location += licenseInfo[labels[label]];
        if (label === "DAI") {
          location += ", ";
        } else if (label === "DAJ") {
          location += " ";
        }
        formInput.value = location;
      }
      // format dates
      else if (
        label === "DBB" ||
        label === "DBD" ||
        label === "DBA" ||
        label === "ZOZOA"
      ) {
        let date: string = licenseInfo[labels[label]];

        formInput = document.getElementsByName(
          labels[label]
        )[0] as HTMLInputElement;

        formInput.value = String(
          date.substring(0, 2) +
            "/" +
            date.substring(2, 4) +
            "/" +
            date.substring(4)
        );
        textInfo = `${labels[label]}: ${formInput.value}\n`;
      }
      // convert height from inches to feets and inches
      else if (label === "DAU") {
        let totalHeight = Number(licenseInfo[labels[label]].substring(0, 3));
        let feets = Math.floor(totalHeight / 12);
        let inches = totalHeight - feets * 12;

        formInput = document.getElementsByName("height")[0] as HTMLInputElement;
        formInput.value = `${feets}'-${
          inches > 9 ? inches : "0" + String(inches)
        }"`;
        textInfo = `${labels[label]}: ${formInput.value}\n`;
      }
      // add unit of measure to weight
      else if (label === "DAW") {
        formInput = document.getElementsByName("weight")[0] as HTMLInputElement;
        formInput.value = licenseInfo[labels[label]] + " lb";
        textInfo = `${labels[label]}: ${formInput.value}\n`;
      } else {
        formInput = document.getElementsByName(
          labels[label]
        )[0] as HTMLInputElement;

        formInput.value = licenseInfo[labels[label]];
      }

      if (textInfo.length === 0)
        textInfo = `${labels[label]}: ${licenseInfo[labels[label]]}\n`;
      textForm.textContent += textInfo;
    }

    return licenseInfo;
  }

  function scanPhoto(imageEl: HTMLElement) {
    barcodeDetector
      .detect(imageEl)
      .then((barcodes: any) => {
        if (
          barcodes.length > 0 &&
          checkScan(JSON.stringify(barcodes[0].rawValue)) == true
        ) {
          alert("Parsed driver's license info");
          licenseInfo = parseInfo(barcodes[0].rawValue);
        } else {
          alert("Couldn't detect barcode. Scan again or take a new Photo");
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  function scanVideo(videoEl: HTMLVideoElement) {
    barcodeDetector
      .detect(videoEl)
      .then((barcodes: any) => {
        if (
          barcodes.length > 0 &&
          checkScan(JSON.stringify(barcodes[0].rawValue))
        ) {
          alert("Parsed driver's license info");
          licenseInfo = parseInfo(barcodes[0].rawValue);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  return (
    <>
      {option === "" && <Menu changeOption={setOption} />}

      {option === "cameraVideo" && (
        <CameraVideo changeOption={setOption} scan={scanVideo} />
      )}

      {option === "cameraPhoto" && (
        <CameraPhoto changeOption={setOption} scan={scanPhoto} />
      )}

      {option === "photoLibrary" && (
        <PhotoScan changeOption={setOption} scan={scanPhoto} />
      )}

      <br></br>
      <Info />
      <br></br>
    </>
  );
}
