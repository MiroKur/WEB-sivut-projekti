# Uusin tarkistus: 11.11.2026

Nykyinen toteutus ja testitulokset: [FINAL-REVIEW.md](FINAL-REVIEW.md). Alla olevat 2.11.2026-merkinnät ovat historiallisia; esimerkiksi kuvakaappausrajaukset ja sohva blogikuvana eivät enää kuvaa nykyistä versiota.

# Auditointi ja tarkistus 2.11.2026

## Lähtötila ja ratkaisut

Ennen muutoksia työpuu oli puhdas. Turvaksi luotiin työhaara `fix/course-ui-elements`; lähtöcommit on `1a845a3`.

| Alue | Auditoinnin tulos ja tehty ratkaisu |
| --- | --- |
| Header ja logo | Header on Flexboxia. `logo.webp` on monimutkainen susitunnus, ei painikekuva: säilytetty. |
| Navigaatio | Oikeat ankkurilinkit ja mobiilin button; säilytetty toiminnallisuus ja focus-tilat. |
| Hero ja tilastot | Oikeat otsikot, tekstit ja luvut; henkilökuva säilytetty. Vaalea yläkaistale rajattu CSS-kuvakehyksellä. |
| Portfolio-kapseli | Aiemmin tavallinen eyebrow-teksti. Nyt muokattava HTML-kapseli, CSS-reunus, sisäympyrä ja pseudo-elementtikoriste. |
| Tunnisteet | Experience-tunnisteet olivat jo CSS-kapseleita. Asiakastunnisteiden teksti säilytetty, pieni CSS-merkki lisätty. |
| Nuolipainikkeet | Ympyrät olivat jo CSS:ää, nuolet fonttimerkkejä. Nyt yhteinen itse määritelty SVG-nuoli, CSS-koko, hover ja näkyvä focus. |
| About Me | Aito HTML/Grid; rasterinen kaarinuoli korvattu muokattavalla SVG-polulla. Tähti CSS-geometriaa. |
| Projektikortit ja kuvasommittelu | Kuvat erillisiä img-elementtejä; otsikot, taustat, nuolet ja asettelu HTML/CSS:ää. Säilytetty. |
| Experience | Natiivi details/summary, näppäimistötuki ja yksi avoin rivi JavaScriptillä; säilytetty. |
| Portfolio ja blogi | Korttien kuvat ovat sisältökuvia, otsikot ja toiminnot oikeita elementtejä. Säilytetty. |
| CTA | Taustalla valokuva, päällä erillinen HTML-otsikko ja linkki; säilytetty. |
| Footer | Oikeat tekstit ja linkit. Yksinkertaiset SVG-viivat korvattu CSS-liukuvärigeometrialla. |

## Kaikkien kuva- ja SVG-tiedostojen tarkastus

Kaikki 17 WebP-tiedostoa katsottiin kuvakoosteena, hero ja logo myös täysikokoisina. `grid.svg` luettiin lähdekoodina (kolme viivaa).

- `portrait-hero.webp`, `portrait-smile.webp`, `portrait-close.webp`: henkilövalokuvia; säilytetty. Hero-kuvan vaalea kuvakaappausyläreuna rajataan pois CSS:llä; muita selainkehyksiä tai käyttöliittymätekstejä ei havaittu.
- `chair.webp`, `sculptural-chairs.webp`, `colorful-chairs.webp`, `studio.webp`, `sofa.webp`, `interior.webp`: varsinaisia kaluste- ja sisustuskuvia; säilytetty projektien sisältökuvina.
- `consultation.webp`: valokuva suunnittelutilanteesta; säilytetty CTA:n taustalla, tekstit erillistä HTML:ää.
- `light.webp`, `architecture.webp`: artikkelien kuvituskuvia; säilytetty. Kolmannen blogin sohva on ennestään väliaikainen kuvitus.
- `logo.webp`: monimutkainen susitunnus; säilytetty kuvana. Sitä ei käytetä käyttöliittymän kuvakaappauksena.
- `curve.webp`: yksinkertainen kaarinuoli; poistettu sivun käytöstä ja korvattu itse määritellyllä SVG:llä.
- `arrow.webp`: yksinkertainen nuoli; ei ollut käytössä eikä otettu käyttöön. Sivun nuolet ovat SVG-polkuja.
- `globe.webp`: yksinkertainen maapallomerkki; ei ollut käytössä eikä otettu käyttöön. Kapselin koriste on CSS:ää.
- `squeeze.webp`: rasterinen tekstilogo; ei ollut käytössä eikä otettu käyttöön. Korttien asiakasteksti pysyy HTML:nä.
- `grid.svg`: yksinkertainen viivakoriste; poistettu käytöstä, footerin geometria CSS:ää.

