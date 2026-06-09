// All the words. Missions, fake code, chatter, names.
// Everything here is fiction — the only real thing is the vibe.

export const BOOT_LINES = [
  { t: 'BLACKICE BIOS v4.2.0 — KASTRO LABS THEATRICS DIVISION', d: 200 },
  { t: 'CPU0: 1x DRAMA-9000 @ 4.77 MHz (turbo button: ON)', d: 90 },
  { t: 'MEM CHECK: 65536 KB ............ OK', d: 350 },
  { t: 'DETECTING COOLANT ............. LUKEWARM COFFEE FOUND', d: 160 },
  { t: 'LOADING /dev/cinema ........... OK', d: 140 },
  { t: 'LOADING sunglasses.sys ........ OK (worn indoors)', d: 160 },
  { t: 'MOUNTING IMAGINATION .......... OK', d: 140 },
  { t: 'REALITY DRIVER ................ NOT FOUND', d: 300 },
  { t: '  > this is correct. nothing here touches anything real.', d: 260 },
  { t: 'STARTING WINDOW MANAGER: neon.exe', d: 200 },
  { t: 'ALL SYSTEMS THEATRICAL.', d: 320 },
];

export const HANDLE_FIRST = [
  'ACID', 'ZERO', 'NEON', 'CRASH', 'GHOST', 'PHANTOM', 'STATIC', 'BINARY',
  'CHROME', 'VOID', 'RAZOR', 'ECHO', 'CIPHER', 'GLITCH', 'TURBO', 'MIDNIGHT',
];

export const HANDLE_LAST = [
  'BURN', 'COOL', 'OVERRIDE', 'PUFFIN', 'VIPER', 'ORACLE', 'SPIDER', 'FALCON',
  'DAEMON', 'RONIN', 'SPECTRE', 'NOVA', 'BYTE', 'WALRUS', 'MIRAGE', 'JAGUAR',
];

export const MISSIONS = [
  {
    id: 'gibson',
    name: 'THE GIBSON',
    tagline: 'The most dramatic supercomputer ever filmed.',
    brief: 'A skyscraper-sized mainframe with its own light show. Get in, leave a tasteful screensaver, get out.',
    host: 'gibson.ellingson.fict',
    ip: '10.66.66.7',
    city: 'NEW YORK',
    threat: 5,
    password: 'GOD',
    passwordJoke: 'The four most common passwords are: love, sex, secret… and this one.',
    files: [
      'garbage_file.dat', 'da_vinci_virus.src', 'payroll_ledger.fict',
      'cool_screensaver_v2.scr', 'elevator_music.mod', 'blueprints_atrium.cad',
    ],
    victory: 'YOU ARE RATED: ELITE.',
    victorySub: 'The Gibson now boots into synthwave visualizers. Security has been notified and is honestly impressed.',
  },
  {
    id: 'disco',
    name: 'MOONLIGHT-7',
    tagline: 'An orbital disco satellite, tragically muted since 1986.',
    brief: 'Somebody disabled the groove array. Re-enable it and give the night sky back its mirror ball.',
    host: 'moonlight7.orbital.fict',
    ip: '10.19.86.7',
    city: 'REYKJAVIK',
    threat: 3,
    password: 'BOOGIE',
    passwordJoke: 'Engineering note from 1986: "password is what the satellite does."',
    files: [
      'groove_array.cfg', 'mirrorball.rot', 'funk_reserves.tar',
      'bee_gees_failsafe.wav', 'orbit_sparkle.map', 'last_dance.bak',
    ],
    victory: 'GROOVE RESTORED.',
    victorySub: 'MOONLIGHT-7 is spinning again. Cloud cover tonight: 20% more funky.',
  },
  {
    id: 'vault',
    name: 'OBSIDIAN VAULT',
    tagline: 'Where the Bank of Villainy keeps its bonus pool.',
    brief: 'Redirect the executive bonus pool of a fictional evil bank to an extremely real-sounding llama sanctuary.',
    host: 'vault.villainy.fict',
    ip: '10.0.13.13',
    city: 'ZURICH',
    threat: 4,
    password: 'SYNERGY',
    passwordJoke: 'Their CISO used the word from every all-hands. Every single one.',
    files: [
      'bonus_pool.ledger', 'yacht_invoices.zip', 'evil_minutes_q3.doc',
      'shell_companies.csv', 'volcano_lair_hoa_fees.pdf', 'llama_routing.cfg',
    ],
    victory: 'BONUSES REROUTED.',
    victorySub: 'The llama sanctuary just became the best-funded petting zoo in fictional Europe.',
  },
  {
    id: 'bigbrain',
    name: 'PROJECT BIGBRAIN',
    tagline: 'The Global Genius Database. Yes, there is a leaderboard.',
    brief: 'A shadowy registry ranks everyone by alleged IQ. Set every single entry to 160 and watch society improve.',
    host: 'bigbrain.shadowy.fict',
    ip: '10.16.0.160',
    city: 'TOKYO',
    threat: 4,
    password: 'SMART1',
    passwordJoke: 'A genius database protected by a password with a "1" at the end. Poetry.',
    files: [
      'iq_master_table.db', 'leaderboard_cache.idx', 'galaxy_brain.png',
      'mensa_diss_track.mp3', 'humility_patch.diff', 'einstein_entry.row',
    ],
    victory: 'EVERYONE IS A GENIUS NOW.',
    victorySub: 'All 8 billion entries set to 160. The leaderboard is a flat line. Perfect equality achieved.',
  },
];

