package contact

import (
	"context"
	"fmt"
	"html"
	"log"
	"strings"

	"github.com/resend/resend-go/v3"
)

// NewSink uses Resend when RESEND_API_KEY is set; otherwise it only logs.
func NewSink(apiKey, from, to string) Sink {
	apiKey = strings.TrimSpace(apiKey)
	from = strings.TrimSpace(from)
	to = strings.TrimSpace(to)
	if from == "" {
		from = "onboarding@resend.dev"
	}
	if apiKey == "" || to == "" {
		missing := []string{}
		if apiKey == "" {
			missing = append(missing, "RESEND_API_KEY")
		}
		if to == "" {
			missing = append(missing, "CONTACT_EMAIL")
		}
		log.Printf("contact: logging only (missing %s)", strings.Join(missing, ", "))
		return LogSink{}
	}
	log.Printf("contact: Resend enabled from=%s to=%s", from, to)
	return ResendSink{
		Client: resend.NewClient(apiKey),
		From:   from,
		To:     to,
	}
}

type ResendSink struct {
	Client *resend.Client
	From   string
	To     string
}

func (s ResendSink) Deliver(ctx context.Context, msg Message) error {
	body := fmt.Sprintf(
		"<p><strong>From:</strong> %s &lt;%s&gt;</p><p><strong>IP:</strong> %s</p><pre>%s</pre>",
		html.EscapeString(msg.Name),
		html.EscapeString(msg.Email),
		html.EscapeString(msg.IP),
		html.EscapeString(msg.Message),
	)
	sent, err := s.Client.Emails.SendWithContext(ctx, &resend.SendEmailRequest{
		From:    s.From,
		To:      []string{s.To},
		ReplyTo: msg.Email,
		Subject: "Contact form: " + msg.Name,
		Html:    body,
	})
	if err != nil {
		return err
	}
	log.Printf("contact mailed id=%s from %q <%s>", sent.Id, msg.Name, msg.Email)
	return nil
}
