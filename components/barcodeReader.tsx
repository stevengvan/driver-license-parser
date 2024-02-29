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
  DCA: "class",
  DCB: "endorsement",
  DCD: "restriction",
  DBB: "dob",
  DAW: "weight",
  DAY: "eyes",
  DBD: "issuance",
  DBA: "expiration",
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
  class: "",
  restriction: "",
  endorsement: "",
  dob: "",
  weight: "",
  eyes: "",
  issuance: "",
  expiration: "",
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
      if (label === "DAC" || label === "DAD" || label === "DCS") {
        formInput = document.getElementsByName(
          "fullName"
        )[0] as HTMLInputElement;
        fullName += licenseInfo[labels[label]];
        if (label !== "DCS") {
          fullName += " ";
        }
        formInput.value = fullName;
      } else if (label === "DAI" || label === "DAJ" || label === "DAK") {
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
      } else if (label === "DBB" || label === "DBD" || label === "DBA") {
        switch (label) {
          case "DBB":
            formInput = document.getElementsByName(
              "dob"
            )[0] as HTMLInputElement;
            break;
          case "DBD":
            formInput = document.getElementsByName(
              "issuance"
            )[0] as HTMLInputElement;
            break;
          case "DBA":
            formInput = document.getElementsByName(
              "expiration"
            )[0] as HTMLInputElement;
            break;
        }
        let date: string = licenseInfo[labels[label]];
        formInput.value =
          date.substring(0, 2) +
          "/" +
          date.substring(2, 4) +
          "/" +
          date.substring(4);
      } else {
        formInput = document.getElementsByName(
          labels[label]
        )[0] as HTMLInputElement;

        if (formInput) {
          formInput.value = licenseInfo[labels[label]];
        }
      }
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
