// ============================================================
//  星読みプロンプト生成ツール  script.js
//  基準時刻：毎日 12:00 JST
// ============================================================

// ============================================================
// 1. 朔弦望データ（国立天文台 令和8年(2026)暦要項 JST）
// ============================================================
const MOON_PHASES_2026 = [
  { date: "2026-04-02", time: "11:12", phase: 2, label: "満月"  },
  { date: "2026-04-10", time: "13:52", phase: 3, label: "下弦"  },
  { date: "2026-04-17", time: "20:52", phase: 0, label: "新月"  },
  { date: "2026-04-24", time: "11:32", phase: 1, label: "上弦"  },
  { date: "2026-05-02", time: "02:23", phase: 2, label: "満月"  },
  { date: "2026-05-10", time: "06:10", phase: 3, label: "下弦"  },
  { date: "2026-05-17", time: "05:01", phase: 0, label: "新月"  },
  { date: "2026-05-23", time: "20:11", phase: 1, label: "上弦"  },
  { date: "2026-05-31", time: "17:45", phase: 2, label: "満月"  },
  { date: "2026-06-08", time: "19:01", phase: 3, label: "下弦"  },
  { date: "2026-06-15", time: "11:54", phase: 0, label: "新月"  },
  { date: "2026-06-22", time: "06:55", phase: 1, label: "上弦"  },
  { date: "2026-06-30", time: "08:57", phase: 2, label: "満月"  },
  { date: "2026-07-08", time: "04:29", phase: 3, label: "下弦"  },
  { date: "2026-07-14", time: "18:44", phase: 0, label: "新月"  },
  { date: "2026-07-21", time: "20:06", phase: 1, label: "上弦"  },
  { date: "2026-07-29", time: "23:36", phase: 2, label: "満月"  },
  { date: "2026-08-06", time: "11:21", phase: 3, label: "下弦"  },
  { date: "2026-08-13", time: "02:37", phase: 0, label: "新月"  },
  { date: "2026-08-20", time: "11:46", phase: 1, label: "上弦"  },
  { date: "2026-08-28", time: "13:19", phase: 2, label: "満月"  },
  { date: "2026-09-04", time: "16:51", phase: 3, label: "下弦"  },
  { date: "2026-09-11", time: "12:27", phase: 0, label: "新月"  },
  { date: "2026-09-19", time: "05:44", phase: 1, label: "上弦"  },
  { date: "2026-09-27", time: "01:49", phase: 2, label: "満月"  },
  { date: "2026-10-03", time: "22:25", phase: 3, label: "下弦"  },
  { date: "2026-10-11", time: "00:50", phase: 0, label: "新月"  },
  { date: "2026-10-19", time: "01:13", phase: 1, label: "上弦"  },
  { date: "2026-10-26", time: "13:12", phase: 2, label: "満月"  },
  { date: "2026-11-02", time: "05:28", phase: 3, label: "下弦"  },
  { date: "2026-11-09", time: "16:02", phase: 0, label: "新月"  },
  { date: "2026-11-17", time: "20:48", phase: 1, label: "上弦"  },
  { date: "2026-11-24", time: "23:54", phase: 2, label: "満月"  },
  { date: "2026-12-01", time: "15:09", phase: 3, label: "下弦"  },
  { date: "2026-12-09", time: "09:52", phase: 0, label: "新月"  },
  { date: "2026-12-17", time: "14:43", phase: 1, label: "上弦"  },
  { date: "2026-12-24", time: "10:28", phase: 2, label: "満月"  },
  { date: "2026-12-31", time: "03:59", phase: 3, label: "下弦"  },
];

function phaseToUtcMs(p) {
  const [y, m, d] = p.date.split("-").map(Number);
  const [h, min]  = p.time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, h - 9, min, 0);
}

// ============================================================
// 2. 月相ユーティリティ
// ============================================================
function getMoonPhaseForDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const baseUtcMs = Date.UTC(y, m - 1, d, 3, 0, 0);
  let best = null, bestMs = -Infinity;
  for (const p of MOON_PHASES_2026) {
    const pMs = phaseToUtcMs(p);
    if (pMs <= baseUtcMs && pMs > bestMs) { bestMs = pMs; best = p; }
  }
  return best;
}

function formatMoonPhase(p) {
  if (!p) return "月相データなし（対象外期間）";
  const [y, m, d] = p.date.split("-").map(Number);
  return `${p.label}（${y}年${m}月${d}日 ${p.time} JST）`;
}

// ============================================================
// 3. 天体位置計算（VSOP87 簡略版）
// ============================================================
function dateToJD(dateStr, hour = 12) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const utcHour = hour - 9;
  let Y = y, M = m;
  if (M <= 2) { Y--; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25*(Y+4716)) + Math.floor(30.6001*(M+1)) + d + utcHour/24 + B - 1524.5;
}
function jdToT(jd) { return (jd - 2451545.0) / 36525.0; }
function normDeg(d) { return ((d % 360) + 360) % 360; }

