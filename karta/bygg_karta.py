"""
Bygger världskartan till läxtypen "karta": karta/varld.js (vektorer) och
karta/relief.webp (färgerna med berg och slätter).

Behöver bara köras om kartan ska göras om. Kräver Python med shapely och
Pillow, plus följande filer från Natural Earth (public domain) i samma mapp
som skriptet körs från:

  ne_50m_admin_0_countries.geojson        github.com/nvkelso/natural-earth-vector
  ne_50m_rivers_lake_centerlines.geojson  (mappen geojson/)
  HYP_50M_SR_W.tif                        naturalearthdata.com, 50m raster
                                          "Cross Blended Hypso with Shaded Relief"

  python bygg_karta.py <mapp-med-filerna> <karta-mappen>

Projektionen är Miller (som i skolböckernas världskartor), Atlanten i mitten.
"""
import json, math, sys
from shapely.geometry import shape, Polygon, MultiPolygon, LineString, MultiLineString, box
from shapely.ops import unary_union, linemerge
from PIL import Image, ImageEnhance

SRC, OUT = sys.argv[1], sys.argv[2]
Image.MAX_IMAGE_PIXELS = None

W = 1000                       # kartans bredd i SVG-enheter (360 grader)
NORR, SYD = 84.0, -74.0        # latituder som kartan visar

def miller(lat):
    f = math.radians(lat)
    return math.degrees(1.25 * math.log(math.tan(math.pi / 4 + 0.4 * f)))

Y0, Y1 = miller(NORR), miller(SYD)
H = round((Y0 - Y1) * W / 360)

def xy(lon, lat):
    lat = max(min(lat, 89.0), -89.0)
    return ((lon + 180) * W / 360, (Y0 - miller(lat)) * W / 360)

def fmt(v):
    s = ("%.1f" % v).rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s

def ring_d(coords):
    pts = [xy(*c[:2]) for c in coords]
    out, last = [], None
    for x, y in pts:
        p = (fmt(x), fmt(y))
        if p != last:
            out.append(p)
            last = p
    if len(out) < 3:
        return ""
    return "M" + "L".join(a + " " + b for a, b in out) + "Z"

def poly_d(g):
    polys = g.geoms if isinstance(g, MultiPolygon) else [g]
    d = ""
    for p in polys:
        d += ring_d(p.exterior.coords)
        for r in p.interiors:
            d += ring_d(r.coords)
    return d

def line_d(g):
    lines = g.geoms if isinstance(g, MultiLineString) else [g]
    d = ""
    for ln in lines:
        pts = [xy(*c[:2]) for c in ln.coords]
        d += "M" + "L".join(fmt(x) + " " + fmt(y) for x, y in pts)
    return d

def load(name):
    with open(SRC + "/" + name, encoding="utf8") as f:
        return json.load(f)["features"]

# ---------- Världsdelarna ----------
KONT = {"North America": "nordamerika", "South America": "sydamerika", "Europe": "europa",
        "Asia": "asien", "Africa": "afrika", "Oceania": "oceanien", "Antarctica": "antarktis"}
SJU_HAV = {"Maldives": "asien", "S. Geo. and the Is.": "antarktis", "Fr. S. Antarctic Lands": "antarktis",
           "Heard I. and McDonald Is.": "antarktis"}

# Europeiska Ryssland: väster om Uralbergen och Uralfloden, norr om Kaukasus.
EUROPA_RYSSLAND = Polygon([(-10, 40), (40, 40), (47, 44), (51.9, 47), (51.4, 51.2), (58.5, 51.2),
                           (59.2, 55), (59, 60), (60, 64), (66, 68), (66.5, 69.5), (68, 77), (70, 85), (-10, 85)])

def delar(g):
    return list(g.geoms) if isinstance(g, MultiPolygon) else [g]

def kontinent_for(namn, kont, part):
    c = part.representative_point()
    if namn == "Russia":
        return "europa" if EUROPA_RYSSLAND.contains(c) else "asien"
    if namn == "France":            # Franska Guyana, Réunion, Karibien
        if c.x < -30:
            return "sydamerika" if c.y < 10 else "nordamerika"
        if c.x > 40:
            return "afrika"
    if namn == "United States of America" and c.x < -150 and c.y < 30:
        return "oceanien"           # Hawaii
    if namn in SJU_HAV:
        return SJU_HAV[namn]
    if kont.startswith("Seven"):
        return "afrika"
    return KONT[kont]

bitar = {k: [] for k in KONT.values()}
for f in load("ne_50m_admin_0_countries.geojson"):
    p = f["properties"]
    g = shape(f["geometry"]).buffer(0)
    for part in delar(g):
        if p["NAME"] == "Russia":
            eu, asi = part.intersection(EUROPA_RYSSLAND), part.difference(EUROPA_RYSSLAND)
            if not eu.is_empty: bitar["europa"].append(eu)
            if not asi.is_empty: bitar["asien"].append(asi)
            continue
        bitar[kontinent_for(p["NAME"], p["CONTINENT"], part)].append(part)

