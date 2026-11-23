import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'react-feather'

export default function NotFoundPage() {
  return (
    <div className="card placeholder-card">
      <div className="card-body text-center">
        <div className="placeholder-icon"><AlertTriangle /></div>
        <h5>404 &mdash; Page Not Found</h5>
        <p className="text-muted">The page you're looking for doesn't exist.</p>
        <Link className="btn btn-primary" to="/dashboard"><ArrowLeft /> Back to Dashboard</Link>
      </div>
    </div>
  )
}
