# D.Nova — responsive one-page portfolio

SAMK Web-sivut -kurssin harjoitustyö. HTML, CSS ja pieni määrä JavaScriptiä. Ei backendia, build-vaihetta eikä npm-riippuvuuksia.

## Käynnistys

Avaa kansio VS Codessa ja käynnistä `index.html` Live Serverillä, tai:

```sh
python -m http.server 5500
```

Avaa http://localhost:5500. Sivun voi avata myös suoraan index.html-tiedostosta. Google Fonts tarvitsee verkkoyhteyden; ilman sitä käytetään Arialia.

## Tiedostot

- `index.html`: semanttiset sisältöosiot ja ankkurilinkit.
- `styles.css`: yhteiset värit CSS-muuttujina, työpöytä- ja mobiiliasettelu, reduced-motion.
- `script.js`: mobiilivalikko, työhistorian accordion ja lisää töitä -painike.
- `assets/`: toimitetusta kurssimateriaalista optimoidut WebP-kuvat ja SVG.
- `assets/sources.json`: kuvien alkuperäiset tiedostonimet.
- `COURSE.md`: vaatimukset ja palautusmuistio.

## Oman portfolion viimeistely

Nimi D.Nova, asiakasmäärät, työhistoria, esimerkkiprojektit ja hello@dnova.com ovat mallisisältöä, eivät opiskelijan omia tietoja. Vaihda ne ennen henkilökohtaista julkaisemista. Blogien lyhyet tekstit ovat tähän toteutukseen kirjoitettua mallisisältöä. Linkit pysyvät yhdellä sivulla; sähköpostiosoite käyttää mailto-linkkiä. Lomake tai ajanvarauspalvelu ei ole käytössä.

## Suunnittelulähde ja aineisto

Ulkoasun lähtökohta: Wolfpixel UI/UX, [Personal Portfolio Website Design](https://dribbble.com/shots/24978876-Personal-Portfolio-Website-Design). Poppins korvaa Aeonik-fontin kurssiohjeen mukaisesti. Valkoinen, vaaleanharmaa ja hiilenmusta on sovitettu toimitettuihin kuviin; tarkkaa väritoken-tiedostoa ei toimitettu.

Kuvat ovat käyttäjän toimittamasta kurssimateriaalista (Pexels/tekoälykuvat). ZIP sisälsi kuvat kuvakaappauksina, ei alkuperäisinä täysikokoisina tiedostoina. Jakeluversiot on pakattu WebP:ksi; alkuperäisiä liitteitä ei muutettu. Suurempiresoluutioiset Moodle-lataukset voi vaihtaa samoille tiedostonimille. Kolmanteen blogiin käytetään väliaikaisesti toimitettua sohva-kuvaa, sillä erillistä diva-kuvaa ei löytynyt paketista.

Sivun yläpuolinen Dribbble-esittelyotsikko ja kannettavan tietokoneen kehys eivät kuulu itse verkkosivuun.

## GitHub

Uusi repo voidaan luoda nimellä `portfolio-course`, esimerkiksi yksityiseksi kurssityöksi. Kun tyhjä repo on luotu GitHubissa:

```sh
git init
git add .
git commit -m "Build responsive portfolio course project"
git branch -M main
git remote add origin https://github.com/OMA-TUNNUS/portfolio-course.git
git push -u origin main
```

Jos kansiossa on jo paikallinen Git-historia, aloita remote-komennosta. GitHub Pages toimii tällä staattisella rakenteella ilman sovelluspalvelinta.