Käyttämättömät alkuperäiset grafiikkatiedostot säilytettiin lähdeaineistona. Uusia valokuvia ei generoitu eikä kuvatiedostoja muutettu. Paikallinen Poppins lisättiin Fontsource-paketista 5.3.0 (300/400/500/600, latin, WOFF2) lisensseineen.

## Suoritetut tarkistukset

Chromium + Playwright, paikallinen Python HTTP-palvelin, näyttökorkeus 900 px:

| Leveys | Sivun scrollWidth | Tulos |
| --- | --- | --- |
| 320 px | 320 px | Ei sivun vaakaylivuotoa |
| 390 px | 390 px | Ei sivun vaakaylivuotoa |
| 768 px | 768 px | Ei sivun vaakaylivuotoa |
| 1024 px | 1024 px | Ei sivun vaakaylivuotoa |
| 1440 px | 1440 px | Ei sivun vaakaylivuotoa |

- View More näyttää lisäprojektit ja Show Less piilottaa ne kaikilla leveyksillä; aria-expanded vaihtuu.
- Experience-summary avautuu Enterillä, vain yksi kokemus pysyy auki.
- Mobiilivalikko avautuu Enterillä, Escape sulkee ja palauttaa kohdistuksen. About Me -linkki sulkee valikon ja siirtyy ankkuriin.
- Kaikki img-elementit ladattiin myös lazy-load-tilasta; ei rikkinäisiä kuvia.
- Blogin Read insight avautuu Enterillä; painikkeen näppäimistökohdistus näyttää solid-outline-reunuksen.
- Paikalliset käytössä olevat Poppins-leikkaukset latautuivat (FontFace status: loaded); epäonnistuneita verkkopyyntöjä ei ollut.
- Ei selaimen JavaScript-virheitä. Reduced motion asettaa scroll-behavior: auto.
- Kokosivukuvakaappaukset otettiin kaikilla viidellä leveydellä; työpöytä- ja mobiilisommittelu tarkastettiin visuaalisesti.
- `node --check script.js` ja `git diff --check` läpäisty.

Google Fonts -pyyntö epäonnistui ympäristön verkkorajoituksen vuoksi. Fontti siirrettiin paikalliseksi; lopputestit suoritettiin paikallisella Poppinsilla. Sovellus ei tarvitse ulkoisia fonttipyyntöjä.

## Vielä verrattava / rajaukset

Alkuperäistä Wolfpixel-kokonaismallikuvaa ei ole paikallisesti, joten pikselintarkkaa vastaavuutta ei väitetä. Vertaa kurssin alkuperäiseen kuvaan erityisesti kapselin yksityiskohtia, hero-kuvan mittakaavaa, osioiden välistyksiä ja footerin viivojen sijaintia. Nykyinen järjestys ja sommittelu on säilytetty.

Ruudunlukija- ja muiden selainmoottorien testejä ei tehty. Figma-palautus ja henkilökohtaiset mallisisältöjen vaihdot ovat erillisiä tehtäviä. Vaiheen 1 korjaukset on pushattu ja yhdistetty main-haaraan PR #10:ssä. Sivuston julkaisun tilaa ei ole varmistettu.


