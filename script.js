/* =====================================================
   RATELX RESTAURANT
   COMPLETE JAVASCRIPT
   ROUND 1 + ROUND 2
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

let currentMenuCategory = "all";

function filterMenu(category) {
    currentMenuCategory = category;
    applyMenuFilters();
}

function applyMenuFilters() {
    const cards = document.querySelectorAll(".food-card");
    const searchInput = document.getElementById("menuSearch");
    const status = document.getElementById("searchStatus");

    const query = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    let visibleCount = 0;

    cards.forEach(card => {
        const categoryMatch =
            currentMenuCategory === "all" ||
            card.dataset.category === currentMenuCategory;

        const text = card.textContent.toLowerCase();

        const searchMatch =
            !query || text.includes(query);

        const visible =
            categoryMatch && searchMatch;

        card.style.display =
            visible ? "block" : "none";

        if (visible) {
            visibleCount++;
        }
    });

    if (status) {
        if (query && visibleCount === 0) {
            status.textContent =
                `No results found for "${query}".`;
        } else if (query) {
            status.textContent =
                `${visibleCount} matching dish${
                    visibleCount === 1 ? "" : "es"
                } found.`;
        } else {
            status.textContent = "";
        }
    }
}


/* =====================================================
   CART
   ===================================================== */

let cart =
    JSON.parse(
        localStorage.getItem("ratelxCart")
    ) || [];


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
        price: Number(price)
    });

    saveCart();

    alert(
        `${name} added to your order! 🛒`
    );
}


/* =====================================================
   TODAY'S COMBO
   ===================================================== */

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


/*
   Backward compatibility
   for old HTML/code.
*/

