package usecases

import (
	"context"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/entity"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/logger"
	"github.com/Nerzal/gocloak/v13"
	"go.uber.org/zap"
	"strings"
)

type Identity interface {
	CreateUser(ctx context.Context, user gocloak.User, password string, role string) (*gocloak.User, error)
	UpdateUser(ctx context.Context, user gocloak.User) (*gocloak.User, error)
	DeleteUser(ctx context.Context, user gocloak.User) error
	GetUserList(ctx context.Context, query entity.QueryParamsUserList) ([]*gocloak.User, error)
}

type UseCaseUser struct {
	logger   logger.Logger
	identity Identity
}

func NewUserUseCases(l logger.Logger, i Identity) *UseCaseUser {
	return &UseCaseUser{
		logger:   l,
		identity: i,
	}
}

func (uc *UseCaseUser) Register(ctx context.Context, request entity.RegisterRequest) (*gocloak.User, error) {
	var user = gocloak.User{
		Username:      gocloak.StringP(request.Username),
		FirstName:     gocloak.StringP(request.FirstName),
		LastName:      gocloak.StringP(request.LastName),
		Email:         gocloak.StringP(request.Email),
		EmailVerified: gocloak.BoolP(true),
		Enabled:       gocloak.BoolP(true),
		Attributes:    &map[string][]string{},
	}
	if strings.TrimSpace(request.MobileNumber) != "" {
		(*user.Attributes)["mobileNumber"] = []string{request.MobileNumber}
	}
	response, err := uc.identity.CreateUser(ctx, user, request.Password, "customer")
	if err != nil {
		uc.logger.Debug("error func Register, method CreateUser by path internal/usecases/user/user.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *UseCaseUser) UpdateUser(ctx context.Context, request entity.RequestUpdateUser) (*gocloak.User, error) {
	var user = gocloak.User{
		ID:            request.ID,
		Username:      gocloak.StringP(request.Username),
		FirstName:     gocloak.StringP(request.FirstName),
		LastName:      gocloak.StringP(request.LastName),
		Email:         gocloak.StringP(request.Email),
		EmailVerified: gocloak.BoolP(true),
		Enabled:       gocloak.BoolP(true),
		Attributes:    &map[string][]string{},
	}
	if strings.TrimSpace(request.MobileNumber) != "" {
		(*user.Attributes)["mobileNumber"] = []string{request.MobileNumber}
	}
	response, err := uc.identity.UpdateUser(ctx, user)
	if err != nil {
		uc.logger.Debug("error func UpdateUser, method UpdateUser by path internal/usecases/user/user.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *UseCaseUser) DeleteUser(ctx context.Context, request entity.RequestDeleteUser) error {
	var user = gocloak.User{
		ID: request.ID,
	}
	err := uc.identity.DeleteUser(ctx, user)
	if err != nil {
		uc.logger.Debug("error func DeleteUser, method DeleteUser by path internal/usecases/user/user.go",
			zap.Error(err))
		return err
	}
	return nil
}

func (uc *UseCaseUser) GetUserList(ctx context.Context, query entity.QueryParamsUserList) ([]*gocloak.User, error) {
	response, err := uc.identity.GetUserList(ctx, query)
	if err != nil {
		uc.logger.Debug("error func GetUserList, method GetUserList by path internal/usecases/user/user.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}
