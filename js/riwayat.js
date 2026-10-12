function renderRiwayat(filter) {
  const tbody = document.getElementById('tblRiwayat');
  const kata = (filter || '').toLowerCase();

  const data = DB.penjualanHeader.filter(function (h) {
    return (
      h.id_penjualan.toLowerCase().indexOf(kata) !== -1 ||
      h.id_pelanggan.toLowerCase().indexOf(kata) !== -1
    );
  });

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Belum ada transaksi</td></tr>';
    return;
  }

  let html = '';
  data.forEach(function (h) {
    html += '<tr>';
    html += '<td><span class="badge">' + h.id_penjualan + '</span></td>';
    html += '<td>' + h.tanggal + '</td>';
    html += '<td>' + h.id_pelanggan + '</td>';
    html += '<td class="num">' + formatRupiah(h.total) + '</td>';
    html += '<td class="act">';
    html += '<div class="act-wrap">';
    html += '<button class="btn btn-secondary btn-sm" onclick="lihatTransaksi(\'' + h.id_penjualan + '\')">Lihat</button>';
    html += '<button class="btn btn-danger btn-sm" onclick="hapusTransaksi(\'' + h.id_penjualan + '\')">Hapus</button>';
    html += '</div>';
    html += '</td>';
    html += '</tr>';
  });
  tbody.innerHTML = html;
}

function lihatTransaksi(id) {
  const header = DB.penjualanHeader.find(function (h) { return h.id_penjualan === id; });
  if (!header) return;

  const detail = DB.penjualanDetail.filter(function (d) { return d.id_penjualan === id; });

  let baris = '';
  detail.forEach(function (d) {
    const p = DB.produk.find(function (x) { return x.id_produk === d.id_produk; });
    baris += '<tr>';
    baris += '<td><span class="badge">' + d.id_produk + '</span></td>';
    baris += '<td>' + (p ? p.nama_produk : '-') + '</td>';
    baris += '<td class="num">' + d.qty + '</td>';
    baris += '<td class="num">' + formatRupiah(d.harga_satuan) + '</td>';
    baris += '<td class="num">' + formatRupiah(d.subtotal) + '</td>';
    baris += '</tr>';
  });

  const konten =
    '<div class="trx-info">' +
      '<div class="trx-info-row"><span class="trx-info-label">ID Penjualan</span><span class="trx-info-value">' + header.id_penjualan + '</span></div>' +
      '<div class="trx-info-row"><span class="trx-info-label">Tanggal</span><span class="trx-info-value">' + header.tanggal + '</span></div>' +
      '<div class="trx-info-row"><span class="trx-info-label">Pelanggan</span><span class="trx-info-value">' + header.id_pelanggan + '</span></div>' +
    '</div>' +
    '<div class="trx-table-wrap">' +
      '<table class="table table-compact">' +
        '<thead><tr>' +
          '<th>Produk</th>' +
          '<th>Nama</th>' +
          '<th class="num">Qty</th>' +
          '<th class="num">Harga</th>' +
          '<th class="num">Subtotal</th>' +
        '</tr></thead>' +
        '<tbody>' + baris + '</tbody>' +
      '</table>' +
    '</div>' +
    '<div class="trx-total">' +
      '<span class="trx-total-label">Total Pembayaran</span>' +
      '<span class="trx-total-value">' + formatRupiah(header.total) + '</span>' +
    '</div>';

  document.getElementById('viewTrxContent').innerHTML = konten;
  bukaModal('modalViewTrx');
}

function hapusTransaksi(id) {
  if (!confirm('Hapus transaksi ' + id + '? Stok akan dikembalikan.')) return;

  DB.penjualanDetail
    .filter(function (d) { return d.id_penjualan === id; })
    .forEach(function (d) {
      const p = DB.produk.find(function (x) { return x.id_produk === d.id_produk; });
      if (p) p.stok += d.qty;
    });

  DB.penjualanHeader = DB.penjualanHeader.filter(function (h) {
    return h.id_penjualan !== id;
  });

  DB.penjualanDetail = DB.penjualanDetail.filter(function (d) {
    return d.id_penjualan !== id;
  });

  simpanKeStorage();
  renderRiwayat();
  function renderRiwayat(filter) {
  const tbody = document.getElementById('tblRiwayat');
  const kata = (filter || '').toLowerCase();

  const data = DB.penjualanHeader.filter(function (h) {
    return (
      h.id_penjualan.toLowerCase().indexOf(kata) !== -1 ||
      h.id_pelanggan.toLowerCase().indexOf(kata) !== -1
    );
  });

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Belum ada transaksi</td></tr>';
    return;
  }

  let html = '';
  data.forEach(function (h) {
    html += '<tr>';
    html += '<td><span class="badge">' + h.id_penjualan + '</span></td>';
    html += '<td>' + h.tanggal + '</td>';
    html += '<td>' + h.id_pelanggan + '</td>';
    html += '<td class="num">' + formatRupiah(h.total) + '</td>';
    html += '<td class="act">';
    html += '<button class="btn btn-secondary btn-sm" onclick="lihatTransaksi(\'' + h.id_penjualan + '\')">Lihat</button>';
    html += '<button class="btn btn-danger btn-sm" onclick="hapusTransaksi(\'' + h.id_penjualan + '\')">Hapus</button>';
    html += '</td>';
    html += '</tr>';
  });
  tbody.innerHTML = html;
}
  tampilkanToast('Transaksi dihapus');
}