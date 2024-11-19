Costruirò una applicazione web a 2 strati
- client in react, che gestisce la logita di presentazione e la business logic
    react è un framework  che usa la Component-BasedArchitecture

    usato bootstrap@5.3.3  per gestire più facilmente il layout usando le classi
 
- server in node, usando il CMS Stapi, gestirà l'accesso ai dati e al database


database è gestito tramite strapi

Come primo approccio di sviluppo frontend, ho creato il componenete Hero e il ocmponente Navbar che sono presenti in tutte le pagine, successivamente , vedendo che il contenuto delle varie pagine ofsse  dinamico  e ci venisse consigliato di gestire come articoli/documenti, ho creato un primo semplice schema con strapi
Pagina = (_pageslug_, title, content) dove il content è dell'HTML da incollare dentro la pagina

Vedendo la semplicità, ho deciso di togliere il content e aggiungere un DinamicZone composto da alcuni componenti già cotruiti all'interno di una lista di componenti che ho creato:
-titolo
-

ho poi creato una API apposita per fare ikl findOne sulla base dello slug partendo da questo tutorial
https://stackoverflow.com/questions/73261870/how-to-fetch-strapi-by-slug-and-how-to-populate-the-categories


STRAPI è da eseguire in develop mode per poterlo modificare


DASHBOARD STRAPI

utenti:
- roberto.gallina@studenti.univr.it - Aa12345678
- davide.zanellato@studenti.univr.it - Aa12345678