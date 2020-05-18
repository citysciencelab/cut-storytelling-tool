# Code-Konventionen

## Einleitung
Als EntwicklerIn bist du natürlich stets motiviert, deinen Code nicht nur voll funktionstüchtig zu erstellen, sondern auch so nachhaltig wie möglich zu gestalten. Nachhaltigkeit umfasst eine Kombination aus Eigenschaften, welche auf den Prinzipien des "Clean Code" basieren und auch auf deinen Code zutreffen werden. Um möglichst objektiv entscheiden zu können, ob dein Code im ersten Anlauf die Hürde des Pull-Requests meistert, haben wir einen Linter sowie einige Konventionen definiert. Bei dem Linter handelt es sich um **[ESLint](https://eslint.org/)**. Die Konfigurationsdatei **[.eslintrc](../.eslintrc)** ist im Repository. Die Konventionen sind in zwei Teile unterteilt. Ein Verstoß gegen eine Konvention aus Teil A führt zum Decline des Pull Requests.

## Konventionen

### Teil A
*Folgende Punkte müssen alle mit Ja beantwortet werden können:*

#### A.1 Linter und Funktionalität
A.1.1 Der Code funktioniert im Internet Exporer 10+, Chrome und Firefox.  
A.1.2 Der Code funktioniert in der mobilen Ansicht der jeweiligen Browser aus A.1.1.  
A.1.3 Der Linter wurde nicht deaktiviert.  
A.1.4 Der Linter wirft keinen Fehler.  
A.1.5 Dateien sind im Encoding "UTF-8".  
*A.1.6* Backbone: In Templates werden keine Pfeil-Funktionen genutzt.  
---
#### A.2 Packages und Libraries
A.2.1 Der Code nutzt die von *Geowerkstatt* eingesetzten Frameworks und Libraries und umgeht diese nicht.  
A.2.2 Es wird kein *Underscore.js* benutzt, außer für den Aufruf _.template().  
A.2.3 Es werden keine redundanten Packages eingebunden.  
A.2.4 JQuery wird nur noch im Zusammenhang mit Backbone.js verwendet.  
A.2.5 Das Hinzufügen großer Packages/Libraries wurde mit dem Team *LGV* abgesprochen.  
---
#### A.3 Code
A.3.1 Neue Dateien wurden gemäß der vorhandenen Struktur angelegt.  
A.3.2 Variablen, Funktionen, Ordner, Dateien haben sprechende englische Namen.  
A.3.3 Kommentare sind in englischer Sprache verfasst.  
A.3.4 Block-Kommentare von Funktionen beschreiben stets deren Zweck.  
A.3.5 Styles sind im .less Format verfasst.  
A.3.6 Es wird kein !important in Styles benutzt.  
A.3.7 Module und Komponenten beeinflussen lediglich das Verhalten und die Styles ihrer eigenen (Kind-) Elemente.  
A.3.8 Es werden keine Styles mit JavaScript verändert.  
*A.3.9* Vue: Alle Stylesheets sind "Soft-Scoped".  
---
#### A.4 Dokumentation im Code (JS-Doc)
A.4.1 Die Dokumentationssprache ist Englisch.  
A.4.2 Das Erstellen der Dokumentation mit npm run buildJsDoc wirft keine Fehler.  
*A.4.3* Backbone: Jede Funktion hat einen JSDoc-Block mit Beschreibung, Übergabeparametern, Rückgabewert und ggf. Events.  
*A.4.4* Backbone: Die Klassendefinition befindet sich über initialize() mit Angabe der Default-Werte. Alle Event-Listener, -Trigger und -Requests, die in der Klasse vorkommen, sind ebenfalls in der Klassendefinition dokumentiert.  
*A.4.5* Backbone: Wird von einer Klasse geerbt, existiert ein *lend* Kommentar (siehe Beispiele).  
*A.4.6* Backbone: Namespaces wurden in der Datei **[namespaces.js](../devtools/jsdoc/namespaces.js)** definiert. Sie repräsentieren die Ordnerstruktur/Module des Codes.  
*A.4.7* Backbone: Events sind in der Datei **[events.js](../devtools/jsdoc/events.js)** definiert.  
---
#### A.5 Unit-Tests
A.5.1 Zu jeder unittestbaren Funktion wurde ein Unit-Test geschrieben.  
A.5.2 Jedes Model hat eine Test-Datei, die mit **.test.js** (Backbone) oder **.spec.js** (Vue) endet und unter **[test/unittests/modules](../test/unittests/modules)** in der selben Ordnerstruktur wie der Code abgelegt wurde.  
A.5.3 Jede Funktion hat mindestens einen Positiv-Test (Funktionsaufruf mit plausiblen Werten) und einen Negativ-Test (Funktionsaufruf mit unplausiblen Werten, z.B. *undefined*, *[]*, *{}*, *""*, ...).  
---
#### A.6 Abwärts-Kompatibilität und Konfigurierbarkeit
A.6.1 Es gibt keine hartcodierten Abhängigkeiten wie beispielsweise URL's und Pfade.  
A.6.2 Konfigurierbare Parameter sind in den .md Dateien dokumentiert.  
A.6.3 Alle bisherigen Konfigurationsparameter sind weiterhin verwendbar.  
A.6.4 Bei Veränderung/Refactoring/Löschen eines Parameters wurde dieser als Depricated markiert.  
---
#### A.7 Mehrsprachigkeit
A.7.1 Es wurde in allen relevanten Dateien die Mehrsprachigkeit erweitert oder hinzugefügt.  
A.7.2 Es wurden die Sprachdateien in mindestens Englisch und Deutsch gepflegt.  
A.7.3 Die Fallback-Sprache ist Deutsch.  
A.7.4 Die Dokumentation (z.B. languages_de.md und languages_en.md) wurde auf Englisch, Deutsch und der entsprechenden Sprache gepflegt.  
---
#### A.8 Changelog
A.8.1 Die Sprache für Einträge im Changelog ist Deutsch.  
A.8.2 Das Löschen oder Hinzufügen eines Features wurde im Changelog erfasst.  
A.8.3 Änderungen, welche das UI, Schnittstellen oder Konfigurationen ändern, wurden im Changelog erfasst.  
A.8.4 Einträge wurden einer der folgenden Kategorien zugeordnet: Added, Changed, Deprecated, Removed, Fixed.   
---
---
### Teil B
*"Der Code ist so lesbar und verständlich wie möglich geschrieben. Das Ziel ist nicht, Zeilen zu sparen, sondern die Zeit der nachfolgenden EntwicklerInnen."*
#### B.1 Struktur
B.1.1 Darstellung (Templates) und Logik (Controller) sind sauber voneinander getrennt.  
B.1.2 Im Controller wird kein HTML erzeugt.  
B.1.3 Der Code hat keine Redundanzen. ([No duplicated code / DRY](https://de.wikipedia.org/wiki/Don%E2%80%99t_repeat_yourself))  
B.1.4 Funktionen, welche eine allgemeine, globale Verwendbarkeit aufweisen, sind in eine Helper Datei ausgelagert.  
B.1.5 Jede Funktion erledigt nur *eine* und klar definierte Aufgabe. ([Curly's Law](https://de.wikipedia.org/wiki/Single-Responsibility-Prinzip))  
B.1.6 Selbstdefinierte Funktionen verändern Werte nie per Referenz, sondern geben stets den ermittelten Wert zurück.  
B.1.7 In Templates befindet sich keine Datenverändernde Logik und Geschäftslogik.  
*B.1.8* Vue: Datenpersistierung und Kommunikation erfolgt per VueX Store.  
---
#### B.2 Lesbarkeit und Nachvollziehbarkeit
B.2.1 Der Code wurde so einfach wie möglich geschrieben. ([KISS](https://de.wikipedia.org/wiki/KISS-Prinzip))  
B.2.2 Im Code wurden wenn möglich Pfeil-Funktionen genutzt. Es gibt kein unnötiges Mitschleifen des This-Contextes.  
B.2.3 Funktionsparameter und Properties haben wenn möglich definierte Standardwerte.  
B.2.4 Es werden native Ecma-Script Funktionen und Objekte genutzt.  
B.2.5 Die Typprüfung erfolgt mit typeof, instanceof und Array.isArray() sowie "===".  
---