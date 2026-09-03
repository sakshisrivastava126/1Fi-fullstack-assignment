import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'
import formatCurrency from '../utils/formatCurrency.js'

function StoreHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 2xl:max-w-7xl">
        <Link to="/" className="text-xl font-bold text-slate-900">
          1Fi <span className="text-violet-700">EMI Store</span>
        </Link>
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to store
        </Link>
      </div>
    </header>
  )
}

// Shared shell for the loading / error / not-found screens so they stay
// consistent and always keep the header navigation available.
function StatusScreen({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:py-24">
        {children}
      </main>
    </div>
  )
}

function ProductDetails() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      setError('')
      setProduct(null)
      setSelectedVariantIndex(0)
      setSelectedPlanIndex(0)
      setConfirmed(false)

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
  }, [slug, retryCount])

  if (loading) {
    return (
      <StatusScreen>
        <div role="status" aria-label="Loading product" className="w-full">
          <div className="mx-auto grid w-full grid-cols-1 gap-6 text-left lg:grid-cols-2">
            <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white sm:h-80" />
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-2/3 rounded bg-slate-200" />
              <div className="h-4 w-1/3 rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-10 w-1/2 rounded bg-slate-200" />
              <div className="h-40 w-full rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </StatusScreen>
    )
  }

  if (error) {
    return (
      <StatusScreen>
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-6 py-8">
          <h1 className="text-xl font-bold text-red-800">Something went wrong</h1>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-5 rounded-md bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            Try again
          </button>
        </div>
        <Link to="/" className="mt-6 text-sm text-slate-500 hover:text-slate-900">
          Back to store
        </Link>
      </StatusScreen>
    )
  }

  if (!product) {
    return (
      <StatusScreen>
        <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>
        <p className="mt-2 text-slate-500">No product matches "{slug}".</p>
        <Link
          to="/"
          className="mt-6 rounded-md bg-violet-700 px-5 py-2.5 text-white transition hover:bg-violet-800"
        >
          Back to store
        </Link>
      </StatusScreen>
    )
  }

  const { name, description, variants = [] } = product

  if (variants.length === 0) {
    return (
      <StatusScreen>
        <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
        <p className="mt-2 max-w-md text-slate-500">
          This product has no variants available to buy right now.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-md bg-violet-700 px-5 py-2.5 text-white transition hover:bg-violet-800"
        >
          Back to store
        </Link>
      </StatusScreen>
    )
  }

  const variant = variants[selectedVariantIndex] ?? variants[0]
  const { mrp, price, image } = variant
  const discount = Math.round(((mrp - price) / mrp) * 100)
  const emiPlans = variant.emiPlans ?? []
  const selectedPlan = emiPlans[selectedPlanIndex] ?? null

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10 2xl:max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
            <img
              src={image}
              alt={name}
              className="h-56 w-full max-w-sm object-contain sm:h-72 lg:h-80"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{name}</h1>
            <p className="mt-2 text-slate-500">{variant.name}</p>
            <p className="mt-4 text-slate-600">{description}</p>

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-slate-900">
                Choose a variant
              </h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {variants.map((item, index) => {
                  const isSelected = index === selectedVariantIndex

                  return (
                    <button
                      key={item._id ?? item.name}
                      type="button"
                      onClick={() => {
                        setSelectedVariantIndex(index)
                        setSelectedPlanIndex(0)
                        setConfirmed(false)
                      }}
                      aria-pressed={isSelected}
                      className={`rounded-lg border px-4 py-2.5 text-left transition ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50 ring-1 ring-violet-600'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <span
                        className={`block text-sm font-medium ${
                          isSelected ? 'text-violet-900' : 'text-slate-700'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`block text-xs ${
                          isSelected ? 'text-violet-700' : 'text-slate-500'
                        }`}
                      >
                        {formatCurrency(item.price)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

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

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                EMI plans backed by mutual funds
              </h2>
              {emiPlans.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No EMI plans available for this variant
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try another variant to see available plans.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {emiPlans.map((plan, index) => {
                    const isSelected = index === selectedPlanIndex

                    return (
                      <button
                        key={plan._id ?? index}
                        type="button"
                        onClick={() => {
                          setSelectedPlanIndex(index)
                          setConfirmed(false)
                        }}
                        aria-pressed={isSelected}
                        className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                          isSelected
                            ? 'border-violet-600 bg-violet-50 ring-1 ring-violet-600'
                            : 'border-slate-200 bg-white hover:border-slate-400'
                        }`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <span
                            className={`font-semibold ${
                              isSelected ? 'text-violet-900' : 'text-slate-900'
                            }`}
                          >
                            {formatCurrency(plan.monthlyPayment)} × {plan.tenure} months
                          </span>
                          <span
                            className={`text-sm ${
                              isSelected ? 'text-violet-700' : 'text-slate-500'
                            }`}
                          >
                            {plan.interestRate}% interest
                          </span>
                        </div>
                        {plan.cashback > 0 && (
                          <span className="mt-1 block text-xs text-green-600">
                            Additional cashback of {formatCurrency(plan.cashback)}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setConfirmed(true)}
              disabled={!selectedPlan}
              className="mt-6 w-full rounded-lg bg-violet-700 px-6 py-3 font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
              Proceed with this plan
            </button>

            {confirmed && selectedPlan && (
              <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-4 sm:p-6">
                <h2 className="text-base font-semibold text-green-900 sm:text-lg">
                  Plan selected — ready to continue
                </h2>
                <p className="mt-1 text-sm text-green-800">
                  Review your selection below. Nothing has been purchased yet — no
                  payment has been taken and no order has been created.
                </p>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex flex-wrap justify-between gap-x-4">
                    <dt className="text-slate-600">Product</dt>
                    <dd className="font-medium text-slate-900">{name}</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4">
                    <dt className="text-slate-600">Variant</dt>
                    <dd className="font-medium text-slate-900">{variant.name}</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4">
                    <dt className="text-slate-600">Price</dt>
                    <dd className="font-medium text-slate-900">
                      {formatCurrency(price)}
                    </dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4">
                    <dt className="text-slate-600">Monthly payment</dt>
                    <dd className="font-medium text-slate-900">
                      {formatCurrency(selectedPlan.monthlyPayment)}
                    </dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4">
                    <dt className="text-slate-600">Tenure</dt>
                    <dd className="font-medium text-slate-900">
                      {selectedPlan.tenure} months
                    </dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4">
                    <dt className="text-slate-600">Interest rate</dt>
                    <dd className="font-medium text-slate-900">
                      {selectedPlan.interestRate}%
                    </dd>
                  </div>
                  {selectedPlan.cashback > 0 && (
                    <div className="flex flex-wrap justify-between gap-x-4">
                      <dt className="text-slate-600">Cashback</dt>
                      <dd className="font-medium text-green-700">
                        {formatCurrency(selectedPlan.cashback)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetails
