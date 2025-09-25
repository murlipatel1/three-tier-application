import { Router } from "express";
import { prisma } from "../prismaClient";

const router = Router();

// Create user
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({ data: { name, email } });
    res.json({ status: "ok", user });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// List users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ status: "ok", users });
});

export default router;
