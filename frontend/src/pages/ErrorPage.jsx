import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'react-feather'

// Faithful conversion of the reference error.html. /orders/cancelled in the
// reference deliberately throws to showcase this themed error page.
export default function ErrorPage({
  status = 500,
  error = 'Internal Server Error',
  message = 'Demo trigger: /orders/cancelled intentionally throws to showcase the themed error page.',
  path = '/orders/cancelled',
}) {
  return (
    <div>
      <div className="page-header">
        <h1>Error</h1>
        <p className="text-muted">Something went wrong handling that request.</p>
      </div>

      <div className="card placeholder-card">
        <div className="card-body text-center">
          <div className="placeholder-icon"><AlertTriangle /></div>
          <h5>{status} &mdash; {error}</h5>
          <p className="text-muted">{message}</p>
          <p className="text-muted small">Path: {path}</p>
          <Link className="btn btn-primary" to="/dashboard"><ArrowLeft /> Back to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
