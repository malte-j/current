<h1 align="center"><br><a href="https://current.land">current.land</a> - backend<br><br></h1>

[![Backend CI](https://github.com/SkyGuardian42/current/actions/workflows/backend.yml/badge.svg)](https://github.com/SkyGuardian42/current/actions/workflows/backend.yml)

## Erstes Aufsetzen
Um die Anwendung ausführen zu können, sollte erst die entsprechende Konfiguration gesetzt werden:

### Libraries installieren
Um die Libraries zu installieren, sollte im `backend` Ordner `npm i` ausgeführt werden. 

### Umgebungsvariablen
Die Anwendung wird über Umgebungsvariablen konfiguriert. 
Deise können entweder über das Erstellen der `.env` Datei oder das übergeben im npm start Befehl übergeben werden.

Einfacher ist die Einrichtung über die .env Datei. Dafür kann die `.env.example` Datei einfach in `.env` umbenannt werden. 

### Datenbank
Außerdem benötigt die Anwendung eine MongoDB Datenbank.

Diese kann mit Docker für einfache lokale Entwicklung aufgesetzt werden, oder lokal auf dem Rechner laufen.

Dazu reicht es einfach, `docker-compose up` auzuführen, wodurch automatisch die Daten aus der .env Datei ausgelesen und der Container gestartet wird. Mit `docker-compose down -v` kann die Datenbank wieder gestoppt und der Inhalt gelöscht werden.

Falls eine andere Datenbank verwendet werden soll, müssen dementsprechend die Parameter in der .env Datei angepasst werden.

### Starten
Der Befehl `npm start` kann zum Starten der Anwendung verwendet werden. Es muss aber mindestens Node 14 verwendet werden.

## Testen
Die manuellen Tests befinden sich im `test/httpTests` Ordner. Es gibt Tests für die einzelnen Routen, allerdings gibt es auch eine `walkthrough.http` Datei, in der die wichtigsten Funktionen in einem durchlauf getestet werden können. 

Für die automatischen Tests mit Jest kann die Datenbankerstellung automatisiert werden. Dafür sollte die  `.env.test.example` Datei in `.env.example` umbenannt werden. Danach kann der Befehlt `npm run local-test` ausgeführt werden, der automatisch einen neuen Datenbankcontainer startet, die Tests durchführt, und den Container wieder stoppt und löscht.

Allerdings wird docker nicht benötigt, falls eine andere Datenbank verwendet werden soll, müssen bloß die Werte in der `.env.test` Datei stimmen oder direkt übergeben werden, dann kann der `npm test` Befehl verwendet werden, bei dem keine Dockercontainer gestartet werden.