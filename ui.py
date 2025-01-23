import time

# The User will request an image in this program
# Declare the files for the prng and image
P_FILE = 'prng-service.txt'
I_FILE = 'image-service.txt'

# Open the file that the prng service will use and write to that file 'run'
with open(P_FILE, 'w') as file:
    file.write('run')

# Once the random number has been generated, retrieve it
while True:
    with open(P_FILE, 'r') as file:
        content = file.read().strip()
    
    # Ensure that the program is retrieving an int, not a string
    if content.isdigit():
        rand_num = int(content)
        break

    # Make the program sleep so that it can be shown what the program is doing 
    time.sleep(3)

# Write the random number to the other text file, image-service.txt
with open(I_FILE, 'w') as file:
    file.write(str(rand_num))

# Create a loop that'll generate the image path using the random number that was generated
while True:
    
    # Read the file
    with open(I_FILE, 'r') as file:
        i_path = file.read().strip()
    
    # Generate the image path based on the number obtained above
    if i_path:
        print(f"Image Path: {i_path}")
        break
    
    # Create an exit clause
    elif i_path == "exit":
        exit()

    # Make the program sleep to show the functionality
    time.sleep(3)
