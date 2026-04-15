# CLAUDINE — TODO

## Infrastructure
- [x] Upgrade vers stack full-stack (backend + DB + auth)
- [x] Schéma DB : tables profiles, messages, conversations
- [x] Migration DB (tables créées directement via SQL)

## Authentification
- [x] Auth Manus OAuth (Google, Microsoft, Apple, email) — via Manus OAuth portal
- [x] Routes protégées (profil, chat)
- [x] Navbar avec état auth (connecté/déconnecté) + boutons Se connecter / S'inscrire

## Profils
- [x] Sauvegarder profil en DB (enseigne, ville, réduction, enseignes recherchées)
- [x] Charger profil depuis DB (trpc.profile.me)
- [x] Page Profils : liste depuis DB avec recherche
- [ ] Logique matching avancée : "Ce que je recherche" / "Ils sont intéressés par moi" / "Match mutuel"

## Chat / Messagerie
- [x] Table conversations + messages en DB
- [x] API tRPC : envoyer/recevoir messages, getOrCreateConversation
- [x] Interface chat temps réel (polling 3s)
- [x] Badge messages non lus dans la navbar
- [x] Page chat liste conversations + chat individuel

## UX / Pages
- [x] Landing page avec CTA "Rejoindre gratuitement"
- [x] Page Profils avec cartes membres et bouton Contacter
- [x] Page Mon Profil avec formulaire persistant
- [x] Page Chat avec liste conversations et messagerie
- [x] Page Inscription / Connexion (OAuth)

## Tests
- [x] Vitest auth.logout test passé (1/1)

## GitHub
- [x] Pousser le code sur GitHub
