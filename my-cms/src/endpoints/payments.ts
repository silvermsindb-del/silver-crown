import { PayloadHandler } from 'payload/config'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'test_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret',
})

export const createRazorpayOrder: PayloadHandler = async (req: any, res: any) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    try {
        const { orderId } = req.body

        if (!orderId) {
            res.status(400).json({ error: 'Order ID is required' })
            return
        }

        // specific to payload version, using req.payload to fetch order
        const order = await req.payload.findByID({
            collection: 'orders',
            id: orderId,
        })

        if (!order) {
            res.status(404).json({ error: 'Order not found' })
            return
        }

        const options = {
            amount: order.total * 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${orderId}`,
        }

        const razorpayOrder = await razorpay.orders.create(options)

        res.status(200).json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
        })
    } catch (error) {
        console.error('Error creating Razorpay order:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const verifyRazorpayPayment: PayloadHandler = async (req: any, res: any) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body

        const body = razorpay_order_id + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_key_secret')
            .update(body.toString())
            .digest('hex')

        const isAuthentic = expectedSignature === razorpay_signature

        if (isAuthentic) {
            // Payment successful, update order status
            await req.payload.update({
                collection: 'orders',
                id: orderId,
                data: {
                    // @ts-ignore
                    status: 'processing', // or 'paid' if you have that status
                    transactionId: razorpay_payment_id,
                },
            })

            res.status(200).json({ success: true, message: 'Payment verified successfully' })
        } else {
            res.status(400).json({ success: false, error: 'Invalid signature' })
        }
    } catch (error) {
        console.error('Error verifying payment:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
