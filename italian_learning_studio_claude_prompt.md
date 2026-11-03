# ITALIAN LEARNING STUDIO

## Master prompt for Claude Pro Artifacts

Copy the entire **MASTER PROMPT** below into Claude (preferably Claude
Web on desktop) and ask it to build the application as an Artifact.

------------------------------------------------------------------------

# MASTER PROMPT

You are a senior product designer, Italian-language curriculum
architect, pronunciation coach, and expert React/TypeScript engineer.
Build a polished, genuinely usable Italian-learning application as a
Claude Artifact.

Product name: **ITALIAN LEARNING STUDIO --- Il tuo percorso verso la
padronanza dell'italiano**

Do not merely describe the application or provide a plan. Build the
working Artifact itself. First inspect the capabilities and constraints
of the current Artifact environment. Use only APIs, storage mechanisms,
app connections, and browser capabilities that are actually available.
Do not invent unsupported functions.

## 1. Learner profile and product goals

Create a comprehensive Italian-learning environment for a
Persian-speaking learner.

-   Interface language: Persian (Farsi), with correct RTL layout.
-   Target language: Italian, always displayed LTR.
-   Explanations and translations: Persian by default; English may be
    optional.
-   Starting level: A1. Target level: C1.
-   Curriculum: complete CEFR pathway A1, A2, B1, B2, and C1.
-   Teaching priority: pronunciation first, then vocabulary and sentence
    patterns, then grammar and communication. Integrate all skills
    throughout.
-   Teaching style: clear, practical, incremental, accurate, and
    suitable for a beginner. Explain technical linguistic terms in
    Persian.
-   Distinguish verified linguistic information, AI-generated
    explanations, synthetic audio, and community-contributed material.

The application must feel like a high-quality language-learning product,
not a generic admin dashboard.

## 2. Design and user experience

Create a premium, modern visual identity inspired by Italian editorial
design.

-   Warm ivory/off-white background.
-   Deep navy or charcoal typography.
-   Restrained Italian-green accents and occasional subtle tricolour
    details.
-   Clear hierarchy, generous spacing, refined cards, subtle borders and
    shadows.
-   Excellent readability for Persian explanations and Italian examples.
-   Responsive desktop and mobile layouts.
-   Consistent icons and reusable components.
-   Avoid clutter, childish visuals, excessive gradients, and oversized
    dashboard widgets.

Language-layout requirements: - Persian interface elements must use RTL
direction and appropriate alignment. - Italian words, sentences, IPA,
and examples must use LTR direction. - Mixed Persian/Italian text must
render punctuation, numbers, and word order correctly. - Use a
consistent font stack that supports Persian and Italian characters.

Main navigation: 1. Dashboard 2. Pronunciation Academy 3. Vocabulary Lab
4. Grammar Academy 5. Sentence & Paragraph Studio 6. Listening Lab 7.
Speaking Practice 8. Reading & Writing 9. Smart Revision 10. Tests &
Exams 11. Progress & Analytics 12. AI Italian Tutor 13. Settings

Every visible control must work or be clearly marked unavailable. Do not
leave decorative, non-functional buttons.

## 3. Dashboard

Show: - Current CEFR level and course progress. - Today's learning
plan. - Daily study streak. - Vocabulary learned and due for review. -
Recent lessons. - Pronunciation practice progress. - Skill progress:
listening, speaking, reading, writing, vocabulary, and grammar. - A
clear "Continue learning" action. - Recommended next lesson based on
actual learner progress.

Use sample data only where needed for the initial experience. Identify
demo data clearly; never imply that the learner has completed lessons
they have not completed.

## 4. Complete CEFR curriculum: A1 to C1

Create a structured curriculum for A1, A2, B1, B2, and C1. Every level
must include learning objectives, modules, sequenced lessons, vocabulary
themes, grammar topics, pronunciation targets, listening activities,
speaking tasks, reading texts, writing tasks, review checkpoints, unit
tests, and level assessments.

Do not create only level names or empty lesson cards. Populate the
initial course with real instructional content and build a maintainable
structure for adding more.

### A1 --- Beginner

