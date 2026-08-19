package webstatic

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type Files struct {
	dir     string
	files   http.Handler
	present bool
}

func New(dir string) *Files {
	f := &Files{dir: dir}
	if dir == "" {
		return f
	}
	info, err := os.Stat(dir)
	if err != nil || !info.IsDir() {
		return f
	}
	f.present = true
	f.files = http.FileServer(http.Dir(dir))
	return f
}

func (f *Files) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if strings.HasPrefix(r.URL.Path, "/api/") {
		http.NotFound(w, r)
		return
	}
	if !f.present {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"service":"self-profile","hint":"frontend static files not mounted; API is up"}`))
		return
	}

	cleaned := filepath.Clean("/" + r.URL.Path)
	full := filepath.Join(f.dir, cleaned)

	if info, err := os.Stat(full); err == nil {
		if info.IsDir() {
			index := filepath.Join(full, "index.html")
			if _, err := os.Stat(index); err == nil {
				http.ServeFile(w, r, index)
				return
			}
		} else {
			f.files.ServeHTTP(w, r)
			return
		}
	}

	index := filepath.Join(f.dir, cleaned, "index.html")
	if _, err := os.Stat(index); err == nil {
		http.ServeFile(w, r, index)
		return
	}

	http.NotFound(w, r)
}
