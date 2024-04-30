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
      try {
        resultsContainer.innerHTML = ""; // Clear previous results
        loadingContainer.style.display = "block"; // Show loading element

        // Make the request to the API
        const response = await fetch(
          `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(
            keyword
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        if (data.products.length > 0) {
          displayResults(data.products);
        } else {
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
  const searchHandler = async () => {
    await fetchData();
  };

  // Event to check if Enter key was pressed
  const enterKeyHandler = async (event) => {
    if (event.key === "Enter") {
      await fetchData();
    }
  };

  // Function to display results from product fetch
  const displayResults = (products) => {
    resultsContainer.innerHTML = ""; // Clear previous results
    products.forEach((product) => {
      // Check if the product has a title and if has a rating
      if (product.title && product.rating) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        const image = document.createElement("img");
        image.src = product.image;
        productDiv.appendChild(image);

        const productInfosDiv = document.createElement("div");
        productInfosDiv.classList.add("product-info");
        productDiv.appendChild(productInfosDiv);

        const title = document.createElement("div");
        title.classList.add("product-title");
        title.textContent = product.title;
        productInfosDiv.appendChild(title);

        const rating = document.createElement("div");
        rating.classList.add("product-rating");
        rating.textContent = `Rating: ${product.rating}`;
        productInfosDiv.appendChild(rating);

        const reviews = document.createElement("div");
        reviews.classList.add("product-reviews");
        reviews.textContent = `Reviews: ${product.numReviews}`;
        productInfosDiv.appendChild(reviews);

        resultsContainer.appendChild(productDiv);
      }
    });
  };

  // Click event on the button
  searchBtn.addEventListener("click", searchHandler);
  // Event to check if Enter key was pressed
  keywordInput.addEventListener("keydown", enterKeyHandler);
});
