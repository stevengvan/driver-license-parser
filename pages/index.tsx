import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Scanner from "@/components/barcodeReader";

export default function Home() {
  return (
    <>
      <Head>
        <title>Driver's License Parser</title>
        <meta
          name="description"
          content="Parse any driver's license for easy and accessible info"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main}`}>
        <Scanner />
      </main>

      <footer>
        This project was made by Steven Van. The website uses the{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector">
          barcode detecor web API
        </a>{" "}
        documented on MDN as well as a polyfill for the barcode detection made
        by{" "}
        <a href="https://github.com/xulihang/barcode-detector-polyfill">
          Lihang Xu
        </a>
        . The polyfill mainly utilizes{" "}
        <a href="https://github.com/zxing-js/library">
          ZXing "Zebra Crossing" barcode scanning library
        </a>
        .
      </footer>
    </>
  );
}
