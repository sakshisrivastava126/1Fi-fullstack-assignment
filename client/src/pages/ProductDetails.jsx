import { Link, useParams } from 'react-router-dom'

function ProductDetails() {
  const { slug } = useParams()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
      <h1 className="text-4xl font-bold text-slate-900">Product Details</h1>
      <p className="mt-3 text-lg text-slate-600">
        Slug: <span className="font-mono font-semibold">{slug}</span>
      </p>
      <Link to="/" className="mt-6 text-slate-700 underline hover:text-slate-900">
        Back to home
      </Link>
    </div>
  )
}

export default ProductDetails
