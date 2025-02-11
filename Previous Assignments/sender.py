import urllib.request

def main():
    message = "This is a message from CS361!"
    data = message.encode('utf-8')  # Convert string to bytes for HTTP
    url = "http://localhost:5000"   # Must match the receiver's host:port
    
    # Create a Request object, specifying POST and the data
    req = urllib.request.Request(url, data=data, method='POST')
    
    # Send the request
    with urllib.request.urlopen(req) as response:
        # Read the response from the server
        resp_body = response.read().decode('utf-8')
        print(f"Sender: Sent -> '{message}'")
        print(f"Sender: Server responded with -> '{resp_body}'")

if __name__ == "__main__":
    main()
