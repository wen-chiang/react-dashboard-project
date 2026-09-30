import { Link } from 'react-router-dom'
import { Home, Package, Monitor, Headphones, Briefcase, Grid, Home as HomeIcon } from 'react-feather'

const CATEGORIES = [
  { name: 'Accessories', count: 4, Icon: Package },
  { name: 'Displays', count: 1, Icon: Monitor },
  { name: 'Peripherals', count: 1, Icon: Grid },
  { name: 'Audio', count: 1, Icon: Headphones },
  { name: 'Office', count: 1, Icon: Briefcase },
  { name: 'Furniture', count: 2, Icon: HomeIcon },
]

export default function CategoriesPage() {
  return (
    <div>
      <div className="page-header">
        <nav className="breadcrumb-trail">
          <Link to="/dashboard"><Home /> Dashboard</Link>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span>Product Categories</span>
        </nav>
        <h1>Product Categories</h1>
      </div>

      <div className="row g-3">
        {CATEGORIES.map(({ name, count, Icon }) => (
          <div className="col-sm-6 col-lg-4" key={name}>
            <div className="card h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="placeholder-icon" style={{ margin: 0, width: 44, height: 44 }}>
                  <Icon />
                </div>
                <div>
                  <h6 className="mb-0">{name}</h6>
                  <span className="text-muted small">{count} product{count === 1 ? '' : 's'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
