import { NextResponse } from "next/server"

const midtransClient = require('midtrans-client')

let snap = new midtransClient.Snap({
    isProduction:false,
    serverKey:process.env.SECRET_MIDTRANS,
    clientKey:process.env.NEXT_PUBLIC_MIDTRANS_CLIENT
})

export async function POST(req: Request) {
    const { id, totalAmount } = await req.json()

    const parameter = {
        transaction_details: {
            order_id: id,
            gross_amount: totalAmount,
        },
    }

    const token = await snap.createTransactionToken(parameter)
    console.log(token)
    return NextResponse.json({ token })
}