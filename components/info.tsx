import { useState } from "react";
import styles from "./info.module.css";

export default function Info() {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [textMode, setTextMode] = useState<boolean>(false);
  function clearInfo() {
    const license = document.getElementById("parsedLicense") as HTMLFormElement;
    license.reset();
    const textForm = document.getElementById("textForm") as HTMLTextAreaElement;
    textForm.textContent = "";
  }
  return (
    <>
      <button className="actionButton" onClick={clearInfo}>
        Clear License
      </button>
      <button className="actionButton" onClick={() => setTextMode(!textMode)}>
        {textMode ? "Form Mode" : "Text Mode"}
      </button>
      <button
        className="actionButton"
        onClick={() => setShowMore(!showMore)}
        style={!textMode ? { display: "block" } : { display: "none" }}
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
      <br></br>

      <form
        id="parsedLicense"
        style={!textMode ? { display: "block" } : { display: "none" }}
      >
        <label htmlFor="licenseNo">License No.: </label>
        <input type="text" name="licenseNo"></input>
        <br></br>

        <label htmlFor="fullName">Full Name: </label>
        <input type="text" name="fullName"></input>
        <br></br>

        <label htmlFor="address">Address: </label>
        <input type="text" name="address"></input>
        <br></br>

        <label htmlFor="location">Location: </label>
        <input type="text" name="location"></input>
        <br></br>

        <label htmlFor="country">Country: </label>
        <input type="text" name="country"></input>
        <br></br>

        <label htmlFor="dob">Date of Birth: </label>
        <input type="text" name="dob"></input>
        <br></br>

        <label htmlFor="issuance">Issuance: </label>
        <input type="text" name="issuance"></input>
        <br></br>

        <label htmlFor="expiration">Expiration: </label>
        <input type="text" name="expiration"></input>
        <br></br>

        <div style={{ display: showMore ? "block" : "none" }}>
          <label htmlFor="first">First: </label>
          <input type="text" name="first"></input>
          <br></br>

          <label htmlFor="class">Class: </label>
          <input type="text" name="class"></input>
          <br></br>

          <label htmlFor="restriction">Restriction: </label>
          <input type="text" name="restriction"></input>
          <br></br>

          <label htmlFor="endorsement">Endorsement: </label>
          <input type="text" name="endorsement"></input>
          <br></br>

          <label htmlFor="height">Height: </label>
          <input type="text" name="height"></input>
          <br></br>

          <label htmlFor="weight">Weight: </label>
          <input type="text" name="weight"></input>
          <br></br>

          <label htmlFor="eyes">Eyes: </label>
          <input type="text" name="eyes"></input>
          <br></br>

          <label htmlFor="dd">Document Discriminator: </label>
          <input type="text" name="dd"></input>
          <br></br>
        </div>
      </form>

      <textarea
        id="textForm"
        className={styles.textForm}
        style={textMode ? { display: "block" } : { display: "none" }}
      ></textarea>
    </>
  );
}
