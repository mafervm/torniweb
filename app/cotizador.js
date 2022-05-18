const listContainer = document.querySelector('.list-container')
const cartContainer = document.querySelector('.cart-container')
const cotizadorBtn = document.querySelector('.cotizadorBtn')
const confirmModal = document.querySelector('#form-modal')
const formContact =  document.querySelector('#contact-form')
const BASE_URL = 'http://josue.ngrok.io/api/client'
const S3_URL = 'https://torniweb.s3.amazonaws.com/'
const ERROR_CODES = {
  '1' : 'Ingresa un número válido',
  '2' : 'Ingresa un número mayor a 0'
}
let ALL_PRODUCTS = []
let MY_CART = []
window.onload =  async () => {
  const data = await fetch(`${BASE_URL}/products`).then(res => res.json())
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
  MY_CART = [...MY_CART, {...productSelected, quantity: 1}]
  showCart(MY_CART)
}

function handleCartChange(id, operation) {
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

function removeProductFromCart(id) {
  const newCart = MY_CART.filter(x => id != x.id)
  MY_CART = newCart
  MY_CART.forEach((product, idx) => {
    MY_CART[idx].quantity = document.getElementById(`${product.id}`).value
    
  })
  showCart(newCart)
}

function CartComponent(product) {
  return `
  <div class="card card-list">
      <img width="100" src="${S3_URL}${product.icon_image}" alt="movie">
      <p>${product.name}</p>
      <div class="d-flex">
        <input id="${product.id}" style="width: 80px" value="${product.quantity}" />
      </div>
      <div class="d-flex">
        <button class=" btn btn-danger p-1" onClick="removeProductFromCart(${product.id})">-</buttton>
      </div>
  </div>
`
}

cotizadorBtn.addEventListener('click', ()=> {
  let errorMessages = []
  let errorMessage = ''
  // VALIDATIONS
  if(!MY_CART.length){
    alert('Tu resumen está vacío')
    return
  }
  MY_CART.forEach((product, idx) => {
    const quantity = document.getElementById(`${product.id}`).value
    MY_CART[idx].quantity = Number(quantity)
    if(Number(quantity) <= 0) {
      errorMessages.push('2')
    }
    if(isNaN(quantity)) {
      errorMessages.push('1')
    }
  })

  errorMessages = [...new Set(errorMessages)] // Remove duplicates
  errorMessages.forEach(x => {
    errorMessage = `${errorMessage} ${ERROR_CODES[x]}.`
  })
  if(errorMessage !== ''){
    alert(errorMessage)
    return
  }
  console.log('aqui')
  confirmModal.style.display = 'block'
})

// Que no esté vacío y que se un número válido
function closeModal() {
  confirmModal.style.display = 'none'

} 

function enviarCotizacion(e){
  e.preventDefault()
  console.log('e',e)
}

formContact.addEventListener('submit', e => e.preventDefault())