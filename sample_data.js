/**
 * ChronoMaster — Study Skill | Yassmine Guizani
 * Scénarios Pré-chargés pour la Démonstration en Direct
 * Profils : Étudiant, Employé, Entrepreneur, Parent
 */

const PROFILES_DATA = {
  etudiant: {
    id: 'etudiant',
    name: 'Étudiant',
    emoji: '🎓',
    heroBadge: '🎓 Profil : Étudiant Universitaire / Lycéen',
    heroTitle: 'Scénario : Semaine de Révision & Partiels Décisifs',
    heroDesc: 'Comment un étudiant structure ses journées pour valider son semestre sans stress de dernière minute, en isolant les 20% du programme qui rapportent 80% des points aux examens.',
    frogTask: 'Faire les annales de Macroéconomie 2024 en temps réel (durée : 2h)',
    eisenhowerTasks: [
      {
        id: 'task-e-1',
        title: 'Réviser le partiel d’Économie de demain matin (Sujets type + Définitions clés)',
        quadrant: 1,
        isPareto: true,
        pomodoros: 4,
        completed: false,
        notes: 'Coeff 4 — Salle 204. Ne pas faire d’impasse sur le chapitre 3.'
      },
      {
        id: 'task-e-2',
        title: 'Soumettre le devoir de Droit fiscal en ligne avant minuit',
        quadrant: 1,
        isPareto: false,
        pomodoros: 2,
        completed: false,
        notes: 'Plateforme Moodle, format PDF uniquement.'
      },
      {
        id: 'task-e-3',
        title: 'Rédiger les 3 premières pages du mémoire de fin d’études',
        quadrant: 2,
        isPareto: true,
        pomodoros: 3,
        completed: false,
        notes: 'Zone Q2 vitale : planifier avant que la date de rendu en juin devienne une urgence.'
      },
      {
        id: 'task-e-4',
        title: 'Créer les fiches de synthèse audio en Anglais des affaires',
        quadrant: 2,
        isPareto: true,
        pomodoros: 2,
        completed: false,
        notes: 'Enregistrement de 15 minutes à réécouter pendant les trajets.'
      },
      {
        id: 'task-e-5',
        title: 'Faire une séance de sport / course à pied de 45 minutes',
        quadrant: 2,
        isPareto: false,
        pomodoros: 2,
        completed: false,
        notes: 'Santé & clarté mentale pour consolider la mémoire.'
      },
      {
        id: 'task-e-6',
        title: 'Répondre aux messages incessants du groupe WhatsApp du projet tuteuré',
        quadrant: 3,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Urgences des autres : bloquer un créneau unique de 15 min à 17h au lieu de répondre en continu.'
      },
      {
        id: 'task-e-7',
        title: 'Aider un camarade de promo à retrouver un cours égaré',
        quadrant: 3,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Déléguer ou transmettre le lien Google Drive partagé en 30 secondes.'
      },
      {
        id: 'task-e-8',
        title: 'Scroller TikTok et Instagram Reels pendant 2h en faisant semblant de travailler',
        quadrant: 4,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Piège de dopamine passive. À éliminer immédiatement durant les blocs de focus !'
      },
      {
        id: 'task-e-9',
        title: 'Changer la police d’écriture et la couleur du titre de la page de garde 15 fois',
        quadrant: 4,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Faux travail et perfectionnisme stérile.'
      }
    ],
    smartGoal: {
      s: 'Réviser l’intégralité des 4 chapitres de Macroéconomie en réalisant 2 sujets d’annales corrigés',
      m: 'Obtenir une note simulée supérieure à 14/20 sur les deux examens blancs',
      a: 'Oui, cours complets sous la main et accès aux corrigés détaillés du professeur',
      r: 'Réaliste en réservant 4 blocs Pomodoro stricts (2h) sans distraction',
      t: 'Jeudi avant 18h00 pour avoir la soirée libre et sereine avant l’épreuve'
    },
    timeline: {
      matin: {
        title: 'Eat That Frog 🐸 : Annales d’Économie en condition d’examen réel',
        desc: 'Votre cerveau est au sommet de ses capacités analytiques. Interdiction de consulter son téléphone. Attaquez le problème le plus dur d’emblée.'
      },
      midi: {
        title: 'Vraie pause déjeuner & Marche au soleil 🥗',
        desc: 'Repas sain, aération 15 min dans le parc du campus. Zéro révision à table pour permettre à la mémoire de travail de se consolider.'
      },
      apresMidi: {
        title: '4 Cycles Pomodoro ciblés + Travail de groupe ⚡',
        desc: 'Deux cycles de 25 min sur la rédaction du mémoire (Q2), puis regroupement des réponses WhatsApp et tâches administratives en un seul bloc (batching).'
      },
      soiree: {
        title: 'Sport, dîner convivial & Le Rituel d’Or de 10 min 🌙',
        desc: 'À 21h30 : Noter sur un carnet les 3 actions décisives du lendemain. Ranger le bureau pour un démarrage instantané demain.'
      },
      nuit: {
        title: 'Sommeil réparateur de 8h (23h00 — 07h00) 💤',
        desc: 'C’est durant le sommeil paradoxal que le cerveau grave les concepts révisés dans la mémoire à long terme. La nuit blanche est une erreur stratégique majeure.'
      }
    }
  },

  employe: {
    id: 'employe',
    name: 'Employé / Cadre',
    emoji: '💼',
    heroBadge: '💼 Profil : Salarié / Chef de Projet / Manager',
    heroTitle: 'Scénario : Surcharge de Réunions, Deadlines & Valeur Ajoutée',
    heroDesc: 'Comment sortir du piège de l’urgence permanente en entreprise, protéger son temps de concentration profonde (Deep Work), et déléguer les réunions sans valeur ajoutée.',
    frogTask: 'Rédiger l’argumentaire financier stratégique du grand compte client Alpha',
    eisenhowerTasks: [
      {
        id: 'task-m-1',
        title: 'Finaliser et valider la proposition commerciale du client Alpha (Deadline 14h)',
        quadrant: 1,
        isPareto: true,
        pomodoros: 3,
        completed: false,
        notes: 'Chiffre d’affaires de 85 000€ en jeu. Priorité absolue du matin.'
      },
      {
        id: 'task-m-2',
        title: 'Résoudre l’incident technique bloquant signalé par le support client',
        quadrant: 1,
        isPareto: false,
        pomodoros: 2,
        completed: false,
        notes: 'Impact sur 12 utilisateurs. Mobiliser un développeur référent.'
      },
      {
        id: 'task-m-3',
        title: 'Suivre la formation certifiante en Intelligence Artificielle et Automatisation',
        quadrant: 2,
        isPareto: true,
        pomodoros: 2,
        completed: false,
        notes: 'Compétence clé pour l’évolution de carrière à 1 an (Zone d’Excellence Q2).'
      },
      {
        id: 'task-m-4',
        title: 'Optimiser et documenter le processus d’onboarding des nouvelles recrues',
        quadrant: 2,
        isPareto: true,
        pomodoros: 2,
        completed: false,
        notes: 'Permettra d’économiser 5 heures par semaine pour toute l’équipe.'
      },
      {
        id: 'task-m-5',
        title: 'Participer à la réunion d’information hebdomadaire sans ordre du jour précis',
        quadrant: 3,
        isPareto: false,
        pomodoros: 2,
        completed: false,
        notes: 'Urgence perçue mais non importante : demander un compte-rendu écrit ou envoyer un remplaçant.'
      },
      {
        id: 'task-m-6',
        title: 'Répondre aux 47 emails non prioritaires arrivés dans la matinée',
        quadrant: 3,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'À traiter en lot unique de 30 minutes à 16h30, pas au fil de l’eau.'
      },
      {
        id: 'task-m-7',
        title: 'Trier et reclasser les dossiers d’archives Outlook de 2022',
        quadrant: 4,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Procrastination active déguisée en tâche productive. À bannir.'
      },
      {
        id: 'task-m-8',
        title: 'Discuter pendant 40 minutes à la machine à café des rumeurs de restructuration',
        quadrant: 4,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Chronophage pur et anxiogène.'
      }
    ],
    smartGoal: {
      s: 'Finaliser et soumettre le dossier d’appel d’offres pour le client Alpha avec chiffrage budgétaire validé',
      m: 'Dossier de 25 pages complet + annexes tarifaires vérifiées par la direction financière',
      a: 'Oui, toutes les contributions techniques des experts ont été collectées',
      r: 'Critique pour atteindre 100% de l’objectif trimestriel du département',
      t: 'Vendredi 11h30 au plus tard avant la fermeture de la plateforme d’enchères'
    },
    timeline: {
      matin: {
        title: 'Deep Work 🐸 : Rédaction de l’offre Alpha (Eat That Frog)',
        desc: 'Bloquer son calendrier avec statut "Ne pas déranger". Aucun email avant 11h. Concentrez-vous sur la mission qui justifie 80% de votre rémunération.'
      },
      midi: {
        title: 'Pause déjeuner extérieure sans parler du travail 🥗',
        desc: 'Changer d’environnement, marcher, respirer pour éviter la baisse d’énergie de début d’après-midi.'
      },
      apresMidi: {
        title: 'Réunions utiles synchronisées & Traitement par lots (Batching) ⚡',
        desc: 'Groupement des réunions entre 14h et 16h. Traitement éclair des emails à 16h30 (méthode Inbox Zero en 25 min).'
      },
      soiree: {
        title: 'Rituel de déconnexion pro & 10 min de cadrage pour demain 🌙',
        desc: 'Fermer l’ordinateur professionnel, couper les notifications Slack/Teams. Noter sur papier le Top 3 du lendemain.'
      },
      nuit: {
        title: 'Sommeil réparateur (23h00 — 06h30) 💤',
        desc: 'Protection de la bande passante mentale pour garder son calme face aux urgences du lendemain.'
      }
    }
  },

  entrepreneur: {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    emoji: '🚀',
    heroBadge: '🚀 Profil : Fondateur de Startup / Freelance / Solopreneur',
    heroTitle: 'Scénario : Croissance, Ventes & Élimination des Distractions',
    heroDesc: 'Quand on est son propre patron, tout semble urgent. Découvrez comment appliquer Pareto pour ne faire que les actions qui génèrent du cash-flow et de la croissance durable.',
    frogTask: 'Appeler 10 prospects qualifiés pour closer 3 devis en attente',
    eisenhowerTasks: [
      {
        id: 'task-p-1',
        title: 'Résoudre le bug de paiement Stripe sur la page de commande',
        quadrant: 1,
        isPareto: true,
        pomodoros: 2,
        completed: false,
        notes: 'Chaque heure de panne fait perdre des ventes directes. Réparation immédiate.'
      },
      {
        id: 'task-p-2',
        title: 'Envoyer les relances pour les 4 factures impayées échues',
        quadrant: 1,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Trésorerie vitale pour la fin de semaine.'
      },
      {
        id: 'task-p-3',
        title: 'Contacter 20 prospects ciblés B2B avec message personnalisé sur LinkedIn',
        quadrant: 2,
        isPareto: true,
        pomodoros: 3,
        completed: false,
        notes: 'Le cœur du réacteur : 80% des revenus futurs dépendent de cette prospection continue.'
      },
      {
        id: 'task-p-4',
        title: 'Rédiger et programmer la newsletter hebdomadaire de valeur',
        quadrant: 2,
        isPareto: true,
        pomodoros: 2,
        completed: false,
        notes: 'Fidélisation de l’audience et autorité de marque (Q2).'
      },
      {
        id: 'task-p-5',
        title: 'Répondre aux questions répétitives sur le support client niveau 1',
        quadrant: 3,
        isPareto: false,
        pomodoros: 2,
        completed: false,
        notes: 'À déléguer à un assistant virtuel ou automatiser avec une FAQ interactive / IA.'
      },
      {
        id: 'task-p-6',
        title: 'Changer la charte graphique et la disposition des icônes du site pour la 6e fois',
        quadrant: 4,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Piège classique de l’entrepreneur : perfectionnisme stérile sans impact commercial.'
      },
      {
        id: 'task-p-7',
        title: 'Vérifier Google Analytics toutes les 15 minutes pour regarder les visites',
        quadrant: 4,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Fausse productivité. Regarder les métriques une seule fois par semaine.'
      }
    ],
    smartGoal: {
      s: 'Signer 3 nouveaux contrats clients d’accompagnement stratégique en réalisant 15 appels de découverte',
      m: 'Générer 4 500€ de chiffre d’affaires additionnel avec acomptes encaissés',
      a: 'Oui, base de 80 leads chauds qualifiés prête dans le CRM',
      r: 'Indispensable pour valider le modèle avant le recrutement du premier salarié',
      t: 'D’ici le vendredi 28 du mois à 17h00'
    },
    timeline: {
      matin: {
        title: 'Sales & Frog 🐸 : 10 Appels de Prospection & Closing',
        desc: 'Faites ce qui rapporte le plus en premier. La vente matinale libère une énergie monumentale pour le reste de la journée.'
      },
      midi: {
        title: 'Repas sain & Déconnexion totale des dashboards 🥗',
        desc: 'Ne pas manger devant son ordinateur portable. Marcher pour recharger sa créativité.'
      },
      apresMidi: {
        title: 'Création de Contenu & Automatisation des Systèmes ⚡',
        desc: '3 blocs Pomodoro pour concevoir la stratégie Q2 (articles, templates, amélioration du produit) et créer des systèmes qui tournent sans vous.'
      },
      soiree: {
        title: 'Coupure nette, sport & Revue des métriques (10 min) 🌙',
        desc: 'Faire le point : Ai-je fait avancer mes 20% Pareto aujourd’hui ? Écrire la grenouille de demain.'
      },
      nuit: {
        title: 'Sommeil de 7h30 pour une lucidité stratégique sans faille 💤',
        desc: 'Un entrepreneur épuisé prend de mauvaises décisions financières. Le sommeil est un levier de rentabilité.'
      }
    }
  },

  parent: {
    id: 'parent',
    name: 'Parent / Vie Perso',
    emoji: '👨‍👩‍👧',
    heroBadge: '👨‍👩‍👧 Profil : Parent Actif / Équilibre Vie Pro-Perso',
    heroTitle: 'Scénario : Charge Mentale, Logistique Familiale & Temps pour Soi',
    heroDesc: 'Comment concilier obligations professionnelles, bien-être des enfants et temps personnel sans s’épuiser, grâce à la planification préventive (Q2).',
    frogTask: 'Boucler le dossier médical et l’inscription cantine/périscolaire complet',
    eisenhowerTasks: [
      {
        id: 'task-fam-1',
        title: 'Prendre le rendez-vous pédiatre d’urgence pour le certificat sportif avant 17h',
        quadrant: 1,
        isPareto: true,
        pomodoros: 1,
        completed: false,
        notes: 'Obligatoire pour la reprise des cours mercredi.'
      },
      {
        id: 'task-fam-2',
        title: 'Réparer la fuite d’eau sous l’évier de la cuisine',
        quadrant: 1,
        isPareto: false,
        pomodoros: 2,
        completed: false,
        notes: 'Urgence domestique immédiate.'
      },
      {
        id: 'task-fam-3',
        title: 'Planifier les menus de la semaine et faire les courses en ligne (Batch cooking)',
        quadrant: 2,
        isPareto: true,
        pomodoros: 2,
        completed: false,
        notes: 'Zone Q2 magistrale : 2h le dimanche évitent 1h de stress chaque soir de la semaine !'
      },
      {
        id: 'task-fam-4',
        title: 'Sanctuariser une séance de sport / yoga de 45 minutes pour soi',
        quadrant: 2,
        isPareto: true,
        pomodoros: 2,
        completed: false,
        notes: 'Prendre soin de soi pour avoir l’énergie de s’occuper des siens.'
      },
      {
        id: 'task-fam-5',
        title: 'Répondre au débat de 95 messages sur le groupe de parents d’élèves',
        quadrant: 3,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Mettre le groupe en sourdine et ne lire que le récapitulatif officiel.'
      },
      {
        id: 'task-fam-6',
        title: 'Faire les devoirs à la place de l’enfant pour aller plus vite',
        quadrant: 3,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Faux gain de temps : lui apprendre l’autonomie avec un minuteur Pomodoro adapté.'
      },
      {
        id: 'task-fam-7',
        title: 'Scroller les boutiques de vêtements ou déco en ligne par lassitude en fin de soirée',
        quadrant: 4,
        isPareto: false,
        pomodoros: 1,
        completed: false,
        notes: 'Augmente la fatigue oculaire et retarde l’heure d’endormissement.'
      }
    ],
    smartGoal: {
      s: 'Planifier et cuisiner à l’avance 4 dîners sains et équilibrés pour la famille (Batch Cooking)',
      m: 'Préparer 4 récipients prêts à réchauffer en 15 minutes chaque soir de lundi à jeudi',
      a: 'Oui, ingrédients commandés en drive et recettes simples sélectionnées',
      r: 'Permet de libérer 45 minutes chaque soir pour profiter calmement des enfants sans stress',
      t: 'Dimanche de 16h00 à 18h00 pile'
    },
    timeline: {
      matin: {
        title: 'Matinée ordonnée 🐸 : La priorité administrative familiale',
        desc: 'Régler la formalité la plus pénible (sécurité sociale, inscription) avant le départ ou dès le début de matinée.'
      },
      midi: {
        title: 'Pause déjeuner sereine & Déconnexion 🥗',
        desc: 'Un repas calme, sans écrans, pour faire redescendre le niveau de cortisol.'
      },
      apresMidi: {
        title: 'Blocs d’efficacité ciblés & Logistique fluide ⚡',
        desc: 'Gestion des imprévus par créneaux Pomodoro courts de 25 min. Regroupement des courses et trajets.'
      },
      soiree: {
        title: 'Temps de qualité en famille & Préparation de demain en 10 min 🌙',
        desc: 'Repas partagé, coucher des enfants dans le calme. Rituel de 10 min : cartables et tenues du lendemain préparés.'
      },
      nuit: {
        title: 'Nuit réparatrice de 7h30 pour recharger ses batteries 💤',
        desc: 'Éteindre les écrans 45 min avant de dormir pour garantir un sommeil profond.'
      }
    }
  }
};

// Expose to global window object
if (typeof window !== 'undefined') {
  window.PROFILES_DATA = PROFILES_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PROFILES_DATA;
}

