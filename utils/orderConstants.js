const OrderStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

const PaymentMethod = {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    PAYPAL: 'paypal',
    CASH_ON_DELIVERY: 'cash_on_delivery',
    BANK_TRANSFER: 'bank_transfer',
    OTHER: 'other'
};

const PaymentStatus = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    PARTIAL_REFUND: 'partial_refund',
    CANCELLED: 'cancelled'
};

const ShippingMethod = {
    STANDARD: 'standard',
    EXPRESS: 'express',
    NEXT_DAY: 'next_day',
    SAME_DAY: 'same_day',
    IN_STORE_PICKUP: 'in_store_pickup',
    OTHER: 'other'
};

module.exports ={
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
    ShippingMethod
}