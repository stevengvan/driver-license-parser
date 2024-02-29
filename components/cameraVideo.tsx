import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";

type CameraScanProps = {
  changeOption: Dispatch<SetStateAction<string>>;
  scan: (videoEl: HTMLVideoElement) => void;
};

export default function CameraVideo({ changeOption, scan }: CameraScanProps) {
  const [stream, setStream] = useState<MediaStream>();
  const [intervalId, setIntervalId] = useState<any>([]);
  const [frameWidth, setFrameWidth] = useState<number>(500);
  const [modifiedWidth, setModifiedWidth] = useState<number>(500);
  const [heightModifier, setHeightModifier] = useState<number>(1.75);
  const [pX, setPX] = useState<number>(0);
  const [pY, setPY] = useState<number>(0);

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

    // start scanning video every 3 seconds
    let id = setInterval(startVideoScan, 3000);
    let newList = [...intervalId];
    newList.push(id);
    setIntervalId((oldList: any) => [...oldList, newList]);
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

  async function startVideoScan() {
    const videoEl = document.getElementById("stream") as HTMLVideoElement;
    await scan(videoEl);
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
    if (stream) {
      stream.getTracks().forEach(function (track: MediaStreamTrack) {
        track.stop();
      });
    }

    // clear any active scans
    intervalId.forEach((id: any) => {
      clearInterval(id);
    });

    video.pause();
    video.srcObject = null;

    // return to menu
    changeOption("");
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

      <div style={{ display: "flex", flexDirection: "column" }}>
        <canvas
          id="streamCanvas"
          style={{
            border: "2px solid blue",
            width: "100vw",
            height: "auto",
          }}
        ></canvas>
      </div>

      <button className="actionButton" onClick={goBack}>
        Menu
      </button>
    </>
  );
}
