import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import tableCreator from '../src/utils/TableCreator.js'

// Мокаем импорт
vi.mock('../src/DialogWin.jsx', () => ({
    default: vi.fn()
}))

describe('tableCreator', () => {
    const mockData = [
        { ID: 1, Name: 'Иван', Surname: 'Иванов', Job: 'Разработчик' },
        { ID: 2, Name: 'Петр', Surname: 'Петров', Job: 'Дизайнер' }
    ]

    beforeEach(() => {
        document.body.innerHTML = ''
        vi.clearAllMocks()
    })

    it('создает таблицу с правильной структурой', () => {
        const table = tableCreator(mockData)
        document.body.appendChild(table)

        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(screen.getByText('Имя')).toBeInTheDocument()
        expect(screen.getByText('Добавить запись')).toBeInTheDocument()
        expect(screen.getByText('Иван')).toBeInTheDocument()
    })

    it('отображает кнопки действий', () => {
        const table = tableCreator(mockData)
        document.body.appendChild(table)

        expect(screen.getAllByText('Изменить')).toHaveLength(mockData.length)
        expect(screen.getAllByText('Удалить')).toHaveLength(mockData.length)
    })

    it('вызывает openModal при кликах', async () => {
        const table = tableCreator(mockData)
        document.body.appendChild(table)

        // Тест кнопки "Добавить запись"
        fireEvent.click(screen.getByText('Добавить запись'))

        // Тест кнопки "Изменить"
        fireEvent.click(screen.getAllByText('Изменить')[0])

        // Тест кнопки "Удалить"
        fireEvent.click(screen.getAllByText('Удалить')[1])

        const { default: openModal } = await import('../src/DialogWin.jsx')
        expect(openModal).toHaveBeenCalled(3);
    })

    it('работает с пустыми данными', () => {
        const table = tableCreator([])
        document.body.appendChild(table)

        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(document.querySelectorAll('tbody tr')).toHaveLength(0)
    })
})