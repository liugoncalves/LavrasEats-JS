"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, ChevronRight, Trophy } from "lucide-react"
import type { Restaurante } from "../types"
import { restauranteService } from "../services/api"

const Ranking: React.FC = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante  []>([])
  const [loading, setLoading] = useState(true)
  const [ordem, setOrdem] = useState<'melhores' | 'piores'>('melhores')

  useEffect(() => {
    carregarRanking()
  }, [ordem])

  const carregarRanking = async () => {
    setLoading(true)
    try {
      const response = await restauranteService.ranking(ordem)
      setRestaurantes(response.data)
    } catch (error: any) {
      console.error("Erro ao carregar ranking:", error)
      // Fallback para lista normal se ranking não funcionar
      try {
        const fallbackResponse = await restauranteService.listar()
        const restaurantesOrdenados = fallbackResponse.data.sort(
          (a: Restaurante, b: Restaurante) => ordem === 'piores'
            ? (a.nota_media || 0) - (b.nota_media || 0)
            : (b.nota_media || 0) - (a.nota_media || 0)
        )
        setRestaurantes(restaurantesOrdenados)
      } catch (fallbackError: any) {
        console.error("Erro no fallback:", fallbackError)
        setRestaurantes([])
      }
    } finally {
      setLoading(false)
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500 text-yellow-900"
      case 2:
        return "bg-gray-400 text-gray-900"
      case 3:
        return "bg-amber-600 text-amber-900"
      default:
        return "bg-gray-600 text-white"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-white text-xl">Carregando ranking...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link to="/home" className="hover:text-white">
            Início
          </Link>
          <span>›</span>
          <span>Ranking de Restaurantes</span>
        </div>
      </div>

      {/* Título e seletor de ordem */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Ranking de Restaurantes</h1>
          <div className="flex gap-2">
            <button
              className={`btn-white-sm px-4 py-2 rounded-lg font-semibold transition-colors ${ordem === 'melhores' ? 'bg-white text-gray-900' : 'bg-[#23232a] text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setOrdem('melhores')}
            >
              Melhores
            </button>
            <button
              className={`btn-white-sm px-4 py-2 rounded-lg font-semibold transition-colors ${ordem === 'piores' ? 'bg-white text-gray-900' : 'bg-[#23232a] text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setOrdem('piores')}
            >
              Piores
            </button>
          </div>
        </div>

        {/* Lista de Restaurantes */}
        <div className="space-y-8">
          {restaurantes.map((restaurante, index) => (
            <div key={restaurante.id} className="card-dark flex flex-col md:flex-row gap-6 items-start md:items-stretch">
              {/* Poster */}
              <div className="w-full md:w-40 h-60 bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                {restaurante.poster ? (
                  <img
                    src={`http://localhost:8000/imgs/posters/${encodeURIComponent(restaurante.poster)}`}
                    alt={restaurante.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${restaurante.poster ? 'hidden' : ''}`}>
                  <div className="text-4xl">🍽️</div>
                </div>
              </div>

              {/* Informações */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                    <h2 className="text-2xl font-bold text-white mb-1 md:mb-0">{restaurante.nome}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getPositionColor(index + 1)}`}>{index + 1}</span>
                      {index < 3 && (
                        <Trophy className={`w-6 h-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-2">
                    <span><span className="font-semibold">Categoria:</span> {restaurante.categoria}</span>
                    <span><span className="font-semibold">Endereço:</span> {restaurante.endereco}</span>
                    <span><span className="font-semibold">Telefone:</span> {restaurante.telefone}</span>
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold text-white">Descrição</span>
                    <p className="text-gray-300 leading-relaxed line-clamp-3 mt-1">{restaurante.descricao}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="circle-green">
                      <span className="text-lg font-bold">{restaurante.nota_media ? Math.round(restaurante.nota_media * 10) : 0}%</span>
                    </div>
                    <span className="text-white font-medium">
                      Avaliações dos usuários <span className="text-gray-400">({restaurante.numero_avaliacoes ?? 0})</span>
                    </span>
                  </div>
                  <Link
                    to={`/restaurante/${restaurante.id}`}
                    className="btn-white"
                  >
                    <span>Ver avaliações</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {restaurantes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Nenhum restaurante encontrado</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Ranking
