import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken) {
        try {
          const response = await axios.post("http://localhost:8000/api/token/refresh/", {
            refresh: refreshToken
          })
          
          const { access } = response.data
          localStorage.setItem("token", access)
          
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem("token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("usuario")
          window.location.href = "/"
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

// Serviços de usuários
export const usuarioService = {
  listar: () => api.get("/usuarios/listar"),
  cadastrar: (dados: any) => api.post("/usuarios/cadastrar/", dados),
  consultar: (cpf: string) => api.get(`/usuarios/consultar/${cpf}`),
  atualizar: (cpf: string, dados: any) => api.put(`/usuarios/atualizar/${cpf}/`, dados),
  deletar: (cpf: string) => api.delete(`/usuarios/deletar/${cpf}/`),
  confirmar: (cpf: string, codigo: string) => api.get(`/usuarios/confirmar/?cpf=${cpf}&codigo=${codigo}`),
}

// Serviços de restaurantes
export const restauranteService = {
  listar: () => api.get("/restaurantes/listar"),
  cadastrar: (dados: any) => api.post("/restaurantes/cadastrar/", dados),
  consultar: (id: number) => api.get(`/restaurantes/consultar/${id}`),
  atualizar: (id: number, dados: any) => api.put(`/restaurantes/atualizar/${id}`, dados),
  deletar: (id: number) => api.delete(`/restaurantes/deletar/${id}`),
  ranking: (ordem = "melhores") => api.get(`/restaurantes/ranking/?ordem=${ordem}`),
  filtrar: (categoria?: string, ordem_nota?: string) => {
    let url = "/restaurantes/filtrar/?"
    if (categoria) url += `categoria=${categoria}&`
    if (ordem_nota) url += `ordem_nota=${ordem_nota}`
    return api.get(url)
  },
}

// Serviços de avaliações
export const avaliacaoService = {
  listar: () => api.get("/avaliacoes/listar"),
  avaliar: (dados: any) => api.post("/avaliacoes/avaliar/", dados),
  consultar: (restauranteId: number) => api.get(`/avaliacoes/consultar/${restauranteId}/`),
  minhasAvaliacoes: () => api.get("/avaliacoes/minhas-avaliacoes"),
}

export const authService = {
  login: (dados: any) => api.post("/login/", dados),
}

export type RecomendacaoResponse = {
  restaurante_id: number | null;
  mensagem_explicativa: string | null;
  imagem_url: string | null;
  nome?: string;
};

export const recomendacaoService = {
  gerar: (data: { categoria: string; prompt: string }) =>
    api.post<RecomendacaoResponse>("/recomendacoes/", data),
};
