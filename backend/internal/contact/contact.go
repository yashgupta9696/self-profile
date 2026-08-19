package contact

import (
	"context"
	"errors"
	"strings"
	"unicode/utf8"
)

var (
	ErrName    = errors.New("name is required")
	ErrEmail   = errors.New("a valid email is required")
	ErrMessage = errors.New("message is required")
)

type Message struct {
	Name    string
	Email   string
	Message string
	IP      string
}

func (m Message) Normalized() Message {
	m.Name = strings.TrimSpace(m.Name)
	m.Email = strings.TrimSpace(m.Email)
	m.Message = strings.TrimSpace(m.Message)
	return m
}

func (m Message) Validate() error {
	if m.Name == "" || utf8.RuneCountInString(m.Name) > 120 {
		return ErrName
	}
	if !strings.Contains(m.Email, "@") || utf8.RuneCountInString(m.Email) > 254 {
		return ErrEmail
	}
	if m.Message == "" || utf8.RuneCountInString(m.Message) > 4000 {
		return ErrMessage
	}
	return nil
}

// Sink delivers a validated contact message.
// Swap LogSink for SMTP/API later without changing HTTP handlers.
type Sink interface {
	Deliver(ctx context.Context, msg Message) error
}

type Service struct {
	Sink Sink
}

func (s Service) Submit(ctx context.Context, msg Message) error {
	msg = msg.Normalized()
	if err := msg.Validate(); err != nil {
		return err
	}
	return s.Sink.Deliver(ctx, msg)
}
