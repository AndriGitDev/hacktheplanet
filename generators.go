package main

import (
	"context"
	"fmt"
	"math/rand/v2"
	"strings"
	"time"
)

func runGenerators(ctx context.Context, hub *Hub) {
	go generateHexDump(ctx, hub)
	go generateTerminal(ctx, hub)
	go generateAlerts(ctx, hub)
	go generateProgress(ctx, hub)
	go generateMapConnections(ctx, hub)
	go generateNodePulses(ctx, hub)
}

func generateHexDump(ctx context.Context, hub *Hub) {
	offset := 0
	for {
		select {
		case <-ctx.Done():
			return
		case <-time.After(50 * time.Millisecond):
			bytes := make([]byte, 16)
			for i := range bytes {
				bytes[i] = byte(rand.IntN(256))
			}
			hexParts := make([]string, 16)
			for i, b := range bytes {
				hexParts[i] = fmt.Sprintf("%02X", b)
			}
			ascii := make([]byte, 16)
			for i, b := range bytes {
				if b >= 32 && b <= 126 {
					ascii[i] = b
				} else {
					ascii[i] = '.'
				}
			}
			hub.Broadcast(Message{
				Type: "hex",
				Data: HexLine{
					Offset: fmt.Sprintf("%08X", offset),
					Hex:    strings.Join(hexParts, " "),
					ASCII:  string(ascii),
				},
			})
			offset += 16
		}
	}
}

var terminalCommands = []struct {
	text  string
	style string
}{
	{"$ open hollywood_mainframe --mode cinematic --target none", "command"},
	{"Toy interface confirmed. No real systems selected.", "output"},
	{"Movie logic loaded. Dramatic typing permitted.", "success"},
	{"$ dial --number 555-MAINFRAME --sound modem", "command"},
	{"Handshake squeal decoded as: welcome to the montage.", "output"},
	{"$ render --satellite-grid --city REYKJAVIK-%d", "command"},
	{"Plot uplink stable. Coffee machine relay %d glowing.", "output"},
	{"$ bypass --thing plot-firewall --method sunglasses", "command"},
	{"Layer %d politely ignored by the screenplay.", "output"},
	{"MAINFRAME VIBES ACQUIRED", "success"},
	{"$ whoami", "command"},
	{"person enjoying a harmless Kastro Labs web toy", "output"},
	{"$ download --file dramatic_pause.wav", "command"},
	{"Transfer complete: 0 bytes. No packets harmed.", "success"},
	{"$ scan --scope imagination --real-targets 0", "command"},
	{"Fictional nodes discovered: %d. Actual networks touched: 0.", "output"},
	{"$ compile --nonsense neon-mainframe", "command"},
	{"Build result: screenshot-worthy chaos.", "success"},
	{"$ gdpr --check", "command"},
	{"No personal data collected by this toy sequence.", "success"},
	{"$ kastro labs --open-source-vibes", "command"},
	{"Reminder: this is theatre, not offensive capability.", "output"},
}

func generateTerminal(ctx context.Context, hub *Hub) {
	idx := 0
	for {
		select {
		case <-ctx.Done():
			return
		case <-time.After(time.Duration(800+rand.IntN(2500)) * time.Millisecond):
			cmd := terminalCommands[idx%len(terminalCommands)]
			text := fmt.Sprintf(cmd.text,
				rand.IntN(255), rand.IntN(255), rand.IntN(255), rand.IntN(255),
				rand.IntN(65536), rand.IntN(65536), rand.IntN(65536), rand.IntN(65536),
			)
			hub.Broadcast(Message{
				Type: "terminal",
				Data: TerminalLine{
					Text:  text,
					Style: cmd.style,
				},
			})
			idx++
		}
	}
}

var alertMessages = []struct {
	text     string
	severity string
}{
	{"PLOT FIREWALL WANTS A MEETING IN %d MINUTES", "warning"},
	{"MAINFRAME VIBES SPIKED TO %d%%", "info"},
	{"DRAMATIC MUSIC INTENSITY: LEVEL %d", "info"},
	{"COFFEE MACHINE RELAY %d REQUESTS PATCH NOTES", "warning"},
	{"NO REAL TARGETS SELECTED -- SAFETY INTERLOCK GREEN", "info"},
	{"SUSPICIOUSLY COOL MAP LINE DETECTED", "info"},
	{"MOVIE LOGIC SPIKE IN SECTOR %d", "critical"},
	{"SCREENSHOT MOMENT APPROACHING IN %d SECONDS", "warning"},
	{"PACKET WELFARE CHECK PASSED", "info"},
	{"BOSS MODE AVAILABLE: PRESS B", "warning"},
	{"KASTRO LABS WATERMARK STABLE", "info"},
	{"FICTIONAL SATELLITE %d HAS ENTERED THE CHAT", "info"},
}

func generateAlerts(ctx context.Context, hub *Hub) {
	for {
		select {
		case <-ctx.Done():
			return
		case <-time.After(time.Duration(3000+rand.IntN(7000)) * time.Millisecond):
			a := alertMessages[rand.IntN(len(alertMessages))]
			text := fmt.Sprintf(a.text,
				rand.IntN(65535), rand.IntN(255), rand.IntN(255), rand.IntN(255),
			)
			hub.Broadcast(Message{
				Type: "alert",
				Data: Alert{
					Text:     text,
					Severity: a.severity,
				},
			})
		}
	}
}

