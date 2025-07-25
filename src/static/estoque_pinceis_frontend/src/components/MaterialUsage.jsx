import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Paintbrush, Plus, Minus, Package, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MaterialUsage = ({ userEmail, onLogout }) => {
  const navigate = useNavigate()
  const [materials, setMaterials] = useState([
    { id: 1, name: 'Pincel Chato Nº 2', stock: 15, description: 'Pincel chato para detalhes' },
    { id: 2, name: 'Pincel Chato Nº 4', stock: 12, description: 'Pincel chato médio' },
    { id: 3, name: 'Pincel Chato Nº 6', stock: 8, description: 'Pincel chato grande' },
    { id: 4, name: 'Pincel Chato Nº 8', stock: 6, description: 'Pincel chato extra grande' },
    { id: 5, name: 'Pincel Redondo Nº 2', stock: 20, description: 'Pincel redondo pequeno' },
    { id: 6, name: 'Pincel Redondo Nº 4', stock: 18, description: 'Pincel redondo médio' },
    { id: 7, name: 'Pincel Redondo Nº 6', stock: 14, description: 'Pincel redondo grande' },
    { id: 8, name: 'Pincel Redondo Nº 8', stock: 10, description: 'Pincel redondo extra grande' },
    { id: 9, name: 'Pincel Angular Nº 2', stock: 7, description: 'Pincel angular pequeno' },
    { id: 10, name: 'Pincel Angular Nº 4', stock: 5, description: 'Pincel angular médio' },
    { id: 11, name: 'Pincel Leque Pequeno', stock: 4, description: 'Pincel leque para texturas' },
    { id: 12, name: 'Pincel Leque Médio', stock: 3, description: 'Pincel leque médio' },
    { id: 13, name: 'Pincel Detalhes Nº 0', stock: 25, description: 'Pincel para detalhes finos' },
    { id: 14, name: 'Pincel Detalhes Nº 1', stock: 22, description: 'Pincel para detalhes' },
    { id: 15, name: 'Pincel Esfumado', stock: 9, description: 'Pincel para esfumar' }
  ])

  const [usageCount, setUsageCount] = useState({})

  const handleUsageChange = (materialId, change) => {
    setUsageCount(prev => {
      const currentUsage = prev[materialId] || 0
      const newUsage = Math.max(0, currentUsage + change)
      
      // Não permitir uso maior que o estoque disponível
      const material = materials.find(m => m.id === materialId)
      if (newUsage > material.stock) {
        return prev
      }
      
      return {
        ...prev,
        [materialId]: newUsage
      }
    })
  }

  const confirmUsage = (materialId) => {
    const usage = usageCount[materialId] || 0
    if (usage > 0) {
      setMaterials(prev => 
        prev.map(material => 
          material.id === materialId 
            ? { ...material, stock: material.stock - usage }
            : material
        )
      )
      
      setUsageCount(prev => ({
        ...prev,
        [materialId]: 0
      }))

      // Aqui seria feita a chamada para a API para registrar o uso
      console.log(`Registrando uso de ${usage} unidades do material ${materialId} por ${userEmail}`)
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'bg-red-500', text: 'Sem estoque' }
    if (stock <= 5) return { color: 'bg-yellow-500', text: 'Estoque baixo' }
    return { color: 'bg-green-500', text: 'Disponível' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Paintbrush className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Controle de Uso</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/stock')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>ESTOQUE</span>
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{userEmail}</span>
              </div>
              
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => {
            const currentUsage = usageCount[material.id] || 0
            const stockStatus = getStockStatus(material.stock)
            
            return (
              <Card key={material.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {material.name}
                    </CardTitle>
                    <Badge 
                      className={`${stockStatus.color} text-white text-xs`}
                    >
                      {stockStatus.text}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{material.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Estoque atual */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Estoque atual</p>
                    <p className="text-2xl font-bold text-gray-900">{material.stock}</p>
                  </div>
                  
                  {/* Controles de uso */}
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      onClick={() => handleUsageChange(material.id, -1)}
                      disabled={currentUsage === 0}
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <div className="w-16 h-10 border-2 border-gray-200 rounded-md flex items-center justify-center bg-white">
                      <span className="text-lg font-semibold">{currentUsage}</span>
                    </div>
                    
                    <Button
                      onClick={() => handleUsageChange(material.id, 1)}
                      disabled={currentUsage >= material.stock}
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Botão de confirmação */}
                  {currentUsage > 0 && (
                    <Button
                      onClick={() => confirmUsage(material.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      Confirmar uso de {currentUsage} {currentUsage === 1 ? 'unidade' : 'unidades'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MaterialUsage

