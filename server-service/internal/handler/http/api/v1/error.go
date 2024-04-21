package api

import "fmt"

type ErrorResponse struct {
	Message    string `json:"message"`
	Success    bool   `json:"success"`
	StatusCode int    `json:"statusCode"`
}

type CustomError struct {
	StatusCode int `json:"statusCode"`
	Err        error
}

func NewCustomError(err error, statusCode int) error {
	return &CustomError{
		StatusCode: statusCode,
		Err:        err,
	}
}

func (e *CustomError) Error() string {
	return fmt.Sprintf("%s, status code: %d", e.Err, e.StatusCode)
}