function mod() {

    const button =
        document.querySelector(".primary-btn");

    if (button) {
        button.style.color = "green";
    }
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
                Your cart is empty.<br><br>
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
                type="button"
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
   ORDER FORM
   ===================================================== */

function setupOrderForm() {

    const orderForm =
        document.getElementById("orderForm");

    if (!orderForm) {
        return;
    }

    orderForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            if (cart.length === 0) {

                alert(
                    "Please add at least one food item!"
                );

                return;
            }

            const name =
                document
                    .getElementById("customerName")
                    ?.value
                    .trim() || "";

            const phone =
                document
                    .getElementById("customerPhone")
                    ?.value
                    .trim() || "";

            const email =
                document
                    .getElementById("customerEmail")
                    ?.value
                    .trim() || "";

            const address =
                document
                    .getElementById("customerAddress")
                    ?.value
                    .trim() || "";

            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );

            if (
                !name ||
                !phone ||
                !email ||
                !address ||
                !payment
            ) {

                alert(
                    "Please complete all required order details."
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

            const message =
                document.getElementById(
                    "orderMessage"
                );

            if (message) {

                message.innerHTML = `
                    Thank you
                    <strong>${name}</strong>! ❤️

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
            }

            orderForm.style.display = "none";

            document
                .getElementById("orderSuccess")
                ?.classList.add("active");

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

    alert(`📱 DEMO SMS

RatelX Restaurant

Hello ${lastOrder.name}!

Your order #${lastOrder.id}
has been successfully placed.

Amount: ₹${lastOrder.total}

Thank you for ordering with RatelX! ❤️

NOTE:
This is a frontend SMS simulation.
Real SMS requires a backend SMS API.`);
}


/* =====================================================
   BOOKING + OTP
   ===================================================== */

let generatedOTP = null;


function sendBookingOTP() {

    const form =
        document.getElementById(
            "bookingForm"
        );

    if (!form) {
        return;
    }

    const validationMessage =
        document.getElementById(
            "bookingValidationMessage"
        );

    const showMessage =
        (message, success = false) => {

            if (validationMessage) {

                validationMessage.className =
                    success
                        ? "validation-message success"
                        : "validation-message";

                validationMessage.textContent =
                    (success ? "✓ " : "⚠️ ") +
                    message;

            } else {

                alert(message);

            }
        };


    if (!form.checkValidity()) {

        form.reportValidity();

        showMessage(
            "Please complete all required booking fields."
        );

        return;
    }


    const name =
        document
            .getElementById("bookingName")
            ?.value
            .trim() || "";


    const age =
        Number(
            document
                .getElementById("bookingAge")
                ?.value
        );


    const phone =
        document
            .getElementById("bookingPhone")
            ?.value
            .trim() || "";


    const email =
        document
            .getElementById("bookingEmail")
            ?.value
            .trim() || "";


    const date =
        document
            .getElementById("bookingDate")
            ?.value || "";


    if (name.length < 3) {

        showMessage(
            "Name must contain at least 3 characters."
        );

        return;
    }


    if (
        !Number.isFinite(age) ||
        age < 10 ||
        age > 100
    ) {

        showMessage(
            "Age must be between 10 and 100."
        );

        return;
    }


    if (!/^[0-9]{10}$/.test(phone)) {

        showMessage(
            "Phone number must contain exactly 10 digits."
        );

        return;
    }


    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

        showMessage(
            "Please enter a valid email address."
        );

        return;
    }


    if (
        date &&
        date <
            new Date()
                .toISOString()
                .split("T")[0]
    ) {

        showMessage(
            "Booking date cannot be in the past."
        );

        return;
    }


    showMessage(
        "All validation checks passed. OTP generated.",
        true
    );


    generatedOTP =
        String(
            Math.floor(
                100000 +
                Math.random() * 900000
            )
        );


    document
        .getElementById("otpBox")
        ?.classList.add("active");


    const demoOTP =
        document.getElementById(
            "demoOTP"
        );


    if (demoOTP) {

        demoOTP.textContent =
            "Demo OTP: " +
            generatedOTP;
    }


    alert(
        "OTP generated successfully!\n\n" +
        "Demo OTP: " +
        generatedOTP
    );
}


/* =====================================================
   VERIFY OTP
   ===================================================== */

function verifyOTP() {

    const input =
        document
            .getElementById("otpInput")
            ?.value
            .trim() || "";


    if (
        !generatedOTP ||
        input !== generatedOTP
    ) {

        alert(
            "❌ Invalid OTP. Please try again."
        );

        return;
    }


    const name =
        document
            .getElementById("bookingName")
            ?.value || "";


    const phone =
        document
            .getElementById("bookingPhone")
            ?.value || "";


    const people =
        document
            .getElementById("people")
            ?.value || "";


    const date =
        document
            .getElementById("bookingDate")
            ?.value || "";


    const time =
        document
            .getElementById("bookingTime")
            ?.value || "";


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


    const details =
        document.getElementById(
            "bookingDetails"
        );


    if (details) {

        details.innerHTML = `
            Hello
            <strong>${name}</strong>! 🎉

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
    }


    document
        .getElementById("bookingSuccess")
        ?.classList.add("active");


    document
        .getElementById("otpBox")
        ?.classList.remove("active");


    document
        .getElementById("bookingForm")
        ?.reset();


    generatedOTP = null;
}


/* =====================================================
   RATING FORM
   ===================================================== */

function setupRatingForm() {

    const ratingForm =
        document.getElementById(
            "ratingForm"
        );

    if (!ratingForm) {
        return;
    }

    ratingForm.addEventListener(
        "submit",
        function (event) {

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
                    document
                        .getElementById("ratingName")
                        ?.value || "",

                overall:
                    selectedStar.value,

                food:
                    document
                        .getElementById("foodRating")
                        ?.value || "",

                cleanliness:
                    document
                        .getElementById("cleanRating")
                        ?.value || "",

                staff:
                    document
                        .getElementById("staffRating")
                        ?.value || "",

                service:
                    document
                        .getElementById("serviceRating")
                        ?.value || "",

                suggestion:
                    document
                        .getElementById("suggestion")
                        ?.value || ""

            };

            localStorage.setItem(
                "ratelxRating",
                JSON.stringify(ratingData)
            );

            ratingForm.reset();

            document
                .getElementById("ratingSuccess")
                ?.classList.add("active");
        }
    );
}


/* =====================================================
   ROUND 2 - CHANGE 1
   INTERACTIVE WELCOME MESSAGE
   ===================================================== */

function setupWelcomeMessage() {

    const button =
        document.getElementById(
            "welcomeBtn"
        );


    const message =
        document.getElementById(
            "welcomeMessage"
        );


    if (!button || !message) {
        return;
    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            message.textContent =
                "Welcome to RatelX! 🍽️ " +
                "Explore our menu and build your perfect meal.";


            message.style.opacity = "1";


            setTimeout(
                () => {

                    document
                        .getElementById("menu")
                        ?.scrollIntoView({
                            behavior: "smooth"
                        });

                },
                700
            );

        }
    );
}


