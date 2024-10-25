import React, { useEffect, useState } from 'react'; 
import { getRequest, getBaseUrl } from '../UrlRequest';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';

const Diet = ({ patientId, selectedDate }) => {
  const [dietData, setDietData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const location = useLocation();
  const application = location.state?.application || 'hearton';

  const openModal = (meal) => {
    setSelectedMeal(meal);
  };

  const closeModal = () => {
    setSelectedMeal(null);
  };

  useEffect(() => {
    const fetchMealImage = async (mealId, token) => {
      try {
        const response = await fetch(`${getBaseUrl(application)}/doctor/meal-image/${mealId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('이미지를 불러오지 못했습니다.');
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error(`Meal ID ${mealId} 이미지 오류:`, error);
        return null;
      }
    };

    const fetchDietData = async () => {
      setDietData(null);
      setError(null);
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('인증 토큰이 없습니다.');
          setLoading(false);
          return;
        }
        const data = await getRequest(application, `/doctor/${patientId}/meals?on-date=${selectedDate}`, token);
        if (data && data.meals && data.meals.length > 0) {
          const mealsWithImages = await Promise.all(
            data.meals.map(async (meal) => {
              const imageUrl = await fetchMealImage(meal.meal_id, token);
              return { ...meal, imageUrl };
            })
          );
          setDietData(mealsWithImages);
        } else {
          setError('해당 날짜에 식단 데이터가 없습니다.');
        }
      } catch (error) {
        setError('식단 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (patientId && selectedDate) {
      fetchDietData();
    }
  }, [application, patientId, selectedDate]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return dietData ? (
    <div>
      <h3>식단</h3>
      {dietData.map((meal) => (
        <div key={meal.meal_id} style={{ display: 'flex', marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          {meal.imageUrl && (
            <img
              src={meal.imageUrl}
              alt={`${meal.meal_type} 이미지`}
              style={{ width: '25%', height: 'auto', marginRight: '20px', cursor: 'pointer' }}
              onClick={() => openModal(meal)}
            />
          )}
          <div>
            <h4>{meal.meal_type}</h4>
            <p>음식: {meal.menus[0]?.name}</p>
            <p>칼로리: {meal.menus[0]?.calorie} kcal</p>
          </div>
        </div>
      ))}

      {selectedMeal && (
        <Modal
          isOpen={!!selectedMeal}
          onRequestClose={closeModal}
          contentLabel="식단 상세 정보"
          style={{
            content: {
              maxWidth: '600px',
              margin: 'auto',
              padding: '20px',
            },
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>{selectedMeal.meal_type} - 상세 정보</h4>
            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '24px', height: '24px', color: '#000000' }}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {selectedMeal.imageUrl && (
            <img
              src={selectedMeal.imageUrl}
              alt={`${selectedMeal.meal_type} 이미지`}
              style={{ width: '100%', maxWidth: '500px', height: 'auto', marginBottom: '20px' }}
            />
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            {selectedMeal.menus.map((menu, index) => (
              <div key={index} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <h5 style={{ marginBottom: '10px' }}>음식: {menu.name}</h5>
                <p>양: {menu.amount} {menu.unit}</p>
                <p>칼로리: {menu.calorie} kcal</p>
                <p>단백질: {menu.protein} g</p>
                <p>지방: {menu.fat} g</p>
                <p>탄수화물: {menu.carbohydrate} g</p>
                <p>나트륨: {menu.sodium} mg</p>
                <p>칼륨: {menu.potassium} mg</p>
                <p>인: {menu.phosphorus} mg</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  ) : (
    <p>{selectedDate}에 대한 식단 데이터가 없습니다.</p>
  );
};

export default Diet;
