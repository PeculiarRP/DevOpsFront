### Лабораторная работа №2
Задачи:
1. Изучить основы работы с инструментом для управления инфраструктурой как кодом.
2. Развернуть виртуальную машину с помощью Terraform/Ansible/Chef/SaltStack в облаке. (установка производится с помощью файлов конфигурации)
3. С помощью инструмента из пункта 2 установить на виртуальную машину Docker (установка производится с помощью файлов конфигурации, если docker не установился на 2 этапе) и изучить основы работы с контейнерами.
4. Создать Dockerfile или docker-compose.yml для вашего приложения из Лабораторной работы №1, собрать Docker-образ и сохранить его в облачном реестре контейнеров.

### Лабораторная работа №3
Задачи:
1. Изучить основы работы с системой оркестрации контейнеров (Kubernetes).
2. Развернуть кластер Kubernetes/Minikube в облаке и запустить в нём ваше приложение из Docker-образа, созданного в предыдущей Лабораторной работе.
3. Настроить горизонтальное масштабирование бэкенда приложения в зависимости от нагрузки. Выставить 15% максимальной нагрузки на ЦП, при увеличении нагрузки создавать новый под/инстанс бэкенда (для повышения нагрузки можно использовать любое средство для нагрузочного тестирования: JMeter, Yandex.Tank, другое).
4. Внедрить систему мониторинга (Grafana/Zabbix) в облаке для отслеживания состояния приложения и инфраструктуры, также показать явно по подам какие запросы идут и что с метриками приложения. Метрики отправляет развёрнутый в облаке Prometheus.

### Лабораторная работа №4
Задачи:
1. Изучить лучшие практики обеспечения безопасности приложений и инфраструктуры в DevOps.
2. Настроить автоматическое сканирование кода на предмет уязвимостей с помощью инструментов статического анализа кода (SonarQube) в облаке, добавить в CI как отдельный этап.
3. Этап CI не должен завершаться успешно если в SonarQube не прошли тесты, покрытие кода тестами ниже 80%, другие ошибки или проблемы.
4. Интегрировать приложение с облачной платформой для использования дополнительных сервисов (телеграмм бот/брокер сообщений/другое согласовать с преподавателем).
5. Автоматизировать процесс развертывания приложения в облаке с использованием инструментов непрерывной доставки (CD).

Предпочтительные облачные провайдеры: GitVerse, Yandex Cloud - 4000 рублей грант на 60 дней, VK Cloud - 3000 рублей грант на 60 дней, Timeweb Cloud - 3000 рублей грант на 60 дней, CloudMTS - 5000 рублей грант на 60 дней, Beeline Cloud - после просмотра небольшого [курса](https://cloud.beeline.ru/devopscloud/) по DevOps дают доступ к клауду.

Разрешено вместо облачных провайдеров использовать свой сервер/ноутбук/пк, где необходимо поднять виртуальную машину для выполнения лабораторных работ.
