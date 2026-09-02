import { Link } from 'react-router-dom'
import formatCurrency from '../utils/formatCurrency.js'

function ProductCard({ product }) {
  const { slug, name, variant, mrp, price, image } = product
  const discount = Math.round(((mrp - price) / mrp) * 100)

  return (
    <Link
      to={`/products/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
    >
      <div className="flex items-center justify-center bg-slate-50 p-4">
        <img
          src={image}
          alt={name}
          className="h-56 w-auto object-contain transition group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
        <p className="mt-1 text-sm text-slate-500">{variant}</p>

        <div className="mt-4 flex flex-wrap items-baseline gap-2">
          <span className="text-xl font-bold text-slate-900">
            {formatCurrency(price)}
          </span>
          <span className="text-sm text-slate-400 line-through">
            {formatCurrency(mrp)}
          </span>
          {discount > 0 && (
            <span className="text-sm font-semibold text-green-600">
              {discount}% off
            </span>
          )}
        </div>

        <span className="mt-4 text-sm font-medium text-violet-700 group-hover:underline">
          View EMI plans →
        </span>
      </div>
    </Link>
  )
}

export default ProductCard
