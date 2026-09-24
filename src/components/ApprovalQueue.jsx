import { useEffect, useState } from "react";
import { getApprovals, approveRecommendation, rejectRecommendation } from "../api/client";
import "./ApprovalQueue.css";

const STATUS_LABEL = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  APPLIED: "Applied",
  FAILED: "Failed",
};

function ApprovalQueue() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);

  async function loadApprovals() {
    try {
      setError(null);
      const data = await getApprovals();
      setApprovals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApprovals();
  }, []);

  async function handleAction(id, action) {
    setActingId(id);
    try {
      const fn = action === "approve" ? approveRecommendation : rejectRecommendation;
      const updated = await fn(id);
      setApprovals((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      setError(err.message);
    } finally {
      setActingId(null);
    }
  }

  if (loading) return <p className="queue-state">Loading approvals…</p>;
  if (error) return <p className="queue-state queue-error">Couldn't load approvals: {error}</p>;
  if (approvals.length === 0) {
    return (
      <p className="queue-state">
        No recommendations queued yet. The autonomous monitor queues one automatically when it
        detects a slow query.
      </p>
    );
  }

  return (
    <ul className="queue-list">
      {approvals.map((a) => {
        const rec = a.recommendation;
        const busy = actingId === a.id;
        return (
          <li key={a.id} className="queue-item" style={{ borderLeftColor: `var(--status-${a.status.toLowerCase()})` }}>
            <div className="queue-item-top">
              <span className="queue-table">{rec.tableName}</span>
              <span className="queue-status">{STATUS_LABEL[a.status] ?? a.status}</span>
            </div>

            <p className="queue-columns">
              {rec.indexType} on ({rec.columns.join(", ")})
            </p>

            <p className="queue-justification">{rec.justification}</p>

            {a.verificationResult && (
              <div className="queue-verification">
                <span>{a.verificationResult.executionTimeBeforeMs.toFixed(3)}ms</span>
                <span className="queue-verification-arrow">→</span>
                <span>{a.verificationResult.executionTimeAfterMs.toFixed(3)}ms</span>
                <span className="queue-verification-delta">
                  ({a.verificationResult.percentImprovement.toFixed(2)}% faster)
                </span>
              </div>
            )}

            {a.resultMessage && <p className="queue-result-message">{a.resultMessage}</p>}

            {a.status === "PENDING" && (
              <div className="queue-actions">
                <button
                  className="btn btn-approve"
                  disabled={busy}
                  onClick={() => handleAction(a.id, "approve")}
                >
                  {busy ? "Working…" : "Approve"}
                </button>
                <button
                  className="btn btn-reject"
                  disabled={busy}
                  onClick={() => handleAction(a.id, "reject")}
                >
                  {busy ? "Working…" : "Reject"}
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default ApprovalQueue;
