const DB = {
  produk: JSON.parse(localStorage.getItem('produk') || 'null') || [
    { id_produk: 'P001', nama_produk: 'Indomie Goreng', harga: 3500, stok: 100 },
    { id_produk: 'P002', nama_produk: 'Teh Botol', harga: 5000, stok: 80 },
    { id_produk: 'P003', nama_produk: 'Roti Tawar', harga: 15000, stok: 30 }
  ],
  penjualanHeader: JSON.parse(localStorage.getItem('penjualanHeader') || '[]'),
  penjualanDetail: JSON.parse(localStorage.getItem('penjualanDetail') || '[]')
};

function simpanKeStorage() {
  localStorage.setItem('produk', JSON.stringify(DB.produk));
  localStorage.setItem('penjualanHeader', JSON.stringify(DB.penjualanHeader));
  localStorage.setItem('penjualanDetail', JSON.stringify(DB.penjualanDetail));
}

function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

function tampilkanToast(pesan, error) {
  const el = document.getElementById('toast');
  el.textContent = pesan;
  el.className = 'toast show' + (error ? ' error' : '');
  setTimeout(function () {
    el.className = 'toast';
  }, 2500);
}

function bukaModal(id) {
  document.getElementById(id).classList.add('show');
}

function tutupModal(id) {
  document.getElementById(id).classList.remove('show');
}