import type { Exercise, StudyText, TextLine } from '../types';

const L = (s: string): TextLine[] => s.split('\n').map(l => {
  const p = l.split('|');
  return p.length === 3 ? { sp: p[0], it: p[1], fa: p[2] } : { it: p[0], fa: p[1] };
});
const G = (s: string) => Object.fromEntries(s.split('|').map(x => x.split('=') as [string, string]));
const m = (q: string, opts: string[], a: number, why: string, tag = 'درک مطلب'): Exercise => ({ k: 'mcq', q, opts, a, why, tag });

export const TEXTS: StudyText[] = [
{ id: 'meet', level: 'A1', title: 'آشنایی', it: 'Piacere!', kind: 'گفت‌وگو', grammar: ['essere'], pron: 'ci-ce',
  lines: L(`Sara|Ciao! Mi chiamo Sara. E tu?|سلام! اسم من ساراست. تو چی؟
Ali|Piacere, sono Ali. Sono iraniano.|خوشوقتم، من علی هستم. ایرانی‌ام.
Sara|Di dove sei?|اهل کجایی؟
Ali|Sono di Teheran. E tu?|اهل تهرانم. تو چی؟
Sara|Sono di Firenze. Parli bene italiano!|من اهل فلورانسم. خوب ایتالیایی حرف می‌زنی!
Ali|Grazie, studio ogni giorno.|ممنون، هر روز درس می‌خوانم.`),
  gloss: G('ciao=سلام|mi=مرا، به من (ضمیر)|chiamo=نام دارم (از chiamarsi)|e=و|tu=تو|piacere=خوشوقتم|sono=هستم (essere)|iraniano=ایرانی|di=از، اهلِ|dove=کجا|sei=هستی (essere)|parli=حرف می‌زنی (parlare)|bene=خوب|italiano=ایتالیایی|grazie=ممنون|studio=درس می‌خوانم|ogni=هر|giorno=روز'),
  qs: [m('علی اهل کجاست؟', ['تهران', 'فلورانس', 'رم'], 0, 'او می‌گوید {Sono di Teheran}.'), m('سارا اهل کجاست؟', ['فلورانس', 'تهران', 'میلان'], 0, '{Sono di Firenze}.')] },
{ id: 'bar', level: 'A1', title: 'در کافه', it: 'Al bar', kind: 'گفت‌وگو', grammar: ['modals'], pron: 'double',
  lines: L(`Barista|Buongiorno! Cosa prende?|روز بخیر! چه میل دارید؟
Cliente|Vorrei un caffè e un cornetto, per favore.|یک قهوه و یک کورنتو می‌خواهم، لطفاً.
Barista|Altro?|چیز دیگری؟
Cliente|No, grazie. Quanto costa?|نه، ممنون. چقدر می‌شود؟
Barista|Sono tre euro.|سه یورو می‌شود.
Cliente|Ecco a lei. Grazie, arrivederci!|بفرمایید. ممنون، خداحافظ!`),
  gloss: G('buongiorno=روز بخیر|cosa=چه چیز|prende=میل دارید (prendere، رسمی)|vorrei=می‌خواهم (مودبانه)|un=یک|caffè=قهوه|e=و|cornetto=کورنتو (نان شیرین)|per=برای|favore=لطف|altro=چیز دیگر|no=نه|grazie=ممنون|quanto=چقدر|costa=قیمت دارد|sono=می‌شود (essere)|tre=سه|euro=یورو|ecco=بفرمایید|a=به|lei=شما (رسمی)|arrivederci=خداحافظ'),
  qs: [m('مشتری چه سفارش می‌دهد؟', ['قهوه و کورنتو', 'آب و پیتزا', 'فقط قهوه'], 0, '{un caffè e un cornetto}.'), m('قیمت چقدر است؟', ['سه یورو', 'دو یورو', 'پنج یورو'], 0, '{Sono tre euro}.')] },
{ id: 'directions', level: 'A1', title: 'پرسیدن مسیر', it: 'Scusi, dov\'è...?', kind: 'گفت‌وگو', grammar: ['ce', 'prepositions'],
  lines: L(`Turista|Scusi, dov'è la stazione?|ببخشید، ایستگاه کجاست؟
Signora|Vada sempre dritto e poi giri a destra.|مستقیم بروید و بعد به راست بپیچید.
Turista|È lontano?|دور است؟
Signora|No, è qui vicino. Cinque minuti a piedi.|نه، همین نزدیکی است. پنج دقیقه پیاده.
Turista|Grazie mille!|خیلی ممنون!
Signora|Prego, buona giornata!|خواهش می‌کنم، روز خوبی داشته باشید!`),
  gloss: G("scusi=ببخشید (رسمی)|dov'è=کجاست|la=حرف تعریف مؤنث|stazione=ایستگاه|vada=بروید (امری رسمی)|sempre=همیشه|dritto=مستقیم|e=و|poi=بعد|giri=بپیچید (امری رسمی)|a=به|destra=راست|è=است|lontano=دور|no=نه|qui=اینجا|vicino=نزدیک|cinque=پنج|minuti=دقیقه‌ها|piedi=پاها (a piedi: پیاده)|grazie=ممنون|mille=هزار|prego=خواهش می‌کنم|buona=خوب|giornata=روز"),
  qs: [m('ایستگاه چقدر دور است؟', ['پنج دقیقه پیاده', 'خیلی دور', 'پنجاه دقیقه'], 0, '{Cinque minuti a piedi}.')] },
{ id: 'routine', level: 'A1', title: 'روز من', it: 'La mia giornata', kind: 'متن', grammar: ['present'],
  lines: L(`Mi chiamo Ali e abito a Milano.|اسم من علی است و در میلان زندگی می‌کنم.
Ogni mattina faccio colazione alle otto.|هر صبح ساعت هشت صبحانه می‌خورم.
Poi vado a scuola in autobus.|بعد با اتوبوس به مدرسه می‌روم.
Studio italiano fino all'una.|تا ساعت یک ایتالیایی می‌خوانم.
La sera leggo un libro e vado a letto presto.|عصرها کتاب می‌خوانم و زود می‌خوابم.`),
  gloss: G("mi=مرا|chiamo=نام دارم|ali=علی|e=و|abito=زندگی می‌کنم|a=در، به|milano=میلان|ogni=هر|mattina=صبح|faccio=انجام می‌دهم (fare)|colazione=صبحانه|alle=در ساعت|otto=هشت|poi=بعد|vado=می‌روم (andare)|scuola=مدرسه|in=در، با|autobus=اتوبوس|studio=می‌خوانم|italiano=ایتالیایی|fino=تا|all'una=ساعت یک|la=حرف تعریف مؤنث|sera=عصر|leggo=می‌خوانم|un=یک|libro=کتاب|letto=تخت|presto=زود"),
  qs: [m('علی چگونه به مدرسه می‌رود؟', ['با اتوبوس', 'پیاده', 'با قطار'], 0, '{in autobus}.'), m('علی ساعت چند صبحانه می‌خورد؟', ['هشت', 'یک', 'نه'], 0, '{alle otto}.')] },
{ id: 'hotel', level: 'A2', title: 'در هتل', it: 'In albergo', kind: 'گفت‌وگو', grammar: ['modals'],
  lines: L(`Ospite|Buonasera, ho una prenotazione a nome Rahimi.|عصر بخیر، به نام رحیمی رزرو دارم.
Receptionist|Sì, una camera singola per due notti.|بله، یک اتاق یک‌نفره برای دو شب.
Ospite|La colazione è inclusa?|صبحانه جزو قیمت است؟
Receptionist|Sì, dalle sette alle dieci.|بله، از هفت تا ده.
Ospite|Posso lasciare la valigia qui domani?|فردا می‌توانم چمدان را اینجا بگذارم؟
Receptionist|Certo, nessun problema.|البته، مشکلی نیست.`),
  gloss: G('buonasera=عصر بخیر|ho=دارم|una=یک|prenotazione=رزرو|a=به|nome=نام|sì=بله|camera=اتاق|singola=یک‌نفره|per=برای|due=دو|notti=شب‌ها|la=حرف تعریف|colazione=صبحانه|è=است|inclusa=شامل‌شده|dalle=از ساعت|sette=هفت|alle=تا ساعت|dieci=ده|posso=می‌توانم|lasciare=گذاشتن|valigia=چمدان|qui=اینجا|domani=فردا|certo=البته|nessun=هیچ|problema=مشکل'),
  qs: [m('رزرو برای چند شب است؟', ['دو شب', 'یک شب', 'ده شب'], 0, '{per due notti}.')] },
{ id: 'weekend', level: 'A2', title: 'آخر هفته‌ام', it: 'Il mio fine settimana', kind: 'متن', grammar: ['passato'],
  lines: L(`Sabato scorso sono andato al mare con due amici.|شنبهٔ گذشته با دو دوست به دریا رفتم.
Abbiamo preso il treno alle nove.|قطار ساعت نه را گرفتیم.
Faceva caldo e c'era molto sole.|هوا گرم بود و آفتاب زیادی بود.
Abbiamo mangiato il pesce in un piccolo ristorante.|در یک رستوران کوچک ماهی خوردیم.
La sera sono tornato a casa stanco ma contento.|عصر خسته ولی راضی به خانه برگشتم.`),
  gloss: G("sabato=شنبه|scorso=گذشته|sono=(فعل کمکی)|andato=رفته|al=به (a+il)|mare=دریا|con=با|due=دو|amici=دوستان|abbiamo=(فعل کمکی)|preso=گرفته|il=حرف تعریف|treno=قطار|alle=ساعت|nove=نه|faceva=بود (هوا)|caldo=گرم|e=و|c'era=بود، وجود داشت|molto=زیاد|sole=آفتاب|mangiato=خورده|pesce=ماهی|in=در|un=یک|piccolo=کوچک|ristorante=رستوران|la=حرف تعریف|sera=عصر|tornato=برگشته|a=به|casa=خانه|stanco=خسته|ma=ولی|contento=راضی"),
  qs: [m('چرا از {faceva} استفاده شده؟', ['توصیف پس‌زمینه', 'رویداد تمام‌شده', 'آینده'], 0, '{imperfetto} برای توصیف است.', 'گذشته')] },
{ id: 'opinion', level: 'B1', title: 'زندگی در شهر یا روستا', it: 'Città o campagna?', kind: 'متن', grammar: ['congiuntivo'],
  lines: L(`Molte persone pensano che la vita in città sia più interessante.|بسیاری فکر می‌کنند زندگی در شهر جالب‌تر است.
Secondo me, però, la campagna offre una qualità di vita migliore.|ولی به نظر من، روستا کیفیت زندگی بهتری دارد.
L'aria è più pulita e i ritmi sono più lenti.|هوا پاک‌تر و ریتم زندگی کندتر است.
Tuttavia, se dovessi cercare lavoro, sceglierei una grande città.|با این حال، اگر دنبال کار بودم، شهری بزرگ را انتخاب می‌کردم.`),
  gloss: G("molte=بسیاری|persone=افراد|pensano=فکر می‌کنند|che=که|la=حرف تعریف|vita=زندگی|in=در|città=شهر|sia=باشد (congiuntivo)|più=بیشتر|interessante=جالب|secondo=طبق|me=من|però=اما|campagna=روستا|offre=ارائه می‌دهد|una=یک|qualità=کیفیت|di=از|migliore=بهتر|l'aria=هوا|è=است|pulita=پاک|e=و|i=حرف تعریف جمع|ritmi=ریتم‌ها|sono=هستند|lenti=کند|tuttavia=با این حال|se=اگر|dovessi=اگر باید|cercare=جست‌وجو کردن|lavoro=کار|sceglierei=انتخاب می‌کردم|grande=بزرگ"),
  qs: [m('نویسنده کدام را برای کیفیت زندگی ترجیح می‌دهد؟', ['روستا', 'شهر بزرگ', 'هیچ‌کدام'], 0, '{la campagna offre una qualità di vita migliore}.')] },
{ id: 'colloquio', level: 'B1', title: 'مصاحبهٔ کاری', it: 'Il colloquio', kind: 'گفت‌وگو', grammar: ['condizionale'],
  lines: L(`Direttrice|Mi parli della sua esperienza.|از تجربه‌تان بگویید.
Candidato|Ho lavorato tre anni come ingegnere a Teheran.|سه سال در تهران مهندس بودم.
Direttrice|Perché vorrebbe lavorare con noi?|چرا می‌خواهید با ما کار کنید؟
Candidato|Perché la vostra azienda è innovativa e vorrei crescere professionalmente.|چون شرکت شما نوآور است و می‌خواهم از نظر حرفه‌ای رشد کنم.`),
  gloss: G("mi=به من|parli=بگویید (امری رسمی)|della=از|sua=شما (ملکی)|esperienza=تجربه|ho=(فعل کمکی)|lavorato=کار کرده|tre=سه|anni=سال|come=به‌عنوان|ingegnere=مهندس|a=در|perché=چرا؛ چون|vorrebbe=می‌خواستید|lavorare=کار کردن|con=با|noi=ما|la=حرف تعریف|vostra=شما|azienda=شرکت|è=است|innovativa=نوآور|e=و|vorrei=می‌خواهم|crescere=رشد کردن|professionalmente=حرفه‌ای"),
  qs: [m('{Mi parli} چه لحنی دارد؟', ['رسمی', 'خودمانی', 'عامیانه'], 0, 'شکل امری رسمی است.', 'لحن')] },
{ id: 'ai', level: 'B2', title: 'هوش مصنوعی و کار', it: 'Intelligenza artificiale e lavoro', kind: 'متن', grammar: ['ipotetico'],
  lines: L(`Sebbene l'intelligenza artificiale crei nuove opportunità, molti temono di perdere il lavoro.|اگرچه هوش مصنوعی فرصت‌های تازه می‌آفریند، بسیاری از از دست دادن شغل می‌ترسند.
Se le aziende investissero di più nella formazione, i lavoratori potrebbero adattarsi più facilmente.|اگر شرکت‌ها بیشتر روی آموزش سرمایه‌گذاری می‌کردند، کارکنان راحت‌تر سازگار می‌شدند.
La vera sfida, dunque, non è tecnologica ma sociale.|پس چالش واقعی نه فناورانه، بلکه اجتماعی است.`),
  gloss: G("sebbene=اگرچه|l'intelligenza=هوش (با حرف تعریف)|intelligenza=هوش|artificiale=مصنوعی|crei=بیافریند|nuove=تازه|opportunità=فرصت‌ها|molti=بسیاری|temono=می‌ترسند|di=از|perdere=از دست دادن|il=حرف تعریف|lavoro=کار|se=اگر|le=حرف تعریف|aziende=شرکت‌ها|investissero=سرمایه‌گذاری می‌کردند|più=بیشتر|nella=در|formazione=آموزش|i=حرف تعریف|lavoratori=کارکنان|potrebbero=می‌توانستند|adattarsi=سازگار شدن|facilmente=به‌آسانی|la=حرف تعریف|vera=واقعی|sfida=چالش|dunque=پس|non=نه|è=است|tecnologica=فناورانه|ma=بلکه|sociale=اجتماعی"),
  qs: [m('به نظر نویسنده چالش اصلی چیست؟', ['اجتماعی', 'فناورانه', 'مالی'], 0, '{non è tecnologica ma sociale}.'), m('{sebbene} با کدام وجه آمده؟', ['congiuntivo', 'indicativo', 'imperativo'], 0, '{crei} وجه التزامی است.', 'congiuntivo')] },
{ id: 'lingua', level: 'C1', title: 'زبان و هویت', it: 'Lingua e identità', kind: 'متن', grammar: ['concordanza', 'registro'],
  lines: L(`Ritenere che una lingua sia un semplice strumento di comunicazione significa trascurarne la dimensione identitaria.|این باور که زبان ابزاری ساده برای ارتباط است، به معنای نادیده گرفتن بعد هویتی آن است.
Pur riconoscendo l'utilità dell'inglese come lingua franca, non si può ignorare il rischio di un impoverimento culturale.|با وجود پذیرفتن سودمندی انگلیسی به‌عنوان زبان میانجی، نمی‌توان خطر فقر فرهنگی را نادیده گرفت.
Chi avesse creduto che la globalizzazione avrebbe cancellato i dialetti si sarebbe ingannato.|هر کس گمان می‌کرد جهانی‌شدن گویش‌ها را از میان خواهد برد، در اشتباه بود.`),
  gloss: G("ritenere=باور داشتن|che=که|una=یک|lingua=زبان|sia=باشد|un=یک|semplice=ساده|strumento=ابزار|di=از|comunicazione=ارتباط|significa=معنا می‌دهد|trascurarne=نادیده گرفتنِ آن|la=حرف تعریف|dimensione=بعد|identitaria=هویتی|pur=با وجود|riconoscendo=پذیرفتن|l'utilità=سودمندی|dell'inglese=انگلیسی|come=به‌عنوان|franca=میانجی|non=نه|si=(ضمیر)|può=می‌توان|ignorare=نادیده گرفتن|il=حرف تعریف|rischio=خطر|impoverimento=فقیر شدن|culturale=فرهنگی|chi=هر کس|avesse=داشت (کمکی)|creduto=باور کرده|globalizzazione=جهانی‌شدن|avrebbe=(کمکی آینده در گذشته)|cancellato=پاک کرده|i=حرف تعریف|dialetti=گویش‌ها|sarebbe=(کمکی)|ingannato=فریب خورده"),
  qs: [m('لحن متن چیست؟', ['دانشگاهی و استدلالی', 'خودمانی', 'تبلیغاتی'], 0, 'ساختار نحوی پیچیده و واژگان رسمی دارد.', 'لحن'), m('نویسنده دربارهٔ گویش‌ها چه می‌گوید؟', ['از میان نرفته‌اند', 'کاملاً نابود شده‌اند', 'مهم نیستند'], 0, 'کسانی که چنین باور داشتند اشتباه کرده‌اند.', 'استنباط')] },
];
export const textById = new Map(TEXTS.map(t => [t.id, t]));