## Vaihe 2: visuaalinen viimeistely

Lähtötilana main `e91866c`, jossa PR #10 on mukana. Uusi työhaara `fix/final-visual-polish`. Työpuu oli aluksi puhdas. `index.html`, `styles.css`, `script.js`, `README.md`, `VALIDATION.md` ja `COURSE.md` luettiin. Toimivaa sivurakennetta ei rakennettu uudelleen.

### Löydökset ja korjaukset

- Nuolten 52/44 px kokomääritykset olivat päällekkäisiä: koko tulee nyt yhdestä `--arrow-size`-muuttujasta. Ympyrän sivut mitattiin selaimessa yhtä pitkiksi kaikilla leveyksillä.
- Tabletin hero-otsikko käytti kiinteää 155 px kokoa: vaihdettu clamp-arvoksi. Blogikorttien tabletin sisäväliä pienennetty 16 px:iin tekstille jäävän tilan kasvattamiseksi.
- Services-linkki vei työhistoriaan: muutettu Experience-tekstiksi sekä headerissa että footerissa. Alkuperäisen referenssin linkkitekstiä ei voitu varmistaa.
- Tekstilinkkien, mobiilivalikon, footer-linkkien ja blogin summaryn kosketuskorkeus vähintään 44 px. Projektinuolet näkyvät myös hoverittomilla laitteilla.
- Pitkän kapselitekstin kutistuminen sallittu; pidemmällä esimerkkitekstillä tarkistettu, ettei kapseli vuoda.
- Hero-kuvan alkuperäinen säilytetty. Kuvan mitat korjattu HTML:ään (1160 × 1075). CSS-kehyksen yläraja mitattiin suhteessa kuvaan: ylin 51 px jää pois kaikilla testileveyksillä. Rajatun kuvatiedoston lisäämiselle ei ollut tarvetta, koska nykyinen ratkaisu säilyttää laadun ja toimii.
- Turhat object-fit/object-position-määritykset div-kehykseltä ja käyttämätön muuttuja poistettu; sähköpostin säännöt yhdistetty.
- Favicon puuttui ja aiheutti konsoliin 404-virheen: linkitetty nykyiseen logo.webp-tiedostoon.
- Ohituslinkki näkyi pitkien osioiden kuvakaappauksissa piilotuksesta huolimatta: piilotus käyttää nyt opacityä ja pointer-events-määritystä; näppäimistökohdistus palauttaa näkyvyyden.

### Vaiheen 2 testit

Chromium / Playwright paikallisella HTTP-palvelimella. Leveydet 320, 390, 768, 1024 ja 1440 px, korkeus 900 px. Jokaisella leveydellä läpäisty:

- sivun scrollWidth vastaa viewportin leveyttä;
- kaikki kuvat dekoodautuvat, alt-attribuutit löytyvät;
- kaikki neljä paikallista Poppins-leikkausta ladattiin ja FontFace-tilat olivat loaded;
- näkyvien nuoliympyröiden leveys ja korkeus ovat samat;
- hero-kuvan yläkaistale jää CSS-rajauksen ulkopuolelle;
- ensimmäinen Tab kohdistaa ohituslinkin, Enter aktivoi sen;
- mobiilissa valikko avautuu Enterillä, Escape sulkee ja palauttaa kohdistuksen, ankkurilinkki sulkee valikon;
- kahden Experience-rivin avaus Enterillä pitää vain yhden rivin auki;
- View More / Show Less toimii Enterillä, näkyvyys ja aria-expanded vaihtuvat;
- blogi avautuu Enterillä, focus-outline on näkyvä;
- pidempi kapseliteksti mahtuu ilman sisäistä vaakaylivuotoa.

