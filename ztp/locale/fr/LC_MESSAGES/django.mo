��    v      �      |      |  �   }  �   
  �  �  E   3
  z   y
  e   �
  0   Z  /   �  ,   �     �     �               $     *  #   ?     c     k     {     �     �     �     �  1   �       B     o   S  d   �     (     F     `     {     �  	   �     �     �     �     �     �     �  	   �     �     �  ?   �  5   $     Z  	   s     }     �     �     �     �     �     �     �     �     �  '   �     �     �  +        /  	   8  $   B     g     x     �     �     �     �     �  �   �  9   s     �     �     �     �     �     �     �     �     �     �  i        m     �  
   �  C   �  9   �          4     L  L   X     �     �  T  �          "     1     6     B     G     P  	   Y     c     l     �     �  	   �  $   �     �     �     �     �     �     �       �    o   �  W   &  n  ~  #   �  H     -   Z  2   �  1   �  .   �       -   )     W      m     �     �  7   �     �     �          &     B     ]     y  H   �     �  E   �  �   $  p   �          8     T     q  	   �  	   �     �  	   �     �     �     �     �     �     �     �  @   �  C   6     z  	   �     �     �     �  	   �  	   �     �     �     �     �     �  +         A      E   :   M   
   �   
   �   @   �      �      �      !     0!     J!     _!     w!  �   !  ?    "     `"     d"     q"     �"     �"  	   �"  	   �"     �"  	   �"  
   �"  ~   �"     X#     u#  
   �#  E   �#  G   �#     $     3$     M$  X   Y$  -   �$     �$  ^  �$     F&     T&     c&     l&     x&     �&     �&  	   �&     �&     �&     �&  
   �&     �&  @   �&     '     :'     R'     Z'     w'  	   ~'  
   �'   
                                You're about to delete the %(object_description)s <strong>%(object)s</strong>.
                             
                    collects all the firmwares (softwares) that can
                    be downloaded by the managed devices.
                 
                    defines your configuration templates that
                    can be copied by the ZTP script to your device, if it supports this
                    possibility. Splitting the bootstrap and the configuration permits to have
                    a more generic bootstrap script and custom configurations for specific
                    platforms or for specific devices.
                 
                    displays the logs of ZosTeroPs.
                 
                    manages the categories of
                    the network devices of a given vendor.
                 
                    manages the vendors of the
                    network devices.
                 %(client)s requests ZTP script "%(ztp_script)s". %(client)s requests configuration "%(config)s". %(client)s requests firmware "%(firmware)s". About Accept query string Add Parameter Add Parameter Table Admin All rights reserved. Are you sure you want to delete it? Author: Can list config Can list firmware Can list platform Can list vendor Can list ztp script Ch. password Config "%(config)s" requested by %(client)s sent. Configuration Configuration "%(config)s" requested by %(client)s does not exist. Configuration "%(config)s" requested by %(client)s has no matching value for parameter "%(invalid_parameter)s". Configuration "%(config)s" requested by %(client)s miss mandatory parameter "%(invalid_parameter)s". Configuration does not exist! Configuration's parameter Configuration's parameters Configurations Confirm Copyright Create Delete Description Details Edit File File size Filename Firmware Firmware "%(firmware)s" requested by %(client)s does not exist. Firmware "%(firmware)s" requested by %(client)s sent. Firmware does not exist! Firmwares Home ID Language License: Login Logout Logs MD5 hash MIT License Mandatory parameter Missing mandatory parameter "%(name)s". Name New No matching value for parameter "%(name)s". Platform Platforms Priority query string over arguments Remove Parameter Remove Parameter Table Render template SHA512 hash Supported firmwares Supported platforms Template The system contains different parts that permit to customize the process depending
            on the vendor and the platform of your network devices. There must not be multiple parameters with the same name. URL Update Use parameters User Profile Value Vendor Vendors Version Version: Website: You are about to delete the complete table with its pre-existing data. Are you sure you want to continue? ZTP Script does not exist! ZTP Scripts ZTP script ZTP script "%(ztp_script)s" requested by %(client)s does not exist. ZTP script "%(ztp_script)s" requested by %(client)s sent. ZTP script's parameter ZTP script's parameters ZTP scripts ZosTeroPs manages the ZTP (Zero Touch Provisioning) of your network devices. accept_query_string bytes collects your ZTP bootstrap scripts that are
                    first downloaded by the network devices. Multiple scripts can be defined
                    to support multiple platforms with different bootstrap conditions. All
                    scripts are text-based (not binary) that can define variable substitution.
                 configuration configurations data description file filesize firmware firmwares language mandatory parameter name platform platforms priority query string over arguments render template supported platforms template use parameters value vendor vendors Project-Id-Version: PACKAGE VERSION
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2021-03-14 19:57+0100
PO-Revision-Date: 2021-03-14 19:59+0000
Last-Translator: b'Admin Administrateur <ygauteron@gmail.com>'
Language-Team: LANGUAGE <LL@li.org>
Language: 
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit
Plural-Forms: nplurals=2; plural=(n > 1);
X-Translated-Using: django-rosetta 0.9.5
 
