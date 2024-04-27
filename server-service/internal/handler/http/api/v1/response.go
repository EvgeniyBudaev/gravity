package api

import (
	"errors"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

func WrapError(ctf *fiber.Ctx, err error, httpStatusCode int) error {
	var customError *CustomError
	if errors.As(err, &customError) {
		msg := ErrorResponse{
			StatusCode: customError.StatusCode,
			Success:    false,
			Message:    customError.Err.Error(),
		}
		return ctf.Status(customError.StatusCode).JSON(msg)
	}
	msg := ErrorResponse{
		StatusCode: httpStatusCode,
		Success:    false,
		Message:    err.Error(),
	}
	return ctf.Status(httpStatusCode).JSON(msg)
}

func WrapOk(ctf *fiber.Ctx, data interface{}) error {
	msg := Success{
		Data:       data,
		StatusCode: http.StatusOK,
		Success:    true,
	}
	return ctf.Status(fiber.StatusOK).JSON(msg)
}

func WrapCreated(ctf *fiber.Ctx, data interface{}) error {
	msg := Success{
		Data:       data,
		StatusCode: http.StatusCreated,
		Success:    true,
	}
	return ctf.Status(fiber.StatusCreated).JSON(msg)
}
