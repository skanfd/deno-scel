// Ported from https://github.com/iftech-engineering/scel-parser

/**
 * Internal Scel Reader Class
 */
class ViewReader {
  view: DataView;
  pos = 0;
  decoder = new TextDecoder("utf-16le");

  constructor(buf: ArrayBuffer) {
    this.view = new DataView(buf);
  }

  /**
   * int16le仅占用2字节，但是有时要丢弃一些后面的字节
   * @param length 
   */
  nextInt16LE(length = 2): number {
    const num = this.view.getInt16(this.pos, true);
    this.pos += length;
    return num;
  }

  nextString(length: number): string {
    const buf = this.view.buffer.slice(this.pos, this.pos + length);
    const str = this.decoder.decode(buf);
    this.pos += length;
    return str;
  }

  hasNext(): boolean {
    return this.pos < this.view.byteLength;
  }
}

/**
 * Scel Parser Class
 * @function parseInfo 解析词库信息
 * @function parsePinyinTable 解析拼音表
 * @class ScelParser 类本身是一个迭代器，依次返回
 *          { word: string; pinyin: string[]; frequency: number }
 */
export class ScelParser {
  buf: ArrayBuffer;
  pinyinTable: string[];
  decoder = new TextDecoder("utf-16le");

  constructor(buf: ArrayBuffer) {
    this.buf = buf;
    this.pinyinTable = this.parsePinyinTable();
  }

  extract(from: number, to: number): string {
    return this.decoder.decode(this.buf.slice(from, to)).split("\x00", 1)[0];
  }

  parseInfo() {
    return {
      name: this.extract(0x130, 0x338),
      type: this.extract(0x338, 0x554),
      description: this.extract(0x540, 0xd40),
      example: this.extract(0xd40, 0x1540).split("\r").slice(0, -1).join(""),
    };
  }

  parsePinyinTable(): string[] {
    const reader = new ViewReader(this.buf.slice(0x1540, 0x2628));
    const pinyinTable: string[] = [];
    while (reader.hasNext()) {
      const index = reader.nextInt16LE();
      const len = reader.nextInt16LE();
      pinyinTable[index] = reader.nextString(len);
    }
    return pinyinTable;
  }

  *[Symbol.iterator]() {
    const reader = new ViewReader(this.buf.slice(0x2628));
    while (reader.hasNext()) {
      const homophoneNum = reader.nextInt16LE();
      const pinyinLen = reader.nextInt16LE();
      const pinyin: string[] = [];
      for (let i = 0; i < pinyinLen / 2; i++) {
        pinyin.push(this.pinyinTable[reader.nextInt16LE()]);
      }
      for (let i = 0; i < homophoneNum; i++) {
        const wordBytes = reader.nextInt16LE();
        const word = reader.nextString(wordBytes);
        const extBytes = reader.nextInt16LE();
        const frequency = reader.nextInt16LE(extBytes);
        yield { word, pinyin, frequency };
      }
    }
  }
}

/**
 * 迭代器每次返回一条ibus词条
 * 例如： 阴阳五行说 yin'yang'wu'xing'shuo 231
 * @param scelbuffer 
 */
export function* scel2ibus(scelbuffer: ArrayBuffer) {
  const parser = new ScelParser(scelbuffer);
  for (const { word, pinyin, frequency } of parser) {
    yield `${word} ${pinyin.join("'")} ${frequency}`;
  }
}

if (import.meta.main) {
  if (Deno.args.length === 0) {
    console.error("Error. For example: scel2ibus <scel>");
    Deno.exit(-1);
  }

  const buf = Deno.readFileSync(Deno.args[0]);

  let count = 0;
  for (const entry of scel2ibus(buf.buffer)) {
    console.log(entry);
    count++;
  }

  //在错误流中提示当前文件解析出的条目数量
  console.error(`${Deno.args[0]}: ${count}`);
}