// The hackertyper corpus. Mash any key and this pours out, one chunk at a
// time. Written to read convincingly at a glance and reward anyone who
// actually stops to read it.
export const CODE = `#include <chaos.h>
#include <sunglasses.h>
#define MAINFRAME_VIBES 0xC0FFEE
#define FIREWALL_POLITENESS 0   /* we ask nicely exactly zero times */

static int breach_counter = 0;  /* fictional breaches only */

int init_uplink(struct node *gateway) {
    if (gateway->is_real) {
        return ABORT_IMMEDIATELY;  /* house rule: fiction only */
    }
    handshake(gateway, PROTOCOL_DRAMATIC);
    set_latency(gateway, CINEMATIC_SLOW);
    return VIBES_OK;
}

void spoof_identity(session_t *s) {
    s->name = "definitely_a_printer";
    s->location = randomize_city(s->location);
    s->trace_resistance += SUNGLASSES_BONUS;
}

for (int layer = 1; layer <= 7; layer++) {
    firewall_t *fw = get_firewall(layer);
    if (!try_front_door(fw)) {
        try_air_vent(fw);          /* movies say this always works */
    }
    log_dramatically("LAYER %d DOWN", layer);
}

def crack_password(target):
    wordlist = ["love", "sex", "secret", "god"]   # the classics
    for guess in wordlist + load("every_word_ever.txt"):
        if target.try(guess):
            announce("I'M IN", volume=MAX)
            return guess
    return brute_force(style="one glowing character at a time")

class NeonTunnel(ProxyChain):
    hops = 7                      # one per continent, for symmetry
    encryption = "military grade, cinema spec"
    def route(self, packet):
        packet.bounce(times=self.hops)
        packet.harmed = False     # company policy
        return packet

$ nmap -sV --top-ports 1000 gibson.ellingson.fict
PORT     STATE  SERVICE
22/tcp   open   ssh (politely)
80/tcp   open   http
443/tcp  open   https
1337/tcp open   elite-mode
9999/tcp open   plot-device

$ ssh root@mainframe --auth dramatic-typing
Warning: identity 'definitely_a_printer' accepted without question.
root@mainframe:~# echo $COOLNESS
maximum

while true; do
    inject_payload --type confetti --safety on
    rotate_proxies --continents all
    sleep 0.$RANDOM   # tension
done

SELECT secrets, dramatic_reveals
FROM mainframe.core
WHERE plot_armor = TRUE
ORDER BY suspense DESC
LIMIT 1;  -- save some mystery for the sequel

memcpy(dest, payload, sizeof(payload));   /* payload is 100% glitter */
xor_decrypt(buffer, key=0x42);            /* the answer, obviously */
mov eax, 0xDEADBEEF
jmp short cinematic_pause
cinematic_pause:
    nop
    nop                                   ; let the audience catch up
    nop

async function exfiltrate(files) {
    for (const f of files) {
        await download(f, { speed: "exactly as fast as the plot needs" });
        progressBar.fill(Math.random() * suspense);
    }
    return "0 real bytes moved";
}

kernel: trace_evasion module loaded (method: being very confident)
kernel: detected operator typing at heroic speed
kernel: granting +10 access per keystroke as per Hollywood convention

# TODO: ask forgiveness, not permissions
# TODO: stop naming variables after 90s movies (after this one)
# NOTE: if you can read this, you are the hacker now

override_mainframe(target, {
    authority: "none whatsoever",
    confidence: 11,
    soundtrack: "pulsing synth",
});

if (trace.level > TRACE_CRITICAL) {
    panic_quietly();
    reroute(through="a fish tank in Reykjavik");
    trace.level = comfortable();
}

fn bypass_ice(ice: &BlackIce) -> Result<Access, Trace> {
    match ice.mood() {
        Mood::Aggressive => Ok(type_faster()),
        Mood::Curious    => Ok(distract_with_jazz()),
        _                => Ok(Access::Granted), // it usually is
    }
}

uplink: 7 proxies chained. latency: artistic.
uplink: encryption nested 4 deep. readability: zero. drama: high.
core: the mainframe respects you now.`.split('\n');

