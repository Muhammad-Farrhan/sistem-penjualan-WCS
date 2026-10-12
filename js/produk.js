function renderProduk(filter) {
  const tbody = document.getElementById('tblProduk');
  const kata = (filter || '').toLowerCase();

  const data = DB.produk.filter(function (p) {
    return (
      p.nama_produk.toLowerCase().indexOf(kata) !== -1 ||
      p.id_produk.toLowerCase().indexOf(kata) !== -1
    );
  });

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Belum ada produk</td></tr>';
    return;
  }

  let html = '';
  data.forEach(function (p) {
    let stokClass = 'ok';
    if (p.stok === 0) stokClass = 'out';
    else if (p.stok < 10) stokClass = 'low';

    html += '<tr>';
    html += '<td><span class="badge">' + p.id_produk + '</span></td>';
    html += '<td>' + p.nama_produk + '</td>';
    html += '<td class="num">' + formatRupiah(p.harga) + '</td>';
    html += '<td class="num"><span class="badge-stock ' + stokClass + '">' + p.stok + '</span></td>';
    html += '<td class="act">';
    html += '<div class="act-wrap">';
    html += '<button class="btn btn-warning btn-sm" onclick="editProduk(\'' + p.id_produk + '\')">Edit</button>';
    html += '<button class="btn btn-danger btn-sm" onclick="hapusProduk(\'' + p.id_produk + '\')">Hapus</button>';
    html += '</div>';
    html += '</td>';
    html += '</tr>';
  });
  tbody.innerHTML = html;
}

function buatIdProdukBaru() {
  let max = 0;
  DB.produk.forEach(function (p) {
    const n = parseInt(p.id_produk.replace(/\D/g, '')) || 0;
    if (n > max) max = n;
  });
  return 'P' + String(max + 1).padStart(3, '0');
}

function bukaFormProduk(id) {
  const title = document.getElementById('modalProdukTitle');

  if (id) {
    const p = DB.produk.find(function (x) { return x.id_produk === id; });
    if (!p) return;
    title.textContent = 'Edit Produk';
    document.getElementById('pId').value = p.id_produk;
    document.getElementById('pNama').value = p.nama_produk;
    document.getElementById('pHarga').value = p.harga;
    document.getElementById('pStok').value = p.stok;
  } else {
    title.textContent = 'Tambah Produk';
    document.getElementById('pId').value = buatIdProdukBaru();
    document.getElementById('pNama').value = '';
    document.getElementById('pHarga').value = '';
    document.getElementById('pStok').value = '';
  }
  bukaModal('modalProduk');
}

function simpanProduk() {
  const id = document.getElementById('pId').value;
  const nama = document.getElementById('pNama').value.trim();
  const harga = Number(document.getElementById('pHarga').value);
  const stok = Number(document.getElementById('pStok').value);

  if (!nama) return tampilkanToast('Nama produk wajib diisi', true);
  if (isNaN(harga) || harga < 0) return tampilkanToast('Harga tidak valid', true);
  if (isNaN(stok) || stok < 0) return tampilkanToast('Stok tidak valid', true);

  const idx = DB.produk.findIndex(function (p) { return p.id_produk === id; });

  if (idx >= 0) {
    DB.produk[idx] = { id_produk: id, nama_produk: nama, harga: harga, stok: stok };
    tampilkanToast('Produk berhasil diperbarui');
  } else {
    DB.produk.push({ id_produk: id, nama_produk: nama, harga: harga, stok: stok });
    tampilkanToast('Produk berhasil ditambahkan');
  }

  simpanKeStorage();
  renderProduk();
  tutupModal('modalProduk');
}

function editProduk(id) {
  bukaFormProduk(id);
}

function hapusProduk(id) {
  const dipakai = DB.penjualanDetail.some(function (d) { return d.id_produk === id; });
  if (dipakai) {
    return tampilkanToast('Produk sudah dipakai di transaksi, tidak bisa dihapus', true);
  }

  if (!confirm('Hapus produk ' + id + '?')) return;

  DB.produk = DB.produk.filter(function (p) { return p.id_produk !== id; });
  simpanKeStorage();
  renderProduk();
  tampilkanToast('Produk dihapus');
}