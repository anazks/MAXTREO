import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const GoogleReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample review data
  const reviews = [
    {
      id: 1,
      name: "Nikhil Jo Jacob",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "I recently built a PC with Neo Tokyo for my architectural work, and the entire experience—from consultation to delivery—was exceptional. Their service was prompt, professional, and customer-friendly throughout. I’m extremely satisfied with the performance. I highly recommend Neo Tokyo to anyone looking to build a custom PC."
    },
    {
      id: 2,
      name: "Mathews Roy",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The one of the best custom PC experience store in kochi. I recently went there to get a custom gaming PC build and they got me the best deal. Thank you guys."
    },
    {
      id: 3,
      name: "Amal Joy",
      avatar: "http://pluspng.com/img-png/user-png-icon-big-image-png-2240.png",
      rating: 5,
      text: "The one and only custom PC experience store in Ernakulam. I was able to save a lot of money by getting build recommendation from the experienced staff. If you want a custom PC, be it gaming or professional, look no further. Neotokyo is the way to go."
    },
    {
      id: 4,
      name: "Abi",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWF7f9LevTJ8WRU_41-ZX-7d5hhkI7op1drP9eJlhz-sul5nRTR=w54-h54-p-rp-mo-ba4-br100",
      rating: 4,
      text: "Absolute TRASH of a place. They managed to keep my PC for a month and returned it after damaging my cooler and with more issues than when they recieved it. Zero communication from their end, i had to explain the issue to their staff 7 times and even then they managed to call and ask what i wanted.I recommend beating your gaming PC with a hammer before you hand it over to these people. Pathetic service and experience"
    },
    {
      id: 5,
      name: "Sajid Abdul Khadar",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjVaaG7rKkP6M56itGLG2QPDnwuN5ORWBcoOvzz3hzQu3xDq_xG7tA=w54-h54-p-rp-mo-br100",
      rating: 5,
      text: "Excellent customer service and expert advice. They helped me build the perfect workstation for my needs. Will definitely come back for future upgrades."
    },
    {
      id: 6,
      name: "Kiran sajeev",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjX6fsb-jxhI7kMszKTnBwmz7Q83HC9AbrLkf0hKvzGW2-Tb3t7H=w54-h54-p-rp-mo-br100",
      rating: 5,
      text: "Neo Tokyo really knows their stuff. Tell them what you need, and they'll provide a beast of a PC. Smooth process, no fluff—just straight-up quality and performance. Definitely recommending them to anyone looking for a custom rig."
    }
  ];

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, reviews.length - itemsPerView);

  const nextSlide = () => {
    if (isAnimating || currentIndex >= maxIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || currentIndex <= 0) return;
    
    setIsAnimating(true);
    setCurrentIndex(prev => Math.max(prev - 1, 0));
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 transition-colors duration-200 ${
          index < rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const totalSlides = Math.ceil(reviews.length / itemsPerView);

  return (
    <div 
      className="w-full h-screen  p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100"
       style={{        
        fontFamily: "'Rajdhani', sans-serif"
      }}
    >
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 animate-fade-in">
            Don't Just Take Our Word For It
          </h1>
          
          {/* Google Reviews Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700"><a href="https://www.google.com/maps/place/Neo+Tokyo/">Google</a></span>
              <span className="text-xs text-gray-500 ml-1">Reviews</span>
            </div>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
              Write a review
            </button>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons - Hidden on mobile */}
          <button
            onClick={prevSlide}
            className={`hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
              currentIndex === 0 || isAnimating ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            disabled={currentIndex === 0 || isAnimating}
          >
            <ChevronLeft className={`w-6 h-6 ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          
          <button
            onClick={nextSlide}
            className={`hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
              currentIndex >= maxIndex || isAnimating ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            disabled={currentIndex >= maxIndex || isAnimating}
          >
            <ChevronRight className={`w-6 h-6 ${currentIndex >= maxIndex ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>

          {/* Reviews Container */}
          <div className="overflow-hidden px-0 sm:px-12">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`flex-none w-full px-3 ${
                    itemsPerView === 2 ? 'sm:w-1/2' : itemsPerView === 3 ? 'lg:w-1/3' : ''
                  }`}
                  style={{
                    minWidth: `${100 / itemsPerView}%`
                  }}
                >
                  <div className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 h-full ${
                    Math.abs(index - currentIndex - Math.floor(itemsPerView/2)) <= Math.floor(itemsPerView/2) 
                      ? 'animate-fade-in-up' 
                      : ''
                  }`}>
                    {/* Profile Section */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3 ring-2 ring-gray-100">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {review.name}
                        </h3>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex mb-4">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="flex sm:hidden justify-center mt-6 gap-4">
            <button
              onClick={prevSlide}
              className={`bg-white rounded-full p-3 shadow-lg transition-all duration-300 ${
                currentIndex === 0 || isAnimating ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:shadow-xl hover:scale-110'
              }`}
              disabled={currentIndex === 0 || isAnimating}
            >
              <ChevronLeft className={`w-5 h-5 ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            
            <button
              onClick={nextSlide}
              className={`bg-white rounded-full p-3 shadow-lg transition-all duration-300 ${
                currentIndex >= maxIndex || isAnimating ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:shadow-xl hover:scale-110'
              }`}
              disabled={currentIndex >= maxIndex || isAnimating}
            >
              <ChevronRight className={`w-5 h-5 ${currentIndex >= maxIndex ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index * itemsPerView)}
              disabled={isAnimating}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                Math.floor(currentIndex / itemsPerView) === index
                  ? 'bg-blue-500 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        /* Custom scrollbar for mobile swipe hint */
        @media (max-width: 640px) {
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
          .overflow-x-auto {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default GoogleReviews;