/* =====================================================
   ROUND 2 - CHANGE 2
   DYNAMIC CONTENT MODIFICATION
   ===================================================== */

function setupDynamicModification() {

    const button =
        document.getElementById(
            "modifyContentBtn"
        );


    const title =
        document.getElementById(
            "dynamicAboutTitle"
        );


    if (!button || !title) {
        return;
    }


    let modified = false;


    button.addEventListener(
        "click",
        function () {

            modified =
                !modified;


            /* Property 1 - Color */

            title.style.color =
                modified
                    ? "#a52bd4"
                    : "";


            /* Property 2 - Font Size */

            title.style.fontSize =
                modified
                    ? "2.35rem"
                    : "";


            /* Property 3 - Position */

            title.style.transform =
                modified
                    ? "translateX(10px)"
                    : "";


            button.textContent =
                modified
                    ? "↩ Restore Original"
                    : "✨ Modify This Section";

        }
    );
}


/* =====================================================
   ROUND 2 - CHANGE 4
   MENU SEARCH
   ===================================================== */

function setupMenuSearch() {

    const search =
        document.getElementById(
            "menuSearch"
        );


    if (search) {

        search.addEventListener(
            "input",
            applyMenuFilters
        );

    }
}


/* =====================================================
   ROUND 2 - CHANGE 5
   EVENT HANDLING
   CLICK + MOUSEOVER + MOUSEOUT
   ===================================================== */

function setupEventChallenge() {

    const card =
        document.querySelector(
            ".food-card"
        );


    const feedback =
        document.getElementById(
            "eventFeedback"
        );


    if (!card || !feedback) {
        return;
    }


    const show =
        text => {

            feedback.textContent =
                text;

            feedback.classList.add(
                "show"
            );
        };


    card.addEventListener(
        "click",
        () => {

            show(
                "Click event: You selected a RatelX dish."
            );

        }
    );


    card.addEventListener(
        "mouseover",
        () => {

            show(
                "Mouseover event: Dish highlighted."
            );

        }
    );


    card.addEventListener(
        "mouseout",
        () => {

            feedback.textContent =
                "Mouseout event: Highlight cleared.";


            setTimeout(
                () => {

                    feedback.classList.remove(
                        "show"
                    );

                },
                900
            );

        }
    );
}


/* =====================================================
   ROUND 2 - CHANGE 6
   INTERACTIVE MODAL
   ===================================================== */

let modalDish = null;


