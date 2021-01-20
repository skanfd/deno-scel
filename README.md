Ported from [scel-parser](https://github.com/iftech-engineering/scel-parser).

# deno-scel

1) 搜狗细胞词库解析器

2) scel ==> ibus智能拼音词库转换器

为简便起见，命令行程序仅能输出到标准输出流。

## Installation

```bash
deno install --allow-read --name scel2ibus mod.ts
```

## Usage

### Command Line

```bash
scel2ibus ./testfile/哲学.scel > ibusdict.txt
```

or

```bash
find . -name *.scel -exec scel2ibus {} \; > ibusdict.txt
```

### Programmatically

```typescript
import { scel2ibus, ScelParser } from "./mod.ts";

const buf = Deno.readFileSync("./testfile/物理.scel");

const parser = new ScelParser(buf.buffer);

console.log(parser.parseInfo());
// {
//   name: "物理词汇大全【官方推荐】",
//   type: "普通物理",
//   description: "官方推荐，词库来源于网友上传！",
//   example: "磁输运 倍频晶体 浅施主 薄膜沉积 栅氧化物 掺锗",
// }

console.log(parser.parsePinyinTable());
// [
//     "a",     "ai",    "an",     "ang",   "ao",    "ba",   "bai",
//     "ban",   "bang",  "bao",    "bei",   "ben",   "beng", "bi",
//     "bian",  "biao",  "bie",    "bin",   "bing",  "bo",   "bu",
//     "ca",    "cai",   "can",    "cang",  "cao",   "ce",   "cen",
//     "ceng",  "cha",   "chai",   "chan",  "chang", "chao", "che",
//     "chen",  "cheng", "chi",    "chong", "chou",  "chu",  "chua",
//     "chuai", "chuan", "chuang", "chui",  "chun",  "chuo", "ci",
//     "cong",  "cou",   "cu",     "cuan",  "cui",   "cun",  "cuo",
//     "da",    "dai",   "dan",    "dang",  "dao",   "de",   "dei",
//     "den",   "deng",  "di",     "dia",   "dian",  "diao", "die",
//     "ding",  "diu",   "dong",   "dou",   "du",    "duan", "dui",
//     "dun",   "duo",   "e",      "ei",    "en",    "eng",  "er",
//     "fa",    "fan",   "fang",   "fei",   "fen",   "feng", "fiao",
//     "fo",    "fou",   "fu",     "ga",    "gai",   "gan",  "gang",
//     "gao",   "ge",
//     ... 314 more items
// ]

for (const entry of parser) {
  console.log(entry);
}
// { word: "测不准关系", pinyin: [ "ce", "bu", "zhun", "guan", "xi" ], frequency: 2581 }
// { word: "测不准原理", pinyin: [ "ce", "bu", "zhun", "yuan", "li" ], frequency: 2421 }
// { word: "测地流", pinyin: [ "ce", "di", "liu" ], frequency: 12520 }
// { word: "测地线", pinyin: [ "ce", "di", "xian" ], frequency: 12519 }
// { word: "测地线旋进", pinyin: [ "ce", "di", "xian", "xuan", "jin" ], frequency: 12518 }
// { word: "测地坐标", pinyin: [ "ce", "di", "zuo", "biao" ], frequency: 12517 }
// { word: "测地坐标系", pinyin: [ "ce", "di", "zuo", "biao", "xi" ], frequency: 12516 }
// { word: "测定年代", pinyin: [ "ce", "ding", "nian", "dai" ], frequency: 12515 }
// { word: "测度", pinyin: [ "ce", "du" ], frequency: 1970 }
// { word: "测度卷积", pinyin: [ "ce", "du", "juan", "ji" ], frequency: 12514 }

for (const entry of scel2ibus(buf.buffer)) {
  console.log(entry);
}
// 酌谱 zhuo'pu 4032
// 着色问题 zhuo'se'wen'ti 4028
// 酌线 zhuo'xian 4031
// 酌与反酌定律 zhuo'yu'fan'zhuo'ding'lv 4030
// 酌原理 zhuo'yuan'li 4029
// 自伴扩张 zi'ban'kuo'zhang 3989
// 子半群 zi'ban'qun 4027
// 自伴算符 zi'ban'suan'fu 3988
// 自伴微分算子 zi'ban'wei'fen'suan'zi 3987
// 子波 zi'bo 3381
// 自补图 zi'bu'tu 3986
// 自场 zi'chang 2267
// 自抽运 zi'chou'yun 569
// 子除环 zi'chu'huan 4026
// 子簇 zi'cu 4025
// 子催化 zi'cui'hua 4024
// 子催化聚变 zi'cui'hua'ju'bian 4023
// 子代数 zi'dai'shu 4022

```

## Download Scel Dict
http://pinyin.sogou.com/dict/