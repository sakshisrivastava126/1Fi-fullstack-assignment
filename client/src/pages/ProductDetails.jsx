import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'
import formatCurrency from '../utils/formatCurrency.js'

function ProductDetails() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      setError('')
      setProduct(null)

      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${slug}`)

        if (response.status === 404) {
          return
        }

        if (!response.ok) {
          throw new Error('Request failed')
        }

        const body = await response.json()
        setProduct(body.data)
      } catch {
        setError('Could not load this product. Please make sure the API is running.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <p className="text-slate-500">Loading product…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-red-700">
          {error}
        </p>
        <Link
          to="/"
          className="mt-6 rounded-md bg-violet-700 px-5 py-2.5 text-white hover:bg-violet-800"
        >
          Back to store
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>
        <p className="mt-2 text-slate-500">No product matches "{slug}".</p>
        <Link
          to="/"
          className="mt-6 rounded-md bg-violet-700 px-5 py-2.5 text-white hover:bg-violet-800"
        >
          Back to store
        </Link>
      </div>
    )
  }

  const { name, description, variants } = product
  const variant = variants[0]
  const { mrp, price, image } = variant
  const discount = Math.round(((mrp - price) / mrp) * 100)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold text-slate-900">
            1Fi <span className="text-violet-700">EMI Store</span>
          </Link>
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to store
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-6">
            <img src={image} alt={name} className="h-80 w-auto object-contain" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
            <p className="mt-2 text-slate-500">{variant.name}</p>
            <p className="mt-4 text-slate-600">{description}</p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">
                {formatCurrency(price)}
              </span>
              <span className="text-lg text-slate-400 line-through">
                {formatCurrency(mrp)}
              </span>
              {discount > 0 && (
                <span className="font-semibold text-green-600">{discount}% off</span>
              )}
            </div>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                EMI plans backed by mutual funds
              </h2>
              <p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                EMI plans will appear here
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetails
