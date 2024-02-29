import { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import Loading from "./loading";

type CameraScanProps = {
  changeOption: Dispatch<SetStateAction<string>>;
  scan: (imageEl: HTMLElement) => void;
};

export default function CameraPhoto({ changeOption, scan }: CameraScanProps) {
  const [stream, setStream] = useState<MediaStream>();
  const [intervalId, setIntervalId] = useState<any>([]);
  const [frameWidth, setFrameWidth] = useState<number>(500);
  const [modifiedWidth, setModifiedWidth] = useState<number>(500);
  const [pX, setPX] = useState<number>(0);
  const [pY, setPY] = useState<number>(0);
  const [heightModifier, setHeightModifier] = useState<number>(1.75);

  const [imgSrc, setImgSrc] = useState<string>("");
  let image = document.getElementById("license") as HTMLImageElement;
  const [scanning, setScanning] = useState<boolean>(false);

  function mobileCheck() {
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }

  // sets up video streaming from device's camera or webcam
  async function init() {
    let newStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 4032 },
        height: { ideal: 3024 },
      },
      audio: false,
    });
    setStream(newStream);

    let video = document.getElementById("stream") as HTMLVideoElement;
    video.srcObject = newStream;
    var playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          alert("started camera scan");

          // start drawing license outline on stream
          let id = setInterval(drawFrame, 10);
          let newList = [...intervalId];
          newList.push(id);
          setIntervalId((oldList: any) => [...oldList, newList]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  useEffect(() => {
    init();
  }, []);

  // used to draw approximate size of license outline for best view of the license with barcode
  function drawFrame() {
    let video = document.getElementById("stream") as HTMLVideoElement;
    let canvas = document.getElementById("streamCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    let ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    if (!ctx) return;

    // initialize canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // adust outline size to scan license
    let finalWidth: number = 0;
    let finalHeight: number = 0;
    if (video.videoWidth < video.videoHeight || mobileCheck()) {
      let widthModifier: number = 0;
      if (window.innerWidth > window.innerHeight) {
        widthModifier = Math.round(canvas.width / 640) / 1.5;
        setHeightModifier(2);
      } else {
        widthModifier = Math.round(canvas.width / 640);
        setHeightModifier(1.75);
      }
      finalWidth = frameWidth * widthModifier;
    } else {
      if (window.innerWidth <= 700) {
        finalWidth = video.videoWidth / 2.25;
      } else {
        finalWidth = 600;
      }
    }
    finalHeight = finalWidth / heightModifier;
    if (modifiedWidth !== finalWidth) {
      setModifiedWidth(finalWidth);
    }

    // get positioning to center license outline
    let startX = canvas.width / 2 - finalWidth / 2;
    let startY = canvas.height / 2 - finalHeight / 2;
    if (pX !== startX || pY !== startY) {
      setPX(startX);
      setPY(startY);
    }

    // draw license outline
    ctx.rect(startX, startY, finalWidth, finalHeight);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "red";
    ctx.stroke();
  }

  // convert image data into useable image URL
  function getImageURL(imgData: ImageData) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let canvasSource = document.getElementById(
      "streamCanvas"
    ) as HTMLCanvasElement;
    let ctxSource = canvasSource.getContext("2d");

    if (!ctx || !ctxSource) return;

    let finalWidth = modifiedWidth;
    let finalHeight = finalWidth / heightModifier;
    canvas.width = finalWidth;
    canvas.height = finalHeight;
    canvas.style.width = "100vw";
    canvas.style.height = "auto";

    ctx.putImageData(imgData, 0, 0);
    setImgSrc(canvas.toDataURL());
    return canvas.toDataURL();
  }

  // previews image taken
  function replaceImage() {
    let canvas = document.getElementById("streamCanvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    if (!ctx) {
      return;
    }

    let finalWidth = modifiedWidth;
    let finalHeight = finalWidth / heightModifier;

    var image = document.getElementById("license") as HTMLImageElement;
    if (!image) return;
    image.style.display = "block";

    // get image URL from photo taken and stop streaming camera
    var ImageData = ctx.getImageData(pX, pY, finalWidth, finalHeight);
    image.src = getImageURL(ImageData) as string;
    if (stream) {
      stream.getTracks().forEach(function (track: any) {
        track.stop();
      });
    }
  }

  function startPhotoScan() {
    const imageEl = document.getElementById("license") as HTMLElement;
    setScanning(true);
    window.setTimeout(() => {
      scan(imageEl);
      setScanning(false);
    }, 2000);
  }

  function goBack() {
    let video = document.getElementById("stream") as HTMLVideoElement;
    let canvas = document.getElementById("streamCanvas") as HTMLCanvasElement;

    // clear canvas streaming the camera
    if (canvas) {
      let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.height / video.videoHeight, canvas.height);
    }

    // stop video stream
    stream?.getTracks().forEach(function (track: MediaStreamTrack) {
      track.stop();
    });

    // clear any active scans
    intervalId.forEach((id: any) => {
      clearInterval(id);
    });
    video.pause();
    image.src = "";
    video.srcObject = null;

    // return to menu
    changeOption("");
  }

  function goBackCamera() {
    let video = document.getElementById("stream") as HTMLVideoElement;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
    var image = document.getElementById("license") as HTMLImageElement;
    image.style.display = "none";
    setImgSrc("");
    init();
  }

  return (
    <>
      <video
        id="stream"
        preload="none"
        autoPlay
        loop
        muted
        controls
        playsInline
        style={{
          display: "none",
        }}
      ></video>

      {imgSrc.length === 0 && (
        <>
          <canvas
            id="streamCanvas"
            style={{
              border: "2px solid blue",
              width: "100vw",
              height: "auto",
            }}
          ></canvas>
          <button className="actionButton" onClick={replaceImage}>
            Take Photo
          </button>
        </>
      )}

      <img
        id="license"
        style={{
          border: "2px solid black",
          width: "100vw",
          height: "auto",
          display: "none",
        }}
      />

      {imgSrc.length > 0 && (
        <>
          <button className="actionButton" onClick={startPhotoScan}>
            Scan
          </button>
          <button className="actionButton" onClick={goBackCamera}>
            Take Another Photo
          </button>
        </>
      )}
      <button className="actionButton" onClick={goBack}>
        Back
      </button>

      {scanning && <Loading />}
    </>
  );
}