Vous êtes sur le point de supprimer l'élément suivant : %(object_description)s <strong>%(object)s</strong>. 
collecte tous les logiciels qui peuvent être téléchargés par l'équipement géré. 
déclare les modèles de configuration qui peuvent être récupérés par le script ZTP si l'équipement supporte cette fonctionnalité. Séparer le script de démarrage et la configuration permet de déclarer un script de démarrage plus générique avec des configurations personnalisées spécifiques en fonction de la plateforme ou d'un équipement particulier. 
affiche les journaux de ZosTeroPs. 
gère les catégories d'équipement réseau d'un fabricant particulier. 
gère les fabricants d'équipements réseau. %(client)s demande le script ZTP "%(ztp_script)s". %(client)s demande la configuration "%(config)s". %(client)s demande le firmware "%(firmware)s". À propos... Accepte la chaîne de caractères de requête Ajouter un paramètre Ajouter une table de paramètres Admin Tous droits réservés. Êtes-vous certain de vouloir supprimer cet élément ? Auteur : Peut lister les configurations Peut lister les logiciels Peut lister les plateformes Peut lister les fabricants Peut lister les scripts ZTP Ch. m-d-passe La configuration "%(config)s" demandée par %(client)s a été envoyée. Configuration La configuration "%(config)s" demandée par %(client)s n'existe pas ! La configuration "%(config)s" demandée par %(client)s n'a pas de valeur correspondante pour le paramètre "%(invalid_parameter)s". La configuration "%(config)s" demandée par %(client)s manque le paramètre obligatoire "%(invalid_parameter)s". La configuration n'existe pas! Paramètre de configuration Paramètres de configuration Configurations Confirmer Copyright Créer Supprimer Description Détails Édition Fichier Taille du fichier Nom de fichier Logiciel Le firmware "%(firmware)s" demandé par %(client)s n'existe pas. Le firmware "%(firmware)s" demandé par %(client)s a été envoyé. Le firmware n'existe pas ! Logiciels Accueil ID Langue Licence : Connexion Déconnexion Journaux somme de contrôle MD5 MIT License Paramètre obligatoire Paramètre obligatoire "%(name)s" manquant. Nom Nouveau Pas de valeur correspondant pour le paramètre "%(name)s". Plateforme Plateforme Chaîne de caractères de requête prioritaire sur les arguments Retirer un paramètre Retirer la table de paramètres Interprétation du modèle somme de contrôle SHA512 Logiciels supportés Plateformes supportées Modèle Le système possède différentes parties qui permettent de personnaliser le processus en fonction du fabricant et de la plateforme de vos équipements réseau. Il ne peut pas y avoir plusieurs paramètres avec le même nom. URL Mise à jour Substitution des paramètres Profil utilisateur Valeur Fabricant Fabricant Version Version : Site web : Vous êtes sur le point de supprimer toute la table avec ses valeurs préexistantes. Êtes-vous certain de vouloir continuer ? Le script ZTP n'existe pas ! Scripts ZTP Script ZTP Le script ZTP "%(ztp_script)s" demandé par %(client)s n'existe pas ! Le script ZTP "%(ztp_script)s" demandé par %(client)s a été envoyé. Paramètre de script ZTP Paramètres de script ZTP Scripts ZTP ZosTeroPs gère le mécanisme ZTP (Zero Touch Provisioning) de vos équipements réseau. accepte la chaîne de caractères de requête octets collecte vos scripts de démarrage ZTP qui sont téléchargés en premier par vos équipements réseau. Plusieurs scripts peuvent être déclarés afin de supporter plusieurs plateformes avec des conditions de démarrages différentes. Tous les scripts sont basés sur du texte (pas de codes binaires) et peuvent définir des valeurs de substitution. configuration configurations données description fichier taille du fichier logiciel logiciels langue Paramètre obligatoire nom plateforme plateformes chaîne de caractères de requête prioritaire sur les arguments interprétation du modèle plateformes supportées modèle substitution des paramètres valeur fabricant fabricants 