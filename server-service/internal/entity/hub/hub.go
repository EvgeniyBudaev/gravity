package hub

type Content struct {
	ChatID   uint64 `json:"chat_id"`
	Type     string `json:"type"`
	Message  string `json:"message"`
	Username string `json:"username"`
}

type Hub struct {
	Broadcast chan *Content
}

func NewHub() *Hub {
	return &Hub{
		Broadcast: make(chan *Content, 5),
	}
}
