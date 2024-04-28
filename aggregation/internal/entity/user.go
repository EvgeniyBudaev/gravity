package entity

type RegisterRequest struct {
	Username     string `json:"username"`
	Password     string `json:"password"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
	Email        string `json:"email"`
	MobileNumber string `json:"mobileNumber"`
}

type RequestUpdateUser struct {
	ID           *string `json:"id"`
	Username     string  `json:"username"`
	FirstName    string  `json:"firstName"`
	LastName     string  `json:"lastName"`
	Email        string  `json:"email"`
	MobileNumber string  `json:"mobileNumber"`
}

type RequestDeleteUser struct {
	ID *string `json:"id"`
}

type QueryParamsUserList struct {
	Searching
}
