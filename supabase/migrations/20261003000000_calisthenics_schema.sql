-- ==============================================================================
-- Supabase Schema Migration: Calisthenics Mobile PWA & AI Coach (Андрій)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Table: Workouts (6-day training schedule templates)
-- ------------------------------------------------------------------------------
create table if not exists public.workouts (
    id uuid primary key default gen_random_uuid(),
    day_number integer not null unique check (day_number between 1 and 7),
    title text not null,
    focus text not null,
    description text,
    is_rest boolean not null default false,
    exercises jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 2. Table: Workout Sessions (logged training session headers)
-- ------------------------------------------------------------------------------
create table if not exists public.workout_sessions (
    id uuid primary key default gen_random_uuid(),
    workout_id uuid references public.workouts(id) on delete set null,
    athlete_name text not null default 'Андрій',
    started_at timestamptz not null default now(),
    completed_at timestamptz,
    status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
    notes text,
    coach_verdict text,
    coach_recommendations jsonb,
    total_duration_seconds integer default 0,
    created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 3. Table: Exercise Logs (individual set details per session)
-- ------------------------------------------------------------------------------
create table if not exists public.exercise_logs (
    id uuid primary key default gen_random_uuid(),
    session_id uuid not null references public.workout_sessions(id) on delete cascade,
    exercise_name text not null,
    set_number integer not null,
    reps_completed integer,
    hold_seconds_completed integer,
    weight_kg numeric(5,2) default 0,
    is_completed boolean not null default true,
    rpe integer check (rpe between 1 and 10),
    notes text,
    created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 4. Table: Progress Photos (body composition & calisthenics shapes)
-- ------------------------------------------------------------------------------
create table if not exists public.progress_photos (
    id uuid primary key default gen_random_uuid(),
    athlete_name text not null default 'Андрій',
    photo_url text not null,
    storage_path text not null,
    pose text not null check (pose in ('front', 'side', 'back', 'handstand', 'planche', 'front_lever', 'other')),
    weight_kg numeric(5,2) not null default 66.0,
    taken_at date not null default current_date,
    notes text,
    created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 5. Storage Bucket Configuration: progress-photos
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'progress-photos',
    'progress-photos',
    true,
    10485760, -- 10MB limit
    array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do update set
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

-- ------------------------------------------------------------------------------
-- 6. Row Level Security (RLS) & Policies
-- ------------------------------------------------------------------------------
alter table public.workouts enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.progress_photos enable row level security;

-- Permissive policies for personal PWA use (Anon & Authenticated)
create policy "Allow all access to workouts"
    on public.workouts for all
    using (true) with check (true);

create policy "Allow all access to workout_sessions"
    on public.workout_sessions for all
    using (true) with check (true);

create policy "Allow all access to exercise_logs"
    on public.exercise_logs for all
    using (true) with check (true);

create policy "Allow all access to progress_photos"
    on public.progress_photos for all
    using (true) with check (true);

-- Storage bucket policies
create policy "Public Access to progress-photos"
    on storage.objects for select
    using (bucket_id = 'progress-photos');

create policy "Allow Uploads to progress-photos"
    on storage.objects for insert
    with check (bucket_id = 'progress-photos');

create policy "Allow Updates/Deletes to progress-photos"
    on storage.objects for delete
    using (bucket_id = 'progress-photos');

-- ------------------------------------------------------------------------------
-- 7. Seed Data: 6-Day Calisthenics Schedule tailored for Андрій
-- ------------------------------------------------------------------------------
insert into public.workouts (day_number, title, focus, description, is_rest, exercises)
values
(
    1,
    'Push A (Handstand + Planche Focus)',
    'Баланс у стійці та статика плечей',
    'Акцент на тиск пучками пальців (fingertip pressure), контроль ребер (hollow body), Planche Lean на низьких паралетсах із максимальною протракцією.',
    false,
    '[
        {
            "id": "w1-1",
            "name": "Handstand Chest-to-Wall + Heel Pulls",
            "type": "isometric",
            "target_sets": 4,
            "hold_seconds": 25,
            "rest_seconds": 90,
            "equipment": "Стіна",
            "cue": "Живіт до стіни, ребра втоплені (hollow body), активний тиск пальцями для відриву п''ят від стіни без прогину в попереку."
        },
        {
            "id": "w1-2",
            "name": "Freestanding Handstand Kick-up Practice",
            "type": "isometric",
            "target_sets": 5,
            "hold_seconds": 15,
            "rest_seconds": 90,
            "equipment": "Вільний простір / паралетси",
            "cue": "М''який вихід, не перелітати. Гасити інерцію вказівними та великими пальцями. Погляд між зап''ястями."
        },
        {
            "id": "w1-3",
            "name": "Parallettes Planche Lean (Active Protraction)",
            "type": "isometric",
            "target_sets": 4,
            "hold_seconds": 18,
            "rest_seconds": 90,
            "equipment": "Низькі паралетси",
            "cue": "Кругла верхня спина, плечі висунуті далеко вперед за кисті, таз у нейтралі, стиснуті сідниці. Нуль дискомфорту в суглобах."
        },
        {
            "id": "w1-4",
            "name": "Tuck Planche Hold / Eccentric Drops",
            "type": "isometric",
            "target_sets": 4,
            "hold_seconds": 10,
            "rest_seconds": 120,
            "equipment": "Низькі паралетси",
            "cue": "Коліна до грудей, максимальний пуш від підлоги, лікті повністю заблоковані (locked elbows)."
        },
        {
            "id": "w1-5",
            "name": "Dips на брусах з паузою внизу",
            "type": "reps",
            "target_sets": 4,
            "target_reps": 10,
            "rest_seconds": 90,
            "equipment": "Бруси",
            "cue": "Глибокий контроль, лікті не розводити в боки, пауза 1 сек у нижній точці, потужний витиск із фіксацією верху."
        },
        {
            "id": "w1-6",
            "name": "Планш-відтискання (Pseudo Planche Push-ups)",
            "type": "reps",
            "target_sets": 3,
            "target_reps": 10,
            "rest_seconds": 60,
            "equipment": "Паралетси / підлога",
            "cue": "Постійний нахил уперед у верхній точці, максимальна протракція лопаток."
        }
    ]'::jsonb
),
(
    2,
    'Pull A (Front Lever + Explosive Pulls)',
    'Горизонтальна тяга та передній вис',
    'Робота над переходом з Advanced Tuck до One-leg Front Lever та потужними Front Lever Rows.',
    false,
    '[
        {
            "id": "w2-1",
            "name": "One-Leg Front Lever Hold (Alternating)",
            "type": "isometric",
            "target_sets": 4,
            "hold_seconds": 8,
            "rest_seconds": 120,
            "equipment": "Турнік",
            "cue": "Пряма лінія від голови до витягнутої стопи. Лопатки опущені та зведені (retraction + depression), руки заблоковані."
        },
        {
            "id": "w2-2",
            "name": "Advanced Tuck Front Lever Hold",
            "type": "isometric",
            "target_sets": 4,
            "hold_seconds": 12,
            "rest_seconds": 90,
            "equipment": "Турнік",
            "cue": "Кут 90° у колінах та тазу, плоска спина, таз на одній лінії з плечима."
        },
        {
            "id": "w2-3",
            "name": "Adv. Tuck Front Lever Rows",
            "type": "reps",
            "target_sets": 4,
            "target_reps": 6,
            "rest_seconds": 120,
            "equipment": "Турнік / низька перекладина",
            "cue": "Тягнути перекладину до нижніх ребер / таза. Повна амплітуда без падіння таза."
        },
        {
            "id": "w2-4",
            "name": "Вибухові підтягування до грудей (High Pull-ups)",
            "type": "reps",
            "target_sets": 4,
            "target_reps": 6,
            "rest_seconds": 90,
            "equipment": "Турнік",
            "cue": "Потужний зрив спиною, дотик перекладини нижче ключиць."
        },
        {
            "id": "w2-5",
            "name": "Підтягування зворотним хватом (L-sit Chin-ups)",
            "type": "reps",
            "target_sets": 3,
            "target_reps": 8,
            "rest_seconds": 90,
            "equipment": "Турнік",
            "cue": "Ноги строго горизонтально під 90 градусів, повне скорочення біцепса й найширших."
        }
    ]'::jsonb
),
(
    3,
    'Legs + Core (Сила ніг без компресії спини)',
    'Фронтальний присід, румунка, L-sit',
    'Розвиток квадрицепсів та заднього ланцюга зі штангою без перевантаження попереку.',
    false,
    '[
        {
            "id": "w3-1",
            "name": "Фронтальний присід зі штангою (Front Squat)",
            "type": "reps",
            "target_sets": 4,
            "target_reps": 8,
            "weight_kg": 50,
            "rest_seconds": 120,
            "equipment": "Штанга",
            "cue": "Високі лікті, вертикальний корпус, контрольований спуск нижче паралелі. Нуль завалювання спини."
        },
        {
            "id": "w3-2",
            "name": "Болгарські спліт-присідання (Bulgarian Split Squats)",
            "type": "reps",
            "target_sets": 3,
            "target_reps": 10,
            "weight_kg": 20,
            "rest_seconds": 90,
            "equipment": "Штанга / гантелі / вага",
            "cue": "Задня нога на лаві, глибокий випад, коліно опорної ноги стабільне, навантаження в сідницю та квадріцепс."
        },
        {
            "id": "w3-3",
            "name": "Румунська тяга зі штангою (RDL)",
            "type": "reps",
            "target_sets": 4,
            "target_reps": 10,
            "weight_kg": 55,
            "rest_seconds": 90,
            "equipment": "Штанга",
            "cue": "Відведення таза назад, легкий вигин колін, штанга ковзає по стегнах. Розтяг біцепса стегна без круглення попереку."
        },
        {
            "id": "w3-4",
            "name": "L-sit Hold на низьких паралетсах",
            "type": "isometric",
            "target_sets": 4,
            "hold_seconds": 20,
            "rest_seconds": 60,
            "equipment": "Низькі паралетси",
            "cue": "Активна депресія плечей, ноги прямі як струни, носочки натягнуті від себе."
        },
        {
            "id": "w3-5",
            "name": "Підйом ніг до перекладини (Toes-to-Bar)",
            "type": "reps",
            "target_sets": 3,
            "target_reps": 12,
            "rest_seconds": 60,
            "equipment": "Турнік",
            "cue": "Строгий підйом без кіпінгу, повільний негатив 2 секунди."
        }
    ]'::jsonb
),
(
    4,
    'День 4: Відпочинок і відновлення',
    'Повне відновлення ЦНС і зв''язок',
    'Мобільність зап''ясть, плечей та тазостегнових суглобів. Прогулянка, розтяжка, легка ванна або МФР.',
    true,
    '[]'::jsonb
),
(
    5,
    'Upper Power (HSPU + Archer + FL Negatives)',
    'Потужність верху тіла та ексцентрика',
    'Відтискання в стійці на руках, лучні підтягування та підконтрольні негативи переднього вису.',
    false,
    '[
        {
            "id": "w5-1",
            "name": "Wall Handstand Push-ups (Back-to-Wall / Chest-to-Wall)",
            "type": "reps",
            "target_sets": 4,
            "target_reps": 6,
            "rest_seconds": 120,
            "equipment": "Стіна / паралетси",
            "cue": "Штатив (tripod head position), лікті під 45 градусів уперед, потужний жим угору."
        },
        {
            "id": "w5-2",
            "name": "Archer Pull-ups (Лучні підтягування)",
            "type": "reps",
            "target_sets": 4,
            "target_reps": 6,
            "rest_seconds": 90,
            "equipment": "Турнік",
            "cue": "Одна рука тягне потужно, інша пряма допомагає по перекладині. Повна амплітуда."
        },
        {
            "id": "w5-3",
            "name": "Full Front Lever Slow Negatives",
            "type": "reps",
            "target_sets": 4,
            "target_reps": 4,
            "rest_seconds": 120,
            "equipment": "Турнік",
            "cue": "Підйом в інвертований вис, повільний спуск 4-5 секунд у горизонталь і контроль фази переднього вису."
        },
        {
            "id": "w5-4",
            "name": "Глибокі відтискання на брусах з нахилом уперед",
            "type": "reps",
            "target_sets": 3,
            "target_reps": 12,
            "rest_seconds": 90,
            "equipment": "Бруси",
            "cue": "Акцент на нижній пучок грудних і передню дельту. Фіксація верху."
        },
        {
            "id": "w5-5",
            "name": "Face Pulls / Тяга до обличчя на низькій перекладині",
            "type": "reps",
            "target_sets": 3,
            "target_reps": 15,
            "rest_seconds": 60,
            "equipment": "Низька перекладина / бруси",
            "cue": "Зовнішнє обертання плеча для здоров''я ротаторної манжети."
        }
    ]'::jsonb
),
(
    6,
    'Legs B + Handstand Skill',
    'Унілатеральна сила ніг та баланс',
    'Пістолетики, спліт-присіди та відточування вільного балансу в стійці на руках.',
    false,
    '[
        {
            "id": "w6-1",
            "name": "Handstand Line & Alignment Drills",
            "type": "isometric",
            "target_sets": 5,
            "hold_seconds": 20,
            "rest_seconds": 90,
            "equipment": "Вільний простір",
            "cue": "Відкриті плечі (open shoulders), стиснуті сідниці, пряма лінія без прогину банана."
        },
        {
            "id": "w6-2",
            "name": "Pistol Squats (Присідання на одній нозі)",
            "type": "reps",
            "target_sets": 3,
            "target_reps": 8,
            "rest_seconds": 90,
            "equipment": "Власна вага",
            "cue": "П''ята опорної ноги притиснута, вільна нога витягнута вперед, плавний спуск."
        },
        {
            "id": "w6-3",
            "name": "Болгарські присідання з паузою внизу",
            "type": "reps",
            "target_sets": 3,
            "target_reps": 10,
            "weight_kg": 25,
            "rest_seconds": 90,
            "equipment": "Штанга / гантелі",
            "cue": "Пауза 1.5 сек у максимальному розтягу квадріцепса."
        },
        {
            "id": "w6-4",
            "name": "Підйом на носки на одній нозі зі штангою",
            "type": "reps",
            "target_sets": 4,
            "target_reps": 15,
            "weight_kg": 30,
            "rest_seconds": 60,
            "equipment": "Штанга",
            "cue": "Повний піковий скорот і розтяг ахілла."
        },
        {
            "id": "w6-5",
            "name": "V-Ups (Складка на прес)",
            "type": "reps",
            "target_sets": 3,
            "target_reps": 15,
            "rest_seconds": 60,
            "equipment": "Килимок",
            "cue": "Одночасний підйом корпусу й прямих ніг з дотиком стоп."
        }
    ]'::jsonb
),
(
    7,
    'День 7: Відпочинок і аналіз тижня',
    'Повне розвантаження перед новим мікроциклом',
    'Сауна, гідратація, аналіз фото форми та консультація з AI-тренером щодо коригування навантаження на наступний тиждень.',
    true,
    '[]'::jsonb
)
on conflict (day_number) do update set
    title = excluded.title,
    focus = excluded.focus,
    description = excluded.description,
    is_rest = excluded.is_rest,
    exercises = excluded.exercises;
