package main

import "testing"

func TestRequiredDatabaseURLFailsWhenMissing(t *testing.T) {
	t.Setenv("DATABASE_URL", "")
	if _, err := requiredDatabaseURL(); err == nil || err.Error() != "DATABASE_URL is required" {
		t.Fatalf("requiredDatabaseURL() error = %v, want DATABASE_URL is required", err)
	}
}
