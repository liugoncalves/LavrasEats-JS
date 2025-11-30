"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Search, Calendar } from "lucide-react"
import RestauranteCard from "../components/RestauranteCard"
import type { Restaurante } from "../types"
import { restauranteService } from "../services/api"
import { categorias } from "../utils/categorias"

const Busca: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  const query = searchParams.get("q") || ""
  const categoria = searchParams.get("categoria") || ""

  useEffect(() => {
    if (query || categoria) {
      buscarRestaurantes()
    } else {
      // Se não há query nem categoria, mostra todos os restaurantes
      carregarTodosRestaurantes()
    }
  }, [query, categoria])

  const carregarTodosRestaurantes = async () => {
    try {
      setLoading(true)
      setErro("")
      const response = await restauranteService.listar()
      setRestaurantes(response.data)
    } catch (error: any) {
      console.error("Erro ao carregar restaurantes:", error)
      setErro("Erro ao carregar restaurantes. Tente novamente.")
      setRestaurantes([])
    } finally {
      setLoading(false)
    }
  }

  // Função para retornar o label correto com acento
  const obterLabelCategoria = (valorCategoria: string) => {
    const categoriaNormalizada = valorCategoria.toLowerCase()
    const categoriaEncontrada = categorias.find(
      (c) => c.valor.toLowerCase() === categoriaNormalizada
    )
    return categoriaEncontrada ? categoriaEncontrada.label : valorCategoria
  }

  const buscarRestaurantes = async () => {
    try {
      setLoading(true)
      setErro("")

      // Se tem filtro de categoria, usa a rota de filtro do backend
      if (categoria) {
        const response = await restauranteService.filtrar(categoria, "desc")
        let restaurantesFiltrados = response.data

        // Se também tem query de texto, filtra localmente os resultados da categoria
        if (query) {
          restaurantesFiltrados = restaurantesFiltrados.filter((restaurante: Restaurante) => {
            const searchTerm = query.toLowerCase()
            return (
              restaurante.nome.toLowerCase().includes(searchTerm) ||
              restaurante.descricao.toLowerCase().includes(searchTerm) ||
              restaurante.categoria.toLowerCase().includes(searchTerm)
            )
          })
        }

        setRestaurantes(restaurantesFiltrados)
      } else {
        // Busca apenas por texto (comportamento original)
        const response = await restauranteService.listar()
        const todosRestaurantes = response.data

        const restaurantesFiltrados = todosRestaurantes.filter((restaurante: Restaurante) => {
          const searchTerm = query.toLowerCase()
          return (
            restaurante.nome.toLowerCase().includes(searchTerm) ||
            restaurante.descricao.toLowerCase().includes(searchTerm) ||
            restaurante.categoria.toLowerCase().includes(searchTerm)
          )
        })

        setRestaurantes(restaurantesFiltrados)
      }
    } catch (error: any) {
      console.error("Erro na busca:", error)
      setErro("Erro ao buscar restaurantes. Tente novamente.")
      setRestaurantes([])
    } finally {
      setLoading(false)
    }
  }

  const getTituloBusca = () => {
    if (categoria && query) {
      return `Resultados para "${query}" em ${obterLabelCategoria(categoria)}`
    } else if (categoria) {
      return `Restaurantes de ${obterLabelCategoria(categoria)}`
    } else if (query) {
      return `Resultados para "${query}"`
    }
    return "Todos os Restaurantes"
  }

  const getSubtituloBusca = () => {
    if (categoria && query) {
      return `Filtrados por categoria e ordenados por nota`
    } else if (categoria) {
      return `Ordenados por nota decrescente`
    } else if (query) {
      return `Busca por texto`
    }
    return `Todos os restaurantes cadastrados`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-white text-xl">Buscando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link to="/home" className="hover:text-white">Início</Link>
          <span>›</span>
          <span>Busca</span>
        </div>
      </div>

      {/* Resultados da Busca */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{getTituloBusca()}</h1>
          <div className="flex items-center space-x-2 text-gray-400">
            <Search className="w-5 h-5" />
            {query && <span>"{query}"</span>}
            {categoria && query && <span>•</span>}
            {categoria && <span>Categoria: {obterLabelCategoria(categoria)}</span>}
            <span>•</span>
            <span>{restaurantes.length} {restaurantes.length === 1 ? 'restaurante encontrado' : 'restaurantes encontrados'}</span>
            {getSubtituloBusca() && (
              <>
                <span>•</span>
                <span>{getSubtituloBusca()}</span>
              </>
            )}
          </div>
        </div>

        {erro && (
          <div className="bg-red-900 border border-red-600 p-4 rounded-lg mb-6">
            <span className="text-red-400">{erro}</span>
          </div>
        )}

        {restaurantes.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {restaurantes.map((restaurante) => (
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
                    <h2 className="text-2xl font-bold text-white mb-1">{restaurante.nome}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-2">
                      <span><span className="font-semibold">Descrição:</span> {restaurante.descricao}</span>
                      <span><span className="font-semibold">Categoria:</span> {restaurante.categoria}</span>
                      <span><span className="font-semibold">Endereço:</span> {restaurante.endereco}</span>
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold text-white">Sinopse</span>
                      <p className="text-gray-300 leading-relaxed line-clamp-3 mt-1">{restaurante.descricao}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="circle-green">
                        <span className="text-lg font-bold">{restaurante.nota_media ? Math.round(restaurante.nota_media * 10) : 0}%</span>
                      </div>
                      <span className="text-white font-medium">Avaliação dos usuários</span>
                    </div>
                    <Link
                      to={`/restaurante/${restaurante.id}`}
                      className="btn-white"
                    >
                      <span>Ver avaliações</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {categoria && query
                ? `Nenhum restaurante encontrado para "${query}" na categoria ${categoria}`
                : categoria
                  ? `Nenhum restaurante encontrado na categoria ${categoria}`
                  : `Nenhum restaurante encontrado para "${query}"`
              }
            </div>
            <div className="text-gray-500 text-sm">
              Tente buscar por outro termo ou verifique a ortografia
            </div>
            <Link
              to="/home"
              className="inline-block mt-6 btn-white text-base"
            >
              Voltar ao Início
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Busca 