function sunLon(T) {
  const L0 = normDeg(280.46646 + 36000.76983*T);
  const M  = normDeg(357.52911 + 35999.05029*T - 0.0001537*T*T);
  const Mr = M * Math.PI/180;
  return normDeg(L0 + (1.914602-0.004817*T)*Math.sin(Mr)
    + (0.019993-0.000101*T)*Math.sin(2*Mr) + 0.000289*Math.sin(3*Mr));
}
function moonLon(T) {
  const D   = normDeg(297.85036 + 445267.111480*T);
  const Mp  = normDeg(134.96298 + 477198.867398*T);
  const F   = normDeg(93.27191  + 483202.017538*T);
  const Mr  = normDeg(357.52772 +  35999.050340*T) * Math.PI/180;
  const Dr  = D*Math.PI/180, Mpr = Mp*Math.PI/180, Fr = F*Math.PI/180;
  return normDeg(218.3165 + 481267.8813*T
    + 6.289*Math.sin(Mpr) - 1.274*Math.sin(Mpr-2*Dr)
    + 0.658*Math.sin(2*Dr) + 0.214*Math.sin(2*Mpr)
    - 0.186*Math.sin(Mr)  - 0.114*Math.sin(2*Fr));
}
function mercuryLon(T) { return normDeg(252.250906 + 149474.0722491*T); }
function venusLon(T)   { return normDeg(181.979801 +  58519.2130302*T); }
function marsLon(T)    { return normDeg(355.433000 +  19141.6964471*T); }
function jupiterLon(T) { return normDeg( 34.351519 +   3036.3027748*T); }
function saturnLon(T)  { return normDeg( 50.077444 +   1223.5110686*T); }
function uranusLon(T)  { return normDeg(314.055005 +    429.8640561*T); }
function neptuneLon(T) { return normDeg(304.348665 +    219.8833092*T); }
function plutoLon(T)   { return normDeg(238.958116 +    144.9600629*T); }

const SIGNS = ["牡羊座","牡牛座","双子座","蟹座","獅子座","乙女座",
               "天秤座","蠍座","射手座","山羊座","水瓶座","魚座"];
function lonToSign(lon) {
  const idx = Math.floor(normDeg(lon)/30);
  return `${SIGNS[idx]}${Math.floor(normDeg(lon)%30)}°`;
}

function getPlanets(dateStr) {
  const T = jdToT(dateToJD(dateStr));
  return {
    sun:     { lon: sunLon(T),     label: "太陽",   sym: "☉", outer: false },
    moon:    { lon: moonLon(T),    label: "月",     sym: "☽", outer: false },
    mercury: { lon: mercuryLon(T), label: "水星",   sym: "☿", outer: false },
    venus:   { lon: venusLon(T),   label: "金星",   sym: "♀", outer: false },
    mars:    { lon: marsLon(T),    label: "火星",   sym: "♂", outer: false },
    jupiter: { lon: jupiterLon(T), label: "木星",   sym: "♃", outer: true  },
    saturn:  { lon: saturnLon(T),  label: "土星",   sym: "♄", outer: true  },
    uranus:  { lon: uranusLon(T),  label: "天王星", sym: "♅", outer: true  },
    neptune: { lon: neptuneLon(T), label: "海王星", sym: "♆", outer: true  },
    pluto:   { lon: plutoLon(T),   label: "冥王星", sym: "♇", outer: true  },
  };
}

// ============================================================
// 4. アスペクト計算
//    コンジャン/オポ: 5° / スクエア/トライン: 4° / セクスタイル: 3°
//    月が絡む場合: +1°　タイト: オーブ1.5°以内 = ★
// ============================================================
const ASPECT_DEFS = [
  { name: "コンジャンクション", angle: 0,   baseOrb: 5 },
  { name: "オポジション",       angle: 180, baseOrb: 5 },
  { name: "スクエア",           angle: 90,  baseOrb: 4 },
  { name: "トライン",           angle: 120, baseOrb: 4 },
  { name: "セクスタイル",       angle: 60,  baseOrb: 3 },
];

function calcAspect(lon1, lon2, isMoon = false) {
  let diff = Math.abs(normDeg(lon1) - normDeg(lon2));
  if (diff > 180) diff = 360 - diff;
  for (const a of ASPECT_DEFS) {
    const maxOrb = a.baseOrb + (isMoon ? 1 : 0);
    const orb    = Math.abs(diff - a.angle);
    if (orb <= maxOrb) {
      const tight = orb <= 1.5;
      return { name: a.name, orb: +orb.toFixed(1), tight, marker: tight ? "★" : "☆" };
    }
  }
  return null;
}

