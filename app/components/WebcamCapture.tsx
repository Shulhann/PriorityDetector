'use client'

import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Prisma } from '@prisma/client/extension';

const WebcamCapture = () => {
  const webcamRef = useRef<any>(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [suhu, setSuhu] = useState('');
  const [status, setStatus] = useState('');
  const [antrian, setAntrian] = useState('');

  const capture = useCallback(() => {
    
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    // Send image data to server to save
    fetch('/api/saveImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData: imageSrc }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save image');
        }
        console.log('Image saved successfully');
        alert("Save image success");
      })
      .catch(error => {
        console.error('Error saving image:', error);
      });
  }, [webcamRef]);

  return (
    <div className='flex flex-row'>
      <Webcam
        audio={false}
        ref={webcamRef}
        width={500}
        screenshotFormat="image/jpeg"
      />
      <div className='flex flex-col'>
        <form className='flex flex-col mx-12 w-full'>
          <div className='flex flex-row justify-between mb-6'>
            <label className='' htmlFor='textInputName'>Nama: </label>
            <input type='text' value={nama} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setNama(e.target.value)}}className='form-control px-2 border border-gray-500 rounded' id='textInputName'/>
          </div>
          <div className='flex flex-row justify-between mb-6'>
            <label className='' htmlFor='textInputNIK'>NIK: </label>
            <input type='text' value={nik} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setNik(e.target.value)}} className='form-control px-2 border border-gray-500 rounded' id='textInputNIK'/>
          </div>
          <div className='flex flex-row justify-between mb-6'>
            <label className='' htmlFor='textInputSuhu'>Suhu: </label>
            <input disabled type='text' value={suhu} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setSuhu(e.target.value)}} className='form-control px-2 border border-gray-500 rounded' id='textInputSuhu'/>
          </div>
          <div className='flex flex-row justify-between mb-6'>
            <label className='' htmlFor='textInputStatus'>Status: </label>
            <input disabled type='text' value={status} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setStatus(e.target.value)}} className='form-control px-2 border border-gray-500 rounded' id='textInputStatus'/>
          </div>
            <div className='flex flex-col bg-[#EFDAD7] p-4 rounded-2xl'>
              <label className='mb-2' htmlFor='textInputAntrian'>Urutan Antrian: </label>
              <input disabled type='text' value={antrian} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setAntrian(e.target.value)}} className='form-control bg-[#EFDAD7] px-2 mb-4' id='textInputAntrian'/>
            </div>
            <div className='flex flex-row'>
              <button className="mt-4 bg-[#1572A1] text-white border rounded-2xl w-full h-8"onClick={capture}>Kirim</button>
              {/* <button className="mt-4 bg-blue-400 border rounded w-1/2 h-8"onClick={()=>{}}>Masuk Antrian</button> */}
            </div>
            {/* <button className="mt-2 bg-[#1572A1] text-white border rounded-2xl w-full h-8"onClick={capture}>Kirim</button> */}
            
        </form>
      </div>
    </div>
  );
};

export default WebcamCapture;