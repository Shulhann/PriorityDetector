import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

export async function POST(req:Request){
  try{
    const body = await req.json()
    console.log(body)
    const base64Image = body.imageData.split(';base64,').pop();
    const binaryData = Buffer.from(base64Image, 'base64');
    fs.writeFileSync('./public/images/image.jpg', binaryData);
    return new Response("ok");
  }
  catch(error){
    console.error('Error saving image:', error);
    return new Response('Error saving images');
  }
  
}