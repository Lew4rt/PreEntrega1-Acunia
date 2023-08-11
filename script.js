// Buenas! Para esta primer preentrega agarré una pequeña parte del proyecto que trabajé en Desarrollo web, que es un e-commerce de bijouterié,
//  y la idea sería agregarle un muy simple carrito de compras que haga el recuento de los productos agregados y la suma total, más algún descuento o incremento que pueda existir

class Product {
    constructor(id, name, description, price) {
        this.id = id
        this.name = name
        this.description = description
        this.price = parseFloat(price)
    }
}

const createProductFromCard = (card) => {
    const id = card.getAttribute('id')
    const price = card.querySelector("#card_price").textContent
    const name = card.querySelector("#card_title").textContent
    const description = card.querySelector("#card_description").textContent

    return new Product(id, name, description, price)

}

document.addEventListener('DOMContentLoaded', () => {

    // Declaro las variables con las que voy a trabajar

    const cards = document.querySelectorAll('.card');

    const cartButton = document.getElementById('cartButton');
    const cleanCartButton = document.getElementById('cleanCartButton')
    const cartItemsContainer = document.getElementById('cartItemsContainer');

    let cart = [];
    let totalPrice = 0

    // Creo un objecto product por cada artículo en el html y me guardo sus datos, a su vez le asigno a cada uno un event listener para poder agregarlos al array cart

    cards.forEach((card) => {
        const product = createProductFromCard(card)
        card.addEventListener('click', () => {
            cart.push(product);
            alert(`${product.name} agregado al carrito!`);
        });
    })

    // Creo un event listener para 'Ver carrito'

    cartButton.addEventListener('click', () => {

        const hr = document.createElement('hr')

        // Se crean elementos 'p' por cada item agregado a cart y se acomodan dentro del div cartItemsContainer. También se va sumando el precio total en la variable totalPrice

        cart.forEach(item => {
            const cartItem = document.createElement('p')
            cartItem.textContent = `${item.name} - $${item.price}`
            cartItemsContainer.appendChild(cartItem)
            totalPrice += item.price
            console.log(totalPrice)
        });

        // El hr es solo para separar el precio final de la lista

        if (cart.length > 0) {
            cartItemsContainer.appendChild(hr)
        }

        // Se declaran los bools destinados a chequear envío y descuento

        let freeShipping = false
        let discount = false
        if (document.getElementById('discount').checked) {
            discount = true
            totalPrice = totalPrice * 0.80
        } else {
            discount = false
        }
        if (totalPrice >= 5000) { freeShipping = true } else false

        // Se muestra el total con sus cálculos correspondientes

        const cartTotal = document.createElement('p')
        cartTotal.textContent = `El total con ${(freeShipping ? "envío gratis" : "envío")} ${(discount ? "y con descuento del 20% es de" : "")} es de $${(freeShipping ? totalPrice : totalPrice + 500)}`
        cartItemsContainer.appendChild(cartTotal)
        cartTotal.style.marginBottom = "20px"

        // Y se reinicia la variable para evitar que se stackee con el próximo cálculo, y así poder generar una suerte de historial

        totalPrice = 0
    });

    // Por último, un botón para reiniciar el array del carrito y el contenido en pantalla

    cleanCartButton.addEventListener('click', () => {
        cart = []
        cartItemsContainer.innerHTML = ""
    })
})
