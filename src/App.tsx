import './App.css';
import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Route as RouteIcon,
  ShoppingCart,
  Wallet,
  Rows3,
  Package,
  AlertCircle,
  Target,
  Search,
  Bell,
  CalendarDays,
  ChevronRight,
  Plus,
  Filter,
  ArrowRight,
  Building2,
  MapPinned,
  Users,
  X,
  Pencil,
  Save,
} from 'lucide-react';

// =====================================================
// CORPORATE SALES PLATFORM 3.0
// Авторизованный пользователь: супервайзер
// Все данные и действия ограничены его зоной ответственности
// =====================================================

const SESSION = {
  role: 'Супервайзер',
  name: 'Нуржан Касымов',
  region: 'Шымкент Юг',
  teamName: 'Команда Юг-1',
  companyScope: ['Galanz', 'ШПЗ', 'Шымкент Пиво'],
};

const NAV_ITEMS = [
  { id: 'command', label: 'Command Center', icon: LayoutDashboard },
  { id: 'execution', label: 'Полевое исполнение', icon: ClipboardList },
  { id: 'routes', label: 'Маршруты', icon: RouteIcon },
  { id: 'orders', label: 'Заказы и продажи', icon: ShoppingCart },
  { id: 'debts', label: 'Долги', icon: Wallet },
  { id: 'shelf', label: 'Полка и стандарты', icon: Rows3 },
  { id: 'equipment', label: 'Оборудование', icon: Package },
  { id: 'tasks', label: 'Задачи', icon: AlertCircle },
  { id: 'mml', label: 'MML территории', icon: Target },
] as const;

type PageId = (typeof NAV_ITEMS)[number]['id'];
const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вск'] as const;

type Rep = {
  id: number;
  name: string;
  company: string;
  phone: string;
  status: string;
};
type Store = {
  id: number;
  name: string;
  company: string;
  region: string;
  channel: string;
  contract: string;
  debt: number;
  overdue: number;
  mml: number;
  focus: number;
  shelf: string;
  lastOrder: number;
  repId: number;
  address: string;
};
type Visit = {
  id: number;
  repId: number;
  rep: string;
  storeId: number;
  store: string;
  company: string;
  date: string;
  status: string;
  gps: string;
  orderExists: boolean;
  amount: number;
  photo: boolean;
  inventory: boolean;
  mml: number;
  issue: string;
  taskId: number | null;
};
type Order = {
  id: number;
  date: string;
  repId: number;
  rep: string;
  storeId: number;
  store: string;
  company: string;
  amount: number;
  sku: number;
  units: number;
  promo: string;
  status: string;
};
type Debt = {
  id: number;
  storeId: number;
  store: string;
  company: string;
  contract: string;
  total: number;
  overdue: number;
  invoices: number;
  status: string;
  rep: string;
};
type ShelfRow = {
  id: number;
  storeId: number;
  store: string;
  company: string;
  mml: number;
  focus: number;
  price: string;
  standard: string;
  photo: string;
  result: string;
};
type Equipment = {
  id: number;
  storeId: number;
  type: string;
  brand: string;
  serial: string;
  store: string;
  status: string;
  lastCheck: string;
  owner: string;
};
type Task = {
  id: number;
  type: string;
  storeId: number;
  store: string;
  rep: string;
  priority: string;
  status: string;
  due: string;
  source: string;
};
type MmlTemplate = {
  id: number;
  name: string;
  ownerRole: string;
  ownerName: string;
  territoryType: string;
  territoryValue: string;
  company: string;
  channel: string;
  skuCount: number;
  status: string;
  skuList: string[];
};

type RoutePlan = Record<number, Record<(typeof WEEK_DAYS)[number], number[]>>;
type CommandDistributorRow = {
  manager: string;
  planQty: number;
  factQty: number;
  factToPlan: string;
  niPlanFact: string;
  prevFactMtd: number;
  absDiffMtd: number;
  relativeDiffMtd: string;
  prevFactYtd: number;
  factYtd: number;
};

const reps: Rep[] = [
  {
    id: 3,
    name: 'Руслан Ибраев',
    company: 'Galanz',
    phone: '+7 700 555 11 22',
    status: 'Активен',
  },
  {
    id: 4,
    name: 'Бекзат Сарсенов',
    company: 'ШПЗ',
    phone: '+7 700 555 33 44',
    status: 'Активен',
  },
  {
    id: 5,
    name: 'Азамат Утегенов',
    company: 'Шымкент Пиво',
    phone: '+7 700 555 66 77',
    status: 'Активен',
  },
];

const stores: Store[] = [
  {
    id: 101,
    name: 'Green Line',
    company: 'Galanz',
    region: 'Шымкент Юг',
    channel: 'Modern Trade',
    contract: 'D-001612',
    debt: 260000,
    overdue: 130000,
    mml: 85,
    focus: 77,
    shelf: 'OK',
    lastOrder: 201000,
    repId: 3,
    address: 'г. Шымкент, ул. Байтурсынова 3',
  },
  {
    id: 102,
    name: 'Aray Market',
    company: 'ШПЗ',
    region: 'Шымкент Юг',
    channel: 'Traditional Trade',
    contract: 'D-001883',
    debt: 92000,
    overdue: 47000,
    mml: 61,
    focus: 42,
    shelf: 'Нарушение',
    lastOrder: 74000,
    repId: 4,
    address: 'г. Шымкент, мкр. Нурсат 18',
  },
  {
    id: 103,
    name: 'Dostar Mini',
    company: 'Шымкент Пиво',
    region: 'Шымкент Юг',
    channel: 'Traditional Trade',
    contract: 'D-001991',
    debt: 0,
    overdue: 0,
    mml: 73,
    focus: 58,
    shelf: 'Риск',
    lastOrder: 88000,
    repId: 5,
    address: 'г. Шымкент, ул. Сайрамская 41',
  },
  {
    id: 104,
    name: 'Tulpar Trade',
    company: 'Galanz',
    region: 'Шымкент Юг',
    channel: 'HoReCa',
    contract: 'D-002014',
    debt: 180000,
    overdue: 90000,
    mml: 49,
    focus: 33,
    shelf: 'Нарушение',
    lastOrder: 0,
    repId: 3,
    address: 'г. Шымкент, ул. Жандосова 7',
  },
  {
    id: 105,
    name: 'Meruyert Shop',
    company: 'ШПЗ',
    region: 'Шымкент Юг',
    channel: 'Киоск',
    contract: 'D-002100',
    debt: 35000,
    overdue: 12000,
    mml: 68,
    focus: 46,
    shelf: 'OK',
    lastOrder: 52000,
    repId: 4,
    address: 'г. Шымкент, ул. Толе би 88',
  },
  {
    id: 106,
    name: 'Nurzhol Store',
    company: 'Шымкент Пиво',
    region: 'Шымкент Юг',
    channel: 'Modern Trade',
    contract: 'D-002177',
    debt: 0,
    overdue: 0,
    mml: 90,
    focus: 81,
    shelf: 'OK',
    lastOrder: 166000,
    repId: 5,
    address: 'г. Шымкент, пр. Кунаева 20',
  },
];

