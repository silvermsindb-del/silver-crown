import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBanners, getTestimonials, createTestimonial } from '@/services/content';
import { getProducts, getCategories } from '@/services/products';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import Image from '@/components/common/Image';
import clsx from 'clsx';

// Reusable Carousel Component with Arrows
const ArrowCarousel = ({ children, className, itemClassName }) => {
    const scrollContainer = useRef(null);

    const scroll = (direction) => {
        if (scrollContainer.current) {
            const { current } = scrollContainer;
            const scrollAmount = current.clientWidth * 0.8;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={clsx("relative group", className)}>
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white shadow-md p-3 rounded-full text-stone-800 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:block" // Hidden on mobile by default unless requested, but user asked for arrows
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white shadow-md p-3 rounded-full text-stone-800 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            >
                <ChevronRight size={20} />
            </button>
            {/* Mobile Arrows always visible or just use the same buttons? Let's make them visible on mobile too but positioned better */}
            <div className="md:hidden flex justify-end space-x-2 mb-2 px-4">
                <button onClick={() => scroll('left')} className="bg-white border border-gray-200 p-2 rounded-full"><ChevronLeft size={16} /></button>
                <button onClick={() => scroll('right')} className="bg-white border border-gray-200 p-2 rounded-full"><ChevronRight size={16} /></button>
            </div>


            <div
                ref={scrollContainer}
                className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide px-4 md:px-0"
            >
                {/* Duplicate children for 'infinite' illusion if enough items */}
                {React.Children.count(children) > 4
                    ? [...React.Children.toArray(children), ...React.Children.toArray(children)].map((child, i) => (
                        <div key={i} className={clsx("flex-shrink-0 snap-center", itemClassName)}>
                            {child}
                        </div>
                    ))
                    : React.Children.map(children, (child) => (
                        <div className={clsx("flex-shrink-0 snap-center", itemClassName)}>
                            {child}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

// Main Hero Slider
const HeroSlider = ({ banners }) => {
    const [index, setIndex] = useState(0);
    const count = banners?.length || 0;

    const next = () => setIndex((i) => (i + 1) % count);
    const prev = () => setIndex((i) => (i - 1 + count) % count);

    if (count === 0) return <div className="h-full bg-gray-100 flex items-center justify-center">Loading...</div>;

    return (
        <div className="relative h-full overflow-hidden group">
            <motion.div
                className="flex h-full"
                animate={{ x: `-${index * 100}%` }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.7 }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="min-w-full h-full relative">
                        {/* Mobile Image */}
                        <div className="md:hidden w-full h-full">
                            <Image
                                src={banner.mobileImage?.cloudinary?.secure_url || banner.mobileImage?.url || banner.image?.cloudinary?.secure_url || banner.image?.url}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                                priority
                            />
                            {/* Overlay for mobile legibility */}
                            <div className="absolute inset-0 bg-black/20" />
                        </div>

                        {/* Desktop Image */}
                        <div className="hidden md:block w-full h-full">
                            <Image
                                src={banner.image?.cloudinary?.secure_url || banner.image?.url}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/25" />
                        </div>
                        <div className={clsx(
                            "absolute inset-0 flex flex-col justify-center px-8 md:px-20",
                            banner.contentPosition === 'left' && "items-start text-left",
                            banner.contentPosition === 'right' && "items-end text-right",
                            (!banner.contentPosition || banner.contentPosition === 'center') && "items-center text-center"
                        )}>
                            <div className="max-w-xl text-white space-y-4 md:space-y-6">
                                <h2 className="text-3xl md:text-6xl font-serif font-bold leading-tight drop-shadow-lg">
                                    {banner.title}
                                </h2>
                                {banner.subtitle && (
                                    <p className="text-sm md:text-xl font-medium drop-shadow text-gray-100">
                                        {banner.subtitle}
                                    </p>
                                )}
                                {banner.buttonText && (
                                    <Link
                                        to={banner.buttonLink || '/shop'}
                                        className="inline-block bg-white/90 backdrop-blur-sm text-stone-900 px-8 py-3 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors mt-4"
                                    >
                                        {banner.buttonText}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
            {count > 1 && (
                <>
                    <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10">
                        <ChevronRight size={24} />
                    </button>
                </>
            )}
        </div>
    )
}

const Home = () => {
    const queryClient = useQueryClient();

    // Fetch Data
    const { data: banners } = useQuery({ queryKey: ['banners'], queryFn: getBanners });
    const { data: testimonials } = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials });

    // New Arrivals (Latest)
    const { data: newArrivalsData } = useQuery({
        queryKey: ['new-arrivals'],
        queryFn: () => getProducts({ limit: 8, sort: '-createdAt' })
    });

    // Featured Products (isFeatured=true)
    const { data: featuredData } = useQuery({
        queryKey: ['featured-products'],
        queryFn: () => getProducts({ limit: 8, 'where[isFeatured][equals]': true })
    });


    // Categories
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories({ limit: 10 })
    });

    const newArrivals = newArrivalsData?.docs || [];
    const featuredProducts = featuredData?.docs || [];

    // Feedback Form State
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackData, setFeedbackData] = useState({ name: '', content: '', rating: 5 });

    const feedbackMutation = useMutation({
        mutationFn: createTestimonial,
        onSuccess: () => {
            alert('Thank you for your feedback!');
            setFeedbackOpen(false);
            setFeedbackData({ name: '', content: '', rating: 5 });
            queryClient.invalidateQueries(['testimonials']);
        },
        onError: () => alert('Failed to submit feedback.')
    });

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        feedbackMutation.mutate(feedbackData);
    };

    return (
        <div className="bg-white min-h-screen">

            {/* Hero Section */}
            <section className="h-[70vh] md:h-[85vh] w-full">
                {banners && <HeroSlider banners={banners} />}
            </section>

            {/* Shop By Category */}
            {categories && categories.length > 0 && (
                <section className="py-12 md:py-16 layout-container">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-10">Shop By Category</h2>
                    <div className="flex justify-center flex-wrap gap-8 md:gap-12">
                        {categories.map((cat) => (
                            <Link key={cat.id} to={`/shop?category=${cat.id}`} className="group flex flex-col items-center">
                                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 transform group-hover:-translate-y-2 shadow-sm group-hover:shadow-lg">
                                    <Image
                                        src={cat.image?.cloudinary?.secure_url || cat.image?.url || 'https://via.placeholder.com/150'}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <span className="mt-5 text-xs md:text-sm font-bold uppercase tracking-widest text-gray-800 group-hover:text-primary transition-colors border-b-2 border-transparent group-hover:border-primary pb-1">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Collection */}
            {featuredProducts.length > 0 && (
                <section className="py-20 layout-container bg-stone-50 rounded-sm my-8">
                    <div className="flex flex-col justify-center items-center text-center mb-10 px-4 md:px-0">
                        <div>
                            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Hand Picked</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900">Featured Collection</h2>
                            <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
                            <p className="text-gray-500 text-sm max-w-md mx-auto">Discover our most exclusive and popular jewelry pieces, selected just for you.</p>
                        </div>
                    </div>

                    <ArrowCarousel itemClassName="w-[280px] md:w-[320px]">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ArrowCarousel>
                </section>
            )}

            {/* New Arrivals */}
            {newArrivals.length > 0 && (
                <section className="py-16 layout-container bg-white">
                    <div className="flex flex-col justify-center items-center text-center mb-10 px-4 md:px-0">
                        <div>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Fresh Drops</span>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">New Arrivals</h2>
                            <p className="text-gray-500 text-sm">Explore the latest trends in our collection.</p>
                        </div>
                    </div>

                    <ArrowCarousel itemClassName="w-[280px] md:w-[300px]">
                        {newArrivals.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ArrowCarousel>
                </section>
            )}

            {/* Testimonials */}
            <section className="bg-stone-50 py-16 md:py-20">
                <div className="layout-container">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Client Love</h2>
                        <button
                            onClick={() => setFeedbackOpen(!feedbackOpen)}
                            className="text-xs uppercase tracking-widest text-primary hover:text-secondary font-bold underline underline-offset-4"
                        >
                            {feedbackOpen ? 'Close Form' : 'Write a Review'}
                        </button>
                    </div>

                    <AnimatePresence>
                        {feedbackOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-12 max-w-md mx-auto px-4"
                            >
                                <form onSubmit={handleFeedbackSubmit} className="bg-white p-6 shadow-lg rounded border border-gray-100">
                                    <div className="space-y-4">
                                        <input
                                            placeholder="Your Name"
                                            required
                                            className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-primary"
                                            value={feedbackData.name}
                                            onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                                        />
                                        <textarea
                                            placeholder="Your Feedback"
                                            required
                                            className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                                            rows={2}
                                            value={feedbackData.content}
                                            onChange={(e) => setFeedbackData({ ...feedbackData, content: e.target.value })}
                                        />
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 uppercase font-bold">Rating</span>
                                            <div className="flex space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                                                        className={clsx("transition-colors", star <= feedbackData.rating ? "text-yellow-400" : "text-gray-300")}
                                                    >
                                                        <Star size={16} fill="currentColor" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button className="bg-stone-900 text-white w-full py-3 text-xs uppercase font-bold tracking-widest hover:bg-secondary mt-2">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {testimonials && testimonials.length > 0 ? (
                        <ArrowCarousel itemClassName="w-full md:w-[400px]">
                            {testimonials.map((t) => (
                                <div key={t.id} className="bg-white p-8 md:p-10 shadow-sm rounded border border-gray-100 text-center h-full flex flex-col justify-between mx-auto">
                                    <div>
                                        <div className="flex justify-center mb-4 text-yellow-500 space-x-1">
                                            {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                        </div>
                                        <p className="text-gray-600 italic font-serif leading-relaxed mb-6 text-sm break-words">
                                            "{t.content}"
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900">{t.name}</h4>
                                        {t.role && <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{t.role}</p>}
                                    </div>
                                </div>
                            ))}
                        </ArrowCarousel>
                    ) : (
                        <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded bg-white mx-4">
                            <MessageSquare className="mx-auto mb-2 opacity-20" size={32} />
                            <p className="text-sm">No reviews yet. Be the first!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
