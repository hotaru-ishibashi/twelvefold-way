
export type Map12Result = {
  no: number
  value: bigint
}

function modPow(a: bigint, n: bigint, mod: bigint): bigint {
  let result = 1n
  a %= mod

  while (n > 0n) {
    if (n & 1n) {
      result = result * a % mod
    }
    a = a * a % mod
    n >>= 1n
  }

  return result
}

function modInverse(a: bigint, mod: bigint): bigint {
  return modPow(a, mod - 2n, mod)
}

function factorial(n: bigint, mod: bigint): bigint {
  let result = 1n

  for (let i = 2n; i <= n; i++) {
    result = result * i % mod
  }

  return result
}

function combination(n: bigint, k: bigint, mod: bigint): bigint {
  if (k < 0n || k > n) {
    return 0n
  }

  k = k < n - k ? k : n - k

  let result = 1n

  for (let i = 1n; i <= k; i++) {
    result = result * (n - k + i) % mod
    result = result * modInverse(i, mod) % mod
  }

  return result
}

/*
 * 第2種スターリング数 S(n, k)
 *
 * 区別できる n 個の玉を
 * 区別できない k 個の空でない箱に分ける方法
 */
function stirlingSecond(
  n: bigint,
  k: bigint,
  mod: bigint,
): bigint {
  if (n === 0n && k === 0n) {
    return 1n
  }

  if (k <= 0n || k > n) {
    return 0n
  }

  const nn = Number(n)
  const kk = Number(k)

  const dp = Array.from(
    { length: kk + 1 },
    () => Array<bigint>(nn + 1).fill(0n),
  )

  dp[0][0] = 1n

  for (let j = 1; j <= kk; j++) {
    for (let i = 1; i <= nn; i++) {
      dp[j][i] =
        (
          dp[j - 1][i - 1] +
          BigInt(j) * dp[j][i - 1]
        ) % mod
    }
  }

  return dp[kk][nn]
}

/*
 * n をちょうど k 個の正整数の和にする方法
 *
 * = 区別しない玉 × 区別しない箱 × 全射
 */
function integerPartitionExact(
  n: bigint,
  k: bigint,
  mod: bigint,
): bigint {
  if (n === 0n && k === 0n) {
    return 1n
  }

  if (n <= 0n || k <= 0n || k > n) {
    return 0n
  }

  const nn = Number(n)
  const kk = Number(k)

  // 各箱を1個以上にする
  // xi >= 1
  // yi = xi - 1 とすると
  // y1 + ... + yk = n-k
  //
  // ただし箱を区別しないので整数分割になる。
  const dp = Array<bigint>(nn + 1).fill(0n)
  dp[0] = 1n

  for (let part = 1; part <= nn; part++) {
    for (let sum = part; sum <= nn; sum++) {
      dp[sum] =
        (dp[sum] + dp[sum - part]) % mod
    }
  }

  /*
   * dp[n] は「項数制限なし」の分割数なので、
   * k 個という条件を別途管理する必要がある。
   *
   * dp[count][sum] で計算する。
   */
  const countDp = Array.from(
    { length: kk + 1 },
    () => Array<bigint>(nn + 1).fill(0n),
  )

  countDp[0][0] = 1n

  for (let part = 1; part <= nn; part++) {
    for (let count = 1; count <= kk; count++) {
      for (let sum = part; sum <= nn; sum++) {
        countDp[count][sum] =
          (
            countDp[count][sum] +
            countDp[count - 1][sum - part]
          ) % mod
      }
    }
  }

  return countDp[kk][nn]
}

