import { useState, useEffect } from 'react'
import api from '../services/api'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard')
        setDashboard(response.data)
      } catch (err) {
        setError('Failed to load dashboard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) return <div className="loading"><span className="spinner-border"></span></div>
  if (error) return <div className="error-message">{error}</div>
  if (!dashboard) return <div>No data</div>

  return (
    <div>
      {/* Stats Cards */}
      <div className="row mb-4">
        {dashboard.statCards.map((stat, idx) => (
          <div key={idx} className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">{stat.label}</h6>
                <p className="card-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Revenue by Month</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboard.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" name="Revenue" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Orders by Month</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboard.ordersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Orders */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Latest Orders</h5>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.latestOrders.map((order) => (
                  <tr key={order.orderNumber}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>${order.amount?.toFixed(2)}</td>
                    <td>
                      <span className={`badge bg-${order.status === 'COMPLETED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'danger'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