// Lines the system prints between your keystrokes, keyed by stage.
export const CHATTER = {
  inject: [
    'injecting payload… the mainframe suspects nothing',
    'privilege escalating: guest → user → admin → protagonist',
    'memory carved. payload seated. drama rising.',
    'subsystem A trusts us now. subsystem B is jealous.',
    'your typing speed has been classified as "cinematic"',
    'kernel whispers: keep going, this is working',
  ],
  firewall: [
    'BLACK ICE COUNTERMEASURES ACTIVE — TYPE TO HOLD THE LINE',
    'trace spike detected — outrun it with raw keystrokes',
    'firewall is fighting back. it has seen the same movies you have.',
    'rerouting through a fish tank in Reykjavik…',
  ],
  exfil: [
    'siphoning files at plot-convenient speeds',
    'compressing loot… adding tasteful ascii art to the archive',
    'wiping fingerprints off the metaphors',
    'leaving a polite note for the sysadmin',
  ],
};

export const RANKS = [
  { minKps: 0.0, name: 'SCRIPT KIDDIE', note: 'You watched. The keyboard did not fear you.' },
  { minKps: 1.5, name: 'KEYBOARD COWBOY', note: 'Respectable mashing. The mainframe noticed you.' },
  { minKps: 3.0, name: 'CONSOLE SAMURAI', note: 'Clean, fast, dramatic. Hollywood would cast you.' },
  { minKps: 5.0, name: 'CYBER PHANTOM', note: 'The trace never stood a chance.' },
  { minKps: 7.0, name: 'ZERO COOL CERTIFIED', note: 'Hack the planet. Hack the planet!' },
];

export const PROXY_CITIES = [
  { name: 'REYKJAVIK', lat: 64.1, lng: -21.9 },
  { name: 'NEW YORK', lat: 40.7, lng: -74.0 },
  { name: 'SAO PAULO', lat: -23.5, lng: -46.6 },
  { name: 'LAGOS', lat: 6.5, lng: 3.4 },
  { name: 'ZURICH', lat: 47.4, lng: 8.5 },
  { name: 'MOSCOW', lat: 55.7, lng: 37.6 },
  { name: 'MUMBAI', lat: 19.1, lng: 72.9 },
  { name: 'SINGAPORE', lat: 1.3, lng: 103.8 },
  { name: 'TOKYO', lat: 35.7, lng: 139.7 },
  { name: 'SYDNEY', lat: -33.9, lng: 151.2 },
  { name: 'CAIRO', lat: 30.0, lng: 31.2 },
  { name: 'TORONTO', lat: 43.7, lng: -79.4 },
];

export const TRACED_EXCUSES = [
  'They followed the seventh proxy. The fish tank gave you up.',
  'You typed with confidence but not with speed.',
  'The trace team brought their own montage.',
  'Someone answered the decoy phone. Rookie mistake.',
];
