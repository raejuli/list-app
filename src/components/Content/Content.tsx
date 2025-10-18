import {useEffect, useState} from "react";
import {List} from "../List";

export function Content() {
    const [listData, setListData] = useState();

    useEffect(() => {
        fetch("/api/items").then((r) =>
        {
            r.json().then((v) => {
                setListData(v);
            });
        });
    }, []);

    return (
        <div>
            {listData && <List initialItems={listData}/>}
        </div>
    );
}