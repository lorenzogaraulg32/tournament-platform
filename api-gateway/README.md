### Funzionalità micro servizio api-gateway

Sostanzialmente si tratta di un classico gateway realizzato per un architettura a micro servizi, il suo scopo è quindi 
quello di smistare ciascuna richiesta verso il micro servizio che la dovrebbe gestire, fornendo un unico punto di entrata delle richieste
a cui il frontend si potrà appoggiare.

Inoltre per ogni richiesta fa una validazione preliminare tramite la validazione del JWT utilizzando la chiave pubblica fornita dall'auth-service