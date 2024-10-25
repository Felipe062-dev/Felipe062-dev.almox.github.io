// Carrega os produtos do localStorage quando a página é carregada
document.addEventListener("DOMContentLoaded", loadProducts);

// Adiciona um novo produto à lista
function addProduct() {
  const productId = document.getElementById("product-id").value;
  const productName = document.getElementById("product-name").value;
  const productQuantity = parseInt(document.getElementById("product-quantity").value);

  if (productId && productName && productQuantity > 0) {
    const products = getProductsFromStorage();
    products.push({ id: productId, name: productName, quantity: productQuantity });
    saveProductsToStorage(products);
    renderProductList();
    clearInputs();
  }
}

// Limpa os campos de entrada
function clearInputs() {
  document.getElementById("product-id").value = '';
  document.getElementById("product-name").value = '';
  document.getElementById("product-quantity").value = '';
}

// Modifica a quantidade do produto
function changeQuantity(button, amount) {
  const product = button.closest(".product");
  const productId = product.querySelector(".product-id").textContent;
  const products = getProductsFromStorage();

  const productData = products.find(p => p.id === productId);
  if (productData) {
    productData.quantity += amount;

    if (productData.quantity < 0) {
      productData.quantity = 0; // Não permitir quantidade negativa
    }

    saveProductsToStorage(products);
    renderProductList();
  }
}

// Edita um produto
function editProduct(button) {
  const product = button.closest(".product");
  const productId = product.querySelector(".product-id").textContent;
  const productName = product.querySelector(".product-name").textContent;
  const productQuantity = parseInt(product.querySelector(".product-quantity span").textContent);

  document.getElementById("product-id").value = productId;
  document.getElementById("product-name").value = productName;
  document.getElementById("product-quantity").value = productQuantity;

  // Remove o produto atual antes de adicionar novamente
  deleteProduct(button);
}

// Exclui um produto
function deleteProduct(button) {
  const product = button.closest(".product");
  const productId = product.querySelector(".product-id").textContent;
  let products = getProductsFromStorage();

  products = products.filter(p => p.id !== productId);
  saveProductsToStorage(products);
  renderProductList();
}

// Carrega os produtos do localStorage
function loadProducts() {
  const products = getProductsFromStorage();
  products.forEach(product => {
    renderProduct(product.id, product.name, product.quantity);
  });
}

// Renderiza a lista de produtos
function renderProductList() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Limpa a lista atual
  const products = getProductsFromStorage();
  products.forEach(product => {
    renderProduct(product.id, product.name, product.quantity);
  });
}

// Renderiza um produto na lista
function renderProduct(id, name, quantity) {
  const productList = document.getElementById("product-list");
  
  const product = document.createElement("div");
  product.classList.add("product");
  product.innerHTML = `
    <span class="product-id">${id}</span>
    <span class="product-name">${name}</span>
    <div class="product-quantity">
      <button onclick="changeQuantity(this, -1)">-</button>
      <span>${quantity}</span>
      <button onclick="changeQuantity(this, 1)">+</button>
      <button onclick="editProduct(this)">Editar</button>
      <button onclick="deleteProduct(this)">Excluir</button>
    </div>
  `;

  productList.appendChild(product);
  checkLowStock(product);
}

// Verifica se o estoque está abaixo de 5 e aplica a classe de alerta
function checkLowStock(product) {
  const quantity = parseInt(product.querySelector(".product-quantity span").textContent);
  
  if (quantity < 5) {
    product.classList.add("low-stock");
  } else {
    product.classList.remove("low-stock");
  }
}

// Obtém produtos do localStorage
function getProductsFromStorage() {
  const products = localStorage.getItem("products");
  return products ? JSON.parse(products) : [];
}

// Salva produtos no localStorage
function saveProductsToStorage(products) {
  localStorage.setItem("products", JSON.stringify(products));
}
function openReportPage() {
  window.open('relatorio.html', '_blank');
}

// Exclui um produto com confirmação
function deleteProduct(button) {
  const confirmacao = confirm("Tem certeza de que deseja editar ou excluir este item?");
  
  if (confirmacao) {
    const product = button.closest(".product");
    const productId = product.querySelector(".product-id").textContent;
    let products = getProductsFromStorage();

    products = products.filter(p => p.id !== productId);
    saveProductsToStorage(products);
    renderProductList();
    alert("Produto excluído com sucesso!");
  } else {
    alert("Operação cancelada.");
  }
}
