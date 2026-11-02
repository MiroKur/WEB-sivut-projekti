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

Ruudunlukija- ja muiden selainmoottorien testejä ei tehty. Figma-palautus ja henkilökohtaiset mallisisältöjen vaihdot ovat erillisiä tehtäviä. GitHubiin ei pushattu eikä sivustoa julkaistu.
