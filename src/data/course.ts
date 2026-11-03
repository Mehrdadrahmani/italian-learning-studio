import type { Exercise, Lesson, LevelPlan } from '../types';

const m = (q: string, opts: string[], a: number, why: string, tag = 'درس'): Exercise => ({ k: 'mcq', q, opts, a, why, tag });
const f = (q: string, a: string[], why: string, fa?: string): Exercise => ({ k: 'fill', q, a, why, fa, tag: 'درس' });
const o = (fa: string, words: string[], why: string): Exercise => ({ k: 'order', fa, words, why, tag: 'ساخت جمله' });
const L = (l: Omit<Lesson, 'level'>, level: Lesson['level'] = 'A1'): Lesson => ({ ...l, level });

export const COURSE: LevelPlan[] = [
{ id: 'A1', title: 'مبتدی', summary: 'در پایان A1 می‌توانید خودتان را معرفی کنید، در کافه سفارش دهید، زمان و مکان را بگویید و جمله‌های ساده بسازید.',
  objectives: ['خواندن درست هر واژهٔ ایتالیایی', 'معرفی خود و خانواده', 'سفارش غذا و پرسیدن قیمت و مسیر', 'صحبت دربارهٔ کارهای روزانه در زمان حال'],
  themes: ['سلام', 'عدد و زمان', 'خانواده', 'غذا', 'خانه', 'شهر'], grammar: ['essere', 'avere', 'articles', 'gender', 'adjectives', 'present', 'irregular', 'modals', 'questions', 'prepositions', 'ce', 'possessives', 'passato-intro'],
  pron: ['alphabet', 'vowels', 'syllables', 'c-g-hard', 'ci-ce', 'gi-ge', 'chi-che', 'gn', 'gli', 'double', 'h'],
  listening: 'گفت‌وگوهای کوتاه کافه و آشنایی', speaking: 'معرفی خود و سفارش دادن', reading: 'متن ساده دربارهٔ روز روزمره', writing: 'چند جملهٔ معرفی و پیام کوتاه',
  modules: [
  { title: 'واحد ۱: نخستین گام‌ها', lessons: [
    L({ id: 'a1-1', title: 'الفبا و صداها', it: "L'alfabeto", goal: 'حروف و مصوت‌ها را بشناسید و بخوانید.', intro: 'نوشتار ایتالیایی بسیار منظم است. اگر قواعد را بدانید تقریباً هر واژه را می‌توانید بخوانید. از مصوت‌ها شروع می‌کنیم.', pron: 'vowels', ex: [m('چند مصوت نوشتاری داریم؟', ['۵', '۶', '۷'], 0, '{a e i o u}.'), m('حرف {h} در {ho}:', ['تلفظ نمی‌شود', 'مثل ه', 'مثل خ'], 0, 'h بی‌صداست.')] }),
    L({ id: 'a1-2', title: 'سلام و خوش‌آمد', it: 'Ciao e buongiorno', goal: 'سلام و خداحافظی رسمی و خودمانی را به کار ببرید.', intro: 'در ایتالیایی {ciao} برای دوستان است. با افراد ناآشنا {buongiorno} یا {buonasera} بگویید. برای تشکر {grazie} و در پاسخ {prego}.', pron: 'ci-ce', topics: ['greet'], vocabLimit: 10, text: 'meet', ex: [m('به مدیرتان صبح چه می‌گویید؟', ['Buongiorno', 'Ciao', 'Ehi'], 0, 'در موقعیت رسمی {buongiorno}.'), f('«Grazie.» «___.»', ['prego'], 'پاسخ رایج به تشکر.'), o('اسم من ساراست.', ['Mi', 'chiamo', 'Sara'], 'الگو: {mi chiamo} + نام.')] }),
    L({ id: 'a1-3', title: 'من کی هستم؟ فعل essere', it: 'Chi sono?', goal: 'خود، ملیت و شغل را بگویید.', intro: 'با فعل {essere} خودتان را معرفی می‌کنید. به مطابقت توجه کنید: مرد می‌گوید {iraniano} و زن {iraniana}.', grammar: ['essere'], topics: ['verbs'], vocabIds: ['verbs-essere'], ex: [m('زن ایرانی می‌گوید:', ['Sono iraniana.', 'Sono iraniano.', 'È iraniani.'], 0, 'صفت مؤنث.'), f('Noi ___ studenti.', ['siamo'], '{noi} + {siamo}.', 'ما دانشجو هستیم.')] }),
    L({ id: 'a1-4', title: 'عددها و سن', it: 'I numeri', goal: 'تا صد بشمارید و سن و قیمت بگویید.', intro: 'سن در ایتالیایی با «داشتن» گفته می‌شود: {Ho vent\'anni}. عددها را با صدای بلند تکرار کنید.', grammar: ['avere'], topics: ['num'], vocabLimit: 10, pron: 'double', ex: [m('«سی سال دارم» چیست؟', ['Ho trent\'anni.', 'Sono trent\'anni.', 'Faccio trent\'anni.'], 0, 'سن با {avere}.'), m('{quattro} یعنی:', ['چهار', 'پنج', 'سه'], 0, 'quattro = ۴.')] }),
  ] },
  { title: 'واحد ۲: اسم‌ها و توصیف', lessons: [
    L({ id: 'a1-5', title: 'حروف تعریف و اسم‌ها', it: 'Articoli e nomi', goal: 'اسم را با حرف تعریف درست به کار ببرید.', intro: 'جنس دستوری در فارسی نیست، پس هر اسم را با حرف تعریفش حفظ کنید: {la casa}, نه فقط {casa}.', grammar: ['articles', 'gender'], topics: ['home'], vocabLimit: 10, ex: [m('___ finestra', ['la', 'il', 'lo'], 0, 'مؤنث.'), f('جمع {la camera}: le ___', ['camere'], '{-a → -e}.')] }),
    L({ id: 'a1-6', title: 'خانواده و مالکیت', it: 'La mia famiglia', goal: 'دربارهٔ خانواده حرف بزنید.', intro: 'صفت ملکی با چیزی که مالکیت می‌شود مطابقت دارد. با خویشاوندان مفرد حرف تعریف نمی‌آید: {mia madre}.', grammar: ['possessives'], pron: 'gli', topics: ['family'], ex: [m('«برادرم»:', ['mio fratello', 'il mio fratello', 'mia fratello'], 0, 'خویشاوند مفرد.'), f('___ sorella è medico. (من)', ['mia'], 'مؤنث مفرد.')] }),
    L({ id: 'a1-7', title: 'توصیف افراد و چیزها', it: 'Descrivere', goal: 'صفت‌ها را هماهنگ کنید.', intro: 'صفت معمولاً بعد از اسم می‌آید و با آن مطابقت دارد.', grammar: ['adjectives'], topics: ['feel'], vocabLimit: 7, ex: [f('La pizza è ___ (buono).', ['buona'], 'مؤنث.'), m('I libri sono ___.', ['belli', 'bella', 'bello'], 0, 'مذکر جمع.')] }),
  ] },
  { title: 'واحد ۳: زندگی روزمره', lessons: [
    L({ id: 'a1-8', title: 'در کافه', it: 'Al bar', goal: 'سفارش دهید و قیمت بپرسید.', intro: 'کلید مودب بودن کلمهٔ {vorrei} است. با {per favore} و {grazie} جمله را کامل کنید.', grammar: ['modals'], topics: ['food'], vocabLimit: 10, text: 'bar', pron: 'double', ex: [m('درخواست مودبانه:', ['Vorrei un caffè.', 'Dammi caffè.', 'Caffè!'], 0, '{vorrei} مودبانه است.'), o('چقدر می‌شود؟', ['Quanto', 'costa?'], 'پرسش قیمت.')] }),
    L({ id: 'a1-9', title: 'فعل‌های حال منظم', it: 'Il presente', goal: 'کارهای روزانه را بگویید.', intro: 'پایانهٔ فعل نشان می‌دهد چه کسی کار را انجام می‌دهد.', grammar: ['present'], text: 'routine', vocabIds: ['verbs-parlare', 'verbs-leggere', 'verbs-scrivere', 'verbs-dormire', 'verbs-capire', 'work-studiare', 'work-lavorare'], ex: [f('Voi ___ (parlare) bene.', ['parlate'], 'پایانهٔ {-ate}.'), m('Loro ___.', ['dormono', 'dormano', 'dormiamo'], 0, 'گروه {-ire}.')] }),
    L({ id: 'a1-10', title: 'رفتن، آمدن، انجام دادن', it: 'Fare, andare, venire', goal: 'فعل‌های نامنظم پرکاربرد را به کار ببرید.', intro: 'این فعل‌ها در تقریباً هر گفت‌وگو می‌آیند. جدول را با صدای بلند بخوانید.', grammar: ['irregular'], vocabIds: ['verbs-fare', 'verbs-andare', 'verbs-stare', 'verbs-venire'], ex: [f('Io ___ (fare) colazione.', ['faccio'], 'نامنظم.'), m('Dove ___ (tu)?', ['vai', 'vadi', 'andi'], 0, 'نامنظم.')] }),
    L({ id: 'a1-11', title: 'پرسیدن و نفی', it: 'Domande', goal: 'سؤال بپرسید و پاسخ منفی بدهید.', intro: 'در ایتالیایی ترتیب جمله در پرسش بله/خیر عوض نمی‌شود. آهنگ صدا را بالا ببرید.', grammar: ['questions'], pron: 'intonation', ex: [m('«کجا زندگی می‌کنی؟»', ['Dove abiti?', 'Quando abiti?', 'Chi abiti?'], 0, '{dove} یعنی کجا.')] }),
    L({ id: 'a1-12', title: 'شهر و مسیر', it: 'In città', goal: 'مسیر را بپرسید و بفهمید.', intro: "با {c'è} می‌پرسید چیزی هست یا نه، و با {dov'è} جای آن را می‌پرسید.", grammar: ['ce', 'prepositions'], topics: ['city'], vocabLimit: 10, text: 'directions', ex: [m("___ una farmacia qui vicino?", ["C'è", 'Ci sono', 'Sono'], 0, 'مفرد.'), f('Vado ___ Italia.', ['in'], 'کشور با {in}.')] }),
    L({ id: 'a1-13', title: 'نخستین نگاه به گذشته و مرور A1', it: 'Ripasso A1', goal: 'گذشته را بشناسید و A1 را مرور کنید.', intro: 'در پایان A1 با گذشته آشنا می‌شوید. سپس آزمون نقطهٔ بازبینی A1 را در بخش آزمون‌ها بدهید.', grammar: ['passato-intro'], ex: [m('«دیروز کار کردم.»', ['Ieri ho lavorato.', 'Ieri lavoro.', 'Ieri sono lavorato.'], 0, '{lavorare} با {avere}.')] }),
  ] },
  ] },
{ id: 'A2', title: 'پایه', summary: 'می‌توانید دربارهٔ گذشته، برنامه‌ها، سفر و کارهای روزمره صحبت کنید.', objectives: ['بیان رویدادهای گذشته', 'خرید و سفر', 'به کار بردن ضمایر مفعولی', 'بیان برنامه‌های آینده'],
  themes: ['خرید', 'سفر', 'سلامت', 'کار', 'سرگرمی'], grammar: ['passato', 'reflexive', 'imperfetto', 'pronouns', 'futuro'], pron: ['sc-hard', 'sci-sce', 'qu-gu', 's-z', 'r'],
  listening: 'اعلان‌های ایستگاه و گفت‌وگوی هتل', speaking: 'توصیف آخر هفته و گزارش مشکل در سفر', reading: 'روایت‌های کوتاه', writing: 'ایمیل غیررسمی و روایت کوتاه',
  modules: [{ title: 'واحد ۱: گذشته و سفر', lessons: [
    L({ id: 'a2-1', title: 'گذشتهٔ نزدیک', it: 'Il passato prossimo', goal: 'رویدادهای تمام‌شده را بگویید.', intro: 'انتخاب {avere} یا {essere} مهم‌ترین نکته است.', grammar: ['passato'], text: 'weekend', ex: [m('«رسیدیم.»', ['Siamo arrivati.', 'Abbiamo arrivato.', 'Arriviamo ieri.'], 0, '{arrivare} با {essere}.')] }, 'A2'),
    L({ id: 'a2-2', title: 'در هتل و سفر', it: 'In viaggio', goal: 'رزرو کنید و سؤال بپرسید.', intro: 'زبان سفر را با گفت‌وگوی هتل تمرین کنید.', topics: ['travel'], text: 'hotel', grammar: ['reflexive'], ex: [f('Ho una ___ a nome Rahimi.', ['prenotazione'], 'رزرو.')] }, 'A2'),
  ], planned: [{ title: 'imperfetto در برابر گذشتهٔ نزدیک' }, { title: 'ضمایر ترکیبی' }, { title: 'مقایسه و صفت عالی' }, { title: 'حروف اضافهٔ ترکیبی' }, { title: 'وجه امری' }, { title: 'خرید و سلامت' }] }] },
{ id: 'B1', title: 'میانی', summary: 'می‌توانید تجربه‌ها را روایت کنید، نظر بدهید و دربارهٔ کار و جامعه حرف بزنید.', objectives: ['بیان نظر و استدلال ساده', 'استفاده از وجه التزامی پرکاربرد', 'تمایز رسمی و غیررسمی'],
  themes: ['کار', 'تحصیل', 'جامعه', 'فرهنگ'], grammar: ['condizionale', 'congiuntivo', 'relatives'], pron: ['open-eo'], listening: 'مصاحبه‌های کوتاه', speaking: 'بحث دربارهٔ نظر شخصی', reading: 'مقالهٔ ساده', writing: 'ایمیل رسمی و بیان نظر',
  modules: [{ title: 'واحد ۱: نظر و کار', lessons: [
    L({ id: 'b1-1', title: 'بیان نظر', it: 'Secondo me', goal: 'با congiuntivo نظر بدهید.', intro: 'عبارت‌های {penso che} و {credo che} وجه التزامی می‌خواهند.', grammar: ['congiuntivo'], text: 'opinion', ex: [m('Credo che ___ vero.', ['sia', 'è', 'essere'], 0, 'پس از {credo che}.')] }, 'B1'),
    L({ id: 'b1-2', title: 'زبان حرفه‌ای', it: 'Il mondo del lavoro', goal: 'مودبانه و رسمی حرف بزنید.', intro: 'در محیط کار از شکل {Lei} و شرطی استفاده کنید.', grammar: ['condizionale'], text: 'colloquio', topics: ['work'], vocabLimit: 8, ex: [m('رسمی‌تر:', ['Vorrebbe un caffè?', 'Vuoi un caffè?', 'Caffè?'], 0, 'شرطی مودبانه.')] }, 'B1'),
  ], planned: [{ title: 'si impersonale و si passivante' }, { title: 'ربط‌دهنده‌های گفتمان' }, { title: 'روایت در گذشته به‌صورت عمیق' }] }] },
{ id: 'B2', title: 'میانی بالا', summary: 'می‌توانید دربارهٔ موضوعات انتزاعی بحث و استدلال کنید.', objectives: ['ساخت فرضیه', 'بحث و استدلال', 'نقل قول غیرمستقیم'], themes: ['فناوری', 'جامعه', 'علم'], grammar: ['ipotetico', 'ci-ne', 'passive'], pron: [],
  listening: 'میزگرد و خبر', speaking: 'دفاع از یک موضع', reading: 'مقالهٔ مطبوعاتی', writing: 'متن استدلالی',
  modules: [{ title: 'واحد ۱: بحث و فرضیه', lessons: [
    L({ id: 'b2-1', title: 'فرضیه و شرط', it: 'Se fossi...', goal: 'سه نوع شرط را به کار ببرید.', intro: 'با شرط‌های پیچیده، موضوع‌های انتزاعی را بحث کنید.', grammar: ['ipotetico'], text: 'ai', topics: ['abstract'], vocabLimit: 6, ex: [m('Se ___ tempo, verrei.', ['avessi', 'avrei', 'ho avuto'], 0, 'نوع دوم.')] }, 'B2'),
  ], planned: [{ title: 'نقل قول غیرمستقیم' }, { title: 'مجهول پیشرفته' }, { title: 'همنشینی واژگان و اصطلاحات' }, { title: 'انسجام متن' }] }] },
{ id: 'C1', title: 'پیشرفته', summary: 'متن‌های پیچیده را می‌فهمید و با دقت و سبک مناسب می‌نویسید.', objectives: ['درک متن معتبر و طولانی', 'کنترل سبک و لحن', 'نوشتن مقاله و گزارش'], themes: ['فرهنگ', 'دانشگاه', 'حرفه'], grammar: ['concordanza', 'registro'], pron: [],
  listening: 'سخنرانی و بحث دانشگاهی', speaking: 'ارائهٔ حرفه‌ای', reading: 'مقالهٔ دانشگاهی', writing: 'مقاله و گزارش',
  modules: [{ title: 'واحد ۱: متن و سبک', lessons: [
    L({ id: 'c1-1', title: 'زبان و هویت', it: 'Lingua e identità', goal: 'متن دانشگاهی را تحلیل کنید.', intro: 'این متن برای سطح C1 است و نحو پیشرفته دارد. به توالی زمان‌ها و لحن دقت کنید.', grammar: ['concordanza', 'registro'], text: 'lingua', ex: [m('رسمی‌تر از {perché}:', ['poiché', 'però', 'quindi'], 0, '{poiché} رسمی‌تر است.')] }, 'C1'),
  ], planned: [{ title: 'نوشتن مقاله' }, { title: 'گزارش و خلاصه' }, { title: 'ارائهٔ شفاهی' }, { title: 'نقد متن' }] }] },
];

export const LESSONS: Lesson[] = COURSE.flatMap(l => l.modules.flatMap(x => x.lessons));
export const lessonById = new Map(LESSONS.map(l => [l.id, l]));
