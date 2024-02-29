import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import Loading from "./loading";

type PhotoScanProps = {
  changeOption: Dispatch<SetStateAction<string>>;
  scan: (imagEl: HTMLElement) => void;
};

export default function PhotoScan({ changeOption, scan }: PhotoScanProps) {
  const [scanning, setScanning] = useState<boolean>(false);

  function getImgData(event: any): any {
    const imgPreview = document.getElementById("license") as HTMLImageElement;
    if (event.target.files[0]) {
      const files = event.target.files[0];
      if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
          imgPreview.src = this.result as string;
        });
      }
    }
  }

  function startScan() {
    const imageEl = document.getElementById("license") as HTMLElement;
    setScanning(true);
    window.setTimeout(() => {
      scan(imageEl);
      setScanning(false);
    }, 1000);
  }

  function goBack() {
    const imgPreview = document.getElementById("license") as HTMLImageElement;
    imgPreview.src = "";
    changeOption("");
  }

  return (
    <>
      <input
        className="actionButton"
        id="choose-file"
        type="file"
        accept="image/*"
        onChange={getImgData}
      />
      <br></br>
      <img id="license" style={{ width: "200px", height: "auto" }} />
      <br></br>
      <button className="actionButton" onClick={startScan}>
        Scan
      </button>
      <button className="actionButton" onClick={goBack}>
        Back
      </button>

      {scanning && <Loading />}
    </>
  );
}
