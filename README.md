# Bot-Discord

How to install
git 
When it is done, create a config file in the base directory with these fields inside:

{
  "token": "MTIxMTk1NTI4MjYyMDQ0ODgwMg.GQwMET._T-Axw8F_ahAWP4UiA4b-_s_TpBFm3o5ZU4L28",
  "clientId": "1211955282620448802",
  "guildId": "917339934434672660"
}
npm i to install dependencies
node deployCommands.js to register your commands in the guild
node index.js to launch the Bot
npm install bad-words

How to add stuff
Commands folder -> Create new commands inside subfolders, each must have a data & execute
Events folder -> You can add new events here, no need for subfolders

Fonctionnalités de notre projet :
* Filtrage de contenu :
    * Identification et filtrage de contenu inapproprié, tel que le langage offensant, les spams, etc.
    * Capacité à personnaliser les filtres en fonction des besoins spécifiques du serveur.
* Gestion des utilisateurs :
    * Surveillance des comportements des utilisateurs et prise de mesures appropriées en cas de violation des règles du serveur.
    * Attribution de rôles automatiques en fonction de critères prédéfinis.
* Modération des canaux :
    * Surveillance des discussions dans les canaux textuels et vocaux pour détecter les infractions potentielles.
    * Suppression automatique des messages problématiques ou indésirables.
* Système d'avertissement et de sanctions :
    * Attribution d'avertissements aux utilisateurs en cas de comportement inapproprié.
    * Imposition de sanctions automatiques, telles que la restriction des droits de publication, le bannissement temporaire ou permanent, etc.
