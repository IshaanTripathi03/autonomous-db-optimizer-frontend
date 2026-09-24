const BASE_URL = "http://localhost:8080";

export async function getApprovals() {
  const res = await fetch(`${BASE_URL}/api/approvals`);
  if (!res.ok) throw new Error(`Failed to fetch approvals: ${res.status}`);
  return res.json();
}

export async function approveRecommendation(id) {
  const res = await fetch(`${BASE_URL}/api/approvals/${id}/approve`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to approve: ${res.status}`);
  return res.json();
}

export async function rejectRecommendation(id) {
  const res = await fetch(`${BASE_URL}/api/approvals/${id}/reject`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to reject: ${res.status}`);
  return res.json();
}
