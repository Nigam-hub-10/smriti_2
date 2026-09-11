"""
Smriti - Local Persistent Server & API
Provides static file serving and persistent JSON storage
saved directly to disk in data/smriti_database.json.
"""

import http.server
import json
import os
import sys

PORT = 8080
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DB_FILE = os.path.join(DATA_DIR, "smriti_database.json")

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

class SmritiHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable aggressive caching for seamless dev
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/data":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            if os.path.exists(DB_FILE):
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    self.wfile.write(f.read().encode("utf-8"))
            else:
                self.wfile.write(b"{}")
            return
        elif self.path == "/api/export":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Disposition", "attachment; filename=smriti_backup.json")
            self.end_headers()
            if os.path.exists(DB_FILE):
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    self.wfile.write(f.read().encode("utf-8"))
            else:
                self.wfile.write(b"{}")
            return
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/data":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                parsed = json.loads(body)
                with open(DB_FILE, "w", encoding="utf-8") as f:
                    json.dump(parsed, f, indent=2, ensure_ascii=False)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Saved to disk"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode("utf-8"))
        elif self.path == "/api/send-otp":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                payload = json.loads(body)
                phone = payload.get("phone", "")
                otp = payload.get("otp", "")

                print("=" * 60)
                print(f"[SECURITY OTP DISPATCH] Phone: {phone} | Reset Code: {otp}")
                print("=" * 60)

                # Check if custom SMS gateway config exists (Fast2SMS / Twilio)
                sms_config_file = os.path.join(DATA_DIR, "sms_config.json")
                sms_sent = False
                carrier_msg = "Logged to server & available via WhatsApp / Browser Push"

                if os.path.exists(sms_config_file):
                    try:
                        with open(sms_config_file, "r", encoding="utf-8") as scf:
                            cfg = json.load(scf)
                            if cfg.get("fast2sms_api_key"):
                                import urllib.parse, urllib.request
                                clean_digits = "".join(filter(str.isdigit, phone))[-10:]
                                req_url = f"https://www.fast2sms.com/dev/bulkV2?authorization={cfg['fast2sms_api_key']}&route=otp&variables_values={otp}&flash=0&numbers={clean_digits}"
                                req = urllib.request.Request(req_url, headers={'cache-control': 'no-cache'})
                                with urllib.request.urlopen(req) as resp:
                                    sms_sent = True
                                    carrier_msg = "SMS dispatched via Fast2SMS gateway"
                    except Exception as ex:
                        carrier_msg = f"Gateway error: {ex}"

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success",
                    "sms_sent": sms_sent,
                    "message": carrier_msg,
                    "phone": phone,
                    "otp": otp
                }).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode("utf-8"))
            return
        self.send_response(404)
        self.end_headers()

if __name__ == "__main__":
    server_address = ("", PORT)
    httpd = http.server.HTTPServer(server_address, SmritiHTTPHandler)
    print(f"Smriti Persistent Server running on port {PORT}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        sys.exit(0)
