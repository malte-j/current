<h1 align="center"><br><a href="https://current.land">current.land</a> - frontend<br><br></h1>

[![Backend CI](https://github.com/SkyGuardian42/current/actions/workflows/backend.yml/badge.svg)](https://github.com/SkyGuardian42/current/actions/workflows/backend.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/e3ac4634-1f6a-4c4f-a25e-5b4a099608e1/deploy-status)](https://app.netlify.com/sites/maltsme/deploys)


## Installieren

Alle Dependencies können mit `npm i` installiert werden. Möglicherweise kann es zu Problemen mit Node 14 kommen, weshalb mindestens Node 16 empfohlen wird.


## Ausführen (Direkt auf dem Rechner)

Das Frontend kann mit dem Befehl `npm run dev` gestartet werden und ließt die Adresse für das Backend aus den Dateien `.env` und `.env.production` aus, wobei die Prioritisierung wie folgt ist:
1. Über den Befehl mitgegebene Umgebungsvariablen, z.B. `VITE_BACKEND_URL=http://localhost:8081 npm run dev`
2. Modusspezifische `.env.*` Datei, wobei nicht passende nicht geladen werden, z.B. wird beim Entikeln die `.env.production` Datei nicht geladen.
3. Die `.env` Datei.

Wenn keine Veränderung der Variablen erfolgt, erwartet das Frontend ein Backend auf `http://localhost:3000`, was mit den Standards der `.env` im Backend übereinstimmt.

Das Frontend ist dann unter der URL [http://localhost:3000](http://localhost:3000) erreichbar.


## Ausführen (Mit Docker / Docker Compose)

Falls es zu Problemen mit der Installation kommt, habe ich zusätzlich noch Dockerfiles und eine `docker-compose.yml` Datei im Hauptverzeichnis angelegt, welche das komplette Setup für current übernimmt. Das kann einfach mit `docker-compose up` (Im Hauptverzeichnis) gestartet werden, wonach die Anwendung auf [http://localhost:3002](http://localhost:3002) verfügbar ist. Der Adminlogin lässt sich in Umgebungsvariablen für das Backend in der `docker-compose.yml` Datei finden.
