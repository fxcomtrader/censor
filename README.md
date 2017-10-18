# censor
Шаблон - пример робота даунвотера (антимат) для GOLOS.IO
Робот Работает в прямом потоке (broadcast). Ищет в комментариях совпадения ключевых слов и голосует за комментарий с отрицательной силой (ставит флаг)
## Зависимости
* Требууется нода 7 и выше
* npm модуль bluebird
* npm модуль lodash
* npm модуль steem
* npm модуль fs
* npm модуль utf8
* текстовой файл словаря (lexicon.txt, кодировка utf8. Размещается в корневой директории робота)
# Тестовый режим
* Для запуска робота в тестовом режиме перейти в корневую директорю робота и запустить командой: node censor
# Рабочий режим
## В файл censor.js внести изменения
### в разделе "Данные робота"
* указать аккаунт (account) робота без @ (заменить XXXX)
* указать приватный постинг ключ (key) (заменить XXXX)
### в разделе "Установка флага"
* Раскомментировать строку 77 (убрать двойной слеш "//golos.broadcast.vote..." ---> "golos.broadcast.vote...")
### Сохранить изменения
### запустить из корневой директории робота командой: node censor
