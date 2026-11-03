import type { Exercise, ListeningItem, ReadingItem, SpeakingScenario, WritingTask } from '../types';
import { textById } from './texts';

const m = (q: string, opts: string[], a: number, why: string): Exercise => ({ k: 'mcq', q, opts, a, why, tag: 'شنیداری' });
const lines = (id: string) => textById.get(id)!.lines;

export const LISTENING: ListeningItem[] = [
{ id: 'l-bar', level: 'A1', title: 'سفارش در کافه', lines: lines('bar'), keywords: ['vorrei', 'quanto costa', 'ecco a lei'], qs: [m('مشتری چه می‌خواهد؟', ['قهوه و کورنتو', 'چای', 'آب'], 0, '{un caffè e un cornetto}.'), m('چقدر پرداخت می‌کند؟', ['سه یورو', 'ده یورو', 'یک یورو'], 0, '{Sono tre euro}.')],
  gap: { before: 'Vorrei un', a: 'caffè', after: 'e un cornetto, per favore.' }, dict: 'Sono tre euro.', dictFa: 'سه یورو می‌شود.' },
{ id: 'l-meet', level: 'A1', title: 'آشنایی سارا و علی', lines: lines('meet'), keywords: ['mi chiamo', 'di dove sei', 'piacere'], qs: [m('علی چه ملیتی دارد؟', ['ایرانی', 'ایتالیایی', 'فرانسوی'], 0, '{Sono iraniano}.')],
  gap: { before: 'Sono di', a: 'Teheran', after: '. E tu?' }, dict: 'Di dove sei?', dictFa: 'اهل کجایی؟' },
{ id: 'l-routine', level: 'A1', title: 'روز علی', lines: lines('routine'), keywords: ['ogni mattina', 'in autobus', 'presto'], qs: [m('علی کجا زندگی می‌کند؟', ['میلان', 'رم', 'تهران'], 0, '{abito a Milano}.')],
  gap: { before: 'Poi vado a', a: 'scuola', after: 'in autobus.' }, dict: 'Faccio colazione alle otto.', dictFa: 'ساعت هشت صبحانه می‌خورم.' },
{ id: 'l-hotel', level: 'A2', title: 'پذیرش هتل', lines: lines('hotel'), keywords: ['prenotazione', 'inclusa', 'valigia'], qs: [m('صبحانه تا چه ساعتی است؟', ['ده', 'هفت', 'دوازده'], 0, '{dalle sette alle dieci}.')],
  gap: { before: 'La colazione è', a: 'inclusa', after: '?' }, dict: 'Ho una prenotazione.', dictFa: 'رزرو دارم.' },
{ id: 'l-weekend', level: 'A2', title: 'آخر هفته در دریا', lines: lines('weekend'), keywords: ['sabato scorso', 'faceva caldo', 'stanco ma contento'], qs: [m('راوی چه خورد؟', ['ماهی', 'پیتزا', 'پاستا'], 0, '{il pesce}.')],
  gap: { before: 'Faceva', a: 'caldo', after: "e c'era molto sole." }, dict: 'Sono andato al mare.', dictFa: 'به دریا رفتم.' },
{ id: 'l-work', level: 'B1', title: 'مصاحبهٔ کاری', lines: lines('colloquio'), keywords: ['esperienza', 'azienda', 'crescere'], qs: [m('داوطلب چند سال تجربه دارد؟', ['سه سال', 'یک سال', 'ده سال'], 0, '{tre anni}.')],
  gap: { before: 'Ho lavorato tre anni come', a: 'ingegnere', after: 'a Teheran.' }, dict: 'Perché vorrebbe lavorare con noi?', dictFa: 'چرا می‌خواهید با ما کار کنید؟' },
{ id: 'l-ai', level: 'B2', title: 'هوش مصنوعی و کار', lines: lines('ai'), keywords: ['formazione', 'sfida', 'opportunità'], qs: [m('راه‌حل پیشنهادی نویسنده چیست؟', ['سرمایه‌گذاری در آموزش', 'ممنوعیت فناوری', 'کاهش کار'], 0, '{nella formazione}.')],
  gap: { before: 'La vera', a: 'sfida', after: ', dunque, non è tecnologica ma sociale.' }, dict: 'La vera sfida è sociale.', dictFa: 'چالش واقعی اجتماعی است.' },
];

