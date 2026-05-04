"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

interface VendorCategory {
  id: string;
  emoji: string;
  title: string;
  sortOrder: number;
  active: boolean;
}

export default function VendorCategoriesManagementPage() {
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    emoji: "",
    title: "",
    sortOrder: 0,
    active: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/vendor-categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      setError("Failed to load vendor categories");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData.emoji || !formData.title) {
      setError("Emoji and title are required");
      return;
    }

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/admin/vendor-categories/${editingId}` : "/api/admin/vendor-categories";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save category");
      await fetchCategories();
      setIsAdding(false);
      setEditingId(null);
      setFormData({ emoji: "", title: "", sortOrder: 0, active: true });
      setError(null);
    } catch {
      setError("Failed to save vendor category");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/vendor-categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      await fetchCategories();
    } catch {
      setError("Failed to delete vendor category");
    }
  }

  function handleEdit(category: VendorCategory) {
    setEditingId(category.id);
    setFormData({
      emoji: category.emoji,
      title: category.title,
      sortOrder: category.sortOrder,
      active: category.active,
    });
    setIsAdding(true);
  }

  if (loading) return <div className="p-4">Loading vendor categories...</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-mp-charcoal">Manage Vendor Categories</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ emoji: "", title: "", sortOrder: 0, active: true });
          }}
          className="flex items-center gap-2 rounded-lg bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel hover:bg-mp-accent"
        >
          <Plus className="size-4" /> Add Category
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>}

      {isAdding && (
        <div className="rounded-lg border border-mp-border bg-mp-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-mp-charcoal">
              {editingId ? "Edit Category" : "Add New Category"}
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
                placeholder="e.g., 🏛️"
                className="mt-1 w-full rounded-lg border border-mp-border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-mp-charcoal">Category Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Venues"
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
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between rounded-lg border border-mp-border bg-mp-card p-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{category.emoji}</span>
              <div>
                <h3 className="font-semibold text-mp-charcoal">{category.title}</h3>
                <div className="mt-2 flex gap-4 text-xs text-mp-muted">
                  <span>Sort: {category.sortOrder}</span>
                  <span>{category.active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="flex items-center gap-1 rounded-lg bg-mp-accent-soft px-3 py-2 text-sm font-medium text-mp-accent hover:bg-mp-accent hover:text-mp-panel"
              >
                <Edit2 className="size-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
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
