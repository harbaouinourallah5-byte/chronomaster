# ChronoMaster — Study Skill | Yassmine Guizani ⏱️

Application web monopage (*Single-Page Application*) moderne et responsive conçue pour une **démonstration interactive en direct (Live Classroom)** sur le thème de la **Gestion du Temps et de l'Efficacité Personnelle**.

---

## 🌟 Points Forts & Fonctionnalités Clés

### 1. Matrice d'Eisenhower Interactive & Filtre Pareto 80/20
- **4 Cadrans Stratégiques :**
  - **Q1 : Urgent & Important (Faire maintenant)** — Crises et échéances fatales.
  - **Q2 : Important & Non Urgent (Planifier)** — *Zone d'Excellence* : révision profonde, stratégie, santé.
  - **Q3 : Urgent & Non Important (Déléguer / Limiter)** — Interruptions, urgences des autres, messages continus.
  - **Q4 : Ni Urgent Ni Important (Éliminer)** — Distractions numériques, scroll passif, faux travail.
- **Glisser-Déposer Fluide (Drag & Drop) :** Déplacez intuitivement les cartes entre les quadrants pendant la démo.
- **Badge Étoile "Top 20% Pareto" :** Isoler en un clic les 20% d'actions qui produisent 80% des résultats ou des points d'examen.
- **Filtre Pareto :** Interrupteur pour masquer tout le reste et ne focaliser la classe que sur les priorités vitales.
- **Statistiques en direct :** Calcul automatique du ratio de temps passé en Zone Q2 et Pareto.

### 2. Minuteur Pomodoro Intelligent
- **3 Modes Circadiens :**
  - 🎯 **Focus (25 min)** — Concentration unitaire sans multitâche.
  - ☕ **Pause courte (5 min)** — Respiration et repos visuel.
  - 🌴 **Pause longue (15–30 min)** — Régénération de la dopamine après 4 cycles complets.
- **Anneau de progression circulaire dynamique (SVG Ring)** et affichage synchronisé avec le titre du navigateur.
- **Carillon Audio Synthétisé (Web Audio API) :** 100% hors-ligne, sans fichier MP3 externe à charger.
- **Liaison Automatique avec la Matrice :** Cliquez sur *"Travailler"* sur une tâche Q1 ou Q2 pour la lier instantanément au Pomodoro, avec validation en 1 clic et pluie de confettis !
- **Boutons démo rapide (10s, 5m, 25m) :** Idéal pour simuler la fin d'un cycle devant la classe sans attendre 25 minutes.

### 3. Assistant Objectifs SMART & Journée Type (Time-Blocking)
- **Assistant SMART Interactif :**
  - Évalue en temps réel les 5 critères de George T. Doran (**S**pécifique, **M**esurable, **A**tteignable, **R**éaliste, **T**emporel).
  - Score dynamique sur 5 avec retour pédagogique instantané.
  - Bouton *"Injecter dans Eisenhower"* : transforme l'objectif validé en tâche Q2 prioritaire avec badge Pareto !
- **Chronobiologie & Journée Type (5 Blocs) :**
  - 🐸 **Matin (8h–12h) — Eat That Frog (Brian Tracy) :** La tâche la plus difficile quand la volonté est maximale.
  - 🥗 **Midi (12h–13h30) — Déconnexion :** Repas nutritif et aération loin des écrans.
  - ⚡ **Après-midi (13h30–18h) — Pomodoro :** Tâches collaboratives, révision active, batching d'emails.
  - 🌙 **Soirée (18h–22h30) — Loisirs + Rituel de 10 min :** Préparation du Top 3 pour le lendemain.
  - 💤 **Nuit (22h30–7h30) — 7 à 8h de Sommeil :** Consolidation mnésique fondamentale.

### 4. Mode Profils en 1 Clic (Module 4)
Basculez instantanément entre 4 scénarios réels complets pour faire participer l'audience :
1. 🎓 **Étudiant :** Révisions de partiels, fiches de synthèse, mémoire, piège de TikTok.
2. 💼 **Employé / Cadre :** Offre commerciale grand compte, formation IA, réunions inutiles, surcharge mail.
3. 🚀 **Entrepreneur / Freelance :** Appels de prospection (Frog), incident de paiement Stripe, scaling Q2.
4. 👨‍👩‍👧 **Parent / Équilibre de Vie :** Urgence pédiatre, batch cooking du dimanche, charge mentale.

### 5. Outils de Démonstration Live
- 🖥️ **Mode Projection (Plein Écran)** pour vidéoprojecteur.
- 📖 **Guide Méthodes & Théories :** Fiche de révision interactive intégrée expliquant les fondements scientifiques.
- 🖨️ **Bilan PDF / Impression :** Génère une mise en page d'impression propre pour distribuer la synthèse de la journée.
- 💾 **Persistance Locale (localStorage) :** Conserve toutes les modifications sans base de données externe.
- ⌨️ **Raccourcis Clavier :** `Espace` (Play/Pause Pomodoro), `R` (Reset Pomodoro), `Échap` (Fermer modales).

---

## 🚀 Comment Lancer l'Application

Double-cliquez simplement sur **`index.html`** dans n'importe quel navigateur moderne (Chrome, Edge, Firefox, Safari).

Ou lancez un serveur local léger si souhaité :
```bash
# Avec Python 3
python -m http.server 8000
# Puis ouvrez http://localhost:8000
```

---

*Projet réalisé pour la démonstration Study Skill de Yassmine Guizani.*
