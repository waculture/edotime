export class Edotime {
    koku: string;           // 六つ、五つ、四つ、九つ、八つ、七つ、六つ・・・
    daytime: boolean;       // true: 日中、false: 夜間
    axis: boolean;          // true: 基準線（軸）、false: 基準線（軸）でない
    angle: number;          // 0～360、0時を0度とした場合の右回りの角度
    eto: string;            // 卯・辰・巳・午・未・申・酉・戌・亥・子・丑・寅
    presentTime: string;    // 現代の現在時刻　hh:mm:ss
}
