'use client'

import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [currentPriorityQueue, setCurrentPriorityQueue] = useState('PQ - 001');
  const [priorityLocation, setPriorityLocation] = useState('RD05');
  const [nonPriorityLocation, setNonPriorityLocation] = useState('ADM01');
  const [currentNonPriorityQueue, setCurrentNonPriorityQueue] = useState('GQ - 001');
  const priorityData = [{
    id:1,
    name: "I Dewa Made Manu Pradnyana",
    queue: "PQ - 001"
  }]
  const nonPriorityData = [{
    id:1,
    name: "Muhammad Shulhan",
    queue: "GQ - 001"
  },
  {
    id:2,
    name: "Apis",
    queue: "GQ - 002"
  }]
  return (
      <section className="flex flex-row justify-center mt-5">
        <div className="flex flex-col mr-5">
          <div className='flex flex-row mb-2'>
            <h1 className=" bg-[#D7C4C2] px-16 py-4 text-5xl font-bold">{currentNonPriorityQueue}</h1>
            <h1 className="bg-[#F2E1DF] text-2xl px-5 py-6 font-bold">{nonPriorityLocation}</h1>
          </div>
          <div className="bg-[#EFDAD7] w-full h-[65vh] ">
            {
              nonPriorityData.map(item => (
                <div key={item.id} className='flex flex-row justify-between mx-10 my-3'>
                  <h1>{item.name}</h1>
                  <h1>{item.queue}</h1>
                </div>
              )
              )
            }
          </div>
        </div>
        <div className="flex flex-col ml-5">
          <div className="flex flex-row mb-2">
            <h1 className="bg-[#7BA6BD] px-16 py-4 text-5xl font-bold">{currentPriorityQueue}</h1>
            <h1 className="bg-[#C2E3F4] text-2xl px-5 py-6 font-bold">{priorityLocation}</h1>
          </div>
          <div className="bg-[#9AD0EC] w-full h-[65vh] ">
          {
              priorityData.map(item => (
                <div key={item.id} className='flex flex-row justify-between mx-10 my-3'>
                  <h1>{item.name}</h1>
                  <h1>{item.queue}</h1>
                </div>
              )
              )
            }
          </div>
        </div>
      </section>
  );
}
