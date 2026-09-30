
import { useState } from 'react'
import { calculateMap12, type Map12Result } from './map12'

const cases = [
  ['区別する', '区別する', '制限なし', '写像全体', 'kⁿ'],
  ['区別する', '区別する', '1個以内', '単射', 'kPn'],
  ['区別する', '区別する', '1個以上', '全射', 'k! S(n,k)'],
  ['区別しない', '区別する', '制限なし', '重複組合せ', 'C(n+k-1,k-1)'],
  ['区別しない', '区別する', '1個以内', '組合せ', 'C(k,n)'],
  ['区別しない', '区別する', '1個以上', '正の整数解', 'C(n-1,k-1)'],
  ['区別する', '区別しない', '制限なし', 'ベル数', 'Σ S(n,i)'],
  ['区別する', '区別しない', '1個以内', '1通り', '1'],
  ['区別する', '区別しない', '1個以上', '第2種スターリング数', 'S(n,k)'],
  ['区別しない', '区別しない', '制限なし', '分割数', 'Σ p(n,i)'],
  ['区別しない', '区別しない', '1個以内', '1通り', '1'],
  ['区別しない', '区別しない', '1個以上', '分割数', 'p(n,k)'],
] as const

function App() {
  const [n, setN] = useState('')
  const [k, setK] = useState('')
  const [mod, setMod] = useState('998244353')
  const [results, setResults] = useState<Map12Result[]>([])

  const handleCalculate = () => {
    if (!n || !k || !mod) {
      return
    }

    try {
      setResults(calculateMap12(n, k, mod))
    } catch {
      setResults([])
    }
  }

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: '40px auto',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          marginBottom: 32,
          gap: 32,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'end',
          }}
        >
          <label>
            <div>n</div>
            <input
              type="number"
              min="0"
              value={n}
              onChange={(e) => setN(e.target.value)}
            />
          </label>

          <label>
            <div>k</div>
            <input
              type="number"
              min="0"
              value={k}
              onChange={(e) => setK(e.target.value)}
            />
          </label>

          <button onClick={handleCalculate}>
            計算
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'end',
          }}
        >
          <label>
            <div>mod</div>
            <input
              type="number"
              min="1"
              value={mod}
              onChange={(e) => setMod(e.target.value)}
            />
          </label>

          <button onClick={() => setMod('998244353')}>
            998244353
          </button>

          <button onClick={() => setMod('1000000007')}>
            10^9+7
          </button>
        </div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            <th style={cellStyle}>玉</th>
            <th style={cellStyle}>箱</th>
            <th style={cellStyle}>制限</th>
            <th style={cellStyle}>名称</th>
            <th style={cellStyle}>計算式</th>
            <th style={cellStyle}>値</th>
          </tr>
        </thead>

        <tbody>
          {cases.map((item, index) => {
            const result = results[index]

            return (
              <tr key={index}>
                {index % 3 === 0 && (
                  <td
                    style={cellStyle}
                    rowSpan={3}
                  >
                    {item[0]}
                  </td>
                )}

                {index % 3 === 0 && (
                  <td
                    style={cellStyle}
                    rowSpan={3}
                  >
                    {item[1]}
                  </td>
                )}

                <td style={cellStyle}>{item[2]}</td>
                <td style={cellStyle}>{item[3]}</td>
                <td style={cellStyle}>{item[4]}</td>
                <td style={cellStyle}>
                  {result ? result.value.toString() : '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

const cellStyle = {
  border: '1px solid #ccc',
  padding: '8px 12px',
  textAlign: 'left' as const,
}

export default App
