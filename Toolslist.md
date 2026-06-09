[ ] 1. IP, Network & Web Diagnostics

[ ] Some network tools are not truly possible with pure browser JavaScript because browsers hide low-level network/TLS details.

[ ] Tool	Feasibility
[x] What is my public IP	External API
[ ] Local network IP detector	Limited / WebRTC restrictions
[x] IPv4 / IPv6 validator	Offline
[x] IPv4 CIDR calculator	Offline
[x] IPv6 CIDR calculator	Offline
[ ] Subnet mask calculator	Offline
[ ] IP range calculator	Offline
[x] IP integer converter	Offline
[x] Private/public IP checker	Offline
[ ] Reserved IP range checker	Offline
[x] MAC address formatter	Offline
[ ] MAC vendor lookup	External API or local dataset
[x] DNS lookup / dig	External API
[ ] DNS record parser	Offline
[ ] DNS zone file formatter	Offline
[x] WHOIS lookup	External API
[x] Reverse DNS lookup	External API
[ ] Ping test	Not possible directly in browser
[ ] Traceroute	Not possible directly in browser
[ ] Port scanner	Not practical / browser-limited
[ ] HTTP status checker	Limited by CORS
[x] HTTP headers checker	Limited by CORS
[ ] Redirect chain checker	Limited by CORS
[ ] URL availability checker	Limited by CORS
[x] CORS tester	Limited but useful
[ ] CSP header analyzer	Limited unless headers accessible
[ ] HSTS checker	Limited / External API
[ ] SSL certificate checker	Needs External API
[ ] TLS version checker	Needs External API
[ ] Certificate expiry calculator	External API
[ ] Mixed content checker	Limited
[ ] Robots.txt viewer	Limited by CORS
[ ] Sitemap.xml viewer	Limited by CORS
[ ] Security.txt viewer	Limited by CORS
[x] WebSocket tester	Offline / remote endpoint needed
[ ] REST endpoint tester	Limited by CORS
[ ] GraphQL query tester	Limited by CORS
[ ] Webhook payload tester	Offline generator only

[ ] Important note: SSL checker, DNS lookup, WHOIS, ping, traceroute, HTTP header checking for arbitrary domains usually need a server or third-party API. A browser cannot inspect arbitrary TLS certificates directly.

[ ] 2. Encoding, Decoding & Escaping

[ ] These are excellent client-only tools.

[ ] Tool
[x] URL encoder
[x] URL decoder
[x] URL component encoder
[x] URL component decoder
[x] HTML entity encoder
[x] HTML entity decoder
[x] XML escape / unescape
[x] JSON string escape / unescape
[x] JavaScript string escape / unescape
[x] CSS escape / unescape
[x] SQL string escape helper
[x] Shell argument escape helper
[ ] CSV escape / unescape
[x] Markdown escape
[x] Regex escape
[x] Base64 encoder
[x] Base64 decoder
[x] Base64 URL-safe encoder
[x] Base64 URL-safe decoder
[x] Base32 encoder / decoder
[x] Base58 encoder / decoder
[x] Base85 encoder / decoder
[x] Hex encoder
[x] Hex decoder
[x] Binary encoder
[x] Binary decoder
[x] ASCII converter
[ ] UTF-8 bytes viewer
[ ] UTF-16 viewer
[x] Unicode code point viewer
[x] Unicode normalizer: NFC, NFD, NFKC, NFKD
[x] Punycode encoder / decoder
[x] JWT decoder
[x] Basic Auth header generator
[x] Data URI generator
[x] Data URI decoder
[ ] Percent encoding visualizer
[x] Quoted-printable encoder / decoder
[ ] MIME encoded-word decoder
[x] ROT13 encoder
[x] Caesar cipher encoder
[x] Morse code encoder / decoder
[x] Braille text converter
[x] NATO phonetic converter
[ ] Slug generator
[ ] Filename-safe string generator
[ ] QR text payload encoder
[ ] 3. Hashing, Crypto & Security Helpers

[ ] Browser Web Crypto supports many things directly.

[ ] Tool	Feasibility
[ ] MD5 hash	Offline via JS library
[x] SHA-1 hash	Offline
[x] SHA-256 hash	Offline
[x] SHA-384 hash	Offline
[x] SHA-512 hash	Offline
[ ] SHA-3 hash	Offline via library
[ ] BLAKE2 / BLAKE3 hash	Offline via WASM/library
[x] File checksum calculator	Offline
[x] HMAC generator	Offline
[x] PBKDF2 generator	Offline
[ ] bcrypt hash	Offline via library
[ ] scrypt hash	Offline via library
[ ] Argon2 hash	Offline via WASM
[x] Password strength checker	Offline
[x] Password generator	
[x] Passphrase generator	
[x] UUID generator	
[x] ULID generator	
[x] NanoID generator	
[x] Random bytes generator	
[x] RSA key pair generator	
[x] ECDSA key pair generator	
[ ] Ed25519 key pair generator via library	
[ ] AES encrypt/decrypt	
[x] AES-GCM encrypt/decrypt	
[ ] ChaCha20 encrypt/decrypt via library	
[ ] RSA encrypt/decrypt	
[ ] Public/private key inspector	
[ ] PEM parser	
[ ] JWK converter	
[ ] CSR parser	
[ ] Certificate parser from pasted PEM	
[x] JWT decoder	
[ ] JWT signer/verifier	
[ ] JWS inspector	
[ ] JWE inspector	
[x] TOTP generator	
[x] HOTP generator	
[x] OTP QR URI generator	
[ ] Recovery code generator	
[x] Secret scanner for pasted text	
[x] API key pattern detector	
[x] Entropy calculator	
[x] Diceware passphrase generator	
[ ] PGP message parser via library	
[ ] PGP encrypt/decrypt via library	
[ ] SSH public key parser	
[ ] SSH fingerprint generator	
[ ] Age encryption via WASM/library	

