
# StudySync

StudySync on opiskelijoille suunnattu verkkokalenteri, jonka avulla voidaan hallita omia aikatauluja ja suunnitella yhteisiä tapaamisia opiskeluryhmien kanssa.

## Ominaisuudet

- Käyttäjän rekisteröityminen ja kirjautuminen
- Omien tapahtumien lisääminen ja poistaminen
- Oma viikkokalenteri
- Opiskeluryhmien luominen
- Jäsenten lisääminen ryhmiin
- Ryhmästä poistuminen
- Tapahtumien jakaminen ryhmille
- Ryhmän yhteinen viikkokalenteri
- Yhteisten vapaiden aikojen etsiminen

## Käytetyt teknologiat

- React ja Vite (käyttöliittymä)
- Node.js ja Express (palvelin)
- SQLite (tietokanta)


## Asennus ja käynnistäminen

### Vaatimukset ohjelman testaukselle

- Node.js ja npm [lataa tästä node.js](https://nodejs.org/en/download)
- VS codessa Microsoft C++ buildtools ladattuna [Microsoft C++ buildtools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Git (projektin lataamiseen GitHubista)
HUOM OHJELMA EI TOIMI ILMAN NÄITÄ

### 1. Lataa projekti

Lataa projekti GitHubista ja avaa StudySync-kansio
Visual Studio Codessa.

### 2. Käynnistä backend

Avaa terminaali StudySyncin pääkansiossa.

```powershell
cd backend
npm.cmd install
npm.cmd start
```

Jätä terminaali auki.

Backend toimii osoitteessa:
http://localhost:3001

### 3. Käynnistä frontend

Avaa toinen terminaali StudySyncin pääkansiossa.

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Avaa selaimessa:
http://localhost:5173

### 4. Käytä sovellusta

Rekisteröi käyttäjätunnus ja kirjaudu sisään.

Voit luoda tapahtumia, perustaa opiskeluryhmiä,
jakaa tapahtumia ryhmille ja etsiä yhteisiä vapaita aikoja.

### Tietokanta

StudySync käyttää paikallista SQLite-tietokantaa.
Tietokantatiedosto ei sisälly GitHub-repositorioon.


[01-projektikuvaus.md](https://github.com/Vennilaine/StudySync/blob/main/Docs/01-projektikuvaus.md)
[02-ai-tyoskentely.md](https://github.com/Vennilaine/StudySync/blob/main/Docs/02-ai-tyoskentely.md)
[03-testaus-ja-validointi.md](https://github.com/Vennilaine/StudySync/blob/main/Docs/03-testaus-ja-validointi.md)
