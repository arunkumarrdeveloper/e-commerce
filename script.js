/* =========================================
   CATEGORY PRODUCT FILTER
========================================= */

function showProducts(category, selectedButton) {

    const productsSection =
        document.querySelector(".products");

    const products =
        document.querySelectorAll(".product-card");

    const categoryButtons =
        document.querySelectorAll(".category-card");

    const categoryTitle =
        document.querySelector("#categoryTitle");


    categoryButtons.forEach(function(button) {
        button.classList.remove("active");
    });


    selectedButton.classList.add("active");

    productsSection.style.display = "block";


    const names = {

        fruits: "Fruits",
        vegetables: "Vegetables",
        snacks: "Snacks",
        makeup: "Makeup",
        fitness: "Fitness",
        essentials: "Daily Essentials"

    };


    categoryTitle.textContent =
        "Showing " + names[category] + " products";


    products.forEach(function(product) {

        if (
            product.getAttribute("data-category")
            === category
        ) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });


    setTimeout(function() {

        productsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* =========================================
   CART DATA
========================================= */

let cart = [];


/* =========================================
   ADD TO CART
========================================= */

function addToCart(button) {

    const productCard =
        button.closest(".product-card");


    const name =
        productCard.querySelector("h3").textContent;


    const priceText =
        productCard
        .querySelector(".product-bottom strong")
        .textContent;


    const price =
        Number(
            priceText
            .replace("₹", "")
            .trim()
        );


    const image =
        productCard.querySelector("img").src;


    const existingProduct =
        cart.find(function(item) {

            return item.name === name;

        });


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            name: name,
            price: price,
            image: image,
            quantity: 1

        });

    }


    updateCartCount();

    renderCart();


    /* Small confirmation */

    button.textContent = "Added";

    setTimeout(function() {

        button.textContent = "Add";

    }, 800);

}


/* =========================================
   CART COUNT
========================================= */

function updateCartCount() {

    const totalQuantity =
        cart.reduce(function(total, item) {

            return total + item.quantity;

        }, 0);


    const cartLinks =
        document.querySelectorAll(
            'a[href="#cart"]'
        );


    cartLinks.forEach(function(link) {

        let badge =
            link.querySelector(".cart-count");


        if (!badge) {

            badge =
                document.createElement("span");

            badge.className =
                "cart-count";

            link.style.position =
                "relative";

            link.appendChild(badge);

        }


        badge.textContent =
            totalQuantity;


        badge.style.display =
            totalQuantity > 0
                ? "flex"
                : "none";

    });

}


/* =========================================
   RENDER CART
========================================= */

function renderCart() {

    const cartContainer =
        document.querySelector("#cartItems");


    if (!cartContainer) return;


    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h3>Your cart is empty</h3>

                <p>Add products to your cart.</p>

            </div>

        `;

        updateCartTotal();

        return;

    }


    cart.forEach(function(item, index) {

        const itemTotal =
            item.price * item.quantity;


        cartContainer.innerHTML += `

            <div class="cart-item">

                <img src="${item.image}"
                     alt="${item.name}">


                <div class="cart-item-info">

                    <h3>${item.name}</h3>

                    <p>₹${item.price}</p>


                    <div class="quantity">

                        <button
                            onclick="decreaseQuantity(${index})">

                            −

                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            onclick="increaseQuantity(${index})">

                            +

                        </button>

                    </div>

                </div>


                <div class="cart-item-right">

                    <strong>
                        ₹${itemTotal}
                    </strong>


                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${index})">

                        Remove

                    </button>

                </div>

            </div>

        `;

    });


    updateCartTotal();

}


/* =========================================
   PLUS
========================================= */

function increaseQuantity(index) {

    cart[index].quantity++;

    updateCartCount();

    renderCart();

}


/* =========================================
   MINUS
========================================= */

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }


    updateCartCount();

    renderCart();

}


/* =========================================
   REMOVE
========================================= */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCartCount();

    renderCart();

}


/* =========================================
   TOTAL
========================================= */

function updateCartTotal() {

    const subtotalElement =
        document.querySelector("#cartSubtotal");

    const deliveryElement =
        document.querySelector("#deliveryCharge");

    const totalElement =
        document.querySelector("#cartTotal");


    if (
        !subtotalElement ||
        !deliveryElement ||
        !totalElement
    ) {
        return;
    }


    const subtotal =
        cart.reduce(function(total, item) {

            return total +
                item.price * item.quantity;

        }, 0);


    const delivery =
        subtotal === 0
            ? 0
            : subtotal >= 500
                ? 0
                : 20;


    const total =
        subtotal + delivery;


    subtotalElement.textContent =
        "₹" + subtotal;


    deliveryElement.textContent =
        delivery === 0
            ? "FREE"
            : "₹" + delivery;


    totalElement.textContent =
        "₹" + total;

}


/* =========================================
   OPEN CART
========================================= */

document
    .querySelectorAll('a[href="#cart"]')
    .forEach(function(cartLink) {

        cartLink.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const cartSection =
                    document.querySelector("#cart");


                cartSection.style.display =
                    "block";


                renderCart();


                cartSection.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }
        );

    });


/* =========================================
   CLOSE CART
========================================= */

function closeCart() {

    const cartSection =
        document.querySelector("#cart");


    cartSection.style.display =
        "none";


    document
        .querySelector("#categories")
        .scrollIntoView({

            behavior: "smooth"

        });

}
/* =========================================
   PROCEED TO CHECKOUT
========================================= */

function goToCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    // Save current cart to localStorage
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    // Go to checkout page
    window.location.href =
        "checkout.html";
}