[ ] Avoid offering real security guarantees for password strength unless you explain it is an estimate.

[ ] 4. Text, String & Document Utilities
[ ] Tool
[x] Character counter
[x] Word counter
[x] Line counter
[x] Sentence counter
[x] Paragraph counter
[x] Byte size calculator
[x] Reading time calculator
[x] Text diff
[ ] Side-by-side diff
[ ] Word diff
[x] JSON diff
[ ] XML diff
[ ] HTML diff
[x] Case converter
[x] camelCase converter
[x] PascalCase converter
[x] snake_case converter
[x] kebab-case converter
[x] CONSTANT_CASE converter
[x] Title Case converter
[x] Sentence case converter
[x] Alternating case
[x] Trim whitespace
[x] Remove duplicate lines
[x] Sort lines
[x] Reverse lines
[x] Shuffle lines
[x] Number lines
[x] Prefix/suffix lines
[x] Find and replace
[ ] Multi-find replace
[x] Regex replace
[x] Extract emails
[x] Extract URLs
[x] Extract phone numbers
[x] Extract IPs
[x] Extract domains
[ ] Extract hashtags
[ ] Extract mentions
[x] Extract numbers
[x] Extract quoted strings
[ ] Extract JSON blocks
[x] Remove empty lines
[x] Normalize line endings
[x] Convert tabs to spaces
[x] Convert spaces to tabs
[x] Wrap text
[x] Unwrap text
[ ] Indent text
[ ] Outdent text
[ ] Text histogram
[x] Letter frequency
[x] Word frequency
[x] N-gram counter
[ ] Lorem ipsum generator
[ ] Dummy text generator
[x] Compare two texts
[x] Levenshtein distance
[x] Jaccard similarity
[x] Text similarity checker
[x] Palindrome checker
[x] Anagram checker
[x] Unicode invisible character detector
[x] Zero-width character remover
[x] Smart quotes converter
[x] Diacritics remover
[ ] Transliteration helper
[ ] Text to ASCII art
[x] ASCII table viewer
[ ] 5. Regex Tools
[ ] Tool
[x] Regex tester
[x] Regex matcher
[x] Regex finder
[x] Regex lister
[x] Regex replacer
[x] Regex highlighter
[ ] Regex explain/syntax helper
[x] Regex flags tester
[ ] Regex group extractor
[ ] Named capture group viewer
[ ] Regex split tool
[x] Regex escape tool
[x] Regex cheat sheet
[x] Common regex generator
[ ] Email regex builder
[ ] URL regex builder
[ ] IP regex builder
[ ] Date regex builder
[ ] Password regex builder
[ ] Regex benchmark
[ ] Regex to string literal converter
[ ] JavaScript regex literal converter
[ ] Regex match visualizer
[ ] Regex minimizer
[ ] Regex duplicate finder
[x] Regex multiline tester
[x] Regex lookahead/lookbehind tester
[x] Regex playground with test cases

[ ] JavaScript regex is native in the browser, so this category is very strong.

