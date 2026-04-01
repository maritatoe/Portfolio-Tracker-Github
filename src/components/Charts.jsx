import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip, Legend } from 'recharts'

export default function Charts({ assets }) {
  if (assets.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8h8c-.5-4.25-3.75-7.5-8-8zm0 10v10c4.25-.5 7.5-3.75 8-8h-8z"/></svg>
        </div>
        <p className="text-sm">No hay datos para mostrar</p>
      </div>
    )
  }

  // Aggregate assets by type
  const typeAllocation = assets.reduce((acc, asset) => {
    const marketValue = asset.quantity * asset.current_price
    acc[asset.asset_type] = (acc[asset.asset_type] || 0) + marketValue
    return acc
  }, {})

  const pieData = Object.keys(typeAllocation).map(type => ({
    name: type,
    value: typeAllocation[type]
  }))

  const COLORS = {
    STOCK: '#4F46E5',  // Indigo
    CEDEAR: '#06B6D4', // Cyan
    ETF: '#10B981',    // Emerald
    BOND: '#F59E0B'    // Amber
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 shadow-lg rounded-lg border border-slate-100 dark:border-slate-700">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{payload[0].name}</p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Distribución de Portafolio</h3>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8b5cf6'} />
              ))}
            </Pie>
            <PieTooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
