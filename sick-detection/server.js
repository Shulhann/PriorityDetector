const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit to handle large image data
app.use(cors());

const PORT = process.env.PORT || 3002;

app.post('/api/saveImage', (req, res) => {
  const { imageData } = req.body;
  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, "");
  const imagePath = path.join(__dirname, '../public/images/image.jpg');

  fs.writeFile(imagePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).json({ error: 'Failed to save image' });
    }

    console.log('Image saved successfully at', imagePath);

    exec(`python main.py "${imagePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing Python script:', error);
        return res.status(500).json({ error: 'Failed to process image' });
      }
      if (stderr) {
        console.error('Python script stderr:', stderr);
      }

      console.log('Python script output:', stdout);

      try {
        const result = JSON.parse(stdout.trim()); // Ensure no extra whitespace is included
        res.json(result);
      } catch (parseError) {
        console.error('Error parsing JSON output:', parseError);
        console.error('Raw output:', stdout);
        res.status(500).json({ error: 'Failed to parse JSON output' });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});