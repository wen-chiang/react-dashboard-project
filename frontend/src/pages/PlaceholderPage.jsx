import { Link } from 'react-router-dom'
import { Home, Tool, ArrowLeft } from 'react-feather'

export default function PlaceholderPage({ title, parent }) {
  return (
    <div>
      <div className="page-header">
        <nav className="breadcrumb-trail">
          <Link to="/dashboard"><Home /> Dashboard</Link>
          {parent && <><span>/</span><span>{parent}</span></>}
          {parent !== title && <><span>/</span><span>{title}</span></>}
        </nav>
        <h1>{title}</h1>
      </div>

      <div className="card placeholder-card">
        <div className="card-body text-center">
          <div className="placeholder-icon"><Tool /></div>
          <h5>{title} is coming soon</h5>
          <p className="text-muted">
            This is a placeholder page for the demo &mdash; the real feature hasn't been built yet.
          </p>
          <Link className="btn btn-primary" to="/dashboard"><ArrowLeft /> Back to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
