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
  const [nikEmpty, setNIKEmpty] = useState(true)
  const [nama, setNama] = useState('');
  const [namaEmpty, setNamaEmpty] = useState(true)
  const [suhu, setSuhu] = useState('');
  const [suhuEmpty, setSuhuEmpty] = useState(true)
  const [status, setStatus] = useState('');
  const [statusEmpty, setStatusEmpty] = useState(true)
  const [antrian, setAntrian] = useState('');
  const [antrianEmpty, setAntrianEmpty] = useState(true)
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDiagnose, setIsDiagnose] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [healthyScore, setHealthyScore] = useState('');
  const [scoreEmpty, setScoreEmpty] = useState(true);
  const [sickScore, setSickScore] = useState('');

  const isValid = (x:string) => {
    if (x == ''){
      return false;
    }
    else{
      return true;
    }
  }

  function containsOnlyNumbers(str:string) {
    return /^[0-9]+$/.test(str);
  }

  const isNIKValid = (x:string) => {
    if(containsOnlyNumbers(x) && x.length == 16){
      return true;
    }
    else{
      return false;
    }
  }

  const startCapture = () => {
    console.log('Start capturing and diagnose...');
    setIsDiagnose(true);
    setScoreEmpty(true);
  }
    
  
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
      setIsDiagnose(false);
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
        setSuhuEmpty(false);
      }, 5000); // Capture for 5 seconds

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
    if(isDiagnose){
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
          setIsDiagnose(false);
        })
        .catch(error => {
          console.error('Error saving image:', error);
          setIsDiagnose(false);
        });
    }
  }, [isCapturing, isDiagnose]);

  const startTemperatureCapture = () => {
    console.log('Starting temperature capture...');
    setSuhu(''); // Clear the temperature display
    setSuhuEmpty(true)
    setIsCapturing(true);
  };

  const parseDiagnosisResult = (data:any) => {
    if (data && data.predictions) {
      const healthy = data.predictions.find((p:any) => p.condition === 'healthy');
      const sick = data.predictions.find((p:any) => p.condition === 'sick');

      setHealthyScore(healthy.confidence.toFixed(2));
      setSickScore(sick.confidence.toFixed(2));

      if (healthy && sick) {
        setScoreEmpty(false);
        return (`Sakit dengan ${sick.confidence.toFixed(2)} confidence and sehat dengan ${healthy.confidence.toFixed(2)} confidence`);
      }
    }
    return 'Diagnosis unavailable';
  };

  const checkStatus = (e:any) => {
    e.preventDefault();
    if (healthyScore < sickScore) {
      setStatus('Prioritas');
      let nomor = priorityData.length + 1;
      setAntrian(String("PQ - " + nomor));
    } else {
      setStatus('Normal');
      let nomor = nonPriorityData.length + 1;
      setAntrian(String("GQ - " + nomor));
    }
    setStatusEmpty(false)
  };

  const addToAntrian = (e:any) => {
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
          <div className='flex flex-row justify-between mb-2'>
            <label className='' htmlFor='textInputName'>Nama: </label>
            <div>
              <input type='text' value={nama} onChange={(e) => {setNama(e.target.value); if(isValid(e.target.value)){setNamaEmpty(false)}else{setNamaEmpty(true)}}} className={`form-control w-[50vh] px-2 border ${namaEmpty ? 'border-rose-600' : 'border-gray-500'} rounded' id='textInputName`} />
              {namaEmpty ? <div className=""><p className="text-xs text-rose-600">Tolong masukkan nama Anda</p></div> : <div className="mb-4"></div>}
            </div>
          </div>
          <div className='flex flex-row justify-between mb-2'>
              <label className='' htmlFor='textInputNIK'>NIK: </label>
            <div>
              <input type='text' value={nik} onChange={(e) => {setNik(e.target.value); if(isNIKValid(e.target.value)){setNIKEmpty(false)}else{setNIKEmpty(true)}}} className={`form-control w-[50vh] px-2 border ${nikEmpty ? 'border-rose-600' : 'border-gray-500'} rounded' id='textInputNIK`} />
              {nikEmpty ? containsOnlyNumbers(nik) ? <div className=""><p className="text-xs text-rose-600">NIK harus 16 digit</p></div> : <div className=""><p className="text-xs text-rose-600">NIK harus berupa angka</p></div> : <div className="mb-4"></div>}
            </div>
          </div>
          <div className='flex flex-row justify-between mb-6'>
            <label className='' htmlFor='textInputSuhu'>Suhu: </label>
            <input disabled type='text' value={suhu} onChange={(e) => setSuhu(e.target.value)} className='form-control w-[50vh] px-2 border border-gray-500 rounded' id='textInputSuhu' />
          </div>
          <div className='flex flex-row justify-between mb-6'>
            <label className='' htmlFor='textInputStatus'>Status: </label>
            <input disabled type='text' value={status} onChange={(e) => setStatus(e.target.value)} className='form-control w-[50vh] px-2 border border-gray-500 rounded' id='textInputStatus' />
          </div>
          <div className='flex flex-col bg-[#EFDAD7] p-4 rounded-2xl'>
            <label className='mb-2' htmlFor='textInputAntrian'>Urutan Antrian: </label>
            <input disabled type='text' value={antrian} onChange={(e) => setAntrian(e.target.value)} className='form-control bg-[#EFDAD7] px-2 mb-4 w-[60vh]' id='textInputAntrian' />
          </div>
          <div className='flex flex-row mt-4'>
            <button
              className={`${isCapturing ? 'bg-gray-400' : 'bg-[#1572A1]'}  text-white border rounded-2xl mr-1 w-full h-8`}
              onClick={startTemperatureCapture}
              disabled={isCapturing}
            >
              {isCapturing ? 'Mengukur Suhu...' : 'Ambil Suhu'}
            </button>
            <button
              type="button"
              className={`${isDiagnose ? 'bg-gray-400' : 'bg-[#1572A1]'} text-white border rounded-2xl ml-1 w-full h-8`}
              onClick={startCapture}
              disabled={isDiagnose}
            >
              {isDiagnose ? 'Mengambil gambar dan diagnosis...' : 'Ambil Gambar dan Diagnosis'}
            </button>
          </div>
          <div className='flex flex-row'>
            <button className={`mt-4 ${suhuEmpty || scoreEmpty ?'bg-gray-400' : 'bg-[#1572A1]'} text-white border rounded-2xl w-full h-8`} onClick={checkStatus} disabled={suhuEmpty || scoreEmpty}>Cek Status</button>
          </div>
          <div className='flex flex-row'>
            <button className={`mt-4 ${statusEmpty || namaEmpty || nikEmpty  ?'bg-gray-400' : 'bg-[#1572A1]'} text-white border rounded-2xl w-full h-8`} onClick={addToAntrian} disabled={statusEmpty || namaEmpty || nikEmpty}>Kirim</button>
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