Reduced motion: scroll-behavior on auto. Lopputestissä ei JavaScript-, konsoli- tai epäonnistuneita verkkopyyntöjä. `node --check script.js` ja `git diff --check` läpäisty. Faviconin korjauksen jälkeen testit ajettiin uudelleen.

Kokosivukuvat otettiin kaikilla viidellä leveydellä. Hero-, About-, Experience- ja Portfolio-osiokuvat otettiin 390/768/1440 px leveyksillä. Kuvia tarkasteltiin visuaalisesti: tekstien rivittyminen, kuvien rajaukset, korttien välit ja osioiden sommittelu; merkittäviä sisältöjen päällekkäisyyksiä ei havaittu. Testikuvat ovat tämän työympäristön hakemistossa `/workspace/scratch/visual-polish/`, eivät Gitissä. Testit käyttivät reduced-motion-tilaa vakaita kuvakaappauksia varten; hover-animaation ajallista etenemistä ei mitattu.

### Palautusvalmiuden rajat

Tekniset tarkistukset läpäisty. Kokonaista palautusvalmiutta ei vahvisteta: alkuperäistä Wolfpixel-mallia ei saatu ladattua (proxy CONNECT 403), eikä paikallista mallikuvaa löytynyt. Figma-prototyyppiä, sen linkkiä tai palautusta ei ole nähty. Käyttäjän tulee vielä verrata alkuperäiseen malliin, varmistaa Figma-mobiiliprototyypin palautus sekä täydentää jäsenet, palautuslinkit ja palautusmuoto. Desktop-proto on projektin lisätavoite, ei dokumentoitu pakollinen vaatimus. D.Nova-mallisisältöjä ei muutettu; niiden hyväksyttävyyttä arvioinnissa ei ole erikseen vahvistettu. Ruudunlukijaa tai muita selainmoottoreita ei testattu.


## Työn jatkaminen ja uusintatarkistus 2.11.2026

`git status`, `git branch -avv`, `git log --all --oneline -12`, `git fetch origin` ja `git diff` vahvistivat tilanteen: työpuu puhdas, paikallinen viimeistelyhaara mainia `e91866c` edellä commitilla `ae50199`. Aiemmat CSS/HTML-korjaukset ja dokumentaatio olivat tallessa. Niitä ei toteutettu uudelleen. Väliaikainen selaintestiskripti ei ollut säilynyt; toistettava tarkistin lisättiin tiedostoon `tests/browser-check.cjs`.

Tarkistin suoritettiin onnistuneesti 320/390/768/1024/1440 px leveyksillä. Se tarkistaa kuvat, kaikki neljä fonttileikkausta, sivun ylivuodon, nuoliympyrät, hero-rajauksen, Tab-ohituslinkin, mobiilivalikon ja Escapen, ankkurin, accordionin, View More / Show Less -tilat, blogin, focuksen, pitkän kapselitekstin ja reduced motion -tilan. Konsoli- ja verkkovirheitä ei ollut. Kokosivukuvat otettiin ja katsottiin kaikilla viidellä leveydellä; osiokuvat tallennettiin 390/768/1440 px leveyksillä. Uusien kuvien polku tässä ympäristössä on `/tmp/portfolio-check/`; aiemman ympäristön scratch-kuvien säilymiseen ei pidä luottaa. `node --check script.js`, testiskriptin syntaksi ja `git diff --check` läpäisty.

Uusia merkittäviä visuaalisia puutteita ei löytynyt. Dribbble-referenssi palauttaa edelleen proxyn CONNECT 403 -virheen: mallivertailu ja Figma-palautuksen varmistus jäävät avoimiksi. GitHubin PR-rajapintojen GraphQL- ja REST-pyynnöt palauttivat Forbidden-virheen. Tämä on erillinen este PR:n luonnille, ei osoitus Git-pushin epäonnistumisesta; pushin tila varmistetaan etähaaran SHA:sta.
