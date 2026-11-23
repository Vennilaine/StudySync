
# StudySync – Testaus ja validointi

## 1. Testauksen tavoite

StudySync-projektin testauksen tavoitteena oli varmistaa, että sovelluksen keskeiset ominaisuudet toimivat.

Testaus tehtiin pääasiassa manuaalisesti käyttämällä sovellusta selaimessa ja tarkistamalla eri toimintojen tulokset.

Sovellusta testattiin paikallisessa kehitysympäristössä, jossa React-käyttöliittymä ja Node.js-palvelin käynnistettiin erikseen.

## 2. Vaatimuksiin sidotut testit ja tulokset

| Testi | Testin suoritus | Odotettu tulos | Havaittu tulos |
|---|---|---|---|
| T01: Rekisteröityminen | Luodaan uusi käyttäjätunnus | Käyttäjä rekisteröityy | Toimi |
| T02: Kirjautuminen | Kirjaudutaan rekisteröidyllä tunnuksella | Käyttäjä pääsee sovellukseen | Toimi |
| T03: Uusi tapahtuma | Lisätään tapahtuma omaan kalenteriin | Tapahtuma näkyy kalenterissa | Toimi |
| T04: Tapahtuman poistaminen | Poistetaan aiemmin luotu tapahtuma | Tapahtuma poistuu kalenterista | Toimi |
| T05: Viikkokalenteri | Siirrytään kalenterissa eri viikoille | Näytettävä viikko vaihtuu | Toimi |
| T06: Ryhmän luominen | Luodaan uusi opiskeluryhmä | Ryhmä ilmestyy käyttäjän ryhmiin | Toimi |
| T07: Jäsenen lisääminen | Lisätään rekisteröitynyt käyttäjä sähköpostiosoitteella | Käyttäjä liittyy ryhmään | Toimi |
| T08: Jäsenluettelo | Avataan ryhmän jäsenten näkymä | Ryhmän jäsenet näkyvät | Toimi |
| T09: Ryhmästä poistuminen | Käyttäjä poistuu ryhmästä | Käyttäjä ei enää kuulu ryhmään | Toimi |
| T10: Tapahtuman jakaminen | Jaetaan oma tapahtuma ryhmälle | Tapahtuma näkyy ryhmäkalenterissa | Toimi |
| T11: Tapahtumien näkyvyys | Tarkistetaan, näkyvätkö jakamattomat tapahtumat muille | Muut jäsenet näkevät vain jaetut tapahtumat | Toimi |
| T12: Ryhmäkalenteri | Avataan ryhmän viikkokalenteri ja vaihdetaan viikkoa | Ryhmälle jaetut tapahtumat näkyvät oikealla viikolla | Toimi |
| T13: Vapaiden aikojen etsiminen | Käytetään yhteisten vapaiden aikojen hakutoimintoa | Sovellus näyttää ryhmälle sopivia vapaita aikoja | Toimi |

**Testaustapa:** Manuaalinen toiminnallinen testaus.

## 3. Asennuksen ja käynnistämisen testaus

StudySyncin toimivuutta testattiin kahdella eri Windows-tietokoneella.

Ensimmäisellä tietokoneella sovellus käynnistyi onnistuneesti.

Toiselle tietokoneelle projekti ladattiin GitHubista ZIP-tiedostona. Backendin riippuvuuksien asentaminen komennolla `npm.cmd install` epäonnistui aluksi `better-sqlite3`-kirjaston kohdalla.

Virheilmoituksen perusteella tietokoneelta puuttuivat kirjaston kääntämiseen tarvittavat Visual Studion C++-työkalut.

Ongelma ratkaistiin asentamalla Windowsille tarvittavat C++-käännöstyökalut. Tämän jälkeen riippuvuuksien asennus ja StudySyncin käynnistäminen onnistuivat myös toisella tietokoneella.

StudySync saatiin toimimaan kahdella eri Windows-tietokoneella.

Testauksen perusteella havaittiin, että `better-sqlite3`-kirjaston asentaminen voi vaatia erillisiä C++-käännöstyökaluja.

## 4. Validointi käyttäjätarpeeseen nähden

StudySyncin tarkoituksena on helpottaa opiskelijoiden aikataulujen yhteensovittamista ja vähentää yhteisen tapaamisajan etsimiseen tarvittavaa viestittelyä.

Toteutusta arvioitiin seuraavien käyttäjätarpeiden kautta:

**Oman aikataulun hallinta**

Käyttäjä pystyy lisäämään tapahtumia omaan kalenteriinsa ja tarkastelemaan niitä viikkonäkymässä.

**Opiskeluryhmien muodostaminen**

Käyttäjä pystyy perustamaan opiskeluryhmän ja lisäämään siihen muita rekisteröityneitä opiskelijoita.

**Yhteisen aikataulun tarkastelu**

Ryhmän jäsenet voivat jakaa tapahtumia ryhmälle. Ryhmäkalenterissa näkyvät ryhmälle jaetut tapahtumat.

**Yhteisen tapaamisajan löytäminen**

Sovelluksessa on toiminto yhteisten vapaiden aikojen etsimiseen, mikä tukee projektin keskeistä käyttötarkoitusta.

### Validoinnin johtopäätös

Toteutetut ominaisuudet vastaavat projektissa määriteltyihin keskeisiin käyttötapauksiin.

Toimintojen manuaalinen testaus osoittaa, että sovelluksen peruskäyttö on mahdollista. Erillistä käyttäjähaastattelua tai ulkopuolisten opiskelijoiden käyttäjätestiä ei ole vielä dokumentoitu, joten sovelluksen käytettävyyttä ja todellista hyötyä opiskelijoille ei ole vahvistettu laajemmalla käyttäjäpalautteella.

## 5. Tunnetut puutteet ja rajoitukset

**1. Asennus eri tietokoneille**

`better-sqlite3`-kirjaston asentaminen voi vaatia Windowsissa C++-käännöstyökaluja. Tämä voi vaikeuttaa projektin käyttöönottoa toisella tietokoneella.

**2. Paikallinen käyttö**

Sovellus toimii paikallisessa kehitysympäristössä, eikä sitä ole julkaistu julkiselle palvelimelle. Käyttäjät eivät voi käyttää samaa käynnissä olevaa palvelinta eri tietokoneilta ilman erillisiä verkkoyhteysjärjestelyjä.

**3. Ulkoiset kalenteripalvelut**

Sovellusta ei ole yhdistetty esimerkiksi Google Calendariin tai Outlookiin. Käyttäjän on lisättävä tapahtumansa StudySynciin erikseen.

**4. Käyttäjävalidointi**

Ulkopuolisilta opiskelijoilta ei ole vielä kerätty järjestelmällistä käyttäjäpalautetta.

## 6. Yhteenveto

StudySyncin keskeiset ominaisuudet on toteutettu ja niitä on kokeiltu manuaalisesti kehityksen aikana.

Testauksessa on varmistettu muun muassa käyttäjätunnusten toiminta, omien kalenteritapahtumien hallinta, ryhmätoiminnot, tapahtumien jakaminen ja yhteisten vapaiden aikojen etsiminen.

Suurin havaittu käyttöönottoon liittyvä ongelma on `better-sqlite3`-riippuvuuden asentuminen toisella Windows-tietokoneella.

Ennen lopullista palautusta olisi hyvä varmistaa projektin onnistunut asennus puhtaaseen ympäristöön sekä täydentää testausdokumenttia mahdollisilla uusilla testituloksilla.