const visits: Visit[] = [
  {
    id: 1,
    repId: 3,
    rep: 'Руслан Ибраев',
    storeId: 101,
    store: 'Green Line',
    company: 'Galanz',
    date: '07.04.2026 10:10',
    status: 'Завершен',
    gps: 'В ТТ',
    orderExists: true,
    amount: 92000,
    photo: false,
    inventory: false,
    mml: 85,
    issue: 'Нет фото полки',
    taskId: 1,
  },
  {
    id: 2,
    repId: 4,
    rep: 'Бекзат Сарсенов',
    storeId: 102,
    store: 'Aray Market',
    company: 'ШПЗ',
    date: '07.04.2026 11:00',
    status: 'Завершен',
    gps: 'В ТТ',
    orderExists: true,
    amount: 74000,
    photo: true,
    inventory: true,
    mml: 61,
    issue: 'Низкий MML',
    taskId: 2,
  },
  {
    id: 3,
    repId: 5,
    rep: 'Азамат Утегенов',
    storeId: 103,
    store: 'Dostar Mini',
    company: 'Шымкент Пиво',
    date: '07.04.2026 11:35',
    status: 'Завершен',
    gps: 'Вне ТТ, 0.8 км',
    orderExists: false,
    amount: 0,
    photo: true,
    inventory: true,
    mml: 73,
    issue: 'Визит без заказа',
    taskId: 3,
  },
  {
    id: 4,
    repId: 3,
    rep: 'Руслан Ибраев',
    storeId: 104,
    store: 'Tulpar Trade',
    company: 'Galanz',
    date: '07.04.2026 12:40',
    status: 'В процессе',
    gps: 'В ТТ',
    orderExists: false,
    amount: 0,
    photo: false,
    inventory: false,
    mml: 49,
    issue: 'Нет фото и заказа',
    taskId: 4,
  },
  {
    id: 5,
    repId: 4,
    rep: 'Бекзат Сарсенов',
    storeId: 105,
    store: 'Meruyert Shop',
    company: 'ШПЗ',
    date: '07.04.2026 13:20',
    status: 'Завершен',
    gps: 'В ТТ',
    orderExists: true,
    amount: 52000,
    photo: true,
    inventory: false,
    mml: 68,
    issue: 'Не выполнена инвентаризация',
    taskId: 5,
  },
  {
    id: 6,
    repId: 5,
    rep: 'Азамат Утегенов',
    storeId: 106,
    store: 'Nurzhol Store',
    company: 'Шымкент Пиво',
    date: '07.04.2026 14:15',
    status: 'Завершен',
    gps: 'В ТТ',
    orderExists: true,
    amount: 166000,
    photo: true,
    inventory: true,
    mml: 90,
    issue: 'OK',
    taskId: null,
  },
];

const orders: Order[] = [
  {
    id: 11,
    date: '07.04.2026',
    repId: 3,
    rep: 'Руслан Ибраев',
    storeId: 101,
    store: 'Green Line',
    company: 'Galanz',
    amount: 92000,
    sku: 6,
    units: 52,
    promo: 'Да',
    status: 'OK',
  },
  {
    id: 12,
    date: '07.04.2026',
    repId: 4,
    rep: 'Бекзат Сарсенов',
    storeId: 102,
    store: 'Aray Market',
    company: 'ШПЗ',
    amount: 74000,
    sku: 4,
    units: 31,
    promo: 'Нет',
    status: 'Ниже среднего',
  },
  {
    id: 13,
    date: '07.04.2026',
    repId: 5,
    rep: 'Азамат Утегенов',
    storeId: 103,
    store: 'Dostar Mini',
    company: 'Шымкент Пиво',
    amount: 0,
    sku: 0,
    units: 0,
    promo: 'Нет',
    status: 'Без заказа',
  },
  {
    id: 14,
    date: '07.04.2026',
    repId: 4,
    rep: 'Бекзат Сарсенов',
    storeId: 105,
    store: 'Meruyert Shop',
    company: 'ШПЗ',
    amount: 52000,
    sku: 3,
    units: 24,
    promo: 'Да',
    status: 'OK',
  },
  {
    id: 15,
    date: '07.04.2026',
    repId: 5,
    rep: 'Азамат Утегенов',
    storeId: 106,
    store: 'Nurzhol Store',
    company: 'Шымкент Пиво',
    amount: 166000,
    sku: 8,
    units: 73,
    promo: 'Да',
    status: 'OK',
  },
];

const debts: Debt[] = [
  {
    id: 21,
    storeId: 101,
    store: 'Green Line',
    company: 'Galanz',
    contract: 'D-001612',
    total: 260000,
    overdue: 130000,
    invoices: 4,
    status: 'Просрочка',
    rep: 'Руслан Ибраев',
  },
  {
    id: 22,
    storeId: 102,
    store: 'Aray Market',
    company: 'ШПЗ',
    contract: 'D-001883',
    total: 92000,
    overdue: 47000,
    invoices: 2,
    status: 'Просрочка',
    rep: 'Бекзат Сарсенов',
  },
  {
    id: 23,
    storeId: 104,
    store: 'Tulpar Trade',
    company: 'Galanz',
    contract: 'D-002014',
    total: 180000,
    overdue: 90000,
    invoices: 3,
    status: 'Просрочка',
    rep: 'Руслан Ибраев',
  },
  {
    id: 24,
    storeId: 105,
    store: 'Meruyert Shop',
    company: 'ШПЗ',
    contract: 'D-002100',
    total: 35000,
    overdue: 12000,
    invoices: 1,
    status: 'Частично оплачен',
    rep: 'Бекзат Сарсенов',
  },
];

const shelfRows: ShelfRow[] = [
  {
    id: 31,
    storeId: 101,
    store: 'Green Line',
    company: 'Galanz',
    mml: 85,
    focus: 77,
    price: 'OK',
    standard: 'OK',
    photo: 'Нет',
    result: 'Риск',
  },
  {
    id: 32,
    storeId: 102,
    store: 'Aray Market',
    company: 'ШПЗ',
    mml: 61,
    focus: 42,
    price: 'Нарушение',
    standard: 'Нарушение',
    photo: 'Есть',
    result: 'Проблема',
  },
  {
    id: 33,
    storeId: 103,
    store: 'Dostar Mini',
    company: 'Шымкент Пиво',
    mml: 73,
    focus: 58,
    price: 'OK',
    standard: 'Риск',
    photo: 'Есть',
    result: 'Риск',
  },
  {
    id: 34,
    storeId: 104,
    store: 'Tulpar Trade',
    company: 'Galanz',
    mml: 49,
    focus: 33,
    price: 'Нарушение',
    standard: 'Нарушение',
    photo: 'Нет',
    result: 'Проблема',
  },
];

const equipmentRows: Equipment[] = [
  {
    id: 41,
    storeId: 101,
    type: 'Холодильник',
    brand: 'Galanz',
    serial: 'SN-903115',
    store: 'Green Line',
    status: 'Требует обслуживания',
    lastCheck: '06.04.2026',
    owner: 'Руслан Ибраев',
  },
  {
    id: 42,
    storeId: 102,
    type: 'Кега 30L',
    brand: 'Shymkent',
    serial: 'KEG-88210',
    store: 'Aray Market',
    status: 'Исправно',
    lastCheck: '07.04.2026',
    owner: 'Бекзат Сарсенов',
  },
  {
    id: 43,
    storeId: 104,
    type: 'Холодильник',
    brand: 'Galanz',
    serial: 'SN-812447',
    store: 'Tulpar Trade',
    status: 'Не найдено',
    lastCheck: '07.04.2026',
    owner: 'Руслан Ибраев',
  },
  {
    id: 44,
    storeId: 105,
    type: 'Кега 30L',
    brand: 'Shymkent',
    serial: 'KEG-910201',
    store: 'Meruyert Shop',
    status: 'Исправно',
    lastCheck: '07.04.2026',
    owner: 'Бекзат Сарсенов',
  },
];

const tasksSeed: Task[] = [
  {
    id: 1,
    type: 'Нет фото полки',
    storeId: 101,
    store: 'Green Line',
    rep: 'Руслан Ибраев',
    priority: 'Средний',
    status: 'В работе',
    due: 'Сегодня 17:00',
    source: 'Полка',
  },
  {
    id: 2,
    type: 'Низкий MML',
    storeId: 102,
    store: 'Aray Market',
    rep: 'Бекзат Сарсенов',
    priority: 'Высокий',
    status: 'Открыта',
    due: 'Сегодня 18:00',
    source: 'Полка',
  },
  {
    id: 3,
    type: 'Визит без заказа',
    storeId: 103,
    store: 'Dostar Mini',
    rep: 'Азамат Утегенов',
    priority: 'Критично',
    status: 'Открыта',
    due: 'Сегодня 16:00',
    source: 'Полевое исполнение',
  },
  {
    id: 4,
    type: 'Нет фото и заказа',
    storeId: 104,
    store: 'Tulpar Trade',
    rep: 'Руслан Ибраев',
    priority: 'Критично',
    status: 'Открыта',
    due: 'Сегодня 15:30',
    source: 'Полевое исполнение',
  },
  {
    id: 5,
    type: 'Не выполнена инвентаризация',
    storeId: 105,
    store: 'Meruyert Shop',
    rep: 'Бекзат Сарсенов',
    priority: 'Высокий',
    status: 'Открыта',
    due: 'Завтра 12:00',
    source: 'Оборудование',
  },
  {
    id: 6,
    type: 'Просроченный долг',
    storeId: 104,
    store: 'Tulpar Trade',
    rep: 'Руслан Ибраев',
    priority: 'Критично',
    status: 'Открыта',
    due: 'Сегодня 17:30',
    source: 'Долги',
  },
];

