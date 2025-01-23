import random
import time

# Declare the file text
P_FILE = 'prng-service.txt'

# Create a loop for the response to the UI running the program
while True:

    # Open the file and check what it says
    with open(P_FILE, 'r') as file:
        command = file.read().strip()

    # Generate a random number that will later be used by imgsrv.py to generate a path
    if command == "run":

        # Keep a small range that allows the modulo function to be implemented, but keeping it simple
        rand_num = random.randint(0, 10)

        # Write the random number between 0 and 10 to the prng-service.txt file
        with open(P_FILE, 'w') as file:
            file.write(str(rand_num))
    
    # Create an exit clause
    elif command == 'exit':
        break

    # Let the program sleep for 3 seconds to show the functionality
    else:
        time.sleep(3)