function setupFoodModal() {

    const modal =
        document.getElementById(
            "foodModal"
        );


    const close =
        document.getElementById(
            "modalClose"
        );


    const title =
        document.getElementById(
            "modalTitle"
        );


    const description =
        document.getElementById(
            "modalDescription"
        );


    const price =
        document.getElementById(
            "modalPrice"
        );


    const addButton =
        document.getElementById(
            "modalAddBtn"
        );


    if (!modal) {
        return;
    }


    const closeModal =
        () => {

            modal.classList.remove(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            modalDish = null;

        };


    document
        .querySelectorAll(
            ".details-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    modalDish = {

                        name:
                            this.dataset.food ||
                            "Dish",

                        price:
                            Number(
                                this.dataset.price ||
                                0
                            ),

                        description:
                            this.dataset.description ||
                            "Delicious RatelX dish."

                    };


                    if (title) {
                        title.textContent =
                            modalDish.name;
                    }


                    if (description) {
                        description.textContent =
                            modalDish.description;
                    }


                    if (price) {
                        price.textContent =
                            `₹${modalDish.price}`;
                    }


                    modal.classList.add(
                        "active"
                    );


                    modal.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                }
            );

        });


    if (close) {

        close.addEventListener(
            "click",
            closeModal
        );

    }


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeModal();

            }

        }
    );


    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                if (modalDish) {

                    addToCart(
                        modalDish.name,
                        modalDish.price
                    );

                }


                closeModal();

            }
        );

    }
}


/* =====================================================
   ROUND 2 - CHANGE 7
   EXCEPTION HANDLING
   BILL + TIP CALCULATOR
   ===================================================== */

function setupBillCalculator() {

    const button =
        document.getElementById(
            "calculateBillBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            const result =
                document.getElementById(
                    "calculatorResult"
                );


            try {

                const input =
                    document
                        .getElementById(
                            "tipPercent"
                        )
                        ?.value
                        .trim() || "";


                const tip =
                    Number(input);


                const totalText =
                    document
                        .getElementById(
                            "orderTotal"
                        )
                        ?.textContent ||
                    "₹0";


                const total =
                    Number(
                        totalText.replace(
                            /[^0-9.]/g,
                            ""
                        )
                    );


                if (
                    input === "" ||
                    !Number.isFinite(tip)
                ) {

                    throw new Error(
                        "Please enter a valid number for the tip."
                    );

                }


                if (
                    tip < 0 ||
                    tip > 100
                ) {

                    throw new Error(
                        "Tip percentage must be between 0 and 100."
                    );

                }


                if (
                    !Number.isFinite(total) ||
                    total < 0
                ) {

                    throw new Error(
                        "Order total is invalid."
                    );

                }


                const tipAmount =
                    total * tip / 100;


                const finalAmount =
                    total + tipAmount;


                if (result) {

                    result.textContent =
                        `Tip: ₹${tipAmount.toFixed(2)} • ` +
                        `Final estimate: ₹${finalAmount.toFixed(2)}`;

                }

            }

            catch (error) {

                if (result) {

                    result.textContent =
                        `⚠️ ${error.message}`;

                }

            }

        }
    );
}


/* =====================================================
   ROUND 2 - CHANGE 8
   JSON-BASED DYNAMIC CONTENT
   ===================================================== */

const chefPicks = [

    {
        id: "cp1",
        name: "Dragon Chicken",
        price: 256,
        icon: "🍗",
        description:
            "Crispy chicken with signature spicy dragon sauce."
    },

    {
        id: "cp2",
        name: "Royal Biryani",
        price: 299,
        icon: "🍛",
        description:
            "Aromatic basmati rice, tender chicken and secret spices."
    },

    {
        id: "cp3",
        name: "Cheese Burst Pizza",
        price: 382,
        icon: "🍕",
        description:
            "Golden crust loaded with cheese and special toppings."
    }

];


let selectedChefPicks = [];


function renderChefPicks() {

    const grid =
        document.getElementById(
            "jsonMenuGrid"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML =
        chefPicks
            .map(item => `

                <article
                    class="json-card"
                    data-id="${item.id}">

                    <div class="json-icon">
                        ${item.icon}
                    </div>

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ${item.description}
                    </p>

                    <strong class="json-price">
                        ₹${item.price}
                    </strong>

                    <button
                        type="button"
                        class="btn secondary-btn json-select-btn"
                        data-id="${item.id}">

                        Select

                    </button>

                </article>

            `)
            .join("");


    grid
        .querySelectorAll(
            ".json-select-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    toggleChefPick(
                        button.dataset.id
                    )
            );

        });

}


