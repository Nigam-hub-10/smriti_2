"""
Smriti - Local Persistent Server & API
Provides static file serving and persistent JSON storage
saved directly to disk in data/smriti_database.json.
"""

import http.server
import json
import os
import sys
import socket

PORT = 8000
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
        elif self.path == "/api/sarvam/config":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            cfg_file = os.path.join(DATA_DIR, "sarvam_config.json")
            cfg = {}
            if os.path.exists(cfg_file):
                try:
                    with open(cfg_file, "r", encoding="utf-8") as f:
                        cfg = json.load(f)
                except Exception:
                    pass
            key = cfg.get("api_key", "") or os.environ.get("SARVAM_API_KEY", "")
            masked = (key[:4] + "..." + key[-4:]) if len(key) > 8 else ("***" if key else "")
            self.wfile.write(json.dumps({
                "status": "success",
                "has_key": bool(key),
                "masked_key": masked,
                "speaker": cfg.get("speaker", "meera"),
                "model": cfg.get("model", "bulbul:v1")
            }).encode("utf-8"))
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
                root_db = os.path.join(os.path.dirname(__file__), "smriti_database.json")
                try:
                    with open(root_db, "w", encoding="utf-8") as f:
                        json.dump(parsed, f, indent=2, ensure_ascii=False)
                except Exception:
                    pass
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
        elif self.path == "/api/sarvam/config":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                payload = json.loads(body) if body else {}
                cfg_file = os.path.join(DATA_DIR, "sarvam_config.json")
                current_cfg = {}
                if os.path.exists(cfg_file):
                    try:
                        with open(cfg_file, "r", encoding="utf-8") as f:
                            current_cfg = json.load(f)
                    except Exception:
                        pass
                
                if "api_key" in payload and payload["api_key"] is not None:
                    current_cfg["api_key"] = payload["api_key"].strip()
                if "speaker" in payload and payload["speaker"]:
                    current_cfg["speaker"] = payload["speaker"].strip()
                if "model" in payload and payload["model"]:
                    current_cfg["model"] = payload["model"].strip()

                with open(cfg_file, "w", encoding="utf-8") as f:
                    json.dump(current_cfg, f, indent=2)

                masked = ""
                key = current_cfg.get("api_key", "")
                if key:
                    masked = key[:4] + "..." + key[-4:] if len(key) > 8 else "***"

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success",
                    "has_key": bool(key),
                    "masked_key": masked,
                    "speaker": current_cfg.get("speaker", "meera")
                }).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode("utf-8"))
            return
        elif self.path == "/api/sarvam/tts":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                payload = json.loads(body) if body else {}
                text = (payload.get("text") or "").strip()
                if not text:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "error": "Missing text parameter"}).encode("utf-8"))
                    return

                # Determine API key
                api_key = payload.get("api_key", "").strip()
                speaker = payload.get("speaker", "").strip()
                
                cfg_file = os.path.join(DATA_DIR, "sarvam_config.json")
                if os.path.exists(cfg_file):
                    try:
                        with open(cfg_file, "r", encoding="utf-8") as f:
                            saved_cfg = json.load(f)
                            if not api_key:
                                api_key = saved_cfg.get("api_key", "").strip()
                            if not speaker:
                                speaker = saved_cfg.get("speaker", "").strip()
                    except Exception:
                        pass
                
                if not api_key:
                    api_key = os.environ.get("SARVAM_API_KEY", "").strip()

                if not api_key:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "status": "no_key",
                        "error": "Sarvam AI API key is not configured yet. Please provide your API key."
                    }).encode("utf-8"))
                    return

                valid_v3_speakers = {
                    'aditya', 'ritu', 'ashutosh', 'priya', 'neha', 'rahul', 'pooja',
                    'rohan', 'simran', 'kavya', 'amit', 'dev', 'ishita', 'shreya',
                    'ratan', 'varun', 'manan', 'sumit', 'roopa', 'kabir', 'aayan',
                    'shubh', 'advait', 'anand', 'tanya', 'tarun', 'sunny', 'mani',
                    'gokul', 'vijay', 'shruti', 'suhani', 'mohit', 'kavitha', 'rehan',
                    'soham', 'rupali'
                }
                speaker_alias = {
                    'meera': 'priya',
                    'arvind': 'kabir',
                    'pavithra': 'kavya',
                    'maithili': 'simran',
                    'amol': 'aditya',
                    'amartya': 'rahul',
                    'anushka': 'priya',
                    'abhilash': 'kabir'
                }
                speaker_clean = (speaker or 'priya').lower().strip()
                sarvam_speaker = speaker_alias.get(speaker_clean, speaker_clean if speaker_clean in valid_v3_speakers else 'priya')

                # Language detection / code
                lang_code = payload.get("language_code", "")
                if not lang_code:
                    has_devanagari = any('\u0900' <= char <= '\u097f' for char in text)
                    lang_code = "hi-IN" if has_devanagari else "en-IN"

                import urllib.request
                sarvam_payload = {
                    "inputs": [text[:500]],
                    "target_language_code": lang_code,
                    "speaker": sarvam_speaker,
                    "pitch": 0,
                    "pace": 1.0,
                    "loudness": 1.5,
                    "speech_sample_rate": 22050,
                    "enable_preprocessing": True,
                    "model": "bulbul:v3"
                }

                req = urllib.request.Request(
                    "https://api.sarvam.ai/text-to-speech",
                    data=json.dumps(sarvam_payload).encode("utf-8"),
                    headers={
                        "api-subscription-key": api_key,
                        "Content-Type": "application/json"
                    }
                )

                with urllib.request.urlopen(req, timeout=12) as response:
                    res_body = response.read().decode("utf-8")
                    res_json = json.loads(res_body)
                    audios = res_json.get("audios", [])
                    if audios and len(audios) > 0:
                        self.send_response(200)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({
                            "status": "success",
                            "audio_base64": audios[0],
                            "speaker": speaker,
                            "language_code": lang_code,
                            "provider": "sarvam"
                        }).encode("utf-8"))
                        return
                    else:
                        raise Exception("No audio returned from Sarvam AI")

            except Exception as e:
                err_detail = str(e)
                if hasattr(e, 'read'):
                    try:
                        err_detail += " - " + e.read().decode('utf-8')
                    except Exception:
                        pass
                print("[SARVAM TTS ERROR]:", err_detail)
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": err_detail}).encode("utf-8"))
            return
        self.send_response(404)
        self.end_headers()

class ReusableHTTPServer(http.server.HTTPServer):
    allow_reuse_address = True
    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
        except Exception:
            pass
        super().server_bind()

if __name__ == "__main__":
    server_address = ("127.0.0.1", PORT)
    httpd = ReusableHTTPServer(server_address, SmritiHTTPHandler)
    print(f"Smriti Persistent Server running on http://127.0.0.1:{PORT}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        sys.exit(0)
