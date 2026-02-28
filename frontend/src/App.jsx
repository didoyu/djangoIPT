import { useEffect, useState } from 'react';
// Make sure to add updateBook to your api.js imports
import { getBooks, getAuthors, createAuthor, createBook, deleteBook, updateBook } from './api';

function App() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  
  // States for the inputs
  const [authorName, setAuthorName] = useState("");
  const [bookName, setBookName] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  
  // NEW: State to track which book we are editing
  const [editId, setEditId] = useState(null);

  const loadData = () => {
    getBooks().then(res => setBooks(res.data));
    getAuthors().then(res => setAuthors(res.data));
  };

  useEffect(() => { loadData(); }, []);

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    await createAuthor({ author_name: authorName, phone_number: "000", gender: "Other" });
    setAuthorName("");
    loadData();
  };

  // UPDATED: Handles both Create and Update
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const bookData = { 
      book_name: bookName, 
      author_id: selectedAuthor, 
      date_published: "2023-01-01", 
      library_id: 1 
    };

    if (editId) {
      // UPDATE logic
      await updateBook(editId, bookData);
      setEditId(null);
    } else {
      // CREATE logic
      await createBook(bookData);
    }

    setBookName("");
    setSelectedAuthor("");
    loadData();
  };

  // NEW: Function to prepare form for editing
  const startEdit = (book) => {
    setEditId(book.book_id);
    setBookName(book.book_name);
    setSelectedAuthor(book.author_id);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen font-sans">
      <div className="grid grid-cols-2 gap-10">
        
        {/* FORM 1: CREATE AUTHOR */}
        <section className="bg-white p-6 rounded-xl shadow border-t-4 border-green-500">
          <h2 className="text-xl font-bold mb-4">1. Create Author</h2>
          <form onSubmit={handleAddAuthor} className="flex gap-2">
            <input 
              className="border p-2 flex-1 rounded"
              value={authorName} 
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Enter Author Name"
            />
            <button className="bg-green-600 text-white px-4 rounded hover:bg-green-700 transition">Save</button>
          </form>
        </section>

        {/* FORM 2: CREATE OR UPDATE BOOK */}
        <section className="bg-white p-6 rounded-xl shadow border-t-4 border-indigo-500">
          <h2 className="text-xl font-bold mb-4">
            {editId ? "📝 Update Book" : "2. Create Book"}
          </h2>
          <form onSubmit={handleBookSubmit} className="flex flex-col gap-2">
            <input 
              className="border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              placeholder="Book Title"
            />
            <select 
              className="border p-2 rounded bg-white"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            >
              <option value="">-- Select Author --</option>
              {authors.map(a => (
                <option key={a.author_id} value={a.author_id}>{a.author_name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button className={`p-2 rounded flex-1 text-white font-bold transition ${editId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {editId ? "Update Changes" : "Add Book"}
              </button>
              {editId && (
                <button 
                  type="button"
                  onClick={() => { setEditId(null); setBookName(""); setSelectedAuthor(""); }}
                  className="bg-gray-400 text-white px-4 rounded"
                >Cancel</button>
              )}
            </div>
          </form>
        </section>

      </div>
      
      {/* Display List with Edit Button */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-slate-700">Library Books Catalog</h2>
        <div className="space-y-3">
          {books.map(b => (
            <div key={b.book_id} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center hover:shadow-sm transition">
              <div>
                <span className="font-semibold text-lg">{b.book_name}</span>
                <span className="ml-2 text-slate-500 text-sm italic">by {b.author_name}</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => startEdit(b)} 
                  className="text-indigo-600 font-semibold hover:text-indigo-800"
                >Edit</button>
                <button 
                  onClick={() => deleteBook(b.book_id).then(loadData)} 
                  className="text-red-500 font-semibold hover:text-red-700"
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;