import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-6 text-left group"
            >
                <span className={`font-serif font-bold text-lg transition-colors ${isOpen ? 'text-secondary' : 'text-gray-900 group-hover:text-secondary'}`}>
                    {question}
                </span>
                <span className="text-gray-400 group-hover:text-secondary transition-colors">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-500 text-sm leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQs = () => {
    const faqs = [
        {
            question: "How do I determine my ring size?",
            answer: "We recommend visiting a local jeweler to be professionally sized. Alternatively, you can use our printable ring size guide available on our resources page. If you are between sizes, we suggest ordering the larger size."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to over 50 countries worldwide. International shipping usually takes 7-14 business days depending on the destination and customs processing. Shipping fees are calculated at checkout."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns within 30 days of delivery. The item must be unused, in its original packaging, and accompanied by the receipt. Custom or personalized items are final sale and cannot be returned."
        },
        {
            question: "Are your diamonds ethically sourced?",
            answer: "Absolutely. We adhere to the Kimberley Process and only source diamonds from suppliers who can guarantee conflict-free origins. We are committed to ethical and sustainable practices."
        },
        {
            question: "Can I customize a design?",
            answer: "Yes! We offer a bespoke design service. You can work with our designers to create a one-of-a-kind piece. Please contact us via our enquiry form to start the conversation."
        },
        {
            question: "How should I care for my jewelry?",
            answer: "To keep your jewelry looking its best, avoid exposure to harsh chemicals, perfumes, and lotions. Store pieces separately in a soft pouch to prevent scratching. Clean regularly with a soft cloth."
        }
    ];

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <div className="layout-container max-w-3xl">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-500">
                        Find answers to common questions about our products, shipping, and services.
                    </p>
                </div>

                <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-50 rounded-lg">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQs;