function sortByOrb(arr) {
  return arr.slice().sort((a, b) => a._orb - b._orb);
}

// ============================================================
// 5. ネイタルデータ
// ============================================================
const NATAL = {
  sun:     { lon: 9*30+18.45,  label: "太陽",    sign: "山羊座18°27'" },
  moon:    { lon: 10*30+6.63,  label: "月",      sign: "水瓶座6°38'"  },
  mercury: { lon: 9*30+27.77,  label: "水星r",   sign: "山羊座27°46'" },
  venus:   { lon: 9*30+14.68,  label: "金星",    sign: "山羊座14°41'" },
  mars:    { lon: 11*30+18.30, label: "火星",    sign: "魚座18°18'"   },
  jupiter: { lon: 7*30+3.35,   label: "木星",    sign: "蠍座3°21'"    },
  saturn:  { lon: 1*30+2.07,   label: "土星",    sign: "牡牛座2°4'"   },
  uranus:  { lon: 6*30+8.78,   label: "天王星",  sign: "天秤座8°47'"  },
  neptune: { lon: 8*30+0.12,   label: "海王星",  sign: "射手座0°7'"   },
  pluto:   { lon: 5*30+27.35,  label: "冥王星r", sign: "乙女座27°21'" },
  asc:     { lon: 1*30+10,     label: "ASC",     sign: "牡牛座10°"    },
  mc:      { lon: 9*30+24.97,  label: "MC",      sign: "山羊座24°58'" },
};

const NATAL_SUMMARY = `出生：1970年1月9日 12:16 JST 横浜市
ASC:牡牛座10° / MC:山羊座24°58'
☉太陽:山羊座18°27' / ☽月:水瓶座6°38'
☿水星:山羊座27°46'r / ♀金星:山羊座14°41'
♂火星:魚座18°18' / ♃木星:蠍座3°21'
♄土星:牡牛座2°4' / ♅天王星:天秤座8°47'
♆海王星:射手座0°7' / ♇冥王星:乙女座27°21'r`;

// ============================================================
// 6. アスペクト一覧ヘルパー（単日）
// ============================================================
function getMoonAspects(planets, limit = 99) {
  const moonL = planets.moon.lon;
  const results = [];
  for (const [k, p] of Object.entries(planets)) {
    if (k === "moon") continue;
    const asp = calcAspect(moonL, p.lon, true);
    if (asp) results.push({
      text: `${asp.marker} 月（${lonToSign(moonL)}）${asp.name}${p.label}（${lonToSign(p.lon)}）オーブ${asp.orb}°`,
      _orb: asp.orb, tight: asp.tight, name: asp.name,
      p1: "月", p2: p.label
    });
  }
  return sortByOrb(results).slice(0, limit);
}

function getTransitAspects(planets, limit = 12) {
  const keys = Object.keys(planets);
  const results = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i+1; j < keys.length; j++) {
      const p1 = planets[keys[i]], p2 = planets[keys[j]];
      const isMoon = keys[i]==="moon" || keys[j]==="moon";
      const asp = calcAspect(p1.lon, p2.lon, isMoon);
      if (asp) results.push({
        text: `${asp.marker} ${p1.label}（${lonToSign(p1.lon)}）${asp.name}${p2.label}（${lonToSign(p2.lon)}）オーブ${asp.orb}°`,
        _orb: asp.orb, tight: asp.tight, name: asp.name,
        p1: p1.label, p2: p2.label,
        isOuter: p1.outer || p2.outer
      });
    }
  }
  return sortByOrb(results).slice(0, limit);
}

function getNatalTransitAspects(planets, limit = 10) {
  const outerFirst = ["pluto","neptune","uranus","saturn","jupiter","sun","moon","mars","venus","mercury"];
  const results = [];
  for (const tk of outerFirst) {
    if (!planets[tk]) continue;
    const tp = planets[tk];
    for (const np of Object.values(NATAL)) {
      const isMoon = tk === "moon";
      const asp = calcAspect(tp.lon, np.lon, isMoon);
      if (asp) results.push({
        text: `${asp.marker} T${tp.label}（${lonToSign(tp.lon)}）${asp.name}N${np.label}（${np.sign}）オーブ${asp.orb}°`,
        _orb: asp.orb, tight: asp.tight, name: asp.name,
        tp: tp.label, np: np.label,
        isOuter: planets[tk].outer
      });
    }
  }
  return sortByOrb(results).slice(0, limit);
}

function countNatalAspects(planets) {
  let n = 0;
  for (const [tk, tp] of Object.entries(planets))
    for (const np of Object.values(NATAL))
      if (calcAspect(tp.lon, np.lon, tk==="moon")) n++;
  return n;
}

