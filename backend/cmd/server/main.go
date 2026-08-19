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
	if cfg.ContactEmail == "" {
		cfg.ContactEmail = store.Email()
	}

	h := server.New(cfg, store)
	mailer := "log"
	if cfg.ResendAPIKey != "" && cfg.ContactEmail != "" {
		mailer = "resend"
	}
	log.Printf("listening on %s (static=%s mailer=%s to=%s)", cfg.Addr, cfg.StaticDir, mailer, cfg.ContactEmail)
	if err := http.ListenAndServe(cfg.Addr, h); err != nil {
		log.Fatal(err)
	}
}
