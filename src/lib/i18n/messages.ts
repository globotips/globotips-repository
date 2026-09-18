import type { InterestRole } from "@/lib/interest-lead";
import type { Locale } from "@/lib/i18n/locales";

export type Messages = {
  brand: string;
  legalEntity: string;
  header: {
    language: string;
    hotelLogin: string;
  };
  home: {
    eyebrow: string;
    heading: string;
    lead: string;
    cost: string;
    ctaInterest: string;
    ctaHow: string;
    howEyebrow: string;
    howHeading: string;
    steps: { title: string; body: string }[];
    trialHeading: string;
    trialBody: string;
    foundersHeading: string;
    foundersBody: string;
    phoneDemo: string;
    phoneTip: string;
    phoneCustom: string;
    phonePay: string;
    footerHost: string;
  };
  interest: {
    title: string;
    eyebrow: string;
    lead: string;
    waitlistNote: string;
    reviewsHint: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    role: string;
    businessName: string;
    notes: string;
    notesHint: string;
    submit: string;
    submitting: string;
    backHome: string;
    thanksTitle: string;
    thanksBody: string;
    thanksAgain: string;
    roles: Record<InterestRole, string>;
    errors: {
      fullName: string;
      email: string;
      phone: string;
      country: string;
      city: string;
      role: string;
      businessName: string;
      notes: string;
      rate: string;
      save: string;
    };
  };
  meta: {
    homeTitle: string;
    homeDescription: string;
    interestTitle: string;
    interestDescription: string;
  };
};

const pt: Messages = {
  brand: "Travel Gratuity Group",
  legalEntity: "GLOBOTIPS LLC",
  header: {
    language: "Idioma",
    hotelLogin: "Login do hotel",
  },
  home: {
    eyebrow: "Gorjetas sem dinheiro para hotéis e guias",
    heading: "A equipe perde gorjetas porque o hóspede não carrega dinheiro.",
    lead: "O hóspede aponta a câmera do celular para o QR e gorjeta a pessoa diretamente. Sem aplicativo. Sem cadastro. Sem login.",
    cost: "Não custa nada para o hotel experimentar.",
    ctaInterest: "Cadastro de interesse",
    ctaHow: "Como funciona",
    howEyebrow: "Como funciona",
    howHeading: "Três passos. O hóspede gorjeta a pessoa diretamente.",
    steps: [
      {
        title: "Cadastre a equipe",
        body: "O hotel adiciona as pessoas. Cada uma recebe um código único de gorjeta.",
      },
      {
        title: "Imprima os QRs",
        body: "Baixe um PNG para cada pessoa e imprima no balcão, no crachá ou na pasta do hóspede.",
      },
      {
        title: "O hóspede gorjeta a pessoa diretamente",
        body: "O hóspede abre a câmera, lê o QR e paga quem o atendeu. O hotel nunca fica com o dinheiro.",
      },
    ],
    trialHeading: "60 dias grátis.",
    trialBody:
      "Depois do período, cerca de 3% é retirado da gorjeta. O hóspede não paga a mais. O hotel não retém as gorjetas.",
    foundersHeading: "Fundadores",
    foundersBody:
      "O Travel Gratuity Group foi fundado por Rosalie Dudkiewicz, cofundadora com Dariusz Dudkiewicz. A empresa jurídica é a GLOBOTIPS LLC.",
    phoneDemo: "Modo demo · sem dinheiro real",
    phoneTip: "Gorjeta",
    phoneCustom: "Valor personalizado",
    phonePay: "Continuar para pagar",
    footerHost: "travelgratuitygroup.com",
  },
  interest: {
    title: "Cadastro de interesse",
    eyebrow: "Brasil",
    lead: "Estamos recrutando hotéis, agências de viagem e guias no Brasil.",
    waitlistNote:
      "Isto é uma lista de interesse — não ativa pagamentos e não é um compromisso de operação. Guardamos seus dados e falamos com você quando o Brasil estiver pronto.",
    reviewsHint:
      "Além das gorjetas, quem recebe vai poder acumular avaliações de hóspedes ao longo do tempo — para melhorar o ranking e deixar o serviço mais credível. Em breve; ainda não está ativo.",
    fullName: "Nome completo",
    email: "E-mail",
    phone: "Telefone / WhatsApp",
    country: "País",
    city: "Cidade",
    role: "Você é",
    businessName: "Nome do hotel, agência ou negócio",
    notes: "Observações (opcional)",
    notesHint: "Região, tipo de operação ou quando prefere ser contactado.",
    submit: "Enviar interesse",
    submitting: "Enviando…",
    backHome: "Voltar ao início",
    thanksTitle: "Obrigado. Recebemos seu interesse.",
    thanksBody:
      "Guardamos seus dados na lista de espera. Não ativamos pagamentos agora. Entraremos em contato quando as operações no Brasil estiverem prontas.",
    thanksAgain: "Enviar outro cadastro",
    roles: {
      hotel: "Hotel",
      agency: "Agência de viagem",
      guide: "Guia",
      driver: "Motorista",
      other: "Outro",
    },
    errors: {
      fullName: "Informe seu nome completo.",
      email: "Informe um e-mail válido.",
      phone: "Informe um telefone ou WhatsApp com DDD.",
      country: "Informe o país.",
      city: "Informe a cidade.",
      role: "Escolha o seu papel.",
      businessName: "Informe o nome do hotel, agência ou negócio.",
      notes: "As observações estão longas demais.",
      rate: "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
      save: "Não foi possível salvar agora. Tente de novo em instantes.",
    },
  },
  meta: {
    homeTitle: "Travel Gratuity Group",
    homeDescription:
      "Gorjetas sem dinheiro para hotéis e guias. Cadastro de interesse no Brasil — sem ativar pagamentos.",
    interestTitle: "Cadastro de interesse",
    interestDescription:
      "Lista de interesse do Travel Gratuity Group no Brasil. Sem pagamentos e sem compromisso de operação.",
  },
};