[ ] 6. JSON, YAML, XML, HTML & Data Format Tools
[ ] Tool	Feasibility
[x] JSON formatter	
[x] JSON minifier	
[x] JSON validator	
[ ] JSON repair helper	
[x] JSON path finder	
[x] JSONPath evaluator	
[ ] JSON pointer evaluator	
[ ] JSON schema validator	
[ ] JSON schema generator	
[x] JSON to TypeScript	
[ ] JSON to Zod schema	
[ ] JSON to Go struct	
[ ] JSON to Java class	
[ ] JSON to C# class	
[ ] JSON to Python dataclass	
[ ] JSON to CSV	
[ ] CSV to JSON	
[x] JSON to YAML	
[x] YAML to JSON	
[ ] JSON to XML	
[x] XML to JSON	
[ ] JSON tree viewer	
[ ] JSON table viewer	
[x] JSON diff	
[ ] JSON sort keys	
[x] JSON flatten	
[x] JSON unflatten	
[ ] JSON escape/unescape	
[x] NDJSON formatter	
[x] NDJSON to JSON array	
[ ] JSON array filter	
[ ] JQ-like client-side query tool via WASM/library	
[ ] YAML formatter	
[ ] YAML validator	
[ ] YAML to TOML	
[ ] TOML formatter	
[ ] TOML validator	
[x] INI parser	
[x] ENV parser	
[x] Properties file parser	
[x] XML formatter	
[x] XML minifier	
[x] XML validator	
[ ] XPath tester	
[ ] XSLT tester	Browser-supported but limited
[ ] XML tree viewer	
[ ] RSS feed viewer	Limited by CORS for remote URLs
[ ] Atom feed viewer	Limited by CORS
[x] HTML formatter	
[x] HTML minifier	
[ ] HTML entity encoder/decoder	
[ ] HTML previewer	
[ ] HTML sanitizer playground	
[ ] DOM tree viewer	
[x] CSS selector tester	
[ ] CSS selector path finder	
[ ] XPath path finder	
[x] Markdown previewer	
[x] Markdown to HTML	
[x] HTML to Markdown	
[ ] Mermaid diagram viewer	
[ ] Graphviz DOT viewer via WASM	
[ ] PlantUML viewer	Usually needs external service unless WASM/library
[ ] BPMN viewer	
[ ] SVG viewer	
[x] SVG optimizer	
[ ] OpenAPI viewer	
[ ] OpenAPI validator	
[ ] OpenAPI to Markdown	
[ ] Swagger UI client-only viewer	
[ ] AsyncAPI viewer	
[ ] Protobuf formatter/parser via library	
[ ] Avro schema viewer	
[ ] Parquet metadata viewer via WASM	
[ ] HAR viewer	
[ ] HAR analyzer	
[ ] 7. Code Formatters, Minifiers & Dev Helpers

[ ] Many can run client-side using JS/WASM packages.

