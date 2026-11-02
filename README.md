# D.Nova — responsive one-page portfolio

SAMK Web-sivut -kurssin harjoitustyö. HTML, CSS ja pieni määrä JavaScriptiä. Ei backendia, build-vaihetta eikä npm-riippuvuuksia.

## Käynnistys

Avaa kansio VS Codessa ja käynnistä `index.html` Live Serverillä, tai:

```sh
python -m http.server 5500
```

Avaa http://localhost:5500. Sivun voi avata myös suoraan index.html-tiedostosta. Poppins (300–600) ladataan paikallisista WOFF2-tiedostoista. Fontin SIL Open Font License löytyy tiedostosta `assets/fonts/OFL.txt`; verkkoyhteyttä fonttipalveluun ei tarvita.

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

## Toteutustavan korjaus 2.11.2026

Työhaara: `fix/course-ui-elements`, lähtötilanne commitissa `1a845a3`.

- Portfolio-kapseli on `inline-flex`-komponentti: reunus, pyöristys, sisäympyrä ja sen maapalloa muistuttava koriste tehdään CSS:llä. Tekstiä voi vaihtaa HTML:ssä.
- Pyöreä `.round-arrow` käyttää yhteistä kokomuuttujaa, CSS-ympyrää ja itse määriteltyä SVG-nuolta. Samaa nuolta käytetään tekstilinkeissä. Linkit navigoivat; View More on painike.
- About Me -nuolikoriste on itse määritelty SVG. Tähtikoristeet ja footerin viivageometria rakennetaan CSS:llä.
- CSS on avattu luettavaksi ja ryhmitelty osioihin. Grid-, Flexbox-, clamp-, aspect-ratio-, hover-, focus- ja reduced-motion-ratkaisut säilyvät.
- View More vaihtaa vain tekstisolmun sisällön; SVG-kuvake säilyy. Natiivi details/summary ja nykyinen mobiilivalikko säilyvät.
- Hero-kuvan yläreunan vaalea kuvakaappauskaistale rajataan kuvakehyksessä CSS:llä. Alkuperäinen kuvatiedosto säilyy.

Kuva- ja elementtikohtainen auditointi sekä suoritetut testit: [VALIDATION.md](VALIDATION.md).

Alkuperäistä kokonaista Wolfpixel-mallikuvaa ei ole tässä repositoriossa. Sommittelu perustuu nykyiseen toteutukseen; tarkka mallivertailu on vielä tehtävä kurssin alkuperäistä referenssiä vasten.

## GitHub

Olemassa oleva repository: https://github.com/MiroKur/WEB-sivut-projekti . Korjauksia ei ole pushattu eikä sivustoa julkaistu. Staattinen rakenne sopii GitHub Pagesiin ilman build-vaihetta.
