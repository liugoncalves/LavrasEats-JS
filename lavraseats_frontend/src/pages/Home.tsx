"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import RestauranteCard from "../components/RestauranteCard"
import type { Restaurante } from "../types"
import { restauranteService } from "../services/api"
import { categorias } from "../utils/categorias"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([])
  const [restauranteDestaque, setRestauranteDestaque] = useState<Restaurante | null>(null)
  const [loading, setLoading] = useState(true)
  const [paginaAtual, setPaginaAtual] = useState(0)
  const restaurantesPorPagina = 6
  const navigate = useNavigate();

  useEffect(() => {
    carregarRestaurantes()
  }, [])

  const carregarRestaurantes = async () => {
    try {
      const response = await restauranteService.listar()
      const restaurantesData = response.data

      setRestaurantes(restaurantesData)

      // Selecionar restaurante em destaque (sempre o com maior nota média)
      if (restaurantesData.length > 0) {
        const restaurantesComAvaliacoes = restaurantesData.filter((restaurante: Restaurante) =>
          (restaurante.nota_media || 0) > 0 && (restaurante.numero_avaliacoes || 0) > 0
        )

        if (restaurantesComAvaliacoes.length > 0) {
          const destaque = restaurantesComAvaliacoes.reduce((prev: Restaurante, current: Restaurante) => {
            const notaA = current.nota_media || 0
            const notaB = prev.nota_media || 0

            const avalA = current.numero_avaliacoes || 0
            const avalB = prev.numero_avaliacoes || 0

            if (notaA > notaB) return current
            if (notaA === notaB && avalA > avalB) return current
            return prev
          })
          setRestauranteDestaque(destaque)
        } else {
          setRestauranteDestaque(restaurantesData[0])
        }
      }
    } catch (error: any) {
      console.error("Erro ao carregar restaurantes:", error)
      setRestaurantes([])
    } finally {
      setLoading(false)
    }
  }

  const restaurantesEmAlta = restaurantes
    .filter(f => (f.numero_avaliacoes || 0) > 0)
    .sort((a, b) => (b.numero_avaliacoes || 0) - (a.numero_avaliacoes || 0))
    .slice(0, 18)

  const totalPaginas = Math.ceil(restaurantesEmAlta.length / restaurantesPorPagina)
  const restaurantesAtuais = restaurantesEmAlta.slice(paginaAtual * restaurantesPorPagina, (paginaAtual + 1) * restaurantesPorPagina)

  const proximaPagina = () => {
    setPaginaAtual((prev) => (prev + 1) % totalPaginas)
  }

  const paginaAnterior = () => {
    setPaginaAtual((prev) => (prev - 1 + totalPaginas) % totalPaginas)
  }

  const normalizeCategoria = (text: string) => {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s]/g, '')    // remove caracteres especiais
      .replace(/\s+/g, ' ')           // remove espaços extras
      .trim()
  }

  const restaurantesPorCategoria = (valorCategoria: string) => {
    const categoriaNormalizada = normalizeCategoria(valorCategoria)

    return restaurantes.filter((restaurante) => {
      return normalizeCategoria(restaurante.categoria || '') === categoriaNormalizada
    }).slice(0, 6)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Restaurante em Destaque */}
      {restauranteDestaque && (
        <Link
          to={`/restaurante/${restauranteDestaque.id}`}
          className="block relative h-[480px] md:h-[540px] overflow-hidden flex items-center group"
        >
          {restauranteDestaque.poster ? (
            <img
              src={`http://localhost:8000/imgs/posters/${encodeURIComponent(restauranteDestaque.poster)}`}
              alt={restauranteDestaque.nome}
              className="absolute inset-0 w-full h-full object-cover z-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add('bg-gradient-to-r', 'from-blue-900', 'to-purple-900');
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 z-0" />
          )}

          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0) 0%, #09090B 100%)' }}
          />

          <div className="absolute inset-0 bg-black bg-opacity-70 z-20" />

          <div className="relative container mx-auto px-4 h-full flex items-center z-30">
            <div className="flex gap-10 items-center w-full">
              <div className="hidden md:block w-56 h-80 bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl">
                {restauranteDestaque.poster ? (
                  <img
                    src={`http://localhost:8000/imgs/posters/${encodeURIComponent(restauranteDestaque.poster)}`}
                    alt={restauranteDestaque.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${restauranteDestaque.poster ? 'hidden' : ''}`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <div className="text-gray-400">Sem imagem</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg uppercase tracking-wider">Restaurante Destaque</h2>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4 uppercase text-white drop-shadow-lg leading-tight">{restauranteDestaque.nome}</h1>
                <p className="text-lg mb-6 line-clamp-3 text-gray-200 drop-shadow-md font-medium">{restauranteDestaque.descricao}</p>
                <div className="flex flex-wrap items-center gap-4 text-base mb-6">
                  <div className="circle-green">
                    <span className="text-lg font-bold">{restauranteDestaque.nota_media ? Math.round(restauranteDestaque.nota_media * 10) : 0}%</span>
                  </div>
                  <span className="text-gray-200">Categoria: {restauranteDestaque.categoria}</span>
                  <span className="text-gray-200">Endereço: {restauranteDestaque.endereco}</span>
                  <span className="text-gray-200">Telefone: {restauranteDestaque.telefone}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Carrossel de Restaurantes */}
      <section className="container mx-auto px-4 py-10 relative">
        <h2 className="section-title mb-6">Restaurantes em Alta</h2>
        <div className="relative">
          {totalPaginas > 1 && (
            <>
              <button
                onClick={paginaAnterior}
                className="carousel-btn absolute left-0 top-1/2 -translate-y-1/2 z-20 shadow-lg"
                style={{ transform: 'translateY(-50%) translateX(-72px)' }}
                title="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={proximaPagina}
                className="carousel-btn absolute right-0 top-1/2 -translate-y-1/2 z-20 shadow-lg"
                style={{ transform: 'translateY(-50%) translateX(72px)' }}
                title="Próximo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {restaurantesAtuais.map((restaurante) => (
              <RestauranteCard key={restaurante.id} restaurante={restaurante} minimal />
            ))}
          </div>
        </div>
      </section>

      {/* Restaurantes por Categoria Dinâmico */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="section-title">Restaurantes por categoria</h2>
        {categorias.map(({ valor, label }) => {
          const restaurantesDaCategoria = restaurantesPorCategoria(valor)
          if (restaurantesDaCategoria.length === 0) return null

          return (
            <div key={valor} className="mb-10">
              <h3 
                className="subtitle cursor-pointer hover:underline"
                onClick={() => navigate(`/buscar?categoria=${normalizeCategoria(label)}`)}
                >
                  {label}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {restaurantesDaCategoria.map((restaurante) => (
                  <RestauranteCard key={restaurante.id} restaurante={restaurante} minimal />
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default Home
