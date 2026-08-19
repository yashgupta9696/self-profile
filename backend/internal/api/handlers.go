package api

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/yashgupta9696/self-profile/internal/contact"
	"github.com/yashgupta9696/self-profile/pkg/httpx"
	"github.com/yashgupta9696/self-profile/pkg/ratelimit"
)

type ProfileSource interface {
	Profile() any
}

type Handlers struct {
	Profile ProfileSource
	Contact contact.Service
	Limit   *ratelimit.Limiter
}

func (h Handlers) Health(w http.ResponseWriter, _ *http.Request) {
	httpx.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h Handlers) ProfileJSON(w http.ResponseWriter, _ *http.Request) {
	httpx.JSON(w, http.StatusOK, h.Profile.Profile())
}

type contactBody struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

func (h Handlers) CreateContact(w http.ResponseWriter, r *http.Request) {
	ip := httpx.ClientIP(r)
	if h.Limit != nil && !h.Limit.Allow(ip) {
		httpx.JSON(w, http.StatusTooManyRequests, map[string]string{"error": "too many messages — try again later"})
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1<<16)
	defer r.Body.Close()

	var body contactBody
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(&body); err != nil {
		httpx.JSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
		return
	}

	err := h.Contact.Submit(r.Context(), contact.Message{
		Name:    body.Name,
		Email:   body.Email,
		Message: body.Message,
		IP:      ip,
	})
	if err != nil {
		status := http.StatusBadRequest
		if !errors.Is(err, contact.ErrName) && !errors.Is(err, contact.ErrEmail) && !errors.Is(err, contact.ErrMessage) {
			status = http.StatusInternalServerError
			httpx.JSON(w, status, map[string]string{"error": "could not send message"})
			return
		}
		httpx.JSON(w, status, map[string]string{"error": err.Error()})
		return
	}

	httpx.JSON(w, http.StatusAccepted, map[string]string{
		"status":  "accepted",
		"message": "Thanks — I’ll get back to you.",
	})
}
