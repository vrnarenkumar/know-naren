import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// Ported from the standalone talk-to-your-data repo's web/src/Chart.jsx —
// same shape-detection logic (scalar stat / bar / line / pie / table), just
// themed to the portfolio's CSS variables instead of a bespoke dark palette.
const SHADES = ['#34d399', '#6ee7b7', '#a7f3d0', '#059669', '#047857', '#065f46']

const axisStyle = { stroke: 'var(--color-text-dim)', fontSize: 11 }
const tooltipStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  color: 'var(--color-text-h)',
  fontSize: 12,
}

type Row = Record<string, unknown>

function pickSeries(columns: string[], rows: Row[]) {
  const label = columns[0]
  const valueCol = columns.slice(1).find((c) => rows.every((r) => typeof r[c] === 'number'))
  return { label, valueCol }
}

function scalarValue(columns: string[], rows: Row[]) {
  if (rows.length !== 1) return null
  const numeric = columns.filter((c) => typeof rows[0][c] === 'number' && !Number.isNaN(rows[0][c]))
  if (numeric.length !== 1) return null
  const valueName = numeric[0]
  const labelCol = columns.find((c) => c !== valueName)
  return { value: rows[0][valueName] as number, label: labelCol ? String(rows[0][labelCol]) : valueName }
}

function fmt(n: unknown): string {
  return typeof n === 'number' ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : String(n)
}

function DataTable({ columns, rows }: { columns: string[]; rows: Row[] }) {
  return (
    <div className="max-h-64 overflow-auto rounded-lg border border-border">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-surface-2">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-medium text-text-h">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 50).map((r, i) => (
            <tr key={i} className="border-t border-border">
              {columns.map((c) => (
                <td key={c} className="px-3 py-1.5 text-text-dim">
                  {String(r[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TalkToDataChart({
  chartType,
  columns,
  rows,
}: {
  chartType: string
  columns: string[]
  rows: Row[]
}) {
  if (!rows || rows.length === 0) return <p className="text-sm text-text-dim">(no rows returned)</p>

  const { label, valueCol } = pickSeries(columns, rows)
  const scalar = scalarValue(columns, rows)

  if (scalar && chartType !== 'table') {
    return (
      <div className="py-2">
        <div className="text-3xl font-semibold text-text-h">{fmt(scalar.value)}</div>
        {scalar.label && <div className="mt-1 text-xs text-text-dim">{scalar.label}</div>}
      </div>
    )
  }

  if (chartType === 'table' || chartType === 'none' || !valueCol || columns.length < 2) {
    return <DataTable columns={columns} rows={rows} />
  }

  const data = rows.slice(0, 40)

  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey={valueCol} nameKey={label} outerRadius={90} innerRadius={50}>
            {data.map((_, i) => (
              <Cell key={i} fill={SHADES[i % SHADES.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey={label} {...axisStyle} tickMargin={8} />
          <YAxis {...axisStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey={valueCol} stroke="#34d399" strokeWidth={2} dot={{ r: 2.5 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey={label} {...axisStyle} tickMargin={8} />
        <YAxis {...axisStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey={valueCol} fill="#34d399" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
