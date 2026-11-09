import sys,json,re,os,io,urllib.parse,urllib.request
sys.path.insert(0,".")
import content as C
from PIL import Image
IMG="../img"
def slug(n): return re.sub(r"[^a-z0-9]+","-",n.lower()).strip("-")
paths=[l.strip() for l in open("paths3d.txt")]
byname={}
for p in paths: byname.setdefault(p.split("/")[1].lower(),p)
need=set()
def pc(p):
    if p.startswith(("#","n:","a:")): return p
    need.add(p); return "i:"+slug(p)
out=[]
for t in C.TOPICS:
    need.add(t["icon"])
    T={"n":t["n"],"en":t["en"],"i":slug(t["icon"]),"c":t["c"],"L":[]}
    for L in t["L"]:
        items=[]
        for w in L["w"]:
            if L["k"]=="w": items.append({"es":w[0],"a":w[1],"en":w[2],"p":pc(w[3]),"pr":w[4],**({"x":1} if "x" in w[5] else {})})
            elif L["k"]=="t": items.append({"es":w[0],"a":"","en":w[1],"p":"t:"+w[0],"pr":w[2],"x":1})
            else:
                d={"es":w[0],"a":"","en":w[1],"p":pc(w[2]) if w[2]!="n:{A}" else "n:{A}","pr":""}
                if w[3] in("m","f"): d["sx"]=w[3]
                if w[3]=="age": d["age"]=1
                items.append(d)
        T["L"].append({"n":L["n"],"en":L["en"],"g":L["g"],"k":L["k"],"w":items})
    out.append(T)
for a in C.AVATARS: need.add(a)
miss=[n for n in need if n.lower() not in byname]
assert not miss,miss
got=0
for n in sorted(need):
    f=f"{IMG}/{slug(n)}.webp"
    if os.path.exists(f): continue
    p=byname[n.lower()]
    im=Image.open(io.BytesIO(urllib.request.urlopen("https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/"+urllib.parse.quote(p),timeout=60).read())).convert("RGBA")
    im.thumbnail((192,192),Image.LANCZOS);im.save(f,"WEBP",quality=82,method=6);got+=1
json.dump({"TOPICS":out,"GRADES":C.GRADES,"AGES":C.AGES,"AVATARS":[slug(a) for a in C.AVATARS]},open("data3.json","w"),ensure_ascii=False,separators=(",",":"))
n=sum(len(L["w"]) for t in out for L in t["L"])
print("downloaded",got,"| items",n,"| levels",sum(len(t["L"]) for t in out))
for g in ["prek","k","g1"]:
    gi=["prek","k","g1"].index(g)
    lv=[L for t in out for L in t["L"] if ["prek","k","g1"].index(L["g"])<=gi]
    print(g,"levels",len(lv),"items",sum(len(L["w"]) for L in lv))
