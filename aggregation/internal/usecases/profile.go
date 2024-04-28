package usecases

import (
	"context"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/entity"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/logger"
	"go.uber.org/zap"
)

type ProfileRepo interface {
	Add(ctx context.Context, p *entity.Profile) (*entity.Profile, error)
	Update(ctx context.Context, p *entity.Profile) (*entity.Profile, error)
	UpdateLastOnline(ctx context.Context, profileID uint64) error
	Delete(ctx context.Context, p *entity.Profile) (*entity.Profile, error)
	SelectList(ctx context.Context, qp *entity.QueryParamsProfileList) (*entity.ResponseListProfile, error)
	FindById(ctx context.Context, id uint64) (*entity.Profile, error)
	FindBySessionID(ctx context.Context, sessionID string) (*entity.Profile, error)
	FindByTelegramId(ctx context.Context, telegramID uint64) (*entity.Profile, error)
	AddTelegram(ctx context.Context, t *entity.TelegramProfile) (*entity.TelegramProfile, error)
	UpdateTelegram(ctx context.Context, t *entity.TelegramProfile) (*entity.TelegramProfile, error)
	DeleteTelegram(ctx context.Context, t *entity.TelegramProfile) (*entity.TelegramProfile, error)
	FindTelegramByProfileID(ctx context.Context, profileID uint64) (*entity.TelegramProfile, error)
	AddNavigator(ctx context.Context, p *entity.NavigatorProfile) (*entity.NavigatorProfile, error)
	UpdateNavigator(ctx context.Context, p *entity.NavigatorProfile) (*entity.NavigatorProfile, error)
	DeleteNavigator(ctx context.Context, p *entity.NavigatorProfile) (*entity.NavigatorProfile, error)
	FindNavigatorByProfileID(ctx context.Context, profileID uint64) (*entity.NavigatorProfile, error)
	FindNavigatorByProfileIDAndViewerID(
		ctx context.Context, profileID uint64, viewerID uint64) (*entity.ResponseNavigatorProfile, error)
	AddFilter(ctx context.Context, p *entity.FilterProfile) (*entity.FilterProfile, error)
	UpdateFilter(ctx context.Context, p *entity.FilterProfile) (*entity.FilterProfile, error)
	DeleteFilter(ctx context.Context, p *entity.FilterProfile) (*entity.FilterProfile, error)
	FindFilterByProfileID(ctx context.Context, profileID uint64) (*entity.FilterProfile, error)
	DeleteImage(ctx context.Context, p *entity.ImageProfile) (*entity.ImageProfile, error)
	AddImage(ctx context.Context, p *entity.ImageProfile) (*entity.ImageProfile, error)
	UpdateImage(ctx context.Context, p *entity.ImageProfile) (*entity.ImageProfile, error)
	FindImageById(ctx context.Context, imageID uint64) (*entity.ImageProfile, error)
	SelectListPublicImage(ctx context.Context, profileID uint64) ([]*entity.ImageProfile, error)
	SelectListImage(ctx context.Context, profileID uint64) ([]*entity.ImageProfile, error)
	CheckIfCommonImageExists(ctx context.Context, profileID uint64, fileName string) (bool, uint64, error)
	AddReview(ctx context.Context, p *entity.ReviewProfile) (*entity.ReviewProfile, error)
	UpdateReview(ctx context.Context, p *entity.ReviewProfile) (*entity.ReviewProfile, error)
	DeleteReview(ctx context.Context, p *entity.ReviewProfile) (*entity.ReviewProfile, error)
	FindReviewById(ctx context.Context, id uint64) (*entity.ResponseReviewProfile, error)
	SelectReviewList(ctx context.Context, qp *entity.QueryParamsReviewList) (*entity.ResponseListReview, error)
	AddLike(ctx context.Context, p *entity.LikeProfile) (*entity.LikeProfile, error)
	UpdateLike(ctx context.Context, p *entity.LikeProfile) (*entity.LikeProfile, error)
	DeleteLike(ctx context.Context, p *entity.LikeProfile) (*entity.LikeProfile, error)
	FindLikeByLikedUserID(ctx context.Context, profileID uint64, humanID uint64) (*entity.LikeProfile, bool, error)
	FindLikeByID(ctx context.Context, id uint64) (*entity.LikeProfile, bool, error)
	AddBlock(ctx context.Context, p *entity.BlockedProfile) (*entity.BlockedProfile, error)
	UpdateBlock(ctx context.Context, p *entity.BlockedProfile) (*entity.BlockedProfile, error)
	FindBlockByID(ctx context.Context, id uint64) (*entity.BlockedProfile, bool, error)
	AddComplaint(ctx context.Context, p *entity.ComplaintProfile) (*entity.ComplaintProfile, error)
	UpdateComplaint(ctx context.Context, p *entity.ComplaintProfile) (*entity.ComplaintProfile, error)
	FindComplaintByID(ctx context.Context, id uint64) (*entity.ComplaintProfile, bool, error)
	SelectListComplaintByID(ctx context.Context, complaintUserID uint64) ([]*entity.ComplaintProfile, error)
}

