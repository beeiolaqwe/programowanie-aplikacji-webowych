# Projekt 4 – Notekeep 

### Część 1

1. Aplikacja pozwala na tworzenie, przechowywanie, edycję i usuwanie notatek. Każda notatka musi w minimalnej formie posiadać: 

- Tytuł 
- Treść 
- Kolor notatki 
- Możliwość przypięcia do góry na liście notatek 
- Datę utworzenia 

2. Notatki powinny być zapisywane w localStorage i wyświetlane w formie tablicy notatek na stronie głównej aplikacji. 

 
## Wersja ciekawsza: 

- Zapisywanie daty przypomnień (i generowanie przypomnień w formie Notification) 
- Tagowanie notatek 
- Wyszukiwarka notatek (po wszystkich dostępnych pola notatki) 

 

Przykłady: Google Keep, Evernote, Onenote 

Ważne: wykorzystaj projekt Pogodynka I dokonaj refaktoryzacji kodu. 
1. Projekt  NoteKeep powinien składać się w minimalnej formie z klas App, Notes, Note, AppStorage. 
2. Każda klasa powinna być w osobnym pliku
3. Zdefiniuj interfejs do obiektu AppStorage 
4. Użyj Sass do formatowania wizualnego 

### Część 2

- Stwórz klasę AppFirestoreStorage (implementuje interfejs AppStorage) 
- W klasie AppFirestoreStorage uzupełnij kod tak by dane z notatek były zapisywane w Firestore 
- Stwórz plik config.ts, umieść w nim stałą z której program pobiera informację czy zapisywać dane w localStorage czy w Firestore (decyduje programista wpisując odpowiednią zawartość do zmiennej) 

### Testy

1. Stwórz pięć testów jednostkowych (przetestuj metody które zwracają wynik swojego działania) używając narzędzia jest 

2. Stwórz test funkcjonalny polegający na dodaniu nowej notatki. Do wykonania testu wykorzystaj narzędzia jest i puppeteer.  
Scenariusz testu: 
- Wejdź na stronę aplikacji 
- Opcjonalnie: jeśli jest taka potrzeba kliknij w element tworzący nową notatkę 
- Uzupełnij tytuł treścią “Testowy tytuł notatki”  
- Uzupełnij treść notatki treścią “Notatka testowa” 
- Kliknij przycisk zapisujący notatkę 
- Sprawdź czy nowa notatka widnieje na liście notatek. 

Jeżeli w Twojej aplikacji scenariusz dodania notatki jest inny - użyj własnego scenariusza. 
Testy powinny być umieszczone w osobnym katalogu /tests poza katalogiem z plikami źródłowymi, przykładowy katalog projektu: 

Notekeep 
  /src 
  /tests 
