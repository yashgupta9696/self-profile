package config

import "os"

type Config struct {
	Addr          string
	StaticDir     string
	AllowedOrigin string
	CalUsername   string
	CalEventSlug  string
	ContactEmail  string
	ResendAPIKey  string
	MailFrom      string
}

func FromEnv() Config {
	port := envOr("PORT", "10000")
	return Config{
		Addr:          "0.0.0.0:" + port,
		StaticDir:     envOr("STATIC_DIR", "./frontend-out"),
		AllowedOrigin: os.Getenv("ALLOWED_ORIGIN"),
		CalUsername:   os.Getenv("CAL_USERNAME"),
		CalEventSlug:  os.Getenv("CAL_EVENT_SLUG"),
		ContactEmail:  os.Getenv("CONTACT_EMAIL"),
		ResendAPIKey:  os.Getenv("RESEND_API_KEY"),
		MailFrom:      envOr("MAIL_FROM", "onboarding@resend.dev"),
	}
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
