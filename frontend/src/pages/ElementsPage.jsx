import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'react-feather'
import * as Feather from 'react-feather'

const toKebab = (n) =>
  n.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/([A-Za-z])(\d)/g, '$1-$2').toLowerCase()

// Full Feather set, mirroring the reference "Icons" showcase.
const ICONS = Object.entries(Feather)
  .filter(([name]) => /^[A-Z]/.test(name))
  .map(([name, Cmp]) => ({ name: toKebab(name), Cmp }))
  .sort((a, b) => a.name.localeCompare(b.name))

export default function ElementsPage() {
  const [filter, setFilter] = useState('')

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase()
    return q ? ICONS.filter((i) => i.name.includes(q)) : ICONS
  }, [filter])

  return (
    <div>
      <div className="page-header">
        <nav className="breadcrumb-trail">
          <Link to="/dashboard"><Home /> Dashboard</Link>
          <span>/</span>
          <span>Orders</span>
          <span>/</span>
          <span>Pending Orders</span>
        </nav>
        <h1>Pending Orders</h1>
        <p className="text-muted">A reference sheet of every HTML/Bootstrap element used across this theme.</p>
      </div>

      {/* Typography */}
      <div className="row g-2 mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Typography</h5>
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
              <h3>Heading 3</h3>
              <h4>Heading 4</h4>
              <h5>Heading 5</h5>
              <h6>Heading 6</h6>
              <p className="lead">This is a lead paragraph. It stands out from regular body text.</p>
              <p>
                Regular paragraph text with <strong>bold</strong>, <em>italic</em>, <mark>marked</mark>,{' '}
                <code>inline code</code>, <del>deleted</del>, and <a href="#">a link</a>.
              </p>
              <p><small className="text-muted">Small, muted helper text.</small></p>
              <blockquote className="blockquote">
                <p>A well-known quote, contained in a blockquote element.</p>
                <footer className="blockquote-footer">Someone famous</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Icons */}
      <div className="row g-2 mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div>
                  <h5 className="card-title mb-1">Icons</h5>
                  <p className="text-muted small mb-0">
                    This theme uses <a href="https://feathericons.com" target="_blank" rel="noopener">Feather Icons</a>{' '}
                    throughout &mdash; the full set ({ICONS.length}) is below.
                  </p>
                </div>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Filter icons…"
                  style={{ maxWidth: 220 }}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <div className="icon-grid">
                {shown.map(({ name, Cmp }) => (
                  <div className="icon-tile" key={name}>
                    <Cmp />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
              {shown.length === 0 && (
                <p className="text-muted small text-center mt-3 mb-0">No icons match that filter.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="row g-2 mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Buttons</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <button type="button" className="btn btn-primary">Primary</button>
                <button type="button" className="btn btn-secondary">Secondary</button>
                <button type="button" className="btn btn-success">Success</button>
                <button type="button" className="btn btn-danger">Danger</button>
                <button type="button" className="btn btn-warning">Warning</button>
                <button type="button" className="btn btn-info">Info</button>
                <button type="button" className="btn btn-light">Light</button>
                <button type="button" className="btn btn-dark">Dark</button>
              </div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <button type="button" className="btn btn-outline-primary">Primary</button>
                <button type="button" className="btn btn-outline-secondary">Secondary</button>
                <button type="button" className="btn btn-outline-success">Success</button>
                <button type="button" className="btn btn-outline-danger">Danger</button>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <button type="button" className="btn btn-primary btn-sm">Small</button>
                <button type="button" className="btn btn-primary">Default</button>
                <button type="button" className="btn btn-primary btn-lg">Large</button>
                <button type="button" className="btn btn-primary" disabled>Disabled</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges & Alerts */}
      <div className="row g-2 mb-3">
        <div className="col-xl-5">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Badges</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge text-bg-primary">Primary</span>
                <span className="badge text-bg-secondary">Secondary</span>
                <span className="badge text-bg-success">Success</span>
                <span className="badge text-bg-danger">Danger</span>
                <span className="badge text-bg-warning">Warning</span>
                <span className="badge text-bg-info">Info</span>
                <span className="badge text-bg-light">Light</span>
                <span className="badge text-bg-dark">Dark</span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge rounded-pill text-bg-primary">Primary</span>
                <span className="badge rounded-pill text-bg-success">Success</span>
                <span className="badge rounded-pill text-bg-danger">Danger</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-7">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Alerts</h5>
              <div className="alert alert-success" role="alert">A success alert &mdash; well done!</div>
              <div className="alert alert-warning" role="alert">A warning alert &mdash; check yourself.</div>
              <div className="alert alert-danger mb-0" role="alert">A danger alert.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      <div className="row g-2 mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Form Controls</h5>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="showcaseText">Text input</label>
                    <input type="text" className="form-control" id="showcaseText" placeholder="Jane Doe" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="showcaseEmail">Email input</label>
                    <input type="email" className="form-control" id="showcaseEmail" placeholder="jane@example.com" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="showcaseSelect">Select</label>
                    <select className="form-select" id="showcaseSelect">
                      <option>Option one</option>
                      <option>Option two</option>
                      <option>Option three</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="showcaseRange">Range</label>
                    <input type="range" className="form-range" id="showcaseRange" />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="showcaseCheck" defaultChecked />
                      <label className="form-check-label" htmlFor="showcaseCheck">Checkbox</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="showcaseRadio" id="showcaseRadio1" defaultChecked />
                      <label className="form-check-label" htmlFor="showcaseRadio1">Radio one</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
