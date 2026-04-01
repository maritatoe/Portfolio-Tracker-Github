import { DollarSign, TrendingUp, TrendingDown, Briefcase } from 'lucide-react'

export default function PortfolioSummary({ totalValue, totalInvested, totalProfitLoss, profitLossPercentage, assetCount }) {
  const isProfit = totalProfitLoss >= 0

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Valor Total */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center">
        <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-4">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Valor Total</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalValue)}</h3>
        </div>
      </div>

      {/* Inversión Total */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center">
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mr-4">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Inversión Total</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalInvested)}</h3>
        </div>
      </div>

      {/* Ganancia / Pérdida */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center">
        <div className={`p-3 rounded-lg mr-4 ${isProfit ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
          {isProfit ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Rendimiento</p>
          <div className="flex items-baseline space-x-2">
            <h3 className={`text-2xl font-bold ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isProfit ? '+' : ''}{formatCurrency(totalProfitLoss)}
            </h3>
            <span className={`text-sm font-medium ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              ({isProfit ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Cantidad de Activos */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Activos</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{assetCount}</h3>
        </div>
      </div>
    </div>
  )
}
