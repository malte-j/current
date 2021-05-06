<h1 align="center"><br><a href="https://current.land">current.land</a> - backend<br><br></h1>

## Starten
Um die Anwendung ausführen zu können, müssen mehrere Sachen ausgewählt werden:

### Umgebungsvariablen
Zuerst sollten die Umgebungsvariablen gesetzt werden.

Das kann entweder über das Erstellen der `.env` Datei, wobei ein Beispiel dafür in der `.env.example` Datei liegt, oder über direktes übergehen erfüllt werden. 

### Datenbank
Außerdem benötigt die Anwendung eine MongoDB Datenbank.

Diese kann einfach mit Docker für lokale Entwicklung aufgesetzt werden. Dazu reicht es einfach, `docker-compose up` auzuführen, wodurch automatisch die Daten aus der .env Datei ausgelesen werden und der Container gestartet.  

## Testen
Für die Tests wird mit Docker automatisch eine neue Datenbankinstanz mit Umgebungsvariablen aus der `.env.test` Datei gestartet. Um die Tests korrekt auszuführen wird also **Docker benötigt**.

Um die autmatischen Tests zu starten, reicht das ausführen von `npm test` aus.