const mmlTemplatesSeed: MmlTemplate[] = [
  {
    id: 1,
    name: 'Юг — Modern Trade — Galanz',
    ownerRole: 'Супервайзер',
    ownerName: 'Нуржан Касымов',
    territoryType: 'Территория супервайзера',
    territoryValue: 'Шымкент Юг • Команда Юг-1',
    company: 'Galanz',
    channel: 'Modern Trade',
    skuCount: 10,
    status: 'Активен',
    skuList: [
      'Qymyz Cola 1L',
      'Qymyz Cola 0.5',
      'Galanz Lemon 1L',
      'Galanz Orange 1L',
    ],
  },
  {
    id: 2,
    name: 'Юг — Traditional Trade — ШПЗ',
    ownerRole: 'Супервайзер',
    ownerName: 'Нуржан Касымов',
    territoryType: 'Территория супервайзера',
    territoryValue: 'Шымкент Юг • Команда Юг-1',
    company: 'ШПЗ',
    channel: 'Traditional Trade',
    skuCount: 8,
    status: 'Активен',
    skuList: [
      'Shymkent Premium 0.5',
      'Shymkent Draft 30L',
      'Wolf Forest 0.45',
      'Capital Black 0.25',
    ],
  },
];

const initialRoutePlan: RoutePlan = {
  3: {
    Пн: [101, 104],
    Вт: [101],
    Ср: [104, 101],
    Чт: [101],
    Пт: [104],
    Сб: [],
    Вск: [],
  },
  4: {
    Пн: [102, 105],
    Вт: [102],
    Ср: [105],
    Чт: [102, 105],
    Пт: [102],
    Сб: [],
    Вск: [],
  },
  5: {
    Пн: [103, 106],
    Вт: [106],
    Ср: [103],
    Чт: [106, 103],
    Пт: [106],
    Сб: [],
    Вск: [],
  },
};

const commandDistributorRows: CommandDistributorRow[] = [
  {
    manager: 'Абдуллин Жантас Боранович',
    planQty: 385000,
    factQty: 198200,
    factToPlan: '51,48%',
    niPlanFact: '118,8%',
    prevFactMtd: 143400,
    absDiffMtd: 54800,
    relativeDiffMtd: '138,21%',
    prevFactYtd: 480500,
    factYtd: 590,
  },
  {
    manager: 'Немчанинов Аскат Нуралиевич',
    planQty: 416000,
    factQty: 189850,
    factToPlan: '45,64%',
    niPlanFact: '105,32%',
    prevFactMtd: 109350,
    absDiffMtd: 80500,
    relativeDiffMtd: '173,62%',
    prevFactYtd: 552100,
    factYtd: 633,
  },
  {
    manager: 'Ню Виталий Олегович',
    planQty: 447000,
    factQty: 213700,
    factToPlan: '47,81%',
    niPlanFact: '110,33%',
    prevFactMtd: 69650,
    absDiffMtd: 144050,
    relativeDiffMtd: '306,82%',
    prevFactYtd: 527300,
    factYtd: 992,
  },
  {
    manager: 'Расупов Камал Ризаметович',
    planQty: 1252000,
    factQty: 657000,
    factToPlan: '52,48%',
    niPlanFact: '121,1%',
    prevFactMtd: 414650,
    absDiffMtd: 242350,
    relativeDiffMtd: '158,45%',
    prevFactYtd: 1262750,
    factYtd: 1599,
  },
  {
    manager: 'Итого',
    planQty: 2500000,
    factQty: 1258750,
    factToPlan: '50,35%',
    niPlanFact: '116,19%',
    prevFactMtd: 737050,
    absDiffMtd: 521700,
    relativeDiffMtd: '170,78%',
    prevFactYtd: 2822650,
    factYtd: 3816,
  },
];

function money(v: number) {
  return `${new Intl.NumberFormat('ru-RU').format(v)} тг`;
}

function quantity(v: number) {
  return new Intl.NumberFormat('ru-RU').format(v);
}

function toneByText(text: string) {
  if (
    ['Проблема', 'Просрочка', 'Не найдено', 'Критично', 'Нарушение'].includes(
      text,
    )
  )
    return 'red';
  if (['OK', 'Исправно', 'Активен', 'Завершен', 'Закрыта'].includes(text))
    return 'green';
  if (
    [
      'Риск',
      'Высокий',
      'Частично оплачен',
      'Ниже среднего',
      'В работе',
      'Средний',
      'В процессе',
      'Требует обслуживания',
    ].includes(text)
  )
    return 'amber';
  if (['Открыта'].includes(text)) return 'blue';
  return 'slate';
}

function cls(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(' ');
}

function Badge({
  text,
  tone = 'slate',
}: {
  text: string;
  tone?: 'red' | 'green' | 'amber' | 'blue' | 'slate';
}) {
  const map = {
    red: 'bg-red-100 text-red-700 border-red-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  } as const;
  return (
    <span
      className={cls(
        'inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold',
        map[tone],
      )}
    >
      {text}
    </span>
  );
}

function RowStatus({ text }: { text: string }) {
  return <Badge text={text} tone={toneByText(text) as any} />;
}

function KpiCard({
  title,
  value,
  note,
  tone = 'slate',
}: {
  title: string;
  value: string;
  note?: string;
  tone?: 'slate' | 'green' | 'red' | 'amber' | 'blue';
}) {
  const toneClass = {
    slate: 'from-slate-50 to-white',
    green: 'from-emerald-50 to-white',
    red: 'from-red-50 to-white',
    amber: 'from-amber-50 to-white',
    blue: 'from-blue-50 to-white',
  } as const;
  return (
    <div
      className={cls(
        'rounded-3xl border border-slate-200 bg-gradient-to-br p-5 shadow-sm',
        toneClass[tone],
      )}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </div>
      {note ? <div className="mt-2 text-xs text-slate-500">{note}</div> : null}
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-slate-900">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function InfoCard({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={cls(
          'mt-1 text-sm font-semibold',
          danger ? 'text-red-700' : 'text-slate-900',
        )}
      >
        {value}
      </div>
    </div>
  );
}

function Line({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div
        className={cls(
          'mt-1 text-sm font-semibold',
          danger ? 'text-red-700' : 'text-slate-900',
        )}
      >
        {value}
      </div>
    </div>
  );
}

function MiniBar({
  label,
  value,
  color = 'bg-blue-500',
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className={cls('h-2 rounded-full', color)}
          style={{ width: `${Math.max(6, value)}%` }}
        />
      </div>
    </div>
  );
}

function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-auto rounded-2xl border border-slate-200">
      {children}
    </div>
  );
}

function FilterPill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cls(
        'rounded-full px-3 py-2 text-xs font-semibold transition',
        active
          ? 'bg-slate-900 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      )}
    >
      {children}
    </button>
  );
}

function Sidebar({
  page,
  setPage,
}: {
  page: PageId;
  setPage: (page: PageId) => void;
}) {
  return (
    <div className="min-h-screen w-[290px] border-r border-slate-200 bg-slate-950 px-5 py-6 text-white">
      <div className="mb-8">
        <div className="text-lg font-bold">Corporate Sales Platform</div>
        <div className="mt-1 text-xs text-slate-400">
          Supervisor Control Tower
        </div>
      </div>
      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cls(
                'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition cursor-pointer',
                active
                  ? 'bg-white text-slate-950 shadow'
                  : 'text-slate-300 hover:bg-white/5',
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-4">
        <div className="text-xs text-slate-400">
          Авторизованный пользователь
        </div>
        <div className="mt-2 text-sm font-semibold">{SESSION.name}</div>
        <div className="mt-1 text-xs text-slate-400">{SESSION.role}</div>
        <div className="mt-4 grid grid-cols-1 gap-3 text-xs text-slate-300">
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-slate-400">Регион</div>
            <div className="mt-1 font-medium text-white">{SESSION.region}</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-slate-400">Команда</div>
            <div className="mt-1 font-medium text-white">
              {SESSION.teamName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="px-6 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[28px] font-bold tracking-tight text-slate-950">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                className="w-52 bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Поиск по ТТ, ТП, задаче"
              />
            </div>
            <button className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm">
              <Bell size={18} />
            </button>
            <div className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm">
              NK
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 pb-4">
          <div className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
            <Building2 size={16} />
            {SESSION.name}
          </div>
          <div className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
            <MapPinned size={16} />
            {SESSION.region}
          </div>
          <div className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
            <Users size={16} />
            {SESSION.teamName}
          </div>
          <div className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
            <CalendarDays size={16} />
            Сегодня
          </div>
          <div className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
            <Filter size={16} />
            Фильтры
          </div>
        </div>
      </div>
    </div>
  );
}

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex-1 bg-slate-100">
      <TopBar title={title} subtitle={subtitle} />
      <div className="p-6">{children}</div>
    </div>
  );
}

