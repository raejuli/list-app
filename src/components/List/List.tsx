import { forwardRef, useImperativeHandle } from "react";

export interface ListProps
{
    items: string[];
}

export interface ListRef
{

}

export const List = forwardRef<ListRef, ListProps>(({items}, ref) => {

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
            </ul>
        </div>
    );
});