document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const keywordInput = document.getElementById("keyword");
  const resultsContainer = document.getElementById("results");
  const loadingContainer = document.getElementById("loading");

  // Função para lidar com a chamada à API/Back-End
  const fetchData = async () => {
    const keyword = keywordInput.value.trim();
    if (keyword) {
      resultsContainer.innerHTML = ""; // Apaga os resultados anteriores
      loadingContainer.style.display = "block"; // Mostra o elemento de carregamento
      try {
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
        loadingContainer.style.display = "none"; // Oculta o elemento de carregamento
      }
    } else {
      resultsContainer.innerHTML = "<p>Please enter a keyword to search.</p>";
    }
  };

  // Evento ao clicar no botão
  searchBtn.addEventListener("click", async () => {
    await fetchData();
  });

  // Evento para verificar se a tecla Enter foi pressionada
  keywordInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      await fetchData();
    }
  });

  // Função para mostrar os resultados do fetch dos produtos
  function displayResults(products) {
    resultsContainer.innerHTML = "";
    products.forEach((product) => {
      if (
        product.title &&
        !/Check each product page for other buying options/i.test(product.title)
      ) {
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
  }
});
