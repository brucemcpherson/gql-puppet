import crypto from "crypto";
import { settings } from "./settings.mjs";

export const digest = (string) =>
  crypto
    .createHash("sha256")
    .update(settings.digest.salt + '-' + string)
    .digest("hex");
