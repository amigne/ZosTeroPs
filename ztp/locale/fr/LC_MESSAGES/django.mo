��    W      �      �      �  �   �  �    E   �  z   �  e   w  l   �     J	     \	     b	     v	  #   �	     �	     �	     �	     �	     �	     �	     
     
     
     '
  
   .
     9
     @
     L
     T
     a
     f
  	   k
     u
  	   ~
     �
     �
     �
     �
     �
     �
     �
     �
     �
     �
     �
  
   �
     �
  	   �
  $   �
          %     5     A  �   J  9   �          "     1     >     D     K     S     \     e  
   q     |  L   �     �     �  T  �     D     R     a     f     r     ~     �     �  	   �     �     �  	   �  $   �     �     �     �          
       �    W   �  n    #   r  H   �  -   �  o        }     �  -   �     �  7   �          "     A     [     w     �  	   �     �  	   �     �     �  	   �     �     �               '     /     A  	   P     Z     b  	   e  	   o     y     �     �     �     �     �     �     �  
   �  
   �  @   �     )     ?     Z     t  �   |  ?        ]     j     �     �  	   �  	   �  	   �  
   �     �  
   �     �  X   �  -   F     t  ^  {     �     �     �                     #     5  	   >     H  
   L     W  @   c     �     �     �     �  	   �  
   �   
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
             (not implemented) About Accept query string Add Parameter Are you sure you want to delete it? Author: Can list config Can list firmware Can list platform Can list vendor Can list ztp script Change: Configurations Confirm Create Currently: Delete Description Details Download URL Edit File File size Filename Firmwares Home ID License: Login Logout Logs MD5 hash MIT License Name New Options Parameters Platform Platforms Priority query string over arguments Remove Parameter Render template SHA512 hash Template The system contains different parts that permit to customize the process depending
            on the vendor and the platform of your network devices. There must not be multiple parameters with the same name. Update Use parameters User Profile Value Vendor Vendors Version: Website: ZTP Scripts ZTP script ZTP scripts ZosTeroPs manages the ZTP (Zero Touch Provisioning) of your network devices. accept_query_string bytes collects your ZTP bootstrap scripts that are
                    first downloaded by the network devices. Multiple scripts can be defined
                    to support multiple platforms with different bootstrap conditions. All
                    scripts are text-based (not binary) that can define variable substitution.
                 configuration configurations data description development file filesize firmware firmwares name platform platforms priority query string over arguments render template template use parameters value vendor vendors Project-Id-Version: PACKAGE VERSION
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2021-02-18 18:42+0100
PO-Revision-Date: 2021-02-18 18:45+0000
Last-Translator: b'  <yann@gauteron.me>'
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
Vous êtes sur le point de supprimer l'élément suivant : %(object_description)s <strong>%(object)s</strong>. (pas implémenté) À propos... Accepte la chaîne de caractères de requête Ajouter un paramètre Êtes-vous certain de vouloir supprimer cet élément ? Auteur : Peut lister les configurations Peut lister les logiciels Peut lister les plateformes Peut lister les fabricants Peut lister les scripts ZTP Changer : Configurations Confirmer Créer Actuellement : Supprimer Description Détails URL de téléchargement Édition Fichier Taille du fichier Nom de fichier Logiciels Accueil ID Licence : Connexion Déconnexion Journaux somme de contrôle MD5 MIT License Nom Nouveau Options Paramètres Plateforme Plateforme Chaîne de caractères de requête prioritaire sur les arguments Retirer un paramètre Interprétation du modèle somme de contrôle SHA512 Modèle Le système possède différentes parties qui permettent de personnaliser le processus en fonction du fabricant et de la plateforme de vos équipements réseau. Il ne peut pas y avoir plusieurs paramètres avec le même nom. Mise à jour Substitution des paramètres Profil utilisateur Valeur Fabricant Fabricant Version : Site web : Scripts ZTP Script ZTP Scripts ZTP ZosTeroPs gère le mécanisme ZTP (Zero Touch Provisioning) de vos équipements réseau. accepte la chaîne de caractères de requête octets collecte vos scripts de démarrage ZTP qui sont téléchargés en premier par vos équipements réseau. Plusieurs scripts peuvent être déclarés afin de supporter plusieurs plateformes avec des conditions de démarrages différentes. Tous les scripts sont basés sur du texte (pas de codes binaires) et peuvent définir des valeurs de substitution. configuration configurations données description développement fichier taille du fichier logiciel logiciels nom plateforme plateformes chaîne de caractères de requête prioritaire sur les arguments interprétation du modèle modèle substitution des paramètres valeur fabricant fabricants 