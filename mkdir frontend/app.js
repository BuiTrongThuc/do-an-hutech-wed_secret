const API_URL = 'http://localhost:3000';

// ======= TRANG DANH SÁCH (index.html) =======

async function loadProductsToHome() {
  const productGrid = document.querySelector('.product-grid');
  if (!productGrid) return; // không phải trang index

  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error('Lỗi khi gọi API /products');
    const products = await res.json();

    productGrid.innerHTML = '';

    products.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'product-card';

      const imageUrl =
        p.ID === 1
          ? 'https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/Products/Images/44/309604/dell-gaming-alienware-m15-r7-i7-71008ea0vn-thumb-600x600.jpg'
          : p.ID === 2
          ? 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=60'
          : p.ID === 3
          ? 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=500&q=60'
          : 'https://product.hstatic.net/200000722513/product/g-pro-x-superlight-black_7db95420286c472887cc399d94921443_1024x1024.jpg';

      card.innerHTML = `
        <div class="card-img">
          <img src="${imageUrl}" alt="${p.NAME}">
        </div>
        <div class="card-info">
          <h3>${p.NAME}</h3>
          <p class="specs">${p.description || ''}</p>
          <div class="price-action">
            <span class="price">${Number(p.price).toLocaleString('vi-VN')}đ</span>
            <a href="detail.html?id=${encodeURIComponent(p.ID)}" class="btn-buy">Mua Ngay</a>
          </div>
        </div>
      `;

      productGrid.appendChild(card);
    });
  } catch (err) {
    console.error('Lỗi khi load products:', err);
  }
}

// ======= TRANG CHI TIẾT (detail.html) =======

async function loadProductDetail() {
  const titleEl = document.querySelector('.product-title');
  if (!titleEl) return; // không phải detail.html

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  console.log('ID trên URL (detail):', id);

  if (!id) {
    alert('Không có mã sản phẩm trên URL');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    console.log('Gọi API:', `${API_URL}/products/${id}`, 'status', res.status);
    if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
    const p = await res.json();

    // Với kết quả SELECT hiện tại, backend đang trả ra field ID, NAME (chữ hoa)
    const name = p.NAME || p.name;
    const price = p.price;
    const desc = p.description;

    titleEl.textContent = name;

    const priceEl = document.querySelector('.product-price');
    if (priceEl) {
      priceEl.textContent = `${Number(price).toLocaleString('vi-VN')}đ`;
    }

    const descEl = document.querySelector('.product-desc p');
    if (descEl) {
      descEl.textContent = desc || '';
    }

    const mainImg = document.querySelector('.main-image img');
    if (mainImg) {
      if (p.ID === 1 || p.id === 1) {
        mainImg.src =
          'https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/Products/Images/44/309604/dell-gaming-alienware-m15-r7-i7-71008ea0vn-thumb-600x600.jpg';
      } else if (p.ID === 2 || p.id === 2) {
        mainImg.src =
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=60';
      } else if (p.ID === 3 || p.id === 3) {
        mainImg.src =
          'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=60';
      } else {
        mainImg.src =
          'https://product.hstatic.net/200000722513/product/g-pro-x-superlight-black_7db95420286c472887cc399d94921443_1024x1024.jpg';
      }
      mainImg.alt = name;
    }
  } catch (err) {
    console.error(err);
    alert('Không tải được thông tin sản phẩm');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProductsToHome();
  loadProductDetail();
});