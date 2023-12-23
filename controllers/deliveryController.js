const deliveryTimeSlots = [...]; // Dummy data
let deliveryStatus = {...}; // Dummy data

exports.getDeliveryTimeSlots = (req, res) => {
  res.json({ delivery_time_slots: deliveryTimeSlots });
};

exports.selectDeliveryTimeSlot = (req, res) => {
  const { selected_time_slot, order_id } = req.body;

  if (selected_time_slot && order_id) {
    // Update delivery status
    deliveryStatus = {
      order_id: order_id,
      status: "Scheduled",
    };



    res.json({ message: "Delivery time slot selected successfully." });
  } else {
    res.status(400).json({ error: "Invalid request. Missing time slot or order ID." });
  }
};

exports.getDeliveryStatus = (req, res) => {
  res.json(deliveryStatus);
};
