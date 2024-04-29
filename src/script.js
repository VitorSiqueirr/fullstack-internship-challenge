document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const keywordInput = document.getElementById("keyword");
  const resultsContainer = document.getElementById("results");

  searchBtn.addEventListener("click", async () => {
    const keyword = keywordInput.value.trim();
    if (keyword) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(
            keyword
          )}`
        );
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
      }
    } else {
      resultsContainer.innerHTML = "<p>Please enter a keyword to search.</p>";
    }
  });

  function displayResults(products) {
    resultsContainer.innerHTML = "";
    products.forEach((product) => {
      if (
        product.title != "" &&
        product.title != "Check each product page for other buying options."
      ) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        const image = document.createElement("img");
        image.src = product.image;
        productDiv.appendChild(image);

        const title = document.createElement("div");
        title.classList.add("product-title");
        title.textContent = product.title;
        productDiv.appendChild(title);

        const rating = document.createElement("div");
        rating.classList.add("product-rating");
        rating.textContent = `Rating: ${product.rating}`;
        productDiv.appendChild(rating);

        const reviews = document.createElement("div");
        reviews.classList.add("product-reviews");
        reviews.textContent = `Reviews: ${product.numReviews}`;
        productDiv.appendChild(reviews);

        resultsContainer.appendChild(productDiv);
      }
    });
  }
});