const S = (id: string, level: SpeakingScenario['level'], title: string, situation: string, role: string, phrases: string, model: string, prompt: string, answers: string): SpeakingScenario => ({
  id, level, title, situation, role, prompt,
  phrases: phrases.split('\n').map(x => { const [it, fa] = x.split('|'); return { it, fa }; }),
  model: model.split('\n').map(x => { const [sp, it, fa] = x.split('|'); return { sp, it, fa }; }),
  answers: answers.split('\n').map(x => { const [it, fa] = x.split('|'); return { it, fa }; }),
});
export const SPEAKING: SpeakingScenario[] = [
S('s-intro', 'A1', 'معرفی خود', 'در کلاس ایتالیایی با یک هم‌کلاسی آشنا می‌شوید.', 'شما تازه‌وارد هستید.', 'Mi chiamo...|اسم من ... است\nSono di...|اهل ... هستم\nAbito a...|در ... زندگی می‌کنم', 'A|Ciao, come ti chiami?|سلام، اسمت چیست؟\nB|Mi chiamo Reza. Sono di Shiraz.|اسم من رضاست. اهل شیرازم.', 'خودتان را در سه جمله معرفی کنید.', 'Mi chiamo Ali, sono iraniano e abito a Roma.|اسم من علی است، ایرانی هستم و در رم زندگی می‌کنم.'),
S('s-study', 'A1', 'صحبت دربارهٔ درس', 'از شما می‌پرسند چه می‌خوانید.', 'شما دانشجو هستید.', 'Studio...|می‌خوانم ...\nAll\'università di...|در دانشگاه ...', 'A|Che cosa studi?|چه می‌خوانی؟\nB|Studio ingegneria a Milano.|در میلان مهندسی می‌خوانم.', 'بگویید چه می‌خوانید و کجا.', 'Studio informatica all\'università di Teheran.|در دانشگاه تهران رایانه می‌خوانم.'),
S('s-food', 'A1', 'سفارش غذا', 'در یک رستوران هستید.', 'شما مشتری هستید.', 'Vorrei...|می‌خواهم ...\nIl conto, per favore.|صورت‌حساب لطفاً.\nCosa consiglia?|چه پیشنهاد می‌کنید؟', 'A|Buonasera, cosa prende?|عصر بخیر، چه میل دارید؟\nB|Vorrei una pizza e un\'acqua.|یک پیتزا و یک آب می‌خواهم.', 'یک غذا و نوشیدنی سفارش دهید.', 'Vorrei la pasta al pomodoro e un\'acqua frizzante, per favore.|پاستا با گوجه و یک آب گازدار لطفاً.'),
S('s-help', 'A1', 'درخواست کمک', 'راه را گم کرده‌اید.', 'شما گردشگر هستید.', 'Scusi, può aiutarmi?|ببخشید، می‌توانید کمکم کنید؟\nNon capisco.|نمی‌فهمم.\nPuò ripetere?|می‌توانید تکرار کنید؟', 'A|Scusi, può aiutarmi?|ببخشید، می‌توانید کمکم کنید؟\nB|Certo, mi dica.|البته، بفرمایید.', 'کمک بخواهید و بپرسید ایستگاه کجاست.', 'Scusi, può aiutarmi? Dov\'è la stazione?|ببخشید، می‌توانید کمکم کنید؟ ایستگاه کجاست؟'),
S('s-plans', 'A2', 'برنامه‌ریزی', 'می‌خواهید با دوستی قرار بگذارید.', 'پیشنهاد دهنده.', 'Che fai sabato?|شنبه چه کار می‌کنی؟\nTi va di...?|دوست داری ...؟\nVa bene!|باشه!', 'A|Che fai sabato?|شنبه چه کار می‌کنی؟\nB|Niente. Ti va di andare al cinema?|هیچی. دوست داری به سینما برویم؟', 'برای آخر هفته قرار بگذارید.', 'Ti va di andare al mare domenica?|دوست داری یکشنبه به دریا برویم؟'),
S('s-past', 'A2', 'توصیف تجربه', 'از سفر اخیرتان تعریف کنید.', 'راوی.', 'L\'anno scorso...|پارسال ...\nÈ stato bellissimo.|خیلی زیبا بود.', 'A|Cosa hai fatto ieri?|دیروز چه کار کردی؟\nB|Sono andato al mare.|به دریا رفتم.', 'بگویید دیروز چه کردید.', 'Ieri ho studiato e poi sono uscito con gli amici.|دیروز درس خواندم و بعد با دوستان بیرون رفتم.'),
S('s-travel', 'A2', 'موقعیت سفر', 'بلیت قطار می‌خرید.', 'مسافر.', 'Un biglietto per...|یک بلیت برای ...\nA che ora parte?|ساعت چند حرکت می‌کند؟', 'A|Vorrei un biglietto per Roma.|یک بلیت رم می‌خواهم.\nB|Andata e ritorno?|رفت و برگشت؟', 'بلیت بخرید و ساعت حرکت را بپرسید.', 'Un biglietto per Firenze. A che ora parte il treno?|یک بلیت فلورانس. قطار ساعت چند حرکت می‌کند؟'),
S('s-opinion', 'B1', 'بیان نظر', 'دربارهٔ شبکه‌های اجتماعی بحث می‌شود.', 'شرکت‌کننده.', 'Secondo me...|به نظر من ...\nNon sono d\'accordo.|موافق نیستم.', 'A|Cosa ne pensi?|نظرت چیست؟\nB|Penso che siano utili ma pericolosi.|فکر می‌کنم مفید ولی خطرناک هستند.', 'نظرتان را با یک دلیل بگویید.', 'Secondo me i social sono utili, però bisogna usarli con attenzione.|به نظر من شبکه‌های اجتماعی مفیدند، ولی باید با احتیاط استفاده شوند.'),
S('s-pro', 'B2', 'بحث حرفه‌ای', 'در جلسه پروژه‌ای را پیشنهاد می‌دهید.', 'مدیر پروژه.', 'Vorrei proporre...|می‌خواهم پیشنهاد کنم ...\nDal mio punto di vista...|از دیدگاه من ...', 'A|Quali sono i rischi?|ریسک‌ها چیست؟\nB|Il rischio principale riguarda i tempi.|ریسک اصلی مربوط به زمان‌بندی است.', 'یک پیشنهاد و یک ریسک را بیان کنید.', 'Vorrei proporre una nuova strategia, anche se comporta qualche rischio.|می‌خواهم راهبرد تازه‌ای پیشنهاد کنم، اگرچه ریسکی دارد.'),
];

