import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try{
        await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave : false});

        return {accessToken , refreshToken}

    }catch(error){
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

    if(!email || !username){
        throw new ApiError(400 , "Email or Username is required");
    }

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

export {
    registerUser,
    loginUser,
    logoutUser
};

