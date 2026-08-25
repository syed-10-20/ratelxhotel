/* =====================================================
   RATELX RESTAURANT JAVASCRIPT
===================================================== */


/* =====================================================
   NAVIGATION
===================================================== */

function toggleMenu() {

    const nav = document.getElementById("navLinks");

    if (nav) {
        nav.classList.toggle("show");
    }

}


/* =====================================================
   MENU FILTER
===================================================== */

function filterMenu(category) {

    const cards =
        document.querySelectorAll(".food-card");

    cards.forEach(card => {

        if (
            category === "all" ||
            card.dataset.category === category
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


/* =====================================================
   CART
===================================================== */

let cart =
    JSON.parse(localStorage.getItem("ratelxCart")) || [];


function saveCart() {

    localStorage.setItem(
        "ratelxCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}


function updateCartCount() {

    const count =
        document.getElementById("cartCount");

    if (count) {

        count.textContent = cart.length;

    }

}


function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    saveCart();

    alert(
        `${name} added to your order! 🛒`
    );

}


function addCombo() {

    cart.push({
        name: "RatelX Royal Combo",
        price: 699
    });

    saveCart();

    alert(
        "🔥 Today's Special Combo added to your order!"
    );

    window.location.href = "order.html";

}


/* =====================================================
   ORDER PAGE
===================================================== */

function displayOrder() {

    const container =
        document.getElementById("orderItems");

    const totalElement =
        document.getElementById("orderTotal");

    if (!container || !totalElement) {
        return;
    }


    if (cart.length === 0) {

        container.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
                <br><br>
                Please return to the menu.
            </p>
        `;

        totalElement.textContent = "₹0";

        return;

    }


    let total = 0;

    container.innerHTML = "";


    cart.forEach((item, index) => {

        total += Number(item.price);

        const div =
            document.createElement("div");

        div.className = "order-item";

        div.innerHTML = `

            <div>

                <strong>${item.name}</strong>

                <br>

                <span>₹${item.price}</span>

            </div>

            <button
                class="remove-item"
                onclick="removeItem(${index})">

                ✕

            </button>

        `;

        container.appendChild(div);

    });


    totalElement.textContent =
        "₹" + total;

}


function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    displayOrder();

}


/* =====================================================
   ORDER PLACEMENT
===================================================== */

const orderForm =
    document.getElementById("orderForm");


if (orderForm) {

    orderForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Please add at least one food item!"
                );

                return;

            }


            const name =
                document.getElementById(
                    "customerName"
                ).value;

            const phone =
                document.getElementById(
                    "customerPhone"
                ).value;

            const email =
                document.getElementById(
                    "customerEmail"
                ).value;

            const address =
                document.getElementById(
                    "customerAddress"
                ).value;


            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (!payment) {

                alert(
                    "Please select a payment mode."
                );

                return;

            }


            const total =
                cart.reduce(
                    (sum, item) =>
                        sum + Number(item.price),
                    0
                );


            const orderID =
                "RX" +
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );


            localStorage.setItem(
                "lastOrder",
                JSON.stringify({
                    id: orderID,
                    name: name,
                    phone: phone,
                    email: email,
                    address: address,
                    payment: payment.value,
                    total: total
                })
            );


            document.getElementById(
                "orderMessage"
            ).innerHTML = `

                Thank you <strong>${name}</strong>! ❤️

                <br><br>

                Your Order ID is

                <strong>#${orderID}</strong>

                <br>

                Amount:
                <strong>₹${total}</strong>

                <br>

                Payment:
                <strong>${payment.value}</strong>

                <br><br>

                📱 Confirmation will be sent to
                <strong>${phone}</strong>

            `;


            orderForm.style.display = "none";


            document
                .getElementById("orderSuccess")
                .classList.add("active");


            cart = [];

            saveCart();

        }
    );

}


/* =====================================================
   DEMO SMS
===================================================== */

function sendSMSDemo() {

    const lastOrder =
        JSON.parse(
            localStorage.getItem("lastOrder")
        );


    if (!lastOrder) {

        alert(
            "Order information not found."
        );

        return;

    }


    alert(

        `📱 DEMO SMS

RatelX Restaurant

Hello ${lastOrder.name}!

Your order #${lastOrder.id}
has been successfully placed.

Amount: ₹${lastOrder.total}

Thank you for ordering with RatelX! ❤️

NOTE:
This is a frontend SMS simulation.
Real SMS requires a backend SMS API.`

    );

}


/* =====================================================
   BOOKING OTP
===================================================== */

let generatedOTP = null;


function sendBookingOTP() {

    const form =
        document.getElementById("bookingForm");


    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    const phone =
        document.getElementById(
            "bookingPhone"
        ).value;


    if (!/^[0-9]{10}$/.test(phone)) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;

    }


    generatedOTP =
        Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();


    document
        .getElementById("otpBox")
        .classList.add("active");


    document.getElementById(
        "demoOTP"
    ).textContent =
        "Demo OTP: " + generatedOTP;


    alert(
        "OTP generated successfully!\n\n" +
        "For hackathon demonstration:\n" +
        generatedOTP
    );

}


/* =====================================================
   VERIFY OTP
===================================================== */

function verifyOTP() {

    const input =
        document.getElementById(
            "otpInput"
        ).value;


    if (input !== generatedOTP) {

        alert(
            "❌ Invalid OTP. Please try again."
        );

        return;

    }


    const name =
        document.getElementById(
            "bookingName"
        ).value;

    const phone =
        document.getElementById(
            "bookingPhone"
        ).value;

    const people =
        document.getElementById(
            "people"
        ).value;

    const date =
        document.getElementById(
            "bookingDate"
        ).value;

    const time =
        document.getElementById(
            "bookingTime"
        ).value;


    const bookingID =
        "TB" +
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    localStorage.setItem(
        "lastBooking",
        JSON.stringify({
            id: bookingID,
            name: name,
            phone: phone,
            people: people,
            date: date,
            time: time
        })
    );


    document.getElementById(
        "bookingDetails"
    ).innerHTML = `

        Hello <strong>${name}</strong>! 🎉

        <br><br>

        Your table has been reserved successfully.

        <br>

        Booking ID:
        <strong>#${bookingID}</strong>

        <br>

        Date:
        <strong>${date}</strong>

        <br>

        Time:
        <strong>${time}</strong>

        <br>

        Guests:
        <strong>${people}</strong>

        <br><br>

        📱 Confirmation mobile:
        <strong>${phone}</strong>

    `;


    document
        .getElementById("bookingSuccess")
        .classList.add("active");


    document
        .getElementById("otpBox")
        .classList.remove("active");


    document
        .getElementById("bookingForm")
        .reset();

}


/* =====================================================
   RATING FORM
===================================================== */

const ratingForm =
    document.getElementById(
        "ratingForm"
    );


if (ratingForm) {

    ratingForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const selectedStar =
                document.querySelector(
                    'input[name="overall"]:checked'
                );


            if (!selectedStar) {

                alert(
                    "Please select your overall rating."
                );

                return;

            }


            const ratingData = {

                name:
                    document.getElementById(
                        "ratingName"
                    ).value,

                overall:
                    selectedStar.value,

                food:
                    document.getElementById(
                        "foodRating"
                    ).value,

                cleanliness:
                    document.getElementById(
                        "cleanRating"
                    ).value,

                staff:
                    document.getElementById(
                        "staffRating"
                    ).value,

                service:
                    document.getElementById(
                        "serviceRating"
                    ).value,

                suggestion:
                    document.getElementById(
                        "suggestion"
                    ).value

            };


            localStorage.setItem(
                "ratelxRating",
                JSON.stringify(ratingData)
            );


            ratingForm.reset();


            document
                .getElementById("ratingSuccess")
                .classList.add("active");

        }
    );

}


/* =====================================================
   PAGE INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        displayOrder();

    }
);