[ ] Tool
[ ] JavaScript formatter
[ ] TypeScript formatter
[ ] CSS formatter
[ ] SCSS formatter
[ ] LESS formatter
[x] HTML formatter
[ ] Markdown formatter
[x] SQL formatter
[ ] GraphQL formatter
[ ] Dockerfile formatter
[ ] YAML formatter
[x] JSON formatter
[x] XML formatter
[ ] JavaScript minifier
[ ] CSS minifier
[x] HTML minifier
[ ] JS beautifier
[ ] CSS beautifier
[ ] Code diff viewer
[ ] Code syntax highlighter
[ ] Code to image generator
[ ] Source map viewer
[ ] Source map decoder
[x] Stack trace formatter
[ ] Stack trace sourcemap mapper
[ ] JavaScript AST viewer
[ ] TypeScript AST viewer
[ ] CSS AST viewer
[ ] HTML DOM viewer
[ ] Regex AST viewer
[ ] NPM package name validator
[x] Semver validator
[x] Semver range tester
[x] Cron expression parser
[x] Cron next runs preview
[x] Crontab explainer
[ ] Docker image tag parser
[ ] Docker compose YAML validator
[ ] Kubernetes YAML validator
[ ] Helm values formatter
[x] Git ignore pattern tester
[x] Glob pattern tester
[x] .env validator
[ ] License header generator
[ ] Changelog formatter
[ ] Conventional commits validator
[ ] Git commit message helper
[ ] Diff patch viewer
[ ] Unified diff parser
[ ] Base64 source map extractor
[ ] Error decoder for common JS errors
[x] Browser feature detector
[ ] User agent parser
[x] MIME type lookup
[x] File extension lookup
[ ] HTTP status code lookup
[ ] HTTP method reference
[ ] HTML tag reference
[ ] CSS property reference
[ ] Unicode block lookup
[ ] 8. URL, URI & Web Tools
[ ] Tool	Feasibility
[x] URL parser	
[ ] URL builder	
[x] Query string parser	
[x] Query string builder	
[x] Query param sorter	
[ ] Query param remover	
[x] UTM builder	
[x] UTM parser	
[ ] Slug generator	
[ ] Canonical URL checker	
[x] URL normalizer	
[ ] URL diff	
[x] URL encode/decode	
[ ] URL shortener	External API
[ ] URL expander	Limited / External API
[ ] Link extractor from HTML	
[x] Anchor tag generator	
[x] Mailto link generator	
[x] Tel link generator	
[x] SMS link generator	
[x] Data URI generator	
[ ] Blob URL previewer	
[x] Open Graph tag previewer	
[ ] Twitter/X card previewer	
[x] Meta tag generator	
[ ] Favicon checker	Limited by CORS
[ ] Favicon generator	
[x] Robots.txt generator	
[x] Sitemap generator	
[ ] Sitemap parser	
[ ] Hreflang generator	
[ ] Redirect rule generator	
[ ] Apache rewrite rule helper	
[ ] Nginx rewrite rule helper	
[ ] Netlify redirect rule helper	
[ ] Vercel redirect rule helper	
[ ] Cloudflare redirect rule helper	
[ ] CSP generator	
[ ] CSP evaluator	
[ ] Permissions-Policy generator	
[ ] Referrer-Policy helper	
[ ] Security headers generator	
[x] Cookie parser	
[x] Set-Cookie parser	
[x] Cookie attribute explainer	
[ ] SameSite cookie tester	
[ ] CORS header generator	
[ ] CORS preflight explainer	
[x] HTTP cache-control generator	
[ ] ETag comparison helper	
[ ] 9. Date, Time & Timestamp Tools
[ ] Tool
[x] Unix timestamp converter
[x] Millisecond timestamp converter
[ ] ISO date parser
[ ] ISO date formatter
[x] Timezone converter
[ ] Time difference calculator
[x] Date difference calculator
[x] Add/subtract date
[ ] Business days calculator
[x] Week number calculator
[x] Day of year calculator
[x] Leap year checker
[x] Relative time formatter
[x] Duration formatter
[x] Cron next-run calculator
[ ] iCalendar RRULE viewer
[ ] RRULE generator
[ ] Calendar invite generator
[ ] Timezone list
[ ] Local time detector
[ ] UTC offset calculator
[ ] Timestamp batch converter
[ ] JWT expiry checker
[ ] Certificate expiry calculator from pasted cert
[ ] Log timestamp normalizer
[ ] Apache log date parser
[ ] Nginx log date parser
[ ] JavaScript Date playground
[ ] Intl.DateTimeFormat playground
[x] Stopwatch
[x] Countdown timer
[ ] Pomodoro timer
[ ] 10. Unit, Number & Math Converters
[ ] Category	Tools
[x] Length	mm, cm, m, km, inch, foot, yard, mile
[x] Area	m², km², acre, hectare, ft²
[x] Volume	ml, l, m³, gallon, quart, pint
[x] Weight	mg, g, kg, tonne, oz, lb
[x] Temperature	Celsius, Fahrenheit, Kelvin
[x] Speed	m/s, km/h, mph, knots
[x] Pressure	Pa, bar, psi, atm
[x] Energy	J, kJ, Wh, kWh, BTU, calorie
[x] Power	W, kW, hp
[x] Data size	bit, byte, KB, KiB, MB, MiB, GB, GiB
[x] Data speed	Mbps, MB/s, Gbps, GiB/s
[x] Frequency	Hz, kHz, MHz, GHz
[x] Angle	degrees, radians, gradians
[ ] Time	ms, sec, min, hour, day, week
[x] Fuel economy	L/100km, mpg
[ ] Currency	Needs external exchange-rate API
[x] Number base	binary, octal, decimal, hex, base36
[ ] Big number formatter	Offline
[x] Scientific notation converter	Offline
[x] Roman numeral converter	Offline
[x] Fraction/decimal converter	Offline
[x] Percentage calculator	Offline
[x] Ratio calculator	Offline
[ ] Rule of three calculator	Offline
[x] CAGR calculator	Offline
[x] Interest calculator	Offline
[x] Loan calculator	Offline
[x] VAT/tax calculator	Offline, rate must be user-provided
[x] Coordinate converter	Offline
[x] Color value converter	Offline
[ ] 11. Color, Design & Frontend Visual Tools
[ ] Tool
[x] Color picker
[x] HEX to RGB
[x] RGB to HEX
[x] RGB to HSL
[x] HSL to RGB
[x] HSV converter
[ ] CMYK converter
[ ] LAB converter
[ ] OKLCH converter
[x] Color palette generator
[x] Gradient generator
[x] CSS shadow generator
[x] Border radius generator
[ ] CSS clamp generator
[ ] CSS grid generator
[ ] Flexbox playground
[x] CSS filter generator
[ ] Backdrop filter generator
[ ] Glassmorphism generator
[ ] Neumorphism generator
[x] Contrast checker
[x] WCAG color checker
[ ] Color blindness simulator
[ ] Image color palette extractor
[ ] Dominant color extractor
[ ] SVG gradient generator
[ ] SVG pattern generator
[ ] CSS triangle generator
[ ] CSS loader generator
[ ] CSS animation generator
[ ] Cubic-bezier editor
[ ] Font previewer
[ ] Google Fonts CSS builder
[ ] REM/EM/PX converter
[ ] Viewport unit calculator
[ ] Aspect ratio calculator
[ ] Responsive image sizes generator
[ ] Favicon generator
[ ] App icon generator
[ ] Manifest.json generator
[ ] PWA icon checker
[ ] Meta theme-color generator
[ ] 12. Image, SVG, PDF & Media Tools

[ ] Many can work locally using File API, Canvas, WebCodecs, and WASM.

