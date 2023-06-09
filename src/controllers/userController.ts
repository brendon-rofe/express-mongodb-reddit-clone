import { Request, Response } from "express";
import * as UserModel from "../models/userModel";
import * as ProfileModel from "../models/profileModel";
import { User } from "../models/userModel";
import { Profile } from "../models/profileModel";
import { ObjectId } from "mongodb";

export const registerUser = async (req: Request, res: Response) => {
  const username = req.body.username;
  const email = req.body.email;
  const foundUserByUsername = await UserModel.getUserByUsername(username);
  const foundUserByEmail = await UserModel.getUserByEmail(email);
  if (foundUserByUsername) {
    res.status(409).json({ msg: "User with that username already exists" });
  } else if(foundUserByEmail) {
    res.status(409).json({ msg: "User with that email already exists" });
  } else {
    const newUser: User = req.body;
    const newProfile: Omit<Profile, "_id"> = {
      _userId: new ObjectId(newUser._id),
      username: newUser.username,
      joinedCommunities: [],
      posts: [],
    };
    await UserModel.registerUser(newUser);
    await ProfileModel.createProfile(newProfile);
    res.status(201).json({ msg: "User successfully registerd" });
  };
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await UserModel.getUserById(userId);
  res.status(200).json({ user: user });
};

export const getUserByUsername = async (req: Request, res: Response) => {
  const username = req.body.username;
  const user = await UserModel.getUserByUsername(username);
  if (!user) {
    res.status(404).json({ msg: "User with that username not found" });
  } else {
    res.status(200).json({ user: user });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.body.email;
  const user = await UserModel.getUserByEmail(email);
  if (!user) {
    res.status(404).json({ msg: "User with that email not found" });
  } else {
    res.status(200).json({ user: user });
  };
};

export const updateUsernameById = async (req: Request, res: Response) => {
  const { userId, newUsername } = req.body;
  const foundUser = await UserModel.getUserById(userId);
  const username = foundUser?.username;
  await UserModel.upateUsernameById(userId, newUsername);
  await ProfileModel.updateProfileUsername(username, newUsername);
  res
    .status(200)
    .json({ msg: `User ${userId} updated with new username ${newUsername}` });
}

export const updateUserEmailById = async (req: Request, res: Response) => {
  const { userId, newEmail } = req.body;
  await UserModel.updateUserEmailById(userId, newEmail);
  res
    .status(200)
    .json({ msg: `User ${userId} updated with new email ${newEmail}` });
};
