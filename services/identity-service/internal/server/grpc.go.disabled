package server

import (
	"context"
	"net"
	"github.com/glohib/identity-service/internal/config"
	"github.com/glohib/identity-service/internal/db"
	"github.com/glohib/identity-service/internal/jwt"
	"github.com/glohib/identity-service/pkg/proto/identityv1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type GRPCServer struct {
	identityv1.UnimplementedIdentityServiceServer
	db  *db.DB
	jwt *jwt.Helper
}

func NewGRPCServer(db *db.DB, jwt *jwt.Helper) *GRPCServer {
	return &GRPCServer{db: db, jwt: jwt}
}

func (s *GRPCServer) ValidateToken(ctx context.Context, req *identityv1.ValidateTokenRequest) (*identityv1.ValidateTokenResponse, error) {
	claims, err := s.jwt.ValidateToken(req.Token)
	if err != nil {
		return &identityv1.ValidateTokenResponse{Valid: false}, nil
	}
	return &identityv1.ValidateTokenResponse{
		Valid:  true,
		UserId: claims.UserID,
		Roles:  claims.Roles,
	}, nil
}

func (s *GRPCServer) GetUser(ctx context.Context, req *identityv1.GetUserRequest) (*identityv1.GetUserResponse, error) {
	var email string
	var roles []string
	err := s.db.QueryRow(ctx, `SELECT email, roles FROM users WHERE id=$1`, req.UserId).Scan(&email, &roles)
	if err != nil {
		return nil, status.Error(codes.NotFound, "user not found")
	}
	return &identityv1.GetUserResponse{
		UserId: req.UserId,
		Email:  email,
		Roles:  roles,
	}, nil
}

func (s *GRPCServer) GetAPIKey(ctx context.Context, req *identityv1.GetAPIKeyRequest) (*identityv1.GetAPIKeyResponse, error) {
	var userID string
	var roles []string
	err := s.db.QueryRow(ctx, `
		SELECT u.id, u.roles
		FROM api_keys ak
		JOIN users u ON u.id = ak.user_id
		WHERE ak.key_hash = $1
	`, req.Key).Scan(&userID, &roles)
	if err != nil {
		return nil, status.Error(codes.NotFound, "api key not found")
	}
	return &identityv1.GetAPIKeyResponse{
		ApiKeyId: req.Key,
		UserId:   userID,
		Roles:    roles,
	}, nil
}

func StartGRPC(cfg *config.Config, db *db.DB, jwt *jwt.Helper) error {
	lis, err := net.Listen("tcp", ":"+cfg.Server.GRPCPort)
	if err != nil {
		return err
	}
	srv := grpc.NewServer()
	identityv1.RegisterIdentityServiceServer(srv, NewGRPCServer(db, jwt))
	return srv.Serve(lis)
}
