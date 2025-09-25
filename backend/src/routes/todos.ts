import { Router } from "express";
import { prisma } from "../prismaClient";

const router = Router();

// Get todos (optionally filter by userId)
router.get("/", async (req, res) => {
  const userId = req.query.userId ? Number(req.query.userId) : undefined;
  const todos = await prisma.todo.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
  res.json({ status: "ok", todos });
});

// Create todo (body: title, userId)
router.post("/", async (req, res) => {
  try {
    const { title, userId } = req.body;
    const todo = await prisma.todo.create({
      data: { title, userId: Number(userId) },
    });
    res.json({ status: "ok", todo });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Toggle complete
router.patch("/:id/toggle", async (req, res) => {
  const id = Number(req.params.id);
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) return res.status(404).json({ status: "error", message: "Not found" });
  const updated = await prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });
  res.json({ status: "ok", todo: updated });
});

// Delete
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.todo.delete({ where: { id } });
  res.json({ status: "ok" });
});

export default router;
