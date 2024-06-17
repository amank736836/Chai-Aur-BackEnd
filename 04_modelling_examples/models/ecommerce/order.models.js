import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product',
            required : true,
        },
        quantity : {
            type : Number,
            required : true,
            // default : 1,
        }
    }
)

const orderSchema = new mongoose.Schema(
    {
        orderPrice: {
            type : Number,
            required : true,
        },
        customer: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true,
        },
        orderItems: {
            type : [orderItemSchema],
            // type : {
            //     productId : {
            //         type : mongoose.Schema.Types.ObjectId,
            //         ref : 'Product',
            //         required : true,
            //     },
            //     quantity : {
            //         type : Number,
            //         required : true,
            //         // default : 1,
            //     }
            // },
            required : true,
        },
        address: {
            type : String,
            required : true,
        },
        status: {
            type : String,
            // enum : ['pending', 'processing', 'completed', 'cancelled'],
            enum : ["PENDING" , "CANCELLED" , "DELIVERED"],
            required : true,
            // default : 'pending',
            default : "PENDING"
        }
    },
    {timestamps : true}
)

export const Order = mongoose.model('Order', orderSchema);