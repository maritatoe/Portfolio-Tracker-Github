import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'

// Components
import PortfolioSummary from '../components/PortfolioSummary'
import PortfolioTable from '../components/PortfolioTable'
import AssetForm from '../components/AssetForm'
import Charts from '../components/Charts'

export default function Dashboard({ session }) {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)

  const fetchAssets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAssets(data || [])
    } catch (error) {
      toast.error('Error al cargar activos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const handleOpenModal = (asset = null) => {
    setEditingAsset(asset)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setEditingAsset(null)
    setIsModalOpen(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este activo?')) return

    try {
      const { error } = await supabase.from('portfolio_assets').delete().eq('id', id)
      if (error) throw error
      toast.success('Activo eliminado')
      setAssets(assets.filter(a => a.id !== id))
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  // Calculate global summary values
  const totalValue = assets.reduce((acc, curr) => acc + (curr.quantity * curr.current_price), 0)
  const totalInvested = assets.reduce((acc, curr) => acc + (curr.quantity * curr.purchase_price), 0)
  const totalProfitLoss = totalValue - totalInvested
  const profitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resumen Global</h1>
          <p className="text-slate-500 dark:text-slate-400">Analiza el rendimiento de tu cartera</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-1" />
          Añadir Activo
        </button>
      </div>

      <PortfolioSummary 
        totalValue={totalValue} 
        totalInvested={totalInvested} 
        totalProfitLoss={totalProfitLoss}
        profitLossPercentage={profitLossPercentage}
        assetCount={assets.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <PortfolioTable 
            assets={assets} 
            onEdit={handleOpenModal} 
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <Charts assets={assets} />
        </div>
      </div>

      {isModalOpen && (
        <AssetForm 
          onClose={handleCloseModal}
          initialData={editingAsset}
          onSuccess={fetchAssets}
          session={session}
        />
      )}
    </div>
  )
}