[ ] Tool	Feasibility
[x] Image resizer	Offline
[x] Image cropper	Offline
[x] Image compressor	Offline
[x] Convert PNG to JPG	Offline
[x] Convert JPG to PNG	Offline
[x] Convert PNG/JPG to WebP	Offline
[ ] Convert image to AVIF	Browser-dependent
[ ] Image metadata viewer	Offline
[ ] EXIF viewer	Offline
[ ] EXIF remover	Offline
[ ] Image color picker	Offline
[ ] Image palette extractor	Offline
[ ] Blur image	Offline
[ ] Sharpen image	Offline
[x] Grayscale converter	Offline
[x] Invert image	Offline
[x] Rotate image	Offline
[x] Flip image	Offline
[ ] Watermark image	Offline
[ ] Add text to image	Offline
[ ] Meme generator	Offline
[x] QR code generator	Offline
[ ] Barcode generator	Offline
[ ] QR code reader	Offline
[ ] Barcode reader	Offline/library
[ ] SVG formatter	Offline
[x] SVG minifier	Offline
[ ] SVG previewer	Offline
[x] SVG to PNG	Offline
[ ] PNG to SVG trace	Offline/library
[ ] ICO generator	Offline
[ ] Favicon generator	Offline
[ ] PDF merge	Offline via library
[ ] PDF split	Offline
[ ] PDF page reorder	Offline
[ ] PDF metadata viewer	Offline
[ ] PDF compress	Limited
[ ] PDF to images	Offline/library/WASM
[ ] Images to PDF	Offline
[ ] Add watermark to PDF	Offline
[ ] PDF form filler	Offline/library
[ ] Audio metadata viewer	Offline
[ ] Audio waveform viewer	Offline
[ ] Audio trimmer	Offline/browser APIs
[ ] Video metadata viewer	Offline
[ ] Video frame extractor	Offline/browser APIs
[ ] GIF maker	Offline/library
[ ] GIF splitter	Offline
[ ] Sprite sheet generator	Offline
[ ] 13. File & Archive Tools
[ ] Tool
[x] File hash calculator
[x] File size formatter
[ ] MIME type detector
[ ] File extension detector
[ ] File signature / magic number viewer
[ ] Duplicate file detector
[ ] Binary file viewer
[x] Hex dump viewer
[ ] Text encoding detector
[x] Line ending detector
[x] Convert CRLF/LF
[ ] CSV file viewer
[ ] JSON file viewer
[ ] XML file viewer
[ ] YAML file viewer
[ ] Markdown file previewer
[ ] ZIP viewer
[ ] ZIP creator
[ ] ZIP extractor
[ ] TAR viewer via library
[x] GZIP compress/decompress
[ ] Brotli compress/decompress
[x] Deflate/inflate
[x] Base64 file encoder
[x] Base64 file decoder
[ ] Data URI file generator
[ ] Drag-and-drop file inspector
[x] Directory tree viewer
[ ] Folder size calculator
[ ] File rename pattern generator
[ ] Batch filename previewer
[ ] Image batch converter
[ ] CSV batch converter
[ ] 14. CSV, Table & Data Tools
[ ] Tool
[ ] CSV viewer
[ ] CSV formatter
[ ] CSV validator
[ ] CSV to JSON
[ ] JSON to CSV
[ ] CSV to XML
[x] CSV to Markdown table
[x] Markdown table to CSV
[x] CSV to HTML table
[ ] TSV to CSV
[ ] CSV delimiter converter
[ ] CSV quote fixer
[ ] CSV column extractor
[x] CSV row filter
[x] CSV sort
[x] CSV deduplicate
[ ] CSV merge
[ ] CSV split
[x] CSV transpose
[ ] CSV statistics
[ ] CSV schema inference
[ ] CSV type detector
[ ] CSV chart preview
[x] SQL insert generator from CSV
[ ] HTML table extractor
[ ] Paste table cleaner
[ ] Excel-like formula evaluator
[ ] SQLite in browser via WASM
[ ] Parquet viewer via WASM
[ ] Apache Arrow viewer
[x] GeoJSON viewer
[x] GeoJSON formatter
[ ] GeoJSON to CSV
[ ] KML viewer/parser
[ ] GPX viewer/parser

[ ] If you strictly want no database engine at all, avoid SQLite WASM. If “no server database” is the real rule, SQLite WASM can still be useful because it runs entirely in browser memory.

[ ] 15. Diagrams, Graphs & Visualization
[ ] Tool
[ ] Mermaid diagram viewer
[ ] Mermaid live editor
[ ] Graphviz DOT viewer
[ ] PlantUML viewer
[ ] Sequence diagram viewer
[ ] Flowchart builder
[ ] State machine viewer
[ ] ER diagram viewer
[ ] JSON tree diagram
[ ] XML tree diagram
[ ] YAML tree diagram
[ ] Dependency graph viewer
[ ] Package dependency graph
[ ] Sitemap graph viewer
[ ] Mind map editor
[ ] Markdown mind map
[ ] Gantt chart viewer
[ ] Timeline generator
[ ] Cron schedule visualizer
[ ] Regex match visualizer
[ ] AST tree viewer
[ ] DOM tree viewer
[ ] CSS specificity graph
[ ] Color palette viewer
[ ] Data chart generator
[ ] CSV chart generator
[ ] Sankey diagram generator
[ ] Network graph viewer
[ ] QR code visualizer
[ ] Barcode visualizer