Include: - Italian alphabet and spelling. - Greetings, introductions,
and courtesy. - Numbers, dates, days, months, and time. - Countries,
nationalities, and languages. - Personal information and family. - Food,
drinks, cafés, and restaurants. - Home, objects, and everyday places. -
Common adjectives and descriptions. - Daily routines and common
activities. - Present tense of regular verbs. - Essential irregular
verbs: essere, avere, fare, andare, stare, venire, potere, volere,
dovere. - Subject pronouns. - Definite and indefinite articles. - Gender
and plural formation. - Basic adjective agreement. - Simple questions
and negation. - Beginner prepositions. - C'è / ci sono. - Basic modal
constructions and possessives. - Introductory passato prossimo where
pedagogically appropriate.

### A2 --- Elementary

Include daily life, shopping, travel, transport, health, work, and
hobbies; reflexive verbs; irregular present-tense verbs; passato
prossimo with avere and essere; common past participle agreement;
introduction to imperfetto and its contrast with passato prossimo;
direct and indirect object pronouns; common combined pronoun patterns;
comparatives and superlatives; articulated prepositions; future simple;
imperative; expanded connectors and question structures.

### B1 --- Intermediate

Include narrating experiences; giving opinions and explanations; work,
education, society, culture, and travel; imperfetto vs passato prossimo
in depth; future and conditional; direct, indirect, and combined
pronouns; relative pronouns; si impersonale and si passivante; present
subjunctive and common uses; hypothetical and conditional structures;
discourse connectors; complex sentence construction; formal and informal
registers.

### B2 --- Upper-intermediate

Include abstract topics, debate, argumentation, nuanced opinions,
hypotheses, advanced subjunctive uses and tense agreement, conditional
past, periodo ipotetico, passive constructions, reported speech,
advanced pronoun usage including ci and ne, advanced prepositions and
conjunctions, register, collocations, idioms, and cohesion/coherence in
longer texts.

### C1 --- Advanced

Include complex authentic texts and extended discourse; nuance,
implication, tone, and register; advanced syntax and sentence
transformations; advanced subjunctive and sequence of tenses;
sophisticated hypothetical constructions; idiomatic expressions and
collocations; formal, academic, professional, and conversational
Italian; argumentative essays, reports, summaries, presentations,
critical reading/listening, precision, fluency, and stylistic control.

For every grammar topic provide: - Clear Persian explanation. - Italian
form or structure. - When and why it is used. - Formation rules. -
Positive, negative, and question examples where relevant. - Common
learner mistakes. - Short exercises with answers and explanations. -
Comparisons with similar structures where useful.

## 5. Pronunciation Academy --- core feature

Pronunciation must be one of the strongest and most carefully developed
parts of the application.

### Foundations

Teach the Italian alphabet and letter names; vowels A, E, I, O, U; open
and closed E/O; vowel clarity; syllable division; word stress and accent
marks; sentence rhythm and intonation.

### Consonants and spelling-to-sound rules

Teach and contrast: - C and G before A/O/U. - CI, CE, GI, GE. - CHI,
CHE, GHI, GHE. - SC before A/O/U. - SCI and SCE. - SCHI and SCHE. - GN
and GLI. - QU and GU. - S and Z, including common patterns and
exceptions. - Double consonants and their effect on meaning. - R and the
Italian tapped/rolled R. - H as a spelling marker, not an independently
pronounced sound in ordinary Italian words. - J, K, W, X, and Y in
loanwords and names. - Common spelling and pronunciation exceptions.

For each sound/rule include: - Simple Persian explanation of tongue,
lip, and mouth position. - IPA transcription when reliable. - At least
three Italian examples where possible. - Persian transliteration as an
approximate aid, explicitly labelled approximate. - Minimal pairs or
contrastive examples where useful. - Common errors by Persian
speakers. - Listening and repetition drills. - Short quiz.

Never present Persian transliteration as an exact substitute for Italian
pronunciation. Explain where the sounds differ.

### Audio modes

**A. Authentic native-speaker audio** - Use only audio that is legally
accessible and whose source/licence permits the intended use. - Prefer
Wikimedia Commons and Lingua Libre when the individual file licence
permits use. - Forvo may be considered only if its API, access, and
licensing requirements are satisfied. - Identify community/native
recording sources where possible. - Never label synthetic audio as
native-speaker audio. - Do not scrape sites or bypass access controls or
terms.

