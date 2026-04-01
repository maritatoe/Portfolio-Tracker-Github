import { useState } from 'react'
import { Edit2, Trash2, Search, Filter } from 'lucide-react'

export default function PortfolioTable({ assets, onEdit, onDelete, loading }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando activos...</div>
  }

  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(val)
  
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'ALL' || asset.asset_type === typeFilter
    return matchesSearch && matchesType
  })

  // Exportar a CSV
  const handleExportCSV = () => {
    if (filteredAssets.length === 0) return
    const headers = ['Simbolo', 'Nombre', 'Tipo', 'Cantidad', 'Precio Compra', 'Precio Actual', 'Valor Mercado', 'Ganancia/Perdida']
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + filteredAssets.map(a => {
          const marketValue = a.quantity * a.current_price
          const profitLoss = (a.current_price - a.purchase_price) * a.quantity
          return `${a.symbol},${a.asset_name},${a.asset_type},${a.quantity},${a.purchase_price},${a.current_price},${marketValue},${profitLoss}`
      }).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "portfolio.csv")
    document.body.appendChild(link)
    link.click()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex w-full sm:w-auto space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar símbolo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white appearance-none cursor-pointer"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="STOCK">Acciones</option>
              <option value="CEDEAR">CEDEAR</option>
              <option value="ETF">ETF</option>
              <option value="BOND">Bono</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleExportCSV}
          className="text-sm px-3 py-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors"
        >
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Activo</th>
              <th className="px-6 py-4 text-center">Tipo</th>
              <th className="px-6 py-4 text-right">Cantidad</th>
              <th className="px-6 py-4 text-right">Precio Compra</th>
              <th className="px-6 py-4 text-right">Precio Actual</th>
              <th className="px-6 py-4 text-right">Total Mercado</th>
              <th className="px-6 py-4 text-right">Rendimiento</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                  No se encontraron activos. Añade tu primera inversión.
                </td>
              </tr>
            ) : (
              filteredAssets.map(asset => {
                const marketValue = asset.quantity * asset.current_price
                const profitLoss = (asset.current_price - asset.purchase_price) * asset.quantity
                const isProfit = profitLoss >= 0
                
                return (
                  <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white uppercase">{asset.symbol}</div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">{asset.asset_name}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700 font-medium text-slate-600 dark:text-slate-300">
                        {asset.asset_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{asset.quantity}</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(asset.purchase_price)}</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(asset.current_price)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">{formatCurrency(marketValue)}</td>
                    <td className={`px-6 py-4 text-right font-medium ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isProfit ? '+' : ''}{formatCurrency(profitLoss)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                        <button onClick={() => onEdit(asset)} className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(asset.id)} className="text-slate-400 hover:text-rose-600 transition-colors p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