[ ] For PlantUML, many examples use a PlantUML server, but you can also look for client-side/WASM alternatives or support only encoded PlantUML URL generation.

[ ] 16. Generators
[ ] Tool
[x] UUID v1/v4/v7 generator
[x] ULID generator
[x] NanoID generator
[x] Random string generator
[x] Password generator
[x] Passphrase generator
[x] PIN generator
[x] API key generator
[x] Secret token generator
[x] RSA key generator
[x] ECDSA key generator
[ ] SSH key generator
[ ] JWT generator
[x] TOTP secret generator
[x] QR code generator
[ ] Barcode generator
[ ] Lorem ipsum generator
[x] Fake name generator
[x] Fake address generator
[x] Fake email generator
[x] Fake user profile generator
[x] Fake JSON generator
[ ] Fake CSV generator
[ ] Mock API response generator
[ ] JSON schema sample generator
[ ] OpenAPI sample generator
[ ] GraphQL mock data generator
[x] SQL insert generator
[x] Markdown table generator
[ ] HTML table generator
[x] CSS gradient generator
[ ] CSS button generator
[x] CSS shadow generator
[ ] SVG placeholder generator
[ ] Image placeholder generator
[x] Avatar generator
[x] Identicon generator
[x] Robots.txt generator
[x] Sitemap.xml generator
[ ] Manifest.json generator
[ ] Browserconfig.xml generator
[x] Meta tag generator
[x] Open Graph generator
[ ] Twitter card generator
[ ] Email template generator
[x] Mailto link generator
[x] Cron expression generator
[ ] Regex generator
[ ] Nginx config snippet generator
[ ] Apache config snippet generator
[ ] Dockerfile snippet generator
[ ] Docker Compose generator
[ ] Kubernetes YAML generator
[ ] GitHub Actions workflow generator
[ ] License generator
[ ] README template generator
[ ] Changelog generator
[ ] .gitignore generator
[ ] EditorConfig generator
[ ] Prettier config generator
[ ] ESLint config generator
[ ] TSConfig generator
[ ] 17. Validators & Linters
[ ] Tool
[x] Email validator
[x] URL validator
[x] Domain validator
[x] IP validator
[x] UUID validator
[ ] ULID validator
[x] Semver validator
[x] JSON validator
[ ] JSON Schema validator
[ ] YAML validator
[x] XML validator
[ ] HTML validator, limited
[ ] CSS validator, limited
[ ] Markdown validator
[ ] CSV validator
[x] Regex validator
[ ] Cron validator
[ ] JWT validator
[x] Base64 validator
[x] Hex validator
[x] Color code validator
[x] Credit card number validator using Luhn
[x] IBAN validator
[x] ISBN validator
[ ] EAN/UPC validator
[ ] VAT number syntax validator
[ ] Phone number validator via library
[ ] Password policy validator
[ ] CSP validator
[ ] CORS config validator
[ ] Robots.txt validator
[ ] Sitemap validator
[ ] OpenAPI validator
[ ] AsyncAPI validator
[ ] GraphQL schema validator
[x] SQL syntax formatter/validator via library
[ ] Docker Compose validator
[ ] Kubernetes YAML schema validator
[ ] Package.json validator
[ ] Tsconfig validator
[ ] GitHub Actions YAML validator
[ ] SPDX license validator
[ ] 18. Browser, Device & Environment Tools

[ ] These can be fully client-side.