type ProfileUseCases struct {
	logger logger.Logger
	repo   ProfileRepo
	Hub    *entity.Hub
}

func NewProfileUseCases(l logger.Logger, pr ProfileRepo, h *entity.Hub) *ProfileUseCases {
	return &ProfileUseCases{
		logger: l,
		repo:   pr,
		Hub:    h,
	}
}

func (uc *ProfileUseCases) Add(ctx context.Context, p *entity.Profile) (*entity.Profile, error) {
	response, err := uc.repo.Add(ctx, p)
	if err != nil {
		uc.logger.Debug("error func Add, method Add by path internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) Update(ctx context.Context, p *entity.Profile) (*entity.Profile, error) {
	response, err := uc.repo.Update(ctx, p)
	if err != nil {
		uc.logger.Debug("error func Update, method Update by path internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) UpdateLastOnline(ctx context.Context, profileID uint64) error {
	err := uc.repo.UpdateLastOnline(ctx, profileID)
	if err != nil {
		uc.logger.Debug("error func UpdateLastOnline, method UpdateLastOnline by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return err
	}
	return nil
}

func (uc *ProfileUseCases) Delete(ctx context.Context, p *entity.Profile) (*entity.Profile, error) {
	response, err := uc.repo.Delete(ctx, p)
	if err != nil {
		uc.logger.Debug("error func Delete, method Delete by path internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) SelectList(
	ctx context.Context, qp *entity.QueryParamsProfileList) (*entity.ResponseListProfile, error) {
	response, err := uc.repo.SelectList(ctx, qp)
	if err != nil {
		uc.logger.Debug("error func SelectList, method SelectList by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindById(ctx context.Context, id uint64) (*entity.Profile, error) {
	response, err := uc.repo.FindById(ctx, id)
	if err != nil {
		uc.logger.Debug("error func FindById, method FindById by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindBySessionID(ctx context.Context, sessionID string) (*entity.Profile, error) {
	response, err := uc.repo.FindBySessionID(ctx, sessionID)
	if err != nil {
		uc.logger.Debug("error func FindBySessionID, method FindBySessionID by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindByTelegramId(ctx context.Context, telegramID uint64) (*entity.Profile, error) {
	response, err := uc.repo.FindByTelegramId(ctx, telegramID)
	if err != nil {
		uc.logger.Debug("error func FindByTelegramId, methodFindByTelegramId by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) AddImage(ctx context.Context, i *entity.ImageProfile) (*entity.ImageProfile, error) {
	response, err := uc.repo.AddImage(ctx, i)
	if err != nil {
		uc.logger.Debug("error func AddImage, method AddImage by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) UpdateImage(ctx context.Context, i *entity.ImageProfile) (*entity.ImageProfile, error) {
	response, err := uc.repo.UpdateImage(ctx, i)
	if err != nil {
		uc.logger.Debug("error func UpdateImage, method UpdateImage by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) DeleteImage(ctx context.Context, i *entity.ImageProfile) (*entity.ImageProfile, error) {
	response, err := uc.repo.DeleteImage(ctx, i)
	if err != nil {
		uc.logger.Debug("error func DeleteImage, method DeleteImage by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindImageById(ctx context.Context, imageID uint64) (*entity.ImageProfile, error) {
	response, err := uc.repo.FindImageById(ctx, imageID)
	if err != nil {
		uc.logger.Debug("error func FindImageById, method FindImageById by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) SelectListPublicImage(ctx context.Context, profileID uint64) ([]*entity.ImageProfile, error) {
	response, err := uc.repo.SelectListPublicImage(ctx, profileID)
	if err != nil {
		uc.logger.Debug("error func SelectListPublicImage, method SelectListPublicImage by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) SelectListImage(ctx context.Context, profileID uint64) ([]*entity.ImageProfile, error) {
	response, err := uc.repo.SelectListImage(ctx, profileID)
	if err != nil {
		uc.logger.Debug("error func SelectListImage, method SelectListImage by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) CheckIfCommonImageExists(
	ctx context.Context, profileID uint64, fileName string) (bool, uint64, error) {
	return uc.repo.CheckIfCommonImageExists(ctx, profileID, fileName)
}

func (uc *ProfileUseCases) AddTelegram(
	ctx context.Context, t *entity.TelegramProfile) (*entity.TelegramProfile, error) {
	response, err := uc.repo.AddTelegram(ctx, t)
	if err != nil {
		uc.logger.Debug("error func AddTelegram, method AddTelegram by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) UpdateTelegram(
	ctx context.Context, t *entity.TelegramProfile) (*entity.TelegramProfile, error) {
	response, err := uc.repo.UpdateTelegram(ctx, t)
	if err != nil {
		uc.logger.Debug("error func UpdateTelegram, method UpdateTelegram by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) DeleteTelegram(
	ctx context.Context, t *entity.TelegramProfile) (*entity.TelegramProfile, error) {
	response, err := uc.repo.DeleteTelegram(ctx, t)
	if err != nil {
		uc.logger.Debug("error func DeleteTelegram, method DeleteTelegram by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindTelegramByProfileID(
	ctx context.Context, profileID uint64) (*entity.TelegramProfile, error) {
	response, err := uc.repo.FindTelegramByProfileID(ctx, profileID)
	if err != nil {
		uc.logger.Debug("error func FindTelegramByProfileID, method FindTelegramByProfileID by path "+
			"internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) AddNavigator(
	ctx context.Context, n *entity.NavigatorProfile) (*entity.NavigatorProfile, error) {
	response, err := uc.repo.AddNavigator(ctx, n)
	if err != nil {
		uc.logger.Debug("error func AddNavigator, method AddNavigator by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) UpdateNavigator(
	ctx context.Context, n *entity.NavigatorProfile) (*entity.NavigatorProfile, error) {
	response, err := uc.repo.UpdateNavigator(ctx, n)
	if err != nil {
		uc.logger.Debug("error func UpdateTNavigator, method UpdateNavigator by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) DeleteNavigator(
	ctx context.Context, n *entity.NavigatorProfile) (*entity.NavigatorProfile, error) {
	response, err := uc.repo.DeleteNavigator(ctx, n)
	if err != nil {
		uc.logger.Debug("error func DeleteNavigator, method DeleteNavigator by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindNavigatorByProfileID(
	ctx context.Context, profileID uint64) (*entity.NavigatorProfile, error) {
	response, err := uc.repo.FindNavigatorByProfileID(ctx, profileID)
	if err != nil {
		uc.logger.Debug("error func FindNavigatorByProfileID, method FindNavigatorByProfileID by path "+
			"internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindNavigatorByProfileIDAndViewerID(
	ctx context.Context, profileID uint64, viewerID uint64) (*entity.ResponseNavigatorProfile, error) {
	response, err := uc.repo.FindNavigatorByProfileIDAndViewerID(ctx, profileID, viewerID)
	if err != nil {
		uc.logger.Debug("error func FindNavigatorByProfileIDAndViewerId, method FindNavigatorByProfileIDAndViewerId"+
			" by path internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) AddFilter(
	ctx context.Context, t *entity.FilterProfile) (*entity.FilterProfile, error) {
	response, err := uc.repo.AddFilter(ctx, t)
	if err != nil {
		uc.logger.Debug("error func AddFilter, method AddFilter by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) UpdateFilter(
	ctx context.Context, t *entity.FilterProfile) (*entity.FilterProfile, error) {
	response, err := uc.repo.UpdateFilter(ctx, t)
	if err != nil {
		uc.logger.Debug("error func UpdateFilter, method UpdateFilter by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) DeleteFilter(
	ctx context.Context, t *entity.FilterProfile) (*entity.FilterProfile, error) {
	response, err := uc.repo.DeleteFilter(ctx, t)
	if err != nil {
		uc.logger.Debug("error func DeleteFilter, method DeleteFilter by path internal/usecases/profile/profile.go",
			zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindFilterByProfileID(ctx context.Context, profileID uint64) (*entity.FilterProfile, error) {
	response, err := uc.repo.FindFilterByProfileID(ctx, profileID)
	if err != nil {
		uc.logger.Debug("error func FindFilterByProfileID, method FindFilterByProfileID by path "+
			"internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) AddReview(ctx context.Context, p *entity.ReviewProfile) (*entity.ReviewProfile, error) {
	response, err := uc.repo.AddReview(ctx, p)
	if err != nil {
		uc.logger.Debug("error func AddReview, method AddReview by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) UpdateReview(ctx context.Context, p *entity.ReviewProfile) (*entity.ReviewProfile, error) {
	response, err := uc.repo.UpdateReview(ctx, p)
	if err != nil {
		uc.logger.Debug("error func UpdateReview, method UpdateReview by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) DeleteReview(ctx context.Context, p *entity.ReviewProfile) (*entity.ReviewProfile, error) {
	response, err := uc.repo.DeleteReview(ctx, p)
	if err != nil {
		uc.logger.Debug("error func DeleteReview, method DeleteReview by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindReviewById(ctx context.Context, id uint64) (*entity.ResponseReviewProfile, error) {
	response, err := uc.repo.FindReviewById(ctx, id)
	if err != nil {
		uc.logger.Debug("error func FindReviewById, method FindReviewById by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) SelectReviewList(
	ctx context.Context, qp *entity.QueryParamsReviewList) (*entity.ResponseListReview, error) {
	response, err := uc.repo.SelectReviewList(ctx, qp)
	if err != nil {
		uc.logger.Debug("error func SelectReviewList, method SelectReviewList by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) AddLike(ctx context.Context, p *entity.LikeProfile) (*entity.LikeProfile, error) {
	response, err := uc.repo.AddLike(ctx, p)
	if err != nil {
		uc.logger.Debug("error func AddLike, method AddLike by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) UpdateLike(ctx context.Context, p *entity.LikeProfile) (*entity.LikeProfile, error) {
	response, err := uc.repo.UpdateLike(ctx, p)
	if err != nil {
		uc.logger.Debug("error func UpdateLike, method UpdateLike by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) DeleteLike(ctx context.Context, p *entity.LikeProfile) (*entity.LikeProfile, error) {
	response, err := uc.repo.DeleteLike(ctx, p)
	if err != nil {
		uc.logger.Debug("error func DeleteLike, method DeleteLike by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindLikeByLikedUserID(
	ctx context.Context, profileID uint64, humanID uint64) (*entity.LikeProfile, bool, error) {
	response, isExist, err := uc.repo.FindLikeByLikedUserID(ctx, profileID, humanID)
	if err != nil {
		uc.logger.Debug("error func FindLikeByLikedUserID, method FindLikeByLikedUserID by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, isExist, err
	}
	return response, isExist, nil
}

func (uc *ProfileUseCases) FindLikeByID(ctx context.Context, id uint64) (*entity.LikeProfile, bool, error) {
	response, isExist, err := uc.repo.FindLikeByID(ctx, id)
	if err != nil {
		uc.logger.Debug("error func FindLikeByID, method FindLikeByID by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, isExist, err
	}
	return response, isExist, nil
}

func (uc *ProfileUseCases) AddBlock(
	ctx context.Context, p *entity.BlockedProfile) (*entity.BlockedProfile, error) {
	response, err := uc.repo.AddBlock(ctx, p)
	if err != nil {
		uc.logger.Debug("error func AddBlock, method AddBlock by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) UpdateBlock(
	ctx context.Context, p *entity.BlockedProfile) (*entity.BlockedProfile, error) {
	response, err := uc.repo.UpdateBlock(ctx, p)
	if err != nil {
		uc.logger.Debug("error func UpdateBlock, method UpdateBlock by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindBlockByID(ctx context.Context, id uint64) (*entity.BlockedProfile, bool, error) {
	response, isExist, err := uc.repo.FindBlockByID(ctx, id)
	if err != nil {
		uc.logger.Debug("error func FindBlockByID, method FindBlockByID by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, isExist, err
	}
	return response, isExist, nil
}

func (uc *ProfileUseCases) AddComplaint(
	ctx context.Context, p *entity.ComplaintProfile) (*entity.ComplaintProfile, error) {
	response, err := uc.repo.AddComplaint(ctx, p)
	if err != nil {
		uc.logger.Debug("error func AddComplaint, method AddComplaint by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) UpdateComplaint(
	ctx context.Context, p *entity.ComplaintProfile) (*entity.ComplaintProfile, error) {
	response, err := uc.repo.UpdateComplaint(ctx, p)
	if err != nil {
		uc.logger.Debug("error func UpdateComplaint, method UpdateComplaint by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (uc *ProfileUseCases) FindComplaintByID(ctx context.Context, id uint64) (*entity.ComplaintProfile, bool, error) {
	response, isExist, err := uc.repo.FindComplaintByID(ctx, id)
	if err != nil {
		uc.logger.Debug("error func FindComplaintByID, method FindComplaintByID by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, isExist, err
	}
	return response, isExist, nil
}

func (uc *ProfileUseCases) SelectListComplaintByID(
	ctx context.Context, complaintUserID uint64) ([]*entity.ComplaintProfile, error) {
	response, err := uc.repo.SelectListComplaintByID(ctx, complaintUserID)
	if err != nil {
		uc.logger.Debug("error func SelectListComplaintByID, method SelectListComplaintByID by path"+
			" internal/usecases/profile/profile.go", zap.Error(err))
		return nil, err
	}
	return response, nil
}
