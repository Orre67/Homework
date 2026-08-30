# Glosförhör – spanska

Statisk sida + en liten API-funktion. Inga byggsteg, inga npm-paket.

```
index.html        förhöret (det Gustav använder)
admin.html        resultatvyn, ligger på /admin
api/results.js    sparar och hämtar rundor
```

## 1. Lägg upp på Vercel

Pusha mappen till ett Git-repo och importera det på vercel.com/new. Framework preset: **Other**. Inga build-inställningar behövs.

(Snabbvarianten är att dra mappen till vercel.com/drop, men varje drop skapar ett nytt projekt med ny URL, så det passar bara för en engångstitt.)

Förhöret funkar direkt. Resultaten sparas då bara i Gustavs egen webbläsare, och adminvyn visar bara det som gjorts på just den enheten.

## 2. Koppla på databasen

För att kunna se resultaten från din egen telefon:

1. I Vercel: projektet → **Storage** → **Create Database** → välj **Neon** (Postgres) från Marketplace. Gratisplanen räcker med marginal här.
2. Koppla databasen till projektet. Då sätts `DATABASE_URL` automatiskt. (Har du i stället skapat databasen direkt på neon.tech: lägg in dess connection string som `DATABASE_URL` under **Settings → Environment Variables**.)
3. Lägg till en egen variabel under **Settings → Environment Variables**:
   `ADMIN_PIN` = koden du vill använda till adminsidan.
4. Deploya om, så börjar rundorna sparas i molnet.

Adminsidan ligger på `dinsajt.vercel.app/admin`. Den är inte länkad från förhöret.

## Adminvyn visar

- Antal rundor, snittresultat och senaste resultatet
- Stapeldiagram över de 14 senaste rundorna
- Alla ord sorterade efter hur ofta de blir fel, med Gustavs faktiska felsvar
- Varje runda för sig, utfällbar med exakt vilka ord som gick fel

## Lyssna och öva uttal

Orden kan läsas upp på spanska med webbläsarens inbyggda talsyntes (Web Speech API) – inga tjänster, inga nycklar, ingen kostnad.

- **Öva uttal** på startsidan: alla ord i en lista, tryck på högtalaren för att höra ordet, eller "Spela upp alla".
- **Lyssna → Svenska** som riktning i förhöret: ordet döljs och läses upp, man skriver den svenska betydelsen.
- Högtalarknappen finns även vid spanska ord i förhöret och i resultatlistan.

Rösten kommer från enheten. iPhone/iPad och Android har spanska röster inbyggda. På Windows behöver spanska läggas till under Inställningar → Tid och språk → Tal (eller använd Edge, som har egna röster).

## Byta glosor

Listan `GLOSOR` ligger högst upp i `<script>`-taggen i `index.html`:

```js
{ es:"hola", sv:"hej", esAlt:[], sv0:["hejsan"] }
```

`esAlt` och `sv0` är extra svar som också godkänns. Accenter och stora bokstäver spelar ingen roll, det sköter rättningen själv.

Historiken följer glosorna via det spanska ordet, så gamla rundor finns kvar för ord som är med även nästa vecka.
