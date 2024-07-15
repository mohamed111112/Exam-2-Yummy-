$(function () {
    $(".loadingScreen").fadeOut(700, function () {
        $("body").css("overflow", "auto");
    });

    const sidebar = $(".sidebar");
    const innerBar = $(".innerBar");
    let innerBarWidth = innerBar.innerWidth();
    sidebar.css("left", -innerBarWidth);
    const navLinks = $(".navLinks li");
    const mealsContainer = $("#mealsData");
    const searchContainer = $("#searchBox");
    const contactContainer = $("#contactBox");
    const baseApi = " https://www.themealdb.com/api/json/v1/1";

    function opensidebar() {
        sidebar.animate({
            left: 0
        }, 500);
        $(".openCloseBtn i").attr("class", "fa-solid fa-xmark fa-2x");

        for (let i = 0; i < navLinks.length; i++) {
            const delay = 100 * i;
            navLinks.eq(i).delay(delay).animate({
                top: 0
            }, 500);
        }
    }

    function closesidebar() {
        sidebar.animate({
            left: -innerBarWidth
        }, 500);
        $(".openCloseBtn i").attr("class", "fa-solid fa-bars fa-2x");
        navLinks.animate({
            top: "300px"
        }, 500);
    }

    $(".openCloseBtn").on("click", function () {
        if (sidebar.css("left") == "0px") {
            closesidebar();
        } else {
            opensidebar();
        }
    });

    let meals = [];

    async function getMeals() {
        let mealAPI = await fetch(
            `${baseApi}/search.php?s=`
        );

        let response = await mealAPI.json();
        meals = response.meals;

        displayMeals();
    }

    getMeals();

    function displayMeals() {
        let mealsData = ``;
        for (let i = 0; i < meals.length; i++) {
            mealsData += `
            <div class="col-md-4 col-lg-3">
            <div class="meal">
            <img src="${meals[i].strMealThumb}" loading="lazy" class="w-100" alt="${meals[i].strMea}">
            <div class="layer">
            <h2 data-id="${meals[i].idMeal}">${meals[i].strMeal}</h2>
            </div>
            </div>
            </div>`;
        }
        mealsContainer.html(`${mealsData}`);

        $(".meal").on("click", function () {
            let mealId = $(this).find("h2").attr("data-id");
            getMealById(mealId);
        });
    }

    function displayInstructions(meal) {
        $("#mealsData").html("");
        let Ingredients = ``;
        for (let i = 0; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                Ingredients += `<li class="alert alert-info m-2 p-1">${
                meal[`strMeasure${i}`]
                } ${meal[`strIngredient${i}`]}</li>`;
            }
        }

        let mealTags = [];
        if (
            meal.hasOwnProperty("strTags") &&
            meal.strTags !== null &&
            meal.strTags !== undefined &&
            meal.strTags !== ""
        ) {
            mealTags = meal.strTags.split(",");
        } else {
            mealTags = [];
        }

        let tags = ``;
        for (let i = 0; i < mealTags.length; i++) {
            tags += `
            <li class="alert alert-danger m-2 p-1">${mealTags[i]}</li>`;
        }

        let mealInfo = `
        <div class="col-lg-4">
        <img
        src="${meal.strMealThumb}"
        class="rounded-2 w-100 mb-3"
        alt=""
        />
        <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-lg-8">
        <h2 class="fw-bold">Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bold">Area: </span>${meal.strArea}</h3>
        <h3><span class="fw-bold">Category: </span>${meal.strCategory}</h3>
        <h3><span class="fw-bold">Ingredients:</span></h3>
        <ul class="list-unstyled d-flex flex-wrap g-3">
        ${Ingredients}
        </ul>
        <h3><span class="fw-bold">Tags:</span></h3>
        <ul class="list-unstyled d-flex flex-wrap g-3">
        ${tags}
        </ul>
        <a href="${meal.strSource}" class="btn btn-success" target="_blank">Source</a>
        <a href="${meal.strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>
        </div>`;

        mealsContainer.html(`${mealInfo}`);
    }

    async function getMealsByName(meal) {
        $(".loadingScreen").fadeIn(300);
        let mealAPI = await fetch(
            `${baseApi}/search.php?s=${meal}`
        );

        let response = await mealAPI.json();
        meals = response.meals;
        displayMeals();
        $(".loadingScreen").fadeOut(300);
    }

    async function getMealsByFirstLetter(letter) {
        $(".loadingScreen").fadeIn(300);
        let mealAPI = await fetch(
            `${baseApi}/search.php?f=${letter}`
        );

        let response = await mealAPI.json();
        meals = response.meals;
        displayMeals();
        $(".loadingScreen").fadeOut(300);
    }

    navLinks.eq(0).on("click", function () {
        mealsContainer.html("");
        contactContainer.html("");
        closesidebar();
        searchMealInputs();
        sidebar.css("z-index", 99999);
    });

    function searchMealInputs() {
        let searchInputs = `
        <div class="col-md-6">
        <input
        type="text"
        class="inputByName form-control bg-transparent text-white"
        placeholder="Search By Name"
        />
        </div>
        <div class="col-md-6">
        <input
        type="text"
        maxlength="1"
        class="inputByLetter form-control bg-transparent text-white"
        placeholder="Search By First Letter"
        />
        </div>
        `;

        searchContainer.html(`${searchInputs}`);

        $(".inputByName").on("input", function () {
            let searchInput = $(this).val();
            getMealsByName(searchInput);
        });
        $(".inputByLetter").on("input", function () {
            let searchInputLetter = $(this).val();
            getMealsByFirstLetter(searchInputLetter);
        });
    }

    navLinks.eq(1).on("click", function () {
        mealsContainer.html("");
        searchContainer.html("");
        contactContainer.html("");
        closesidebar();
        getCategories();
    });

    let categories = [];
    async function getCategories() {
        $(".loadingScreen").fadeIn(300);
        let mealAPI = await fetch(
            `${baseApi}/categories.php`
        );

        let response = await mealAPI.json();
        categories = response.categories;

        displayCategories();
        $(".loadingScreen").fadeOut(300);
    }

    function displayCategories() {
        let categoryData = ``;
        for (let i = 0; i < categories.length; i++) {
            let imgSrc = categories[i].strCategoryThumb;
            let category = categories[i].strCategory;
            categoryData += `
            <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="meal">
            <img src="${imgSrc}" class="w-100" loading="lazy" alt="${category}">
            <div class="layer"><h2>${category}</h2></div>
            </div>
            </div>`;
        }
        mealsContainer.html(`${categoryData}`);

        $(".meal").on("click", function () {
            let category = $(this).find("h2").html();

            displayMealsByCategory(category);
        });
    }

    let filteredMeals = [];

    async function displayMealsByCategory(category) {
        $(".loadingScreen").fadeIn(300);
        let mealAPI = await fetch(
            `${baseApi}/filter.php?c=${category}`
        );

        let response = await mealAPI.json();
        filteredMeals = response.meals;

        displayFilteredMeals();
        $(".loadingScreen").fadeOut(300);
    }

    function displayFilteredMeals() {
        let mealsData = ``;
        for (let i = 0; i < filteredMeals.length; i++) {
            let imgSrc = filteredMeals[i].strMealThumb;
            let mealName = filteredMeals[i].strMeal;
            let mealId = filteredMeals[i].idMeal;
            mealsData += `
            <div class="col-md-3">
            <div class="meal">
            <img src="${imgSrc}" class="w-100" loading="lazy" alt="${mealName}">
            <div class="layer"><h2 data-id="${mealId}">${mealName}</h2></div>
            </div>
            </div>`;
        }
        mealsContainer.html(`${mealsData}`);

        $(".meal").on("click", function () {
            let mealId = $(this).find("h2").attr("data-id");
            getMealById(mealId);
        });
    }

    async function getMealById(mealId) {
        $(".loadingScreen").fadeIn(300);
        let mealAPI = await fetch(
            `${baseApi}/lookup.php?i=${mealId}`
        );

        let response = await mealAPI.json();
        const meal = response.meals[0];

        displayInstructions(meal);
        $(".loadingScreen").fadeOut(300);
    }

    navLinks.eq(2).on("click", function () {
        mealsContainer.html("");
        searchContainer.html("");
        contactContainer.html("");
        closesidebar();
        getAreas();
    });

    let areas = [];

    async function getAreas() {
        $(".loadingScreen").fadeIn(300);
        let mealAPI = await fetch(
            `${baseApi}/list.php?a=list`
        );

        let response = await mealAPI.json();
        areas = response.meals;
        displayAreas();
        $(".loadingScreen").fadeOut(300);
    }

    function displayAreas() {
        let areaInfo = ``;
        for (let i = 0; i < areas.length; i++) {
            areaInfo += `
            <div class="col-sm-6 col-md-4 col-lg-3 text-center area">
            <i class="fa-solid fa-house fa-4x mb-2"></i>
            <h3>${areas[i].strArea}</h3>
            </div>
            `;
        }

        mealsContainer.html(`${areaInfo}`);

        $(".area").on("click", function () {
            let area = $(this).find("h3").html();
            getMealsByArea(area);
        });
    }

    async function getMealsByArea(area) {
        $(".loadingScreen").fadeIn(300);
        let mealAPI = await fetch(
            `${baseApi}/filter.php?a=${area}`
        );

        let response = await mealAPI.json();
        filteredMeals = response.meals;
        displayFilteredMeals();
        $(".loadingScreen").fadeOut(300);
    }

    navLinks.eq(3).on("click", function () {
        mealsContainer.html("");
        searchContainer.html("");
        contactContainer.html("");
        closesidebar();
        getIngredients();
    });

    let mealIngredients = [];

    async function getIngredients() {
        $(".loadingScreen").fadeIn(300);
        let mealAPI = await fetch(
            `${baseApi}/list.php?i=list`
        );

        let response = await mealAPI.json();
        mealIngredients = response.meals;
        displayingredients();
        $(".loadingScreen").fadeOut(300);
    }

    function displayingredients() {
        let ingredientsInfo = ``;
        for (let i = 0; i < 20; i++) {
            ingredientsInfo += `
            <div class="col-sm-6 col-md-4 col-lg-3 text-center ingredient">
            <i class="fa-solid fa-bowl-rice fa-4x"></i>
            <h3>${mealIngredients[i].strIngredient}</h3>
            </div>
            `;
        }

        mealsContainer.html(`${ingredientsInfo}`);

        $(".ingredient").on("click", function () {
            let ingredient = $(this).find("h3").html();

            getMealsByingredient(ingredient);
        });
    }

    async function getMealsByingredient(ingredient) {
        $(".loadingScreen").fadeIn(300);
        let mealAPI = await fetch(
            `${baseApi}/filter.php?i=${ingredient}`
        );

        let response = await mealAPI.json();
        filteredMeals = response.meals;
        displayFilteredMeals();
        $(".loadingScreen").fadeOut(300);
    }

    navLinks.eq(4).on("click", function () {
        mealsContainer.html("");
        searchContainer.html("");
        closesidebar();
        getContactInputs();
    });

    function getContactInputs() {
        let contactInputs = `
        <div class="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div class="row g-3">
        <div class="col-md-6">
        <input
        type="text"
        placeholder="Enter Your Name"
        class="nameInput form-control"
        />
        <p class="mt-3 fw-bold d-none text-danger alert alert-danger" id="nameWarning">
        Special characters and numbers not allowed!
        </p>
        </div>
        <div class="col-md-6">
        <input
        type="email"
        placeholder="Enter Your Email"
        class="email form-control"
        />
        <p class="mt-3 fw-bold d-none text-danger alert alert-danger" id="emailWarning">
        Email not valid! *exemple@yyy.zzz
        </p>
        </div>
        <div class="col-md-6">
        <input
        type="text"
        placeholder="Enter Your Phone"
        class="phone form-control"
        />
        <p class="mt-3 fw-bold d-none text-danger alert alert-danger" id="phoneWarning">
        Enter valid Phone Number
        </p>
        </div>
        <div class="col-md-6">
        <input
        type="number"
        placeholder="Enter Your Age"
        class="age form-control"
        />
        <p class="mt-3 fw-bold d-none text-danger alert alert-danger" id="ageWarning">
        Enter valid age
        </p>
        </div>
        <div class="col-md-6">
        <input
        type="password"
        placeholder="Enter Your Password"
        class="password form-control"
        />
        <p class="mt-3 fw-bold d-none text-danger alert alert-danger" id="passwordWarning">
        Enter valid password *Minimum 8 characters, at least 1
        letter and 1 number*
        </p>
        </div>
        <div class="col-md-6">
        <input
        type="password"
        placeholder="Re-Enter Your Password"
        class="repassword form-control"
        />
        <p class="mt-3 fw-bold d-none text-danger alert alert-danger" id="repasswordWarning">
        Your password doesn't match! please try again
        </p>
        </div>
        </div>
        <button disabled="true" id="submitBtn" class="btn btn-outline-danger mt-3 px-4">
        Submit
        </button>
        </div>
        `;

        contactContainer.html(`${contactInputs}`);

        const userName = $(".nameInput");
        const email = $(".email");
        const phone = $(".phone");
        const age = $(".age");
        const password = $(".password");
        const repassword = $(".repassword");
        const submitBtn = $("#submitBtn");
        const nameWarning = document.getElementById("nameWarning");
        const emailWarning = document.getElementById("emailWarning");
        const phoneWarning = document.getElementById("phoneWarning");
        const ageWarning = document.getElementById("ageWarning");
        const passwordWarning = document.getElementById("passwordWarning");
        const repasswordWarning = document.getElementById("repasswordWarning");

        userName.on("input", function () {
            if (nameValidation(userName.val())) {
                enableBtn();
                nameWarning.classList.add("d-none");
            } else {
                nameWarning.classList.remove("d-none");
                submitBtn.attr("disabled", true);
            }
        });

        email.on("input",
            function () {
                if (emailValidation(email.val())) {
                    enableBtn();
                    emailWarning.classList.add("d-none");
                } else {
                    emailWarning.classList.remove("d-none");
                    submitBtn.attr("disabled", true);
                }
            });

        phone.on("input",
            function () {
                if (phoneValidation(phone.val())) {
                    enableBtn();
                    phoneWarning.classList.add("d-none");
                } else {
                    phoneWarning.classList.remove("d-none");
                    submitBtn.attr("disabled", true);
                }
            });

        age.on("input",
            function () {
                if (ageValidation(age.val())) {
                    enableBtn();
                    ageWarning.classList.add("d-none");
                } else {
                    ageWarning.classList.remove("d-none");
                    submitBtn.attr("disabled", true);
                }
            });

        password.on("input",
            function () {
                if (passwordValidation(password.val())) {
                    enableBtn();
                    passwordWarning.classList.add("d-none");
                } else {
                    passwordWarning.classList.remove("d-none");
                    submitBtn.attr("disabled", true);
                }
            });

        repassword.on("input",
            function () {
                if (repasswordValidation(repassword.val())) {
                    enableBtn();
                    repasswordWarning.classList.add("d-none");
                } else {
                    repasswordWarning.classList.remove("d-none");
                    submitBtn.attr("disabled", true);
                }
            });

        function nameValidation(userName) {
            const nameRegex = /^[a-zA-Z ]+$/;
            return nameRegex.test(userName);
        }

        function emailValidation(email) {
            const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(email);
        }

        function phoneValidation(phone) {
            const phoneRegex =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return phoneRegex.test(phone);
        }

        function ageValidation(age) {
            const ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
            return ageRegex.test(age);
        }

        function passwordValidation(password) {
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
            return passwordRegex.test(password);
        }

        function repasswordValidation(repassword) {
            return repassword == password.val();
        }

        function enableBtn() {
            if (
                nameValidation(userName.val()) &&
                emailValidation(email.val()) &&
                phoneValidation(phone.val()) &&
                ageValidation(age.val()) &&
                passwordValidation(password.val()) &&
                repasswordValidation(repassword.val())
            ) {
                submitBtn.attr("disabled", false);
            } else {
                submitBtn.attr("disabled", true);
            }
        }
    }
});