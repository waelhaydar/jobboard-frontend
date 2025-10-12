'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  priority: string;
  category: string | null;
  targetAudience: string;
  displayPosition: string;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
  expiresAt: string | null;
}

export default function AdminNewsPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state variables
  const [currentNewsItem, setCurrentNewsItem] = useState<NewsItem | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [targetAudience, setTargetAudience] = useState('');
  const [displayPosition, setDisplayPosition] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [active, setActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const getTokenFromCookie = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
  };

  // Fetch existing news items on component mount
  useEffect(() => {
    const fetchNewsItems = async () => {
      try {
        const token = getTokenFromCookie();

        const response = await fetch('/api/admin/news', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNewsItems(data);
        }
      } catch (error) {
        console.error('Error fetching news items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsItems();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const formData = new FormData(event.currentTarget);

      // Get token from cookies for authentication
      const token = getTokenFromCookie();

      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          title: formData.get('title'),
          content: formData.get('content'),
          priority: formData.get('priority') || 'MEDIUM',
          category: formData.get('category'),
          targetAudience: formData.get('targetAudience'),
          displayPosition: formData.get('displayPosition'),
          imageUrl: formData.get('imageUrl'),
          active: formData.get('active') === 'on',
          expiresAt: formData.get('expiresAt') || null,
        }),
      });

      if (response.ok) {
        setSuccessMessage('News published successfully');
        // Reset form
        event.currentTarget.reset();
        // Refresh the page to show the new news item
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${errorData.message || 'Failed to publish news'}`);
      }
    } catch (error) {
      setErrorMessage('Error: Failed to publish news. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setIsEditing(false);
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const formData = new FormData(event.currentTarget);

      // Get token from cookies for authentication
      const token = getTokenFromCookie();

      const response = await fetch('/api/admin/news', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          id: editingItem.id,
          title: formData.get('title'),
          content: formData.get('content'),
          priority: formData.get('priority') || 'MEDIUM',
          category: formData.get('category'),
          targetAudience: formData.get('targetAudience'),
          displayPosition: formData.get('displayPosition'),
          imageUrl: formData.get('imageUrl'),
          active: formData.get('active') === 'on',
          expiresAt: formData.get('expiresAt') || null,
        }),
      });

      if (response.ok) {
        setSuccessMessage('News item updated successfully');
        setEditingItem(null);
        setIsEditing(false);
        // Refresh the page to show the updated news item
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${errorData.message || 'Failed to update news'}`);
      }
    } catch (error) {
      setErrorMessage('Error: Failed to update news. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news item?')) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const token = getTokenFromCookie();

      const response = await fetch('/api/admin/news', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setSuccessMessage('News item deleted successfully');
        // Refresh the page to show the updated list
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${errorData.message || 'Failed to delete news'}`);
      }
    } catch (error) {
      setErrorMessage('Error: Failed to delete news. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-900">
      <AdminSidebar currentPath="/admin/news" />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Manage News Items</h1>

        {successMessage && (
          <div className="bg-green-900 border border-green-400 text-green-300 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-900 border border-red-400 text-red-300 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}

        {/* News Item Form */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{isEditing ? 'Edit News Item' : 'Publish New News Item'}</h2>
          <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-white text-sm font-bold mb-2">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editingItem?.title || title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-white text-sm font-bold mb-2">Category:</label>
              <input
                type="text"
                id="category"
                name="category"
                value={editingItem?.category || category}
                onChange={(e) => setCategory(e.target.value)}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-white text-sm font-bold mb-2">Content:</label>
              <textarea
                id="content"
                name="content"
                value={editingItem?.content || content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="priority" className="block text-white text-sm font-bold mb-2">Priority:</label>
              <select
                id="priority"
                name="priority"
                value={editingItem?.priority || priority}
                onChange={(e) => setPriority(e.target.value)}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                required
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label htmlFor="targetAudience" className="block text-white text-sm font-bold mb-2">Target Audience:</label>
              <select
                id="targetAudience"
                name="targetAudience"
                value={editingItem?.targetAudience || targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                required
              >
                <option value="ALL">ALL</option>
                <option value="CANDIDATES">CANDIDATES</option>
                <option value="EMPLOYERS">EMPLOYERS</option>
              </select>
            </div>
            <div>
              <label htmlFor="displayPosition" className="block text-white text-sm font-bold mb-2">Display Position:</label>
              <select
                id="displayPosition"
                name="displayPosition"
                value={editingItem?.displayPosition || displayPosition}
                onChange={(e) => setDisplayPosition(e.target.value)}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                required
              >
                <option value="BANNER">BANNER</option>
                <option value="SIDEBAR">SIDEBAR</option>
                <option value="MODAL">MODAL</option>
              </select>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-white text-sm font-bold mb-2">Image URL:</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={editingItem?.imageUrl || imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={editingItem?.active || active}
                onChange={(e) => setActive(e.target.checked)}
                className="mr-2 leading-tight"
              />
              <label htmlFor="active" className="text-sm text-white">Active</label>
            </div>
            <div>
              <label htmlFor="expiresAt" className="block text-white text-sm font-bold mb-2">Expires At (Optional):</label>
              <input
                type="datetime-local"
                id="expiresAt"
                name="expiresAt"
                value={editingItem?.expiresAt?.substring(0, 16) || expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : (isEditing ? 'Update News Item' : 'Publish News Item')}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isSubmitting}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Existing News Items List */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-white mb-4">Existing News Items</h2>
          {isLoading ? (
            <p className="text-white">Loading news items...</p>
          ) : newsItems.length === 0 ? (
            <p className="text-white">No news items found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target Audience</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Display Position</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Active</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expires At</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {newsItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.priority}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.targetAudience}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.displayPosition}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.active ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.expiresAt ? new Date(item.expiresAt).toLocaleString() : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-400 hover:text-blue-300 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
