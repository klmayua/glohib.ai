package models

type SearchFilter struct {
	Query    string   `json:"query"`
	Skills   []string `json:"skills"`
	Tags     []string `json:"tags"`
	Location string   `json:"location"`
	Remote   *bool    `json:"remote,omitempty"`
	Paid     *bool    `json:"paid,omitempty"`
	Limit    int32    `json:"limit"`
}

type VectorSearchRequest struct {
	Vector []float32 `json:"vector"`
	Limit  int32     `json:"limit"`
}
