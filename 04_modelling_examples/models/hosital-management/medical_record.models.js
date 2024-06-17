import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
    {
        recordId : {
            type : String,
            required : true,
            unique : true
        },
        patient : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Patient",
            required : true
        },
        doctor : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Doctor",
            required : true
        },
        hospital : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Hospital",
            required : true
        },
        diagnosis : {
            type : String,
            required : true
        },
        treatment : {
            type : String,
            required : true
        },
        prescription : {
            type : String,
            required : true
        },
        date : {
            type : Date,
            required : true
        },
        followUp : {
            type : Date,
            required : true
        },
        status : {
            type : String,
            enum : ['Active', 'Inactive'],
            default : 'Active'
        }

    } , {timestamps: true}
);

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);