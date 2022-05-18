const listContainer = document.querySelector('.list-container')
const cartContainer = document.querySelector('.cart-container')
const cotizadorBtn = document.querySelector('.cotizadorBtn')
const BASE_URL = 'http://127.0.0.1:3333/api/client'
const S3_URL = 'https://torniweb.s3.amazonaws.com/'
let ALL_PRODUCTS = []
let MY_CART = []
window.onload =  async () => {
  const data = await fetch(`${BASE_URL}/products`).then(res => res.json())
  console.log('data', data)

  if(!data) {
    return
  }
  if(!Array.isArray(data)) return
  showProducts(data)
  ALL_PRODUCTS = data
}

function ProductComponent(product){
  return `
      <div class="card">
          <img width="100" src="${S3_URL}${product.icon_image}" alt="movie">
          <p>${product.name}</p>
          <div>
            <button class="btn-torniweb" onClick="addProductToCart(${product.id})">
            Agregar
            </button>
          </div>
      </div>
  `
}

function addProductToCart(id) {
  const productSelected = ALL_PRODUCTS.filter(x => x.id == id)[0]
  console.log('pS', productSelected)
  MY_CART = [...MY_CART, {...productSelected, quantity: 1}]
  showCart(MY_CART)
}

function handleCartChange(id, operation) {
  console.log('id', id)
  console.log('id', product)
  const productSelected = MY_CART.filter(x => x.id == id)[0]
  if(operation === 'add') {
    productSelected.quantity += 1
  }
  else {
    productSelected.quantity -= 1

  }
  if(productSelected.quantity == 0) {
    MY_CART = MY_CART.filter(x => id != x.id)
    showCart(MY_CART)
    return
  }
  console.log('pS', productSelected)
  MY_CART = [...MY_CART = MY_CART.filter(x => id != x.id), {...productSelected}]
  showCart(MY_CART)
}


function showCart(cart) {
  const productsData = cart.map((product) =>CartComponent(product));
  cartContainer.classList.add("active");
  cartContainer.innerHTML = productsData.join('');
}

function showProducts(products) {
  const productsData = products.map((product) =>ProductComponent(product));
  listContainer.classList.add("active");
  listContainer.innerHTML = productsData.join('');
}

function CartComponent(product) {
  return `
  <div class="card card-list">
      <img width="100" src="${S3_URL}${product.icon_image}" alt="movie">
      <p>${product.name}</p>
      <div class="d-flex">
        <input id="${product.id}" style="width: 80px" value="${product.quantity}" />
      </div>
  </div>
`
}

cotizadorBtn.addEventListener('click', ()=> {
  MY_CART.forEach(product => {
    console.log(document.getElementById(`${product.id}`).value)
  })
})