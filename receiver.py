import http.server
import socketserver

PORT = 5000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        # 1. Read the length of the incoming request body.
        content_length = int(self.headers.get('Content-Length', 0))
        
        # 2. Read the raw bytes and decode them as UTF-8 text.
        message = self.rfile.read(content_length).decode('utf-8')
        
        # 3. Print the message (or handle it however you like).
        print("Receiver got the message: '{}'".format(message))
        
        # 4. Send a basic "200 OK" response back to the sender.
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()
        self.wfile.write(b"OK")  # Just a simple acknowledgment.

# Create a TCP server using the above request handler.
with socketserver.TCPServer(("localhost", PORT), MyHandler) as httpd:
    print(f"Receiver is running on http://localhost:{PORT}")
    print("Waiting for messages...")
    httpd.serve_forever()
