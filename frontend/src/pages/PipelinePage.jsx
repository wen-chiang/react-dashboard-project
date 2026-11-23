import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Home, RotateCcw, ArrowRight } from 'react-feather'
import * as bootstrap from 'bootstrap'
import api from '../services/api'

const TOTAL_STEPS = 5

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

export default function PipelinePage() {
  const [current, setCurrent] = useState(1)
  const rootRef = useRef(null)

  const stepClass = (step) => {
    if (step < current) return 'is-complete'
    if (step === current) return 'is-active'
    return ''
  }

  const isDone = current >= TOTAL_STEPS

  // Bootstrap popovers on each clickable node, content fetched once from the server.
  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll('.pipeline-node-clickable') ?? []
    const popovers = []
    nodes.forEach((node) => {
      api.get(`/pipeline/steps/${encodeURIComponent(node.dataset.stepId)}`)
        .then(({ data: detail }) => {
          const html = `<p class="pipeline-popover-muted mb-2">${escapeHtml(detail.description)}</p>` +
            `<div><strong>Typical time:</strong> ${escapeHtml(detail.processTime)}</div>`
          popovers.push(new bootstrap.Popover(node, {
            title: detail.title,
            content: html,
            html: true,
            trigger: 'hover focus',
            placement: 'top',
            container: 'body',
            customClass: 'pipeline-popover',
            offset: [0, 16],
          }))
        })
        .catch(() => {})
    })
    return () => popovers.forEach((p) => p.dispose())
  }, [])

  return (
    <div>
      <div className="page-header">
        <nav className="breadcrumb-trail">
          <Link to="/dashboard"><Home /> Dashboard</Link>
          <span>/</span>
          <span>Orders</span>
          <span>/</span>
          <span>Fulfillment Pipeline</span>
        </nav>
        <h1>Fulfillment Pipeline</h1>
        <p className="text-muted">
          Demo widget &mdash; click "Advance" to step through, or hover any node for its detail
          (fetched from the server). Nothing here is wired to real order data.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="pipeline" id="pipeline" ref={rootRef}>
            <div className={`pipeline-step ${stepClass(1)}`} data-step="1">
              <div className="pipeline-node pipeline-node-clickable" data-step-id="1" role="button" tabIndex={0}>1</div>
              <h6>Order Placed</h6>
            </div>

            <div className={`pipeline-step pipeline-step-parallel ${stepClass(2)}`} data-step="2">
              <div className="pipeline-node">2</div>
              <div className="pipeline-parallel-label text-muted small">Runs in parallel</div>
              <div className="pipeline-parallel-group">
                <div className="pipeline-parallel-item">
                  <div className="pipeline-node pipeline-node-sm pipeline-node-clickable" data-step-id="2a" role="button" tabIndex={0}>2a</div>
                  <h6>Inventory Check</h6>
                </div>
                <div className="pipeline-parallel-item">
                  <div className="pipeline-node pipeline-node-sm pipeline-node-clickable" data-step-id="2b" role="button" tabIndex={0}>2b</div>
                  <h6>Payment Verification</h6>
                </div>
              </div>
            </div>

            <div className={`pipeline-step ${stepClass(3)}`} data-step="3">
              <div className="pipeline-node pipeline-node-clickable" data-step-id="3" role="button" tabIndex={0}>3</div>
              <h6>Ready to Ship</h6>
            </div>

            <div className={`pipeline-step ${stepClass(4)}`} data-step="4">
              <div className="pipeline-node pipeline-node-clickable" data-step-id="4" role="button" tabIndex={0}>4</div>
              <h6>Shipped</h6>
            </div>

            <div className={`pipeline-step ${stepClass(5)}`} data-step="5">
              <div className="pipeline-node pipeline-node-clickable" data-step-id="5" role="button" tabIndex={0}>5</div>
              <h6>Delivered</h6>
            </div>
          </div>

          <div className="text-center mt-3">
            <button type="button" className="btn btn-outline-secondary me-2" onClick={() => setCurrent(1)}>
              <RotateCcw /> Reset
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isDone}
              onClick={() => setCurrent((c) => Math.min(c + 1, TOTAL_STEPS))}
            >
              <span>{isDone ? 'Pipeline complete' : 'Advance to next step'}</span> <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