// ============================================================
// 7. ユーティリティ
// ============================================================
function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00+09:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function detectIngress(dateStr, planets) {
  const pPrev = getPlanets(addDays(dateStr, -1));
  const out = [];
  for (const k of Object.keys(planets)) {
    const sNow  = Math.floor(normDeg(planets[k].lon) / 30);
    const sPrev = Math.floor(normDeg(pPrev[k].lon)   / 30);
    if (sNow !== sPrev)
      out.push(`${planets[k].label}が${SIGNS[sNow]}へ移動（イングレス）`);
  }
  return out;
}

function getWeekRange(dateStr) {
  const d = new Date(dateStr + "T12:00:00+09:00");
  const day = d.getDay();
  const mon = new Date(d); mon.setDate(d.getDate() + (day===0 ? -6 : 1-day));
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const fmt = dt => `${dt.getFullYear()}年${dt.getMonth()+1}月${dt.getDate()}日`;
  const iso = dt => dt.toISOString().slice(0, 10);
  return { start: iso(mon), end: iso(sun), startLabel: fmt(mon), endLabel: fmt(sun) };
}

function getMonthRange(dateStr) {
  const [y, m] = dateStr.split("-").map(Number);
  const pad = n => String(n).padStart(2,"0");
  return { year: y, month: m,
    start: `${y}-${pad(m)}-01`,
    end:   `${y}-${pad(m)}-${new Date(y,m,0).getDate()}`,
    label: `${y}年${m}月` };
}

function getMonthMoonPhases(year, month) {
  return MOON_PHASES_2026.filter(p => {
    const [y,m] = p.date.split("-").map(Number);
    return y===year && m===month;
  });
}

function shortDate(dateStr) {
  const [,m,d] = dateStr.split("-").map(Number);
  return `${m}/${d}`;
}

// ============================================================
// 8. 集計関数
// ============================================================

/**
 * summarizeWeekFlow(dateStr)
 * 週7日を走査してアスペクト・月相・イングレス・ピーク日を集計
 */
function summarizeWeekFlow(dateStr) {
  const range = getWeekRange(dateStr);

  // 月相
  const moonPhases = MOON_PHASES_2026.filter(p => p.date >= range.start && p.date <= range.end);

  // 日別集計
  const days = [];
  for (let i = 0; i <= 6; i++) {
    const ds  = addDays(range.start, i);
    const pl  = getPlanets(ds);
    const ing = detectIngress(ds, pl);
    const moonAsp    = getMoonAspects(pl);
    const transitAsp = getTransitAspects(pl, 12).filter(a => !a.p1.includes("月") && !a.p2?.includes("月") );
    const tightAll   = [...moonAsp, ...transitAsp].filter(a => a.tight);
    days.push({ ds, pl, ing, moonAsp, transitAsp, tightAll,
      score: moonAsp.length + transitAsp.length + tightAll.length * 2 });
  }

  // ピーク日（スコア上位2〜3日）
  const sorted = [...days].sort((a,b) => b.score - a.score);
  const peakDays = sorted.slice(0, 3).sort((a,b) => a.ds.localeCompare(b.ds))
    .map(d => `${shortDate(d.ds)}（月asp:${d.moonAsp.length}件 主要asp:${d.transitAsp.length}件${d.tightAll.length>0?" ★"+d.tightAll.length+"件":""}）`);

  // 繰り返し出るアスペクト名（3日以上登場）
  const aspCount = {};
  for (const day of days) {
    const seen = new Set();
    for (const a of [...day.moonAsp, ...day.transitAsp]) {
      const key = `${a.p1}×${a.name}`;
      if (!seen.has(key)) { aspCount[key] = (aspCount[key]||0)+1; seen.add(key); }
    }
  }
  const repeatedAsp = Object.entries(aspCount)
    .filter(([,n]) => n >= 3).sort((a,b) => b[1]-a[1])
    .map(([k,n]) => `${k}（${n}日間）`);

  // 週前半(月〜水)・後半(木〜日)のタイトアスペクト集約
  const firstHalf  = days.slice(0, 3).flatMap(d => d.tightAll.map(a=>a.text));
  const secondHalf = days.slice(3, 7).flatMap(d => d.tightAll.map(a=>a.text));

  // イングレス
  const ingresses = days.flatMap(d =>
    d.ing.map(s => `${shortDate(d.ds)}：${s}`)
  );

  // 月アスペクト代表（週全体でタイト上位5）
  const allMoonAsp = days.flatMap(d => d.moonAsp.map(a => ({...a, ds: d.ds})));
  const topMoonAsp = sortByOrb(allMoonAsp).slice(0, 5)
    .map(a => `${shortDate(a.ds)} ${a.text}`);

  // 主要惑星アスペクト代表（外天体絡み・タイト上位5）
  const allOuter = days.flatMap(d => d.transitAsp.filter(a => a.isOuter).map(a => ({...a, ds: d.ds})));
  const topOuter = sortByOrb(allOuter).slice(0, 5)
    .map(a => `${shortDate(a.ds)} ${a.text}`);

  return { range, moonPhases, peakDays, repeatedAsp,
    firstHalf, secondHalf, ingresses, topMoonAsp, topOuter };
}

