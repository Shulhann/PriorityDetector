'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { priorityData } from '../antrian/page';
import { nonPriorityData } from '../antrian/page';

const API_URL = 'http://localhost:3001/api/temperature'; // API URL for the MQTT subscriber service
const SAVE_IMAGE_URL = 'http://localhost:3002/api/saveImage'; // API URL to save the image and process it

const WebcamCapture = () => {
  const webcamRef = useRef<any>(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [suhu, setSuhu] = useState('');
  const [status, setStatus] = useState('');
  const [antrian, setAntrian] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [healthyScore, setHealthyScore] = useState('');
  const [sickScore, setSickScore] = useState('');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    console.log('Captured image:', imageSrc);

    // Send image data to server to save and process
    fetch(SAVE_IMAGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData: imageSrc }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Diagnosis result:', data);
        const diagnosisResult = parseDiagnosisResult(data);
        setDiagnosis(diagnosisResult);
      })
      .catch(error => {
        console.error('Error saving image:', error);
      });
  }, [webcamRef]);

  useEffect(() => {
    if (isCapturing) {
      const fetchTemperatureData = async () => {
        try {
          const response = await axios.get(API_URL);
          const temperature = response.data.temperature;
          console.log('Fetched temperature data:', temperature);
          setSuhu(temperature.toFixed(2));
        } catch (error) {
          console.error('Error fetching temperature data:', error);
        }
      };

      const intervalId = setInterval(fetchTemperatureData, 1000); // Fetch data every second
      const timeoutId = setTimeout(() => {
        setIsCapturing(false);
        clearInterval(intervalId);
      }, 5000); // Capture for 5 seconds

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [isCapturing]);

  const startTemperatureCapture = () => {
    console.log('Starting temperature capture...');
    setSuhu(''); // Clear the temperature display
    setIsCapturing(true);
  };

  const parseDiagnosisResult = (data) => {
    if (data && data.predictions) {
      const healthy = data.predictions.find(p => p.condition === 'healthy');
      const sick = data.predictions.find(p => p.condition === 'sick');

      setHealthyScore(healthy.confidence.toFixed(2));
      setSickScore(sick.confidence.toFixed(2));

      if (healthy && sick) {
        return (`Sakit dengan ${sick.confidence.toFixed(2)} confidence and sehat dengan ${healthy.confidence.toFixed(2)} confidence`);
      }
    }
    return 'Diagnosis unavailable';
  };

  const checkStatus = (e) => {
    e.preventDefault();
    if (healthyScore < sickScore) {
      setStatus('Prioritas');
      let nomor = priorityData.length + 1;
      setAntrian(String("PQ - " + nomor));
    } else {
      setStatus('Normal');
      let nomor = nonPriorityData.length + 1;
      setAntrian(String("PQ - " + nomor));
    }
  };

  const addToAntrian = (e) => {
    e.preventDefault();
    if (status === 'Prioritas') {
      priorityData.push({
        id: priorityData.length + 1,
        name: nama,
        queue: antrian
      })
    } else {
      nonPriorityData.push({
        id: nonPriorityData.length + 1,
        name: nama,
        queue: antrian
      })
    }
    alert("Antrian Ditambahkan");
    setNik('');
    setNama('');
    setSuhu('');
    setStatus('');
    setAntrian('');
  }

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
            <input type='text' value={nama} onChange={(e) => setNama(e.target.value)} className='form-control px-2 border border-gray-500 rounded' id='textInputName' />
          </div>
          <div className='flex flex-row justify-between mb-6'>
            <label className='' htmlFor='textInputNIK'>NIK: </label>
            <input type='text' value={nik} onChange={(e) => setNik(e.target.value)} className='form-control px-2 border border-gray-500 rounded' id='textInputNIK' />
          </div>
          <div className='flex flex-row justify-between mb-6'>
            <label className='' htmlFor='textInputSuhu'>Suhu: </label>
            <input disabled type='text' value={suhu} onChange={(e) => setSuhu(e.target.value)} className='form-control px-2 border border-gray-500 rounded' id='textInputSuhu' />
          </div>
          <div className='flex flex-row justify-between mb-6'>
            <label className='' htmlFor='textInputStatus'>Status: </label>
            <input disabled type='text' value={status} onChange={(e) => setStatus(e.target.value)} className='form-control px-2 border border-gray-500 rounded' id='textInputStatus' />
          </div>
          <div className='flex flex-col bg-[#EFDAD7] p-4 rounded-2xl'>
            <label className='mb-2' htmlFor='textInputAntrian'>Urutan Antrian: </label>
            <input disabled type='text' value={antrian} onChange={(e) => setAntrian(e.target.value)} className='form-control bg-[#EFDAD7] px-2 mb-4' id='textInputAntrian' />
          </div>
          <div className='flex flex-row mt-4'>
            <button
              className={`bg-${isCapturing ? 'gray-500' : '#1572A1'} mt-4,,.; bg-[#1572A1] text-white border rounded-2xl w-full h-8`}
              onClick={startTemperatureCapture}
              disabled={isCapturing}
            >
              {isCapturing ? 'Mengukur Suhu...' : 'Ambil Suhu'}
            </button>
          </div>
          <div className='flex flex-row mt-4'>
            <button
              type="button"
              className="bg-[#1572A1] text-white border rounded-2xl w-full h-8"
              onClick={capture}
            >
              Ambil Gambar dan Diagnosis
            </button>
          </div>
          <div className='flex flex-row'>
            <button className="mt-4 bg-[#1572A1] text-white border rounded-2xl w-full h-8" onClick={checkStatus}>Cek Status</button>
          </div>
          <div className='flex flex-row'>
            <button className="mt-4 bg-[#1572A1] text-white border rounded-2xl w-full h-8" onClick={addToAntrian}>Kirim</button>
          </div>
        </form>
        {diagnosis && (
          <div className='mt-4'>
            <h3 className='ml-24 text-xl text-center font-semibold'>Diagnosis Result</h3>
            <p className='ml-24'>{diagnosis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;