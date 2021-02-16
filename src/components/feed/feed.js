import React, {useEffect} from 'react';
import {db} from "../../api/firebase";
import Model from "../models/model"
import {makeStyles} from "@material-ui/core";



function Feed(props) {

    const classes = useStyles();
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
        <div className={classes.root}>
            {
                models.map((item) => <Model header = {item.header} body = {item.body} img = {item.img} />

                )
            }

        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    box: {
        color: "white"
    },
    textField: {
        disableUnderline: true,
        color: 'white',

    }
}));

export default Feed;
