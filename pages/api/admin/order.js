import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";

async function handler(req,res){

 if(req.method === "GET"){

   const {id} = req.query;

   try{

    const order = await Order.findById(id);

    res.status(200).json({
      success:true,
      order
    })

   }catch(error){

    res.status(500).json({
      success:false,
      message:"Order not found"
    })

   }

 }

}

export default connectDb(handler);