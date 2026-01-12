import type { Locale } from "./config";

export const translations = {
  en: {
    common: {
      home: "Home",
      products: "Products",
      about: "About",
      contact: "Contact",
      requestPrice: "Request Price",
      requestPriceViaTelegram: "Request Price via Telegram",
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      message: "Message",
      send: "Send",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      create: "Create",
      back: "Back",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      share: "Share",
      copyLink: "Copy Link",
      copied: "Copied!",
      print: "Print",
      subject: "Subject",
      sending: "Sending...",
      nameRequired: "Name is required",
      subjectRequired: "Subject is required",
      messageRequired: "Message is required",
      cooperationRequest: "Cooperation request",
      certificates: "Certificates",
      process: "Process",
      quality: "Quality",
      logistics: "Logistics",
      cases: "Cases",
      terms: "Terms",
      forSuppliers: "For Suppliers",
      contactViaTelegram: "Contact us via Telegram",
      tagline: "Export agricultural products from Uzbekistan",
    },
    about: {
      meta: {
        title: 'About ООО "GoodsIndex" — Export Supplier from Uzbekistan',
        description:
          'ООО "GoodsIndex" is an Uzbekistan-based export supplier for importers and distributors. Learn our approach to quality, documentation, and predictable supply.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Export supplier built for professional buyers",
        subtitle:
          "We work with importers, distributors, and contract buyers. Our focus is clear specifications, export documentation, and predictable execution from request to delivery.",
      },
      proof: {
        trade: {
          title: "B2B-first cooperation",
          description:
            "We organize work around procurement needs: specifications, MOQ, lead time, and commercial terms—without consumer e-commerce patterns.",
        },
        quality: {
          title: "Quality and documents",
          description:
            "Each batch is handled with export-grade requirements in mind. We provide the necessary set of export documents and quality evidence for the shipment.",
        },
        logistics: {
          title: "Logistics-ready workflow",
          description:
            "We coordinate packaging, labeling, and logistics planning to reduce risks and keep delivery expectations clear for both sides.",
        },
      },
      company: {
        title: "Who we are",
        p1:
          'ООО "GoodsIndex" is an export company from Uzbekistan supplying agricultural products for wholesale and contract buyers.',
        p2:
          "We focus on stable quality, transparent communication, and the level of documentation expected in international trade.",
        p3:
          "Our team works across the full cycle: product selection, preparation, packaging, export paperwork, and shipment coordination.",
      },
      values: {
        title: "Principles of work",
        v1: {
          title: "Clarity",
          description:
            "Clear specifications, clear lead times, and clear communication—so your procurement can plan with confidence.",
        },
        v2: {
          title: "Reliability",
          description:
            "Predictable execution and disciplined process control to reduce surprises across production and logistics.",
        },
        v3: {
          title: "Compliance mindset",
          description:
            "Export documentation and quality evidence are treated as part of the product, not an afterthought.",
        },
      },
      howWeWork: {
        title: "How we cooperate",
        s1: {
          title: "Request and specification",
          description:
            "You share the required product parameters and destination. We confirm feasibility and propose the next steps.",
        },
        s2: {
          title: "Quotation and terms",
          description:
            "We provide a commercial proposal and align volume, packaging, delivery terms, and required documents.",
        },
        s3: {
          title: "Execution and delivery",
          description:
            "We coordinate preparation, inspection options, paperwork, and logistics—then keep you updated until delivery.",
        },
      },
      cta: {
        title: "Need a quotation or product specification?",
        subtitle: "Send a request and get a structured response from our team.",
        viewProducts: "View products",
        contact: "Contact",
      },
    },
    certificates: {
      meta: {
        title: 'Certificates & Compliance — ООО "GoodsIndex"',
        description:
          'Export documentation and compliance approach of ООО "GoodsIndex": typical document set, quality evidence, and shipment readiness for B2B buyers.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Documents that professional buyers expect",
        subtitle:
          "In export trade, documentation is part of the supply. We prepare shipments with the required paperwork and provide evidence of quality for the batch.",
      },
      promise: {
        title: "How we work with documents",
        p1:
          "We discuss the required documents at the quotation stage: destination, Incoterms, and buyer requirements.",
        p2:
          "For each shipment we prepare a structured document package and keep it aligned with the contract and logistics scenario.",
      },
      list: {
        docset: {
          title: "Shipment document package",
          description:
            "Commercial and export documents aligned with contract and route (the exact set depends on destination and buyer requirements).",
          note: "The final list is confirmed before shipment.",
        },
        origin: {
          title: "Certificate of Origin",
          description:
            "Origin confirmation for customs and trade procedures (provided when applicable and required for the route).",
        },
        quality: {
          title: "Quality evidence",
          description:
            "Batch-level quality confirmation (format depends on product and requirements; third-party inspection can be discussed).",
        },
        phytosanitary: {
          title: "Phytosanitary documentation",
          description:
            "Documents required for plant products where applicable (based on destination and product category).",
        },
      },
      actions: {
        download: "Download PDF",
        onRequest: "Available on request (we share relevant documents for your route).",
      },
      compliance: {
        title: "Compliance mindset",
        s1: {
          title: "Destination requirements",
          description:
            "We clarify requirements early to avoid rework and delays at the documentation stage.",
        },
        s2: {
          title: "Traceability and batch focus",
          description:
            "Work is organized around batch-level parameters: specifications, packaging, labeling, and documents.",
        },
        s3: {
          title: "Predictable communication",
          description:
            "We keep buyers updated on readiness, paperwork status, and shipment milestones.",
        },
      },
      cta: {
        title: "Need a document list for your destination?",
        subtitle: "Send your destination country and product requirements — we will confirm the relevant paperwork.",
        requestDocs: "Request documents",
        viewProducts: "View products",
      },
    },
    contactPage: {
      meta: {
        title: 'Contact — ООО "GoodsIndex"',
        description:
          'Contact ООО "GoodsIndex" to request a quotation, confirm specifications, or discuss export terms. Multi-channel communication for B2B buyers.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Contact our team",
        subtitle:
          "Send your request with product requirements, destination, and expected volume. We respond during business hours with structured next steps.",
      },
      form: {
        title: "Send a message",
        subtitle: "For quotations, specifications, documents, or cooperation requests.",
        subject: "Subject",
        subjectPlaceholder: "Cooperation request",
        sending: "Sending...",
        send: "Send",
        nameRequired: "Name is required",
        subjectRequired: "Subject is required",
        messageRequired: "Message is required",
        sendFailed: "Failed to send message. Please try again later.",
        success: "Message sent. We will respond during business hours.",
      },
      details: {
        title: "Contacts",
        company: "Company",
        companyValue: 'ООО "GoodsIndex"',
        email: "Email",
        emailValue: "sales@goodsindex.uz",
        phone: "Phone",
        phoneValue: "—",
        messaging: "Messaging",
        messagingValue: "Telegram / WhatsApp (on request)",
      },
      hours: {
        title: "Business hours",
        line1: "Mon–Fri: 09:00–18:00 (Tashkent time, UTC+5)",
        line2: "Sat–Sun: closed",
        line3: "We reply within business hours.",
      },
      location: {
        title: "Location",
        subtitle: "Uzbekistan",
        note: "Exact office / warehouse address is shared during onboarding and contract stage.",
      },
      departments: {
        title: "Departments",
        subtitle: "Write the topic — we route your message to the right team.",
        sales: {
          title: "Sales",
          description: "Quotations, specifications, product list, cooperation.",
        },
        logistics: {
          title: "Logistics",
          description: "Shipping routes, Incoterms, delivery terms, packing details.",
        },
        quality: {
          title: "Quality",
          description: "Quality evidence, inspection options, documentation questions.",
        },
      },
    },
    processPage: {
      meta: {
        title: 'How We Work — ООО "GoodsIndex"',
        description:
          'Transparent B2B export workflow of ООО "GoodsIndex": request, quotation, contract, preparation, documentation, logistics, and delivery.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "A predictable export workflow",
        subtitle:
          "A clear process reduces risks for both sides. We align specifications, documents, and logistics upfront — then execute step by step.",
      },
      overview: {
        title: "What you can expect",
        subtitle: "The workflow is built for professional procurement and international trade.",
        p1: { title: "Structured requests", description: "We collect requirements in a clear format to avoid gaps." },
        p2: { title: "Transparent milestones", description: "You always know the current stage and next step." },
        p3: { title: "Export documentation", description: "Documents are coordinated with route, terms, and product." },
      },
      steps: {
        s1: {
          title: "Request",
          subtitle: "Requirements and destination",
          p1: "You share the product, specifications, destination, and expected volume.",
          p2: "We confirm feasibility and request missing details if needed.",
        },
        s2: {
          title: "Quotation",
          subtitle: "Commercial proposal",
          p1: "We prepare a quotation based on specifications and delivery terms.",
          p2: "We align packaging, labeling, documents, and expected lead time.",
        },
        s3: {
          title: "Terms alignment",
          subtitle: "Incoterms, payment, timeline",
          p1: "We agree on Incoterms, payment method, and shipment schedule.",
          p2: "If needed, we discuss inspection options and sampling.",
        },
        s4: {
          title: "Contract",
          subtitle: "Export-ready paperwork",
          p1: "We finalize contract terms and the required document set.",
          p2: "We confirm responsibilities and the logistics scenario.",
        },
        s5: {
          title: "Preparation",
          subtitle: "Batch, packaging, labeling",
          p1: "We prepare the batch according to the agreed specification.",
          p2: "Packaging and labeling are aligned with destination requirements.",
        },
        s6: {
          title: "Logistics",
          subtitle: "Shipping and tracking",
          p1: "We coordinate loading and transport with logistics partners.",
          p2: "We provide status updates and key shipment milestones.",
        },
        s7: {
          title: "Delivery",
          subtitle: "Receiving and closing",
          p1: "You receive the shipment and confirm acceptance.",
          p2: "We document outcomes and plan next deliveries if needed.",
        },
      },
      requirements: {
        title: "What we need to start",
        subtitle: "A short list helps us respond faster and more accurately.",
        r1: { title: "Product parameters", description: "Variety, grade, packaging, and any special requirements." },
        r2: { title: "Destination", description: "Country/port and preferred Incoterms (if known)." },
        r3: { title: "Volume and timeline", description: "Target quantity and desired delivery window." },
      },
      cta: {
        title: "Ready to send a structured request?",
        subtitle: "Use the contact form — we respond during business hours.",
        request: "Contact us",
        viewProducts: "View products",
      },
    },
    qualityPage: {
      meta: {
        title: 'Quality Assurance — ООО "GoodsIndex"',
        description:
          'Quality and batch control approach of ООО "GoodsIndex": specifications, packaging standards, documentation, and inspection options for B2B export shipments.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Quality is a controlled process",
        subtitle:
          "For professional buyers, quality means consistency, traceability, and documentation. We build quality into the workflow from specification to shipment.",
      },
      system: {
        title: "Quality control structure",
        subtitle: "Key blocks that keep expectations aligned across the supply cycle.",
        s1: { title: "Specification first", description: "We fix product parameters before preparation." },
        s2: { title: "Batch discipline", description: "We work at batch level to keep consistency and traceability." },
        s3: { title: "Evidence and documents", description: "Quality evidence and export documents are prepared per shipment." },
      },
      testing: {
        title: "Testing & verification",
        subtitle: "Options depend on product and buyer requirements.",
        p1: "We align the verification format with the specification and destination requirements.",
        p2: "If needed, independent inspection and sampling can be discussed before shipment.",
        p3: "We keep results and documents consistent with the batch and contract.",
      },
      packaging: {
        title: "Packaging & labeling",
        subtitle: "Packaging is part of export readiness.",
        p1: "We agree packaging type and labeling requirements early in the process.",
        p2: "Marking is aligned with destination requirements and the document set.",
        p3: "We focus on protecting the product and keeping handling predictable in transit.",
      },
      guarantees: {
        title: "How we handle quality issues",
        subtitle: "A clear escalation path is part of trust in B2B.",
        g1: { title: "Pre-shipment alignment", description: "We confirm spec and documents to reduce avoidable risks." },
        g2: { title: "Evidence-based discussion", description: "We work with batch data, photos, and documents." },
        g3: { title: "Corrective actions", description: "We agree next steps to resolve issues within contract terms." },
      },
      cta: {
        title: "Need quality evidence for a specific product?",
        subtitle: "Send your product requirements — we will confirm the relevant documents and verification options.",
        viewDocs: "Certificates",
        contact: "Contact",
      },
    },
    logisticsPage: {
      meta: {
        title: 'Logistics & Shipping — ООО "GoodsIndex"',
        description:
          'Logistics approach of ООО "GoodsIndex": shipping modes, packaging and labeling, documents, and Incoterms alignment for B2B export deliveries.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Logistics-ready exports",
        subtitle:
          "We align packaging, documents, and delivery terms early, then coordinate shipment milestones so buyers can plan confidently.",
      },
      modes: {
        title: "Shipping modes",
        subtitle: "We propose the route based on product, destination, and timeline.",
        m1: { title: "Sea freight", description: "Suitable for large volumes and stable planning windows." },
        m2: { title: "Air freight", description: "Used when lead time is critical and volumes are limited." },
        m3: { title: "Rail / road", description: "Depending on destination and corridor availability." },
      },
      incoterms: {
        title: "Incoterms and responsibilities",
        subtitle: "Clear scope reduces misunderstandings.",
        p1: "We agree Incoterms and responsibility split at the quotation stage.",
        p2: "We keep documents and logistics scenario aligned with the agreed terms.",
        p3: "If you have a preferred forwarder or corridor, we adapt the plan accordingly.",
      },
      docs: {
        title: "Export documents",
        subtitle: "Documentation is coordinated with route and destination.",
        p1: "We confirm required documents based on destination country and product category.",
        p2: "We prepare a structured set aligned with contract and shipment milestones.",
        p3: "See our Certificates page for typical document groups.",
      },
      packaging: {
        title: "Export packaging and labeling",
        subtitle: "Packaging is designed for transit stability and compliance.",
        p1: { title: "Protection", description: "We focus on product protection and stable handling." },
        p2: { title: "Labeling", description: "Labeling is aligned with destination and document set." },
        p3: { title: "Consistency", description: "Packaging requirements are fixed in the specification and contract." },
      },
      cta: {
        title: "Need a route and delivery terms for your destination?",
        subtitle: "Send destination and timeline — we propose a logistics scenario and required documents.",
        contact: "Contact us",
        viewProcess: "How we work",
      },
    },
    casesPage: {
      meta: {
        title: 'Case Studies & References — ООО "GoodsIndex"',
        description:
          'B2B references and case formats of ООО "GoodsIndex": anonymized examples, what we confirm, and how we structure cooperation for buyers.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "References built on predictable execution",
        subtitle:
          "In B2B, trust is earned through process discipline and transparent communication. Below are typical cooperation scenarios and how we present evidence responsibly.",
      },
      note: {
        title: "Important note",
        subtitle: "We do not publish confidential client details without permission.",
        p1: "Some cases are anonymized. We can share more details under NDA or with client approval.",
        p2: "For your procurement, we focus on what can be verified: specification, documents, and delivery milestones.",
      },
      cases: {
        c1: { title: "Bulk supply with stable spec", description: "Contract supply with fixed packaging and consistent batch parameters." },
        c2: { title: "Documentation-driven route", description: "Cooperation where destination paperwork is the key constraint and is aligned upfront." },
        c3: { title: "Time-window shipment", description: "Shipment organized around a fixed delivery window and clear status updates." },
      },
      testimonials: {
        title: "Buyer feedback (format examples)",
        subtitle: "Replace placeholders with real testimonials when available.",
        t1: { quote: "Clear specification, fast communication, and predictable shipment milestones.", author: "Procurement manager, importing company" },
        t2: { quote: "Documents were aligned early, which reduced delays in customs processing.", author: "Logistics coordinator, distributor" },
      },
      cta: {
        title: "Want a reference pack for your destination?",
        subtitle: "We can share a structured list of documents and process milestones for your route.",
        contact: "Contact us",
        viewProducts: "View products",
      },
    },
    termsPage: {
      meta: {
        title: 'Terms of Cooperation — ООО "GoodsIndex"',
        description:
          'Commercial cooperation terms of ООО "GoodsIndex": payment methods, MOQ, delivery planning, claims procedure, and legal notes for B2B export deals.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Transparent cooperation terms",
        subtitle:
          "We discuss terms in a structured way: specification, Incoterms, documents, timeline, and payment — so both sides can plan and execute predictably.",
      },
      disclaimer: {
        title: "Important",
        description:
          "This page describes typical principles. Final terms are fixed in the contract and depend on product, destination, and route.",
      },
      payment: {
        title: "Payment terms",
        subtitle: "Discussed during quotation and contract stage.",
        p1: "Payment method and schedule depend on the deal structure and risk allocation.",
        p2: "We support standard B2B instruments such as bank transfer and L/C (where applicable).",
        p3: "All terms are confirmed in writing before execution.",
      },
      moq: {
        title: "MOQ and volumes",
        subtitle: "Minimum volumes depend on product and packaging.",
        p1: "MOQ is confirmed per product and packaging format.",
        p2: "For regular cooperation, we can align a stable shipment schedule.",
        p3: "For trial orders, we discuss feasible options individually.",
      },
      delivery: {
        title: "Delivery planning",
        subtitle: "Timeline depends on specification and route.",
        p1: "We confirm lead time after specification and document requirements are agreed.",
        p2: "Shipment milestones are shared so you can plan receiving and customs.",
      },
      claims: {
        title: "Claims & quality issues",
        subtitle: "Resolved within contract terms.",
        p1: "We use batch-level evidence: photos, documents, and agreed specification.",
        p2: "We agree corrective actions and next steps in a documented manner.",
      },
      legal: {
        title: "Legal and compliance notes",
        subtitle: "Clear rules reduce misunderstandings.",
        p1: "Contract defines jurisdiction, responsibilities, and dispute resolution.",
        p2: "Confidential information can be protected under NDA where needed.",
      },
      cta: {
        title: "Want to discuss terms for your destination?",
        subtitle: "Send your destination and product requirements — we will propose a structured offer.",
        contact: "Contact us",
        viewProcess: "How we work",
      },
    },
    home: {
      title: "Export Quality Agricultural Products from Uzbekistan",
      titleLine1: "Premium Export",
      titleLine2: "from Uzbekistan",
      subtitle: "Wholesale supply for importers, distributors, and contract buyers",
      cta: "Explore Products",
      becomeSupplier: "Become a Supplier",
      scroll: "Scroll",
      trust: "Trusted Export Supplier",
      quality: "Export-Grade Quality",
      logistics: "Logistics Ready",
      proof: {
        origin: "Origin",
        originValue: "Uzbekistan",
        moq: "Min. Order",
        moqValue: "From 1 ton",
        certificates: "Certificates",
        certificatesValue: "ISO, HACCP",
        delivery: "Delivery",
        deliveryValue: "Worldwide",
        quality: "Quality",
        qualityValue: "Export Grade",
      },
      stats: {
        years: "Years in Market",
        tons: "Tons Exported",
        countries: "Countries",
        clients: "Clients",
      },
      categories: {
        title: "Product Categories",
        subtitle: "Explore our wide range of export-quality agricultural products",
      },
      origin: {
        title: "From the Heart of Central Asia",
        description: "Uzbekistan's unique climate and fertile soil create ideal conditions for growing premium agricultural products. Our products are sourced directly from local farms and processed to meet international export standards.",
        climate: {
          title: "Ideal Climate",
          description: "300+ sunny days per year and optimal temperature ranges ensure the highest quality produce.",
        },
        quality: {
          title: "Premium Quality",
          description: "Traditional farming methods combined with modern processing techniques guarantee export-grade quality.",
        },
        region: {
          title: "Strategic Location",
          description: "Located in Central Asia, Uzbekistan offers excellent logistics connections to Europe, Asia, and the Middle East.",
        },
      },
      featured: {
        badge: "Featured",
        title: "Featured Products",
        subtitle: "Our most popular export products",
        requestPrice: "Request Price",
        viewAll: "View All Products",
      },
      benefits: {
        badge: "Why Choose Us",
        title: "Why Choose Us",
        subtitle: "What sets us apart as your trusted export partner",
        quality: {
          title: "Export-Grade Quality",
          description: "All products meet international quality standards and export requirements.",
        },
        direct: {
          title: "Direct Supply",
          description: "Work directly with the source, eliminating middlemen and ensuring competitive pricing.",
        },
        packaging: {
          title: "Flexible Packaging",
          description: "Custom packaging options to meet your specific requirements and market needs.",
        },
        support: {
          title: "Dedicated Support",
          description: "Personal manager for each client, providing full support throughout the process.",
        },
        standards: {
          title: "Certified Standards",
          description: "Compliance with international certifications and quality assurance programs.",
        },
        logistics: {
          title: "Logistics Ready",
          description: "Full export documentation and logistics support for seamless international shipping.",
        },
      },
      process: {
        badge: "How It Works",
        title: "How It Works",
        subtitle: "Simple and transparent process for international buyers",
        step1: "Step 1",
        step1Title: "Request Price",
        step1Description: "Submit your inquiry through our form or contact us directly via Telegram, WhatsApp, or email.",
        step2: "Step 2",
        step2Title: "Discuss Terms",
        step2Description: "Our manager will contact you to discuss quantities, specifications, pricing, and delivery terms.",
        step3: "Step 3",
        step3Title: "Sign Contract",
        step3Description: "Once terms are agreed, we prepare and sign the export contract with all necessary documentation.",
        step4: "Step 4",
        step4Title: "Delivery",
        step4Description: "We handle all logistics, documentation, and ensure timely delivery to your destination.",
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Common questions from our B2B clients",
        moq: {
          question: "What is the minimum order quantity?",
          answer: "Minimum order quantities vary by product. Please contact us with your requirements, and we will provide specific MOQ information for each product.",
        },
        payment: {
          question: "What payment methods do you accept?",
          answer: "We accept various payment methods including bank transfers, letters of credit (L/C), and other secure payment options. Payment terms are discussed during contract negotiations.",
        },
        delivery: {
          question: "What are the delivery times?",
          answer: "Delivery times depend on the product, quantity, and destination. Typically, orders are processed within 2-4 weeks after contract signing. We provide detailed delivery schedules during the quotation process.",
        },
        quality: {
          question: "How do you ensure product quality?",
          answer: "All products undergo strict quality control and meet international export standards. We provide quality certificates and can arrange third-party inspections if required.",
        },
        samples: {
          question: "Can I request product samples?",
          answer: "Yes, we can provide samples for evaluation. Please contact us with your sample requirements, and we will arrange shipment.",
        },
        contract: {
          question: "Какую документацию вы предоставляете?",
          answer: "Мы предоставляем всю необходимую экспортную документацию, включая сертификаты происхождения, сертификаты качества, фитосанитарные сертификаты, коммерческие счета-фактуры и транспортные документы.",
        },
      },
      finalCta: {
        badge: "Ready to Export",
        title: "Ready to Start Cooperation?",
        subtitle: "Contact us today to discuss your requirements and get a competitive quote",
        viewProducts: "View Products",
        contactUs: "Contact Us",
      },
    },
    products: {
      title: "Our Products",
      allCategories: "All Categories",
      noProducts: "No products found",
      viewDetails: "View Details",
      category: "Category",
      variety: "Variety",
      origin: "Origin",
      packaging: "Packaging Options",
      moq: "Minimum Order Quantity",
      shelfLife: "Shelf Life",
      exportReadiness: "Export Readiness",
      relatedProducts: "Related Products",
      relatedProductsDescription: "Other products from the same category",
      hsCode: "HS Code",
      grade: "Grade",
      originPlace: "Origin Place",
      calibers: "Calibers",
      processingMethod: "Processing Method",
      description: "Description",
      copyHsCode: "Copy HS Code",
      hsCodeCopied: "HS Code copied!",
    },
    inquiry: {
      title: "Request Price",
      subtitle: "Fill out the form below or contact us via Telegram",
      success: "Your inquiry has been sent successfully",
      error: "Failed to send inquiry. Please try again.",
      contactManager: "Contact Manager",
      chooseContactMethod: "Choose your preferred contact method",
      contactViaTelegram: "Contact via Telegram",
      contactViaWhatsApp: "Contact via WhatsApp",
      contactViaEmail: "Contact via Email",
      contactViaPhone: "Contact via Phone",
      copyEmail: "Copy Email",
      copyPhone: "Copy Phone",
      emailCopied: "Email copied!",
      phoneCopied: "Phone copied!",
      sendEmail: "Send Email",
      callPhone: "Call",
    },
    submission: {
      title: "Become a Supplier",
      subtitle: "Submit your product for sale through our platform",
      step1: "Product Information",
      step2: "Contact Information",
      productNameRu: "Product Name (Russian) *",
      productNameEn: "Product Name (English) *",
      category: "Category *",
      descriptionRu: "Description (Russian)",
      descriptionEn: "Description (English)",
      hsCode: "HS Code",
      gradeRu: "Grade (Russian)",
      gradeEn: "Grade (English)",
      originPlaceRu: "Origin Place (Russian)",
      originPlaceEn: "Origin Place (English)",
      processingMethodRu: "Processing Method (Russian)",
      processingMethodEn: "Processing Method (English)",
      moq: "MOQ (Minimum Order Quantity)",
      shelfLife: "Shelf Life",
      exportReadiness: "Export Readiness",
      packagingOptions: "Packaging Options (one per line)",
      calibers: "Calibers",
      supplierName: "Your Name *",
      supplierPhone: "Phone Number *",
      phoneHint: "We'll contact you via WhatsApp/Telegram",
      phoneExample: "Example: +998 90 123 45 67",
      phoneInvalid: "Invalid phone format. Use: +998 XX XXX XX XX",
      additionalDetails: "Additional Product Details (Optional)",
      images: "Product Images (optional)",
      imagesDescription: "Upload high-quality images of your product",
      certificates: "Certificates and Documents (up to 3 PDF files)",
      certificatesDescription: "Upload quality certificates, export documents, etc.",
      submit: "Submit Product",
      submitting: "Submitting...",
      success: "Your submission has been received and will be reviewed within 2-3 business days.",
      error: "Failed to submit product. Please try again.",
      whatHappensNext: "What happens after submission?",
      confirmation: "You'll receive a confirmation that we received your submission",
      review: "Our team will review your submission within 2-3 business days",
      notification: "You'll receive a notification about the moderation status (approved/rejected)",
      autoAdd: "If approved, your product will be automatically added to the catalog",
      simpleProcess: "Simple Process",
      simpleProcessDesc: "Fill out the form with your product information. We'll review your submission within 2-3 business days.",
      quickReview: "Quick Review",
      quickReviewDesc: "Our team will verify quality and export standards compliance before publishing.",
      globalReach: "Global Reach",
      globalReachDesc: "Your product will be available to international buyers and distributors.",
      successTitle: "Submission Received!",
      successSubtitle: "Your request is being processed",
      currentStatus: "Current Status",
      whatNext: "What's next?",
      nextStep1: "Quality check and export standards verification",
      nextStep2: "Review of technical specifications and documentation",
      nextStep3: "Contact from our manager via phone/WhatsApp/Telegram",
      saveLink: "Save this link to check status later",
      backToHome: "Back to Homepage",
      submitAnother: "Submit Another Product",
      statusPending: "Pending Review",
      statusApproved: "Approved",
      statusRejected: "Rejected",
      statusRevision: "Needs Revision",
      statusPendingDesc: "Our team is currently reviewing your product specifications and images.",
      statusApprovedDesc: "Congratulations! Your product has been approved and added to our catalog.",
      statusRejectedDesc: "Unfortunately, your submission was not approved at this time.",
      statusRevisionDesc: "Your submission requires some changes before it can be approved.",
      rejectionReason: "Reason:",
    },
    footer: {
      categories: {
        nuts: "Nuts",
        legumes: "Legumes",
        driedFruits: "Dried Fruits",
      },
    },
  },
  ru: {
    common: {
      home: "Главная",
      products: "Товары",
      about: "О нас",
      contact: "Контакты",
      requestPrice: "Запросить цену",
      requestPriceViaTelegram: "Запросить цену через Telegram",
      name: "Имя",
      email: "Email",
      phone: "Телефон",
      company: "Компания",
      message: "Сообщение",
      send: "Отправить",
      cancel: "Отмена",
      save: "Сохранить",
      edit: "Редактировать",
      delete: "Удалить",
      create: "Создать",
      back: "Назад",
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успешно",
      share: "Поделиться",
      copyLink: "Копировать ссылку",
      copied: "Скопировано!",
      print: "Печать",
      subject: "Тема",
      sending: "Отправка...",
      nameRequired: "Укажите имя",
      subjectRequired: "Укажите тему",
      messageRequired: "Укажите сообщение",
      cooperationRequest: "Запрос сотрудничества",
      certificates: "Сертификаты",
      process: "Процесс",
      quality: "Качество",
      logistics: "Логистика",
      cases: "Кейсы",
      terms: "Условия",
      forSuppliers: "Для поставщиков",
      contactViaTelegram: "Свяжитесь с нами через Telegram",
      tagline: "Экспортные сельскохозяйственные продукты из Узбекистана",
    },
    about: {
      meta: {
        title: 'О компании ООО "GoodsIndex" — экспортный поставщик из Узбекистана',
        description:
          'ООО "GoodsIndex" — экспортная компания из Узбекистана для импортеров и дистрибьюторов. Подход к качеству, документам и предсказуемым поставкам.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Экспортные поставки, ориентированные на B2B закупки",
        subtitle:
          "Мы работаем с импортерами, дистрибьюторами и контрактными покупателями. Фокус — спецификации, экспортные документы и предсказуемое исполнение от запроса до отгрузки.",
      },
      proof: {
        trade: {
          title: "B2B‑подход",
          description:
            "Работа выстроена под задачи закупки: требования к товару, MOQ, сроки, условия. Без розничных сценариев и «корзины».",
        },
        quality: {
          title: "Качество и документы",
          description:
            "Каждая партия готовится с учетом экспортных требований. Мы обеспечиваем комплект экспортной документации и подтверждения качества по поставке.",
        },
        logistics: {
          title: "Готовность к логистике",
          description:
            "Согласуем упаковку, маркировку и логистический план заранее, чтобы снизить риски и держать сроки прозрачными для обеих сторон.",
        },
      },
      company: {
        title: "Кто мы",
        p1:
          'ООО "GoodsIndex" — экспортная компания из Узбекистана, специализирующаяся на оптовых и контрактных поставках сельскохозяйственной продукции.',
        p2:
          "Мы делаем упор на стабильное качество, прозрачную коммуникацию и уровень документирования, который ожидают профессиональные покупатели в международной торговле.",
        p3:
          "Команда сопровождает полный цикл: подбор позиции, подготовка партии, упаковка, экспортные документы и координация отгрузки.",
      },
      values: {
        title: "Принципы работы",
        v1: {
          title: "Понятность",
          description:
            "Четкие спецификации, сроки и коммуникация — чтобы закупка могла планировать без неопределенности.",
        },
        v2: {
          title: "Надежность",
          description:
            "Дисциплина процессов и предсказуемое исполнение, снижающие риски на производстве и в логистике.",
        },
        v3: {
          title: "Комплаенс‑мышление",
          description:
            "Экспортная документация и подтверждения качества — часть продукта, а не формальность в конце.",
        },
      },
      howWeWork: {
        title: "Как выстроено сотрудничество",
        s1: {
          title: "Запрос и спецификация",
          description:
            "Вы описываете требования к продукту и страну назначения. Мы подтверждаем возможности и предлагаем следующий шаг.",
        },
        s2: {
          title: "Коммерческое предложение и условия",
          description:
            "Готовим предложение и согласуем объем, упаковку, условия поставки и набор документов.",
        },
        s3: {
          title: "Исполнение и поставка",
          description:
            "Координируем подготовку партии, опции инспекции, документы и логистику — и информируем вас до получения груза.",
        },
      },
      cta: {
        title: "Нужны спецификация или коммерческое предложение?",
        subtitle: "Отправьте запрос — мы вернемся с структурированным ответом.",
        viewProducts: "Посмотреть товары",
        contact: "Контакты",
      },
    },
    certificates: {
      meta: {
        title: 'Сертификаты и соответствие — ООО "GoodsIndex"',
        description:
          'Экспортная документация и подход к соответствию ООО "GoodsIndex": типовой комплект документов, подтверждения качества и готовность поставки для B2B покупателей.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Документы, которые ожидают профессиональные покупатели",
        subtitle:
          "В экспортной торговле документы — часть поставки. Мы готовим отгрузку с нужным комплектом и даем подтверждения качества по партии.",
      },
      promise: {
        title: "Как мы работаем с документами",
        p1:
          "Уточняем требования по документам на этапе запроса/квоты: страна назначения, Incoterms, требования покупателя.",
        p2:
          "По каждой отгрузке формируем структурированный пакет документов и согласуем его с контрактом и логистическим сценарием.",
      },
      list: {
        docset: {
          title: "Пакет документов по отгрузке",
          description:
            "Коммерческие и экспортные документы, согласованные с контрактом и маршрутом (точный состав зависит от страны назначения и требований покупателя).",
          note: "Финальный список подтверждаем до отгрузки.",
        },
        origin: {
          title: "Сертификат происхождения",
          description:
            "Подтверждение происхождения для таможенных и торговых процедур (предоставляется при необходимости и применимости).",
        },
        quality: {
          title: "Подтверждения качества",
          description:
            "Подтверждение качества по конкретной партии (формат зависит от продукта и требований; возможна независимая инспекция по согласованию).",
        },
        phytosanitary: {
          title: "Фитосанитарные документы",
          description:
            "Документы для растительной продукции, где это требуется (зависит от страны назначения и категории товара).",
        },
      },
      actions: {
        download: "Скачать PDF",
        onRequest: "По запросу (передадим релевантные документы под ваш маршрут).",
      },
      compliance: {
        title: "Подход к соответствию",
        s1: {
          title: "Требования страны назначения",
          description:
            "Уточняем требования заранее, чтобы избежать доработок и задержек на этапе оформления документов.",
        },
        s2: {
          title: "Трассируемость и фокус на партии",
          description:
            "Работа строится вокруг параметров партии: спецификация, упаковка, маркировка и документы.",
        },
        s3: {
          title: "Прозрачная коммуникация",
          description:
            "Даем статус готовности, прогресс по документам и ключевые этапы отгрузки.",
        },
      },
      cta: {
        title: "Нужен список документов под вашу страну назначения?",
        subtitle:
          "Напишите страну назначения и требования к продукту — подтвердим релевантный пакет документов.",
        requestDocs: "Запросить документы",
        viewProducts: "Посмотреть товары",
      },
    },
    contactPage: {
      meta: {
        title: 'Контакты — ООО "GoodsIndex"',
        description:
          'Свяжитесь с ООО "GoodsIndex" для запроса цены, подтверждения спецификаций и обсуждения условий экспорта. Несколько каналов связи для B2B покупателей.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Свяжитесь с нашей командой",
        subtitle:
          "Опишите требования к продукту, страну назначения и ориентировочный объем. Мы ответим в рабочее время и предложим структурированный следующий шаг.",
      },
      form: {
        title: "Отправить сообщение",
        subtitle: "Для коммерческого предложения, спецификаций, документов или сотрудничества.",
        subject: "Тема",
        subjectPlaceholder: "Запрос сотрудничества",
        sending: "Отправка...",
        send: "Отправить",
        nameRequired: "Укажите имя",
        subjectRequired: "Укажите тему",
        messageRequired: "Укажите сообщение",
        sendFailed: "Не удалось отправить сообщение. Попробуйте позже.",
        success: "Сообщение отправлено. Мы вернемся с ответом в рабочее время.",
      },
      details: {
        title: "Контакты",
        company: "Компания",
        companyValue: 'ООО "GoodsIndex"',
        email: "Email",
        emailValue: "sales@goodsindex.uz",
        phone: "Телефон",
        phoneValue: "—",
        messaging: "Мессенджеры",
        messagingValue: "Telegram / WhatsApp (по запросу)",
      },
      hours: {
        title: "Часы работы",
        line1: "Пн–Пт: 09:00–18:00 (Ташкент, UTC+5)",
        line2: "Сб–Вс: выходной",
        line3: "Отвечаем в рабочее время.",
      },
      location: {
        title: "Локация",
        subtitle: "Узбекистан",
        note: "Точный адрес офиса/склада сообщаем на этапе согласования и оформления документов.",
      },
      departments: {
        title: "Отделы",
        subtitle: "Укажите тему — мы направим сообщение нужной команде.",
        sales: {
          title: "Продажи",
          description: "Квоты, спецификации, список продуктов, условия сотрудничества.",
        },
        logistics: {
          title: "Логистика",
          description: "Маршруты, Incoterms, сроки, упаковка и маркировка.",
        },
        quality: {
          title: "Качество",
          description: "Подтверждения качества, инспекции, вопросы по документам.",
        },
      },
    },
    processPage: {
      meta: {
        title: 'Процесс работы — ООО "GoodsIndex"',
        description:
          'Прозрачный B2B процесс экспорта ООО "GoodsIndex": запрос, квота, контракт, подготовка партии, документы, логистика и поставка.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Предсказуемый процесс экспортной поставки",
        subtitle:
          "Понятный процесс снижает риски для обеих сторон. Мы заранее согласуем спецификации, документы и логистику — затем выполняем шаг за шагом.",
      },
      overview: {
        title: "Что вы получаете",
        subtitle: "Процесс выстроен под профессиональные закупки и международную торговлю.",
        p1: { title: "Структурированный запрос", description: "Собираем требования в понятном формате без пробелов." },
        p2: { title: "Прозрачные этапы", description: "Вы всегда знаете текущий статус и следующий шаг." },
        p3: { title: "Экспортные документы", description: "Документы согласуются с маршрутом, условиями и продуктом." },
      },
      steps: {
        s1: {
          title: "Запрос",
          subtitle: "Требования и страна назначения",
          p1: "Вы передаете позицию, спецификации, страну назначения и ориентировочный объем.",
          p2: "Мы подтверждаем возможности и уточняем недостающие детали при необходимости.",
        },
        s2: {
          title: "Квота",
          subtitle: "Коммерческое предложение",
          p1: "Готовим квоту на основе спецификаций и условий поставки.",
          p2: "Согласуем упаковку, маркировку, документы и ориентировочные сроки.",
        },
        s3: {
          title: "Согласование условий",
          subtitle: "Incoterms, оплата, график",
          p1: "Согласуем Incoterms, вариант оплаты и график отгрузки.",
          p2: "При необходимости обсуждаем инспекцию и образцы.",
        },
        s4: {
          title: "Контракт",
          subtitle: "Документы под экспорт",
          p1: "Фиксируем условия договора и перечень требуемых документов.",
          p2: "Подтверждаем зоны ответственности и логистический сценарий.",
        },
        s5: {
          title: "Подготовка партии",
          subtitle: "Партия, упаковка, маркировка",
          p1: "Готовим партию по согласованной спецификации.",
          p2: "Упаковка и маркировка учитывают требования страны назначения.",
        },
        s6: {
          title: "Логистика",
          subtitle: "Отгрузка и контроль статуса",
          p1: "Координируем погрузку и транспорт с логистическими партнерами.",
          p2: "Даем статус и ключевые этапы движения груза.",
        },
        s7: {
          title: "Поставка",
          subtitle: "Получение и закрытие",
          p1: "Вы принимаете груз и подтверждаете получение.",
          p2: "Фиксируем результаты и планируем следующие поставки при необходимости.",
        },
      },
      requirements: {
        title: "Что нужно для старта",
        subtitle: "Короткий список данных ускоряет ответ и повышает точность.",
        r1: { title: "Параметры продукта", description: "Сорт/класс, упаковка и особые требования." },
        r2: { title: "Страна назначения", description: "Страна/порт и желаемые Incoterms (если известны)." },
        r3: { title: "Объем и сроки", description: "Ориентировочное количество и желаемое окно поставки." },
      },
      cta: {
        title: "Готовы отправить структурированный запрос?",
        subtitle: "Используйте форму контакта — отвечаем в рабочее время.",
        request: "Связаться",
        viewProducts: "Посмотреть товары",
      },
    },
    qualityPage: {
      meta: {
        title: 'Качество и контроль — ООО "GoodsIndex"',
        description:
          'Подход ООО "GoodsIndex" к качеству: спецификации, контроль партии, стандарты упаковки, документы и опции инспекции для B2B экспортных отгрузок.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Качество — это управляемый процесс",
        subtitle:
          "Для профессионального покупателя качество — это стабильность, трассируемость и документы. Мы закладываем качество в процесс от спецификации до отгрузки.",
      },
      system: {
        title: "Как устроен контроль качества",
        subtitle: "Блоки, которые держат ожидания синхронизированными на всем цикле поставки.",
        s1: { title: "Сначала спецификация", description: "Фиксируем параметры продукта до подготовки партии." },
        s2: { title: "Фокус на партии", description: "Работаем по партиям для стабильности и трассируемости." },
        s3: { title: "Документы и подтверждения", description: "Готовим подтверждения качества и документы под конкретную отгрузку." },
      },
      testing: {
        title: "Проверки и верификация",
        subtitle: "Формат зависит от продукта и требований покупателя.",
        p1: "Согласуем формат подтверждений с спецификацией и требованиями страны назначения.",
        p2: "При необходимости заранее обсуждаем независимую инспекцию и отбор образцов.",
        p3: "Держим результаты и документы привязанными к партии и контракту.",
      },
      packaging: {
        title: "Упаковка и маркировка",
        subtitle: "Упаковка — часть экспортной готовности.",
        p1: "Согласуем тип упаковки и требования к маркировке на раннем этапе.",
        p2: "Маркировка соответствует требованиям страны назначения и перечню документов.",
        p3: "Цель — защитить продукт и обеспечить предсказуемую обработку в пути.",
      },
      guarantees: {
        title: "Как решаем вопросы по качеству",
        subtitle: "Прозрачный порядок действий — часть доверия в B2B.",
        g1: { title: "Согласование до отгрузки", description: "Подтверждаем спецификацию и документы, снижая риски." },
        g2: { title: "Разбор по фактам", description: "Опираемся на данные по партии, фото и документы." },
        g3: { title: "Корректирующие действия", description: "Согласуем шаги решения в рамках условий контракта." },
      },
      cta: {
        title: "Нужны подтверждения качества под конкретный продукт?",
        subtitle: "Опишите требования — подтвердим релевантные документы и опции верификации.",
        viewDocs: "Сертификаты",
        contact: "Контакты",
      },
    },
    logisticsPage: {
      meta: {
        title: 'Логистика и доставка — ООО "GoodsIndex"',
        description:
          'Логистический подход ООО "GoodsIndex": варианты доставки, упаковка и маркировка, документы и Incoterms для B2B экспортных поставок.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Экспорт, готовый к логистике",
        subtitle:
          "Заранее согласуем упаковку, документы и условия поставки — затем сопровождаем ключевые этапы отгрузки, чтобы закупка могла планировать уверенно.",
      },
      modes: {
        title: "Варианты доставки",
        subtitle: "Маршрут предлагаем исходя из продукта, страны назначения и сроков.",
        m1: { title: "Морская доставка", description: "Подходит для крупных объемов и плановых поставок." },
        m2: { title: "Авиадоставка", description: "Используется, когда критичны сроки и объем ограничен." },
        m3: { title: "Ж/д / авто", description: "В зависимости от коридора и доступности маршрута." },
      },
      incoterms: {
        title: "Incoterms и ответственность сторон",
        subtitle: "Понятные границы — меньше рисков.",
        p1: "Согласуем Incoterms и распределение ответственности на этапе квоты.",
        p2: "Держим документы и логистический сценарий в соответствии с выбранными условиями.",
        p3: "Если у вас есть предпочтительный экспедитор или коридор — адаптируем план.",
      },
      docs: {
        title: "Экспортные документы",
        subtitle: "Документы согласуются с маршрутом и страной назначения.",
        p1: "Подтверждаем требования по документам под страну назначения и категорию продукта.",
        p2: "Готовим структурированный комплект в связке с контрактом и этапами отгрузки.",
        p3: "Типовые группы документов — на странице «Сертификаты».",
      },
      packaging: {
        title: "Экспортная упаковка и маркировка",
        subtitle: "Упаковка проектируется под стабильность в пути и соответствие требованиям.",
        p1: { title: "Защита", description: "Фокус на сохранности и предсказуемой обработке груза." },
        p2: { title: "Маркировка", description: "Маркировка согласуется со страной назначения и документами." },
        p3: { title: "Стабильность", description: "Требования к упаковке фиксируются в спецификации и контракте." },
      },
      cta: {
        title: "Нужен маршрут и условия доставки под вашу страну назначения?",
        subtitle: "Напишите страну назначения и сроки — предложим логистический сценарий и перечень документов.",
        contact: "Связаться",
        viewProcess: "Процесс работы",
      },
    },
    casesPage: {
      meta: {
        title: 'Кейсы и отзывы — ООО "GoodsIndex"',
        description:
          'Референсы и форматы кейсов ООО "GoodsIndex": типовые сценарии, что можно подтвердить, и как мы структурируем сотрудничество с B2B покупателями.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Доверие, построенное на предсказуемом исполнении",
        subtitle:
          "В B2B доверие формируется через дисциплину процессов и прозрачную коммуникацию. Ниже — типовые сценарии сотрудничества и корректная подача референсов.",
      },
      note: {
        title: "Важное уточнение",
        subtitle: "Мы не публикуем конфиденциальные данные клиентов без разрешения.",
        p1: "Часть кейсов может быть обезличена. Детали предоставляем по NDA или с согласия клиента.",
        p2: "Для закупки важны проверяемые вещи: спецификация, документы и этапы поставки.",
      },
      cases: {
        c1: { title: "Оптовая поставка со стабильной спецификацией", description: "Контрактная поставка с фиксированной упаковкой и параметрами партии." },
        c2: { title: "Маршрут с фокусом на документы", description: "Сценарий, где ключевым ограничением является перечень документов страны назначения — согласуем заранее." },
        c3: { title: "Отгрузка под окно поставки", description: "Поставка, организованная под заданное окно и регулярные статус‑обновления." },
      },
      testimonials: {
        title: "Отзывы (шаблоны формата)",
        subtitle: "Замените плейсхолдеры реальными отзывами при наличии.",
        t1: { quote: "Четкая спецификация, быстрая коммуникация и предсказуемые этапы отгрузки.", author: "Руководитель закупок, импортирующая компания" },
        t2: { quote: "Документы согласовали заранее — это снизило задержки на таможне.", author: "Координатор логистики, дистрибьютор" },
      },
      cta: {
        title: "Нужен референс‑пакет под вашу страну назначения?",
        subtitle: "Можем передать структурированный перечень документов и этапов под ваш маршрут.",
        contact: "Связаться",
        viewProducts: "Посмотреть товары",
      },
    },
    termsPage: {
      meta: {
        title: 'Условия сотрудничества — ООО "GoodsIndex"',
        description:
          'Коммерческие условия сотрудничества ООО "GoodsIndex": варианты оплаты, MOQ, планирование поставки, порядок рекламаций и юридические заметки для B2B экспортных сделок.',
      },
      hero: {
        badge: 'ООО "GoodsIndex"',
        title: "Прозрачные условия сотрудничества",
        subtitle:
          "Условия обсуждаем структурировано: спецификация, Incoterms, документы, сроки и оплата — чтобы обе стороны могли планировать и выполнять поставку предсказуемо.",
      },
      disclaimer: {
        title: "Важно",
        description:
          "На странице описаны типовые принципы. Финальные условия фиксируются в контракте и зависят от продукта, страны назначения и маршрута.",
      },
      payment: {
        title: "Оплата",
        subtitle: "Согласуется на этапе квоты и контракта.",
        p1: "Способ оплаты и график зависят от структуры сделки и распределения рисков.",
        p2: "Работаем со стандартными B2B инструментами: банковский перевод, аккредитив (при применимости).",
        p3: "Все условия подтверждаем письменно до начала исполнения.",
      },
      moq: {
        title: "MOQ и объемы",
        subtitle: "Минимальные объемы зависят от продукта и упаковки.",
        p1: "MOQ является подтверждением каждой позиции и формату упаковки.",
        p2: "Для регулярного сотрудничества согласуем стабильный график отгрузок.",
        p3: "Для пробных партий обсуждаем варианты индивидуально.",
      },
      delivery: {
        title: "Планирование поставки",
        subtitle: "Сроки зависят от спецификации и маршрута.",
        p1: "Срок подтверждаем после согласования спецификации и требований по документам.",
        p2: "Даем этапы отгрузки, чтобы вы могли планировать приемку и таможню.",
      },
      claims: {
        title: "Рекламации и вопросы качества",
        subtitle: "Решаем в рамках условий контракта.",
        p1: "Опираемся на подтверждения по партии: фото, документы и согласованную спецификацию.",
        p2: "Фиксируем корректирующие действия и следующие шаги документально.",
      },
      legal: {
        title: "Юридические и комплаенс‑заметки",
        subtitle: "Понятные правила снижают риски недопонимания.",
        p1: "Контракт определяет юрисдикцию, ответственность и порядок разрешения споров.",
        p2: "Конфиденциальность можем оформить через NDA при необходимости.",
      },
      cta: {
        title: "Хотите обсудить условия под вашу страну назначения?",
        subtitle: "Напишите страну назначения и требования к продукту — предложим структурированное предложение.",
        contact: "Связаться",
        viewProcess: "Процесс работы",
      },
    },
    home: {
      title: "Экспортные сельскохозяйственные продукты из Узбекистана",
      titleLine1: "Премиальный экспорт",
      titleLine2: "из Узбекистана",
      subtitle: "Оптовые поставки для импортеров, дистрибьюторов и контрактных покупателей",
      cta: "Посмотреть товары",
      becomeSupplier: "Стать поставщиком",
      scroll: "Листайте",
      trust: "Надежный экспортный поставщик",
      quality: "Экспортное качество",
      logistics: "Готовность к логистике",
      proof: {
        origin: "Происхождение",
        originValue: "Узбекистан",
        moq: "Мин. заказ",
        moqValue: "От 1 тонны",
        certificates: "Сертификаты",
        certificatesValue: "ISO, HACCP",
        delivery: "Доставка",
        deliveryValue: "По всему миру",
        quality: "Качество",
        qualityValue: "Экспортный класс",
      },
      stats: {
        years: "Лет на рынке",
        tons: "Тонн экспортировано",
        countries: "Страны",
        clients: "Клиенты",
      },
      categories: {
        title: "Категории товаров",
        subtitle: "Изучите наш широкий ассортимент экспортных сельскохозяйственных продуктов",
      },
      origin: {
        title: "Из сердца Центральной Азии",
        description: "Уникальный климат и плодородная почва Узбекистана создают идеальные условия для выращивания премиальных сельскохозяйственных продуктов. Наши продукты поставляются напрямую с местных ферм и обрабатываются в соответствии с международными экспортными стандартами.",
        climate: {
          title: "Идеальный климат",
          description: "300+ солнечных дней в году и оптимальные температурные диапазоны обеспечивают продукцию высочайшего качества.",
        },
        quality: {
          title: "Премиальное качество",
          description: "Традиционные методы ведения сельского хозяйства в сочетании с современными технологиями обработки гарантируют экспортное качество.",
        },
        region: {
          title: "Стратегическое расположение",
          description: "Расположенный в Центральной Азии, Узбекистан предлагает отличные логистические связи с Европой, Азией и Ближним Востоком.",
        },
      },
      featured: {
        badge: "Избранное",
        title: "Рекомендуемые товары",
        subtitle: "Наши самые популярные экспортные продукты",
        requestPrice: "Запросить цену",
        viewAll: "Посмотреть все товары",
      },
      benefits: {
        badge: "Почему мы",
        title: "Почему выбирают нас",
        subtitle: "Что отличает нас как вашего надежного экспортного партнера",
        quality: {
          title: "Экспортное качество",
          description: "Все продукты соответствуют международным стандартам качества и экспортным требованиям.",
        },
        direct: {
          title: "Прямые поставки",
          description: "Работайте напрямую с источником, исключая посредников и обеспечивая конкурентные цены.",
        },
        packaging: {
          title: "Гибкая упаковка",
          description: "Варианты индивидуальной упаковки для удовлетворения ваших конкретных требований и потребностей рынка.",
        },
        support: {
          title: "Персональная поддержка",
          description: "Персональный менеджер для каждого клиента, обеспечивающий полную поддержку на протяжении всего процесса.",
        },
        standards: {
          title: "Сертифицированные стандарты",
          description: "Соответствие международным сертификатам и программам обеспечения качества.",
        },
        logistics: {
          title: "Готовность к логистике",
          description: "Полная экспортная документация и логистическая поддержка для беспрепятственной международной доставки.",
        },
      },
      process: {
        badge: "Как это работает",
        title: "Как это работает",
        subtitle: "Простой и прозрачный процесс для международных покупателей",
        step1: "Шаг 1",
        step1Title: "Запрос цены",
        step1Description: "Заполните форму или свяжитесь с нашим менеджером через Telegram, WhatsApp или email.",
        step2: "Шаг 2",
        step2Title: "Обсуждение деталей",
        step2Description: "Наш менеджер свяжется с вами для обсуждения объёмов, спецификаций и условий поставки.",
        step3: "Шаг 3",
        step3Title: "Подготовка заказа",
        step3Description: "Мы подготовим ваш заказ в соответствии с вашими требованиями и стандартами экспорта.",
        step4: "Шаг 4",
        step4Title: "Доставка",
        step4Description: "Организуем логистику и доставку до вашего склада или порта.",
      },
      trust: {
        title: "Нам доверяют",
        subtitle: "Мы работаем с ведущими импортерами и дистрибьюторами по всему миру",
      },
      faq: {
        title: "Часто задаваемые вопросы",
        subtitle: "Ответы на наиболее распространенные вопросы о наших продуктах и услугах",
        moq: {
          question: "Какой минимальный объем заказа?",
          answer: "Минимальные объемы заказа различаются в зависимости от продукта. Пожалуйста, свяжитесь с нами с вашими требованиями, и мы предоставим конкретную информацию о MOQ для каждого продукта.",
        },
        payment: {
          question: "Какие способы оплаты вы принимаете?",
          answer: "Мы принимаем различные способы оплаты, включая банковские переводы, аккредитивы (L/C) и другие безопасные варианты оплаты. Условия оплаты обсуждаются во время переговоров по контракту.",
        },
        delivery: {
          question: "Какие сроки доставки?",
          answer: "Сроки доставки зависят от продукта, количества и пункта назначения. Обычно заказы обрабатываются в течение 2-4 недель после подписания контракта. Мы предоставляем подробные графики доставки в процессе запроса цен.",
        },
        quality: {
          question: "Как вы обеспечиваете качество продукции?",
          answer: "Вся продукция проходит строгий контроль качества и соответствует международным экспортным стандартам. Мы предоставляем сертификаты качества и можем организовать сторонние инспекции при необходимости.",
        },
        samples: {
          question: "Могу ли я запросить образцы продукции?",
          answer: "Да, мы можем предоставить образцы для оценки. Пожалуйста, свяжитесь с нами с вашими требованиями к образцам, и мы организуем отправку.",
        },
        contract: {
          question: "Какую документацию вы предоставляете?",
          answer: "Мы предоставляем всю необходимую экспортную документацию, включая сертификаты происхождения, сертификаты качества, фитосанитарные сертификаты, коммерческие счета-фактуры и транспортные документы.",
        },
      },
      finalCta: {
        badge: "Готовы к экспорту",
        title: "Готовы начать сотрудничество?",
        subtitle: "Свяжитесь с нами сегодня, чтобы обсудить ваши требования и получить конкурентное предложение",
        viewProducts: "Посмотреть товары",
        contactUs: "Связаться с нами",
      },
    },
    products: {
      title: "Наши товары",
      subtitle: "Экспортные сельскохозяйственные продукты из Узбекистана",
      allCategories: "Все категории",
      viewDetails: "Подробнее",
      requestPrice: "Запросить цену",
      noProducts: "Товары не найдены",
      specifications: "Характеристики",
      packaging: "Упаковка",
      moq: "Минимальный объем заказа",
      shelfLife: "Срок хранения",
      exportReadiness: "Готовность к экспорту",
      relatedProducts: "Похожие товары",
      relatedProductsDescription: "Другие товары из той же категории",
      hsCode: "ТНВЭД код",
      grade: "Сорт происхождения",
      originPlace: "Место происхождения",
      calibers: "Калибры",
      processingMethod: "Тех процесс",
      description: "Описание",
      copyHsCode: "Копировать ТНВЭД код",
      hsCodeCopied: "ТНВЭД код скопирован!",
    },
    inquiry: {
      title: "Запрос цены",
      subtitle: "Заполните форму ниже или свяжитесь с нами через Telegram",
      success: "Ваш запрос успешно отправлен",
      error: "Не удалось отправить запрос. Пожалуйста, попробуйте снова.",
      contactManager: "Связаться с менеджером",
      chooseContactMethod: "Выберите удобный способ связи",
      contactViaTelegram: "Связаться через Telegram",
      contactViaWhatsApp: "Связаться через WhatsApp",
      contactViaEmail: "Связаться по Email",
      contactViaPhone: "Связаться по телефону",
      copyEmail: "Копировать Email",
      copyPhone: "Копировать телефон",
      emailCopied: "Email скопирован!",
      phoneCopied: "Телефон скопирован!",
      sendEmail: "Отправить Email",
      callPhone: "Позвонить",
    },
    submission: {
      title: "Стать поставщиком",
      subtitle: "Предложите свой товар для продажи через нашу платформу",
      step1: "Информация о товаре",
      step2: "Контактная информация",
      productNameRu: "Название товара (русский) *",
      productNameEn: "Название товара (английский) *",
      category: "Категория *",
      descriptionRu: "Описание (русский)",
      descriptionEn: "Описание (английский)",
      hsCode: "ТНВЭД код",
      gradeRu: "Сорт (русский)",
      gradeEn: "Сорт (английский)",
      originPlaceRu: "Место происхождения (русский)",
      originPlaceEn: "Место происхождения (английский)",
      processingMethodRu: "Способ обработки (русский)",
      processingMethodEn: "Способ обработки (английский)",
      moq: "MOQ (Минимальный объем заказа)",
      shelfLife: "Срок хранения",
      exportReadiness: "Готовность к экспорту",
      packagingOptions: "Варианты упаковки (по одному на строку)",
      calibers: "Калибры",
      supplierName: "Ваше имя *",
      supplierPhone: "Номер телефона *",
      phoneHint: "Мы свяжемся с вами по WhatsApp/Telegram",
      phoneExample: "Пример: +998 90 123 45 67",
      phoneInvalid: "Неверный формат телефона. Используйте: +998 XX XXX XX XX",
      additionalDetails: "Дополнительные детали товара (необязательно)",
      images: "Изображения товара (необязательно)",
      imagesDescription: "Загрузите качественные изображения вашего товара",
      certificates: "Сертификаты и документы (до 3 PDF файлов)",
      certificatesDescription: "Загрузите сертификаты качества, экспортные документы и т.д.",
      submit: "Отправить товар",
      submitting: "Отправка...",
      success: "Ваша заявка получена и будет рассмотрена в течение 2-3 рабочих дней.",
      error: "Не удалось отправить товар. Пожалуйста, попробуйте снова.",
      whatHappensNext: "Что происходит после отправки?",
      confirmation: "Вы получите подтверждение о получении заявки",
      review: "Наша команда рассмотрит заявку в течение 2-3 рабочих дней",
      notification: "Вы получите уведомление о статусе модерации (одобрено/отклонено)",
      autoAdd: "При одобрении товар будет автоматически добавлен в каталог",
      simpleProcess: "Простой процесс",
      simpleProcessDesc: "Заполните форму с информацией о вашем товаре. Мы рассмотрим вашу заявку в течение 2-3 рабочих дней.",
      quickReview: "Быстрая модерация",
      quickReviewDesc: "Наша команда проверит качество и соответствие стандартам экспорта перед публикацией.",
      globalReach: "Глобальный охват",
      globalReachDesc: "Ваш товар будет доступен международным покупателям и дистрибьюторам.",
      successTitle: "Заявка получена!",
      successSubtitle: "Ваш запрос находится в обработке",
      currentStatus: "Текущий статус",
      whatNext: "Что дальше?",
      nextStep1: "Проверка качества и соответствия экспортным стандартам",
      nextStep2: "Проверка технических характеристик и документации",
      nextStep3: "Связь с нашим менеджером по телефону/WhatsApp/Telegram",
      saveLink: "Сохраните эту ссылку для проверки статуса позже",
      backToHome: "Вернуться на главную",
      submitAnother: "Отправить еще один товар",
      statusPending: "На проверке",
      statusApproved: "Одобрено",
      statusRejected: "Отклонено",
      statusRevision: "Нужна доработка",
      statusPendingDesc: "Наша команда проверяет технические характеристики и изображения вашего товара.",
      statusApprovedDesc: "Поздравляем! Ваш товар одобрен и добавлен в наш каталог.",
      statusRejectedDesc: "К сожалению, ваша заявка не была одобрена в данный момент.",
      statusRevisionDesc: "Ваша заявка требует некоторых изменений перед одобрением.",
      rejectionReason: "Причина:",
    },
    footer: {
      categories: {
        nuts: "Орехи",
        legumes: "Бобовые",
        driedFruits: "Сухофрукты",
      },
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".");
  let value: any = translations[locale];

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback to English
      value = translations.en;
      for (const k2 of keys) {
        value = value?.[k2];
      }
      break;
    }
  }

  return typeof value === "string" ? value : key;
}
