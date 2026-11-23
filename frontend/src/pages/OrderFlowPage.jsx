import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, RotateCcw, ArrowRight } from 'react-feather'
import BpmnViewer from 'bpmn-js/lib/Viewer'
import * as bootstrap from 'bootstrap'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import api from '../services/api'

const TOTAL_STEPS = 5

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

export default function OrderFlowPage() {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const markersRef = useRef([])
  const popoverRef = useRef(null)
  const [current, setCurrent] = useState(1)
  const [busy, setBusy] = useState(false)

  const applyStatus = (data) => {
    const viewer = viewerRef.current
    if (!viewer) return
    const canvas = viewer.get('canvas')
    markersRef.current.forEach((m) => {
      try { canvas.removeMarker(m.id, m.cls) } catch (e) { /* element may not exist */ }
    })
    markersRef.current = []
    Object.keys(data.elementStatuses).forEach((elementId) => {
      const cls = 'bpmn-status-' + data.elementStatuses[elementId].toLowerCase()
      try {
        canvas.addMarker(elementId, cls)
        markersRef.current.push({ id: elementId, cls })
      } catch (e) { /* element id not in diagram */ }
    })
    setCurrent(data.currentStep)
  }

  const dismissPopover = () => {
    if (popoverRef.current) {
      popoverRef.current.dispose()
      popoverRef.current = null
    }
  }

  const showElementPopover = (element, gfx) => {
    api.get(`/orders/flow/elements/${encodeURIComponent(element.id)}`)
      .then(({ data: detail }) => {
        dismissPopover()
        const html = `<p class="pipeline-popover-muted mb-2">${escapeHtml(detail.description)}</p>` +
          `<div><strong>Typical time:</strong> ${escapeHtml(detail.typicalTime)}</div>`
        popoverRef.current = new bootstrap.Popover(gfx, {
          title: detail.title,
          content: html,
          html: true,
          trigger: 'manual',
          placement: 'top',
          container: 'body',
          customClass: 'pipeline-popover',
        })
        popoverRef.current.show()
      })
      .catch(() => { /* no detail for sequence flows */ })
  }

  useEffect(() => {
    let cancelled = false
    const viewer = new BpmnViewer({ container: containerRef.current })
    viewerRef.current = viewer

    const onDocClick = (domEvent) => {
      if (popoverRef.current && !containerRef.current.contains(domEvent.target)) {
        dismissPopover()
      }
    }

    fetch('/bpmn/order-fulfillment.bpmn')
      .then((r) => r.text())
      .then((xml) => viewer.importXML(xml))
      .then(() => {
        if (cancelled) return
        viewer.get('canvas').zoom('fit-viewport')
        viewer.get('eventBus').on('element.click', (event) => {
          const gfx = viewer.get('elementRegistry').getGraphics(event.element)
          if (gfx) showElementPopover(event.element, gfx)
        })
        document.addEventListener('click', onDocClick)
        return api.get('/orders/flow/status', { params: { currentStep: 1 } })
      })
      .then((res) => { if (!cancelled && res) applyStatus(res.data) })
      .catch(() => {
        if (!cancelled && containerRef.current) {
          containerRef.current.textContent = 'Unable to load the process diagram.'
        }
      })

    return () => {
      cancelled = true
      document.removeEventListener('click', onDocClick)
      dismissPopover()
      viewer.destroy()
    }
  }, [])

  const isDone = current >= TOTAL_STEPS

  const advance = () => {
    if (isDone) return
    setBusy(true)
    api.get('/orders/flow/status', { params: { currentStep: current + 1 } })
      .then(({ data }) => applyStatus(data))
      .finally(() => setBusy(false))
  }

  const reset = () => {
    api.get('/orders/flow/status', { params: { currentStep: 1 } })
      .then(({ data }) => applyStatus(data))
  }

  return (
    <div>
      <div className="page-header">
        <nav className="breadcrumb-trail">
          <Link to="/dashboard"><Home /> Dashboard</Link>
          <span>/</span>
          <span>Orders</span>
          <span>/</span>
          <span>Order Flow (BPMN)</span>
        </nav>
        <h1>Order Flow (BPMN)</h1>
        <p className="text-muted">
          Same order-fulfillment flow as the Fulfillment Pipeline demo, rendered from a real BPMN 2.0
          diagram (bpmn-js) with live status pulled from the server as you advance.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="order-flow-legend">
            <span className="legend-item"><span className="legend-dot legend-dot-complete"></span> Completed</span>
            <span className="legend-item"><span className="legend-dot legend-dot-active"></span> Active</span>
            <span className="legend-item"><span className="legend-dot legend-dot-pending"></span> Pending</span>
          </div>

          <div className="order-flow-canvas" ref={containerRef} data-total-steps={TOTAL_STEPS}></div>

          <div className="text-center mt-3">
            <button type="button" className="btn btn-outline-secondary me-2" onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button type="button" className="btn btn-primary" disabled={isDone || busy} onClick={advance}>
              <span>{isDone ? 'Order delivered' : busy ? 'Processing…' : 'Advance to next step'}</span> <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
