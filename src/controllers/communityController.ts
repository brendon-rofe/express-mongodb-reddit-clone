import { Request, Response } from "express";
import * as CommunityModel from "../models/communityModel";
import { Community } from "../models/communityModel";
import { ObjectId } from "mongodb";

export const createCommunity = async (req: Request, res: Response) => {
  const foundingMember = new ObjectId(req.body.foundingMember);
  const newCommunity: Omit<Community, "_id"> = {
    name: req.body.name,
    description: req.body.description,
    members: [foundingMember],
    posts: []
  };
  await CommunityModel.createCommunity(newCommunity);
  res.status(201).json({ msg: `Community ${req.body.name} successfully created` });
};