import http.server, os, sys
DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')
os.chdir(DIST)
class H(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        p = self.translate_path(self.path)
        if not os.path.exists(p) and not self.path.startswith('/assets/'):
            self.path = '/index.html'
        return super().do_GET()
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
http.server.HTTPServer(('', int(sys.argv[1])) if len(sys.argv) > 1 else 5179, H).serve_forever()
