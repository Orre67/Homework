/* ==========================================================================
   Gustavs läxor – det här är den enda filen som behöver ändras varje vecka.

   Varje läxa är ett objekt i listan LAXOR. Gemensamma fält:

     id     kort unikt namn, t.ex. "spanska-v38". Resultaten sparas under det
            namnet, så byt inte id på en läxa som redan är igång.
     amne   ämnet som visas på kortet ("Spanska", "Matte", "SO", ...).
     titel  rubrik.
     till   sista dag, "ÅÅÅÅ-MM-DD". Valfritt. När dagen har passerat flyttas
            läxan ner under "Tidigare" – den går fortfarande att öva på.
     typ    "glosor", "fragor", "plugga" eller "uppgift".
            Exempel på alla fyra finns i README.md.

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
    id: "spanska-v38",
    amne: "Spanska",
    titel: "Varifrån är du?",
    till: "2026-09-18",
    typ: "glosor",
    sprak: "es",
    glosor: [
      { es:"¿De dónde eres?",  sv:"Varifrån är du?", svAlt:["var kommer du ifrån","varifrån kommer du","var är du ifrån"] },
      { es:"soy...",           sv:"jag är..." },
      { es:"soy de",           sv:"jag är ifrån",    svAlt:["jag är från","jag kommer från","jag kommer ifrån"] },
      { es:"se llama",         sv:"den heter",       svAlt:["han heter","hon heter","det heter"] },
      { es:"¿Cómo te llamas?", sv:"Vad heter du?" },
      { es:"me llamo",         sv:"jag heter" },
      { es:"el mar",           sv:"havet",           svAlt:["hav"] },
      { es:"amigos",           sv:"vänner",          esAlt:["los amigos"], svAlt:["kompisar","vänner/kompisar"] },
      { es:"tu",               sv:"ditt/din",        exakt:true, svAlt:["din","ditt","dina","din/ditt"] },
      { es:"tú",               sv:"du",              exakt:true }
    ]
  },

  {
    id: "spanska-v39",
    amne: "Spanska",
    titel: "Siffrorna 0–20",
    till: "2026-09-25",
    typ: "glosor",
    sprak: "es",
    riktning: "bak",          /* börjar på Svenska → Spanska */
    exakt: true,              /* accenterna måste sitta rätt: dieciséis */
    glosor: [
      { es:"cero",        sv:"noll" },
      { es:"uno",         sv:"ett",     svAlt:["en"] },
      { es:"dos",         sv:"två" },
      { es:"tres",        sv:"tre" },
      { es:"cuatro",      sv:"fyra" },
      { es:"cinco",       sv:"fem" },
      { es:"seis",        sv:"sex" },
      { es:"siete",       sv:"sju" },
      { es:"ocho",        sv:"åtta" },
      { es:"nueve",       sv:"nio" },
      { es:"diez",        sv:"tio" },
      { es:"once",        sv:"elva" },
      { es:"doce",        sv:"tolv" },
      { es:"trece",       sv:"tretton" },
      { es:"catorce",     sv:"fjorton" },
      { es:"quince",      sv:"femton" },
      { es:"dieciséis",   sv:"sexton" },
      { es:"diecisiete",  sv:"sjutton" },
      { es:"dieciocho",   sv:"arton",   svAlt:["aderton"] },
      { es:"diecinueve",  sv:"nitton" },
      { es:"veinte",      sv:"tjugo" }
    ]
  },

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
  {
    id: "so-v38-demokrati",
    amne: "SO",
    titel: "Demokrati och politik",
    till: "2026-09-25",
    typ: "plugga",
    stycken: [
      {
        rubrik: "Diktatur",
        text: [
          "I diktaturer är det en enda person eller en liten grupp människor som bestämmer. Personen som leder landet kallas *diktator*.",
          "Invånarna är ofta fattiga och de har mycket liten möjlighet att påverka samhället. Diktatorn är ändå rädd för att medborgarna ska göra uppror och styr dem:",
          [
            "Det finns inga fria val – om man får rösta kan diktatorn fuska med resultatet.",
            "Diktatorn använder militär och polis för att skrämma befolkningen till lydnad."
          ]
        ],
        ruta: "Sverige har varit en diktatur. För 200 år sedan hade kungen all makt i landet."
      },
      {
        rubrik: "Demokrati",
        text: [
          "Demokrati betyder *folkstyre*. I en demokrati får folket vara med och bestämma. Medborgarna har samma rättigheter (t ex att gå i skolan) och samma skyldigheter (t ex att betala skatt).",
          [
            "Det finns *fria val*. Det betyder att alla får rösta precis som de vill.",
            "Alla människor är lika mycket värda.",
            "*Majoriteten* bestämmer.",
            "Valen är hemliga - ingen annan kan ta reda på hur du röstat."
          ]
        ],
        ruta: "Det dröjde ända till 1921 innan kvinnorna fick rösta i Sverige."
      },
      {
        rubrik: "Direkt demokrati",
        text: [
          "…innebär att väljarna fattar beslut själva. Exempel på det är folkomröstning eller röstning i klassen (t ex _klassråd_)."
        ]
      },
      {
        rubrik: "Representativ demokrati",
        text: [
          "…innebär att man låter någon annan (en representant) fatta beslut åt sig. Exempel: inom politiken och på skolans _elevråd_."
        ]
      },
      {
        rubrik: "Kommuner",
        text: [
          "Det finns 290 kommuner i Sverige. Man fattar beslut i kommunfullmäktige. De beslutar inom många frågor. Några exempel är:",
          ["Skolor", "Bibliotek", "Vatten och avlopp", "Idrottsanläggningar"],
          "De lokala politikerna känner bättre till området än riksdagen och styr därför bättre själva. Detta kallas *självstyre*"
        ]
      },
      {
        rubrik: "Regioner",
        text: [
          "Det finns 21 regioner i Sverige. Regionerna beslutar om:",
          ["Vården (sjukvård och tandvård)", "Kollektivtrafik (bussar och tåg) inom regionen"]
        ]
      },
      {
        rubrik: "Riksdag",
        text: [
          "Riksdagen har mest makt i Sverige. Där beslutar man om ==lagar== och regler, militären och polisen och de ser till att regeringen gör sitt jobb.",
          "I Sveriges riksdag arbetar 349 politiker. De kallas ledamöter. När man hade 350 ledamöter kunde det bli oavgjort när man röstade. Man behöver majoriteten av rösterna för att besluta något.",
          { bild: "riksdag" }
        ]
      },
      {
        rubrik: "Regering",
        text: [
          "Statsministern leder arbetet i regeringen. Till sin hjälp har hen ministrar. Exempel på arbetsuppgifter:",
          ["Ta fram förslag på nya lagar eller annat.", "Se till att besluten i riksdagen genomförs."]
        ]
      },
      {
        rubrik: "Politiska partier",
        text: [
          { bild: "partier" },
          "Alla politiska partier får inte vara med i riksdagen. För att komma in i riksdagen måste ett parti få minst *fyra procent* av rösterna i valet. Regeln finns för att arbetet i riksdagen ska gå lättare.",
          "Hur många röster partiet får i valet bestämmer hur många platser de får i riksdagen. För att sedan få igenom det de vill, måste partierna kompromissa. Ingen får precis som de vill."
        ]
      },
      {
        rubrik: "Valet",
        text: [
          "Den andra söndagen i september vart fjärde år röstar Sverige om vilka som ska bestämma i riksdagen, regionerna och kommunerna.",
          "I Sverige har vi *hemliga val*. Vi får rösta på vem vi vill och vi behöver inte berätta detta för någon. För att ingen ska se vad vi väljer står vi ensamma bakom skärmar.",
          { bild: "valsedlar" }
        ]
      }
    ],

    fragor: [
      { q:"Vad är en diktatur?",
        a:"Ett land där en enda person eller en liten grupp bestämmer",
        fel:["Ett land där folket röstar fram sina politiker",
             "Ett land som inte har någon kung eller drottning",
             "Ett land där alla partier får vara med i riksdagen"] },

      { q:"Vad är en diktator?",
        a:"Personen som ensam leder landet",
        fel:["En politiker som folket har röstat fram",
             "Chefen för riksdagen",
             "Den som räknar rösterna i ett val"] },

      { q:"Hur är det att leva i en diktatur?",
        a:"Invånarna är ofta fattiga och kan knappt påverka samhället",
        fel:["Alla är lika mycket värda och får rösta som de vill",
             "Man får säga precis vad man tycker om ledaren",
             "Folket bestämmer vilka lagar som ska gälla"] },

      { q:"Vad är en demokrati?",
        a:"Folkstyre – folket får vara med och bestämma",
        fel:["Att en liten grupp bestämmer åt alla andra",
             "Att kungen har all makt i landet",
             "Att militären och polisen styr landet"] },

      { q:"Vad innebär fria val?",
        a:"Alla får rösta precis som de vill",
        fel:["Att det är gratis att rösta",
             "Att bara vuxna som jobbar får rösta",
             "Att ledaren väljer åt folket"] },

      { q:"Hur är det att leva i en demokrati?",
        a:"Alla är lika mycket värda och har samma rättigheter och skyldigheter",
        fel:["Ingen behöver gå i skolan eller betala skatt",
             "Man måste berätta för andra vad man röstat på",
             "En liten grupp bestämmer över alla andra"] },

      { q:"Vad är direkt demokrati?",
        a:"Väljarna fattar besluten själva",
        fel:["Man låter en representant fatta beslut åt sig",
             "Riksdagen bestämmer allt i landet",
             "Kungen fattar besluten åt folket"] },

      { q:"Ge exempel på när direkt demokrati används.",
        a:"Folkomröstning eller röstning i klassen, t ex klassråd",
        fel:["Elevrådet på skolan", "Riksdagen", "Kommunfullmäktige"] },

      { q:"Vad är representativ demokrati?",
        a:"Man låter någon annan fatta beslut åt sig",
        fel:["Väljarna röstar själva om varje fråga",
             "Bara politiker får rösta i valet",
             "Militären bestämmer åt folket"] },

      { q:"Ge exempel på när representativ demokrati används.",
        a:"Inom politiken och på skolans elevråd",
        fel:["Folkomröstning",
             "Klassråd där hela klassen röstar",
             "När familjen röstar om vad man ska äta"] },

      { q:"Vad bestämmer kommunen över?",
        a:"Skolor, bibliotek, vatten och avlopp och idrottsanläggningar",
        fel:["Sjukvården och kollektivtrafiken",
             "Militären och polisen",
             "Lagarna som gäller i hela Sverige"] },

      { q:"Vad är självstyre?",
        a:"Att kommunerna får styra över sitt eget område själva",
        fel:["Att riksdagen bestämmer allt i landet",
             "Att varje person bestämmer helt över sig själv",
             "Att regeringen styr kommunerna"] },

      { q:"Varför finns självstyre?",
        a:"De lokala politikerna känner till området bättre än riksdagen",
        fel:["För att riksdagen inte vill bestämma",
             "För att kungen ska slippa bestämma",
             "För att det ska finnas fler politiker"] },

      { q:"Vad bestämmer regionen över?",
        a:"Vården och kollektivtrafiken inom regionen",
        fel:["Skolor och bibliotek",
             "Lagar och regler i Sverige",
             "Vatten och avlopp"] },

      { q:"Vad bestämmer riksdagen över?",
        a:"Lagar och regler, militären och polisen",
        fel:["Skolor och bibliotek i kommunen",
             "Sjukvården och tandvården",
             "Bussar och tåg i regionen"] },

      { q:"Hur många platser finns det i riksdagen?",
        a:"349", fel:["350", "290", "21"] },

      { q:"Varför finns det ett udda antal platser i riksdagen?",
        a:"Annars kan det bli oavgjort när ledamöterna röstar",
        fel:["För att alla kommuner ska få en plats var",
             "För att det finns 349 partier",
             "För att partierna ska behöva kompromissa"] },

      { q:"Vad är det för skillnad på ledamöter och ministrar?",
        a:"Ledamöterna sitter i riksdagen, ministrarna i regeringen",
        fel:["Ledamöterna sitter i regeringen, ministrarna i riksdagen",
             "Det är ingen skillnad, orden betyder samma sak",
             "Ledamöterna bestämmer i kommunen, ministrarna i regionen"] },

      { q:"Vad gör regeringen?",
        a:"Tar fram förslag på nya lagar och genomför riksdagens beslut",
        fel:["Beslutar om alla lagar i Sverige",
             "Räknar rösterna i valet",
             "Bestämmer över skolorna i kommunen"] },

      { q:"Är riksdagen eller regeringen mäktigast i Sverige? Motivera!",
        a:"Riksdagen – den beslutar om lagarna och ser till att regeringen sköter sitt jobb",
        fel:["Regeringen – statsministern bestämmer mest av alla",
             "De är precis lika mäktiga",
             "Kungen – han har fortfarande all makt"] },

      { q:"Hur många partier finns det i riksdagen?",
        a:"Åtta", fel:["Fyra", "Sex", "Tolv"] },

      { q:"Vilket parti har den här symbolen?", bild:"centerpartiet",
        a:"Centerpartiet", fel:["Miljöpartiet", "Socialdemokraterna", "Liberalerna"] },

      { q:"Vems symbol är det här?", bild:"socialdemokraterna",
        a:"Socialdemokraterna", fel:["Vänsterpartiet", "Moderaterna", "Sverigedemokraterna"] },

      { q:"Vilket parti hör den här symbolen till?", bild:"sverigedemokraterna",
        a:"Sverigedemokraterna", fel:["Miljöpartiet", "Liberalerna", "Centerpartiet"] },

      { q:"Vilket partis symbol är det här?", bild:"miljopartiet",
        a:"Miljöpartiet", fel:["Centerpartiet", "Sverigedemokraterna", "Kristdemokraterna"] },

      { q:"Vad innebär 4%-spärren?",
        a:"Ett parti måste få minst fyra procent av rösterna för att komma in i riksdagen",
        fel:["Fyra procent av ledamöterna måste rösta likadant",
             "Minst fyra procent av väljarna måste rösta i valet",
             "Ett nytt parti får bara fyra procent av platserna"] },

      { q:"Varför finns 4%-spärren?",
        a:"För att arbetet i riksdagen ska gå lättare",
        fel:["För att små partier inte ska få rösta i valet",
             "För att det ska bli fler partier i riksdagen",
             "För att spara pengar åt staten"] },

      { q:"Hur ofta har vi val i Sverige?",
        a:"Vart fjärde år, den andra söndagen i september",
        fel:["Varje år i september",
             "Vartannat år på våren",
             "Vart femte år i juni"] },

      { q:"Vilka tre val röstar man i på valdagen?",
        a:"Riksdagsvalet, regionvalet och kommunalvalet",
        fel:["Riksdagsvalet, kungavalet och skolvalet",
             "Bara riksdagsvalet",
             "Riksdagsvalet, regeringsvalet och partivalet"] },

      { q:"Vad innebär det att vi har hemliga val?",
        a:"Vi behöver inte berätta för någon vad vi röstat på",
        fel:["Ingen får veta när valet ska hållas",
             "Bara vissa utvalda personer får rösta",
             "Regeringen räknar rösterna i hemlighet"] },

      { q:"Varför har vi hemliga val tror du?",
        a:"För att ingen ska kunna tvinga eller påverka hur man röstar",
        fel:["För att det går snabbare att räkna rösterna",
             "För att man ska kunna rösta flera gånger",
             "För att partierna ska slippa göra reklam"] }
    ]
  }

];
