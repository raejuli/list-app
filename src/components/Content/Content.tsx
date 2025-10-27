import {useEffect, useState} from "react";
import {List, ListItem} from "../List";
import {useAuth} from "../../hooks/useAuth";

export function Content() {
    const [listData, setListData] = useState<ListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token, user, logout } = useAuth();

    useEffect(() => {
        if (token) {
            setIsLoading(true);
            fetch(`https://listapi.${window.location.hostname.split('.')[1]}/api/items`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((r) =>
            {
                if (r.ok) {
                    r.json().then((v) => {
                        setListData(v);
                        setIsLoading(false);
                    });
                } else {
                    console.error('Failed to fetch items');
                    setIsLoading(false);
                }
            }).catch(error => {
                console.error('Error fetching items:', error);
                setIsLoading(false);
            });
        }
    }, [token]);

    return (
        <div>
            <div style={{
                padding: '1rem',
                background: '#f5f5f5',
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <span>Welcome, <strong>{user?.username}</strong>!</span>
                </div>
                <button 
                    onClick={logout}
                    style={{
                        padding: '0.5rem 1rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>
            <div style={{ padding: '1rem' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading items...</div>
                ) : (
                    <List 
                        initialItems={listData}
                        onItemAdded={(item) => console.log('Item added:', item)}
                        onItemDeleted={(id) => console.log('Item deleted:', id)}
                    />
                )}
            </div>
        </div>
    );
}