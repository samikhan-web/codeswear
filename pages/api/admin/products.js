import connectDb from "@/middleware/mongoose";
import Product from "@/models/Product";

async function handler(req,res){

 if(req.method === "GET"){

   try{

     const products = await Product.find();

     res.status(200).json({
       success:true,
       products
     })

   }catch(error){

     res.status(500).json({
       success:false
     })

   }

 }

}

export default connectDb(handler);