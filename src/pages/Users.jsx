import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService.js";
import AdminLayout from "../components/AdminLayout.jsx";

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { fetchUsers() }, []); // Un seul appel au montage du composant

    // Call à l'API 
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs');
        } finally {
            setLoading(false);
        }
    }

    // ici il y a un handleDeleteUser qui va appeler le service de suppression d'utilisateur et mettre à jour la liste des users

    // Render conditionnel 
    if (loading) return <AdminLayout><div>Chargement...</div></AdminLayout>;
    if (error) return <AdminLayout><div style={{ color: 'red' }}>{error}</div></AdminLayout>;


    return (

        <AdminLayout>

            <h2>Utilisateurs</h2>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button
                    style={styles.btn}
                    onClick={() => navigate('/admin/users/create')}
                >+ Nouvel utilisateur
                </button>
                <button
                    style={{ ...styles.btn, backgroundColor: '#3498db' }}
                    onClick={fetchUsers}
                >🔄 Rafraîchir
                </button>
            </div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Statut</th>
                        <th>Création</th>
                        <th>Mise à jour</th>
                        <th>Suppression</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.idUser}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.isActive ? 'Actif' : 'Désactivé'}</td>
                            <td>{user.createdAt}</td>
                            <td>{user.updatedAt}</td>
                            <td>{user.deletedAt}</td>
                            <td>
                                <button
                                    style={styles.btn}
                                    onClick={() => navigate(`/admin/users/${user.idUser}`)}
                                > Voir
                                </button>
                                <button
                                    style={styles.btn}
                                    onClick={() => navigate(`/admin/users/${user.idUser}/edit`)}
                                > Modifier
                                </button>
                                <button style={styles.btn}>Désactiver</button>
                                <button style={styles.btn}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>


    )
}

const styles = {
    container: {
        maxWidth: '1000px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    btn: {
        backgroundColor: '#27ae60',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    btnSmall: {
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '5px',
        fontSize: '12px',
    },
    actions: {
        display: 'flex',
        gap: '5px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
};


export default Users;