[ ] Tool
[ ] User agent parser
[ ] Browser detector
[ ] OS detector
[ ] Device detector
[x] Screen size detector
[x] Viewport size detector
[x] Device pixel ratio checker
[ ] Touch support checker
[x] WebGL capability checker
[x] WebGPU capability checker
[ ] Canvas support checker
[ ] Audio API checker
[ ] Video codec support checker
[ ] Image format support checker
[ ] WebP support checker
[ ] AVIF support checker
[x] Clipboard API checker
[x] Service worker support checker
[ ] Storage quota checker
[x] LocalStorage checker
[ ] SessionStorage checker
[x] IndexedDB checker
[ ] Cookie support checker
[ ] Third-party cookie tester
[ ] Timezone detector
[ ] Locale detector
[ ] Language detector
[ ] Battery API checker, limited
[ ] Network Information API checker, limited
[ ] Permissions API viewer
[ ] Geolocation tester, user permission required
[ ] Camera/microphone permission tester
[x] Keyboard event inspector
[ ] Mouse event inspector
[ ] Touch event inspector
[ ] Gamepad tester
[ ] Clipboard inspector
[ ] Drag-and-drop tester
[x] WebRTC capability checker
[x] WebSocket tester
[ ] Performance benchmark
[ ] Memory estimate viewer, browser-dependent
[ ] 19. Logs, Monitoring & DevOps Text Tools
[ ] Tool
[x] Log formatter
[x] JSON log viewer
[x] NDJSON log viewer
[x] Apache log parser
[x] Nginx log parser
[ ] Syslog parser
[ ] Kubernetes log formatter
[ ] Docker log formatter
[x] Stack trace formatter
[ ] Java stack trace formatter
[ ] Python traceback formatter
[ ] JavaScript stack trace formatter
[ ] Go panic formatter
[ ] Timestamp normalizer
[x] Log level highlighter
[x] Log filter
[x] Log search
[ ] Log regex extractor
[x] ANSI color code stripper
[x] ANSI log viewer
[ ] Prometheus metric formatter
[ ] PromQL formatter
[ ] OpenTelemetry trace ID validator
[x] W3C traceparent parser
[ ] UUID extractor
[ ] Error code lookup table
[ ] HTTP status code lookup
[ ] gRPC status code lookup
[x] Exit code reference
[ ] Cron log analyzer
[ ] HAR viewer
[ ] HAR timing analyzer
[ ] 20. API & Request Tools
[ ] Tool	Feasibility
[ ] REST request builder	Limited by CORS
[ ] GraphQL query builder	Limited by CORS
[ ] GraphQL formatter	
[ ] GraphQL schema viewer	
[ ] GraphQL variables formatter	
[ ] OpenAPI viewer	
[ ] OpenAPI mock data generator	
[ ] OpenAPI request example generator	
[x] cURL builder	
[x] cURL parser	
[x] Fetch code generator	
[x] Axios code generator	
[ ] HTTPie command generator	
[ ] Postman collection viewer	
[ ] Postman collection to Markdown	
[ ] Insomnia export viewer	
[x] Header parser	
[x] Authorization header builder	
[x] Basic auth generator	
[x] Bearer token parser	
[x] JWT inspector	
[ ] Multipart form-data builder	
[ ] URL encoded form builder	
[x] WebSocket client	Remote endpoint needed
[ ] SSE client	Limited by CORS
[ ] API response formatter	
[ ] API latency tester	Limited by CORS
[ ] Rate-limit header parser	
[x] Cache-control parser	
[ ] 21. SEO, Web Publishing & Content Tools
[ ] Tool	Feasibility
[x] Meta tag generator	
[x] Open Graph preview	
[ ] Twitter/X card preview	
[ ] Title length checker	
[ ] Description length checker	
[ ] Slug generator	
[x] Keyword density checker	
[ ] Heading structure checker	
[ ] HTML outline viewer	
[x] Schema.org JSON-LD formatter	
[ ] JSON-LD validator	
[x] Robots.txt generator	
[ ] Robots.txt parser	
[x] Sitemap generator	
[ ] Sitemap parser	
[ ] Canonical URL helper	
[ ] Hreflang generator	
[ ] Favicon generator	
[ ] PWA manifest generator	
[ ] RSS generator	
[ ] RSS previewer	
[ ] Markdown blog frontmatter parser	
[ ] Readability score	
[ ] Word count	
[ ] Reading time	
[x] HTML to Markdown	
[x] Markdown to HTML	
[ ] Link extractor	
[ ] Broken link checker	Limited by CORS
[ ] Image alt text checker from pasted HTML	
[ ] Lighthouse-style checks	Very limited without server/browser automation
[ ] 22. Accessibility Tools
[ ] Tool
[x] Color contrast checker
[x] WCAG contrast checker
[x] ARIA attribute reference
[ ] ARIA role validator
[ ] HTML heading structure checker
[ ] Image alt checker from pasted HTML
[ ] Form label checker from pasted HTML
[ ] Landmark checker
[ ] Tab order visualizer for local HTML
[ ] Keyboard event tester
[ ] Focus outline tester
[ ] Color blindness simulator
[ ] Accessible name helper
[ ] WCAG checklist
[ ] Font size/rem checker
[x] Touch target size calculator
[ ] Caption/subtitle format checker
[x] VTT formatter
[x] SRT formatter
[x] SRT to VTT
[x] VTT to SRT
[ ] 23. Location, Maps & Geo Tools
[ ] Tool	Feasibility
[x] Latitude/longitude formatter	
[x] Coordinate validator	
[x] Decimal degrees to DMS	
[x] DMS to decimal degrees	
[x] Distance between coordinates	
[x] Bearing calculator	
[ ] Bounding box calculator	
[x] GeoJSON formatter	
[x] GeoJSON validator	
[x] GeoJSON viewer	
[ ] KML to GeoJSON	
[ ] GPX viewer	
[ ] GPX to GeoJSON	
[x] Polyline encoder/decoder	
[x] Geohash encoder/decoder	
[ ] What3Words	External API
[ ] IP geolocation	External API
[ ] Address geocoding	External API
[ ] Timezone from coordinates	External API or local dataset
[ ] Map preview	External map tiles unless using local/simple canvas
[ ] 24. Finance / Business Calculators

[ ] Fully client-side if user provides rates/inputs.

