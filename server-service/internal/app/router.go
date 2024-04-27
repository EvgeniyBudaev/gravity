package app

import (
	"github.com/EvgeniyBudaev/gravity/server-service/internal/handler/http"
	"github.com/gofiber/fiber/v2"
)

func InitPublicRoutes(r fiber.Router, uh *http.UserHandler, ph *http.ProfileHandler) {
	r.Post("/user/register", uh.PostRegisterHandler())
	r.Put("/user/update", uh.UpdateUserHandler())
	r.Delete("/user/delete", uh.DeleteUserHandler())

	r.Post("/profile/add", ph.AddProfileHandler())
	r.Get("/profile/list", ph.GetProfileListHandler())
	r.Get("/profile/session/:id", ph.GetProfileBySessionIDHandler())
	r.Get("/profile/detail/:id", ph.GetProfileDetailHandler())
	r.Post("/profile/edit", ph.UpdateProfileHandler())
	r.Post("/profile/delete", ph.DeleteProfileHandler())
	r.Post("/profile/image/delete", ph.DeleteProfileImageHandler())

	r.Post("/review/add", ph.AddReviewHandler())
	r.Post("/review/update", ph.UpdateReviewHandler())
	r.Post("/review/delete", ph.DeleteReviewHandler())
	r.Get("/review/list", ph.GetReviewListHandler())
	r.Get("/review/detail/:id", ph.GetReviewByIDHandler())

	r.Post("/like/add", ph.AddLikeHandler())
	r.Put("/like/update", ph.UpdateLikeHandler())
	r.Post("/like/delete", ph.DeleteLikeHandler())

	r.Post("/block/add", ph.AddBlockHandler())
	r.Put("/block/update", ph.UpdateBlockHandler())

	r.Post("/complaint/add", ph.AddComplaintHandler())
}

func InitProtectedRoutes(r fiber.Router, ph *http.ProfileHandler) {
}
