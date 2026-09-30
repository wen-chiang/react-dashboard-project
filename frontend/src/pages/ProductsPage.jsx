import { Link } from 'react-router-dom'
import { Home } from 'react-feather'

const PRODUCTS = [
  { sku: 'PRD-1001', name: 'Wireless Mouse', category: 'Accessories', price: 24.99, stock: 132 },
  { sku: 'PRD-1002', name: 'Mechanical Keyboard', category: 'Accessories', price: 89.0, stock: 12 },
  { sku: 'PRD-1003', name: '27" 4K Monitor', category: 'Displays', price: 329.0, stock: 0 },
  { sku: 'PRD-1004', name: 'USB-C Hub', category: 'Accessories', price: 45.5, stock: 88 },
  { sku: 'PRD-1005', name: 'Laptop Stand', category: 'Accessories', price: 34.0, stock: 54 },
  { sku: 'PRD-1006', name: 'Webcam 1080p', category: 'Peripherals', price: 59.99, stock: 7 },
  { sku: 'PRD-1007', name: 'Noise-Cancelling Headphones', category: 'Audio', price: 199.0, stock: 23 },
  { sku: 'PRD-1008', name: 'LED Desk Lamp', category: 'Office', price: 29.99, stock: 0 },
  { sku: 'PRD-1009', name: 'Ergonomic Chair', category: 'Furniture', price: 249.0, stock: 15 },
  { sku: 'PRD-1010', name: 'Standing Desk', category: 'Furniture', price: 499.0, stock: 5 },
]

function stockBadge(stock) {
  if (stock === 0) return { cls: 'text-bg-danger', label: 'Out of Stock' }
  if (stock < 15) return { cls: 'text-bg-warning', label: 'Low Stock' }
  return { cls: 'text-bg-success', label: 'In Stock' }
}

export default function ProductsPage() {
  return (
    <div>
      <div className="page-header">
        <nav className="breadcrumb-trail">
          <Link to="/dashboard"><Home /> Dashboard</Link>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span>All Products</span>
        </nav>
        <h1>All Products</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p) => {
                  const badge = stockBadge(p.stock)
                  return (
                    <tr key={p.sku}>
                      <td>{p.sku}</td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
