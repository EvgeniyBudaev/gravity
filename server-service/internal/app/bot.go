// Package app - Модуль для работы с телеграм ботом
package app

import (
	"context"
	"fmt"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/entity/hub"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"go.uber.org/zap"
	"time"
)

const (
	EmojiCoin           = "\U0001FA99"
	EmojiSmile          = "\U0001F642"
	EmojiSunglasses     = "\U0001F60E"
	UpdateConfigTimeout = 60
)

// bot - телеграм бот
var bot *tgbotapi.BotAPI

// isStartMessage - проверяет, что сообщение /start было отправлено
func isStartMessage(update *tgbotapi.Update) bool {
	return update.Message != nil && update.Message.Text == "/start"
}

// delay - задержка
func delay(seconds uint8) {
	time.Sleep(time.Duration(seconds) * time.Second)
}

// printSystemMessageWithDelay - выводит системное сообщение с задержкой
func printSystemMessageWithDelay(chatId int64, delayInSec uint8, message string) {
	bot.Send(tgbotapi.NewMessage(chatId, message))
	delay(delayInSec)
}

// printIntro - выводит приветственное сообщение
func printIntro(chatId int64) {
	printSystemMessageWithDelay(chatId, 1, "Привет! "+EmojiSunglasses)
	printSystemMessageWithDelay(chatId, 5, "Нажми на кнопку App,"+
		" чтобы перейти на главную страницу приложения")
}

// StartBot - запускает бота
func (app *App) StartBot(ctx context.Context, msgChan <-chan *hub.Content) error {
	var err error
	// Telegram Bot
	if bot, err = tgbotapi.NewBotAPI(app.config.TelegramBotToken); err != nil {
		return err
	}
	bot.Debug = true
	app.Logger.Info("Authorized on account:", zap.String("username", bot.Self.UserName))
	updateConfig := tgbotapi.NewUpdate(0)
	updateConfig.Timeout = UpdateConfigTimeout
	updates := bot.GetUpdatesChan(updateConfig) // Получаем все обновления от пользователя

	go func() {
		for {
			select {
			case <-ctx.Done():
				//wg.Done()
				return
			case c, ok := <-msgChan:
				if !ok {
					msgChan = nil
					continue
				}
				fmt.Println("Message: ", c.Message)
				msg := tgbotapi.NewMessage(int64(c.ChatID), c.Message)
				_, err := bot.Send(msg)
				if err != nil {
					app.Logger.Debug("error func StartBot, method Send by path internal/app/bot.go", zap.Error(err))
				}
			}
		}
	}()

	for update := range updates {
		chatId := update.Message.Chat.ID
		if isStartMessage(&update) {
			userText := update.Message.Text // userText - сообщение, которое отправил пользователь
			app.Logger.Info("Начало общения: ", zap.String("username", update.Message.From.UserName),
				zap.String("message", userText))
			printIntro(chatId)
		}

		//if update.Message != nil {
		//	log.Printf("[%s] %s", update.Message.From.UserName, userText)
		//	msg := tgbotapi.NewMessage(chatId, userText)
		//	msg.ReplyToMessageID = update.Message.MessageID
		//	bot.Send(msg)
		//}
	}
	return nil
}
