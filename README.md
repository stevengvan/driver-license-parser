# Driver License Parser (DL Parser)

DL Parser is a website that hosts options to scan and parse US driver's licenses using Next JS. It features scanning from both video stream and photos taken from cameras. By utilizing the barcode located on US driver's licenses, this website can parse all of the information that's present on the license. It is recommended to use a phone to scan the license's barcode, although a webcam can also be used if the video/image quality is high enough.

The project is hosted on [https://dl-parser.vercel.app/](https://dl-parser.vercel.app/)

## Running the project locally

Running either of these commands will allow you to start a local server on port 3000.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result if using a desktop.

To view this on mobile devices, you will need to use your IPv4 address instead of localhost and run it on HTTPS instead (ex. https://123.456.7.8:3000) (this is not a real link)

## Project Architecture

This website mainly runs on Next JS, which organizes the project by pages. The home page used is `index.tsx` that uses components made to operate the website. All components used for the website are located in a separate folder, `components`, in the root. The main component is `barcodeReader.tsx`, which is the host for all other components such as th menu and scanning options. Each scanning option utilizes `barcodeReader.tsx` to borrow scanning functions.

## Chosen Technologies

The project mainly runs on Next JS and Typescript since the project can easisly be deployed and hosted on Vercel thanks to the framework.

From all of the barcode scanning libraries to use for the driver's license, I mainly utilized the barcode detector web API that is already provided for Javascript, and used ZXing's barcode scanning library to polyfill support for older browsers.

**Libraries used:**
[Barcode Detector Web API](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector#see_also)
[Barcode Detection Polyfill](https://www.npmjs.com/package/barcode-detection)
[ZXing Barcode Detection Library](https://github.com/zxing-js/library)
