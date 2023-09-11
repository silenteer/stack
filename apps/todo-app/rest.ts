import { NextApiRequest, NextApiResponse } from "next";
import { svcs } from "./services";
import { template } from "@submodule/core";

export const createRoute = template(svcs)<(req: NextApiRequest, res: NextApiResponse) => void>