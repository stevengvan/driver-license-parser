import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import styles from "./menu.module.css";
import { CiVideoOn } from "react-icons/ci";
import { CiCamera } from "react-icons/ci";
import { MdOutlinePhoto } from "react-icons/md";

type optionsProps = {
  changeOption: Dispatch<SetStateAction<string>>;
};

export default function Menu({ changeOption }: optionsProps) {
  return (
    <>
      <section id="scanSelection" className={styles["menu-container"]}>
        <button
          className={styles["menu-option"]}
          onClick={() => changeOption("cameraVideo")}
        >
          <CiVideoOn size={75} />
          <p>Scan from Camera</p>
        </button>

        <button
          className={styles["menu-option"]}
          onClick={() => changeOption("cameraPhoto")}
        >
          <CiCamera size={75} />
          <p>Take Photo</p>
        </button>

        <button
          className={styles["menu-option"]}
          onClick={() => changeOption("photoLibrary")}
        >
          <MdOutlinePhoto size={75} />
          <p>Choose Photo</p>
        </button>
      </section>

      <section
        style={{
          marginTop: "0.5rem",
          textAlign: "center",
          width: "100vw",
          wordBreak: "break-word",
        }}
      >
        <p className={styles["menu-text"]}>
          Please either scan or take a photo of the{" "}
          <span style={{ color: "red" }}>
            barcode located on your driver's license
          </span>
        </p>
        <img
          alt=""
          src="/license-sample.webp"
          className={styles["license-sample"]}
        />
        <br></br>
        <p className={styles["menu-note"]}>
          <span style={{ color: "red", fontWeight: "bold" }}>Note:</span> Using
          a higher resolution camera will yield more success in scanning the
          barcode located on your driver license. A phone is best used for the
          scan, although webcams can be used too.
        </p>
        <p className={styles["menu-note"]}>
          Additionally the license outline in the video stream are suggestions
          for the best view of the barcode. You can adjust the view of it to
          your liking to get the best image of it.
        </p>
      </section>
    </>
  );
}