export const READING: ReadingItem[] = [
{ id: 'r-routine', level: 'A1', title: 'روز علی', textId: 'routine', note: 'متن ساده با فعل حال.', qs: [m('موضوع اصلی متن چیست؟', ['یک روز علی', 'سفر به رم', 'شغل پدر'], 0, 'متن برنامهٔ روزانه را می‌گوید.')] },
{ id: 'r-weekend', level: 'A2', title: 'آخر هفته', textId: 'weekend', note: 'روایت در گذشته.', qs: [m('احساس راوی در پایان:', ['خسته و راضی', 'غمگین', 'عصبانی'], 0, '{stanco ma contento}.')] },
{ id: 'r-opinion', level: 'B1', title: 'شهر یا روستا', textId: 'opinion', note: 'متن نظری.', qs: [m('چرا نویسنده شهر را برای کار انتخاب می‌کند؟', ['فرصت کار بیشتر (استنباط)', 'هوای پاک', 'ریتم کند'], 0, 'از {se dovessi cercare lavoro} برمی‌آید.')] },
{ id: 'r-ai', level: 'B2', title: 'هوش مصنوعی', textId: 'ai', note: 'متن استدلالی.', qs: [m('لحن متن چگونه است؟', ['تحلیلی', 'شوخ‌طبعانه', 'تبلیغی'], 0, 'نویسنده استدلال می‌کند.')] },
{ id: 'r-lingua', level: 'C1', title: 'زبان و هویت', textId: 'lingua', note: 'متن دانشگاهی سطح C1؛ اگر هنوز به این سطح نرسیده‌اید، با ترجمه بخوانید.', qs: [m('منظور از {impoverimento culturale} چیست؟', ['فقیر شدن فرهنگی', 'فقر مالی', 'مهاجرت'], 0, 'در بافت متن یعنی کم شدن تنوع فرهنگی.')] },
];