[ ] Tool
[x] Percentage calculator
[ ] Margin calculator
[x] Markup calculator
[x] Discount calculator
[x] VAT calculator
[ ] Sales tax calculator
[x] Compound interest calculator
[x] Loan calculator
[ ] Mortgage calculator
[x] CAGR calculator
[ ] ROI calculator
[ ] Break-even calculator
[ ] Profit/loss calculator
[x] Hourly to salary converter
[x] Salary to hourly converter
[ ] Freelance rate calculator
[ ] Burn rate calculator
[ ] Runway calculator
[x] Currency formatter
[ ] Currency converter, needs exchange-rate API
[ ] Invoice number generator
[x] IBAN validator
[x] Credit card validator using Luhn
[ ] SWIFT/BIC syntax checker
[ ] 25. Learning / Reference Tools

[ ] These are mostly static data bundled into the app.

[ ] Tool
[ ] HTTP status code reference
[ ] HTTP headers reference
[x] MIME type reference
[ ] File extension reference
[x] HTML entity reference
[ ] HTML tag reference
[ ] CSS property reference
[ ] JavaScript operator reference
[x] Regex cheat sheet
[x] Git command cheat sheet
[x] Docker command cheat sheet
[x] Kubernetes command cheat sheet
[x] Linux command cheat sheet
[x] Bash parameter expansion cheat sheet
[x] Cron cheat sheet
[x] Markdown cheat sheet
[ ] YAML cheat sheet
[ ] JSONPath cheat sheet
[ ] XPath cheat sheet
[x] SQL syntax cheat sheet
[ ] Unicode block reference
[x] ASCII table
[x] Emoji picker
[x] HTML symbol picker
[x] Keyboard keycode viewer
[ ] Browser compatibility notes, static/offline dataset
[x] Common ports reference
[ ] DNS record types reference
[ ] TLS cipher reference, static
[ ] Security headers reference

[ ] 26. File & Document Converters

[ ] Conversion-focused tools (the "convertor" group). All run fully client-side via Canvas, File API, and WASM/JS libraries — no server, so the only real limit is browser memory (consistent with the client-first design).

[ ] Already covered elsewhere — do NOT re-add: §12 Image compressor, PNG↔JPG, PNG/JPG→WebP, image→AVIF (browser-dependent), SVG→PNG, PDF→images, Images→PDF, EXIF remover. §6/§21 Markdown↔HTML, HTML→Markdown.

[ ] Document & Office
[ ] Tool	Feasibility
[ ] Word (.docx) to HTML	Offline via mammoth.js
[ ] Word (.docx) to Markdown	Offline via mammoth.js + turndown
[ ] Word (.docx) to plain text	Offline via mammoth.js
[ ] Word (.docx) to PDF	Offline via mammoth.js + html2pdf — limited layout fidelity
[ ] PDF to text	Offline via pdf.js (text-based PDFs only)
[ ] PDF to HTML	Offline via pdf.js — positioned text
[ ] PDF to Markdown	Offline via pdf.js — heuristic, limited
[ ] PDF to Word (.docx)	Offline via pdf.js + docx.js — limited layout fidelity
[ ] Scanned PDF / image OCR to text	Offline via tesseract.js (WASM, heavy)
[ ] Markdown to PDF	Offline via marked + html2pdf
[ ] Markdown to Word (.docx)	Offline via docx.js
[ ] HTML to PDF	Offline via html2pdf / jsPDF — rendering caveats
[ ] HTML to Word (.docx)	Offline via html-docx-js
[ ] RTF to HTML / text	Offline via rtf.js — limited
[ ] EPUB to HTML / text	Offline via JSZip / epub.js
[ ] ODT to HTML	Offline — zip + XML parse, niche
[ ] Legacy .doc (binary) to text	Not practical client-side

[ ] Spreadsheet
[ ] Tool	Feasibility
[ ] XLSX to CSV	Offline via SheetJS
[ ] XLSX to JSON	Offline via SheetJS
[ ] CSV to XLSX	Offline via SheetJS
[ ] JSON to XLSX	Offline via SheetJS
[ ] XLSX to Markdown / HTML table	Offline via SheetJS
[ ] XLS / ODS to CSV	Offline via SheetJS

[ ] Image (formats not already in §12)
[ ] Tool	Feasibility
[ ] Universal image converter (JPG/PNG/WebP/GIF/BMP/TIFF)	Offline via Canvas (+ UTIF.js for TIFF)
[ ] Image to / from TIFF	Offline via UTIF.js
[ ] HEIC / HEIF to JPG / PNG	Offline via heic2any (WASM)
[ ] BMP to PNG / JPG	Offline via Canvas
[ ] SVG to JPG / WebP	Offline via Canvas (extends SVG→PNG)

[ ] Audio & Video (heavier)
[ ] Tool	Feasibility
[ ] Audio converter WAV ↔ MP3 / OGG	Offline via WebAudio decode + lamejs encode
[ ] Audio / video transcode (MP4/WebM/MP3/…)	Offline via ffmpeg.wasm — large WASM download (lazy)
[ ] Video to GIF	Offline via ffmpeg.wasm
