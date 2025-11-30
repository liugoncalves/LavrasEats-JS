import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"
import ProtectedGerenteRoute from "./components/ProtectedGerenteRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import RestauranteDetalhes from "./pages/RestauranteDetalhes"
import Ranking from "./pages/Ranking"
import CadastroRestaurante from "./pages/CadastroRestaurante"
import Confirmacao from "./pages/Confirmacao"
import MinhasAvaliacoes from "./pages/MinhasAvaliacoes"
import Recomendacoes from "./pages/Recomendacoes"
import Busca from "./pages/Busca"
import PerfilUsuario from "./pages/PerfilUsuario"

const AppContent: React.FC = () => {
  const location = useLocation()

  // Páginas que não devem mostrar o Header
  const pagesWithoutHeader = ['/', '/login', '/cadastro', '/confirmacao']
  const shouldShowHeader = !pagesWithoutHeader.includes(location.pathname)

  return (
    <div className="min-h-screen bg-[#09090B]">
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/restaurante/:id" element={<RestauranteDetalhes />} />
        <Route path="/recomendacoes" element={<Recomendacoes />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/buscar" element={<Busca />} />
        <Route
          path="/cadastro-restaurante"
          element={
            <ProtectedGerenteRoute>
              <CadastroRestaurante />
            </ProtectedGerenteRoute>
          }
        />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route
          path="/minhas-avaliacoes"
          element={
            <ProtectedRoute>
              <MinhasAvaliacoes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <PerfilUsuario />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