**B. Synthetic Italian speech** - Feature-detect browser speech
synthesis and available Italian voices. - Let the learner select an
available Italian voice where possible. - Provide normal-speed and
slower playback, replay, and sentence-by-sentence playback. - Clearly
label synthetic speech. - Do not promise a particular voice/accent
unless the browser actually provides it.

**C. Learner recording** - If microphone permissions and MediaRecorder
or another supported mechanism are available, allow recording and
playback of the learner's pronunciation. - Let the learner replay
reference audio and compare it with their recording. - Provide
permission and error states. - If recording is unsupported in the
Artifact environment, explain the limitation and provide a graceful
fallback. Do not show fake recording controls.

**D. Pronunciation evaluation** - Only provide a pronunciation score if
a real compatible speech-analysis capability is available and actually
used. - Distinguish transcription accuracy from pronunciation quality. -
Do not claim phoneme-level evaluation based only on speech-to-text
transcription. - If phoneme-level analysis is unavailable, provide
guided self-assessment and comparison instead of fabricated scores. - If
an AI service or connected app is required, explain setup and use only
supported connections.

## 6. Vocabulary Lab

Each vocabulary item should support: - Italian word/expression. -
Article and grammatical gender for nouns. - Plural form. - Part of
speech. - Persian meaning and optional English meaning. - IPA where
reliable. - Example sentence in Italian and Persian translation. - Audio
when available. - Topic and CEFR level. - Common collocations. - Related
words and useful opposites. - Source and verification status.

Organize vocabulary by greetings, numbers/dates/time, family,
food/drinks, home, city/directions, transport/travel, shopping/money,
education/work, health/body, feelings/personality, nature/environment,
technology/media, society/culture/current affairs, and
abstract/professional B2-C1 vocabulary.

Provide search and filters, flashcards, Italian-to-Persian and
Persian-to-Italian recall, example-based learning, pronunciation
playback, "I know it / I need practice" actions, and review scheduling.

For verbs, include infinitive, meaning, conjugation patterns, and
essential conjugated forms appropriate to the learner's level.

## 7. Sentence & Paragraph Studio

This is essential. Teach complete Italian sentences and short
paragraphs, not only isolated words.

For each text support: 1. Original Italian text. 2. Natural Persian
translation. 3. Optional word-by-word breakdown. 4. IPA or pronunciation
guidance where reliable. 5. Normal and slow audio playback where
available. 6. Vocabulary extraction. 7. Grammar structures used. 8.
Comprehension questions. 9. Translation practice. 10. Speaking and
shadowing practice.

Allow selection of a word or phrase to reveal meaning, grammatical role,
pronunciation, and example usage.

Progress from simple A1 sentences to sophisticated C1 paragraphs. Do not
give texts far above the learner's level without explanation.

Include dialogues for meeting someone, introductions, cafés, directions,
shopping, travel accommodation, daily routines, past experiences,
opinions, and professional/academic conversations.

## 8. Listening Lab

Include level-appropriate short audio passages, dialogues, and
monologues; slow/normal playback when supported; listening without
transcript and then with transcript; Persian translation after the
exercise; multiple-choice comprehension; missing-word exercises;
dictation; key vocabulary; and sentence-level replay.

Do not fabricate audio assets. Clearly label synthetic audio.

## 9. Speaking Practice

Build practical speaking scenarios with a situation and role, useful
phrases, model dialogue, optional audio, learner response area, and
suggested natural answers. Provide feedback on grammar/vocabulary only
if an actual AI capability is available.

Include introducing yourself, talking about studies, ordering food,
asking for help, making plans, describing experiences, giving opinions,
travel situations, and professional discussions.

Do not claim to assess spoken output unless speech input and analysis
genuinely work.

## 10. Reading & Writing

Reading: graded A1-C1 texts, vocabulary support, comprehension
questions, main-idea/detail questions, and inference/tone questions at
higher levels.

Writing: sentence construction, short paragraphs, messages/emails,
descriptions, narratives, opinions, arguments, formal writing, reports,
and advanced essays.

Corrections must explain what is incorrect, why, a corrected version, a
more natural alternative where appropriate, and relevant
grammar/vocabulary to review. Do not silently rewrite learner work
without explaining important changes.

## 11. AI Italian Tutor

