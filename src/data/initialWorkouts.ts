import { Workout } from '@/types';

export const INITIAL_WORKOUTS: Workout[] = [
  {
    day_number: 1,
    title: "Push A (Handstand + Planche Focus)",
    focus: "Баланс у стійці та статика плечей",
    description: "Акцент на fingertip pressure, hollow body, Planche Lean на низьких паралетсах із максимальною протракцією.",
    is_rest: false,
    exercises: [
      {
        id: "w1-1",
        name: "Handstand Chest-to-Wall + Heel Pulls",
        type: "isometric",
        target_sets: 4,
        hold_seconds: 25,
        rest_seconds: 90,
        equipment: "Стіна",
        cue: "Живіт до стіни, ребра втоплені (hollow body), активний тиск пальцями для відриву п'ят від стіни без прогину в попереку."
      },
      {
        id: "w1-2",
        name: "Freestanding Handstand Kick-up Practice",
        type: "isometric",
        target_sets: 5,
        hold_seconds: 15,
        rest_seconds: 90,
        equipment: "Вільний простір / паралетси",
        cue: "М'який вихід, не перелітати. Гасити інерцію подушечками пальців. Погляд між зап'ястями."
      },
      {
        id: "w1-3",
        name: "Parallettes Planche Lean (Active Protraction)",
        type: "isometric",
        target_sets: 4,
        hold_seconds: 18,
        rest_seconds: 90,
        equipment: "Низькі паралетси",
        cue: "Кругла верхня спина, плечі далеко вперед за кисті, таз у нейтралі, стиснуті сідниці. Нуль болю в суглобах."
      },
      {
        id: "w1-4",
        name: "Tuck Planche Hold / Eccentric Drops",
        type: "isometric",
        target_sets: 4,
        hold_seconds: 10,
        rest_seconds: 120,
        equipment: "Низькі паралетси",
        cue: "Коліна до грудей, максимальний пуш від підлоги, лікті повністю заблоковані (locked elbows)."
      },
      {
        id: "w1-5",
        name: "Dips на брусах з паузою внизу",
        type: "reps",
        target_sets: 4,
        target_reps: 10,
        rest_seconds: 90,
        equipment: "Бруси",
        cue: "Глибокий контроль, лікті не розводити в боки, пауза 1 сек у нижній точці, потужний витиск."
      },
      {
        id: "w1-6",
        name: "Pseudo Planche Push-ups",
        type: "reps",
        target_sets: 3,
        target_reps: 10,
        rest_seconds: 60,
        equipment: "Паралетси / підлога",
        cue: "Постійний нахил уперед у верхній точці, повна протракція лопаток при фіксації."
      }
    ]
  },
  {
    day_number: 2,
    title: "Pull A (Front Lever + Explosive Pulls)",
    focus: "Горизонтальна тяга та передній вис",
    description: "Перехід з Advanced Tuck до One-leg Front Lever та потужні Front Lever Rows.",
    is_rest: false,
    exercises: [
      {
        id: "w2-1",
        name: "One-Leg Front Lever Hold (Alternating)",
        type: "isometric",
        target_sets: 4,
        hold_seconds: 8,
        rest_seconds: 120,
        equipment: "Турнік",
        cue: "Пряма лінія від голови до витягнутої стопи. Лопатки опущені та зведені, руки прямі як струни."
      },
      {
        id: "w2-2",
        name: "Advanced Tuck Front Lever Hold",
        type: "isometric",
        target_sets: 4,
        hold_seconds: 12,
        rest_seconds: 90,
        equipment: "Турнік",
        cue: "Кут 90° у колінах та тазу, плоска спина, таз на висоті плечей."
      },
      {
        id: "w2-3",
        name: "Adv. Tuck Front Lever Rows",
        type: "reps",
        target_sets: 4,
        target_reps: 6,
        rest_seconds: 120,
        equipment: "Турнік / низька перекладина",
        cue: "Тягнути перекладину до нижніх ребер. Повна амплітуда без провисання таза."
      },
      {
        id: "w2-4",
        name: "High Explosive Pull-ups до грудей",
        type: "reps",
        target_sets: 4,
        target_reps: 6,
        rest_seconds: 90,
        equipment: "Турнік",
        cue: "Потужний зрив спиною, дотик нижче ключиць без розкачки."
      },
      {
        id: "w2-5",
        name: "L-sit Chin-ups",
        type: "reps",
        target_sets: 3,
        target_reps: 8,
        rest_seconds: 90,
        equipment: "Турнік",
        cue: "Кут ніг строго 90°, максимальне пікове скорочення найширших."
      }
    ]
  },
  {
    day_number: 3,
    title: "Legs + Core (Фронтальний присід, румунка, L-sit)",
    focus: "Сила ніг без осьової компресії та кор",
    description: "Гіпертрофія квадрицепсів та задньої поверхні зі штангою без перевантаження попереку.",
    is_rest: false,
    exercises: [
      {
        id: "w3-1",
        name: "Фронтальний присід зі штангою (Front Squat)",
        type: "reps",
        target_sets: 4,
        target_reps: 8,
        weight_kg: 50,
        rest_seconds: 120,
        equipment: "Штанга",
        cue: "Високі лікті, вертикальний корпус, глибина нижче паралелі. Спина зафіксована."
      },
      {
        id: "w3-2",
        name: "Болгарські спліт-присідання",
        type: "reps",
        target_sets: 3,
        target_reps: 10,
        weight_kg: 20,
        rest_seconds: 90,
        equipment: "Штанга / гантелі",
        cue: "Задня нога на лаві, плавний контроль опускання, фокус на сідницю та квадріцепс."
      },
      {
        id: "w3-3",
        name: "Румунська тяга зі штангою (RDL)",
        type: "reps",
        target_sets: 4,
        target_reps: 10,
        weight_kg: 55,
        rest_seconds: 90,
        equipment: "Штанга",
        cue: "Таз відводиться назад, гриф ковзає по стегнах. Відчутний натяг задньої поверхні стегна."
      },
      {
        id: "w3-4",
        name: "L-sit Hold на низьких паралетсах",
        type: "isometric",
        target_sets: 4,
        hold_seconds: 20,
        rest_seconds: 60,
        equipment: "Низькі паралетси",
        cue: "Потужна депресія лопаток, ноги абсолютно прямі, носки витягнуті."
      },
      {
        id: "w3-5",
        name: "Toes-to-Bar (Підйом ніг до турніка)",
        type: "reps",
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        equipment: "Турнік",
        cue: "Строге виконання без розгойдування, підконтрольний негатив."
      }
    ]
  },
  {
    day_number: 4,
    title: "День 4: Відпочинок і відновлення",
    focus: "Регенерація ЦНС і зв'язок",
    description: "Мобільність кистей, плечей і тазу. Прогулянка, якісний сон, легкий стретчинг.",
    is_rest: true,
    exercises: []
  },
  {
    day_number: 5,
    title: "Upper Power (HSPU + Archer + FL Negatives)",
    focus: "Вибухова сила та ексцентричний контроль",
    description: "Відтискання у стійці біля стіни, лучні підтягування та повільні негативи переднього вису.",
    is_rest: false,
    exercises: [
      {
        id: "w5-1",
        name: "Wall Handstand Push-ups (HSPU)",
        type: "reps",
        target_sets: 4,
        target_reps: 6,
        rest_seconds: 120,
        equipment: "Стіна / паралетси",
        cue: "Штативне положення голови (трикутник), лікті під кутом 45°, прес зафіксований."
      },
      {
        id: "w5-2",
        name: "Archer Pull-ups (Лучні підтягування)",
        type: "reps",
        target_sets: 4,
        target_reps: 6,
        rest_seconds: 90,
        equipment: "Турнік",
        cue: "Тягова рука працює на повну амплітуду, допоміжна абсолютно пряма."
      },
      {
        id: "w5-3",
        name: "Full Front Lever Slow Negatives",
        type: "reps",
        target_sets: 4,
        target_reps: 4,
        rest_seconds: 120,
        equipment: "Турнік",
        cue: "Підйом вгору, спуск 4-5 секунд через повний горизонт з прямою лінією тіла."
      },
      {
        id: "w5-4",
        name: "Dips з нахилом уперед на брусах",
        type: "reps",
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 90,
        equipment: "Бруси",
        cue: "Глибоке розтягнення грудних та дельт, вибуховий підйом."
      },
      {
        id: "w5-5",
        name: "Face Pulls на низькій перекладині",
        type: "reps",
        target_sets: 3,
        target_reps: 15,
        rest_seconds: 60,
        equipment: "Низька перекладина",
        cue: "Зовнішнє обертання плечей для балансу дельтоподібних і ротаторів."
      }
    ]
  },
  {
    day_number: 6,
    title: "Legs B + Handstand Skill",
    focus: "Унілатеральна сила та баланс стійки",
    description: "Пістолетики, спліт-присідання та вільний баланс у стійці на руках.",
    is_rest: false,
    exercises: [
      {
        id: "w6-1",
        name: "Handstand Freestanding Alignment & Balance",
        type: "isometric",
        target_sets: 5,
        hold_seconds: 20,
        rest_seconds: 90,
        equipment: "Вільний простір",
        cue: "Відкриті плечі, втоплені ребра, балансування подушечками пальців."
      },
      {
        id: "w6-2",
        name: "Pistol Squats (Присідання на одній нозі)",
        type: "reps",
        target_sets: 3,
        target_reps: 8,
        rest_seconds: 90,
        equipment: "Власна вага",
        cue: "П'ята притиснута, вільна нога паралельна підлозі, повний контроль коліна."
      },
      {
        id: "w6-3",
        name: "Болгарські спліт-присіди з паузою 1.5с",
        type: "reps",
        target_sets: 3,
        target_reps: 10,
        weight_kg: 25,
        rest_seconds: 90,
        equipment: "Штанга / гантелі",
        cue: "Чітка фіксація розтягу внизу, виштовхування п'ятою."
      },
      {
        id: "w6-4",
        name: "Підйом на носки на одній нозі зі штангою",
        type: "reps",
        target_sets: 4,
        target_reps: 15,
        weight_kg: 30,
        rest_seconds: 60,
        equipment: "Штанга",
        cue: "Пікове скорочення литкових, повний розтяг ахілла."
      },
      {
        id: "w6-5",
        name: "V-Ups (Складка на прес)",
        type: "reps",
        target_sets: 3,
        target_reps: 15,
        rest_seconds: 60,
        equipment: "Килимок",
        cue: "Одночасний підйом прямих ніг і торсу з дотиком до пальців ніг."
      }
    ]
  },
  {
    day_number: 7,
    title: "День 7: Відпочинок і аналіз тижня",
    focus: "Повне розвантаження",
    description: "Аналіз тижневого прогресу з ШІ-тренером, оцінка фото форми та планування наступного циклу.",
    is_rest: true,
    exercises: []
  }
];
