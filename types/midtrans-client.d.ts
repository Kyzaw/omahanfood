declare module 'midtrans-client' {
    namespace midtransClient {
      class Snap {
        constructor(config: {
          isProduction: boolean
          serverKey: string
          clientKey: string
        })
  
        createTransactionToken(parameter: {
          transaction_details: {
            order_id: string
            gross_amount: number
          }
        }): Promise<string>
      }
  
      class CoreApi {
        constructor(config: {
          isProduction: boolean
          serverKey: string
          clientKey: string
        })
      }
    }
  
    export = midtransClient
  }
  