import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '@/services/products';
import { getCategories } from '@/services/categories';
import ProductCard from '@/components/product/ProductCard';
import { Filter, X } from 'lucide-react';
import clsx from 'clsx';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter states
    const categoryId = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '-createdAt';
    const page = parseInt(searchParams.get('page')) || 1;
    const materialFilter = searchParams.get('material') || '';

    // Fetch Categories
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    // Fetch Products
    const { data: productData, isLoading, isPreviousData } = useQuery({
        queryKey: ['products', categoryId, sort, page, searchQuery, materialFilter],
        queryFn: () => {
            const params = {
                page,
                limit: 12,
                sort,
            };
            if (categoryId) params['where[category][equals]'] = categoryId;
            if (searchQuery) params['where[name][contains]'] = searchQuery;
            if (materialFilter) params['where[material][equals]'] = materialFilter;
            return getProducts(params);
        },
        keepPreviousData: true
    });

    const products = productData?.docs || [];
    const totalPages = productData?.totalPages || 1;

    // Handlers
    const handleCategoryChange = (id) => {
        setSearchParams({ category: id, sort, page: 1, search: searchQuery });
        setIsFilterOpen(false);
    };

    const handleSortChange = (e) => {
        setSearchParams({ category: categoryId, sort: e.target.value, page, search: searchQuery });
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ category: categoryId, sort, page: newPage, search: searchQuery });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setSearchParams({});
    };



    return (
        <div className="bg-white min-h-screen">
            {/* Header - Simplified */}
            <div className="bg-stone-50 py-6 mb-8 border-b border-gray-100">
                <div className="layout-container text-center">
                    <h1 className="text-3xl font-serif font-bold mb-2">
                        {categoryId
                            ? categories?.find(c => c.id === categoryId)?.name || 'Collection'
                            : searchQuery
                                ? 'Search Results'
                                : 'Shop'}
                    </h1>
                    {searchQuery && (
                        <p className="text-gray-500 text-sm">Found {products.length} results for "{searchQuery}"</p>
                    )}
                </div>
            </div>

            <div className="layout-container flex flex-col lg:flex-row gap-8 pb-20">
                {/* Mobile Filter Toggle */}
                <button
                    className="lg:hidden flex items-center justify-center space-x-2 border border-gray-200 px-4 py-3 rounded text-sm uppercase tracking-wide w-full"
                    onClick={() => setIsFilterOpen(true)}
                >
                    <Filter size={16} />
                    <span>Filter & Sort</span>
                </button>

                {/* Sidebar Filters */}
                <aside className={clsx(
                    "lg:w-1/4 fixed lg:static inset-0 bg-white z-40 p-6 lg:p-0 transition-transform duration-300 overflow-y-auto",
                    isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}>
                    <div className="flex justify-between items-center lg:hidden mb-6">
                        <h3 className="text-lg font-bold uppercase tracking-widest">Filters</h3>
                        <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
                    </div>

                    <div className="space-y-8">
                        {/* Categories */}
                        <div>
                            <h3 className="font-serif font-bold text-lg mb-4 text-primary border-b pb-2">Categories</h3>
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={() => handleCategoryChange('')}
                                        className={clsx("text-sm hover:text-secondary transition-colors text-left w-full", !categoryId ? "text-secondary font-bold" : "text-gray-500")}
                                    >
                                        All Products
                                    </button>
                                </li>
                                {categories?.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className={clsx("text-sm hover:text-secondary transition-colors text-left w-full", categoryId === cat.id ? "text-secondary font-bold" : "text-gray-500")}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Material Filter */}
                        <div>
                            <h3 className="font-serif font-bold text-lg mb-4 text-primary border-b pb-2">Material</h3>
                            <ul className="space-y-3">
                                {['gold', 'silver', 'rose_gold'].map((m) => (
                                    <li key={m}>
                                        <button
                                            onClick={() => {
                                                const newMaterial = materialFilter === m ? '' : m;
                                                setSearchParams({ category: categoryId, sort, page: 1, search: searchQuery, material: newMaterial });
                                            }}
                                            className={clsx("text-sm hover:text-secondary transition-colors text-left w-full capitalize flex items-center", materialFilter === m ? "text-secondary font-bold" : "text-gray-500")}
                                        >
                                            <span className={clsx("w-3 h-3 rounded-full mr-2 border",
                                                m === 'gold' ? 'bg-yellow-400 border-yellow-500' :
                                                    m === 'silver' ? 'bg-gray-300 border-gray-400' :
                                                        m === 'rose_gold' ? 'bg-rose-300 border-rose-400' :
                                                            'bg-gray-400 border-gray-500'
                                            )}></span>
                                            {m.replace('_', ' ')}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:w-3/4">
                    {/* Toolbar */}
                    <div className="flex justify-end items-center mb-6">
                        <select
                            value={sort}
                            onChange={handleSortChange}
                            className="bg-transparent text-sm text-gray-600 focus:outline-none cursor-pointer border-b border-transparent hover:border-gray-300 py-1"
                        >
                            <option value="-createdAt">Newest First</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="name">Name: A-Z</option>
                        </select>
                    </div>

                    {/* Product Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {products.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded">
                                    <p className="text-gray-500 mb-4">No specific products found.</p>
                                    <button onClick={clearFilters} className="text-secondary hover:underline underline-offset-4 text-sm font-medium">Clear Filters</button>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-16 flex justify-center space-x-2">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => handlePageChange(page - 1)}
                                        className="w-10 h-10 border border-gray-200 text-sm disabled:opacity-30 hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    >
                                        &lt;
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={clsx(
                                                "w-10 h-10 border text-sm flex items-center justify-center transition-colors",
                                                page === i + 1 ? "bg-primary text-white border-primary" : "border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => handlePageChange(page + 1)}
                                        className="w-10 h-10 border border-gray-200 text-sm disabled:opacity-30 hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
