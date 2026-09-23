/* ---------- DATA / STATS / LIST ---------- */
function renderStats(all) {
  document.getElementById("stat-total").textContent = all.length;
  const byNiche = {},
    byStage = {};
  all.forEach((d) => {
    const n = d.niche || "(kosong)",
      s = d.stage || "(kosong)";
    byNiche[n] = (byNiche[n] || 0) + 1;
    byStage[s] = (byStage[s] || 0) + 1;
  });
  const nicheHtml =
    Object.entries(byNiche)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([k, v]) =>
          `<div class="stat-row"><span>${esc(k)}</span><b>${v}</b></div>`,
      )
      .join("") || '<div class="hint">-</div>';
  const stageHtml =
    Object.entries(byStage)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([k, v]) =>
          `<div class="stat-row"><span>${esc(k)}</span><b>${v}</b></div>`,
      )
      .join("") || '<div class="hint">-</div>';
  document.getElementById("stat-niche").innerHTML = nicheHtml;
  document.getElementById("stat-stage").innerHTML = stageHtml;
}

function renderList(all) {
  const el = document.getElementById("list");
  if (!all.length) {
    el.innerHTML = '<div class="empty">Belum ada data.</div>';
    return;
  }
  el.innerHTML = all
    .map(
      (d) => `
    <div class="entry">
      <div class="top">
        <span><b>${esc(d.stage)}</b> — <span class="tag">${esc(d.niche)}</span></span>
        <button class="ghost" onclick="removeEntry('${d.id}')">Hapus</button>
      </div>
      <div class="meta">
        Operator (${d.operatorCount ?? (d.operators || []).length}): ${esc((d.operators || []).join(", ")) || "-"}<br>
        Player: ${esc((d.players || []).join(", ")) || "-"}<br>
        Diinput oleh: ${esc(d.admin || "-")}
      </div>
    </div>
  `,
    )
    .join("");
}

window.removeEntry = async function (id) {
  if (!clearsRef) {
    alert("Firebase belum terhubung.");
    return;
  }
  try {
    await clearsRef.doc(id).delete();
  } catch (e) {
    console.error(e);
    alert("Gagal menghapus data.");
  }
};

document.getElementById("btn-submit").addEventListener("click", async () => {
  const stage = document.getElementById("f-stage").value.trim();
  const niche = document.getElementById("f-niche").value.trim();
  const opcount = parseInt(document.getElementById("f-opcount").value, 10) || 0;
  const operators = lines(document.getElementById("f-ops").value);
  const players = lines(document.getElementById("f-players").value);
  if (!stage || !niche) {
    alert("Stage dan Niche wajib diisi.");
    return;
  }
  if (!clearsRef) {
    alert("Firebase belum terhubung, data tidak bisa disimpan.");
    return;
  }

  try {
    await clearsRef.add({
      stage,
      niche,
      operatorCount: opcount,
      operators,
      players,
      admin: currentUser(),
      createdAt: Date.now(),
    });
    document.getElementById("f-stage").value = "";
    document.getElementById("f-niche").value = "";
    document.getElementById("f-opcount").value = "";
    document.getElementById("f-ops").value = "";
    document.getElementById("f-players").value = "";
  } catch (e) {
    console.error(e);
    alert("Gagal menyimpan data. Cek koneksi & konfigurasi Firebase.");
  }
});
