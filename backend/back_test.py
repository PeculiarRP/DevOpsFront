import pytest
from unittest.mock import patch, MagicMock
from server_rule import app, isCreated_DB, AllEntries, Insert_DB, Update_DB, Delete_DB, jsoncreat
import bot_message_service
import json


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def mock_db():
    with patch('psycopg2.connect') as mock_connect:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        yield mock_conn, mock_cursor


@pytest.fixture
def mock_post():
    with patch("bot_message_service.requests.post") as mock_post:
        mock_post.return_value.status_code = 200
        yield mock_post


def test_isCreated_DB_table_exists(mock_db):
    mock_conn, mock_cursor = mock_db
    mock_cursor.fetchone.return_value = (True,)  # Таблица существует

    isCreated_DB()

    mock_cursor.execute.assert_called_once_with(
        'SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = %s) AS table_exists;',
        ('сadri',)
    )


def test_isCreated_DB_table_not_exists(mock_db):
    mock_conn, mock_cursor = mock_db
    mock_cursor.fetchone.return_value = (False,)  # Таблица не существует

    isCreated_DB()

    assert mock_cursor.execute.call_count >= 2  # Проверка существования + создание


def test_AllEntries(mock_db):
    mock_conn, mock_cursor = mock_db
    mock_cursor.fetchall.return_value = [
        (1, 'Иванов', 'Иван', 'Директор'),
        (2, 'Петров', 'Петр', 'Зам.Директора')
    ]

    result = AllEntries()

    assert len(result) == 2
    assert result[0][1] == 'Иванов'


def test_Insert_DB(mock_db):
    mock_conn, mock_cursor = mock_db
    test_data = [('Иван', 'Иванов', 'Директор')]

    Insert_DB(test_data)

    mock_cursor.execute.assert_called_with(
        "INSERT INTO \tсadri (name, family, doljnost) VALUES (%s, %s, %s);",
        ('Иван', 'Иванов', 'Директор')
    )
    mock_conn.commit.assert_called_once()


def test_Update_DB(mock_db):
    mock_conn, mock_cursor = mock_db

    Update_DB(1, 'Новое', 'Имя', 'Должность')

    mock_cursor.execute.assert_called_with(
        "UPDATE \tсadri SET name = %s, family = %s, doljnost = %s WHERE  id = \t1;",
        ('Новое', 'Имя', 'Должность')
    )
    mock_conn.commit.assert_called_once()


def test_Delete_DB(mock_db):
    mock_conn, mock_cursor = mock_db

    Delete_DB(1)

    mock_cursor.execute.assert_called_with(
        "DELETE FROM \tсadri WHERE id = \t1;"
    )
    mock_conn.commit.assert_called_once()


def test_jsoncreat():
    test_data = [
        (1, 'Иванов', 'Иван', 'Директор'),
        (2, 'Петров', 'Петр', 'Зам.Директора')
    ]

    with patch('server_rule.AllEntries', return_value = test_data):
        result = jsoncreat()

        assert len(result) == 2
        assert result[0]['ID'] == '1'
        assert result[1]['Name'] == 'Петров'


def test_get_endpoint(client, mock_db):
    mock_conn, mock_cursor = mock_db
    mock_cursor.fetchall.return_value = [
        (1, 'Иванов', 'Иван', 'Директор')
    ]

    response = client.get('/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data[0]['Name'] == 'Иванов'


def test_post_endpoint(client, mock_db):
    test_data = {
        'user_name': 'Сидоров',
        'user_surname': 'Сидор',
        'user_job': 'Инженер'
    }

    response = client.post(
        '/',
        data=json.dumps(test_data),
        content_type='application/json'
    )
    assert response.status_code == 200


def test_put_endpoint(client, mock_db):
    test_data = {
        'user_id': 1,
        'user_name': 'Обновленный',
        'user_surname': 'Сотрудник',
        'user_job': 'Должность'
    }

    response = client.put(
        '/',
        data=json.dumps(test_data),
        content_type='application/json'
    )
    assert response.status_code == 200


def test_delete_endpoint(client, mock_db):
    test_data = {'user_id': 1}

    response = client.delete(
        '/',
        data=json.dumps(test_data),
        content_type='application/json'
    )
    assert response.status_code == 200

def test_add_row(mock_post):
    bot_message_service.add_row("Иван", "Иванов", "Разработчик")

    mock_post.assert_called_once()
    args, kwargs = mock_post.call_args
    assert args[0] == bot_message_service.url
    data = kwargs["json"]
    assert data["chat_id"] == bot_message_service.chat_id
    assert "Добавлена запись Иван Иванов Разработчик" in data["text"]


def test_update_row(mock_post):
    bot_message_service.update_row(1, "Петр", "Петров", "Дизайнер")

    mock_post.assert_called_once()
    args, kwargs = mock_post.call_args
    assert args[0] == bot_message_service.url
    data = kwargs["json"]
    assert data["chat_id"] == bot_message_service.chat_id
    assert "Изменена запись по id 1 на Петр Петров Дизайнер" in data["text"]


def test_delete_row(mock_post):
    bot_message_service.delete_row(11)

    mock_post.assert_called_once()
    args, kwargs = mock_post.call_args
    assert args[0] == bot_message_service.url
    data = kwargs["json"]
    assert data["chat_id"] == bot_message_service.chat_id
    assert "Удалена запись по id 11" in data["text"]
