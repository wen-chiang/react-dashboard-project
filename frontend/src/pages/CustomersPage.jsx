import { useState, useEffect } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', initials: '' })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/customers')
      setCustomers(response.data)
    } catch (err) {
      toast.error('Failed to load customers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, formData)
        toast.success('Customer updated successfully')
      } else {
        await api.post('/customers', formData)
        toast.success('Customer created successfully')
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', email: '', initials: '' })
      fetchCustomers()
    } catch (err) {
      toast.error(editingId ? 'Failed to update customer' : 'Failed to create customer')
      console.error(err)
    }
  }

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      initials: customer.initials,
    })
    setEditingId(customer.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/customers/${id}`)
        toast.success('Customer deleted successfully')
        fetchCustomers()
      } catch (err) {
        toast.error('Failed to delete customer')
        console.error(err)
      }
    }
  }

  if (loading) return <div className="loading"><span className="spinner-border"></span></div>

  return (
    <div>
      <div className="d-flex justify-content-end align-items-center mb-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ name: '', email: '', initials: '' })
          }}
        >
          + New Customer
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editingId ? 'Edit Customer' : 'New Customer'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Initials</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.initials}
                  onChange={(e) => setFormData({ ...formData, initials: e.target.value })}
                  maxLength="3"
                />
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Initials</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.initials}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </button>
                    </td>
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
