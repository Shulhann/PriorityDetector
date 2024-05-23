import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import Webcam from "react-webcam";
import WebcamCapture from "./components/WebcamCapture";

export default function Home() {
  // const webRef = useRef<any>(null);
  // const [imageData, setImageData] = useState<string | null>(null);
  let img = null;

  return (
      <section className="flex flex-col items-center">
        <h1 className="text-5xl font-bold my-10">Registrasi dan Scan Wajah</h1>
        {/* <div className="flex flex-row"> */}
          <WebcamCapture/>
          {/* <Webcam ref={webRef}/>
          <canvas id="webcam-canvas" width={640} height={480} style={{ display: 'none' }} />
          <button className="" onClick={handleCapture}>Show Images in console</button>
          {imageData && <Image src={imageData} alt="Captured Webcam Image" width={640} height={480}/>} */}
          {/* <img src={img} alt="Captured Webcam Image"/> */}
        {/* </div> */}
      </section>
  );
}
