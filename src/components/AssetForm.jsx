import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

export default function AssetForm({ onClose, initialData, onSuccess, session }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    symbol: initialData?.symbol || '',
    asset_name: initialData?.asset_name || '',
    asset_type: initialData?.asset_type || 'STOCK',
    quantity: initialData?.quantity || '',
    purchase_price: initialData?.purchase_price || '',
    current_price: initialData?.current_price || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      quantity: parseFloat(formData.quantity),
      purchase_price: parseFloat(formData.purchase_price),
      current_price: parseFloat(formData.current_price),
      user_id: session.user.id
    }

    try {
      if (initialData) {
        // Edit mode
        const { error } = await supabase
          .from('portfolio_assets')
          .update(payload)
          .eq('id', initialData.id)
        if (error) throw error
        toast.success('Activo actualizado con éxito')
      } else {
        // Create mode
        const { error } = await supabase
          .from('portfolio_assets')
          .insert([payload])
        if (error) throw error
        toast.success('Activo agregado con éxito')
      }
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Ocurrió un error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative border border-slate-200 dark:border-slate-800 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {initialData ? 'Editar Activo' : 'Añadir Nuevo Activo'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Símbolo</label>
              <input required type="text" name="symbol" value={formData.symbol} onChange={handleChange} className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 uppercase" placeholder="Ej. AAPL" disabled={!!initialData} />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Activo</label>
              <select name="asset_type" value={formData.asset_type} onChange={handleChange} className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60" disabled={!!initialData}>
                <option value="STOCK">Acción</option>
                <option value="CEDEAR">CEDEAR</option>
                <option value="ETF">ETF</option>
                <option value="BOND">Bono</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre de la Empresa / Activo</label>
            <input required type="text" name="asset_name" value={formData.asset_name} onChange={handleChange} className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Ej. Apple Inc." disabled={!!initialData} />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cantidad Poseída</label>
              <input required type="number" step="any" min="0" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Precio de Compra</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input required type="number" step="any" min="0" name="purchase_price" value={formData.purchase_price} onChange={handleChange} className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Precio Actual</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input required type="number" step="any" min="0" name="current_price" value={formData.current_price} onChange={handleChange} className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-70 transition-colors">
              {loading ? 'Guardando...' : 'Guardar Activo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
