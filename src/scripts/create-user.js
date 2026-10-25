import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";
import { User } from "../models/user.model.js";

dotenv.config();

// ---- the account to create / repair -------------------------------------
const TARGET = {
  email: "jatin@shimpi.com",
  password: "jatin@123",
  fullName: "Jatin Shimpi",
  username: "jatin",
  // avatar is a required field on the model; login doesn't use it.
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jatin%20Shimpi",
};
// --------------------------------------------------------------------------

async function run() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("✅ Connected to MongoDB:", DB_NAME);

    // find by email OR the desired username
    let user = await User.findOne({
      $or: [{ email: TARGET.email }, { username: TARGET.username }],
    });

    if (user) {
      console.log(`ℹ️  User already exists (email: ${user.email}). Resetting password.`);
      user.password = TARGET.password; // pre-save hook re-hashes it
      user.email = TARGET.email;
      await user.save();
      console.log("🔑 Password updated for existing user.");
    } else {
      // make sure the username is free; fall back if taken by someone else
      if (await User.findOne({ username: TARGET.username })) {
        TARGET.username = "jatinshimpi";
      }
      user = await User.create(TARGET);
      console.log("🆕 Created new user.");
    }

    // self-verify: confirm the login check will pass
    const fresh = await User.findById(user._id);
    const ok = await fresh.isPasswordCorrect(TARGET.password);

    console.log("\n── Result ──────────────────────────────");
    console.log("  _id      :", fresh._id.toString());
    console.log("  email    :", fresh.email);
    console.log("  username :", fresh.username);
    console.log("  fullName :", fresh.fullName);
    console.log("  password :", ok ? "✅ verifies (login will work)" : "❌ verification FAILED");
    console.log("────────────────────────────────────────");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected.");
    process.exit();
  }
}

run();