If Claude-powered interaction is supported, include an integrated tutor
that: - Explains Italian in Persian by default and adapts to CEFR
level. - Uses simple language for A1-A2. - Corrects mistakes clearly and
respectfully. - Gives natural Italian alternatives. - Conducts role-play
conversations. - Explains grammar with examples. - Generates exercises
based on weak areas. - Quizzes without revealing answers immediately. -
Explains why an answer is wrong. - Helps with pronunciation only through
capabilities that actually exist.

The tutor must not invent linguistic rules, citations, audio sources, or
evaluation results. It should acknowledge uncertainty.

## 12. Smart Revision and spaced repetition

Implement a spaced-repetition system for vocabulary and other reviewable
items.

-   Use a documented, consistent algorithm such as SM-2 or a clearly
    explained simplified variant.
-   Track review date, interval, ease factor or equivalent, repetitions,
    and learner response.
-   Provide Again, Hard, Good, and Easy actions.
-   Build a daily review queue.
-   Prioritize overdue and difficult items.
-   Review vocabulary, grammar patterns, example sentences, and
    pronunciation targets.
-   Save progress using persistent storage actually supported by the
    current Artifact environment.

Do not claim progress is saved if persistence is unavailable. If
persistence is limited, explain what is retained and offer export/import
backup where feasible.

## 13. Tests and assessments

Include vocabulary, grammar, listening, reading, sentence construction,
translation, pronunciation (where supported), unit review, and CEFR
checkpoint tests.

For each assessment show score, explain incorrect answers, identify weak
topics, and recommend the next lesson/revision activity. Do not present
a short quiz as official CEFR certification.

## 14. Progress and analytics

Where persistent storage is available, track lessons completed, reliably
measured study time, vocabulary learned, review accuracy, grammar
mastery, listening/reading results, speaking/writing history,
pronunciation practice, level progress, streaks, and daily goals.

Use honest metrics. Do not fabricate historical activity or mark
incomplete lessons as completed.

## 15. Data, sources, and content integrity

Keep lessons, vocabulary, grammar explanations, exercises, and audio
metadata in structured, maintainable data separate from UI components.

Potential reference sources: - Treccani for authoritative Italian
lexical/language reference. - Wiktionary and Kaikki for structured
lexical data, with verification. - Wikimedia Commons and Lingua Libre
for openly licensed recordings, subject to each file's licence. -
Tatoeba for example sentences, subject to checking sentence and audio
licences. - Forvo only where access and licensing terms permit intended
use.

Do not assume a free public API exists. Do not scrape or bypass access
controls. Do not copy copyrighted dictionary/course content wholesale.
Preserve attribution and licence information where required. Verify
examples and translations before labelling them verified. Label
AI-generated content appropriately. If a source/licence is unknown, mark
it unverified and do not imply permission.

Use content labels: - VERIFIED - AI-GENERATED - AI-REVIEWED - COMMUNITY
AUDIO - SYNTHETIC AUDIO - UNVERIFIED

## 16. Technical implementation

First inspect the current Artifact environment and determine: -
Supported frontend framework and package capabilities. - Whether React
and TypeScript are supported. - Whether persistent Artifact storage is
available and its documented interface. - Whether Claude-powered
interactions are available. - Whether app/MCP connections are
available. - Whether browser speech synthesis, microphone access,
MediaRecorder, and speech recognition work.

Then implement using the supported stack. Prefer React and TypeScript if
available.

Architecture requirements: - Modular components and reusable UI. -
Structured curriculum data. - Separate models for lessons, vocabulary,
grammar, exercises, audio, and progress. - Clear state management. -
Robust empty, loading, success, and error states. - Responsive and
accessible controls. - Keyboard-friendly interactions. - No
non-functional buttons. - No fake API calls or fabricated audio/results.

If a capability is unavailable: do not pretend it works; explain the
limitation; implement the best honest fallback; and keep the
architecture ready for a future supported integration.

Do not expose API keys or secrets in client-side code. Use only
supported secure connection mechanisms.

## 17. Minimum functional first release

The first build must be usable immediately. Do not stop after creating a
dashboard or visual shell.

At minimum implement: - Complete navigation structure. - Working
dashboard. - Structured A1-C1 curriculum map. - Genuinely taught first
A1 unit. - Pronunciation starter course with core spelling-to-sound
rules. - At least one fully developed A1 grammar lesson. - Vocabulary
deck with working flashcards. - Functional quiz with answer feedback. -
Sentence & Paragraph Studio with several A1 examples and Persian
translations. - Supported audio playback with honest labels. -
Recording/comparison if supported. - Working revision queue. - Progress
tracking and persistence if supported. - Settings for language, audio,
and study preferences.

