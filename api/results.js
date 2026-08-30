// Sparar och hämtar resultat från glosförhöret.
// Lagring: Upstash Redis via REST (inga npm-paket behövs).
//
// Miljövariabler i Vercel:
//   KV_REST_API_URL   + KV_REST_API_TOKEN     (sätts av Redis-integrationen)
//   ADMIN_PIN                                  (din egen kod till adminsidan)

const REDIS_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const ADMIN_PIN   = process.env.ADMIN_PIN;

const KEY = "glosor:rundor";
const MAX_ROUNDS = 300;

async function redis(command) {
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error || `Redis svarade ${res.status}`);
  return data.result;
}

const str = (v, max) => String(v ?? "").slice(0, max);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(503).json({
      error: "ingen-lagring",
      message: "Ingen databas kopplad. Lägg till en Redis-integration i Vercel."
    });
  }

  try {
    /* ---- Spara en runda ---- */
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const items = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
      if (!items.length) return res.status(400).json({ error: "tom-runda" });

      const round = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        ts: new Date().toISOString(),
        who: str(body.who || "Gustav", 40),
        mode: str(body.mode || "es-sv", 10),
        total: items.length,
        right: items.filter(x => x.correct === true).length,
        items: items.map(x => ({
          es: str(x.es, 60),
          sv: str(x.sv, 60),
          dir: str(x.dir, 10),
          correct: x.correct === true,
          given: str(x.given, 60)
        }))
      };

      await redis(["LPUSH", KEY, JSON.stringify(round)]);
      await redis(["LTRIM", KEY, "0", String(MAX_ROUNDS - 1)]);
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
        await redis(["DEL", KEY]);
        return res.status(200).json({ ok: true });
      }

      const raw = (await redis(["LRANGE", KEY, "0", String(MAX_ROUNDS - 1)])) || [];
      const rounds = raw.map(r => { try { return JSON.parse(r); } catch { return null; } }).filter(Boolean);
      return res.status(200).json({ rounds });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "fel-metod" });

  } catch (err) {
    return res.status(500).json({ error: "lagringsfel", message: err.message });
  }
};