const en: Messages = {
  brand: "Travel Gratuity Group",
  legalEntity: "GLOBOTIPS LLC",
  header: {
    language: "Language",
    hotelLogin: "Hotel login",
  },
  home: {
    eyebrow: "Cashless tipping for hotels and tour guides",
    heading: "Staff lose tips because guests don't carry cash.",
    lead: "Guests scan a QR with their phone camera and tip the employee directly. No guest app. No guest account. No login.",
    cost: "It costs the hotel nothing to try.",
    ctaInterest: "Register your interest",
    ctaHow: "See the three steps",
    howEyebrow: "How it works",
    howHeading: "Three steps. Guests tip the employee directly.",
    steps: [
      {
        title: "Add employees",
        body: "The hotel adds staff. Each person gets a unique tip code.",
      },
      {
        title: "Print QRs",
        body: "Download a PNG for each employee and print it at the desk, on a badge, or in a guest folder.",
      },
      {
        title: "Guests tip the employee directly",
        body: "A guest opens the camera, scans, and pays the person who helped them. The hotel never holds the money.",
      },
    ],
    trialHeading: "Free for 60 days.",
    trialBody:
      "After the trial, about 3% is taken from the tip. The guest is not surcharged. The hotel is not holding tips.",
    foundersHeading: "Founders",
    foundersBody:
      "Travel Gratuity Group was founded by Rosalie Dudkiewicz, co-founder with Dariusz Dudkiewicz. The legal entity is GLOBOTIPS LLC.",
    phoneDemo: "Demo mode · no real money",
    phoneTip: "Tip",
    phoneCustom: "Custom amount",
    phonePay: "Continue to pay",
    footerHost: "travelgratuitygroup.com",
  },
  interest: {
    title: "Interest signup",
    eyebrow: "Brazil",
    lead: "We are recruiting hotels, travel agencies, and guides in Brazil.",
    waitlistNote:
      "This is an interest / waitlist signup — it does not activate payments and is not a commitment to operate. We store your details and contact you when Brazil is ready.",
    reviewsHint:
      "Besides tips, recipients will also be able to accumulate guest reviews over time — to improve ranking and make their service more credible. Coming soon; not live yet.",
    fullName: "Full name",
    email: "Email",
    phone: "Phone / WhatsApp",
    country: "Country",
    city: "City",
    role: "You are",
    businessName: "Hotel, agency, or business name",
    notes: "Notes (optional)",
    notesHint: "Region, type of operation, or when you prefer to be contacted.",
    submit: "Submit interest",
    submitting: "Sending…",
    backHome: "Back to home",
    thanksTitle: "Thank you. We recorded your interest.",
    thanksBody:
      "Your details are on the waitlist. Payments are not being activated yet. We will contact you when Brazil operations are ready.",
    thanksAgain: "Submit another signup",
    roles: {
      hotel: "Hotel",
      agency: "Travel agency",
      guide: "Guide",
      driver: "Driver",
      other: "Other",
    },
    errors: {
      fullName: "Enter your full name.",
      email: "Enter a valid email.",
      phone: "Enter a phone or WhatsApp number.",
      country: "Enter a country.",
      city: "Enter a city.",
      role: "Choose your role.",
      businessName: "Enter the hotel, agency, or business name.",
      notes: "Notes are too long.",
      rate: "Too many attempts. Wait a few minutes and try again.",
      save: "We could not save that just now. Please try again.",
    },
  },
  meta: {
    homeTitle: "Travel Gratuity Group",
    homeDescription:
      "Cashless tipping for hotels and tour guides. Brazil interest signup — payments are not activated yet.",
    interestTitle: "Interest signup",
    interestDescription:
      "Travel Gratuity Group Brazil waitlist. No payments and no commitment to operate.",
  },
};

