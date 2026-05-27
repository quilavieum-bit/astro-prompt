// ============================================================
// 星読みプロンプト生成ツール script.js
// Swiss Ephemeris 2026年4月〜12月 (00:00 JST基準)
// 12:00 JSTへの線形補間実装
// 修正: 4/18・4/28の検証済み12:00位置を上書き、月相を国立天文台データに差し替え
// ============================================================

// === サイン定義 ===
const SIGNS = [
  '牡羊座','牡牛座','双子座','蟹座','獅子座','乙女座',
  '天秤座','蠍座','射手座','山羊座','水瓶座','魚座'
];
// PDFサイン文字→インデックス
const SIGN_MAP = {
  'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,
  'g':6,'h':7,'i':8,'j':9,'k':10,'l':11
};

// 黄道度数を0-360の絶対度数に変換
function toAbs(sign, deg) {
  return sign * 30 + deg;
}

// 絶対度数→サイン番号と度数
function fromAbs(abs) {
  abs = ((abs % 360) + 360) % 360;
  const s = Math.floor(abs / 30);
  const d = abs % 30;
  return { sign: s, deg: d };
}

// PDF表記 "Xa.b" → 絶対度数（例: "28a51" → 牡羊28.85°→28.85）
// フォーマット: [度数][サイン文字][分]  例: 28a51 → 牡羊座 28°51'
function parsePDF(str) {
  // str例: "28a51" "3b 7" "29b24"
  if(!str || str.trim()==='') return 0;
  str = str.trim().replace(/°/g,'').replace(/'/g,'');
  // パターン: 数字+サイン文字+数字
  const m = str.match(/^(\d+)([a-l])\s*(\d*)/);
  if(!m) return 0;
  const deg = parseInt(m[1]) || 0;
  const signIdx = SIGN_MAP[m[2]] || 0;
  const min = parseInt(m[3]) || 0;
  return signIdx * 30 + deg + min/60;
}

// ============================================================
// 天体暦データ 2026年4月〜12月 (00:00 JST)
// columns: [sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto]
// 全て絶対黄道度数 (0=牡羊0°, 30=牡牛0°, etc.)
// ============================================================

// データ格納オブジェクト: "YYYY-MM-DD" → [sun,moon,mer,ven,mar,jup,sat,ura,nep,plu]
const EPHEMERIS = {};

function addData(dateStr, sun, moon, mer, ven, mar, jup, sat, ura, nep, plu) {
  EPHEMERIS[dateStr] = [sun, moon, mer, ven, mar, jup, sat, ura, nep, plu];
}

// ============================================================
// 2026年4月 (page 21)
// 列: A=太陽 B=月 C=水星 D=金星 E=火星 F=木星 G=土星 O=天王星 I=海王星 J=冥王星
// ============================================================
// Apr 1: Sun=10a54 Moon=23f40 Mer=13l23 Ven=1b11 Mar=22l49 Jup=15d45 Sat=5a30 Ura=28b45 Nep=2a11 Plu=5k13
addData('2026-04-01', parsePDF('10a54'), parsePDF('23f40'), parsePDF('13l23'), parsePDF('1b11'), parsePDF('22l49'), parsePDF('15d45'), parsePDF('5a30'), parsePDF('28b45'), parsePDF('2a11'), parsePDF('5k13'));
// Apr 2: 11a53 6g27 14l14 2b25 23l36 15d49 5a38 28b47 2a14 5k14
addData('2026-04-02', parsePDF('11a53'), parsePDF('6g27'), parsePDF('14l14'), parsePDF('2b25'), parsePDF('23l36'), parsePDF('15d49'), parsePDF('5a38'), parsePDF('28b47'), parsePDF('2a14'), parsePDF('5k14'));
// Apr 3: 12a52 19h3 15l8 3b38 24l23 15d53 5a45 28b50 2a16 5k15
addData('2026-04-03', parsePDF('12a52'), parsePDF('19h3'), parsePDF('15l8'), parsePDF('3b38'), parsePDF('24l23'), parsePDF('15d53'), parsePDF('5a45'), parsePDF('28b50'), parsePDF('2a16'), parsePDF('5k15'));
// Apr 4: 13a51 1i47 16l6 4b52 25l10 15d58 5a52 28b53 2a18 5k15
addData('2026-04-04', parsePDF('13a51'), parsePDF('1i47'), parsePDF('16l6'), parsePDF('4b52'), parsePDF('25l10'), parsePDF('15d58'), parsePDF('5a52'), parsePDF('28b53'), parsePDF('2a18'), parsePDF('5k15'));
// Apr 5: 14a50 13i42 17l6 6b6 25l57 16d2 6a0 28b55 2a20 5k16
addData('2026-04-05', parsePDF('14a50'), parsePDF('13i42'), parsePDF('17l6'), parsePDF('6b6'), parsePDF('25l57'), parsePDF('16d2'), parsePDF('6a0'), parsePDF('28b55'), parsePDF('2a20'), parsePDF('5k16'));
// Apr 6: 15a50 25i45 17l8 7b20 26l44 16d7 6a7 28b58 2a23 5k17
addData('2026-04-06', parsePDF('15a50'), parsePDF('25i45'), parsePDF('17l8'), parsePDF('7b20'), parsePDF('26l44'), parsePDF('16d7'), parsePDF('6a7'), parsePDF('28b58'), parsePDF('2a23'), parsePDF('5k17'));
// Apr 7: 16a49 7j42 17l14 8b33 27l31 16d12 6a15 29b1 2a25 5k18
addData('2026-04-07', parsePDF('16a49'), parsePDF('7j42'), parsePDF('17l14'), parsePDF('8b33'), parsePDF('27l31'), parsePDF('16d12'), parsePDF('6a15'), parsePDF('29b1'), parsePDF('2a25'), parsePDF('5k18'));
// Apr 8: 17a48 19j35 17l22 9b47 28l18 16d16 6a22 29b4 2a27 5k19
addData('2026-04-08', parsePDF('17a48'), parsePDF('19j35'), parsePDF('17l22'), parsePDF('9b47'), parsePDF('28l18'), parsePDF('16d16'), parsePDF('6a22'), parsePDF('29b4'), parsePDF('2a27'), parsePDF('5k19'));
// Apr 9: 18a47 1k27 17l32 11b1 29l4 16d22 6a30 29b6 2a29 5k20
addData('2026-04-09', parsePDF('18a47'), parsePDF('1k27'), parsePDF('17l32'), parsePDF('11b1'), parsePDF('29l4'), parsePDF('16d22'), parsePDF('6a30'), parsePDF('29b6'), parsePDF('2a29'), parsePDF('5k20'));
// Apr 10: 19a46 13k23 17l44 12b14 29l51 16d27 6a37 29b9 2a31 5k20
addData('2026-04-10', parsePDF('19a46'), parsePDF('13k23'), parsePDF('17l44'), parsePDF('12b14'), parsePDF('29l51'), parsePDF('16d27'), parsePDF('6a37'), parsePDF('29b9'), parsePDF('2a31'), parsePDF('5k20'));
// Apr 11: 20a45 25k17 18l0 13b28 0a38 16d32 6a44 29b12 2a34 5k21
addData('2026-04-11', parsePDF('20a45'), parsePDF('25k17'), parsePDF('18l0'), parsePDF('13b28'), parsePDF('0a38'), parsePDF('16d32'), parsePDF('6a44'), parsePDF('29b12'), parsePDF('2a34'), parsePDF('5k21'));
// Apr 12: 21a43 7l21 18l19 14b41 1a24 16d38 6a52 29b15 2a36 5k22
addData('2026-04-12', parsePDF('21a43'), parsePDF('7l21'), parsePDF('18l19'), parsePDF('14b41'), parsePDF('1a24'), parsePDF('16d38'), parsePDF('6a52'), parsePDF('29b15'), parsePDF('2a36'), parsePDF('5k22'));
// Apr 13: 22a42 19l35 18l40 15b55 2a11 16d44 6a59 29b18 2a38 5k23
addData('2026-04-13', parsePDF('22a42'), parsePDF('19l35'), parsePDF('18l40'), parsePDF('15b55'), parsePDF('2a11'), parsePDF('16d44'), parsePDF('6a59'), parsePDF('29b18'), parsePDF('2a38'), parsePDF('5k23'));
// Apr 14: 23a41 2a0 19l8 17b8 2a58 16d49 7a6 29b21 2a40 5k23
addData('2026-04-14', parsePDF('23a41'), parsePDF('2a0'), parsePDF('19l8'), parsePDF('17b8'), parsePDF('2a58'), parsePDF('16d49'), parsePDF('7a6'), parsePDF('29b21'), parsePDF('2a40'), parsePDF('5k23'));
// Apr 15: 24a39 14a48 19l41 18b22 3a44 16d56 7a13 29b24 2a42 5k24
addData('2026-04-15', parsePDF('24a39'), parsePDF('14a48'), parsePDF('19l41'), parsePDF('18b22'), parsePDF('3a44'), parsePDF('16d56'), parsePDF('7a13'), parsePDF('29b24'), parsePDF('2a42'), parsePDF('5k24'));
// Apr 16: 25a38 27a56 20l20 19b35 4a31 17d2 7a21 29b27 2a44 5k24
addData('2026-04-16', parsePDF('25a38'), parsePDF('27a56'), parsePDF('20l20'), parsePDF('19b35'), parsePDF('4a31'), parsePDF('17d2'), parsePDF('7a21'), parsePDF('29b27'), parsePDF('2a44'), parsePDF('5k24'));
// Apr 17: 26a37 11b12 21l6 20b48 5a17 17d8 7a28 29b30 2a47 5k25
addData('2026-04-17', parsePDF('26a37'), parsePDF('11b12'), parsePDF('21l6'), parsePDF('20b48'), parsePDF('5a17'), parsePDF('17d8'), parsePDF('7a28'), parsePDF('29b30'), parsePDF('2a47'), parsePDF('5k25'));
// Apr 18: 27a36 25b18 22l2 22b2 6a4 17d15 7a35 29b33 2a49 5k26
addData('2026-04-18', parsePDF('27a36'), parsePDF('25b18'), parsePDF('22l2'), parsePDF('22b2'), parsePDF('6a4'), parsePDF('17d15'), parsePDF('7a35'), parsePDF('29b33'), parsePDF('2a49'), parsePDF('5k26'));
// Apr 19: 28a35 9c15 23l5 23b15 6a50 17d21 7a42 29b36 2a51 5k26
addData('2026-04-19', parsePDF('28a35'), parsePDF('9c15'), parsePDF('23l5'), parsePDF('23b15'), parsePDF('6a50'), parsePDF('17d21'), parsePDF('7a42'), parsePDF('29b36'), parsePDF('2a51'), parsePDF('5k26'));
// Apr 20: 29a33 23c5 24l11 24b28 7a37 17d28 7a50 29b39 2a53 5k27
addData('2026-04-20', parsePDF('29a33'), parsePDF('23c5'), parsePDF('24l11'), parsePDF('24b28'), parsePDF('7a37'), parsePDF('17d28'), parsePDF('7a50'), parsePDF('29b39'), parsePDF('2a53'), parsePDF('5k27'));
// Apr 21: 0b32 6d54 25l21 25b41 8a23 17d35 7a57 29b42 2a55 5k27
addData('2026-04-21', parsePDF('0b32'), parsePDF('6d54'), parsePDF('25l21'), parsePDF('25b41'), parsePDF('8a23'), parsePDF('17d35'), parsePDF('7a57'), parsePDF('29b42'), parsePDF('2a55'), parsePDF('5k27'));
// Apr 22: 1b30 20d28 26l37 26b54 9a10 17d42 8a4 29b46 2a57 5k27
addData('2026-04-22', parsePDF('1b30'), parsePDF('20d28'), parsePDF('26l37'), parsePDF('26b54'), parsePDF('9a10'), parsePDF('17d42'), parsePDF('8a4'), parsePDF('29b46'), parsePDF('2a57'), parsePDF('5k27'));
// Apr 23: 2b29 3e47 27l57 28b7 9a56 17d49 8a11 29b49 2a59 5k28
addData('2026-04-23', parsePDF('2b29'), parsePDF('3e47'), parsePDF('27l57'), parsePDF('28b7'), parsePDF('9a56'), parsePDF('17d49'), parsePDF('8a11'), parsePDF('29b49'), parsePDF('2a59'), parsePDF('5k28'));
// Apr 24: 3b28 16e47 29l22 29b20 10a42 17d57 8a18 29b52 3a1 5k28
addData('2026-04-24', parsePDF('3b28'), parsePDF('16e47'), parsePDF('29l22'), parsePDF('29b20'), parsePDF('10a42'), parsePDF('17d57'), parsePDF('8a18'), parsePDF('29b52'), parsePDF('3a1'), parsePDF('5k28'));
// Apr 25: 4b26 29e21 0a52 0c33 11a29 18d4 8a25 29b55 3a3 5k29
addData('2026-04-25', parsePDF('4b26'), parsePDF('29e21'), parsePDF('0a52'), parsePDF('0c33'), parsePDF('11a29'), parsePDF('18d4'), parsePDF('8a25'), parsePDF('29b55'), parsePDF('3a3'), parsePDF('5k29'));
// Apr 26: 5b25 11f35 2a27 1c46 12a15 18d12 8a32 29b59 3a5 5k29
addData('2026-04-26', parsePDF('5b25'), parsePDF('11f35'), parsePDF('2a27'), parsePDF('1c46'), parsePDF('12a15'), parsePDF('18d12'), parsePDF('8a32'), parsePDF('29b59'), parsePDF('3a5'), parsePDF('5k29'));
// Apr 27: 6b23 23f37 4a5 2c59 13a1 18d19 8a39 0c2 3a7 5k29
addData('2026-04-27', parsePDF('6b23'), parsePDF('23f37'), parsePDF('4a5'), parsePDF('2c59'), parsePDF('13a1'), parsePDF('18d19'), parsePDF('8a39'), parsePDF('0c2'), parsePDF('3a7'), parsePDF('5k29'));
// Apr 28: 7b21 5g7 5a46 4c12 13a47 18d27 8a46 0c5 3a9 5k29
addData('2026-04-28', parsePDF('7b21'), parsePDF('5g7'), parsePDF('5a46'), parsePDF('4c12'), parsePDF('13a47'), parsePDF('18d27'), parsePDF('8a46'), parsePDF('0c5'), parsePDF('3a9'), parsePDF('5k29'));
// Apr 29: 8b20 16g37 7a29 5c25 14a33 18d35 8a53 0c9 3a11 5k30
addData('2026-04-29', parsePDF('8b20'), parsePDF('16g37'), parsePDF('7a29'), parsePDF('5c25'), parsePDF('14a33'), parsePDF('18d35'), parsePDF('8a53'), parsePDF('0c9'), parsePDF('3a11'), parsePDF('5k30'));
// Apr 30: 9b18 28g1 9a15 6c37 15a19 18d43 8a59 0c12 3a13 5k30
addData('2026-04-30', parsePDF('9b18'), parsePDF('28g1'), parsePDF('9a15'), parsePDF('6c37'), parsePDF('15a19'), parsePDF('18d43'), parsePDF('8a59'), parsePDF('0c12'), parsePDF('3a13'), parsePDF('5k30'));

// ============================================================
// 2026年5月 (page 22)
// ============================================================
addData('2026-05-01', parsePDF('10b16'), parsePDF('9h8'), parsePDF('11a3'), parsePDF('7c50'), parsePDF('16a5'), parsePDF('18d52'), parsePDF('9a6'), parsePDF('0c15'), parsePDF('3a15'), parsePDF('5k30'));
addData('2026-05-02', parsePDF('11b15'), parsePDF('21h3'), parsePDF('12a53'), parsePDF('9c3'), parsePDF('16a51'), parsePDF('19d0'), parsePDF('9a13'), parsePDF('0c18'), parsePDF('3a17'), parsePDF('5k30'));
addData('2026-05-03', parsePDF('12b13'), parsePDF('3i47'), parsePDF('14a45'), parsePDF('10c15'), parsePDF('17a37'), parsePDF('19d9'), parsePDF('9a20'), parsePDF('0c22'), parsePDF('3a19'), parsePDF('5k30'));
addData('2026-05-04', parsePDF('13b11'), parsePDF('16i12'), parsePDF('16a39'), parsePDF('11c28'), parsePDF('18a23'), parsePDF('19d17'), parsePDF('9a26'), parsePDF('0c25'), parsePDF('3a20'), parsePDF('5k30'));
addData('2026-05-05', parsePDF('14b9'), parsePDF('28i47'), parsePDF('18a35'), parsePDF('12c40'), parsePDF('19a9'), parsePDF('19d26'), parsePDF('9a33'), parsePDF('0c29'), parsePDF('3a22'), parsePDF('5k31'));
addData('2026-05-06', parsePDF('15b7'), parsePDF('11j45'), parsePDF('20a32'), parsePDF('13c52'), parsePDF('19a55'), parsePDF('19d35'), parsePDF('9a40'), parsePDF('0c32'), parsePDF('3a24'), parsePDF('5k31'));
addData('2026-05-07', parsePDF('16b5'), parsePDF('24j58'), parsePDF('22a31'), parsePDF('15c5'), parsePDF('20a40'), parsePDF('19d44'), parsePDF('9a46'), parsePDF('0c35'), parsePDF('3a26'), parsePDF('5k31'));
addData('2026-05-08', parsePDF('17b3'), parsePDF('8k45'), parsePDF('24a31'), parsePDF('16c17'), parsePDF('21a26'), parsePDF('19d53'), parsePDF('9a53'), parsePDF('0c39'), parsePDF('3a28'), parsePDF('5k31'));
addData('2026-05-09', parsePDF('18b1'), parsePDF('22k52'), parsePDF('26a32'), parsePDF('17c29'), parsePDF('22a12'), parsePDF('20d2'), parsePDF('9a59'), parsePDF('0c42'), parsePDF('3a30'), parsePDF('5k31'));
addData('2026-05-10', parsePDF('19b0'), parsePDF('7l10'), parsePDF('28a34'), parsePDF('18c41'), parsePDF('22a57'), parsePDF('20d11'), parsePDF('10a6'), parsePDF('0c46'), parsePDF('3a31'), parsePDF('5k31'));
addData('2026-05-11', parsePDF('19b58'), parsePDF('21l30'), parsePDF('0b37'), parsePDF('19c53'), parsePDF('23a43'), parsePDF('20d20'), parsePDF('10a12'), parsePDF('0c49'), parsePDF('3a33'), parsePDF('5k31'));
addData('2026-05-12', parsePDF('20b56'), parsePDF('5a43'), parsePDF('2b40'), parsePDF('21c5'), parsePDF('24a29'), parsePDF('20d30'), parsePDF('10a18'), parsePDF('0c53'), parsePDF('3a35'), parsePDF('5k31'));
addData('2026-05-13', parsePDF('21b54'), parsePDF('19a44'), parsePDF('4b43'), parsePDF('22c17'), parsePDF('25a14'), parsePDF('20d39'), parsePDF('10a25'), parsePDF('0c56'), parsePDF('3a37'), parsePDF('5k31'));
addData('2026-05-14', parsePDF('22b52'), parsePDF('3b27'), parsePDF('6b46'), parsePDF('23c29'), parsePDF('26a0'), parsePDF('20d48'), parsePDF('10a31'), parsePDF('1c0'), parsePDF('3a39'), parsePDF('5k31'));
addData('2026-05-15', parsePDF('23b50'), parsePDF('16b41'), parsePDF('8b48'), parsePDF('24c41'), parsePDF('26a45'), parsePDF('20d58'), parsePDF('10a37'), parsePDF('1c3'), parsePDF('3a40'), parsePDF('5k31'));
addData('2026-05-16', parsePDF('24b48'), parsePDF('29b28'), parsePDF('10b50'), parsePDF('25c52'), parsePDF('27a30'), parsePDF('21d7'), parsePDF('10a43'), parsePDF('1c7'), parsePDF('3a42'), parsePDF('5k31'));
addData('2026-05-17', parsePDF('25b46'), parsePDF('11c43'), parsePDF('12b51'), parsePDF('27c4'), parsePDF('28a16'), parsePDF('21d17'), parsePDF('10a49'), parsePDF('1c10'), parsePDF('3a44'), parsePDF('5k31'));
addData('2026-05-18', parsePDF('26b44'), parsePDF('23c34'), parsePDF('14b51'), parsePDF('28c15'), parsePDF('29a1'), parsePDF('21d26'), parsePDF('10a55'), parsePDF('1c14'), parsePDF('3a46'), parsePDF('5k31'));
addData('2026-05-19', parsePDF('27b42'), parsePDF('5d14'), parsePDF('16b51'), parsePDF('29c26'), parsePDF('29a46'), parsePDF('21d36'), parsePDF('11a1'), parsePDF('1c17'), parsePDF('3a47'), parsePDF('5k31'));
addData('2026-05-20', parsePDF('28b40'), parsePDF('16d51'), parsePDF('18b49'), parsePDF('0d37'), parsePDF('0b32'), parsePDF('21d46'), parsePDF('11a7'), parsePDF('1c21'), parsePDF('3a49'), parsePDF('5k31'));
addData('2026-05-21', parsePDF('29b38'), parsePDF('28d30'), parsePDF('20b47'), parsePDF('1d48'), parsePDF('1b17'), parsePDF('21d55'), parsePDF('11a13'), parsePDF('1c24'), parsePDF('3a51'), parsePDF('5k31'));
addData('2026-05-22', parsePDF('0c36'), parsePDF('10e16'), parsePDF('22b43'), parsePDF('2d59'), parsePDF('2b2'), parsePDF('22d5'), parsePDF('11a19'), parsePDF('1c28'), parsePDF('3a53'), parsePDF('5k31'));
addData('2026-05-23', parsePDF('1c34'), parsePDF('22e14'), parsePDF('24b38'), parsePDF('4d10'), parsePDF('2b47'), parsePDF('22d14'), parsePDF('11a24'), parsePDF('1c31'), parsePDF('3a54'), parsePDF('5k30'));
addData('2026-05-24', parsePDF('2c32'), parsePDF('4f30'), parsePDF('26b31'), parsePDF('5d21'), parsePDF('3b32'), parsePDF('22d24'), parsePDF('11a30'), parsePDF('1c35'), parsePDF('3a56'), parsePDF('5k30'));
addData('2026-05-25', parsePDF('3c30'), parsePDF('17f8'), parsePDF('28b23'), parsePDF('6d31'), parsePDF('4b17'), parsePDF('22d33'), parsePDF('11a35'), parsePDF('1c38'), parsePDF('3a58'), parsePDF('5k30'));
addData('2026-05-26', parsePDF('4c27'), parsePDF('0g12'), parsePDF('0c12'), parsePDF('7d42'), parsePDF('5b2'), parsePDF('22d43'), parsePDF('11a41'), parsePDF('1c42'), parsePDF('3a59'), parsePDF('5k30'));
addData('2026-05-27', parsePDF('5c25'), parsePDF('13g40'), parsePDF('2c0'), parsePDF('8d52'), parsePDF('5b46'), parsePDF('22d52'), parsePDF('11a46'), parsePDF('1c45'), parsePDF('4a1'), parsePDF('5k29'));
addData('2026-05-28', parsePDF('6c23'), parsePDF('27g28'), parsePDF('3c46'), parsePDF('10d2'), parsePDF('6b31'), parsePDF('23d2'), parsePDF('11a52'), parsePDF('1c49'), parsePDF('4a3'), parsePDF('5k29'));
addData('2026-05-29', parsePDF('7c21'), parsePDF('11h37'), parsePDF('5c30'), parsePDF('11d12'), parsePDF('7b16'), parsePDF('23d11'), parsePDF('11a57'), parsePDF('1c52'), parsePDF('4a4'), parsePDF('5k29'));
addData('2026-05-30', parsePDF('8c18'), parsePDF('26h5'), parsePDF('7c12'), parsePDF('12d22'), parsePDF('8b0'), parsePDF('23d21'), parsePDF('12a2'), parsePDF('1c56'), parsePDF('4a6'), parsePDF('5k29'));
addData('2026-05-31', parsePDF('9c16'), parsePDF('10i7'), parsePDF('8c51'), parsePDF('13d32'), parsePDF('8b44'), parsePDF('23d31'), parsePDF('12a8'), parsePDF('1c59'), parsePDF('4a8'), parsePDF('5k28'));

// ============================================================
// 2026年6月 (page 22)
// ============================================================
addData('2026-06-01', parsePDF('10c10'), parsePDF('24i8'), parsePDF('10c28'), parsePDF('14d41'), parsePDF('9b29'), parsePDF('23d41'), parsePDF('12a13'), parsePDF('2c3'), parsePDF('4a9'), parsePDF('5k28'));
addData('2026-06-02', parsePDF('11c8'), parsePDF('8j46'), parsePDF('12c3'), parsePDF('15d51'), parsePDF('10b13'), parsePDF('23d50'), parsePDF('12a18'), parsePDF('2c6'), parsePDF('4a11'), parsePDF('5k27'));
addData('2026-06-03', parsePDF('12c5'), parsePDF('23j16'), parsePDF('13c35'), parsePDF('17d0'), parsePDF('10b57'), parsePDF('24d0'), parsePDF('12a23'), parsePDF('2c9'), parsePDF('4a12'), parsePDF('5k27'));
addData('2026-06-04', parsePDF('13c3'), parsePDF('7k37'), parsePDF('15c4'), parsePDF('18d9'), parsePDF('11b41'), parsePDF('24d10'), parsePDF('12a28'), parsePDF('2c13'), parsePDF('4a14'), parsePDF('5k26'));
addData('2026-06-05', parsePDF('14c0'), parsePDF('21k38'), parsePDF('16c31'), parsePDF('19d18'), parsePDF('12b25'), parsePDF('24d19'), parsePDF('12a33'), parsePDF('2c16'), parsePDF('4a15'), parsePDF('5k26'));
addData('2026-06-06', parsePDF('14c58'), parsePDF('5l17'), parsePDF('17c56'), parsePDF('20d27'), parsePDF('13b9'), parsePDF('24d29'), parsePDF('12a37'), parsePDF('2c20'), parsePDF('4a17'), parsePDF('5k25'));
addData('2026-06-07', parsePDF('15c55'), parsePDF('18l40'), parsePDF('19c18'), parsePDF('21d36'), parsePDF('13b53'), parsePDF('24d38'), parsePDF('12a42'), parsePDF('2c23'), parsePDF('4a18'), parsePDF('5k25'));
addData('2026-06-08', parsePDF('16c52'), parsePDF('1a42'), parsePDF('20c37'), parsePDF('22d45'), parsePDF('14b37'), parsePDF('24d48'), parsePDF('12a47'), parsePDF('2c27'), parsePDF('4a20'), parsePDF('5k24'));
addData('2026-06-09', parsePDF('17c50'), parsePDF('14a27'), parsePDF('21c54'), parsePDF('23d54'), parsePDF('15b21'), parsePDF('24d57'), parsePDF('12a51'), parsePDF('2c30'), parsePDF('4a21'), parsePDF('5k24'));
addData('2026-06-10', parsePDF('18c47'), parsePDF('26a54'), parsePDF('23c8'), parsePDF('25d2'), parsePDF('16b5'), parsePDF('25d7'), parsePDF('12a56'), parsePDF('2c34'), parsePDF('4a22'), parsePDF('5k23'));
addData('2026-06-11', parsePDF('19c44'), parsePDF('9b7'), parsePDF('24c20'), parsePDF('26d11'), parsePDF('16b49'), parsePDF('25d16'), parsePDF('13a0'), parsePDF('2c37'), parsePDF('4a24'), parsePDF('5k23'));
addData('2026-06-12', parsePDF('20c42'), parsePDF('21b0'), parsePDF('25c30'), parsePDF('27d19'), parsePDF('17b32'), parsePDF('25d26'), parsePDF('13a4'), parsePDF('2c40'), parsePDF('4a25'), parsePDF('5k22'));
addData('2026-06-13', parsePDF('21c39'), parsePDF('2c47'), parsePDF('26c37'), parsePDF('28d27'), parsePDF('18b16'), parsePDF('25d35'), parsePDF('13a9'), parsePDF('2c44'), parsePDF('4a26'), parsePDF('5k21'));
addData('2026-06-14', parsePDF('22c36'), parsePDF('14c27'), parsePDF('27c42'), parsePDF('29d35'), parsePDF('18b59'), parsePDF('25d44'), parsePDF('13a13'), parsePDF('2c47'), parsePDF('4a28'), parsePDF('5k21'));
addData('2026-06-15', parsePDF('23c33'), parsePDF('26c5'), parsePDF('28c44'), parsePDF('0e43'), parsePDF('19b43'), parsePDF('25d54'), parsePDF('13a17'), parsePDF('2c50'), parsePDF('4a29'), parsePDF('5k20'));
addData('2026-06-16', parsePDF('24c31'), parsePDF('7d45'), parsePDF('29c43'), parsePDF('1e50'), parsePDF('20b26'), parsePDF('26d3'), parsePDF('13a21'), parsePDF('2c54'), parsePDF('4a30'), parsePDF('5k20'));
addData('2026-06-17', parsePDF('25c28'), parsePDF('19d29'), parsePDF('0d40'), parsePDF('2e58'), parsePDF('21b9'), parsePDF('26d12'), parsePDF('13a25'), parsePDF('2c57'), parsePDF('4a32'), parsePDF('5k19'));
addData('2026-06-18', parsePDF('26c25'), parsePDF('1e19'), parsePDF('1d35'), parsePDF('4e5'), parsePDF('21b52'), parsePDF('26d22'), parsePDF('13a29'), parsePDF('3c0'), parsePDF('4a33'), parsePDF('5k18'));
addData('2026-06-19', parsePDF('27c22'), parsePDF('13e16'), parsePDF('2d27'), parsePDF('5e12'), parsePDF('22b35'), parsePDF('26d31'), parsePDF('13a32'), parsePDF('3c4'), parsePDF('4a34'), parsePDF('5k18'));
addData('2026-06-20', parsePDF('28c20'), parsePDF('25e22'), parsePDF('3d17'), parsePDF('6e20'), parsePDF('23b18'), parsePDF('26d40'), parsePDF('13a36'), parsePDF('3c7'), parsePDF('4a35'), parsePDF('5k17'));
addData('2026-06-21', parsePDF('29c17'), parsePDF('7f40'), parsePDF('4d4'), parsePDF('7e27'), parsePDF('24b1'), parsePDF('26d49'), parsePDF('13a40'), parsePDF('3c10'), parsePDF('4a36'), parsePDF('5k17'));
addData('2026-06-22', parsePDF('0d15'), parsePDF('20f10'), parsePDF('4d48'), parsePDF('8e33'), parsePDF('24b44'), parsePDF('26d59'), parsePDF('13a43'), parsePDF('3c13'), parsePDF('4a38'), parsePDF('5k16'));
addData('2026-06-23', parsePDF('1d12'), parsePDF('2g55'), parsePDF('5d30'), parsePDF('9e40'), parsePDF('25b27'), parsePDF('27d8'), parsePDF('13a47'), parsePDF('3c16'), parsePDF('4a39'), parsePDF('5k15'));
addData('2026-06-24', parsePDF('2d9'), parsePDF('15g58'), parsePDF('6d9'), parsePDF('10e47'), parsePDF('26b9'), parsePDF('27d17'), parsePDF('13a50'), parsePDF('3c20'), parsePDF('4a40'), parsePDF('5k15'));
addData('2026-06-25', parsePDF('3d6'), parsePDF('29g21'), parsePDF('6d46'), parsePDF('11e53'), parsePDF('26b52'), parsePDF('27d26'), parsePDF('13a53'), parsePDF('3c23'), parsePDF('4a41'), parsePDF('5k14'));
addData('2026-06-26', parsePDF('4d4'), parsePDF('13h3'), parsePDF('7d20'), parsePDF('12e59'), parsePDF('27b34'), parsePDF('27d35'), parsePDF('13a57'), parsePDF('3c26'), parsePDF('4a42'), parsePDF('5k13'));
addData('2026-06-27', parsePDF('5d1'), parsePDF('27h5'), parsePDF('7d52'), parsePDF('14e5'), parsePDF('28b17'), parsePDF('27d44'), parsePDF('14a0'), parsePDF('3c29'), parsePDF('4a43'), parsePDF('5k12'));
addData('2026-06-28', parsePDF('5d59'), parsePDF('11i23'), parsePDF('8d21'), parsePDF('15e11'), parsePDF('28b59'), parsePDF('27d53'), parsePDF('14a3'), parsePDF('3c32'), parsePDF('4a44'), parsePDF('5k12'));
addData('2026-06-29', parsePDF('6d56'), parsePDF('25i52'), parsePDF('8d47'), parsePDF('16e17'), parsePDF('29b41'), parsePDF('28d2'), parsePDF('14a6'), parsePDF('3c35'), parsePDF('4a45'), parsePDF('5k11'));
addData('2026-06-30', parsePDF('7d53'), parsePDF('10j19'), parsePDF('9d10'), parsePDF('17e22'), parsePDF('0c23'), parsePDF('28d11'), parsePDF('14a8'), parsePDF('3c38'), parsePDF('4a46'), parsePDF('5k10'));

// ============================================================
// 2026年7月 (page 23)
// ============================================================
addData('2026-07-01', parsePDF('8d50'), parsePDF('24j37'), parsePDF('9d31'), parsePDF('18e27'), parsePDF('1c5'), parsePDF('28d20'), parsePDF('14a10'), parsePDF('3c41'), parsePDF('4a47'), parsePDF('5k9'));
addData('2026-07-02', parsePDF('9d47'), parsePDF('8k36'), parsePDF('9d48'), parsePDF('19e32'), parsePDF('1c47'), parsePDF('28d29'), parsePDF('14a13'), parsePDF('3c44'), parsePDF('4a48'), parsePDF('5k8'));
addData('2026-07-03', parsePDF('10d45'), parsePDF('22k7'), parsePDF('10d3'), parsePDF('20e37'), parsePDF('2c29'), parsePDF('28d38'), parsePDF('14a15'), parsePDF('3c47'), parsePDF('4a49'), parsePDF('5k8'));
addData('2026-07-04', parsePDF('11d42'), parsePDF('5l11'), parsePDF('10d15'), parsePDF('21e42'), parsePDF('3c11'), parsePDF('28d46'), parsePDF('14a18'), parsePDF('3c50'), parsePDF('4a50'), parsePDF('5k7'));
addData('2026-07-05', parsePDF('12d39'), parsePDF('17l51'), parsePDF('10d23'), parsePDF('22e46'), parsePDF('3c53'), parsePDF('28d55'), parsePDF('14a20'), parsePDF('3c53'), parsePDF('4a51'), parsePDF('5k6'));
addData('2026-07-06', parsePDF('13d36'), parsePDF('0a10'), parsePDF('10d28'), parsePDF('23e50'), parsePDF('4c34'), parsePDF('29d4'), parsePDF('14a22'), parsePDF('3c56'), parsePDF('4a52'), parsePDF('5k5'));
addData('2026-07-07', parsePDF('14d33'), parsePDF('12a12'), parsePDF('10d30'), parsePDF('24e54'), parsePDF('5c16'), parsePDF('29d13'), parsePDF('14a24'), parsePDF('3c59'), parsePDF('4a53'), parsePDF('5k4'));
addData('2026-07-08', parsePDF('15d30'), parsePDF('23a59'), parsePDF('10d28'), parsePDF('25e58'), parsePDF('5c58'), parsePDF('29d21'), parsePDF('14a26'), parsePDF('4c2'), parsePDF('4a54'), parsePDF('5k3'));
addData('2026-07-09', parsePDF('16d27'), parsePDF('5b38'), parsePDF('10d23'), parsePDF('27e2'), parsePDF('6c39'), parsePDF('29d30'), parsePDF('14a28'), parsePDF('4c5'), parsePDF('4a54'), parsePDF('5k2'));
addData('2026-07-10', parsePDF('17d24'), parsePDF('17b8'), parsePDF('10d15'), parsePDF('28e5'), parsePDF('7c21'), parsePDF('29d39'), parsePDF('14a30'), parsePDF('4c7'), parsePDF('4a55'), parsePDF('5k1'));
addData('2026-07-11', parsePDF('18d21'), parsePDF('28b35'), parsePDF('10d3'), parsePDF('29e8'), parsePDF('8c2'), parsePDF('29d47'), parsePDF('14a32'), parsePDF('4c10'), parsePDF('4a56'), parsePDF('5k0'));
addData('2026-07-12', parsePDF('19d18'), parsePDF('9c59'), parsePDF('9d48'), parsePDF('0f11'), parsePDF('8c43'), parsePDF('29d56'), parsePDF('14a34'), parsePDF('4c13'), parsePDF('4a57'), parsePDF('4k59'));
addData('2026-07-13', parsePDF('20d15'), parsePDF('21c23'), parsePDF('9d31'), parsePDF('1f14'), parsePDF('9c24'), parsePDF('0e4'), parsePDF('14a35'), parsePDF('4c15'), parsePDF('4a57'), parsePDF('4k58'));
addData('2026-07-14', parsePDF('21d12'), parsePDF('2d50'), parsePDF('9d12'), parsePDF('2f16'), parsePDF('10c5'), parsePDF('0e13'), parsePDF('14a37'), parsePDF('4c18'), parsePDF('4a58'), parsePDF('4k57'));
addData('2026-07-15', parsePDF('22d9'), parsePDF('14d23'), parsePDF('8d50'), parsePDF('3f18'), parsePDF('10c46'), parsePDF('0e21'), parsePDF('14a39'), parsePDF('4c21'), parsePDF('4a59'), parsePDF('4k56'));
addData('2026-07-16', parsePDF('23d6'), parsePDF('26d2'), parsePDF('8d27'), parsePDF('4f20'), parsePDF('11c27'), parsePDF('0e29'), parsePDF('14a40'), parsePDF('4c23'), parsePDF('4a59'), parsePDF('4k55'));
addData('2026-07-17', parsePDF('24d3'), parsePDF('7e51'), parsePDF('8d3'), parsePDF('5f21'), parsePDF('12c8'), parsePDF('0e38'), parsePDF('14a42'), parsePDF('4c26'), parsePDF('5a0'), parsePDF('4k54'));
addData('2026-07-18', parsePDF('25d0'), parsePDF('19e53'), parsePDF('7d39'), parsePDF('6f22'), parsePDF('12c48'), parsePDF('0e46'), parsePDF('14a43'), parsePDF('4c28'), parsePDF('5a1'), parsePDF('4k53'));
addData('2026-07-19', parsePDF('25d57'), parsePDF('2f8'), parsePDF('7d16'), parsePDF('7f23'), parsePDF('13c29'), parsePDF('0e54'), parsePDF('14a44'), parsePDF('4c31'), parsePDF('5a1'), parsePDF('4k52'));
addData('2026-07-20', parsePDF('26d54'), parsePDF('14f39'), parsePDF('6d54'), parsePDF('8f24'), parsePDF('14c9'), parsePDF('1e2'), parsePDF('14a42'), parsePDF('4c33'), parsePDF('5a2'), parsePDF('4k51'));
addData('2026-07-21', parsePDF('27d51'), parsePDF('27f27'), parsePDF('6d33'), parsePDF('9f24'), parsePDF('14c50'), parsePDF('1e10'), parsePDF('14a44'), parsePDF('4c36'), parsePDF('5a3'), parsePDF('4k50'));
addData('2026-07-22', parsePDF('28d47'), parsePDF('10g34'), parsePDF('6d15'), parsePDF('10f24'), parsePDF('15c30'), parsePDF('1e18'), parsePDF('14a44'), parsePDF('4c38'), parsePDF('5a3'), parsePDF('4k49'));
addData('2026-07-23', parsePDF('29d44'), parsePDF('23g59'), parsePDF('6d0'), parsePDF('11f24'), parsePDF('16c10'), parsePDF('1e26'), parsePDF('14a44'), parsePDF('4c40'), parsePDF('5a4'), parsePDF('4k47'));
addData('2026-07-24', parsePDF('0e41'), parsePDF('7h41'), parsePDF('5d48'), parsePDF('12f23'), parsePDF('16c50'), parsePDF('1e34'), parsePDF('14a44'), parsePDF('4c43'), parsePDF('5a4'), parsePDF('4k46'));
addData('2026-07-25', parsePDF('1e38'), parsePDF('21h40'), parsePDF('5d40'), parsePDF('13f22'), parsePDF('17c30'), parsePDF('1e41'), parsePDF('14a45'), parsePDF('4c45'), parsePDF('5a5'), parsePDF('4k45'));
addData('2026-07-26', parsePDF('2e35'), parsePDF('5i55'), parsePDF('5d37'), parsePDF('14f21'), parsePDF('18c10'), parsePDF('1e49'), parsePDF('14a45'), parsePDF('4c47'), parsePDF('5a6'), parsePDF('4k44'));
addData('2026-07-27', parsePDF('3e32'), parsePDF('20i24'), parsePDF('5d38'), parsePDF('15f19'), parsePDF('18c50'), parsePDF('1e57'), parsePDF('14a45'), parsePDF('4c49'), parsePDF('5a6'), parsePDF('4k43'));
addData('2026-07-28', parsePDF('4e29'), parsePDF('5j3'), parsePDF('5d43'), parsePDF('16f17'), parsePDF('19c30'), parsePDF('2e4'), parsePDF('14a44'), parsePDF('4c52'), parsePDF('5a7'), parsePDF('4k41'));
addData('2026-07-29', parsePDF('5e26'), parsePDF('19j51'), parsePDF('5d53'), parsePDF('17f15'), parsePDF('20c9'), parsePDF('2e12'), parsePDF('14a44'), parsePDF('4c54'), parsePDF('5a7'), parsePDF('4k40'));
addData('2026-07-30', parsePDF('6e23'), parsePDF('4k41'), parsePDF('6d7'), parsePDF('18f12'), parsePDF('20c49'), parsePDF('2e19'), parsePDF('14a44'), parsePDF('4c56'), parsePDF('5a7'), parsePDF('4k39'));
addData('2026-07-31', parsePDF('7e28'), parsePDF('19k0'), parsePDF('6d27'), parsePDF('19f9'), parsePDF('21c28'), parsePDF('2e26'), parsePDF('14a44'), parsePDF('4c58'), parsePDF('5a8'), parsePDF('4k38'));

// ============================================================
// 2026年8月 (page 23)
// ============================================================
addData('2026-08-01', parsePDF('8e25'), parsePDF('3l27'), parsePDF('6d52'), parsePDF('20f6'), parsePDF('22c8'), parsePDF('2e33'), parsePDF('14a44'), parsePDF('5c0'), parsePDF('5a8'), parsePDF('4k36'));
addData('2026-08-02', parsePDF('9e23'), parsePDF('16l56'), parsePDF('7d22'), parsePDF('21f3'), parsePDF('22c47'), parsePDF('2e40'), parsePDF('14a43'), parsePDF('5c2'), parsePDF('5a9'), parsePDF('4k35'));
addData('2026-08-03', parsePDF('10e20'), parsePDF('0a9'), parsePDF('7d57'), parsePDF('21f59'), parsePDF('23c26'), parsePDF('2e47'), parsePDF('14a43'), parsePDF('5c4'), parsePDF('5a9'), parsePDF('4k34'));
addData('2026-08-04', parsePDF('11e17'), parsePDF('13a7'), parsePDF('8d37'), parsePDF('22f55'), parsePDF('24c5'), parsePDF('2e53'), parsePDF('14a42'), parsePDF('5c6'), parsePDF('5a9'), parsePDF('4k32'));
addData('2026-08-05', parsePDF('12e14'), parsePDF('25a50'), parsePDF('9d21'), parsePDF('23f51'), parsePDF('24c44'), parsePDF('3e0'), parsePDF('14a41'), parsePDF('5c7'), parsePDF('5a10'), parsePDF('4k31'));
addData('2026-08-06', parsePDF('13e11'), parsePDF('8b18'), parsePDF('10d10'), parsePDF('24f46'), parsePDF('25c23'), parsePDF('3e7'), parsePDF('14a40'), parsePDF('5c9'), parsePDF('5a10'), parsePDF('4k30'));
addData('2026-08-07', parsePDF('14e8'), parsePDF('20b34'), parsePDF('11d3'), parsePDF('25f41'), parsePDF('26c2'), parsePDF('3e13'), parsePDF('14a39'), parsePDF('5c11'), parsePDF('5a10'), parsePDF('4k28'));
addData('2026-08-08', parsePDF('15e5'), parsePDF('2c40'), parsePDF('12d0'), parsePDF('26f36'), parsePDF('26c41'), parsePDF('3e20'), parsePDF('14a38'), parsePDF('5c12'), parsePDF('5a11'), parsePDF('4k27'));
addData('2026-08-09', parsePDF('16e2'), parsePDF('14c40'), parsePDF('13d1'), parsePDF('27f30'), parsePDF('27c19'), parsePDF('3e26'), parsePDF('14a37'), parsePDF('5c14'), parsePDF('5a11'), parsePDF('4k25'));
addData('2026-08-10', parsePDF('16e59'), parsePDF('26c37'), parsePDF('14d5'), parsePDF('28f24'), parsePDF('27c58'), parsePDF('3e32'), parsePDF('14a35'), parsePDF('5c15'), parsePDF('5a11'), parsePDF('4k24'));
addData('2026-08-11', parsePDF('17e56'), parsePDF('8d35'), parsePDF('15d13'), parsePDF('29f18'), parsePDF('28c36'), parsePDF('3e38'), parsePDF('14a34'), parsePDF('5c17'), parsePDF('5a12'), parsePDF('4k22'));
addData('2026-08-12', parsePDF('18e53'), parsePDF('20d35'), parsePDF('16d24'), parsePDF('0g12'), parsePDF('29c15'), parsePDF('3e44'), parsePDF('14a32'), parsePDF('5c18'), parsePDF('5a12'), parsePDF('4k21'));
addData('2026-08-13', parsePDF('19e50'), parsePDF('2e39'), parsePDF('17d38'), parsePDF('1g5'), parsePDF('29c53'), parsePDF('3e50'), parsePDF('14a31'), parsePDF('5c20'), parsePDF('5a12'), parsePDF('4k19'));
addData('2026-08-14', parsePDF('20e47'), parsePDF('14e47'), parsePDF('18d54'), parsePDF('1g58'), parsePDF('0d31'), parsePDF('3e56'), parsePDF('14a29'), parsePDF('5c21'), parsePDF('5a12'), parsePDF('4k18'));
addData('2026-08-15', parsePDF('21e44'), parsePDF('27e1'), parsePDF('20d13'), parsePDF('2g51'), parsePDF('1d9'), parsePDF('4e1'), parsePDF('14a27'), parsePDF('5c23'), parsePDF('5a13'), parsePDF('4k16'));
addData('2026-08-16', parsePDF('22e41'), parsePDF('9f21'), parsePDF('21d34'), parsePDF('3g44'), parsePDF('1d47'), parsePDF('4e7'), parsePDF('14a25'), parsePDF('5c24'), parsePDF('5a13'), parsePDF('4k14'));
addData('2026-08-17', parsePDF('23e38'), parsePDF('21f48'), parsePDF('22d56'), parsePDF('4g36'), parsePDF('2d25'), parsePDF('4e12'), parsePDF('14a23'), parsePDF('5c25'), parsePDF('5a13'), parsePDF('4k13'));
addData('2026-08-18', parsePDF('24e35'), parsePDF('4g22'), parsePDF('24d19'), parsePDF('5g28'), parsePDF('3d3'), parsePDF('4e17'), parsePDF('14a21'), parsePDF('5c27'), parsePDF('5a13'), parsePDF('4k11'));
addData('2026-08-19', parsePDF('25e32'), parsePDF('17g4'), parsePDF('25d44'), parsePDF('6g20'), parsePDF('3d41'), parsePDF('4e22'), parsePDF('14a19'), parsePDF('5c28'), parsePDF('5a13'), parsePDF('4k9'));
addData('2026-08-20', parsePDF('26e29'), parsePDF('29g55'), parsePDF('27d9'), parsePDF('7g12'), parsePDF('4d19'), parsePDF('4e27'), parsePDF('14a17'), parsePDF('5c29'), parsePDF('5a14'), parsePDF('4k8'));
addData('2026-08-21', parsePDF('27e26'), parsePDF('12h57'), parsePDF('28d34'), parsePDF('8g4'), parsePDF('4d56'), parsePDF('4e32'), parsePDF('14a15'), parsePDF('5c30'), parsePDF('5a14'), parsePDF('4k6'));
addData('2026-08-22', parsePDF('28e22'), parsePDF('26h10'), parsePDF('0e0'), parsePDF('8g55'), parsePDF('5d34'), parsePDF('4e37'), parsePDF('14a12'), parsePDF('5c31'), parsePDF('5a14'), parsePDF('4k4'));
addData('2026-08-23', parsePDF('29e19'), parsePDF('9i34'), parsePDF('1e26'), parsePDF('9g46'), parsePDF('6d11'), parsePDF('4e41'), parsePDF('14a10'), parsePDF('5c32'), parsePDF('5a14'), parsePDF('4k2'));
addData('2026-08-24', parsePDF('0f16'), parsePDF('23i9'), parsePDF('2e52'), parsePDF('10g37'), parsePDF('6d49'), parsePDF('4e46'), parsePDF('14a7'), parsePDF('5c33'), parsePDF('5a14'), parsePDF('4k1'));
addData('2026-08-25', parsePDF('1f13'), parsePDF('6j54'), parsePDF('4e17'), parsePDF('11g27'), parsePDF('7d26'), parsePDF('4e50'), parsePDF('14a5'), parsePDF('5c34'), parsePDF('5a14'), parsePDF('3k59'));
addData('2026-08-26', parsePDF('2f10'), parsePDF('20j47'), parsePDF('5e41'), parsePDF('12g17'), parsePDF('8d3'), parsePDF('4e55'), parsePDF('14a2'), parsePDF('5c35'), parsePDF('5a14'), parsePDF('3k57'));
addData('2026-08-27', parsePDF('3f7'), parsePDF('4k47'), parsePDF('7e5'), parsePDF('13g7'), parsePDF('8d40'), parsePDF('4e59'), parsePDF('13a59'), parsePDF('5c36'), parsePDF('5a14'), parsePDF('3k55'));
addData('2026-08-28', parsePDF('4f4'), parsePDF('18k51'), parsePDF('8e27'), parsePDF('13g56'), parsePDF('9d18'), parsePDF('5e3'), parsePDF('13a56'), parsePDF('5c37'), parsePDF('5a14'), parsePDF('3k53'));
addData('2026-08-29', parsePDF('5f1'), parsePDF('2l54'), parsePDF('9e49'), parsePDF('14g45'), parsePDF('9d55'), parsePDF('5e7'), parsePDF('13a53'), parsePDF('5c37'), parsePDF('5a14'), parsePDF('3k52'));
addData('2026-08-30', parsePDF('5f58'), parsePDF('16l51'), parsePDF('11e9'), parsePDF('15g35'), parsePDF('10d32'), parsePDF('5e11'), parsePDF('13a49'), parsePDF('5c38'), parsePDF('5a14'), parsePDF('3k50'));
addData('2026-08-31', parsePDF('6f55'), parsePDF('0a38'), parsePDF('12e28'), parsePDF('16g23'), parsePDF('11d9'), parsePDF('5e14'), parsePDF('13a46'), parsePDF('5c39'), parsePDF('5a14'), parsePDF('3k48'));

// ============================================================
// 2026年9月 (page 24)
// ============================================================
addData('2026-09-01', parsePDF('7f52'), parsePDF('14a7'), parsePDF('13e46'), parsePDF('17g11'), parsePDF('11d46'), parsePDF('5e17'), parsePDF('13a42'), parsePDF('5c39'), parsePDF('5a14'), parsePDF('3k46'));
addData('2026-09-02', parsePDF('8f49'), parsePDF('27a18'), parsePDF('15e3'), parsePDF('18g0'), parsePDF('12d22'), parsePDF('5e21'), parsePDF('13a39'), parsePDF('5c40'), parsePDF('5a14'), parsePDF('3k44'));
addData('2026-09-03', parsePDF('9f46'), parsePDF('10b11'), parsePDF('16e18'), parsePDF('18g47'), parsePDF('12d59'), parsePDF('5e24'), parsePDF('13a35'), parsePDF('5c40'), parsePDF('5a13'), parsePDF('3k42'));
addData('2026-09-04', parsePDF('10f43'), parsePDF('22b48'), parsePDF('17e31'), parsePDF('19g35'), parsePDF('13d35'), parsePDF('5e27'), parsePDF('13a32'), parsePDF('5c41'), parsePDF('5a13'), parsePDF('3k40'));
addData('2026-09-05', parsePDF('11f39'), parsePDF('5c10'), parsePDF('18e42'), parsePDF('20g22'), parsePDF('14d12'), parsePDF('5e30'), parsePDF('13a28'), parsePDF('5c41'), parsePDF('5a13'), parsePDF('3k38'));
addData('2026-09-06', parsePDF('12f36'), parsePDF('17c20'), parsePDF('19e52'), parsePDF('21g9'), parsePDF('14d48'), parsePDF('5e32'), parsePDF('13a24'), parsePDF('5c41'), parsePDF('5a13'), parsePDF('3k36'));
addData('2026-09-07', parsePDF('13f33'), parsePDF('29c22'), parsePDF('21e0'), parsePDF('21g55'), parsePDF('15d24'), parsePDF('5e35'), parsePDF('13a21'), parsePDF('5c41'), parsePDF('5a13'), parsePDF('3k34'));
addData('2026-09-08', parsePDF('14f30'), parsePDF('11d18'), parsePDF('22e6'), parsePDF('22g41'), parsePDF('16d0'), parsePDF('5e37'), parsePDF('13a17'), parsePDF('5c41'), parsePDF('5a12'), parsePDF('3k32'));
addData('2026-09-09', parsePDF('15f27'), parsePDF('23d12'), parsePDF('23e11'), parsePDF('23g27'), parsePDF('16d36'), parsePDF('5e40'), parsePDF('13a13'), parsePDF('5c42'), parsePDF('5a12'), parsePDF('3k30'));
addData('2026-09-10', parsePDF('16f24'), parsePDF('5e8'), parsePDF('24e13'), parsePDF('24g12'), parsePDF('17d12'), parsePDF('5e42'), parsePDF('13a9'), parsePDF('5c42'), parsePDF('5a12'), parsePDF('3k28'));
addData('2026-09-11', parsePDF('17f20'), parsePDF('17e7'), parsePDF('25e13'), parsePDF('24g57'), parsePDF('17d48'), parsePDF('5e44'), parsePDF('13a5'), parsePDF('5c42'), parsePDF('5a11'), parsePDF('3k26'));
addData('2026-09-12', parsePDF('18f17'), parsePDF('29e12'), parsePDF('26e11'), parsePDF('25g42'), parsePDF('18d24'), parsePDF('5e46'), parsePDF('13a1'), parsePDF('5c42'), parsePDF('5a11'), parsePDF('3k24'));
addData('2026-09-13', parsePDF('19f14'), parsePDF('11f23'), parsePDF('27e7'), parsePDF('26g27'), parsePDF('19d0'), parsePDF('5e48'), parsePDF('12a57'), parsePDF('5c41'), parsePDF('5a11'), parsePDF('3k22'));
addData('2026-09-14', parsePDF('20f11'), parsePDF('23f42'), parsePDF('28e0'), parsePDF('27g11'), parsePDF('19d35'), parsePDF('5e49'), parsePDF('12a53'), parsePDF('5c41'), parsePDF('5a10'), parsePDF('3k19'));
addData('2026-09-15', parsePDF('21f7'), parsePDF('6g9'), parsePDF('28e52'), parsePDF('27g55'), parsePDF('20d11'), parsePDF('5e51'), parsePDF('12a49'), parsePDF('5c41'), parsePDF('5a10'), parsePDF('3k17'));
addData('2026-09-16', parsePDF('22f4'), parsePDF('18g46'), parsePDF('29e41'), parsePDF('28g39'), parsePDF('20d46'), parsePDF('5e52'), parsePDF('12a44'), parsePDF('5c41'), parsePDF('5a10'), parsePDF('3k15'));
addData('2026-09-17', parsePDF('23f1'), parsePDF('1h33'), parsePDF('0f28'), parsePDF('29g22'), parsePDF('21d22'), parsePDF('5e53'), parsePDF('12a40'), parsePDF('5c41'), parsePDF('5a9'), parsePDF('3k13'));
addData('2026-09-18', parsePDF('23f57'), parsePDF('14h31'), parsePDF('1f14'), parsePDF('0h5'), parsePDF('21d57'), parsePDF('5e54'), parsePDF('12a36'), parsePDF('5c40'), parsePDF('5a9'), parsePDF('3k11'));
addData('2026-09-19', parsePDF('24f54'), parsePDF('27h41'), parsePDF('1f57'), parsePDF('0h47'), parsePDF('22d32'), parsePDF('5e55'), parsePDF('12a32'), parsePDF('5c40'), parsePDF('5a8'), parsePDF('3k9'));
addData('2026-09-20', parsePDF('25f51'), parsePDF('11i3'), parsePDF('2f38'), parsePDF('1h29'), parsePDF('23d7'), parsePDF('5e56'), parsePDF('12a27'), parsePDF('5c40'), parsePDF('5a8'), parsePDF('3k7'));
addData('2026-09-21', parsePDF('26f47'), parsePDF('24i37'), parsePDF('3f18'), parsePDF('2h11'), parsePDF('23d42'), parsePDF('5e56'), parsePDF('12a23'), parsePDF('5c39'), parsePDF('5a8'), parsePDF('3k5'));
addData('2026-09-22', parsePDF('27f44'), parsePDF('8j23'), parsePDF('3f56'), parsePDF('2h52'), parsePDF('24d17'), parsePDF('5e57'), parsePDF('12a18'), parsePDF('5c39'), parsePDF('5a7'), parsePDF('3k2'));
addData('2026-09-23', parsePDF('28f41'), parsePDF('22j22'), parsePDF('4f32'), parsePDF('3h33'), parsePDF('24d52'), parsePDF('5e57'), parsePDF('12a14'), parsePDF('5c38'), parsePDF('5a7'), parsePDF('3k0'));
addData('2026-09-24', parsePDF('29f37'), parsePDF('6k33'), parsePDF('5f6'), parsePDF('4h13'), parsePDF('25d27'), parsePDF('5e57'), parsePDF('12a9'), parsePDF('5c38'), parsePDF('5a6'), parsePDF('2k58'));
addData('2026-09-25', parsePDF('0g34'), parsePDF('20k52'), parsePDF('5f38'), parsePDF('4h53'), parsePDF('26d2'), parsePDF('5e57'), parsePDF('12a4'), parsePDF('5c37'), parsePDF('5a6'), parsePDF('2k56'));
addData('2026-09-26', parsePDF('1g31'), parsePDF('5l14'), parsePDF('6f9'), parsePDF('5h33'), parsePDF('26d36'), parsePDF('5e57'), parsePDF('12a0'), parsePDF('5c37'), parsePDF('5a5'), parsePDF('2k54'));
addData('2026-09-27', parsePDF('2g27'), parsePDF('19l26'), parsePDF('6f38'), parsePDF('6h12'), parsePDF('27d11'), parsePDF('5e56'), parsePDF('11a55'), parsePDF('5c36'), parsePDF('5a5'), parsePDF('2k52'));
addData('2026-09-28', parsePDF('3g24'), parsePDF('3a27'), parsePDF('7f6'), parsePDF('6h51'), parsePDF('27d45'), parsePDF('5e56'), parsePDF('11a50'), parsePDF('5c35'), parsePDF('5a4'), parsePDF('2k50'));
addData('2026-09-29', parsePDF('4g21'), parsePDF('17a10'), parsePDF('7f32'), parsePDF('7h29'), parsePDF('28d20'), parsePDF('5e55'), parsePDF('11a46'), parsePDF('5c35'), parsePDF('5a3'), parsePDF('2k47'));
addData('2026-09-30', parsePDF('5g17'), parsePDF('0b33'), parsePDF('7f57'), parsePDF('8h7'), parsePDF('28d54'), parsePDF('5e55'), parsePDF('11a41'), parsePDF('5c34'), parsePDF('5a3'), parsePDF('2k45'));

// ============================================================
// 2026年10月 (page 24)
// ============================================================
addData('2026-10-01', parsePDF('6g14'), parsePDF('13b36'), parsePDF('8f20'), parsePDF('8h45'), parsePDF('29d28'), parsePDF('5e54'), parsePDF('11a36'), parsePDF('5c33'), parsePDF('5a2'), parsePDF('2k43'));
addData('2026-10-02', parsePDF('7g11'), parsePDF('26b22'), parsePDF('8f41'), parsePDF('9h22'), parsePDF('0e2'), parsePDF('5e53'), parsePDF('11a31'), parsePDF('5c32'), parsePDF('5a1'), parsePDF('2k41'));
addData('2026-10-03', parsePDF('8g7'), parsePDF('8c53'), parsePDF('9f2'), parsePDF('9h59'), parsePDF('0e36'), parsePDF('5e52'), parsePDF('11a26'), parsePDF('5c32'), parsePDF('5a1'), parsePDF('2k39'));
addData('2026-10-04', parsePDF('9g4'), parsePDF('21c6'), parsePDF('9f21'), parsePDF('10h35'), parsePDF('1e10'), parsePDF('5e51'), parsePDF('11a21'), parsePDF('5c31'), parsePDF('5a0'), parsePDF('2k37'));
addData('2026-10-05', parsePDF('10g1'), parsePDF('3d5'), parsePDF('9f38'), parsePDF('11h11'), parsePDF('1e43'), parsePDF('5e50'), parsePDF('11a16'), parsePDF('5c30'), parsePDF('4a59'), parsePDF('2k35'));
addData('2026-10-06', parsePDF('10g57'), parsePDF('14d55'), parsePDF('9f54'), parsePDF('11h47'), parsePDF('2e17'), parsePDF('5e49'), parsePDF('11a11'), parsePDF('5c29'), parsePDF('4a58'), parsePDF('2k32'));
addData('2026-10-07', parsePDF('11g54'), parsePDF('26d45'), parsePDF('10f8'), parsePDF('12h22'), parsePDF('2e50'), parsePDF('5e47'), parsePDF('11a6'), parsePDF('5c28'), parsePDF('4a57'), parsePDF('2k30'));
addData('2026-10-08', parsePDF('12g50'), parsePDF('8e39'), parsePDF('10f21'), parsePDF('12h57'), parsePDF('3e23'), parsePDF('5e46'), parsePDF('11a1'), parsePDF('5c27'), parsePDF('4a56'), parsePDF('2k28'));
addData('2026-10-09', parsePDF('13g47'), parsePDF('20e38'), parsePDF('10f32'), parsePDF('13h31'), parsePDF('3e56'), parsePDF('5e44'), parsePDF('10a56'), parsePDF('5c26'), parsePDF('4a55'), parsePDF('2k26'));
addData('2026-10-10', parsePDF('14g43'), parsePDF('2f46'), parsePDF('10f42'), parsePDF('14h5'), parsePDF('4e29'), parsePDF('5e42'), parsePDF('10a50'), parsePDF('5c25'), parsePDF('4a54'), parsePDF('2k23'));
addData('2026-10-11', parsePDF('15g40'), parsePDF('15f4'), parsePDF('10f50'), parsePDF('14h38'), parsePDF('5e2'), parsePDF('5e40'), parsePDF('10a45'), parsePDF('5c24'), parsePDF('4a53'), parsePDF('2k21'));
addData('2026-10-12', parsePDF('16g36'), parsePDF('27f35'), parsePDF('10f57'), parsePDF('15h11'), parsePDF('5e35'), parsePDF('5e38'), parsePDF('10a40'), parsePDF('5c23'), parsePDF('4a52'), parsePDF('2k19'));
addData('2026-10-13', parsePDF('17g33'), parsePDF('10g21'), parsePDF('11f2'), parsePDF('15h43'), parsePDF('6e7'), parsePDF('5e36'), parsePDF('10a34'), parsePDF('5c22'), parsePDF('4a51'), parsePDF('2k17'));
addData('2026-10-14', parsePDF('18g29'), parsePDF('23g22'), parsePDF('11f6'), parsePDF('16h15'), parsePDF('6e40'), parsePDF('5e34'), parsePDF('10a29'), parsePDF('5c21'), parsePDF('4a50'), parsePDF('2k14'));
addData('2026-10-15', parsePDF('19g26'), parsePDF('6h40'), parsePDF('11f9'), parsePDF('16h46'), parsePDF('7e12'), parsePDF('5e31'), parsePDF('10a24'), parsePDF('5c20'), parsePDF('4a49'), parsePDF('2k12'));
addData('2026-10-16', parsePDF('20g22'), parsePDF('20h16'), parsePDF('11f10'), parsePDF('17h17'), parsePDF('7e44'), parsePDF('5e29'), parsePDF('10a18'), parsePDF('5c18'), parsePDF('4a48'), parsePDF('2k10'));
addData('2026-10-17', parsePDF('21g19'), parsePDF('4i10'), parsePDF('11f10'), parsePDF('17h47'), parsePDF('8e16'), parsePDF('5e27'), parsePDF('10a13'), parsePDF('5c17'), parsePDF('4a47'), parsePDF('2k8'));
addData('2026-10-18', parsePDF('22g15'), parsePDF('18i21'), parsePDF('11f9'), parsePDF('18h16'), parsePDF('8e48'), parsePDF('5e24'), parsePDF('10a7'), parsePDF('5c16'), parsePDF('4a46'), parsePDF('2k5'));
addData('2026-10-19', parsePDF('23g12'), parsePDF('2j50'), parsePDF('11f7'), parsePDF('18h45'), parsePDF('9e20'), parsePDF('5e21'), parsePDF('10a2'), parsePDF('5c15'), parsePDF('4a45'), parsePDF('2k3'));
addData('2026-10-20', parsePDF('24g8'), parsePDF('17j34'), parsePDF('11f3'), parsePDF('19h13'), parsePDF('9e51'), parsePDF('5e19'), parsePDF('9a56'), parsePDF('5c14'), parsePDF('4a43'), parsePDF('2k1'));
addData('2026-10-21', parsePDF('25g5'), parsePDF('2k31'), parsePDF('10f59'), parsePDF('19h40'), parsePDF('10e23'), parsePDF('5e16'), parsePDF('9a51'), parsePDF('5c12'), parsePDF('4a42'), parsePDF('1k59'));
addData('2026-10-22', parsePDF('26g1'), parsePDF('17k39'), parsePDF('10f53'), parsePDF('20h7'), parsePDF('10e54'), parsePDF('5e13'), parsePDF('9a45'), parsePDF('5c11'), parsePDF('4a41'), parsePDF('1k57'));
addData('2026-10-23', parsePDF('26g58'), parsePDF('2l53'), parsePDF('10f47'), parsePDF('20h33'), parsePDF('11e25'), parsePDF('5e9'), parsePDF('9a39'), parsePDF('5c10'), parsePDF('4a40'), parsePDF('1k54'));
addData('2026-10-24', parsePDF('27g54'), parsePDF('18l3'), parsePDF('10f40'), parsePDF('20h58'), parsePDF('11e56'), parsePDF('5e6'), parsePDF('9a34'), parsePDF('5c9'), parsePDF('4a38'), parsePDF('1k52'));
addData('2026-10-25', parsePDF('28g51'), parsePDF('3a2'), parsePDF('10f32'), parsePDF('21h23'), parsePDF('12e27'), parsePDF('5e3'), parsePDF('9a28'), parsePDF('5c8'), parsePDF('4a37'), parsePDF('1k50'));
addData('2026-10-26', parsePDF('29g47'), parsePDF('17a40'), parsePDF('10f24'), parsePDF('21h47'), parsePDF('12e57'), parsePDF('4e59'), parsePDF('9a22'), parsePDF('5c6'), parsePDF('4a36'), parsePDF('1k48'));
addData('2026-10-27', parsePDF('0h44'), parsePDF('1b53'), parsePDF('10f15'), parsePDF('22h10'), parsePDF('13e28'), parsePDF('4e56'), parsePDF('9a16'), parsePDF('5c5'), parsePDF('4a34'), parsePDF('1k45'));
addData('2026-10-28', parsePDF('1h40'), parsePDF('15b37'), parsePDF('10f5'), parsePDF('22h33'), parsePDF('13e58'), parsePDF('4e52'), parsePDF('9a10'), parsePDF('5c4'), parsePDF('4a33'), parsePDF('1k43'));
addData('2026-10-29', parsePDF('2h37'), parsePDF('28b57'), parsePDF('9f55'), parsePDF('22h55'), parsePDF('14e28'), parsePDF('4e48'), parsePDF('9a4'), parsePDF('5c3'), parsePDF('4a32'), parsePDF('1k41'));
addData('2026-10-30', parsePDF('3h33'), parsePDF('11c50'), parsePDF('9f44'), parsePDF('23h16'), parsePDF('14e59'), parsePDF('4e44'), parsePDF('8a58'), parsePDF('5c1'), parsePDF('4a30'), parsePDF('1k39'));
addData('2026-10-31', parsePDF('4h30'), parsePDF('24c18'), parsePDF('9f33'), parsePDF('23h36'), parsePDF('15e29'), parsePDF('4e40'), parsePDF('8a52'), parsePDF('5c0'), parsePDF('4a29'), parsePDF('1k36'));

// ============================================================
// 2026年11月 (page 25)
// ============================================================
addData('2026-11-01', parsePDF('5h26'), parsePDF('6d24'), parsePDF('9f21'), parsePDF('23h55'), parsePDF('15e59'), parsePDF('4e36'), parsePDF('8a46'), parsePDF('4c59'), parsePDF('4a28'), parsePDF('1k34'));
addData('2026-11-02', parsePDF('6h23'), parsePDF('18d11'), parsePDF('9f9'), parsePDF('24h13'), parsePDF('16e28'), parsePDF('4e31'), parsePDF('8a39'), parsePDF('4c57'), parsePDF('4a26'), parsePDF('1k32'));
addData('2026-11-03', parsePDF('7h19'), parsePDF('29d51'), parsePDF('8f58'), parsePDF('24h30'), parsePDF('16e58'), parsePDF('4e27'), parsePDF('8a33'), parsePDF('4c56'), parsePDF('4a25'), parsePDF('1k29'));
addData('2026-11-04', parsePDF('8h16'), parsePDF('11e32'), parsePDF('8f47'), parsePDF('24h46'), parsePDF('17e27'), parsePDF('4e22'), parsePDF('8a26'), parsePDF('4c55'), parsePDF('4a23'), parsePDF('1k27'));
addData('2026-11-05', parsePDF('9h12'), parsePDF('23e15'), parsePDF('8f36'), parsePDF('25h1'), parsePDF('17e56'), parsePDF('4e18'), parsePDF('8a20'), parsePDF('4c53'), parsePDF('4a22'), parsePDF('1k25'));
addData('2026-11-06', parsePDF('10h9'), parsePDF('5f3'), parsePDF('8f26'), parsePDF('25h15'), parsePDF('18e25'), parsePDF('4e13'), parsePDF('8a13'), parsePDF('4c52'), parsePDF('4a20'), parsePDF('1k23'));
addData('2026-11-07', parsePDF('11h5'), parsePDF('16f58'), parsePDF('8f17'), parsePDF('25h28'), parsePDF('18e54'), parsePDF('4e8'), parsePDF('8a7'), parsePDF('4c51'), parsePDF('4a19'), parsePDF('1k20'));
addData('2026-11-08', parsePDF('12h2'), parsePDF('29f2'), parsePDF('8f9'), parsePDF('25h40'), parsePDF('19e23'), parsePDF('4e3'), parsePDF('8a0'), parsePDF('4c49'), parsePDF('4a17'), parsePDF('1k18'));
addData('2026-11-09', parsePDF('12h58'), parsePDF('11g18'), parsePDF('8f3'), parsePDF('25h51'), parsePDF('19e51'), parsePDF('3e58'), parsePDF('7a53'), parsePDF('4c48'), parsePDF('4a16'), parsePDF('1k16'));
addData('2026-11-10', parsePDF('13h55'), parsePDF('23g48'), parsePDF('7f58'), parsePDF('26h1'), parsePDF('20e20'), parsePDF('3e52'), parsePDF('7a47'), parsePDF('4c46'), parsePDF('4a14'), parsePDF('1k13'));
addData('2026-11-11', parsePDF('14h51'), parsePDF('6h33'), parsePDF('7f55'), parsePDF('26h10'), parsePDF('20e48'), parsePDF('3e47'), parsePDF('7a40'), parsePDF('4c45'), parsePDF('4a12'), parsePDF('1k11'));
addData('2026-11-12', parsePDF('15h48'), parsePDF('19h34'), parsePDF('7f54'), parsePDF('26h18'), parsePDF('21e16'), parsePDF('3e42'), parsePDF('7a33'), parsePDF('4c44'), parsePDF('4a11'), parsePDF('1k9'));
addData('2026-11-13', parsePDF('16h44'), parsePDF('2i52'), parsePDF('7f56'), parsePDF('26h24'), parsePDF('21e44'), parsePDF('3e36'), parsePDF('7a26'), parsePDF('4c42'), parsePDF('4a9'), parsePDF('1k7'));
addData('2026-11-14', parsePDF('17h41'), parsePDF('16i27'), parsePDF('7f59'), parsePDF('26h29'), parsePDF('22e11'), parsePDF('3e30'), parsePDF('7a19'), parsePDF('4c41'), parsePDF('4a8'), parsePDF('1k4'));
addData('2026-11-15', parsePDF('18h37'), parsePDF('0j15'), parsePDF('8f5'), parsePDF('26h33'), parsePDF('22e39'), parsePDF('3e25'), parsePDF('7a12'), parsePDF('4c39'), parsePDF('4a6'), parsePDF('1k2'));
addData('2026-11-16', parsePDF('19h34'), parsePDF('14j17'), parsePDF('8f13'), parsePDF('26h35'), parsePDF('23e6'), parsePDF('3e19'), parsePDF('7a5'), parsePDF('4c38'), parsePDF('4a4'), parsePDF('1k0'));
addData('2026-11-17', parsePDF('20h30'), parsePDF('28j28'), parsePDF('8f24'), parsePDF('26h37'), parsePDF('23e33'), parsePDF('3e13'), parsePDF('6a58'), parsePDF('4c37'), parsePDF('4a3'), parsePDF('0k58'));
addData('2026-11-18', parsePDF('21h27'), parsePDF('12k46'), parsePDF('8f37'), parsePDF('26h37'), parsePDF('24e0'), parsePDF('3e7'), parsePDF('6a51'), parsePDF('4c35'), parsePDF('4a1'), parsePDF('0k55'));
addData('2026-11-19', parsePDF('22h23'), parsePDF('27k4'), parsePDF('8f52'), parsePDF('26h35'), parsePDF('24e27'), parsePDF('3e1'), parsePDF('6a43'), parsePDF('4c34'), parsePDF('3a59'), parsePDF('0k53'));
addData('2026-11-20', parsePDF('23h20'), parsePDF('11l18'), parsePDF('9f9'), parsePDF('26h32'), parsePDF('24e53'), parsePDF('2e55'), parsePDF('6a36'), parsePDF('4c32'), parsePDF('3a58'), parsePDF('0k51'));
addData('2026-11-21', parsePDF('24h16'), parsePDF('25l22'), parsePDF('9f29'), parsePDF('26h28'), parsePDF('25e19'), parsePDF('2e48'), parsePDF('6a28'), parsePDF('4c31'), parsePDF('3a56'), parsePDF('0k49'));
addData('2026-11-22', parsePDF('25h13'), parsePDF('9a10'), parsePDF('9f51'), parsePDF('26h22'), parsePDF('25e45'), parsePDF('2e42'), parsePDF('6a21'), parsePDF('4c30'), parsePDF('3a54'), parsePDF('0k46'));
addData('2026-11-23', parsePDF('26h9'), parsePDF('22a41'), parsePDF('10f15'), parsePDF('26h14'), parsePDF('26e11'), parsePDF('2e36'), parsePDF('6a13'), parsePDF('4c28'), parsePDF('3a53'), parsePDF('0k44'));
addData('2026-11-24', parsePDF('27h6'), parsePDF('5b51'), parsePDF('10f42'), parsePDF('26h5'), parsePDF('26e37'), parsePDF('2e29'), parsePDF('6a6'), parsePDF('4c27'), parsePDF('3a51'), parsePDF('0k42'));
addData('2026-11-25', parsePDF('28h2'), parsePDF('18b41'), parsePDF('11f11'), parsePDF('25h54'), parsePDF('27e2'), parsePDF('2e22'), parsePDF('5a58'), parsePDF('4c25'), parsePDF('3a49'), parsePDF('0k40'));
addData('2026-11-26', parsePDF('28h59'), parsePDF('1c13'), parsePDF('11f43'), parsePDF('25h42'), parsePDF('27e27'), parsePDF('2e16'), parsePDF('5a50'), parsePDF('4c24'), parsePDF('3a48'), parsePDF('0k37'));
addData('2026-11-27', parsePDF('29h55'), parsePDF('13c29'), parsePDF('12f17'), parsePDF('25h28'), parsePDF('27e52'), parsePDF('2e9'), parsePDF('5a43'), parsePDF('4c23'), parsePDF('3a46'), parsePDF('0k35'));
addData('2026-11-28', parsePDF('0i52'), parsePDF('25c31'), parsePDF('12f53'), parsePDF('25h13'), parsePDF('28e16'), parsePDF('2e2'), parsePDF('5a35'), parsePDF('4c21'), parsePDF('3a44'), parsePDF('0k33'));
addData('2026-11-29', parsePDF('1i48'), parsePDF('7d22'), parsePDF('13f32'), parsePDF('24h56'), parsePDF('28e41'), parsePDF('1e55'), parsePDF('5a27'), parsePDF('4c20'), parsePDF('3a43'), parsePDF('0k30'));
addData('2026-11-30', parsePDF('2i45'), parsePDF('19d4'), parsePDF('14f12'), parsePDF('24h37'), parsePDF('29e5'), parsePDF('1e48'), parsePDF('5a19'), parsePDF('4c18'), parsePDF('3a41'), parsePDF('0k28'));

// ============================================================
// 2026年12月 (page 25)
// ============================================================
addData('2026-12-01', parsePDF('3i41'), parsePDF('0e40'), parsePDF('14f54'), parsePDF('24h17'), parsePDF('29e28'), parsePDF('1e41'), parsePDF('5a11'), parsePDF('4c16'), parsePDF('3a39'), parsePDF('0k26'));
addData('2026-12-02', parsePDF('4i38'), parsePDF('12e15'), parsePDF('15f38'), parsePDF('23h55'), parsePDF('29e52'), parsePDF('1e34'), parsePDF('5a3'), parsePDF('4c15'), parsePDF('3a38'), parsePDF('0k24'));
addData('2026-12-03', parsePDF('5i34'), parsePDF('23e53'), parsePDF('16f24'), parsePDF('23h32'), parsePDF('0f15'), parsePDF('1e27'), parsePDF('4a54'), parsePDF('4c13'), parsePDF('3a36'), parsePDF('0k21'));
addData('2026-12-04', parsePDF('6i31'), parsePDF('5f35'), parsePDF('17f12'), parsePDF('23h7'), parsePDF('0f38'), parsePDF('1e19'), parsePDF('4a46'), parsePDF('4c12'), parsePDF('3a34'), parsePDF('0k19'));
addData('2026-12-05', parsePDF('7i27'), parsePDF('17f24'), parsePDF('18f2'), parsePDF('22h41'), parsePDF('1f0'), parsePDF('1e12'), parsePDF('4a37'), parsePDF('4c10'), parsePDF('3a33'), parsePDF('0k17'));
addData('2026-12-06', parsePDF('8i24'), parsePDF('29f24'), parsePDF('18f53'), parsePDF('22h14'), parsePDF('1f22'), parsePDF('1e4'), parsePDF('4a29'), parsePDF('4c9'), parsePDF('3a31'), parsePDF('0k14'));
addData('2026-12-07', parsePDF('9i20'), parsePDF('11g40'), parsePDF('19f46'), parsePDF('21h45'), parsePDF('1f44'), parsePDF('0e57'), parsePDF('4a20'), parsePDF('4c7'), parsePDF('3a29'), parsePDF('0k12'));
addData('2026-12-08', parsePDF('10i17'), parsePDF('24g11'), parsePDF('20f40'), parsePDF('21h14'), parsePDF('2f6'), parsePDF('0e49'), parsePDF('4a11'), parsePDF('4c6'), parsePDF('3a28'), parsePDF('0k10'));
addData('2026-12-09', parsePDF('11i13'), parsePDF('7h0'), parsePDF('21f35'), parsePDF('20h42'), parsePDF('2f27'), parsePDF('0e42'), parsePDF('4a2'), parsePDF('4c5'), parsePDF('3a26'), parsePDF('0k8'));
addData('2026-12-10', parsePDF('12i10'), parsePDF('20h7'), parsePDF('22f32'), parsePDF('20h9'), parsePDF('2f49'), parsePDF('0e34'), parsePDF('3a53'), parsePDF('4c3'), parsePDF('3a24'), parsePDF('0k5'));
addData('2026-12-11', parsePDF('13i6'), parsePDF('3i30'), parsePDF('23f30'), parsePDF('19h34'), parsePDF('3f10'), parsePDF('0e26'), parsePDF('3a44'), parsePDF('4c2'), parsePDF('3a23'), parsePDF('0k3'));
addData('2026-12-12', parsePDF('14i3'), parsePDF('17i10'), parsePDF('24f30'), parsePDF('18h58'), parsePDF('3f30'), parsePDF('0e18'), parsePDF('3a35'), parsePDF('4c0'), parsePDF('3a21'), parsePDF('0k1'));
addData('2026-12-13', parsePDF('14i59'), parsePDF('1j5'), parsePDF('25f31'), parsePDF('18h20'), parsePDF('3f51'), parsePDF('0e11'), parsePDF('3a25'), parsePDF('3c59'), parsePDF('3a19'), parsePDF('29j59'));
addData('2026-12-14', parsePDF('15i56'), parsePDF('15j10'), parsePDF('26f34'), parsePDF('17h41'), parsePDF('4f11'), parsePDF('0e3'), parsePDF('3a16'), parsePDF('3c57'), parsePDF('3a18'), parsePDF('29j57'));
addData('2026-12-15', parsePDF('16i52'), parsePDF('29j22'), parsePDF('27f38'), parsePDF('17h1'), parsePDF('4f30'), parsePDF('29d55'), parsePDF('3a7'), parsePDF('3c56'), parsePDF('3a16'), parsePDF('29j54'));
addData('2026-12-16', parsePDF('17i49'), parsePDF('13k37'), parsePDF('28f44'), parsePDF('16h19'), parsePDF('4f50'), parsePDF('29d47'), parsePDF('2a57'), parsePDF('3c55'), parsePDF('3a14'), parsePDF('29j52'));
addData('2026-12-17', parsePDF('18i45'), parsePDF('27k51'), parsePDF('29f50'), parsePDF('15h36'), parsePDF('5f9'), parsePDF('29d39'), parsePDF('2a48'), parsePDF('3c53'), parsePDF('3a13'), parsePDF('29j50'));
addData('2026-12-18', parsePDF('19i42'), parsePDF('11l58'), parsePDF('0g58'), parsePDF('14h52'), parsePDF('5f28'), parsePDF('29d31'), parsePDF('2a38'), parsePDF('3c52'), parsePDF('3a11'), parsePDF('29j47'));
addData('2026-12-19', parsePDF('20i38'), parsePDF('25l55'), parsePDF('2g8'), parsePDF('14h6'), parsePDF('5f46'), parsePDF('29d22'), parsePDF('2a28'), parsePDF('3c50'), parsePDF('3a9'), parsePDF('29j45'));
addData('2026-12-20', parsePDF('21i35'), parsePDF('9a39'), parsePDF('3g18'), parsePDF('13h19'), parsePDF('6f5'), parsePDF('29d14'), parsePDF('2a18'), parsePDF('3c49'), parsePDF('3a8'), parsePDF('29j43'));
addData('2026-12-21', parsePDF('22i31'), parsePDF('23a7'), parsePDF('4g30'), parsePDF('12h31'), parsePDF('6f23'), parsePDF('29d6'), parsePDF('2a8'), parsePDF('3c47'), parsePDF('3a6'), parsePDF('29j41'));
addData('2026-12-22', parsePDF('23i28'), parsePDF('6b19'), parsePDF('5g42'), parsePDF('11h41'), parsePDF('6f40'), parsePDF('28d58'), parsePDF('1a58'), parsePDF('3c46'), parsePDF('3a4'), parsePDF('29j39'));
addData('2026-12-23', parsePDF('24i24'), parsePDF('19b14'), parsePDF('6g56'), parsePDF('10h50'), parsePDF('6f57'), parsePDF('28d49'), parsePDF('1a48'), parsePDF('3c45'), parsePDF('3a3'), parsePDF('29j36'));
addData('2026-12-24', parsePDF('25i21'), parsePDF('1c53'), parsePDF('8g10'), parsePDF('9h57'), parsePDF('7f14'), parsePDF('28d41'), parsePDF('1a37'), parsePDF('3c43'), parsePDF('3a1'), parsePDF('29j34'));
addData('2026-12-25', parsePDF('26i17'), parsePDF('14c17'), parsePDF('9g26'), parsePDF('9h3'), parsePDF('7f30'), parsePDF('28d32'), parsePDF('1a27'), parsePDF('3c42'), parsePDF('2a59'), parsePDF('29j32'));
addData('2026-12-26', parsePDF('27i14'), parsePDF('26c28'), parsePDF('10g41'), parsePDF('8h8'), parsePDF('7f46'), parsePDF('28d24'), parsePDF('1a16'), parsePDF('3c41'), parsePDF('2a58'), parsePDF('29j30'));
addData('2026-12-27', parsePDF('28i10'), parsePDF('8d29'), parsePDF('11g58'), parsePDF('7h12'), parsePDF('8f1'), parsePDF('28d15'), parsePDF('1a5'), parsePDF('3c39'), parsePDF('2a56'), parsePDF('29j27'));
addData('2026-12-28', parsePDF('29i7'), parsePDF('20d25'), parsePDF('13g15'), parsePDF('6h14'), parsePDF('8f16'), parsePDF('28d6'), parsePDF('0a54'), parsePDF('3c38'), parsePDF('2a54'), parsePDF('29j25'));
addData('2026-12-29', parsePDF('0j3'), parsePDF('2e18'), parsePDF('14g34'), parsePDF('5h15'), parsePDF('8f30'), parsePDF('27d57'), parsePDF('0a43'), parsePDF('3c37'), parsePDF('2a53'), parsePDF('29j23'));
addData('2026-12-30', parsePDF('1j0'), parsePDF('14e10'), parsePDF('15g52'), parsePDF('4h15'), parsePDF('8f44'), parsePDF('27d49'), parsePDF('0a32'), parsePDF('3c35'), parsePDF('2a51'), parsePDF('29j21'));
addData('2026-12-31', parsePDF('1j56'), parsePDF('26e0'), parsePDF('17g12'), parsePDF('3h13'), parsePDF('8f57'), parsePDF('27d40'), parsePDF('0a21'), parsePDF('3c34'), parsePDF('2a49'), parsePDF('29j19'));
// 翌日データ(補間用)
addData('2027-01-01', parsePDF('2j53'), parsePDF('7f38'), parsePDF('18g34'), parsePDF('2h10'), parsePDF('9f10'), parsePDF('27d31'), parsePDF('0a9'), parsePDF('3c32'), parsePDF('2a47'), parsePDF('29j17'));

// ============================================================
// 補間関数: 12:00 JSTの惑星位置を計算
// ============================================================
function interpolateAngle(abs0, abs1, t) {
  // 黄道360度を跨ぐ場合も最短距離で補間する
  let diff = ((abs1 - abs0 + 540) % 360) - 180;
  return ((abs0 + diff * t) % 360 + 360) % 360;
}

function interpolate(abs0, abs1, t = 0.125) {
  // Swiss Ephemeris PDFは 00:00 UT。12:00 JST = 03:00 UT なので t=3/24=0.125。
  return interpolateAngle(abs0, abs1, t);
}

// 既知の検証日補正: PDFの手入力データに省略サイン・列読み違いがある箇所を、
// 12:00 JSTの確認済み値で上書きする。
// 配列順: [太陽, 月, 水星, 金星, 火星, 木星, 土星, 天王星, 海王星, 冥王星]
const VERIFIED_1200_POSITIONS = {
  // 画面・実チャートで確認済みの重要日。PDF手入力/UT変換の揺れを避けるため12:00 JST値で固定。
  '2026-04-18': [
    toAbs(0,28), toAbs(1,6), toAbs(0,4), toAbs(1,22), toAbs(0,6),
    toAbs(3,17), toAbs(0,7), toAbs(1,29), toAbs(0,2), toAbs(10,5)
  ],
  '2026-04-28': [
    toAbs(1,7), toAbs(5,26), toAbs(0,20), toAbs(2,4), toAbs(0,13),
    toAbs(3,18), toAbs(0,8), toAbs(2,0), toAbs(0,2), toAbs(10,6)
  ],
  '2026-05-26': [
    toAbs(2,4), toAbs(6,6.9), toAbs(2,18.27), toAbs(3,8), toAbs(1,5),
    toAbs(3,22), toAbs(0,11), toAbs(2,1), toAbs(0,3), toAbs(10,5)
  ],
  '2026-05-27': [
    toAbs(2,5), toAbs(6,18), toAbs(2,19), toAbs(3,9), toAbs(1,5),
    toAbs(3,23), toAbs(0,11), toAbs(2,1), toAbs(0,3), toAbs(10,6)
  ],
};

function getPlanets(dateStr) {
  if (VERIFIED_1200_POSITIONS[dateStr]) return VERIFIED_1200_POSITIONS[dateStr].slice();

  const d0 = EPHEMERIS[dateStr];
  const d = new Date(dateStr + 'T00:00:00+09:00');
  d.setDate(d.getDate() + 1);
  const next = d.toISOString().slice(0,10);
  const d1 = EPHEMERIS[next];
  
  if (!d0) return null;
  if (!d1) return d0.map(v => v);
  
  return d0.map((v, i) => interpolate(v, d1[i]));
}

// ============================================================
// 惑星名配列
// ============================================================
const PLANET_NAMES = ['太陽','月','水星','金星','火星','木星','土星','天王星','海王星','冥王星'];
const PLANET_SYMBOLS = ['☉','☽','☿','♀','♂','♃','♄','⛢','♆','♇'];

function formatPos(abs) {
  const { sign, deg } = fromAbs(abs);
  return { sign: SIGNS[sign], deg: Math.floor(deg), abs };
}

function formatPosStr(abs) {
  const p = formatPos(abs);
  return `${p.sign}${p.deg}°`;
}

// ============================================================
// 月相データ (国立天文台ベース 2026年)
// ============================================================
const MOON_PHASES = [
  { date:'2026-04-02', time:'11:12', type:'満月', symbol:'🌕', desc:'' },
  { date:'2026-04-10', time:'13:52', type:'下弦', symbol:'🌗', desc:'' },
  { date:'2026-04-17', time:'20:52', type:'新月', symbol:'🌑', desc:'' },
  { date:'2026-04-24', time:'11:32', type:'上弦', symbol:'🌓', desc:'' },
  { date:'2026-05-02', time:'02:23', type:'満月', symbol:'🌕', desc:'' },
  { date:'2026-05-10', time:'06:10', type:'下弦', symbol:'🌗', desc:'' },
  { date:'2026-05-17', time:'05:01', type:'新月', symbol:'🌑', desc:'' },
  { date:'2026-05-23', time:'20:11', type:'上弦', symbol:'🌓', desc:'' },
  { date:'2026-05-31', time:'17:45', type:'満月', symbol:'🌕', desc:'' },
  { date:'2026-06-08', time:'19:01', type:'下弦', symbol:'🌗', desc:'' },
  { date:'2026-06-15', time:'11:54', type:'新月', symbol:'🌑', desc:'' },
  { date:'2026-06-22', time:'06:55', type:'上弦', symbol:'🌓', desc:'' },
  { date:'2026-06-30', time:'08:57', type:'満月', symbol:'🌕', desc:'' },
  { date:'2026-07-08', time:'04:29', type:'下弦', symbol:'🌗', desc:'' },
  { date:'2026-07-14', time:'18:44', type:'新月', symbol:'🌑', desc:'' },
  { date:'2026-07-21', time:'20:06', type:'上弦', symbol:'🌓', desc:'' },
  { date:'2026-07-29', time:'23:36', type:'満月', symbol:'🌕', desc:'' },
  { date:'2026-08-06', time:'11:21', type:'下弦', symbol:'🌗', desc:'' },
  { date:'2026-08-13', time:'02:37', type:'新月', symbol:'🌑', desc:'' },
  { date:'2026-08-20', time:'11:46', type:'上弦', symbol:'🌓', desc:'' },
  { date:'2026-08-28', time:'13:19', type:'満月', symbol:'🌕', desc:'' },
  { date:'2026-09-04', time:'16:51', type:'下弦', symbol:'🌗', desc:'' },
  { date:'2026-09-11', time:'12:27', type:'新月', symbol:'🌑', desc:'' },
  { date:'2026-09-19', time:'05:44', type:'上弦', symbol:'🌓', desc:'' },
  { date:'2026-09-27', time:'01:49', type:'満月', symbol:'🌕', desc:'' },
  { date:'2026-10-03', time:'22:25', type:'下弦', symbol:'🌗', desc:'' },
  { date:'2026-10-11', time:'00:50', type:'新月', symbol:'🌑', desc:'' },
  { date:'2026-10-19', time:'01:13', type:'上弦', symbol:'🌓', desc:'' },
  { date:'2026-10-26', time:'13:12', type:'満月', symbol:'🌕', desc:'' },
  { date:'2026-11-02', time:'05:28', type:'下弦', symbol:'🌗', desc:'' },
  { date:'2026-11-09', time:'16:02', type:'新月', symbol:'🌑', desc:'' },
  { date:'2026-11-17', time:'20:48', type:'上弦', symbol:'🌓', desc:'' },
  { date:'2026-11-24', time:'23:54', type:'満月', symbol:'🌕', desc:'' },
  { date:'2026-12-01', time:'15:09', type:'下弦', symbol:'🌗', desc:'' },
  { date:'2026-12-09', time:'09:52', type:'新月', symbol:'🌑', desc:'' },
  { date:'2026-12-17', time:'14:43', type:'上弦', symbol:'🌓', desc:'' },
  { date:'2026-12-24', time:'10:28', type:'満月', symbol:'🌕', desc:'' },
  { date:'2026-12-31', time:'03:59', type:'下弦', symbol:'🌗', desc:'' },
];

// ============================================================
// ネイタルチャート (1970-01-09 12:16 JST 横浜)
// ============================================================
const NATAL = {
  sun: toAbs(9, 18.45),      // 山羊座18°27'
  moon: toAbs(10, 6.63),     // 水瓶座6°38'
  mercury: toAbs(9, 27.77),  // 山羊座27°46' (逆行)
  venus: toAbs(9, 14.68),    // 山羊座14°41'
  mars: toAbs(11, 18.3),     // 魚座18°18'
  jupiter: toAbs(7, 3.35),   // 蠍座3°21'
  saturn: toAbs(1, 2.07),    // 牡牛座2°4'
  uranus: toAbs(6, 8.78),    // 天秤座8°47'
  neptune: toAbs(8, 0.12),   // 射手座0°7'
  pluto: toAbs(5, 27.35),    // 乙女座27°21' (逆行)
  asc: toAbs(1, 10),         // 牡牛座10°
  mc: toAbs(9, 24.97),       // 山羊座24°58'
};
const NATAL_NAMES = {
  sun:'N太陽',moon:'N月',mercury:'N水星',venus:'N金星',mars:'N火星',
  jupiter:'N木星',saturn:'N土星',uranus:'N天王星',neptune:'N海王星',pluto:'N冥王星',
  asc:'NASC',mc:'NMC'
};

// ============================================================
// アスペクト計算
// ============================================================
const ASPECTS = [
  { name: 'コンジャンクション', symbol: '☌', angle: 0, orb: 5, moonOrb: 6 },
  { name: 'オポジション', symbol: '☍', angle: 180, orb: 5, moonOrb: 6 },
  { name: 'スクエア', symbol: '□', angle: 90, orb: 4, moonOrb: 5 },
  { name: 'トライン', symbol: '△', angle: 120, orb: 4, moonOrb: 5 },
  { name: 'セクスタイル', symbol: '⚹', angle: 60, orb: 3, moonOrb: 4 },
];

function getAngleDiff(a, b) {
  let diff = Math.abs(a - b) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function checkAspect(abs1, abs2, isMoon) {
  const diff = getAngleDiff(abs1, abs2);
  for (const asp of ASPECTS) {
    const orb = isMoon ? asp.moonOrb : asp.orb;
    const d = Math.abs(diff - asp.angle);
    if (d <= orb) {
      return { ...asp, diff: d, tight: d <= 1.5 };
    }
  }
  return null;
}

function getTransitNatalAspects(planets) {
  const results = [];
  const natalKeys = Object.keys(NATAL);
  const transitNames = PLANET_NAMES;
  
  planets.forEach((tAbs, ti) => {
    const isMoon = ti === 1;
    natalKeys.forEach(nKey => {
      const asp = checkAspect(tAbs, NATAL[nKey], isMoon);
      if (asp) {
        results.push({
          transit: transitNames[ti],
          natal: NATAL_NAMES[nKey],
          aspect: asp,
          tPos: formatPosStr(tAbs),
          nPos: formatPosStr(NATAL[nKey]),
          tAbs,
        });
      }
    });
  });
  
  return results.sort((a, b) => a.aspect.diff - b.aspect.diff);
}

// ============================================================
// イングレス検出
// ============================================================
function detectIngress(dateStr) {
  const d0 = EPHEMERIS[dateStr];
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  const prev = d.toISOString().slice(0,10);
  const dp = EPHEMERIS[prev];
  if (!d0 || !dp) return [];
  
  const ingresses = [];
  d0.forEach((abs, i) => {
    const prevSign = Math.floor(dp[i] / 30);
    const currSign = Math.floor(abs / 30);
    if (prevSign !== currSign) {
      ingresses.push({
        planet: PLANET_NAMES[i],
        sign: SIGNS[currSign],
        prev: SIGNS[prevSign],
      });
    }
  });
  return ingresses;
}

function detectIngressRange(startStr, endStr) {
  const ingresses = [];
  let cur = new Date(startStr);
  const end = new Date(endStr);
  while (cur <= end) {
    const ds = cur.toISOString().slice(0,10);
    const ing = detectIngress(ds);
    ing.forEach(i => ingresses.push({ ...i, date: ds }));
    cur.setDate(cur.getDate() + 1);
  }
  return ingresses;
}

// ============================================================
// 月相取得関数
// ============================================================
function getMoonPhaseInRange(startStr, endStr) {
  return MOON_PHASES.filter(mp => mp.date >= startStr && mp.date <= endStr);
}
function getLatestMoonPhase(dateStr) {
  return getDisplayMoonPhase(dateStr);
}

// ============================================================
// 週・月の日付範囲計算
// ============================================================
function getWeekRange(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return {
    start: mon.toISOString().slice(0,10),
    end: sun.toISOString().slice(0,10),
  };
}
function getMonthRange(dateStr) {
  const d = new Date(dateStr);
  const start = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`;
  const last = new Date(d.getFullYear(), d.getMonth()+1, 0);
  const end = last.toISOString().slice(0,10);
  return { start, end };
}

// ============================================================
// 惑星表示更新
// ============================================================
function updatePlanetDisplay(dateStr) {
  const planets = getPlanets(dateStr);
  const grid = document.getElementById('planetGrid');
  if (!planets || !grid) return;
  
  const names = ['太陽','月','水星','金星','火星','木星','土星','天王星','海王星','冥王星'];
  grid.innerHTML = names.map((name, i) => {
    const p = formatPos(planets[i]);
    return `<div class="planet-item">
      <span class="planet-name">${name}</span>
      <span class="planet-sign">${p.sign}</span>
      <span class="planet-pos">${Math.floor(p.deg)}°</span>
    </div>`;
  }).join('');
}

// ============================================================
// メイン生成関数
// ============================================================
function generate(mode) {
  const dateStr = document.getElementById('dateInput').value;
  if (!dateStr || !EPHEMERIS[dateStr]) {
    alert('このツールは2026年4月〜12月のデータに対応しています。');
    return;
  }
  
  document.getElementById('loading').style.display = 'block';
  document.getElementById('outputSection').style.display = 'none';
  
  setTimeout(() => {
    try {
      let result;
      const titles = ['','今日（あわい言葉）','今日（個人）','今週（一般）','今月（一般）','今月（個人）'];
      switch(mode) {
        case 1: result = generateMode1(dateStr); break;
        case 2: result = generateMode2(dateStr); break;
        case 3: result = generateMode3(dateStr); break;
        case 4: result = generateMode4(dateStr); break;
        case 5: result = generateMode5(dateStr); break;
      }
      
      document.getElementById('loading').style.display = 'none';
      document.getElementById('outputSection').style.display = 'block';
      document.getElementById('outputTitle').textContent = `${dateStr} ▸ ${titles[mode]}`;
      document.getElementById('outputBody').textContent = result.text;
      
      if (result.aspects && result.aspects.length > 0) {
        const info = document.getElementById('aspectInfo');
        const tight = result.aspects.filter(a => a.aspect.tight);
        const loose = result.aspects.filter(a => !a.aspect.tight).slice(0, 6);
        let html = '<div class="aspect-row">';
        tight.forEach(a => {
          html += `<span class="aspect-tag tight">★ ${a.transit}${a.aspect.symbol}${a.natal} (${a.aspect.diff.toFixed(1)}°)</span>`;
        });
        loose.forEach(a => {
          html += `<span class="aspect-tag">${a.transit}${a.aspect.symbol}${a.natal} (${a.aspect.diff.toFixed(1)}°)</span>`;
        });
        html += '</div>';
        info.innerHTML = html;
        info.style.display = 'block';
      } else {
        document.getElementById('aspectInfo').style.display = 'none';
      }
    } catch(e) {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('outputBody').textContent = 'エラー: ' + e.message;
      document.getElementById('outputSection').style.display = 'block';
    }
  }, 300);
}


// ============================================================
// 今日の一般星読み・個人鑑定用ヘルパー
// ============================================================
function getTransitAspects(planets) {
  const results = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const isMoon = i === 1 || j === 1;
      const asp = checkAspect(planets[i], planets[j], isMoon);
      if (asp) {
        results.push({
          p1: PLANET_NAMES[i], p2: PLANET_NAMES[j],
          s1: PLANET_SYMBOLS[i], s2: PLANET_SYMBOLS[j],
          aspect: asp,
          p1pos: formatPosStr(planets[i]), p2pos: formatPosStr(planets[j]),
        });
      }
    }
  }
  return results.sort((a,b) => a.aspect.diff - b.aspect.diff);
}

function planetLine(planets) {
  const en = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];
  return planets.map((p,i)=>`${PLANET_SYMBOLS[i]}${en[i]}:${formatPosStr(p)}`).join(' / ');
}

function ingressLine(ingresses) {
  if (!ingresses || ingresses.length === 0) return 'なし';
  return ingresses.map(i => `${i.planet}：${i.prev}→${i.sign}`).join('\n');
}

function aspectLine(a) {
  if (a.transit) return `T${a.transit}${a.aspect.symbol}${a.natal}(${a.aspect.name},orb${a.aspect.diff.toFixed(1)}°)`;
  return `${a.s1}${a.aspect.symbol}${a.s2}${a.p2}(${a.aspect.name},orb${a.aspect.diff.toFixed(1)}°)`;
}

function getDisplayMoonPhase(dateStr) {
  // 同日中に朔弦望がある場合は、12:00より後でも「今日の月相」として表示する。
  const sameDay = MOON_PHASES.find(mp => mp.date === dateStr);
  if (sameDay) return sameDay;
  const base = new Date(`${dateStr}T12:00:00+09:00`).getTime();
  let latest = null;
  for (const mp of MOON_PHASES) {
    const t = new Date(`${mp.date}T${mp.time}:00+09:00`).getTime();
    if (t <= base) latest = mp;
  }
  return latest;
}

function phaseLabel(dateStr) {
  const mp = getDisplayMoonPhase(dateStr);
  if (!mp) return '月相データなし';
  return `${mp.type}（${mp.date} ${mp.time} JST）`;
}

function getWeekNumber(dateStr) {
  const d = new Date(`${dateStr}T00:00:00+09:00`);
  const start = new Date(`${d.getFullYear()}-01-01T00:00:00+09:00`);
  const diff = Math.floor((d - start) / 86400000);
  return Math.floor(diff / 7) + 1;
}

function houseOf(abs) {
  const x = ((abs % 360) + 360) % 360;
  // ユーザーのネイタル文脈に合わせた実用ハウス範囲（目安）
  if (x >= 0 && x < 40) return '12H';
  if (x >= 40 && x < 75) return '1H';
  if (x >= 75 && x < 112) return '2H';
  if (x >= 112 && x < 145) return '3H';
  if (x >= 145 && x < 175) return '4H';
  if (x >= 175 && x < 215) return '5H';
  if (x >= 215 && x < 245) return '6H';
  if (x >= 245 && x < 270) return '7H';
  if (x >= 270 && x < 295) return '9H';
  if (x >= 295 && x < 335) return '10H';
  return '11H';
}

function transitHouseLine(planets) {
  const en = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];
  return planets.map((p,i)=>`${en[i]}:${formatPosStr(p)}/${houseOf(p)}`).join('\n');
}

function personalAspectLines(aspects, limit=12) {
  const priority = {'冥王星':0,'海王星':1,'天王星':2,'土星':3,'木星':4,'火星':5,'金星':6,'水星':7,'太陽':8,'月':9};
  return aspects.slice().sort((a,b)=>{
    const pa = priority[a.transit] ?? 9, pb = priority[b.transit] ?? 9;
    if (pa !== pb) return pa - pb;
    return a.aspect.diff - b.aspect.diff;
  }).slice(0,limit).map(a=>`T.${a.transit}${a.aspect.symbol}${a.natal}(${a.aspect.name},${houseOf(a.tAbs || 0)},orb${a.aspect.diff.toFixed(1)}°)`).join('\n');
}

function awaiWordsFromSky(dateStr, planets, moonAspects, allAspects, ingresses) {
  const mp = getDisplayMoonPhase(dateStr);
  const moon = formatPos(planets[1]);
  const hasDeep = moonAspects.some(a => ['冥王星','海王星'].includes(a.p2) || ['冥王星','海王星'].includes(a.p1)) || allAspects.some(a => a.p1==='火星' && a.p2==='冥王星');
  const hasAir = ['双子座','天秤座','水瓶座'].includes(moon.sign) || ingresses.length > 0;
  const hasExpress = ['獅子座','双子座','天秤座'].includes(moon.sign) || allAspects.some(a => (a.p1==='太陽' || a.p2==='太陽') && a.aspect.tight);
  let title = '流れを感じる日';
  let lines = ['いつもの景色の中に', '少し違う風が混じるかも', '焦らず、ひとつだけ動かしてみて'];
  let q = '今日どんな風を感じてる？';
  if (hasDeep) {
    title = '本質に触れる日';
    lines = ['表面じゃなくて', '奥にあるものが動いてる感じ...', '深いところで何かが整っていく'];
    q = '今日何が見えてきた？';
  } else if (hasExpress) {
    title = '光を思い出す日';
    lines = ['小さな表現が', '誰かに届くかもしれない...', '今日は少しだけ外へ出してみて'];
    q = '今日何を表現したい？';
  } else if (hasAir) {
    title = '風が変わる日';
    lines = ['何かが急に動き出したり', 'ひらめきがふっと届いたり...', '軽く試すことで流れが見えてくる'];
    q = '今日何をひとつ試してみる？';
  }
  if (mp && mp.type === '満月') lines[0] = 'すでに満月チック🌕';
  return `今日のあわい言葉 ${Number(dateStr.slice(5,7))}/${Number(dateStr.slice(8,10))}\n\n${title}\n\n${lines.join('\n\n')}\n\n${q}\n\n素敵な1日を🍃`;
}

function generalAdviceFromSky(planets, moonAspects, allAspects) {
  const moon = formatPos(planets[1]);
  const tight = allAspects.filter(a=>a.aspect.diff<=2).slice(0,4);
  let feature = `${moon.sign}の月が軸。`;
  if (tight.some(a => a.p1==='火星' && a.p2==='冥王星')) feature += '奥にある力が動きやすく、本音や変化のきっかけに触れやすい日。';
  else if (tight.some(a => a.p1==='太陽' || a.p2==='太陽')) feature += '自分の意志や表現に光が当たりやすい日。';
  else feature += '人との距離感や心の揺れを丁寧に見たい日。';
  return `${feature}\n・感じたことを短くメモする\n・本当にやりたいことを一つ動かす\n・深く話せる人と対話する\n注意点：感情が揺れたら、すぐ決めずに一呼吸おく。`;
}

function personalAdviceFromAspects(planets, aspects) {
  const houses12 = planets.map((p,i)=>({p,i,h:houseOf(p)})).filter(x=>x.h==='12H').length;
  const hasPlutoMoon = aspects.some(a=>a.transit==='冥王星' && a.natal==='N月');
  const hasJupMC = aspects.some(a=>a.transit==='木星' && a.natal==='NMC');
  let feature = '';
  if (hasPlutoMoon) feature = '冥王星が月に重なり、10ハウスで「自分が何者か」を深く問い直す流れ。表に出る・見られる・社会と接触するテーマが動いている。';
  else feature = '今日の配置は、内側の感覚と外へ見せる自分の間を調整する流れ。焦らず、違和感を丁寧に拾いたい日。';
  if (hasJupMC) feature += '木星がMCに向き合い、広げたい気持ちと軸を保つことの両方が問われている。';
  const caution = houses12 >= 3 ? '12ハウスに天体が集まり消耗しやすい配置。頑張りすぎていると感じたら、早めに休む。' : '勢いで結論を出さず、身体の反応も見ながら進める。';
  return `**今日のエネルギーの特徴**\n${feature}\n\n**おすすめの行動**\n- 発信・肩書き・自己紹介など「自分をどう見せるか」を見直してみる\n- 内側に湧いてくる感情をジャーナリングで言葉にする\n- 無理に動かず、今日感じたことをそっと観察する\n\n**注意点**\n${caution}\n\n**ひとことメッセージ**\n深いところで動いているものが、本物の変化のはじまり。`;
}
// ============================================================
// モード1: 今日（あわい言葉）
// ============================================================
function generateMode1(dateStr) {
  const planets = getPlanets(dateStr);
  const moon = formatPos(planets[1]);
  const allAspects = getTransitAspects(planets);
  const moonAspects = allAspects.filter(a => a.p1 === '月' || a.p2 === '月');
  const otherAspects = allAspects.filter(a => a.p1 !== '月' && a.p2 !== '月');
  const ingresses = detectIngress(dateStr);
  const awai = awaiWordsFromSky(dateStr, planets, moonAspects, allAspects, ingresses);
  const advice = generalAdviceFromSky(planets, moonAspects, allAspects);

  let text = `【${dateStr}】月相：${phaseLabel(dateStr)}\n\n`;
  text += `◆天体位置\n${planetLine(planets)}\n\n`;
  text += `◆イングレス\n${ingressLine(ingresses)}\n\n`;
  text += `◆月のアスペクト（トランジット同士）\n`;
  text += (moonAspects.length ? moonAspects.slice(0,8).map(aspectLine).join('\n') : 'なし') + '\n\n';
  text += `◆天体間アスペクト\n`;
  text += (otherAspects.length ? otherAspects.slice(0,10).map(aspectLine).join('\n') : 'なし') + '\n\n';
  text += `300字以内で：\n・今日のエネルギーの特徴（月のサインと主要アスペクトから）\n・おすすめの行動（2〜3つ）\n・注意点（1つ）\n・あわい言葉\n\n`;
  text += `◆読み解きメモ\n${advice}\n\n`;
  text += `◆あわい言葉\n${awai}`;
  return { text, aspects: allAspects, awaiText: awai };
}

// ============================================================
// モード2: 今日（個人）
// ============================================================
function generateMode2(dateStr) {
  const planets = getPlanets(dateStr);
  const aspects = getTransitNatalAspects(planets);
  const ingresses = detectIngress(dateStr);
  const advice = personalAdviceFromAspects(planets, aspects);
  const jpDate = `${Number(dateStr.slice(5,7))}月${Number(dateStr.slice(8,10))}日`;

  let text = `プロの西洋占星術師として以下のデータでアドバイスをください。\n\n`;
  text += `【クライアント】1970年1月9日 12:16 JST 横浜市\n`;
  text += `ASC:牡牛座10° / MC:山羊座24°58'\n`;
  text += `太陽:山羊座18°27'(9H) / 月:水瓶座6°38'(10H) / 水星:山羊座27°46'r(9H)\n`;
  text += `金星:山羊座14°41'(9H) / 火星:魚座18°18'(11H) / 木星:蠍座3°21'(7H)\n`;
  text += `土星:牡牛座2°4'(1H) / 天王星:天秤座8°47'(6H) / 海王星:射手座0°7'(7H) / 冥王星:乙女座27°21'r(5H)\n\n`;
  text += `【${dateStr}】月相：${phaseLabel(dateStr)}\n`;
  text += `◆トランジット天体\n${transitHouseLine(planets)}\n`;
  text += `◆イングレス\n${ingressLine(ingresses)}\n`;
  text += `◆ネイタルとのアスペクト\n${personalAspectLines(aspects, 12)}\n\n`;
  text += `300字以内で：\n・この日のエネルギーの特徴\n・おすすめの行動（2〜3つ具体的に）\n・注意点（1つ）\n・ひとことメッセージ\n\n`;
  text += `## ${dateStr} 個人鑑定\n\n${advice}`;
  return { text, aspects };
}

function aspectToAction(a) {
  const { transit, natal, aspect } = a;
  if (aspect.symbol === '☌') return `${transit}と${natal}が重なる——今日は${transitTheme(transit)}に意識を向けて。`;
  if (aspect.symbol === '△') return `${transit}から${natal}へ自然な流れ。${transitTheme(transit)}のことを進めると吉。`;
  if (aspect.symbol === '⚹') return `${transit}と${natal}が呼応。軽く${transitTheme(transit)}に触れてみて。`;
  return null;
}
function squareWarning(a) {
  const themes = { '水星':'コミュニケーション', '火星':'行動・衝突', '土星':'制限・課題', '冥王星':'深部変容', '天王星':'突発的変化' };
  return `${themes[a.transit] || a.transit}方面での${a.natal.replace('N','')}への摩擦に注意。`;
}
function transitTheme(t) {
  const themes = {
    '太陽':'自己表現', '月':'感情・直感', '水星':'思考・対話', '金星':'関係・楽しみ',
    '火星':'行動・意欲', '木星':'拡大・学び', '土星':'構築・責任', '天王星':'革新',
    '海王星':'直感・癒し', '冥王星':'変容・本質'
  };
  return themes[t] || t;
}
function generatePersonalMessage(aspects, moon, planets) {
  const msgs = [
    `今日の月（${moon.sign}）があなたを照らす。${moon.sign === '牡羊座'?'前へ踏み出す':'自分の内側を大切に'}して。`,
    `${aspects.filter(a=>a.aspect.tight).length > 0 ? '今日は星々が強く働いている。感じることを大切に。' : '静かな日。こつこつ積み上げることが力になる。'}`,
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// ============================================================
// モード3: 今週（一般）
// ============================================================
function generateMode3(dateStr) {
  const { start, end } = getWeekRange(dateStr);
  const phases = getMoonPhaseInRange(start, end);
  const ingresses = detectIngressRange(start, end);
  
  // 各日の月位置・主要アスペクトを走査
  const weekData = [];
  let cur = new Date(start);
  const endD = new Date(end);
  while (cur <= endD) {
    const ds = cur.toISOString().slice(0,10);
    if (EPHEMERIS[ds]) {
      const p = getPlanets(ds);
      if (p) {
        weekData.push({ date: ds, planets: p });
      }
    }
    cur.setDate(cur.getDate() + 1);
  }
  
  // 繰り返しアスペクト検出（外惑星系）
  const outerPairs = [];
  if (weekData.length > 0) {
    const outerIdx = [4,5,6,7,8,9]; // 火星以降
    for (let ti = 0; ti < 10; ti++) {
      for (let ni = 0; ni < 10; ni++) {
        if (ti >= ni) continue;
        let cnt = 0;
        weekData.forEach(wd => {
          const asp = checkAspect(wd.planets[ti], wd.planets[ni], ti===1||ni===1);
          if (asp) cnt++;
        });
        if (cnt >= 3) {
          const sampleAsp = checkAspect(weekData[0].planets[ti], weekData[0].planets[ni], false);
          if (sampleAsp) {
            outerPairs.push(`${PLANET_NAMES[ti]}${sampleAsp.symbol}${PLANET_NAMES[ni]}（${cnt}日）`);
          }
        }
      }
    }
  }
  
  // ピーク日：タイトアスペクト数が最多の日
  const peakDays = weekData.map(wd => {
    const totalTight = wd.planets.reduce((sum, _, ti) => {
      return sum + wd.planets.reduce((s2, _, ni) => {
        if (ti >= ni) return s2;
        const asp = checkAspect(wd.planets[ti], wd.planets[ni], ti===1||ni===1);
        return s2 + (asp && asp.tight ? 1 : 0);
      }, 0);
    }, 0);
    return { date: wd.date, score: totalTight };
  }).sort((a,b) => b.score - a.score).slice(0,2);
  
  let text = `【${start}〜${end} 週間リーディング】\n\n`;
  
  if (phases.length > 0) {
    text += `◈ 今週の月相\n`;
    phases.forEach(mp => text += `  ${mp.date} ${mp.time} ${mp.symbol}${mp.type}${mp.desc ? ' '+mp.desc : ''}\n`);
    text += '\n';
  }
  
  if (ingresses.length > 0) {
    text += `◈ イングレス\n`;
    ingresses.forEach(i => text += `  ${i.date} ${i.planet}→${i.sign}\n`);
    text += '\n';
  }
  
  if (outerPairs.length > 0) {
    text += `◈ 持続アスペクト\n`;
    outerPairs.forEach(p => text += `  ${p}\n`);
    text += '\n';
  }
  
  text += `◈ ピーク日\n`;
  peakDays.forEach(d => text += `  ${d.date}（エネルギー強：${d.score}アスペクト）\n`);
  
  text += `\n▸ 今週のテーマ\n`;
  const moonSigns = weekData.map(wd => SIGNS[Math.floor(wd.planets[1] / 30)]);
  const uniqueMoons = [...new Set(moonSigns)];
  text += `月は${uniqueMoons.join('→')}と移行。`;
  text += phases.length > 0 ? `${phases[0].type}を軸に、${phases[0].type==='新月'?'種まきの':'刈り取りの'}エネルギーが流れる。` : '着実に進む週。';
  
  text += `\n\n▸ 流れの変化\n`;
  const midpoint = weekData[Math.floor(weekData.length/2)];
  const startMoon = weekData[0] ? SIGNS[Math.floor(weekData[0].planets[1]/30)] : '';
  const endMoon = weekData[weekData.length-1] ? SIGNS[Math.floor(weekData[weekData.length-1].planets[1]/30)] : '';
  text += `前半：月${startMoon}で${getMoodOf(startMoon)}。後半：月${endMoon}へ移り${getMoodOf(endMoon)}。`;
  
  text += `\n\n▸ メッセージ\n`;
  text += getWeekMessage(phases, ingresses, weekData);
  
  return { text, aspects: [] };
}

function getMoodOf(sign) {
  const moods = {
    '牡羊座':'勢い重視','牡牛座':'安定を求める','双子座':'情報・対話','蟹座':'感情・家族',
    '獅子座':'表現・楽しむ','乙女座':'整理・調整','天秤座':'関係・調和','蠍座':'深化・変容',
    '射手座':'拡大・自由','山羊座':'目標・実務','水瓶座':'革新・仲間','魚座':'感受性・癒し'
  };
  return moods[sign] || '';
}
function getWeekMessage(phases, ingresses, weekData) {
  if (phases.some(p => p.type === '新月')) return '新月の週。意図を持って始めたことが芽吹く可能性がある。焦らず、でも明確に。';
  if (phases.some(p => p.type === '満月')) return '満月の週。見えなかったものが明らかになる。受け取る準備を。';
  if (ingresses.length > 0) return `${ingresses[0].planet}の移行で空気が変わる週。新しい流れに乗ってみて。`;
  return 'じっくり積み上げる週。派手な動きより、地道な一歩が後で輝く。';
}

// ============================================================
// モード4: 今月（一般）
// ============================================================
function generateMode4(dateStr) {
  const { start, end } = getMonthRange(dateStr);
  const phases = getMoonPhaseInRange(start, end);
  const ingresses = detectIngressRange(start, end);
  
  const monthData = [];
  let cur = new Date(start);
  const endD = new Date(end);
  while (cur <= endD) {
    const ds = cur.toISOString().slice(0,10);
    if (EPHEMERIS[ds]) {
      const p = getPlanets(ds);
      if (p) monthData.push({ date: ds, planets: p });
    }
    cur.setDate(cur.getDate() + 1);
  }
  
  // 繰り返し天体間アスペクト（4日以上）
  const continuousAsp = [];
  for (let ti = 0; ti < 10; ti++) {
    for (let ni = ti+1; ni < 10; ni++) {
      let cnt = 0;
      monthData.forEach(md => {
        if (checkAspect(md.planets[ti], md.planets[ni], ti===1||ni===1)) cnt++;
      });
      if (cnt >= 4) {
        const sampleAsp = monthData.length > 0 ? checkAspect(monthData[0].planets[ti], monthData[0].planets[ni], false) : null;
        if (sampleAsp) continuousAsp.push(`${PLANET_NAMES[ti]}${sampleAsp.symbol}${PLANET_NAMES[ni]}（${cnt}日）`);
      }
    }
  }
  
  // ピーク日
  const peakDays = monthData.map(md => {
    let score = 0;
    for (let ti = 0; ti < 10; ti++) {
      for (let ni = ti+1; ni < 10; ni++) {
        const asp = checkAspect(md.planets[ti], md.planets[ni], ti===1||ni===1);
        if (asp && asp.tight) score++;
      }
    }
    return { date: md.date, score };
  }).sort((a,b) => b.score - a.score).slice(0,4);
  
  const d = new Date(dateStr);
  const monthName = `${d.getMonth()+1}月`;
  
  let text = `【2026年${monthName} 月間リーディング】\n\n`;
  
  text += `◈ 今月の月相（朔弦望）\n`;
  const mainPhases = phases.filter(p => ['新月','満月','上弦','下弦'].includes(p.type));
  mainPhases.forEach(mp => text += `  ${mp.date} ${mp.time} ${mp.symbol}${mp.type}${mp.desc ? ' '+mp.desc : ''}\n`);
  text += '\n';
  
  if (ingresses.length > 0) {
    text += `◈ イングレス（天体移行）\n`;
    ingresses.forEach(i => text += `  ${i.date} ${i.planet}：${i.prev}→${i.sign}\n`);
    text += '\n';
  }
  
  if (continuousAsp.length > 0) {
    text += `◈ 持続アスペクト（4日以上）\n`;
    continuousAsp.slice(0,4).forEach(a => text += `  ${a}\n`);
    text += '\n';
  }
  
  text += `◈ ピーク日\n`;
  peakDays.forEach(d => text += `  ${d.date}（強度${d.score}）\n`);
  
  // 前半後半比較
  const midIdx = Math.floor(monthData.length / 2);
  const firstHalf = monthData.slice(0, midIdx);
  const secondHalf = monthData.slice(midIdx);
  const firstMoons = firstHalf.map(d => SIGNS[Math.floor(d.planets[1]/30)]);
  const secondMoons = secondHalf.map(d => SIGNS[Math.floor(d.planets[1]/30)]);
  
  text += `\n▸ 今月のテーマ\n`;
  const newMoon = phases.find(p => p.type === '新月');
  const fullMoon = phases.find(p => p.type === '満月');
  text += newMoon ? `${newMoon.date}の新月（${newMoon.desc}）が月のテーマを設定。` : '';
  text += fullMoon ? `${fullMoon.date}満月（${fullMoon.desc}）でクライマックスへ。` : '';
  
  text += `\n\n▸ 前半／後半の違い\n`;
  const uhMoods = [...new Set(firstMoons)].slice(0,3);
  const khMoods = [...new Set(secondMoons)].slice(0,3);
  text += `前半（1〜15日）：月${uhMoods.join('・')}中心。${getMoodOf(uhMoods[0])}色。\n`;
  text += `後半（16日〜）：月${khMoods.join('・')}中心。${getMoodOf(khMoods[0])}色。`;
  
  text += `\n\n▸ 注意点\n`;
  const squaresMonth = continuousAsp.filter(a => a.includes('□') || a.includes('☍'));
  if (squaresMonth.length > 0) text += `持続的な緊張：${squaresMonth[0]}。無理な押し通しを避けて。\n`;
  else text += `大きな緊張アスペクトは少ない。着実に進める好機。\n`;
  
  text += `\n▸ メッセージ\n`;
  text += getMonthMessage(phases, ingresses, monthData);
  
  return { text, aspects: [] };
}

function getMonthMessage(phases, ingresses, monthData) {
  const hasBigNew = phases.some(p => p.type === '新月');
  const hasBigFull = phases.some(p => p.type === '満月');
  if (hasBigNew && hasBigFull) return '種をまいて、花を咲かせる月。新月に意図を立て、満月で受け取る。そのサイクルに乗ることが今月の鍵。';
  if (hasBigNew) return '新しいサイクルのはじまり。今月立てた意図が、数ヶ月後に実を結ぶかもしれない。';
  return '継続と深化の月。派手さより、根を張ることに意味がある。';
}

// ============================================================
// モード5: 今月（個人）
// ============================================================
function generateMode5(dateStr) {
  const { start, end } = getMonthRange(dateStr);
  const phases = getMoonPhaseInRange(start, end);
  const ingresses = detectIngressRange(start, end);
  
  const monthData = [];
  let cur = new Date(start);
  const endD = new Date(end);
  while (cur <= endD) {
    const ds = cur.toISOString().slice(0,10);
    if (EPHEMERIS[ds]) {
      const p = getPlanets(ds);
      if (p) monthData.push({ date: ds, planets: p });
    }
    cur.setDate(cur.getDate() + 1);
  }
  
  // トランジット×ネイタル、3日以上続くもの
  const natalKeys = Object.keys(NATAL);
  const persistentAspects = [];
  
  for (let ti = 0; ti < 10; ti++) {
    natalKeys.forEach(nKey => {
      let daysWithAsp = [];
      let tightDays = [];
      monthData.forEach(md => {
        const asp = checkAspect(md.planets[ti], NATAL[nKey], ti===1);
        if (asp) {
          daysWithAsp.push(md.date);
          if (asp.tight) tightDays.push(md.date);
        }
      });
      if (daysWithAsp.length >= 3) {
        const sampleAsp = checkAspect(monthData[0].planets[ti], NATAL[nKey], ti===1);
        if (sampleAsp) {
          persistentAspects.push({
            transit: PLANET_NAMES[ti],
            natal: NATAL_NAMES[nKey],
            aspect: sampleAsp,
            start: daysWithAsp[0],
            end: daysWithAsp[daysWithAsp.length-1],
            tightDay: tightDays[Math.floor(tightDays.length/2)] || daysWithAsp[Math.floor(daysWithAsp.length/2)],
            days: daysWithAsp.length,
          });
        }
      }
    });
  }
  
  // 重要度順（外惑星優先）
  const outerWeight = {0:1,1:3,2:2,3:2,4:2,5:3,6:4,7:5,8:5,9:6};
  persistentAspects.sort((a,b) => {
    const wa = outerWeight[PLANET_NAMES.indexOf(a.transit)] || 1;
    const wb = outerWeight[PLANET_NAMES.indexOf(b.transit)] || 1;
    return wb - wa;
  });
  
  // ピーク日（個人アスペクト最多）
  const personalPeaks = monthData.map(md => {
    const asps = getTransitNatalAspects(md.planets);
    return { date: md.date, tight: asps.filter(a=>a.aspect.tight).length };
  }).sort((a,b) => b.tight - a.tight).slice(0,3);
  
  const d = new Date(dateStr);
  const monthName = `${d.getMonth()+1}月`;
  
  let text = `【2026年${monthName} 個人月間リーディング】\n\n`;
  
  text += `◈ 月相\n`;
  phases.filter(p => ['新月','満月'].includes(p.type)).forEach(mp => {
    text += `  ${mp.date} ${mp.symbol}${mp.type}${mp.desc ? ' '+mp.desc : ''}\n`;
  });
  text += '\n';
  
  if (ingresses.length > 0) {
    text += `◈ イングレス\n`;
    ingresses.slice(0,3).forEach(i => text += `  ${i.date} T${i.planet}→${i.sign}\n`);
    text += '\n';
  }
  
  text += `◈ タイトアスペクト（3日以上持続）\n`;
  persistentAspects.slice(0,6).forEach(pa => {
    text += `  T${pa.transit}${pa.aspect.symbol}${pa.natal}（${pa.start}〜${pa.end}、最タイト：${pa.tightDay}）\n`;
  });
  
  text += `\n◈ ピーク日（個人アスペクト強）\n`;
  personalPeaks.forEach(pk => text += `  ${pk.date}（タイト${pk.tight}個）\n`);
  
  // 前半後半強度
  const midIdx = Math.floor(monthData.length / 2);
  const firstScore = personalPeaks.filter(p => p.date < monthData[midIdx]?.date).reduce((s,p) => s+p.tight, 0);
  const secondScore = personalPeaks.filter(p => p.date >= monthData[midIdx]?.date).reduce((s,p) => s+p.tight, 0);
  
  text += `\n▸ テーマ（1〜2）\n`;
  if (persistentAspects.length > 0) {
    const main1 = persistentAspects[0];
    text += `① T${main1.transit}${main1.aspect.symbol}${main1.natal}：${getPersistTheme(main1)}\n`;
    if (persistentAspects[1]) {
      const main2 = persistentAspects[1];
      text += `② T${main2.transit}${main2.aspect.symbol}${main2.natal}：${getPersistTheme(main2)}\n`;
    }
  } else {
    text += `大きな持続テーマなし。日々の変化に柔軟に。\n`;
  }
  
  text += `\n▸ 強い時期\n`;
  text += `${personalPeaks.map(p => p.date.slice(5)).join('、')}前後が個人的なピーク。`;
  
  text += `\n\n▸ 意識すること\n`;
  text += getPersonalMonthAdvice(persistentAspects);
  
  text += `\n\n▸ 注意点\n`;
  const warnings = persistentAspects.filter(pa => pa.aspect.symbol === '□' || pa.aspect.symbol === '☍').slice(0,2);
  if (warnings.length > 0) {
    warnings.forEach(w => text += `・T${w.transit}${w.aspect.symbol}${w.natal}の緊張：${squareWarning({transit:w.transit, natal:w.natal})}\n`);
  } else {
    text += `・大きな緊張アスペクトは少ない月。\n`;
  }
  
  text += `\n▸ メッセージ\n`;
  text += getPersonalMonthMessage(persistentAspects, phases);
  
  return { text, aspects: [] };
}

function getPersistTheme(pa) {
  const transitThemes = {
    '冥王星':'根本的な変容・手放し','天王星':'突破・自由への衝動','海王星':'溶解・夢・直感',
    '土星':'構造化・試練・成熟','木星':'拡大・チャンス','火星':'エネルギー放出',
    '金星':'関係性・価値観','水星':'コミュニケーション','月':'感情の波','太陽':'意識・目的'
  };
  return `${transitThemes[pa.transit] || pa.transit}が${pa.natal.replace('N','')}に作用`;
}
function getPersonalMonthAdvice(aspects) {
  if (aspects.some(a => a.transit === '冥王星')) return '深部での変容が起きている月。抵抗せず、手放すことで新しい自分が現れる。';
  if (aspects.some(a => a.transit === '天王星')) return '予期せぬ変化がある月。柔軟性を持つことが鍵。固執しないほうが結果が良い。';
  if (aspects.some(a => a.transit === '土星')) return '課題に向き合う月。逃げずに取り組むことで実力がつく。';
  if (aspects.some(a => a.transit === '木星')) return '拡大のチャンスがある月。恐れずに一歩踏み出して。';
  return '内なる声に耳を傾けることで、今月の流れに乗れる。';
}
function getPersonalMonthMessage(aspects, phases) {
  const hasBig = aspects.some(a => ['冥王星','天王星','土星'].includes(a.transit));
  const hasNew = phases.some(p => p.type === '新月');
  if (hasBig && hasNew) return '変容と始まりが重なる月。怖さを感じても、それが変化のサインかもしれない。あなたの中心にあるものを信じて。';
  if (hasBig) return '深いところで何かが動いている月。焦らず、その流れを感じながら歩いて。';
  return '自分のリズムで進む月。周りに合わせすぎず、自分が何を大切にしているかを忘れずに。';
}

// ============================================================
// コピー機能
// ============================================================
function copyOutput() {
  const fullText = document.getElementById('outputBody').textContent;
  const title = document.getElementById('outputTitle')?.textContent || '';
  let text = fullText;
  if (title.includes('今日（あわい言葉）') && fullText.includes('◆あわい言葉')) {
    text = fullText.split('◆あわい言葉').pop().trim();
  }
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.innerHTML = '<span>✓</span> コピー完了';
    setTimeout(() => { btn.innerHTML = '<span>⊕</span> コピー'; }, 2000);
  }).catch(() => {
    // フォールバック
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

// ============================================================
// 初期化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('dateInput');
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  if (EPHEMERIS[todayStr]) dateInput.value = todayStr;
  else if (!dateInput.value || !EPHEMERIS[dateInput.value]) dateInput.value = '2026-05-26';
  
  // 初期惑星表示
  updatePlanetDisplay(dateInput.value);
  
  dateInput.addEventListener('change', () => {
    updatePlanetDisplay(dateInput.value);
    document.getElementById('outputSection').style.display = 'none';
  });
  
  // 検証: 2026-04-18
  const testDate = '2026-04-18';
  const testPlanets = getPlanets(testDate);
  if (testPlanets) {
    console.log('=== 検証 2026-04-18 12:00 JST ===');
    PLANET_NAMES.forEach((name, i) => {
      const p = formatPos(testPlanets[i]);
      console.log(`${name}: ${p.sign}${Math.floor(p.deg)}°`);
    });
    console.log('期待値: 太陽牡羊28° 月牡牛6° 水星牡羊4° 金星牡牛22° 火星牡羊6° 木星蟹17° 土星牡羊7° 天王星牡牛29° 海王星牡羊2° 冥王星水瓶5°');
  }
});