/**
 * summarizeMonthFlow(dateStr)
 * 月全体を走査して一般向けフロー集計
 */
function summarizeMonthFlow(dateStr) {
  const range  = getMonthRange(dateStr);
  const phases = getMonthMoonPhases(range.year, range.month);
  const days   = new Date(range.year, range.month, 0).getDate();
  const pad    = n => String(n).padStart(2,"0");

  const dayData = [];
  for (let d = 1; d <= days; d++) {
    const ds  = `${range.year}-${pad(range.month)}-${pad(d)}`;
    const pl  = getPlanets(ds);
    const ing = detectIngress(ds, pl);
    const moonAsp    = getMoonAspects(pl);
    const transitAsp = getTransitAspects(pl, 12).filter(a => !a.p1.includes("月") && !a.p2?.includes("月"));
    const tightAll   = [...moonAsp, ...transitAsp].filter(a => a.tight);
    dayData.push({ d, ds, ing, moonAsp, transitAsp, tightAll,
      score: moonAsp.length + transitAsp.length + tightAll.length * 2 });
  }

  // ピーク日（上位4日）
  const peakDays = [...dayData].sort((a,b) => b.score - a.score).slice(0, 4)
    .sort((a,b) => a.d - b.d)
    .map(x => `${range.month}/${x.d}（月asp:${x.moonAsp.length}件 主要asp:${x.transitAsp.length}件${x.tightAll.length>0?" ★"+x.tightAll.length+"件":""}）`);

  // イングレス
  const ingresses = dayData.flatMap(x =>
    x.ing.map(s => `${range.month}/${x.d}：${s}`)
  );

  // 繰り返し出るアスペクト（4日以上）
  const aspCount = {};
  for (const x of dayData) {
    const seen = new Set();
    for (const a of [...x.moonAsp, ...x.transitAsp]) {
      const key = `${a.p1}×${a.name}`;
      if (!seen.has(key)) { aspCount[key] = (aspCount[key]||0)+1; seen.add(key); }
    }
  }
  const repeatedAsp = Object.entries(aspCount)
    .filter(([,n]) => n >= 4).sort((a,b) => b[1]-a[1])
    .map(([k,n]) => `${k}（${n}日間）`).slice(0, 6);

  // 外天体絡みアスペクト上位（タイト優先）
  const allOuter = dayData.flatMap(x =>
    x.transitAsp.filter(a => a.isOuter).map(a => ({...a, ds: x.ds, d: x.d}))
  );
  const topOuter = sortByOrb(allOuter).slice(0, 8)
    .map(a => `${range.month}/${a.d} ${a.text}`);

  // 月アスペクト上位（タイト優先）
  const allMoonAsp = dayData.flatMap(x => x.moonAsp.map(a => ({...a, d: x.d})));
  const topMoonAsp = sortByOrb(allMoonAsp).slice(0, 6)
    .map(a => `${range.month}/${a.d} ${a.text}`);

  // 前半（1〜15日）・後半（16日〜）の傾向スコア
  const firstHalfDays  = dayData.filter(x => x.d <= 15);
  const secondHalfDays = dayData.filter(x => x.d > 15);
  const halfSummary = (arr) => {
    const tightCount = arr.reduce((s,x)=>s+x.tightAll.length,0);
    const outerCount = arr.reduce((s,x)=>s+x.transitAsp.filter(a=>a.isOuter).length,0);
    return `タイトasp:${tightCount}件 外天体asp:${outerCount}件`;
  };

  // 外天体配置（月初）
  const startP     = getPlanets(range.start);
  const outerPos   = ["jupiter","saturn","uranus","neptune","pluto"]
    .map(k => `${startP[k].label}：${lonToSign(startP[k].lon)}`).join("\n");

  return { range, phases, peakDays, ingresses, repeatedAsp,
    topOuter, topMoonAsp, outerPos,
    firstHalf: halfSummary(firstHalfDays),
    secondHalf: halfSummary(secondHalfDays) };
}

/**
 * summarizeMonthPersonalFlow(dateStr)
 * 月全体でネイタル×トランジットを走査
 */
