import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './style.css'; 

const apiUrl = process.env.REACT_APP_CRUD_API_URL;

export function Board() {
    const { action, elementId } = useParams();
    const [title, setTitle] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (action === 'update') {
            const boardId = elementId;
            fetch(`${apiUrl}/board/get?boardId=${boardId}`)
                .then(response => response.json())
                .then(data => {
                    setTitle(data.title);
                })
                .catch(error => {
                    console.error('Ошибка при получении данных доски:', error);
                });
        }
    }, [action, elementId]);

    const handleButtonClick = async () => {
        setIsDisabled(true);
        try {
            if (action === 'add') {
                const userChatId = elementId;
                const boardDto = { id: 0, userChatId: userChatId, title: title };

                await fetch(`${apiUrl}/board/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(boardDto)
                });
                setSuccessMessage('Доска успешно добавлена!');
            } else {
                const boardId = elementId;
                const updateBoardDto = { id: boardId, title: title };

                await fetch(`${apiUrl}/board/update`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateBoardDto)
                });
                setSuccessMessage('Доска успешно обновлена!');
            }

            
            setIsVisible(false);
            setTimeout(() => {
                setShowSuccess(true);
            }, 1000);

        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    return (
        <div className="form-container">
            {isVisible && (
                <>
                    <h1 className={`form-title ${!isVisible ? 'fade-out' : ''}`}>
                        {action === 'add' ? 'Создать доску' : 'Обновить доску'}
                    </h1>

                    <label className={`form-label ${!isVisible ? 'fade-out' : ''}`}>
                        Название доски
                    </label>

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isDisabled}
                        className={`form-input ${!isVisible ? 'fade-out' : ''}`}
                    />

                    <button
                        onClick={handleButtonClick}
                        disabled={isDisabled}
                        className={`form-button ${!isVisible ? 'fade-out' : ''}`}
                    >
                        {action === 'add' ? 'Создать' : 'Обновить'}
                    </button>
                </>
            )}

            {showSuccess && (
                <p className={`success-message ${showSuccess ? 'visible' : ''}`}>
                    {successMessage}
                </p>
            )}
        </div>
    );
}