The learner must be able to complete a lesson, answer a quiz, review
vocabulary, and see progress change.

## 18. Quality assurance

Before finishing, test: - All navigation items. - All buttons and
interactive controls. - Persian RTL and Italian LTR. - Mixed-script
punctuation and alignment. - Mobile and desktop responsiveness. - Lesson
completion flow. - Quiz scoring and explanations. - Flashcard
interactions. - Review scheduling. - Progress updates. - Persistence
after refresh, if supported. - Audio playback and speed controls. -
Microphone permission and recording, if supported. - Error handling when
permissions/capabilities are unavailable.

Fix visible errors and broken interactions before declaring the Artifact
complete.

## 19. Final delivery

Build the actual working Artifact, not a written proposal.

When complete, provide a concise report stating: 1. What is implemented
and functional. 2. Which CEFR levels and lessons contain real content.
3. Which audio features work in the current environment. 4. Whether
learner recordings and pronunciation evaluation are supported. 5. How
progress is saved. 6. Which features require a supported app connection
or future integration. 7. Known limitations.

Prioritize correctness, educational quality, and working interactions
over decorative feature count. Do not claim a feature is complete unless
implemented and tested.

------------------------------------------------------------------------

# FOLLOW-UP PROMPT 1 --- COMPLETE THE A1 COURSE

Audit the A1 curriculum in the current Artifact. Do not redesign the
application unnecessarily. Focus on educational completeness and
instructional quality. Expand A1 into a coherent, properly sequenced
course with substantial real lesson content. For each lesson include
Persian explanations, Italian examples, natural Persian translations,
vocabulary, grammar, pronunciation targets, exercises, answer keys, and
feedback. Include greetings, introductions, numbers, dates, time,
family, countries, food, home, daily routines, present tense, essere,
avere, common irregular verbs, articles, gender, plural, adjective
agreement, basic prepositions, questions, negation, c'è/ci sono, and
essential modal verbs. Ensure every lesson opens and can be completed,
exercises work, and completion updates progress. Do not use empty
placeholder lessons or claim content exists when it does not.

# FOLLOW-UP PROMPT 2 --- AUDIT AUDIO AND PRONUNCIATION

Focus exclusively on the audio and pronunciation system. Inspect what is
genuinely supported in this Artifact environment. Test Italian browser
speech synthesis, voice selection, normal/slow playback, microphone
permissions, recording, and replay. Clearly distinguish authentic
licensed native-speaker recordings from synthetic speech. Verify the
source and licence of any external recording. Improve lessons for GN,
GLI, CI/CE, GI/GE, CHI/CHE, GHI/GHE, SCI/SCE, SCHI/SCHE, QU/GU, S/Z,
double consonants, open/closed E/O, stress, and intonation. Add Persian
explanations, IPA where reliable, examples, contrasts, and practice. Do
not invent recordings, voice availability, pronunciation scores, or
phoneme-level analysis. If true pronunciation assessment is unavailable,
provide a useful record-and-compare workflow and label its limitations
honestly.

# FOLLOW-UP PROMPT 3 --- END-TO-END QUALITY AUDIT

Perform a complete end-to-end quality audit of the current Italian
Learning Studio Artifact. Test every navigation item, button, lesson,
quiz, flashcard, review action, progress update, settings control, and
supported audio feature. Check Persian RTL and Italian LTR rendering,
mixed-script text, mobile responsiveness, accessibility, and persistence
after refresh. Find and fix broken interactions, misleading labels,
empty screens, incorrect language direction, inconsistent lesson data,
and runtime errors. Verify that the A1 learning flow can be completed
from start to finish. Do not merely report issues: fix what you can. Do
not claim a feature works unless tested. Finish with a concise list of
verified working features and remaining limitations.

------------------------------------------------------------------------

## Practical note

For the most reliable build and debugging experience, use Claude on
desktop. Before building, check Claude's current Artifact capabilities
and enable any required options for code execution or file creation.
Artifact capabilities can change, so inspect the live environment rather
than assuming every browser API, external service, or storage method is
available.