const es: Messages = {
  brand: "Travel Gratuity Group",
  legalEntity: "GLOBOTIPS LLC",
  header: {
    language: "Idioma",
    hotelLogin: "Acceso del hotel",
  },
  home: {
    eyebrow: "Propinas sin efectivo para hoteles y guías",
    heading: "El equipo pierde propinas porque el huésped no lleva efectivo.",
    lead: "El huésped apunta la cámara del celular al QR y deja la propina a la persona directamente. Sin app. Sin cuenta. Sin inicio de sesión.",
    cost: "Al hotel no le cuesta nada probarlo.",
    ctaInterest: "Registro de interés",
    ctaHow: "Cómo funciona",
    howEyebrow: "Cómo funciona",
    howHeading: "Tres pasos. El huésped da la propina a la persona directamente.",
    steps: [
      {
        title: "Registre al equipo",
        body: "El hotel añade al personal. Cada persona recibe un código único de propina.",
      },
      {
        title: "Imprima los QR",
        body: "Descargue un PNG para cada persona e imprímalo en recepción, en el gafete o en la carpeta del huésped.",
      },
      {
        title: "El huésped da la propina directamente",
        body: "El huésped abre la cámara, escanea y paga a quien lo atendió. El hotel nunca retiene el dinero.",
      },
    ],
    trialHeading: "Gratis durante 60 días.",
    trialBody:
      "Después de la prueba, alrededor del 3% se toma de la propina. Al huésped no se le cobra de más. El hotel no retiene las propinas.",
    foundersHeading: "Fundadores",
    foundersBody:
      "Travel Gratuity Group fue fundado por Rosalie Dudkiewicz, cofundadora con Dariusz Dudkiewicz. La entidad legal es GLOBOTIPS LLC.",
    phoneDemo: "Modo demo · sin dinero real",
    phoneTip: "Propina",
    phoneCustom: "Monto personalizado",
    phonePay: "Continuar para pagar",
    footerHost: "travelgratuitygroup.com",
  },
  interest: {
    title: "Registro de interés",
    eyebrow: "Brasil",
    lead: "Estamos reclutando hoteles, agencias de viaje y guías en Brasil.",
    waitlistNote:
      "Esto es una lista de interés — no activa pagos y no es un compromiso de operación. Guardamos sus datos y lo contactamos cuando Brasil esté listo.",
    reviewsHint:
      "Además de las propinas, quienes las reciben podrán acumular reseñas de huéspedes con el tiempo — para mejorar el ranking y hacer el servicio más creíble. Próximamente; todavía no está activo.",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono / WhatsApp",
    country: "País",
    city: "Ciudad",
    role: "Usted es",
    businessName: "Nombre del hotel, agencia o negocio",
    notes: "Notas (opcional)",
    notesHint: "Región, tipo de operación o cuándo prefiere que lo contactemos.",
    submit: "Enviar interés",
    submitting: "Enviando…",
    backHome: "Volver al inicio",
    thanksTitle: "Gracias. Recibimos su interés.",
    thanksBody:
      "Guardamos sus datos en la lista de espera. No activamos pagos ahora. Lo contactaremos cuando las operaciones en Brasil estén listas.",
    thanksAgain: "Enviar otro registro",
    roles: {
      hotel: "Hotel",
      agency: "Agencia de viaje",
      guide: "Guía",
      driver: "Conductor",
      other: "Otro",
    },
    errors: {
      fullName: "Escriba su nombre completo.",
      email: "Escriba un correo válido.",
      phone: "Escriba un teléfono o WhatsApp.",
      country: "Escriba el país.",
      city: "Escriba la ciudad.",
      role: "Elija su rol.",
      businessName: "Escriba el nombre del hotel, agencia o negocio.",
      notes: "Las notas son demasiado largas.",
      rate: "Demasiados intentos. Espere unos minutos e inténtelo de nuevo.",
      save: "No pudimos guardar ahora. Inténtelo de nuevo.",
    },
  },
  meta: {
    homeTitle: "Travel Gratuity Group",
    homeDescription:
      "Propinas sin efectivo para hoteles y guías. Registro de interés en Brasil — sin activar pagos.",
    interestTitle: "Registro de interés",
    interestDescription:
      "Lista de interés de Travel Gratuity Group en Brasil. Sin pagos y sin compromiso de operación.",
  },
};

