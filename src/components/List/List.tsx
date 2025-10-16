import { forwardRef, useImperativeHandle, useState} from "react";

export interface ListProps
{
    initialItems: string[];
}

export interface ListRef
{

}

export const List = forwardRef<ListRef, ListProps>(({initialItems}, ref) =>
{
    const [items, setItems] = useState(initialItems);
    const [inputText, setInputText] = useState("");

    useImperativeHandle(ref, () => {
        return {

        }
    });

    return (
        <div className="list">
            <ul>
                {items.map((item, index) => {
                    return (
                        <li key={index} className="list-item">{item}</li>
                    )
                })}
                <li>
                    <input type="text" value={inputText} onChange={(e) =>
                    {
                        setInputText(e.target.value);
                    }}/>
                    <button onClick={() =>
                    {
                        setItems((prev) => {
                            return [...prev, inputText];
                        });
                        setInputText("");
                    }}>Add Item</button>
                </li>
            </ul>
        </div>
    );
});