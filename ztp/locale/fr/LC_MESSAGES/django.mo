��    ^            �      �  �   �  �  �  E   &  z   l  e   �  l   M	     �	     �	     �	     �	     �	     
  #   
     :
     B
     R
     d
     v
     �
     �
     �
     �
     �
     �
  
   �
     �
     �
     �
          	  	          	   !     +     0     3     <     B     I     N     W  '   c     �     �  +   �     �  
   �     �  	   �  $   �               3     C     O  �   X  9   �     )     -     4     C     P     V     ]     e     n  i   w     �  
   �     �  L        Q     e  T  k     �     �     �     �     �     �     �  	             #     (  	   1  $   ;     `     p     y     �     �     �  �  �  W     n  w  #   �  H   
  -   S  o   �     �            -   %     S      i  7   �     �     �     �                ;  	   W     a     �  	   �     �     �  	   �     �     �     �     �     �     �  	         
       	     	        )     6     ?     V  +   b     �     �  :   �     �     �  
   �  
   �  @   �     @     V     v     �     �  �   �  ?   T     �     �     �     �     �  	   �  	   �  	   �  
   �  ~        �  
   �     �  X   �  -         .  ^  5     �     �     �     �     �     �     �  	   �     �     
  
          @   %     f     �     �     �  	   �  
   �   
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
                 
                You're about to delete the %(object_description)s <strong>%(object)s</strong>.
             (development) (not implemented) About Accept query string Add Parameter Add Parameter Table Are you sure you want to delete it? Author: Can list config Can list firmware Can list platform Can list vendor Can list ztp script Change: Configuration does not exist! Configurations Confirm Create Currently: Delete Description Details Edit File File size Filename Firmwares Home ID License: Login Logout Logs MD5 hash MIT License Missing mandatory parameter "%(name)s". Name New No matching value for parameter "%(name)s". Options Parameters Platform Platforms Priority query string over arguments Remove Parameter Remove Parameter Table Render template SHA512 hash Template The system contains different parts that permit to customize the process depending
            on the vendor and the platform of your network devices. There must not be multiple parameters with the same name. URL Update Use parameters User Profile Value Vendor Vendors Version: Website: You are about to delete the complete table with its pre-existing data. Are you sure you want to continue? ZTP Scripts ZTP script ZTP scripts ZosTeroPs manages the ZTP (Zero Touch Provisioning) of your network devices. accept_query_string bytes collects your ZTP bootstrap scripts that are
                    first downloaded by the network devices. Multiple scripts can be defined
                    to support multiple platforms with different bootstrap conditions. All
                    scripts are text-based (not binary) that can define variable substitution.
                 configuration configurations data description file filesize firmware firmwares mandatory parameter name platform platforms priority query string over arguments render template template use parameters value vendor vendors Project-Id-Version: PACKAGE VERSION
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2021-02-27 15:47+0100
PO-Revision-Date: 2021-02-27 15:48+0000
Last-Translator: b'  <>'
Language-Team: LANGUAGE <LL@li.org>
Language: 
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit
Plural-Forms: nplurals=2; plural=(n > 1);
X-Translated-Using: django-rosetta 0.9.5
 
collecte tous les logiciels qui peuvent être téléchargés par l'équipement géré. 
déclare les modèles de configuration qui peuvent être récupérés par le script ZTP si l'équipement supporte cette fonctionnalité. Séparer le script de démarrage et la configuration permet de déclarer un script de démarrage plus générique avec des configurations personnalisées spécifiques en fonction de la plateforme ou d'un équipement particulier. 
affiche les journaux de ZosTeroPs. 
gère les catégories d'équipement réseau d'un fabricant particulier. 
gère les fabricants d'équipements réseau. 
Vous êtes sur le point de supprimer l'élément suivant : %(object_description)s <strong>%(object)s</strong>. (en développement) (pas implémenté) À propos... Accepte la chaîne de caractères de requête Ajouter un paramètre Ajouter une table de paramètres Êtes-vous certain de vouloir supprimer cet élément ? Auteur : Peut lister les configurations Peut lister les logiciels Peut lister les plateformes Peut lister les fabricants Peut lister les scripts ZTP Changer : La configuration n'existe pas! Configurations Confirmer Créer Actuellement : Supprimer Description Détails Édition Fichier Taille du fichier Nom de fichier Logiciels Accueil ID Licence : Connexion Déconnexion Journaux somme de contrôle MD5 MIT License Paramètre obligatoire "%(name)s" manquant. Nom Nouveau Pas de valeur correspondant pour le paramètre "%(name)s". Options Paramètres Plateforme Plateforme Chaîne de caractères de requête prioritaire sur les arguments Retirer un paramètre Retirer la table de paramètres Interprétation du modèle somme de contrôle SHA512 Modèle Le système possède différentes parties qui permettent de personnaliser le processus en fonction du fabricant et de la plateforme de vos équipements réseau. Il ne peut pas y avoir plusieurs paramètres avec le même nom. URL Mise à jour Substitution des paramètres Profil utilisateur Valeur Fabricant Fabricant Version : Site web : Vous êtes sur le point de supprimer toute la table avec ses valeurs préexistantes. Êtes-vous certain de vouloir continuer ? Scripts ZTP Script ZTP Scripts ZTP ZosTeroPs gère le mécanisme ZTP (Zero Touch Provisioning) de vos équipements réseau. accepte la chaîne de caractères de requête octets collecte vos scripts de démarrage ZTP qui sont téléchargés en premier par vos équipements réseau. Plusieurs scripts peuvent être déclarés afin de supporter plusieurs plateformes avec des conditions de démarrages différentes. Tous les scripts sont basés sur du texte (pas de codes binaires) et peuvent définir des valeurs de substitution. configuration configurations données description fichier taille du fichier logiciel logiciels Paramètre obligatoire nom plateforme plateformes chaîne de caractères de requête prioritaire sur les arguments interprétation du modèle modèle substitution des paramètres valeur fabricant fabricants 