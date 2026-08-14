package handlers

import (
	"context"
	"net/http"
	"os"
	"strings"
)

const demoRoleHeader = "X-Demo-Role"

type actorContextKey struct{}

// Actor is the server-resolved identity used by protected handlers.
type Actor struct {
	ID   string
	Role string
}

var demoRoles = map[string]struct{}{
	"Admin":           {},
	"Chairman (DCS)":  {},
	"General Manager": {},
	"Bookkeeper":      {},
	"Warehouse":       {},
	"Marketing":       {},
	"Sales":           {},
}

// RequireAuthenticatedActor is intentionally a demo boundary, not production
// authentication. A trusted session/JWT provider must replace this middleware
// before the API is exposed outside APP_ENV=demo.
func RequireAuthenticatedActor(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.EqualFold(strings.TrimSpace(os.Getenv("APP_ENV")), "demo") == false {
			respondJSON(w, http.StatusServiceUnavailable, map[string]string{
				"error": "Authenticated identity provider is not configured; protected API routes are disabled outside demo mode.",
			})
			return
		}

		role := strings.TrimSpace(r.Header.Get(demoRoleHeader))
		if _, ok := demoRoles[role]; !ok {
			respondJSON(w, http.StatusUnauthorized, map[string]string{
				"error": "A valid demo role is required for this protected route.",
			})
			return
		}

		actor := Actor{ID: "demo:" + role, Role: role}
		ctx := context.WithValue(r.Context(), actorContextKey{}, actor)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func actorFromRequest(r *http.Request) (Actor, bool) {
	actor, ok := r.Context().Value(actorContextKey{}).(Actor)
	return actor, ok && actor.Role != ""
}