function toggleChefPick(id) {

    if (
        selectedChefPicks.includes(id)
    ) {

        selectedChefPicks =
            selectedChefPicks.filter(
                itemId =>
                    itemId !== id
            );

    }

    else if (
        selectedChefPicks.length < 3
    ) {

        selectedChefPicks.push(id);

    }

    else {

        alert(
            "Please select at most three Chef Picks."
        );

        return;

    }


    updateChefPickUI();
}


function updateChefPickUI() {

    document
        .querySelectorAll(
            ".json-card"
        )
        .forEach(card => {

            const selected =
                selectedChefPicks.includes(
                    card.dataset.id
                );


            card.classList.toggle(
                "selected",
                selected
            );


            const button =
                card.querySelector(
                    ".json-select-btn"
                );


            if (button) {

                button.textContent =
                    selected
                        ? "✓ Selected"
                        : "Select";

            }

        });


    const result =
        document.getElementById(
            "smartComboResult"
        );


    if (!result) {
        return;
    }


    const selected =
        chefPicks.filter(
            item =>
                selectedChefPicks.includes(
                    item.id
                )
        );


    if (selected.length === 0) {

        result.textContent =
            "Choose items to build your combo.";

        return;
    }


    const total =
        selected.reduce(
            (sum, item) =>
                sum + item.price,
            0
        );


    result.textContent =
        `${selected.length}/3 selected • ` +
        `${selected
            .map(item => item.name)
            .join(" + ")} • ` +
        `Total ₹${total}`;
}


/* =====================================================
   ROUND 2 - CHANGE 9
   LIGHT / DARK THEME
   ===================================================== */

function setupThemeController() {

    const toggle =
        document.getElementById(
            "themeToggle"
        );


    const savedTheme =
        localStorage.getItem(
            "ratelxTheme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark-theme"
        );

    }


    if (!toggle) {
        return;
    }


    const updateButton =
        () => {

            const dark =
                document.body.classList.contains(
                    "dark-theme"
                );


            toggle.textContent =
                dark ? "☀️" : "🌙";


            toggle.title =
                dark
                    ? "Switch to light mode"
                    : "Switch to dark mode";


            toggle.setAttribute(
                "aria-label",
                toggle.title
            );

        };


    updateButton();


    toggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-theme"
            );


            const theme =
                document.body.classList.contains(
                    "dark-theme"
                )
                    ? "dark"
                    : "light";


            localStorage.setItem(
                "ratelxTheme",
                theme
            );


            updateButton();

        }
    );
}


/* =====================================================
   ROUND 2 - CHANGE 10
   SMART COMBO BUILDER
   JSON + DOM + EVENTS
   ===================================================== */

function setupSmartCombo() {

    renderChefPicks();


    const clearButton =
        document.getElementById(
            "clearComboBtn"
        );


    const addButton =
        document.getElementById(
            "addComboBuilderBtn"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                selectedChefPicks = [];

                updateChefPickUI();

            }
        );

    }


    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                if (
                    selectedChefPicks.length !== 3
                ) {

                    alert(
                        "Please select exactly three Chef Picks before adding the combo."
                    );

                    return;
                }


                const selected =
                    chefPicks.filter(
                        item =>
                            selectedChefPicks.includes(
                                item.id
                            )
                    );


                const total =
                    selected.reduce(
                        (sum, item) =>
                            sum + item.price,
                        0
                    );


                cart.push({

                    name:
                        "Smart Chef Picks Combo",

                    price:
                        total

                });


                saveCart();


                alert(
                    `Smart Combo added to your order for ₹${total}!`
                );

            }
        );

    }
}


/* =====================================================
   PAGE INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Existing functionality */

        updateCartCount();

        displayOrder();

        setupOrderForm();

        setupRatingForm();


        /* Round 2 */

        setupWelcomeMessage();

        setupDynamicModification();

        setupMenuSearch();

        setupEventChallenge();

        setupFoodModal();

        setupBillCalculator();

        setupThemeController();

        setupSmartCombo();


        /* Apply menu filters */

        applyMenuFilters();

    }
);
