"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BrainCircuit } from "lucide-react"
import { categorias } from "../utils/categorias"
import { recomendacaoService } from "../services/api"

interface RecomendacaoResponse {
  restaurante_id: number | null
  mensagem_explicativa: string | null
  nome?: string | null
  imagem_url?: string | null
}

const Recomendacoes: React.FC = () => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [erro, setErro] = useState<string | null>(null)
  const [mensagemExplicativa, setMensagemExplicativa] = useState<string | null>(null)
  const [restauranteId, setRestauranteId] = useState<number | null>(null)
  const [restauranteNome, setRestauranteNome] = useState<string | null>(null)
  const [restauranteImagem, setRestauranteImagem] = useState<string | null>(null)

  const navigate = useNavigate()

  const resetarEstado = () => {
    setCategoriaSelecionada("")
    setPrompt("")
    setErro(null)
    setMensagemExplicativa(null)
    setRestauranteId(null)
    setRestauranteNome(null)
    setRestauranteImagem(null)
  }

  const handleGerarRecomendacao = async () => {
    if (!categoriaSelecionada || !prompt.trim()) {
      setErro("Selecione uma categoria e descreva o que você busca.")
      return
    }

    setLoading(true)
    setErro(null)
    setMensagemExplicativa(null)
    setRestauranteId(null)
    setRestauranteNome(null)
    setRestauranteImagem(null)

    try {
      const response = await recomendacaoService.gerar({
        categoria: categoriaSelecionada,
        prompt,
      })

      const data: RecomendacaoResponse = response.data

      if (data.mensagem_explicativa) setMensagemExplicativa(data.mensagem_explicativa)
      if (data.restaurante_id) {
        setRestauranteId(data.restaurante_id)
        setRestauranteNome(data.nome || null)
        setRestauranteImagem(data.imagem_url || null)
      } else {
        setErro("A IA não encontrou um restaurante adequado para o seu pedido.")
      }
    } catch (error: any) {
      console.error("Erro ao gerar recomendação:", error)
      setErro(error.response?.data?.erro || "Erro inesperado. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center p-4">
      <div className="card-dark max-w-2xl w-full p-6">
        {!restauranteId && !mensagemExplicativa ? (
          <>
            <div className="text-center mb-8">
              <BrainCircuit className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h1 className="text-3xl font-bold">Recomendação com a nossa IA</h1>
              <p className="text-gray-400 mt-2">
                Não sabe onde ir? Descreva o que você procura e nossa IA encontrará o lugar perfeito!
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">1. Escolha uma categoria</label>
                <select
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                  className="input-dark"
                  disabled={loading}
                >
                  <option value="" disabled>Selecione...</option>
                  {categorias.map((cat) => (
                    <option key={cat.valor} value={cat.valor}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {categoriaSelecionada && (
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                    2. O que você está procurando hoje?
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: quero um lugar que venda um açaí bem recheado e em conta"
                    className="input-dark resize-none h-28"
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            {erro && (
              <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-center mt-6">
                {erro}
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button
                onClick={handleGerarRecomendacao}
                disabled={!categoriaSelecionada || !prompt || loading}
                className="btn-white text-lg px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Analisando..." : "Buscar Recomendação"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6">
            {restauranteImagem ? (
              <img
                src={restauranteImagem}
                alt={restauranteNome || "Restaurante"}
                className="w-full h-48 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-700 rounded-xl">
                <span className="text-gray-400 text-6xl">🍽️</span>
              </div>
            )}

            {restauranteNome && <h2 className="text-2xl font-semibold">{restauranteNome}</h2>}
            {mensagemExplicativa && (
              <p className="text-gray-300 bg-gray-800 p-3 rounded-lg">{mensagemExplicativa}</p>
            )}

            {restauranteId && (
              <p
                className="text-blue-400 underline cursor-pointer mt-2"
                onClick={() => navigate(`/restaurante/${restauranteId}`)}
              >
                Ir para a página do restaurante
              </p>
            )}

            <div className="flex justify-center mt-6">
              <button
                onClick={resetarEstado}
                className="btn-white text-lg px-6 py-2"
              >
                Nova sugestão
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Recomendacoes
