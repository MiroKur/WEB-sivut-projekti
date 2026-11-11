# Opiskelijan koodiopas

Tämä opas selittää nykyisen yhden sivun portfolion. Avaa rinnalle `index.html`, `styles.css` ja `script.js`: tiedostojen suomenkieliset osio-otsikot vastaavat oppaan kokonaisuuksia. D.Nova ja asiakkaat ovat kurssin mallisisältöä.

## Kolmen tiedoston vastuut

| Tiedosto | Vastuu | Esimerkki |
| --- | --- | --- |
| HTML | Sisältö, merkitys ja käyttöliittymän perusrakenne | Otsikko on h1/h2, navigointi on a-linkkejä, avattava sisältö on details. |
| CSS | Ulkoasu ja responsiivinen asettelu | Grid-palstat, väripinnat, kuvarajaukset, hover ja animaatiot. |
| JavaScript | Tapahtumiin reagoiva lisätoiminnallisuus | Valikon tila, laskurit, parallax ja karusellin ohjainten synkronointi. |

Selain lukee HTML:n, lataa CSS:n ja suorittaa `defer`-skriptin HTML-rakenteen valmistuttua. JavaScript voi siksi hakea sivun elementit suoraan `querySelector`-kutsuilla. Sivustolla ei ole build-vaihetta, backendia tai käyttöliittymäframeworkia.

## HTML:n sisältöjärjestys

`header` sisältää tunnuksen ja päävalikon. `main` kokoaa varsinaisen sisällön: Hero → About Me → Showcase → Experiences → Winter Deal → Latest Works → Blogs → Contact. `footer` toistaa navigoinnin ja sisältää sähköpostilinkin.

`href="#about"` siirtää saman dokumentin `id="about"`-elementtiin. Projektikorttien linkit ohjaavat malliprojektissa portfolioon tai yhteydenottoon. Sähköpostin `mailto:` avaa käyttäjän oman sähköpostiohjelman. Sivustossa ei väitetä olevan oikeaa ajanvarausjärjestelmää.

HTML-kommentit erottavat kaikki kymmenen pääosiota. Sisäiset kommentit selittävät muun muassa kuvasäiliön, lazy loadingin, JS-tunnisteet, koristeet ja natiivin accordionin. Sulkevia tageja ei kommentoida erikseen.

### Kuva ei ole käyttöliittymän korvike

Valokuvat ja graafiset logot ovat `img`-elementtejä. Otsikot, kuvatekstit, kortit, painikkeet ja kapselit rakennetaan HTML:llä/CSS:llä. SVG-nuolen polku on muokattavaa vektorigrafiikkaa. Kokonaisia referenssikortteja ei upoteta kuvina.

Kuvan `width` ja `height` kertovat lähdekuvan todellisen kuvasuhteen ja auttavat selainta varaamaan tilaa. CSS päättää näkyvän koon ja rajauksen. `object-fit: cover` täyttää kehyksen venyttämättä; `object-position` valitsee näkyvän kohdan. `alt` kuvaa sisältöä, tyhjä `alt=""` merkitsee koristekuvaa. Sivun alempien kuvien `loading="lazy"` lykkää latausta; heron tärkeä kuva käyttää `fetchpriority="high"`-attribuuttia.

## CSS:n lukeminen

Tyylitiedostossa on 13 numeroitua pääryhmää: fontit/muuttujat, perustyylit, header, hero, About, showcase, accordion, Winter Deal, työt, blogit, yhteydenotto/footer, responsiivisuus ja animaatiot.

`:root` kokoaa yhteiset arvot. Esimerkiksi `color: var(--ink)` lukee tekstivärin muuttujasta. `--radius-card` ohjaa korttien pyöristystä, `--space-20` tarkoittaa 20 pikselin väliä. Muuttujan tarkoitus on pitää sama päätös yhdessä paikassa; niitä ei tarvitse korvata JavaScriptillä.

- Flexbox sopii esimerkiksi headerin vaakariville ja karusellin peräkkäisille korteille.
- Grid sopii desktopin About-palstoihin ja projektikorttien ruudukkoon. `minmax(0, 1fr)` sallii sisällön kutistumisen niin, ettei pitkä teksti pakota koko sivua leveämmäksi.
- `clamp(minimi, joustava arvo, maksimi)` skaalaa otsikon fonttia hallituissa rajoissa.
- `aspect-ratio` varaa kuvalle tai ympyrälle oikean suhteellisen koon.
- `position: relative` muodostaa asemointikehyksen. Sen sisällä `absolute` sijoittaa esimerkiksi desktopin hero-kuvan tai CTA:n taustakuvan erilleen normaalista tekstivirrasta.
- `overflow: hidden` leikkaa hoverissa suurennettavan kuvan kehykseen. Karusellissa `overflow-x: auto` sallii tarkoituksellisen vaakavierityksen vain kyseisellä alueella.
- `transform` liikuttaa tai skaalaa elementin piirrettävää ulkoasua muuttamatta viereisten elementtien normaalia layoutia.

