# Kurssin vaatimukset ja palautus

## Nykyinen palautustilanne 11.11.2026 — mobiili ja dokumentointi

Oikea muokattava mobiilin [Figma Design -tiedosto](https://www.figma.com/design/CAn1NxX7vfOdixPIUFJRV7?node-id=7-87) ja [navigointiprototyyppi](https://www.figma.com/proto/CAn1NxX7vfOdixPIUFJRV7?node-id=7-87&starting-point-node-id=7%3A87&scaling=scale-down) on luotu käyttäjän SAMK-tiimiin. Aiemmat alla olevat maininnat puuttuvasta mobiilin prototyyppilinkistä ovat historiaa. Linkki on täydennetty palautustekstin pohjaan. Koodin ja mobiilin jatkomuutokset tarkistetaan [PR #13:ssa](https://github.com/MiroKur/WEB-sivut-projekti/pull/13); työn aikana yhdistetty PR #12 ei sisällä näitä myöhempiä committeja. Prototyypin lähettämistä kurssialustalle ei ole tehty eikä palautusta vahvistettu.

Käyttäjä tarkistaa esitystilan omassa Figmassaan sekä opettajan katseluoikeudet, täydentää jäsenet ja varmistaa määräajan/palautusmuodon. Desktop-Figma-proto on lisätavoite, ei tämän kierroksen mobiilivaatimuksen korvike. Sivuston kahdeksan leveyden ja viiden kosketuskontekstin testit eivät yksin todista palautuksen valmistumista.

Toteutuksen opas: [CODE-GUIDE.md](docs/CODE-GUIDE.md). Prototyypin rakenne ja testausraja: [FIGMA-MOBILE.md](docs/FIGMA-MOBILE.md). Uusin raportti: [FINAL-REVIEW.md](FINAL-REVIEW.md).


## Toimitetuista ohjeista varmistettu

- Yksi yhtenäinen one-page-portfolio HTML:llä, CSS:llä ja JavaScriptillä.
- Työpöytäversio mahdollisimman lähellä annettua Wolfpixel-suunnitelmaa.
- Opiskelijan suunnittelema responsiivinen mobiiliversio.
- Poppins-fontti Aeonikin sijaan, annetun tyylin ja kuvamateriaalin noudattaminen.
- Huoliteltu ulkoasu ja linjaukset.
- Figma-prototyyppi on pakollinen suunnitelmapalautus. Ohjeessa vaaditaan mobiiliproto; tähän työhön tehdään lisäksi desktop-proto.
- Valikossa ankkurilinkit, ei tarvetta sisäsivuille.
- Saavutettavuus on plussaa, SEO ei ole pakollinen.
- Ei vaatimusta backendista. Kurssikuvissa opetusaiheita ovat mm. clamp, CSS-muuttujat, WebP/AVIF, hero, accordion, blogit, referenssit ja About Me.

Videoiden rakenne ei yksin osoita, että niiden koodi pitäisi kopioida rivi riviltä. Toimitetuissa ohjeissa ei ole tätä vaatimusta.

## Tarkistettavaa opettajalta

Arviointitaulukkoa, lopullista määräaikaa, varsinaisen verkkosivun palautusmuotoa tai lisäajan ehtoja ei näy toimitetussa aineistossa. Prototyypin palauttaminen ei automaattisesti takaa lisäaikaa.

## Palautustekstin pohja

Figma-prototyyppi: https://www.figma.com/proto/CAn1NxX7vfOdixPIUFJRV7?node-id=7-87&starting-point-node-id=7%3A87&scaling=scale-down

Työpöytäproto: [liitä desktop-proton linkki]

Jäsenet: [täydennä oma nimi / ryhmän jäsenet]

Idea: Mukautimme annetun työpöytäleiskan yhden palstan mobiilikokemukseksi. Säilytimme sisältöjärjestyksen, Poppins-typografian ja hillityn harmaasävyisen ilmeen. Mobiilivalikko ohjaa saman sivun osioihin; työhistoria avautuu accordionina ja työnostot ovat selkeästi kosketettavia. Sivusto toteutetaan HTML:llä, CSS:llä ja JavaScriptillä.


## Tekninen toteutus ja palautuksen tilanne (vaihe 2)

HTML/CSS/JS-toteutus ja responsiivinen toiminta on testattu Chromiumilla (320–1440 px); yksityiskohdat `VALIDATION.md`:ssä. Tämä ei vahvista alkuperäisen mallin tarkkaa vastaavuutta eikä palautuksen valmistumista.

Pakolliseksi dokumentoitu mobiilin Figma-prototyyppi on yhä varmistamatta: repositoriossa ei ole vahvistettua prototyyppilinkkiä tai näyttöä palautuksesta. Desktop-proto on tämän projektin lisätavoite. Käyttäjän tulee täydentää prototyyppilinkit ja jäsenet sekä tarkistaa lopullinen palautusmuoto ja määräaika. D.Nova on säilytetty mallisisältönä; henkilökohtaisia tietoja tai uusia asiakasprojekteja ei keksitty.


## Viimeistelykierros 11.11.2026

Tekniset korjaukset ja viiden leveyden selaintestit: [FINAL-REVIEW.md](FINAL-REVIEW.md). Figma-palautus säilyy erillisenä tarkistuskohtana: mobiiliprototyypin pakollisuus, desktop-proton lisätavoite, linkit, jäsenet ja palautuksen varmistus eivät ratkea HTML/CSS/JS-testien läpäisyllä. Mallisisältö säilytetty kurssiprojektina.