export function calculateMap12(
  nInput: bigint | number | string,
  kInput: bigint | number | string,
  modInput: bigint | number | string = 998244353n,
): Map12Result[] {
  const n = BigInt(nInput)
  const k = BigInt(kInput)
  const mod = BigInt(modInput)

  if (n < 0n || k < 0n) {
    throw new Error('n と k は 0 以上である必要があります')
  }

  if (mod <= 0n) {
    throw new Error('mod は 1 以上である必要があります')
  }

  /*
   * 1
   * 区別する玉 × 区別する箱 × 制限なし
   *
   * k^n
   */
  const case1 =
    modPow(k, n, mod)

  /*
   * 2
   * 区別する玉 × 区別する箱 × 1個以下
   *
   * k P n
   */
  let case2 = 0n

  if (n <= k) {
    case2 = 1n

    for (let i = 0n; i < n; i++) {
      case2 = case2 * (k - i) % mod
    }
  }

  /*
   * 3
   * 区別する玉 × 区別する箱 × 1個以上
   *
   * k! S(n,k)
   */
  let case3 = 0n

  if (k <= n) {
    case3 =
      factorial(k, mod) *
      stirlingSecond(n, k, mod) % mod
  }

  /*
   * 4
   * 区別しない玉 × 区別する箱 × 制限なし
   *
   * C(n+k-1, k-1)
   */
  const case4 =
    k === 0n
      ? (n === 0n ? 1n : 0n)
      : combination(n + k - 1n, k - 1n, mod)

  /*
   * 5
   * 区別しない玉 × 区別する箱 × 1個以下
   *
   * n <= k のとき C(k,n)
   */
  const case5 =
    combination(k, n, mod)

  /*
   * 6
   * 区別しない玉 × 区別する箱 × 1個以上
   *
   * C(n-1,k-1)
   */
  let case6 = 0n

  if (n === 0n && k === 0n) {
    case6 = 1n
  } else if (n >= 1n && k >= 1n) {
    case6 =
      combination(n - 1n, k - 1n, mod)
  }

  /*
   * 7
   * 区別する玉 × 区別しない箱 × 制限なし
   *
   * Σ S(n,i), i=0..k
   */
  let case7 = 0n

  const maxI = Number(n < k ? n : k)

  for (let i = 0; i <= maxI; i++) {
    case7 =
      (case7 +
        stirlingSecond(n, BigInt(i), mod)) % mod
  }

  /*
   * 8
   * 区別する玉 × 区別しない箱 × 1個以下
   *
   * n <= k のとき 1
   */
  const case8 =
    n <= k ? 1n % mod : 0n

  /*
   * 9
   * 区別する玉 × 区別しない箱 × 1個以上
   *
   * S(n,k)
   */
  const case9 =
    stirlingSecond(n, k, mod)

  /*
   * 10
   * 区別しない玉 × 区別しない箱 × 制限なし
   *
   * n の整数分割のうち、
   * 高々 k 個の部分を持つもの
   */
  const nn = Number(n)
  const kk = Number(k)

    let case10 = 0n

    if (n === 0n) {
    case10 = 1n % mod
    } else {
    const maxCount = Math.min(nn, kk)

    const dp = Array.from(
        { length: maxCount + 1 },
        () => Array<bigint>(nn + 1).fill(0n),
    )

    dp[0][0] = 1n

    for (let part = 1; part <= nn; part++) {
        for (let count = 1; count <= maxCount; count++) {
        for (let sum = part; sum <= nn; sum++) {
            dp[count][sum] =
            (
                dp[count][sum] +
                dp[count - 1][sum - part]
            ) % mod
        }
        }
    }

    for (let count = 0; count <= maxCount; count++) {
        case10 =
        (case10 + dp[count][nn]) % mod
    }
    }

  /*
   * 11
   * 区別しない玉 × 区別しない箱 × 1個以下
   *
   * n <= k なら 1
   */
  const case11 =
    n <= k ? 1n % mod : 0n

  /*
   * 12
   * 区別しない玉 × 区別しない箱 × 1個以上
   *
   * n をちょうど k 個の正整数に分割
   */
  const case12 =
    integerPartitionExact(n, k, mod)

  return [
    { no: 1, value: case1 },
    { no: 2, value: case2 },
    { no: 3, value: case3 },
    { no: 4, value: case4 },
    { no: 5, value: case5 },
    { no: 6, value: case6 },
    { no: 7, value: case7 },
    { no: 8, value: case8 },
    { no: 9, value: case9 },
    { no: 10, value: case10 },
    { no: 11, value: case11 },
    { no: 12, value: case12 },
  ]
}
