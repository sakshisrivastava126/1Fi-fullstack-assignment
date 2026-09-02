import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
      <h1 className="text-4xl font-bold text-slate-900">1Fi EMI Store</h1>
      <p className="mt-3 text-lg text-slate-600">Home page</p>
      <Link
        to="/products/iphone-17-pro"
        className="mt-6 rounded-md bg-slate-900 px-5 py-2.5 text-white hover:bg-slate-700"
      >
        View iPhone 17 Pro
      </Link>
    </div>
  )
}

export default Home
