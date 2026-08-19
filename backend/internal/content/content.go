package content

import (
	_ "embed"
	"encoding/json"
	"fmt"
)

//go:embed profile.json
var raw []byte

type Store struct {
	profile map[string]any
}

func Load(calUsername, calEventSlug, contactEmail string) (*Store, error) {
	var profile map[string]any
	if err := json.Unmarshal(raw, &profile); err != nil {
		return nil, fmt.Errorf("profile.json: %w", err)
	}
	if calUsername != "" {
		profile["calUsername"] = calUsername
	}
	if calEventSlug != "" {
		profile["calEventSlug"] = calEventSlug
	}
	user, _ := profile["calUsername"].(string)
	slug, _ := profile["calEventSlug"].(string)
	if socials, ok := profile["socials"].(map[string]any); ok && user != "" {
		if slug != "" {
			socials["cal"] = "https://cal.com/" + user + "/" + slug
		} else {
			socials["cal"] = "https://cal.com/" + user
		}
	}
	if contactEmail != "" {
		profile["email"] = contactEmail
	}
	return &Store{profile: profile}, nil
}

func (s *Store) Profile() any {
	return s.profile
}

func (s *Store) Email() string {
	email, _ := s.profile["email"].(string)
	return email
}
