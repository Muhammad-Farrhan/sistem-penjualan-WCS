let barisDetail = [];

function resetFormTransaksi() {
  document.getElementById('trxIdPenjualan').value = buatIdPenjualanBaru();
  document.getElementById('trxTanggal').value = new Date().toISOString().slice(0, 10);
  document.getElementById('trxPelanggan').value = '';
  barisDetail = [{ id_produk: '', qty: 1, harga_satuan: 0 }];
  renderDetailTransaksi();
}

function buatIdPenjualanBaru() {
  let max = 0;
  DB.penjualanHeader.forEach(function (h) {
    const n = parseInt(h.id_penjualan.replace(/\D/g, '')) || 0;
    if (n > max) max = n;
  });
  return 'INV' + String(max + 1).padStart(4, '0');
}

function renderDetailTransaksi() {
  const tbody = document.getElementById('tblDetail');
  let html = '';

  barisDetail.forEach(function (r, i) {
    let opsi = '<option value="">Pilih Produk</option>';
    DB.produk.forEach(function (p) {
      const selected = p.id_produk === r.id_produk ? 'selected' : '';
      opsi += '<option value="' + p.id_produk + '" ' + selected + '>' +
        p.id_produk + ' - ' + p.nama_produk + '</option>';
    });

    html += '<tr>';
    html += '<td><select onchange="ubahProdukBaris(' + i + ', this.value)">' + opsi + '</select></td>';
    html += '<td class="num"><input type="number" min="1" value="' + r.qty + '" onchange="ubahQtyBaris(' + i + ', this.value)"></td>';
    html += '<td class="num"><input type="number" value="' + r.harga_satuan + '" readonly></td>';
    html += '<td class="num">' + formatRupiah(r.qty * r.harga_satuan) + '</td>';
    html += '<td class="act"><div class="act-wrap">';
    html += '<button class="btn btn-danger btn-sm" onclick="hapusBarisDetail(' + i + ')">Hapus</button>';
    html += '</div></td>';
    html += '</tr>';
  });

  tbody.innerHTML = html;
  hitungTotalTransaksi();
}

function tambahBarisDetail() {
  barisDetail.push({ id_produk: '', qty: 1, harga_satuan: 0 });
  renderDetailTransaksi();
}

function hapusBarisDetail(i) {
  barisDetail.splice(i, 1);
  renderDetailTransaksi();
}

function ubahProdukBaris(i, idProduk) {
  const p = DB.produk.find(function (x) { return x.id_produk === idProduk; });
  barisDetail[i].id_produk = idProduk;
  barisDetail[i].harga_satuan = p ? p.harga : 0;
  renderDetailTransaksi();
}

function ubahQtyBaris(i, val) {
  const qty = parseInt(val) || 1;
  barisDetail[i].qty = qty < 1 ? 1 : qty;
  renderDetailTransaksi();
}

function hitungTotalTransaksi() {
  let total = 0;
  barisDetail.forEach(function (r) {
    total += r.qty * r.harga_satuan;
  });
  document.getElementById('trxTotal').textContent = formatRupiah(total);
  return total;
}

function simpanTransaksi() {
  const id = document.getElementById('trxIdPenjualan').value;
  const tanggal = document.getElementById('trxTanggal').value;
  const pelanggan = document.getElementById('trxPelanggan').value.trim();

  if (!tanggal) return tampilkanToast('Tanggal wajib diisi', true);
  if (!pelanggan) return tampilkanToast('ID Pelanggan wajib diisi', true);

  const barisValid = barisDetail.filter(function (r) {
    return r.id_produk && r.qty > 0;
  });

  if (barisValid.length === 0) {
    return tampilkanToast('Minimal 1 produk harus diisi', true);
  }

  for (let i = 0; i < barisValid.length; i++) {
    const r = barisValid[i];
    const p = DB.produk.find(function (x) { return x.id_produk === r.id_produk; });
    if (!p) return tampilkanToast('Produk ' + r.id_produk + ' tidak ditemukan', true);
    if (p.stok < r.qty) {
      return tampilkanToast('Stok ' + p.nama_produk + ' tidak cukup', true);
    }
  }

  const total = hitungTotalTransaksi();

  DB.penjualanHeader.push({
    id_penjualan: id,
    tanggal: tanggal,
    id_pelanggan: pelanggan,
    total: total
  });

  barisValid.forEach(function (r, idx) {
    DB.penjualanDetail.push({
      id_detail: id + '-' + String(idx + 1).padStart(2, '0'),
      id_penjualan: id,
      id_produk: r.id_produk,
      qty: r.qty,
      harga_satuan: r.harga_satuan,
      subtotal: r.qty * r.harga_satuan
    });

    const p = DB.produk.find(function (x) { return x.id_produk === r.id_produk; });
    p.stok -= r.qty;
  });

  simpanKeStorage();
  renderDetailTransaksi();
  tampilkanToast('Transaksi ' + id + ' berhasil disimpan');
  resetFormTransaksi();
}