export const WRITING: WritingTask[] = [
{ id: 'w-intro', level: 'A1', title: 'معرفی خود', prompt: 'در ۳ تا ۵ جمله خودتان را معرفی کنید.', hints: ['Mi chiamo...', 'Sono di...', 'Studio...'], sample: 'Mi chiamo Ali. Sono iraniano e abito a Teheran. Studio italiano ogni giorno.', sampleFa: 'اسم من علی است. ایرانی‌ام و در تهران زندگی می‌کنم. هر روز ایتالیایی می‌خوانم.' },
{ id: 'w-msg', level: 'A1', title: 'پیام کوتاه', prompt: 'به دوستتان پیام دهید و قرار بگذارید.', hints: ['Ciao!', 'Sei libero?', 'A presto!'], sample: 'Ciao Marco! Sei libero domani? Andiamo al bar. A presto!', sampleFa: 'سلام مارکو! فردا آزادی؟ برویم کافه. تا بعد!' },
{ id: 'w-narr', level: 'A2', title: 'روایت', prompt: 'دربارهٔ آخر هفتهٔ گذشته بنویسید.', hints: ['Sabato...', 'Poi...', 'Alla fine...'], sample: 'Sabato sono andato al cinema con mia sorella. Poi abbiamo mangiato una pizza.', sampleFa: 'شنبه با خواهرم به سینما رفتم. بعد پیتزا خوردیم.' },
{ id: 'w-mail', level: 'B1', title: 'ایمیل رسمی', prompt: 'برای شرکتی ایمیل بنویسید و دربارهٔ یک موقعیت شغلی بپرسید.', hints: ['Gentile...', 'Le scrivo per...', 'Cordiali saluti'], sample: 'Gentile Dottoressa Rossi, Le scrivo per avere informazioni sulla posizione di ingegnere. Cordiali saluti.', sampleFa: 'خانم دکتر روسی گرامی، برای دریافت اطلاعات دربارهٔ موقعیت مهندسی می‌نویسم. با احترام.' },
{ id: 'w-arg', level: 'B2', title: 'متن استدلالی', prompt: 'موافق یا مخالف کار از راه دور؟ با دو دلیل بنویسید.', hints: ['Da un lato...', "D'altra parte...", 'In conclusione...'], sample: "Da un lato, il lavoro da remoto riduce gli spostamenti; d'altra parte, può isolare le persone. In conclusione, serve un equilibrio.", sampleFa: 'از یک سو، کار از راه دور رفت‌وآمد را کم می‌کند؛ از سوی دیگر، ممکن است افراد را منزوی کند. در نتیجه، تعادل لازم است.' },
{ id: 'w-essay', level: 'C1', title: 'مقالهٔ کوتاه', prompt: 'دربارهٔ رابطهٔ زبان و هویت یک بند استدلالی بنویسید.', hints: ['Benché...', 'Ne consegue che...', 'Alla luce di ciò...'], sample: 'Benché la lingua sia spesso considerata un mero strumento, essa plasma il pensiero. Ne consegue che perdere una lingua significa perdere una visione del mondo.', sampleFa: 'اگرچه زبان اغلب صرفاً ابزار دانسته می‌شود، اندیشه را شکل می‌دهد. در نتیجه از دست دادن یک زبان یعنی از دست دادن یک جهان‌بینی.' },
];
