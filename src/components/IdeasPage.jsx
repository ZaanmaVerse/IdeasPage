import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const API_BASE = 'https://suitmedia-backend.suitdev.com/api/ideas';

const IdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const size = parseInt(searchParams.get('size') || '10');
  const sort = searchParams.get('sort') || '-published_at';

  const [scrollDir, setScrollDir] = useState('up');
  const lastScrollY = useRef(0);
  const bannerRef = useRef(null);

  const fetchIdeas = async () => {
    setLoading(true);
    const url = `${API_BASE}?page[number]=${page}&page[size]=${size}&append[]=small_image&append[]=medium_image&sort=${sort}`;
    console.log("📦 Fetching from:", url);

    try {
      const response = await axios.get(url);
      setIdeas(response.data.data);
      setTotalItems(response.data.meta.total);
    } catch (error) {
      console.error("❌ Gagal Fetch API:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchIdeas();
  }, [page, size, sort]);

  useEffect(() => {
    const handleScroll = () => {
      const currY = window.scrollY;
      if (currY > lastScrollY.current) setScrollDir('down');
      else setScrollDir('up');
      lastScrollY.current = currY;

      if (bannerRef.current) {
        bannerRef.current.style.transform = `translateY(${currY * 0.3}px) scale(1.1)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, size, sort });
  };

  const handleSizeChange = (e) => {
    setSearchParams({ page: 1, size: e.target.value, sort });
  };

  const handleSortChange = (e) => {
    setSearchParams({ page: 1, size, sort: e.target.value });
  };

  return (
    <div className="font-sans bg-gray-50">
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 shadow-md ${scrollDir === 'down' ? '-translate-y-full' : 'bg-white/80 backdrop-blur-md translate-y-0'}`}>
        <nav className="max-w-7xl mx-auto flex justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-orange-500">Suitmedia</h1>
          <ul className="flex gap-6 text-base">
            {['Work', 'About', 'Services', 'Ideas', 'Careers', 'Contact'].map((menu) => (
              <li key={menu} className={`cursor-pointer transition-colors duration-200 ${menu === 'Ideas' ? 'font-semibold text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>
                {menu}
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section className="relative h-[320px] overflow-hidden mt-[72px]">
        <img
          ref={bannerRef}
          src="https://suitmedia-backend.suitdev.com/storage/ideas/banner.jpg"
          alt="Banner"
          className="w-full h-full object-cover object-center transition-transform duration-300 will-change-transform"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h2 className="text-5xl font-bold text-white">Ideas</h2>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-white rotate-[-2deg] origin-bottom"></div>
      </section>

      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-6 mt-8 gap-y-2">
        <span className="text-gray-600 text-sm">
          Showing {size * (page - 1) + 1} - {Math.min(size * page, totalItems)} of {totalItems}
        </span>
        <div className="flex gap-4 items-center text-sm">
          <label>Show per page:</label>
          <select value={size} onChange={handleSizeChange} className="border rounded px-2 py-1">
            {[10, 20, 50].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <label>Sort by:</label>
          <select value={sort} onChange={handleSortChange} className="border rounded px-2 py-1">
            <option value="-published_at">Newest</option>
            <option value="published_at">Oldest</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-8">
        {loading ? (
          <p>Loading...</p>
        ) : (
          ideas.map((item) => (
            <div key={item.id} className="rounded-xl shadow-md p-4 bg-white">
              <div className="aspect-[4/3] overflow-hidden rounded-md mb-4">
                <img
                  src={item.small_image?.url || ''}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <p className="text-sm text-gray-400 mb-1">{new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <h3 className="text-md font-semibold text-gray-900 line-clamp-3" title={item.title}>
                {item.title}
              </h3>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center gap-2 pb-12">
        {[...Array(Math.ceil(totalItems / size)).keys()].map((i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`w-8 h-8 rounded-full transition-colors duration-200 ${page === i + 1 ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700 hover:bg-orange-100'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IdeasPage;