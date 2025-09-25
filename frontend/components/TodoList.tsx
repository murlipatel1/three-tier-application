"use client";
import { Todo } from "@/types/type";
import React, { useEffect, useState } from "react";

export default function TodoList({ userId }: { userId: number }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const r = await fetch(`h${process.env.NEXT_PUBLIC_API_URL}/api/todos?userId=${userId}`);
    const d = await r.json();
    setTodos(d.todos || []);
  };

  useEffect(() => {
    load();
    // poll? not necessary for minimal example
  }, [userId]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, userId }),
    });
    const d = await r.json();
    console.log(d)
    setTitle("");
    load();
  };

  const toggle = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}/toggle`, { method: "PATCH" });
    load();
  };

  const remove = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h3>Todos</h3>
      <form onSubmit={add} style={{ marginBottom: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New todo" />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((t) => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            <label style={{ textDecoration: t.completed ? "line-through" : undefined }}>
              <input type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} />{" "}
              {t.title}
            </label>
            <button onClick={() => remove(t.id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
            <div style={{ fontSize: 12, color: "#666" }}>by: {t.user?.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
