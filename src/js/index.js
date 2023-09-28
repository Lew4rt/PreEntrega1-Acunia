// En esta entrega final se agregó al proyecto el fetching de datos desde un .json y se realizó una creación dinámica de cada tarjeta en pantalla
// El código fue en gran parte refactorizado para funcionar desde el .json y no desde elementos html previamente creados (dejé comentado en index.html las cards como estaban anteriormente)

// Declaro las variables con las que voy a trabajar

const cartButton = document.getElementById('cartButton')
const cleanCartButton = document.getElementById('cleanCartButton')
const cartItemsContainer = document.getElementById('cartItemsContainer')
const discountCheckbox = document.getElementById('discount')

let cards;
let cart = [];
let totalPrice = 0
let discount = false
let freeShipping = false

const storedCart = localStorage.getItem('cart')

class Product {
    constructor(title, description, price, imageSrc, element) {
        this.title = title
        this.description = description
        this.price = parseFloat(price)
        this.imageSrc = imageSrc
        this.element = element
    }
}

const createProductFromCard = (card, element) => {
    return new Product(card.title, card.description, card.price, card.imageSrc, element)
}

document.addEventListener('DOMContentLoaded', () => {

    // Extraigo los datos de cards.json

    fetch('../../cards.json')
        .then(response => response.json())
        .then(cardsFromJson => {

            cards = []

            const cardsContainer = document.getElementById('cardsContainer');

            cardsFromJson.forEach(card => {

                const cardElement = document.createElement('div');
                cardElement.classList.add('card');

                // Extraigo los datos de cada elemento padre correspondiente a cada card para crear el objecto product

                const product = createProductFromCard(card, cardElement)

                // Agrego dicho objecto a una lista de products con la que voy a trabajar más adelante

                cards.push(product)

                // Y le asigno a dicho elemento padre su correspondiente onClick para que pueda ser agregado al cart

                cardElement.addEventListener('click', () => {
                    cart.push(product)
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Producto agregado al carrito!',
                        showConfirmButton: false,
                        timer: 1100
                    })
                    localStorage.setItem('cart', JSON.stringify(cart))
                })

                // Creo el resto de los elementos correspondientes a cada card para mostrar los datos del .json

                const cardImage = document.createElement('div');
                cardImage.classList.add('card_image');

                if (card.imageSrc.endsWith('.jpg')) {
                    const image = document.createElement('img');
                    image.src = card.imageSrc;
                    image.alt = card.title;
                    cardImage.appendChild(image);
                } else if (card.imageSrc.endsWith('.mp4')) {
                    const video = document.createElement('video');
                    video.src = card.imageSrc;
                    video.autoplay = true;
                    video.muted = true;
                    video.loop = true;
                    cardImage.appendChild(video);
                }

                const cardDescription = document.createElement('div');
                cardDescription.classList.add('card_description');

                const cardTitle = document.createElement('h3');
                cardTitle.textContent = card.title;

                const cardDescriptionText = document.createElement('p');
                cardDescriptionText.classList.add('card_description_text');
                cardDescriptionText.textContent = card.description;

                const cardPrice = document.createElement('p');
                cardPrice.classList.add('card_price');
                cardPrice.innerHTML = `$<span>${card.price}</span>`;

                cardDescription.appendChild(cardTitle);
                cardDescription.appendChild(document.createElement('hr'));
                cardDescription.appendChild(cardDescriptionText);
                cardDescription.appendChild(document.createElement('hr'));
                cardDescription.appendChild(cardPrice);

                cardElement.appendChild(cardImage);
                cardElement.appendChild(cardDescription);

                cardsContainer.appendChild(cardElement);
            })
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });

    if (storedCart) {
        cart = JSON.parse(storedCart)
    }

    // Manejo el descuento con su respectivo event listener en el checkbox y lo guardo en storage

    const storedDiscount = localStorage.getItem('discount')

    if (storedDiscount) {
        discount = JSON.parse(storedDiscount)
    }

    if (discount) {
        console.log('descuento')
        document.getElementById('discount').checked = true
    } else {
        console.log('no descuento')
        document.getElementById('discount').checked = false
    }

    discountCheckbox.addEventListener('change', () => {
        if (discountCheckbox.checked) {
            discount = true
        } else {
            discount = false
        }
        localStorage.setItem('discount', JSON.stringify(discount))
    })

    // Creo un event listener para 'Ver carrito'

    cartButton.addEventListener('click', () => {

        cartItemsContainer.innerHTML = ""

        const hr = document.createElement('hr')

        // Se crean elementos 'p' por cada item agregado a cart y se acomodan dentro del div cartItemsContainer. También se va sumando el precio total en la variable totalPrice

        cart.forEach(item => {
            const cartItem = document.createElement('p')
            cartItem.textContent = `${item.title} - $${item.price}`
            cartItemsContainer.appendChild(cartItem)
            totalPrice += item.price
            console.log(totalPrice)
        });

        // El hr es solo para separar el precio final de la lista

        if (cart.length > 0) {
            cartItemsContainer.appendChild(hr)
        }

        // Se declaran los bools destinados a chequear envío y descuento

        if (discount) {
            totalPrice = totalPrice * 0.80
        }
        if (totalPrice >= 5000) { freeShipping = true } else false

        // Se muestra el total con sus cálculos correspondientes

        if (cart.length > 0) {
            const cartTotal = document.createElement('p')
            cartTotal.textContent = `El total con ${(freeShipping ? "envío gratis" : "envío")} ${(discount ? "y con descuento del 20%" : "")} es de $${(freeShipping ? totalPrice : totalPrice + 500)}`
            cartItemsContainer.appendChild(cartTotal)
            cartTotal.style.marginBottom = "20px"
        }

        // Y se reinicia la variable para evitar que se stackee con el próximo cálculo

        totalPrice = 0
    });

    // Un botón para reiniciar el array del carrito y el contenido en pantalla

    cleanCartButton.addEventListener('click', () => {
        cart = []
        cartItemsContainer.innerHTML = ""
        localStorage.removeItem('cart');
    })

    // Funcionalidad de búsqueda que filtra las cards por título

    const searchInput = document.getElementById('searchInput');

    const filterCards = () => {
        const searchText = searchInput.value.toLowerCase();

        cards.forEach(card => {
            console.log(card)
            const cardTitle = card.title.toLowerCase() //card.querySelector("#card_title").textContent.toLowerCase();
            if (cardTitle.includes(searchText)) {
                card.element.style.display = "block"
            } else {
                card.element.style.display = "none"
            }
        });

        // Esto solo es para mantener la barra activa cuando hay texto

        if (searchText.length > 0) {
            searchInput.classList.add('active');
        } else {
            searchInput.classList.remove('active');
        }
    };

    searchInput.addEventListener('input', filterCards);

})