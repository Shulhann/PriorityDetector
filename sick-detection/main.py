from roboflow import Roboflow
from PIL import Image
import sys
import json
import io

# Redirect stdout and stderr to suppress log output
old_stdout = sys.stdout
old_stderr = sys.stderr
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()

# Roboflow setup
rf = Roboflow(api_key="wajaWmhvnbVzvyVflxN1")
project = rf.workspace().project("sickdetection")
model = project.version(2).model

# Restore stdout and stderr after setup
sys.stdout = old_stdout
sys.stderr = old_stderr

# Load the image directly from the file path provided as an argument
image_path = sys.argv[1]
img = Image.open(image_path)

# Predict using the loaded image
result = model.predict(image_path).json()

# Prepare JSON output
output = {'predictions': []}

# Example prediction results handling
if 'predictions' in result:
    for item in result['predictions']:
        predictions = item['predictions']  # This contains 'healthy' and 'sick' predictions
        for condition, info in predictions.items():
            confidence = info['confidence']
            # Append to the JSON output
            output['predictions'].append({
                'condition': condition,
                'confidence': confidence
            })

# Print the JSON result
print(json.dumps(output))