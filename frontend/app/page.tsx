"use client";
import React, { useEffect, useState } from "react";
import TodoList from "../components/TodoList";
import { User } from "@/types/type";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`)
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []));
  }, []);

  return (
    <main style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1>3-Tier TODO App</h1>

      <section style={{ marginBottom: 20 }}>
        <h3>Users</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={selectedUserId ?? ""}
            onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">-- choose user --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <CreateUserForm onCreated={(u) => { setUsers((s) => [...s, u]); setSelectedUserId(u.id); }} />
        </div>
      </section>

      {selectedUserId ? (
        <TodoList userId={selectedUserId} />
      ) : (
        <p>Select a user to show their todos.</p>
      )}
    </main>
  );
}

function CreateUserForm({ onCreated }: { onCreated: (u: User) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await r.json();
    if (data.user) {
      onCreated(data.user);
      setName("");
      setEmail("");
    } else {
      alert("Error creating user");
    }
  };
  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
      <input required placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <input required placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Add User</button>
    </form>
  );
}
