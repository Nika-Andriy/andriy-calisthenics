# 🦾 Andriy Calisthenics & AI Coach (iOS PWA)

Повноцінний прогресивний вебдодаток (PWA) для тренувань з калістеніки, адаптований під iOS (iPhone Safe Area, Haptic feedback, Web Audio, Glassmorphism), з інтегрованим персональним ШІ-тренером на базі **Google Gemini 2.5/3.8 Flash** та базою даних **Supabase**.

---

## 📱 Ключові можливості

1. **6-денний мікроцикл калістеніки під інвентар та цілі Андрія:**
   - **День 1: Push A** (Handstand + Planche Focus на низьких паралетсах, Hollow body, fingertip pressure).
   - **День 2: Pull A** (Front Lever: перехід Adv. Tuck → One-leg, Front Lever Rows).
   - **День 3: Legs + Core** (Фронтальний присід, болгарські спліти, румунська тяга без осьового перевантаження попереку, L-sit).
   - **День 4:** Відпочинок і мобільність.
   - **День 5: Upper Power** (HSPU біля стіни, лучні підтягування, негативи Front Lever).
   - **День 6: Legs B + HS Skill** (Пістолетики, баланс у стійці на руках).
   - **День 7:** Відпочинок та аналіз тижня.

2. **Активний режим тренування (Workout Session Mode):**
   - Інтерактивні чекбокси сетів з фіксацією фактичних секунд/повторень і ваги.
   - Вбудований плаваючий секундомір ізометрії (Handstand, Planche hold, L-sit) з точністю до мілісекунд та кнопкою швидкого внесення результату в активний підхід.
   - Автоматичний таймер відпочинку (пресети 60s / 90s / 120s) з аудіо-гогом (Web Audio API) та вібро-відгуком (Haptics).
   - Швидкі замітки атлета щодо суглобів, RPE та помилок.

3. **ШІ-Тренер на базі Gemini (@google/genai):**
   - Аналіз виконаного об'єму та коментарів атлета.
   - Персоналізований біомеханічний вердикт, оцінка сесії (1-10) та точні корективи на наступне тренування.
   - Інтерактивний чат для технічних консультацій щодо елементів.

4. **Галерея прогресу та форми:**
   - Збереження фотографій (Front, Side, Back, Handstand, Planche, Front Lever) через iPhone камеру або медіатеку в Supabase Storage.
   - Фіксація ваги та дати.
   - Повноекранне порівняння «До» і «Після» (пліч-о-пліч або інтерактивний спліт-слайдер).

5. **iOS & PWA оптимізація:**
   - `manifest.json` та iOS-метатеги (`apple-mobile-web-app-capable`, `black-translucent`).
   - Підтримка Safe Area (Notch, Dynamic Island, Home indicator).
   - Запобігання автозумуванню Safari на інпутах.

---

## 🛠 Швидкий запуск

### 1. Встановлення залежностей
```bash
npm install
```

### 2. Налаштування змінних оточення
Створіть `.env.local` на основі `.env.example`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Запуск сервера розробки
```bash
npm run dev
```
Відкрийте `http://localhost:3000` у браузері або Safari на iPhone.

### 4. Встановлення як PWA на iPhone:
1. Відкрийте додаток у Safari на iPhone.
2. Натисніть кнопку «Поділитися» (Share).
3. Виберіть «На початковий екран» (Add to Home Screen).
4. Додаток відкриватиметься на весь екран як нативний iOS додаток без рамок браузера!