function summarizeMonthPersonalFlow(dateStr) {
  const range  = getMonthRange(dateStr);
  const phases = getMonthMoonPhases(range.year, range.month);
  const days   = new Date(range.year, range.month, 0).getDate();
  const pad    = n => String(n).padStart(2,"0");

  const dayData = [];
  for (let d = 1; d <= days; d++) {
    const ds  = `${range.year}-${pad(range.month)}-${pad(d)}`;
    const pl  = getPlanets(ds);
    const ing = detectIngress(ds, pl);
    const natalAsp = getNatalTransitAspects(pl, 20);
    const tightAsp = natalAsp.filter(a => a.tight);
    dayData.push({ d, ds, ing, natalAsp, tightAsp,
      score: natalAsp.length + tightAsp.length * 2 });
  }

  // ピーク日（上位4日）
  const peakDays = [...dayData].sort((a,b) => b.score - a.score).slice(0, 4)
    .sort((a,b) => a.d - b.d)
    .map(x => `${range.month}/${x.d}（ネイタルasp:${x.natalAsp.length}件${x.tightAsp.length>0?" ★タイト"+x.tightAsp.length+"件":""}）`);

  // イングレス
  const ingresses = dayData.flatMap(x =>
    x.ing.map(s => `${range.month}/${x.d}：${s}`)
  );

  // 外天体×ネイタルのタイトアスペクト（全月で収集・上位10）
  const allOuterNatal = dayData.flatMap(x =>
    x.natalAsp.filter(a => a.isOuter).map(a => ({...a, d: x.d}))
  );
  const topOuterNatal = sortByOrb(allOuterNatal).slice(0, 10)
    .map(a => `${range.month}/${a.d} ${a.text}`);

  // 繰り返し出るネイタルアスペクト（外天体×ネイタル、3日以上）
  const aspCount = {};
  for (const x of dayData) {
    const seen = new Set();
    for (const a of x.natalAsp.filter(b => b.isOuter)) {
      const key = `T${a.tp}×${a.name}×N${a.np}`;
      if (!seen.has(key)) { aspCount[key] = (aspCount[key]||0)+1; seen.add(key); }
    }
  }
  const repeatedAsp = Object.entries(aspCount)
    .filter(([,n]) => n >= 3).sort((a,b) => b[1]-a[1])
    .map(([k,n]) => `${k}（${n}日間）`).slice(0, 8);

  // 前半・後半
  const firstHalfDays  = dayData.filter(x => x.d <= 15);
  const secondHalfDays = dayData.filter(x => x.d > 15);
  const halfNatal = (arr) => {
    const total  = arr.reduce((s,x)=>s+x.natalAsp.length,0);
    const tight  = arr.reduce((s,x)=>s+x.tightAsp.length,0);
    const outer  = arr.reduce((s,x)=>s+x.natalAsp.filter(a=>a.isOuter).length,0);
    return `ネイタルasp計:${total}件 うち★タイト:${tight}件 外天体:${outer}件`;
  };

  return { range, phases, peakDays, ingresses, repeatedAsp,
    topOuterNatal,
    firstHalf: halfNatal(firstHalfDays),
    secondHalf: halfNatal(secondHalfDays) };
}

// ============================================================
// 9. プロンプト生成
// ============================================================

function buildTodayPersonal(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const label     = `${y}年${m}月${d}日`;
  const moon      = getMoonPhaseForDate(dateStr);
  const planets   = getPlanets(dateStr);
  const ingresses = detectIngress(dateStr, planets);
  const transitTxt = Object.values(planets)
    .map(p => `${p.sym} ${p.label}：${lonToSign(p.lon)}`).join("\n");
  const natalAsp   = getNatalTransitAspects(planets);
  const natalTxt   = natalAsp.length > 0 ? natalAsp.map(a=>a.text).join("\n") : "（主要アスペクトなし）";
  const ingTxt     = ingresses.length > 0 ? "\n◆イングレス\n" + ingresses.join("\n") : "";

  return `プロの西洋占星術師として以下のデータでクライアントへのアドバイスをください。

【クライアント ネイタル】
${NATAL_SUMMARY}

【${label}】月相：${formatMoonPhase(moon)}${ingTxt}

◆トランジット天体配置
${transitTxt}

◆ネイタルとのトランジットアスペクト（★タイト優先・外天体優先）
${natalTxt}

上記データをもとに300字以内で以下の形式でお願いします：
・今日の特徴
・行動（2〜3つ）
・注意点
・クライアントへのメッセージ`;
}

