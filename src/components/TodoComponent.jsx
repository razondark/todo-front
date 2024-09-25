import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';

const apiUrl = process.env.REACT_APP_CRUD_API_URL;

export function Todo() {
    const { action, elementId } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (action === 'update') {
            const todoId = elementId;

            
            fetch(`${apiUrl}/todo/get?todoId=${todoId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при получении данных задачи');
                    }
                    return response.json();
                })
                .then(data => {
                    setTitle(data.title);
                    setDescription(data.description);
                })
                .catch(error => {
                    console.error('Ошибка при получении данных задачи:', error);
                });
        }
    }, [action, elementId]);

    const handleButtonClick = async () => {
        setIsDisabled(true);
        try {
            if (action === 'add') {
                const todoDto = {
                    id: 0,
                    boardId: elementId,
                    title: title,
                    description: description,
                    done: false 
                };

                const response = await fetch(`${apiUrl}/todo/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(todoDto)
                });

                if (!response.ok) {
                    throw new Error('Ошибка при добавлении задачи');
                }
                setSuccessMessage('Задача успешно добавлена!');
            } else if (action === 'update') {
                const updateTodoDto = {
                    id: elementId,
                    title: title,
                    description: description
                };

                const response = await fetch(`${apiUrl}/todo/update`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateTodoDto)
                });

                if (!response.ok) {
                    throw new Error('Ошибка при обновлении задачи');
                }
                setSuccessMessage('Задача успешно обновлена!');
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
                        {action === 'add' ? 'Создать задачу' : 'Обновить задачу'}
                    </h1>

                    <label className={`form-label ${!isVisible ? 'fade-out' : ''}`}>
                        Название задачи
                    </label>

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isDisabled}
                        className={`form-input ${!isVisible ? 'fade-out' : ''}`}
                    />

                    <label className={`form-label ${!isVisible ? 'fade-out' : ''}`}>
                        Описание задачи
                    </label>

                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
