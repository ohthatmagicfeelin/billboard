import { paymentService } from '../services/paymentService.js'
import { catchAsync } from '../../../utils/catchAsync.js'

export const createUser = catchAsync(async (req, res) => {
    const result = await paymentService.createUser(req.body)
    res.json({ success: true, userId: result.userId })
})

export const createPaymentIntent = catchAsync(async (req, res) => {
    const result = await paymentService.createPaymentIntent(req.body)
    res.json({ clientSecret: result.clientSecret })
})

export const createSubscription = catchAsync(async (req, res) => {
    const result = await paymentService.createSubscription(req.body)
    res.json(result)
})

export const getActiveSubscription = catchAsync(async (req, res) => {
    const subscription = await paymentService.getActiveSubscription(req.params.userId)
    res.json(subscription)
})


