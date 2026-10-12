const PAGE_INFO = {
  produk: {
    title: 'Manajemen Produk',
    sub: 'Kelola daftar barang dan stok tersedia'
  },
  transaksi: {
    title: 'Transaksi Penjualan',
    sub: 'Buat pesanan baru dan catat detail barang'
  },
  riwayat: {
    title: 'Riwayat Penjualan',
    sub: 'Lihat dan kelola transaksi yang pernah dibuat'
  }
};

function inisialisasiNavigasi() {
  const tombol = document.querySelectorAll('.nav-btn');
  tombol.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tombol.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      document.querySelectorAll('.tab-page').forEach(function (page) {
        page.classList.add('hidden');
      });
      document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');

      const info = PAGE_INFO[btn.dataset.tab];
      if (info) {
        document.getElementById('pageTitle').textContent = info.title;
        document.getElementById('pageSub').textContent = info.sub;
      }

      if (btn.dataset.tab === 'riwayat') renderRiwayat();
    });
  });
}

function inisialisasiEvent() {
  document.getElementById('btnTambahProduk').addEventListener('click', function () {
    bukaFormProduk(null);
  });

  document.getElementById('btnSimpanProduk').addEventListener('click', simpanProduk);
  document.getElementById('btnBatalProduk').addEventListener('click', function () {
    tutupModal('modalProduk');
  });

  document.getElementById('searchProduk').addEventListener('input', function (e) {
    renderProduk(e.target.value);
  });

  document.getElementById('btnTambahBaris').addEventListener('click', tambahBarisDetail);
  document.getElementById('btnResetTrx').addEventListener('click', resetFormTransaksi);
  document.getElementById('btnSimpanTrx').addEventListener('click', simpanTransaksi);

  document.getElementById('searchRiwayat').addEventListener('input', function (e) {
    renderRiwayat(e.target.value);
  });

  document.getElementById('btnTutupViewTrx').addEventListener('click', function () {
    tutupModal('modalViewTrx');
  });

  document.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', function () {
      tutupModal(el.dataset.close);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  inisialisasiNavigasi();
  inisialisasiEvent();
  renderProduk();
  resetFormTransaksi();
  renderRiwayat();
});