const it: Messages = {
  brand: "Travel Gratuity Group",
  legalEntity: "GLOBOTIPS LLC",
  header: {
    language: "Lingua",
    hotelLogin: "Accesso hotel",
  },
  home: {
    eyebrow: "Mance senza contanti per hotel e guide",
    heading: "Lo staff perde le mance perché l'ospite non porta contanti.",
    lead: "L'ospite inquadra il QR con la fotocamera e lascia la mancia direttamente alla persona. Nessuna app. Nessun account. Nessun accesso.",
    cost: "Per l'hotel non costa nulla provarlo.",
    ctaInterest: "Registrazione di interesse",
    ctaHow: "Come funziona",
    howEyebrow: "Come funziona",
    howHeading: "Tre passaggi. L'ospite dà la mancia direttamente alla persona.",
    steps: [
      {
        title: "Registra lo staff",
        body: "L'hotel aggiunge le persone. Ognuna riceve un codice mancia univoco.",
      },
      {
        title: "Stampa i QR",
        body: "Scarica un PNG per ogni persona e stampalo al desk, sul badge o nella cartella dell'ospite.",
      },
      {
        title: "L'ospite dà la mancia direttamente",
        body: "L'ospite apre la fotocamera, inquadra e paga chi lo ha assistito. L'hotel non trattiene mai il denaro.",
      },
    ],
    trialHeading: "Gratis per 60 giorni.",
    trialBody:
      "Dopo la prova, circa il 3% viene prelevato dalla mancia. All'ospite non viene addebitato un extra. L'hotel non trattiene le mance.",
    foundersHeading: "Fondatori",
    foundersBody:
      "Travel Gratuity Group è stato fondato da Rosalie Dudkiewicz, cofondatrice con Dariusz Dudkiewicz. L'entità legale è GLOBOTIPS LLC.",
    phoneDemo: "Modalità demo · nessun denaro reale",
    phoneTip: "Mancia",
    phoneCustom: "Importo personalizzato",
    phonePay: "Continua per pagare",
    footerHost: "travelgratuitygroup.com",
  },
  interest: {
    title: "Registrazione di interesse",
    eyebrow: "Brasile",
    lead: "Stiamo reclutando hotel, agenzie di viaggio e guide in Brasile.",
    waitlistNote:
      "Questa è una lista di interesse — non attiva pagamenti e non è un impegno a operare. Conserviamo i tuoi dati e ti contattiamo quando il Brasile sarà pronto.",
    reviewsHint:
      "Oltre alle mance, chi le riceve potrà accumulare recensioni degli ospiti nel tempo — per migliorare il ranking e rendere il servizio più credibile. In arrivo; non è ancora attivo.",
    fullName: "Nome e cognome",
    email: "Email",
    phone: "Telefono / WhatsApp",
    country: "Paese",
    city: "Città",
    role: "Tu sei",
    businessName: "Nome dell'hotel, agenzia o attività",
    notes: "Note (facoltative)",
    notesHint: "Zona, tipo di attività o quando preferisci essere contattato.",
    submit: "Invia interesse",
    submitting: "Invio…",
    backHome: "Torna alla home",
    thanksTitle: "Grazie. Abbiamo ricevuto il tuo interesse.",
    thanksBody:
      "I tuoi dati sono nella lista d'attesa. I pagamenti non vengono attivati ora. Ti contatteremo quando le operazioni in Brasile saranno pronte.",
    thanksAgain: "Invia un'altra registrazione",
    roles: {
      hotel: "Hotel",
      agency: "Agenzia di viaggio",
      guide: "Guida",
      driver: "Autista",
      other: "Altro",
    },
    errors: {
      fullName: "Inserisci nome e cognome.",
      email: "Inserisci un'email valida.",
      phone: "Inserisci un telefono o WhatsApp.",
      country: "Inserisci il paese.",
      city: "Inserisci la città.",
      role: "Scegli il tuo ruolo.",
      businessName: "Inserisci il nome dell'hotel, agenzia o attività.",
      notes: "Le note sono troppo lunghe.",
      rate: "Troppi tentativi. Attendi qualche minuto e riprova.",
      save: "Non è stato possibile salvare ora. Riprova.",
    },
  },
  meta: {
    homeTitle: "Travel Gratuity Group",
    homeDescription:
      "Mance senza contanti per hotel e guide. Registrazione di interesse in Brasile — senza attivare pagamenti.",
    interestTitle: "Registrazione di interesse",
    interestDescription:
      "Lista di interesse Travel Gratuity Group in Brasile. Nessun pagamento e nessun impegno a operare.",
  },
};

const ALL: Record<Locale, Messages> = { pt, en, es, it };

export function getMessages(locale: Locale): Messages {
  return ALL[locale];
}
