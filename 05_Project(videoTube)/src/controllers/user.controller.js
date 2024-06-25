import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave : false});

        return {accessToken , refreshToken}

    }catch(error){
        // console.log(error);
        // throw new ApiError(500 , "Token generation failed");
        throw new ApiError(500 , "Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists : username , email
    // check for images , check for avatar
    // upload them to clodinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName , email , username , password} = req.body;
    // console.log(fullName , email , username , password);

    // if(fullName === ""){
    //     throw new ApiError(400 , "Full Name is required");
    // }

    if(
        [fullName , email , username , password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400 , "All fields are required");
    }

    const existedUser = await User.findOne({$or : [{email} , {username}]})
    if(existedUser){
        // throw new ApiError(409 , "User already exists with this email or username");
        throw new ApiError(409 , "User with email or username already exists");
    }

    // console.log(req.files);
    // console.log(req.files?.avatar);
    // console.log(req.files?.coverImage);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath = "";
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // console.log(avatarLocalPath);
    // console.log(coverImageLocalPath);

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    let coverImage;
    if(coverImageLocalPath){
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    // console.log(avatar);
    // console.log(coverImage);

    if(!avatar){
        // throw new ApiError(500 , "Avatar upload failed");
        throw new ApiError(500 , "Avatar file is required");
    }

    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
    });

    // console.log(user);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        // throw new ApiError(500 , "User creation failed");
        throw new ApiError(500 , "Something went wrong while registering the user");
    }

    return res.status(201).json(
        // new ApiResponse(201 , createdUser , "User created successfully")
        new ApiResponse(201 , createdUser , "User registered successfully")
    )

});

const loginUser = asyncHandler(async (req, res, next) => {
    // req.body -> data
    // username or email
    // find the user
    // check for password
    // generate access and refresh token
    // send cookies
    // return response

    const {email , username , password} = req.body;

    if(!email && !username){
        throw new ApiError(400 , "Email or Username is required");
    }

    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required");
    // }

    const user = await User.findOne({
        $or : [{email} , {username}]
    })

    if(!user){
        // throw new ApiError(404 , "User not found");
        throw new ApiError(404 , "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        // throw new ApiError(401 , "Invalid Password");
        throw new ApiError(401 , "Invalid User Credentials");
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id);

    // const loggedInUser = await User.findById(user._id , "-password -refreshToken");
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true,
        // sameSite : "none"
    }

    return res
            .status(200)
            .cookie("accessToken" , accessToken , options)
            .cookie("refreshToken" , refreshToken , options)
            .json(
                // new ApiResponse(200 , loggedInUser , "User logged in successfully")
                new ApiResponse(
                    200 ,
                    {
                        user : loggedInUser,
                        accessToken,
                        refreshToken
                    },
                    "User logged in successfully"
                )
            )
});

const logoutUser = asyncHandler(async (req, res, next) => {
    User.findByIdAndUpdate(
        req.user._id ,
        {
            // refreshToken : ""
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true,
            // runValidators : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true,
        // sameSite : "none"
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse(200 , {} , "User logged out successfully")
    )

});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    // get refresh token from req
    // verify refresh token
    // get user
    // check for refresh token
    // generate new access and refresh token
    // send cookies
    // return response

    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if(!incomingRefreshToken){
        // throw new ApiError(400 , "Refresh Token is required");
        throw new ApiError(400 , "Unauthorized Access");
    }


    try {
        const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET);
    
        const user = User.findById(decodedToken?._id)
    
        if(!user){
            // throw new ApiError(404 , "User not found");
            throw new ApiError(401 , "Invalid Refresh Token");
        }
    
        if(user?.refreshToken !== incomingRefreshToken){
            // throw new ApiError(401 , "Invalid Refresh Token");
            throw new ApiError(401 , "Refresh Token is expired or used");
        }
    
        const option = {
            httpOnly : true,
            secure : true,
            // sameSite : "none"
        }
    
        const {accessToken , newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
    
        return res
                .status(200)
                .cookie("accessToken" , accessToken , option)
                .cookie("refreshToken" , newRefreshToken , option)
                .json(
                    new ApiResponse(
                        200 ,
                        {
                            accessToken,
                            refreshToken : newRefreshToken
                        } ,
                        // "Access Token refreshed successfully"
                        "Access Token refreshed"
                    )
                )
    } catch (error) {
        // throw new ApiError(401 , "Unauthorized Access");
        throw new ApiError(401 , error?.message || "Invalid Refresh Token");
    }

});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    // get user details from req
    // get old password , new password , confirm password
    // check for old password
    // update password
    // return response

    const {oldPassword , newPassword} = req.body;
    // const {oldPassword , newPassword , confirmPassword} = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(401 , "Invalid Old Password");
    }

    // if(newPassword !== confirmPassword){
    //     throw new ApiError(400 , "Passwords do not match");
    // }

    user.password = newPassword;
    // user.refreshToken = undefined;

    await user.save({validateBeforeSave : false});

    return res
    .status(200)
    .json(new ApiResponse(200 , {} , "Password changed successfully"));
    
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
    // get user details from req
    // return response

    return res
    .status(200)
    .json(new ApiResponse(200 , req.user , "Current user fetched successfully"));
    // .json(new ApiResponse(200 , req.user , "User details fetched successfully"));

});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
    // get user details from req
    // get updated fields
    // update user
    // return response

    const {fullName , email} = req.body;
    // const {fullName , email , username} = req.body;

    if(!fullName && !email){
        throw new ApiError(400 , "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                fullName,
                email : email
            }
        },
        {
            new : true,
            // runValidators : true
        }
    ).select("-password -refreshToken");

    if(!user){
        throw new ApiError(500 , "User details update failed");
    }

    return res
            .status(200)
            .json(new ApiResponse(200 , user , "Account details updated successfully"));
            // .json(new ApiResponse(200 , user , "User details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res, next) => {
    // get user details from req
    // get avatar
    // upload avatar
    // update user
    // return response

    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        // throw new ApiError(400 , "Avatar file is required");
        throw new ApiError(400 , "Avatar file is missing");
    }

    
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // if(!avatar){
    if(!avatar.url){
        // throw new ApiError(500 , "Avatar upload failed");
        throw new ApiError(500 , "Error while uploading avatar");
    }
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                avatar : avatar.url
            }
        },
        {
            new : true,
            // runValidators : true
        }
    ).select("-password -refreshToken");
    

    // TODO : delete old image - assignment for you
    const oldImage = req.user.avatar;
    if(oldImage){
        const publicId = oldImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    }

    return res
            .status(200)
            .json(new ApiResponse(200 , user , "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res, next) => {
    // get user details from req
    // get cover image
    // upload cover image
    // update user
    // return response

    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400 , "Cover Image file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // if(!coverImage){
    if(!coverImage.url){
        throw new ApiError(500 , "Error while uploading cover image");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                coverImage : coverImage.url
            }
        },
        {
            new : true,
            // runValidators : true
        }
    ).select("-password -refreshToken");

    return res
            .status(200)
            .json(new ApiResponse(200 , user , "Cover Image updated successfully"));

});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
};

