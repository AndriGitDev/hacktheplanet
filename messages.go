package main

// Message is the envelope sent over WebSocket to the frontend.
type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

type HexLine struct {
	Offset string `json:"offset"`
	Hex    string `json:"hex"`
	ASCII  string `json:"ascii"`
}

type TerminalLine struct {
	Text  string `json:"text"`
	Style string `json:"style"` // "command", "output", "success", "error"
}

type Alert struct {
	Text     string `json:"text"`
	Severity string `json:"severity"` // "info", "warning", "critical"
}

type Progress struct {
	ID      string  `json:"id"`
	Label   string  `json:"label"`
	Percent float64 `json:"percent"`
	Done    bool    `json:"done"`
}

type MapConnection struct {
	SrcLat  float64 `json:"srcLat"`
	SrcLng  float64 `json:"srcLng"`
	DstLat  float64 `json:"dstLat"`
	DstLng  float64 `json:"dstLng"`
	SrcName string  `json:"srcName"`
	DstName string  `json:"dstName"`
}

type NodePulse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
