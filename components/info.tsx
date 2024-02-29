export default function Info() {
  function clearInfo() {
    const license = document.getElementById("parsedLicense") as HTMLFormElement;
    license.reset();
  }
  return (
    <>
      <button className="actionButton" onClick={clearInfo}>
        Clear License
      </button>
      <br></br>

      <form id="parsedLicense">
        <label htmlFor="licenseNo">License No.: </label>
        <input type="text" name="licenseNo"></input>
        <br></br>

        <label>Full Name: </label>
        <input type="text" name="fullName"></input>
        <br></br>

        <label>Address: </label>
        <input type="text" name="address"></input>
        <br></br>

        <label>Location: </label>
        <input type="text" name="location"></input>
        <br></br>

        <label>Date of Birth: </label>
        <input type="text" name="dob"></input>
        <br></br>

        <label>Issuance: </label>
        <input type="text" name="issuance"></input>
        <br></br>

        <label>Expiration: </label>
        <input type="text" name="expiration"></input>
        <br></br>
      </form>
    </>
  );
}
