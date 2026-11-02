import json,re,hashlib,unicodedata
TOP=json.loads(open("data.js").read()[len("const TOPICS="):-1])
def key(t): return re.sub(r"\s+"," ",re.sub(r"[¡!¿?.,;:]"," ",t.lower())).strip()
def slug(t):
    a=unicodedata.normalize("NFKD",t).encode("ascii","ignore").decode().lower()
    a=re.sub(r"[^a-z0-9]+","-",a).strip("-")[:40] or "x"
    return f"{a}-{hashlib.md5(t.encode()).hexdigest()[:6]}"
LETTERS={"a":"a","b":"be","c":"ce","d":"de","e":"e","f":"efe","g":"ge","h":"hache","i":"i","j":"jota","k":"ka","l":"ele","m":"eme","n":"ene","ñ":"eñe","o":"o","p":"pe","q":"cu","r":"erre","s":"ese","t":"te","u":"u","v":"uve","w":"uve doble","x":"equis","y":"ye","z":"zeta"}
PHRASES=["¡Muy bien!","¡Excelente!","¡Fantástico!","¡Genial!","¡Bravo!","¡Increíble!","¡Lo hiciste!","¡Nuevo nivel!","¡Superestrella!","¡Buen intento!","¡Otra vez!",
 "¡Hola! Vamos a aprender español.","¡Hola! El perro, el gato, la manzana.","¿Quién juega?"]
items=[]  # (text, speed)
for t in TOP:
    items.append((t["n"],0.9))
    for L in t["L"]:
        for w in L["w"]:
            if t.get("k")=="s":
                for part in re.split(r"\{N\}",w[0]):
                    if key(part): items.append((part.strip(),0.85))
                for tok in w[0].split(" "):
                    if "{N}" not in tok: items.append((re.sub(r"[¡!¿?.,]","",tok),0.85))
            else:
                items.append(((w[1]+" " if w[1] else "")+w[0],0.9))
for n in sorted(set(LETTERS.values())): items.append((n,0.9))
for p in PHRASES: items.append((p,0.95))
seen={};
for text,sp in items:
    k=key(text)
    if k and k not in seen: seen[k]=(text,sp)
json.dump({k:[v[0],v[1],slug(k)+".mp3"] for k,v in seen.items()},open("cliplist.json","w"),ensure_ascii=False,indent=0)
json.dump(LETTERS,open("letters.json","w"),ensure_ascii=False)
print(len(seen),"clips")
