import midtransClient from "midtrans-client";
import { Request, Response } from "express";
import { errorRespone, respone } from "../utils/Response";

export const processPayment = async (order:any, products:any[], users:any , req : Request, res : Response) => {
  try {
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-sAtp_QY55EYAjSAaEN1Tbpo9",
      clientKey: "SB-Mid-client-SZHCkkY10C-Sv0pB",
    });

    const products_detail = products.map((product)=>{
      return {
        id: product._id,
        price : product.price,
        quantity: product.quantity,
        name: product.nama,
        category : product.category
      }
    })

    

    let parameter = {
      transaction_details: {
        order_id: order._id,
        gross_amount: order.total_amount,
      },
      item_details: products_detail,
      customer_details: {
      "first_name": users.nama,
      "email": users.email,
      "phone": users.no_hp,
      billing_address : {
          "address" : users.alamat
      }
    
}
    };

    snap.createTransaction(parameter).then((transaction: any) => {
      const dataPayment = {
        response: JSON.stringify(transaction),
      };
      let transactionToken = transaction.token;
      res.status(200).json({msg : "Success Payment", dataPayment, token : transactionToken});
    });
  } catch (error) {
    if (error) return res.status(500).json(errorRespone(error.message));
  }
};
