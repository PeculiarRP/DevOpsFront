import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/react';
import openModal from '../src/DialogWin.jsx';
import api from '../src/utils/API.js';
import getData from '../src/App.jsx';
import tableCreator from '../src/utils/TableCreator.js';

// Мокаем зависимости
vi.mock('../src/utils/API.js', () => ({
    default: {
        delete: vi.fn(),
        put: vi.fn(),
        post: vi.fn()
    }
}));
vi.mock('../src/App.jsx', () => ({
    default: vi.fn()
}));
vi.mock('../src/utils/TableCreator.js', () => ({
    default: vi.fn((data) => {
        const table = document.createElement('table');
        table.dataset.testid = 'mock-table';
        return table;
    })
}));

describe('openModal', () => {
    // Создаем мок DOM-элементов перед каждым тестом
    beforeEach(() => {
        document.body.innerHTML = `
          <div id="myModal" style="display: none;">
            <h2 id="modalTitle"></h2>
            <div id="modalBody"></div>
          </div>
          <div id="tablePlace"></div>
        `;

        vi.clearAllMocks();

        // Активируем фейковые таймеры перед каждым тестом
        vi.useFakeTimers();

        // // Мокаем реализации
        // tableCreator.mockImplementation((data) => {
        //     const table = document.createElement('table');
        //     table.dataset.testid = 'mock-table';
        //     return table;
        // });

        api.delete.mockResolvedValue({ data: [] });
        api.put.mockResolvedValue({ data: [] });
        api.post.mockResolvedValue({ data: [] });
    });

    afterEach(() => {
        // Восстанавливаем оригинальные таймеры
        vi.useRealTimers();
        vi.clearAllMocks();
    })

    it('открывает модальное окно с правильным заголовком', () => {
        openModal('Тестовый заголовок', {});
        expect(document.getElementById('myModal').style.display).toBe('block');
        expect(document.getElementById('modalTitle').textContent).toBe('Тестовый заголовок');
    });

    it('закрывает модальное окно при клике вне контента', () => {
        openModal('Тест', {});
        fireEvent.click(document.getElementById('myModal'));
        expect(document.getElementById('myModal').style.display).toBe('none');
    });

    describe('режим удаления', () => {
        const deleteContext = { ID: 1, Name: 'Иван', Surname: 'Иванов', Job: 'Разработчик' };

        it('показывает подтверждение удаления', () => {
            openModal('Удалить', deleteContext);
            const body = document.getElementById('modalBody');
            expect(body.textContent).toContain('Подтвердите удаление сотрудника');
            expect(body.textContent).toContain('Иван Иванов');
        });

        it('вызывает API.delete при подтверждении', async () => {
            openModal('Удалить', deleteContext);
            const deleteBtn = document.querySelector('#modalBody button');
            fireEvent.click(deleteBtn);

            expect(api.delete).toHaveBeenCalledWith('', {
                data: { user_id: 1 }
            });
        });
    });

    describe('режим редактирования', () => {
        const editContext = { ID: 1, Name: 'Иван', Surname: 'Иванов', Job: 'Разработчик' };

        beforeEach(() => {
            openModal('Изменить', editContext);
        });

        it('показывает форму с заполненными данными', () => {
            const inputs = document.querySelectorAll('input');
            expect(inputs[0].value).toBe('Иван');
            expect(inputs[1].value).toBe('Иванов');
            expect(inputs[2].value).toBe('Разработчик');
        });

        it('вызывает API.put при сохранении', () => {
            const saveBtn = document.querySelector('#modalBody button');
            fireEvent.click(saveBtn);

            expect(api.put).toHaveBeenCalledWith('', {
                user_id: 1,
                user_name: 'Иван',
                user_surname: 'Иванов',
                user_job: 'Разработчик'
            });
        });
    });

    describe('режим добавления', () => {
        beforeEach(() => {
            openModal('Добавить', { Name: '', Surname: '', Job: '' });
        });

        it('показывает пустую форму', () => {
            const inputs = document.querySelectorAll('input');
            expect(inputs[0].value).toBe('');
            expect(inputs[1].value).toBe('');
            expect(inputs[2].value).toBe('');
        });

        it('вызывает API.post при сохранении', () => {
            const inputs = document.querySelectorAll('input');
            inputs[0].value = 'Новый';
            inputs[1].value = 'Сотрудник';
            inputs[2].value = 'Тестер';

            const saveBtn = document.querySelector('#modalBody button');
            fireEvent.click(saveBtn);

            expect(api.post).toHaveBeenCalledWith('', {
                user_name: 'Новый',
                user_surname: 'Сотрудник',
                user_job: 'Тестер'
            });
        });
    });

    it('обновляет таблицу после API-запроса', async () => {
        const testData = [{ ID: 1, Name: 'Обновленный' }];
        api.post.mockResolvedValue({ data: testData });

        openModal('Добавить', { Name: '', Surname: '', Job: '' });
        const saveBtn = document.querySelector('#modalBody button');
        fireEvent.click(saveBtn);

        await vi.runAllTimers();

        expect(tableCreator).toHaveBeenCalledWith(testData);
        expect(getData).toHaveBeenCalled();
    });
});