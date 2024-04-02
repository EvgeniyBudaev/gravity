package hub

type Hub struct {
	Broadcast chan string
}

func NewHub() *Hub {
	return &Hub{
		Broadcast: make(chan string, 5),
	}
}
