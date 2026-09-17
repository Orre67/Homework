// Sparar och hämtar resultat från läxappen: förhörsrundor (glosor, frågor)
// och avbockade uppgifter. Varje post är en "runda" med en lista items.
// Lagring: Neon Postgres via SQL-över-HTTP (inga npm-paket behövs).
//
// Miljövariabler i Vercel:
//   DATABASE_URL   (sätts av Neon-integrationen)
//   ADMIN_PIN      (din egen kod till adminsidan)

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const ADMIN_PIN    = process.env.ADMIN_PIN;

const TABLE = "glosor_rundor";
const MAX_ROUNDS = 300;

async function sql(query, params = []) {
  const host = new URL(DATABASE_URL).hostname;
  const res = await fetch(`https://${host}/sql`, {
    method: "POST",
    headers: {
      "Neon-Connection-String": DATABASE_URL,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, params })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Neon svarade ${res.status}`);
  return data.rows || [];
}

const ensureTable = () => sql(
  `CREATE TABLE IF NOT EXISTS ${TABLE} (
     id   TEXT PRIMARY KEY,
     ts   TIMESTAMPTZ NOT NULL DEFAULT now(),
     data JSONB NOT NULL
   )`
);

const str = (v, max) => String(v ?? "").slice(0, max);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (!DATABASE_URL) {
    return res.status(503).json({
      error: "ingen-lagring",
      message: "Ingen databas kopplad. Lägg till en Neon-integration i Vercel."
    });
  }

  try {
    await ensureTable();

    /* ---- Spara en runda ---- */
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const items = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
      if (!items.length) return res.status(400).json({ error: "tom-runda" });

      const round = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        ts: new Date().toISOString(),
        who: str(body.who || "Gustav", 40),
        laxa: str(body.laxa, 60),          // läxans id från laxor.js
        titel: str(body.titel, 80),
        amne: str(body.amne, 40),
        typ: str(body.typ || "glosor", 12), // glosor | fragor | plugga | uppgift
        mode: str(body.mode, 10),           // fram | bak | mix | lyssna
        total: items.length,
        right: items.filter(x => x.correct === true).length,
        items: items.map(x => ({
          q: str(x.q ?? x.es, 160),         // det som frågades
          a: str(x.a ?? x.sv, 160),         // rätt svar
          dir: str(x.dir, 10),
          correct: x.correct === true,
          given: str(x.given, 160)
        }))
      };

      await sql(`INSERT INTO ${TABLE} (id, ts, data) VALUES ($1, $2, $3)`,
                [round.id, round.ts, JSON.stringify(round)]);
      await sql(`DELETE FROM ${TABLE} WHERE id NOT IN
                   (SELECT id FROM ${TABLE} ORDER BY ts DESC LIMIT $1)`,
                [MAX_ROUNDS]);
      return res.status(201).json({ ok: true, id: round.id });
    }

    /* ---- Läsa / rensa kräver PIN ---- */
    if (req.method === "GET" || req.method === "DELETE") {
      if (!ADMIN_PIN) {
        return res.status(503).json({
          error: "ingen-pin",
          message: "Sätt miljövariabeln ADMIN_PIN i Vercel och deploya om."
        });
      }
      const pin = (req.query && req.query.pin) || "";
      if (pin !== ADMIN_PIN) return res.status(401).json({ error: "fel-pin" });

      if (req.method === "DELETE") {
        await sql(`DELETE FROM ${TABLE}`);
        return res.status(200).json({ ok: true });
      }

      const rows = await sql(`SELECT data FROM ${TABLE} ORDER BY ts DESC LIMIT $1`, [MAX_ROUNDS]);
      const rounds = rows.map(r => (typeof r.data === "string" ? JSON.parse(r.data) : r.data)).filter(Boolean);
      return res.status(200).json({ rounds });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "fel-metod" });

  } catch (err) {
    return res.status(500).json({ error: "lagringsfel", message: err.message });
  }
};
