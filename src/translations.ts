
export type Language = 'es' | 'en';

export const translations = {
  es: {
    nav: {
      login: "Iniciar Sesión",
      register: "Registrarse",
      live: "En Vivo"
    },
    hero: {
      title: "Crédito en USDT.",
      subtitle: "Liquidez sin vender tus activos.",
      description: "Accede a capital en minutos usando tus criptomonedas como garantía.",
      cta: "Solicitar un préstamo",
      socialProof: "+50,000 Clientes en Latam"
    },
    funds: {
      title: "FONDOS DISPONIBLES HOY",
      subtitle: "Liquidez Institucional"
    },
    metrics: {
      processed: "Procesado",
      countries: "Países",
      approval: "Aprobación",
      support: "Soporte"
    },
    features: {
      fast: "Rápido",
      fastDesc: "Aprobación en minutos",
      secure: "Seguro",
      secureDesc: "Garantía 100% respaldada",
      global: "Global",
      globalDesc: "Disponible en múltiples países"
    },
    onboarding: {
      title: "Registro de Cuenta",
      authTitle: "Comenzar con CrediCryp",
      authSubtitle: "Elegí cómo querés continuar para acceder a tu línea de crédito.",
      createAccount: "Crear cuenta nueva",
      alreadyHaveAccount: "Ya tengo una cuenta",
      loginSubtitle: "Ingresá con tus credenciales para gestionar tu crédito.",
      emailPlaceholder: "tu@email.com",
      passwordPlaceholder: "Tu contraseña",
      confirmPasswordPlaceholder: "Confirmar contraseña",
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
      errorEmailExists: "Este correo ya está registrado.",
      errorDniExists: "Este DNI ya está asociado a otra cuenta.",
      errorWhatsappExists: "Este número de WhatsApp ya está registrado.",
      errorAuth: "Credenciales inválidas. Por favor intentá de nuevo.",
      passwordMismatch: "Las contraseñas no coinciden.",
      passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
      step: "Paso",
      identity: "Identidad",
      contact: "Contacto",
      location: "Ubicación",
      validation: "Validación",
      name: "Nombre",
      lastName: "Apellido",
      dni: "ID / Documento",
      documentType: "Tipo de Identidad",
      documentPlaceholder: "Número de identificación",
      dniOption: "DNI (Documento Nacional)",
      passportOption: "Pasaporte (Internacional)",
      email: "Correo Electrónico",
      whatsapp: "Teléfono WhatsApp",
      country: "País de Residencia",
      selectCountry: "Seleccionar país",
      postalCode: "Código Postal",
      ready: "Datos Listos",
      readyDesc: "Al continuar, aceptas la evaluación de riesgo institucional.",
      veridical: "Confirmas que los datos son verídicos.",
      acceptTerms: "He leído y acepto los",
      terms: "Términos y Condiciones",
      back: "Volver",
      next: "Siguiente",
      confirm: "Confirmar y Analizar",
      finish: "Finalizar y Analizar",
      legal: "He leído y acepto los Términos y Condiciones y la Política de Privacidad."
    },
    assessment: {
      start: "Iniciando verificación...",
      identity: "Verificando identidad...",
      blockchain: "Conectando con nodos blockchain...",
      viability: "Analizando viabilidad financiera...",
      resolution: "Generando resolución final...",
      subtitle: "Análisis institucional en curso"
    },
    result: {
      approved: "¡Crédito Aprobado!",
      approvedDesc: "Tu perfil ha sido validado. Configurá las condiciones de tu financiamiento a continuación.",
      loanAmount: "Monto del Crédito",
      term: "Plazo de Devolución",
      installments: "Cuotas",
      interest: "Costos financieros:",
      summary: "Resumen Financiero",
      capital: "Capital solicitado",
      systemInterest: "Interés del sistema",
      monthlyPayment: "Cuota Mensual",
      cta: "Solicitar Crédito Cripto",
      miPanel: "Mi Panel",
      welcome: "¡Hola {name}!",
      withdrawalConfig: "Configuración de Retiro",
      mandatoryNotice: "AVISO OBLIGATORIO: El depósito del crédito se realizará ÚNICAMENTE a la wallet desde donde abones el depósito de garantía. Sin excepciones.",
      securityNotice: "SEGURIDAD: Si intentas usar una wallet distinta, el sistema bloqueará la operación por protocolos Anti-Fraude.",
      walletLabel: "Tu Dirección de Wallet (USDT BEP20/ERC20)",
      confirmAndActivate: "Confirmar y Activar"
    },
    activation: {
      title: "Activación del Crédito",
      address: "DIRECCIÓN DE DEPÓSITO",
      network: "RED: SMART CHAIN (BEP20)",
      guarantee: "Garantía Requerida (10%)",
      waiting: "Esperando confirmación de red...",
      confirming: "VALIDANDO TRANSACCIÓN...",
      success: "¡DEPÓSITO CONFIRMADO!",
      activating: "Sincronizando smart contract...",
      verify: "Verificar Pago",
      support: "Soporte Chat",
      supportDesc: "Contáctanos vía WhatsApp para atención personalizada e inmediata.",
      whatsappBtn: "Hablar por WhatsApp",
      help: "Ayuda WhatsApp"
    },
    dashboard: {
      limit: "Límite Total",
      available: "Disponible",
      activeLoans: "Créditos Activos",
      nextPayment: "Próximo Vencimiento",
      paymentApproved: "¡Pago Aprobado!",
      paymentApprovedDesc: "Tu cuota ha sido procesada correctamente.",
      payInstallment: "Abonar Cuota",
      history: "Historial de Movimientos",
      approved: "Aprobado",
      payment: "Pago Recibido",
      viewLimit: "Ver mi límite pre-aprobado",
      errorWithdraw: "ERROR: Tu retiro se liberará una vez que la red blockchain confirme el depósito de garantía. Estado actual: En proceso de verificación.",
      statusPending: "PENDIENTE",
      statusActive: "ACTIVO",
      statusAwaiting: "ESPERANDO DEPÓSITO",
      kycTitle: "Verificación de Identidad Nivel 2",
      kycDesc: "Accede a límites de hasta 5,000 USDT validando tu identidad oficial via WhatsApp.",
      kycBtn: "Validar mi cuenta con KYC",
      legalNotice: "© 2026 CrediCryp Systems • Financial Node Central #8842 • Latam Private Banking Group"
    },
    calculator: {
      title: "Calculá tu crédito en segundos",
      subtitle: "Obtén liquidez inmediata usando tus criptomonedas como respaldo, sin necesidad de vender tus activos.",
      loanAmount: "Monto del préstamo",
      collateral: "Garantía requerida",
      ltv: "Ratio LTV",
      cta: "Obtener mi crédito ahora",
      noCreditChecks: "Sin verificación crediticia",
      instantApproval: "Aprobación instantánea",
      noSelling: "Sin vender tus activos"
    },
    live: {
      payment: "Cuota pagada",
      of: "de",
      paid: "abonó",
      approval: "Crédito aprobado",
      received: "recibió"
    },
    benefits: {
      title: "Aprovechá al máximo tu línea de crédito",
      subtitle: "Usá tu crédito de forma inteligente y flexible sin complicaciones",
      benefit1: "Recibí hasta un 2% de cashback en cada compra",
      benefit2: "Comprá sin necesidad de vender tus criptomonedas",
      benefit3: "Accedé a más crédito según tu saldo disponible",
      cta: "Más información"
    },
    finalCta: {
      title: "Impulsamos el futuro de la creación de capital",
      description: "Accedé a crédito de forma inteligente sin vender tus activos. Aprovechá tu capital con total flexibilidad y control.",
      register: "Registrate"
    },
    footerBlock: {
      newsletterTitle: "Enterate de novedades, análisis e informes sobre las últimas tendencias del sector",
      emailPlaceholder: "Ingresa tu email",
      subscribe: "Suscribirse",
      success: "¡Gracias por suscribirte!",
      appTitle: "Próximamente vas a poder descargar la app de CrediCryp en tu dispositivo móvil"
    },
    testimonials: {
      title: "Amado por los usuarios",
      viewMore: "Ver más testimonios",
      viewLess: "Ver menos",
      items: [
        { name: "Carlos M.", handle: "@carlosm_crypto", text: "Excelente plataforma. El proceso fue súper rápido y pude usar mis USDT para una inversión urgente sin vender mis BTC.", avatar: "https://i.pravatar.cc/150?u=carlos" },
        { name: "Sofía R.", handle: "@sofia_invest", text: "La mejor tasa LTV que encontré en el mercado. Muy transparente todo el proceso de garantía.", avatar: "https://i.pravatar.cc/150?u=sofia" },
        { name: "Andrés G.", handle: "@andresfintech", text: "Increíble soporte. Me ayudaron a configurar mi wallet BEP20 en minutos. Recomendado 100%.", avatar: "https://i.pravatar.cc/150?u=andres" },
        { name: "Lucía P.", handle: "@lucia_p", text: "Me salvó en un momento de falta de liquidez. No tuve que vender mis activos a la baja.", avatar: "https://i.pravatar.cc/150?u=lucia" },
        { name: "Mariano T.", handle: "@marianot", text: "Muy intuitivo el dashboard. Los pagos se acreditan al instante.", avatar: "https://i.pravatar.cc/150?u=mariano" },
        { name: "Elena K.", handle: "@elenak_crypto", text: "Uso la línea de crédito para mis gastos diarios y mantengo mi inversión a largo plazo intacta.", avatar: "https://i.pravatar.cc/150?u=elena" },
        { name: "Javier L.", handle: "@javier_l", text: "La seguridad es lo que más me atrajo. Muy robusto el sistema de contratos.", avatar: "https://i.pravatar.cc/150?u=javier" },
        { name: "Marta F.", handle: "@martaf", text: "El sistema de cashback es un plus excelente.", avatar: "https://i.pravatar.cc/150?u=marta" },
        { name: "Ramiro S.", handle: "@ramiros", text: "Rápido, fácil y confiable. Lo que necesitaba Latam.", avatar: "https://i.pravatar.cc/150?u=ramiro" }
      ]
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        { q: "¿Cómo funciona la línea de crédito?", a: "Funciona mediante un depósito de garantía del 10% en USDT. Una vez confirmado, se libera tu línea de crédito para ser retirada a tu wallet." },
        { q: "¿Puedo abrir varias líneas de crédito?", a: "Sí, puedes tener múltiples líneas de crédito activas simultáneamente, siempre que cumplas con los depósitos de garantía correspondientes." },
        { q: "¿Necesito verificación para acceder al crédito?", a: "Para la línea básica no es necesaria verificación KYC profunda, solo el registro inicial. Para límites mayores a 1,500 USDT se requiere KYC Nivel 2." },
        { q: "¿Se pagan impuestos al utilizar el crédito?", a: "Al ser un préstamo respaldado por activos y no una venta, en la mayoría de las jurisdicciones no genera eventos impositivos de ganancia de capital." },
        { q: "¿Qué es el LTV y cómo me afecta?", a: "LTV (Loan-to-Value) es la relación entre el préstamo y tu garantía. Mantenemos un LTV saludable para proteger tus activos de la volatilidad." },
        { q: "¿Puedo modificar mi garantía?", a: "Sí, puedes aumentar tu garantía en cualquier momento para mejorar las condiciones de tu crédito o expandir tu límite personal." },
        { q: "¿Qué es la amortización automática?", a: "Es un sistema que utiliza los rendimientos de tus propios activos para ir cubriendo los intereses de forma pasiva." },
        { q: "¿Cómo realizo pagos de mi crédito?", a: "Puedes realizar pagos parciales o totales de tus cuotas directamente desde el dashboard usando USDT." },
        { q: "¿Cuándo recupero mi garantía?", a: "La garantía se libera íntegramente de forma automática una vez cancelado el capital del crédito solicitado." }
      ]
    }
  },
  en: {
    nav: {
      login: "Login",
      register: "Register",
      live: "Live"
    },
    hero: {
      title: "Credit in USDT.",
      subtitle: "Liquidity without selling assets.",
      description: "Access capital in minutes using your cryptocurrencies as collateral.",
      cta: "Request a Loan",
      socialProof: "+50,000 Clients in Latam"
    },
    funds: {
      title: "FUNDS AVAILABLE TODAY",
      subtitle: "Institutional Liquidity"
    },
    metrics: {
      processed: "Processed",
      countries: "Countries",
      approval: "Approval",
      support: "Support"
    },
    features: {
      fast: "Fast",
      fastDesc: "Approval in minutes",
      secure: "Secure",
      secureDesc: "100% Backed Guarantee",
      global: "Global",
      globalDesc: "Available in multiple countries"
    },
    onboarding: {
      title: "Account Registration",
      authTitle: "Get Started with CrediCryp",
      authSubtitle: "Choose how you want to continue to access your credit line.",
      createAccount: "Create new account",
      alreadyHaveAccount: "I already have an account",
      loginSubtitle: "Sign in with your credentials to manage your credit.",
      emailPlaceholder: "your@email.com",
      passwordPlaceholder: "Your password",
      confirmPasswordPlaceholder: "Confirm password",
      signIn: "Sign In",
      signUp: "Sign Up",
      errorEmailExists: "This email is already registered.",
      errorDniExists: "This ID (DNI) is already associated with another account.",
      errorWhatsappExists: "This WhatsApp number is already registered.",
      errorAuth: "Invalid credentials. Please try again.",
      passwordMismatch: "Passwords do not match.",
      passwordTooShort: "Password must be at least 8 characters long.",
      step: "Step",
      identity: "Identity",
      contact: "Contact",
      location: "Location",
      validation: "Validation",
      name: "First Name",
      lastName: "Last Name",
      dni: "ID / Document",
      documentType: "Identity Type",
      documentPlaceholder: "Identification number",
      dniOption: "DNI (National ID)",
      passportOption: "Passport (International)",
      email: "Email Address",
      whatsapp: "WhatsApp Phone",
      country: "Country of Residence",
      selectCountry: "Select country",
      postalCode: "Postal Code",
      ready: "Data Ready",
      readyDesc: "By continuing, you accept the institutional risk assessment.",
      veridical: "You confirm that the data is truthful.",
      acceptTerms: "I have read and accept the",
      terms: "Terms and Conditions",
      back: "Back",
      next: "Next",
      confirm: "Confirm and Analyze",
      finish: "Finish and Analyze",
      legal: "I have read and accept the Terms and Conditions and the Privacy Policy."
    },
    assessment: {
      start: "Starting verification...",
      identity: "Verifying identity...",
      blockchain: "Connecting to blockchain nodes...",
      viability: "Analyzing financial viability...",
      resolution: "Generating final resolution...",
      subtitle: "Institutional analysis in progress"
    },
    result: {
      approved: "Credit Approved!",
      approvedDesc: "Your profile has been validated. Configure your financing conditions below.",
      loanAmount: "Credit Amount",
      term: "Repayment Term",
      installments: "Installments",
      interest: "Financial costs:",
      summary: "Financial Summary",
      capital: "Requested capital",
      systemInterest: "System interest",
      monthlyPayment: "Monthly Installment",
      cta: "Request Crypto Credit",
      miPanel: "My Dashboard",
      welcome: "Hi {name}!",
      withdrawalConfig: "Withdrawal Setup",
      mandatoryNotice: "MANDATORY NOTICE: The credit deposit will be made ONLY to the wallet from which you pay the security deposit. No exceptions.",
      securityNotice: "SECURITY: If you try to use a different wallet, the system will block the operation due to Anti-Fraud protocols.",
      walletLabel: "Your Wallet Address (USDT BEP20/ERC20)",
      confirmAndActivate: "Confirm and Activate"
    },
    activation: {
      title: "Credit Activation",
      address: "DEPOSIT ADDRESS",
      network: "NETWORK: SMART CHAIN (BEP20)",
      guarantee: "Required Guarantee (10%)",
      waiting: "Waiting for network confirmation...",
      confirming: "VALIDATING TRANSACTION...",
      success: "DEPOSIT CONFIRMED!",
      activating: "Synchronizing smart contract...",
      verify: "Verify Payment",
      support: "Chat Support",
      supportDesc: "Contact us via WhatsApp for personalized and immediate attention.",
      whatsappBtn: "Talk on WhatsApp",
      help: "WhatsApp Help"
    },
    dashboard: {
      limit: "Total Limit",
      available: "Available",
      activeLoans: "Active Credits",
      nextPayment: "Next Maturity",
      paymentApproved: "Payment Approved!",
      paymentApprovedDesc: "Your installment has been processed correctly.",
      payInstallment: "Pay Installment",
      history: "Transaction History",
      approved: "Approved",
      payment: "Payment Received",
      viewLimit: "View my pre-approved limit",
      errorWithdraw: "ERROR: Your withdrawal will be released once the blockchain network confirms the security deposit. Current status: Verification in progress.",
      statusPending: "PENDING",
      statusActive: "ACTIVE",
      statusAwaiting: "AWAITING DEPOSIT",
      kycTitle: "Level 2 Identity Verification",
      kycDesc: "Access limits up to 5,000 USDT by validating your official identity via WhatsApp.",
      kycBtn: "Validate my account with KYC",
      legalNotice: "© 2026 CrediCryp Systems • Financial Node Central #8842 • Latam Private Banking Group"
    },
    calculator: {
      title: "Calculate your credit in seconds",
      subtitle: "Get immediate liquidity using your cryptocurrencies as collateral, without the need to sell your assets.",
      loanAmount: "Loan amount",
      collateral: "Required collateral",
      ltv: "LTV Ratio",
      cta: "Get my credit now",
      noCreditChecks: "No credit checks",
      instantApproval: "Instant approval",
      noSelling: "Without selling assets"
    },
    live: {
      payment: "Installment paid",
      of: "from",
      paid: "paid",
      approval: "Credit approved",
      received: "received"
    },
    benefits: {
      title: "Make the most of your credit line",
      subtitle: "Use your credit intelligently and flexibly without complications",
      benefit1: "Get up to 2% cashback on every purchase",
      benefit2: "Purchase without the need to sell your cryptocurrencies",
      benefit3: "Access more credit according to your available balance",
      cta: "More information"
    },
    finalCta: {
      title: "Driving the future of capital creation",
      description: "Access credit intelligently without selling your assets. Leverage your capital with total flexibility and control.",
      register: "Sign Up"
    },
    footerBlock: {
      newsletterTitle: "Get news, analysis, and reports on the latest industry trends",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      success: "Thank you for subscribing!",
      appTitle: "Coming soon: Download the CrediCryp app on your mobile device"
    },
    testimonials: {
      title: "Loved by users",
      viewMore: "View more testimonials",
      viewLess: "View less",
      items: [
        { name: "Carlos M.", handle: "@carlosm_crypto", text: "Excellent platform. The process was super fast and I could use my USDT for an urgent investment without selling my BTC.", avatar: "https://i.pravatar.cc/150?u=carlos" },
        { name: "Sofía R.", handle: "@sofia_invest", text: "The best LTV rate I found in the market. Very transparent guarantee process.", avatar: "https://i.pravatar.cc/150?u=sofia" },
        { name: "Andrés G.", handle: "@andresfintech", text: "Incredible support. They helped me set up my BEP20 wallet in minutes. 100% recommended.", avatar: "https://i.pravatar.cc/150?u=andres" },
        { name: "Lucía P.", handle: "@lucia_p", text: "It saved me in a moment of lack of liquidity. I didn't have to sell my assets at a loss.", avatar: "https://i.pravatar.cc/150?u=lucia" },
        { name: "Mariano T.", handle: "@marianot", text: "Very intuitive dashboard. Payments are credited instantly.", avatar: "https://i.pravatar.cc/150?u=mariano" },
        { name: "Elena K.", handle: "@elenak_crypto", text: "I use the credit line for my daily expenses and keep my long-term investment intact.", avatar: "https://i.pravatar.cc/150?u=elena" },
        { name: "Javier L.", handle: "@javier_l", text: "The security is what attracted me most. The contract system is very robust.", avatar: "https://i.pravatar.cc/150?u=javier" },
        { name: "Marta F.", handle: "@martaf", text: "The cashback system is an excellent plus.", avatar: "https://i.pravatar.cc/150?u=marta" },
        { name: "Ramiro S.", handle: "@ramiros", text: "Fast, easy, and reliable. What Latam needed.", avatar: "https://i.pravatar.cc/150?u=ramiro" }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        { q: "How does the credit line work?", a: "It works through a 10% safety deposit in USDT. Once confirmed, your credit line is released for withdrawal to your wallet." },
        { q: "Can I open multiple credit lines?", a: "Yes, you can have multiple active credit lines simultaneously, as long as you meet the corresponding security deposits." },
        { q: "Do I need verification to access credit?", a: "Deep KYC verification is not necessary for the basic line, only initial registration. For limits greater than 1,500 USDT, KYC Level 2 is required." },
        { q: "Are taxes paid when using the credit?", a: "Since it is an asset-backed loan and not a sale, in most jurisdictions it does not generate capital gains tax events." },
        { q: "What is LTV and how does it affect me?", a: "LTV (Loan-to-Value) is the ratio between the loan and your collateral. We maintain a healthy LTV to protect your assets from volatility." },
        { q: "Can I modify my guarantee?", a: "Yes, you can increase your guarantee at any time to improve your credit conditions or expand your personal limit." },
        { q: "What is automatic amortization?", a: "It is a system that uses the yields of your own assets to cover interest passively." },
        { q: "How do I make payments on my credit?", a: "You can make partial or full payments of your installments directly from the dashboard using USDT." },
        { q: "When do I get my guarantee back?", a: "The guarantee is fully released automatically once the requested credit capital is cancelled." }
      ]
    }
  }
};
