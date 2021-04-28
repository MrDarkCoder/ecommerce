import expressAsyncHandler from "express-async-handler";

import Product from "../modals/productModal.js";

// @description Fetch all products
// @droute GET /api/products
// @dacess Public

const getProducts = expressAsyncHandler(async (request, response) => {
  const pageSize = 20;
  const page = Number(request.query.pageNumber) || 1;

  const keyword = request.query.keyword
    ? {
        name: {
          $regex: request.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  response.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @description Fetch one products
// @droute GET /api/products/:id
// @dacess Public

const getProductById = expressAsyncHandler(async (request, response) => {
  const product = await Product.findById(request.params.id);
  if (product) {
    response.json(product);
  } else {
    response.status(404);
    throw new Error("Product not Found");
  }
});

// @description DELETE products
// @droute DELETE /api/products/:id
// @dacess Private/ADmin

const deleteProduct = expressAsyncHandler(async (request, response) => {
  const product = await Product.findById(request.params.id);
  if (product) {
    await product.remove();
    response.json({ message: "Product Removed" });
  } else {
    response.status(404);
    throw new Error("Product not Found");
  }
});

// @description CREATE product
// @droute POST /api/products
// @dacess Private/ADmin

const createProduct = expressAsyncHandler(async (request, response) => {
  const product = new Product({
    name: "sample Name",
    price: 0,
    user: request.user._id,
    image: "/images/sample.jpg",
    brand: "sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "sample description",
  });

  const createdProduct = await product.save();
  response.status(201).json(createdProduct);
});

// @description UPDATE product
// @droute PUT /api/products/:ID
// @dacess Private/ADmin

const updateProduct = expressAsyncHandler(async (request, response) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = request.body;

  const product = await Product.findById(request.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    response.json(updatedProduct);
  } else {
    response.status(404);
    throw new Error("Product Not Found");
  }
});

// @description CREATE new Review
// @droute POST /api/products/:ID/reviews
// @dacess Private

const createProductReview = expressAsyncHandler(async (request, response) => {
  const { rating, comment } = request.body;

  const product = await Product.findById(request.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === request.user._id.toString()
    );

    if (alreadyReviewed) {
      response.status(400);
      throw new Error("product Already Reviewed");
    }

    const review = {
      name: request.user.name,
      rating: Number(rating),
      comment,
      user: request.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    response.status(201).json({ message: "Review Added" });
  } else {
    response.status(404);
    throw new Error("Product Not Found");
  }
});

// @description GET top Products
// @droute GET /api/products/top
// @dacess Public

const getTopProducts = expressAsyncHandler(async (request, response) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  response.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
