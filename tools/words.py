# Topic -> levels -> words. Each word: (spanish, article, english, picture, pronunciation)
# picture: Fluent 3D folder name, "#hex" colour swatch, or "n:<number>"
TOPICS = [
 ("Saludos", "Hello", "Waving hand", [
   ("Primeras palabras", "First words", [
     ("hola","","hello","Smiling face with smiling eyes","OH-lah"),
     ("adiós","","goodbye","Waving hand","ah-DYOHS"),
     ("gracias","","thank you","Folded hands","GRAH-syahs"),
     ("por favor","","please","Pleading face","por fah-BOR"),
     ("sí","","yes","Thumbs up","SEE"),
     ("no","","no","Thumbs down","NOH")]),
   ("Todo el día", "All day", [
     ("buenos días","","good morning","Sunrise","BWEH-nohs DEE-ahs"),
     ("buenas tardes","","good afternoon","Sun","BWEH-nahs TAR-dehs"),
     ("buenas noches","","good night","Night with stars","BWEH-nahs NOH-chehs"),
     ("te quiero","","I love you","Red heart","teh KYEH-roh"),
     ("bien","","good","OK hand","BYEHN"),
     ("de nada","","you're welcome","Hugging face","deh NAH-dah")]),
 ]),
 ("Animales", "Animals", "Dog face", [
   ("Mascotas", "Pets", [
     ("perro","el","dog","Dog face","PEH-rroh"),
     ("gato","el","cat","Cat face","GAH-toh"),
     ("pájaro","el","bird","Bird","PAH-hah-roh"),
     ("pez","el","fish","Tropical fish","PEHS"),
     ("conejo","el","rabbit","Rabbit face","koh-NEH-hoh"),
     ("ratón","el","mouse","Mouse face","rah-TOHN"),
     ("tortuga","la","turtle","Turtle","tor-TOO-gah")]),
   ("La granja", "Farm", [
     ("caballo","el","horse","Horse face","kah-BAH-yoh"),
     ("vaca","la","cow","Cow face","BAH-kah"),
     ("cerdo","el","pig","Pig face","SEHR-doh"),
     ("oveja","la","sheep","Ewe","oh-BEH-hah"),
     ("cabra","la","goat","Goat","KAH-brah"),
     ("gallina","la","hen","Chicken","gah-YEE-nah"),
     ("pato","el","duck","Duck","PAH-toh")]),
   ("La selva", "Wild", [
     ("león","el","lion","Lion","leh-OHN"),
     ("tigre","el","tiger","Tiger face","TEE-greh"),
     ("elefante","el","elephant","Elephant","eh-leh-FAHN-teh"),
     ("mono","el","monkey","Monkey face","MOH-noh"),
     ("jirafa","la","giraffe","Giraffe","hee-RAH-fah"),
     ("cebra","la","zebra","Zebra","SEH-brah"),
     ("oso","el","bear","Bear","OH-soh")]),
   ("El agua", "Water", [
     ("delfín","el","dolphin","Dolphin","dehl-FEEN"),
     ("ballena","la","whale","Spouting whale","bah-YEH-nah"),
     ("tiburón","el","shark","Shark","tee-boo-ROHN"),
     ("pulpo","el","octopus","Octopus","POOL-poh"),
     ("pingüino","el","penguin","Penguin","peeng-GWEE-noh"),
     ("cocodrilo","el","crocodile","Crocodile","koh-koh-DREE-loh"),
     ("rana","la","frog","Frog","RAH-nah")]),
   ("Bosque y bichitos", "Forest & bugs", [
     ("lobo","el","wolf","Wolf","LOH-boh"),
     ("zorro","el","fox","Fox","SOH-rroh"),
     ("búho","el","owl","Owl","BOO-oh"),
     ("serpiente","la","snake","Snake","sehr-PYEHN-teh"),
     ("mariposa","la","butterfly","Butterfly","mah-ree-POH-sah"),
     ("abeja","la","bee","Honeybee","ah-BEH-hah"),
     ("hormiga","la","ant","Ant","or-MEE-gah"),
     ("caracol","el","snail","Snail","kah-rah-KOHL")]),
 ]),
 ("Colores", "Colors", "Artist palette", [
   ("Colores vivos", "Bright colors", [
     ("rojo","","red","#E53935","ROH-hoh"),
     ("azul","","blue","#1E6FD9","ah-SOOL"),
     ("amarillo","","yellow","#FDD835","ah-mah-REE-yoh"),
     ("verde","","green","#43A047","BEHR-deh"),
     ("naranja","","orange","#FB8C00","nah-RAHN-hah")]),
   ("Más colores", "More colors", [
     ("morado","","purple","#8E44AD","moh-RAH-doh"),
     ("rosa","","pink","#F06292","ROH-sah"),
     ("marrón","","brown","#8D5524","mah-RROHN"),
     ("negro","","black","#222222","NEH-groh"),
     ("blanco","","white","#FFFFFF","BLAHN-koh"),
     ("gris","","gray","#9E9E9E","GREES")]),
 ]),
 ("Números", "Numbers", "Input numbers", [
   ("Del 0 al 10", "0–10", [
     ("cero","","zero","n:0","SEH-roh"),("uno","","one","n:1","OO-noh"),("dos","","two","n:2","DOHS"),
     ("tres","","three","n:3","TREHS"),("cuatro","","four","n:4","KWAH-troh"),("cinco","","five","n:5","SEEN-koh"),
     ("seis","","six","n:6","SAYS"),("siete","","seven","n:7","SYEH-teh"),("ocho","","eight","n:8","OH-choh"),
     ("nueve","","nine","n:9","NWEH-beh"),("diez","","ten","n:10","DYEHS")]),
   ("Del 11 al 20", "11–20", [
     ("once","","eleven","n:11","OHN-seh"),("doce","","twelve","n:12","DOH-seh"),("trece","","thirteen","n:13","TREH-seh"),
     ("catorce","","fourteen","n:14","kah-TOR-seh"),("quince","","fifteen","n:15","KEEN-seh"),
     ("dieciséis","","sixteen","n:16","dyeh-see-SAYS"),("diecisiete","","seventeen","n:17","dyeh-see-SYEH-teh"),
     ("dieciocho","","eighteen","n:18","dyeh-SYOH-choh"),("diecinueve","","nineteen","n:19","dyeh-see-NWEH-beh"),
     ("veinte","","twenty","n:20","BAYN-teh")]),
   ("Decenas", "Tens to 100", [
     ("diez","","ten","n:10","DYEHS"),("veinte","","twenty","n:20","BAYN-teh"),("treinta","","thirty","n:30","TRAYN-tah"),
     ("cuarenta","","forty","n:40","kwah-REHN-tah"),("cincuenta","","fifty","n:50","seen-KWEHN-tah"),
     ("sesenta","","sixty","n:60","seh-SEHN-tah"),("setenta","","seventy","n:70","seh-TEHN-tah"),
     ("ochenta","","eighty","n:80","oh-CHEHN-tah"),("noventa","","ninety","n:90","noh-BEHN-tah"),
     ("cien","","one hundred","n:100","SYEHN")]),
 ]),
 ("Comida", "Food", "Red apple", [
   ("Para empezar", "Basics", [
     ("manzana","la","apple","Red apple","mahn-SAH-nah"),
     ("plátano","el","banana","Banana","PLAH-tah-noh"),
     ("agua","el","water","Droplet","AH-gwah"),
     ("leche","la","milk","Glass of milk","LEH-cheh"),
     ("pan","el","bread","Bread","PAHN"),
     ("huevo","el","egg","Egg","WEH-boh"),
     ("queso","el","cheese","Cheese wedge","KEH-soh")]),
   ("Frutas y dulces", "Fruit & treats", [
     ("galleta","la","cookie","Cookie","gah-YEH-tah"),
     ("fresa","la","strawberry","Strawberry","FREH-sah"),
     ("uvas","las","grapes","Grapes","OO-bahs"),
     ("sandía","la","watermelon","Watermelon","sahn-DEE-ah"),
     ("zanahoria","la","carrot","Carrot","sah-nah-OH-ryah"),
     ("helado","el","ice cream","Soft ice cream","eh-LAH-doh")]),
   ("A comer", "Mealtime", [
     ("pollo","el","chicken","Poultry leg","POH-yoh"),
     ("arroz","el","rice","Cooked rice","ah-RROHS"),
     ("sopa","la","soup","Pot of food","SOH-pah"),
     ("jugo","el","juice","Beverage box","HOO-goh"),
     ("tomate","el","tomato","Tomato","toh-MAH-teh"),
     ("pizza","la","pizza","Pizza","PEET-sah"),
     ("pastel","el","cake","Birthday cake","pahs-TEHL")]),
 ]),
 ("Familia", "Family", "Baby", [
   ("Mi casa", "Close family", [
     ("mamá","la","mom","Woman","mah-MAH"),
     ("papá","el","dad","Man","pah-PAH"),
     ("bebé","el","baby","Baby","beh-BEH"),
     ("hermano","el","brother","Boy","ehr-MAH-noh"),
     ("hermana","la","sister","Girl","ehr-MAH-nah"),
     ("familia","la","family","Smiling face with hearts","fah-MEE-lyah")]),
   ("Familia grande", "Big family", [
     ("abuelo","el","grandpa","Old man","ah-BWEH-loh"),
     ("abuela","la","grandma","Old woman","ah-BWEH-lah"),
     ("tío","el","uncle","Man beard","TEE-oh"),
     ("tía","la","aunt","Woman curly hair","TEE-ah"),
     ("primo","el","cousin","Child","PREE-moh"),
     ("amigo","el","friend","Handshake","ah-MEE-goh")]),
 ]),
 ("El cuerpo", "Body", "Raised hand", [
   ("La cara y más", "Face & hands", [
     ("ojo","el","eye","Eye","OH-hoh"),
     ("nariz","la","nose","Nose","nah-REES"),
     ("boca","la","mouth","Mouth","BOH-kah"),
     ("oreja","la","ear","Ear","oh-REH-hah"),
     ("mano","la","hand","Raised hand","MAH-noh"),
     ("pie","el","foot","Foot","PYEH")]),
   ("Todo el cuerpo", "Whole body", [
     ("diente","el","tooth","Tooth","DYEHN-teh"),
     ("lengua","la","tongue","Tongue","LEHN-gwah"),
     ("dedo","el","finger","Index pointing up","DEH-doh"),
     ("brazo","el","arm","Flexed biceps","BRAH-soh"),
     ("pierna","la","leg","Leg","PYEHR-nah"),
     ("corazón","el","heart","Anatomical heart","koh-rah-SOHN")]),
 ]),
 ("Mi mundo", "My world", "House", [
   ("En casa", "At home", [
     ("casa","la","house","House with garden","KAH-sah"),
     ("cama","la","bed","Bed","KAH-mah"),
     ("silla","la","chair","Chair","SEE-yah"),
     ("puerta","la","door","Door","PWEHR-tah"),
     ("libro","el","book","Closed book","LEE-broh"),
     ("pelota","la","ball","Soccer ball","peh-LOH-tah"),
     ("juguete","el","toy","Teddy bear","hoo-GEH-teh")]),
   ("Afuera", "Outside", [
     ("sol","el","sun","Sun with face","SOHL"),
     ("luna","la","moon","Full moon face","LOO-nah"),
     ("estrella","la","star","Star","ehs-TREH-yah"),
     ("árbol","el","tree","Deciduous tree","AHR-bohl"),
     ("flor","la","flower","Tulip","FLOR"),
     ("nube","la","cloud","Cloud","NOO-beh"),
     ("lluvia","la","rain","Cloud with rain","YOO-byah")]),
   ("¡Vámonos!", "Going places", [
     ("carro","el","car","Automobile","KAH-rroh"),
     ("autobús","el","bus","Bus","ow-toh-BOOS"),
     ("tren","el","train","Locomotive","TREHN"),
     ("avión","el","airplane","Airplane","ah-BYOHN"),
     ("barco","el","boat","Sailboat","BAR-koh"),
     ("bicicleta","la","bike","Bicycle","bee-see-KLEH-tah")]),
 ]),
]

