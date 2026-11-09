import json,re,hashlib,unicodedata
D=json.load(open("data3.json"))
def key(t): return re.sub(r"\s+"," ",re.sub(r"[¡!¿?.,;:]"," ",t.lower())).strip()
def slug(t,lang):
    a=unicodedata.normalize("NFKD",t).encode("ascii","ignore").decode().lower()
    a=re.sub(r"[^a-z0-9]+","-",a).strip("-")[:40] or "x"
    return (f"en-{a}-{hashlib.md5((lang+t).encode()).hexdigest()[:6]}.mp3" if lang=="en" else f"{a}-{hashlib.md5(t.encode()).hexdigest()[:6]}.mp3")
ES_AGE={3:"tres",4:"cuatro",5:"cinco",6:"seis",7:"siete",8:"ocho"}
EN_AGE={3:"three",4:"four",5:"five",6:"six",7:"seven",8:"eight"}
LETTERS={"a":"a","b":"be","c":"ce","d":"de","e":"e","f":"efe","g":"ge","h":"hache","i":"i","j":"jota","k":"ka","l":"ele","m":"eme","n":"ene","ñ":"eñe","o":"o","p":"pe","q":"cu","r":"erre","s":"ese","t":"te","u":"u","v":"uve","w":"uve doble","x":"equis","y":"ye","z":"zeta"}
ES_PHRASES=["¡Muy bien!","¡Excelente!","¡Fantástico!","¡Genial!","¡Bravo!","¡Increíble!","¡Lo hiciste!","¡Nuevo nivel!","¡Superestrella!","¡Buen intento!","¡Otra vez!","¡Hola!","¡Hola! Vamos a aprender español.","¡Hola! El perro, el gato, la manzana."]
EN_PHRASES=["Listen, then tap the picture.","Listen, then tap the word.","Find two that match.","Match the picture and the word.","Match the Spanish and the English.","Spell the word.","Put the words in order.","Try again!","Look carefully, and try again!","This part is for grown-ups.","Tap the house to go back.","Keep playing to unlock this level.","Say it with me, three times!","Tap a word to hear it.","Let's play!","Practice time!","Wow! Awesome job!","Great job!","Good try!","Level up!","And a new sticker!","Who is learning today?","Here is a hint.","Let's practice the level before a bit more.","PIN saved!","It means","Now you say it!","Let's learn some Spanish!"]
EN_NUM=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"]
for i,n in enumerate(EN_NUM): EN_PHRASES.append(f"You got {n} star{'s' if i!=1 else ''}.")
es,en={},{}
def add(M,lang,text,speed):
    for part in text.split("{N}"):
        k=key(part)
        if k and k not in M: M[k]=[part.strip(),speed,slug(k,lang)]
def variants(text,ages):
    return [text.replace("{A}",ages[a]) for a in ages] if "{A}" in text else [text]
for t in D["TOPICS"]:
    add(es,"es",t["n"],0.9)
    for L in t["L"]:
        for w in L["w"]:
            full=(w["a"]+" " if w["a"] else "")+w["es"]
            for v in variants(full,ES_AGE):
                add(es,"es",v,0.85 if L["k"]=="s" else 0.9)
                if L["k"]=="s":
                    for tok in v.split(" "):
                        if "{N}" not in tok: add(es,"es",re.sub(r"[¡!¿?.,]","",tok),0.85)
            if L["k"]!="s": add(es,"es",w["es"],0.9)
            for v in variants(w["en"],EN_AGE): add(en,"en",v,0.95)
for l in set(LETTERS.values()): add(es,"es",l,0.9)
for p in ES_PHRASES: add(es,"es",p,0.95)
for p in EN_PHRASES: add(en,"en",p,1.0)
json.dump({"es":es,"en":en},open("cliplist3.json","w"),ensure_ascii=False,indent=0)
json.dump(LETTERS,open("letters.json","w"),ensure_ascii=False)
json.dump({"es":ES_AGE,"en":EN_AGE},open("ages.json","w"))
print("es",len(es),"en",len(en))
