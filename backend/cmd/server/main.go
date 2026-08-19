package main

import (
	"log"
	"net/http"

	"github.com/yashgupta9696/self-profile/internal/config"
	"github.com/yashgupta9696/self-profile/internal/content"
	"github.com/yashgupta9696/self-profile/internal/server"
)

func main() {
	cfg := config.FromEnv()

	store, err := content.Load(cfg.CalUsername, cfg.CalEventSlug, cfg.ContactEmail)
	if err != nil {
		log.Fatalf("content: %v", err)
	}

	h := server.New(cfg, store)
	log.Printf("listening on %s (static=%s)", cfg.Addr, cfg.StaticDir)
	if err := http.ListenAndServe(cfg.Addr, h); err != nil {
		log.Fatal(err)
	}
}
