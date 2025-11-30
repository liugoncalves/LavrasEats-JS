import type React from "react"
import { Link } from "react-router-dom"
import { Star, Calendar } from "lucide-react"
import type { Restaurante } from "../types"

interface RestauranteCardProps {
  restaurante: Restaurante
  showActions?: boolean
  onEdit?: (restaurante: Restaurante) => void
  onDelete?: (id: number) => void
  minimal?: boolean
}

const RestauranteCard: React.FC<RestauranteCardProps> = ({ restaurante, showActions = false, onEdit, onDelete, minimal = false }) => {
  if (minimal) {
    return (
      <div className="relative group rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 shadow-lg">
        <Link to={`/restaurante/${restaurante.id}`}>
          {/* Poster */}
          <div className="aspect-[2/3] w-full h-full bg-gray-700 flex items-center justify-center">
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
            ) : (
              <div className="text-gray-400 text-center p-4">
                <div className="text-4xl mb-2">🍽️</div>
                <div className="text-sm">{restaurante.nome}</div>
              </div>
            )}
            {/* Nota no canto superior esquerdo */}
            <div className="absolute top-3 left-3 z-10">
              <div className="circle-green w-10 h-10 border-2">
                <span className="text-xs font-bold">{restaurante.nota_media ? Math.round(restaurante.nota_media * 10) : 0}%</span>
              </div>
            </div>
            {/* Título sobreposto na parte inferior */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 z-10">
              <span className="block text-white text-base font-bold drop-shadow-lg truncate" title={restaurante.nome}>
                {restaurante.nome}
              </span>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="card-dark overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
      <Link to={`/restaurante/${restaurante.id}`}>
        <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center rounded-xl overflow-hidden">
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
          <div className={`text-gray-400 text-center p-4 ${restaurante.poster ? 'hidden' : ''}`}>
            <div className="text-4xl mb-2">🍽️</div>
            <div className="text-sm">{restaurante.nome}</div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{restaurante.nome}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{restaurante.categoria}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="circle-green">
              <span className="text-xs font-bold">{restaurante.nota_media ? Math.round(restaurante.nota_media * 10) : 0}%</span>
            </div>
            <span className="text-gray-400 text-xs">({restaurante.numero_avaliacoes || 0})</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-sm font-semibold" style={{ color: '#FEFEFE' }}>{restaurante.categoria}</span>
        </div>
      </div>
    </div>
  )
}

export default RestauranteCard;
