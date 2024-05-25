const init = (db) => {
  const queriesDb = db;

  // CRUD operations for utilisateurs table
  const createUtilisateur = async (utilisateurData) => {
    const { nom_utilisateur, mot_de_passe, email, role} = utilisateurData;
    const result = await queriesDb.query(
      'INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [nom_utilisateur, mot_de_passe, email, role]
    );
    return result;
  };

  const getAllUtilisateurs = async () => {
    const result = await queriesDb.query('SELECT * FROM utilisateurs');
    return result;
  };

  const getUtilisateurById = async (utilisateurId) => {
    const result = await queriesDb.query('SELECT * FROM utilisateurs WHERE utilisateur_id = $1', [utilisateurId]);
    return result[0];
  };

  const updateUtilisateurById = async (utilisateurId, utilisateurData) => {
    const { nom_utilisateur, mot_de_passe, email,role } = utilisateurData;
    const result = await queriesDb.query(
      'UPDATE utilisateurs SET nom_utilisateur = $1, mot_de_passe = $2, email = $3, role = $4 WHERE utilisateur_id = $5 RETURNING *',
      [nom_utilisateur, mot_de_passe, email, role, utilisateurId]
    );
    return result[0];
  };

  const deleteUtilisateurById = async (utilisateurId) => {
    await queriesDb.query('DELETE FROM utilisateurs WHERE utilisateur_id = $1', [utilisateurId]);
  };

  // transactions table
  const createTransaction = async (transactionData) => {
    const { utilisateur_id, montant, date_transaction, description } = transactionData;
    const result = await queriesDb.query(
      'INSERT INTO transactions (utilisateur_id, montant, date_transaction, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [utilisateur_id, montant, date_transaction, description]
    );
    return result[0];
  };

  const getAllTransactions = async () => {
    const result = await queriesDb.query('SELECT * FROM transactions');
    return result;
  };

  const getTransactionById = async (transactionId) => {
    const result = await queriesDb.query('SELECT * FROM transactions WHERE transaction_id = $1', [transactionId]);
    return result[0];
  };

  const updateTransactionById = async (transactionId, transactionData) => {
    const { utilisateur_id, montant, date_transaction, description } = transactionData;
    const result = await queriesDb.query(
      'UPDATE transactions SET utilisateur_id = $1, montant = $2, date_transaction = $3, description = $4 WHERE transaction_id = $5 RETURNING *',
      [utilisateur_id, montant, date_transaction, description, transactionId]
    );
    return result[0];
  };

  const deleteTransactionById = async (transactionId) => {
    await queriesDb.query('DELETE FROM transactions WHERE transaction_id = $1', [transactionId]);
  };

  // CRUD operations pour la table taches
  const createTache = async (tacheData) => {
    const { projet_id, assigne_a, description, date_debut, date_fin, statut } = tacheData;
    const result = await queriesDb.query(
      'INSERT INTO taches (projet_id, assigne_a, description, date_debut, date_fin, statut) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *',
      [projet_id, assigne_a, description, date_debut, date_fin, statut]
    );
    return result;
  };

  const getAllTaches = async () => {
    const result = await queriesDb.query('SELECT * FROM taches');
    return result;
  };

  const getTacheById = async (tacheId) => {
    const result = await queriesDb.query('SELECT * FROM taches WHERE tache_id = $1', [tacheId]);
    return result[0];
  };

  const updateTacheById = async (tacheId, tacheData) => {
    const { projet_id, assigne_a, description, date_debut, date_fin, statut } = tacheData;
    const result = await queriesDb.query(
      'UPDATE taches SET projet_id = $1, assigne_a = $2, description = $3, date_debut = $4,date_fin=$5,statut=$6 WHERE tache_id = $7 RETURNING *',
      [projet_id, assigne_a, description, date_debut, date_fin, statut, tacheId]
    );
    return result[0];
  };

  const deleteTacheById = async (tacheId) => {
    await queriesDb.query('DELETE FROM taches WHERE tache_id = $1', [tacheId]);
  };

  // CRUD operations pour la table tableaux_de_bord
  const createTableauDeBord = async (tableaudeBordData) => {
    const { utilisateur_id, donnees  } =  tableaudeBordData;
    const result = await queriesDb.query(
      'INSERT INTO tableaux_de_bord (utilisateur_id, donnees) VALUES ($1, $2) RETURNING *',
      [utilisateur_id, donnees ]
    );
    return result;
  };

  const getAllTableauxDeBord = async () => {
    const result = await queriesDb.query('SELECT * FROM tableaux_de_bord');
    return result;
  };

  const getTableauDeBordById = async (tableauDeBordId) => {
    const result = await queriesDb.query('SELECT * FROM tableaux_de_bord WHERE tableau_de_bord_id = $1', [tableauDeBordId]);
    return result[0];
  };

  const updateTableauDeBordById = async (tableauDeBordId, tableaudeBordData) => {
    const { utilisateur_id, donnees } = tableaudeBordData;
    const result = await queriesDb.query(
      'UPDATE tableaux_de_bord SET utilisateur_id = $1, donnees = $2, mis_a_jour_a = CURRENT_TIMESTAMP WHERE tableau_de_bord_id = $3 RETURNING *',
      [utilisateur_id, donnees, tableauDeBordId]
    );
    return result[0];
  };

  const deleteTableauDeBordById = async (tableauDeBordId) => {
    await queriesDb.query('DELETE FROM tableaux_de_bord WHERE tableau_de_bord_id = $1', [tableauDeBordId]);
  };

  // CRUD operations table projets
  const createProjet = async (projetData) => {
    const { nom, description, date_debut, date_fin, statut } = projetData;
    const result = await queriesDb.query(
      'INSERT INTO projets (nom, description, date_debut, date_fin, statut) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nom, description, date_debut, date_fin, statut]
    );
    return result;
  };

  const getAllProjets= async () => {
    const result = await queriesDb.query('SELECT * FROM projets');
    return result;
  };

  const getProjetById = async (projetId) => {
    const result = await queriesDb.query('SELECT * FROM projets WHERE projet_id = $1', [projetId]);
    return result[0];
  };

  const updateProjetById = async (projetId, projetData) => {
    const { nom, description, date_debut, date_fin, statut } = projetData;
    const result = await queriesDb.query(
      'UPDATE projets SET nom = $1, description = $2, date_debut = $3, date_fin = $4, statut = $5 WHERE projet_id = $6 RETURNING *',
      [nom, description, date_debut, date_fin, statut, projetId]
    );
    return result[0];
  };

  const deleteProjetById = async (projetId) => {
    await queriesDb.query('DELETE FROM projets WHERE projet_id = $1', [projetId]);
  };

  
// CRUD operations table notifications
const createNotification = async (notificationData) => {
  const { utilisateur_id, message, lu } = notificationData;
  const result = await queriesDb.query(
    'INSERT INTO notifications (utilisateur_id, message, lu) VALUES ($1, $2, $3) RETURNING *',
    [utilisateur_id, message, lu]
  );
  return result;
};

const getAllNotifications = async () => {
  const result = await queriesDb.query('SELECT * FROM notifications');
  return result;
};

const getNotificationById = async (notificationId) => {
  const result = await queriesDb.query('SELECT * FROM notifications WHERE notification_id = $1', [notificationId]);
  return result[0];
};

const updateNotificationById = async (notificationId, notificationData) => {
  const { utilisateur_id, message, lu } = notificationData;
  const result = await queriesDb.query(
    'UPDATE notifications SET utilisateur_id = $1, message = $2, lu = $3, mis_a_jour_a = CURRENT_TIMESTAMP WHERE notification_id = $4 RETURNING *',
    [utilisateur_id, message, lu, notificationId]
  );
  return result[0];
};

const deleteNotificationById = async (notificationId) => {
  await queriesDb.query('DELETE FROM notifications WHERE notification_id = $1', [notificationId]);
};

// CRUD operations table membres_equipes
const createMembreEquipe = async (membreData) => {
  const { equipe_id, utilisateur_id, role_dans_equipe } = membreData;
  const result = await queriesDb.query(
    'INSERT INTO membres_equipes (equipe_id, utilisateur_id, role_dans_equipe) VALUES ($1, $2, $3) RETURNING *',
    [equipe_id, utilisateur_id, role_dans_equipe]
  );
  return result;
};

const getAllMembresEquipes = async () => {
  const result = await queriesDb.query('SELECT * FROM membres_equipes');
  return result;
};

const getMembreEquipeById = async (membreId) => {
  const result = await queriesDb.query('SELECT * FROM membres_equipes WHERE membre_id = $1', [membreId]);
  return result[0];
};

const updateMembreEquipeById = async (membreId, membreData) => {
  const { equipe_id, utilisateur_id, role_dans_equipe } = membreData;
  const result = await queriesDb.query(
    'UPDATE membres_equipes SET equipe_id = $1, utilisateur_id = $2, role_dans_equipe = $3, mis_a_jour_a = CURRENT_TIMESTAMP WHERE membre_id = $4 RETURNING *',
    [equipe_id, utilisateur_id, role_dans_equipe, membreId]
  );
  return result[0];
};

const deleteMembreEquipeById = async (membreId) => {
  await queriesDb.query('DELETE FROM membres_equipes WHERE membre_id = $1', [membreId]);
};


// CRUD operations table equipes
const createEquipe = async (equipeData) => {
  const { nom } = equipeData;
  const result = await queriesDb.query(
    'INSERT INTO equipes (nom) VALUES ($1) RETURNING *',
    [nom]
  );
  return result;
};

const getAllEquipes = async () => {
  const result = await queriesDb.query('SELECT * FROM equipes');
  return result;
};

const getEquipeById = async (equipeId) => {
  const result = await queriesDb.query('SELECT * FROM equipes WHERE equipe_id = $1', [equipeId]);
  return result[0];
};

const updateEquipeById = async (equipeId, equipeData) => {
  const { nom  } = equipeData;
  const result = await queriesDb.query(
    'UPDATE equipes SET nom = $1 WHERE equipe_id = $2 RETURNING *',
    [nom, equipeId]
  );
  return result[0];
};

const deleteEquipeById = async (equipeId) => {
  await queriesDb.query('DELETE FROM equipes WHERE equipe_id = $1', [equipeId]);
};

// CRUD operations table referentiels
const createReferentiel = async (referentielData) => {
  const { code_specialite, libelle_arabe, libelle_francais, secteur, sous_secteur, type } = referentielData;
  const result = await queriesDb.query(
    'INSERT INTO referentiels (code_specialite, libelle_arabe, libelle_francais, secteur, sous_secteur, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [code_specialite, libelle_arabe, libelle_francais, secteur, sous_secteur, type]
  );
  return result;
};

const getAllReferentiels = async () => {
  const result = await queriesDb.query('SELECT * FROM referentiels');
  return result;
};

const getReferentielById = async (referentielId) => {
  const result = await queriesDb.query('SELECT * FROM referentiels WHERE id = $1', [referentielId]);
  return result[0];
};

const updateReferentielById = async (referentielId, referentielData) => {
  const { code_specialite, libelle_arabe, libelle_francais, secteur, sous_secteur, type } = referentielData;
  const result = await queriesDb.query(
    'UPDATE referentiels SET code_specialite = $1, libelle_arabe = $2, libelle_francais = $3, secteur = $4, sous_secteur = $5, type = $6 WHERE id = $7 RETURNING *',
    [code_specialite, libelle_arabe, libelle_francais, secteur, sous_secteur, type, referentielId]
  );
  return result[0];
};

const deleteReferentielById = async (referentielId) => {
  await queriesDb.query('DELETE FROM referentiels WHERE id = $1', [referentielId]);
};



  return {
    createUtilisateur,
    getAllUtilisateurs,
    getUtilisateurById,
    updateUtilisateurById,
    deleteUtilisateurById,
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransactionById,
    deleteTransactionById,
    createTache,
    getAllTaches,
    getTacheById,
    updateTacheById,
    deleteTacheById,
    createTableauDeBord,
    getAllTableauxDeBord,
    getTableauDeBordById,
    updateTableauDeBordById,
    deleteTableauDeBordById,
    createProjet,
    getAllProjets,
    getProjetById,
    updateProjetById,
    deleteProjetById,
    createNotification,
    getAllNotifications,
    getNotificationById,
    updateNotificationById,
    deleteNotificationById,
    createMembreEquipe,
    getAllMembresEquipes,
    getMembreEquipeById,
    updateMembreEquipeById,
    deleteMembreEquipeById,
    createEquipe,
    getAllEquipes,
    getEquipeById,
    updateEquipeById,
    deleteEquipeById,
    createReferentiel,
    getAllReferentiels,
    getReferentielById,
    updateReferentielById,
    deleteReferentielById,

  };
};

module.exports = { init };