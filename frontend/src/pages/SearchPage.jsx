import { useState } from 'react'
import api from '../services/api'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}`)
      setResults(response.data)
      setSearched(true)
    } catch (err) {
      console.error(err)
      setResults([])
    }
  }

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search orders, customers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {searched && results.length === 0 && (
        <div className="alert alert-info">No results found</div>
      )}

      {results.length > 0 && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Results ({results.length})</h5>
            <div className="list-group">
              {results.map((result) => (
                <div key={result.id} className="list-group-item">
                  <h6>{result.title}</h6>
                  <p className="mb-0 text-muted">{result.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
