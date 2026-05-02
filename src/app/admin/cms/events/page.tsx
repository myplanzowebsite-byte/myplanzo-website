"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

interface EventType {
  id: string;
  emoji: string;
  title: string;
  description: string;
  sortOrder: number;
  active: boolean;
}

export default function EventsManagementPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    emoji: "",
    title: "",
    description: "",
    sortOrder: 0,
    active: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/admin/event-types");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData.emoji || !formData.title || !formData.description) {
      setError("All fields are required");
      return;
    }

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/admin/event-types/${editingId}` : "/api/admin/event-types";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save event");
      await fetchEvents();
      setIsAdding(false);
      setEditingId(null);
      setFormData({ emoji: "", title: "", description: "", sortOrder: 0, active: true });
      setError(null);
    } catch (err) {
      setError("Failed to save event");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/event-types/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      await fetchEvents();
    } catch (err) {
      setError("Failed to delete event");
    }
  }

  function handleEdit(event: EventType) {
    setEditingId(event.id);
    setFormData({
      emoji: event.emoji,
      title: event.title,
      description: event.description,
      sortOrder: event.sortOrder,
      active: event.active,
    });
    setIsAdding(true);
  }

  if (loading) return <div className="p-4">Loading events...</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-mp-charcoal">Manage Event Types</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ emoji: "", title: "", description: "", sortOrder: 0, active: true });
          }}
          className="flex items-center gap-2 rounded-lg bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel hover:bg-mp-accent"
        >
          <Plus className="size-4" /> Add Event
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>}

      {isAdding && (
        <div className="rounded-lg border border-mp-border bg-mp-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-mp-charcoal">
              {editingId ? "Edit Event" : "Add New Event"}
            </h2>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-mp-muted hover:text-mp-charcoal"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-mp-charcoal">Emoji</label>
              <input
                type="text"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                placeholder="e.g., 🎂"
                className="mt-1 w-full rounded-lg border border-mp-border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-mp-charcoal">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Birthday Parties"
                className="mt-1 w-full rounded-lg border border-mp-border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-mp-charcoal">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Decor, cakes, photo booths, and entertainers for every age."
                rows={3}
                className="mt-1 w-full rounded-lg border border-mp-border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-mp-charcoal">Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-mp-border px-3 py-2"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <span className="text-sm font-medium text-mp-charcoal">Active</span>
            </label>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 rounded-lg bg-mp-charcoal px-4 py-2 font-medium text-mp-panel hover:bg-mp-accent"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="flex-1 rounded-lg border border-mp-border px-4 py-2 font-medium text-mp-charcoal hover:bg-mp-panel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between rounded-lg border border-mp-border bg-mp-card p-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl">{event.emoji}</span>
              <div>
                <h3 className="font-semibold text-mp-charcoal">{event.title}</h3>
                <p className="text-sm text-mp-muted">{event.description}</p>
                <div className="mt-2 flex gap-4 text-xs text-mp-muted">
                  <span>Sort: {event.sortOrder}</span>
                  <span>{event.active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event)}
                className="flex items-center gap-1 rounded-lg bg-mp-accent-soft px-3 py-2 text-sm font-medium text-mp-accent hover:bg-mp-accent hover:text-mp-panel"
              >
                <Edit2 className="size-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
              >
                <Trash2 className="size-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
