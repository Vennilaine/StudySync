projektin kuvaus

Opiskeluiden aikatauluttaminen ja varsinkin Ryhmätöiden aikatauluttaminen opiskelijoilla voi olla yllättävänkin haastavaa. Yleisesti tapaamiset järjestetään ryhmäkeskusteluilla ja yhteisen tapaamisen päättämiseen menee turhan paljon aikaa.

Sovelluksen käyttö vaatii käyttäjiltä menojen kirjaamista kalenteriin. Tämän tehtyä sovellus näyttää suoraan milloin ryhmänjäsenillä on yhteistä aikaa. 

Sovellusta voi käyttää myös normaalina kalenteri sovelluksena ihan kaikille menoille.

Käyttäjä skenaario parityö
Marilla töitä tiistaina 8-14 ja Eemelillä 18-24 
Sovellus näyttää, että tiistaina olisi vapaata aikaa 14-18. 


Vaatimukset.

Tapahtuman voi lisätä kalenteriin ja poistaa sen.

Toinen käyttäjä näkee samassa ryhmässä olevan aikataulun.

Ryhmä ei nää suoraan kaikkea aikataulua mitä kalenteriin lisää, se täytyy erikseen valita näytettäväksi ryhmälle

Ryhmän jäseniä pystyy lisäämään ja poistamaan

Ryhmään lisätty jäsen näkee ryhmän varatut ajat ja muiden aikataulut

Tiedot säilyvät refreshauksen jälkeen


# StudySync – Projektikuvaus

## 1. Tarve ja arvolupaus

Opiskelijoilla on usein vaikeuksia löytää yhteistä aikaa ryhmätöiden tekemiseen. Jokaisella opiskelijalla on oma aikataulunsa, ja sopivan tapaamisajan löytäminen voi vaatia paljon viestittelyä.

StudySync on verkkosovellus, jonka tarkoituksena on helpottaa opiskelijoiden aikataulujen hallintaa ja yhteisten tapaamisaikojen suunnittelua.

Sovelluksen arvolupaus on, että opiskeluryhmät voivat tarkastella yhteistä kalenteria ja etsiä vapaita aikoja samasta palvelusta.

## 2. Käyttäjäskenaariot

**Skenaario 1: Oman aikataulun hallinta**

Opiskelija rekisteröityy StudySynciin, kirjautuu sisään ja lisää omia kalenteritapahtumiaan. Hän voi tarkastella tapahtumia viikkokalenterissa ja poistaa tarpeettomia tapahtumia.

**Skenaario 2: Opiskeluryhmän perustaminen**

Opiskelija luo uuden opiskeluryhmän ja lisää siihen muita opiskelijoita heidän sähköpostiosoitteidensa avulla.

**Skenaario 3: Yhteisen aikataulun suunnittelu**

Ryhmän jäsenet jakavat haluamansa tapahtumat ryhmälle. Ryhmän yhteisestä kalenterista voidaan tarkastella jaettuja tapahtumia ja etsiä yhteisiä vapaita aikoja.

## 3. Vaatimukset ja hyväksymiskriteerit

| Vaatimus | Hyväksymiskriteeri |
|---|---|
| Rekisteröityminen | Käyttäjä voi luoda tunnuksen |
| Kirjautuminen | Rekisteröitynyt käyttäjä voi kirjautua sisään |
| Oma kalenteri | Käyttäjä näkee omat tapahtumansa viikkonäkymässä |
| Tapahtumien hallinta | Käyttäjä voi lisätä ja poistaa tapahtumia |
| Ryhmän luominen | Käyttäjä voi perustaa opiskeluryhmän |
| Jäsenten lisääminen | Ryhmään voi lisätä rekisteröityneitä käyttäjiä sähköpostiosoitteella |
| Ryhmästä poistuminen | Käyttäjä voi poistua ryhmästä |
| Tapahtumien jakaminen | Käyttäjä voi jakaa tapahtuman valitulle ryhmälle |
| Ryhmäkalenteri | Ryhmän jäsenet näkevät ryhmälle jaetut tapahtumat |
| Vapaiden aikojen etsiminen | Sovellus auttaa löytämään ryhmän yhteisiä vapaita aikoja |

## 4. Projektin rajaus

StudySync toteutetaan paikallisesti käynnistettävänä verkkosovelluksena.

Projektin toteutukseen kuuluvat käyttäjätunnukset, omat kalenteritapahtumat, opiskeluryhmät, tapahtumien jakaminen ja yhteisten vapaiden aikojen etsiminen.

Projektin ensimmäiseen versioon ei sisälly esimerkiksi sähköposti-ilmoituksia, ulkoisten kalenteripalvelujen integraatioita tai julkista verkkopalvelua.

## 5. Keskeinen rakenne

StudySync koostuu kolmesta osasta:

- **Frontend:** React ja Vite, joilla toteutetaan käyttöliittymä.
- **Backend:** Node.js ja Express, joilla toteutetaan palvelin ja sovelluksen toiminnallisuus.
- **Tietokanta:** SQLite, johon tallennetaan käyttäjät, ryhmät ja kalenteritapahtumat.

Projektin lähdekoodi sijaitsee `frontend`- ja `backend`-kansioissa.

## 6. Oletukset

- Käyttäjällä on käytössään tietokone ja verkkoselain.
- Sovellus käynnistetään paikallisesti Node.js:n avulla.
- Ryhmään lisättävällä opiskelijalla on jo käyttäjätunnus.
- Käyttäjä valitsee, mitkä tapahtumat hän jakaa ryhmälle.
- Sovellus käyttää paikallista SQLite-tietokantaa.
