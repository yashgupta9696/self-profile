package contact

import (
	"context"
	"log"
	"unicode/utf8"
)

// LogSink records messages. Replace with a mailer when CONTACT_EMAIL is a real inbox.
type LogSink struct{}

func (LogSink) Deliver(_ context.Context, msg Message) error {
	log.Printf("contact from %q <%s> ip=%s msg_len=%d", msg.Name, msg.Email, msg.IP, utf8.RuneCountInString(msg.Message))
	return nil
}
