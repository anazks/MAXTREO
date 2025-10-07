import React, { useEffect, useState, useRef } from 'react';
import { getRatings, addRatings } from '../../../Services/userApi';
import { useAuth } from '../../../Context/UserContext';

export default function Rating({ product }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [expandedReviews, setExpandedReviews] = useState({});

  const prevProductId = useRef(null);
  const reviewsContainerRef = useRef(null);
  const { token, setToken, user } = useAuth();

  const fetchReviews = async (productId) => {
    try {
      const response = await getRatings(productId);
      console.log(response, "from rating");
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  useEffect(() => {
    if (product?.id && product.id !== prevProductId.current) {
      prevProductId.current = product.id;
      fetchReviews(product.id);
    }
  }, [product?.id]);

  const handleSubmit = async () => {
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear().toString().slice(-2)}`;

    const newReview = {
      id: reviews.length + 1,
      author: user?.name || "You",
      date: dateStr,
      title,
      content: comment,
      rating,
      profile_image: user?.profile_image || "",
    };

    try {
      const response = await addRatings({
        product_id: product.id,
        rating,
        title,
        comment,
      });

      if (response.status === 400) {
        setAlertMessage("Review already exists");
        setAlert(true);
        return;
      }

      setReviews([...reviews, newReview]);
      setAlertMessage("Review added successfully");
      setAlert(true);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      setAlertMessage("An error occurred while submitting your review.");
      setAlert(true);
    }
  };

  const renderStars = (count) =>
    Array(count).fill().map((_, i) => (
      <span key={i} className="text-red-600">★</span>
    ));

  const renderEmptyStars = (count) =>
    Array(count).fill().map((_, i) => (
      <span key={i} className="text-gray-300">★</span>
    ));

  const renderStarRating = (selected, onClick) =>
    [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onClick(star)}
        className={`text-xl ${star <= selected ? 'text-red-600' : 'text-gray-300'}`}
      >
        ★
      </button>
    ));

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const toggleExpandReview = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <div className="bg-white text-black w-full py-6 font-sans">
      {alert && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 max-w-6xl mx-auto">
          <p>{alertMessage}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold">REVIEWS</h1>

          {token ? (
            <button
              onClick={() => {
                setIsModalOpen(true);
                setRating(5);
                setTitle('');
                setComment('');
                setSubmitted(false);
                setAlert(false);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm"
            >
              Write a Review
            </button>
          ) : ""}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex text-xl">
            {renderStars(Math.floor(averageRating))}
            {renderEmptyStars(5 - Math.floor(averageRating))}
          </div>
          <div className="text-gray-700 text-sm">{reviews.length} Reviews</div>
        </div>

        {/* Mobile horizontal scrolling view */}
        <div className="md:hidden">
          <div 
            ref={reviewsContainerRef}
            className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {reviews.slice(0, visibleReviews).map((review) => (
              <div 
                key={review.id} 
                className="flex-shrink-0 w-64 bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {review.profile_image || review.profile_image_url ? (
                    <img 
                      src={review.profile_image || review.profile_image_url} 
                      alt={review.author} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                      {getInitials(review.user)}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-sm">{review.user}</div>
                    <div className="text-xs text-gray-500">{review.date}</div>
                  </div>
                </div>
                <div className="flex text-sm text-red-500 mb-1">
                  {renderStars(review.rating)}
                  {renderEmptyStars(5 - review.rating)}
                </div>
                <h3 className="text-base font-medium mb-1">{review.title}</h3>
                <p className="text-xs text-gray-700 line-clamp-4">
                  {review.content || review.comment}
                </p>
                {(review.content || review.comment)?.length > 150 && (
                  <button
                    onClick={() => toggleExpandReview(review.id)}
                    className="text-red-600 text-xs mt-1 underline"
                  >
                    See More
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {reviews.slice(0, visibleReviews).map((review) => (
            <div 
              key={review.id} 
              className={`bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm ${expandedReviews[review.id] ? 'h-auto' : 'h-64'} flex flex-col`}
            >
              <div className="flex items-center gap-2 mb-2">
                {review.profile_image || review.profile_image_url ? (
                  <img 
                    src={review.profile_image || review.profile_image_url} 
                    alt={review.author} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                    {getInitials(review.user)}
                  </div>
                )}
                <div>
                  <div className="font-medium text-sm">{review.user}</div>
                  <div className="text-xs text-gray-500">{review.date}</div>
                </div>
              </div>
              <div className="flex text-sm text-red-500 mb-1">
                {renderStars(review.rating)}
                {renderEmptyStars(5 - review.rating)}
              </div>
              <h3 className="text-base font-medium mb-1">{review.title}</h3>
              <div className="flex-grow">
                <p className={`text-xs text-gray-700 ${expandedReviews[review.id] ? '' : 'line-clamp-5'}`}>
                  {review.content || review.comment}
                </p>
                {(review.content || review.comment)?.length > 150 && (
                  <button
                    onClick={() => toggleExpandReview(review.id)}
                    className="text-red-600 text-xs mt-1 underline"
                  >
                    {expandedReviews[review.id] ? 'See Less' : 'See More'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {reviews.length > visibleReviews && (
          <div className="text-center mb-4">
            <button 
              onClick={() => setVisibleReviews(prev => prev + 4)}
              className="text-red-600 underline text-sm"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            {submitted ? (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-3">Thank You!</h2>
                <p className="mb-4">Your review has been submitted successfully.</p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold">Write a Review</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {user?.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt={user.user} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                      {getInitials(user?.user)}
                    </div>
                  )}
                  <div className="font-medium">{user?.user || "You"}</div>
                </div>
                  
                <div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm mb-1">Rating</label>
                    <div className="flex gap-1">{renderStarRating(rating, setRating)}</div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Summarize your experience"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-1">Review</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 text-sm"
                      placeholder="Tell us about your experience..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="text-gray-700 mr-3 px-3 py-1 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      disabled={!title || !comment}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}