import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Paintbrush, 
  ArrowLeft, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  History, 
  Save, 
  User, 
  LogOut,
  Edit3,
  Check,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const StockManagement = ({ userEmail, onLogout }) => {
  const navigate = useNavigate()
  const [materials, setMaterials] = useState([])
  const [movements, setMovements] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [isMovementsOpen, setIsMovementsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    fetchMaterials()
    fetchMovements()
  }, [])

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials')
      const data = await response.json()
      setMaterials(data)
    } catch (error) {
      console.error('Erro ao carregar materiais:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMovements = async () => {
    try {
      const response = await fetch('/api/movements')
      const data = await response.json()
      setMovements(data)
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error)
    }
  }

  const handleEdit = (material) => {
    setEditingId(material.id)
    setEditValue(material.stock.toString())
  }

  const handleSave = async (materialId) => {
    try {
      const newStock = parseInt(editValue)
      if (isNaN(newStock) || newStock < 0) {
        alert('Por favor, insira um valor válido')
        return
      }

      const response = await fetch(`/api/materials/${materialId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_quantity: newStock,
          user_email: userEmail
        }),
      })

      if (response.ok) {
        await fetchMaterials()
        await fetchMovements()
        setEditingId(null)
        setEditValue('')
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao atualizar estoque')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao conectar com o servidor')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue('')
  }

  const generatePDFReport = async () => {
    setIsGeneratingPDF(true)
    try {
      const response = await fetch('/api/report/pdf', {
        method: 'GET',
      })

      if (response.ok) {
        // Criar um blob do PDF e fazer download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `estoque_pinceis_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao gerar relatório')
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao conectar com o servidor')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getMovementTypeLabel = (type) => {
    const types = {
      'usage': 'Uso',
      'restock': 'Reabastecimento',
      'adjustment': 'Ajuste'
    }
    return types[type] || type
  }

  const getMovementTypeColor = (type) => {
    const colors = {
      'usage': 'destructive',
      'restock': 'default',
      'adjustment': 'secondary'
    }
    return colors[type] || 'default'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src="/chropi-icon.png" alt="CHROPI Logo" className="w-6 h-6" />
                <h1 className="text-xl font-bold text-gray-900">CHROPI - Gestão de Estoque</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={generatePDFReport}
                disabled={isGeneratingPDF}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    PLANILHA
                  </>
                )}
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{userEmail}</span>
              </div>
              
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stock Management Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Save className="w-5 h-5" />
              <span>Controle de Estoque</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Item</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Apresentação</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Estoque</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material, index) => (
                    <tr key={material.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">#{index + 1}</span>
                          <span className="font-medium">{material.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{material.description}</td>
                      <td className="py-3 px-4 text-gray-600">{material.presentation}</td>
                      <td className="py-3 px-4 text-center">
                        {editingId === material.id ? (
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 text-center mx-auto"
                            min="0"
                          />
                        ) : (
                          <span className="font-bold text-lg">{material.stock}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {editingId === material.id ? (
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleSave(material.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(material)}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Movement History */}
        <Card>
          <Collapsible open={isMovementsOpen} onOpenChange={setIsMovementsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Histórico de Movimentações</span>
                  </div>
                  {isMovementsOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {movements.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma movimentação registrada</p>
                  ) : (
                    movements.map((movement) => (
                      <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant={getMovementTypeColor(movement.type)}>
                            {getMovementTypeLabel(movement.type)}
                          </Badge>
                          <span className="font-medium">{movement.materialName}</span>
                          <span className="text-sm text-gray-600">
                            Qtd: {movement.quantity} | {movement.previousStock} → {movement.newStock}
                          </span>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{movement.userEmail}</div>
                          <div>{formatDate(movement.timestamp)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  )
}

export default StockManagement