function Store360({ storeId }: { storeId: number }) {
  const store = stores.find((s) => s.id === storeId) || stores[0];
  const rep = reps.find((r) => r.id === store.repId);
  const storeVisits = visits.filter((v) => v.storeId === store.id);
  const storeDebt = debts.find((d) => d.storeId === store.id);
  const storeShelf = shelfRows.find((s) => s.storeId === store.id);
  const storeEquipment = equipmentRows.filter((e) => e.storeId === store.id);
  return (
    <div className="space-y-4">
      <SectionCard
        title={`Карточка ТТ • ${store.name}`}
        subtitle="Единая сводка по точке: продажи, долги, полка, оборудование, визиты"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Компания" value={store.company} />
          <InfoCard label="Канал" value={store.channel} />
          <InfoCard label="Договор" value={store.contract} />
          <InfoCard label="Ответственный ТП" value={rep ? rep.name : '—'} />
          <InfoCard label="Адрес" value={store.address} />
          <InfoCard
            label="Текущий долг"
            value={money(store.debt)}
            danger={store.debt > 0}
          />
          <InfoCard
            label="MML"
            value={`${store.mml}%`}
            danger={store.mml < 80}
          />
          <InfoCard
            label="Последний заказ"
            value={
              store.lastOrder === 0 ? 'Нет заказа' : money(store.lastOrder)
            }
            danger={store.lastOrder === 0}
          />
        </div>
      </SectionCard>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SectionCard title="Последние визиты">
          <div className="space-y-3">
            {storeVisits.map((v) => (
              <div key={v.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {v.date}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {v.rep} • {v.gps}
                    </div>
                  </div>
                  <RowStatus text={v.orderExists ? 'OK' : 'Проблема'} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <Line
                    label="Заказ"
                    value={v.orderExists ? money(v.amount) : 'Нет заказа'}
                    danger={!v.orderExists}
                  />
                  <Line
                    label="Инвентаризация"
                    value={v.inventory ? 'Выполнена' : 'Нет'}
                    danger={!v.inventory}
                  />
                </div>
                <div className="mt-3 rounded-2xl bg-white px-3 py-2.5 text-xs text-slate-600">
                  Отклонение: {v.issue}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Полка, долг и оборудование">
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Полка и стандарты
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  text={`MML ${storeShelf ? storeShelf.mml : 0}%`}
                  tone={storeShelf && storeShelf.mml < 80 ? 'red' : 'green'}
                />
                <Badge
                  text={`Фокус ${storeShelf ? storeShelf.focus : 0}%`}
                  tone={storeShelf && storeShelf.focus < 70 ? 'amber' : 'green'}
                />
                <Badge
                  text={storeShelf ? storeShelf.standard : 'OK'}
                  tone={
                    storeShelf && storeShelf.standard === 'OK' ? 'green' : 'red'
                  }
                />
                <Badge
                  text={`Фото: ${storeShelf ? storeShelf.photo : 'Нет'}`}
                  tone={
                    storeShelf && storeShelf.photo === 'Нет' ? 'red' : 'blue'
                  }
                />
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Дебиторка
              </div>
              <div className="mt-2 text-sm text-slate-700">
                {storeDebt
                  ? `${money(storeDebt.total)} • Просрочка ${money(storeDebt.overdue)} • Накладных ${storeDebt.invoices}`
                  : 'Долга нет'}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Оборудование
              </div>
              <div className="mt-2 space-y-2">
                {storeEquipment.length === 0 ? (
                  <div className="text-sm text-slate-500">
                    Оборудование не закреплено
                  </div>
                ) : (
                  storeEquipment.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2.5"
                    >
                      <div className="text-sm text-slate-700">
                        {e.type} • {e.serial}
                      </div>
                      <RowStatus text={e.status} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function VisitDrawer({
  visit,
  onClose,
  openTask,
}: {
  visit: Visit | null;
  onClose: () => void;
  openTask: (taskId: number) => void;
}) {
  if (!visit) return null;
  return (
    <div className="w-[430px] shrink-0 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900">
            Карточка визита
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {visit.store} • {visit.date}
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <X size={16} />
        </button>
      </div>
      <div className="space-y-4">
        <SectionCard title="Основное">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="ТП" value={visit.rep} />
            <InfoCard label="Компания" value={visit.company} />
            <InfoCard label="Статус визита" value={visit.status} />
            <InfoCard label="Точка" value={visit.store} />
          </div>
        </SectionCard>
        <SectionCard title="Результат визита">
          <div className="space-y-3 text-sm">
            <InfoCard
              label="GPS"
              value={visit.gps}
              danger={visit.gps.includes('Вне')}
            />
            <InfoCard
              label="Заказ"
              value={visit.orderExists ? money(visit.amount) : 'Нет заказа'}
              danger={!visit.orderExists}
            />
            <InfoCard
              label="Фото полки"
              value={visit.photo ? 'Есть' : 'Нет'}
              danger={!visit.photo}
            />
            <InfoCard
              label="Инвентаризация"
              value={visit.inventory ? 'Выполнена' : 'Не выполнена'}
              danger={!visit.inventory}
            />
            <InfoCard
              label="MML"
              value={`${visit.mml}%`}
              danger={visit.mml < 80}
            />
          </div>
        </SectionCard>
        <SectionCard title="Отклонение и реакция">
          <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-800">
            {visit.issue}
          </div>
          {visit.taskId ? (
            <button
              onClick={() => openTask(visit.taskId!)}
              className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Открыть связанную задачу <ArrowRight size={16} />
            </button>
          ) : null}
        </SectionCard>
      </div>
    </div>
  );
}

function TaskDrawer({
  task,
  onClose,
  openStore,
}: {
  task: Task | null;
  onClose: () => void;
  openStore: (storeId: number) => void;
}) {
  if (!task) return null;
  return (
    <div className="w-[430px] shrink-0 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900">
            Карточка задачи
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {task.type} • {task.store}
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <X size={16} />
        </button>
      </div>
      <div className="space-y-4">
        <SectionCard title="Параметры задачи">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Источник" value={task.source} />
            <InfoCard label="Ответственный" value={SESSION.name} />
            <InfoCard
              label="Приоритет"
              value={task.priority}
              danger={task.priority === 'Критично'}
            />
            <InfoCard label="Срок" value={task.due} />
          </div>
        </SectionCard>
        <SectionCard title="Что должен сделать супервайзер">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            Проверить причину отклонения, связаться с торговым представителем,
            при необходимости скорректировать маршрут, назначить повторный визит
            или контрольную задачу и закрыть нарушение в срок.
          </div>
        </SectionCard>
        <SectionCard title="Связанная торговая точка">
          <button
            onClick={() => openStore(task.storeId)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Открыть карточку ТТ • {task.store}
          </button>
        </SectionCard>
      </div>
    </div>
  );
}

export default function CorporateSalesPlatformPrototype() {
  const [page, setPage] = useState<PageId>('command');
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<number>(101);
  const [selectedRepId, setSelectedRepId] = useState<number>(3);
  const [selectedMmlId, setSelectedMmlId] = useState<number>(1);
  const [routePlan, setRoutePlan] = useState<RoutePlan>(initialRoutePlan);
  const [tasks, setTasks] = useState<Task[]>(tasksSeed);

  const selectedVisit = visits.find((v) => v.id === selectedVisitId) || null;
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;
  const selectedRep = reps.find((r) => r.id === selectedRepId) || reps[0];
  const selectedMml =
    mmlTemplatesSeed.find((m) => m.id === selectedMmlId) || mmlTemplatesSeed[0];

  const teamStores = stores.filter((s) => reps.some((r) => r.id === s.repId));
  const teamVisits = visits.filter((v) => reps.some((r) => r.id === v.repId));
  const teamOrders = orders.filter((o) => reps.some((r) => r.id === o.repId));
  const teamDebts = debts.filter((d) =>
    teamStores.some((s) => s.id === d.storeId),
  );
  const teamShelf = shelfRows.filter((r) =>
    teamStores.some((s) => s.id === r.storeId),
  );
  const teamEquipment = equipmentRows.filter((e) =>
    teamStores.some((s) => s.id === e.storeId),
  );

  const kpis = useMemo(
    () => ({
      sales: teamOrders.reduce((sum, o) => sum + o.amount, 0),
      visitsWithoutOrder: teamVisits.filter((v) => !v.orderExists).length,
      overdue: teamDebts.reduce((sum, d) => sum + d.overdue, 0),
      openTasks: tasks.filter((t) => t.status !== 'Закрыта').length,
      shelfProblems: teamShelf.filter((s) => s.result === 'Проблема').length,
      equipmentProblems: teamEquipment.filter((e) => e.status !== 'Исправно')
        .length,
    }),
    [teamOrders, teamVisits, teamDebts, teamShelf, teamEquipment, tasks],
  );

  const commandAlerts = [
    {
      title: `${kpis.visitsWithoutOrder} визита без заказа`,
      desc: 'Часть визитов команды не конвертируется в заказ',
      go: 'execution' as PageId,
    },
    {
      title: `Просроченная дебиторка ${money(kpis.overdue)}`,
      desc: 'Есть риск зависания денег по ТТ команды',
      go: 'debts' as PageId,
    },
    {
      title: `${kpis.shelfProblems} точки с нарушением полки`,
      desc: 'Нарушения MML, цен и стандартов',
      go: 'shelf' as PageId,
    },
    {
      title: `${kpis.equipmentProblems} проблемы по оборудованию`,
      desc: 'Не найдено или требуется обслуживание',
      go: 'equipment' as PageId,
    },
  ];

  function openTask(taskId: number) {
    setSelectedTaskId(taskId);
    setPage('tasks');
  }

  function openStore(storeId: number) {
    setSelectedStoreId(storeId);
  }

  function addStoreToDay(day: (typeof WEEK_DAYS)[number]) {
    const repStores = stores.filter((s) => s.repId === selectedRepId);
    const existing = routePlan[selectedRepId]?.[day] || [];
    const freeStores = repStores.filter((s) => !existing.includes(s.id));
    const candidate = freeStores[0] || repStores[0];
    if (!candidate) return;
    setRoutePlan((prev) => ({
      ...prev,
      [selectedRepId]: {
        ...prev[selectedRepId],
        [day]: [...(prev[selectedRepId]?.[day] || []), candidate.id],
      },
    }));
  }

  function removeStoreFromDay(
    day: (typeof WEEK_DAYS)[number],
    storeId: number,
  ) {
    setRoutePlan((prev) => ({
      ...prev,
      [selectedRepId]: {
        ...prev[selectedRepId],
        [day]: (prev[selectedRepId]?.[day] || []).filter(
          (id) => id !== storeId,
        ),
      },
    }));
  }

  function createRecoveryTaskFromAlert() {
    const nextId = Math.max(...tasks.map((t) => t.id)) + 1;
    setTasks((prev) => [
      {
        id: nextId,
        type: 'Повторный визит по критичной ТТ',
        storeId: 104,
        store: 'Tulpar Trade',
        rep: 'Руслан Ибраев',
        priority: 'Критично',
        status: 'Открыта',
        due: 'Сегодня 18:30',
        source: 'Command Center',
      },
      ...prev,
    ]);
    setSelectedTaskId(nextId);
    setPage('tasks');
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <Sidebar page={page} setPage={setPage} />

        {page === 'command' && (
          <Shell
            title="Command Center"
            subtitle={`Система показывает только данные супервайзера ${SESSION.name}: его команда, его маршруты, его MML, его задачи и его торговые точки.`}
          >
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-sm">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                  <div className="max-w-3xl">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Supervisor Control Tower
                    </div>
                    <div className="mt-2 text-3xl font-bold tracking-tight">
                      Рабочее место супервайзера
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-300">
                      Платформа агрегирует данные, которые приходят из
                      мобильного приложения торговых представителей, и
                      превращает их в управленческие действия: маршрут, задача,
                      контроль полки, сбор долга, повторный визит, корректировка
                      территории и MML.
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 xl:min-w-[380px]">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <div className="text-xs text-slate-300">Пользователь</div>
                      <div className="mt-1 font-semibold">{SESSION.name}</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <div className="text-xs text-slate-300">Роль</div>
                      <div className="mt-1 font-semibold">{SESSION.role}</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <div className="text-xs text-slate-300">Регион</div>
                      <div className="mt-1 font-semibold">{SESSION.region}</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <div className="text-xs text-slate-300">Команда</div>
                      <div className="mt-1 font-semibold">
                        {SESSION.teamName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                  title="Продажи команды"
                  value={money(kpis.sales)}
                  tone="green"
                  note="Только по закрепленным ТП"
                />
                <KpiCard
                  title="Визиты без заказа"
                  value={`${kpis.visitsWithoutOrder}`}
                  tone="red"
                  note="Требуют немедленной реакции"
                />
                <KpiCard
                  title="Просроченная дебиторка"
                  value={money(kpis.overdue)}
                  tone="red"
                  note="Финансовый риск по зоне ответственности"
                />
                <KpiCard
                  title="Открытые задачи"
                  value={`${kpis.openTasks}`}
                  tone="amber"
                  note="Должны закрываться супервайзером"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr,0.95fr]">
                <SectionCard
                  title="Выполнение плана по торговым представителям"
                  subtitle="Иерархия ролей: супервайзер анализирует только свою команду"
                  action={<FilterPill active>Сегодня</FilterPill>}
                >
                  <div className="space-y-5">
                    <MiniBar
                      label="Руслан Ибраев"
                      value={79}
                      color="bg-blue-500"
                    />
                    <MiniBar
                      label="Бекзат Сарсенов"
                      value={68}
                      color="bg-amber-500"
                    />
                    <MiniBar
                      label="Азамат Утегенов"
                      value={91}
                      color="bg-emerald-500"
                    />
                  </div>
                </SectionCard>

                <SectionCard
                  title="Проблемные зоны супервайзера"
                  subtitle="Любой alert должен переводить в действие"
                >
                  <div className="space-y-3">
                    {commandAlerts.map((alert) => (
                      <button
                        key={alert.title}
                        onClick={() => setPage(alert.go)}
                        className="flex w-full items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-white hover:shadow-sm"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {alert.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {alert.desc}
                          </div>
                        </div>
                        <ChevronRight
                          className="mt-0.5 text-slate-400"
                          size={18}
                        />
                      </button>
                    ))}
                    <button
                      onClick={createRecoveryTaskFromAlert}
                      className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm"
                    >
                      Создать корректирующую задачу
                    </button>
                  </div>
                </SectionCard>
              </div>

              <SectionCard
                title="Дистрибьюторы и основные менеджеры"
                subtitle="Сводка по плану, факту и динамике"
              >
                <TableShell>
                  <table className="w-full min-w-[1480px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                        <th className="px-4 py-3 font-medium">
                          Основной менеджер
                        </th>
                        <th className="px-4 py-3 font-medium">Кол-во план</th>
                        <th className="px-4 py-3 font-medium">Кол-во факт</th>
                        <th className="px-4 py-3 font-medium">План / факт</th>
                        <th className="px-4 py-3 font-medium">НИ</th>
                        <th className="px-4 py-3 font-medium">
                          Колөво факт пред.
                        </th>
                        <th className="px-4 py-3 font-medium">
                          Абс. разн. MTD
                        </th>
                        <th className="px-4 py-3 font-medium">
                          Отн. разн. MTD
                        </th>
                        <th className="px-4 py-3 font-medium">
                          Колөво факт год пред.
                        </th>
                        <th className="px-4 py-3 font-medium">
                          Кол-во факт год
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {commandDistributorRows.map((row) => {
                        const isTotal = row.manager === 'Итого';
                        return (
                          <tr
                            key={row.manager}
                            className={
                              isTotal
                                ? 'border-b border-slate-200 bg-slate-100 font-semibold text-slate-900'
                                : 'border-b border-slate-100 hover:bg-slate-50'
                            }
                          >
                            <td className="px-4 py-3">{row.manager}</td>
                            <td className="px-4 py-3">
                              {quantity(row.planQty)}
                            </td>
                            <td className="px-4 py-3">
                              {quantity(row.factQty)}
                            </td>
                            <td className="px-4 py-3">{row.factToPlan}</td>
                            <td className="px-4 py-3">{row.niPlanFact}</td>
                            <td className="px-4 py-3">
                              {quantity(row.prevFactMtd)}
                            </td>
                            <td className="px-4 py-3">
                              {quantity(row.absDiffMtd)}
                            </td>
                            <td className="px-4 py-3">{row.relativeDiffMtd}</td>
                            <td className="px-4 py-3">
                              {quantity(row.prevFactYtd)}
                            </td>
                            <td className="px-4 py-3">
                              {quantity(row.factYtd)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableShell>
              </SectionCard>

              <SectionCard
                title="Точки внимания"
                subtitle="Список объектов, где супервайзеру нужно вмешательство уже сегодня"
              >
                <TableShell>
                  <table className="w-full min-w-[980px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                        <th className="px-4 py-3 font-medium">Компания</th>
                        <th className="px-4 py-3 font-medium">ТТ</th>
                        <th className="px-4 py-3 font-medium">Проблема</th>
                        <th className="px-4 py-3 font-medium">MML</th>
                        <th className="px-4 py-3 font-medium">Долг</th>
                        <th className="px-4 py-3 font-medium">Ответственный</th>
                        <th className="px-4 py-3 font-medium">Действие</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamStores
                        .filter(
                          (s) => s.debt > 0 || s.mml < 80 || s.lastOrder === 0,
                        )
                        .map((s) => {
                          const rep = reps.find((r) => r.id === s.repId);
                          const problem =
                            s.lastOrder === 0
                              ? 'Нет заказа'
                              : s.mml < 80
                                ? 'Низкий MML'
                                : 'Просроченный долг';
                          return (
                            <tr
                              key={s.id}
                              className="border-b border-slate-100 hover:bg-slate-50"
                            >
                              <td className="px-4 py-3">{s.company}</td>
                              <td className="px-4 py-3 font-medium text-slate-900">
                                {s.name}
                              </td>
                              <td className="px-4 py-3">
                                <RowStatus
                                  text={
                                    problem === 'Просроченный долг'
                                      ? 'Просрочка'
                                      : 'Проблема'
                                  }
                                />
                              </td>
                              <td className="px-4 py-3">{s.mml}%</td>
                              <td className="px-4 py-3">{money(s.debt)}</td>
                              <td className="px-4 py-3">
                                {rep ? rep.name : '—'}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => setSelectedStoreId(s.id)}
                                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
                                >
                                  Открыть ТТ <ArrowRight size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </TableShell>
              </SectionCard>

              <Store360 storeId={selectedStoreId} />
            </div>
          </Shell>
        )}

        {page === 'execution' && (
          <Shell
            title="Полевое исполнение"
            subtitle="Супервайзер видит только визиты своей команды и анализирует качество исполнения каждого визита"
          >
            <div className="flex gap-6">
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
                  <KpiCard
                    title="Визитов"
                    value={`${teamVisits.length}`}
                    tone="blue"
                  />
                  <KpiCard
                    title="Без заказа"
                    value={`${teamVisits.filter((v) => !v.orderExists).length}`}
                    tone="red"
                  />
                  <KpiCard
                    title="Вне ТТ"
                    value={`${teamVisits.filter((v) => v.gps.includes('Вне')).length}`}
                    tone="amber"
                  />
                  <KpiCard
                    title="Без фото"
                    value={`${teamVisits.filter((v) => !v.photo).length}`}
                    tone="amber"
                  />
                  <KpiCard
                    title="Без инвентаризации"
                    value={`${teamVisits.filter((v) => !v.inventory).length}`}
                    tone="red"
                  />
                  <KpiCard
                    title="Средний MML"
                    value={`${Math.round(teamVisits.reduce((s, v) => s + v.mml, 0) / teamVisits.length)}%`}
                    tone="green"
                  />
                </div>

                <SectionCard
                  title="Журнал визитов команды"
                  subtitle="Каждый визит можно открыть и понять причину отклонения"
                  action={
                    <div className="flex gap-2">
                      <FilterPill active>Все</FilterPill>
                      <FilterPill>Без заказа</FilterPill>
                      <FilterPill>Вне ТТ</FilterPill>
                    </div>
                  }
                >
                  <TableShell>
                    <table className="w-full min-w-[1120px] text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                          <th className="px-4 py-3 font-medium">Дата</th>
                          <th className="px-4 py-3 font-medium">ТП</th>
                          <th className="px-4 py-3 font-medium">ТТ</th>
                          <th className="px-4 py-3 font-medium">Статус</th>
                          <th className="px-4 py-3 font-medium">GPS</th>
                          <th className="px-4 py-3 font-medium">Заказ</th>
                          <th className="px-4 py-3 font-medium">Фото</th>
                          <th className="px-4 py-3 font-medium">Инв.</th>
                          <th className="px-4 py-3 font-medium">MML</th>
                          <th className="px-4 py-3 font-medium">Отклонение</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamVisits.map((visit) => (
                          <tr
                            key={visit.id}
                            className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                            onClick={() => setSelectedVisitId(visit.id)}
                          >
                            <td className="px-4 py-3">{visit.date}</td>
                            <td className="px-4 py-3">{visit.rep}</td>
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {visit.store}
                            </td>
                            <td className="px-4 py-3">
                              <RowStatus text={visit.status} />
                            </td>
                            <td className="px-4 py-3">
                              {visit.gps.includes('Вне') ? (
                                <RowStatus text="Проблема" />
                              ) : (
                                <RowStatus text="OK" />
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {visit.orderExists ? (
                                money(visit.amount)
                              ) : (
                                <RowStatus text="Проблема" />
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {visit.photo ? (
                                <RowStatus text="OK" />
                              ) : (
                                <RowStatus text="Риск" />
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {visit.inventory ? (
                                <RowStatus text="OK" />
                              ) : (
                                <RowStatus text="Проблема" />
                              )}
                            </td>
                            <td className="px-4 py-3">{visit.mml}%</td>
                            <td className="px-4 py-3 text-slate-700">
                              {visit.issue}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableShell>
                </SectionCard>
              </div>
              <VisitDrawer
                visit={selectedVisit}
                onClose={() => setSelectedVisitId(null)}
                openTask={openTask}
              />
            </div>
          </Shell>
        )}

        {page === 'routes' && (
          <Shell
            title="Маршруты"
            subtitle="Супервайзер ставит и редактирует маршрут на каждый день рабочей недели только для закрепленных торговых представителей"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr,1.15fr]">
                <SectionCard
                  title="Контекст управления маршрутом"
                  subtitle="Все действия выполняются под личной учетной записью супервайзера"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard label="Супервайзер" value={SESSION.name} />
                    <InfoCard label="Регион" value={SESSION.region} />
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">
                        Торговый представитель
                      </div>
                      <select
                        value={String(selectedRepId)}
                        onChange={(e) =>
                          setSelectedRepId(Number(e.target.value))
                        }
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                      >
                        {reps.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} • {r.company}
                          </option>
                        ))}
                      </select>
                    </div>
                    <InfoCard label="Компания ТП" value={selectedRep.company} />
                  </div>
                  <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
                    Супервайзер может назначать маршрут, менять состав точек,
                    убирать точку и перестраивать рабочую неделю только по своим
                    ТП.
                  </div>
                </SectionCard>

                <SectionCard
                  title="Сводка по выбранному ТП"
                  subtitle="Маршрут хранится по дням недели и дает супервайзеру управляемое покрытие территории"
                >
                  <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                    <InfoCard label="ТП" value={selectedRep.name} />
                    <InfoCard label="Телефон" value={selectedRep.phone} />
                    <InfoCard
                      label="Точек в неделе"
                      value={`${Object.values(routePlan[selectedRepId] || {}).flat().length}`}
                    />
                    <InfoCard
                      label="Уникальных ТТ"
                      value={`${new Set(Object.values(routePlan[selectedRepId] || {}).flat()).size}`}
                    />
                  </div>
                </SectionCard>
              </div>

              <SectionCard
                title="Маршрут на рабочую неделю"
                subtitle="Каждый день недели редактируется отдельно; точки можно добавлять и убирать"
                action={
                  <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm">
                    <Save size={16} />
                    Сохранить маршрут
                  </button>
                }
              >
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
                  {WEEK_DAYS.map((day) => (
                    <div
                      key={day}
                      className="rounded-[28px] border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="text-base font-semibold text-slate-900">
                          {day}
                        </div>
                        <Badge
                          text={`${(routePlan[selectedRepId]?.[day] || []).length} ТТ`}
                          tone="blue"
                        />
                      </div>
                      <div className="space-y-2">
                        {(routePlan[selectedRepId]?.[day] || []).map(
                          (storeId) => {
                            const store = stores.find((s) => s.id === storeId);
                            return (
                              <div
                                key={`${day}-${storeId}`}
                                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-sm font-semibold text-slate-900">
                                      {store ? store.name : 'ТТ'}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">
                                      {store ? store.channel : '—'}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      removeStoreFromDay(day, storeId)
                                    }
                                    className="text-xs font-semibold text-red-600"
                                  >
                                    убрать
                                  </button>
                                </div>
                              </div>
                            );
                          },
                        )}
                        <button
                          onClick={() => addStoreToDay(day)}
                          className="w-full rounded-2xl border border-dashed border-slate-300 px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-white"
                        >
                          + Добавить ТТ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </Shell>
        )}

        {page === 'orders' && (
          <Shell
            title="Заказы и продажи"
            subtitle="Заказы команды супервайзера с акцентом на план, отклонения и конверсию визит → заказ"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
                <KpiCard
                  title="Продажи команды"
                  value={money(teamOrders.reduce((s, o) => s + o.amount, 0))}
                  tone="green"
                />
                <KpiCard
                  title="Заказов"
                  value={`${teamOrders.length}`}
                  tone="blue"
                />
                <KpiCard
                  title="Средний чек"
                  value={money(
                    Math.round(
                      teamOrders.reduce((s, o) => s + o.amount, 0) /
                        Math.max(teamOrders.length, 1),
                    ),
                  )}
                />
                <KpiCard
                  title="Без заказа"
                  value={`${teamOrders.filter((o) => o.amount === 0).length}`}
                  tone="red"
                />
                <KpiCard title="Фокусные SKU" value="57%" tone="amber" />
                <KpiCard title="MML в заказе" value="71%" tone="blue" />
              </div>
              <SectionCard
                title="Заказы команды"
                subtitle="Клик по строке раскрывает связанную торговую точку и контекст продажи"
              >
                <TableShell>
                  <table className="w-full min-w-[1020px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                        <th className="px-4 py-3 font-medium">Дата</th>
                        <th className="px-4 py-3 font-medium">ТП</th>
                        <th className="px-4 py-3 font-medium">ТТ</th>
                        <th className="px-4 py-3 font-medium">Компания</th>
                        <th className="px-4 py-3 font-medium">Сумма</th>
                        <th className="px-4 py-3 font-medium">SKU</th>
                        <th className="px-4 py-3 font-medium">Units</th>
                        <th className="px-4 py-3 font-medium">Промо</th>
                        <th className="px-4 py-3 font-medium">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamOrders.map((o) => (
                        <tr
                          key={o.id}
                          className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                          onClick={() => setSelectedStoreId(o.storeId)}
                        >
                          <td className="px-4 py-3">{o.date}</td>
                          <td className="px-4 py-3">{o.rep}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {o.store}
                          </td>
                          <td className="px-4 py-3">{o.company}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {o.amount === 0 ? 'Нет заказа' : money(o.amount)}
                          </td>
                          <td className="px-4 py-3">{o.sku}</td>
                          <td className="px-4 py-3">{o.units}</td>
                          <td className="px-4 py-3">{o.promo}</td>
                          <td className="px-4 py-3">
                            <RowStatus text={o.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </SectionCard>
              <Store360 storeId={selectedStoreId} />
            </div>
          </Shell>
        )}

        {page === 'debts' && (
          <Shell
            title="Долги"
            subtitle="Супервайзер контролирует долги только по закрепленным ТТ и может быстро провалиться до карточки точки"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <KpiCard
                  title="Общий долг"
                  value={money(teamDebts.reduce((s, d) => s + d.total, 0))}
                  tone="red"
                />
                <KpiCard
                  title="Просрочка"
                  value={money(teamDebts.reduce((s, d) => s + d.overdue, 0))}
                  tone="red"
                />
                <KpiCard
                  title="ТТ с долгом"
                  value={`${teamDebts.length}`}
                  tone="amber"
                />
                <KpiCard
                  title="Частично оплачен"
                  value={`${teamDebts.filter((d) => d.status === 'Частично оплачен').length}`}
                  tone="amber"
                />
                <KpiCard
                  title="Критичные долги"
                  value={`${teamDebts.filter((d) => d.overdue > 50000).length}`}
                  tone="red"
                />
              </div>
              <SectionCard title="Реестр долгов команды">
                <TableShell>
                  <table className="w-full min-w-[980px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                        <th className="px-4 py-3 font-medium">ТТ</th>
                        <th className="px-4 py-3 font-medium">Компания</th>
                        <th className="px-4 py-3 font-medium">Договор</th>
                        <th className="px-4 py-3 font-medium">Общий долг</th>
                        <th className="px-4 py-3 font-medium">Просрочка</th>
                        <th className="px-4 py-3 font-medium">Накладных</th>
                        <th className="px-4 py-3 font-medium">ТП</th>
                        <th className="px-4 py-3 font-medium">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamDebts.map((d) => (
                        <tr
                          key={d.id}
                          className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                          onClick={() => setSelectedStoreId(d.storeId)}
                        >
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {d.store}
                          </td>
                          <td className="px-4 py-3">{d.company}</td>
                          <td className="px-4 py-3">{d.contract}</td>
                          <td className="px-4 py-3">{money(d.total)}</td>
                          <td className="px-4 py-3 font-semibold text-red-700">
                            {money(d.overdue)}
                          </td>
                          <td className="px-4 py-3">{d.invoices}</td>
                          <td className="px-4 py-3">{d.rep}</td>
                          <td className="px-4 py-3">
                            <RowStatus text={d.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </SectionCard>
              <Store360 storeId={selectedStoreId} />
            </div>
          </Shell>
        )}

        {page === 'shelf' && (
          <Shell
            title="Полка и стандарты"
            subtitle="MML, фокусные SKU, цены и фотоотчеты по зоне ответственности супервайзера"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
                <KpiCard
                  title="MML выполнение"
                  value={`${Math.round(teamShelf.reduce((s, r) => s + r.mml, 0) / teamShelf.length)}%`}
                  tone="amber"
                />
                <KpiCard
                  title="Фокусные SKU"
                  value={`${Math.round(teamShelf.reduce((s, r) => s + r.focus, 0) / teamShelf.length)}%`}
                  tone="amber"
                />
                {/* <KpiCard
                  title="Нарушения полки"
                  value={`${teamShelf.filter((r) => r.result === 'Проблема').length}`}
                  tone="red"
                /> */}
                <KpiCard
                  title="Риск по стандарту"
                  value={`${teamShelf.filter((r) => r.result === 'Риск').length}`}
                  tone="amber"
                />
                <KpiCard
                  title="Нет фото"
                  value={`${teamShelf.filter((r) => r.photo === 'Нет').length}`}
                  tone="red"
                />
                <KpiCard
                  title="Точек под контролем"
                  value={`${teamShelf.length}`}
                  tone="blue"
                />
              </div>
              <SectionCard
                title="Исполнение по ТТ команды"
                subtitle="Клик по точке раскрывает Store 360 и связанные отклонения"
              >
                <TableShell>
                  <table className="w-full min-w-[980px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                        <th className="px-4 py-3 font-medium">ТТ</th>
                        <th className="px-4 py-3 font-medium">Компания</th>
                        <th className="px-4 py-3 font-medium">MML</th>
                        <th className="px-4 py-3 font-medium">Фокус</th>
                        <th className="px-4 py-3 font-medium">Цена</th>
                        <th className="px-4 py-3 font-medium">Стандарт</th>
                        <th className="px-4 py-3 font-medium">Фото</th>
                        <th className="px-4 py-3 font-medium">Итог</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamShelf.map((r) => (
                        <tr
                          key={r.id}
                          className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                          onClick={() => setSelectedStoreId(r.storeId)}
                        >
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {r.store}
                          </td>
                          <td className="px-4 py-3">{r.company}</td>
                          <td className="px-4 py-3">{r.mml}%</td>
                          <td className="px-4 py-3">{r.focus}%</td>
                          <td className="px-4 py-3">
                            <RowStatus text={r.price} />
                          </td>
                          <td className="px-4 py-3">
                            <RowStatus text={r.standard} />
                          </td>
                          <td className="px-4 py-3">{r.photo}</td>
                          <td className="px-4 py-3">
                            <RowStatus text={r.result} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </SectionCard>
              <Store360 storeId={selectedStoreId} />
            </div>
          </Shell>
        )}

        {page === 'equipment' && (
          <Shell
            title="Оборудование"
            subtitle="Реестр холодильников, кег и другого оборудования только по точкам команды супервайзера"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
                <KpiCard
                  title="Всего оборудования"
                  value={`${teamEquipment.length}`}
                  tone="blue"
                />
                <KpiCard
                  title="Исправно"
                  value={`${teamEquipment.filter((e) => e.status === 'Исправно').length}`}
                  tone="green"
                />
                <KpiCard
                  title="Не найдено"
                  value={`${teamEquipment.filter((e) => e.status === 'Не найдено').length}`}
                  tone="red"
                />
                <KpiCard
                  title="Нужен сервис"
                  value={`${teamEquipment.filter((e) => e.status === 'Требует обслуживания').length}`}
                  tone="amber"
                />
                <KpiCard
                  title="Точек с риском"
                  value={`${new Set(teamEquipment.filter((e) => e.status !== 'Исправно').map((e) => e.store)).size}`}
                  tone="red"
                />
              </div>
              <SectionCard title="Реестр оборудования команды">
                <TableShell>
                  <table className="w-full min-w-[980px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                        <th className="px-4 py-3 font-medium">Тип</th>
                        <th className="px-4 py-3 font-medium">Бренд</th>
                        <th className="px-4 py-3 font-medium">
                          Серийный номер
                        </th>
                        <th className="px-4 py-3 font-medium">ТТ</th>
                        <th className="px-4 py-3 font-medium">Статус</th>
                        <th className="px-4 py-3 font-medium">
                          Последняя проверка
                        </th>
                        <th className="px-4 py-3 font-medium">Ответственный</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamEquipment.map((e) => (
                        <tr
                          key={e.id}
                          className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                          onClick={() => setSelectedStoreId(e.storeId)}
                        >
                          <td className="px-4 py-3">{e.type}</td>
                          <td className="px-4 py-3">{e.brand}</td>
                          <td className="px-4 py-3">{e.serial}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {e.store}
                          </td>
                          <td className="px-4 py-3">
                            <RowStatus text={e.status} />
                          </td>
                          <td className="px-4 py-3">{e.lastCheck}</td>
                          <td className="px-4 py-3">{e.owner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </SectionCard>
              <Store360 storeId={selectedStoreId} />
            </div>
          </Shell>
        )}

        {page === 'tasks' && (
          <Shell
            title="Задачи"
            subtitle="Центр корректирующих действий: каждая проблема должна быть привязана к ТТ, ТП и сроку исполнения"
          >
            <div className="flex gap-6">
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
                  <KpiCard
                    title="Открытые"
                    value={`${tasks.filter((t) => t.status === 'Открыта').length}`}
                    tone="red"
                  />
                  <KpiCard
                    title="В работе"
                    value={`${tasks.filter((t) => t.status === 'В работе').length}`}
                    tone="amber"
                  />
                  <KpiCard
                    title="Критичные"
                    value={`${tasks.filter((t) => t.priority === 'Критично').length}`}
                    tone="red"
                  />
                  <KpiCard
                    title="По визитам"
                    value={`${tasks.filter((t) => t.source === 'Полевое исполнение').length}`}
                    tone="blue"
                  />
                  <KpiCard
                    title="По долгам"
                    value={`${tasks.filter((t) => t.source === 'Долги').length}`}
                    tone="amber"
                  />
                  <KpiCard
                    title="По полке/оборудованию"
                    value={`${tasks.filter((t) => t.source === 'Полка' || t.source === 'Оборудование').length}`}
                    tone="blue"
                  />
                </div>
                <SectionCard
                  title="Реестр задач супервайзера"
                  subtitle="Все действия супервайзера фиксируются под его личной учетной записью"
                  action={
                    <div className="flex gap-2">
                      <FilterPill active>Все</FilterPill>
                      <FilterPill>Критичные</FilterPill>
                      <FilterPill>Открытые</FilterPill>
                    </div>
                  }
                >
                  <TableShell>
                    <table className="w-full min-w-[1040px] text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                          <th className="px-4 py-3 font-medium">Тип</th>
                          <th className="px-4 py-3 font-medium">ТТ</th>
                          <th className="px-4 py-3 font-medium">ТП</th>
                          <th className="px-4 py-3 font-medium">Источник</th>
                          <th className="px-4 py-3 font-medium">Приоритет</th>
                          <th className="px-4 py-3 font-medium">Срок</th>
                          <th className="px-4 py-3 font-medium">Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((t) => (
                          <tr
                            key={t.id}
                            className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                            onClick={() => setSelectedTaskId(t.id)}
                          >
                            <td className="px-4 py-3">{t.type}</td>
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {t.store}
                            </td>
                            <td className="px-4 py-3">{t.rep}</td>
                            <td className="px-4 py-3">{t.source}</td>
                            <td className="px-4 py-3">
                              <RowStatus text={t.priority} />
                            </td>
                            <td className="px-4 py-3">{t.due}</td>
                            <td className="px-4 py-3">
                              <RowStatus text={t.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableShell>
                </SectionCard>
              </div>
              <TaskDrawer
                task={selectedTask}
                onClose={() => setSelectedTaskId(null)}
                openStore={openStore}
              />
            </div>
          </Shell>
        )}

        {page === 'mml' && (
          <Shell
            title="MML территории"
            subtitle="MML задается не глобально, а по территории и зоне ответственности. Сейчас система показывает MML-шаблоны только авторизованного супервайзера."
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr,1.2fr]">
                <SectionCard
                  title="Логика MML"
                  subtitle="Как это работает в системе"
                >
                  <div className="space-y-3 text-sm leading-6 text-slate-700">
                    <div className="rounded-2xl bg-blue-50 p-4 text-blue-900">
                      MML не должен быть единым для всей компании. Он может
                      задаваться на территорию, регион, канал или команду. В
                      этом прототипе MML формируется супервайзером в пределах
                      своей территории ответственности.
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="font-semibold text-slate-900">
                        Что может делать супервайзер
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>создавать MML для своей территории;</li>
                        <li>редактировать свой MML-шаблон;</li>
                        <li>привязывать шаблон к компании и каналу;</li>
                        <li>
                          контролировать исполнение MML по визитам и полке.
                        </li>
                      </ul>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Активные MML-шаблоны супервайзера"
                  subtitle="Система отдает только шаблоны, владельцем которых является текущий пользователь"
                >
                  <div className="space-y-3">
                    {mmlTemplatesSeed.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMmlId(m.id)}
                        className={cls(
                          'w-full rounded-2xl border p-4 text-left transition',
                          selectedMmlId === m.id
                            ? 'border-slate-900 bg-slate-900 text-white shadow'
                            : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold">
                              {m.name}
                            </div>
                            <div
                              className={cls(
                                'mt-1 text-xs',
                                selectedMmlId === m.id
                                  ? 'text-slate-300'
                                  : 'text-slate-500',
                              )}
                            >
                              {m.ownerRole} • {m.ownerName}
                            </div>
                          </div>
                          <Badge
                            text={m.status}
                            tone={selectedMmlId === m.id ? 'slate' : 'green'}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </SectionCard>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr,1.05fr]">
                <SectionCard
                  title="Параметры выбранного MML-шаблона"
                  subtitle="Шаблон действует только в рамках заданной территории и канала"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <InfoCard
                      label="Владелец"
                      value={`${selectedMml.ownerRole} • ${selectedMml.ownerName}`}
                    />
                    <InfoCard label="Компания" value={selectedMml.company} />
                    <InfoCard
                      label="Тип территории"
                      value={selectedMml.territoryType}
                    />
                    <InfoCard
                      label="Территория"
                      value={selectedMml.territoryValue}
                    />
                    <InfoCard label="Канал" value={selectedMml.channel} />
                    <InfoCard
                      label="SKU в шаблоне"
                      value={`${selectedMml.skuCount}`}
                    />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm">
                      <Pencil size={16} />
                      Изменить шаблон
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      <Plus size={16} />
                      Создать новый
                    </button>
                  </div>
                </SectionCard>

                <SectionCard
                  title="SKU внутри выбранного MML"
                  subtitle="Именно этот список потом контролируется в мобильном приложении и в блоке Полка и стандарты"
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {selectedMml.skuList.map((sku) => (
                      <div
                        key={sku}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800"
                      >
                        {sku}
                      </div>
                    ))}
                    <button className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm font-semibold text-slate-600 hover:bg-white">
                      + Добавить SKU
                    </button>
                  </div>
                </SectionCard>
              </div>
            </div>
          </Shell>
        )}
      </div>
    </div>
  );
}
