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
	{"$ ssh -p 4422 root@10.0.%d.%d", "command"},
	{"Connecting to remote host...", "output"},
	{"Connection established. Initiating handshake...", "output"},
	{"ROOT ACCESS OBTAINED", "success"},
	{"$ nmap -sS -O 192.168.%d.0/24", "command"},
	{"Scanning 254 hosts...", "output"},
	{"Host 192.168.%d.%d is up (0.003s latency)", "output"},
	{"PORT     STATE SERVICE", "output"},
	{"22/tcp   open  ssh", "output"},
	{"80/tcp   open  http", "output"},
	{"443/tcp  open  https", "output"},
	{"3306/tcp open  mysql", "output"},
	{"$ cat /etc/shadow | decrypt --aes256", "command"},
	{"DECRYPTING AES-256 CIPHER...", "output"},
	{"CIPHER BLOCK CHAIN MODE DETECTED", "output"},
	{"HASH COLLISION FOUND AT OFFSET 0x%04X", "success"},
	{"$ inject --payload reverse_shell --target %d.%d.%d.%d", "command"},
	{"Payload compiled. Size: %d bytes", "output"},
	{"Establishing reverse tunnel on port %d...", "output"},
	{"SHELL OBTAINED -- ESCALATING PRIVILEGES", "success"},
	{"$ traceroute darknet-node-%d.onion", "command"},
	{"TRACE ROUTE: %d HOPS DETECTED", "output"},
	{"Routing through TOR exit node %d.%d.%d.%d", "output"},
	{"$ download --recursive /classified/project-blackbird/", "command"},
	{"Downloading 2,847 files (%d MB)...", "output"},
	{"TRANSFER COMPLETE", "success"},
	{"$ exploit --cve CVE-2024-%04d --target mainframe", "command"},
	{"Vulnerability confirmed. Deploying exploit...", "output"},
	{"BUFFER OVERFLOW TRIGGERED AT 0x%08X", "output"},
	{"MAINFRAME COMPROMISED", "success"},
	{"WARNING: INTRUSION DETECTION SYSTEM ACTIVE", "error"},
	{"$ stealth --mode ghost --pid $$", "command"},
	{"Erasing log entries...", "output"},
	{"Process hidden from /proc", "output"},
	{"GHOST MODE ACTIVATED", "success"},
	{"$ crack --wordlist rockyou.txt --hash %08x%08x", "command"},
	{"Testing %d combinations/sec...", "output"},
	{"PASSWORD FOUND: ************", "success"},
	{"$ tunnel --create --encrypt chacha20 --port %d", "command"},
	{"Encrypted tunnel established", "success"},
	{"Bandwidth: %d MB/s | Latency: %dms", "output"},
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
	{"INTRUSION DETECTED ON PORT %d", "critical"},
	{"TRACE DETECTED -- REROUTING THROUGH NODE %d", "warning"},
	{"ACCESS GRANTED -- LEVEL %d CLEARANCE", "info"},
	{"FIREWALL BREACH IN SECTOR %d", "critical"},
	{"ENCRYPTION KEY COMPROMISED", "critical"},
	{"NEW BACKDOOR INSTALLED ON %d.%d.%d.%d", "info"},
	{"PACKET SNIFFER ACTIVE ON eth%d", "warning"},
	{"SSL CERTIFICATE FORGED SUCCESSFULLY", "info"},
	{"HONEYPOT DETECTED -- ABORTING SCAN", "warning"},
	{"DATABASE DUMP COMPLETE -- %d RECORDS", "info"},
	{"KERNEL EXPLOIT LOADED INTO MEMORY", "critical"},
	{"PROXY CHAIN ESTABLISHED -- %d NODES", "info"},
	{"IDS EVASION SUCCESSFUL", "info"},
	{"UNAUTHORIZED ACCESS FROM %d.%d.%d.%d", "warning"},
	{"ZERO-DAY EXPLOIT DEPLOYED", "critical"},
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
	"DECRYPTING MAINFRAME",
	"UPLOADING VIRUS",
	"DOWNLOADING DATABASE",
	"CRACKING PASSWORD",
	"BYPASSING FIREWALL",
	"INJECTING PAYLOAD",
	"EXTRACTING CREDENTIALS",
	"COMPILING EXPLOIT",
	"BRUTE FORCING AUTH",
	"EXFILTRATING DATA",
	"SCANNING NETWORK",
	"CLONING FIRMWARE",
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
	{"node-0", "NSA-RELAY-7"},
	{"node-1", "DARKNET-PROXY-3"},
	{"node-2", "TOR-EXIT-12"},
	{"node-3", "BOTNET-C2-ALPHA"},
	{"node-4", "SATCOM-UPLINK-9"},
	{"node-5", "MAINFRAME-CORE"},
	{"node-6", "GCHQ-NODE-4"},
	{"node-7", "PENTAGON-DMZ"},
	{"node-8", "ECHELON-TAP-2"},
	{"node-9", "SHADOW-NET-6"},
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
