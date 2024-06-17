import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema(
    {
        content: {
            type : String,
            required : true,
        },
        complete: {
            type : Boolean,
            default : false,
        },
        // todoId: {
        //     type : mongoose.Schema.Types.ObjectId,
        //     ref : 'Todo',
        //     required : true,
        // },
        createdBy: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true,
        }
    },{timestamps : true}
);

export const SubTodo = mongoose.model('SubTodo', subTodoSchema);