var progressLabels = []string{
	"CALIBRATING MAINFRAME VIBES",
	"LOADING MOVIE LOGIC",
	"POLISHING NEON GRID",
	"BYPASSING PLOT FIREWALL",
	"REWINDING VHS TRACKING",
	"RENDERING SATELLITE THEATRE",
	"COUNTING UNHARMED PACKETS",
	"PREPARING SCREENSHOT MODE",
	"SUMMONING DRAMATIC MODAL",
	"AUDITING FAKE TERMINAL COPY",
	"SPINNING EXECUTIVE CUBE",
	"RESTORING WORKPLACE CREDIBILITY",
}

func generateProgress(ctx context.Context, hub *Hub) {
	type bar struct {
		id      string
		label   string
		percent float64
		speed   float64
	}
	bars := make([]bar, 4)
	for i := range bars {
		bars[i] = bar{
			id:      fmt.Sprintf("bar-%d", i),
			label:   progressLabels[rand.IntN(len(progressLabels))],
			percent: rand.Float64() * 30,
			speed:   0.3 + rand.Float64()*1.5,
		}
	}

	for {
		select {
		case <-ctx.Done():
			return
		case <-time.After(200 * time.Millisecond):
			for i := range bars {
				bars[i].percent += bars[i].speed + rand.Float64()*0.5
				done := false
				if bars[i].percent >= 100 {
					bars[i].percent = 100
					done = true
				}
				hub.Broadcast(Message{
					Type: "progress",
					Data: Progress{
						ID:      bars[i].id,
						Label:   bars[i].label,
						Percent: bars[i].percent,
						Done:    done,
					},
				})
				if done {
					bars[i] = bar{
						id:      bars[i].id,
						label:   progressLabels[rand.IntN(len(progressLabels))],
						percent: 0,
						speed:   0.3 + rand.Float64()*1.5,
					}
				}
			}
		}
	}
}

type city struct {
	name string
	lat  float64
	lng  float64
}

var cities = []city{
	{"WASHINGTON DC", 38.9, -77.0},
	{"NEW YORK", 40.7, -74.0},
	{"LONDON", 51.5, -0.1},
	{"MOSCOW", 55.7, 37.6},
	{"BEIJING", 39.9, 116.4},
	{"TOKYO", 35.7, 139.7},
	{"SYDNEY", -33.9, 151.2},
	{"SAO PAULO", -23.5, -46.6},
	{"BERLIN", 52.5, 13.4},
	{"MUMBAI", 19.1, 72.9},
	{"CAIRO", 30.0, 31.2},
	{"JOHANNESBURG", -26.2, 28.0},
	{"SINGAPORE", 1.3, 103.8},
	{"SEOUL", 37.6, 127.0},
	{"TEL AVIV", 32.1, 34.8},
	{"DUBAI", 25.2, 55.3},
	{"STOCKHOLM", 59.3, 18.1},
	{"TORONTO", 43.7, -79.4},
	{"BUENOS AIRES", -34.6, -58.4},
	{"LAGOS", 6.5, 3.4},
}

func generateMapConnections(ctx context.Context, hub *Hub) {
	for {
		select {
		case <-ctx.Done():
			return
		case <-time.After(time.Duration(1500+rand.IntN(3000)) * time.Millisecond):
			src := cities[rand.IntN(len(cities))]
			dst := cities[rand.IntN(len(cities))]
			for dst.name == src.name {
				dst = cities[rand.IntN(len(cities))]
			}
			hub.Broadcast(Message{
				Type: "map_connection",
				Data: MapConnection{
					SrcLat:  src.lat,
					SrcLng:  src.lng,
					DstLat:  dst.lat,
					DstLng:  dst.lng,
					SrcName: src.name,
					DstName: dst.name,
				},
			})
		}
	}
}

var nodes = []struct {
	id   string
	name string
}{
	{"node-0", "KASTRO-LABS"},
	{"node-1", "PLOT-FIREWALL"},
	{"node-2", "COFFEE-RELAY"},
	{"node-3", "VHS-TRACKING"},
	{"node-4", "SATELLITE-VIBES"},
	{"node-5", "MAINFRAME-AURA"},
	{"node-6", "BOSS-MODE"},
	{"node-7", "NO-PACKETS-HARMED"},
	{"node-8", "DRAMATIC-TERMINAL"},
	{"node-9", "SCREENSHOT-BAIT"},
}

func generateNodePulses(ctx context.Context, hub *Hub) {
	for {
		select {
		case <-ctx.Done():
			return
		case <-time.After(time.Duration(1000+rand.IntN(2000)) * time.Millisecond):
			n := nodes[rand.IntN(len(nodes))]
			hub.Broadcast(Message{
				Type: "node_pulse",
				Data: NodePulse{
					ID:   n.id,
					Name: n.name,
				},
			})
		}
	}
}
