"use client"

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Upload } from "lucide-react"
import { restauranteService } from "../services/api"

const CadastroRestaurante: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    endereco: "",
    telefone: "",
    poster: null as File | null,
  })
  const [posterName, setPosterName] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement

    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }))

    if (name === "poster" && files && files.length > 0) {
      setPosterName(files[0].name)
    } else if (name === "poster") {
      setPosterName("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro("")

    try {
      const data = new FormData()
      data.append("nome", formData.nome)
      data.append("categoria", formData.categoria)
      data.append("descricao", formData.descricao)
      data.append("endereco", formData.endereco)
      data.append("telefone", formData.telefone)
      if (formData.poster) {
        data.append("poster", formData.poster)
      }

      const response = await restauranteService.cadastrar(data)

      // Se chegou até aqui, o restaurante foi cadastrado com sucesso
      setSucesso(true)
      setTimeout(() => {
        navigate("/home")
      }, 2000)

    } catch (error: any) {
      console.error("Erro ao cadastrar restaurante:", error)

      // Tratamento específico para diferentes tipos de erro
      if (error.response) {
        // Erro com resposta do servidor
        const errorMessage = error.response.data?.erro ||
          error.response.data?.detail ||
          error.response.data?.mensagem ||
          "Erro ao cadastrar restaurante. Verifique os dados e tente novamente."
        setErro(errorMessage)
      } else if (error.request) {
        // Erro de rede (sem resposta do servidor)
        setErro("Erro de conexão. Verifique se o servidor está rodando e tente novamente.")
      } else {
        // Outro tipo de erro
        setErro("Erro inesperado. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-white text-2xl font-bold mb-2">Restaurante cadastrado com sucesso!</h2>
          <p className="text-gray-400">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link to="/home" className="hover:text-white">Início</Link>
          <span>›</span>
          <span>Cadastro de Restaurantes</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex gap-8">
              <div className="w-1/3">
                <div className="aspect-[2/3] bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-gray-500 transition-colors relative">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">188x288</p>
                    {posterName && (
                      <p className="text-xs mt-2 text-gray-300 truncate">{posterName}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    name="poster"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Cadastro de Restaurantes</h1>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Insira o nome do restaurante"
                    className="input-dark"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria</label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="input-dark"
                      required
                    >

                      <option value="">Selecione</option>
                      <option value="acai">Açaí</option>
                      <option value="arabe">Comida Árabe</option>
                      <option value="cafeteria">Cafeteria</option>
                      <option value="chinesa">Comida Chinesa</option>
                      <option value="churrascaria">Churrascaria</option>
                      <option value="doces">Doces/Sobremesas</option>
                      <option value="hamburgueria">Hamburgueria</option>
                      <option value="italiana">Comida Italiana</option>
                      <option value="japonesa">Comida Japonesa</option>
                      <option value="marinhos">Frutos do Mar</option>
                      <option value="marmitex">Marmitex</option>
                      <option value="mexicana">Comida Mexicana</option>
                      <option value="nordestina">Comida Nordestina</option>
                      <option value="pizza">Pizzaria</option>
                      <option value="porcoes">Porções</option>
                      <option value="saudavel">Saudável</option>
                      <option value="sorveteria">Sorveteria</option>
                      <option value="tapioca">Tapioca</option>
                      <option value="vegana">Vegana</option>
                      <option value="vegetariana">Vegetariana</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Endereço</label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Endereço"
                      className="input-dark"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(XX) XXXXX-XXXX"
                      className="input-dark"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Descreva o restaurante"
                    rows={4}
                    className="input-dark"
                    required
                  />
                </div>

                {erro && <div className="text-red-400 text-sm">{erro}</div>}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-white py-3 text-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Cadastrando..." : "Cadastrar Restaurante"}
                  </button>
                  <Link
                    to="/home"
                    className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancelar
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CadastroRestaurante
