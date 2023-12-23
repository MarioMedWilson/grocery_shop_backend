const priceFilter = (req, res, next) => {
  
  // Extract minimum and maximum prices from query parameters
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);

  // Ensure that minPrice and maxPrice are valid numbers
  if (!isNaN(minPrice) && !isNaN(maxPrice)) {
    // Assuming you have a products array in the request object
    const products = req.products;

    // Filtering logic based on price
    const filteredProducts = products.filter(product => {
      const productPrice = parseFloat(product.price);
      return !isNaN(productPrice) && productPrice >= minPrice && productPrice <= maxPrice;
    });

    // Attach filtered products to the request object
    req.filteredProducts = filteredProducts;
  }

  // Continue to the next middleware or route handler
  next();
};

module.exports = priceFilter;
