---
title: Aggiungi l’Autenticazione Forte PSD2 alla Tua App
description: Scopri come aggiungere alla tua app l'autenticazione dei pagamenti
  online "Secure Customer Authentication", noto anche come PSD2, con Vonage
  Verify API
thumbnail: /content/blog/add-strong-psd2-authentication-to-your-application/Blog_Strong-Customer-Authentication_1200x600-2.png
author: lornajane
published: true
published_at: 2020-06-23T07:53:47.000Z
comments: true
category: tutorial
old_categories:
  - developer
  - verify
tags:
  - security
  - verify-api
---

Con l’aumento del numero degli acquisti effettuati online, cresce il pericolo di frodi e pagamenti non autorizzati.

In risposta a questa situazione, in Europa è stato introdotto un nuovo standard per l'autenticazione dei pagamenti online denominato "Secure Customer Authentication", noto anche come PSD2 (Payment Services Directive versione 2).

Il PSD2 introduce un ulteriore elemento di sicurezza per i pagamenti online. Se le tue applicazioni prevedono transazioni in euro, puoi utilizzare la nostra [Verify API](https://developer.nexmo.com/verify/overview) per implementarlo e ottenere una maggiore sicurezza.

## Cos’è la Secure Customer Authentication

La Secure Customer Authentication assicura che, in caso di importi di transazione consistenti, venga utilizzato più di un tipo di autenticazione (sono disponibili [i dettagli tecnici e le clausole](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2018.069.01.0023.01.ENG&toc=OJ:L:2018:069:TOC)). In breve, le transazioni dovrebbero includere **due** tra i seguenti elementi:

- Una password o un PIN (qualcosa che l'utente conosce)
- Un'impronta digitale o una scansione del viso/degli occhi (qualcosa che l'utente è)
- Delle informazioni da un telefono o un token hardware (qualcosa che l’utente possiede)

L'utilizzo della funzione PSD2 nella Verify API è un modo semplice per implementare la terza opzione.

## Come Funziona la Verify API PSD2

Per autorizzare un pagamento, l'API invia un codice al numero di telefono registrato sull'account dell'utente.

L'autorizzazione può avvenire tramite messaggio di testo, telefonata o, solitamente, una combinazione di entrambi; quest’ultima opzione consente di raggiungere il maggior numero possibile di utenti. L'utente riceverà il PIN insieme alle informazioni sulla transazione: l'importo del pagamento e a chi è destinato.

![Screenshot from phone with message: Your code 2393 is for payment to Acme Inc. in the amount of 12.34€. Valid for 5 minutes](/content/blog/add-strong-psd2-authentication-to-your-application/sms_shot.png)

L'utente fornisce quindi il PIN che ha ricevuto; questo viene inviato di nuovo alla Verify API per verificare che sia corretto. In caso affermativo, la richiesta viene confermata e l’utente può  procedere con il pagamento.

## Come Implementare la Verify API PSD2

Abbiamo [esempi in diversi stack tecnologici](https://developer.nexmo.com/verify/code-snippets/send-verify-psd2-request), ma per rendere le cose più omogenee, questi esempi usano [cURL](https://curl.haxx.se).

<sign-up></sign-up>

## Invia un Codice PIN per Confermare un Pagamento

Il primo passaggio consiste nell'inviare un codice al telefono del cliente per confermare l'importo del pagamento e a chi è destinato. Per essere sicuri che il messaggio venga recapitato, il messaggio include un codice PIN.

Qui puoi consultare [la fonte API per l'invio di un codice PSD2](https://developer.nexmo.com/api/verify#verifyRequestWithPSD2), con l’elenco completo di dettagli e tutti i parametri disponibili. Nel caso più semplice, la richiesta cURL è la seguente:

```
curl -X POST "https://api.nexmo.com/verify/psd2/json" \
-d api_key=API_KEY -d api_secret=API_SECRET \
-d number=447700777000 -d payee="Acme, Inc" \
-d amount=12.34
```

Sostituisci `API_KEY` e `API_SECRET` nell'esempio sopra con le tue credenziali e inserisci anche il numero di telefono a cui inviare il PIN; durante i test il consiglio è di utilizzare il tuo numero di telefono, che dovrebbe essere in formato internazionale, senza il simbolo `+` iniziale.

In questo caso, il PIN verrà inviato prima tramite SMS. Se l'utente non fornisce il PIN corretto entro pochi minuti, seguirà una chiamata automatica che comunicherà il PIN a voce.

Implementare entrambi le opzioni ti aiuta a raggiungere più utenti, ma puoi anche scegliere solo quella il [workflow](https://developer.nexmo.com/verify/guides/workflows-and-events) più adatto alle tue esigenze.

La richiesta restituisce un `request_id`. Salvalo, poiché ti servirà nel prossimo passaggio!

## Controlla il codice PIN

Quando l'utente invia il codice PIN ricevuto, è possibile confermare che sia corretto chiamando il `/check` endpoint nell'API Vonage Verify.

Per ulteriori dettagli, consulta la [documentazione di riferimento API per il check endpoint](https://developer.nexmo.com/api/verify#verifyCheck). Anche in questo caso sono disponibili [esempi di codice](https://developer.nexmo.com/verify/code-snippets/check-verify-request), e la richiesta cURL è la seguente:

```
curl -X POST "https://api.nexmo.com/verify/check/json" \
-d api_key=API_KEY -d api_secret=API_SECRET \
-d request_id=abcdef0123456789abcdef0123456789 -d code=1234
```

Anche qui, sostituisci `API_KEY` e `API_SECRET` con le tue credenziali e utilizza il `request_id` restituito nel passaggio precedente. Il parametro `code` dovrebbe essere il codice PIN inviato all'utente.

Se l’esito è positivo, la risposta mostrerà uno `status` pari a zero e puoi essere certo che l'utente ha autorizzato il pagamento.

## Passaggi Successivi

In questo post, abbiamo spiegato cosa comporta la Secure Customer Authentication del cliente e abbiamo visto come è possibile implementarla nelle tue applicazioni. Ecco alcune risorse che potresti trovare utili per i passaggi successivi:

  - La sezione [Verifify API](https://developer.nexmo.com/verify) del nostro Portale per Developers
  - [La Documentazione API](https://developer.nexmo.com/api/verify) per la Verify API
  - [I post del nostro Blog che riguardano la Verify API](https://www.nexmo.com/blog/tag/verify), dai quali potresti trarre ispirazione per il tuo prossimo progetto
  - Contattaci su [Twitter](https://twitter.com/VonageDev) o sulla nostra [Community Slack](https://developer.nexmo.com/community/slack) per qualsiasi commento, suggerimento o domanda.

[Puoi leggere il post originale in inglese qui](https://www.nexmo.com/blog/2020/06/23/add-strong-psd2-authentication-to-your-application)
