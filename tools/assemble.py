import json,sys,os
PACKJS=open('pack.json').read() if os.environ.get('PACKMODE')=='1' else 'null'
D=json.load(open("data3.json"));L=json.load(open("cliplist3.json"))
clips={lang:{k:v[2] for k,v in L[lang].items()} for lang in L}
ages=json.load(open("ages.json"))
js=open("../src/app.js").read().replace("/*DATA*/",json.dumps(D,ensure_ascii=False,separators=(",",":"))).replace("/*CLIPS*/",json.dumps(clips,ensure_ascii=False,separators=(",",":"))).replace("/*LETTERS*/",open("letters.json").read()).replace("/*AGES*/",json.dumps(ages)).replace("/*PACK*/",PACKJS)
head='<title>Palabritas</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800;900&display=swap">\n'
html=head+"<style>\n"+open("../src/app.css").read()+"</style>\n\n"+open("../src/body.html").read()+"\n<script>\n"+js+"\n</script>\n"
open("../preview.html","w").write(html)
pass
print(len(html)//1024,"KB")
