# Early CS 361 Assignment

import os
import time

# Declare the image folder and the file
I_FOLDER = './images'
I_FILE = 'image-service.txt'

images = os.listdir(I_FOLDER)

# Create a while loop that true while the program is running
while True:

    # Open the image file to read what the prng displayed after run
    with open(I_FILE, 'r') as file:
        content = file.read().strip()
    
    # Read the integer (a.k.a digit), NOT the 'run' string
    if content.isdigit():

        # Use modulo to obtain the image that's desired
        index = int(content) % len(images)
        i_path = os.path.join(I_FOLDER, images[index])

        # Display the image
        # For now, I'm not able to open the image, so I am displaying the path for now
        with open(I_FILE, 'w') as file:
            file.write(i_path)
    
    # Exit clause in case the program needs to be terminated
    elif content == 'exit':
        break
    
    # Allow the program to sleep for 3 seconds
    # This will allow us to show the process of the program
    else:
        time.sleep(3)