Tekoälyn käyttö. StudySyncin kehityksessä käytettiin ChatGPT:tä apuna suunnittelussa, koodauksessa, virheiden selvityksessä ja dokumentoinnissa. Muut työkalut olivat VS Code, React ja Vite, Node.js ja Express, SQLite (better-sqlite3) sekä Git ja GitHub.

Alkuprompt. Tavoitteena on sovellus, jolla opiskelijat hallitsevat aikataulujaan ja löytävät yhteisiä tapaamisaikoja. Sovelluksen tulee toimia normaalina kalenteri sovelluksena, mutta sen suurin hyöty on ryhmien vapaiden aikoijen ehdottaminen. Ideana on tehdä ryhmätöiden tapaamisten sopimisesta huomattavasti helpompaa. 

Työnjako. Tekijät: Saska Niinimäki ja Venni Laine. Toteutimme kirjautumisen, viikkokalenterin, ryhmät, tapahtumien jaon, ryhmäkalenterin ja yhteisten vapaiden aikojen haun. Saska vastasi suunnittelusta ja dokumentoinnista Venni koodaamisesta ja testauksesta.

ChatGPT antoi koodiehdotuksia ja ohjeita, mutta me veimme ne projektiin, käynnistimme sovelluksen ja testasimme sen. Ehdotuksia ei pidetty valmiiksi oikeina ja testattiin aina käytännössä.

GitHubista ladatun projektin npm.cmd install kaatui toisella koneella better-sqlite3:n kohdalla, koska Visual Studion C++-käännösympäristö puuttui. Molemmilla koneilla oli samat versiot, joten pelkkä versioiden täsmäävyys ei riitä. Asennuksen onnistuminen toisella koneella pitää vielä varmistaa.
