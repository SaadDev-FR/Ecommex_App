const Order = require('../models/order');
const { OrderStatus, PaymentStatus } = require('../utils/orderConstants');
const { totalOrderAmount } = require('../utils/common')
const { STRIPE_SECRET_KEY } = require('../utils/constants')
const Product = require('../models/product');


const getAllOrders = async (req, res, next) => {

    try {
        const dateFilter = req.query.date_filter;

        const query = { createdBy: req.user.wholeSellerId, createdAt: null };

        let days = [];
        switch (dateFilter) {
            case 'today':
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0);

                query.createdAt = {
                    $gte: todayStart,
                    $lte: new Date().setHours(23, 59, 59, 999)
                };
                break;

            case 'weekly':

                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - 7);
                weekStart.setHours(0, 0, 0, 0);

                query.createdAt = {
                    $gte: weekStart,
                    $lte: new Date().setHours(23, 59, 59, 999)
                };
                days = get_last_n_days_date(7);
                break;

            case 'monthly':
                const startMonth = new Date();
                startMonth.setDate(startMonth.getDate() - 30);
                startMonth.setHours(0, 0, 0, 0);

                query.createdAt = {
                    $gte: startMonth,
                    $lte: new Date().setHours(23, 59, 59, 999)
                };
                days = get_last_n_days_date(30);
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
                    days = get_last_n_days_date(days_difference(startDate));
                }


                break;
        }


        const products = await Product.find({ createdBy: query.createdBy });
        const productIds = products.map(product => product.id)

        let orders = null;

        if (query.createdAt) {

            orders = await Order.find({ createdAt: query.createdAt, 'products.productId': { $in: productIds } })
                .populate({
                    path: 'customer.customerId',
                    select: ['firstName', 'lastName']
                }).populate('products.productId');
        }
        else {
            orders = await Order.find({ 'products.productId': { $in: productIds } })
                .populate({
                    path: 'customer.customerId',
                    select: ['firstName', 'lastName']
                }).populate('products.productId').sort({ createdAt: 1 });

            const start_date = new Date(orders[0].createdAt)

            days = get_last_n_days_date(days_difference(start_date));

        }


        let totalSale = 0;
        orders?.forEach(order => {
            let totalAmount = 0;

            order.products.forEach(product => {

                if (product.productId) {
                    totalAmount += product.price * product.quantity;
                    totalSale += product.price * product.quantity
                }
            });

            order.totalAmount = totalAmount

        });

        orders.totalSale = totalSale;

        const total_by_date = days.map(day => {
            const order_stats = { date: day, total: 0 };
            orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const last_n_date = new Date(day);
                if (
                    orderDate.getDate() == last_n_date.getDate() &&
                    orderDate.getMonth() == last_n_date.getMonth() &&
                    orderDate.getFullYear() == last_n_date.getFullYear()
                )
                    order_stats.total += order.totalAmount
            });

            return order_stats

        });

        return { orders, totalSale, total_by_date }
    } catch (error) {
        throw new Error('Failed to retrieve Orders: ' + error.message);
    }
}


const get_last_n_days_date = (last_n_days = 7) => {
    const dates = []
    const today = new Date();

    for (let i = 0; i < last_n_days; i++) {
        const date = new Date()
        date.setDate(today.getDate() - i)
        dates.push(date);
    }

    dates.sort((a, b) => a - b)

    return dates;
}

const days_difference = (start_date) => {

    const end_date = new Date()

    // Calculate the difference in milliseconds between the two dates
    const differenceMs = end_date - start_date;

    return Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

}


module.exports = {
    getAllOrders,

};
