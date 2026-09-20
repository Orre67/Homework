# Läxappen

Statisk sida + en liten API-funktion. Inga byggsteg, inga npm-paket.

```
laxor.js            veckans läxor – den enda filen som ändras varje vecka
index.html          appen som Gustav använder (startsida, läxor, förhör)
admin.html          resultatvyn, ligger på /admin
api/results.js      sparar och hämtar rundor
manifest.webmanifest + icon-*.png   gör att sidan kan läggas på hemskärmen som en app
```

## Lägga in veckans läxor

Öppna `laxor.js`. Varje läxa är ett objekt i listan `LAXOR` med `id`, `amne`,
`titel`, `till` (sista dag) och `typ`. Det finns fyra typer:

**Glosor** – förhörs åt båda hållen, kan läsas upp.

```js
{
  id: "spanska-v38", amne: "Spanska", titel: "Varifrån är du?", till: "2026-09-18",
  typ: "glosor", sprak: "es", riktning: "bak",     // valfritt: börja på Svenska → Spanska
  glosor: [
    { es:"el mar", sv:"havet", svAlt:["hav"] },
    { es:"tú",     sv:"du",    exakt:true }        // accenten måste vara rätt
  ]
}
```

`sprak` är språkkoden (`es`, `en`, `de`, `fr`) och styr både uppläsningen och vilket
fält som är det främmande språket – engelska glosor skrivs alltså `{ en:"dog", sv:"hund" }`.
`esAlt`/`svAlt` är extra svar som godkänns. Stora bokstäver, accenter och ¿?¡! spelar
ingen roll vid rättningen, utom om `exakt:true` – då måste accenterna sitta rätt.
`exakt:true` kan sättas på ett enskilt ord eller på hela läxan (bredvid `typ`).
Utan `exakt` godkänns ett svar som bara saknar accent, men rätt stavning visas
under "Rätt!"; med `exakt` blir det fel, men svaret märks som "Nästan!".

`riktning` är läget som är förvalt första gången: `"fram"` (språket → svenska),
`"bak"` (svenska → språket), `"mix"` eller `"lyssna"`. Sedan minns varje läxa
vilket läge som kördes senast. När svaret ska skrivas på språket visas en rad med
specialtecken ovanför svarsrutan (á é í ó ú ñ ü ¿ ¡ för spanska), så man slipper
byta tangentbord på mobilen.

**Frågor** – fråga och svar, bara åt ett håll. Funkar till det mesta: huvudstäder,
gångertabeller, årtal, begrepp.

```js
{
  id: "so-v38", amne: "SO", titel: "Nordens huvudstäder", till: "2026-09-18",
  typ: "fragor",
  fragor: [
    { q:"Vad heter Danmarks huvudstad?", a:"Köpenhamn", alt:["Kopenhamn"] }
  ]
}
```

**Plugga** – text att läsa eller lyssna på, och ett prov. Bra inför SO/NO-prov.

```js
{
  id: "so-v38-demokrati", amne: "SO", titel: "Demokrati och politik", till: "2026-09-25",
  typ: "plugga",
  stycken: [
    {
      rubrik: "Kommuner",
      text: [
        "Det finns 290 kommuner i Sverige. Några exempel är:",
        ["Skolor", "Bibliotek"],                       // lista = punktlista
        "Detta kallas *självstyre*",                   // *fet*, _kursiv_, ==gul markering==
        { bild:"riksdag" }                             // färdig bild: partier, riksdag, valsedlar
      ],                                               // eller { bild:{ src:"karta.png", alt:"..." } }
      ruta: "En faktaruta."                            // valfri
    }
  ],
  fragor: [
    { q:"Hur många kommuner finns det?", a:"290", fel:["21", "349", "100"] },
    { q:"Vilket parti har den här symbolen?", bild:"centerpartiet", a:"Centerpartiet", fel:["..."] }
  ]
}
```

Varje stycke blir ett eget kort med en högtalare som läser upp hela stycket (tryck
igen för att stoppa). Frågor med `fel` blir flerval där alternativen blandas varje
gång; utan `fel` skriver man svaret själv. `bild` på en fråga visar en partisymbol
(`centerpartiet`, `socialdemokraterna`, `liberalerna`, `sverigedemokraterna`,
`kristdemokraterna`, `moderaterna`, `miljopartiet`, `vansterpartiet`).
Har provet fler än 10 frågor finns även knappen "Öva på 10 slumpade frågor" –
de rundorna räknas som övning, inte som ett helt prov.

