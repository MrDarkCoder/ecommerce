import expressAsyncHandler from "express-async-handler";

import Order from "../modals/orderModal.js";

// @description Create new Order
// @droute POST /api/orders
// @dacess Private

const addOrderItems = expressAsyncHandler(async (request, response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = request.body;

  if (orderItems && orderItems.length === 0) {
    response.status(400);
    throw new Error("no Order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: request.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    response.status(201).json(createdOrder);
  }
});

// @description get order by ID
// @droute GET /api/orders/:id
// @dacess Private

const getOrderById = expressAsyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    response.json(order);
  } else {
    response.status(404);
    throw new Error("Order Not Found");
  }
});

// @description Update order to paid
// @droute GET /api/orders/:id/pay
// @dacess Private

const updateOrderToPaid = expressAsyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: request.body.id,
      status: request.body.status,
      update_time: request.body.update_time,
      email_address: request.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    response.json(updatedOrder);
  } else {
    response.status(404);
    throw new Error("Order Not Found");
  }
});

// @description Update order to deliovered
// @droute GET /api/orders/:id/deliver
// @dacess Private?Admin

const updateOrderToDelivered = expressAsyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    response.json(updatedOrder);
  } else {
    response.status(404);
    throw new Error("Order Not Found");
  }
});

// @description Get logged in user orders
// @droute GET /api/orders/myorders
// @dacess Private

const getMyOrder = expressAsyncHandler(async (request, response) => {
  const orders = await Order.find({ user: request.user._id });

  response.json(orders);
});

// @description Get all orders
// @droute GET /api/orders
// @dacess Private?admin

const getOrders = expressAsyncHandler(async (request, response) => {
  const orders = await Order.find({ }).populate('user', 'id name');

  response.json(orders);
});

export { addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrder, getOrders };