function buildTodayGeneral(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const label     = `${y}年${m}月${d}日`;
  const moon      = getMoonPhaseForDate(dateStr);
  const planets   = getPlanets(dateStr);
  const ingresses = detectIngress(dateStr, planets);
  const placeTxt  = Object.values(planets).map(p => `${p.sym} ${p.label}：${lonToSign(p.lon)}`).join("\n");
  const moonAsp   = getMoonAspects(planets);
  const moonTxt   = moonAsp.length > 0 ? moonAsp.map(a=>a.text).join("\n") : "（月の主要アスペクトなし）";
  const allAsp    = getTransitAspects(planets, 8);
  const majorAsp  = allAsp.filter(a => !a.p1.includes("月")).slice(0, 6);
  const majorTxt  = majorAsp.length > 0 ? majorAsp.map(a=>a.text).join("\n") : "（主要惑星間アスペクトなし）";
  const ingTxt    = ingresses.length > 0 ? "\n◆イングレス\n" + ingresses.join("\n") : "";

  return `プロの西洋占星術師として、一般の人向けに今日の星読みをしてください。

【${label}】月相：${formatMoonPhase(moon)}${ingTxt}

◆天体配置
${placeTxt}

◆月のアスペクト（★タイト優先）
${moonTxt}

◆主要惑星間アスペクト（★タイト優先）
${majorTxt}

上記データをもとに300字以内で以下の形式でお願いします：
・今日の特徴
・行動
・注意点
・今日のメッセージ`;
}

function buildWeekGeneral(dateStr) {
  const f = summarizeWeekFlow(dateStr);
  const { range, moonPhases, peakDays, repeatedAsp,
          firstHalf, secondHalf, ingresses, topMoonAsp, topOuter } = f;

  const moonPhaseTxt = moonPhases.length > 0
    ? moonPhases.map(p => `・${formatMoonPhase(p)}`).join("\n")
    : "（今週の朔弦望なし）";
  const ingressTxt  = ingresses.length > 0 ? ingresses.join("\n") : "（今週のイングレスなし）";
  const repeatTxt   = repeatedAsp.length > 0 ? repeatedAsp.join("\n") : "（特になし）";
  const peakTxt     = peakDays.join("\n");
  const fhTxt       = firstHalf.length > 0 ? firstHalf.join("\n") : "（なし）";
  const shTxt       = secondHalf.length > 0 ? secondHalf.join("\n") : "（なし）";
  const moonAspTxt  = topMoonAsp.length > 0 ? topMoonAsp.join("\n") : "（なし）";
  const outerAspTxt = topOuter.length > 0 ? topOuter.join("\n") : "（なし）";

  return `プロの西洋占星術師として、今週の星読みをしてください。

【今週：${range.startLabel}〜${range.endLabel}】

◆今週の月相
${moonPhaseTxt}

◆今週のイングレス
${ingressTxt}

◆週を通して繰り返し出るアスペクト（3日以上）
${repeatTxt}

◆ピーク日（アスペクト集中日）
${peakTxt}

◆週前半（月〜水）のタイトアスペクト
${fhTxt}

◆週後半（木〜日）のタイトアスペクト
${shTxt}

◆今週の月アスペクト抜粋（タイト優先）
${moonAspTxt}

◆今週の外天体アスペクト抜粋（タイト優先）
${outerAspTxt}

以上を踏まえ、今週の全体的な流れを300字以内でまとめてください：
・今週を貫くテーマ（繰り返し出るアスペクトから読む）
・強い日・変化の日（ピーク日を参照）
・前半／後半の流れの違い
・今週のメッセージ`;
}

function buildMonthGeneral(dateStr) {
  const f = summarizeMonthFlow(dateStr);
  const { range, phases, peakDays, ingresses, repeatedAsp,
          topOuter, topMoonAsp, outerPos,
          firstHalf, secondHalf } = f;

  const moonPhaseTxt = phases.length > 0
    ? phases.map(p => `・${formatMoonPhase(p)}`).join("\n")
    : "（月相データなし）";
  const ingressTxt  = ingresses.length > 0 ? ingresses.join("\n") : "（今月のイングレスなし）";
  const repeatTxt   = repeatedAsp.length > 0 ? repeatedAsp.join("\n") : "（特になし）";
  const peakTxt     = peakDays.join("\n");
  const outerAspTxt = topOuter.length > 0 ? topOuter.join("\n") : "（なし）";
  const moonAspTxt  = topMoonAsp.length > 0 ? topMoonAsp.join("\n") : "（なし）";

  return `プロの西洋占星術師として、一般の人向けに今月の星読みをしてください。

【${range.label}】

◆今月の新月・満月
${moonPhaseTxt}

◆今月のイングレス
${ingressTxt}

◆外天体配置（月初時点）
${outerPos}

◆月を通して繰り返し出るアスペクト（4日以上）
${repeatTxt}

◆ピーク日（アスペクト集中日）
${peakTxt}

◆前半（1〜15日）の傾向：${firstHalf}
◆後半（16日〜）の傾向：${secondHalf}

◆今月の外天体アスペクト抜粋（タイト優先）
${outerAspTxt}

◆今月の月アスペクト抜粋（タイト優先）
${moonAspTxt}

以上を踏まえ、今月の全体的な流れを300字以内でまとめてください：
・今月を貫くテーマ（繰り返し出るアスペクト・外天体の動きから）
・前半と後半で変わること
・ピーク日とその意味
・注意点
・今月のメッセージ`;
}