Partisymbolerna är partiernas egna symboler, sparade som `partier/<namn>.svg` och
beskurna till bara symbolen (utan partinamn):

| Fil | Källa |
|---|---|
| centerpartiet, liberalerna, moderaterna, vansterpartiet | Wikimedia Commons (`C_v1.svg`, `L_v1.svg`, `M_v1.svg`, `Vänsterpartiet_logo.svg`). Moderaternas blå är justerad till #1D3A90 efter loggan på moderaterna.se |
| kristdemokraterna | kristdemokraterna.se (`KD-logo-blue.svg`, samma fil som på Commons) |
| miljopartiet | mp.se (`logo-mobile.svg`) |
| socialdemokraterna | socialdemokraterna.se (rosen ur `S logga - Liggande Negativ.svg`) |
| sverigedemokraterna | blåsippan ur `Sweden_Democrats_logo_and_initials.svg` på engelska Wikipedia |

Byter ett parti symbol räcker det att ersätta filen.

**Uppgift** – något som ska göras och bockas av. `steg` och `lank` är valfria.

```js
{
  id: "matte-v38", amne: "Matte", titel: "Sidan 42–43", till: "2026-09-17",
  typ: "uppgift",
  text: "Gör uppgifterna och visa uträkningarna.",
  steg: ["Uppgift 1–4", "Uppgift 5–8"],
  lank: { text:"Filmen om bråk", url:"https://..." }
}
```

När `till` har passerat flyttas läxan ner under "Tidigare" på startsidan men går
fortfarande att öva på. Läxor som inte behövs kan tas bort helt; resultaten finns
kvar i adminvyn ändå. Byt inte `id` på en läxa som redan är igång, resultaten
kopplas via det.

Ämnet färgkodar kortet: Spanska blått, Engelska/Tyska/Franska grönt, Matte lila,
Svenska rött, SO/NO orange. Okända ämnen blir blå.

## 1. Lägg upp på Vercel

Pusha mappen till ett Git-repo och importera det på vercel.com/new. Framework preset: **Other**. Inga build-inställningar behövs.

Appen funkar direkt. Resultaten sparas då bara i Gustavs egen webbläsare, och adminvyn visar bara det som gjorts på just den enheten.

På telefonen: öppna sidan i Safari/Chrome och välj "Lägg till på hemskärmen", så får den egen ikon och öppnas utan webbläsarens adressfält.

## 2. Koppla på databasen

För att kunna se resultaten från din egen telefon:

1. I Vercel: projektet → **Storage** → **Create Database** → välj **Neon** (Postgres) från Marketplace. Gratisplanen räcker med marginal här.
2. Koppla databasen till projektet. Då sätts `DATABASE_URL` automatiskt. (Har du i stället skapat databasen direkt på neon.tech: lägg in dess connection string som `DATABASE_URL` under **Settings → Environment Variables**.)
3. Lägg till en egen variabel under **Settings → Environment Variables**:
   `ADMIN_PIN` = koden du vill använda till adminsidan.
4. Deploya om, så börjar rundorna sparas i molnet.

Adminsidan nås via den lilla Admin-länken längst ner på startsidan, eller direkt på `dinsajt.vercel.app/admin` (`vercel.json` med `cleanUrls` gör att `.html` inte behövs i adressen).

## Adminvyn visar

- Alla läxor med status: antal rundor, senaste och bästa resultat, eller när en uppgift bockades av
- Tryck på en läxa för detaljer: snitt, stapeldiagram över de 14 senaste rundorna,
  orden sorterade efter hur ofta de blir fel (med Gustavs faktiska felsvar) och varje runda för sig
- Rundor från den första versionen av appen (utan läxa) räknas till "Hälsningsfraser"

## Lyssna och öva uttal

Glosor läses upp med webbläsarens inbyggda talsyntes (Web Speech API) – inga tjänster, inga nycklar, ingen kostnad.

- Högtalaren vid varje ord i läxvyn, eller "Spela upp alla".
- **Lyssna → Svenska** som riktning i förhöret: ordet döljs och läses upp, man skriver den svenska betydelsen. Ord som låter lika (tu/tú) godkänner bådas svar.
- Högtalarknappen finns även i förhöret och i resultatlistan.

Rösten kommer från enheten. iPhone/iPad och Android har spanska röster inbyggda. På Windows behöver spanska läggas till under Inställningar → Tid och språk → Tal (eller använd Edge, som har egna röster).