Sama ominaisuus voi olla perustellusti eri mediaehdoissa, mutta vanhojen viimeistelykierrosten irrallisia perustyylien ylikirjoituksia on yhdistetty. Mobiilin saman mediaehdon säännöt on koottu yhteen. Ulkoasu varmistettiin ennen mobiilimuutoksia vertaamalla selaimen laskemia tyylejä lähtötilaan kahdeksalla leveydellä.

## Responsiivinen mobiiliversio

Desktopin perustyylin jälkeen tulevat 1000 px tabletin ja 700 px mobiilin mediaehdot. Erillistä `mobile.html`-tiedostoa ei ole.

390 px näytöllä tavallinen sisältö on 350 px leveä: sivuille jää 20 px. Mobiilin hero on oma pystysommitelmansa: tilastot, Hello, esittely, Scroll down ja lopuksi henkilökuva. Kuva on normaalissa sisältövirrassa, joten sen sijoittuminen seuraa tekstin todellista korkeutta. Kiinteää 608 px:n scroll-linkin top-sijaintia tai 730 px:n hero-minimikorkeutta ei enää käytetä mobiilissa.

About-palstat pinotaan; 120 % -kortin sisäinen kahden palstan asettelu säilyy. Showcase näyttää yhden pääkortin ja seuraavan reunan. Sen otsikko ja logo ovat eri riveillä. Accordion näyttää mobiilissakin työnimikkeen, ajankohdan ja tagit. Työ- ja blogikortit ovat yhdessä palstassa. Pieniä tekstejä on suurennettu ja headerin kosketuskohteet ovat vähintään 44 × 44 px.

## JavaScriptin toimintakokonaisuudet

### Mobiilivalikko

`.menu-toggle` on oikea button. Napsautus vaihtaa `aria-expanded`-arvon ja navigaation `is-open`-luokan. ARIA kertoo tilan avustaville teknologioille; CSS päättää näkyvyydestä. Ankkurin valinta sulkee valikon. Escape sulkee sen ja palauttaa kohdistuksen avauspainikkeeseen. Desktopiin siirtyminen sulkee mobiilitilan.

### Experience-accordion

`details` pitää sisällön suljettuna tai avoimena. Sen ensimmäinen `summary` on natiivi avauskontrolli ja toimii myös Enterillä sekä ilman JavaScriptiä. JS kuuntelee `toggle`-tapahtumaa: kun rivi avautuu, muiden `open` asetetaan epätodeksi. Sulkeutumisen tapahtuma ei käynnistä uutta avausta.

`[open]`-CSS korostaa taustan, tagit ja plusmerkin. Sisällön lyhyt opacity/transform-paljastus ei tarvitse mielivaltaista max-height-rajaa. Suljettu details ei jätä sisäisiä linkkejä tavalliseen fokusjärjestykseen.

### View More / Show Less

Painike vaihtaa `#more-projects`-alueen `hidden`-tilan ja oman `aria-expanded`-arvonsa. Se muuttaa vain `.button-label`-tekstisolmua, joten SVG-nuoli ei katoa. View More ei navigoi uuteen HTML-tiedostoon.

### Hero-parallax

`pointermove` kertoo hiiren sijainnin. `getBoundingClientRect()` antaa heron koon ja sijainnin selainikkunassa. Lasku `(clientX - left) / width * 2 - 1` muuntaa vaakasijainnin alueelle −1…+1: keskikohta on nolla. Pystysijainti lasketaan samoin. Min/max rajaa arvot.

Kuvan kerroin on 10 px, otsikon vastakkaissuuntainen kerroin −5 px. `requestAnimationFrame()` ajoittaa CSS-muuttujien päivityksen selaimen seuraavaan piirtojaksoon. `cancelAnimationFrame()` peruu edellisen odottavan päivityksen, joten tapahtumat eivät muodosta pitkää jonoa. CSS lukee muuttujat transformiin.

`pointerleave` ja `pointercancel` palauttavat muuttujat nollaan. `matchMedia()` tarkistaa, onko laitteessa tarkka hover-osoitin ja onko käyttäjä pyytänyt vähennettyä liikettä. Kosketusele ei käynnistä hiiriparallaxia.

### Numerolaskurit ja Hello

`data-count` sisältää loppuarvon. `IntersectionObserver` käynnistää animaation, kun 15 % herosta on näkyvissä. `counted` ja observerin irrottaminen estävät toiston takaisin vieritettäessä.

