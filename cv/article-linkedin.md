
# Pourquoi l'IA va transformer le support IT (et pourquoi c'est une bonne nouvelle)

Un technicien passe en moyenne 40% de son temps sur des tâches répétitives : reset de mots de passe, tri de tickets, rédaction de procédures. L'IA ne va pas le remplacer. Elle va lui rendre ce temps.

## Le vrai problème du support IT

Ce n'est pas un manque de compétences. C'est un manque de temps.

Entre les tickets qui s'accumulent, les utilisateurs qui appellent pour la troisième fois cette semaine parce qu'ils ont oublié leur mot de passe, et la documentation qui n'est jamais à jour — le technicien finit par traiter l'urgent au détriment de l'important.

Et pendant ce temps, les vrais incidents critiques attendent.

## Là où l'IA fait la différence

Pas en remplaçant le technicien. En filtrant le bruit.

**Triage automatique des tickets** — Un ticket arrive. L'IA le lit, évalue sa priorité, identifie la catégorie, et le route vers la bonne équipe. Ce qui prenait 10 minutes de lecture se fait en secondes. Le technicien ouvre sa file et sait immédiatement par quoi commencer.

**Diagnostic assisté** — Un log d'erreur de 200 lignes, c'est 15 minutes d'analyse. L'IA identifie le pattern en quelques secondes et propose les 3 pistes les plus probables. Le technicien garde la décision, mais il arrive avec une longueur d'avance.

**Scripts à la demande** — Créer 50 comptes Active Directory avec les bons groupes et permissions, c'est une heure de travail manuel. Avec un prompt bien écrit, le script PowerShell est prêt en 30 secondes.

**Documentation vivante** — Au lieu de rédiger des procédures que personne ne lit, l'IA génère des fiches claires et structurées à partir d'une simple description du problème et de sa solution.

## Mais l'IA a ses limites

Elle ne sait pas rassurer un utilisateur stressé qui pense avoir perdu 3 ans de fichiers.

Elle ne sait pas qu'il ne faut surtout pas toucher au serveur du directeur financier le vendredi à 17h.

Elle ne sait pas diagnostiquer un câble réseau mal branché au 3ème étage.

Elle ne sait pas prendre la décision de couper un service en production pour appliquer un patch de sécurité critique.

Le support IT, c'est de l'humain, du contexte et de la prise de décision. L'IA est un accélérateur, pas un remplaçant.

## Ce que j'en fais concrètement

J'ai voulu tester cette vision dans mes projets :

Dans mon **HomeLab IT**, j'ai connecté un serveur GLPI à l'API Claude pour trier automatiquement les tickets par priorité et catégorie. Résultat : les tickets critiques remontent en premier, sans intervention humaine.

Avec **CyberDef**, j'ai intégré un assistant IA multi-provider (Claude, OpenAI, Ollama) qui fait le triage automatique des events et incidents SOC, avec un RAG sur 11 000 docs (MITRE ATT&CK, NVD, Sigma). Les alertes standards sont traitées automatiquement, et seules les alertes complexes arrivent devant un analyste.

Ce ne sont pas des projets théoriques. Ce sont des systèmes qui tournent.

## Le vrai sujet

On oppose souvent "l'IA" et "le technicien". C'est un faux débat.

La vraie question, c'est : est-ce que tu veux passer ton temps à trier des tickets et reset des mots de passe, ou est-ce que tu veux utiliser ce temps pour résoudre les problèmes qui comptent vraiment ?

Le technicien qui maîtrise l'IA ne sera pas remplacé. Il sera indispensable.

---

*En recherche d'une alternance en TSSR. Si cette vision vous parle, contactez-moi.*

*moussa-zedira.fr*
