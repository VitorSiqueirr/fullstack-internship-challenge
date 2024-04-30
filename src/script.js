document.addEventListener("DOMContentLoaded", () => {
  // Get the DOM elements
  const searchBtn = document.getElementById("searchBtn");
  const keywordInput = document.getElementById("keyword");
  const resultsContainer = document.getElementById("results");
  const loadingContainer = document.getElementById("loading");

  // Function to handle API/Back-End call
  const fetchData = async () => {
    // Get the keyword from the input element
    const keyword = keywordInput.value.trim();
    if (keyword) {
      resultsContainer.innerHTML = ""; // Clear previous results
      loadingContainer.style.display = "block"; // Show loading element
      try {
        // Make the request to the API
        const response = await fetch(
          `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(
            keyword
          )}`
        );

        // Check if the response was successful
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        // Check if there are any results
        if (data.products.length > 0) {
          // Display the results
          displayResults(data.products);
        } else {
          // No results found
          resultsContainer.innerHTML = "<p>No results found.</p>";
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        resultsContainer.innerHTML =
          "<p>An error occurred. Please try again later.</p>";
      } finally {
        loadingContainer.style.display = "none"; // Hide loading element
      }
    } else {
      // No keyword entered
      resultsContainer.innerHTML = "<p>Please enter a keyword to search.</p>";
    }
  };

  // Click event on the button
  searchBtn.addEventListener("click", async () => {
    await fetchData();
  });

  // Event to check if Enter key was pressed
  keywordInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      await fetchData();
    }
  });

  // Function to display results from product fetch
  function displayResults(products) {
    // Clear previous results
    resultsContainer.innerHTML = "";
    products.forEach((product) => {
      // Check if the product has a title and is not a "Check each product page for other buying options" message
      if (
        product.title &&
        !/Check each product page for other buying options/i.test(product.title)
      ) {
        // Create a new div for the product
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        // Create an image element for the product
        const image = document.createElement("img");
        image.src = product.image;
        productDiv.appendChild(image);

        // Create a div for the product information
        const productInfosDiv = document.createElement("div");
        productInfosDiv.classList.add("product-info");
        productDiv.appendChild(productInfosDiv);

        // Create a div for the product title
        const title = document.createElement("div");
        title.classList.add("product-title");
        title.textContent = product.title;
        productInfosDiv.appendChild(title);

        // Create a div for the product rating
        const rating = document.createElement("div");
        rating.classList.add("product-rating");
        rating.textContent = `Rating: ${product.rating}`;
        productInfosDiv.appendChild(rating);

        // Create a div for the product number of reviews
        const reviews = document.createElement("div");
        reviews.classList.add("product-reviews");
        reviews.textContent = `Reviews: ${product.numReviews}`;
        productInfosDiv.appendChild(reviews);

        // make the productDiv child of the resultsContainer
        resultsContainer.appendChild(productDiv);
      }
    });
  }
});
