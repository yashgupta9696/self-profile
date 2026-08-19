package contact

import "testing"

func TestMessageValidate(t *testing.T) {
	ok := Message{Name: "Ada", Email: "ada@example.com", Message: "hello"}
	if err := ok.Normalized().Validate(); err != nil {
		t.Fatalf("expected valid: %v", err)
	}
	if err := (Message{Name: "", Email: "a@b.c", Message: "x"}).Validate(); err != ErrName {
		t.Fatalf("name: got %v", err)
	}
	if err := (Message{Name: "Ada", Email: "nope", Message: "x"}).Validate(); err != ErrEmail {
		t.Fatalf("email: got %v", err)
	}
	if err := (Message{Name: "Ada", Email: "a@b.c", Message: ""}).Validate(); err != ErrMessage {
		t.Fatalf("message: got %v", err)
	}
}
