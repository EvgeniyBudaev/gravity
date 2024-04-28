package http

import (
	"context"
	"fmt"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/entity"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/handler/http/api/v1"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/logger"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/usecases"
	"github.com/gofiber/fiber/v2"
	"github.com/h2non/bimg"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"image/jpeg"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

type ProfileHandler struct {
	logger logger.Logger
	uc     *usecases.ProfileUseCases
}

const TimeoutDuration = 30 * time.Second

func NewProfileHandler(l logger.Logger, uc *usecases.ProfileUseCases) *ProfileHandler {
	return &ProfileHandler{logger: l, uc: uc}
}

func (h *ProfileHandler) AddProfileHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/profile/add")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestAddProfile{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func AddProfileHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		filePath := fmt.Sprintf("static/uploads/profile/%s/images/defaultImage.jpg", req.UserName)
		directoryPath := fmt.Sprintf("static/uploads/profile/%s/images", req.UserName)
		if _, err := os.Stat(directoryPath); os.IsNotExist(err) {
			if err := os.MkdirAll(directoryPath, 0755); err != nil {
				h.logger.Debug("error func AddProfileHandler, method MkdirAll by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
		}
		form, err := ctf.MultipartForm()
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method MultipartForm by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		imageFiles := form.File["image"]
		imagesFilePath := make([]string, 0, len(imageFiles))
		imagesProfile := make([]*entity.ImageProfile, 0, len(imagesFilePath))
		for _, file := range imageFiles {
			filePath = fmt.Sprintf("%s/%s", directoryPath, file.Filename)
			if err := ctf.SaveFile(file, filePath); err != nil {
				h.logger.Debug("error func AddProfileHandler, method SaveFile by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			fileImage, err := os.Open(filePath)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method os.Open by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			// The Decode function is used to read images from a file or other source and convert them into an image.
			// Image structure
			_, err = jpeg.Decode(fileImage)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method jpeg.Decode by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			newFileName := replaceExtension(file.Filename)
			newFilePath := fmt.Sprintf("%s/%s", directoryPath, newFileName)
			output, err := os.Create(directoryPath + "/" + newFileName)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method os.Create by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			defer output.Close()
			buffer, err := bimg.Read(filePath)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method Read by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			newImage, err := bimg.NewImage(buffer).Convert(bimg.WEBP)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method NewImage by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			bimg.Write(newFilePath, newImage)
			if err := os.Remove(filePath); err != nil {
				h.logger.Debug("error func AddProfileHandler, method os.Remove by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			image := entity.ImageProfile{
				Name:      file.Filename,
				Url:       newFilePath,
				Size:      file.Size,
				CreatedAt: time.Now().UTC(),
				UpdatedAt: time.Now().UTC(),
				IsDeleted: false,
				IsBlocked: false,
				IsPrimary: false,
				IsPrivate: false,
			}
			imagesFilePath = append(imagesFilePath, newFilePath)
			imagesProfile = append(imagesProfile, &image)
		}
		ctx.Done()
		height := 0
		if req.Height != "" {
			heightUint64, err := strconv.ParseUint(req.Height, 10, 8)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			height = int(heightUint64)
		}
		weight := 0
		if req.Weight != "" {
			weightUint64, err := strconv.ParseUint(req.Weight, 10, 8)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			weight = int(weightUint64)
		}
		profileDto := &entity.Profile{
			SessionID:      req.SessionID,
			DisplayName:    req.DisplayName,
			Birthday:       req.Birthday,
			Gender:         req.Gender,
			Location:       req.Location,
			Description:    req.Description,
			Height:         uint8(height),
			Weight:         uint8(weight),
			IsDeleted:      false,
			IsBlocked:      false,
			IsPremium:      false,
			IsShowDistance: true,
			IsInvisible:    false,
			CreatedAt:      time.Now().UTC(),
			UpdatedAt:      time.Now().UTC(),
			LastOnline:     time.Now().UTC(),
			Images:         imagesProfile,
		}
		newProfile, err := h.uc.Add(ctx, profileDto)
		for _, i := range profileDto.Images {
			image := &entity.ImageProfile{
				ProfileID: newProfile.ID,
				Name:      i.Name,
				Url:       i.Url,
				Size:      i.Size,
				CreatedAt: i.CreatedAt,
				UpdatedAt: i.UpdatedAt,
				IsDeleted: i.IsDeleted,
				IsBlocked: i.IsBlocked,
				IsPrimary: i.IsPrimary,
				IsPrivate: i.IsPrivate,
			}
			_, err := h.uc.AddImage(ctx, image)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method AddImage by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
		}
		telegramID, err := strconv.ParseUint(req.TelegramID, 10, 64)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method ParseUint by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		allowsWriteToPm, err := strconv.ParseBool(req.AllowsWriteToPm)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method ParseBool by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		chatID, err := strconv.ParseUint(req.ChatID, 10, 64)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method ParseUint by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		telegramDto := &entity.TelegramProfile{
			ProfileID:       newProfile.ID,
			TelegramID:      telegramID,
			UserName:        req.TelegramUserName,
			Firstname:       req.Firstname,
			Lastname:        req.Lastname,
			LanguageCode:    req.LanguageCode,
			AllowsWriteToPm: allowsWriteToPm,
			QueryID:         req.QueryID,
			ChatID:          chatID,
		}
		_, err = h.uc.AddTelegram(ctx, telegramDto)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method AddTelegram by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		ageFrom := 0
		if req.AgeFrom != "" {
			ageFromUint8, err := strconv.ParseUint(req.AgeFrom, 10, 8)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			ageFrom = int(ageFromUint8)
		}
		ageTo := 0
		if req.AgeTo != "" {
			ageToUint8, err := strconv.ParseUint(req.AgeTo, 10, 8)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			ageTo = int(ageToUint8)
		}
		distance := 0
		if req.Distance != "" {
			distance32, err := strconv.ParseUint(req.Distance, 10, 64)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			distance = int(distance32)
		}
		page := 0
		if req.Page != "" {
			page32, err := strconv.ParseUint(req.Page, 10, 64)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			page = int(page32)
		}
		size := 0
		if req.Size != "" {
			size32, err := strconv.ParseUint(req.Size, 10, 64)
			if err != nil {
				h.logger.Debug("error func AddProfileHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			size = int(size32)
		}
		filterDto := &entity.FilterProfile{
			ProfileID:    newProfile.ID,
			SearchGender: req.SearchGender,
			LookingFor:   req.LookingFor,
			AgeFrom:      uint8(ageFrom),
			AgeTo:        uint8(ageTo),
			Distance:     uint64(distance),
			Page:         uint64(page),
			Size:         uint64(size),
		}
		_, err = h.uc.AddFilter(ctx, filterDto)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method AddFilter by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		latitude, err := strconv.ParseFloat(req.Latitude, 64)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method ParseFloat height by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		longitude, err := strconv.ParseFloat(req.Longitude, 64)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method ParseFloat height by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		point := &entity.Point{
			Latitude:  latitude,
			Longitude: longitude,
		}
		navigatorDto := &entity.NavigatorProfile{
			ProfileID: newProfile.ID,
			Location:  point,
		}
		_, err = h.uc.AddNavigator(ctx, navigatorDto)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method AddNavigator by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		p, err := h.uc.FindById(ctx, newProfile.ID)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method FindById by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		t, err := h.uc.FindTelegramByProfileID(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method FindTelegramByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		f, err := h.uc.FindFilterByProfileID(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method FindFilterByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		i, err := h.uc.SelectListPublicImage(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func AddProfileHandler, method SelectListPublicImage by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		response := &entity.Profile{
			ID:             p.ID,
			SessionID:      p.SessionID,
			DisplayName:    p.DisplayName,
			Birthday:       p.Birthday,
			Gender:         p.Gender,
			Location:       p.Location,
			Description:    p.Description,
			Height:         p.Height,
			Weight:         p.Weight,
			IsDeleted:      p.IsDeleted,
			IsBlocked:      p.IsBlocked,
			IsPremium:      p.IsPremium,
			IsShowDistance: p.IsShowDistance,
			IsInvisible:    p.IsInvisible,
			CreatedAt:      p.CreatedAt,
			UpdatedAt:      p.UpdatedAt,
			LastOnline:     p.LastOnline,
			Images:         i,
			Telegram:       t,
			Filter:         f,
		}
		return api.WrapCreated(ctf, response)
	}
}

func (h *ProfileHandler) GetProfileListHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("GET /api/v1/profile/list")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		params := entity.QueryParamsProfileList{}
		if err := ctf.QueryParser(&params); err != nil {
			h.logger.Debug("error func GetProfileListHandler, method QueryParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		p, err := h.uc.FindBySessionID(ctx, params.SessionID)
		if err != nil {
			h.logger.Debug("error func GetProfileListHandler, method FindBySessionID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		err = h.uc.UpdateLastOnline(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func GetProfileListHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		latitudeStr := params.Latitude
		longitudeStr := params.Longitude
		if latitudeStr != "" && longitudeStr != "" {
			latitude, err := strconv.ParseFloat(latitudeStr, 64)
			if err != nil {
				h.logger.Debug("error func GetProfileBySessionIDHandler, method ParseFloat height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			longitude, err := strconv.ParseFloat(longitudeStr, 64)
			if err != nil {
				h.logger.Debug("error func GetProfileBySessionIDHandler, method ParseFloat height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			point := &entity.Point{
				Latitude:  latitude,
				Longitude: longitude,
			}
			navigatorDto := &entity.NavigatorProfile{
				ProfileID: p.ID,
				Location:  point,
			}
			_, err = h.uc.UpdateNavigator(ctx, navigatorDto)
			if err != nil {
				h.logger.Debug("error func GetProfileBySessionIDHandler, method UpdateNavigator by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
		}
		f, err := h.uc.FindFilterByProfileID(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func GetProfileListHandler, method FindFilterByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		ageFrom := 0
		if params.AgeFrom != "" {
			ageFromUint8, err := strconv.ParseUint(params.AgeFrom, 10, 8)
			if err != nil {
				h.logger.Debug("error func GetProfileListHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			ageFrom = int(ageFromUint8)
		}
		ageTo := 0
		if params.AgeTo != "" {
			ageToUint8, err := strconv.ParseUint(params.AgeTo, 10, 8)
			if err != nil {
				h.logger.Debug("error func GetProfileListHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			ageTo = int(ageToUint8)
		}
		distance := 0
		if params.Distance != "" {
			distance32, err := strconv.ParseUint(params.Distance, 10, 64)
			if err != nil {
				h.logger.Debug("error func GetProfileListHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			distance = int(distance32)
		}
		filterDto := &entity.FilterProfile{
			ID:           f.ID,
			ProfileID:    p.ID,
			SearchGender: params.SearchGender,
			LookingFor:   params.LookingFor,
			AgeFrom:      uint8(ageFrom),
			AgeTo:        uint8(ageTo),
			Distance:     uint64(distance),
			Page:         params.Page,
			Size:         params.Size,
		}
		_, err = h.uc.UpdateFilter(ctx, filterDto)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method UpdateFilter by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		response, err := h.uc.SelectList(ctx, &params)
		if err != nil {
			h.logger.Debug("error func GetProfileListHandler, method SelectList by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapOk(ctf, response)
	}
}

func (h *ProfileHandler) GetProfileBySessionIDHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("GET /api/v1/profile/session/:id")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		sessionID := ctf.Params("id")
		params := entity.QueryParamsGetProfileByUserID{}
		if err := ctf.QueryParser(&params); err != nil {
			h.logger.Debug("error func GetProfileBySessionIDHandler, method QueryParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		p, err := h.uc.FindBySessionID(ctx, sessionID)
		if err != nil {
			h.logger.Debug("error func GetProfileBySessionIDHandler, method FindBySessionID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		err = h.uc.UpdateLastOnline(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func GetProfileBySessionIDHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		latitudeStr := params.Latitude
		longitudeStr := params.Longitude
		if latitudeStr != "" && longitudeStr != "" {
			latitude, err := strconv.ParseFloat(latitudeStr, 64)
			if err != nil {
				h.logger.Debug("error func GetProfileBySessionIDHandler, method ParseFloat height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			longitude, err := strconv.ParseFloat(longitudeStr, 64)
			if err != nil {
				h.logger.Debug("error func GetProfileBySessionIDHandler, method ParseFloat height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			point := &entity.Point{
				Latitude:  latitude,
				Longitude: longitude,
			}
			navigatorDto := &entity.NavigatorProfile{
				ProfileID: p.ID,
				Location:  point,
			}
			_, err = h.uc.UpdateNavigator(ctx, navigatorDto)
			if err != nil {
				h.logger.Debug("error func GetProfileBySessionIDHandler, method UpdateNavigator by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
		}
		t, err := h.uc.FindTelegramByProfileID(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func GetProfileBySessionIDHandler, method FindTelegramByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		f, err := h.uc.FindFilterByProfileID(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func GetProfileBySessionIDHandler, method FindFilterByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		i, err := h.uc.SelectListPublicImage(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func GetProfileBySessionIDHandler, method SelectListPublicImage by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		response := &entity.ResponseProfile{
			ID:        p.ID,
			SessionID: p.SessionID,
			IsDeleted: p.IsDeleted,
			IsBlocked: p.IsBlocked,
			Image:     nil,
			Telegram:  &entity.ResponseTelegramProfile{TelegramID: t.TelegramID},
			Filter: &entity.ResponseFilterProfile{
				ID:           f.ID,
				SearchGender: f.SearchGender,
				LookingFor:   f.LookingFor,
				AgeFrom:      f.AgeFrom,
				AgeTo:        f.AgeTo,
				Distance:     f.Distance,
				Page:         f.Page,
				Size:         f.Size,
			},
		}
		if len(i) > 0 {
			i := entity.ResponseImageProfile{
				Url: i[0].Url,
			}
			response.Image = &i
		}
		return api.WrapOk(ctf, response)
	}
}

func (h *ProfileHandler) GetProfileDetailHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("GET /api/v1/profile/detail/:id")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		idStr := ctf.Params("id")
		profileID, err := strconv.ParseUint(idStr, 10, 64)
		if err != nil {
			h.logger.Debug("error func GetProfileDetailHandler, method ParseUint by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		params := entity.QueryParamsGetProfileDetail{}
		if err := ctf.QueryParser(&params); err != nil {
			h.logger.Debug("error func GetProfileDetailHandler, method QueryParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		p, err := h.uc.FindById(ctx, profileID)
		if err != nil {
			h.logger.Debug("error func GetProfileDetailHandler, method FindById by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		v, err := h.uc.FindBySessionID(ctx, params.ViewerID)
		if err != nil {
			h.logger.Debug("error func GetProfileDetailHandler, method FindBySessionID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		err = h.uc.UpdateLastOnline(ctx, v.ID)
		if err != nil {
			h.logger.Debug("error func GetProfileDetailHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		latitudeStr := params.Latitude
		longitudeStr := params.Longitude
		if latitudeStr != "" && longitudeStr != "" {
			latitude, err := strconv.ParseFloat(latitudeStr, 64)
			if err != nil {
				h.logger.Debug("error func GetProfileDetailHandler, method ParseFloat height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			longitude, err := strconv.ParseFloat(longitudeStr, 64)
			if err != nil {
				h.logger.Debug("error func GetProfileDetailHandler, method ParseFloat height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			point := &entity.Point{
				Latitude:  latitude,
				Longitude: longitude,
			}
			navigatorDto := &entity.NavigatorProfile{
				ProfileID: v.ID,
				Location:  point,
			}
			_, err = h.uc.UpdateNavigator(ctx, navigatorDto)
			if err != nil {
				h.logger.Debug("error func GetProfileDetailHandler, method UpdateNavigator by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
		}
		t, err := h.uc.FindTelegramByProfileID(ctx, profileID)
		if err != nil {
			h.logger.Debug("error func GetProfileDetailHandler, method FindTelegramByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		f, err := h.uc.FindFilterByProfileID(ctx, profileID)
		if err != nil {
			h.logger.Debug("error func GetProfileDetailHandler, method FindFilterByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		n, err := h.uc.FindNavigatorByProfileIDAndViewerID(ctx, p.ID, v.ID)
		if err != nil {
			h.logger.Debug("error func GetProfileDetailHandler, method FindNavigatorByProfileIDAndViewerID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		i, err := h.uc.SelectListPublicImage(ctx, profileID)
		if err != nil {
			h.logger.Debug("error func GetProfileDetailHandler, method SelectListPublicImage by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		l, isExistLike, err := h.uc.FindLikeByLikedUserID(ctx, v.ID, profileID)
		if err != nil {
			h.logger.Debug("error func GetProfileDetailHandler, FindLikeByHumanID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		var lDao *entity.ResponseLikeProfile
		if isExistLike {
			lDao = &entity.ResponseLikeProfile{
				ID: func() *uint64 {
					if isExistLike {
						return &l.ID
					}
					return nil
				}(),
				IsLiked: isExistLike && l.IsLiked,
				UpdatedAt: func() *time.Time {
					if isExistLike {
						return &l.UpdatedAt
					}
					return nil
				}(),
			}
		}
		response := &entity.ResponseProfileDetail{
			ID:             p.ID,
			SessionID:      p.SessionID,
			DisplayName:    p.DisplayName,
			Birthday:       p.Birthday,
			Gender:         p.Gender,
			Location:       p.Location,
			Description:    p.Description,
			Height:         p.Height,
			Weight:         p.Weight,
			IsDeleted:      p.IsDeleted,
			IsBlocked:      p.IsBlocked,
			IsPremium:      p.IsPremium,
			IsShowDistance: p.IsShowDistance,
			IsInvisible:    p.IsInvisible,
			IsOnline:       false,
			CreatedAt:      p.CreatedAt,
			UpdatedAt:      p.UpdatedAt,
			LastOnline:     p.LastOnline,
			Images:         i,
			Telegram:       t,
			Navigator:      n,
			Filter:         f,
			Like:           lDao,
		}
		elapsed := time.Since(p.LastOnline)
		if elapsed.Minutes() < 5 {
			response.IsOnline = true
		}
		return api.WrapOk(ctf, response)
	}
}

func (h *ProfileHandler) UpdateProfileHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/profile/edit")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestUpdateProfile{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		profileID, err := strconv.ParseUint(req.ID, 10, 64)
		if err != nil {
			h.logger.Debug(
				"error func UpdateProfileHandler, method ParseUint roomIdStr by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		profileInDB, err := h.uc.FindById(ctx, profileID)
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method FindById by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusNotFound)
		}
		if profileInDB.IsDeleted == true {
			msg := errors.Wrap(err, "user has already been deleted")
			err = api.NewCustomError(msg, http.StatusNotFound)
			return api.WrapError(ctf, err, http.StatusNotFound)
		}
		if profileInDB.IsBlocked == true {
			msg := errors.Wrap(err, "user has already been blocked")
			err = api.NewCustomError(msg, http.StatusNotFound)
			return api.WrapError(ctf, err, http.StatusNotFound)
		}
		err = h.uc.UpdateLastOnline(ctx, profileInDB.ID)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		filePath := fmt.Sprintf("static/uploads/profile/%s/images/defaultImage.jpg", req.UserName)
		directoryPath := fmt.Sprintf("static/uploads/profile/%s/images", req.UserName)
		if _, err := os.Stat(directoryPath); os.IsNotExist(err) {
			if err := os.MkdirAll(directoryPath, 0755); err != nil {
				h.logger.Debug("error func UpdateProfileHandler, method MkdirAll by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
		}
		form, err := ctf.MultipartForm()
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method MultipartForm by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		height := 0
		if req.Height != "" {
			heightUint64, err := strconv.ParseUint(req.Height, 10, 8)
			if err != nil {
				h.logger.Debug("error func UpdateProfileHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			height = int(heightUint64)
		}
		weight := 0
		if req.Weight != "" {
			weightUint64, err := strconv.ParseUint(req.Weight, 10, 8)
			if err != nil {
				h.logger.Debug("error func UpdateProfileHandler, method ParseUint height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			weight = int(weightUint64)
		}
		imageFiles := form.File["image"]
		profileDto := &entity.Profile{}
		if len(imageFiles) > 0 {
			imagesFilePath := make([]string, 0, len(imageFiles))
			imagesProfile := make([]*entity.ImageProfile, 0, len(imagesFilePath))
			for _, file := range imageFiles {
				filePath = fmt.Sprintf("%s/%s", directoryPath, file.Filename)
				if err := ctf.SaveFile(file, filePath); err != nil {
					h.logger.Debug("error func UpdateProfileHandler, method SaveFile by path"+
						" internal/handler/profile/profile.go", zap.Error(err))
					return api.WrapError(ctf, err, http.StatusBadRequest)
				}
				fileImage, err := os.Open(filePath)
				if err != nil {
					h.logger.Debug("error func UpdateProfileHandler, method os.Open by path"+
						" internal/handler/profile/profile.go", zap.Error(err))
					return api.WrapError(ctf, err, http.StatusBadRequest)
				}
				// The Decode function is used to read images from a file or other source and convert them into an image.
				// Image structure
				_, err = jpeg.Decode(fileImage)
				if err != nil {
					h.logger.Debug("error func UpdateProfileHandler, method jpeg.Decode by path"+
						" internal/handler/profile/profile.go", zap.Error(err))
					return api.WrapError(ctf, err, http.StatusBadRequest)
				}
				newFileName := replaceExtension(file.Filename)
				newFilePath := fmt.Sprintf("%s/%s", directoryPath, newFileName)
				output, err := os.Create(directoryPath + "/" + newFileName)
				if err != nil {
					h.logger.Debug("error func UpdateProfileHandler, method os.Create by path"+
						" internal/handler/profile/profile.go", zap.Error(err))
					return api.WrapError(ctf, err, http.StatusBadRequest)
				}
				defer output.Close()
				buffer, err := bimg.Read(filePath)
				if err != nil {
					h.logger.Debug("error func UpdateProfileHandler, method Read by path"+
						" internal/handler/profile/profile.go", zap.Error(err))
					return api.WrapError(ctf, err, http.StatusBadRequest)
				}
				newImage, err := bimg.NewImage(buffer).Convert(bimg.WEBP)
				if err != nil {
					h.logger.Debug("error func UpdateProfileHandler, method NewImage by path"+
						" internal/handler/profile/profile.go", zap.Error(err))
					return api.WrapError(ctf, err, http.StatusBadRequest)
				}
				bimg.Write(newFilePath, newImage)
				if err := os.Remove(filePath); err != nil {
					h.logger.Debug("error func UpdateProfileHandler, method os.Remove by path"+
						" internal/handler/profile/profile.go", zap.Error(err))
					return api.WrapError(ctf, err, http.StatusBadRequest)
				}
				image := entity.ImageProfile{
					Name:      file.Filename,
					Url:       newFilePath,
					Size:      file.Size,
					CreatedAt: time.Now().UTC(),
					UpdatedAt: time.Now().UTC(),
					IsDeleted: false,
					IsBlocked: false,
					IsPrimary: false,
					IsPrivate: false,
				}
				imagesFilePath = append(imagesFilePath, newFilePath)
				imagesProfile = append(imagesProfile, &image)
			}
			profileDto = &entity.Profile{
				ID:             profileID,
				SessionID:      profileInDB.SessionID,
				DisplayName:    req.DisplayName,
				Birthday:       req.Birthday,
				Gender:         req.Gender,
				Location:       req.Location,
				Description:    req.Description,
				Height:         uint8(height),
				Weight:         uint8(weight),
				IsDeleted:      profileInDB.IsDeleted,
				IsBlocked:      profileInDB.IsBlocked,
				IsPremium:      profileInDB.IsPremium,
				IsShowDistance: profileInDB.IsShowDistance,
				IsInvisible:    profileInDB.IsInvisible,
				CreatedAt:      profileInDB.CreatedAt,
				UpdatedAt:      time.Now().UTC(),
				LastOnline:     time.Now().UTC(),
				Images:         imagesProfile,
			}
		} else {
			profileDto = &entity.Profile{
				ID:             profileID,
				SessionID:      profileInDB.SessionID,
				DisplayName:    req.DisplayName,
				Birthday:       req.Birthday,
				Gender:         req.Gender,
				Location:       req.Location,
				Description:    req.Description,
				Height:         uint8(height),
				Weight:         uint8(weight),
				IsDeleted:      profileInDB.IsDeleted,
				IsBlocked:      profileInDB.IsBlocked,
				IsPremium:      profileInDB.IsPremium,
				IsShowDistance: profileInDB.IsShowDistance,
				IsInvisible:    profileInDB.IsInvisible,
				CreatedAt:      profileInDB.CreatedAt,
				UpdatedAt:      time.Now().UTC(),
				LastOnline:     time.Now().UTC(),
			}
		}
		profileUpdated, err := h.uc.Update(ctx, profileDto)
		if len(imageFiles) > 0 {
			for _, i := range profileDto.Images {
				exists, imageID, err := h.uc.CheckIfCommonImageExists(ctx, profileUpdated.ID, i.Name)
				if err != nil {
					h.logger.Debug("error func UpdateProfileHandler, method CheckIfCommonImageExists by path"+
						" internal/handler/profile/profile.go", zap.Error(err))
					return api.WrapError(ctf, err, http.StatusBadRequest)
				}
				if !exists {
					image := &entity.ImageProfile{
						ProfileID: profileUpdated.ID,
						Name:      i.Name,
						Url:       i.Url,
						Size:      i.Size,
						CreatedAt: i.CreatedAt,
						UpdatedAt: i.UpdatedAt,
						IsDeleted: i.IsDeleted,
						IsBlocked: i.IsBlocked,
						IsPrimary: i.IsPrimary,
						IsPrivate: i.IsPrivate,
					}
					_, err := h.uc.AddImage(ctx, image)
					if err != nil {
						h.logger.Debug("error func UpdateProfileHandler, method AddImage by path"+
							" internal/handler/profile/profile.go", zap.Error(err))
						return api.WrapError(ctf, err, http.StatusBadRequest)
					}
				} else {
					image := &entity.ImageProfile{
						ID:        imageID,
						ProfileID: profileUpdated.ID,
						Name:      i.Name,
						Url:       i.Url,
						Size:      i.Size,
						CreatedAt: i.CreatedAt,
						UpdatedAt: i.UpdatedAt,
						IsDeleted: i.IsDeleted,
						IsBlocked: i.IsBlocked,
						IsPrimary: i.IsPrimary,
						IsPrivate: i.IsPrivate,
					}
					_, err := h.uc.UpdateImage(ctx, image)
					if err != nil {
						h.logger.Debug("error func UpdateProfileHandler, method UpdateImage by path"+
							" internal/handler/profile/profile.go", zap.Error(err))
						return api.WrapError(ctf, err, http.StatusBadRequest)
					}
				}
			}
		}
		telegramID, err := strconv.ParseUint(req.TelegramID, 10, 64)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method ParseUint roomIdStr by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		chatID, err := strconv.ParseUint(req.ChatID, 10, 64)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method ParseUint roomIdStr by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		allowsWriteToPm, err := strconv.ParseBool(req.AllowsWriteToPm)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method ParseBool roomIdStr by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		t, err := h.uc.FindTelegramByProfileID(ctx, profileUpdated.ID)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method FindTelegramByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		telegramDto := &entity.TelegramProfile{
			ID:              t.ID,
			ProfileID:       profileUpdated.ID,
			TelegramID:      telegramID,
			UserName:        req.TelegramUserName,
			Firstname:       req.Firstname,
			Lastname:        req.Lastname,
			LanguageCode:    req.LanguageCode,
			AllowsWriteToPm: allowsWriteToPm,
			QueryID:         req.QueryID,
			ChatID:          chatID,
		}
		f, err := h.uc.FindFilterByProfileID(ctx, profileUpdated.ID)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method FindFilterByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		_, err = h.uc.UpdateTelegram(ctx, telegramDto)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method UpdateTelegram by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		filterDto := &entity.FilterProfile{
			ID:           f.ID,
			ProfileID:    profileUpdated.ID,
			SearchGender: req.SearchGender,
			LookingFor:   req.LookingFor,
		}
		_, err = h.uc.UpdateFilter(ctx, filterDto)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method UpdateFilter by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		latitudeStr := req.Latitude
		longitudeStr := req.Longitude
		if latitudeStr != "" && longitudeStr != "" {
			latitude, err := strconv.ParseFloat(latitudeStr, 64)
			if err != nil {
				h.logger.Debug("error func UpdateProfileHandler, method ParseFloat height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			longitude, err := strconv.ParseFloat(longitudeStr, 64)
			if err != nil {
				h.logger.Debug("error func UpdateProfileHandler, method ParseFloat height by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			point := &entity.Point{
				Latitude:  latitude,
				Longitude: longitude,
			}
			navigatorDto := &entity.NavigatorProfile{
				ProfileID: profileID,
				Location:  point,
			}
			_, err = h.uc.UpdateNavigator(ctx, navigatorDto)
			if err != nil {
				h.logger.Debug("error func UpdateProfileHandler, method UpdateNavigator by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
		}
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method UpdateNavigator by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		p, err := h.uc.FindById(ctx, profileUpdated.ID)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method FindById by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		t, err = h.uc.FindTelegramByProfileID(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler method FindTelegramByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		i, err := h.uc.SelectListPublicImage(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func UpdateProfileHandler, method SelectListPublicImage by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		response := &entity.Profile{
			ID:             p.ID,
			SessionID:      p.SessionID,
			DisplayName:    p.DisplayName,
			Birthday:       p.Birthday,
			Gender:         p.Gender,
			Location:       p.Location,
			Description:    p.Description,
			Height:         p.Height,
			Weight:         p.Weight,
			IsDeleted:      p.IsDeleted,
			IsBlocked:      p.IsBlocked,
			IsPremium:      p.IsPremium,
			IsShowDistance: p.IsShowDistance,
			IsInvisible:    p.IsInvisible,
			CreatedAt:      p.CreatedAt,
			UpdatedAt:      p.UpdatedAt,
			LastOnline:     p.LastOnline,
			Images:         i,
			Telegram:       t,
			Filter:         f,
		}
		return api.WrapCreated(ctf, response)
	}
}

func (h *ProfileHandler) DeleteProfileHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/profile/delete")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestDeleteProfile{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		profileID, err := strconv.ParseUint(req.ID, 10, 64)
		if err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method ParseUint roomIdStr by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		profileInDB, err := h.uc.FindById(ctx, profileID)
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method FindById by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusNotFound)
		}
		if profileInDB.IsDeleted == true {
			msg := errors.Wrap(err, "user has already been deleted")
			err = api.NewCustomError(msg, http.StatusNotFound)
			return api.WrapError(ctf, err, http.StatusNotFound)
		}
		err = h.uc.UpdateLastOnline(ctx, profileInDB.ID)
		if err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		imageList, err := h.uc.SelectListImage(ctx, profileID)
		if len(imageList) > 0 {
			for _, i := range imageList {
				filePath := i.Url
				if err := os.Remove(filePath); err != nil {
					h.logger.Debug("error func DeleteProfileHandler, method Remove by path"+
						" internal/handler/profile/profile.go", zap.Error(err))
					return api.WrapError(ctf, err, http.StatusBadRequest)
				}
				imageDTO := &entity.ImageProfile{
					ID:        i.ID,
					ProfileID: i.ProfileID,
					Name:      "",
					Url:       "",
					Size:      0,
					CreatedAt: i.CreatedAt,
					UpdatedAt: time.Now().UTC(),
					IsDeleted: true,
					IsBlocked: i.IsBlocked,
					IsPrimary: i.IsPrimary,
					IsPrivate: i.IsPrivate,
				}
				_, err := h.uc.DeleteImage(ctx, imageDTO)
				if err != nil {
					h.logger.Debug("error func DeleteProfileHandler, method DeleteImage by path"+
						" internal/handler/profile/profile.go", zap.Error(err))
					return api.WrapError(ctf, err, http.StatusBadRequest)
				}
			}
		}
		t, err := h.uc.FindTelegramByProfileID(ctx, profileInDB.ID)
		if err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method FindTelegramByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		telegramDto := &entity.TelegramProfile{
			ID:              t.ID,
			ProfileID:       profileInDB.ID,
			TelegramID:      0,
			UserName:        "",
			Firstname:       "",
			Lastname:        "",
			LanguageCode:    "",
			AllowsWriteToPm: false,
			QueryID:         "",
			ChatID:          0,
		}
		_, err = h.uc.DeleteTelegram(ctx, telegramDto)
		if err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method DeleteTelegram by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		n, err := h.uc.FindNavigatorByProfileID(ctx, profileInDB.ID)
		if err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method FindNavigatorByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		point := &entity.Point{
			Latitude:  0.0,
			Longitude: 0.0,
		}
		navigatorDto := &entity.NavigatorProfile{
			ID:        n.ID,
			ProfileID: profileInDB.ID,
			Location:  point,
		}
		_, err = h.uc.DeleteNavigator(ctx, navigatorDto)
		if err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method DeleteNavigator by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		f, err := h.uc.FindFilterByProfileID(ctx, profileInDB.ID)
		if err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method FindFilterByProfileID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		filterDto := &entity.FilterProfile{
			ID:           f.ID,
			ProfileID:    profileInDB.ID,
			SearchGender: "",
			LookingFor:   "",
			AgeFrom:      0,
			AgeTo:        0,
			Distance:     0,
			Page:         0,
			Size:         0,
		}
		_, err = h.uc.DeleteFilter(ctx, filterDto)
		if err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method DeleteFilter by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		profileDto := &entity.Profile{
			ID:             profileID,
			SessionID:      "",
			DisplayName:    "",
			Birthday:       profileInDB.Birthday,
			Gender:         "",
			Location:       "",
			Description:    "",
			Height:         0,
			Weight:         0,
			IsDeleted:      true,
			IsBlocked:      false,
			IsPremium:      false,
			IsShowDistance: false,
			IsInvisible:    false,
			CreatedAt:      profileInDB.CreatedAt,
			UpdatedAt:      time.Now().UTC(),
			LastOnline:     time.Now().UTC(),
		}
		_, err = h.uc.Delete(ctx, profileDto)
		if err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method Delete by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		p, err := h.uc.FindById(ctx, profileID)
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func DeleteProfileHandler, method FindById by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusNotFound)
		}
		response := &entity.Profile{
			ID:             p.ID,
			SessionID:      p.SessionID,
			DisplayName:    p.DisplayName,
			Birthday:       p.Birthday,
			Gender:         p.Gender,
			Location:       p.Location,
			Description:    p.Description,
			Height:         p.Height,
			Weight:         p.Weight,
			IsDeleted:      p.IsDeleted,
			IsBlocked:      p.IsBlocked,
			IsPremium:      p.IsPremium,
			IsShowDistance: p.IsShowDistance,
			IsInvisible:    p.IsInvisible,
			CreatedAt:      p.CreatedAt,
			UpdatedAt:      p.UpdatedAt,
			LastOnline:     p.LastOnline,
			Images:         nil,
			Telegram:       nil,
			Navigator:      nil,
			Filter:         nil,
		}
		return api.WrapCreated(ctf, response)
	}
}

func (h *ProfileHandler) DeleteProfileImageHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/profile/image/delete")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestDeleteProfileImage{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func DeleteProfileImageHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		imageID, err := strconv.ParseUint(req.ID, 10, 64)
		if err != nil {
			h.logger.Debug("error func DeleteProfileImageHandler, method ParseUint roomIdStr by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		imageInDB, err := h.uc.FindImageById(ctx, imageID)
		if err != nil {
			h.logger.Debug("error func DeleteProfileImageHandler, method FindImageById by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		if imageInDB.IsDeleted == true {
			msg := errors.Wrap(err, "image has already been deleted")
			err = api.NewCustomError(msg, http.StatusNotFound)
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		filePath := imageInDB.Url
		if err := os.Remove(filePath); err != nil {
			h.logger.Debug("error func DeleteProfileImageHandler, method Remove by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		imageDTO := &entity.ImageProfile{
			ID:        imageInDB.ID,
			ProfileID: imageInDB.ProfileID,
			Name:      "",
			Url:       "",
			Size:      0,
			CreatedAt: imageInDB.CreatedAt,
			UpdatedAt: time.Now().UTC(),
			IsDeleted: true,
			IsBlocked: imageInDB.IsBlocked,
			IsPrimary: imageInDB.IsPrimary,
			IsPrivate: imageInDB.IsPrivate,
		}
		response, err := h.uc.DeleteImage(ctx, imageDTO)
		if err != nil {
			h.logger.Debug("error func DeleteProfileImageHandler, method DeleteImage by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, response)
	}
}

func (h *ProfileHandler) hsin(theta float64) float64 {
	return math.Pow(math.Sin(theta/2), 2)
}

func (h *ProfileHandler) Distance(lat1, lon1, lat2, lon2 float64) float64 {
	var la1, lo1, la2, lo2, rad float64
	la1 = lat1 * math.Pi / 180
	lo1 = lon1 * math.Pi / 180
	la2 = lat2 * math.Pi / 180
	lo2 = lon2 * math.Pi / 180
	rad = 6378100
	hs := h.hsin(la2-la1) + math.Cos(la1)*math.Cos(la2)*h.hsin(lo2-lo1)
	return 2 * rad * math.Asin(math.Sqrt(hs))
}

func (h *ProfileHandler) AddReviewHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/review/add")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestAddReview{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func AddReviewHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		profileID, err := strconv.ParseUint(req.ProfileID, 10, 64)
		if err != nil {
			h.logger.Debug("error func AddReviewHandler, method ParseUint roomIdStr by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		err = h.uc.UpdateLastOnline(ctx, profileID)
		if err != nil {
			h.logger.Debug("error func AddReviewHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		rating, err := strconv.ParseFloat(req.Rating, 32)
		if err != nil {
			h.logger.Debug("error func AddReviewHandler, method ParseUint roomIdStr by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		reviewDto := &entity.ReviewProfile{
			ProfileID:  profileID,
			Message:    req.Message,
			Rating:     float32(rating),
			HasDeleted: false,
			HasEdited:  false,
			CreatedAt:  time.Now().UTC(),
			UpdatedAt:  time.Now().UTC(),
		}
		review, err := h.uc.AddReview(ctx, reviewDto)
		if err != nil {
			h.logger.Debug("error func AddReviewHandler, method AddReview by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, review)
	}
}

func (h *ProfileHandler) UpdateReviewHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/review/update")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestUpdateReview{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func UpdateReviewHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		reviewID, err := strconv.ParseUint(req.ID, 10, 64)
		if err != nil {
			h.logger.Debug("error func UpdateReviewHandler, method ParseUint roomIdStr by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		profileID, err := strconv.ParseUint(req.ProfileID, 10, 64)
		if err != nil {
			h.logger.Debug("error func UpdateReviewHandler, method ParseUint roomIdStr by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		err = h.uc.UpdateLastOnline(ctx, profileID)
		if err != nil {
			h.logger.Debug("error func UpdateReviewHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		reviewInDB, err := h.uc.FindReviewById(ctx, reviewID)
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func UpdateReviewHandler, method FindReviewById by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusNotFound)
		}
		if reviewInDB.HasDeleted == true {
			msg := errors.Wrap(err, "review has already been deleted")
			err = api.NewCustomError(msg, http.StatusNotFound)
			return api.WrapError(ctf, err, http.StatusNotFound)
		}
		rating, err := strconv.ParseFloat(req.Rating, 32)
		if err != nil {
			h.logger.Debug("error func UpdateReviewHandler, method ParseUint roomIdStr by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		reviewDto := &entity.ReviewProfile{
			ID:         reviewID,
			ProfileID:  profileID,
			Message:    req.Message,
			Rating:     float32(rating),
			HasDeleted: reviewInDB.HasDeleted,
			HasEdited:  true,
			CreatedAt:  reviewInDB.CreatedAt,
			UpdatedAt:  time.Now().UTC(),
		}
		review, err := h.uc.UpdateReview(ctx, reviewDto)
		if err != nil {
			h.logger.Debug("error func UpdateReviewHandler, method UpdateReview by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, review)
	}
}

func (h *ProfileHandler) DeleteReviewHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/review/delete")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestDeleteReview{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func DeleteReviewHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		reviewID, err := strconv.ParseUint(req.ID, 10, 64)
		if err != nil {
			h.logger.Debug("error func DeleteReviewHandler, method ParseUint roomIdStr by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		reviewInDB, err := h.uc.FindReviewById(ctx, reviewID)
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func DeleteReviewHandler, method FindReviewById by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusNotFound)
		}
		if reviewInDB.HasDeleted == true {
			msg := errors.Wrap(err, "review has already been deleted")
			err = api.NewCustomError(msg, http.StatusNotFound)
			return api.WrapError(ctf, err, http.StatusNotFound)
		}
		reviewDto := &entity.ReviewProfile{
			ID:         reviewID,
			ProfileID:  reviewInDB.ProfileID,
			Message:    reviewInDB.Message,
			Rating:     reviewInDB.Rating,
			HasDeleted: true,
			HasEdited:  reviewInDB.HasEdited,
			CreatedAt:  reviewInDB.CreatedAt,
			UpdatedAt:  time.Now().UTC(),
		}
		review, err := h.uc.DeleteReview(ctx, reviewDto)
		if err != nil {
			h.logger.Debug("error func DeleteReviewHandler, method UpdateReview by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, review)
	}
}

func (h *ProfileHandler) GetReviewByIDHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("GET /api/v1/review/detail/:id")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		idStr := ctf.Params("id")
		id, err := strconv.ParseUint(idStr, 10, 64)
		if err != nil {
			h.logger.Debug("error func GetReviewByIDHandler, method ParseUint by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		response, err := h.uc.FindReviewById(ctx, id)
		if err != nil {
			h.logger.Debug("error func GetProfileByIDHandler, method FindReviewById by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapOk(ctf, response)
	}
}

func (h *ProfileHandler) GetReviewListHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("GET /api/v1/review/list")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		params := entity.QueryParamsReviewList{}
		if err := ctf.QueryParser(&params); err != nil {
			h.logger.Debug("error func GetReviewListHandler, method QueryParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		profileID, err := strconv.ParseUint(params.ProfileID, 10, 64)
		if err != nil {
			h.logger.Debug("error func GetReviewListHandler, method ParseUint roomIdStr by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		err = h.uc.UpdateLastOnline(ctx, profileID)
		if err != nil {
			h.logger.Debug("error func GetReviewListHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		response, err := h.uc.SelectReviewList(ctx, &params)
		if err != nil {
			h.logger.Debug("error func GetReviewListHandler, method SelectList by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapOk(ctf, response)
	}
}

func (h *ProfileHandler) AddLikeHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/like/add")

		go func() {
			h.uc.Hub.Broadcast <- &entity.Content{
				ChatID:   1,
				Type:     "like",
				Message:  "Ты понравился",
				Username: "@kira",
			}
		}()
		return api.WrapCreated(ctf, nil)

		//ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		//defer cancel()
		//req := profile.RequestAddLike{}
		//if err := ctf.BodyParser(&req); err != nil {
		//	h.logger.Debug("error func AddLikeHandler, method BodyParser by path"+
		//		" internal/handler/profile/profile.go", zap.Error(err))
		//	return api.WrapError(ctf, err, http.StatusBadRequest)
		//}
		//likedUserID, err := strconv.ParseUint(req.LikedUserID, 10, 64)
		//if err != nil {
		//	h.logger.Debug("error func AddLikeHandler, method ParseUint by path "+
		//		" internal/handler/profile/profile.go", zap.Error(err))
		//	return api.WrapError(ctf, err, http.StatusBadRequest)
		//}
		//p, err := h.uc.FindBySessionID(ctx, req.SessionID)
		//if err != nil {
		//	h.logger.Debug("error func AddLikeHandler, method FindByKeycloakID by path "+
		//		" internal/handler/profile/profile.go", zap.Error(err))
		//	return api.WrapError(ctf, err, http.StatusBadRequest)
		//}
		//telegramBySessionID, err := h.uc.FindTelegramByProfileID(ctx, p.ID)
		//if err != nil {
		//	h.logger.Debug("error func AddLikeHandler, method FindTelegramByProfileID by path "+
		//		" internal/handler/profile/profile.go", zap.Error(err))
		//	return api.WrapError(ctf, err, http.StatusBadRequest)
		//}
		//telegramByLikedUserID, err := h.uc.FindTelegramByProfileID(ctx, likedUserID)
		//if err != nil {
		//	h.logger.Debug("error func AddLikeHandler, method FindTelegramByProfileID by path "+
		//		" internal/handler/profile/profile.go", zap.Error(err))
		//	return api.WrapError(ctf, err, http.StatusBadRequest)
		//}
		//err = h.uc.UpdateLastOnline(ctx, p.ID)
		//if err != nil {
		//	h.logger.Debug("error func AddLikeHandler, method UpdateLastOnline by path"+
		//		" internal/handler/profile/profile.go", zap.Error(err))
		//	return api.WrapError(ctf, err, http.StatusBadRequest)
		//}
		//likeDto := &profile.LikeProfile{
		//	ProfileID:   p.ID,
		//	LikedUserID: likedUserID,
		//	IsLiked:     true,
		//	CreatedAt:   time.Now().UTC(),
		//	UpdatedAt:   time.Now().UTC(),
		//}
		//like, err := h.uc.AddLike(ctx, likeDto)
		//if err != nil {
		//	h.logger.Debug("error func AddLikeHandler, method AddLike by path"+
		//		" internal/handler/profile/profile.go", zap.Error(err))
		//	return api.WrapError(ctf, err, http.StatusBadRequest)
		//}
		//go func() {
		//	h.uc.Hub.Broadcast <- &hub.Content{
		//		ChatID:   telegramByLikedUserID.ChatID,
		//		Type:     "like",
		//		Message:  req.Message,
		//		Username: telegramBySessionID.UserName,
		//	}
		//}()
		//return api.WrapCreated(ctf, like)
	}
}

func (h *ProfileHandler) DeleteLikeHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/like/delete")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestDeleteLike{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func DeleteLikeHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		likeID, err := strconv.ParseUint(req.ID, 10, 64)
		if err != nil {
			h.logger.Debug("error func DeleteLikeHandler, method ParseUint by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		l, isExistLike, err := h.uc.FindLikeByID(ctx, likeID)
		if err != nil {
			h.logger.Debug("error func DeleteLikeHandler, method FindByKeycloakID by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		if !isExistLike {
			h.logger.Debug("error func DeleteLikeHandler, method !isExistLike by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			msg := api.ErrorResponse{
				StatusCode: http.StatusNotFound,
				Success:    false,
				Message:    "not found",
			}
			return ctf.Status(http.StatusNotFound).JSON(msg)
		}
		err = h.uc.UpdateLastOnline(ctx, l.ProfileID)
		if err != nil {
			h.logger.Debug("error func DeleteLikeHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		likeDto := &entity.LikeProfile{
			ID:          likeID,
			ProfileID:   l.ProfileID,
			LikedUserID: l.LikedUserID,
			IsLiked:     false,
			CreatedAt:   l.CreatedAt,
			UpdatedAt:   time.Now().UTC(),
		}
		like, err := h.uc.DeleteLike(ctx, likeDto)
		if err != nil {
			h.logger.Debug("error func DeleteLikeHandler, method DeleteLike by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, like)
	}
}

func (h *ProfileHandler) UpdateLikeHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/like/update")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestUpdateLike{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func UpdateLikeHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		likeID, err := strconv.ParseUint(req.ID, 10, 64)
		if err != nil {
			h.logger.Debug("error func UpdateLikeHandler, method ParseUint by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		l, isExist, err := h.uc.FindLikeByID(ctx, likeID)
		if err != nil {
			h.logger.Debug("error func UpdateLikeHandler, method FindLikeByID by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		if !isExist {
			h.logger.Debug("error func UpdateLikeHandler, method !isExist by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			msg := api.ErrorResponse{
				StatusCode: http.StatusNotFound,
				Success:    false,
				Message:    "not found",
			}
			return ctf.Status(http.StatusNotFound).JSON(msg)
		}
		err = h.uc.UpdateLastOnline(ctx, l.ProfileID)
		if err != nil {
			h.logger.Debug("error func UpdateLikeHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		likeDto := &entity.LikeProfile{
			ID:          likeID,
			ProfileID:   l.ProfileID,
			LikedUserID: l.LikedUserID,
			IsLiked:     true,
			CreatedAt:   l.CreatedAt,
			UpdatedAt:   time.Now().UTC(),
		}
		like, err := h.uc.UpdateLike(ctx, likeDto)
		if err != nil {
			h.logger.Debug("error func UpdateLikeHandler, method UpdateLike by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, like)
	}
}

func (h *ProfileHandler) AddBlockHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/block/add")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestAddBlock{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func AddBlockHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		blockedUserID, err := strconv.ParseUint(req.BlockedUserID, 10, 64)
		if err != nil {
			h.logger.Debug("error func AddBlockHandler, method ParseUint by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		p, err := h.uc.FindBySessionID(ctx, req.SessionID)
		if err != nil {
			h.logger.Debug("error func AddBlockHandler, method FindBySessionID by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		err = h.uc.UpdateLastOnline(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func AddBlockHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		blockDto := &entity.BlockedProfile{
			ProfileID:     p.ID,
			BlockedUserID: blockedUserID,
			IsBlocked:     true,
			CreatedAt:     time.Now().UTC(),
			UpdatedAt:     time.Now().UTC(),
		}
		block, err := h.uc.AddBlock(ctx, blockDto)
		if err != nil {
			h.logger.Debug("error func AddBlockHandler, method AddBlock by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		blockForBlockedUserDto := &entity.BlockedProfile{
			ProfileID:     blockedUserID,
			BlockedUserID: p.ID,
			IsBlocked:     true,
			CreatedAt:     time.Now().UTC(),
			UpdatedAt:     time.Now().UTC(),
		}
		_, err = h.uc.AddBlock(ctx, blockForBlockedUserDto)
		if err != nil {
			h.logger.Debug("error func AddBlockHandler, method AddBlock by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, block)
	}
}

func (h *ProfileHandler) UpdateBlockHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/block/update")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestUpdateBlock{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func UpdateBlockHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		blockID, err := strconv.ParseUint(req.ID, 10, 64)
		if err != nil {
			h.logger.Debug("error func UpdateBlockHandler method ParseUint by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		b, isExist, err := h.uc.FindBlockByID(ctx, blockID)
		if err != nil {
			h.logger.Debug("error func UpdateBlockHandler, method FindBlockByID by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		if !isExist {
			h.logger.Debug("error func UpdateBlockHandler, method !isExist by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			msg := api.ErrorResponse{
				StatusCode: http.StatusNotFound,
				Success:    false,
				Message:    "not found",
			}
			return ctf.Status(http.StatusNotFound).JSON(msg)
		}
		err = h.uc.UpdateLastOnline(ctx, b.ProfileID)
		if err != nil {
			h.logger.Debug("error func UpdateBlockHandler, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		blockDto := &entity.BlockedProfile{
			ID:            blockID,
			ProfileID:     b.ProfileID,
			BlockedUserID: blockID,
			IsBlocked:     false,
			CreatedAt:     b.CreatedAt,
			UpdatedAt:     time.Now().UTC(),
		}
		like, err := h.uc.UpdateBlock(ctx, blockDto)
		if err != nil {
			h.logger.Debug("error func UpdateBlockHandler, method UpdateBlock by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		return api.WrapCreated(ctf, like)
	}
}

func (h *ProfileHandler) AddComplaintHandler() fiber.Handler {
	return func(ctf *fiber.Ctx) error {
		h.logger.Info("POST /api/v1/complaint/add")
		ctx, cancel := context.WithTimeout(ctf.Context(), TimeoutDuration)
		defer cancel()
		req := entity.RequestAddComplaint{}
		if err := ctf.BodyParser(&req); err != nil {
			h.logger.Debug("error func AddComplaintHandler, method BodyParser by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		complaintUserId, err := strconv.ParseUint(req.ComplaintUserID, 10, 64)
		if err != nil {
			h.logger.Debug("error func AddComplaintHandler, method ParseUint by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		p, err := h.uc.FindBySessionID(ctx, req.SessionID)
		if err != nil {
			h.logger.Debug("error func AddComplaintHandler, method FindBySessionID by path "+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		err = h.uc.UpdateLastOnline(ctx, p.ID)
		if err != nil {
			h.logger.Debug("error func AddComplaintHandle, method UpdateLastOnline by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		complaintDto := &entity.ComplaintProfile{
			ProfileID:       p.ID,
			ComplaintUserID: complaintUserId,
			Reason:          req.Reason,
			CreatedAt:       time.Now().UTC(),
			UpdatedAt:       time.Now().UTC(),
		}
		complaint, err := h.uc.AddComplaint(ctx, complaintDto)
		if err != nil {
			h.logger.Debug("error func AddComplaintHandler, method AddComplaint by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		blockDto := &entity.BlockedProfile{
			ProfileID:     p.ID,
			BlockedUserID: complaintUserId,
			IsBlocked:     true,
			CreatedAt:     time.Now().UTC(),
			UpdatedAt:     time.Now().UTC(),
		}
		_, err = h.uc.AddBlock(ctx, blockDto)
		if err != nil {
			h.logger.Debug("error func AddComplaintHandler, method AddBlock by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		listComplaint, err := h.uc.SelectListComplaintByID(ctx, complaintUserId)
		if err != nil {
			h.logger.Debug("error func AddComplaintHandler, method SelectListComplaintByID by path"+
				" internal/handler/profile/profile.go", zap.Error(err))
			return api.WrapError(ctf, err, http.StatusBadRequest)
		}
		if len(filterComplaintsByCurrentMonth(listComplaint)) > 1 {
			p, err := h.uc.FindById(ctx, complaintUserId)
			if err != nil {
				h.logger.Debug("error func AddComplaintHandler, method FindById by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
			profileDto := &entity.Profile{
				ID:             p.ID,
				SessionID:      p.SessionID,
				DisplayName:    p.DisplayName,
				Birthday:       p.Birthday,
				Gender:         p.Gender,
				Location:       p.Location,
				Description:    p.Description,
				Height:         p.Height,
				Weight:         p.Weight,
				IsDeleted:      p.IsDeleted,
				IsBlocked:      true,
				IsPremium:      p.IsPremium,
				IsShowDistance: p.IsShowDistance,
				IsInvisible:    p.IsInvisible,
				CreatedAt:      p.CreatedAt,
				UpdatedAt:      p.UpdatedAt,
				LastOnline:     p.LastOnline,
			}
			_, err = h.uc.Update(ctx, profileDto)
			if err != nil {
				h.logger.Debug("error func AddComplaintHandler, method Update by path"+
					" internal/handler/profile/profile.go", zap.Error(err))
				return api.WrapError(ctf, err, http.StatusBadRequest)
			}
		}
		return api.WrapCreated(ctf, complaint)
	}
}

// filterComplaintsByCurrentMonth возвращает кол-во жалоб за текущий месяц
func filterComplaintsByCurrentMonth(complaints []*entity.ComplaintProfile) []*entity.ComplaintProfile {
	currentMonth := time.Now().UTC().Month()
	currentYear := time.Now().UTC().Year()
	filteredComplaints := make([]*entity.ComplaintProfile, 0)
	for _, complaint := range complaints {
		if complaint.CreatedAt.Month() == currentMonth && complaint.CreatedAt.Year() == currentYear {
			filteredComplaints = append(filteredComplaints, complaint)
		}
	}
	return filteredComplaints
}

func replaceExtension(filename string) string {
	// Удаляем текущее расширение
	filename = strings.TrimSuffix(filename, filepath.Ext(filename))
	// Добавляем новое расширение .webp
	return filename + ".webp"
}
