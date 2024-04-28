package http

import (
	"github.com/EvgeniyBudaev/gravity/server-service/internal/entity"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/handler/http/api/v1"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/logger"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/usecases"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type UserHandler struct {
	logger logger.Logger
	uc     *usecases.UseCaseUser
}

func NewUserHandler(l logger.Logger, uc *usecases.UseCaseUser) *UserHandler {
	return &UserHandler{logger: l, uc: uc}
}

func (h *UserHandler) PostRegisterHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		var ctx = ctf.UserContext()
		h.logger.Info("POST /api/v1/user/register")
		var request = entity.RegisterRequest{}
		err := ctf.BodyParser(&request)
		if err != nil {
			h.logger.Debug("error func PostRegisterHandler, method BodyParser by path internal/handler/user/user.go",
				zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		response, err := h.uc.Register(ctx, request)
		if err != nil {
			h.logger.Debug("error func PostRegisterHandler, method Register by path internal/handler/user/user.go",
				zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, response)
	}
}

func (h *UserHandler) UpdateUserHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		var ctx = ctf.UserContext()
		h.logger.Info("POST /api/v1/user/update")
		var request = entity.RequestUpdateUser{}
		err := ctf.BodyParser(&request)
		if err != nil {
			h.logger.Debug("error func UpdateUserHandle, method BodyParser by path internal/handler/user/user.go",
				zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		response, err := h.uc.UpdateUser(ctx, request)
		if err != nil {
			h.logger.Debug("error func UpdateUserHandle, method UpdateUser by path internal/handler/user/user.go",
				zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, response)
	}
}

func (h *UserHandler) DeleteUserHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		var ctx = ctf.UserContext()
		h.logger.Info("POST /api/v1/user/delete")
		var request = entity.RequestDeleteUser{}
		err := ctf.BodyParser(&request)
		if err != nil {
			h.logger.Debug("error func DeleteUserHandler, method BodyParser by path internal/handler/user/user.go",
				zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		err = h.uc.DeleteUser(ctx, request)
		if err != nil {
			h.logger.Debug("error func DeleteUserHandler, method DeleteUser by path internal/handler/user/user.go",
				zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, nil)
	}
}

func (h *UserHandler) GetUserListHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		var ctx = ctf.UserContext()
		h.logger.Info("GET /api/v1/user/list")
		query := entity.QueryParamsUserList{}
		if err := ctf.QueryParser(&query); err != nil {
			h.logger.Debug("error func GetUserListHandler, method QueryParser by path"+
				" internal/handler/user/user.go", zap.Error(err))
			return err
		}
		response, err := h.uc.GetUserList(ctx, query)
		if err != nil {
			h.logger.Debug("error func GetUserListHandler, method GetUserList by path"+
				" internal/handler/user/user.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapOk(ctf, response)
	}
}