ram = box(-180, SYD - 2, 180, 90)
land = {}
for k, lista in bitar.items():
    g = unary_union(lista).buffer(0.02).buffer(-0.02)       # sluter glipor mellan länder
    g = g.intersection(ram).simplify(0.06, preserve_topology=True)
    g = MultiPolygon([p for p in delar(g) if p.area > 0.25 or k == "oceanien" and p.area > 0.08])
    land[k] = g

# Streckad gräns mellan Europa och Asien, som i skolkartan
ural = land["europa"].buffer(0.05).boundary.intersection(land["asien"].buffer(0.05))
ural = linemerge(ural) if not ural.is_empty else ural
ural = ural.simplify(0.1)
ural_lines = [l for l in (ural.geoms if hasattr(ural, "geoms") else [ural]) if l.length > 3]

# ---------- Haven ----------
ATL_VAST = [(-67, -60), (-67, -54), (-70, -50), (-70, -20), (-75, 0), (-77.3, 8.3), (-80.5, 8.8),
            (-84, 10), (-90, 15), (-95, 17.5), (-100, 25), (-100, 66)]
ATL_OST = [(20, -60), (20, -34.5), (30, 0), (32.3, 30), (32.3, 31.5), (36, 37), (43, 42), (44, 47),
           (55, 60), (60, 66)]
IND_OST = [(100, 25), (99, 15), (99, 10), (102, 3), (104, 1.3), (105, -6), (110, -7.5), (125, -9),
           (132, -13), (146, -40), (147, -60)]
IND_NORR = [(32.3, 30), (38, 30), (60, 35), (75, 35), (100, 25)]
ARKTIS = [(-180, 66), (-40, 66), (-40, 70), (25, 70), (25, 66), (180, 66)]

atlanten = Polygon(ATL_VAST + [(-40, 66), (-40, 70), (25, 70), (25, 66)] + ATL_OST[::-1])
indiska = Polygon([(20, -60), (20, -34.5), (30, 0)] + IND_NORR + IND_OST)
stilla = MultiPolygon([
    Polygon([(100, 66), (180, 66), (180, -60)] + IND_OST[::-1] + [(100, 66)]),
    Polygon([(-180, 66)] + ATL_VAST[::-1] + [(-180, -60)]),
])
norra = Polygon(ARKTIS + [(180, 90), (-180, 90)])
sodra = box(-180, -89, 180, -60)

hav = {"stilla-havet": stilla, "atlanten": atlanten, "indiska-oceanen": indiska,
       "norra-ishavet": norra, "antarktiska-oceanen": sodra}
for k in hav:
    hav[k] = hav[k].intersection(box(-180, SYD - 5, 180, NORR + 5))

# ---------- Floderna ----------
FLOD = {"mississippi": ["Mississippi"], "amazonfloden": ["Amazonas"], "nilen": ["Nile"],
        "indus": ["Indus"], "chang-jiang": ["Chang Jiang", "Yangtze"]}
floder = {}
for f in load("ne_50m_rivers_lake_centerlines.geojson"):
    n = f["properties"].get("name")
    for k, namn in FLOD.items():
        if n in namn:
            floder.setdefault(k, []).append(shape(f["geometry"]))
for k in floder:
    g = unary_union(floder[k])
    if isinstance(g, MultiLineString):
        g = linemerge(g)
    floder[k] = g.simplify(0.05)

# ---------- Reliefbilden ----------
# HYP_50M_SR_W: 10800 x 5400, 30 px per grad, från 90N. Vi läser om raderna
# till Miller-projektionen och gör färgerna lite gladare (grönare slätter,
# tydligare berg). Bilden klipps mot landkonturerna i appen.
img = Image.open(SRC + "/HYP_50M_SR_W.tif").convert("RGB")
PX = 2000
ut_w, ut_h = PX, round(PX * H / W)
bred = img.resize((ut_w, img.height), Image.LANCZOS)
ut = Image.new("RGB", (ut_w, ut_h))
for r in range(ut_h):
    ym = Y0 - (r + 0.5) / ut_h * (Y0 - Y1)
    lat = math.degrees((math.atan(math.exp(math.radians(ym) / 1.25)) - math.pi / 4) / 0.4)
    src_r = min(max(int((90 - lat) * 30), 0), img.height - 1)
    ut.paste(bred.crop((0, src_r, ut_w, src_r + 1)), (0, r))
ut = ImageEnhance.Contrast(ImageEnhance.Color(ut).enhance(1.45)).enhance(1.12)
ut.save(OUT + "/relief.webp", quality=78, method=6)

# ---------- Skriv varld.js ----------
data = {
    "w": W, "h": H,
    "land": {k: poly_d(g) for k, g in land.items()},
    "hav": {k: poly_d(g) for k, g in hav.items()},
    "floder": {k: line_d(g) for k, g in floder.items()},
    "ural": "".join(line_d(l) for l in ural_lines),
    "proj": {"norr": NORR, "syd": SYD},
}
with open(OUT + "/varld.js", "w", encoding="utf8") as f:
    f.write("/* Världskartan till läxtypen karta. Genererad av bygg_karta.py från Natural Earth\n"
            "   (public domain). Ändra inte för hand. */\n")
    f.write("window.VARLD = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
print("H", H, {k: len(v) for k, v in data["land"].items()}, {k: len(v) for k, v in data["floder"].items()})
