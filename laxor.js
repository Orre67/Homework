/* ==========================================================================
   Gustavs läxor – det här är den enda filen som behöver ändras varje vecka.

   Varje läxa är ett objekt i listan LAXOR. Gemensamma fält:

     id     kort unikt namn, t.ex. "spanska-v38". Resultaten sparas under det
            namnet, så byt inte id på en läxa som redan är igång.
     amne   ämnet som visas på kortet ("Spanska", "Matte", "SO", ...).
     titel  rubrik.
     till   sista dag, "ÅÅÅÅ-MM-DD". Valfritt. När dagen har passerat flyttas
            läxan ner under "Tidigare" – den går fortfarande att öva på.
     typ    "glosor", "fragor", "plugga", "klocka", "karta" eller "uppgift".
            Exempel på alla finns i README.md.

   Läxor som inte längre behövs kan tas bort helt. Resultaten i adminvyn
   finns kvar ändå.
   ========================================================================== */

const LAXOR = [

  /* ---- Glosor: ord som förhörs åt båda hållen -----------------------------
     sprak   språkkod: "es" spanska, "en" engelska, "de" tyska, "fr" franska.
             Styr uppläsningen och vilket fält som är det främmande språket.
     glosor  { es:"hola", sv:"hej", esAlt:["..."], svAlt:["..."] }
             esAlt/svAlt är fler svar som också godkänns. Stora/små bokstäver,
             accenter och ¿?¡! spelar ingen roll vid rättningen – utom om
             exakt:true, då måste accenterna vara rätt (bra för par som tu/tú).
  --------------------------------------------------------------------------- */
  {
    id: "spanska-v41",
    amne: "Spanska",
    titel: "Min familj",
    till: "2026-10-09",
    typ: "glosor",
    sprak: "es",
    glosor: [
      { es:"soy español",    sv:"jag är spanjor",          esAlt:["soy española"], svAlt:["jag är spansk"] },
      { es:"mis padres",     sv:"mina föräldrar" },
      { es:"mis hermanos",   sv:"mina syskon/bröder",      svAlt:["mina syskon","mina bröder"] },
      { es:"mis abuelos",    sv:"mina mor-/farföräldrar",  svAlt:["mina morföräldrar","mina farföräldrar","mina mor/farföräldrar",
                                                                    "mina far/morföräldrar","mina mor- och farföräldrar","mina far- och morföräldrar"] },
      { es:"tengo",          sv:"jag har" },
      { es:"bailar",         sv:"dansa",                   svAlt:["att dansa"] },
      { es:"tiene",          sv:"hon/han har",             svAlt:["han har","hon har","han/hon har"] },
      { es:"hermana mayor",  sv:"storasyster",             esAlt:["la hermana mayor","mi hermana mayor"], svAlt:["stor syster","äldre syster"] },
      { es:"blanco",         sv:"vit",                     esAlt:["blanca"], svAlt:["vitt"] },
      { es:"negro",          sv:"svart",                   esAlt:["negra"] }
    ]
  },

  {
    id: "spanska-v42",
    amne: "Spanska",
    titel: "Familj och fritid",
    till: "2026-10-16",
    typ: "glosor",
    sprak: "es",
    glosor: [
      { es:"años",               sv:"år",                  exakt:true },   /* ñ måste vara med – anos är ett annat ord */
      { es:"trabajar",           sv:"arbeta",              svAlt:["att arbeta","jobba","att jobba"] },
      { es:"también",            sv:"också",               svAlt:["även"] },
      { es:"primo",              sv:"kusin",               esAlt:["prima","el primo"] },
      { es:"en mi tiempo libre", sv:"på min fritid",       svAlt:["på fritiden","på min lediga tid","på min fri tid"] },
      { es:"tío",                sv:"morbror/farbror",     esAlt:["el tío"], svAlt:["morbror","farbror","farbror/morbror","morbror eller farbror","farbror eller morbror"] },
      { es:"hijos",              sv:"barn",                esAlt:["los hijos"], svAlt:["barnen","söner"] },
      { es:"estar con amigos",   sv:"att vara med vänner", svAlt:["vara med vänner","att vara med kompisar","vara med kompisar","att umgås med vänner","umgås med vänner"] },
      { es:"viajar",             sv:"resa",                svAlt:["att resa"] },
      { es:"hermano menor",      sv:"lillebror",           esAlt:["el hermano menor","mi hermano menor"], svAlt:["lille bror","yngre bror","lillebrorsa","min lillebror"] }
    ]
  },

  /* ---- Klocka: dra visarna så att klockan visar rätt tid ------------------
     antal   hur många klockslag per omgång (5 som standard)
     former  vilka slags klockslag som kommer: "hel" (Klockan 5), "over"
             (Kvart över 5), "halv" (Halv 6), "i" (Kvart i 6).
             Utelämnad = alla fyra.
     timmar  vilka timmar som kan komma, och där timvisaren snäpper.
             Utelämnad = alla tolv.
     minuter var minutvisaren snäpper. Utelämnad = de minuter som formerna
             behöver (0, 15, 30, 45). Nästa nivå: [0,5,10,15,...,55].
     Klockslagen lottas fram på nytt varje gång, så det blir nya frågor.
  --------------------------------------------------------------------------- */
  {
    id: "klockan-elsa",
    amne: "Matte",
    titel: "Klockan – hel, halv och kvart",
    typ: "klocka",
    antal: 5,
    former: ["hel", "over", "halv", "i"]
  },

  /* ---- Karta: världsdelar, hav, floder och städer på en världskarta -------
     platser  vilka platser som ska övas. Utelämnad = alla. Det finns:
                världsdelar: nordamerika, sydamerika, europa, asien, afrika,
                             oceanien, antarktis
                hav:         stilla-havet, atlanten, indiska-oceanen,
                             norra-ishavet, antarktiska-oceanen
                floder:      mississippi, amazonfloden, nilen, indus, chang-jiang
                städer:      se PLATSER i index.html (new-york, kairo, moskva ...)
     Man väljer själv mellan att peka ut platsen på kartan och att skriva
     namnet på den plats som lyser gult (eller blandat).
     Städer visas som prickar (svart = obligatorisk, grå = extra). Har läxan
     städer från flera världsdelar kan man öva på en världsdel i taget eller
     på hela världen.
  --------------------------------------------------------------------------- */
  {
    id: "geografi-v42-stader",
    amne: "Geografi",
    titel: "Städer i världen – obligatoriska",
    till: "2026-10-20",
    typ: "karta",
    platser: [
      "new-york", "los-angeles", "mexico-city", "brasilia", "rio-de-janeiro",
      "buenos-aires", "kairo", "nairobi", "kapstaden", "canberra", "sydney", "wellington",
      "moskva", "bagdad", "teheran", "new-delhi", "beijing", "seoul", "tokyo"
    ]
  },

  {
    id: "geografi-v42-stader-extra",
    amne: "Geografi",
    titel: "Städer i världen – extra",
    till: "2026-10-20",
    typ: "karta",
    platser: [
      "vancouver", "toronto", "ottawa", "san-francisco", "washington", "caracas", "lagos",
      "pretoria", "johannesburg", "melbourne", "st-petersburg", "kabul", "xian",
      "pyongyang", "riyadh", "bombay", "bangkok"
    ]
  },

  {
    id: "geografi-v42-stader-alla",
    amne: "Geografi",
    titel: "Städer i världen – blandat",
    till: "2026-10-20",
    typ: "karta",
    platser: [
      "new-york", "los-angeles", "mexico-city", "brasilia", "rio-de-janeiro",
      "buenos-aires", "kairo", "nairobi", "kapstaden", "canberra", "sydney", "wellington",
      "moskva", "bagdad", "teheran", "new-delhi", "beijing", "seoul", "tokyo", "vancouver",
      "toronto", "ottawa", "san-francisco", "washington", "caracas", "lagos", "pretoria",
      "johannesburg", "melbourne", "st-petersburg", "kabul", "xian", "pyongyang", "riyadh",
      "bombay", "bangkok"
    ]
  }

  /* ---- Plugga: text att läsa eller lyssna på + ett prov --------------------
     stycken  ett kort per rubrik. Varje stycke har:
                rubrik  rubriken (blir understruken, som i papperet)
                text    en lista där varje del är antingen
                          "vanlig text"         → ett textstycke
                          ["punkt","punkt"]     → en punktlista
                          { bild:"partier" }    → en färdig bild. Det finns
                                                  "partier", "riksdag" och
                                                  "valsedlar". En egen bildfil
                                                  läggs in som
                                                  { bild:{ src:"bild.png", alt:"..." } }
                ruta    valfri faktaruta (de inramade rutorna i papperet)
              I texten betyder *stjärnor* fetstil, _understreck_ kursiv stil
              och ==lika med== gul överstrykning.
              Högtalaren vid rubriken läser upp hela stycket.

     fragor   provet. { q:"fråga", a:"rätt svar", fel:["fel","fel","fel"] }
              blir en flervalsfråga – svarsalternativen blandas varje gång.
              Utan fel-listan får man skriva svaret själv (som typ "fragor").
              bild:"centerpartiet" visar en partisymbol ovanför frågan.
  --------------------------------------------------------------------------- */

];
