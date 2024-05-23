import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   // if (req.method !== 'POST') {
//   //   return res.status(405).json({ message: 'Method Not Allowed' });
//   // }

//   try {
//     console.log(req.body);
//     // Extract image data from request body
//     // const { imageData } = req.body;

//     // // Remove header from base64 encoded string
//     // const base64Image = imageData.split('base64,').pop();

//     // // Convert base64 to binary
//     // const binaryData = Buffer.from(base64Image, 'base64');

//     // // Write binary data to a file
//     // fs.writeFileSync('path/to/save/image.jpg', binaryData);

//     res.status(200).json({ message: 'Image saved successfully' });
//   } catch (error) {
//     console.error('Error saving image:', error);
//     res.status(500).json({ message: 'Error saving image' });
//   }
// }

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