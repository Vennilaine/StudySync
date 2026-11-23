# StudySync – AI-työskentely

## 1. Tekoälyn käyttö projektissa

StudySync-projektin kehittämisessä hyödynnettiin tekoälyä ohjelmoinnin tukena.

Tekoälyä käytettiin erityisesti sovelluksen suunnitteluun, React-käyttöliittymän ja Node.js-palvelimen toteutuksen tukemiseen, virheiden selvittämiseen sekä projektin dokumentointiin.

Tekoäly toimi apuvälineenä. Sovelluksen toimintaa tarkistettiin käytännössä käynnistämällä ohjelma ja kokeilemalla sen ominaisuuksia.

## 2. Alkuprompt

Projektin tavoitteena on kehittää opiskelijoille suunnattu älykäs ja yhteisöllinen kalenterisovellus, joka helpottaa työn ja opiskelun yhdistämistä. Sovelluksen avulla käyttäjät voivat lisätä omat työvuoronsa, opiskeluaikataulunsa ja muut menonsa yhteiseen ryhmäkalenteriin.

Sovellus auttaa ryhmäläisiä löytämään automaattisesti yhteisiä vapaita ajankohtia esimerkiksi ryhmätöiden, opiskelun ja tapaamisten järjestämiseen. Lisäksi sovellus tarjoaa käyttäjille ehdotuksia sopivista opiskeluajoista heidän henkilökohtaisten aikataulujensa perusteella.

Tavoitteena on tehdä arjen aikatauluttamisesta helpompaa, vähentää aikataulujen yhteensovittamiseen liittyvää vaivaa ja parantaa opiskelijoiden mahdollisuuksia tasapainottaa työtä, opiskelua ja vapaa-aikaa.

## 3. Käytetyt työkalut

| Työkalu | Käyttötarkoitus |
|---|---|
| ChatGPT | Suunnittelu, ohjelmoinnin tuki, virheiden ratkaisu ja dokumentointi |
| Visual Studio Code | Lähdekoodin kirjoittaminen ja muokkaaminen |
| React ja Vite | Käyttöliittymän toteuttaminen |
| Node.js ja Express | Backend-palvelimen toteuttaminen |
| SQLite ja better-sqlite3 | Tietojen tallentaminen |
| Git ja GitHub | Versionhallinta ja projektin jakaminen |

## 4. Työnjako ja konkreettiset työosuudet

**Projektin tekijät:** [Lisää tekijöiden nimet]

Projektin aikana tehtiin muun muassa seuraavia työvaiheita:

- Käyttäjien rekisteröitymisen ja kirjautumisen toteuttaminen
- Oman viikkokalenterin rakentaminen
- Kalenteritapahtumien lisääminen ja poistaminen
- Opiskeluryhmien luominen ja jäsenten lisääminen
- Tapahtumien jakaminen ryhmille
- Ryhmän yhteisen kalenterin rakentaminen
- Yhteisten vapaiden aikojen etsiminen
- Sovelluksen käynnistämisen ja toiminnan testaaminen
- Projektin tallentaminen GitHubiin

**Täydennettävä:** Kirjoittakaa tähän jokaisen tekijän nimi ja tarkka osuus. Erottakaa, mitä kukin toteutti, testasi, tarkisti tai dokumentoi.

## 5. Ihmisen ja tekoälyn työnjako

ChatGPT:tä käytettiin koodiehdotusten ja toimintaohjeiden tuottamiseen.

Projektin tekijät vastasivat ehdotusten soveltamisesta projektiin, tiedostojen muokkaamisesta, sovelluksen käynnistämisestä ja toiminnan testaamisesta.

Tekoälyn ehdotuksia ei pidetty automaattisesti oikeina, vaan niiden toimivuutta tarkistettiin käytännössä.

## 6. Esimerkki tekoälyn tuotoksen tarkistamisesta

Projektin GitHubista ladattua versiota kokeiltiin toisella tietokoneella.

Backendin riippuvuuksien asentaminen komennolla `npm.cmd install` epäonnistui `better-sqlite3`-kirjaston kohdalla.

Virheilmoituksesta selvisi, että kirjasto yritti käyttää `node-gyp`-käännöstyökalua, mutta tarvittavaa Visual Studion C++-käännösympäristöä ei löytynyt.

Ongelmaa selvitettiin vertaamalla Node.js- ja `better-sqlite3`-versioita eri tietokoneilla. Molemmissa käytettiin Node.js-versiota 26.13.1 ja `better-sqlite3`-versiota 13.2.0, mutta kirjasto oli asentunut onnistuneesti vain toisella koneella.

Tämä osoitti, ettei pelkkä saman Node.js-version käyttäminen takaa riippuvuuksien onnistunutta asennusta.

**Tarkistuksen tulos:** Ongelman syy paikannettiin riippuvuuden asennukseen ja puuttuviin käännöstyökaluihin. Toisen tietokoneen asennuksen lopullinen onnistuminen tulee vielä vahvistaa.

## 7. AI-työskentelyn toimintatapa

Projektissa edettiin pienissä vaiheissa:

1. Määriteltiin toteutettava ominaisuus.
2. Pyydettiin tekoälyltä toteutusehdotus tai korjausohje.
3. Muokattiin projektin lähdekoodia.
4. Käynnistettiin sovellus ja testattiin ominaisuutta.
5. Korjattiin havaitut ongelmat.
6. Tallennettiin toimivat muutokset Git-versionhallintaan.

Tämä dokumentti toimii projektin AI-työskentelyn prosessikuvauksena. Erillistä `AGENTS.md`-tiedostoa ei ole käytetty.
