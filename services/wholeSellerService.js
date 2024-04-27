const Order = require('../models/order');
const { OrderStatus, PaymentStatus } = require('../utils/orderConstants');
const { totalOrderAmount } = require('../utils/common')
const { STRIPE_SECRET_KEY } = require('../utils/constants')
const Product = require('../models/product');


const getAllOrders = async (req, res, next) => {

    try {
        const dateFilter = req.query.date_filter;

        const query = { createdBy: req.user.wholeSellerId };

        switch (dateFilter) {
            case 'today':
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0); 

                query.createdAt = {
                    $gte: todayStart, 
                    $lte: new Date() 
                };
                break;

            case 'weekly':
                
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - 7);
                weekStart.setHours(0, 0, 0, 0); 

                query.createdAt = {
                    $gte: weekStart, 
                    $lte: new Date() 
                };
                break;

            case 'monthly':
                const startMonth = new Date();
                startMonth.setDate(1);
                startMonth.setHours(0, 0, 0, 0); 

                query.createdAt = {
                    $gte: startMonth, 
                    $lte: new Date() 
                };
                break;

            case 'custom':
                if (req.query.start_date && req.query.end_date) {
                    const startDate = new Date(req.query.start_date);
                    const endDate = new Date(req.query.end_date);

                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(23, 59, 59, 999);

                    query.createdAt = {
                        $gte: startDate, 
                        $lte: endDate 
                    };
                }
                break;
        }


        const products = await Product.find(query);
        const productIds = products.map(product => product.id)

        const orders = await Order.find({ 'products.productId': { $in: productIds } })
            .populate({
                path: 'customer.customerId',
                select: ['firstName', 'lastName']
            }).populate('products.productId');


        let totalSale = 0;
        orders?.forEach(order => {
            let totalAmount = 0;

            order.products.forEach(product => {

                if (product.productId) {
                    totalAmount += product.productId.price.amount * product.quantity;
                    totalSale += product.productId.price.amount * product.quantity
                }
            });

            order.totalAmount = totalAmount

        });

        orders.totalSale = totalSale;

        return { orders, totalSale }
    } catch (error) {
        throw new Error('Failed to retrieve Orders: ' + error.message);
    }
}


module.exports = {
    getAllOrders,

};
