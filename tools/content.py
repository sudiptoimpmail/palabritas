# Palabritas content, v3.
# Grades: "prek" (ages 3-5), "k" (5-6), "g1" (6-7). A level's grade is the youngest grade that sees it.
# Level kinds: "w" words, "t" sight words (the picture is the written word), "s" sentences.
# Word:      (spanish, article, english, picture, pronunciation, flags)   flags: "x" = abstract (show English under picture)
# Sight:     (spanish, english, pronunciation)
# Sentence:  (spanish, english, picture, flags)  flags: "m"/"f" = only for a boy/girl, "age" = uses the child's age
#            "{N}" = the child's name, picture "a:" = the child's buddy, "{A}" = age
# picture: Fluent 3D emoji folder name, "#RRGGBB" swatch, "n:<number>"

def W(*items): return items

TOPICS = [
 dict(n="Saludos", en="Hello", icon="Waving hand", c="#E8507A", L=[
   dict(n="Primeras palabras", en="First words", g="prek", k="w", w=[
     ("hola","","hello","Smiling face with smiling eyes","OH-lah","x"),
     ("adiós","","goodbye","Waving hand","ah-DYOHS","x"),
     ("gracias","","thank you","Folded hands","GRAH-syahs","x"),
     ("por favor","","please","Pleading face","por fah-BOR","x"),
     ("sí","","yes","Thumbs up","SEE","x"),
     ("no","","no","Thumbs down","NOH","x")]),
   dict(n="Todo el día", en="All day", g="prek", k="w", w=[
     ("buenos días","","good morning","Sunrise","BWEH-nohs DEE-ahs","x"),
     ("buenas tardes","","good afternoon","Sun","BWEH-nahs TAR-dehs","x"),
     ("buenas noches","","good night","Night with stars","BWEH-nahs NOH-chehs","x"),
     ("te quiero","","I love you","Red heart","teh KYEH-roh","x"),
     ("bien","","good","OK hand","BYEHN","x"),
     ("de nada","","you're welcome","Hugging face","deh NAH-dah","x")]),
 ]),
 dict(n="Animales", en="Animals", icon="Dog face", c="#E07B00", L=[
   dict(n="Mascotas", en="Pets", g="prek", k="w", w=[
     ("perro","el","dog","Dog face","PEH-rroh",""),
     ("gato","el","cat","Cat face","GAH-toh",""),
     ("pájaro","el","bird","Bird","PAH-hah-roh",""),
     ("pez","el","fish","Tropical fish","PEHS",""),
     ("conejo","el","rabbit","Rabbit face","koh-NEH-hoh",""),
     ("ratón","el","mouse","Mouse face","rah-TOHN",""),
     ("tortuga","la","turtle","Turtle","tor-TOO-gah","")]),
   dict(n="La granja", en="Farm", g="prek", k="w", w=[
     ("caballo","el","horse","Horse face","kah-BAH-yoh",""),
     ("vaca","la","cow","Cow face","BAH-kah",""),
     ("cerdo","el","pig","Pig face","SEHR-doh",""),
     ("oveja","la","sheep","Ewe","oh-BEH-hah",""),
     ("cabra","la","goat","Goat","KAH-brah",""),
     ("gallina","la","hen","Chicken","gah-YEE-nah",""),
     ("pato","el","duck","Duck","PAH-toh","")]),
   dict(n="La selva", en="Wild", g="k", k="w", w=[
     ("león","el","lion","Lion","leh-OHN",""),
     ("tigre","el","tiger","Tiger face","TEE-greh",""),
     ("elefante","el","elephant","Elephant","eh-leh-FAHN-teh",""),
     ("mono","el","monkey","Monkey face","MOH-noh",""),
     ("jirafa","la","giraffe","Giraffe","hee-RAH-fah",""),
     ("cebra","la","zebra","Zebra","SEH-brah",""),
     ("oso","el","bear","Bear","OH-soh","")]),
   dict(n="El agua", en="Water", g="k", k="w", w=[
     ("delfín","el","dolphin","Dolphin","dehl-FEEN",""),
     ("ballena","la","whale","Spouting whale","bah-YEH-nah",""),
     ("tiburón","el","shark","Shark","tee-boo-ROHN",""),
     ("pulpo","el","octopus","Octopus","POOL-poh",""),
     ("pingüino","el","penguin","Penguin","peeng-GWEE-noh",""),
     ("cocodrilo","el","crocodile","Crocodile","koh-koh-DREE-loh",""),
     ("rana","la","frog","Frog","RAH-nah","")]),
   dict(n="Bosque y bichitos", en="Forest & bugs", g="g1", k="w", w=[
     ("lobo","el","wolf","Wolf","LOH-boh",""),
     ("zorro","el","fox","Fox","SOH-rroh",""),
     ("búho","el","owl","Owl","BOO-oh",""),
     ("serpiente","la","snake","Snake","sehr-PYEHN-teh",""),
     ("mariposa","la","butterfly","Butterfly","mah-ree-POH-sah",""),
     ("abeja","la","bee","Honeybee","ah-BEH-hah",""),
     ("hormiga","la","ant","Ant","or-MEE-gah",""),
     ("caracol","el","snail","Snail","kah-rah-KOHL","")]),
 ]),
 dict(n="Colores", en="Colors", icon="Artist palette", c="#7C5CD6", L=[
   dict(n="Colores vivos", en="Bright colors", g="prek", k="w", w=[
     ("rojo","","red","#E53935","ROH-hoh",""),
     ("azul","","blue","#1E6FD9","ah-SOOL",""),
     ("amarillo","","yellow","#FDD835","ah-mah-REE-yoh",""),
     ("verde","","green","#43A047","BEHR-deh",""),
     ("naranja","","orange","#FB8C00","nah-RAHN-hah","")]),
   dict(n="Más colores", en="More colors", g="prek", k="w", w=[
     ("morado","","purple","#8E44AD","moh-RAH-doh",""),
     ("rosa","","pink","#F06292","ROH-sah",""),
     ("marrón","","brown","#8D5524","mah-RROHN",""),
     ("negro","","black","#222222","NEH-groh",""),
     ("blanco","","white","#FFFFFF","BLAHN-koh",""),
     ("gris","","gray","#9E9E9E","GREES","")]),
 ]),
 dict(n="Números", en="Numbers", icon="Input numbers", c="#1C8C83", L=[
   dict(n="Del 0 al 10", en="0–10", g="prek", k="w", w=[
     ("cero","","zero","n:0","SEH-roh",""),("uno","","one","n:1","OO-noh",""),("dos","","two","n:2","DOHS",""),
     ("tres","","three","n:3","TREHS",""),("cuatro","","four","n:4","KWAH-troh",""),("cinco","","five","n:5","SEEN-koh",""),
     ("seis","","six","n:6","SAYS",""),("siete","","seven","n:7","SYEH-teh",""),("ocho","","eight","n:8","OH-choh",""),
     ("nueve","","nine","n:9","NWEH-beh",""),("diez","","ten","n:10","DYEHS","")]),
   dict(n="Del 11 al 20", en="11–20", g="k", k="w", w=[
     ("once","","eleven","n:11","OHN-seh",""),("doce","","twelve","n:12","DOH-seh",""),("trece","","thirteen","n:13","TREH-seh",""),
     ("catorce","","fourteen","n:14","kah-TOR-seh",""),("quince","","fifteen","n:15","KEEN-seh",""),
     ("dieciséis","","sixteen","n:16","dyeh-see-SAYS",""),("diecisiete","","seventeen","n:17","dyeh-see-SYEH-teh",""),
     ("dieciocho","","eighteen","n:18","dyeh-SYOH-choh",""),("diecinueve","","nineteen","n:19","dyeh-see-NWEH-beh",""),
     ("veinte","","twenty","n:20","BAYN-teh","")]),
   dict(n="Decenas", en="Tens to 100", g="g1", k="w", w=[
     ("treinta","","thirty","n:30","TRAYN-tah",""),("cuarenta","","forty","n:40","kwah-REHN-tah",""),
     ("cincuenta","","fifty","n:50","seen-KWEHN-tah",""),("sesenta","","sixty","n:60","seh-SEHN-tah",""),
     ("setenta","","seventy","n:70","seh-TEHN-tah",""),("ochenta","","eighty","n:80","oh-CHEHN-tah",""),
     ("noventa","","ninety","n:90","noh-BEHN-tah",""),("cien","","one hundred","n:100","SYEHN","")]),
 ]),
 dict(n="Comida", en="Food", icon="Red apple", c="#D9453B", L=[
   dict(n="Para empezar", en="Basics", g="prek", k="w", w=[
     ("manzana","la","apple","Red apple","mahn-SAH-nah",""),
     ("plátano","el","banana","Banana","PLAH-tah-noh",""),
     ("agua","el","water","Droplet","AH-gwah",""),
     ("leche","la","milk","Glass of milk","LEH-cheh",""),
     ("pan","el","bread","Bread","PAHN",""),
     ("huevo","el","egg","Egg","WEH-boh",""),
     ("queso","el","cheese","Cheese wedge","KEH-soh","")]),
   dict(n="Frutas y dulces", en="Fruit & treats", g="prek", k="w", w=[
     ("galleta","la","cookie","Cookie","gah-YEH-tah",""),
     ("fresa","la","strawberry","Strawberry","FREH-sah",""),
     ("uvas","las","grapes","Grapes","OO-bahs",""),
     ("sandía","la","watermelon","Watermelon","sahn-DEE-ah",""),
     ("zanahoria","la","carrot","Carrot","sah-nah-OH-ryah",""),
     ("helado","el","ice cream","Soft ice cream","eh-LAH-doh","")]),
   dict(n="A comer", en="Mealtime", g="k", k="w", w=[
     ("pollo","el","chicken","Poultry leg","POH-yoh",""),
     ("arroz","el","rice","Cooked rice","ah-RROHS",""),
     ("sopa","la","soup","Pot of food","SOH-pah",""),
     ("jugo","el","juice","Beverage box","HOO-goh",""),
     ("tomate","el","tomato","Tomato","toh-MAH-teh",""),
     ("pizza","la","pizza","Pizza","PEET-sah",""),
     ("pastel","el","cake","Birthday cake","pahs-TEHL",""),
     ("sándwich","el","sandwich","Sandwich","SAHND-weech","")]),
 ]),
 dict(n="Familia", en="Family", icon="Baby", c="#2F80ED", L=[
   dict(n="Mi casa", en="Close family", g="prek", k="w", w=[
     ("mamá","la","mom","Woman","mah-MAH",""),
     ("papá","el","dad","Man","pah-PAH",""),
     ("bebé","el","baby","Baby","beh-BEH",""),
     ("hermano","el","brother","Boy","ehr-MAH-noh",""),
     ("hermana","la","sister","Girl","ehr-MAH-nah",""),
     ("familia","la","family","Smiling face with hearts","fah-MEE-lyah","x")]),
   dict(n="Familia grande", en="Big family", g="k", k="w", w=[
     ("abuelo","el","grandpa","Old man","ah-BWEH-loh",""),
     ("abuela","la","grandma","Old woman","ah-BWEH-lah",""),
     ("tío","el","uncle","Man beard","TEE-oh",""),
     ("tía","la","aunt","Woman curly hair","TEE-ah",""),
     ("primo","el","cousin","Child","PREE-moh",""),
     ("amigo","el","friend","Handshake","ah-MEE-goh","x")]),
 ]),
 dict(n="El cuerpo", en="Body", icon="Raised hand", c="#B04CA8", L=[
   dict(n="La cara y más", en="Face & hands", g="prek", k="w", w=[
     ("ojo","el","eye","Eye","OH-hoh",""),
     ("nariz","la","nose","Nose","nah-REES",""),
     ("boca","la","mouth","Mouth","BOH-kah",""),
     ("oreja","la","ear","Ear","oh-REH-hah",""),
     ("mano","la","hand","Raised hand","MAH-noh",""),
     ("pie","el","foot","Foot","PYEH","")]),
   dict(n="Todo el cuerpo", en="Whole body", g="k", k="w", w=[
     ("diente","el","tooth","Tooth","DYEHN-teh",""),
     ("lengua","la","tongue","Tongue","LEHN-gwah",""),
     ("dedo","el","finger","Index pointing up","DEH-doh",""),
     ("brazo","el","arm","Flexed biceps","BRAH-soh",""),
     ("pierna","la","leg","Leg","PYEHR-nah",""),
     ("corazón","el","heart","Anatomical heart","koh-rah-SOHN","")]),
 ]),
 dict(n="Mi mundo", en="My world", icon="House", c="#3B9B4F", L=[
   dict(n="En casa", en="At home", g="prek", k="w", w=[
     ("casa","la","house","House with garden","KAH-sah",""),
     ("cama","la","bed","Bed","KAH-mah",""),
     ("silla","la","chair","Chair","SEE-yah",""),
     ("puerta","la","door","Door","PWEHR-tah",""),
     ("libro","el","book","Closed book","LEE-broh",""),
     ("pelota","la","ball","Soccer ball","peh-LOH-tah",""),
     ("juguete","el","toy","Teddy bear","hoo-GEH-teh","")]),
   dict(n="Afuera", en="Outside", g="prek", k="w", w=[
     ("sol","el","sun","Sun with face","SOHL",""),
     ("luna","la","moon","Full moon face","LOO-nah",""),
     ("estrella","la","star","Star","ehs-TREH-yah",""),
     ("árbol","el","tree","Deciduous tree","AHR-bohl",""),
     ("flor","la","flower","Tulip","FLOR",""),
     ("nube","la","cloud","Cloud","NOO-beh",""),
     ("lluvia","la","rain","Cloud with rain","YOO-byah","")]),
   dict(n="La ropa", en="Clothes", g="k", k="w", w=[
     ("camisa","la","shirt","T-shirt","kah-MEE-sah",""),
     ("pantalones","los","pants","Jeans","pahn-tah-LOH-nehs",""),
     ("vestido","el","dress","Dress","behs-TEE-doh",""),
     ("zapatos","los","shoes","Running shoe","sah-PAH-tohs",""),
     ("calcetines","los","socks","Socks","kahl-seh-TEE-nehs",""),
     ("gorra","la","cap","Billed cap","GOH-rrah",""),
     ("abrigo","el","coat","Coat","ah-BREE-goh",""),
     ("bufanda","la","scarf","Scarf","boo-FAHN-dah","")]),
   dict(n="¡Vámonos!", en="Going places", g="k", k="w", w=[
     ("carro","el","car","Automobile","KAH-rroh",""),
     ("autobús","el","bus","Bus","ow-toh-BOOS",""),
     ("tren","el","train","Locomotive","TREHN",""),
     ("avión","el","airplane","Airplane","ah-BYOHN",""),
     ("barco","el","boat","Sailboat","BAR-koh",""),
     ("bicicleta","la","bike","Bicycle","bee-see-KLEH-tah","")]),
   dict(n="En la escuela", en="At school", g="g1", k="w", w=[
     ("escuela","la","school","School","ehs-KWEH-lah",""),
     ("maestra","la","teacher","Woman teacher","mah-EHS-trah",""),
     ("lápiz","el","pencil","Pencil","LAH-pees",""),
     ("crayón","el","crayon","Crayon","krah-YOHN",""),
     ("mochila","la","backpack","Backpack","moh-CHEE-lah",""),
     ("tijeras","las","scissors","Scissors","tee-HEH-rahs",""),
     ("cuaderno","el","notebook","Notebook","kwah-DEHR-noh","")]),
 ]),
 dict(n="¡Acción!", en="Actions", icon="Person running", c="#0E8FA8", L=[
   dict(n="¡A moverse!", en="Let's move", g="prek", k="w", w=[
     ("corre","","run!","Person running","KOH-rreh",""),
     ("salta","","jump!","Kangaroo","SAHL-tah",""),
     ("baila","","dance!","Woman dancing","BAI-lah",""),
     ("camina","","walk!","Person walking","kah-MEE-nah",""),
     ("aplaude","","clap!","Clapping hands","ah-PLOW-deh",""),
     ("nada","","swim!","Person swimming","NAH-dah","")]),
   dict(n="Todos los días", en="Every day", g="prek", k="w", w=[
     ("come","","eat!","Fork and knife with plate","KOH-meh",""),
     ("bebe","","drink!","Cup with straw","BEH-beh",""),
     ("duerme","","sleep!","Sleeping face","DWEHR-meh",""),
     ("canta","","sing!","Microphone","KAHN-tah",""),
     ("lee","","read!","Open book","LEH-eh",""),
     ("juega","","play!","Kite","HWEH-gah","")]),
   dict(n="Más acciones", en="More actions", g="k", k="w", w=[
     ("escribe","","write!","Writing hand","ehs-KREE-beh",""),
     ("pinta","","paint!","Paintbrush","PEEN-tah",""),
     ("cocina","","cook!","Cook","koh-SEE-nah",""),
     ("ríe","","laugh!","Face with tears of joy","REE-eh",""),
     ("llora","","cry!","Crying face","YOH-rah",""),
     ("trepa","","climb!","Person climbing","TREH-pah","")]),
 ]),
 dict(n="Frases", en="Sentences", icon="Speech balloon", c="#C2410C", k="s", L=[
   dict(n="Hola, yo soy", en="About me", g="prek", k="s", w=[
     ("¡Hola! Yo soy {N}.","Hi! I am {N}.","a:",""),
     ("Me llamo {N}.","My name is {N}.","a:",""),
     ("Soy un niño.","I am a boy.","Boy","m"),
     ("Soy una niña.","I am a girl.","Girl","f"),
     ("Tengo {A} años.","I am {A} years old.","n:{A}","age"),
     ("Estoy feliz.","I am happy.","Grinning face",""),
     ("¡Adiós, amigo!","Bye, friend!","Waving hand","")]),
   dict(n="¿Cómo estás?", en="How are you?", g="prek", k="s", w=[
     ("Estoy bien.","I am fine.","OK hand",""),
     ("Estoy triste.","I am sad.","Crying face",""),
     ("Tengo hambre.","I am hungry.","Face savoring food",""),
     ("Tengo sed.","I am thirsty.","Cup with straw",""),
     ("Tengo sueño.","I am sleepy.","Yawning face",""),
     ("Tengo frío.","I am cold.","Cold face",""),
     ("Tengo calor.","I am hot.","Hot face","")]),
   dict(n="Palabras: yo · tú · él · ella", en="Reading words", g="k", k="t", w=[
     ("yo","I","YOH"),("tú","you","TOO"),("él","he","EHL"),("ella","she","EH-yah"),
     ("soy","I am","SOY"),("eres","you are","EH-rehs"),("es","he / she is","EHS")]),
   dict(n="Mi familia", en="My family", g="prek", k="s", w=[
     ("Él es mi papá.","He is my dad.","Man",""),
     ("Ella es mi mamá.","She is my mom.","Woman",""),
     ("Él es mi hermano.","He is my brother.","Boy",""),
     ("Ella es mi hermana.","She is my sister.","Girl",""),
     ("Ella es mi abuela.","She is my grandma.","Old woman",""),
     ("Tú eres mi amigo.","You are my friend.","Handshake",""),
     ("Es un perro.","It is a dog.","Dog face","")]),
   dict(n="Palabras: nosotros · ellos · y", en="Reading words", g="k", k="t", w=[
     ("nosotros","we","noh-SOH-trohs"),("ellos","they","EH-yohs"),("somos","we are","SOH-mohs"),
     ("son","they are","SOHN"),("y","and","EE"),("mi","my","MEE"),("mis","my (more than one)","MEES")]),
   dict(n="Nosotros", en="We and they", g="k", k="s", w=[
     ("Somos una familia.","We are a family.","Smiling face with hearts",""),
     ("Nosotros somos amigos.","We are friends.","Handshake",""),
     ("Ellos son mis abuelos.","They are my grandparents.","Old man",""),
     ("Ellos son gatos.","They are cats.","Cat face",""),
     ("Mamá y papá son grandes.","Mom and Dad are big.","Woman",""),
     ("El perro y el gato son amigos.","The dog and the cat are friends.","Dog face","")]),
   dict(n="Me gusta, quiero", en="I like, I want", g="prek", k="s", w=[
     ("Me gusta la pizza.","I like pizza.","Pizza",""),
     ("Me gusta el helado.","I like ice cream.","Soft ice cream",""),
     ("Quiero agua.","I want water.","Droplet",""),
     ("Quiero leche, por favor.","I want milk, please.","Glass of milk",""),
     ("Tengo un perro.","I have a dog.","Dog face",""),
     ("Tengo un gato.","I have a cat.","Cat face",""),
     ("Quiero jugar.","I want to play.","Kite","")]),
   dict(n="Palabras: un · una · el · la", en="Reading words", g="k", k="t", w=[
     ("un","a (boy word)","OON"),("una","a (girl word)","OO-nah"),("el","the (boy word)","EHL"),("la","the (girl word)","LAH"),
     ("tengo","I have","TEHN-goh"),("quiero","I want","KYEH-roh"),("me gusta","I like","meh GOOS-tah")]),
   dict(n="¿Cómo es?", en="What is it like?", g="k", k="s", w=[
     ("El sol es amarillo.","The sun is yellow.","Sun with face",""),
     ("La manzana es roja.","The apple is red.","Red apple",""),
     ("La rana es verde.","The frog is green.","Frog",""),
     ("El elefante es grande.","The elephant is big.","Elephant",""),
     ("El ratón es pequeño.","The mouse is small.","Mouse face",""),
     ("La jirafa es alta.","The giraffe is tall.","Giraffe","")]),
   dict(n="Mi día", en="My day", g="k", k="s", w=[
     ("Me levanto.","I get up.","Alarm clock",""),
     ("Me lavo las manos.","I wash my hands.","Soap",""),
     ("Desayuno.","I eat breakfast.","Pancakes",""),
     ("Voy a la escuela.","I go to school.","School",""),
     ("Juego con mis amigos.","I play with my friends.","Soccer ball",""),
     ("Me cepillo los dientes.","I brush my teeth.","Toothbrush",""),
     ("Me voy a dormir.","I go to sleep.","Person in bed","")]),
   dict(n="Preguntas", en="Questions", g="g1", k="s", w=[
     ("¿Cómo te llamas?","What is your name?","Thinking face",""),
     ("¿Cómo estás?","How are you?","Smiling face with smiling eyes",""),
     ("¿Cuántos años tienes?","How old are you?","Birthday cake",""),
     ("¿Qué es esto?","What is this?","Red question mark",""),
     ("¿Dónde está el gato?","Where is the cat?","Magnifying glass tilted left",""),
     ("¿Quieres jugar?","Do you want to play?","Basketball","")]),
 ]),
]
AGES = [3,4,5,6,7,8]
AVATARS = ["Lion","Fox","Rabbit face","Penguin","Owl","Frog","Tiger face","Monkey face","Bear","Giraffe","Unicorn","Panda"]
GRADES = dict(
  prek=dict(label="Pre-K", ages="Ages 3–5", round=5, choices=3, spell=0, build=0, pairs=3, scale=1.25,
            prog=dict(minQ=5, up=dict(ft=.8, mis=.2, n=2), down=dict(ft=.3, mis=.6, n=3))),
  k=dict(label="Kindergarten", ages="Ages 5–6", round=6, choices=3, spell=5, build=4, pairs=4, scale=1.15,
            prog=dict(minQ=5, up=dict(ft=.8, mis=.2, n=2), down=dict(ft=.4, mis=.5, n=3))),
  g1=dict(label="1st Grade", ages="Ages 6–7", round=8, choices=4, spell=9, build=7, pairs=6, scale=1.0,
            prog=dict(minQ=6, up=dict(ft=.8, mis=.2, n=2), down=dict(ft=.4, mis=.5, n=2))),
)