# Frases: from zero. Level kind "t" = sight words (picture is the written word), else sentences.
# Sentence items: (spanish, english, picture). "{N}" = the child's name, "a:" = the child's buddy picture.
SENTENCES = ("Frases", "Sentences", "Speech balloon", [
  ("Yo soy", "I am", "s", [
    ("Yo soy {N}.","I am {N}.","a:"),
    ("Me llamo {N}.","My name is {N}.","a:"),
    ("Soy un niño.","I am a boy.","Boy"),
    ("Soy una niña.","I am a girl.","Girl"),
    ("Estoy feliz.","I am happy.","Grinning face"),
    ("Tengo cinco años.","I am five years old.","n:5")]),
  ("Palabras clave 1", "Sight words: I, you, he, she", "t", [
    ("yo","I","YOH"),("tú","you","TOO"),("él","he","EHL"),("ella","she","EH-yah"),
    ("soy","I am","SOY"),("eres","you are","EH-rehs"),("es","he / she is","EHS")]),
  ("Tú, él, ella", "You, he, she", "s", [
    ("Tú eres mi amigo.","You are my friend.","Handshake"),
    ("Él es mi papá.","He is my dad.","Man"),
    ("Ella es mi mamá.","She is my mom.","Woman"),
    ("Él es mi abuelo.","He is my grandpa.","Old man"),
    ("Ella es mi abuela.","She is my grandma.","Old woman"),
    ("Es un perro.","It is a dog.","Dog face")]),
  ("Palabras clave 2", "Sight words: we, they, and", "t", [
    ("nosotros","we","noh-SOH-trohs"),("ellos","they (boys)","EH-yohs"),("ellas","they (girls)","EH-yahs"),
    ("somos","we are","SOH-mohs"),("son","they are","SOHN"),("y","and","EE")]),
  ("Nosotros y ellos", "We and they", "s", [
    ("Nosotros somos amigos.","We are friends.","Handshake"),
    ("Somos una familia.","We are a family.","Smiling face with hearts"),
    ("Ellos son mis abuelos.","They are my grandparents.","Old man"),
    ("Ellas son mis hermanas.","They are my sisters.","Girl"),
    ("Ellos son gatos.","They are cats.","Cat face"),
    ("Mamá y papá son grandes.","Mom and Dad are big.","Woman")]),
  ("Palabras clave 3", "Sight words: a, the, my, I have", "t", [
    ("un","a (boy word)","OON"),("una","a (girl word)","OO-nah"),("el","the (boy word)","EHL"),("la","the (girl word)","LAH"),
    ("mi","my","MEE"),("tengo","I have","TEHN-goh"),("quiero","I want","KYEH-roh"),("me gusta","I like","meh GOOS-tah")]),
  ("Me gusta", "I like & I want", "s", [
    ("Tengo un perro.","I have a dog.","Dog face"),
    ("Tengo un gato.","I have a cat.","Cat face"),
    ("Me gusta la pizza.","I like pizza.","Pizza"),
    ("Me gusta el helado.","I like ice cream.","Soft ice cream"),
    ("Quiero agua.","I want water.","Droplet"),
    ("Quiero leche, por favor.","I want milk, please.","Glass of milk")]),
  ("¿Cómo es?", "What is it like?", "s", [
    ("El sol es amarillo.","The sun is yellow.","Sun with face"),
    ("La manzana es roja.","The apple is red.","Red apple"),
    ("La rana es verde.","The frog is green.","Frog"),
    ("El elefante es grande.","The elephant is big.","Elephant"),
    ("El ratón es pequeño.","The mouse is small.","Mouse face"),
    ("La jirafa es alta.","The giraffe is tall.","Giraffe")]),
  ("Mi día", "My day", "s", [
    ("Buenos días, mamá.","Good morning, Mom.","Sunrise"),
    ("Tengo hambre.","I'm hungry.","Pot of food"),
    ("Vamos en el carro.","Let's go in the car.","Automobile"),
    ("Papá lee un libro.","Dad reads a book.","Closed book"),
    ("Me cepillo los dientes.","I brush my teeth.","Tooth"),
    ("Buenas noches, papá.","Good night, Dad.","Night with stars"),
    ("Te quiero mucho.","I love you very much.","Red heart")]),
])
COLORS = ["#E8507A","#E07B00","#7C5CD6","#1C8C83","#D9453B","#2F80ED","#B04CA8","#3B9B4F","#0E8FA8"]
