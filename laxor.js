/* ==========================================================================
   Gustavs läxor – det här är den enda filen som behöver ändras varje vecka.

   Varje läxa är ett objekt i listan LAXOR. Gemensamma fält:

     id     kort unikt namn, t.ex. "spanska-v38". Resultaten sparas under det
            namnet, så byt inte id på en läxa som redan är igång.
     amne   ämnet som visas på kortet ("Spanska", "Matte", "SO", ...).
     titel  rubrik.
     till   sista dag, "ÅÅÅÅ-MM-DD". Valfritt. När dagen har passerat flyttas
            läxan ner under "Tidigare" – den går fortfarande att öva på.
     typ    "glosor", "fragor" eller "uppgift". Exempel på alla tre finns i README.md.

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
  }

];
