// Package app - Модуль для работы с телеграм ботом
package app

import (
	"context"
	"fmt"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"log"
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
func (app *App) StartBot(ctx context.Context, msgChan <-chan string) error {
	var err error
	// Telegram Bot
	if bot, err = tgbotapi.NewBotAPI(app.config.TelegramBotToken); err != nil {
		return err
	}
	bot.Debug = true
	log.Printf("Authorized on account %s", bot.Self.UserName)
	updateConfig := tgbotapi.NewUpdate(0)
	updateConfig.Timeout = UpdateConfigTimeout
	updates := bot.GetUpdatesChan(updateConfig) // Получаем все обновления от пользователя

	var content string

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
				fmt.Println("c: ", c)
				content = c
			}
		}
	}()

	fmt.Println("content_1: ", content)
	for update := range updates {
		chatId := update.Message.Chat.ID
		if isStartMessage(&update) {
			userText := update.Message.Text // userText - сообщение, которое отправил пользователь
			log.Printf("Начало общения: [%s] %s", update.Message.From.UserName, userText)
			printIntro(chatId)
		}

		fmt.Println("content_2: ", content)
		if content != "" {
			fmt.Println("content_3: ", content)
			msg := tgbotapi.NewMessage(chatId, content)
			if _, err = bot.Send(msg); err != nil {
				return err
			}
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
