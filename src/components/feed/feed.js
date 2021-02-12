import React, {useEffect} from 'react';
import {db} from "../../api/firebase";
import Model from "../models/model"



function Feed(props) {

    const [models, setModels] = React.useState([]);

    useEffect(() => {

        db.collection("models").where('responseID', "!=", "0")
            .onSnapshot((querySnapshot) => {
                let models = [];
                querySnapshot.forEach((doc) => {
                    models.push(doc.data());
                });
                setModels(models)
            });

    }, []);


    return (
        <div>
            {
                models.map((item) => <Model header = {item.header} body = {item.body} img = {item.img} />

                )
            }

        </div>
    );
}

export default Feed;
