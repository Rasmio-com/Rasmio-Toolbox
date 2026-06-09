# GeoIP databases (DB-IP Lite)

Local IP-geolocation data for the toolbox. Downloaded 2026-06-06.

## Files

| File | Size | Contents |
|---|---|---|
| `dbip-city-lite-2026-06.mmdb` | ~124 MB | Country, region, city, lat/lon (IPv4 + IPv6) |
| `dbip-asn-lite-2026-06.mmdb` | ~9 MB | Autonomous System number + organization/ISP |

Format: MaxMind DB (`.mmdb`). Read with the `maxmind` (or `mmdb-lib`) npm package.
Source URLs (refreshed monthly): `https://download.db-ip.com/free/dbip-{city,asn}-lite-YYYY-MM.mmdb.gz`

## License & attribution — REQUIRED

These are the free **DB-IP Lite** databases, licensed under
**Creative Commons Attribution 4.0 International (CC BY 4.0)**.

Any page or output that displays results derived from this data **must** credit DB-IP,
e.g.:

> IP geolocation by [DB-IP](https://db-ip.com)

## Usage notes

- These files are **large binaries** — do **not** bundle them into the client or commit
  them if this becomes a git repo (add `data/geoip/*.mmdb` to `.gitignore`). They are
  re-downloadable from the URLs above.
- Query them **server-side** (Next.js Route Handler / Server Action): the reader memory-maps
  the file and returns a result in microseconds. The lookup input (an IP string) stays well
  under the project's 5 MB server body cap.
- To refresh: download next month's `*-YYYY-MM.mmdb.gz`, `gunzip`, replace the files, update
  the date in filenames/queries.
