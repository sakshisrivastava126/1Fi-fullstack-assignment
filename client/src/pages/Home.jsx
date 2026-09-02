import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import sampleProducts from '../data/sampleProducts.js'

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold text-slate-900">
            1Fi <span className="text-violet-700">EMI Store</span>
          </Link>
          <span className="text-sm text-slate-500">EMI backed by mutual funds</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="rounded-2xl bg-violet-700 px-6 py-10 text-white sm:px-10 sm:py-14">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Buy now, pay in easy EMIs
          </h1>
          <p className="mt-3 max-w-2xl text-violet-100">
            Pick a smartphone and split the cost into monthly instalments backed by
            your mutual funds — starting at 0% interest.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">Popular smartphones</h2>
          <p className="mt-1 text-sm text-slate-500">
            {sampleProducts.length} products available
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sampleProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
