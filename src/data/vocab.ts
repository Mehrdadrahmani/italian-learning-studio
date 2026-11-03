import type { Conjugation, Level, Vocab } from '../types';

export const TOPICS: Record<string, string> = {
  greet: 'سلام و احوال‌پرسی', num: 'عدد، تاریخ و زمان', family: 'خانواده', food: 'غذا و نوشیدنی', home: 'خانه',
  city: 'شهر و مسیر', travel: 'حمل‌ونقل و سفر', shop: 'خرید و پول', work: 'تحصیل و کار', health: 'سلامت و بدن',
  feel: 'احساسات و شخصیت', nature: 'طبیعت و محیط زیست', tech: 'فناوری و رسانه', society: 'جامعه و فرهنگ',
  abstract: 'واژگان انتزاعی و حرفه‌ای', verbs: 'فعل‌های پایه',
};

/* it | art | gender | plural | pos | fa | en | ipa | example | example fa | level | collocations; | related; */
const RAW: Record<string, string> = {
greet: `ciao|||—|حرف ندا|سلام؛ خداحافظ (خودمانی)|hi; bye|ˈtʃao|Ciao, Marco!|سلام مارکو!|A1|ciao a tutti|buongiorno;arrivederci
buongiorno|||—|حرف ندا|صبح بخیر؛ روز بخیر|good morning|bwonˈdʒorno|Buongiorno, signora.|روز بخیر خانم.|A1|buongiorno a tutti|buonasera
buonasera|||—|حرف ندا|عصر بخیر|good evening|bwonaˈsera|Buonasera, dottore.|عصر بخیر آقای دکتر.|A1||buongiorno;buonanotte
buonanotte|||—|حرف ندا|شب بخیر|good night|bwonaˈnɔtte|Buonanotte, a domani!|شب بخیر، تا فردا!|A1||buonasera
arrivederci|||—|حرف ندا|خداحافظ (رسمی‌تر)|goodbye|arriveˈdertʃi|Grazie e arrivederci.|ممنون و خداحافظ.|A1||ciao
grazie|||—|حرف ندا|ممنون|thank you|ˈɡrattsje|Grazie mille!|خیلی ممنون!|A1|grazie mille|prego
prego|||—|حرف ندا|خواهش می‌کنم؛ بفرمایید|you're welcome|ˈprɛɡo|«Grazie.» «Prego.»|«ممنون.» «خواهش می‌کنم.»|A1||grazie
per favore|||—|عبارت|لطفاً|please|per faˈvore|Un caffè, per favore.|یک قهوه لطفاً.|A1||scusi
scusi|||—|فعل (رسمی)|ببخشید (رسمی)|excuse me|ˈskuzi|Scusi, dov'è la stazione?|ببخشید، ایستگاه کجاست؟|A1||scusa
sì|||—|قید|بله|yes|ˈsi|Sì, certo.|بله، البته.|A1||no
no|||—|قید|نه|no|ˈnɔ|No, grazie.|نه، ممنون.|A1||sì
come stai?|||—|عبارت|حالت چطور است؟|how are you?|ˈkome ˈstai|Ciao Luca, come stai?|سلام لوکا، حالت چطور است؟|A1|come sta?|bene
bene|||—|قید|خوب|well|ˈbɛne|Sto bene, grazie.|خوبم، ممنون.|A1|molto bene|male
piacere|||—|حرف ندا|خوشوقتم|nice to meet you|pjaˈtʃere|Piacere, sono Sara.|خوشوقتم، سارا هستم.|A1|piacere di conoscerti|
mi chiamo|||—|عبارت|اسم من ... است|my name is|mi ˈkjamo|Mi chiamo Ali.|اسم من علی است.|A1||come ti chiami?`,
num: `uno|||—|عدد|یک|one|ˈuno|Ho un fratello.|یک برادر دارم.|A1||
due|||—|عدد|دو|two|ˈdue|Due caffè, per favore.|دو قهوه لطفاً.|A1||
tre|||—|عدد|سه|three|ˈtre|Sono le tre.|ساعت سه است.|A1||
quattro|||—|عدد|چهار|four|ˈkwattro|Ho quattro libri.|چهار کتاب دارم.|A1||
cinque|||—|عدد|پنج|five|ˈtʃinkwe|Arrivo alle cinque.|ساعت پنج می‌رسم.|A1||
dieci|||—|عدد|ده|ten|ˈdjɛtʃi|Costa dieci euro.|ده یورو قیمت دارد.|A1||
venti|||—|عدد|بیست|twenty|ˈventi|Ho venti anni.|بیست سال دارم.|A1||
cento|||—|عدد|صد|hundred|ˈtʃɛnto|Cento persone.|صد نفر.|A1||mille
giorno|il|m|giorni|اسم|روز|day|ˈdʒorno|Che giorno è oggi?|امروز چه روزی است؟|A1|ogni giorno|settimana
settimana|la|f|settimane|اسم|هفته|week|settiˈmana|La settimana prossima parto.|هفتهٔ آینده می‌روم.|A1|la settimana prossima|mese
mese|il|m|mesi|اسم|ماه|month|ˈmeːze|Il mese di maggio è bello.|ماه مه زیباست.|A1||anno
anno|l'|m|anni|اسم|سال|year|ˈanno|Quest'anno studio italiano.|امسال ایتالیایی می‌خوانم.|A1|ogni anno|mese
oggi|||—|قید|امروز|today|ˈɔddʒi|Oggi lavoro.|امروز کار می‌کنم.|A1||domani;ieri
domani|||—|قید|فردا|tomorrow|doˈmani|A domani!|تا فردا!|A1||oggi
ieri|||—|قید|دیروز|yesterday|ˈjɛri|Ieri ho studiato.|دیروز درس خواندم.|A1||oggi
ora|l'|f|ore|اسم|ساعت (مدت)؛ اکنون|hour; now|ˈora|Che ora è?|ساعت چند است؟|A1|un'ora|minuto
lunedì|il|m|lunedì|اسم|دوشنبه|Monday|luneˈdi|Lunedì vado a scuola.|دوشنبه به مدرسه می‌روم.|A1||domenica
domenica|la|f|domeniche|اسم|یکشنبه|Sunday|doˈmenika|La domenica riposo.|یکشنبه‌ها استراحت می‌کنم.|A1||sabato
sabato|il|m|sabati|اسم|شنبه|Saturday|ˈsabato|Sabato esco con gli amici.|شنبه با دوستان بیرون می‌روم.|A1||domenica`,
family: `famiglia|la|f|famiglie|اسم|خانواده|family|faˈmiʎʎa|La mia famiglia è grande.|خانوادهٔ من بزرگ است.|A1|in famiglia|genitori
madre|la|f|madri|اسم|مادر|mother|ˈmadre|Mia madre è medico.|مادرم پزشک است.|A1||padre
padre|il|m|padri|اسم|پدر|father|ˈpadre|Mio padre lavora a Roma.|پدرم در رم کار می‌کند.|A1||madre
fratello|il|m|fratelli|اسم|برادر|brother|fraˈtɛllo|Ho un fratello.|یک برادر دارم.|A1||sorella
sorella|la|f|sorelle|اسم|خواهر|sister|soˈrɛlla|Mia sorella si chiama Anna.|اسم خواهرم آناست.|A1||fratello
figlio|il|m|figli|اسم|پسر (فرزند)|son|ˈfiʎʎo|Ha un figlio piccolo.|یک پسر کوچک دارد.|A1||figlia
figlia|la|f|figlie|اسم|دختر (فرزند)|daughter|ˈfiʎʎa|Loro figlia studia a Milano.|دخترشان در میلان درس می‌خواند.|A1||figlio
marito|il|m|mariti|اسم|شوهر|husband|maˈrito|Suo marito è italiano.|شوهرش ایتالیایی است.|A1||moglie
moglie|la|f|mogli|اسم|همسر (زن)|wife|ˈmoʎʎe|Mia moglie parla persiano.|همسرم فارسی حرف می‌زند.|A1||marito
amico|l'|m|amici|اسم|دوست (مرد)|friend|aˈmiko|Marco è un amico.|مارکو یک دوست است.|A1|migliore amico|amica
bambino|il|m|bambini|اسم|بچه، کودک|child|bamˈbino|Il bambino gioca.|بچه بازی می‌کند.|A1||ragazzo`,
food: `caffè|il|m|caffè|اسم|قهوه|coffee|kafˈfɛ|Prendo un caffè.|یک قهوه می‌گیرم.|A1|caffè macchiato|cappuccino
acqua|l'|f|acque|اسم|آب|water|ˈakkwa|Vorrei un'acqua naturale.|یک آب معمولی می‌خواهم.|A1|acqua frizzante|vino
pane|il|m|pani|اسم|نان|bread|ˈpane|Il pane è fresco.|نان تازه است.|A1|pane e burro|
pasta|la|f|paste|اسم|پاستا؛ شیرینی|pasta|ˈpasta|Mangio la pasta a pranzo.|ظهر پاستا می‌خورم.|A1|un piatto di pasta|pizza
pizza|la|f|pizze|اسم|پیتزا|pizza|ˈpittsa|Una pizza margherita, per favore.|یک پیتزا مارگریتا لطفاً.|A1||pasta
vino|il|m|vini|اسم|شراب|wine|ˈvino|Un bicchiere di vino rosso.|یک لیوان شراب قرمز.|A1|vino rosso|birra
gelato|il|m|gelati|اسم|بستنی|ice cream|dʒeˈlato|Il gelato al limone è buono.|بستنی لیمو خوب است.|A1||
formaggio|il|m|formaggi|اسم|پنیر|cheese|forˈmaddʒo|Mi piace il formaggio.|پنیر دوست دارم.|A1||
carne|la|f|carni|اسم|گوشت|meat|ˈkarne|Non mangio carne.|گوشت نمی‌خورم.|A1||pesce
pesce|il|m|pesci|اسم|ماهی|fish|ˈpeʃʃe|Il pesce è fresco.|ماهی تازه است.|A1||carne
verdura|la|f|verdure|اسم|سبزیجات|vegetables|verˈdura|Mangio molta verdura.|سبزیجات زیاد می‌خورم.|A1||frutta
frutta|la|f|—|اسم|میوه|fruit|ˈfrutta|La frutta è dolce.|میوه شیرین است.|A1||verdura
conto|il|m|conti|اسم|صورت‌حساب|bill|ˈkonto|Il conto, per favore.|صورت‌حساب لطفاً.|A1|pagare il conto|
ristorante|il|m|ristoranti|اسم|رستوران|restaurant|ristoˈrante|Andiamo al ristorante.|به رستوران برویم.|A1||bar
buono|||—|صفت|خوب، خوشمزه|good|ˈbwɔno|Questa pizza è buona.|این پیتزا خوشمزه است.|A1||cattivo
mangiare|||—|فعل|خوردن|to eat|manˈdʒare|Mangiamo insieme?|با هم غذا بخوریم؟|A1|mangiare fuori|bere|mangio,mangi,mangia,mangiamo,mangiate,mangiano,mangiato
bere|||—|فعل|نوشیدن|to drink|ˈbere|Bevo un tè.|یک چای می‌نوشم.|A1||mangiare|bevo,bevi,beve,beviamo,bevete,bevono,bevuto`,
home: `casa|la|f|case|اسم|خانه|house, home|ˈkaːsa|Sono a casa.|خانه هستم.|A1|a casa|appartamento
appartamento|l'|m|appartamenti|اسم|آپارتمان|apartment|appartaˈmento|Abito in un appartamento.|در یک آپارتمان زندگی می‌کنم.|A1||casa
camera|la|f|camere|اسم|اتاق|room|ˈkamera|La camera è piccola.|اتاق کوچک است.|A1|camera da letto|cucina
cucina|la|f|cucine|اسم|آشپزخانه|kitchen|kuˈtʃina|La cucina è grande.|آشپزخانه بزرگ است.|A1||bagno
bagno|il|m|bagni|اسم|حمام، سرویس|bathroom|ˈbaɲɲo|Dov'è il bagno?|سرویس کجاست؟|A1||
tavolo|il|m|tavoli|اسم|میز|table|ˈtavolo|Il libro è sul tavolo.|کتاب روی میز است.|A1||sedia
sedia|la|f|sedie|اسم|صندلی|chair|ˈsɛdja|C'è una sedia.|یک صندلی هست.|A1||tavolo
letto|il|m|letti|اسم|تخت|bed|ˈlɛtto|Vado a letto.|به رختخواب می‌روم.|A1|andare a letto|
porta|la|f|porte|اسم|در|door|ˈpɔrta|Chiudi la porta.|در را ببند.|A1||finestra
finestra|la|f|finestre|اسم|پنجره|window|fiˈnɛstra|Apro la finestra.|پنجره را باز می‌کنم.|A1||porta
libro|il|m|libri|اسم|کتاب|book|ˈlibro|Leggo un libro.|کتابی می‌خوانم.|A1||quaderno
chiave|la|f|chiavi|اسم|کلید|key|ˈkjave|Dove sono le chiavi?|کلیدها کجا هستند؟|A1||`,
city: `città|la|f|città|اسم|شهر|city|tʃitˈta|Roma è una città antica.|رم شهری باستانی است.|A1|centro città|paese
strada|la|f|strade|اسم|خیابان، جاده|street|ˈstrada|Questa strada è lunga.|این خیابان طولانی است.|A1||via
piazza|la|f|piazze|اسم|میدان|square|ˈpjattsa|Ci vediamo in piazza.|در میدان همدیگر را می‌بینیم.|A1||
stazione|la|f|stazioni|اسم|ایستگاه|station|statˈtsjone|La stazione è vicina.|ایستگاه نزدیک است.|A1|stazione centrale|
destra|la|f|—|اسم|راست|right|ˈdɛstra|Gira a destra.|به راست بپیچ.|A1|a destra|sinistra
sinistra|la|f|—|اسم|چپ|left|siˈnistra|La banca è a sinistra.|بانک سمت چپ است.|A1|a sinistra|destra
dritto|||—|قید|مستقیم|straight|ˈdritto|Vai sempre dritto.|همیشه مستقیم برو.|A1|sempre dritto|
vicino|||—|صفت/قید|نزدیک|near|viˈtʃino|Abito qui vicino.|همین نزدیکی زندگی می‌کنم.|A1|vicino a|lontano
lontano|||—|صفت/قید|دور|far|lonˈtano|Il museo è lontano?|موزه دور است؟|A1|lontano da|vicino
banca|la|f|banche|اسم|بانک|bank|ˈbanka|Vado in banca.|به بانک می‌روم.|A1||
farmacia|la|f|farmacie|اسم|داروخانه|pharmacy|farmaˈtʃia|C'è una farmacia qui?|اینجا داروخانه هست؟|A2||
ospedale|l'|m|ospedali|اسم|بیمارستان|hospital|ospeˈdale|L'ospedale è in centro.|بیمارستان در مرکز است.|A2||`,
travel: `treno|il|m|treni|اسم|قطار|train|ˈtrɛno|Prendo il treno per Firenze.|قطار فلورانس را می‌گیرم.|A1|prendere il treno|
autobus|l'|m|autobus|اسم|اتوبوس|bus|ˈautobus|L'autobus è in ritardo.|اتوبوس تأخیر دارد.|A1||
biglietto|il|m|biglietti|اسم|بلیت|ticket|biʎˈʎetto|Un biglietto per Roma.|یک بلیت برای رم.|A1|biglietto di andata e ritorno|
aereo|l'|m|aerei|اسم|هواپیما|plane|aˈɛreo|L'aereo parte alle otto.|هواپیما ساعت هشت حرکت می‌کند.|A2||
valigia|la|f|valigie|اسم|چمدان|suitcase|vaˈlidʒa|Faccio la valigia.|چمدان می‌بندم.|A2|fare la valigia|
albergo|l'|m|alberghi|اسم|هتل|hotel|alˈbɛrɡo|Ho prenotato un albergo.|هتلی رزرو کرده‌ام.|A2|prenotare un albergo|
viaggio|il|m|viaggi|اسم|سفر|trip|ˈvjaddʒo|Buon viaggio!|سفر بخیر!|A2|fare un viaggio|
prenotazione|la|f|prenotazioni|اسم|رزرو|booking|prenotatˈtsjone|Ho una prenotazione.|رزرو دارم.|A2||
partire|||—|فعل|حرکت کردن، رفتن|to leave|parˈtire|Parto domani.|فردا می‌روم.|A1||arrivare|parto,parti,parte,partiamo,partite,partono,partito
arrivare|||—|فعل|رسیدن|to arrive|arriˈvare|Il treno arriva alle due.|قطار ساعت دو می‌رسد.|A1||partire|arrivo,arrivi,arriva,arriviamo,arrivate,arrivano,arrivato`,
shop: `negozio|il|m|negozi|اسم|مغازه|shop|neˈɡɔttsjo|Il negozio è chiuso.|مغازه بسته است.|A1||
prezzo|il|m|prezzi|اسم|قیمت|price|ˈprɛttso|Qual è il prezzo?|قیمت چند است؟|A2||
soldi|i|m|—|اسم (جمع)|پول|money|ˈsɔldi|Non ho soldi.|پول ندارم.|A1||
euro|l'|m|euro|اسم|یورو|euro|ˈɛuro|Sono cinque euro.|پنج یورو می‌شود.|A1||
caro|||—|صفت|گران؛ عزیز|expensive; dear|ˈkaro|Questa borsa è cara.|این کیف گران است.|A1||economico
economico|||—|صفت|ارزان|cheap|ekoˈnɔmiko|Un albergo economico.|یک هتل ارزان.|A2||caro
borsa|la|f|borse|اسم|کیف|bag|ˈborsa|Compro una borsa.|کیفی می‌خرم.|A1||
scarpe|le|f|—|اسم (جمع)|کفش|shoes|ˈskarpe|Queste scarpe sono belle.|این کفش‌ها زیبا هستند.|A1|un paio di scarpe|
taglia|la|f|taglie|اسم|سایز (لباس)|size|ˈtaʎʎa|Che taglia porta?|چه سایزی می‌پوشید؟|A2||
comprare|||—|فعل|خریدن|to buy|komˈprare|Compro il pane.|نان می‌خرم.|A1|comprare online|vendere|compro,compri,compra,compriamo,comprate,comprano,comprato
pagare|||—|فعل|پرداختن|to pay|paˈɡare|Pago con la carta.|با کارت پرداخت می‌کنم.|A1|pagare con la carta|costare|pago,paghi,paga,paghiamo,pagate,pagano,pagato`,
work: `lavoro|il|m|lavori|اسم|کار|work, job|laˈvoro|Cerco lavoro.|دنبال کار می‌گردم.|A1|cercare lavoro|ufficio
scuola|la|f|scuole|اسم|مدرسه|school|ˈskwɔla|Vado a scuola.|به مدرسه می‌روم.|A1||università
università|l'|f|università|اسم|دانشگاه|university|universiˈta|Studio all'università.|در دانشگاه درس می‌خوانم.|A1||scuola
studente|lo|m|studenti|اسم|دانشجو|student|stuˈdɛnte|Sono uno studente.|من دانشجو هستم.|A1||studentessa
insegnante|l'|m|insegnanti|اسم|معلم|teacher|inseɲˈɲante|L'insegnante spiega bene.|معلم خوب توضیح می‌دهد.|A1||
ufficio|l'|m|uffici|اسم|دفتر کار|office|ufˈfitʃo|Lavoro in ufficio.|در دفتر کار می‌کنم.|A1||
riunione|la|f|riunioni|اسم|جلسه|meeting|riuˈnjone|Ho una riunione alle dieci.|ساعت ده جلسه دارم.|B1|fissare una riunione|
colloquio|il|m|colloqui|اسم|مصاحبه|interview|kolˈlɔkwjo|Domani ho un colloquio di lavoro.|فردا مصاحبهٔ کاری دارم.|B1|colloquio di lavoro|
esame|l'|m|esami|اسم|امتحان|exam|eˈzame|Ho superato l'esame.|امتحان را قبول شدم.|A2|superare un esame|
laurea|la|f|lauree|اسم|مدرک دانشگاهی|degree|ˈlaurea|Ho una laurea in ingegneria.|مدرک مهندسی دارم.|B1||
studiare|||—|فعل|درس خواندن|to study|stuˈdjare|Studio italiano ogni giorno.|هر روز ایتالیایی می‌خوانم.|A1||imparare|studio,studi,studia,studiamo,studiate,studiano,studiato
lavorare|||—|فعل|کار کردن|to work|lavoˈrare|Lavoro a Milano.|در میلان کار می‌کنم.|A1||riposare|lavoro,lavori,lavora,lavoriamo,lavorate,lavorano,lavorato`,
health: `testa|la|f|teste|اسم|سر|head|ˈtɛsta|Ho mal di testa.|سردرد دارم.|A1|mal di testa|
mano|la|f|mani|اسم|دست|hand|ˈmano|Lavo le mani.|دست‌هایم را می‌شویم.|A1||
occhio|l'|m|occhi|اسم|چشم|eye|ˈɔkkjo|Ha gli occhi verdi.|چشم‌های سبز دارد.|A1||
gamba|la|f|gambe|اسم|پا (ساق)|leg|ˈɡamba|Mi fa male la gamba.|پایم درد می‌کند.|A2||
medico|il|m|medici|اسم|پزشک|doctor|ˈmɛdiko|Devo andare dal medico.|باید پیش دکتر بروم.|A1||
febbre|la|f|febbri|اسم|تب|fever|ˈfɛbbre|Ho la febbre.|تب دارم.|A2|avere la febbre|
ricetta|la|f|ricette|اسم|نسخه؛ دستور پخت|prescription; recipe|riˈtʃɛtta|Il medico scrive la ricetta.|پزشک نسخه می‌نویسد.|A2||
salute|la|f|—|اسم|سلامتی|health|saˈlute|La salute è importante.|سلامتی مهم است.|A2||
stanco|||—|صفت|خسته|tired|ˈstanko|Sono molto stanco.|خیلی خسته‌ام.|A1||`,
feel: `felice|||—|صفت|خوشحال|happy|feˈlitʃe|Sono felice di vederti.|از دیدنت خوشحالم.|A1||triste
triste|||—|صفت|غمگین|sad|ˈtriste|Oggi è triste.|امروز غمگین است.|A1||felice
gentile|||—|صفت|مهربان، مؤدب|kind|dʒenˈtile|Sei molto gentile.|خیلی مهربانی.|A1||
simpatico|||—|صفت|خوش‌برخورد|nice, likable|simˈpatiko|Luca è simpatico.|لوکا خوش‌برخورد است.|A1||antipatico
bello|||—|صفت|زیبا|beautiful|ˈbɛllo|Che bella giornata!|چه روز زیبایی!|A1||brutto
grande|||—|صفت|بزرگ|big|ˈɡrande|Una grande città.|یک شهر بزرگ.|A1||piccolo
piccolo|||—|صفت|کوچک|small|ˈpikkolo|Un cane piccolo.|یک سگ کوچک.|A1||grande
contento|||—|صفت|راضی، خوشحال|pleased|konˈtɛnto|Sono contento del lavoro.|از کار راضی‌ام.|A2||
preoccupato|||—|صفت|نگران|worried|preokkuˈpato|Sono preoccupato per l'esame.|برای امتحان نگرانم.|B1||tranquillo
sincero|||—|صفت|صادق، روراست|sincere|sinˈtʃɛro|È una persona sincera.|آدم صادقی است.|B1||`,
nature: `sole|il|m|soli|اسم|خورشید|sun|ˈsole|C'è il sole.|آفتاب است.|A1||luna
mare|il|m|mari|اسم|دریا|sea|ˈmare|Andiamo al mare.|به دریا می‌رویم.|A1||montagna
montagna|la|f|montagne|اسم|کوه|mountain|monˈtaɲɲa|Vado in montagna.|به کوه می‌روم.|A1||mare
albero|l'|m|alberi|اسم|درخت|tree|ˈalbero|Un albero alto.|یک درخت بلند.|A2||
pioggia|la|f|piogge|اسم|باران|rain|ˈpjɔddʒa|Oggi c'è pioggia.|امروز باران است.|A2||
ambiente|l'|m|ambienti|اسم|محیط زیست|environment|amˈbjɛnte|Dobbiamo proteggere l'ambiente.|باید از محیط زیست محافظت کنیم.|B1|proteggere l'ambiente|
clima|il|m|climi|اسم|اقلیم|climate|ˈklima|Il clima sta cambiando.|اقلیم در حال تغییر است.|B1|cambiamento climatico|
inquinamento|l'|m|—|اسم|آلودگی|pollution|inkwinaˈmento|L'inquinamento è un problema.|آلودگی یک مشکل است.|B1||`,
tech: `telefono|il|m|telefoni|اسم|تلفن|phone|teˈlɛfono|Il mio telefono è scarico.|باتری تلفنم خالی است.|A1||
computer|il|m|computer|اسم|رایانه|computer|komˈpjuter|Lavoro al computer.|با رایانه کار می‌کنم.|A1||
messaggio|il|m|messaggi|اسم|پیام|message|mesˈsaddʒo|Ti mando un messaggio.|برایت پیام می‌فرستم.|A2|mandare un messaggio|
rete|la|f|reti|اسم|شبکه، اینترنت|network|ˈrete|Cerco informazioni in rete.|در اینترنت اطلاعات جست‌وجو می‌کنم.|B1|in rete|
notizia|la|f|notizie|اسم|خبر|news|noˈtittsja|Ho una bella notizia.|یک خبر خوب دارم.|A2||
giornale|il|m|giornali|اسم|روزنامه|newspaper|dʒorˈnale|Leggo il giornale.|روزنامه می‌خوانم.|A2||
intelligenza artificiale|l'|f|—|اسم|هوش مصنوعی|artificial intelligence|intelliˈdʒɛntsa artifiˈtʃale|L'intelligenza artificiale cambia il lavoro.|هوش مصنوعی کار را تغییر می‌دهد.|B2||`,
society: `legge|la|f|leggi|اسم|قانون|law|ˈleddʒe|La legge è uguale per tutti.|قانون برای همه یکسان است.|B1||
governo|il|m|governi|اسم|دولت|government|ɡoˈvɛrno|Il governo ha deciso.|دولت تصمیم گرفته است.|B1||
cultura|la|f|culture|اسم|فرهنگ|culture|kulˈtura|La cultura italiana è ricca.|فرهنگ ایتالیا غنی است.|A2||
società|la|f|società|اسم|جامعه؛ شرکت|society; company|sotʃeˈta|La società cambia.|جامعه تغییر می‌کند.|B1||
diritto|il|m|diritti|اسم|حق؛ حقوق|right; law|diˈritto|Il diritto allo studio.|حق تحصیل.|B2|diritti umani|dovere
disuguaglianza|la|f|disuguaglianze|اسم|نابرابری|inequality|dizugwaʎˈʎantsa|La disuguaglianza è cresciuta.|نابرابری افزایش یافته است.|C1|disuguaglianza sociale|`,
abstract: `tuttavia|||—|حرف ربط|با این حال|however|tuttaˈvia|È difficile; tuttavia ci provo.|سخت است؛ با این حال تلاش می‌کنم.|B2||però
sebbene|||—|حرف ربط|اگرچه (+ congiuntivo)|although|sebˈbɛne|Sebbene sia tardi, resto.|اگرچه دیر است، می‌مانم.|B2||benché
pertanto|||—|حرف ربط|بنابراین (رسمی)|therefore|perˈtanto|Pertanto, il progetto è sospeso.|بنابراین، پروژه معلق شده است.|B2||quindi
sfida|la|f|sfide|اسم|چالش|challenge|ˈsfida|È una sfida importante.|چالش مهمی است.|B2|affrontare una sfida|
fenomeno|il|m|fenomeni|اسم|پدیده|phenomenon|feˈnɔmeno|Un fenomeno complesso.|پدیده‌ای پیچیده.|B2||
approfondire|||—|فعل|عمیق بررسی کردن|to deepen|approfonˈdire|Vorrei approfondire il tema.|می‌خواهم موضوع را عمیق‌تر بررسی کنم.|C1||
sottolineare|||—|فعل|تأکید کردن|to emphasize|sottolineˈare|Vorrei sottolineare un punto.|می‌خواهم بر نکته‌ای تأکید کنم.|C1||
ipotesi|l'|f|ipotesi|اسم|فرضیه|hypothesis|iˈpɔtezi|Questa ipotesi è fondata.|این فرضیه مستدل است.|B2|formulare un'ipotesi|
consapevolezza|la|f|—|اسم|آگاهی|awareness|konsapevoˈlettsa|Serve maggiore consapevolezza.|آگاهی بیشتری لازم است.|C1||
sfumatura|la|f|sfumature|اسم|ظرافت معنایی|nuance|sfumaˈtura|Una sfumatura di ironia.|رگه‌ای از طعنه.|C1||`,
verbs: `essere|||—|فعل|بودن|to be|ˈɛssere|Sono iraniano.|من ایرانی هستم.|A1||stare|sono,sei,è,siamo,siete,sono,stato
avere|||—|فعل|داشتن|to have|aˈvere|Ho vent'anni.|بیست سال دارم.|A1||essere|ho,hai,ha,abbiamo,avete,hanno,avuto
fare|||—|فعل|انجام دادن|to do, make|ˈfare|Che lavoro fai?|چه کار می‌کنی؟|A1|fare colazione|lavorare|faccio,fai,fa,facciamo,fate,fanno,fatto
andare|||—|فعل|رفتن|to go|anˈdare|Vado a casa.|به خانه می‌روم.|A1||venire|vado,vai,va,andiamo,andate,vanno,andato
stare|||—|فعل|ماندن؛ حال داشتن|to stay; be|ˈstare|Come stai?|حالت چطور است؟|A1||essere|sto,stai,sta,stiamo,state,stanno,stato
venire|||—|فعل|آمدن|to come|veˈnire|Vieni con me?|با من می‌آیی؟|A1||andare|vengo,vieni,viene,veniamo,venite,vengono,venuto
potere|||—|فعل|توانستن|can|poˈtere|Posso entrare?|می‌توانم وارد شوم؟|A1||volere|posso,puoi,può,possiamo,potete,possono,potuto
volere|||—|فعل|خواستن|to want|voˈlere|Voglio imparare l'italiano.|می‌خواهم ایتالیایی یاد بگیرم.|A1||potere|voglio,vuoi,vuole,vogliamo,volete,vogliono,voluto
dovere|||—|فعل|باید|must|doˈvere|Devo studiare.|باید درس بخوانم.|A1||potere|devo,devi,deve,dobbiamo,dovete,devono,dovuto
parlare|||—|فعل|حرف زدن|to speak|parˈlare|Parlo un po' d'italiano.|کمی ایتالیایی حرف می‌زنم.|A1|parlare con|ascoltare|parlo,parli,parla,parliamo,parlate,parlano,parlato
leggere|||—|فعل|خواندن|to read|ˈlɛddʒere|Leggo il giornale.|روزنامه می‌خوانم.|A1||scrivere|leggo,leggi,legge,leggiamo,leggete,leggono,letto
scrivere|||—|فعل|نوشتن|to write|ˈskrivere|Scrivo una lettera.|نامه‌ای می‌نویسم.|A1||leggere|scrivo,scrivi,scrive,scriviamo,scrivete,scrivono,scritto
dormire|||—|فعل|خوابیدن|to sleep|dorˈmire|Dormo otto ore.|هشت ساعت می‌خوابم.|A1||svegliarsi|dormo,dormi,dorme,dormiamo,dormite,dormono,dormito
capire|||—|فعل|فهمیدن|to understand|kaˈpire|Non capisco.|نمی‌فهمم.|A1||sapere|capisco,capisci,capisce,capiamo,capite,capiscono,capito`,
};

const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();

export const VOCAB: Vocab[] = Object.entries(RAW).flatMap(([topic, block]) => block.split('\n').map(line => {
  const [it, art, g, pl, pos, fa, en, ipa, exIt, exFa, level, col, rel, verb] = line.split('|');
  const [io, tu, lui, noi, voi, loro, pp] = (verb ?? '').split(',');
  const conj: Conjugation | undefined = verb ? { io, tu, lui, noi, voi, loro, pp } : undefined;
  return {
    id: `${topic}-${slug(it)}`, it, art: art || undefined, g: (g || undefined) as 'm' | 'f' | undefined,
    pl: pl && pl !== '—' ? pl : undefined, pos, fa, en, ipa: ipa || undefined, exIt, exFa, topic, level: level as Level,
    col: col ? col.split(';') : [], rel: rel ? rel.split(';').filter(Boolean) : [], verb: conj, label: 'AI-GENERATED' as const,
  };
}));

export const vocabById = new Map(VOCAB.map(v => [v.id, v]));
export const nounWithArticle = (v: Vocab) =>
  !v.art ? v.it : v.art.endsWith("'") ? `${v.art}${v.it}` : `${v.art} ${v.it}`;
