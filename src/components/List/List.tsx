import { forwardRef, useImperativeHandle, useState} from "react";
import { useAuth } from "../../hooks/useAuth";

export interface ListItem {
    id: number;
    item: string;
}

export interface ListProps
{
    initialItems: ListItem[];
    onItemAdded?: (item: ListItem) => void;
    onItemDeleted?: (id: number) => void;
}

export interface ListRef
{

}

export const List = forwardRef<ListRef, ListProps>(({initialItems, onItemAdded, onItemDeleted}, ref) =>
{
    const [items, setItems] = useState<ListItem[]>(initialItems);
    const [inputText, setInputText] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const { token } = useAuth();

    useImperativeHandle(ref, () => {
        return {

        }
    });

    const handleAddItem = async () => {
        if (!inputText.trim()) return;
        
        setIsAdding(true);
        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ item: inputText })
            });

            if (response.ok) {
                const newItem = await response.json();
                setItems((prev) => [...prev, newItem]);
                setInputText("");
                if (onItemAdded) onItemAdded(newItem);
            } else {
                console.error('Failed to add item');
                alert('Failed to add item');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Error adding item');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteItem = async (id: number) => {
        setDeletingId(id);
        try {
            const response = await fetch(`/api/items/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setItems((prev) => prev.filter(item => item.id !== id));
                if (onItemDeleted) onItemDeleted(id);
            } else {
                console.error('Failed to delete item');
                alert('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        } finally {
            setDeletingId(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isAdding) {
            handleAddItem();
        }
    };

    return (
        <div className="list">
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map((item) => {
                    return (
                        <li key={item.id} className="list-item" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            background: '#f9f9f9',
                            borderRadius: '5px',
                            border: '1px solid #ddd'
                        }}>
                            <span>{item.item}</span>
                            <button 
                                onClick={() => handleDeleteItem(item.id)}
                                disabled={deletingId === item.id}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    opacity: deletingId === item.id ? 0.6 : 1
                                }}
                            >
                                {deletingId === item.id ? 'Deleting...' : 'Delete'}
                            </button>
                        </li>
                    )
                })}
                <li style={{ 
                    display: 'flex', 
                    gap: '0.5rem',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: '#fff',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                }}>
                    <input 
                        type="text" 
                        value={inputText} 
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isAdding}
                        placeholder="Enter new item..."
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '3px',
                            fontSize: '1rem'
                        }}
                    />
                    <button 
                        onClick={handleAddItem}
                        disabled={isAdding || !inputText.trim()}
                        style={{
                            padding: '0.5rem 1.5rem',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            opacity: (isAdding || !inputText.trim()) ? 0.6 : 1
                        }}
                    >
                        {isAdding ? 'Adding...' : 'Add Item'}
                    </button>
                </li>
            </ul>
        </div>
    );
});