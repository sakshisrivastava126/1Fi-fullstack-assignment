import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { API_BASE_URL } from '../config.js'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`)

        if (!response.ok) {
          throw new Error('Request failed')
        }

        const body = await response.json()
        setProducts(body.data)
      } catch {
        setError('Could not load products. Please make sure the API is running.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 2xl:max-w-7xl">
          <Link to="/" className="text-xl font-bold text-slate-900">
            1Fi <span className="text-violet-700">EMI Store</span>
          </Link>
          <span className="hidden text-sm text-slate-500 sm:block">
            EMI backed by mutual funds
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10 2xl:max-w-7xl">
        <section className="rounded-2xl bg-violet-700 px-5 py-8 text-white sm:px-10 sm:py-14">
          <h1 className="text-2xl font-bold sm:text-4xl">
            Buy now, pay in easy EMIs
          </h1>
          <p className="mt-3 max-w-2xl text-violet-100">
            Pick a smartphone and split the cost into monthly instalments backed by
            your mutual funds — starting at 0% interest.
          </p>
        </section>

        <section className="mt-8 sm:mt-10">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Popular smartphones
          </h2>

          {loading && (
            <p className="mt-6 text-slate-500">Loading products…</p>
          )}

          {!loading && error && (
            <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-red-700">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-slate-500">
              No products available right now.
            </p>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <p className="mt-1 text-sm text-slate-500">
                {products.length} products available
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const variant = product.variants[0]

                  return (
                    <ProductCard
                      key={product.slug}
                      product={{
                        slug: product.slug,
                        name: product.name,
                        variant: variant.name,
                        mrp: variant.mrp,
                        price: variant.price,
                        image: variant.image,
                      }}
                    />
                  )
                })}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default Home
