import { useState, useEffect, useCallback } from 'react';
import httpClient from '../../api/httpClient';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../utils/apiError';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  images?: string[];
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: { [key: number]: number };
}

interface ReviewApiItem extends Omit<Review, 'user_name'> {
  user_name?: string;
  user?: {
    name?: string;
  };
}

interface ReviewApiResponse {
  success: boolean;
  data?: {
    data?: ReviewApiItem[];
  };
  stats?: ReviewStats;
}

interface Props {
  productId: number;
}

export default function ReviewSection({ productId }: Props) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const fetchReviews = useCallback(async () => {
    try {
      const response = await httpClient.get<ReviewApiResponse>(`/products/${productId}/reviews`);
      // response.data = { success, data: <paginator>, stats }
      // paginator shape: { data: [...reviews], total, ... }
      const reviewItems = response.data?.data?.data ?? [];
      // Backend eager-loads user relation, map to expected user_name field
      const mapped = reviewItems.map((r) => ({
        ...r,
        user_name: r.user_name ?? r.user?.name ?? 'Anonyme',
      }));
      setReviews(mapped);
      setStats(response.data?.stats ?? null);
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await httpClient.post('/reviews', {
        product_id: productId,
        ...formData
      });
      setShowForm(false);
      setFormData({ rating: 5, title: '', comment: '' });
      fetchReviews();
      alert('Merci pour votre avis !');
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Erreur lors de l\'envoi de l\'avis'));
    }
  };

  const markHelpful = async (reviewId: number) => {
    try {
      await httpClient.post(`/products/${productId}/reviews/${reviewId}/helpful`);
      fetchReviews();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const renderStars = (rating: number, size = 'text-sm') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${size} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) return <div className="text-center py-8">Chargement des avis...</div>;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Avis Clients</h2>

      {/* Statistiques */}
      {stats && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-gray-900 dark:text-white">
                  {stats.average_rating.toFixed(1)}
                </div>
                <div>
                  {renderStars(Math.round(stats.average_rating), 'text-xl')}
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {stats.total_reviews} avis
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{rating}★</span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${stats.total_reviews > 0 ? (stats.rating_distribution[rating] / stats.total_reviews) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                    {stats.rating_distribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bouton Ajouter un avis */}
      {user && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
        >
          Écrire un avis
        </button>
      )}

      {/* Formulaire d'ajout d'avis */}
      {showForm && (
        <form onSubmit={submitReview} className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Votre avis</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <svg
                    className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre (optionnel)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Résumé de votre expérience"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Commentaire
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Partagez votre expérience avec ce produit..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
            >
              Publier l'avis
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium transition"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste des avis */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {review.user_name}
                  </span>
                  {review.verified_purchase && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      ✓ Achat vérifié
                    </span>
                  )}
                </div>
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>

            {review.title && (
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {review.title}
              </h4>
            )}

            {review.comment && (
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {review.comment}
              </p>
            )}

            <button
              onClick={() => markHelpful(review.id)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              👍 Utile ({review.helpful_count})
            </button>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Aucun avis pour le moment. Soyez le premier à laisser un avis !
          </div>
        )}
      </div>
    </div>
  );
}
