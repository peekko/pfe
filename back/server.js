const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require ("dotenv").config();

app.use(cors());

const db = pgp({
  user: 'postgres',
  password: '0000',
  host: 'localhost',
  port: 5432,
  database: 'production_management_db',
});

const Queries = require('./Queries');
const queriesInstance = Queries.init(db);

db.connect()
  .then(obj => {
    obj.done();
    console.log('Connecté à PostgreSQL');
  })
  .catch(error => {
    console.error('Erreur de connection à PostgreSQL:', error);
  });


//token
const jwtSecret = process.env.JWT_SECRET;

// utilisateurs table
//user register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { nom_utilisateur, mot_de_passe, email, role } = req.body;
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const newUtilisateur = await queriesInstance.createUtilisateur({
      nom_utilisateur,
      mot_de_passe: hashedPassword,
      email,
      role
    });
    res.json(newUtilisateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// user login endpoint 
app.post('/api/login', async (req, res) => {
  const { nom_utilisateur, mot_de_passe } = req.body;

  try {
    // Retrieve etudiant from the database based on username
    const utilisateur = await db.oneOrNone('SELECT * FROM utilisateurs WHERE nom_utilisateur = $1', [nom_utilisateur]);

    // Checking
    if (!utilisateur || !bcrypt.compareSync(mot_de_passe, utilisateur.mot_de_passe)) {
      return res.status(401).json({ message: 'Utilisateur invalide ' });
    }

    // generate a JWT token
    const token = jwt.sign({ utilisateurId: utilisateur.id, nom_utilisateur: utilisateur.nom_utilisateur }, jwtSecret, { expiresIn: '1h' });

    
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//get req
app.get('/api/utilisateur', async (req, res) => {
  try {
    const allUtilisateurs = await queriesInstance.getAllUtilisateurs();
    res.json(allUtilisateurs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/utilisateur/:id', async (req, res) => {
  try {
    const utilisateurId = req.params.id;
    const utilisateur = await queriesInstance.getUtilisateurById(utilisateurId);
    if (utilisateur) {
      res.json(utilisateur);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.put('/api/utilisateur/:id', async (req, res) => {
  try {
    const utilisateurId = req.params.id;
    const updatedUtilisateur = await queriesInstance.updateUtilisateurById(utilisateurId, req.body);
    res.json(updatedUtilisateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/utilisateur/:id', async (req, res) => {
  try {
    const utilisateurId = req.params.id;
    await queriesInstance.deleteUtilisateurById(utilisateurId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//  collaboration table
app.post('/api/transaction', async (req, res) => {
  try {
    const newTransaction = await queriesInstance.createTransaction(req.body);
    res.json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/transaction', async (req, res) => {
  try {
    const allTransactions = await queriesInstance.getAllTransactions();
    res.json(allTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/transaction/:id', async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await queriesInstance.getTransactionById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non disponible' });
    }
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.put('/api/transaction/:id', async (req, res) => {
  try {
    const transactionId = req.params.id;
    const updatedTransaction = await queriesInstance.updateTransactionById(transactionId, req.body);
    res.json(updatedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/transaction/:id', async (req, res) => {
  try {
    const transactionId = req.params.id;
    await queriesInstance.deleteTransactionById(transactionId);
    res.json({ message: 'Transaction supprimée avec succés' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//  taches table
app.post('/api/tache', async (req, res) => {
  try {
    const newTache = await queriesInstance.createTache(req.body);
    res.json(newTache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/tache', async (req, res) => {
  try {
    const allTaches = await queriesInstance.getAllTaches();
    res.json(allTaches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/tache/:id', async (req, res) => {
  try {
    const tacheId = req.params.id;
    const tache = await queriesInstance.getTacheById(tacheId);
    if (!tache) {
      return res.status(404).json({ message: 'Tâche non disponible' });
    }
    res.json(tache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/tache/:id', async (req, res) => {
  try {
    const tacheId = req.params.id;
    const updatedTache = await queriesInstance.updateTacheById(tacheId, req.body);
    res.json(updatedTache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/tache/:id', async (req, res) => {
  try {
    const tacheId = req.params.id;
    await queriesInstance.deleteTacheById(tacheId);
    res.json({ message: 'Tâche supprimée avec succés' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// tableaux_de_bord table
app.post('/api/tableaudebord', async (req, res) => {
  try {
    const newTableauDeBord = await queriesInstance.createTableauDeBord(req.body);
    res.json(newTableauDeBord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/tableaudebord', async (req, res) => {
  try {
    const allTableauxDeBord = await queriesInstance.getAllTableauxDeBord();
    res.json(allTableauxDeBord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/tableaudebord/:id', async (req, res) => {
  try {
    const tableauDeBordId = req.params.id;
    const tableauDeBord = await queriesInstance.getTableauDeBordById(tableauDeBordId);
    if (!tableauDeBord) {
      return res.status(404).json({ message: 'Tableau de Bord non disponible' });
    }
    res.json(tableauDeBord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/tableaudebord/:id', async (req, res) => {
  try {
    const tableauDeBordId = req.params.id;
    const updatedTableauDeBord = await queriesInstance.updateTableauDeBordById(tableauDeBordId, req.body);
    res.json(updatedTableauDeBord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/tableaudebord/:id', async (req, res) => {
  try {
    const tableauDeBordId = req.params.id;
    await queriesInstance.deleteTableauDeBordById(tableauDeBordId);
    res.json({ message: 'Tableauc de Bord supprimé avec succés' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// projets table
app.post('/api/projet', async (req, res) => {
  try {
    const newProjet = await queriesInstance.createProjet(req.body);
    res.json(newProjet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/projet', async (req, res) => {
  try {
    const allProjets = await queriesInstance.getAllProjets();
    res.json(allProjets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/projet/:id', async (req, res) => {
  try {
    const projetId = req.params.id;
    const projet = await queriesInstance.getProjetById(projetId);
    if (!projet) {
      return res.status(404).json({ message: 'Projet non disponible' });
    }
    res.json(projet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/projet/:id', async (req, res) => {
  try {
    const projetId = req.params.id;
    const updatedProjet = await queriesInstance.updateProjetById(projetId, req.body);
    res.json(updatedProjet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/projet/:id', async (req, res) => {
  try {
    const projetId = req.params.id;
    await queriesInstance.deleteProjetById(projetId);
    res.json({ message: 'Projet supprimé avec succés' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// notifications table
app.post('/api/notification', async (req, res) => {
  try {
    const newNotification= await queriesInstance.createNotification(req.body);
    res.json(newNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/notification', async (req, res) => {
  try {
    const allNotifications = await queriesInstance.getAllNotifications();
    res.json(allNotifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/notification/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await queriesInstance.getNotificationById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/notification/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const updatedNotification = await queriesInstance.updateNotificationById(notificationId, req.body);
    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/notification/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    await queriesInstance.deleteNotificationById(notificationId);
    res.json({ message: 'Notification supprimée avec succés' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




//  membres_equipes table
app.post('/api/membreequipe', async (req, res) => {
  try {
    const newMembreEquipe = await queriesInstance.createMembreEquipe(req.body);
    res.json(newMembreEquipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/membreequipe', async (req, res) => {
  try {
    const getAllMembresEquipes = await queriesInstance.getAllMembresEquipes();
    res.json(getAllMembresEquipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/membreequipe/:id', async (req, res) => {
  try {
    const membreId = req.params.id;
    const membre = await queriesInstance.getMembreEquipeById(membreId);
    if (!membre) {
      return res.status(404).json({ message: 'Membre non trouvé ' });
    }
    res.json(membre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/membreequipe/:id', async (req, res) => {
  try {
    const membreId = req.params.id;
    const updatedMembreEquipe = await queriesInstance.updateMembreEquipeById(membreId, req.body);
    res.json(updatedMembreEquipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/membreequipe/:id', async (req, res) => {
  try {
    const membreId = req.params.id;
    await queriesInstance.deleteMembreEquipeById(membreId);
    res.json({ message: 'Membre supprimé avec succés' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// equipes table
app.post('/api/equipe', async (req, res) => {
  try {
    const newEquipe = await queriesInstance.createEquipe(req.body);
    res.json(newEquipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/equipe', async (req, res) => {
  try {
    const allEquipes = await queriesInstance.getAllEquipes();
    res.json(allEquipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/equipe/:id', async (req, res) => {
  try {
    const equipeId = req.params.id;
    const equipe = await queriesInstance.getEquipeById(equipeId);
    if (!equipe) {
      return res.status(404).json({ message: 'Equipe non trouvée' });
    }
    res.json(equipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/equipe/:id', async (req, res) => {
  try {
    const equipeId = req.params.id;
    const updatedEquipe = await queriesInstance.updateEquipeById(equipeId, req.body);
    res.json(updatedEquipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/equipe/:id', async (req, res) => {
  try {
    const equipeId = req.params.id;
    await queriesInstance.deleteEquipeById(equipeId);
    res.json({ message: 'Equipe supprimée avec succés' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//referentiels table 
// CRUD operations for referentiels table
app.post('/api/referentiel', async (req, res) => {
  try {
    const newReferentiel = await queriesInstance.createReferentiel(req.body);
    res.json(newReferentiel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/referentiel', async (req, res) => {
  try {
    const allReferentiels = await queriesInstance.getAllReferentiels();
    res.json(allReferentiels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/referentiel/:id', async (req, res) => {
  try {
    const referentielId = req.params.id;
    const referentiel = await queriesInstance.getReferentielById(referentielId);
    if (!referentiel) {
      return res.status(404).json({ message: 'Referentiel non trouvé' });
    }
    res.json(referentiel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/referentiel/:id', async (req, res) => {
  try {
    const referentielId = req.params.id;
    const updatedReferentiel = await queriesInstance.updateReferentielById(referentielId, req.body);
    res.json(updatedReferentiel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/referentiel/:id', async (req, res) => {
  try {
    const referentielId = req.params.id;
    await queriesInstance.deleteReferentielById(referentielId);
    res.json({ message: 'Referentiel supprimé avec succés' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});