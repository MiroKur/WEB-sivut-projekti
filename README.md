# D.Nova — responsive one-page portfolio

SAMK Web-sivut -kurssiprojekti, HTML5, moderni CSS ja vanilla JavaScript. Työtä on jatkettu PR #12:n commitista `ca076e1` samalla `feat/portfolio-final-interactions`-haaralla. HTML, CSS ja JavaScript on kommentoitu suomeksi, mobiili viimeistelty ja muokattava Figma Design -mobiiliprototyyppi luotu. Ei build-vaihetta tai sivuston JavaScript-riippuvuuksia.

## Käynnistys ja tarkistus

```sh
python -m http.server 5500
```

Avaa http://localhost:5500. Testaus erillisessä terminaalissa:

```sh
node tests/browser-check.cjs
```

Testi tarvitsee kehitysympäristössä Playwrightin ja Chromiumin. Oletukset: `CHROMIUM_PATH=/usr/bin/chromium`, `SITE_URL=http://127.0.0.1:5500`, `SCREENSHOT_DIR=/tmp/portfolio-check`. Testit eivät korvaa visuaalista vertailua.

## Toteutus

- `index.html`: muokattava HTML-sisältö, natiivit details/summary-accordionit, ankkurit ja kuvat.
- `styles.css`: Poppins 300–600 paikallisista WOFF2-tiedostoista, Grid/Flexbox, responsiivisuus, hover/focus ja reduced motion. Fontin lisenssi: `assets/fonts/OFL.txt`.
- `script.js`: mobiilivalikko, yksi avoin työhistoriarivi, View More, hero-parallax/laskurit ja karusellin ohjaus.
- `assets/sources.json`: käytettyjen kuvien alkuperät ja tarkat mitat.
- [MATERIALS.md](MATERIALS.md): uuden ZIP-aineiston inventaario, käyttötarkoitukset ja puuttuvat kuvitukset.
- [FINAL-REVIEW.md](FINAL-REVIEW.md): tämän kierroksen tulokset, rajaukset ja kuvakaappaukset.
- [VALIDATION.md](VALIDATION.md): testaus ja aikaisempien vaiheiden historia.
- [docs/CODE-GUIDE.md](docs/CODE-GUIDE.md): opiskelijan selitys rakenteesta ja toimintojen muuttamisesta.
- [docs/FIGMA-MOBILE.md](docs/FIGMA-MOBILE.md): muokattava Figma-mobiili, tyyliarvot ja navigaation rajat.
- [COURSE.md](COURSE.md): erilliset kurssi- ja Figma-palautuksen vaatimukset.

## Käyttöliittymän toiminta

Hero liikuttaa henkilökuvaa enintään 10 px ja otsikkoa 5 px vastakkaiseen suuntaan hiiren mukana. Pointer Events ja requestAnimationFrame; poistuminen palauttaa sijainnin. Efekti on pois käytöstä hoverittomilla/karkeilla osoittimilla ja reduced motion -tilassa. Laskurit saavuttavat +200 ja +50 noin 1,5 sekunnissa kerran heron tullessa näkyviin. Lopulliset luvut ovat HTML:ssä ja ruudunlukijan nimessä; reduced motion näyttää ne heti. Hello säilyy HTML-otsikkona, jonka kevyt paljastus ei muuta asettelua.

Showcase vierii natiivisti vaakasuunnassa ja kohdistaa kortit CSS scroll snapilla. Työpöydällä aloitus keskittää keskimmäisen kortin; mobiili alkaa ensimmäisestä ja näyttää seuraavan reunaa. Hiiren pystyrulla ohjaa karusellia vain, kun kyseiseen suuntaan on tilaa. Reunassa sivun pystyscroll jatkuu. Natiivi vaakasuuntainen trackpad-liike ja zoom-ele säilyvät. Ohjauspainikkeet ja näppäimistöllä toimiva range-liukusäädin seuraavat todellista scrollLeft-arvoa. Ilman JavaScriptiä natiivi scroll ja scrollbar toimivat.

Accordion käyttää details/summary-semanttiikkaa; avaus häivyttää sisällön ilman korkeuskikkoja. Koko blogikortin hover/focus korostaa kuvaa ja nuolta. Varsinainen Read insight säilyy näppäimistöllä ja kosketuksella toimivana summary-kontrollina; kuvan klikkaus ei avaa artikkelia.

## Mallisisältö ja lähteet

D.Nova, asiakasmäärät, työhistoria, projektit ja hello@dnova.com ovat kurssin mallisisältöä. Henkilökohtaista portfoliota tai uusia asiakkaita ei luotu. Blogien esimerkkitekstit ja ankkuritoiminnot säilyvät; ulkoista ajanvarausta tai backendia ei ole.

Suunnittelulähde: Wolfpixel UI/UX, [Personal Portfolio Website Design](https://dribbble.com/shots/24978876-Personal-Portfolio-Website-Design). Poppins korvaa Aeonikin kurssin mukaisesti. Tässä kierroksessa vertailtiin käyttäjän ZIP-paketin osiokuvia; koko sivun mallia tai opettajan videoita ei toimitettu. Puuttuvien 3D-kuvitusten vuoksi kuvajärjestyksen täsmällistä mallivastaavuutta ei voida vahvistaa. Sivuston julkaisu ja Figma-palautuksen lähettäminen ovat erillisiä tarkistuksia.

## Mobiili ja Figma

Mobiili on oma pystysommitelmansa: hero-kuva seuraa tekstiä normaalissa virrassa, About pinotaan, työroolit säilyvät näkyvissä ja showcase-kortin otsikko sekä logo ovat eri riveillä. Playwright-tarkistin kattaa 320/360/375/390/430/768/1024/1440 px sekä viisi erillistä mobiilin kosketuskontekstia natiiveine pyyhkäisyineen.

[Figma Design](https://www.figma.com/design/CAn1NxX7vfOdixPIUFJRV7?node-id=7-87) ja [mobiiliprototyyppi](https://www.figma.com/proto/CAn1NxX7vfOdixPIUFJRV7?node-id=7-87&starting-point-node-id=7%3A87&scaling=scale-down). Tiedosto sisältää Auto Layout -framet, tekstikerrokset, komponentit/variantit ja alkuperäiset sisältökuvat; se ei ole verkkosivun kuvakaappaus. Navigaation kohteet on validoitu API:sta. Kirjautuneen selaimen esitystilan läpiklikkaus ja opettajan katseluoikeudet on vielä tarkistettava omassa Figmassa.
