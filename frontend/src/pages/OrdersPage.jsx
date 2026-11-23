import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'react-feather'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ orderNumber: '', customerId: '', orderDate: '', amount: '' })

  useEffect(() => {
    fetchOrders(currentPage)
    fetchCustomers()
  }, [currentPage])

  const fetchOrders = async (page) => {
    try {
      setLoading(true)
      const response = await api.get(`/orders?page=${page}&size=10`)
      setOrders(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      toast.error('Failed to load orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers')
      setCustomers(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/orders/${editingId}`, formData)
        toast.success('Order updated successfully')
      } else {
        await api.post('/orders', formData)
        toast.success('Order created successfully')
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({ orderNumber: '', customerId: '', orderDate: '', amount: '' })
      fetchOrders(currentPage)
    } catch (err) {
      toast.error(editingId ? 'Failed to update order' : 'Failed to create order')
      console.error(err)
    }
  }

  const handleEdit = (order) => {
    setFormData({
      orderNumber: order.orderNumber,
      customerId: order.customer?.id,
      orderDate: order.orderDate,
      amount: order.amount,
    })
    setEditingId(order.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/orders/${id}`)
        toast.success('Order deleted successfully')
        fetchOrders(currentPage)
      } catch (err) {
        toast.error('Failed to delete order')
        console.error(err)
      }
    }
  }

  if (loading) return <div className="loading"><span className="spinner-border"></span></div>

  return (
    <div>
      <div className="page-header">
        <nav className="breadcrumb-trail">
          <Link to="/dashboard"><Home /> Dashboard</Link>
          <span>/</span>
          <span>Orders</span>
          <span>/</span>
          <span>All Orders</span>
        </nav>
        <h1>All Orders</h1>
      </div>

      <div className="d-flex justify-content-end align-items-center mb-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ orderNumber: '', customerId: '', orderDate: '', amount: '' })
          }}
        >
          + New Order
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editingId ? 'Edit Order' : 'New Order'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Order Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Customer</label>
                  <select
                    className="form-control"
                    value={formData.customerId || ''}
                    onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Order Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customer?.name}</td>
                    <td>${order.amount?.toFixed(2)}</td>
                    <td>
                      <span className={`badge bg-${order.status === 'COMPLETED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'danger'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEdit(order)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-end">
              <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <li
                  key={idx}
                  className={`page-item ${currentPage === idx ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(idx)}>
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