function buildMonthPersonal(dateStr) {
  const f = summarizeMonthPersonalFlow(dateStr);
  const { range, phases, peakDays, ingresses, repeatedAsp,
          topOuterNatal, firstHalf, secondHalf } = f;

  const moonPhaseTxt = phases.length > 0
    ? phases.map(p => `・${formatMoonPhase(p)}`).join("\n")
    : "（月相データなし）";
  const ingressTxt   = ingresses.length > 0 ? ingresses.join("\n") : "（今月のイングレスなし）";
  const repeatTxt    = repeatedAsp.length > 0 ? repeatedAsp.join("\n") : "（特になし）";
  const peakTxt      = peakDays.join("\n");
  const outerNatalTxt= topOuterNatal.length > 0 ? topOuterNatal.join("\n") : "（なし）";

  return `プロの西洋占星術師として、以下のデータをもとに今月のアドバイスをください。

【クライアント ネイタル】
${NATAL_SUMMARY}

【${range.label}】

◆今月の新月・満月
${moonPhaseTxt}

◆今月のイングレス
${ingressTxt}

◆月全体で繰り返し出る外天体×ネイタルアスペクト（3日以上継続）
${repeatTxt}

◆ピーク日（ネイタルアスペクト集中日）
${peakTxt}

◆前半（1〜15日）の強度：${firstHalf}
◆後半（16日〜）の強度：${secondHalf}

◆今月の外天体×ネイタル タイトアスペクト抜粋
${outerNatalTxt}

以上を踏まえ、300字以内で以下の形式でお願いします：
・今月のテーマ（1〜2個：繰り返し出るアスペクトから）
・強い影響が出る時期（前半／後半＋ピーク日）
・意識すると良いこと（2〜3つ）
・注意点（1つ）
・クライアントへのメッセージ`;
}

// ============================================================
// 10. UI ロジック
// ============================================================
const datePicker    = document.getElementById("datePicker");
const todayBtn      = document.getElementById("todayBtn");
const moonDisplay   = document.getElementById("moonDisplay");
const outputSection = document.getElementById("outputSection");
const outputLabel   = document.getElementById("outputLabel");
const outputText    = document.getElementById("outputText");
const copyBtn       = document.getElementById("copyBtn");

function getTodayJST() {
  const jst = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  return jst.toISOString().slice(0, 10);
}

function updateMoonDisplay(dateStr) {
  const p = getMoonPhaseForDate(dateStr);
  moonDisplay.textContent = p
    ? `🌙 月相：${formatMoonPhase(p)}`
    : "🌙 月相：データなし（対象外期間）";
}

const today = getTodayJST();
datePicker.value = today;
updateMoonDisplay(today);

datePicker.addEventListener("change", () => {
  updateMoonDisplay(datePicker.value); outputSection.style.display = "none";
});
todayBtn.addEventListener("click", () => {
  datePicker.value = getTodayJST(); updateMoonDisplay(datePicker.value);
  outputSection.style.display = "none";
});

const BUILDERS = {
  "today-personal": [buildTodayPersonal, "① 今日（個人）"],
  "today-general":  [buildTodayGeneral,  "② 今日（一般）"],
  "week-general":   [buildWeekGeneral,   "③ 今週（一般）"],
  "month-general":  [buildMonthGeneral,  "④ 今月（一般）"],
  "month-personal": [buildMonthPersonal, "⑤ 今月（個人）"],
};

document.querySelectorAll(".btn[data-mode]").forEach(btn => {
  btn.addEventListener("click", () => {
    const dateStr = datePicker.value;
    if (!dateStr) { alert("日付を選択してください"); return; }
    const [builder, label] = BUILDERS[btn.dataset.mode];
    outputLabel.textContent = label;
    outputText.textContent  = builder(dateStr);
    outputSection.style.display = "block";
    copyBtn.textContent = "📋 コピー";
    copyBtn.classList.remove("copied");
    outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

copyBtn.addEventListener("click", () => {
  const text = outputText.textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.textContent = "✅ コピー完了"; copyBtn.classList.add("copied");
    setTimeout(() => { copyBtn.textContent = "📋 コピー"; copyBtn.classList.remove("copied"); }, 2000);
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select(); document.execCommand("copy");
    document.body.removeChild(ta);
    copyBtn.textContent = "✅ コピー完了"; copyBtn.classList.add("copied");
    setTimeout(() => { copyBtn.textContent = "📋 コピー"; copyBtn.classList.remove("copied"); }, 2000);
  });
});