`performance.now()` ja requestAnimationFrame antavat aikapohjaisen etenemisen noin 1,5 sekunnissa. Ease-out `1 - (1 - progress) ** 3` hidastaa liikettä loppua kohti. HTML:ssä ovat valmiiksi 200 ja 50: ilman JS:ää ja reduced motion -tilassa ne näkyvät suoraan. Vakaa `aria-label` kertoo ruudunlukijalle loppuluvun; nopeasti vaihtuva visuaalinen numero on aria-hidden.

Hello pysyy h1-otsikkona. JS lisää luokan, jonka CSS paljastaa tekstin clip-pathilla. Otsikon tilaa ei poisteta, joten asettelu ei hypähdä.

### Showcase-karuselli

Kuva-alue on natiivisti vieritettävä. `scrollWidth` tarkoittaa koko sisällön leveyttä, `clientWidth` näkyvän kehyksen leveyttä ja `scrollLeft` tämänhetkistä siirtymää. Suurin siirtymä on niiden erotus. Nykyinen prosentti on `scrollLeft / max * 100`.

`syncCarousel()` päivittää range-ohjaimen ja reunojen painiketilat. Range muuntaa prosenttinsa takaisin pikseleiksi. Edellinen/seuraava liikuttaa yhden kortin leveyden ja gap-välin verran. `ResizeObserver` päivittää tilan koon muuttuessa. Työpöydän ensimmäinen asento keskittää keskimmäisen kortin, mobiili alkaa ensimmäisestä.

CSS scroll snap kohdistaa kortin keskelle vierityksen päättyessä. Sormipyyhkäisy on selaimen omaa kosketusvieritystä, eikä sitä simuloida wheel-kutsulla.

### Milloin preventDefault on sallittu?

Wheel-kuuntelija saa estää pystyrullan oletustoiminnon vain, jos karusellissa on tilaa liikkua samaan suuntaan ja tapahtuma todella muunnetaan vaakaliikkeeksi. Reunassa funktio palaa ennen estoa: sivun normaali pystyscroll saa jatkua. Ctrl-zoomaus, Shift-vieritys ja trackpadin pääasiassa vaakasuuntainen liike jätetään selaimelle.

`passive: false` on tarpeen juuri tässä kuuntelijassa preventDefaultin takia. Tavallinen scroll-kuuntelija on passiivinen. deltaMode huomioi pikseli-, rivi- ja sivuyksiköt. Snap poistetaan vain rullaeleen ajaksi ja palautetaan lyhyen tauon jälkeen. Chromiumin testissä ensimmäinen rulla-askel voi jäädä natiiviin vaakavieritysketjuun keinotekoisen reunahyppäyksen jälkeen; seuraavien askelten pitää jatkaa sivua, eikä reunatapahtumia estetä.

### Hover, focus ja kosketus

Projektin kuvan maltillinen skaalaus leikkautuu kuvakehykseen. Blogissa koko kortin hover tai sisäisen kontrollin focus korostaa korttia ja nuolta. Varsinainen avaus tapahtuu edelleen Read insight -summarylla: kuvan klikkausta ei esitetä toimivana artikkelilinkkinä. Mobiili käyttää samaa summarya napautuksella.

`:focus-visible` näyttää näppäimistökohdistuksen. Nuoli on usein aria-hidden, koska ympäröivän linkin teksti kertoo jo toiminnon. Ohituslinkki on sivun ensimmäinen Tab-kohde.

## Animaatioiden poistaminen

Käyttöjärjestelmän vähennetyn liikkeen asetus vastaa `prefers-reduced-motion: reduce` -mediaehtoa. CSS poistaa animaatiot ja siirtymät; JS ohittaa parallaxin ja näyttää loppuluvut. Myös asetuksen vaihtaminen kesken käytön huomioidaan. Sisältöä ei piiloteta animaation puuttuessa.

## Sisällön muokkaaminen turvallisesti

1. Vaihda tekstit HTML:ssä. Säilytä id-tunnisteet, joihin navigaatio, aria-controls ja JS viittaavat.
2. Vaihda värit tai toistuvat mitat styles.css:n `:root`-ryhmässä. Tarkista kontrasti ja kaikki näyttöleveydet.
3. Uutta kuvaa varten optimoi alkuperäinen WebP:ksi, päivitä src/width/height/alt ja merkitse lähde `assets/sources.json`-tiedostoon. Älä venytä kuvaa tai korvaa kortin tekstiä kuvakaappauksella.
4. Muuta laskurin tavoite sekä HTML:n näkyvään loppuarvoon, data-countiin että aria-labeliin. Älä päivitä vain yhtä niistä.
5. Testaa HTTP-palvelimella `node tests/browser-check.cjs` ja tarkista myös kuvakaappaukset.

[Figma-mobiilin rakenne ja linkit](FIGMA-MOBILE.md), [viimeisin tarkistus](../FINAL-REVIEW.md) ja [kurssin palautusmuistio](../COURSE.md) täydentävät tätä opasta.
