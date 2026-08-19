package server

import (
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"github.com/yashgupta9696/self-profile/internal/api"
	"github.com/yashgupta9696/self-profile/internal/config"
	"github.com/yashgupta9696/self-profile/internal/contact"
	"github.com/yashgupta9696/self-profile/internal/content"
	"github.com/yashgupta9696/self-profile/pkg/httpx"
	"github.com/yashgupta9696/self-profile/pkg/ratelimit"
	"github.com/yashgupta9696/self-profile/pkg/webstatic"
)

func New(cfg config.Config, store *content.Store) http.Handler {
	handlers := api.Handlers{
		Profile: store,
		Contact: contact.Service{Sink: contact.LogSink{}},
		Limit:   ratelimit.New(8, time.Hour),
	}

	r := mux.NewRouter()
	r.StrictSlash(true)

	apiRouter := r.PathPrefix("/api").Subrouter()
	apiRouter.HandleFunc("/health", handlers.Health).Methods(http.MethodGet)
	apiRouter.HandleFunc("/profile", handlers.ProfileJSON).Methods(http.MethodGet)
	apiRouter.HandleFunc("/contact", handlers.CreateContact).Methods(http.MethodPost)

	r.PathPrefix("/").Handler(webstatic.New(cfg.StaticDir))

	return httpx.CORS(cfg.AllowedOrigin, r)
}
